// ============================================
// SağlıkYön – Semantik Fallback Katmanı
// ============================================
//
// Lexical motor (matchKeywords/keyword-index) hiçbir eşleşme bulamadığında
// (noMatch: true) devreye giren, embedding tabanlı bir geri dönüş katmanı.
//
// NEDEN VAR: 7 haftalık sağlamlaştırma turunda bulduğumuz asıl kalıcı
// zayıflık, saf sözlük eşleştirmenin dolaylı/mecazi anlatımı ("kafamın
// içinde bomba patladı" gibi) yakalayamamasıydı. Bu katman, kullanıcının
// cümlesini SağlıkYön'ün kendi verisiyle fine-tune edilmiş bir çok-dilli
// embedding modeliyle (multilingual-e5-small tabanlı) anlamsal olarak
// karşılaştırıp en yakın semptom(lar)ı bulur.
//
// TASARIM İLKELERİ:
//  - Lazy: model (118MB, quantized) SADECE lexical motor gerçekten
//    başarısız olduğunda indirilir — çoğu kullanıcı bunu hiç indirmez.
//  - Tek seferlik: tarayıcı Cache API'de sakladığı için bir sonraki
//    ziyarette tekrar inmez.
//  - Şeffaf güven seviyesi: dönen sonuçlar ASLA lexical motorun kesin
//    eşleşmesiyle aynı güvende sunulmamalı — çağıran taraf (script.js)
//    bunu "tahmin, kesin eşleşme değil" çerçevesinde göstermeli.
//
// DOĞRULANMIŞ PERFORMANS (bkz. regression_corpus.json, 517 vaka, hiç
// mimari karar almak için kullanılmamış bağımsız test seti):
//   top-1 doğruluk: %72.5   top-3 doğruluk: %90.0
// (Kural-tabanlı motorun kendi top-1'i: %20.8 — bu katman SADECE lexical
// motor "hiçbir şey bulamadım" dediğinde devreye girer, onun yerini almaz.)

const MODEL_ID = 'kanklc/saglikyon-e5-small-tr-onnx-int8';
// BİLİNÇLİ OLARAK import.meta.url DEĞİL, sayfaya göreli düz bir yol
// kullanıyoruz: dev modunda (frontend/index.html) ve bundle'lı modda
// (dist/index.html + tek dosyalık app.bundle.js) bu dosyanın kendi
// fiziksel konumu farklı olsa da, fetch() her zaman SAYFANIN konumuna
// göre çözülür. semantic-corpus.json'ı index.html ile AYNI klasöre
// (frontend/ kökü, engine/ altına değil) koymamız bu yüzden önemli —
// build-frontend-bundle.mjs bunu otomatik olarak dist/ köküne kopyalar.
const CORPUS_URL = './semantic-corpus.json';

// transformers.js'i CDN'den, build tool'suz (repo'nun geri kalanıyla
// tutarlı) şekilde yüklüyoruz. Sürüm sabitlenmiş — ileride kasıtlı olarak
// güncellenmeli, sessizce "latest" çekilmemeli.
const TRANSFORMERS_CDN_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

let extractorPromise = null;
let corpusPromise = null;

function getExtractor() {
    if (!extractorPromise) {
        extractorPromise = import(TRANSFORMERS_CDN_URL).then(({ pipeline }) =>
            pipeline('feature-extraction', MODEL_ID)
        );
    }
    return extractorPromise;
}

function getCorpus() {
    if (!corpusPromise) {
        corpusPromise = fetch(CORPUS_URL).then(r => {
            if (!r.ok) throw new Error(`semantic-corpus.json yüklenemedi: ${r.status}`);
            return r.json();
        });
    }
    return corpusPromise;
}

function cosineSim(a, b) {
    // İkisi de zaten L2-normalize edilmiş (precompute + runtime'da normalize:true)
    // olduğu için dot product = cosine similarity.
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot;
}

/**
 * Kullanıcının serbest metnini, önceden hesaplanmış semptom-cümle
 * embedding'leriyle karşılaştırıp en yakın (benzersiz) semptomları döner.
 *
 * @param {string} text - kullanıcının orijinal şikayet metni
 * @param {number} topK - en fazla kaç aday döneceği (varsayılan 3)
 * @returns {Promise<Array<{symptomId: string, department: string, score: number}>>}
 *          Hata olursa (model/ağ sorunu) boş dizi döner — çağıran taraf
 *          bunu "semantik katman da bulamadı" olarak ele almalı, hata
 *          fırlatmamalı (kullanıcı deneyimini bozmasın diye).
 */
async function getSemanticCandidates(text, topK = 3) {
    try {
        const [extractor, corpus] = await Promise.all([getExtractor(), getCorpus()]);
        const output = await extractor(`query: ${text}`, { pooling: 'mean', normalize: true });
        const queryVec = Array.from(output.data);

        const bestPerSymptom = new Map(); // symptomId -> en yüksek skor + department

        for (const entry of corpus) {
            const score = cosineSim(queryVec, entry.embedding);
            const current = bestPerSymptom.get(entry.symptomId);
            if (!current || score > current.score) {
                bestPerSymptom.set(entry.symptomId, { department: entry.department, score });
            }
        }

        return [...bestPerSymptom.entries()]
            .map(([symptomId, v]) => ({ symptomId, department: v.department, score: v.score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    } catch (err) {
        console.warn('Semantik fallback başarısız oldu, lexical sonucuna dönülüyor:', err);
        return [];
    }
}

/**
 * Modeli önceden (kullanıcı bir şey yazmadan) ısıtmak için — isteğe bağlı.
 * Şu an script.js'te ÇAĞRILMIYOR; sadece ileride "kullanıcı yazmaya
 * başlayınca arka planda indir" gibi bir optimizasyon istenirse diye
 * hazır bırakıldı.
 */
function warmUpSemanticModel() {
    getExtractor().catch(() => { });
    getCorpus().catch(() => { });
}

// build-frontend-bundle.mjs, dosya-sonu "export { a, b };" satırlarını
// tanıyıp bundle'a uyumlu şekilde işliyor (analyzer.js'teki desenle
// aynı) — "export async function ..." ise IIFE içinde SyntaxError
// verir, bu yüzden export'u burada, ayrı bir satırda topluyoruz.
export { getSemanticCandidates, warmUpSemanticModel };