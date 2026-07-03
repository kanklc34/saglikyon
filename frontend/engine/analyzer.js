// ============================================
// SağlıkYön - Analiz Motoru v2.2
// Dil desteği: lang parametresi dışarıdan gelir
// ============================================

import { SYMPTOM_DATABASE, DEPARTMENTS, FOLLOW_UP_TEMPLATES } from './symptom-db.js';
import { matchKeywords, normalizeForSearch, isNegated, analyzeIntensifiers } from './nlp.js';
import { getCandidateSymptomIds } from './keyword-index.js';

const IMMEDIATE_RED_FLAG_IDS = new Set([
  'felc', 'gorme_kaybi', 'hemoptizi', 'bayilma', 'nöbet',
  'inme_belirtisi', 'siddetli_bas_agrisi', 'anevrizma_belirti'
]);

// ── Belirsiz kırmızı bayrak kelimeleri ──────────────────────
// Bu listedeki ID'ler ciddi durumları da kapsayan kırmızı bayraklar,
// AMA bazı eş anlamlı kelimeleri günlük dilde çok genel/abartılı
// ifadeler için de kullanılır ("kafam ikiye ayrılıyor" gerilim tipi
// baş ağrısında da söylenir, beyin kanamasında da). Bu yüzden HER
// kırmızı bayrağı aynı kesinlikte görmüyoruz: eğer eşleşen kelime bu
// "belirsiz" kümede ise, uyarı YİNE DE hemen gösterilir (gecikme
// riski almıyoruz) ama yanında hızlı bir doğrulama sorusu sunulur.
// Eşleşen kelime bu kümenin DIŞINDAysa (örn. "subaraknoid kanama",
// "yüzüm eğrildi") uyarı sorgusuz kesin kalır.
const AMBIGUOUS_RED_FLAG_KEYWORDS = {
  siddetli_bas_agrisi: new Set([
    'başım patlar gibi', 'beynim zonkluyor', 'kafam ikiye ayrılıyor',
    'gözlerim yerinden çıkacak', 'şakaklarım sızlıyor', 'başım çatlıyor',
    'beyin sızlaması', 'kafa içi baskı', 'kafamın içi yanıyor',
    'alın ağrısından duramıyorum', 'başım ağırıyor', 'kafama çivi çakılıyor',
    'beynim uyuştu', 'ensesine vuran ağrı', 'kafa sancısı',
  ]),
  anevrizma_belirti: new Set([
    'karında nabız hissediyorum', 'karnımda atan bir şey var',
    'küt küt atan karın', 'karın bölgemde atış', 'şiddetli iç ağrı',
    'göğsümde zonklama', 'kalp atışını karında duymak',
    'içimde bir şey patladı', 'karnımda nabız atıyor',
  ]),
  bayilma: new Set([
    'gözlerim karardı', 'dünya başıma yıkıldı', 'aylaklık bastı',
    'kimse yok sandım', 'halsizlikten gittim', 'tüm gücüm çekildi',
    'aklım başımdan gitti', 'karanlığa gömüldüm', 'pilim bitti',
  ]),
  gorme_kaybi: new Set([
    'karartı', 'kararma', 'gözlerim karardı', 'gözlerim seçmiyor',
    'gözlerimin önü boşaldı', 'bulanıklaşıyor', 'gözümün önünde sis var',
    'ışığı seçemiyorum', 'gözüm kapandı',
  ]),
};

