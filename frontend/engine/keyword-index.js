// ─────────────────────────────────────────────────────────────────
// keyword-index.js — Ters indeks (ön-filtreleme yapısı)
// ─────────────────────────────────────────────────────────────────
// AMAÇ: extractSymptoms() her analiz çağrısında 142 semptomun TAMAMINI,
// semptom başına ortalama ~100 keyword ile fuzzy/Levenshtein karşılaştırarak
// tarıyor (bkz. analyzer.js + nlp.js matchKeywords). Bu modül, girdi
// metniyle en azından bir ortak kelime kökü paylaşan semptomları ÖNCEDEN
// daraltmak için bir ters indeks kurar.
//
// ─────────────────────────────────────────────────────────────────
// ADIM 4 — SİLME-KOMŞULUĞU (SymSpell tarzı) İNDEKSLEME
// ─────────────────────────────────────────────────────────────────
// İLK TASARIM (artık terk edildi): canonical'ın ilk 3 karakterini bucket
// anahtarı yapmıştık. Bu, kelimenin SONUNDAKİ farkları tolere ediyordu
// ama BAŞINDAKİ/ORTASINDAKİ 1 harflik farkları (yazım hataları) kaçırıyordu
// — örn. "seğiriyor" (canonical: segir) ile "sağırlık" (canonical: sagir)
// arasındaki fark 2. karakterde, bu yüzden ilk-3-harf anahtarları farklı
// çıkıyordu ("seg" vs "sag") ve indeks bu eşleşmeyi kaçırıyordu. Gerçek
// motorda (nlp.js: fuzzyMatch/compareTokens) bu ikisi Levenshtein mesafesi
// 1 olduğu için EŞLEŞİYOR — yani indeksimiz motorla tutarsızdı.
//
// ÇÖZÜM (matematiksel olarak motorla tutarlı): "silme-komşuluğu" tekniği
// (yazım denetleyicilerinde kullanılan SymSpell algoritmasının temeli).
// Fikir: iki kelime arasındaki fark TEK BİR karakter DEĞİŞİKLİĞİYSE
// (ekleme, çıkarma veya yer değiştirme), o karakteri HER İKİ kelimeden de
// silince AYNI sonuç elde edilir:
//   "segir" (e sil, 1. pozisyon) -> "sgir"
//   "sagir" (a sil, 1. pozisyon) -> "sgir"    <- AYNI!
// Bu yüzden her token'ı, kendisinin + "1 karakter eksik" tüm hâllerinin
// KÜMESİYLE indeksliyoruz. İki token'ın Levenshtein mesafesi ≤1 ise,
// bu kümeler kesinlikle en az bir ortak eleman paylaşır — konumdan
// bağımsız olarak. Bu, motorun kendi toleransıyla MATEMATİKSEL OLARAK
// TUTARLI bir indeks sağlar (yaklaşık/sezgisel değil).
//
// Bu, önceki 3-harf-önek tasarımına göre ~7-8 kat daha fazla indeks
// girdisi üretir (token başına ~L+1 anahtar, L~6-8) ama yine de
// milisaniyeler mertebesinde, bir kez (modül yüklenirken) hesaplanıp
// önbelleğe alınıyor.
//
// ÖNEMLİ: Bu modül extractSymptoms() içinde GÖLGE MOD'da kullanılıyor —
// gerçek dönen sonuca etkisi yok, sadece paralel ölçüm/karşılaştırma
// amacıyla çalıştırılıyor (bkz. analyzer.js: SHADOW_MODE_ENABLED).

import { SYMPTOM_DATABASE } from './analyzer.js';
import { tokenizeForMatching } from './nlp.js';

// canonical bir token için "kendisi + tüm 1-karakter-eksik hâlleri" kümesini
// üretir. Örn. "abc" -> {"abc", "bc", "ac", "ab"}.
// Çok kısa tokenlar (≤2 karakter) için sadece kendisini döner — bu tokenlar
// zaten nlp.js'te (compareTokens) ayrı bir "sadece tam eşleşme" kuralına
// tabi, fuzzy tolerans uygulanmıyor, o yüzden ekstra varyant üretmeye gerek
// yok.
// nlp.js'teki keyword-seviyesi ön-filtre için de dışa açık — AYNI fonksiyon,
// iki farklı yerde birbirinden bağımsız/tutarsız kopyalar olmasın diye.
export function deleteNeighborhood(token) {
    if (!token || token.length <= 2) return token ? [token] : [];
    const variants = [token];
    for (let i = 0; i < token.length; i++) {
        variants.push(token.slice(0, i) + token.slice(i + 1));
    }
    return variants;
}

// index: Map<variant, Set<symptomId>>
let _index = null;
let _stats = null;
let _nonDiscriminativeKeys = null;

