#!/usr/bin/env python3
"""
generate_regression_corpus.py

README'de "tools/regression_corpus.json — 508 vakalık test seti" diye
belgelenmiş ama repo'da hiç var olmayan (build_regression_corpus.mjs de
yok) bir dosyayı gerçekten üretiyoruz. Amaç: v1/v2/v3 mimari kararlarını
almak için ÜÇ kez kullandığımız nlp_test_dataset.json'dan TAMAMEN BAĞIMSIZ,
hiç bakılmamış bir doğrulama seti.

generate_training_corpus.py'nin kanıtlanmış altyapısını (throttling,
rate-limit dayanıklılığı, boş-yanıt tekrar deneme, checkpoint) aynen
kullanır — sadece iki farkla:
  1. Çıktı dosyası ayrı: tools/regression_corpus.json,
     "purpose": "regression_eval" etiketiyle işaretli.
  2. Sızıntı kontrolü İKİ dosyaya karşı yapılır: hem nlp_test_dataset.json
     (eski eval seti) hem nlp_training_dataset.json (eğitim seti) —
     bu set üçüyle de örtüşmeyen, gerçekten taze bir doğrulama olmalı.

Varsayılan: semptom başına 3 pozitif + 1 negasyon = 142*4 = 568 vaka
(README'deki "508"e yakın ölçek, tam sayıyı yeniden üretmeye çalışmıyoruz
çünkü orijinal üretim script'i/verisi hiç mevcut değildi).

Kullanım:
    $env:GEMINI_API_KEY = "..."
    python tools/generate_regression_corpus.py --positive-count 3 --negation-count 1

    # Eksik/boş dönen tek bir semptomu düzeltmek için:
    python tools/generate_regression_corpus.py --only <symptomId> --positive-count 3
"""

import argparse
import json
import os
import random
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import nlp_accuracy_test as base

EVAL_DATASET_PATH = Path(__file__).parent / "nlp_test_dataset.json"
TRAINING_DATASET_PATH = Path(__file__).parent / "nlp_training_dataset.json"
OUTPUT_PATH = Path(__file__).parent / "regression_corpus.json"
CHECKPOINT_PATH = Path(__file__).parent / ".regression_corpus_checkpoint.json"

MIN_SECONDS_BETWEEN_CALLS = 6.5
_last_call_time = [0.0]


def throttled_generate(
    generator, symptom, positive_count, negation_count, max_retries=6
):
    for retry in range(1, max_retries + 1):
        elapsed = time.time() - _last_call_time[0]
        wait = MIN_SECONDS_BETWEEN_CALLS - elapsed
        if wait > 0:
            time.sleep(wait)
        _last_call_time[0] = time.time()

        try:
            payload = generator.generate_case_set(
                symptom, positive_count, negation_count
            )
        except SystemExit:
            cooldown = 65
            print(
                f"  Rate limit / API hatası — {cooldown}s bekleniyor "
                f"(deneme {retry}/{max_retries})...",
                file=sys.stderr,
            )
            time.sleep(cooldown)
            continue

        positive_examples = payload.get("positive_examples") or []
        if positive_count > 0 and len(positive_examples) == 0:
            print(
                f"  UYARI: {symptom['id']} için pozitif liste boş döndü, "
                f"tekrar deneniyor (deneme {retry}/{max_retries})...",
                file=sys.stderr,
            )
            time.sleep(5)
            continue

        return payload

    print(
        f"HATA: {symptom['id']} için {max_retries} denemeden sonra hâlâ başarısız/boş.",
        file=sys.stderr,
    )
    return None


def load_texts(path):
    if not path.exists():
        return set()
    data = json.loads(path.read_text(encoding="utf-8"))
    return {ex["text"].strip() for ex in data.get("examples", [])}


def load_checkpoint():
    if CHECKPOINT_PATH.exists():
        return json.loads(CHECKPOINT_PATH.read_text(encoding="utf-8"))
    return {"done_symptom_ids": [], "generated": []}


