// ============================================
// SağlıkYön – Türkçe NLP Modülü v2
//
// Değişiklikler (orijinal nlp.js → v2):
//  1. Stemmer: 30 suffix → 80+ suffix, doğru öncelik sırası,
//     yanlış stem'i önleyen minimum kök uzunluğu kontrolü
//  2. Intensifier koruması: "çok", "aşırı", "şiddetli" vb.
//     stop-word listesinden çıkarıldı; urgency boost'u için
//     ayrı bir katman eklendi (getIntensifierBoost)
//  3. Sıra bağımsız eşleştirme: "ağrıyor başım" = "başım ağrıyor"
//  4. Zenginleştirilmiş SYNONYM tablosu (tıbbi terimler dahil)
//  5. Negasyon tespiti: "baş ağrım yok", "göğsüm ağrımıyor" gibi
//     ifadeleri yakalayan basit negasyon katmanı
//  6. Yeni export: analyzeIntensifiers(text) → { boost, words }
// ============================================

import { STOP_WORDS, SYNONYMS } from './symptom-db.js';
import { deleteNeighborhood } from './keyword-index.js';

// ─────────────────────────────────────────────
// 1. TÜRKÇE KARAKTER NORMALIZASYONU
// ─────────────────────────────────────────────

const TURKISH_FOLD_MAP = [
  [/ç/g, 'c'],
  [/ğ/g, 'g'],
  [/[ıİ]/g, 'i'],
  [/ö/g, 'o'],
  [/ş/g, 's'],
  [/ü/g, 'u']
];

function foldTurkish(text) {
  let out = preprocessText(text);
  for (const [pattern, replacement] of TURKISH_FOLD_MAP) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

// ─────────────────────────────────────────────
// 2. METİN ÖN İŞLEME
// ─────────────────────────────────────────────

export function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"``()\[\]{}<>\/+*=_%#@^~\\|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeForSearch(text) {
  return foldTurkish(text);
}

// ─────────────────────────────────────────────
// 3. INTENSIFIER KATMANI
//    Stop-word listesinden çıkarılan yoğunluk
//    belirteçleri burada ayrıca işleniyor.
// ─────────────────────────────────────────────

const INTENSIFIERS = new Map([
  // Yüksek yoğunluk (boost: 1.3)
  ['cok', 1.3], ['asiri', 1.3], ['siddetli', 1.3],
  ['dayanilmaz', 1.3], ['korkunç', 1.3], ['feci', 1.3],
  ['dehset', 1.3], ['inanilmaz', 1.3], ['muazzam', 1.3],
  // Orta yoğunluk (boost: 1.15)
  ['oldukca', 1.15], ['epey', 1.15], ['hayli', 1.15],
  ['fazla', 1.15], ['buyuk', 1.15], ['yogun', 1.15],
  ['belirgin', 1.15], ['kuvvetl', 1.15],
  // Düşük yoğunluk / hafif (boost: 0.85 – urgency'i azalt)
  ['hafif', 0.85], ['biraz', 0.85], ['az', 0.85],
  ['arada', 0.85], ['bazen', 0.85], ['zaman zaman', 0.85],
  ['ara sira', 0.85]
]);

/**
 * Metindeki yoğunluk belirteçlerini bul.
 * @returns {{ boost: number, words: string[] }}
 */
export function analyzeIntensifiers(text) {
  const folded = foldTurkish(text);
  let boost = 1.0;
  const words = [];

  for (const [key, value] of INTENSIFIERS) {
    if (folded.includes(key)) {
      boost = Math.max(boost, value); // en yüksek boost kazanır
      words.push(key);
    }
  }

  return { boost, words };
}

// ─────────────────────────────────────────────
// 4. NEGASYON TESPİTİ
//    "baş ağrım yok", "ağrımıyor", "hissetmiyorum"
// ─────────────────────────────────────────────

const NEGATION_PATTERNS = [
  /\b\w+m?[iuio]yor\s*degil/,          // "hissediyorum değil" (fold sonrası)
  /\b\w+(m[iuio]yor|miyor|muyor)\b/,   // ağrımıyor → agrimiyor (folded)
  /\byok\b/,
  /\bolmadi\b/,                          // olmadı → olmadi (folded)
  /\bolmadi[mn]\b/,                      // olmadım, olmadın
  /\byasam[io]yorum\b/,                  // yaşamıyorum → yasamiyorum
  /\bhissetmiyorum\b/,
  /\bsikayet\w*\s+yok\b/                // şikayetim yok → sikayet... yok
];