// Belirsiz eşleşmelerde sorulacak, durumu netleştirecek tek bir soru.
// "reassure" seçeneği seçilirse uyarı yumuşatılır (ama hâlâ aile
// hekimi/ilgili bölüm önerisiyle, asla tamamen göz ardı edilmez).
const RED_FLAG_VERIFICATION = {
  siddetli_bas_agrisi: {
    question: { tr: 'Bu ağrı aniden mi başladı ve hayatınızda hissettiğiniz en şiddetli ağrı mı?', en: 'Did this pain start suddenly, and is it the worst you have ever felt?' },
    confirm: { tr: 'Evet, tam olarak böyle', en: 'Yes, exactly like that' },
    reassure: { tr: 'Hayır, bu her zamanki ağrıma benziyor', en: 'No, this feels like my usual headache' },
  },
  anevrizma_belirti: {
    question: { tr: 'Bu ağrı aniden mi başladı ve sırtınıza ya da göğsünüze yayılıyor mu?', en: 'Did this pain start suddenly and radiate to your back or chest?' },
    confirm: { tr: 'Evet, tam olarak böyle', en: 'Yes, exactly like that' },
    reassure: { tr: 'Hayır, yayılmıyor / yavaş başladı', en: "No, it doesn't radiate / started gradually" },
  },
  bayilma: {
    question: { tr: 'Gerçekten bilincinizi kaybedip yere yığıldınız mı?', en: 'Did you actually lose consciousness and collapse?' },
    confirm: { tr: 'Evet, bayıldım', en: 'Yes, I fainted' },
    reassure: { tr: 'Hayır, sadece baş dönmesi/halsizlik hissettim', en: 'No, I just felt dizzy/weak' },
  },
  gorme_kaybi: {
    question: { tr: 'Görme kaybı ani mi başladı ve hâlâ sürüyor mu?', en: 'Did the vision loss start suddenly, and is it still ongoing?' },
    confirm: { tr: 'Evet, ani ve sürüyor', en: 'Yes, sudden and ongoing' },
    reassure: { tr: 'Hayır, geçici bulanıklık gibiydi', en: 'No, it was more like temporary blurriness' },
  },
};

const HIGH_RISK_IDS = new Set([
  'gogus_agrisi', 'nefes_darligi', 'sag_alt_karin',
  'kanli_diski', 'sarilik', 'bobrek_agrisi'
]);

// ── Bayes-tarzı ağırlıklandırma ──────────────────────────
// Her bölüm için kabaca "bu şikayetle aile hekiminize/polikliniğe
// başvuran kişilerin hangi bölümde sonlanma payı" mantığıyla bir
// önsel (prior) olasılık tanımlıyoruz. Bunlar kesin epidemiyolojik
// veri değil, mantıklı bir başlangıç noktası — gerçek başvuru
// verisi toplandığında buradan kalibre edilebilir. Amaç: motorun
// her bölümü "eşit olası" kabul ederek sıfırdan başlamaması.
const DEPARTMENT_PRIORS = {
  aile_hekimi: 0.20,
  dahiliye: 0.14,
  kbb: 0.10,
  dermatoloji: 0.09,
  ortopedi: 0.08,
  gastroenteroloji: 0.07,
  goz: 0.06,
  kadin_dogum: 0.05,
  psikiyatri: 0.05,
  uroloji: 0.04,
  noroloji: 0.04,
  fizik_tedavi: 0.035,
  endokrinoloji: 0.03,
  cocuk: 0.03,
  genel_cerrahi: 0.025,
  kardiyoloji: 0.025,
  gogus: 0.025,
  dis: 0.02,
};
const DEFAULT_PRIOR = 0.04;

// p -> log-odds: log(p / (1-p)). Aile hekimi gibi yüksek olasılıklı
// bölümler bile küçük bir başlangıç avantajıyla başlar; hiçbir bölüm
// kanıtsız "yüksek skor" almaz.
function priorLogOdds(deptId) {
  const p = Math.min(0.95, Math.max(0.01, DEPARTMENT_PRIORS[deptId] ?? DEFAULT_PRIOR));
  return Math.log(p / (1 - p));
}

// Bir semptomun veritabanındaki bölüm ağırlığını (departments[id], ~0-1)
// log-likelihood-ratio katkısına çevirir. Eşleşme güveni (matchScore)
// ve şikayetin aciliyeti (urgency) bu katkıyı ölçeklendirir — yarım
// eşleşen, belirsiz bir kelime, net bir eşleşme kadar ağırlık taşımaz.
function symptomLogLR(weight, matchScore, urgency) {
  const base = weight * 3.1;
  const confidenceFactor = 0.5 + matchScore * 0.5;   // 0.5 – 1.0
  const urgencyFactor = 0.9 + urgency * 0.02;         // hafif aciliyet katkısı
  return base * confidenceFactor * urgencyFactor;
}

