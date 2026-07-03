import argparse
import json
import re
import time
import sys
import os
from pathlib import Path

try:
    # Google'ın yepyeni ve güncel kütüphanesi
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError
except ImportError:
    print("Hata: pip install google-genai")
    sys.exit(1)

PROMPT_TEMPLATE = """You are a medical NLP expert helping build a symptom detection system.

Symptom ID: {sym_id}
Existing English keywords: {existing_en}

Task: Generate 15-20 NEW English phrases that real patients use to describe this symptom.
Focus on:
- Colloquial expressions ("my head is aching", "head is killing me", "head is pounding")
- Verb forms ("aching", "throbbing", "hurting", "pounding", "burning")
- "I have a..." / "I feel..." / "there is a..." patterns
- Informal language ("cannot stand the pain", "head is spliting")
- Body part + symptom combos ("head hurts", "chest is tight")

Rules:
- Do NOT repeat existing keywords
- Do NOT use any apostrophes (Do NOT use letters like ' or ` or ’. Change can't to cannot, head's to head is)
- Keep phrases short (1-5 words)
- Return ONLY valid JSON, no markdown, no explanation

Format:
{{"id": "{sym_id}", "new_keywords_en": ["phrase1", "phrase2", ...]}}"""


def parse_existing_en(js_content: str, sym_id: str) -> list[str]:
    """Mevcut keywords_en listesini güvenli bir şekilde parse et."""
    idx = js_content.find(f"id: '{sym_id}'")
    if idx == -1:
        return []

    block = js_content[idx : idx + 3000]
    en_match = re.search(r"keywords_en:\s*\[(.*?)\]", block, re.DOTALL)
    if not en_match:
        return []

    return re.findall(r"['\"]([^'\"]+)['\"]", en_match.group(1))


def parse_symptom_ids(js_content: str) -> list[str]:
    """Tüm semptom ID'lerini çıkar."""
    return re.findall(r"id:\s*'([^']+)'", js_content)


def enrich_symptom(
    client, sym_id: str, existing_en: list[str], delay: float = 2.5
) -> dict | None:
    prompt = PROMPT_TEMPLATE.format(
        sym_id=sym_id,
        existing_en=", ".join(existing_en[:15]) if existing_en else "none yet",
    )

    for attempt in range(1, 4):
        try:
            # Yeni SDK'da içerik üretme komutu client.models.generate_content şeklindedir
            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json", temperature=0.7
                ),
            )
            raw = response.text.strip()
            result = json.loads(raw)
            time.sleep(delay)
            return result

        except Exception as e:
            error_msg = str(e)

            # Eğer hata 429 Kota Aşımı (Rate Limit) ise süreyi yakala
            if "429" in error_msg or "quota" in error_msg.lower():
                wait_match = re.search(r"retry in ([\d\.]+)s", error_msg)
                if wait_match:
                    wait_time = float(wait_match.group(1)) + 2.0
                else:
                    wait_time = 62.0

                print(
                    f"\n  ⏳ [Kota Sınırı] API tıkandı. {wait_time:.1f} saniye zorunlu mola veriliyor (Deneme {attempt}/3)..."
                )
                time.sleep(wait_time)
                continue

            print(
                f"\n  ⚠️ Bağlantı hatası: {error_msg}. 5 saniye sonra tekrar deneniyor..."
            )
            time.sleep(5)

    return None


def inject_keywords_en(
    js_content: str, sym_id: str, new_words: list[str]
) -> tuple[str, int]:
    """Mevcut keywords_en listesine yeni kelimeleri güvenle enjekte et."""
    idx = js_content.find(f"id: '{sym_id}'")
    if idx == -1:
        return js_content, 0

    block_start = idx
    next_idx = js_content.find("id: '", idx + 10)
    block_end = next_idx if next_idx > -1 else len(js_content)
    block = js_content[block_start:block_end]

    en_match = re.search(r"(keywords_en:\s*\[)(.*?)(\])", block, re.DOTALL)
    if not en_match:
        return js_content, 0

    existing = re.findall(r"['\"]([^'\"]+)['\"]", en_match.group(2))
    existing_set = set(existing)

    clean_new = []
    for w in new_words:
        w_clean = w.strip().lower()
        if (
            w_clean not in existing_set
            and "'" not in w_clean
            and "`" not in w_clean
            and "’" not in w_clean
            and "\\" not in w_clean
            and w_clean
        ):
            clean_new.append(w_clean)
            existing_set.add(w_clean)

    if not clean_new:
        return js_content, 0

    all_words = existing + clean_new

    chunks, line = [], []
    for q in [f"'{w}'" for w in all_words]:
        line.append(q)
        if sum(len(x) + 2 for x in line) > 70:
            chunks.append("      " + ", ".join(line[:-1]) + ",")
            line = [line[-1]]
    if line:
        chunks.append("      " + ", ".join(line))

    new_en_str = "keywords_en: [\n" + "\n".join(chunks) + "\n    ]"

    new_block = block[: en_match.start()] + new_en_str + block[en_match.end() :]
    new_content = js_content[:block_start] + new_block + js_content[block_end:]

    return new_content, len(clean_new)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-key")
    parser.add_argument("--input", default="frontend/engine/symptom-db.js")
    parser.add_argument("--output", default="frontend/engine/symptom-db.js")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument(
        "--delay", type=float, default=4.5
    )  # Kota dostu varsayılan süre
    args = parser.parse_args()

    # Çevre değişkeninden veya parametreden API anahtarını al
    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print(
            "Hata: API Key bulunamadı! --api-key parametresini kullanın veya GEMINI_API_KEY ortam değişkenini tanımlayın."
        )
        sys.exit(1)

    # Yeni SDK istemcisi (Client) oluşturuluyor
    client = genai.Client(api_key=api_key)

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Hata: Girdi dosyası bulunamadı -> {args.input}")
        sys.exit(1)

    content = input_path.read_text(encoding="utf-8")
    symptom_ids = parse_symptom_ids(content)

    if args.limit > 0:
        symptom_ids = symptom_ids[: args.limit]

    print(f"✓ {len(symptom_ids)} semptom işlenecek\n")

    total_added = 0

    for i, sym_id in enumerate(symptom_ids, 1):
        existing_en = parse_existing_en(content, sym_id)
        print(
            f"[{i}/{len(symptom_ids)}] {sym_id} ({len(existing_en)} mevcut EN)...",
            end=" ",
            flush=True,
        )

        result = enrich_symptom(client, sym_id, existing_en, args.delay)

        if result and result.get("new_keywords_en"):
            content, added = inject_keywords_en(
                content, sym_id, result["new_keywords_en"]
            )
            total_added += added
            print(f"✓ +{added}")
        else:
            print("✗ atlandı")

        if i % 5 == 0:
            temp_output = Path(args.output)
            temp_file = temp_output.with_suffix(".tmp")
            temp_file.write_text(content, encoding="utf-8")
            temp_file.replace(temp_output)
            print(f"  💾 Ara kayıt başarılı. Toplam: {total_added} kelime.")

    Path(args.output).write_text(content, encoding="utf-8")

    print(f"\n✅ İşlem başarıyla tamamlandı!")
    print(f"   Toplam eklenen yeni kelime: {total_added}")
    print(f"   Çıktı dosyası: {args.output}")


if __name__ == "__main__":
    main()