/**
 * Metnin bir semptom için negasyon içerip içermediğini kontrol eder.
 * Basit yaklaşım: negasyon kelimesi semptom keyword'ünden sonraki 4
 * kelime içinde geçiyorsa negatif say.
 * @param {string} text
 * @param {string} keyword — eşleşen semptom keyword'ü
 * @returns {boolean}
 */
export function isNegated(text, keyword) {
  const folded = foldTurkish(preprocessText(text));

  // "sadece X" veya "ama/fakat X" ifadesi: X'i negatif sayma.
  // "ateşim yok sadece öksürüğüm var" → öksürük negatif olmamalı.
  const SCOPE_RESET = /\b(sadece|yalnizca|yalniz|ama|fakat|ancak|lakin)\b/;
  const scopeMatch = SCOPE_RESET.exec(folded);
  if (scopeMatch) {
    const afterScope = folded.slice(scopeMatch.index + scopeMatch[0].length);
    const kwStem = stemTurkish(foldTurkish(keyword), false);
    const kwFirst = kwStem.split(' ')[0]; // multi-word keyword → ilk token
    // afterScope'da keyword stem'i veya keyword'ün herhangi bir token'ı geçiyorsa
    // bu keyword negasyon kapsamı dışında
    if (kwFirst.length >= 3 && afterScope.split(/\s+/).some(t => {
      const ts = stemTurkish(t, false);
      return ts === kwFirst || ts.startsWith(kwFirst) || kwFirst.startsWith(ts);
    })) {
      return false;
    }
  }

  // Keyword'ü folded metinde ara
  const foldedKw = foldTurkish(keyword);
  const keyIdx = folded.indexOf(foldedKw);

  if (keyIdx === -1) {
    const firstToken = foldedKw.split(' ')[0];
    const tokenIdx = firstToken.length >= 3 ? folded.indexOf(firstToken) : -1;
    if (tokenIdx === -1) {
      return NEGATION_PATTERNS.some(p => p.test(folded));
    }
    const win = folded.slice(tokenIdx, tokenIdx + 80);
    return NEGATION_PATTERNS.some(p => p.test(win));
  }

  const win = folded.slice(Math.max(0, keyIdx - 10), keyIdx + 80);
  return NEGATION_PATTERNS.some(p => p.test(win));
}

// ─────────────────────────────────────────────
// 5. SYNONYM İNDEKSİ (genişletilmiş)
// ─────────────────────────────────────────────

/**
 * Orijinal symptom-db.js SYNONYMS objesine ek olarak
 * tıbbi/konuşma dili eş anlamlıları buraya eklenir.
 * İki kaynak birleştirilerek tek bir Map oluşturulur.
 */
