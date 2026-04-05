// ============================================
// SağlıkYön - Türkçe NLP modülü
// Metin ön işleme, fuzzy matching ve seçici semptom eşleştirme
// ============================================

import { STOP_WORDS, SYNONYMS } from './symptom-db.js';

const TURKISH_FOLD_MAP = {
  c: /[ç]/g,
  g: /[ğ]/g,
  i: /[ıiİ]/g,
  o: /[ö]/g,
  s: /[ş]/g,
  u: /[ü]/g
};

const FOLDED_STOP_WORDS = new Set(
  [...STOP_WORDS].map(word => foldTurkish(word))
);

const SYNONYM_INDEX = new Map();

for (const [base, variants] of Object.entries(SYNONYMS)) {
  const foldedBase = canonicalizeToken(base, false);
  SYNONYM_INDEX.set(foldedBase, foldedBase);

  for (const variant of variants) {
    SYNONYM_INDEX.set(canonicalizeToken(variant, false), foldedBase);
  }
}

// ============================================
// METIN ON ISLEME
// ============================================

export function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .replace(/[.,!?;:'"`()[\]{}<>/+*=_%#@^~\\|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeForSearch(text) {
  return foldTurkish(text);
}

function foldTurkish(text) {
  let folded = preprocessText(text);

  for (const [replacement, pattern] of Object.entries(TURKISH_FOLD_MAP)) {
    folded = folded.replace(pattern, replacement);
  }

  return folded;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// KELIME AYIRMA
// ============================================

export function tokenize(text) {
  return tokenizeForMatching(text)
    .map(token => token.original)
    .filter(Boolean);
}

function tokenizeForMatching(text) {
  const folded = foldTurkish(text);
  if (!folded) return [];

  return folded
    .split(/\s+/)
    .filter(token => token.length > 1 && !FOLDED_STOP_WORDS.has(token))
    .map(token => ({
      original: token,
      stem: stemTurkish(token),
      canonical: canonicalizeToken(token)
    }));
}

function canonicalizeToken(token, resolveSynonym = true) {
  const folded = foldTurkish(token);
  const stemmed = stemTurkish(folded, false);

  if (!resolveSynonym) {
    return stemmed;
  }

  return SYNONYM_INDEX.get(stemmed) || stemmed;
}

// ============================================
// FUZZY MATCHING
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
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

export function fuzzyMatch(input, target, maxDistance = 2) {
  const normalizedInput = canonicalizeToken(input);
  const normalizedTarget = canonicalizeToken(target);

  if (!normalizedInput || !normalizedTarget) {
    return { match: false, distance: Infinity, score: 0 };
  }

  if (normalizedInput === normalizedTarget) {
    return { match: true, distance: 0, score: 1 };
  }

  const shorterLength = Math.min(normalizedInput.length, normalizedTarget.length);
  if (
    shorterLength >= 4 &&
    (normalizedInput.includes(normalizedTarget) || normalizedTarget.includes(normalizedInput))
  ) {
    return { match: true, distance: 1, score: 0.9 };
  }

  const distance = levenshteinDistance(normalizedInput, normalizedTarget);
  const maxLen = Math.max(normalizedInput.length, normalizedTarget.length);
  const allowedDistance = Math.min(maxDistance, Math.max(1, Math.floor(maxLen / 4)));

  if (maxLen >= 4 && distance <= allowedDistance) {
    const score = 1 - distance / maxLen;
    return { match: true, distance, score };
  }

  return { match: false, distance, score: 0 };
}

function compareTokens(inputToken, keywordToken) {
  if (inputToken.canonical === keywordToken.canonical) return 1;
  if (inputToken.stem === keywordToken.stem) return 0.96;

  const direct = fuzzyMatch(inputToken.original, keywordToken.original);
  if (direct.match && direct.score >= 0.84) {
    return direct.score;
  }

  const canonical = fuzzyMatch(inputToken.canonical, keywordToken.canonical, 1);
  if (canonical.match && canonical.score >= 0.88) {
    return canonical.score * 0.95;
  }

  return 0;
}

function minimumCoverage(keywordLength) {
  if (keywordLength <= 1) return 1;
  if (keywordLength === 2) return 1;
  return 0.67;
}

// ============================================
// ANAHTAR KELIME ESLESTIRME
// ============================================

export function matchKeywords(inputText, keywords) {
  const normalizedInput = foldTurkish(inputText);
  const inputTokens = tokenizeForMatching(inputText);

  if (!normalizedInput || inputTokens.length === 0) {
    return { matched: false, score: 0, keyword: null };
  }

  let bestScore = 0;
  let bestKeyword = null;

  for (const keyword of keywords) {
    const normalizedKeyword = foldTurkish(keyword);
    const keywordTokens = tokenizeForMatching(keyword);

    if (!normalizedKeyword || keywordTokens.length === 0) continue;

    if (
      normalizedKeyword.length >= 4 &&
      new RegExp(`(^|\\s)${escapeRegex(normalizedKeyword)}($|\\s)`).test(normalizedInput)
    ) {
      const score = normalizedKeyword === normalizedInput ? 1 : 0.98;
      if (score > bestScore) {
        bestScore = score;
        bestKeyword = keyword;
      }
      continue;
    }

    const matchedScores = [];

    for (const keywordToken of keywordTokens) {
      let tokenBestScore = 0;

      for (const inputToken of inputTokens) {
        tokenBestScore = Math.max(tokenBestScore, compareTokens(inputToken, keywordToken));
      }

      if (tokenBestScore >= 0.84) {
        matchedScores.push(tokenBestScore);
      }
    }

    const coverage = matchedScores.length / keywordTokens.length;
    if (coverage < minimumCoverage(keywordTokens.length)) continue;

    const averageTokenScore =
      matchedScores.reduce((sum, score) => sum + score, 0) / matchedScores.length;
    const compactInputPenalty = keywordTokens.length > inputTokens.length ? 0.92 : 1;
    const finalScore = (coverage * 0.65 + averageTokenScore * 0.35) * compactInputPenalty;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestKeyword = keyword;
    }
  }

  return {
    matched: bestScore >= 0.78,
    score: Number(bestScore.toFixed(3)),
    keyword: bestKeyword
  };
}

// ============================================
// BASIT TURKCE STEMMING
// ============================================

export function stemTurkish(word, foldFirst = true) {
  if (!word) return '';

  const source = foldFirst ? foldTurkish(word) : word;
  if (source.length < 4) return source;

  const suffixes = [
    'siniz', 'siniz', 'lari', 'leri',
    'iyor', 'uyor', 'mis', 'mus',
    'dir', 'dur', 'dan', 'den', 'tan', 'ten',
    'lar', 'ler', 'lik', 'luk',
    'yor', 'mak', 'mek',
    'im', 'in', 'um', 'un',
    'si', 'su', 'yi', 'yu',
    'da', 'de', 'ta', 'te',
    'ma', 'me'
  ];

  for (const suffix of suffixes) {
    if (source.endsWith(suffix) && source.length - suffix.length >= 3) {
      return source.slice(0, -suffix.length);
    }
  }

  return source;
}