def save_checkpoint(state):
    CHECKPOINT_PATH.write_text(
        json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def generate_for_symptom(generator, symptom, positive_count, negation_count):
    payload = throttled_generate(generator, symptom, positive_count, negation_count)
    if payload is None:
        return None
    positive_examples = (payload.get("positive_examples") or [])[:positive_count]
    negation_examples = (payload.get("negation_examples") or [])[:negation_count]
    rows = []
    for text in positive_examples:
        rows.append(
            {
                "symptomId": symptom["id"],
                "symptomLabel": symptom["id"],
                "expectedDepartment": symptom["primaryDepartment"],
                "mode": "positive",
                "expectNoMatch": False,
                "text": text.strip(),
                "lang": "tr",
            }
        )
    for text in negation_examples:
        rows.append(
            {
                "symptomId": symptom["id"],
                "symptomLabel": symptom["id"],
                "expectedDepartment": symptom["primaryDepartment"],
                "mode": "negation",
                "expectNoMatch": True,
                "text": text.strip(),
                "lang": "tr",
            }
        )
    return rows


def run_only_mode(symptom_ids, args):
    if not OUTPUT_PATH.exists():
        print(f"HATA: {OUTPUT_PATH} bulunamadı.", file=sys.stderr)
        sys.exit(1)
    existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
    metadata = base.dump_symptom_metadata()
    by_id = {s["id"]: s for s in metadata["symptoms"]}
    generator = base.GeminiPromptGenerator(api_key=args.api_key, model=args.model)

    targets = [sid.strip() for sid in symptom_ids if sid.strip()]
    unknown = [sid for sid in targets if sid not in by_id]
    if unknown:
        print(f"HATA: bilinmeyen semptom id'leri: {unknown}", file=sys.stderr)
        sys.exit(1)

    new_rows_by_symptom = {}
    for sid in targets:
        print(f"[--only] {sid} yeniden üretiliyor...")
        rows = generate_for_symptom(
            generator, by_id[sid], args.positive_count, args.negation_count
        )
        if rows is None:
            print(f"  {sid} başarısız, korunuyor.", file=sys.stderr)
            continue
        new_rows_by_symptom[sid] = rows

    kept = [
        ex for ex in existing["examples"] if ex["symptomId"] not in new_rows_by_symptom
    ]
    added = [row for rows in new_rows_by_symptom.values() for row in rows]

    forbidden = load_texts(EVAL_DATASET_PATH) | load_texts(TRAINING_DATASET_PATH)
    before = len(added)
    added = [a for a in added if a["text"] not in forbidden]
    if before != len(added):
        print(
            f"UYARI: {before - len(added)} cümle eval/training setleriyle örtüştü ve elendi."
        )

    existing["examples"] = kept + added
    existing["totalExamples"] = len(existing["examples"])
    OUTPUT_PATH.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(
        f"Güncellendi: {len(new_rows_by_symptom)}/{len(targets)} semptom. Yeni toplam: {existing['totalExamples']}"
    )


def main():
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--api-key", default=os.environ.get("GEMINI_API_KEY"))
    parser.add_argument("--model", default="gemini-3.1-flash-lite")
    parser.add_argument("--positive-count", type=int, default=3)
    parser.add_argument("--negation-count", type=int, default=1)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--only", type=str, default=None)
    parser.add_argument(
        "--seed", type=int, default=13
    )  # nlp_test_dataset.json'da 7 kullanılmıştı, farklı tut
    args = parser.parse_args()

    if not args.api_key:
        print(
            "HATA: --api-key verilmedi ve GEMINI_API_KEY ortam değişkeni de yok.",
            file=sys.stderr,
        )
        sys.exit(1)

    if args.only:
        run_only_mode(args.only.split(","), args)
        return

    print("Semptom metadata'sı çekiliyor (node --dump-symptoms)...")
    metadata = base.dump_symptom_metadata()
    symptoms = metadata["symptoms"]
    random.seed(args.seed)
    random.shuffle(symptoms)
    if args.limit:
        symptoms = symptoms[: args.limit]

    print(
        f"Toplam {len(symptoms)} semptom, semptom başına {args.positive_count} pozitif + "
        f"{args.negation_count} negasyon. Beklenen toplam: ~{len(symptoms)*(args.positive_count+args.negation_count)}"
    )

    state = load_checkpoint()
    done_ids = set(state["done_symptom_ids"])
    generated = state["generated"]
    if done_ids:
        print(f"Checkpoint bulundu: {len(done_ids)} semptom zaten tamamlanmış.")

    generator = base.GeminiPromptGenerator(api_key=args.api_key, model=args.model)

    for index, symptom in enumerate(symptoms, start=1):
        if symptom["id"] in done_ids:
            continue
        print(
            f'[{index}/{len(symptoms)}] {symptom["id"]} ({symptom["primaryDepartment"]}) üretiliyor...'
        )
        rows = generate_for_symptom(
            generator, symptom, args.positive_count, args.negation_count
        )
        if rows is None:
            continue
        generated.extend(rows)
        done_ids.add(symptom["id"])
        state["done_symptom_ids"] = list(done_ids)
        state["generated"] = generated
        if index % 10 == 0:
            save_checkpoint(state)
            print(f"  ...ara-kayıt ({len(generated)} örnek)")

    save_checkpoint(state)

    # Sızıntı kontrolü: HEM eval HEM training setine karşı
    forbidden = load_texts(EVAL_DATASET_PATH) | load_texts(TRAINING_DATASET_PATH)
    before = len(generated)
    generated = [g for g in generated if g["text"] not in forbidden]
    leaked = before - len(generated)
    if leaked:
        print(
            f"UYARI: {leaked} cümle eval/training setleriyle birebir aynı çıktı ve elendi."
        )
    else:
        print(
            "Sızıntı kontrolü: eval VE training setleriyle hiç örtüşme yok. Temiz, bağımsız set."
        )

    output = {
        "purpose": "regression_eval",  # ne eval ne training seti — üçüncü, bağımsız doğrulama seti
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "generator": args.model,
        "symptomCount": len(symptoms),
        "totalExamples": len(generated),
        "examples": generated,
    }
    OUTPUT_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\nBitti: {len(generated)} örnek -> {OUTPUT_PATH}")
    print(
        f"({sum(1 for g in generated if g['mode']=='positive')} pozitif, "
        f"{sum(1 for g in generated if g['mode']=='negation')} negasyon)"
    )

    if CHECKPOINT_PATH.exists():
        CHECKPOINT_PATH.unlink()


if __name__ == "__main__":
    main()