export const EXTENDED_SYNONYMS = {
  // Genel
  'ağrı': ['acı', 'sızı', 'sancı', 'sızlama', 'zonklama', 'batma', 'ağrıyor', 'acıyor', 'rahatsızlık'],
  'şiddetli': ['çok', 'aşırı', 'dayanılmaz', 'kötü', 'feci', 'korkunç'],
  'mide': ['karın', 'mida', 'gastrik'],
  'kalp': ['yürek', 'kalb', 'kardiyak'],
  'göğüs': ['göğsüm', 'gögüs', 'gogus', 'sine', 'toraks'],
  'baş': ['kafa', 'başım', 'kafam', 'kraniyal'],
  'ateş': ['sıcaklık', 'hararet', 'febril', 'ısı'],
  'kusma': ['istifra', 'kusmak', 'bulantı kusma'],
  'ishal': ['sürgün', 'bağırsak bozukluğu', 'diyare', 'sulu dışkı'],
  'kabızlık': ['konstipasyon', 'kabız', 'dışkılayamıyorum', 'tuvalet yapamıyorum'],
  'uykusuzluk': ['insomnia', 'uyuyamamak', 'uyku sorunu', 'uyuyamıyorum'],
  'kızarıklık': ['kırmızılık', 'hiperemi', 'enflamasyon', 'iltihap'],
  'şişlik': ['ödem', 'kabarma', 'şişme', 'şişiyor', 'şişkinlik'],
  'uyuşma': ['karıncalanma', 'hissizlik', 'parestezi', 'uyuşuyor'],
  'nefes': ['soluk', 'solunum', 'nefesim'],
  // Baş & Nöroloji
  'baş ağrısı': ['sefalji', 'kranialji', 'kafa ağrısı'],
  'baş dönmesi': ['vertigo', 'denge kaybı', 'sersemlik'],
  'felç': ['inme', 'stroke', 'yüz düşmesi', 'hemipleji', 'felç geçiriyorum'],
  'titreme': ['tremor', 'titriyor', 'elin titriyor', 'kasılma'],
  'nöbet': ['konvülziyon', 'epilepsi', 'sara', 'kasılma nöbeti'],
  // Kardiyovasküler
  'göğüs ağrısı': ['göğüs sıkışması', 'göğüste baskı', 'göğüs yanması', 'anjin', 'angina', 'angina pectoris'],
  'çarpıntı': ['palpitasyon', 'kalp atıyor', 'kalp hızlı atıyor', 'nabız'],
  'nefes darlığı': ['dispne', 'nefes alamıyorum', 'nefesim daralıyor', 'hava alamıyorum'],
  // Sindirim
  'mide ağrısı': ['epigastrik ağrı', 'mide yanması', 'reflü', 'hazımsızlık'],
  'karın ağrısı': ['abdominal ağrı', 'karnım ağrıyor', 'karın krampı'],
  'sarılık': ['ikter', 'sarı renk', 'cilt sarardı', 'gözler sarardı'],
  // Kas-İskelet
  'bel ağrısı': ['lomber ağrı', 'belim tutuldu', 'sırt ağrısı alt', 'bel fıtığı'],
  'eklem ağrısı': ['artralji', 'artrit', 'romatizma', 'eklem şişliği'],
  // Solunum
  'öksürük': ['öksürüyor', 'balgamlı öksürük', 'kuru öksürük', 'tüsürmek'],
  'balgam': ['balgamlıyım', 'balgam çıkıyor', 'balgam var'],
  // Cilt
  'kaşıntı': ['kaşınıyor', 'prurit', 'kaşıntılı', 'kaşıntısı var'],
  'döküntü': ['kızarık döküntü', 'leke', 'egzama', 'ürtiker', 'kurdeşen'],
  // Üriner
  'sık idrara çıkma': ['polaküri', 'sık tuvalete gidiyorum', 'idrar yapıyorum sürekli'],
  'yanma idrar': ['dizüri', 'idrar yakarken yanıyor', 'idrar yaparken ağrı'],
  // Psikiyatri
  'anksiyete': ['kaygı', 'endişe', 'panik', 'korku', 'huzursuzluk'],
  'depresyon': ['mutsuzluk', 'üzüntü', 'içkapanıklığı', 'depresif'],
};

// ─────────────────────────────────────────────
// 6. GELİŞTİRİLMİŞ TÜRKÇE STEMMER
//    Orijinal: 30 suffix, öncelik yok, min uzunluk yok
//    v2:       80+ suffix, öncelik sıralı, min kök 3 harf
// ─────────────────────────────────────────────

// Suffix'ler kesinlikle uzundan kısaya sıralı olmalı.
// Kısa suffix önce gelirse yanlış kök üretilir:
// örn. "agriyor" → "iyor" çıkarılınca "agr" kalır (yanlış)
//               → "iyor" sonradan gelirse "agr" değil "agri" kalır (doğru)
// Bu yüzden tüm suffix'leri tek düz diziye koyup uzunluğa göre sıralıyoruz.

const ALL_SUFFIX_LIST = [
  // 7+ harf
  'miyorum', 'muyorum', 'müyorum', 'yorsunuz', 'yorlardi',
  'iyorum', 'uyorum',
  // 6 harf
  'yorum', 'yorsun', 'yoruz', 'yorlar', 'yordu', 'yormus',
  'mistim', 'mistir', 'mistik', 'misti',
  'larden', 'lardan', 'lerden',
  'larla', 'lerle', 'larda', 'lerde',
  'acaksin', 'eceksin',
  'iyordu', 'iyormu',
  // 5 harf
  'siniz', 'sunuz', 'miyor', 'muyor', 'müyor',
  'larin', 'lerin',
  'ndan', 'nden',
  'imda', 'inde', 'imde',
  'imin', 'inin', 'imiz', 'iniz',
  'acak', 'ecek',
  'arak', 'erek',
  'iken',
  // 4 harf
  'iyor', 'uyor',
  // 3 harf — ağrıyor=ağrı+yor, geliyor=gel+iyor (iyor zaten üstte)
  'yor',
  'lara', 'lere',
  'lari', 'leri',
  'luk', 'lük',
  'dan', 'den', 'tan', 'ten',
  'nda', 'nde',
  'mak', 'mek',
  'lik',
  'sal', 'sel',
  'mis', 'mus',
  'ken',
  // 3 harf
  'lar', 'ler',
  'da', 'de', 'ta', 'te',
  'im', 'in', 'um', 'un',
  'si', 'su',
  'ma', 'me',
  'ci', 'cu',
  'ip', 'up',
  // 2 harf — minimum kök 5 harf şartıyla (angina→na çıkarmasın, agri→im agresif olmasın)
  'yi', 'yu', 'ya', 'ye',
];