// Aynı bölümü destekleyen birden fazla semptom geldiğinde her birini
// tam ağırlığıyla toplamak, ilişkili (correlated) kanıtı çift saymak
// olur — örn. "kızarıklık" ve "kaşıntı" genelde zaten birlikte gelir,
// ikisi de ayrı ayrı bağımsız kanıt gibi sayılırsa güven yapay olarak
// %100'e doygunlaşır. Bunun için azalan katkı (discount) uyguluyoruz:
// bir bölüm için en güçlü kanıt tam ağırlıkla sayılır, ikincisi %70,
// üçüncüsü %50, sonrakiler %35 ile. Naive Bayes sistemlerinde bilinen
// bu "kanıt iskontosu" yöntemi sonucu daha gerçekçi tutar.
const EVIDENCE_DISCOUNT = [1, 0.7, 0.5, 0.35];

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

const CARE_LEVELS = {
  emergency: {
    tr: { label: 'Acil yardım gerekebilir', summary: 'Belirtiler acil müdahale gerektirebilir.', advice: '112 ile iletişime geçin veya en yakın acil servise başvurun.' },
    en: { label: 'Emergency attention required', summary: 'Symptoms may require immediate intervention.', advice: 'Call 112 or go to the nearest emergency room.' }
  },
  urgent: {
    tr: { label: 'Aynı gün değerlendirme iyi olur', summary: 'Belirtileriniz aynı gün doktor tarafından değerlendirilmelidir.', advice: 'Mümkünse bugün içinde acil servis veya ilgili branşa başvurun.' },
    en: { label: 'Same-day evaluation recommended', summary: 'Your symptoms should be evaluated by a doctor today.', advice: 'Visit an emergency room or specialist today if possible.' }
  },
  soon: {
    tr: { label: 'Kısa sürede randevu alın', summary: 'Belirtileriniz acil görünmüyor ancak geciktirilmemeli.', advice: 'İlgili bölümden yakın tarihe randevu almanız uygun olur.' },
    en: { label: 'Schedule an appointment soon', summary: "Your symptoms don't appear urgent but shouldn't be delayed.", advice: 'Schedule an appointment with the relevant department soon.' }
  },
  routine: {
    tr: { label: 'Rutin poliklinik uygun', summary: 'Belirtileriniz poliklinik veya aile hekimi düzeyinde görünüyor.', advice: 'Uygun ilk randevuda ilgili bölüme veya aile hekiminize başvurabilirsiniz.' },
    en: { label: 'Routine outpatient visit', summary: 'Your symptoms appear to be at the outpatient or GP level.', advice: 'You can visit the relevant department or your GP at your earliest convenience.' }
  }
};

export function analyzeSymptoms(inputText, previousAnswers = null, lang = 'tr', universalQuestions = [], suppressRedFlagIds = []) {
  if (!inputText || inputText.trim().length < 5) {
    return {
      error: lang === 'en'
        ? 'Please describe your complaint with at least 5 characters.'
        : 'Lütfen şikayetinizi en az 5 karakter ile açıklayın.'
    };
  }

  const extractedSymptoms = extractSymptoms(inputText);

  if (extractedSymptoms.length === 0) {
    return {
      error: null,
      noMatch: true,
      message: lang === 'en'
        ? 'Could not understand your complaint clearly. Please describe in more detail or use the body map.'
        : 'Şikayetinizi yeterince net anlayamadım. Lütfen daha detaylı yazın veya vücut haritasından destek alın.',
      suggestion: lang === 'en'
        ? 'Example: "I have a headache and nausea" or "I feel pressure in my chest".'
        : 'Örnek: "Başım ağrıyor ve mide bulantım var" veya "Göğsümde baskı hissediyorum".'
    };
  }

  const immediateEmergency = checkImmediateEmergency(extractedSymptoms, lang, suppressRedFlagIds);
  if (immediateEmergency.isEmergency) {
    return {
      isEmergency: true,
      emergencyMessage: immediateEmergency.message,
      emergencyName: immediateEmergency.name,
      verification: immediateEmergency.verification || null,
      matchedSymptoms: extractedSymptoms.map(s => s.id)
    };
  }

  const triage = evaluateTriage(extractedSymptoms, previousAnswers, lang);
  if (triage.isEmergency) {
    return { isEmergency: true, emergencyMessage: triage.message, emergencyName: triage.name, verification: null, matchedSymptoms: extractedSymptoms.map(s => s.id) };
  }

  if (!previousAnswers) {
    const followUpQuestions = generateFollowUpQuestions(extractedSymptoms, lang, universalQuestions);
    if (followUpQuestions.length > 0) {
      return { needsMoreInfo: true, followUpQuestions, matchedSymptoms: extractedSymptoms.map(s => s.id), primarySymptom: extractedSymptoms[0].id, lang };
    }
  }

  const scores = calculateDepartmentScores(extractedSymptoms, previousAnswers);
  return buildResult(scores, extractedSymptoms, triage, lang);
}

