#!/usr/bin/env python3
# ============================================
# SağlıkYön - Gemini ile Anahtar Kelime Genişletme (Python)
# ============================================

import json
import os
import re
import sys
import time
import requests
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 🛠️ DOSYA YOLU AYARI
DB_PATH = (
    r"C:\Users\KAAN\OneDrive\Desktop\Projeler\saglikyön\frontend\engine\symptom-db.js"
)

OUTPUT_PATH = os.path.join(SCRIPT_DIR, "keyword_expansion_output.json")
CONFIG_PATH = os.path.join(SCRIPT_DIR, "gemini_config.txt")

# ⚠️ EKSİKLİK GİDERİLDİ: Kodun çökmesini engellemek için zayıf semptom ID'leri listesi (Boş bırakabilir veya doldurabilirsiniz)
KNOWN_WEAK_IDS = ["bas-agrisi", "mide-bulantisi"]


def load_api_key():
    # 🔑 API ANAHTARINIZI BURAYA YAZIN:
    SABIT_API_KEY = ""

    if SABIT_API_KEY:
        return SABIT_API_KEY.strip()

    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key.strip()
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            key = f.read().strip()
        if key:
            return key
    print("HATA: API anahtarı bulunamadı.")
    print(
        "Kodun 29. satırındaki SABIT_API_KEY kısmına anahtarınızı tırnak içinde yazın."
    )
    sys.exit(1)


def load_symptoms_from_js():
    if not os.path.exists(DB_PATH):
        print(f"\nHATA: Semptom veri tabanı dosyası bulunamadı!")
        print(f"Aranan Konum: {DB_PATH}")
        sys.exit(1)

    with open(DB_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    start_marker = "export const SYMPTOM_DATABASE = ["
    try:
        start = content.index(start_marker)
    except ValueError:
        print(f"HATA: Dosya içinde '{start_marker}' ifadesi bulunamadı.")
        sys.exit(1)

    depth = 0
    i = start + len(start_marker) - 1
    end = -1
    while i < len(content):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                end = i
                break
        i += 1
    array_text = content[start + len(start_marker) - 1 : end + 1]

    objects = []
    depth = 0
    obj_start = None
    for idx, ch in enumerate(array_text):
        if ch == "{":
            if depth == 0:
                obj_start = idx
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append(array_text[obj_start : idx + 1])
                obj_start = None

    symptoms = []
    for obj_text in objects:
        sid_m = re.search(r"id:\s*'([^']*)'", obj_text)
        kw_block_m = re.search(
            r"keywords:\s*\[(.*?)\]\s*,\s*keywords_en:", obj_text, re.S
        )
        kwen_block_m = re.search(
            r"keywords_en:\s*\[(.*?)\]\s*,\s*departments:", obj_text, re.S
        )
        if not (sid_m and kw_block_m):
            continue
        keywords = re.findall(r"'((?:[^'\\]|\\.)*)'", kw_block_m.group(1))
        keywords_en = (
            re.findall(r"'((?:[^'\\]|\\.)*)'", kwen_block_m.group(1))
            if kwen_block_m
            else []
        )
        symptoms.append(
            {
                "id": sid_m.group(1),
                "keywords": [k.replace("\\'", "'") for k in keywords],
                "keywords_en": [k.replace("\\'", "'") for k in keywords_en],
            }
        )
    return symptoms


def build_prompt(symptom, n):
    existing_tr = symptom["keywords"][:12]
    existing_en = symptom["keywords_en"][:8]
    return f"""Sen Türkçe bir sağlık ön-değerlendirme uygulaması için anahtar kelime veritabanı zenginleştiriyorsun.

SEMPTOM ID: {symptom['id']}
MEVCUT TÜRKÇE İFADELER (örnek, bunları TEKRARLAMA): {json.dumps(existing_tr, ensure_ascii=False)}
MEVCUT İNGİLİZCE İFADELER (örnek): {json.dumps(existing_en, ensure_ascii=False)}

GÖREV: Gerçek bir hastanın (doktor değil, sıradan biri) bu şikayeti tarif ederken
kullanabileceği {n} adet YENİ, doğal Türkçe ifade üret. Şunları MUTLAKA karıştır:
- Günlük/abartılı konuşma dili ("kafam gidiyor" gibi)
- Ses-yazıya-çevirme tarzı, noktalama az, doğal cümle parçaları
- Bölgesel/argo söyleyiş varyasyonları
- Bazı kullanıcıların internetten okuyup kullandığı yarı-tıbbi terimler
  (örn. "migren" yaygındır ama "subaraknoid kanama" gibi nadir terimler
  sadece endişeli/araştırmış kullanıcılarda olur — bunlardan 1-2 tane ekle)
- Yazım hataları içeren 1-2 doğal örnek (gerçek kullanıcılar yazım hatası yapar)

Her ifade KISA olsun (3-7 kelime), tam cümle değil, mevcut örneklerdeki
stile benzesin. Ayrıca aynı sayıda DOĞAL İNGİLİZCE karşılık da üret
(bire bir çeviri değil, İngilizce konuşan birinin gerçekten söyleyeceği gibi).

SADECE şu JSON formatında cevap ver, başka hiçbir metin ekleme:
{{"tr": ["ifade1", "ifade2", ...], "en": ["phrase1", "phrase2", ...]}}"""


def call_gemini(api_key, prompt):
    # 🛠️ DÜZELTME: Doğru API endpoint'i tanımlandı ve güncel gemini-2.5-flash modeli seçildi.
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"

    headers = {"Content-Type": "application/json"}
    params = {"key": api_key}

    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.9,
        },
    }

    try:
        response = requests.post(
            url, json=body, headers=headers, params=params, timeout=60
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Gemini API hatası ({response.status_code}): {response.text[:300]}"
            )

        data = response.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Bağlantı hatası: {e}")
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        raise RuntimeError(
            f"API yanıt yapısı çözümlenemedi veya model çıktısı boş: {e}"
        )


