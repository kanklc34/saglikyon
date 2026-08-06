#!/usr/bin/env python3
"""
merge_mide_ulser_examples.py

Gemini, "mide_ulser" (ülser/helikobakter/mide delinmesi gibi terimler
içeren) için 6 kez üst üste boş pozitif liste döndürdü — muhtemelen bu
terim kombinasyonu modelin içerik temkinliliğini tetikliyor (hata değil,
sessiz boş yanıt). Diğer 141 semptomun aksine bu TEK sembol için Gemini'yi
zorlamak yerine, aynı kalite standardında elle 6 doğal cümle ekliyoruz —
Gemini'nin diğer semptomlar için ürettiği üslupla tutarlı, keyword'leri
birebir kopyalamayan, gerçek hasta dili.

Kullanım: python tools/merge_mide_ulser_examples.py
(nlp_training_dataset.json'ı kendi klasöründe, tools/ altında çalıştır.)
"""
import json
import time
from pathlib import Path

OUTPUT_PATH = Path(__file__).parent / "nlp_training_dataset.json"

MANUAL_EXAMPLES = [
    "Aç karnına midemde öyle bir yanma oluyor ki sanki içim kemiriliyor gibi hissediyorum.",
    "Yemek yedikten sonra mide bölgemdeki sancı biraz hafifliyor ama aç kaldığımda dayanılmaz hale geliyor.",
    "Son günlerde tuvalete çıktığımda dışkımın renginin koyulaştığını fark ettim, sanki katrana benziyor, bu beni çok korkuttu.",
    "Geceleri mide ağrısıyla uyanıyorum, sanki içimde bir yara varmış gibi keskin bir sızı hissediyorum.",
    "Karnımın üst kısmında sürekli bir ekşime ve yanma var, doktorum mide zarımda bir tahriş olabileceğini söyledi.",
    "Mide bölgemde sanki asit birikmiş gibi devamlı bir yanma ve kazınma hissi yaşıyorum.",
]

if not OUTPUT_PATH.exists():
    raise SystemExit(f"HATA: {OUTPUT_PATH} bulunamadı.")

data = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))

# mide_ulser'in pozitif kayıtlarını (varsa) temizle, negasyonu koru
kept = [ex for ex in data["examples"] if not (ex["symptomId"] == "mide_ulser" and ex["mode"] == "positive")]

added = [
    {
        "symptomId": "mide_ulser",
        "symptomLabel": "mide_ulser",
        "expectedDepartment": "gastroenteroloji",
        "mode": "positive",
        "expectNoMatch": False,
        "text": text,
        "lang": "tr",
    }
    for text in MANUAL_EXAMPLES
]

data["examples"] = kept + added
data["totalExamples"] = len(data["examples"])
data["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
data.setdefault("manualAdditions", []).append({
    "symptomId": "mide_ulser",
    "reason": "Gemini 6 denemede de boş pozitif liste döndürdü, elle eklendi",
    "count": len(MANUAL_EXAMPLES),
})

OUTPUT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"mide_ulser için {len(MANUAL_EXAMPLES)} pozitif örnek eklendi.")
print(f"Yeni toplam: {data['totalExamples']} örnek.")