// Performans: TR+EN birleşik anahtar kelime listesini her çağrıda
// [...keywords, ...keywords_en] ile yeniden oluşturmak yerine, sabit
// veritabanı için bunu BİR KERE, modül yüklenirken hesaplıyoruz. Bu,
// nlp.js'teki keyword önbelleğinin de gerçekten işe yaramasını sağlar
// (önbellek dizi referansına göre anahtarlanıyor; her seferinde yeni
// bir dizi oluşturulursa önbellek hiç isabet etmez).
const _combinedKeywordsCache = new Map();
function getCombinedKeywords(symptom) {
  let kwAll = _combinedKeywordsCache.get(symptom);
  if (!kwAll) {
    kwAll = symptom.keywords_en ? [...symptom.keywords, ...symptom.keywords_en] : symptom.keywords;
    _combinedKeywordsCache.set(symptom, kwAll);
  }
  return kwAll;
}

// ─────────────────────────────────────────────────────────────────
// ADIM 6 — İNDEKSLİ YOL ASIL YOL OLDU
// ─────────────────────────────────────────────────────────────────
// Adım 3-5'te, keyword-index.js'teki aday daraltma gölge modda (üretim
// sonucunu etkilemeden) 508 vakalık bir regresyon korpusunda eski tam
// tarama yoluyla birebir karşılaştırıldı: 0 fark, %47.9 hızlanma
// (bkz. tools/regression_baseline.json, tools/shadow_merged_report.json).
// Bu doğrulamadan sonra eski tam-tarama kodu ve gölge karşılaştırma
// altyapısı kaldırıldı; aşağıdaki extractSymptoms artık DOĞRUDAN
// indeksli yolu kullanıyor.
//
// GÜVENLİK AĞI KORUNDU: getCandidateSymptomIds() girdi çok genel/
// ayırt edici değilse NULL döner, bu durumda aşağıdaki kod eskisi gibi
// TÜM 142 semptomu tarar — hiçbir girdi "filtrelenip kaybolma" riski
// taşımaz.
function extractSymptoms(inputText) {
  const matched = [];
  const { boost: intensifierBoost } = analyzeIntensifiers(inputText);

  const candidateIds = getCandidateSymptomIds(inputText);
  const symptomsToScan = candidateIds
    ? SYMPTOM_DATABASE.filter(s => candidateIds.has(s.id))
    : SYMPTOM_DATABASE; // aday yoksa (güvenlik ağı) tam tarama

  for (const symptom of symptomsToScan) {
    const kwAll = getCombinedKeywords(symptom);
    const result = matchKeywords(inputText, kwAll);
    if (!result.matched) continue;
    if (isNegated(inputText, result.keyword)) continue;
    matched.push({ ...symptom, urgency: Math.min(10, symptom.urgency * intensifierBoost), matchScore: result.score, matchedKeyword: result.keyword });
  }

  if (matched.length === 0) return [];
  matched.sort((a, b) => b.matchScore - a.matchScore);
  const topScore = matched[0].matchScore;
  const threshold = Math.max(0.78, topScore * 0.72);
  return matched.filter((s, i) => s.matchScore >= threshold || (i < 2 && s.matchScore >= 0.76)).slice(0, 6);
}

