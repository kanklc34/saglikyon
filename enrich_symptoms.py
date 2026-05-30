"""
SağlıkYön – Semptom Veritabanı Zenginleştirici
================================================
Gemini API kullanarak mevcut symptom-db.js'deki her semptom için
Türkçe ve İngilizce keyword varyantları + eş anlamlılar üretir.

Çıktı: enriched_symptoms.json (gözden geçirip onayladıktan sonra DB'ye ekle)

Kullanım:
  pip install google-generativeai
  python enrich_symptoms.py --api-key YOUR_GEMINI_KEY --input symptom-db.js
"""

import argparse
import json
import re
import time
import sys
from pathlib import Path

try:
    import google.generativeai as genai
except ImportError:
    print("Hata: google-generativeai paketi yüklü değil.")
    print("Çözüm: pip install google-generativeai")
    sys.exit(1)


# ─────────────────────────────────────────────
# 1. symptom-db.js'den semptomları parse et
# ─────────────────────────────────────────────


def parse_symptom_db(js_path: str) -> list[dict]:
    """
    symptom-db.js dosyasını okur, SYMPTOM_DATABASE içindeki
    her semptomun id ve keywords listesini çıkarır.
    """
    content = Path(js_path).read_text(encoding="utf-8")

    # SYMPTOM_DATABASE dizisini bul
    match = re.search(
        r"export const SYMPTOM_DATABASE\s*=\s*\[(.+?)\];", content, re.DOTALL
    )
    if not match:
        raise ValueError("SYMPTOM_DATABASE bulunamadı. Dosya yolunu kontrol et.")

    db_text = match.group(1)

    # Her semptom objesini ayrıştır
    symptoms = []
    # id ve keywords alanlarını regex ile çek
    entries = re.findall(
        r"id:\s*'([^']+)'.*?keywords:\s*\[([^\]]+)\]", db_text, re.DOTALL
    )

    for sym_id, kw_raw in entries:
        keywords = re.findall(r"'([^']+)'", kw_raw)
        symptoms.append({"id": sym_id, "existing_keywords": keywords})

    print(f"✓ {len(symptoms)} semptom parse edildi.")
    return symptoms


# ─────────────────────────────────────────────
# 2. Gemini'den zenginleştirme iste
# ─────────────────────────────────────────────

PROMPT_TEMPLATE = """Sen bir Türk sağlık terminolojisi uzmanısın.
Aşağıdaki tıbbi semptom için kullanıcıların gerçek hayatta kullandığı ifadeleri listele.

Semptom ID: {sym_id}
Mevcut Türkçe ifadeler: {existing}

Görev:
1. Türkçe: Mevcut listeye EKLENMEMIŞ, sıradan insanların (tıp eğitimi olmayan) kullandığı 
   10-15 farklı ifade üret. Ağız dili, bölgesel söyleyişler, halk dili dahil.
2. İngilizce: Aynı semptomu anlatan 10-15 İngilizce ifade (hem tıbbi hem günlük dil).

Önemli kurallar:
- Mevcut listede OLAN ifadeleri tekrar yazma
- Her ifade kısa olsun (1-4 kelime)
- Gerçekçi hasta ifadeleri olsun, robotik tıp dili değil
- JSON formatında yanıt ver, başka hiçbir şey yazma

Format:
{{
  "id": "{sym_id}",
  "new_keywords_tr": ["ifade1", "ifade2", ...],
  "new_keywords_en": ["phrase1", "phrase2", ...],
  "new_synonyms_tr": {{"kelime": ["eş anlam1", "eş anlam2"]}}
}}"""


def enrich_symptom(model, symptom: dict, delay: float = 1.5) -> dict | None:
    """Tek bir semptom için Gemini'den zenginleştirme ister."""
    prompt = PROMPT_TEMPLATE.format(
        sym_id=symptom["id"], existing=", ".join(symptom["existing_keywords"])
    )

    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Markdown code block varsa temizle
        raw = re.sub(r"```json|```", "", raw).strip()

        result = json.loads(raw)
        time.sleep(delay)  # Rate limit koruması
        return result

    except json.JSONDecodeError as e:
        print(f"  ✗ JSON parse hatası ({symptom['id']}): {e}")
        return None
    except Exception as e:
        print(f"  ✗ API hatası ({symptom['id']}): {e}")
        time.sleep(5)  # Hata durumunda daha uzun bekle
        return None


# ─────────────────────────────────────────────
# 3. Çıktıyı birleştir ve kaydet
# ─────────────────────────────────────────────


def merge_results(original_symptoms: list[dict], enriched: list[dict]) -> dict:
    """
    Orijinal semptomları zenginleştirilmiş verilerle birleştirir.
    Çıktı: {id: {existing, new_tr, new_en, combined}} formatı
    """
    enriched_map = {e["id"]: e for e in enriched if e}

    merged = {}
    for sym in original_symptoms:
        sid = sym["id"]
        enr = enriched_map.get(sid, {})

        new_tr = enr.get("new_keywords_tr", [])
        new_en = enr.get("new_keywords_en", [])
        new_synonyms = enr.get("new_synonyms_tr", {})

        # Tekrar edenleri çıkar
        existing_set = set(sym["existing_keywords"])
        new_tr_clean = [k for k in new_tr if k not in existing_set]

        merged[sid] = {
            "existing_keywords": sym["existing_keywords"],
            "new_keywords_tr": new_tr_clean,
            "new_keywords_en": new_en,
            "new_synonyms": new_synonyms,
            # Kolayca kopyalanabilsin diye birleşik liste
            "combined_keywords": sym["existing_keywords"] + new_tr_clean,
            "status": "enriched" if enr else "failed",
        }

    return merged


