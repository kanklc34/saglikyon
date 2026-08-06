#!/usr/bin/env python3
"""
generate_training_corpus.py

nlp_accuracy_test.py'deki Gemini üretim altyapısını yeniden kullanarak,
embedding fine-tuning için BÜYÜK ÖLÇEKLİ, doğal-dil bir eğitim korpusu
üretir. nlp_test_dataset.json (64 vakalık HELD-OUT değerlendirme seti) ile
KARIŞTIRILMAMASI kritik — bu yüzden:

  1. Varsayılan olarak TÜM 142 semptomu kapsar (eval seti sadece en yüksek
     aciliyetli 16 semptomu kapsıyordu — bilinçli bir kapsam farkı).
  2. Semptom başına birden fazla (varsayılan 6) pozitif örnek üretir —
     eval setinde semptom başına 3'tü.
  3. Üretim bittikten sonra, nlp_test_dataset.json'daki metinlerle TAM
     STRING eşleşmesi olan satırları güvenlik amacıyla otomatik eler ve
     kaç tanesinin elendiğini raporlar (sızıntı kontrolü).
  4. Her N sembolde bir diske ara-kayıt yapar (checkpoint) — 142 API
     çağrısı uzun sürebilir/yarıda kesilebilir, kaldığı yerden devam eder.

Rate limit: Gemini ücretsiz katmanda dakikada 15 istek sınırı var. Bu
script istekler arasına bilinçli bir bekleme koyar ve 429/rate-limit
hatası alırsa çok daha uzun (60s+) bekleyip tekrar dener.

BUG DÜZELTMESİ (bu sürümde): önceki sürüm, Gemini bir semptom için BOŞ
pozitif liste döndürse bile o semptomu "tamamlandı" sayıp checkpoint'e
işliyordu — bu, "mide_ulser" gibi semptomlarda hiç pozitif örnek
üretilmeden sessizce atlanmasına yol açtı. Artık:
  (a) Bir semptomun pozitif listesi boşsa "tamamlandı" sayılmıyor, script
      onu tekrar tekrar (retry mantığıyla) dener.
  (b) --only <id1,id2,...> ile SADECE belirli semptom(lar)ı yeniden
      üretip mevcut çıktı dosyasındaki o semptomlara ait eski kayıtları
      değiştirebilirsiniz — tam yeniden çalıştırmaya gerek kalmadan.

Kullanım:
    # PowerShell (Windows):
    $env:GEMINI_API_KEY = ""
    python tools/generate_training_corpus.py --positive-count 6 --negation-count 1

    # bash/zsh (Linux/macOS):
    export GEMINI_API_KEY=yeni-key-buraya
    python3 tools/generate_training_corpus.py --positive-count 6 --negation-count 1

    # Alternatif (ortam değişkeni yerine doğrudan bayrakla):
    python tools/generate_training_corpus.py --api-key yeni-key-buraya --positive-count 6

    # SADECE eksik/hatalı bir semptomu düzeltmek için (mevcut dosyayı günceller):
    python tools/generate_training_corpus.py --only mide_ulser --positive-count 6

Çıktı: tools/nlp_training_dataset.json (nlp_test_dataset.json ile AYNI şema,
ama üstte "purpose": "training" etiketiyle işaretli — asla eval yerine
kullanılmamalı).
"""

import argparse
import json
import os
import random
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
# nlp_accuracy_test.py'deki hazır, çalışan Gemini üretim sınıfını ve
# node-evaluator köprüsünü doğrudan yeniden kullanıyoruz — mantığı
# kopyalamak yerine import ediyoruz ki iki yerde ayrı ayrı bakım
# gerekmesin ve prompt/parsing davranışı garanti aynı kalsın.
import nlp_accuracy_test as base

REPO_ROOT = Path(__file__).parent.parent
EVAL_DATASET_PATH = Path(__file__).parent / "nlp_test_dataset.json"
OUTPUT_PATH = Path(__file__).parent / "nlp_training_dataset.json"
CHECKPOINT_PATH = Path(__file__).parent / ".training_corpus_checkpoint.json"

# Gemini ücretsiz katmanda dakikada 15 istek (RPM) sınırı var.
# Bunun altında kalmak için istekler arasına bilinçli bir minimum aralık
# koyuyoruz (dakikada 15 yerine ~9 istek = güvenlik payı).
MIN_SECONDS_BETWEEN_CALLS = 6.5
_last_call_time = [0.0]


def throttled_generate(
    generator, symptom, positive_count, negation_count, max_retries=6
):
    """generate_case_set()'i çağırmadan önce hız sınırlar; 429/rate-limit
    hatası alırsa (base sınıfın kendi 3-denemelik kısa backoff'u yetersiz
    kaldığında) çok daha uzun (60s+) bekleyip TEKRAR dener — tüm script'i
    çökertmek yerine. Ayrıca Gemini BOŞ pozitif liste döndürürse (mide_ulser
    vakasında olduğu gibi) bunu da başarısızlık sayıp tekrar dener."""
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
            # BUG DÜZELTMESİ: boş pozitif liste artık sessizce kabul edilmiyor.
            print(
                f"  UYARI: {symptom['id']} için pozitif liste boş döndü, "
                f"tekrar deneniyor (deneme {retry}/{max_retries})...",
                file=sys.stderr,
            )
            time.sleep(5)
            continue

        return payload

    print(
        f"HATA: {symptom['id']} için {max_retries} denemeden sonra hâlâ başarısız/boş. "
        f"Checkpoint kaydedildi, script'i tekrar çalıştırınca kaldığı yerden devam eder.",
        file=sys.stderr,
    )
    return None


