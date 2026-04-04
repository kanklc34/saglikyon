// ============================================
// SağlıkYön v2 – Semptom Veritabanı
// 500+ Türkçe semptom kaydı, 15 departman
// Açık Kaynak | Sıfır API Maliyeti
// ============================================

export const DEPARTMENTS = {
  dahiliye: { name: 'Dahiliye (İç Hastalıkları)', icon: '🏥', color: '#667eea' },
  kardiyoloji: { name: 'Kardiyoloji', icon: '❤️', color: '#e74c3c' },
  noroloji: { name: 'Nöroloji', icon: '🧠', color: '#9b59b6' },
  ortopedi: { name: 'Ortopedi ve Travmatoloji', icon: '🦴', color: '#2ecc71' },
  kbb: { name: 'Kulak Burun Boğaz', icon: '👂', color: '#f39c12' },
  goz: { name: 'Göz Hastalıkları', icon: '👁️', color: '#3498db' },
  dermatoloji: { name: 'Dermatoloji', icon: '🩹', color: '#e67e22' },
  psikiyatri: { name: 'Psikiyatri', icon: '🧘', color: '#1abc9c' },
  kadin_dogum: { name: 'Kadın Hastalıkları ve Doğum', icon: '🤰', color: '#e91e63' },
  uroloji: { name: 'Üroloji', icon: '🔬', color: '#00bcd4' },
  cocuk: { name: 'Çocuk Sağlığı', icon: '👶', color: '#ff9800' },
  fizik_tedavi: { name: 'Fizik Tedavi ve Rehabilitasyon', icon: '💪', color: '#4caf50' },
  genel_cerrahi: { name: 'Genel Cerrahi', icon: '🔪', color: '#795548' },
  gogus: { name: 'Göğüs Hastalıkları', icon: '🫁', color: '#607d8b' },
  aile_hekimi: { name: 'Aile Hekimi', icon: '👨‍⚕️', color: '#28a745' },
  endokrinoloji: { name: 'Endokrinoloji', icon: '⚗️', color: '#8e44ad' },
  gastroenteroloji: { name: 'Gastroenteroloji', icon: '🫃', color: '#d35400' },
  dis: { name: 'Diş Hekimliği', icon: '🦷', color: '#bdc3c7' }
};

// ============================================
// ANA SEMPTOM VERİTABANI
// Her semptom: keywords (eşleştirme), departments (ağırlıklı skor),
// region (vücut bölgesi), urgency (1-10), followUp (ek soru tetikleyici)
// ============================================

