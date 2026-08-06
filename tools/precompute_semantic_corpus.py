# ============================================================
# BUNU v4 Kaggle notebook'unda, finetuned_model VE
# training_corpus_raw ZATEN YÜKLÜYKEN çalıştır (yeni bir hücre
# olarak ekle). Çıktı: semantic-corpus.json — tarayıcının
# yükleyeceği, 992 önceden-hesaplanmış cümle embedding'i.
#
# ÖNEMLİ: normalize_embeddings=True kullanıyoruz çünkü
# semantic-fallback.js'teki cosineSim() fonksiyonu, vektörlerin
# ZATEN L2-normalize olduğunu varsayıp basit dot-product yapıyor
# (gerçek cosine similarity hesabından daha hızlı). Bu satırı
# değiştirirsen JS tarafındaki cosineSim'i de güncellemen gerekir.
# ============================================================
import json

positive_examples = [
    ex for ex in training_corpus_raw["examples"] if ex["mode"] == "positive"
]
texts = [f'passage: {ex["text"]}' for ex in positive_examples]

print(f"{len(texts)} cümle embed ediliyor...")
embeddings = finetuned_model.encode(
    texts, batch_size=64, show_progress_bar=True,
    convert_to_numpy=True, normalize_embeddings=True
)

corpus = [
    {
        "symptomId": ex["symptomId"],
        "department": ex["expectedDepartment"],
        # float32 -> float dönüşümü + 6 ondalık basamağa yuvarlama:
        # JSON dosya boyutunu ciddi küçültüyor (~%40), hassasiyet kaybı
        # cosine similarity sıralamasını etkilemeyecek kadar küçük.
        "embedding": [round(float(x), 6) for x in emb],
    }
    for ex, emb in zip(positive_examples, embeddings)
]

OUTPUT_PATH = "/kaggle/working/semantic-corpus.json"
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(corpus, f, ensure_ascii=False, separators=(",", ":"))  # boşluksuz, kompakt

import os
size_mb = os.path.getsize(OUTPUT_PATH) / 1e6
print(f"Yazıldı: {OUTPUT_PATH} ({size_mb:.2f} MB, {len(corpus)} kayıt)")
print("Bu dosyayı Kaggle'ın Output sekmesinden indirip")
print("frontend/engine/semantic-corpus.json olarak repo'na koy.")
