require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());


// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Bölüm listesi
const DEPARTMENTS = {
  'dahiliye': 'Dahiliye (İç Hastalıkları)',
  'kardiyoloji': 'Kardiyoloji',
  'noroloji': 'Nöroloji',
  'ortopedi': 'Ortopedi ve Travmatoloji',
  'kbb': 'Kulak Burun Boğaz',
  'goz': 'Göz Hastalıkları',
  'dermatoloji': 'Dermatoloji (Cilt Hastalıkları)',
  'psikiyatri': 'Psikiyatri',
  'kadin_dogum': 'Kadın Hastalıkları ve Doğum',
  'uroloji': 'Üroloji',
  'cocuk': 'Çocuk Sağlığı ve Hastalıkları',
  'fizik_tedavi': 'Fizik Tedavi ve Rehabilitasyon',
  'genel_cerrahi': 'Genel Cerrahi',
  'gogus': 'Göğüs Hastalıkları',
  'aile_hekimi': 'Aile Hekimi'
};

// System Prompt
const SYSTEM_PROMPT = `Sen bir sağlık yönlendirme asistanısın. Kullanıcının şikâyetini analiz edip en uygun poliklinik bölümünü öner.

KRİTİK KURALLAR:
1. ASLA teşhis koyma
2. ASLA ilaç önerme  
3. MUTLAKA yeterli bilgi yoksa followUpQuestions sor
4. Sadece JSON formatında cevap ver

Bölümler:
dahiliye, kardiyoloji, noroloji, ortopedi, kbb, goz, dermatoloji, psikiyatri, kadin_dogum, uroloji, cocuk, fizik_tedavi, genel_cerrahi, gogus, aile_hekimi

=== ACİL DURUM KURALLARI ===
Aşağıdaki durumlarda isEmergency: true + followUpQuestions: []
- Göğüs ağrısı + nefes darlığı
- Bayılma, bilinç kaybı
- Şiddetli kafa travması
- Ani konuşma bozukluğu / felç
- Şiddetli karın ağrısı + kusma
- Kanamalı yaralanma
- Şiddetli baş ağrısı + görme kaybı

=== SORU SORMA KURALLARI (ÇOK ÖNEMLİ!) ===
Aşağıdaki şikayetlerde MUTLAKA followUpQuestions doldur:

1. BOĞAZ AĞRISI:
   followUpQuestions: ["Ateşiniz var mı?", "Yutkunurken çok mu ağrıyor?", "Kaç gündür devam ediyor?"]

2. KARIN AĞRISI:
   followUpQuestions: ["Ağrı ani mi başladı yoksa yavaş yavaş mı?", "Ateşiniz var mı?", "Kusma var mı?", "Hangi bölgede ağrı var? (sağ/sol/orta)"]

3. BAŞ AĞRISI:
   followUpQuestions: ["En kötü baş ağrınız mı?", "Görme bozukluğu var mı?", "Boyun sertliği var mı?"]

4. GÖĞÜS AĞRISI:
   followUpQuestions: ["Nefes darlığı var mı?", "Kola veya çeneye yayılıyor mu?", "Eforla mı arttı?"]

5. BACAK/KOL AĞRISI:
   followUpQuestions: ["Şişlik var mı?", "Travma geçirdiniz mi?", "Uyuşma veya güçsüzlük var mı?"]

6. ÖKSÜRÜK:
   followUpQuestions: ["Balgam var mı?", "Kan geliyor mu?", "Nefes darlığı var mı?", "Ateş var mı?"]

SADECE kullanıcı zaten detaylı bilgi verdiyse soru sorma!
Örnek: "Karnımın sağ alt tarafı çok ağrıyor, 2 saattir, ateşim 38.5" → Soru sorma, direkt cevap ver

=== AİLE HEKİMİ KURALLARI ===
Eğer sorular sorulduysa ve cevaplara göre basitse:
primaryDepartment: "aile_hekimi"
familyDoctorMessage: "Şikayetiniz basit görünüyor. Önce aile hekiminize başvurabilirsiniz. Eğer 3 gün içinde geçmezse [alternatif_bölüm] bölümüne gidin."

Aile hekiminin çözebileceği durumlar (sorular sorulduktan SONRA):
- Basit boğaz ağrısı (ateş yoksa/hafifse)
- Hafif öksürük (kan yoksa)
- Soğuk algınlığı, nezle
- Reçete yenileme
- Küçük yara pansuman

=== CEVAP FORMATI ===
{
  "needsMoreInfo": true/false,
  "followUpQuestions": ["soru1", "soru2", "soru3"],
  "primaryDepartment": "bolum_id",
  "alternatives": ["bolum_id"],
  "confidence": "high/medium/low",
  "isEmergency": false,
  "isFamilyDoctor": false,
  "familyDoctorMessage": "",
  "reasoning": "Kısa açıklama",
  "note": "Bu öneri teşhis değildir. Kesin tanı için doktor muayenesi gereklidir."
}

ÖNEMLİ: 
- Eğer followUpQuestions doluysa, needsMoreInfo: true olmalı
- Eğer needsMoreInfo: true ise, primaryDepartment: "" boş bırak
- Kullanıcı yeterli detay verdiyse direkt cevap ver
`;

// Ana endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { symptom } = req.body;

    // Validasyon
    if (!symptom || symptom.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Lütfen şikâyetinizi en az 10 karakter ile açıklayın.'
      });
    }

    console.log('📝 Şikâyet:', symptom);

    // Gemini'ye sor
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-09-2025',
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    });

   const result = await model.generateContent(
  `${SYSTEM_PROMPT}\n\nKullanıcı şikâyeti: "${symptom}"`
);

let text = result.response.text();

// JSON dışındaki metni temizle
if (text.includes('```json')) {
  text = text.split('```json')[1].split('```')[0].trim();
} else if (text.includes('```')) {
  text = text.split('```')[1].split('```')[0].trim();
}
    console.log('🤖 AI Yanıtı:', text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      const cleanText = text.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleanText);
    }

    // Acil durum kontrolü
    if (parsed.isEmergency) {
      parsed.emergencyMessage = '⚠️ ACİL DURUM! 112\'yi arayın veya en yakın acil servise gidin!';
    }
    
    // Aile hekimi kontrolü
    if (parsed.primaryDepartment === 'aile_hekimi') {
      parsed.isFamilyDoctor = true;
      if (!parsed.familyDoctorMessage) {
        parsed.familyDoctorMessage = 'Bu şikayetiniz için hastaneye gitmenize gerek yok. Aile hekiminiz size yardımcı olabilir. Daha hızlı ve kolay!';
      }
    }

    // Bölüm isimlerini Türkçeye çevir
    parsed.primaryDepartmentName = DEPARTMENTS[parsed.primaryDepartment] || parsed.primaryDepartment;
    parsed.alternativeNames = (parsed.alternatives || []).map(id => DEPARTMENTS[id] || id);

    console.log('✅ Sonuç:', parsed);

    res.json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    res.status(500).json({
      success: false,
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SağlıkYön Backend çalışıyor',
    timestamp: new Date().toISOString() 
  });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`🚀 Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});