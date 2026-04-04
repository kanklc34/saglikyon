// ============================================
// SağlıkYön v2 – Ana Analiz Motoru
// Katmanlı semptom analizi, acil durum tespiti,
// departman skorlama ve akıllı soru sistemi
// ============================================

import { SYMPTOM_DATABASE, DEPARTMENTS, EMERGENCY_RULES, FOLLOW_UP_TEMPLATES } from './symptom-db.js';
import { preprocessText, matchKeywords, tokenize } from './nlp.js';

// ============================================
// ANA ANALİZ FONKSİYONU
// ============================================

export function analyzeSymptoms(inputText, previousAnswers = null) {
  if (!inputText || inputText.trim().length < 5) {
    return { error: 'Lütfen şikayetinizi en az 5 karakter ile açıklayın.' };
  }

  // 1. Semptomları çıkar
  const extractedSymptoms = extractSymptoms(inputText);
  
  if (extractedSymptoms.length === 0) {
    return {
      error: null,
      noMatch: true,
      message: 'Şikayetinizi anlayamadım. Lütfen daha detaylı açıklayın veya vücut haritasını kullanın.',
      suggestion: 'Örnek: "Başım ağrıyor ve bulantı var" veya "Göğsümde ağrı hissediyorum"'
    };
  }

  // 2. Acil durum kontrolü
  const emergencyCheck = checkEmergency(extractedSymptoms);
  if (emergencyCheck.isEmergency) {
    return {
      isEmergency: true,
      emergencyMessage: emergencyCheck.message,
      emergencyName: emergencyCheck.name,
      matchedSymptoms: extractedSymptoms.map(s => s.id)
    };
  }

  // 3. Akıllı sorular gerekiyor mu?
  if (!previousAnswers) {
    const followUpQuestions = generateFollowUpQuestions(extractedSymptoms);
    if (followUpQuestions.length > 0) {
      return {
        needsMoreInfo: true,
        followUpQuestions: followUpQuestions,
        matchedSymptoms: extractedSymptoms.map(s => s.id),
        primarySymptom: extractedSymptoms[0].id
      };
    }
  }

  // 4. Departman skorlama
  const scores = calculateDepartmentScores(extractedSymptoms, previousAnswers);

  // 5. Sonuç üret
  return buildResult(scores, extractedSymptoms);
}

// ============================================
// SEMPTOM ÇIKARMA
// ============================================

function extractSymptoms(inputText) {
  const matched = [];

  for (const symptom of SYMPTOM_DATABASE) {
    const result = matchKeywords(inputText, symptom.keywords);
    
    if (result.matched) {
      matched.push({
        ...symptom,
        matchScore: result.score,
        matchedKeyword: result.keyword
      });
    }
  }

  // Skor sırasına göre sırala
  matched.sort((a, b) => b.matchScore - a.matchScore);
  
  return matched;
}

// ============================================
// ACİL DURUM TESPİTİ
// ============================================

function checkEmergency(extractedSymptoms) {
  const symptomIds = new Set(extractedSymptoms.map(s => s.id));
  
  // Tek başına yüksek urgency (9-10) olan semptomlar
  for (const symptom of extractedSymptoms) {
    if (symptom.urgency >= 9) {
      return {
        isEmergency: true,
        message: `⚠️ ACİL DURUM! ${symptom.keywords[0]} ciddi bir duruma işaret edebilir. Hemen 112'yi arayın veya en yakın acil servise gidin!`,
        name: symptom.id
      };
    }
  }

  // Kombinasyon bazlı acil durum kontrolü
  for (const rule of EMERGENCY_RULES) {
    const requiredMatch = rule.requiredAny.some(id => symptomIds.has(id));
    if (!requiredMatch) continue;

    const boostMatches = rule.boostIf.filter(id => symptomIds.has(id)).length;
    const totalMatches = (requiredMatch ? 1 : 0) + boostMatches;

    if (totalMatches >= rule.minMatch) {
      return {
        isEmergency: true,
        message: rule.message,
        name: rule.name
      };
    }
  }

  return { isEmergency: false };
}

// ============================================
// AKILLI SORU ÜRETİMİ
// ============================================

function generateFollowUpQuestions(extractedSymptoms) {
  const questions = [];
  const addedQuestions = new Set();

  for (const symptom of extractedSymptoms) {
    if (!symptom.followUp) continue;

    const templates = FOLLOW_UP_TEMPLATES[symptom.id];
    if (!templates) continue;

    for (const template of templates) {
      if (!addedQuestions.has(template.question)) {
        questions.push({
          question: template.question,
          symptomId: symptom.id,
          impact: template.impact,
          urgent: template.urgent || false
        });
        addedQuestions.add(template.question);
      }
    }
  }

  // En fazla 4 soru döndür
  return questions.slice(0, 4);
}

// ============================================
// DEPARTMAN SKORLAMA
// ============================================