// Uzunluğa göre azalan sırala (garantili)
const ALL_SUFFIXES = [...new Set(ALL_SUFFIX_LIST)]
  .sort((a, b) => b.length - a.length);

export function stemTurkish(word, foldFirst = true) {
  if (!word) return '';
  const source = foldFirst ? foldTurkish(word) : word;
  if (source.length < 4) return source;

  // 2-harf suffix'ler için minimum kök 5 harf (agrim→agr'yi önle, angina→angi'yi önle)
  const SHORT_SUFFIXES = new Set(['im', 'in', 'um', 'un', 'si', 'su', 'ni', 'nu', 'na', 'ne', 'ma', 'me', 'ci', 'cu', 'ip', 'up']);
  // Fiil ekleri için minimum kök 4 harf (tükür+üyorum gibi kısa kökler)
  const VERB_SUFFIXES = new Set(['iyorum', 'uyorum', 'iyor', 'uyor', 'yor', 'miyor', 'muyor']);

  for (const suffix of ALL_SUFFIXES) {
    const minRootLen = SHORT_SUFFIXES.has(suffix)
      ? Math.max(5, suffix.length)
      : VERB_SUFFIXES.has(suffix)
        ? Math.max(4, suffix.length)
        : Math.max(3, suffix.length);

    if (
      source.endsWith(suffix) &&
      source.length - suffix.length >= minRootLen
    ) {
      return source.slice(0, -suffix.length);
    }
  }
  return source;
}

// ─────────────────────────────────────────────
// İki kaynağı birleştir (db.js SYNONYMS + EXTENDED_SYNONYMS)
//
// BUG DÜZELTMESİ: Çok kelimeli varyant öbeklerinde ("su toplaması",
// "damar atması" gibi) anahtar "4+ harfli İLK kelime" seçilerek türetiliyor.
// Bu, jenerik/paylaşılan bir kelimenin (damar, toplaması...) YANLIŞLIKLA
// tek bir semptoma sabitlenmesine yol açabiliyor — "damar" kelimesi hem
// migren hem tansiyon hem damar tıkanıklığı hem anevrizma grubundan talep
// ediliyordu, ilk yazılan (migren) sessizce kazanıyordu. Aşağıdaki
// "claimants" takibi, bir anahtarı BİRDEN FAZLA FARKLI canonical talep
// ederse bunu ÇAKIŞMA sayıp indeksten tamamen çıkarır — hangi grubun
// "doğru sahip" olduğuna karar veremeyeceğimiz için, yanlış birine
// sabitlemektense hiç sabitlememek (düz stem'e düşmek) daha güvenli.
// Ölçüm: tools/measure_synonym_collisions.mjs → 762 anahtardan 133'ü çakışıyordu.
export const _synonymIndexCollisions = [];

