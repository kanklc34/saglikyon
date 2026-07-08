// Yaş Grubu Özelliği - Manuel Test Script'i
// ÇALIŞTIRMA: proje kök dizininde `node tools/test_age_band.mjs`
//
// Bu script gerçek motoru (frontend/engine/analyzer.js) doğrudan
// çağırıyor — tarayıcıya/build'e gerek yok, sadece Node.js yeterli.

import { analyzeSymptoms } from '../frontend/engine/analyzer.js';

function line() { console.log('─'.repeat(60)); }

console.log('TEST 1: Yaşa duyarlı OLMAYAN semptom (baş ağrısı)');
console.log('Beklenen: yaş sorusu SORULMAMALI');
line();
const r1 = analyzeSymptoms('başım ağrıyor çok kötü', null, 'tr', []);
const hasAgeQ1 = (r1.followUpQuestions || []).some(q => q.symptomId === '__age_band__');
console.log('Yaş sorusu var mı:', hasAgeQ1, hasAgeQ1 ? '❌ BEKLENMİYOR' : '✅');
console.log();

console.log('TEST 2: Yaşa duyarlı semptom (ateş), metinde yaş ipucu YOK');
console.log('Beklenen: yaş sorusu SORULMALI, İLK soru olmalı');
line();
const r2 = analyzeSymptoms('üç gündür ateşim var', null, 'tr', []);
const firstQ = r2.followUpQuestions?.[0];
console.log('İlk soru:', firstQ?.question);
console.log('İlk soru yaş sorusu mu:', firstQ?.symptomId === '__age_band__' ? '✅' : '❌');
console.log('Seçenekler:', firstQ?.options);
console.log();

console.log('TEST 3: Metinde açık yaş ipucu var ("3 yaşındaki oğlum")');
console.log('Beklenen: yaş sorusu SORULMAMALI (zaten biliniyor)');
line();
const r3 = analyzeSymptoms('3 yaşındaki oğlumun 2 gündür ateşi var', [], 'tr', []);
console.log('Çözülen yaş grubu:', r3.ageBand, r3.ageBand === 'cocuk' ? '✅' : '❌ (beklenen: cocuk)');
console.log('Varsayım mı (yoksa metinden mi çıkarıldı):', r3.ageBandWasAssumed ? 'varsayıldı' : 'metinden çıkarıldı ✅');
console.log('Önerilen bölüm:', r3.department?.name || r3.primaryDepartmentName);
console.log();

console.log('TEST 4: Aynı şikayet + "hafif/kısa süreli" sinyalleri, ama BEBEK seçilirse');
console.log('Beklenen: diğer hafifletici sinyallere RAĞMEN Çocuk Sağlığı baskın kalmalı');
line();
const ageAnswer = (band) => ({
  question: 'Bu değerlendirme kimin için?', answer: band, impact: {}, symptomId: '__age_band__',
  options: ['Bebek (0-2 yaş)', 'Çocuk (2-12 yaş)', 'Genç/Yetişkin (12-65 yaş)', '65 yaş üstü'],
  ageBandValues: ['bebek', 'cocuk', 'yetiskin', 'yasli'],
});
const mitigatingAnswers = [
  { question: 'Kaç gündür ateşiniz var?', answer: '1-2 gün', impact: { dahiliye: 0.2 }, options: ['1-2 gün', '3-6 gün', '1 haftadan uzun'], optionDays: [1, 3, 7], thresholdDays: 3 },
  { question: 'Şikayetinizin şiddeti nasıl?', answer: 'Hafif, günlük hayatı etkilemiyor', impact: { dahiliye: 0.1 } },
  { question: 'Bu şikayet ne zamandır devam ediyor?', answer: 'Bugün başladı', impact: { dahiliye: 0.05 } },
];

for (const band of ['Bebek (0-2 yaş)', 'Çocuk (2-12 yaş)', 'Genç/Yetişkin (12-65 yaş)', '65 yaş üstü']) {
  const r = analyzeSymptoms('ateşim var', [ageAnswer(band), ...mitigatingAnswers], 'tr', []);
  const dept = r.department?.name || r.primaryDepartmentName;
  console.log(`  ${band.padEnd(28)} -> ${dept} (güven: %${r.confidenceScore})`);
}
console.log();
console.log('Beklenen: Bebek ve Çocuk -> Çocuk Sağlığı | Genç/Yetişkin ve Yaşlı -> Aile Hekimi (değişmemeli)');
line();

console.log();
console.log('TEST 5: Sonuç ekranı için ageBand/ageBandWasAssumed alanları doğru mu?');
line();
const r5 = analyzeSymptoms('ateşim var', [ageAnswer('Bebek (0-2 yaş)')], 'tr', []);
console.log('ageBand:', r5.ageBand);
console.log('ageBandWasAssumed:', r5.ageBandWasAssumed, '(false olmalı, çünkü soru cevaplandı)');

console.log();
console.log('=== TÜM TESTLER TAMAMLANDI ===');