// AŞIRI YAYGIN (AYIRT EDİCİ OLMAYAN) ANAHTARLARI BUDAMA
// ─────────────────────────────────────────────────────
// Aynı problem burada da geçerli: bazı silme-varyantları (özellikle çok
// kısa olanlar, örn. "ar", "in") onlarca farklı token'dan üretilebiliyor
// ve neredeyse tüm semptomlara denk gelebiliyor. Bir anahtar semptomların
// %MAX_BUCKET_FRACTION'ından fazlasını kapsıyorsa, "ayırt edici değil"
// sayılır ve aday birleşimine dahil edilmez. Adım 2'de aynı mantıkla
// %25 çok agresif çıkmıştı (anlamlı ama yaygın kelimeleri buduyordu),
// %60'ta güvenli bir denge bulunmuştu — aynı eşik burada da kullanılıyor.
//
// GÜVENLİK AĞI: Ayırt edici hiçbir anahtar kalmazsa (girdi tamamen çok
// yaygın kelimelerden oluşuyorsa), NULL dönülür — çağıran taraf bunu
// "filtre uygulama, tüm semptomlara bak" olarak yorumlar. Böylece bu
// budama asla bir eşleşmeyi kaçırma riski taşımaz.
const MAX_BUCKET_FRACTION = 0.6;

function buildIndex() {
    const index = new Map();
    let totalTokensIndexed = 0;
    let totalKeywordsIndexed = 0;
    let totalVariantEntries = 0;

    for (const symptom of SYMPTOM_DATABASE) {
        const allKeywords = symptom.keywords_en
            ? [...symptom.keywords, ...symptom.keywords_en]
            : symptom.keywords;

        for (const keyword of allKeywords) {
            totalKeywordsIndexed++;
            const tokens = tokenizeForMatching(keyword);
            for (const t of tokens) {
                if (!t.canonical) continue;
                totalTokensIndexed++;
                for (const variant of deleteNeighborhood(t.canonical)) {
                    totalVariantEntries++;
                    let bucket = index.get(variant);
                    if (!bucket) { bucket = new Set(); index.set(variant, bucket); }
                    bucket.add(symptom.id);
                }
                // Ayrıca STEM'i de anahtar olarak ekle: compareTokens() içinde
                // canonical Levenshtein yolundan tamamen BAĞIMSIZ bir "stem eşitliği"
                // kuralı var (stem.length>=4 ise tam stem eşleşmesi 0.96 puan alır —
                // örn. İngilizce "numb" ~ "numbness", ikisinin canonical'ı farklı
                // ama stem'i aynı). Bu yolu da modellemek için stem'i ayrı bir
                // anahtar olarak indeksliyoruz.
                if (t.stem && t.stem.length >= 4 && t.stem !== t.canonical) {
                    totalVariantEntries++;
                    let bucket = index.get(t.stem);
                    if (!bucket) { bucket = new Set(); index.set(t.stem, bucket); }
                    bucket.add(symptom.id);
                }
            }
        }
    }

    const bucketSizes = [...index.values()].map(s => s.size);
    const stats = {
        symptomCount: SYMPTOM_DATABASE.length,
        totalKeywordsIndexed,
        totalTokensIndexed,
        totalVariantEntries,
        bucketCount: index.size,
        avgSymptomsPerBucket: bucketSizes.length
            ? Number((bucketSizes.reduce((a, b) => a + b, 0) / bucketSizes.length).toFixed(2))
            : 0,
        maxSymptomsPerBucket: bucketSizes.length ? Math.max(...bucketSizes) : 0,
        minSymptomsPerBucket: bucketSizes.length ? Math.min(...bucketSizes) : 0,
    };

    const maxAllowed = SYMPTOM_DATABASE.length * MAX_BUCKET_FRACTION;
    const nonDiscriminativeKeys = new Set();
    for (const [key, bucket] of index) {
        if (bucket.size > maxAllowed) nonDiscriminativeKeys.add(key);
    }
    stats.nonDiscriminativeBucketCount = nonDiscriminativeKeys.size;
    stats.nonDiscriminativeFractionOfBuckets = Number((nonDiscriminativeKeys.size / index.size).toFixed(3));

    return { index, stats, nonDiscriminativeKeys };
}

function ensureIndex() {
    if (!_index) {
        const built = buildIndex();
        _index = built.index;
        _stats = built.stats;
        _nonDiscriminativeKeys = built.nonDiscriminativeKeys;
    }
    return _index;
}

// getCandidateSymptomIds: girdi metnini tokenize edip, her token'ın
// silme-komşuluğundaki (ayırt edici) anahtarların işaret ettiği semptom
// id'lerinin birleşimini döner. Ayırt edici hiçbir anahtar yoksa NULL
// döner (güvenlik ağı — bkz. yukarıdaki not).
export function getCandidateSymptomIds(inputText) {
    const index = ensureIndex();
    const inputTokens = tokenizeForMatching(inputText);
    const candidates = new Set();
    let sawDiscriminativeToken = false;
    for (const t of inputTokens) {
        if (!t.canonical) continue;
        for (const variant of deleteNeighborhood(t.canonical)) {
            if (_nonDiscriminativeKeys.has(variant)) continue;
            sawDiscriminativeToken = true;
            const bucket = index.get(variant);
            if (bucket) for (const id of bucket) candidates.add(id);
        }
        if (t.stem && t.stem.length >= 4 && t.stem !== t.canonical && !_nonDiscriminativeKeys.has(t.stem)) {
            sawDiscriminativeToken = true;
            const bucket = index.get(t.stem);
            if (bucket) for (const id of bucket) candidates.add(id);
        }
    }
    if (!sawDiscriminativeToken) return null;
    return candidates;
}

export function getIndexStats() {
    ensureIndex();
    return _stats;
}

export function _resetIndexForTests() {
    _index = null;
    _stats = null;
    _nonDiscriminativeKeys = null;
}