function buildSynonymIndex() {
  const index = new Map();
  const claimants = new Map(); // key -> Map(canonical -> [{base, variant}])
  const allSynonyms = { ...SYNONYMS, ...EXTENDED_SYNONYMS };

  const deriveKey = (folded) => folded.includes(' ')
    ? stemTurkish(folded.split(' ').find(t => t.length >= 4) || folded.split(' ')[0], false)
    : stemTurkish(folded, false);

  const recordClaim = (key, canonical, source) => {
    if (!claimants.has(key)) claimants.set(key, new Map());
    const byCanonical = claimants.get(key);
    if (!byCanonical.has(canonical)) byCanonical.set(canonical, []);
    byCanonical.get(canonical).push(source);
    if (!index.has(key)) index.set(key, canonical);
  };

  for (const [base, variants] of Object.entries(allSynonyms)) {
    const foldedBase = foldTurkish(base);
    // Multi-word base'leri (örn. "eklem ağrısı") → ilk anlamlı token'a çöz
    // Böylece 'artralji' → 'eklem' değil, 'eklem' kalır ve single-token karşılaştırma çalışır
    const canonical = deriveKey(foldedBase);

    recordClaim(stemTurkish(foldedBase, false), canonical, { base, variant: '(base)' });

    for (const variant of variants) {
      const foldedVariant = foldTurkish(variant);
      const variantKey = deriveKey(foldedVariant);
      recordClaim(variantKey, canonical, { base, variant });
    }
  }

  _synonymIndexCollisions.length = 0;
  for (const [key, byCanonical] of claimants.entries()) {
    if (byCanonical.size > 1) {
      index.delete(key);
      _synonymIndexCollisions.push({
        key,
        claims: [...byCanonical.entries()].map(([canonical, sources]) => ({ canonical, sources })),
      });
    }
  }

  return index;
}

const SYNONYM_INDEX = buildSynonymIndex();

// ─────────────────────────────────────────────
// 6. GELİŞTİRİLMİŞ TÜRKÇE STEMMER
//    Orijinal: 30 suffix, öncelik yok, min uzunluk yok
//    v2:       80+ suffix, öncelik sıralı, min kök 3 harf
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 7. TOKEN STANDARTLAŞTIRMA
// ─────────────────────────────────────────────

function canonicalizeToken(token, resolveSynonym = true) {
  const folded = foldTurkish(token);
  const stemmed = stemTurkish(folded, false);
  if (!resolveSynonym) return stemmed;
  return SYNONYM_INDEX.get(stemmed) || stemmed;
}

// ─────────────────────────────────────────────
// 8. STOP WORDS (intensifier'lar çıkarıldı)
// ─────────────────────────────────────────────

// Orijinal STOP_WORDS'ten yoğunluk belirteçlerini çıkar
const INTENSIFIER_KEYS = new Set([...INTENSIFIERS.keys()]);

const CLEAN_STOP_WORDS = new Set(
  [...STOP_WORDS].filter(w => !INTENSIFIER_KEYS.has(foldTurkish(w)))
);

const FOLDED_STOP_WORDS = new Set(
  [...CLEAN_STOP_WORDS].map(w => foldTurkish(w))
);
// BUG DÜZELTMESİ: "şu" (işaret sıfatı, stopword) Türkçe katlama sonrası
// (ş→s) "su" (sıvı, gerçek bir içerik kelimesi — "su toplaması" gibi
// önemli semptom ifadelerinde geçiyor) ile birebir çakışıyordu. Bu yüzden
// "su" kelimesi HER YERDE stopword sanılıp sessizce siliniyordu.
// Ölçüm: tools/measure_stopword_collisions.mjs
FOLDED_STOP_WORDS.delete('su');

// ─────────────────────────────────────────────
// 9. TOKENİZASYON
// ─────────────────────────────────────────────

export function tokenize(text) {
  return tokenizeForMatching(text).map(t => t.original).filter(Boolean);
}

function stemEnglish(word) {
  if (word.length < 4) return word;
  const rules = [
    [/aching$/, 'ache'],
    [/ing$/, ''],
    [/ness$/, ''],
    [/tion$/, ''],
    [/ment$/, ''],
    [/ful$/, ''],
    [/less$/, ''],
    [/ous$/, ''],
    [/ive$/, ''],
    [/ly$/, ''],
    [/ed$/, ''],
    [/er$/, ''],
    [/est$/, ''],
    [/s$/, ''],
  ];
  for (const [pattern, replacement] of rules) {
    const stemmed = word.replace(pattern, replacement);
    if (stemmed.length >= 3 && stemmed !== word) return stemmed;
  }
  return word;
}

function isEnglishToken(token) {
  return /^[a-z]+$/.test(token);
}

// Not: tokenizeForMatching, Adım 2'de eklenen keyword-index.js modülünün
// motorla AYNI normalizasyonu (fold + stem + eşanlamlı çözümleme) kullanarak
// indeks kurabilmesi için export edildi. Sadece görünürlük değişti, iç
// mantığa dokunulmadı.
export function tokenizeForMatching(text) {
  const folded = foldTurkish(text);
  if (!folded) return [];
  return folded
    .split(/\s+/)
    .filter(t => t.length > 1 && !FOLDED_STOP_WORDS.has(t))
    .map(token => ({
      original: token,
      stem: isEnglishToken(token) ? stemEnglish(token) : stemTurkish(token, false),
      canonical: canonicalizeToken(token)
    }));
}

