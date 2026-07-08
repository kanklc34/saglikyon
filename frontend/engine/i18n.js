// ============================================
// SağlıkYön – i18n (Dil Dosyası)
// ============================================

export const STRINGS = {
    tr: {
        // Header
        elderlyMode: 'Yaşlı Modu',
        standardMode: 'Standart',
        langToggle: 'English',

        // Hero
        eyebrow: "Ön Değerlendirme",
        heroTitle: 'Nasıl hissediyorsunuz?',
        heroSub: 'Şikayetinizi doğal dilde yazın. Sistem analiz ederek doğru bölümü ve aciliyet düzeyini belirler.',
        bmToggleLabel: 'Anlatmakta zorlanıyorsanız vücut haritasından işaretleyin',
        bodyMapScreenTitle: 'Ağrının veya rahatsızlığın olduğu bölgeye dokunun',
        sevEmergency: 'Acil',
        sevSoon: 'Yakın zamanda görün',
        sevRoutine: 'Rutin takip',

        // Input
        placeholder: 'Örn: Üç gündür başım ağrıyor, bulantım var ve ışığa bakınca artıyor…',
        analyzeBtn: 'Hangi Bölüme Gitmeliyim?',
        charLimit: '/500',

        // Chips
        chips: ['Baş ağrısı + bulantı', 'Göğüs ağrısı + nefes darlığı', 'Bel ağrısı', 'Ateş + boğaz ağrısı'],

        // Body map
        bodyMapHint: 'Bir bölgeye tıklayın',
        bodyMapLabel: 'Vücut haritasından da seçebilirsiniz',
        viewFront: 'Ön',
        viewBack: 'Arka',
        bmDontKnow: '⚠ Tam olarak ne olduğunu bilmiyorum',
        bmAdded: (c) => `"${c}" şikayet listesine eklendi.`,
        bmAddMore: 'Bu bölgede başka şikayet ekle',
        bmStartAnalysis: 'Analizi başlat',
        bmClose: 'Kapat',
        bmBack: 'Geri',

        // Trust row
        trust: ['Veri cihazda kalır', '4 seviyeli triage', 'Takip soruları', 'Acil tespiti'],

        // Loading
        loadingTitle: 'Analiz ediliyor…',
        loadingSteps: ['Metin ayrıştırılıyor', 'Semptomlar eşleştiriliyor', 'Aciliyet hesaplanıyor'],

        // Follow-up
        yesBtn: 'Evet',
        noBtn: 'Hayır',
        unsureBtn: 'Emin Değilim',
        evaluating: 'Cevaplarınız değerlendiriliyor…',

        // Result
        newQuery: 'Yeni sorgulama',
        suggestedDept: 'Önerilen Bölüm',
        detectedSymptoms: 'Tespit edilen belirtiler',
        otherOptions: 'Diğer olasılıklar:',
        highConf: 'Yüksek güven',
        medConf: 'Orta güven',
        lowConf: 'Düşük güven',
        confInfoText: 'Bu yüzde, belirttiğiniz semptomların bu bölümün tipik vaka örüntüsüyle ne kadar örtüştüğünü gösterir. Kesin bir tıbbi olasılık veya teşhis değildir.',
        mhrsBtn: 'MHRS Randevu',
        copyBtn: 'Özet Kopyala',
        copied: 'Kopyalandı',
        disclaimer: 'Bu öneri teşhis değildir. Kesin tanı için doktora gidiniz.',
        feedbackQuestion: 'Bu sonuç faydalı oldu mu?',
        feedbackYes: 'Faydalı oldu',
        feedbackNo: 'Faydalı olmadı',
        feedbackThanks: 'Geri bildiriminiz için teşekkürler.',
        familyDoctorTitle: 'Aile Hekiminize Başvurun',
        familyDoctorSub: 'Belirtileriniz aile hekimi düzeyinde değerlendirilebilir.',
        familyBenefits: ['Daha hızlı randevu', 'Daha yakın konum', 'Sevk kolaylığı'],

        // Emergency
        emergencyTitle: 'Acil Müdahale Gerekebilir',
        emergencyDefault: 'Belirtileriniz acil müdahale gerektirebilir.',
        callBtn: "112'yi Ara",
        emergencyNote: 'veya en yakın acil servise gidin — sürüş güvensizse ambulans isteyin',
        backBtn: 'Geri dön',

        // History
        historyTitle: 'Geçmiş',
        historyEmpty: 'Henüz sorgulama yok.',
        clearHistory: 'Temizle',

        // Rate limit
        rateLimitWait: 'Limit: {t} bekleyin',
        rateLimitRemaining: 'Kalan: {r}/{l}',

        // Errors
        errorMin: 'Lütfen şikayetinizi en az 5 karakter ile açıklayın.',
        errorRateLimit: 'Çok hızlı sorgu. {t} sonra tekrar deneyin.',
        errorNoMatch: 'Şikayetinizi yeterince net anlayamadım. Lütfen daha detaylı yazın veya vücut haritasından destek alın.',
        errorSuggestion: 'Örnek: "Başım ağrıyor ve mide bulantım var" veya "Göğsümde baskı hissediyorum".',
        errorAnalysis: 'Analiz hatası. Lütfen tekrar deneyin.',

        // Voice
        voiceListening: 'Dinliyorum…',
        voiceAdded: '"{t}" eklendi',
        voiceError: 'Ses anlaşılamadı.',

        // Copy note
        copyDate: (d) => `SağlıkYön – ${d}`,
        copyComplaint: 'Şikayet',
        copyDept: 'Önerilen Bölüm',
        copyUrgency: 'Aciliyet',
        copyConf: 'Güven',
        copySymptoms: 'Belirtiler',
        copyExtra: 'Ek Bilgiler',
        copyDisclaimer: 'Bu öneri teşhis değildir.',

        // Follow-up universal questions
        followUpUniversal: [
            {
                question: 'Bu şikayet ne zamandır devam ediyor?',
                type: 'options',
                options: ['Bugün başladı', '2-3 gündür var', '1 haftadır var', '1 aydan uzun süredir'],
                optionWeights: [0.25, 0.55, 0.8, 1.0],
                impact: { dahiliye: 0.05 }
            },
            {
                question: 'Şikayetinizin şiddeti nasıl?',
                type: 'options',
                options: ['Hafif, günlük hayatı etkilemiyor', 'Orta, rahatsız edici', 'Şiddetli, dayanılması güç'],
                optionWeights: [0.2, 0.6, 1.0],
                impact: { dahiliye: 0.1 }
            },
            {
                question: 'Ateşiniz var mı?',
                type: 'yesno',
                impact: { dahiliye: 0.15, aile_hekimi: 0.1 }
            },
            {
                question: 'Başka eşlik eden belirtileriniz var mı? (bulantı, baş dönmesi, yorgunluk vb.)',
                type: 'yesno',
                impact: { dahiliye: 0.1 }
            }
        ],

        // Footer
        footerWarning: '⚠️ Bu platform teşhis koymaz — sadece yönlendirir.',
        footerLicense: 'MIT Lisans',
        footerSymptoms: '155+ Semptom',
    },

    en: {
        // Header
        elderlyMode: 'Senior Mode',
        standardMode: 'Standard',
        langToggle: 'Türkçe',

        // Hero
        eyebrow: "Pre-Assessment",
        heroTitle: 'How are you feeling?',
        heroSub: 'Describe your symptoms in natural language. The system will identify the right department and urgency level.',
        bmToggleLabel: "Having trouble describing it? Mark it on the body map instead",
        bodyMapScreenTitle: 'Touch the area where you feel pain or discomfort',
        sevEmergency: 'Emergency',
        sevSoon: 'See a doctor soon',
        sevRoutine: 'Routine follow-up',

        // Input
        placeholder: 'E.g.: I have had a headache for three days, feel nauseous and it gets worse in bright light…',
        analyzeBtn: 'Which Department Should I Visit?',
        charLimit: '/500',

        // Chips
        chips: ['Headache + nausea', 'Chest pain + shortness of breath', 'Back pain', 'Fever + sore throat'],

        // Body map
        bodyMapHint: 'Click on a region',
        bodyMapLabel: 'You can also use the body map',
        viewFront: 'Front',
        viewBack: 'Back',
        bmDontKnow: "⚠ I'm not sure exactly what it is",
        bmAdded: (c) => `"${c}" was added to your complaint list.`,
        bmAddMore: 'Add another complaint in this area',
        bmStartAnalysis: 'Start analysis',
        bmClose: 'Close',
        bmBack: 'Back',

        // Trust row
        trust: ['Data stays on device', '4-level triage', 'Follow-up questions', 'Emergency detection'],

        // Loading
        loadingTitle: 'Analyzing…',
        loadingSteps: ['Parsing text', 'Matching symptoms', 'Calculating urgency'],

        // Follow-up
        yesBtn: 'Yes',
        noBtn: 'No',
        unsureBtn: 'Not Sure',
        evaluating: 'Evaluating your answers…',

        // Result
        newQuery: 'New query',
        suggestedDept: 'Suggested Department',
        detectedSymptoms: 'Detected symptoms',
        otherOptions: 'Other possibilities:',
        highConf: 'High confidence',
        medConf: 'Medium confidence',
        lowConf: 'Low confidence',
        confInfoText: 'This percentage shows how closely your described symptoms match the typical pattern for this department. It is not a precise medical probability or diagnosis.',
        mhrsBtn: 'Book Appointment',
        copyBtn: 'Copy Summary',
        copied: 'Copied',
        disclaimer: 'This is not a diagnosis. Please see a doctor for a definitive assessment.',
        feedbackQuestion: 'Was this result helpful?',
        feedbackYes: 'Helpful',
        feedbackNo: 'Not helpful',
        feedbackThanks: 'Thanks for your feedback.',
        familyDoctorTitle: 'See Your General Practitioner',
        familyDoctorSub: 'Your symptoms can be initially assessed by a GP.',
        familyBenefits: ['Faster appointment', 'Closer location', 'Easy referral'],

        // Emergency
        emergencyTitle: 'Emergency Attention Required',
        emergencyDefault: 'Your symptoms may require emergency intervention.',
        callBtn: 'Call 112',
        emergencyNote: 'or go to the nearest emergency room — call an ambulance if driving is unsafe',
        backBtn: 'Go back',

        // History
        historyTitle: 'History',
        historyEmpty: 'No queries yet.',
        clearHistory: 'Clear',

        // Rate limit
        rateLimitWait: 'Limit: wait {t}',
        rateLimitRemaining: 'Remaining: {r}/{l}',

        // Errors
        errorMin: 'Please describe your complaint with at least 5 characters.',
        errorRateLimit: 'Too fast. Try again in {t}.',
        errorNoMatch: 'Could not understand your complaint clearly. Please describe in more detail or use the body map.',
        errorSuggestion: 'Example: "I have a headache and nausea" or "I feel pressure in my chest".',
        errorAnalysis: 'Analysis error. Please try again.',

        // Voice
        voiceListening: 'Listening…',
        voiceAdded: '"{t}" added',
        voiceError: 'Could not understand audio.',

        // Copy note
        copyDate: (d) => `SağlıkYön – ${d}`,
        copyComplaint: 'Complaint',
        copyDept: 'Suggested Department',
        copyUrgency: 'Urgency',
        copyConf: 'Confidence',
        copySymptoms: 'Symptoms',
        copyExtra: 'Additional Info',
        copyDisclaimer: 'This is not a diagnosis.',

        // Follow-up universal questions
        followUpUniversal: [
            {
                question: 'How long have you had this complaint?',
                type: 'options',
                options: ['Started today', '2-3 days', 'About a week', 'More than a month'],
                optionWeights: [0.25, 0.55, 0.8, 1.0],
                impact: { dahiliye: 0.05 }
            },
            {
                question: 'How severe is it?',
                type: 'options',
                options: ['Mild, not affecting daily life', 'Moderate, bothersome', 'Severe, hard to bear'],
                optionWeights: [0.2, 0.6, 1.0],
                impact: { dahiliye: 0.1 }
            },
            {
                question: 'Do you have a fever?',
                type: 'yesno',
                impact: { dahiliye: 0.15, aile_hekimi: 0.1 }
            },
            {
                question: 'Do you have any other accompanying symptoms? (nausea, dizziness, fatigue, etc.)',
                type: 'yesno',
                impact: { dahiliye: 0.1 }
            }
        ],

        // Footer
        footerWarning: '⚠️ This platform does not diagnose — it only guides.',
        footerLicense: 'MIT License',
        footerSymptoms: '155+ Symptoms',
    }
};