function checkImmediateEmergency(extractedSymptoms, lang, suppressRedFlagIds = []) {
  const symptomIds = new Set(extractedSymptoms.map(s => s.id));
  const suppressed = new Set(suppressRedFlagIds);

  for (const symptom of extractedSymptoms) {
    if (suppressed.has(symptom.id)) continue;
    if (IMMEDIATE_RED_FLAG_IDS.has(symptom.id) && symptom.matchScore >= 0.86) {
      const keyword = symptom.matchedKeyword || symptom.keywords[0];
      const ambiguousSet = AMBIGUOUS_RED_FLAG_KEYWORDS[symptom.id];
      const isAmbiguous = ambiguousSet ? ambiguousSet.has(keyword) : false;
      const verifyDef = RED_FLAG_VERIFICATION[symptom.id];
      return {
        isEmergency: true,
        name: symptom.id,
        message: buildEmergencyMessage(symptom.id, keyword, lang),
        verification: (isAmbiguous && verifyDef) ? {
          symptomId: symptom.id,
          question: verifyDef.question[lang] || verifyDef.question.tr,
          confirmLabel: verifyDef.confirm[lang] || verifyDef.confirm.tr,
          reassureLabel: verifyDef.reassure[lang] || verifyDef.reassure.tr,
        } : null,
      };
    }
  }

  if (symptomIds.has('gogus_agrisi') && symptomIds.has('nefes_darligi') && (symptomIds.has('kol_agrisi') || symptomIds.has('terleme') || symptomIds.has('kalp_carpintisi'))) {
    return { isEmergency: true, name: 'olasi_kalp_krizi', message: lang === 'en' ? 'Chest pain, shortness of breath and accompanying symptoms may indicate a cardiac emergency. Call 112 immediately.' : 'Göğüs ağrısı, nefes darlığı ve eşlik eden belirtiler acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.' };
  }

  if (symptomIds.has('nefes_darligi') && symptomIds.has('hemoptizi')) {
    return { isEmergency: true, name: 'ciddi_solunum_sorunu', message: lang === 'en' ? 'Shortness of breath with bloody sputum may indicate a serious condition. Call 112 immediately.' : 'Nefes darlığı ve kanlı balgam birlikte ciddi bir tabloya işaret edebilir. Hemen 112 ile iletişime geçin.' };
  }

  return { isEmergency: false };
}

function buildEmergencyMessage(symptomId, matchedKeyword, lang) {
  const label = matchedKeyword || symptomId;
  if (lang === 'en') {
    const msgs = { felc: `Sudden stroke or speech loss ("${label}") may require emergency intervention. Call 112 immediately.`, gorme_kaybi: `Sudden "${label}" requires urgent evaluation. Call 112 immediately.`, hemoptizi: `"${label}" may indicate a serious condition. Seek emergency help immediately.`, bayilma: `"${label}" may require emergency intervention. Call 112 immediately.`, nöbet: `"${label}" may require emergency intervention. Call 112 immediately.` };
    return msgs[symptomId] || `"${label}" may indicate a serious condition. Call 112 or go to the nearest emergency room.`;
  }
  const msgs = { felc: `Ani felç veya konuşma kaybı benzeri "${label}" belirtisi acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.`, gorme_kaybi: `Ani gelişen "${label}" durumu acil değerlendirme gerektirir. Hemen 112 ile iletişime geçin.`, hemoptizi: `"${label}" ciddi bir tabloya işaret edebilir. Hemen acil destek alın.`, bayilma: `"${label}" acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.`, nöbet: `"${label}" acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.` };
  return msgs[symptomId] || `"${label}" ciddi bir duruma işaret edebilir. Hemen 112 ile iletişime geçin.`;
}