// ─────────────────────────────────────────────
// 10. LEVENSHTEIN & FUZZY MATCH
// ─────────────────────────────────────────────

export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Optimize: tek satırlık dp (O(min(m,n)) alan)
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let j = 1; j <= a.length; j++) {
    const curr = [j];
    for (let i = 1; i <= b.length; i++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      curr[i] = Math.min(
        curr[i - 1] + 1,       // silme
        prev[i] + 1,           // ekleme
        prev[i - 1] + cost     // değiştirme
      );
    }
    prev = curr;
  }

  return prev[b.length];
}

// Performans: fuzzyMatch her çağrıda canonicalizeToken'ı sıfırdan hesaplıyordu
// (fold + stem + eşanlamlı çözümleme). compareTokens çağıran tarafta bu değer
// zaten tokenizeForMatching() ile önceden hesaplanıp inputToken.canonical /
// keywordToken.canonical olarak elde mevcut. fuzzyMatchCanonical, aynı
// karşılaştırma mantığını (levenshtein/substring skorlama) DEĞİŞTİRMEDEN,
// önceden hesaplanmış canonical string'leri doğrudan kabul eder — profilde
// canonicalizeToken tek başına JS süresinin ~%61'ini yiyordu, bu fonksiyon
// o tekrarlı hesaplamayı ortadan kaldırır.
function fuzzyMatchCanonical(a, b, maxDistance = 2) {
  if (!a || !b) return { match: false, distance: Infinity, score: 0 };

  if (a === b) return { match: true, distance: 0, score: 1.0 };

  const shorter = Math.min(a.length, b.length);
  const longer = Math.max(a.length, b.length);

  // substring kontrolü: "agr" ⊂ "agri" → match
  if (shorter >= 3 && (a.startsWith(b) || b.startsWith(a))) {
    const score = shorter / longer;
    if (score >= 0.75) return { match: true, distance: 1, score };
  }

  const dist = levenshteinDistance(a, b);
  // Kısa tokenlar için (≤5 harf) mesafe 1'e kadar izin ver
  const allowed = shorter <= 5
    ? Math.min(1, maxDistance)
    : Math.min(maxDistance, Math.max(1, Math.floor(longer / 4)));

  if (longer >= 4 && dist <= allowed) {
    return { match: true, distance: dist, score: 1 - dist / longer };
  }

  return { match: false, distance: dist, score: 0 };
}

// Genel kullanım için dışa açık API — davranışı önceki fuzzyMatch ile
// birebir aynı (canonicalizeToken burada hâlâ çağrılıyor). Sadece
// compareTokens gibi zaten canonical değeri elinde olan sıcak yol,
// fuzzyMatchCanonical'ı doğrudan kullanarak bu hesaplamayı atlıyor.
export function fuzzyMatch(input, target, maxDistance = 2) {
  return fuzzyMatchCanonical(canonicalizeToken(input), canonicalizeToken(target), maxDistance);
}

// ─────────────────────────────────────────────
// 11. TOKEN KARŞILAŞTIRMA
// ─────────────────────────────────────────────

function compareTokens(inputToken, keywordToken) {
  if (inputToken.canonical === keywordToken.canonical) return 1.0;

  // Stem karşılaştırması: sadece yeterince uzun kökler için
  if (
    inputToken.stem === keywordToken.stem &&
    inputToken.stem.length >= 4
  ) return 0.96;

  // 3 harflik tokenlar için sadece exact match — diz/dis, kol/bol gibi çakışmaları önle
  if (inputToken.original.length <= 3 || keywordToken.original.length <= 3) {
    return inputToken.stem === keywordToken.stem ? 0.9 : 0;
  }

  // ESKİ: fuzzyMatch(inputToken.original, keywordToken.original)
  // inputToken.canonical === canonicalizeToken(inputToken.original) olduğu
  // için (tokenizeForMatching bunu böyle üretiyor), bu çağrı önceden
  // hesaplanmış canonical değerleri kullanarak birebir aynı sonucu üretir,
  // sadece canonicalizeToken'ı bir daha çalıştırmaz.
  const direct = fuzzyMatchCanonical(inputToken.canonical, keywordToken.canonical);
  if (direct.match && direct.score >= 0.78) return direct.score;

  // NOT: Burada bilinçli olarak yine fuzzyMatch() (canonicalizeToken'ı TEKRAR
  // uygulayan public fonksiyon) kullanılıyor — stemTurkish tek geçişte tek
  // ek kaldırdığı için, canonical bir string'e ikinci kez canonicalizeToken
  // uygulamak bazı çok-ekli kelimelerde farklı (daha kısa) bir kök üretebilir.
  // Bu ikinci-geçiş davranışı mevcut eşleştirme sonuçlarının bir parçası,
  // bu yüzden burası performans için dokunulmadan bırakıldı.
  const canonical = fuzzyMatch(inputToken.canonical, keywordToken.canonical, 1);
  if (canonical.match && canonical.score >= 0.82) return canonical.score * 0.95;

  return 0;
}

