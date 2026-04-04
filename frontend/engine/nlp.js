// ============================================
// SağlıkYön v2 – Türkçe NLP Modülü
// Metin ön işleme, fuzzy matching, stemming
// ============================================

import { STOP_WORDS, SYNONYMS } from './symptom-db.js';

// ============================================
// METİN ÖN İŞLEME
// ============================================

export function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';
  
  let processed = text
    .toLowerCase()
    .replace(/[.,!?;:'"()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Türkçe karakter normalizasyonu
  processed = normalizeTurkish(processed);
  
  return processed;
}

function normalizeTurkish(text) {
  // Yaygın yazım hatalarını düzelt
  const corrections = {
    'agri': 'ağrı', 'agrı': 'ağrı', 'agrı': 'ağrı',
    'bas': 'baş', 'basım': 'başım',
    'gogus': 'göğüs', 'gogüs': 'göğüs', 'gögüs': 'göğüs',
    'karin': 'karın', 'karım': 'karın',
    'ates': 'ateş', 'ates': 'ateş',
    'oksuruk': 'öksürük', 'öksüruk': 'öksürük',
    'bulanti': 'bulantı', 'bulantı': 'bulantı',
    'ishal': 'ishal',
    'kusma': 'kusma',
    'nefes': 'nefes',
    'carpinti': 'çarpıntı', 'çarpıntı': 'çarpıntı',
    'sislik': 'şişlik', 'şişlik': 'şişlik',
    'kasinti': 'kaşıntı', 'kaşıntı': 'kaşıntı',
    'yorgunluk': 'yorgunluk',
    'uykusuzluk': 'uykusuzluk',
    'migren': 'migren',
    'vertigo': 'vertigo',
    'tansiyon': 'tansiyon',
    'diyabet': 'diyabet', 'seker': 'şeker',
    'reflü': 'reflü', 'reflu': 'reflü',
    'hemoroid': 'hemoroid', 'basur': 'basur',
    'tiroid': 'tiroid', 'guatr': 'guatr'
  };
  
  let result = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${escapeRegex(wrong)}\\b`, 'gi');
    result = result.replace(regex, correct);
  }
  return result;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// KELİME AYIRMA & STOP-WORD TEMİZLİĞİ
// ============================================

export function tokenize(text) {
  const processed = preprocessText(text);
  if (!processed) return [];

  const words = processed.split(/\s+/);
  return words.filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

// ============================================
// FUZZY MATCHING (Levenshtein Mesafesi)
// Yazım hatalarına tolerans
// ============================================

export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // silme
        matrix[i][j - 1] + 1,      // ekleme
        matrix[i - 1][j - 1] + cost // değiştirme
      );
    }
  }

  return matrix[b.length][a.length];
}

export function fuzzyMatch(input, target, maxDistance = 2) {
  // Tam eşleşme
  if (input === target) return { match: true, distance: 0, score: 1.0 };
  
  // İçerme kontrolü
  if (target.includes(input) || input.includes(target)) {
    return { match: true, distance: 0, score: 0.95 };
  }

  // Levenshtein mesafesi
  const distance = levenshteinDistance(input, target);
  const maxLen = Math.max(input.length, target.length);
  
  if (distance <= maxDistance && maxLen > 3) {
    const score = 1 - (distance / maxLen);
    return { match: true, distance, score };
  }

  return { match: false, distance, score: 0 };
}

// ============================================
// ANAHTAR KELİME EŞLEŞTİRME
// Bir metnin belirli keyword listesiyle eşleşip eşleşmediğini kontrol et
// ============================================

export function matchKeywords(inputText, keywords) {
  const processed = preprocessText(inputText);
  let bestScore = 0;
  let bestKeyword = null;

  for (const keyword of keywords) {
    const processedKeyword = preprocessText(keyword);
    
    // 1. Tam içerme kontrolü (en güçlü)
    if (processed.includes(processedKeyword)) {
      const score = processedKeyword.length / processed.length;
      const finalScore = Math.min(1.0, 0.7 + score * 0.3);
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestKeyword = keyword;
      }
      continue;
    }

    // 2. Kelime bazlı eşleştirme
    const keywordWords = processedKeyword.split(/\s+/);
    const inputWords = processed.split(/\s+/);
    let matchedWords = 0;

    for (const kw of keywordWords) {
      for (const iw of inputWords) {
        const result = fuzzyMatch(iw, kw);
        if (result.match) {
          matchedWords++;
          break;
        }
      }
    }

    if (matchedWords > 0) {
      const ratio = matchedWords / keywordWords.length;
      if (ratio > 0.5 && ratio > bestScore) {
        bestScore = ratio * 0.8; // kelime eşleşmesi biraz düşük skorlu
        bestKeyword = keyword;
      }
    }

    // 3. Eşanlamlı kelime kontrolü
    for (const iw of inputWords) {
      for (const [base, synonymList] of Object.entries(SYNONYMS)) {
        const allForms = [base, ...synonymList];
        const inputInSynonyms = allForms.some(s => fuzzyMatch(iw, s).match);
        
        if (inputInSynonyms) {
          for (const kw of keywordWords) {
            const keywordInSynonyms = allForms.some(s => fuzzyMatch(kw, s).match);
            if (keywordInSynonyms) {
              const score = 0.6;
              if (score > bestScore) {
                bestScore = score;
                bestKeyword = keyword;
              }
            }
          }
        }
      }
    }
  }

  return { matched: bestScore > 0.3, score: bestScore, keyword: bestKeyword };
}

// ============================================
// BASİT TÜRKÇE STEMMING
// Yaygın ekleri kaldır
// ============================================

export function stemTurkish(word) {
  if (!word || word.length < 4) return word;

  const suffixes = [
    'ları', 'leri', 'ıyor', 'iyor', 'uyor', 'üyor',
    'mış', 'miş', 'muş', 'müş',
    'yor', 'yor', 'dır', 'dir', 'dur', 'dür',
    'dan', 'den', 'tan', 'ten',
    'lar', 'ler', 'ım', 'im', 'um', 'üm',
    'ın', 'in', 'un', 'ün',
    'da', 'de', 'ta', 'te',
    'mı', 'mi', 'mu', 'mü',
    'la', 'le', 'sı', 'si'
  ];

  let stem = word;
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix) && stem.length - suffix.length >= 3) {
      stem = stem.slice(0, -suffix.length);
      break;
    }
  }

  return stem;
}