function generateFollowUpQuestions(extractedSymptoms, lang, universalQuestions) {
  const questions = [];
  const addedQuestions = new Set();

  const prioritized = extractedSymptoms.filter((s, i) => i < 3 || s.urgency >= 7).sort((a, b) => b.urgency - a.urgency);

  for (const symptom of prioritized) {
    if (!symptom.followUp) continue;
    const templates = FOLLOW_UP_TEMPLATES[symptom.id];
    if (!templates) continue;
    const langTemplates = Array.isArray(templates) ? templates : (templates[lang] || templates.tr || []);
    for (const template of langTemplates) {
      if (addedQuestions.has(template.question)) continue;
      if (questions.length >= 2) break;
      questions.push({ question: template.question, symptomId: symptom.id, impact: template.impact, urgent: Boolean(template.urgent), type: 'yesno' });
      addedQuestions.add(template.question);
    }
  }

  const remaining = 4 - questions.length;
  for (let i = 0; i < Math.min(remaining, universalQuestions.length); i++) {
    const uq = universalQuestions[i];
    if (addedQuestions.has(uq.question)) continue;
    questions.push({ ...uq, symptomId: extractedSymptoms[0]?.id || 'genel', urgent: false });
    addedQuestions.add(uq.question);
  }

  return questions.sort((a, b) => Number(b.urgent) - Number(a.urgent));
}

function evaluateTriage(extractedSymptoms, previousAnswers, lang) {
  const symptomIds = new Set(extractedSymptoms.map(s => s.id));
  const avgUrgency = extractedSymptoms.reduce((sum, s) => sum + s.urgency, 0) / extractedSymptoms.length;
  const answers = createAnswerLookup(previousAnswers, lang);

  if (answers.hasPositive('intihar') || answers.hasPositive('suicidal')) {
    return { isEmergency: true, name: 'ruhsal_kriz', message: lang === 'en' ? 'If you have thoughts of self-harm, please seek emergency help. Call 112.' : 'Kendinize zarar verme düşünceniz varsa acil destek alın. 112 ile iletişime geçin.' };
  }

  if (symptomIds.has('gogus_agrisi') && (symptomIds.has('nefes_darligi') || symptomIds.has('kol_agrisi') || answers.hasPositive('nefes') || answers.hasPositive('breath') || answers.hasPositive('arm'))) {
    return { isEmergency: true, name: 'olasi_kalp_krizi', message: lang === 'en' ? 'Chest pain with accompanying symptoms may require emergency intervention. Call 112 immediately.' : 'Göğüs ağrısı ile birlikte eşlik eden belirtiler acil müdahale gerektirebilir. Hemen 112 ile iletişime geçin.' };
  }

  if (symptomIds.has('nefes_darligi') && (symptomIds.has('hemoptizi') || symptomIds.has('gogus_agrisi') || answers.hasPositive('istirahat') || answers.hasPositive('rest'))) {
    return { isEmergency: true, name: 'ciddi_solunum_sorunu', message: lang === 'en' ? 'Shortness of breath at rest or with chest pain requires emergency care. Call 112.' : 'Nefes darlığı istirahatte de sürüyorsa veya göğüs ağrısı ile birlikteyse acil değerlendirme gerekir. Hemen 112 ile iletişime geçin.' };
  }

  if (symptomIds.has('sag_alt_karin') && (symptomIds.has('ates') || symptomIds.has('mide_bulantisi') || answers.hasPositive('ates') || answers.hasPositive('fever'))) {
    return { isEmergency: true, name: 'akut_karin', message: lang === 'en' ? 'Right lower abdominal pain with accompanying symptoms may indicate acute abdomen. Go to the emergency room.' : 'Sağ alt karın ağrısı ve eşlik eden belirtiler akut karın tablosuna işaret edebilir. Gecikmeden acil servise başvurun.' };
  }

  let adjustedUrgency = avgUrgency;
  if (answers.hasPositive('şiddetli') || answers.hasPositive('severe') || answers.hasPositive('hard to bear') || answers.hasPositive('dayanılması güç')) {
    adjustedUrgency *= 1.3;
  }

  let careLevel = 'routine';
  if (adjustedUrgency >= 6 || extractedSymptoms.some(s => HIGH_RISK_IDS.has(s.id)) || answers.hasPositive('kanli') || answers.hasPositive('bloody')) careLevel = 'urgent';
  else if (adjustedUrgency >= 4.5 || extractedSymptoms.some(s => s.urgency >= 5)) careLevel = 'soon';

  return { isEmergency: false, careLevel, ...CARE_LEVELS[careLevel][lang] };
}