function minimumCoverage(keywordLength) {
  if (keywordLength <= 1) return 1.0;
  if (keywordLength === 2) return 1.0;
  return 0.67;
}

// ─────────────────────────────────────────────
// 12. ANA EŞLEŞTIRME FONKSİYONU
//     Sıra bağımsız + geliştirilmiş skor hesabı
// ─────────────────────────────────────────────

// ── Performans: statik anahtar kelime önbelleği ──────────
// Semptom veritabanı sabittir (kullanıcı etkileşimiyle değişmez), ama
// matchKeywords() her çağrıldığında binlerce anahtar kelimeyi sıfırdan
// tokenize ediyordu. Veritabanı büyüdükçe (özellikle 142 semptomun
// anahtar kelime listeleri zenginleştirildikten sonra) bu, her analizi
// gözle görülür şekilde yavaşlattı. Çözüm: aynı keyword dizisi için
// tokenize sonucunu bir kere hesaplayıp WeakMap'te saklamak — algoritma
// veya eşleşme mantığı hiç değişmiyor, sadece tekrar eden iş tekrar
// hesaplanmıyor.
const _keywordTokenCache = new WeakMap();

function computeVariantSet(tokens) {
  // buildIndex() (keyword-index.js) ile BİREBİR aynı formül: canonical'ın
  // silme-komşuluğu + (varsa) uzun ve farklı bir stem. Symptom-seviyesi
  // indeksle matematiksel olarak tutarlı kalması için aynı formül.
  const set = new Set();
  for (const t of tokens) {
    if (!t.canonical) continue;
    for (const v of deleteNeighborhood(t.canonical)) set.add(v);
    if (t.stem && t.stem.length >= 4 && t.stem !== t.canonical) set.add(t.stem);
  }
  return set;
}

function intersectionEmpty(a, b) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const v of small) {
    if (large.has(v)) return false;
  }
  return true;
}

function getCachedKeywordData(keywords) {
  let cached = _keywordTokenCache.get(keywords);
  if (cached) return cached;
  cached = keywords.map(keyword => {
    const normalized = foldTurkish(keyword);
    // Performans: bu regex matchKeywords() içinde her çağrıda yeniden
    // derleniyordu (binlerce keyword × her analiz). normalizedKeyword sabit
    // olduğu için burada bir kere derleyip saklamak yeterli — davranış aynı,
    // sadece derleme (compile) maliyeti tekrarlanmıyor.
    const exactPattern = normalized.length >= 4
      ? new RegExp(`(^|\\s)${escapeRegex(normalized)}($|\\s)`)
      : null;
    const tokens = tokenizeForMatching(keyword);
    return {
      keyword,
      normalized,
      tokens,
      exactPattern,
      variantSet: computeVariantSet(tokens),
    };
  });
  _keywordTokenCache.set(keywords, cached);
  return cached;
}