def load_eval_texts_for_leak_check():
    if not EVAL_DATASET_PATH.exists():
        return set()
    data = json.loads(EVAL_DATASET_PATH.read_text(encoding="utf-8"))
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
    """Bir semptom için (query, positive/negation) örnek sözlüklerini üretir."""
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
    """--only modu: sadece belirtilen semptom(lar)ı yeniden üretip mevcut
    çıktı dosyasındaki eski kayıtlarının yerine koyar. Tam yeniden
    çalıştırmaya gerek kalmadan tek bir eksik/hatalı semptomu düzeltmek
    için (örn. mide_ulser'de pozitif liste boş dönmüştü)."""
    if not OUTPUT_PATH.exists():
        print(
            f"HATA: {OUTPUT_PATH} bulunamadı — --only sadece mevcut bir "
            f"dosyayı güncellemek için kullanılabilir.",
            file=sys.stderr,
        )
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
            print(
                f"  {sid} başarısız oldu, mevcut kayıtlar korunuyor (değiştirilmedi).",
                file=sys.stderr,
            )
            continue
        new_rows_by_symptom[sid] = rows

    kept = [
        ex for ex in existing["examples"] if ex["symptomId"] not in new_rows_by_symptom
    ]
    added = [row for rows in new_rows_by_symptom.values() for row in rows]

    eval_texts = load_eval_texts_for_leak_check()
    before = len(added)
    added = [a for a in added if a["text"] not in eval_texts]
    if before != len(added):
        print(
            f"UYARI: {before - len(added)} yeni üretilen cümle eval setiyle "
            f"birebir aynı çıktı ve elendi."
        )

    existing["examples"] = kept + added
    existing["totalExamples"] = len(existing["examples"])
    existing["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    OUTPUT_PATH.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(
        f"\nGüncellendi: {len(new_rows_by_symptom)}/{len(targets)} semptom yeniden üretildi."
    )
    print(f"Yeni toplam örnek sayısı: {existing['totalExamples']}")


def main():
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--api-key", default=os.environ.get("GEMINI_API_KEY"))
    parser.add_argument("--model", default="gemini-3.1-flash-lite")
    parser.add_argument(
        "--positive-count",
        type=int,
        default=6,
        help="Semptom başına üretilecek pozitif (doğal şikayet) cümle sayısı",
    )
    parser.add_argument(
        "--negation-count",
        type=int,
        default=1,
        help="Semptom başına üretilecek negasyon cümlesi sayısı (isteğe bağlı, az tutuldu)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Sadece ilk N semptomu işle (test/pilot amaçlı; varsayılan: tüm semptomlar)",
    )
    parser.add_argument(
        "--only",
        type=str,
        default=None,
        help="Virgülle ayrılmış semptom id listesi — SADECE bunları yeniden üretip "
        "mevcut nlp_training_dataset.json'daki ilgili kayıtları değiştirir "
        "(örn. --only mide_ulser veya --only mide_ulser,felc)",
    )
    parser.add_argument("--seed", type=int, default=7)
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
    random.shuffle(
        symptoms
    )  # sıra karışık: checkpoint'ten devam ederken çeşitlilik korunsun
    if args.limit:
        symptoms = symptoms[: args.limit]

    print(
        f"Toplam {len(symptoms)} semptom işlenecek "
        f"(semptom başına {args.positive_count} pozitif + {args.negation_count} negasyon)."
    )

    state = load_checkpoint()
    done_ids = set(state["done_symptom_ids"])
    generated = state["generated"]
    if done_ids:
        print(
            f"Checkpoint bulundu: {len(done_ids)} semptom zaten tamamlanmış, kaldığı yerden devam ediliyor."
        )

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
            # Bu semptom defalarca başarısız oldu — atla, checkpoint'e
            # işlenmedi olarak kaydetme (bir sonraki çalıştırmada tekrar
            # denensin), diğer semptomlarla devam et.
            continue

        generated.extend(rows)
        done_ids.add(symptom["id"])
        state["done_symptom_ids"] = list(done_ids)
        state["generated"] = generated

        # Her 10 semptomda bir ara-kayıt — API kotası/bağlantı kesintisinde
        # baştan başlamak zorunda kalma.
        if index % 10 == 0:
            save_checkpoint(state)
            print(f"  ...ara-kayıt yapıldı ({len(generated)} örnek şu ana kadar)")

    save_checkpoint(state)

    # ── Sızıntı kontrolü: eval setiyle TAM string eşleşmesi var mı? ──
    eval_texts = load_eval_texts_for_leak_check()
    before = len(generated)
    generated = [g for g in generated if g["text"] not in eval_texts]
    leaked = before - len(generated)
    if leaked:
        print(
            f"UYARI: {leaked} üretilen cümle, eval setiyle BİREBİR aynı çıktı ve elendi."
        )
    else:
        print("Sızıntı kontrolü: eval setiyle birebir aynı hiçbir cümle yok. Temiz.")

    output = {
        "purpose": "training",  # nlp_test_dataset.json'daki eval seti ile ASLA karıştırılmasın
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

    # Başarıyla bitince checkpoint'i temizle
    if CHECKPOINT_PATH.exists():
        CHECKPOINT_PATH.unlink()


if __name__ == "__main__":
    main()
