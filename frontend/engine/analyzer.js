// ============================================
// SağlıkYön - Geliştirilmiş analiz motoru
// Daha seçici eşleştirme, katmanlı aciliyet ve daha net bölüm önerisi
// ============================================

import { SYMPTOM_DATABASE, DEPARTMENTS, FOLLOW_UP_TEMPLATES } from './symptom-db.js';
import { matchKeywords, normalizeForSearch } from './nlp.js';

const IMMEDIATE_RED_FLAG_IDS = new Set([
  'felc',
  'gorme_kaybi',
  'hemoptizi',
  'bayilma',
  'nöbet'
]);

const HIGH_RISK_IDS = new Set([
  'gogus_agrisi',
  'nefes_darligi',
  'sag_alt_karin',
  'kanli_diski',
  'sarilik',
  'bobrek_agrisi'
]);

const CARE_LEVELS = {
  emergency: {
    label: 'Acil yardım gerekebilir',
    summary: 'Belirtiler acil müdahale gerektirebilir.',
    advice: '112 ile iletişime geçin veya en yakın acil servise başvurun.'
  },
  urgent: {
    label: 'Aynı gün değerlendirme iyi olur',
    summary: 'Belirtileriniz aynı gün doktor tarafından değerlendirilmelidir.',
    advice: 'Mümkünse bugün içinde acil servis veya ilgili branşa başvurun.'
  },
  soon: {
    label: 'Kısa sürede randevu alın',
    summary: 'Belirtileriniz acil görünmüyor ancak geciktirilmemeli.',
    advice: 'İlgili bölümden yakın tarihe randevu almanız uygun olur.'
  },
  routine: {
    label: 'Rutin poliklinik uygun',
    summary: 'Belirtileriniz poliklinik veya aile hekimi düzeyinde görünüyor.',
    advice: 'Uygun ilk randevuda ilgili bölüme veya aile hekiminize başvurabilirsiniz.'
  }
};

// ============================================
// ANA ANALİZ FONKSİYONU
// ============================================

export function analyzeSymptoms(inputText, previousAnswers = null) {
  if (!inputText || inputText.trim().length < 5) {
    return { error: 'Lütfen şikayetinizi en az 5 karakter ile açıklayın.' };
  }

  const extractedSymptoms = extractSymptoms(inputText);

  if (extractedSymptoms.length === 0) {
    return {
      error: null,
      noMatch: true,
      message: 'Şikayetinizi yeterince net anlayamadım. Lütfen daha detaylı yazın veya vücut haritasından destek alın.',
      suggestion: 'Örnek: "Başım ağrıyor ve mide bulantım var" veya "Göğsümde baskı hissediyorum".'
    };
  }

  const immediateEmergency = checkImmediateEmergency(extractedSymptoms);
  if (immediateEmergency.isEmergency) {
    return {
      isEmergency: true,
      emergencyMessage: immediateEmergency.message,
      emergencyName: immediateEmergency.name,
      matchedSymptoms: extractedSymptoms.map(symptom => symptom.id)
    };
  }

  const triage = evaluateTriage(extractedSymptoms, previousAnswers);
  if (triage.isEmergency) {
    return {
      isEmergency: true,
      emergencyMessage: triage.message,
      emergencyName: triage.name,
      matchedSymptoms: extractedSymptoms.map(symptom => symptom.id)
    };
  }

  if (!previousAnswers) {
    const followUpQuestions = generateFollowUpQuestions(extractedSymptoms);

    if (followUpQuestions.length > 0) {
      return {
        needsMoreInfo: true,
        followUpQuestions,
        matchedSymptoms: extractedSymptoms.map(symptom => symptom.id),
        primarySymptom: extractedSymptoms[0].id
      };
    }
  }

  const scores = calculateDepartmentScores(extractedSymptoms, previousAnswers);
  return buildResult(scores, extractedSymptoms, triage);
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

  if (matched.length === 0) return [];

  matched.sort((left, right) => right.matchScore - left.matchScore);

  const topScore = matched[0].matchScore;
  const threshold = Math.max(0.78, topScore * 0.72);

  return matched
    .filter((symptom, index) => symptom.matchScore >= threshold || (index < 2 && symptom.matchScore >= 0.76))
    .slice(0, 6);
}