function createAnswerLookup(previousAnswers, lang = 'tr') {
  const positiveQuestions = new Set();
  const yesValues = ['Evet', 'Yes'];

  if (Array.isArray(previousAnswers)) {
    for (const answer of previousAnswers) {
      if (yesValues.includes(answer.answer) && answer.question) positiveQuestions.add(normalizeForSearch(answer.question));
      if (answer.selectedOption) positiveQuestions.add(normalizeForSearch(answer.selectedOption));
    }
  }

  return {
    hasPositive(fragment) {
      const norm = normalizeForSearch(fragment);
      for (const q of positiveQuestions) { if (q.includes(norm)) return true; }
      return false;
    }
  };
}

function calculateDepartmentScores(extractedSymptoms, previousAnswers) {
  // Her bölüm önsel olasılığından (prior) başlar. Kanıt geldikçe
  // log-odds uzayında TOPLANIR — bu, olasılık uzayında ÇARPMAK
  // anlamına gelir (naive Bayes'in temel mantığı).
  const logOdds = {};
  for (const id of Object.keys(DEPARTMENTS)) logOdds[id] = priorLogOdds(id);

  // Önce her bölüm için hangi semptomların ne kadar kanıt sunduğunu
  // topla, sonra en güçlüden başlayarak azalan ağırlıkla (discount) ekle.
  const contributionsByDept = {};
  for (const symptom of extractedSymptoms) {
    for (const [id, weight] of Object.entries(symptom.departments)) {
      const lr = symptomLogLR(weight, symptom.matchScore, symptom.urgency);
      (contributionsByDept[id] ??= []).push(lr);
    }
  }
  for (const [id, contributions] of Object.entries(contributionsByDept)) {
    if (!(id in logOdds)) logOdds[id] = priorLogOdds(id);
    contributions.sort((a, b) => b - a);
    contributions.forEach((lr, i) => {
      const discount = EVIDENCE_DISCOUNT[Math.min(i, EVIDENCE_DISCOUNT.length - 1)];
      logOdds[id] += lr * discount;
    });
  }

  if (Array.isArray(previousAnswers)) {
    for (const answer of previousAnswers) {
      if (!answer.impact) continue;
      const isYes = ['Evet', 'Yes'].includes(answer.answer);
      const isNo = ['Hayır', 'No'].includes(answer.answer);
      for (const [id, boost] of Object.entries(answer.impact)) {
        if (!(id in logOdds)) logOdds[id] = priorLogOdds(id);
        // "Evet" kanıtı destekler, "Hayır" kanıtı zayıflatır — ikisi de
        // aynı log-odds mantığıyla, simetrik biçimde işlenir.
        if (isYes) logOdds[id] += boost * 1.6;
        if (isNo) logOdds[id] -= boost * 1.1;
      }
    }
  }

  const scores = {};
  for (const [id, lo] of Object.entries(logOdds)) scores[id] = sigmoid(lo);
  return scores;
}