function calculateDepartmentScores(extractedSymptoms, previousAnswers) {
  const scores = {};

  // Tüm departmanları sıfırla
  for (const deptId of Object.keys(DEPARTMENTS)) {
    scores[deptId] = 0;
  }

  // Ana semptom skorları
  for (const symptom of extractedSymptoms) {
    const weight = symptom.matchScore;
    
    for (const [deptId, deptScore] of Object.entries(symptom.departments)) {
      if (!scores[deptId]) scores[deptId] = 0;
      scores[deptId] += deptScore * weight;
    }
  }

  // Follow-up cevapları varsa, ek puanlar
  if (previousAnswers && Array.isArray(previousAnswers)) {
    for (const answer of previousAnswers) {
      if (answer.answer === 'Evet' && answer.impact) {
        for (const [deptId, boost] of Object.entries(answer.impact)) {
          if (!scores[deptId]) scores[deptId] = 0;
          scores[deptId] += boost;
        }
      }
    }
  }

  // Birden fazla semptom aynı departmanı gösteriyorsa bonus
  const deptSymptomCount = {};
  for (const symptom of extractedSymptoms) {
    for (const deptId of Object.keys(symptom.departments)) {
      deptSymptomCount[deptId] = (deptSymptomCount[deptId] || 0) + 1;
    }
  }

  for (const [deptId, count] of Object.entries(deptSymptomCount)) {
    if (count >= 2) {
      scores[deptId] *= 1 + (count - 1) * 0.15; // her ek semptom %15 bonus
    }
  }

  return scores;
}

// ============================================
// SONUÇ OLUŞTURMA
// ============================================

function buildResult(scores, extractedSymptoms) {
  // Skorları sırala
  const sorted = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return {
      error: null,
      noMatch: true,
      message: 'Şikayetinize uygun bir bölüm bulunamadı. Lütfen aile hekiminize danışın.'
    };
  }

  const [primaryDeptId, primaryScore] = sorted[0];
  const maxPossibleScore = extractedSymptoms.length * 1.0;
  const normalizedScore = Math.min(primaryScore / Math.max(maxPossibleScore, 0.5), 1.0);

  // Güven skoru
  let confidence;
  if (normalizedScore >= 0.6) confidence = 'high';
  else if (normalizedScore >= 0.35) confidence = 'medium';
  else confidence = 'low';

  // Alternatif departmanlar
  const alternatives = sorted
    .slice(1, 4)
    .filter(([_, score]) => score > primaryScore * 0.3)
    .map(([id]) => id);

  // Aile hekimi kontrolü – basit şikayetler
  const avgUrgency = extractedSymptoms.reduce((sum, s) => sum + s.urgency, 0) / extractedSymptoms.length;
  const isFamilyDoctor = primaryDeptId === 'aile_hekimi' || (avgUrgency <= 3 && confidence !== 'high');

  // Açıklama oluştur
  const reasoning = generateReasoning(extractedSymptoms, primaryDeptId);

  const primaryDept = DEPARTMENTS[primaryDeptId];

  return {
    isEmergency: false,
    needsMoreInfo: false,
    primaryDepartment: primaryDeptId,
    primaryDepartmentName: primaryDept ? primaryDept.name : primaryDeptId,
    primaryDepartmentIcon: primaryDept ? primaryDept.icon : '🏥',
    primaryDepartmentColor: primaryDept ? primaryDept.color : '#667eea',
    confidence,
    confidenceScore: Math.round(normalizedScore * 100),
    alternatives: alternatives.map(id => ({
      id,
      name: DEPARTMENTS[id]?.name || id,
      icon: DEPARTMENTS[id]?.icon || '🏥'
    })),
    isFamilyDoctor,
    familyDoctorMessage: isFamilyDoctor 
      ? 'Bu şikayetiniz için hastaneye gitmenize gerek olmayabilir. Aile hekiminiz size yardımcı olabilir. Daha hızlı ve kolay!' 
      : null,
    reasoning,
    matchedSymptoms: extractedSymptoms.map(s => ({
      id: s.id,
      keyword: s.matchedKeyword,
      score: Math.round(s.matchScore * 100)
    })),
    note: 'Bu öneri teşhis değildir. Kesin tanı için mutlaka doktor muayenesi gereklidir.',
    timestamp: new Date().toISOString()
  };
}

// ============================================
// AÇIKLAMA OLUŞTURMA
// ============================================

function generateReasoning(symptoms, primaryDeptId) {
  const symptomNames = symptoms.map(s => s.matchedKeyword || s.keywords[0]);
  const deptName = DEPARTMENTS[primaryDeptId]?.name || primaryDeptId;

  if (symptoms.length === 1) {
    return `"${symptomNames[0]}" şikayetiniz için en uygun bölüm ${deptName} olarak belirlendi.`;
  }

  const joinedSymptoms = symptomNames.slice(0, 3).join(', ');
  return `${joinedSymptoms} şikayetleriniz birlikte değerlendirildiğinde, ${deptName} bölümüne başvurmanız önerilmektedir.`;
}

// ============================================
// EXPORT: Tüm departmanlar ve analiz fonksiyonu
// ============================================

export { DEPARTMENTS, SYMPTOM_DATABASE };