// ============================================
// ACİL DURUM TESPİTİ
// ============================================

function checkImmediateEmergency(extractedSymptoms) {
  const symptomIds = new Set(extractedSymptoms.map(symptom => symptom.id));

  for (const symptom of extractedSymptoms) {
    if (IMMEDIATE_RED_FLAG_IDS.has(symptom.id) && symptom.matchScore >= 0.86) {
      return {
        isEmergency: true,
        name: symptom.id,
        message: buildImmediateEmergencyMessage(symptom.id, symptom.matchedKeyword || symptom.keywords[0])
      };
    }
  }

  const strongChestAlarm =
    symptomIds.has('gogus_agrisi') &&
    symptomIds.has('nefes_darligi') &&
    (symptomIds.has('kol_agrisi') || symptomIds.has('terleme') || symptomIds.has('kalp_carpintisi'));

  if (strongChestAlarm) {
    return {
      isEmergency: true,
      name: 'olasi_kalp_krizi',
      message: 'Göğüs ağrısı, nefes darlığı ve eşlik eden belirtiler acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.'
    };
  }

  const respiratoryAlarm = symptomIds.has('nefes_darligi') && symptomIds.has('hemoptizi');
  if (respiratoryAlarm) {
    return {
      isEmergency: true,
      name: 'ciddi_solunum_sorunu',
      message: 'Nefes darlığı ve kanlı balgam birlikte ciddi bir tabloya işaret edebilir. Hemen 112 ile iletişime geçin.'
    };
  }

  return { isEmergency: false };
}

function buildImmediateEmergencyMessage(symptomId, matchedKeyword) {
  const label = matchedKeyword || symptomId;

  if (symptomId === 'felc') {
    return `Ani felç veya konuşma kaybı benzeri "${label}" belirtisi acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.`;
  }

  if (symptomId === 'gorme_kaybi') {
    return `Ani gelişen "${label}" durumu acil değerlendirme gerektirir. Hemen 112 ile iletişime geçin veya acil servise başvurun.`;
  }

  if (symptomId === 'hemoptizi') {
    return `"${label}" ciddi bir tabloya işaret edebilir. Hemen acil destek alın.`;
  }

  if (symptomId === 'bayilma' || symptomId === 'nöbet') {
    return `"${label}" acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.`;
  }

  return `"${label}" ciddi bir duruma işaret edebilir. Hemen 112 ile iletişime geçin veya acil servise başvurun.`;
}

// ============================================
// TAKİP SORULARI
// ============================================

function generateFollowUpQuestions(extractedSymptoms) {
  const questions = [];
  const addedQuestions = new Set();

  const prioritizedSymptoms = extractedSymptoms
    .filter((symptom, index) => index < 2 || symptom.urgency >= 7)
    .sort((left, right) => right.urgency - left.urgency);

  for (const symptom of prioritizedSymptoms) {
    if (!symptom.followUp) continue;

    const templates = FOLLOW_UP_TEMPLATES[symptom.id];
    if (!templates) continue;

    for (const template of templates) {
      if (addedQuestions.has(template.question)) continue;

      questions.push({
        question: template.question,
        symptomId: symptom.id,
        impact: template.impact,
        urgent: Boolean(template.urgent)
      });

      addedQuestions.add(template.question);
    }
  }

  return questions
    .sort((left, right) => Number(right.urgent) - Number(left.urgent))
    .slice(0, 4);
}

// ============================================
// TRIAGE
// ============================================