def generate_patch(merged: dict) -> str:
    """
    symptom-db.js'e kolayca uygulanabilecek patch önerisini
    insan okunabilir formatta üretir.
    """
    lines = ["// ═══════════════════════════════════════════════════════\n"]
    lines.append("// SağlıkYön – Zenginleştirme Paketi\n")
    lines.append("// Bu dosyayı symptom-db.js'e entegre etmeden önce gözden geçir!\n")
    lines.append("// ═══════════════════════════════════════════════════════\n\n")

    lines.append("// ── Yeni İngilizce keywords (SYMPTOM_DATABASE'e ekle) ──\n")
    for sid, data in merged.items():
        if data["new_keywords_en"]:
            en_list = json.dumps(data["new_keywords_en"], ensure_ascii=False)
            lines.append(f"// {sid}:\n//   keywords_en: {en_list}\n")

    lines.append("\n// ── Yeni Türkçe keywords (mevcut keywords listesine ekle) ──\n")
    for sid, data in merged.items():
        if data["new_keywords_tr"]:
            tr_list = json.dumps(data["new_keywords_tr"], ensure_ascii=False)
            lines.append(f"// {sid}:\n//   new_tr: {tr_list}\n")

    return "".join(lines)


# ─────────────────────────────────────────────
# 4. Ana akış
# ─────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="SağlıkYön Semptom DB Zenginleştirici")
    parser.add_argument("--api-key", required=True, help="Gemini API key")
    parser.add_argument("--input", required=True, help="symptom-db.js dosya yolu")
    parser.add_argument(
        "--output", default="enriched_symptoms.json", help="Çıktı JSON dosyası"
    )
    parser.add_argument("--patch", default="symptom_patch.js", help="Patch dosyası")
    parser.add_argument(
        "--limit", type=int, default=0, help="Test için kaç semptom işlensin (0=hepsi)"
    )
    parser.add_argument(
        "--delay", type=float, default=1.5, help="API çağrıları arası bekleme (saniye)"
    )
    parser.add_argument(
        "--resume", default="", help="Yarım kalan işi devam ettirmek için mevcut JSON"
    )
    args = parser.parse_args()

    # Gemini'yi başlat
    genai.configure(api_key=args.api_key)
    model = genai.GenerativeModel("gemini-3.1-flash-lite")  # Ücretsiz tier için flash

    # Semptomları parse et
    print(f"\n📂 Okunuyor: {args.input}")
    symptoms = parse_symptom_db(args.input)

    if args.limit > 0:
        symptoms = symptoms[: args.limit]
        print(f"⚡ Test modu: İlk {args.limit} semptom işlenecek")

    # Daha önce kaldığı yerden devam et
    done = {}
    if args.resume and Path(args.resume).exists():
        with open(args.resume, encoding="utf-8") as f:
            done = json.load(f)
        print(f"♻️  {len(done)} semptom önceden tamamlanmış, devam ediliyor...")

    # Zenginleştir
    enriched = list(done.values()) if done else []
    remaining = [s for s in symptoms if s["id"] not in done]

    print(f"\n🚀 {len(remaining)} semptom işlenecek...\n")

    for i, sym in enumerate(remaining, 1):
        print(f"  [{i}/{len(remaining)}] {sym['id']}...", end=" ", flush=True)
        result = enrich_symptom(model, sym, delay=args.delay)

        if result:
            enriched.append(result)
            print("✓")
        else:
            print("✗ atlandı")

        # Her 10 semptomda bir ara kaydet (crash protection)
        if i % 10 == 0:
            interim = {e["id"]: e for e in enriched}
            with open("interim_backup.json", "w", encoding="utf-8") as f:
                json.dump(interim, f, ensure_ascii=False, indent=2)
            print(f"  💾 Ara kayıt: {len(enriched)} semptom kaydedildi")

    # Birleştir
    print(f"\n✅ İşlem tamamlandı. {len(enriched)} semptom zenginleştirildi.")
    merged = merge_results(symptoms, enriched)

    # JSON çıktısı
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print(f"📄 Zenginleştirilmiş veri: {args.output}")

    # Patch dosyası
    patch = generate_patch(merged)
    with open(args.patch, "w", encoding="utf-8") as f:
        f.write(patch)
    print(f"🔧 Patch dosyası: {args.patch}")

    # Özet istatistik
    total_new_tr = sum(len(d["new_keywords_tr"]) for d in merged.values())
    total_new_en = sum(len(d["new_keywords_en"]) for d in merged.values())
    failed = sum(1 for d in merged.values() if d["status"] == "failed")

    print(f"\n📊 Özet:")
    print(f"   Yeni Türkçe keyword: {total_new_tr}")
    print(f"   Yeni İngilizce keyword: {total_new_en}")
    print(f"   Başarısız semptom: {failed}")
    print(
        f"\n⚠️  enriched_symptoms.json'u symptom-db.js'e eklemeden ÖNCE gözden geçir!"
    )


if __name__ == "__main__":
    main()