def load_existing_output():
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids", default=None, help="virgülle ayrılmış semptom id listesi")
    ap.add_argument("--weak-only", action="store_true")
    ap.add_argument("--count", type=int, default=18)
    ap.add_argument("--delay", type=float, default=1.3)
    args = ap.parse_args()

    api_key = load_api_key()
    all_symptoms = load_symptoms_from_js()

    if args.ids:
        wanted = {s.strip() for s in args.ids.split(",")}
        targets = [s for s in all_symptoms if s["id"] in wanted]
    elif args.weak_only:
        wanted = set(KNOWN_WEAK_IDS)
        targets = [s for s in all_symptoms if s["id"] in wanted]
    else:
        targets = all_symptoms

    # 🛠️ DÜZELTME: Log mesajındaki model ismi güncellendi
    print("Model: Sabitlenmiş gemini-3.1-flash-lite")
    print(f"Toplam semptom: {len(all_symptoms)}, işlenecek: {len(targets)}")
    print(f"Her semptom için istenecek ifade sayısı: {args.count}\n")

    results = load_existing_output()
    processed, skipped = 0, 0

    for idx, symptom in enumerate(targets, 1):
        if symptom["id"] in results:
            skipped += 1
            continue
        print(f"[{idx}/{len(targets)}] {symptom['id']} ... ", end="", flush=True)
        try:
            prompt = build_prompt(symptom, args.count)
            parsed = call_gemini(api_key, prompt)

            results[symptom["id"]] = {
                "tr": (
                    parsed.get("tr", []) if isinstance(parsed.get("tr"), list) else []
                ),
                "en": (
                    parsed.get("en", []) if isinstance(parsed.get("en"), list) else []
                ),
            }
            with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(
                f"OK ({len(results[symptom['id']]['tr'])} tr, {len(results[symptom['id']]['en'])} en)"
            )
            processed += 1
        except Exception as e:
            print(f"HATA: {e}")
        time.sleep(args.delay)

    print(
        f"\nBitti. Yeni işlenen: {processed}, daha önce yapılmış (atlanan): {skipped}"
    )
    print(f"Çıktı: {OUTPUT_PATH}")
    print("\nSıradaki adım: python3 merge_keywords.py")


if __name__ == "__main__":
    main()