function evaluateTriage(extractedSymptoms, previousAnswers) {
  const symptomIds = new Set(extractedSymptoms.map(symptom => symptom.id));
  const avgUrgency = extractedSymptoms.reduce((sum, symptom) => sum + symptom.urgency, 0) / extractedSymptoms.length;
  const answers = createAnswerLookup(previousAnswers);

  if (answers.hasPositive('intihar dusunceniz var mi')) {
    return {
      isEmergency: true,
      name: 'ruhsal_kriz',
      message: 'Kendinize zarar verme düşünceniz varsa acil destek alın. 112 ile iletişime geçin veya en yakın acil servise başvurun.'
    };
  }

  const chestEmergency =
    symptomIds.has('gogus_agrisi') &&
    (
      symptomIds.has('nefes_darligi') ||
      symptomIds.has('kol_agrisi') ||
      symptomIds.has('terleme') ||
      answers.hasPositive('nefes darligi eslik ediyor mu') ||
      answers.hasPositive('kola veya ceneye yayiliyor mu')
    );

  if (chestEmergency) {
    return {
      isEmergency: true,
      name: 'olasi_kalp_krizi',
      message: 'Göğüs ağrısı ile birlikte eşlik eden belirtiler acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.'
    };
  }

  const respiratoryEmergency =
    symptomIds.has('nefes_darligi') &&
    (
      symptomIds.has('hemoptizi') ||
      symptomIds.has('gogus_agrisi') ||
      answers.hasPositive('istirahat halinde de nefes darliginiz var mi')
    );

  if (respiratoryEmergency) {
    return {
      isEmergency: true,
      name: 'ciddi_solunum_sorunu',
      message: 'Nefes darlığı istirahatte de sürüyorsa veya göğüs ağrısı ile birlikteyse acil değerlendirme gerekir. Hemen 112 ile iletişime geçin.'
    };
  }

  const abdominalEmergency =
    (
      symptomIds.has('sag_alt_karin') ||
      answers.hasPositive('agri sag alt karinda mi')
    ) &&
    (
      symptomIds.has('ates') ||
      symptomIds.has('mide_bulantisi') ||
      answers.hasPositive('atesiniz var mi') ||
      answers.hasPositive('kusma var mi')
    );

  if (abdominalEmergency) {
    return {
      isEmergency: true,
      name: 'akut_karin',
      message: 'Sağ alt karın ağrısı ve eşlik eden belirtiler akut karın tablosuna işaret edebilir. Gecikmeden acil servise başvurun.'
    };
  }

  let careLevel = 'routine';

  if (
    avgUrgency >= 6 ||
    extractedSymptoms.some(symptom => HIGH_RISK_IDS.has(symptom.id)) ||
    answers.hasPositive('kanli balgam var mi')
  ) {
    careLevel = 'urgent';
  } else if (avgUrgency >= 4.5 || extractedSymptoms.some(symptom => symptom.urgency >= 5)) {
    careLevel = 'soon';
  }

  return {
    isEmergency: false,
    careLevel,
    ...CARE_LEVELS[careLevel]
  };
}

function createAnswerLookup(previousAnswers) {
  const positiveQuestions = new Set();

  if (Array.isArray(previousAnswers)) {
    for (const answer of previousAnswers) {
      if (answer.answer === 'Evet' && answer.question) {
        positiveQuestions.add(normalizeForSearch(answer.question));
      }
    }
  }

  return {
    hasPositive(fragment) {
      const normalizedFragment = normalizeForSearch(fragment);

      for (const question of positiveQuestions) {
        if (question.includes(normalizedFragment)) {
          return true;
        }
      }

      return false;
    }
  };
}

// ============================================
// BÖLÜM SKORLAMA
// ============================================

function calculateDepartmentScores(extractedSymptoms, previousAnswers) {
  const scores = {};

  for (const departmentId of Object.keys(DEPARTMENTS)) {
    scores[departmentId] = 0;
  }

  for (const symptom of extractedSymptoms) {
    const confidenceWeight = 0.8 + symptom.matchScore * 0.5;
    const urgencyWeight = 0.85 + symptom.urgency * 0.04;

    for (const [departmentId, departmentScore] of Object.entries(symptom.departments)) {
      scores[departmentId] += departmentScore * confidenceWeight * urgencyWeight;
    }
  }

  if (Array.isArray(previousAnswers)) {
    for (const answer of previousAnswers) {
      if (!answer.impact) continue;

      for (const [departmentId, boost] of Object.entries(answer.impact)) {
        if (answer.answer === 'Evet') {
          scores[departmentId] += boost * 1.15;
        }

        if (answer.answer === 'Hayır') {
          scores[departmentId] = Math.max(0, scores[departmentId] - boost * 0.35);
        }
      }
    }
  }

  const departmentSymptomCount = {};

  for (const symptom of extractedSymptoms) {
    for (const departmentId of Object.keys(symptom.departments)) {
      departmentSymptomCount[departmentId] = (departmentSymptomCount[departmentId] || 0) + 1;
    }
  }

  for (const [departmentId, count] of Object.entries(departmentSymptomCount)) {
    if (count >= 2) {
      scores[departmentId] *= 1 + (count - 1) * 0.12;
    }
  }

  return scores;
}