// ─────────────────────────────────────────────────────────────────
// GÖLGE MOD — keyword-seviyesi ön-filtre doğrulaması
// ─────────────────────────────────────────────────────────────────
// getCandidateSymptomIds() SEMPTOM seviyesinde daraltıyor ama bir aday
// semptomun ~100 keyword'ünün TAMAMI yine de taranıyordu — asıl maliyet
// burada. Bu da AYNI silme-komşuluğu tekniğiyle KEYWORD seviyesinde bir
// ön-filtre: girdiyle hiçbir ortak varyantı olmayan keyword'ler nested-loop
// taramaya hiç girmeden atlanabilir.
//
// Bunu DOĞRUDAN gerçek yola koymak yerine, matchKeywords() şu an iki
// "en iyi skor" takipçisini PARALEL tutuyor: (1) exhaustive — mevcut/gerçek
// davranış, dönen sonuç budur, HİÇ DEĞİŞMEDİ; (2) filtered — sadece
// filtreyi geçen keyword'leri sayan gölge kanal. İkisi arasında fark
// (matched/score/keyword) varsa _shadowMismatches'e kaydediliyor.
// Doğrulama script'i: tools/keyword_filter_shadow_check.mjs
// Fark yoksa (bkz. o script'in raporu), filtreyi gerçek yol yapmak
// güvenli demektir — o zamana kadar dönen sonuca etkisi SIFIR.
export const _shadowMismatches = [];
export function _resetShadowMismatches() { _shadowMismatches.length = 0; }

export function matchKeywords(inputText, keywords) {
  const normalizedInput = foldTurkish(inputText);
  const inputTokens = tokenizeForMatching(inputText);

  if (!normalizedInput || inputTokens.length === 0) {
    return { matched: false, score: 0, keyword: null };
  }

  let bestScore = 0;
  let bestKeyword = null;

  // Gölge kanal — sadece filtreyi geçen keyword'lerin en iyisi
  let bestScoreFiltered = 0;
  let bestKeywordFiltered = null;
  const inputVariantSet = computeVariantSet(inputTokens);

  const keywordData = getCachedKeywordData(keywords);

  for (const { keyword, normalized: normalizedKeyword, tokens: keywordTokens, exactPattern, variantSet } of keywordData) {
    if (!normalizedKeyword || keywordTokens.length === 0) continue;

    // ── Hızlı tam eşleşme ──────────────────────
    if (exactPattern && exactPattern.test(normalizedInput)) {
      const score = normalizedKeyword === normalizedInput ? 1.0 : 0.98;
      if (score > bestScore) { bestScore = score; bestKeyword = keyword; }
      if (score > bestScoreFiltered) { bestScoreFiltered = score; bestKeywordFiltered = keyword; }
      continue;
    }

    const passesFilter = !intersectionEmpty(variantSet, inputVariantSet);

    // ── Sıra bağımsız token eşleştirme ─────────
    // Her keyword token için input token havuzunda en iyi eşi bul
    const matchedScores = [];
    const usedInputIndices = new Set();

    for (const kToken of keywordTokens) {
      let tokenBest = 0;
      let bestIdx = -1;

      for (let i = 0; i < inputTokens.length; i++) {
        if (usedInputIndices.has(i)) continue;
        const s = compareTokens(inputTokens[i], kToken);
        if (s > tokenBest) { tokenBest = s; bestIdx = i; }
      }

      if (tokenBest >= 0.78) {
        matchedScores.push(tokenBest);
        if (bestIdx !== -1) usedInputIndices.add(bestIdx);
      }
    }

    const coverage = matchedScores.length / keywordTokens.length;
    if (coverage < minimumCoverage(keywordTokens.length)) continue;

    const avgTokenScore =
      matchedScores.reduce((s, v) => s + v, 0) / matchedScores.length;
    const compactPenalty = keywordTokens.length > inputTokens.length ? 0.92 : 1;
    const finalScore = (coverage * 0.65 + avgTokenScore * 0.35) * compactPenalty;

    if (finalScore > bestScore) { bestScore = finalScore; bestKeyword = keyword; }
    if (passesFilter && finalScore > bestScoreFiltered) { bestScoreFiltered = finalScore; bestKeywordFiltered = keyword; }
  }

  const result = {
    matched: bestScore >= 0.78,
    score: Number(bestScore.toFixed(3)),
    keyword: bestKeyword
  };

  const filteredResult = {
    matched: bestScoreFiltered >= 0.78,
    score: Number(bestScoreFiltered.toFixed(3)),
    keyword: bestKeywordFiltered
  };
  if (
    filteredResult.matched !== result.matched ||
    filteredResult.keyword !== result.keyword ||
    Math.abs(filteredResult.score - result.score) > 0.0001
  ) {
    _shadowMismatches.push({ inputText, exhaustive: result, filtered: filteredResult });
  }

  return result;
}

// ─────────────────────────────────────────────
// YARDIMCI
// ─────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}