function buildResult(scores, extractedSymptoms, triage, lang) {
  // scores artık her bölüm için 0-1 aralığında bağımsız bir "olasılık
  // benzeri" değer (sigmoid çıktısı). Aile hekimi gibi yüksek önsele
  // sahip bölümler kanıt olmasa da hafif pozitif kalabilir; bu yüzden
  // anlamlı bir eşik koyup gerçekten kanıtla desteklenmeyenleri eleriz.
  const MEANINGFUL_THRESHOLD = 0.30;
  const sorted = Object.entries(scores)
    .filter(([, s]) => s > MEANINGFUL_THRESHOLD)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return { error: null, noMatch: true, message: lang === 'en' ? 'Could not determine a department. Consider visiting a GP first.' : 'Bu şikayet için net bir bölüm çıkarılamadı. İlk adım olarak aile hekiminizden destek alabilirsiniz.' };
  }

  const [primaryId, primaryScore] = sorted[0];
  const secondScore = sorted[1]?.[1] || 0;

  // confidenceScore artık doğrudan olasılığın kendisi — "%83 güven"
  // gerçekten "bu bölüm için hesaplanan olasılık %83" demek, ayrı bir
  // el-ayarlı karışım formülüne ihtiyaç yok.
  const confidenceScore = Math.round(primaryScore * 100);
  const gap = primaryScore - secondScore;

  let confidence = 'low';
  if (confidenceScore >= 72 && gap > 0.15) confidence = 'high';
  else if (confidenceScore >= 55) confidence = 'medium';

  const alternatives = sorted.slice(1, 4).filter(([, s]) => s >= primaryScore * 0.6).map(([id]) => ({ id, name: DEPARTMENTS[id]?.name || id, icon: DEPARTMENTS[id]?.icon || '🏥' }));
  const avgUrgency = extractedSymptoms.reduce((s, sym) => s + sym.urgency, 0) / extractedSymptoms.length;
  const isFamilyDoctor = triage.careLevel === 'routine' && (primaryId === 'aile_hekimi' || (avgUrgency <= 3.2 && confidence !== 'high'));
  const primaryDept = DEPARTMENTS[primaryId];
  const reasoning = generateReasoning(extractedSymptoms, primaryId, triage, lang);
  const familyMsg = lang === 'en' ? 'Your symptoms can be initially evaluated by a GP who can refer you to the right specialist.' : 'Belirtileriniz ilk adımda aile hekimi tarafından değerlendirilebilir. Gerekirse doğru branşa yönlendirme yapılabilir.';
  const note = lang === 'en' ? `${triage.advice} This is not a diagnosis; a definitive assessment requires a doctor's examination.` : `${triage.advice} Bu öneri teşhis değildir; kesin tanı için doktor muayenesi gerekir.`;

  return {
    isEmergency: false, needsMoreInfo: false,
    primaryDepartment: primaryId, primaryDepartmentName: primaryDept?.name || primaryId,
    primaryDepartmentIcon: primaryDept?.icon || '🏥', primaryDepartmentColor: primaryDept?.color || '#667eea',
    confidence, confidenceScore, alternatives, isFamilyDoctor,
    familyDoctorMessage: isFamilyDoctor ? familyMsg : null,
    reasoning,
    matchedSymptoms: extractedSymptoms.map(s => ({ id: s.id, keyword: s.matchedKeyword || s.keywords[0], score: Math.round(s.matchScore * 100) })),
    careLevel: triage.careLevel, careLabel: triage.label, careSummary: triage.summary, careAdvice: triage.advice,
    note, timestamp: new Date().toISOString(), lang
  };
}

function generateReasoning(symptoms, primaryId, triage, lang) {
  const names = symptoms.slice(0, 3).map(s => s.matchedKeyword || s.keywords[0]);
  const deptName = DEPARTMENTS[primaryId]?.name || primaryId;
  const joined = names.join(', ');
  if (lang === 'en') return symptoms.length === 1 ? `"${joined}" is most consistent with ${deptName}. ${triage.summary}` : `${joined} — when evaluated together, ${deptName} appears most appropriate. ${triage.summary}`;
  return symptoms.length === 1 ? `"${joined}" şikayeti en çok ${deptName} ile uyumlu görünüyor. ${triage.summary}` : `${joined} belirtileri birlikte değerlendirildiğinde en uygun bölüm ${deptName} görünüyor. ${triage.summary}`;
}

// Not: extractSymptoms sadece regresyon test script'i (tools/regression_*)
// tarafından gerçek eşleştirme çekirdeğini doğrudan ölçmek için export
// edildi. Motorun davranışında hiçbir değişiklik yapmaz, sadece mevcut
// (zaten var olan) iç fonksiyonu dışarıya açar.
export { DEPARTMENTS, SYMPTOM_DATABASE, extractSymptoms };