// ============================================
// SONUÇ
// ============================================

function buildResult(scores, extractedSymptoms, triage) {
  const sorted = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);

  if (sorted.length === 0) {
    return {
      error: null,
      noMatch: true,
      message: 'Bu şikayet için net bir bölüm çıkarılamadı. İlk adım olarak aile hekiminizden destek alabilirsiniz.'
    };
  }

  const [primaryDepartmentId, primaryScore] = sorted[0];
  const secondScore = sorted[1]?.[1] || 0;
  const topThreeTotal = sorted.slice(0, 3).reduce((sum, [, score]) => sum + score, 0) || primaryScore;
  const dominance = primaryScore / topThreeTotal;
  const normalizedScore = Math.min(primaryScore / Math.max(extractedSymptoms.length * 1.1, 1), 1);
  const confidenceScore = Math.round((normalizedScore * 0.55 + dominance * 0.45) * 100);

  let confidence = 'low';
  if (confidenceScore >= 72 && primaryScore - secondScore > 0.2) confidence = 'high';
  else if (confidenceScore >= 55) confidence = 'medium';

  const alternatives = sorted
    .slice(1, 4)
    .filter(([, score]) => score >= primaryScore * 0.55)
    .map(([id]) => ({
      id,
      name: DEPARTMENTS[id]?.name || id,
      icon: DEPARTMENTS[id]?.icon || '🏥'
    }));

  const averageUrgency = extractedSymptoms.reduce((sum, symptom) => sum + symptom.urgency, 0) / extractedSymptoms.length;
  const isFamilyDoctor =
    triage.careLevel === 'routine' &&
    (primaryDepartmentId === 'aile_hekimi' || (averageUrgency <= 3.2 && confidence !== 'high'));

  const primaryDepartment = DEPARTMENTS[primaryDepartmentId];
  const reasoning = generateReasoning(extractedSymptoms, primaryDepartmentId, triage);

  return {
    isEmergency: false,
    needsMoreInfo: false,
    primaryDepartment: primaryDepartmentId,
    primaryDepartmentName: primaryDepartment ? primaryDepartment.name : primaryDepartmentId,
    primaryDepartmentIcon: primaryDepartment ? primaryDepartment.icon : '🏥',
    primaryDepartmentColor: primaryDepartment ? primaryDepartment.color : '#667eea',
    confidence,
    confidenceScore,
    alternatives,
    isFamilyDoctor,
    familyDoctorMessage: isFamilyDoctor
      ? 'Belirtileriniz ilk adımda aile hekimi tarafından değerlendirilebilir. Gerekirse doğru branşa yönlendirme yapılabilir.'
      : null,
    reasoning,
    matchedSymptoms: extractedSymptoms.map(symptom => ({
      id: symptom.id,
      keyword: symptom.matchedKeyword || symptom.keywords[0],
      score: Math.round(symptom.matchScore * 100)
    })),
    careLevel: triage.careLevel,
    careLabel: triage.label,
    careSummary: triage.summary,
    careAdvice: triage.advice,
    note: `${triage.advice} Bu öneri teşhis değildir; kesin tanı için doktor muayenesi gerekir.`,
    timestamp: new Date().toISOString()
  };
}

function generateReasoning(symptoms, primaryDepartmentId, triage) {
  const symptomNames = symptoms.slice(0, 3).map(symptom => symptom.matchedKeyword || symptom.keywords[0]);
  const departmentName = DEPARTMENTS[primaryDepartmentId]?.name || primaryDepartmentId;
  const joinedSymptoms = symptomNames.join(', ');

  if (symptoms.length === 1) {
    return `"${joinedSymptoms}" şikayeti en çok ${departmentName} ile uyumlu görünüyor. ${triage.summary}`;
  }

  return `${joinedSymptoms} belirtileri birlikte değerlendirildiğinde en uygun bölüm ${departmentName} görünüyor. ${triage.summary}`;
}

export { DEPARTMENTS, SYMPTOM_DATABASE };