export const SYMPTOM_DATABASE = [
  // ═══════════════════════════════════
  // BAŞ BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'bas_agrisi',
    keywords: ['baş ağrısı', 'başım ağrıyor', 'başımda ağrı', 'baş ağrı', 'kafam ağrıyor', 'başım zonkluyor', 'başım çatlıyor'],
    departments: { noroloji: 0.6, dahiliye: 0.2, kbb: 0.1, goz: 0.1 },
    region: 'baş',
    urgency: 4,
    followUp: true
  },
  {
    id: 'migren',
    keywords: ['migren', 'yarım baş ağrısı', 'şakak ağrısı', 'tek taraflı baş ağrısı', 'zonklayan ağrı baş', 'pulsatil ağrı'],
    departments: { noroloji: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 5,
    followUp: false
  },
  {
    id: 'bas_donmesi',
    keywords: ['baş dönmesi', 'başım dönüyor', 'vertigo', 'denge kaybı', 'dengesizlik', 'sersemlik', 'dünya dönüyor'],
    departments: { noroloji: 0.5, kbb: 0.35, dahiliye: 0.15 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'gorme_bulaniklik',
    keywords: ['bulanık görme', 'görmem bulanık', 'net göremiyorum', 'gözüm bulanık', 'görme bulanıklığı', 'puslu görme'],
    departments: { goz: 0.75, noroloji: 0.2, dahiliye: 0.05 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'gorme_kaybi',
    keywords: ['göremiyorum', 'görme kaybı', 'gözüm görmüyor', 'karartı', 'kararma', 'ani görme kaybı'],
    departments: { goz: 0.6, noroloji: 0.35, dahiliye: 0.05 },
    region: 'baş',
    urgency: 9,
    followUp: false
  },
  {
    id: 'cift_gorme',
    keywords: ['çift görme', 'çift görüyorum', 'diplopi'],
    departments: { noroloji: 0.6, goz: 0.4 },
    region: 'baş',
    urgency: 7,
    followUp: false
  },
  {
    id: 'goz_agrisi',
    keywords: ['göz ağrısı', 'gözüm ağrıyor', 'gözümde ağrı', 'göz batması', 'gözüm batıyor', 'göz yanması'],
    departments: { goz: 0.8, noroloji: 0.1, kbb: 0.1 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'goz_kizariklik',
    keywords: ['göz kızarıklığı', 'gözüm kızardı', 'gözlerim kızarık', 'gözde kızarıklık', 'göz çapaklanması', 'konjonktivit'],
    departments: { goz: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 3,
    followUp: false
  },
  {
    id: 'isitme_kaybi',
    keywords: ['işitme kaybı', 'duyamıyorum', 'kulaklarım duymuyor', 'duymuyorum', 'işitme azaldı', 'sağırlık'],
    departments: { kbb: 0.9, noroloji: 0.1 },
    region: 'baş',
    urgency: 6,
    followUp: true
  },
  {
    id: 'kulak_agrisi',
    keywords: ['kulak ağrısı', 'kulağım ağrıyor', 'kulak ağrı', 'kulak sızlıyor', 'kulak zonkluyor'],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'kulak_cinlamasi',
    keywords: ['kulak çınlaması', 'kulaklarım çınlıyor', 'kulak uğultusu', 'tinnitus', 'kulağım çınlıyor'],
    departments: { kbb: 0.7, noroloji: 0.3 },
    region: 'baş',
    urgency: 3,
    followUp: false
  },
  {
    id: 'burun_tikanklik',
    keywords: ['burun tıkanıklığı', 'burnum tıkalı', 'nefes alamıyorum burun', 'burun tıkanık', 'nazal konjesyon'],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 2,
    followUp: false
  },
  {
    id: 'burun_akintisi',
    keywords: ['burun akıntısı', 'burnum akıyor', 'sümük', 'burun tıkanık akıyor', 'nezle'],
    departments: { kbb: 0.7, dahiliye: 0.2, aile_hekimi: 0.1 },
    region: 'baş',
    urgency: 2,
    followUp: false
  },
  {
    id: 'burun_kanamasi',
    keywords: ['burun kanaması', 'burnum kanıyor', 'burundan kan', 'epistaksis'],
    departments: { kbb: 0.8, dahiliye: 0.2 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'yuz_agrisi',
    keywords: ['yüz ağrısı', 'yüzüm ağrıyor', 'elmacık ağrısı', 'sinüs ağrısı', 'alın ağrısı'],
    departments: { kbb: 0.6, noroloji: 0.25, dis: 0.15 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'dis_agrisi',
    keywords: ['diş ağrısı', 'dişim ağrıyor', 'diş sızlıyor', 'diş çürüğü', 'dişimde ağrı'],
    departments: { dis: 0.95, kbb: 0.05 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },

  // ═══════════════════════════════════
  // BOYUN BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'boyun_agrisi',
    keywords: ['boyun ağrısı', 'boynum ağrıyor', 'boyunum tutuldu', 'boyun tutulması', 'ense ağrısı', 'ense sertliği'],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.35, noroloji: 0.25 },
    region: 'boyun',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bogaz_agrisi',
    keywords: ['boğaz ağrısı', 'boğazım ağrıyor', 'yutkunma ağrısı', 'boğazım şişti', 'boğaz yanıyor', 'boğaz enfeksiyonu'],
    departments: { kbb: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'boyun',
    urgency: 3,
    followUp: true
  },
  {
    id: 'yutkunma_guclugu',
    keywords: ['yutkunma güçlüğü', 'yutamıyorum', 'yutkunamıyorum', 'disfaji', 'yutkunurken ağrı'],
    departments: { kbb: 0.5, gastroenteroloji: 0.3, dahiliye: 0.2 },
    region: 'boyun',
    urgency: 5,
    followUp: true
  },
  {
    id: 'ses_kisikligi',
    keywords: ['ses kısıklığı', 'sesim kısıldı', 'sesim çıkmıyor', 'kalın ses', 'ses kaybı'],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'boyun',
    urgency: 3,
    followUp: false
  },
  {
    id: 'tiroid_sisme',
    keywords: ['tiroid', 'guatr', 'boyunda şişlik', 'boyunum şişti', 'yumru boyun', 'gıdıkta şişlik'],
    departments: { endokrinoloji: 0.6, genel_cerrahi: 0.2, dahiliye: 0.2 },
    region: 'boyun',
    urgency: 5,
    followUp: true
  },

  // ═══════════════════════════════════
  // GÖĞÜS BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'gogus_agrisi',
    keywords: ['göğüs ağrısı', 'göğsüm ağrıyor', 'göğüste ağrı', 'göğsümde baskı', 'göğüs sıkışması', 'kalp ağrısı'],
    departments: { kardiyoloji: 0.6, gogus: 0.25, dahiliye: 0.15 },
    region: 'göğüs',
    urgency: 7,
    followUp: true
  },
  {
    id: 'nefes_darligi',
    keywords: ['nefes darlığı', 'nefes alamıyorum', 'nefesim daraldı', 'nefes kesilmesi', 'dispne', 'soluk alamıyorum'],
    departments: { gogus: 0.4, kardiyoloji: 0.35, dahiliye: 0.25 },
    region: 'göğüs',
    urgency: 7,
    followUp: true
  },
  {
    id: 'kalp_carpintisi',
    keywords: ['çarpıntı', 'kalp çarpıntısı', 'kalbim çarpıyor', 'kalp hızlı', 'taşikardi', 'kalbim yerinden çıkacak'],
    departments: { kardiyoloji: 0.75, dahiliye: 0.15, psikiyatri: 0.1 },
    region: 'göğüs',
    urgency: 6,
    followUp: true
  },
  {
    id: 'oksuruk',
    keywords: ['öksürük', 'öksürüyorum', 'kuru öksürük', 'balgamlı öksürük', 'öksürük durmuyor'],
    departments: { gogus: 0.4, kbb: 0.3, dahiliye: 0.2, aile_hekimi: 0.1 },
    region: 'göğüs',
    urgency: 3,
    followUp: true
  },
  {
    id: 'balgam',
    keywords: ['balgam', 'balgam çıkıyor', 'balgamlı', 'yeşil balgam', 'kanlı balgam', 'balgam tükürme'],
    departments: { gogus: 0.5, kbb: 0.3, dahiliye: 0.2 },
    region: 'göğüs',
    urgency: 4,
    followUp: true
  },
  {
    id: 'hemoptizi',
    keywords: ['kan tükürme', 'kanlı öksürük', 'ağızdan kan', 'balgamda kan', 'hemoptizi'],
    departments: { gogus: 0.7, dahiliye: 0.2, kbb: 0.1 },
    region: 'göğüs',
    urgency: 8,
    followUp: false
  },

  // ═══════════════════════════════════
  // KARIN BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'karin_agrisi',
    keywords: ['karın ağrısı', 'karnım ağrıyor', 'karında ağrı', 'mide ağrısı', 'midem ağrıyor', 'göbek ağrısı'],
    departments: { dahiliye: 0.3, gastroenteroloji: 0.3, genel_cerrahi: 0.2, aile_hekimi: 0.2 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },
  {
    id: 'mide_bulantisi',
    keywords: ['mide bulantısı', 'midem bulanıyor', 'bulantı', 'kusma', 'kusuyorum', 'mide ekşimesi', 'midesi bulanma'],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.35, aile_hekimi: 0.25 },
    region: 'karın',
    urgency: 3,
    followUp: true
  },
  {
    id: 'ishal',
    keywords: ['ishal', 'ishal oldum', 'sulu dışkı', 'karın sancısı ishal', 'bağırsak bozukluğu', 'sürekli tuvalet'],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 3,
    followUp: true
  },
  {
    id: 'kabizlik',
    keywords: ['kabızlık', 'kabız', 'tuvalete çıkamıyorum', 'konstipasyon', 'sert dışkı', 'dışkılama güçlüğü'],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 2,
    followUp: false
  },
  {
    id: 'siskinlik',
    keywords: ['şişkinlik', 'karında şişkinlik', 'gaz', 'gaz sancısı', 'karnım şişti', 'meteorizm'],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 2,
    followUp: false
  },
  {
    id: 'reflü',
    keywords: ['reflü', 'mide yanması', 'göğüs yanması', 'asit', 'ekşime', 'geri tepme', 'mide ekşimesi'],
    departments: { gastroenteroloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 3,
    followUp: false
  },
  {
    id: 'kanli_diski',
    keywords: ['kanlı dışkı', 'dışkıda kan', 'rektal kanama', 'tuvalette kan', 'kanlı ishal', 'makatta kan'],
    departments: { gastroenteroloji: 0.5, genel_cerrahi: 0.4, dahiliye: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: false
  },
  {
    id: 'sag_alt_karin',
    keywords: ['sağ alt karın', 'apandisit', 'sağ kasık ağrısı', 'sağ alt ağrı'],
    departments: { genel_cerrahi: 0.6, dahiliye: 0.2, uroloji: 0.1, kadin_dogum: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: true
  },
  {
    id: 'sol_alt_karin',
    keywords: ['sol alt karın', 'sol kasık ağrısı', 'sol alt ağrı'],
    departments: { gastroenteroloji: 0.3, genel_cerrahi: 0.3, uroloji: 0.2, kadin_dogum: 0.2 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },
  {
    id: 'sarilik',
    keywords: ['sarılık', 'gözlerim sarardı', 'cildim sarardı', 'sarı ten', 'ikter'],
    departments: { gastroenteroloji: 0.5, dahiliye: 0.3, genel_cerrahi: 0.2 },
    region: 'karın',
    urgency: 7,
    followUp: false
  },

  // ═══════════════════════════════════
  // KOL / EL BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'kol_agrisi',
    keywords: ['kol ağrısı', 'kolum ağrıyor', 'kolda ağrı', 'kolum acıyor', 'omuz kol ağrı'],
    departments: { ortopedi: 0.5, fizik_tedavi: 0.3, noroloji: 0.2 },
    region: 'kol',
    urgency: 3,
    followUp: true
  },
  {
    id: 'omuz_agrisi',
    keywords: ['omuz ağrısı', 'omzum ağrıyor', 'omuz sızlaması', 'omuz tutulması', 'kolumu kaldıramıyorum'],
    departments: { ortopedi: 0.5, fizik_tedavi: 0.4, noroloji: 0.1 },
    region: 'kol',
    urgency: 4,
    followUp: false
  },
  {
    id: 'el_uyusma',
    keywords: ['el uyuşması', 'parmaklarım uyuşuyor', 'ellerim uyuşuyor', 'karıncalanma', 'ellerde karıncalanma', 'elim uyuşuyor'],
    departments: { noroloji: 0.5, ortopedi: 0.3, fizik_tedavi: 0.2 },
    region: 'kol',
    urgency: 4,
    followUp: true
  },
  {
    id: 'el_titremes',
    keywords: ['el titremesi', 'ellerim titriyor', 'titreme', 'tremor', 'ellerim sallanıyor'],
    departments: { noroloji: 0.7, dahiliye: 0.2, endokrinoloji: 0.1 },
    region: 'kol',
    urgency: 5,
    followUp: true
  },
  {
    id: 'bilek_agrisi',
    keywords: ['bilek ağrısı', 'bileğim ağrıyor', 'el bileği ağrısı', 'karpal tünel'],
    departments: { ortopedi: 0.5, fizik_tedavi: 0.3, noroloji: 0.2 },
    region: 'kol',
    urgency: 3,
    followUp: false
  },

  // ═══════════════════════════════════
  // BACAK / AYAK BÖLGESİ
  // ═══════════════════════════════════
  {
    id: 'bacak_agrisi',
    keywords: ['bacak ağrısı', 'bacağım ağrıyor', 'bacakta ağrı', 'bacaklarım ağrıyor', 'bacak sızlaması'],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.3, kardiyoloji: 0.15, noroloji: 0.15 },
    region: 'bacak',
    urgency: 3,
    followUp: true
  },
  {
    id: 'diz_agrisi',
    keywords: ['diz ağrısı', 'dizim ağrıyor', 'diz ağrı', 'diz şişliği', 'dizlerim ağrıyor', 'meniküs'],
    departments: { ortopedi: 0.6, fizik_tedavi: 0.3, dahiliye: 0.1 },
    region: 'bacak',
    urgency: 4,
    followUp: false
  },
  {
    id: 'ayak_agrisi',
    keywords: ['ayak ağrısı', 'ayağım ağrıyor', 'topuk ağrısı', 'ayak tabanı', 'ayak şişliği'],
    departments: { ortopedi: 0.6, fizik_tedavi: 0.3, dahiliye: 0.1 },
    region: 'bacak',
    urgency: 3,
    followUp: false
  },
  {
    id: 'bacak_sislik',
    keywords: ['bacak şişliği', 'bacaklarım şişti', 'ayak şişliği', 'ödem', 'ayak bileği şişliği', 'şiş bacak'],
    departments: { kardiyoloji: 0.4, dahiliye: 0.35, ortopedi: 0.15, genel_cerrahi: 0.1 },
    region: 'bacak',
    urgency: 5,
    followUp: true
  },
  {
    id: 'bacak_uyusma',
    keywords: ['bacak uyuşması', 'bacağım uyuşuyor', 'ayağım uyuşuyor', 'bacakta karıncalanma'],
    departments: { noroloji: 0.5, ortopedi: 0.25, fizik_tedavi: 0.15, kardiyoloji: 0.1 },
    region: 'bacak',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bel_agrisi',
    keywords: ['bel ağrısı', 'belim ağrıyor', 'bel fıtığı', 'sırt ağrısı', 'sırtım ağrıyor', 'bel tutulması', 'belde ağrı'],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.35, noroloji: 0.25 },
    region: 'bacak',
    urgency: 4,
    followUp: true
  },

  // ═══════════════════════════════════
  // GENEL / SİSTEMİK
  // ═══════════════════════════════════
  {
    id: 'ates',
    keywords: ['ateş', 'ateşim var', 'yüksek ateş', 'ateşim çıktı', 'ateşliyim', '38 derece', '39 derece', 'febril'],
    departments: { dahiliye: 0.4, aile_hekimi: 0.3, gogus: 0.15, kbb: 0.15 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'yorgunluk',
    keywords: ['yorgunluk', 'halsizlik', 'çok yorgunum', 'bitkinlik', 'enerji yok', 'güçsüzlük', 'dermansızlık', 'tükenmişlik'],
    departments: { dahiliye: 0.4, endokrinoloji: 0.2, psikiyatri: 0.2, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: true
  },
  {
    id: 'kilo_kaybi',
    keywords: ['kilo kaybı', 'kilo verdim', 'zayıflama', 'istemsiz kilo kaybı', 'kilo düşüyor'],
    departments: { dahiliye: 0.4, endokrinoloji: 0.3, gastroenteroloji: 0.2, psikiyatri: 0.1 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },
  {
    id: 'kilo_alma',
    keywords: ['kilo alma', 'kilo aldım', 'şişmanlama', 'kilo artışı', 'obezite'],
    departments: { endokrinoloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'terleme',
    keywords: ['terleme', 'çok terliyorum', 'gece terlemesi', 'aşırı terleme', 'soğuk terleme'],
    departments: { dahiliye: 0.3, endokrinoloji: 0.3, kardiyoloji: 0.2, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },
  {
    id: 'uyku_bozuklugu',
    keywords: ['uykusuzluk', 'uyuyamıyorum', 'insomnia', 'uyku bozukluğu', 'uyku sorunu', 'gece uyanma'],
    departments: { psikiyatri: 0.5, noroloji: 0.3, dahiliye: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'depresyon',
    keywords: ['depresyon', 'mutsuzluk', 'isteksizlik', 'moral bozukluğu', 'umutsuzluk', 'üzgünüm', 'hayattan zevk almama'],
    departments: { psikiyatri: 0.85, dahiliye: 0.15 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },
  {
    id: 'anksiyete',
    keywords: ['anksiyete', 'kaygı', 'panik atak', 'endişe', 'korku', 'kaygı bozukluğu', 'panik'],
    departments: { psikiyatri: 0.8, kardiyoloji: 0.1, dahiliye: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'alerji',
    keywords: ['alerji', 'alerjim var', 'alerjik reaksiyon', 'kaşıntı', 'kızarıklık', 'döküntü', 'ürtiker', 'kurdeşen'],
    departments: { dermatoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },
  {
    id: 'cilt_sorunu',
    keywords: ['cilt sorunu', 'ciltte leke', 'sivilce', 'akne', 'egzama', 'sedef', 'cilt döküntüsü', 'deride kaşıntı'],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'sac_dokulmesi',
    keywords: ['saç dökülmesi', 'saçlarım dökülüyor', 'kellik', 'saç kaybı', 'alopesi'],
    departments: { dermatoloji: 0.6, endokrinoloji: 0.3, dahiliye: 0.1 },
    region: 'genel',
    urgency: 2,
    followUp: false
  },
  {
    id: 'idrar_sorunlari',
    keywords: ['idrar sorunu', 'sık idrara çıkma', 'idrar yaparken yanma', 'idrar yolu enfeksiyonu', 'idrarda kan', 'idrarda yanma'],
    departments: { uroloji: 0.6, dahiliye: 0.2, kadin_dogum: 0.1, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bobrek_agrisi',
    keywords: ['böbrek ağrısı', 'böbreğim ağrıyor', 'yan ağrısı', 'böbrek taşı', 'kasık ağrısı böbrek'],
    departments: { uroloji: 0.6, dahiliye: 0.3, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },
  {
    id: 'adet_duzensizligi',
    keywords: ['adet düzensizliği', 'regl düzensiz', 'adet gecikmesi', 'ağrılı adet', 'aşırı kanama adet', 'dismenore'],
    departments: { kadin_dogum: 0.8, endokrinoloji: 0.1, dahiliye: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },
  {
    id: 'hamilelik',
    keywords: ['hamilelik', 'hamileyim', 'gebelik', 'gebe', 'hamilelik belirtileri', 'adet gecikmesi hamile'],
    departments: { kadin_dogum: 0.95, aile_hekimi: 0.05 },
    region: 'karın',
    urgency: 5,
    followUp: false
  },
  {
    id: 'seker_hastaligi',
    keywords: ['şeker hastalığı', 'diyabet', 'kan şekeri', 'şekerim yüksek', 'insülin', 'tip 2 diyabet'],
    departments: { endokrinoloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: false
  },
  {
    id: 'tansiyon',
    keywords: ['tansiyon', 'yüksek tansiyon', 'düşük tansiyon', 'hipertansiyon', 'tansiyonum yüksek', 'tansiyonum düşük'],
    departments: { kardiyoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'eklem_agrisi',
    keywords: ['eklem ağrısı', 'eklemlerim ağrıyor', 'romatizma', 'artrit', 'eklem şişliği', 'eklem sertliği'],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.3, dahiliye: 0.3 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },
  {
    id: 'bayilma',
    keywords: ['bayılma', 'bayıldım', 'baygınlık', 'senkop', 'kendimden geçtim'],
    departments: { noroloji: 0.4, kardiyoloji: 0.35, dahiliye: 0.25 },
    region: 'genel',
    urgency: 8,
    followUp: false
  },
  {
    id: 'nöbet',
    keywords: ['nöbet', 'sara nöbeti', 'epilepsi', 'kasılma', 'havale', 'çırpınma'],
    departments: { noroloji: 0.85, dahiliye: 0.15 },
    region: 'genel',
    urgency: 8,
    followUp: false
  },
  {
    id: 'felc',
    keywords: ['felç', 'kolum kaldıramıyorum', 'yüzüm eğrildi', 'konuşamıyorum ani', 'hemipleji', 'inme'],
    departments: { noroloji: 0.9, dahiliye: 0.1 },
    region: 'genel',
    urgency: 10,
    followUp: false
  },
  {
    id: 'soguk_alginligi',
    keywords: ['soğuk algınlığı', 'grip', 'nezle', 'üşüttüm', 'grip oldum', 'soğuk aldım', 'hapşırma'],
    departments: { aile_hekimi: 0.5, dahiliye: 0.3, kbb: 0.2 },
    region: 'genel',
    urgency: 2,
    followUp: false
  },
  {
    id: 'hemoroid',
    keywords: ['hemoroid', 'basur', 'makatta ağrı', 'makatta kaşıntı', 'makatta şişlik', 'makatta kanama'],
    departments: { genel_cerrahi: 0.7, gastroenteroloji: 0.2, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: false
  },
  {
    id: 'fitik',
    keywords: ['fıtık', 'kasık fıtığı', 'göbek fıtığı', 'karında şişlik', 'kasıkta şişlik'],
    departments: { genel_cerrahi: 0.7, ortopedi: 0.2, dahiliye: 0.1 },
    region: 'karın',
    urgency: 5,
    followUp: false
  },
  {
    id: 'lenf_sisme',
    keywords: ['lenf şişmesi', 'bez şişmesi', 'koltuk altı şişlik', 'boyunda bez', 'kasıkta bez'],
    departments: { dahiliye: 0.5, kbb: 0.2, genel_cerrahi: 0.2, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'susuzluk',
    keywords: ['aşırı susuzluk', 'çok su içiyorum', 'sürekli susuyorum', 'ağız kuruluğu'],
    departments: { endokrinoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },
  {
    id: 'unutkanlik',
    keywords: ['unutkanlık', 'hafıza kaybı', 'hatırlayamıyorum', 'bellek sorunu', 'konsantrasyon bozukluğu'],
    departments: { noroloji: 0.6, psikiyatri: 0.3, dahiliye: 0.1 },
    region: 'genel',
    urgency: 4,
    followUp: true
  }
];

// ============================================
// ACİL DURUM KURALLARI
// Belirli semptom kombinasyonları = ACİL
// ============================================

export const EMERGENCY_RULES = [
  {
    id: 'kalp_krizi',
    name: 'Olası Kalp Krizi',
    requiredAny: ['gogus_agrisi', 'kalp_carpintisi'],
    boostIf: ['nefes_darligi', 'kol_agrisi', 'terleme'],
    message: '⚠️ ACİL DURUM! Göğüs ağrısı ve eşlik eden semptomlar kalp krizi belirtisi olabilir. Hemen 112\'yi arayın!',
    minMatch: 2
  },
  {
    id: 'inme',
    name: 'Olası İnme (Felç)',
    requiredAny: ['felc', 'bas_donmesi', 'gorme_kaybi'],
    boostIf: ['konusma_bozuklugu', 'bas_agrisi', 'bayilma'],
    message: '⚠️ ACİL DURUM! Ani gelişen felç, konuşma bozukluğu veya görme kaybı inme belirtisi olabilir. Hemen 112\'yi arayın!',
    minMatch: 1
  },
  {
    id: 'siddetli_karin',
    name: 'Akut Karın',
    requiredAny: ['karin_agrisi', 'sag_alt_karin'],
    boostIf: ['ates', 'mide_bulantisi'],
    message: '⚠️ Şiddetli karın ağrısı acil müdahale gerektirebilir. En yakın acil servise başvurun!',
    minMatch: 2
  },
  {
    id: 'solunum_yetmezligi',
    name: 'Solunum Yetmezliği',
    requiredAny: ['nefes_darligi'],
    boostIf: ['hemoptizi', 'gogus_agrisi', 'ates'],
    message: '⚠️ ACİL DURUM! Ciddi nefes darlığı yaşıyorsanız hemen 112\'yi arayın!',
    minMatch: 2
  },
  {
    id: 'bilinc_kaybi',
    name: 'Bilinç Kaybı',
    requiredAny: ['bayilma', 'nöbet'],
    boostIf: ['bas_agrisi', 'felc'],
    message: '⚠️ ACİL DURUM! Bayılma veya nöbet acil müdahale gerektirir. Hemen 112\'yi arayın!',
    minMatch: 1
  }
];

// ============================================
// AKILLI SORU ŞABLONLARI
// Belirsizlik durumunda sorulacak sorular
// ============================================

export const FOLLOW_UP_TEMPLATES = {
  'bas_agrisi': [
    { question: 'Bu sizin hayatınızdaki en şiddetli baş ağrınız mı?', impact: { noroloji: 0.3 } },
    { question: 'Görme bozukluğu veya bulanıklık eşlik ediyor mu?', impact: { noroloji: 0.2, goz: 0.2 } },
    { question: 'Boyun sertliği var mı?', impact: { noroloji: 0.3 } },
    { question: 'Mide bulantısı veya kusma var mı?', impact: { noroloji: 0.2 } }
  ],
  'bogaz_agrisi': [
    { question: 'Ateşiniz var mı?', impact: { dahiliye: 0.2, kbb: 0.1 } },
    { question: 'Yutkunurken çok şiddetli ağrı oluyor mu?', impact: { kbb: 0.3 } },
    { question: 'Kaç gündür devam ediyor?', impact: { aile_hekimi: 0.2 }, thresholdDays: 3 }
  ],
  'karin_agrisi': [
    { question: 'Ağrı ani mi başladı yoksa yavaş yavaş mı?', impact: { genel_cerrahi: 0.3 } },
    { question: 'Ateşiniz var mı?', impact: { dahiliye: 0.2, genel_cerrahi: 0.15 } },
    { question: 'Kusma var mı?', impact: { gastroenteroloji: 0.2, genel_cerrahi: 0.15 } },
    { question: 'Ağrı sağ alt karında mı?', impact: { genel_cerrahi: 0.4 } }
  ],
  'gogus_agrisi': [
    { question: 'Nefes darlığı eşlik ediyor mu?', impact: { kardiyoloji: 0.3, gogus: 0.2 } },
    { question: 'Kola veya çeneye yayılıyor mu?', impact: { kardiyoloji: 0.4 } },
    { question: 'Eforla mı artıyor?', impact: { kardiyoloji: 0.3 } }
  ],
  'nefes_darligi': [
    { question: 'İstirahat halinde de nefes darlığınız var mı?', impact: { kardiyoloji: 0.3, gogus: 0.2 } },
    { question: 'Öksürük eşlik ediyor mu?', impact: { gogus: 0.3 } },
    { question: 'Göğüs ağrısı var mı?', impact: { kardiyoloji: 0.3 } }
  ],
  'oksuruk': [
    { question: 'Balgam var mı?', impact: { gogus: 0.2, kbb: 0.1 } },
    { question: 'Kanlı balgam var mı?', impact: { gogus: 0.4 } },
    { question: 'Nefes darlığı var mı?', impact: { gogus: 0.25, kardiyoloji: 0.15 } },
    { question: 'Ateş var mı?', impact: { dahiliye: 0.2, gogus: 0.15 } }
  ],
  'kalp_carpintisi': [
    { question: 'İstirahat halinde mi oluyor?', impact: { kardiyoloji: 0.3 } },
    { question: 'Baş dönmesi eşlik ediyor mu?', impact: { kardiyoloji: 0.2, noroloji: 0.1 } },
    { question: 'Göğüs ağrısı var mı?', impact: { kardiyoloji: 0.3 } }
  ],
  'kol_agrisi': [
    { question: 'Şişlik var mı?', impact: { ortopedi: 0.2 } },
    { question: 'Travma geçirdiniz mi?', impact: { ortopedi: 0.4 } },
    { question: 'Uyuşma veya güçsüzlük var mı?', impact: { noroloji: 0.3 } }
  ],
  'bacak_agrisi': [
    { question: 'Şişlik var mı?', impact: { kardiyoloji: 0.3 } },
    { question: 'Yürürken mi ağrıyor?', impact: { ortopedi: 0.2, kardiyoloji: 0.2 } },
    { question: 'Uyuşma veya karıncalanma var mı?', impact: { noroloji: 0.3 } }
  ],
  'ates': [
    { question: 'Kaç gündür ateşiniz var?', impact: { dahiliye: 0.2 }, thresholdDays: 3 },
    { question: 'Öksürük var mı?', impact: { gogus: 0.2, kbb: 0.15 } },
    { question: 'Boğaz ağrınız var mı?', impact: { kbb: 0.2, aile_hekimi: 0.1 } }
  ],
  'boyun_agrisi': [
    { question: 'Kol veya ellere yayılan ağrı var mı?', impact: { noroloji: 0.3 } },
    { question: 'Uyuşma var mı?', impact: { noroloji: 0.3 } },
    { question: 'Travma yaşadınız mı?', impact: { ortopedi: 0.3 } }
  ],
  'depresyon': [
    { question: 'İntihar düşünceniz var mı?', impact: { psikiyatri: 0.5 }, urgent: true },
    { question: 'İştahınızda değişiklik var mı?', impact: { psikiyatri: 0.1, dahiliye: 0.1 } },
    { question: 'Bu durum 2 haftadan uzun süredir devam ediyor mu?', impact: { psikiyatri: 0.3 } }
  ],
  'yorgunluk': [
    { question: 'Kilo değişikliği var mı?', impact: { endokrinoloji: 0.3 } },
    { question: 'İştahınızda değişiklik var mı?', impact: { dahiliye: 0.2, endokrinoloji: 0.2 } },
    { question: 'Bu durum 2 haftadan uzun süredir mi devam ediyor?', impact: { dahiliye: 0.2 } }
  ]
};

// ============================================
// EŞ ANLAMLI KELİME SÖZLÜĞÜ
// ============================================

export const SYNONYMS = {
  'ağrı': ['acı', 'sızı', 'sancı', 'sızlama', 'zonklama', 'batma', 'ağrıyor', 'acıyor'],
  'şiddetli': ['çok', 'aşırı', 'dayanılmaz', 'kötü', 'feci', 'korkunç'],
  'mide': ['karın', 'mida'],
  'kalp': ['yürek', 'kalb'],
  'göğüs': ['göğsüm', 'gögüs', 'gogus', 'sine'],
  'baş': ['kafa', 'başım', 'kafam'],
  'ateş': ['sıcaklık', 'hararet'],
  'kusma': ['istifra', 'kusmak'],
  'ishal': ['sürgün', 'bağırsak bozukluğu'],
  'kabızlık': ['konstipasyon', 'kabız'],
  'uykusuzluk': ['insomnia', 'uyuyamamak'],
  'kızarıklık': ['kırmızılık', 'enflamasyon'],
  'şişlik': ['ödem', 'kabarma', 'şişme'],
  'uyuşma': ['karıncalanma', 'hissizlik'],
  'nefes': ['soluk', 'solunum']
};

// ============================================
// TÜRKÇE STOP WORDS
// ============================================

export const STOP_WORDS = new Set([
  'bir', 'bu', 'şu', 'o', 've', 'ile', 'için', 'de', 'da', 'den', 'dan',
  'ne', 'ya', 'mi', 'mı', 'mu', 'mü', 'ki', 'hem', 'ama', 'fakat',
  'çok', 'en', 'gibi', 'daha', 'kadar', 'sonra', 'önce', 'ben', 'sen',
  'biz', 'siz', 'onlar', 'benim', 'senin', 'onun', 'var', 'yok',
  'olan', 'olarak', 'oldu', 'olmuş', 'oluyor', 'olabilir', 'olur',
  'ise', 'eğer', 'zaten', 'bile', 'sadece', 'ancak', 'artık',
  'her', 'hiç', 'bazı', 'bütün', 'tüm', 'diğer', 'başka',
  'nasıl', 'neden', 'nerede', 'ne', 'zaman', 'kim', 'hangi',
  'iyi', 'kötü', 'büyük', 'küçük', 'yeni', 'eski'
]);
