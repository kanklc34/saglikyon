// [ENRİCHED 2026-05-30 10:32] +142 semptom güncellendi, +142 keywords_en eklendi, +236 yeni eş anlamlı
// ============================================
// SağlıkYön – Semptom veritabanı
// 500+ Türkçe semptom kaydı, 15 departman
// Açık kaynak | Sıfır API maliyeti
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
    keywords: [
      'baş ağrısı', 'başım ağrıyor', 'başımda ağrı', 'baş ağrı',
      'kafam ağrıyor', 'başım zonkluyor', 'başım çatlıyor',
      'başım sızlıyor', 'kafamın içi yanıyor', 'şakaklarım geriliyor',
      'beynim uyuşuyor', 'başımda ağırlık var', 'kafam kazan gibi',
      'şakaklarım atıyor', 'başım oyuluyor', 'ense köküm ağrıyor',
      'gözlerim yerinden çıkacak', 'kafamın içi zonk zonk',
      'başım dönüyor ve ağrıyor', 'tepem zonkluyor'
    ],
    keywords_en: [
      'headache', 'throbbing head', 'splitting headache',
      'pounding head', 'head pressure', 'migraine',
      'my head is killing me', 'tension headache', 'throbbing temples',
      'heavy head', 'head pain', 'my head hurts', 'banging headache'
    ],
    departments: { noroloji: 0.6, dahiliye: 0.2, kbb: 0.1, goz: 0.1 },
    region: 'baş',
    urgency: 4,
    followUp: true
  },
  {
    id: 'migren',
    keywords: [
      'migren', 'yarım baş ağrısı', 'şakak ağrısı',
      'tek taraflı baş ağrısı', 'zonklayan ağrı baş', 'pulsatil ağrı',
      'baş tutması', 'göz ağrısı', 'damar atması', 'başın tek tarafı',
      'ışıktan rahatsız olma', 'ağır baş ağrısı', 'mide bulandıran ağrı',
      'başın içi oyuluyor', 'şiddetli baş sızısı', 'göz çukuru ağrısı',
      'nöbetli baş ağrısı', 'basınçlı baş ağrısı',
      'çakma yapan baş ağrısı'
    ],
    keywords_en: [
      'migraine attack', 'throbbing headache', 'blinding headache',
      'one-sided headache', 'splitting headache', 'light sensitivity',
      'aura headache', 'severe head pain', 'pulsing sensation',
      'migraine flare-up', 'sick headache', 'throbbing behind eyes',
      'cranial pressure'
    ],
    departments: { noroloji: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 5,
    followUp: false
  },
  {
    id: 'bas_donmesi',
    keywords: [
      'baş dönmesi', 'başım dönüyor', 'vertigo', 'denge kaybı',
      'dengesizlik', 'sersemlik', 'dünya dönüyor', 'gözüm karardı',
      'yer ayağımın altından kayıyor', 'kafamın içi boşalıyor',
      'etraf dönüyor', 'sallanıyorum', 'tansiyonum düştü sanki',
      'başım havalarda', 'fırıl fırıl dönüyorum', 'feleğim şaştı',
      'gözümün önü kararıyor', 'yürürken yalpalamak',
      'boşluğa düşer gibi oldum', 'başım ağırlaştı', 'sersem gibiyim'
    ],
    keywords_en: [
      'dizzy', 'lightheaded', 'spinning', 'room is spinning',
      'off balance', 'woozy', 'unsteady', 'swaying', 'dizziness',
      'feeling faint', 'vertiginous', 'rocking sensation',
      'head feels heavy', 'giddy'
    ],
    departments: { noroloji: 0.5, kbb: 0.35, dahiliye: 0.15 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'gorme_bulaniklik',
    keywords: [
      'bulanık görme', 'görmem bulanık', 'net göremiyorum',
      'gözüm bulanık', 'görme bulanıklığı', 'puslu görme',
      'gözüme perde indi', 'buğulu görüyorum', 'gözüm kararıyor',
      'görüntü birbirine giriyor', 'sanki sisli görüyorum',
      'gözümün önü dumanlı', 'çift görüyorum', 'görüntü dağılıyor',
      'gözüm odaklanmıyor', 'gözümde tül var', 'görmem bozuldu',
      'her şey silik', 'gözümün önü kararıyor', 'netlik kayboldu',
      'gözlerim seçmiyor'
    ],
    keywords_en: [
      'blurry vision', 'fuzzy vision', 'cloudy vision', 'hazy sight',
      'vision is foggy', 'double vision', 'everything is distorted',
      'seeing through a veil', 'smudged vision', 'trouble focusing',
      'out of focus', 'dim vision', 'my sight is hazy',
      'blurred eyesight'
    ],
    departments: { goz: 0.75, noroloji: 0.2, dahiliye: 0.05 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'gorme_kaybi',
    keywords: [
      'göremiyorum', 'görme kaybı', 'gözüm görmüyor', 'karartı', 'kararma',
      'ani görme kaybı', 'gözüme perde indi', 'önümü göremiyorum',
      'gözlerim karardı', 'gözlerim seçmiyor', 'görüşüm gitti',
      'gözlerimin önü boşaldı', 'bulanıklaşıyor', 'bir anlık körlük',
      'gözümün önünde sis var', 'gözüm hiçbir şey görmüyor',
      'ışığı seçemiyorum', 'görüntü gitti', 'gözüm kapandı'
    ],
    keywords_en: [
      'vision loss', 'blindness', 'vision blurred', 'lost my sight',
      'blacked out', 'everything went dark', 'vision cut out',
      'faded to black', 'partial vision loss', 'blind spot',
      'cannot see clearly', 'dimming of vision'
    ],
    departments: { goz: 0.6, noroloji: 0.35, dahiliye: 0.05 },
    region: 'baş',
    urgency: 9,
    followUp: false
  },
  {
    id: 'cift_gorme',
    keywords: [
      'çift görme', 'çift görüyorum', 'diplopi', 'her şeyi iki görüyorum',
      'görüntüler birbirine karışıyor', 'gözüm kayıyor',
      'bir nesne iki tane', 'hayalet gibi görüyorum',
      'gözüm odaklanamıyor', 'görüntü birbirine biniyor',
      'bulanık ve iki tane', 'nesneler yan yana', 'gözümün ayarı bozuldu',
      'ikileşme oluyor', 'tek şey çift görünüyor', 'görüntüler üst üste'
    ],
    keywords_en: [
      'double vision', 'seeing double', 'diplopia', 'ghosting',
      'blurred vision', 'overlapping images', 'split vision',
      'my eyes are crossing', 'shadowy vision', 'distorted sight',
      'double image', 'vision doubling', 'double sight'
    ],
    departments: { noroloji: 0.6, goz: 0.4 },
    region: 'baş',
    urgency: 7,
    followUp: false
  },
  {
    id: 'goz_agrisi',
    keywords: [
      'göz ağrısı', 'gözüm ağrıyor', 'gözümde ağrı', 'göz batması',
      'gözüm batıyor', 'göz yanması', 'göz sancısı', 'gözüm sızlıyor',
      'gözümde kum var gibi', 'göz yorgunluğu', 'gözüm oyuluyor sanki',
      'göz ağrısı tuttu', 'göz bebeklerim sızlıyor', 'gözüm çekiliyor',
      'gözümde bir şey var', 'gözümün içi acıyor', 'gözüme bir şey battı',
      'göz çevrem zonkluyor', 'gözlerim yerinden çıkacak'
    ],
    keywords_en: [
      'eye pain', 'stabbing eye pain', 'eye feels gritty', 'aching eyes',
      'throbbing eye', 'eye strain', 'burning sensation in eyes',
      'sharp pain in eye', 'sore eyes', 'eye tenderness',
      'feels like sand in eye', 'eye irritation', 'piercing eye pain'
    ],
    departments: { goz: 0.8, noroloji: 0.1, kbb: 0.1 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'goz_kizariklik',
    keywords: [
      'göz kızarıklığı', 'gözüm kızardı', 'gözlerim kızarık',
      'gözde kızarıklık', 'göz çapaklanması', 'konjonktivit',
      'göz kanlanması', 'gözüm kan çanağı', 'gözde kanlanma',
      'gözlerimin içi yanıyor', 'gözümde kan toplaması', 'gözüm kanıyor',
      'gözde irinlenme', 'gözümde yangı var', 'gözlerde kan kırmızı',
      'gözüm pespembe oldu', 'gözümün akı kızardı', 'gözde iltihaplanma',
      'gözümde damarlar belirgin', 'gözümde sıcaklık var'
    ],
    keywords_en: [
      'bloodshot eyes', 'red eyes', 'eye redness', 'irritated eyes',
      'pink eye', 'eye inflammation', 'bloodshot', 'strained eyes',
      'itchy red eyes', 'conjunctival hyperemia', 'watery red eyes',
      'burning eyes', 'eye irritation', 'redness in the eye'
    ],
    departments: { goz: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 3,
    followUp: false
  },
  {
    id: 'isitme_kaybi',
    keywords: [
      'işitme kaybı', 'duyamıyorum', 'kulaklarım duymuyor', 'duymuyorum',
      'işitme azaldı', 'sağırlık', 'kulağım ağırlaştı',
      'sesleri zor alıyorum', 'kulaklarım uğulduyor',
      'sesler derinden geliyor', 'kulağıma tül perde indi',
      'çınlama var duyamıyorum', 'sesler boğuk geliyor',
      'bir kulağım az çekiyor', 'kulağım tıkalı gibi', 'duymam zayıfladı',
      'kulaklarımda dolgunluk var', 'sesi algılayamıyorum',
      'kulağım mühürlendi', 'kulaklarımda ağırlık var',
      'dış dünyadan koptum'
    ],
    keywords_en: [
      'hearing loss', 'hard of hearing', 'muffled hearing',
      'ears feel plugged', 'hearing impairment', 'sounds are fading',
      'diminished hearing', 'ear congestion', 'difficulty hearing',
      'poor hearing', 'hearing threshold shift',
      'sounds like underwater', 'missing part of speech',
      'auditory decline'
    ],
    departments: { kbb: 0.9, noroloji: 0.1 },
    region: 'baş',
    urgency: 6,
    followUp: true
  },
  {
    id: 'kulak_agrisi',
    keywords: [
      'kulak ağrısı', 'kulağım ağrıyor', 'kulak ağrı', 'kulak sızlıyor',
      'kulak zonkluyor', 'kulağıma bıçak saplanıyor', 'kulağım uğulduyor',
      'kulağımda baskı var', 'kulak içinde batma', 'kulağım tıkandı',
      'kulak içinde zonklama', 'kulağım deliniyor gibi',
      'kulağımda basınç var', 'kulak sancısı', 'kulağımın içi yanıyor',
      'kulağım dolgun', 'kulağım ağırlaştı', 'kulak ağrısı tuttu',
      'kulağım sızlar'
    ],
    keywords_en: [
      'earache', 'throbbing ear', 'ear pain', 'sharp ear pain',
      'ear pressure', 'stabbing ear sensation', 'clogged ear',
      'ear fullness', 'aching ear', 'ear feels blocked',
      'shooting ear pain', 'ear infection pain', 'ear sensitivity',
      'dull ear ache'
    ],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'kulak_cinlamasi',
    keywords: [
      'kulak çınlaması', 'kulaklarım çınlıyor', 'kulak uğultusu',
      'tinnitus', 'kulağım çınlıyor', 'kulakta ses var', 'kulağım ötüyor',
      'kulak çınlaması başladı', 'kulağımda cızırtı', 'kulak sesi',
      'kulağımda rüzgar sesi', 'kulağım vınlıyor',
      'kulak dolgunluğu ve çınlama', 'kulağımda sürekli ses',
      'çınlama şikayeti', 'kulağımda uğuldama var',
      'kulağım mıncıklanıyor'
    ],
    keywords_en: [
      'ringing in ears', 'ear buzzing', 'ear ringing', 'head noise',
      'ringing sensation', 'ear whooshing', 'ear whistling',
      'persistent ear noise', 'rushing sound in ear',
      'pulsatile tinnitus', 'ear hissing', 'ringing in my head'
    ],
    departments: { kbb: 0.7, noroloji: 0.3 },
    region: 'baş',
    urgency: 3,
    followUp: false
  },
  {
    id: 'burun_tikanklik',
    keywords: [
      'burun tıkanıklığı', 'burnum tıkalı', 'nefes alamıyorum burun',
      'burun tıkanık', 'nazal konjesyon', 'burnum açılmıyor',
      'burnum çekilmiyor', 'genzim dolu', 'burnumda et var sanki',
      'nefesim tıkandı', 'burnum nefes almıyor', 'burun deliklerim kapalı',
      'burun kanallarım tıkalı', 'burnumdan nefes alamıyorum',
      'burnum hava geçirmiyor', 'burun tutukluğu',
      'burnumda tıkanıklık var', 'burnum tıkandı yine'
    ],
    keywords_en: [
      'stuffy nose', 'blocked nose', 'congested nose', 'nasal blockage',
      'stuffed up', 'my nose is clogged', 'nose feels blocked',
      'nasal congestion', 'blocked up', 'cannot breathe nasally',
      'stuffy head'
    ],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'baş',
    urgency: 2,
    followUp: false
  },
  {
    id: 'burun_akintisi',
    keywords: [
      'burun akıntısı', 'burnum akıyor', 'sümük', 'burun tıkanık akıyor',
      'nezle', 'burnum şırıl şırıl', 'burnumun direği sızlıyor',
      'geniz akıntısı', 'burun şıpırtısı', 'burnumdan su geliyor',
      'burnum sızıyor', 'akıntı var', 'burun sümüklenmesi',
      'burnum durmadan akıyor', 'sümüklü oldum', 'burnum akıp duruyor',
      'burnumun suyu akıyor'
    ],
    keywords_en: [
      'runny nose', 'nasal discharge', 'stuffy nose', 'sniffles',
      'snotty nose', 'drippy nose', 'rhinorrhea', 'congested nose',
      'nose running', 'blocked nose', 'nasal congestion', 'nasal drip'
    ],
    departments: { kbb: 0.7, dahiliye: 0.2, aile_hekimi: 0.1 },
    region: 'baş',
    urgency: 2,
    followUp: false
  },
  {
    id: 'burun_kanamasi',
    keywords: [
      'burun kanaması', 'burnum kanıyor', 'burundan kan', 'epistaksis',
      'burnumdan kan geliyor', 'burnum pıhtılaştı',
      'burun damarım çatladı', 'genzime kan akıyor',
      'burnum durmadan kanıyor', 'burnumdan fışkırdı',
      'burun kanaması geçirdim', 'burnumun içi kanadı',
      'sürekli burnum kanıyor', 'burun kanı durmuyor',
      'burnumdan damlıyor', 'burun içi kanama', 'burnum kan revan',
      'geniz kanaması'
    ],
    keywords_en: [
      'nosebleed', 'bloody nose', 'nose is bleeding', 'nasal hemorrhage',
      'dripping blood from nose', 'nose started bleeding',
      'nose bleed incident', 'nasal bleeding', 'bleeding nostrils',
      'nose hemorrhage', 'nose gushing blood', 'bleeding from my nose',
      'minor nose bleed', 'recurrent nosebleeds'
    ],
    departments: { kbb: 0.8, dahiliye: 0.2 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },
  {
    id: 'yuz_agrisi',
    keywords: [
      'yüz ağrısı', 'yüzüm ağrıyor', 'elmacık ağrısı', 'sinüs ağrısı',
      'alın ağrısı', 'yüzüm sızlıyor', 'yüzüme vuran ağrı',
      'çene ve yüz ağrısı', 'yüzümde batma var', 'şakaklarım sızlıyor',
      'yüzümde baskı hissediyorum', 'yüzüm zonkluyor',
      'yüzümde uyuşuk ağrı', 'göz çevresi ağrısı', 'yüzümde çekilme var',
      'yanaklarım ağrıyor', 'yüz ağrısı sancısı', 'yüzümde yanma hissi'
    ],
    keywords_en: [
      'facial pain', 'face hurts', 'throbbing face', 'facial pressure',
      'cheek pain', 'stabbing face pain', 'face feels tight',
      'facial aching', 'sinus pressure', 'jaw and face pain',
      'face tenderness', 'sharp facial pain', 'facial discomfort'
    ],
    departments: { kbb: 0.6, noroloji: 0.25, dis: 0.15 },
    region: 'baş',
    urgency: 4,
    followUp: false
  },
  {
    id: 'dis_agrisi',
    keywords: [
      'diş ağrısı', 'dişim ağrıyor', 'diş sızlıyor', 'diş çürüğü',
      'dişimde ağrı', 'dişim zonkluyor', 'dişimi üstüne basamıyorum',
      'dişim zonk zonk ediyor', 'dişimin kökü sızlıyor', 'diş etim şişti',
      'dişim zonkluyor mübarek', 'dişime ateş düşüyor',
      'diş ağrısından duramıyorum', 'dişimin ucu sızlıyor',
      'dişimden zonklama geliyor', 'dişimi çekesim var',
      'dişimin üstüne basınca acıyor', 'diş köküm ağrıyor'
    ],
    keywords_en: [
      'toothache', 'throbbing tooth', 'sensitive tooth',
      'sharp tooth pain', 'tooth hurts', 'aching tooth',
      'my tooth is killing me', 'tooth throbbing', 'pain in my tooth',
      'shooting tooth pain', 'tender tooth', 'decayed tooth pain'
    ],
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
    keywords: [
      'boyun ağrısı', 'boynum ağrıyor', 'boyunum tutuldu',
      'boyun tutulması', 'ense ağrısı', 'ense sertliği', 'boynum koptu',
      'boyun kütlemesi', 'boynum çekiliyor', 'boyun fıtığı sancısı',
      'enseme vuran ağrı', 'boynumda kireçlenme var',
      'boyun ağrısından duramıyorum', 'boynumdaki adale ağrısı',
      'boyun kireçlenmesi', 'boyun bölgesinde sızı',
      'boyun bölgesinde batma', 'ense ağrısı çekiyorum',
      'boynumu çeviremiyorum', 'boyun katılığı'
    ],
    keywords_en: [
      'neck pain', 'stiff neck', 'crick in the neck', 'neck ache',
      'neck tension', 'neck spasm', 'pain in my neck', 'sore neck',
      'cervical pain', 'neck stiffness', 'sharp neck pain',
      'aching neck', 'neck tightness', 'painful neck', 'neck strain'
    ],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.35, noroloji: 0.25 },
    region: 'boyun',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bogaz_agrisi',
    keywords: [
      'boğaz ağrısı', 'boğazım ağrıyor', 'yutkunma ağrısı',
      'boğazım şişti', 'boğaz yanıyor', 'boğaz enfeksiyonu',
      'boğazda gıcıklanma', 'yutkunurken acıyor', 'boğazım düğümleniyor',
      'bademciklerim şişti', 'boğazda batma hissi', 'yutkunamıyorum',
      'boğaz kuruluğu', 'boğazda takılma hissi', 'boğazım tahriş oldu',
      'boğazım kanıyor gibi', 'yutkunurken zorlanıyorum',
      'boğazım sızlıyor', 'yutkunma güçlüğü'
    ],
    keywords_en: [
      'sore throat', 'throat pain', 'scratchy throat',
      'painful swallowing', 'swollen glands', 'throat irritation',
      'throat is raw', 'difficulty swallowing', 'throbbing throat',
      'dry throat', 'pharyngitis', 'stinging throat', 'lump in throat'
    ],
    departments: { kbb: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'boyun',
    urgency: 3,
    followUp: true
  },
  {
    id: 'yutkunma_guclugu',
    keywords: [
      'yutkunma güçlüğü', 'yutamıyorum', 'yutkunamıyorum', 'disfaji',
      'yutkunurken ağrı', 'boğazıma bir şey takılıyor',
      'lokmalar boğazımda kalıyor', 'yutkunurken düğümleniyor',
      'su bile zor geçiyor', 'boğazım daralmış gibi',
      'yutkunurken zorlanıyorum', 'takılma hissi var',
      'lokma boğazımdan inmiyor', 'boğazımda bir yumru var',
      'yutkunmakta zorluk çekiyorum', 'yemek yerken tıkanıyorum',
      'yutkunurken batma oluyor', 'boğazımda engel var sanki'
    ],
    keywords_en: [
      'difficulty swallowing', 'trouble swallowing', 'dysphagia',
      'lump in throat', 'food getting stuck', 'painful swallowing',
      'cannot swallow', 'choking sensation', 'throat tightness',
      'feeling of obstruction', 'hard to get food down',
      'swallowing issues', 'odynophagia'
    ],
    departments: { kbb: 0.5, gastroenteroloji: 0.3, dahiliye: 0.2 },
    region: 'boyun',
    urgency: 5,
    followUp: true
  },
  {
    id: 'ses_kisikligi',
    keywords: [
      'ses kısıklığı', 'sesim kısıldı', 'sesim çıkmıyor', 'kalın ses',
      'ses kaybı', 'sesim boğuk çıkıyor', 'sesim çatallandı',
      'sesim kaba geliyor', 'sesim kısıldı gitti', 'sesim kısıldı resmen',
      'sesim soluğum kesildi', 'sesim gitti', 'sesim değişti',
      'sesim çatlıyor', 'sesim kaba çıkıyor', 'sesim kısıldı kaldı',
      'sesim kısıldı sanki', 'sesim çıkmaz oldu', 'sesim kısıldı be'
    ],
    keywords_en: [
      'hoarse voice', 'losing my voice', 'voice is raspy',
      'vocal strain', 'gravelly voice', 'voice sounds weak',
      'strained voice', 'lost my voice', 'voice feels scratchy',
      'husky voice', 'vocal fatigue', 'unable to speak', 'raspy throat'
    ],
    departments: { kbb: 0.85, dahiliye: 0.15 },
    region: 'boyun',
    urgency: 3,
    followUp: false
  },
  {
    id: 'tiroid_sisme',
    keywords: [
      'tiroid', 'guatr', 'boyunda şişlik', 'boyunum şişti', 'yumru boyun',
      'gıdıkta şişlik', 'boğazda şişkinlik', 'yutkunma güçlüğü',
      'boğazda düğüm', 'boyunda bezeler', 'gırtlak şişmesi',
      'boyun kabarıklığı', 'boğaz çıkıntısı', 'boğazda kitle',
      'yutak şişmesi', 'boyunda beze', 'tiroit şişmesi', 'boyunda kitle',
      'boğazda dolgunluk hissi'
    ],
    keywords_en: [
      'swollen neck', 'neck lump', 'thyroid swelling', 'goiter',
      'enlarged thyroid', 'lump in throat', 'thyroid nodule',
      'neck mass', 'throat swelling', 'thyroid gland enlargement',
      'visible thyroid', 'bulging neck', 'neck puffiness'
    ],
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
    keywords: [
      'göğüs ağrısı', 'göğsüm ağrıyor', 'göğüste ağrı', 'göğsümde baskı',
      'göğüs sıkışması', 'kalp ağrısı', 'göğsüme öküz oturdu',
      'nefesim daralıyor', 'göğsüm batıyor', 'iman tahtam sızlıyor',
      'kalbime sancı girdi', 'göğsümde ağırlık var', 'nefes alamıyorum',
      'göğsüm yanıyor', 'kalbim sıkışıyor', 'göğsümde iğne batması',
      'kaburgam ağrıyor', 'göğsümden sırtıma vuran ağrı',
      'kalp çarpıntısı ve ağrı', 'göğsümde daralma', 'nefesimi kesen ağrı'
    ],
    keywords_en: [
      'chest pain', 'tightness in chest', 'stabbing chest pain',
      'crushing chest sensation', 'heart discomfort', 'chest pressure',
      'sharp chest pain', 'shortness of breath', 'chest burning',
      'pressure on chest', 'heaviness in chest', 'angina',
      'chest squeezing', 'pain radiating to arm', 'dull chest ache'
    ],
    departments: { kardiyoloji: 0.6, gogus: 0.25, dahiliye: 0.15 },
    region: 'göğüs',
    urgency: 7,
    followUp: true
  },
  {
    id: 'nefes_darligi',
    keywords: [
      'nefes darlığı', 'nefes alamıyorum', 'nefesim daraldı',
      'nefes kesilmesi', 'dispne', 'soluk alamıyorum',
      'ciğerlerim yanıyor', 'göğsüme öküz oturdu', 'havasız kaldım',
      'boğuluyorum gibi', 'nefesim yetmiyor', 'tıkandım kaldım',
      'nefesim kesik kesik', 'nefesim tıkandı', 'derin nefes alamıyorum',
      'nefesim yetmedi', 'zor nefes alıyorum', 'nefesim dar geliyor',
      'göğsüm sıkışıyor', 'içim çekiliyor'
    ],
    keywords_en: [
      'short of breath', 'feeling breathless', 'struggling to breathe',
      'air hunger', 'gasping for air', 'tight chest',
      'difficulty breathing', 'labored breathing', 'shortness of breath',
      'wheezing', 'choking sensation', 'breathless'
    ],
    departments: { gogus: 0.4, kardiyoloji: 0.35, dahiliye: 0.25 },
    region: 'göğüs',
    urgency: 7,
    followUp: true
  },
  {
    id: 'kalp_carpintisi',
    keywords: [
      'çarpıntı', 'kalp çarpıntısı', 'kalbim çarpıyor', 'kalp hızlı',
      'taşikardi', 'kalbim yerinden çıkacak', 'kalbim küt küt atıyor',
      'göğsümde kuş çırpınıyor', 'kalbim duracak gibi', 'güm güm ediyor',
      'kalbim ağzımda atıyor', 'yüreğim yerinden oynuyor',
      'kalp atışım hızlandı', 'göğsümde ritim bozukluğu',
      'kalbim fırlayacak', 'içim hopluyor', 'kalbim düzensiz vuruyor',
      'pır pır ediyor', 'yüreğim ağzıma geldi', 'kalbim takla atıyor'
    ],
    keywords_en: [
      'heart pounding', 'racing heart', 'palpitations',
      'heart fluttering', 'skipping a beat', 'heart thumping',
      'heart racing', 'irregular heartbeat', 'heart pounding in chest',
      'fluttering sensation', 'rapid heartbeat', 'heart skipping',
      'pounding chest', 'heart doing flip-flops'
    ],
    departments: { kardiyoloji: 0.75, dahiliye: 0.15, psikiyatri: 0.1 },
    region: 'göğüs',
    urgency: 6,
    followUp: true
  },
  {
    id: 'oksuruk',
    keywords: [
      'öksürük', 'öksürüyorum', 'kuru öksürük', 'balgamlı öksürük',
      'öksürük durmuyor', 'ciğerim sökülüyor', 'gıcık tuttu',
      'boğazım gıcıklanıyor', 'tıksırıyorum', 'kesilmeyen öksürük',
      'göğsüm hırıldıyor', 'gece öksürüğü', 'öksürükten nefesim kesildi',
      'bronşlarım dolu', 'boğazımda bir şey var',
      'ataklar halinde öksürme', 'kuru gıcık', 'ciğerden gelen öksürük'
    ],
    keywords_en: [
      'coughing fit', 'hacking cough', 'tickle in my throat',
      'chest congestion', 'wheezing', 'phlegmy cough', 'dry throat',
      'coughing spells', 'nagging cough', 'productive cough',
      'spasmodic cough', 'barking cough'
    ],
    departments: { gogus: 0.4, kbb: 0.3, dahiliye: 0.2, aile_hekimi: 0.1 },
    region: 'göğüs',
    urgency: 3,
    followUp: true
  },
  {
    id: 'balgam',
    keywords: [
      'balgam', 'balgam çıkıyor', 'balgamlı', 'yeşil balgam',
      'kanlı balgam', 'balgam tükürme', 'göğsümden geliyor',
      'cigerden gelen sıvı', 'koyu tükürük', 'geniz akıntısı',
      'boğazda biriken şey', 'hırıltılı öksürük',
      'öksürürken bir şey geliyor', 'akciğerden sökülen',
      'koyu kıvamlı tükürük', 'boğaz doluluğu', 'balgam sökme',
      'göğsü tıkalı', 'yapışkan tükürük'
    ],
    keywords_en: [
      'phlegm', 'mucus', 'sputum', 'chest congestion',
      'coughing up stuff', 'thick saliva', 'mucus in throat', 'loogey',
      'spitting up phlegm', 'mucus buildup', 'hacking up phlegm',
      'productive cough', 'chest mucus'
    ],
    departments: { gogus: 0.5, kbb: 0.3, dahiliye: 0.2 },
    region: 'göğüs',
    urgency: 4,
    followUp: true
  },
  {
    id: 'hemoptizi',
    keywords: [
      'kan tükürme', 'kanlı öksürük', 'ağızdan kan', 'balgamda kan',
      'hemoptizi', 'ciğerden kan gelmesi', 'öksürürken kan çıkması',
      'kırmızı balgam', 'kanlı tükürük', 'ağzıma kan geldi',
      'boğazdan kan gelmesi', 'göğüsten kan gelmesi',
      'kanlı pıhtı çıkarmak', 'öksürükle kan kusmak', 'kanlı öksürme',
      'akciğer kanaması', 'baskın kan tükürme'
    ],
    keywords_en: [
      'coughing up blood', 'spitting blood', 'blood in sputum',
      'bloody cough', 'hemoptysis', 'blood-streaked mucus',
      'expectorating blood', 'blood from lungs', 'coughing blood clots',
      'rusty sputum', 'pink-tinged phlegm', 'blood in the throat'
    ],
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
    keywords: [
      'karın ağrısı', 'karnım ağrıyor', 'karında ağrı', 'mide ağrısı',
      'midem ağrıyor', 'göbek ağrısı', 'karnıma sancı girdi',
      'karnım gurulduyor', 'bağırsaklarım düğümleniyor',
      'karnımda batma var', 'içim dışıma çıktı', 'karnım kasılıyor',
      'karın bölgemde sızı var', 'karnımda bir ağırlık var',
      'karnım şişti', 'bağırsak ağrısı', 'karnım kıvranıyor',
      'karın gurultusu', 'karnımda yanma var', 'karın sancısı'
    ],
    keywords_en: [
      'stomach ache', 'abdominal pain', 'tummy ache', 'stomach cramps',
      'belly pain', 'sharp stomach pain', 'gut pain',
      'stomach discomfort', 'abdominal cramping', 'stomach gnawing',
      'tender abdomen', 'stomach tightness', 'bloated stomach',
      'stabbing stomach pain'
    ],
    departments: { dahiliye: 0.3, gastroenteroloji: 0.3, genel_cerrahi: 0.2, aile_hekimi: 0.2 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },
  {
    id: 'mide_bulantisi',
    keywords: [
      'mide bulantısı', 'midem bulanıyor', 'bulantı', 'kusma', 'kusuyorum',
      'mide ekşimesi', 'midesi bulanma', 'içim dışıma çıkıyor',
      'ağzıma kadar geldi', 'midem kalktı', 'çıkaracak gibiyim',
      'safra çıkarıyorum', 'öğürüyorum', 'içim kalkıyor',
      'midem bulanıyor gibi', 'midem allak bullak', 'kusacak gibi oldum',
      'midem ağzımda', 'tiksindim', 'midem dönüyor'
    ],
    keywords_en: [
      'feeling nauseous', 'nausea', 'throwing up', 'vomiting',
      'feeling sick', 'queasy', 'upset stomach', 'gagging', 'puking',
      'tossing my cookies', 'feeling queasy', 'heaving',
      'sick to my stomach'
    ],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.35, aile_hekimi: 0.25 },
    region: 'karın',
    urgency: 3,
    followUp: true
  },
  {
    id: 'ishal',
    keywords: [
      'ishal', 'ishal oldum', 'sulu dışkı', 'karın sancısı ishal',
      'bağırsak bozukluğu', 'sürekli tuvalet', 'cırcır', 'cırcır olmak',
      'karın bozulması', 'mideyi bozmak', 'barsakları salmak',
      'cıvık dışkı', 'sık tuvalete çıkma', 'ishale yakalanmak',
      'karın gurultusu', 'bozuldum', 'ishal söküldü',
      'tuvaletten çıkamamak', 'barsak cıvıması', 'içim dışıma çıktı'
    ],
    keywords_en: [
      'diarrhea', 'runny stool', 'the runs', 'loose stools',
      'stomach upset', 'frequent bathroom visits', 'having the trots',
      'bowel movement issues', 'watery poop', 'stomach flu symptoms',
      'gastrointestinal distress', 'an upset tummy', 'a bad stomach',
      'liquid stools'
    ],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 3,
    followUp: true
  },
  {
    id: 'kabizlik',
    keywords: [
      'kabızlık', 'kabız', 'tuvalete çıkamıyorum', 'konstipasyon',
      'sert dışkı', 'dışkılama güçlüğü', 'içim şişti',
      'büyük tuvaletim gelmiyor', 'bağırsaklarım çalışmıyor',
      'gazımı çıkaramıyorum', 'karın şişkinliği', 'taş gibi dışkı',
      'günlerdir tuvalete gitmedim', 'bağırsak tembelliği', 'zorlanıyorum',
      'karnım gurulduyor', 'dışkım parça parça',
      'tuvalette saatler geçiyor', 'gaitam gelmiyor', 'makat ağrısı'
    ],
    keywords_en: [
      'constipated', 'hard stool', 'irregular bowel movements',
      'straining', 'backed up', 'feeling blocked',
      'difficulty passing stool', 'infrequent bowel movements',
      'bowel obstruction', 'painful defecation', 'sluggish bowels',
      'stomach bloat', 'fecal impaction'
    ],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 2,
    followUp: false
  },
  {
    id: 'siskinlik',
    keywords: [
      'şişkinlik', 'karında şişkinlik', 'gaz', 'gaz sancısı',
      'karnım şişti', 'meteorizm', 'karnım davul gibi', 'göbeğim gerildi',
      'midem şiş', 'hazımsızlık var', 'içim gaz dolu', 'karnım sertleşti',
      'yediğim oturdu', 'bağırsaklarımda hava var', 'karnım şişiyor',
      'gaz sıkışması', 'tokluk hissi', 'göbeğim büyüdü', 'karnım gergin'
    ],
    keywords_en: [
      'bloating', 'feeling bloated', 'stomach distension',
      'full feeling', 'gassy', 'trapped gas', 'swollen stomach',
      'tight tummy', 'gas pain', 'abdominal pressure', 'feeling gassy',
      'stomach tightness', 'belly bloat'
    ],
    departments: { gastroenteroloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'karın',
    urgency: 2,
    followUp: false
  },
  {
    id: 'reflü',
    keywords: [
      'reflü', 'mide yanması', 'göğüs yanması', 'geri tepme',
      'mide ekşimesi', 'boğazda yanma', 'ağıza acı su gelmesi',
      'mide asidi kaçması', 'boğaza yemek gelmesi', 'mide fokurtusu',
      'göğüste sıkışma hissi', 'hazımsızlık', 'yediğim geri geliyor',
      'mide fesadı', 'boğazda düğümlenme', 'lokmanın geri gelmesi',
      'yemek borusu yanması', 'mide kazınması', 'gastrik yanma',
      'acı geğirme'
    ],
    keywords_en: [
      'acid reflux', 'heartburn', 'acid indigestion', 'sour stomach',
      'reflux', 'chest burning', 'acid regurgitation',
      'burning sensation', 'GERD', 'reflux disease',
      'food coming back up', 'stomach acid flare up', 'acid creep',
      'upper GI burn', 'acid wash'
    ],
    departments: { gastroenteroloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 3,
    followUp: false
  },
  {
    id: 'kanli_diski',
    keywords: [
      'kanlı dışkı', 'dışkıda kan', 'rektal kanama', 'tuvalette kan',
      'kanlı ishal', 'makatta kan', 'kaka yaparken kan geldi',
      'büyük abdestte kan', 'kırmızı dışkı', 'makattan kan gelmesi',
      'siyah dışkı', 'dışkı renginin değişmesi', 'abdestte kan lekesi',
      'bağırsak kanaması', 'kaka kanlı', 'tuvalette kırmızı lekeler',
      'dışkıda kan pıhtısı', 'makat bölgesinde kanama',
      'peçeteye kan gelmesi', 'dışkılarken kanama'
    ],
    keywords_en: [
      'bloody stool', 'rectal bleeding', 'blood in poop',
      'passing blood', 'bright red stool', 'tarry stools', 'black stool',
      'bleeding during bowel movement', 'blood on toilet paper',
      'hematochezia', 'melena', 'blood in feces', 'rectal discharge',
      'blood in the toilet bowl'
    ],
    departments: { gastroenteroloji: 0.5, genel_cerrahi: 0.4, dahiliye: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: false
  },
  {
    id: 'sag_alt_karin',
    keywords: [
      'sağ alt karın', 'apandisit', 'sağ kasık ağrısı', 'sağ alt ağrı',
      'sağ tarafta sancı', 'karnımın sağ altı', 'sağ boşluğum ağrıyor',
      'sağ kasığıma bıçak saplanıyor', 'sağ alt karnım zonkluyor',
      'sağ tarafım batıyor', 'kasık bölgemde ağrı',
      'sağ alt tarafta şişlik', 'sağ alt karın sancısı',
      'sağ aşağıda ağrı', 'karnımın sağ tarafı acıyor',
      'sağ bacak arası ağrısı', 'sağ alt karın krampları'
    ],
    keywords_en: [
      'lower right abdominal pain', 'right side ache',
      'pain in lower right belly', 'stabbing right side pain',
      'right iliac fossa pain', 'right lower quadrant pain',
      'sharp right lower belly', 'right pelvic pain',
      'tummy pain on the right', 'lower right side cramping',
      'right side tenderness', 'pain above the right groin',
      'right abdominal soreness'
    ],
    departments: { genel_cerrahi: 0.6, dahiliye: 0.2, uroloji: 0.1, kadin_dogum: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: true
  },
  {
    id: 'sol_alt_karin',
    keywords: [
      'sol alt karın', 'sol kasık ağrısı', 'sol alt ağrı',
      'sol tarafım batıyor', 'sol alt karnım sızlıyor',
      'sol boşluk ağrısı', 'sol yanım ağrıyor', 'sol alt tarafta sızı',
      'sol kasığım çekiliyor', 'sol alt karın ağrısı',
      'sol karın boşluğu sızısı', 'sol tarafta bıçak saplanması',
      'sol alt karın batması', 'sol tarafımdaki ağrı',
      'sol alt karında huzursuzluk', 'sol tarafta gerginlik'
    ],
    keywords_en: [
      'left lower quadrant pain', 'lower left side pain',
      'left side ache', 'sharp left abdomen pain',
      'left lower belly pain', 'left groin soreness',
      'twinge in left side', 'left pelvic area pain',
      'lower left abdominal cramping', 'left flank pain',
      'stabbing pain left side', 'left lower abdomen discomfort',
      'left side tenderness'
    ],
    departments: { gastroenteroloji: 0.3, genel_cerrahi: 0.3, uroloji: 0.2, kadin_dogum: 0.2 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },
  {
    id: 'sarilik',
    keywords: [
      'sarılık', 'gözlerim sarardı', 'cildim sarardı', 'sarı ten', 'ikter',
      'beniz sararması', 'yüzüm sapsarı oldu', 'cildim limon gibi',
      'tenim soldu', 'göz aklarım sarardı', 'sararma var',
      'vücudum sarı kesildi', 'cilt rengim değişti', 'sapsarı kesildim',
      'yüzümün rengi döndü', 'ten rengim koyulaştı', 'beniz solgunluğu',
      'sarı deri'
    ],
    keywords_en: [
      'jaundice', 'yellow skin', 'yellow eyes', 'yellowing of the skin',
      'yellow tint', 'my skin looks yellow', 'yellowish complexion',
      'icteric', 'yellowing eyes', 'jaundiced appearance',
      'skin turning yellow', 'yellow cast', 'saffron skin'
    ],
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
    keywords: [
      'kol ağrısı', 'kolum ağrıyor', 'kolda ağrı', 'kolum acıyor',
      'omuz kol ağrı', 'koluma sızı giriyor', 'kolum kopuyor sanki',
      'kolumda batma var', 'kolum çok sızlıyor', 'kolum tutmuyor',
      'koluma kramp girdi', 'kolum çekiliyor', 'kolum ağırıyor',
      'kolum sızım sızım sızlıyor', 'kolumdaki sancı',
      'koluma ağrı saplanıyor', 'kolum yerinden çıkacak gibi',
      'kolum uyuşuyor', 'kolumda zonklama var'
    ],
    keywords_en: [
      'arm pain', 'aching arm', 'sore arm', 'arm hurts',
      'stabbing pain in arm', 'throbbing arm', 'arm feels heavy',
      'shooting pain in arm', 'arm cramp', 'arm tenderness',
      'pain radiating to arm', 'arm discomfort', 'arm feels stiff'
    ],
    departments: { ortopedi: 0.5, fizik_tedavi: 0.3, noroloji: 0.2 },
    region: 'kol',
    urgency: 3,
    followUp: true
  },
  {
    id: 'omuz_agrisi',
    keywords: [
      'omuz ağrısı', 'omzum ağrıyor', 'omuz sızlaması', 'omuz tutulması',
      'kolumu kaldıramıyorum', 'omzuma bıçak saplanıyor',
      'omzum kilitlendi', 'omuz başım sızlıyor', 'omuzlarım çok ağırıyor',
      'omzum çıkacak gibi', 'omzumdan koluma vuran ağrı',
      'omuz eklemim batıyor', 'omuzda yanma var', 'omuz kireçlenmesi',
      'kolumu oynatamıyorum', 'omzumdaki uyuşma', 'omuz başı ağrısı',
      'omzuma kramp girdi', 'omuzda baskı hissi'
    ],
    keywords_en: [
      'shoulder pain', 'stiff shoulder', 'my shoulder hurts',
      'frozen shoulder', 'shoulder ache', 'sharp shoulder pain',
      'shoulder soreness', 'limited shoulder mobility',
      'shoulder joint pain', 'stabbing shoulder pain',
      'shoulder tenderness', 'shoulder discomfort',
      'difficulty lifting arm'
    ],
    departments: { ortopedi: 0.5, fizik_tedavi: 0.4, noroloji: 0.1 },
    region: 'kol',
    urgency: 4,
    followUp: false
  },
  {
    id: 'el_uyusma',
    keywords: [
      'el uyuşması', 'parmaklarım uyuşuyor', 'ellerim uyuşuyor',
      'karıncalanma', 'ellerde karıncalanma', 'elim uyuşuyor',
      'elim karıncalanıyor', 'elime kan gitmiyor', 'ellerim keçeleşti',
      'parmak uçlarım hissiz', 'elim kaskatı kesildi', 'ellerim tutmuyor',
      'iğne batıyor sanki', 'elim uyuştu kaldı', 'ellerimde keçelenme var',
      'parmaklarımda karıncalanma', 'elimden his gitti',
      'elektrik çarpıyor gibi', 'elim karıncalanıyor',
      'parmaklarımda his kaybı'
    ],
    keywords_en: [
      'hand numbness', 'tingling sensation', 'pins and needles',
      'numb fingers', 'hand falling asleep', 'loss of sensation',
      'hand tingling', 'numbness in hand', 'my hand is numb',
      'tingly fingers', 'hand sensory loss', 'fingertips are numb',
      'prickling sensation', 'dead hand'
    ],
    departments: { noroloji: 0.5, ortopedi: 0.3, fizik_tedavi: 0.2 },
    region: 'kol',
    urgency: 4,
    followUp: true
  },
  {
    id: 'el_titremes',
    keywords: [
      'el titremesi', 'ellerim titriyor', 'titreme', 'tremor',
      'ellerim sallanıyor', 'elim zangır zangır',
      'elimin ayağımın bağı çözüldü', 'elim yerinde durmuyor',
      'elim ayağım titriyor', 'elimden bir şey tutamıyorum',
      'elim hakim değil', 'ellerim cılızlaşıyor', 'titrek eller',
      'huzursuz eller', 'elim sürekli oynuyor', 'elimde titreme var',
      'parmaklarım titriyor', 'elim seğiriyor'
    ],
    keywords_en: [
      'shaky hands', 'hand tremors', 'trembling hands', 'shaky fingers',
      'hand shakes', 'unsteady hands', 'my hands are shaking',
      'jittery hands', 'hand quivering', 'resting tremor',
      'essential tremor', 'hands are fluttering'
    ],
    departments: { noroloji: 0.7, dahiliye: 0.2, endokrinoloji: 0.1 },
    region: 'kol',
    urgency: 5,
    followUp: true
  },
  {
    id: 'bilek_agrisi',
    keywords: [
      'bilek ağrısı', 'bileğim ağrıyor', 'el bileği ağrısı',
      'karpal tünel', 'bileğim sızlıyor', 'bilek burkulması',
      'eklem ağrısı', 'bilek tutulması', 'elimi oynatamıyorum',
      'bileğimden bıçak saplanıyor', 'bileğim koptu', 'bilek incinmesi',
      'elim ağırıyor', 'bileğimde acı var', 'bilek yanması',
      'zorlanma ağrısı'
    ],
    keywords_en: [
      'wrist pain', 'sore wrist', 'wrist strain', 'wrist ache',
      'pain in my wrist', 'carpal tunnel syndrome', 'wrist injury',
      'shooting wrist pain', 'wrist stiffness', 'aching wrist',
      'sprained wrist', 'wrist discomfort'
    ],
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
    keywords: [
      'bacak ağrısı', 'bacağım ağrıyor', 'bacakta ağrı',
      'bacaklarım ağrıyor', 'bacak sızlaması', 'bacaklarım sızlıyor',
      'bacaklarım koptu', 'bacaklarıma kramp giriyor', 'dizlerim tutmuyor',
      'bacaklarımda derman kalmadı', 'bacaklarım zonkluyor',
      'bacaklarımda sızı var', 'bacaklarıma ağırlık çöktü',
      'bacaklarım çekiliyor', 'baldırlarım ağrıyor', 'bacaklarım uyuşuyor',
      'bacaklarımın kemikleri ağrıyor', 'bacaklarıma kramp girdi'
    ],
    keywords_en: [
      'leg pain', 'aching legs', 'my legs hurt', 'sore legs',
      'leg cramps', 'throbbing legs', 'heavy legs', 'my legs feel weak',
      'leg discomfort', 'shooting pain in leg', 'leg fatigue',
      'pins and needles in legs', 'leg stiffness'
    ],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.3, kardiyoloji: 0.15, noroloji: 0.15 },
    region: 'bacak',
    urgency: 3,
    followUp: true
  },
  {
    id: 'diz_agrisi',
    keywords: [
      'diz ağrısı', 'dizim ağrıyor', 'diz ağrı', 'diz şişliği',
      'dizlerim ağrıyor', 'meniküs', 'diz kapağı sızlaması',
      'dizim tutmuyor', 'diz kilitlenmesi', 'dizden gelen çatırtı',
      'diz kapağı batması', 'dizlerdeki romatizma', 'diz ağrısı sızısı',
      'diz tutulması', 'dizlerde yanma', 'diz kapağı hassasiyeti',
      'diz kıkırdağı ağrısı', 'diz bükememe', 'diz kapağı zonklaması'
    ],
    keywords_en: [
      'knee pain', 'sore knee', 'knee ache', 'stiff knee',
      'knee locking', 'knee popping', 'knee swelling', 'bad knee',
      'knee throbbing', 'aching joints', 'knee giving out',
      'knee tenderness', 'sharp knee pain', 'knee discomfort'
    ],
    departments: { ortopedi: 0.6, fizik_tedavi: 0.3, dahiliye: 0.1 },
    region: 'bacak',
    urgency: 4,
    followUp: false
  },
  {
    id: 'ayak_agrisi',
    keywords: [
      'ayak ağrısı', 'ayağım ağrıyor', 'topuk ağrısı', 'ayak tabanı',
      'ayak şişliği', 'ayağıma kramp girdi', 'ayaklarım sızlıyor',
      'ayaklarım yanıyor', 'üstüne basamıyorum', 'ayak sızlaması',
      'ayaklarım zonkluyor', 'ayak bileğim burkuldu',
      'ayaklarım çok sızlıyor', 'tabanlarım yanıyor', 'ayaklarım kopuyor',
      'ayak kemiğim ağrıyor', 'ayak altı acısı', 'ayağımın üstü ağrıyor',
      'ayaklarım karıncalanıyor'
    ],
    keywords_en: [
      'foot pain', 'my foot hurts', 'sore feet', 'throbbing foot',
      'foot ache', 'stabbing foot pain', 'foot tenderness',
      'burning feet', 'pain in my sole', 'achy feet', 'foot discomfort',
      'sharp foot pain', 'shooting foot pain'
    ],
    departments: { ortopedi: 0.6, fizik_tedavi: 0.3, dahiliye: 0.1 },
    region: 'bacak',
    urgency: 3,
    followUp: false
  },
  {
    id: 'bacak_sislik',
    keywords: [
      'bacak şişliği', 'bacaklarım şişti', 'ayak şişliği', 'ödem',
      'ayak bileği şişliği', 'şiş bacak', 'bacaklarım davul gibi',
      'ayaklarım su topladı', 'bacaklarım şişmiş', 'ayakkabılarım olmuyor',
      'bacaklarımda ağırlık var', 'bacaklarım balon gibi',
      'ayaklarımın üstü kabardı', 'bacaklarım inmiyor',
      'ayaklarım şiş indi', 'bacaklarda su toplanması',
      'bacaklarım geriliyor', 'bileklerim kalınlaştı', 'ayakkabı vuruyor'
    ],
    keywords_en: [
      'swollen legs', 'puffy ankles', 'legs feel heavy',
      'fluid retention', 'leg edema', 'swollen lower limbs',
      'tight skin on legs', 'legs are bloated', 'swelling in the calves',
      'pitting edema', 'leg puffiness', 'ankles look swollen'
    ],
    departments: { kardiyoloji: 0.4, dahiliye: 0.35, ortopedi: 0.15, genel_cerrahi: 0.1 },
    region: 'bacak',
    urgency: 5,
    followUp: true
  },
  {
    id: 'bacak_uyusma',
    keywords: [
      'bacak uyuşması', 'bacağım uyuşuyor', 'ayağım uyuşuyor',
      'bacakta karıncalanma', 'bacağım karıncalanıyor',
      'bacağıma kramp giriyor', 'bacağım keçeleşti', 'bacağım uyuyor',
      'bacağımda his kaybı', 'ayağıma kan gitmiyor', 'bacağımda iğnelenme',
      'bacağım kaskatı oldu', 'bacağımda elektriklenme',
      'bacağım tutmuyor', 'ayağım keçeleşmiş', 'bacağım çekiliyor',
      'bacağımda uyuşukluk var', 'bacağımda hissizlik',
      'bacağımın üstüne basamıyorum'
    ],
    keywords_en: [
      'leg numbness', 'leg falling asleep', 'pins and needles in leg',
      'tingling sensation in leg', 'leg feels dead', 'numb leg',
      'loss of sensation in leg', 'leg prickling', 'leg feels heavy',
      'numbness in lower limb', 'leg paresthesia', 'foot falling asleep',
      'leg feels wooden', 'leg tingling', 'loss of feeling in leg'
    ],
    departments: { noroloji: 0.5, ortopedi: 0.25, fizik_tedavi: 0.15, kardiyoloji: 0.1 },
    region: 'bacak',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bel_agrisi',
    keywords: [
      'bel ağrısı', 'belim ağrıyor', 'bel fıtığı', 'sırt ağrısı',
      'sırtım ağrıyor', 'bel tutulması', 'belde ağrı', 'belim koptu',
      'belime bıçak saplanıyor', 'belim kilitlendi', 'belimde sancı var',
      'belimden aşağısı ağrıyor', 'belim eğrildi', 'belime vuruyor',
      'kireçlenme var', 'belim incindi', 'belim taş gibi',
      'belim çok sızlıyor', 'belim düzleşti', 'belim fena',
      'hareket edemiyorum'
    ],
    keywords_en: [
      'lower back pain', 'my back is killing me', 'stiff back',
      'slipped disc', 'lower back strain', 'aching back', 'back spasms',
      'shooting pain in back', 'lumbar pain', 'back feels locked',
      'nagging back pain', 'weak lower back', 'pinched nerve'
    ],
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
    keywords: [
      'ateş', 'ateşim var', 'yüksek ateş', 'ateşim çıktı', 'ateşliyim',
      '38 derece', '39 derece', 'febril', 'vücudum yanıyor',
      'alın ateşim var', 'içim yanıyor', 'sıtma tuttu', 'ateş basıyor',
      'yanıyorum', 'vücut ısım yükseldi', 'ateşli hastalık',
      'gözlerim yanıyor', 'havale geçiriyorum', 'ateş bastı',
      'alnım çok sıcak', 'kavruluyorum'
    ],
    keywords_en: [
      'feverish', 'running a temperature', 'feeling hot', 'burning up',
      'chills and fever', 'high temp', 'pyrexia', 'febrile state',
      'feeling flushed', 'temperature spike', 'sweating and hot',
      'feverish sensation'
    ],
    departments: { dahiliye: 0.4, aile_hekimi: 0.3, gogus: 0.15, kbb: 0.15 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'yorgunluk',
    keywords: [
      'yorgunluk', 'halsizlik', 'çok yorgunum', 'bitkinlik', 'enerji yok',
      'güçsüzlük', 'dermansızlık', 'tükenmişlik', 'pilim bitti',
      'ayaklarım kalkmıyor', 'üstümde ağırlık var', 'halim yok',
      'canım çıkmış gibi', 'hiç mecalim kalmadı',
      'kollarım kanadım kalkmıyor', 'pertim çıktı', 'gözlerimi açamıyorum',
      'güne enerjisiz başladım', 'tükendim', 'ayaklarım geri geri gidiyor',
      'üstüme ölü toprağı serilmiş'
    ],
    keywords_en: [
      'exhausted', 'drained', 'out of gas', 'run down', 'wiped out',
      'fatigued', 'no spark left', 'lethargic', 'feeling heavy',
      'burned out', 'completely spent', 'low energy', 'pooped'
    ],
    departments: { dahiliye: 0.4, endokrinoloji: 0.2, psikiyatri: 0.2, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: true
  },
  {
    id: 'kilo_kaybi',
    keywords: [
      'kilo kaybı', 'kilo verdim', 'zayıflama', 'istemsiz kilo kaybı',
      'kilo düşüyor', 'eriyorum', 'süzüldüm', 'bir deri bir kemik',
      'çöküşteyim', 'günden güne eridim', 'çamaşırlar bol geliyor',
      'kilo erimesi', 'sanki eriyip gidiyorum', 'zayıflayıp kaldım',
      'birden inceldim', 'içim çekildi', 'çöktüm', 'cılızlaştım',
      'süzülüp gittim'
    ],
    keywords_en: [
      'unexplained weight loss', 'losing weight rapidly',
      'dropping pounds', 'wasting away', 'getting skinny', 'shrinking',
      'losing my appetite', 'shedding weight', 'looking gaunt',
      'weight drop', 'sudden weight loss', 'getting thin',
      'melting away', 'weight reduction'
    ],
    departments: { dahiliye: 0.4, endokrinoloji: 0.3, gastroenteroloji: 0.2, psikiyatri: 0.1 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },
  {
    id: 'kilo_alma',
    keywords: [
      'kilo alma', 'kilo aldım', 'şişmanlama', 'kilo artışı', 'obezite',
      'biraz etlendim', 'karnım çıktı', 'pantolonlar dar geliyor',
      'üstüme yapıştı', 'serpildim biraz', 'belim kalınlaştı',
      'kalıbım genişledi', 'biraz saldım kendimi',
      'tuttuğunu yiyenlerdenim', 'göbek yaptım', 'bedenim büyüdü',
      'şiştim kaldım', 'formdan düştüm', 'kilo yapıştı üstüme'
    ],
    keywords_en: [
      'gaining weight', 'putting on pounds', 'getting chubby',
      'filling out', 'heavier than before', 'pants feeling tight',
      'gaining some bulk', 'packing on weight', 'girth increase',
      'gaining mass', 'getting bigger', 'gaining a few', 'weight gain',
      'body weight increase'
    ],
    departments: { endokrinoloji: 0.4, dahiliye: 0.3, aile_hekimi: 0.3 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'terleme',
    keywords: [
      'terleme', 'çok terliyorum', 'gece terlemesi', 'aşırı terleme',
      'soğuk terleme', 'sırılsıklam olmak', 'su gibi akmak',
      'üstüm başım yapışıyor', 'ter boşalması', 'vücudum sırılsıklam',
      'ter basması', 'boncuk boncuk terlemek', 'üzerimden su akıyor',
      'ateş basıp terletmesi', 'terden sırılsıklam uyandım',
      'ter içinde kaldım', 'bütün gözeneklerim açıldı',
      'vıcık vıcık oldum'
    ],
    keywords_en: [
      'sweaty', 'drenched in sweat', 'breaking into a sweat',
      'sweating buckets', 'night sweats', 'clammy skin', 'perspiring',
      'soaking through clothes', 'damp skin', 'flushed and sweaty',
      'beads of sweat', 'sopping wet', 'hot flashes and sweating'
    ],
    departments: { dahiliye: 0.3, endokrinoloji: 0.3, kardiyoloji: 0.2, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },
  {
    id: 'uyku_bozuklugu',
    keywords: [
      'uykusuzluk', 'uyuyamıyorum', 'insomnia', 'uyku bozukluğu',
      'uyku sorunu', 'gece uyanma', 'gözüme uyku girmiyor',
      'sabaha kadar dönüp duruyorum', 'geceleri ayaktayım',
      'uyku tutmuyor', 'sabah yorgun uyanıyorum', 'uyku düzenim bozuk',
      'gece gözümü kırpmadım', 'uykuya dalamıyorum', 'uykum kaçıyor',
      'gece bölünmeleri', 'saatlerce tavana bakıyorum', 'uyku kaçıklığı',
      'dinlenemeden uyanıyorum'
    ],
    keywords_en: [
      'tossing and turning', 'sleepless nights', 'restless nights',
      'keep waking up', 'sleep deprived', 'trouble sleeping',
      'night owl syndrome', 'frequent awakenings',
      'racing thoughts at night', 'exhausted in morning',
      'poor sleep quality'
    ],
    departments: { psikiyatri: 0.5, noroloji: 0.3, dahiliye: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'depresyon',
    keywords: [
      'depresyon', 'mutsuzluk', 'isteksizlik', 'moral bozukluğu',
      'umutsuzluk', 'üzgünüm', 'hayattan zevk almama', 'içim daralıyor',
      'hayata küstüm', 'tadım tuzum yok', 'ruh gibi gezmek',
      'dünya başıma yıkıldı', 'hiçbir şey yapasım yok', 'nefes alamıyorum',
      'içim çekiliyor', 'boşluktayım', 'hayatın anlamı kalmadı',
      'karanlıktayım', 'canım hiçbir şey istemiyor',
      'kendimi çok ağır hissediyorum', 'dünyanın yükü üstümde'
    ],
    keywords_en: [
      'feeling down', 'blue', 'in a slump', 'empty inside',
      'overwhelmed', 'numb', 'hopeless', 'major depressive disorder',
      'burned out', 'lost my spark', 'dark cloud over me', 'low mood'
    ],
    departments: { psikiyatri: 0.85, dahiliye: 0.15 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },
  {
    id: 'anksiyete',
    keywords: [
      'anksiyete', 'kaygı', 'panik atak', 'endişe', 'korku',
      'kaygı bozukluğu', 'panik', 'içim daralıyor', 'göğsüm sıkışıyor',
      'sebepsiz yere tedirginim', 'sinirlerim bozuk',
      'kalbim yerinden fırlayacak', 'kafayı yiyecek gibiyim',
      'yerimde duramıyorum', 'içime bir öküz oturdu', 'sürekli huzursuzum',
      'kafam çok dolu', 'kötü bir şey olacak hissi',
      'üstüme üstüme geliyorlar', 'panik halindeyim', 'sürekli tetikteyim'
    ],
    keywords_en: [
      'feeling on edge', 'racing heart', 'dread',
      'butterflies in stomach', 'restlessness', 'feeling overwhelmed',
      'fight or flight', 'constant worrying', 'nervous wreck',
      'doom and gloom', 'jitters', 'panic mode', 'on thin ice',
      'uneasiness'
    ],
    departments: { psikiyatri: 0.8, kardiyoloji: 0.1, dahiliye: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'alerji',
    keywords: [
      'alerji', 'alerjim var', 'alerjik reaksiyon', 'kaşıntı',
      'kızarıklık', 'döküntü', 'ürtiker', 'kurdeşen', 'vücudum kabardı',
      'yediğim dokundu', 'bahar nezlesi', 'gözlerim sulanıyor',
      'burnum sürekli tıkalı', 'hapsırık nöbeti', 'cildim tepki verdi',
      'pıtır pıtır döküldü', 'vücudumda kabarcıklar çıktı',
      'alerjik bünyeliyim', 'polen alerjisi', 'nefesim daralıyor',
      'boğazım gıcıklanıyor', 'yüzüm şişti', 'derim hassaslaştı'
    ],
    keywords_en: [
      'allergic reaction', 'breaking out in hives', 'itchy skin',
      'hay fever', 'allergic rhinitis', 'runny nose', 'sneezing fit',
      'allergic sensitivity', 'skin rash', 'swelling up',
      'hypersensitive', 'allergic flare-up', 'watery eyes',
      'itching sensation', 'food intolerance'
    ],
    departments: { dermatoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },
  {
    id: 'cilt_sorunu',
    keywords: [
      'cilt sorunu', 'ciltte leke', 'sivilce', 'akne', 'egzama', 'sedef',
      'cilt döküntüsü', 'deride kaşıntı', 'ciltte kızarıklık', 'kurdeşen',
      'cilt pütürlenmesi', 'yüzde kabarma', 'deri kuruluğu',
      'kaşıntılı kabarcıklar', 'ciltte yanma hissi', 'pullanma',
      'ciltte soyulma', 'et beni', 'sivilce izi', 'ciltte beneklenme',
      'cilt hassasiyeti', 'çiller', 'ciltte kuruluk'
    ],
    keywords_en: [
      'skin rash', 'skin irritation', 'breakout', 'skin discoloration',
      'dry skin', 'hives', 'skin bump', 'itchy skin', 'blemish',
      'flaky skin', 'skin patch', 'redness', 'acne flare-up',
      'skin lesion', 'dermatitis'
    ],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  {
    id: 'sac_dokulmesi',
    keywords: [
      'saç dökülmesi', 'saçlarım dökülüyor', 'kellik', 'saç kaybı',
      'alopesi', 'saçlarım seyreliyor', 'saç köklerim zayıfladı',
      'tarakta saç kalıyor', 'saçlarım avuç avuç dökülüyor',
      'tepem açılıyor', 'saçkıran oldu', 'açılma var',
      'saçlarım cılızlaştı', 'saçlarım seyrekleşti',
      'saçlarım tutam tutam geliyor', 'yerlerde hep saç var',
      'saçlarım çok dökülüyor', 'saç diplerim açılıyor',
      'saç hacmim azaldı'
    ],
    keywords_en: [
      'hair loss', 'thinning hair', 'receding hairline', 'balding',
      'losing my hair', 'hair falling out', 'patchy hair loss',
      'shedding hair', 'hair thinning out', 'alopecia',
      'my hair is getting thin', 'hair fall', 'balding spot',
      'hair density loss'
    ],
    departments: { dermatoloji: 0.6, endokrinoloji: 0.3, dahiliye: 0.1 },
    region: 'genel',
    urgency: 2,
    followUp: false
  },
  {
    id: 'idrar_sorunlari',
    keywords: [
      'idrar sorunu', 'sık idrara çıkma', 'idrar yaparken yanma',
      'idrar yolu enfeksiyonu', 'idrarda kan', 'idrarda yanma',
      'çiş yaparken sızı', 'idrar kaçırma', 'kesik kesik işeme',
      'tuvaletten çıkamama', 'işerken acı', 'idrar tutamama',
      'idrarda bulanıklık', 'gece çişe kalkma', 'idrar torbası ağrısı',
      'idrar zorluğu', 'idrar yolu sızlaması', 'sürekli tuvaletim geliyor'
    ],
    keywords_en: [
      'frequent urination', 'painful urination', 'burning sensation',
      'urinary urgency', 'leaking urine', 'blood in urine',
      'difficulty peeing', 'bladder pressure', 'frequent urge to pee',
      'hesitant urination', 'dribbling urine', 'UTI symptoms',
      'nocturia'
    ],
    departments: { uroloji: 0.6, dahiliye: 0.2, kadin_dogum: 0.1, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },
  {
    id: 'bobrek_agrisi',
    keywords: [
      'böbrek ağrısı', 'böbreğim ağrıyor', 'yan ağrısı', 'böbrek taşı',
      'kasık ağrısı böbrek', 'belime bıçak saplanıyor', 'böbrek sancısı',
      'belimde sızı var', 'böbreklerim batıyor', 'arkam ağrıyor',
      'böbrek bölgesinde ağrı', 'belimin iki yanı ağrıyor',
      'idrar yolum sızlıyor', 'belim küt küt atıyor',
      'böbreklerimde yanma var', 'böbrek kumu döküyorum',
      'kasığıma vuran ağrı', 'belimden karnıma vuran sancı'
    ],
    keywords_en: [
      'kidney pain', 'flank pain', 'kidney ache', 'sharp back pain',
      'kidney stone pain', 'renal colic', 'lower back stabbing pain',
      'side pain', 'throbbing kidney', 'kidney pressure',
      'burning sensation in back', 'shooting pain in side'
    ],
    departments: { uroloji: 0.6, dahiliye: 0.3, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },
  {
    id: 'adet_duzensizligi',
    keywords: [
      'adet düzensizliği', 'regl düzensiz', 'adet gecikmesi',
      'ağrılı adet', 'aşırı kanama adet', 'dismenore', 'aybaşı gecikmesi',
      'adetim şaştı', 'günüm geçti', 'aybaşı bozukluğu', 'adet düzensiz',
      'adetim sökülmüyor', 'düzensiz kanama', 'adetim dengesiz',
      'aybaşı düzensizliği', 'adetim kesildi', 'adetim geç geldi',
      'periyodum kaydı', 'adet görememe', 'düzensiz regl'
    ],
    keywords_en: [
      'irregular periods', 'missed period', 'late period',
      'menstrual cycle issues', 'heavy flow', 'period tracking problems',
      'spotting between periods', 'cycle irregularities',
      'menstrual irregularities', 'period delay', 'abnormal bleeding',
      'hormonal cycle changes', 'unpredictable periods',
      'skipped periods'
    ],
    departments: { kadin_dogum: 0.8, endokrinoloji: 0.1, dahiliye: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },
  {
    id: 'hamilelik',
    keywords: [
      'hamilelik', 'hamileyim', 'gebelik', 'gebe', 'hamilelik belirtileri',
      'adet gecikmesi hamile', 'bebek bekliyorum', 'iki canlıyım',
      'karnımda bebek var', 'çocuk bekliyoruz', 'çift çizgiyi gördüm',
      'yolda bir bebek var', 'üzerimde ağırlık var', 'günüm geçti',
      'karnım burnumda', 'bebek yolda', 'hayırlı haber aldım',
      'üçüncü kişi olduk', 'hamile kaldım', 'bebek geliyor'
    ],
    keywords_en: [
      'pregnant', 'expecting', 'baby on the way', 'bun in the oven',
      'positive pregnancy test', 'conceived', 'expecting a baby',
      'missed my period', 'with child', 'positive result',
      'starting a family', 'got a positive', 'early pregnancy'
    ],
    departments: { kadin_dogum: 0.95, aile_hekimi: 0.05 },
    region: 'karın',
    urgency: 5,
    followUp: false
  },
  {
    id: 'seker_hastaligi',
    keywords: [
      'şeker hastalığı', 'diyabet', 'kan şekeri', 'şekerim yüksek',
      'insülin', 'tip 2 diyabet', 'şekerim var', 'gizli şeker',
      'şeker hastasıyım', 'kan şekerim çıktı', 'şeker düşüklüğü',
      'şeker oynaması', 'açlık şekeri', 'tokluk şekeri', 'insülin direnci',
      'şekerim fırladı', 'şeker koması', 'şeker değerlerim',
      'hgb a1c yüksekliği', 'şekerim düştü', 'şeker hastası'
    ],
    keywords_en: [
      'diabetes mellitus', 'high blood sugar', 'low blood sugar',
      'prediabetes', 'insulin resistance', 'sugar levels',
      'type 1 diabetes', 'gestational diabetes', 'diabetic',
      'blood glucose level', 'hyperglycemia', 'hypoglycemia',
      'having sugar issues', 'insulin dependent'
    ],
    departments: { endokrinoloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: false
  },
  {
    id: 'tansiyon',
    keywords: [
      'tansiyon', 'yüksek tansiyon', 'düşük tansiyon', 'hipertansiyon',
      'tansiyonum yüksek', 'tansiyonum düşük', 'tansiyon oynaması',
      'büyük küçük dengesi', 'tansiyon fırladı', 'tansiyon düştü bayıldım',
      'tansiyonum çıktı', 'tansiyonum var', 'tansiyon hastasıyım',
      'damar basıncı', 'tansiyon düzensizliği', 'başımda zonklama var',
      'tansiyon sorunu', 'tansiyon ilacı kullanıyorum',
      'tansiyonum zıpladı', 'tansiyonum düştü', 'tansiyonum çıktı'
    ],
    keywords_en: [
      'high blood pressure', 'low blood pressure',
      'my blood pressure is up', 'hypertension', 'hypotension',
      'BP spike', 'blood pressure issues', 'my BP is bottoming out',
      'high BP reading', 'hypertensive crisis', 'low BP symptoms',
      'my pressure is high', 'blood pressure level',
      'fluctuating blood pressure', 'systolic and diastolic'
    ],
    departments: { kardiyoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'eklem_agrisi',
    keywords: [
      'eklem ağrısı', 'eklemlerim ağrıyor', 'romatizma', 'eklem şişliği',
      'eklem sertliği', 'eklemlerim sızlıyor', 'kemik sızısı',
      'eklem batması', 'mafsal ağrısı', 'eklem kilitlenmesi',
      'eklemde yanma', 'yerinden çıkacak gibi', 'eklemde tutulma',
      'eklemlerim paslanmış gibi', 'eklem zonklaması',
      'eklem ağrısı tuttu', 'mafsallarım ağrıyor', 'eklemde sızı'
    ],
    keywords_en: [
      'joint pain', 'aching joints', 'stiff joints', 'joint soreness',
      'joint throbbing', 'stiffness', 'arthralgia', 'aching bones',
      'swollen joints', 'joint tenderness', 'grinding joints',
      'joint discomfort', 'achy limbs'
    ],
    departments: { ortopedi: 0.4, fizik_tedavi: 0.3, dahiliye: 0.3 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },
  {
    id: 'bayilma',
    keywords: [
      'bayılma', 'bayıldım', 'baygınlık', 'senkop', 'kendimden geçtim',
      'gözlerim karardı', 'yığılıp kaldım', 'şuurumu kaybettim',
      'küt diye düştüm', 'dünya başıma yıkıldı', 'aylaklık bastı',
      'kimse yok sandım', 'halsizlikten gittim', 'yere serildim',
      'bilincim kapandı', 'tüm gücüm çekildi', 'aklım başımdan gitti',
      'karanlığa gömüldüm', 'pilim bitti'
    ],
    keywords_en: [
      'fainted', 'blacked out', 'passed out', 'lost consciousness',
      'syncope', 'hit the floor', 'went limp', 'fainting spell',
      'lost my senses', 'dropped like a stone', 'everything went dark',
      'took a dive', 'passed out cold'
    ],
    departments: { noroloji: 0.4, kardiyoloji: 0.35, dahiliye: 0.25 },
    region: 'genel',
    urgency: 8,
    followUp: false
  },
  {
    id: 'nöbet',
    keywords: [
      'nöbet', 'sara nöbeti', 'epilepsi', 'kasılma', 'havale', 'çırpınma',
      'kilitlenme', 'kendinden geçme', 'gözlerin kayması',
      'baygınlık geçirme', 'titreme krizi', 'dünya kararması',
      'şuur kaybı', 'vücudun boşalması', 'kaskatı kesilme', 'sara krizi',
      'tutulma', 'yere yığılma', 'titrek nöbet', 'beyin sarsılması'
    ],
    keywords_en: [
      'seizure', 'convulsion', 'fit', 'epileptic attack', 'blackout',
      'shaking spell', 'having a turn', 'losing consciousness',
      'seizing up', 'falling out', 'spasm', 'petit mal', 'grand mal',
      'aura'
    ],
    departments: { noroloji: 0.85, dahiliye: 0.15 },
    region: 'genel',
    urgency: 8,
    followUp: false
  },
  {
    id: 'felc',
    keywords: [
      'felç', 'kolum kaldıramıyorum', 'yüzüm eğrildi', 'konuşamıyorum ani',
      'hemipleji', 'inme', 'vücudumun yarısı tutmuyor',
      'damar tıkanıklığı oldu', 'dilim dolandı', 'elim ayağım boşaldı',
      'gözüm kaydı', 'tarafıma inme indi', 'vücuduma ağırlık çöktü',
      'ağzım bir tarafa kaydı', 'sol yanım uyuştu', 'hareket edemez oldum',
      'felç geçirdim', 'vücudum kilitlendi', 'peltek konuşuyorum',
      'düşüp kaldım'
    ],
    keywords_en: [
      'stroke', 'cerebrovascular accident', 'my arm went numb',
      'slurred speech', 'face drooping', 'paralyzed', 'body felt heavy',
      'cannot move leg', 'sudden weakness', 'loss of sensation',
      'one side paralyzed', 'mini stroke', 'hemiparesis', 'I had a TIA'
    ],
    departments: { noroloji: 0.9, dahiliye: 0.1 },
    region: 'genel',
    urgency: 10,
    followUp: false
  },
  {
    id: 'soguk_alginligi',
    keywords: [
      'soğuk algınlığı', 'grip', 'nezle', 'üşüttüm', 'grip oldum',
      'soğuk aldım', 'hapşırma', 'burnum akıyor', 'kırgınım',
      'vücudum dökülüyor', 'yatak döşek yattım', 'salgın var',
      'genzim yanıyor', 'boğazım düğümlendi', 'hapşırık tuttu',
      'burnum tıkandı', 'kırgınlık çöktü', 'ağır hasta oldum',
      'ateşim çıktı', 'bademciklerim şişti', 'sesim kısıldı'
    ],
    keywords_en: [
      'common cold', 'under the weather', 'caught a bug', 'stuffy nose',
      'runny nose', 'sniffles', 'coming down with something',
      'sore throat', 'nasal congestion', 'feeling lousy',
      'flu-like symptoms', 'sneezing fit', 'feverish', 'chills'
    ],
    departments: { aile_hekimi: 0.5, dahiliye: 0.3, kbb: 0.2 },
    region: 'genel',
    urgency: 2,
    followUp: false
  },
  {
    id: 'hemoroid',
    keywords: [
      'hemoroid', 'basur', 'makatta ağrı', 'makatta kaşıntı',
      'makatta şişlik', 'makatta kanama', 'mayasıl', 'makatta et beni',
      'makatta meme', 'tuvalette kan gelmesi', 'dışkıda kan',
      'büyük tuvalette zorlanma', 'makatta dolgunluk hissi',
      'makat bölgesinde sızı', 'otururken acı', 'makat çatlağı gibi ağrı',
      'büyük abdestte kanama', 'makatta yanma', 'basur memesi'
    ],
    keywords_en: [
      'piles', 'rectal bleeding', 'anal swelling', 'hemorrhoid flare-up',
      'anal discomfort', 'straining during bowel movement',
      'anal itching', 'thrombosed hemorrhoid', 'blood in stool',
      'rectal prolapse', 'painful bowel movements', 'anal lump',
      'hemorrhoidal tissue'
    ],
    departments: { genel_cerrahi: 0.7, gastroenteroloji: 0.2, aile_hekimi: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: false
  },
  {
    id: 'fitik',
    keywords: [
      'fıtık', 'kasık fıtığı', 'göbek fıtığı', 'karında şişlik',
      'kasıkta şişlik', 'yerinden oynamış', 'et şişmesi', 'yumru çıkması',
      'bağırsak düğümlenmesi', 'bel kayması', 'karnımda bir şey var',
      'iç organ sarkması', 'yumurta gibi şişlik', 'adale yırtığı',
      'bölgesel şişkinlik', 'kas gevşemesi', 'karın duvarı çökmesi'
    ],
    keywords_en: [
      'hernia', 'bulge', 'protrusion', 'rupture', 'lump',
      'abdominal swelling', 'tissue coming out', 'tear in the muscle',
      'slipped disc', 'groin lump', 'umbilical bulge',
      'intestine pushing through'
    ],
    departments: { genel_cerrahi: 0.7, ortopedi: 0.2, dahiliye: 0.1 },
    region: 'karın',
    urgency: 5,
    followUp: false
  },
  {
    id: 'lenf_sisme',
    keywords: [
      'lenf şişmesi', 'bez şişmesi', 'koltuk altı şişlik', 'boyunda bez',
      'kasıkta bez', 'beze çıkması', 'fındık gibi şişlik', 'şişen beze',
      'elime gelen kitle', 'beze attı', 'bilye gibi şişlik',
      'yumru oluştu', 'bezelerin şişmesi', 'şişlik var',
      'deri altında sertlik', 'şişmiş lenfler', 'bezelerim şişti',
      'boğazımda beze', 'topaklanma'
    ],
    keywords_en: [
      'swollen lymph nodes', 'lump under skin', 'swollen glands',
      'enlarged node', 'neck lump', 'armpit swelling', 'lymphadenopathy',
      'tender bump', 'swollen node', 'a hard lump',
      'swelling in the neck', 'groin lump', 'puffy glands'
    ],
    departments: { dahiliye: 0.5, kbb: 0.2, genel_cerrahi: 0.2, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },
  {
    id: 'susuzluk',
    keywords: [
      'aşırı susuzluk', 'çok su içiyorum', 'sürekli susuyorum',
      'ağız kuruluğu', 'içim yanıyor', 'boğazım kurumuş',
      'dilim damağım yapıştı', 'hararetim hiç geçmiyor',
      'günde damacana bitiriyorum', 'ağzım kupkuru', 'sudan doymuyorum',
      'dilim dışarı çıkacak', 'ağzımın tadı kaçtı',
      'suyu içip içip kana kana içemiyorum', 'dudağım çatlıyor',
      'içim dışım su oldu'
    ],
    keywords_en: [
      'excessive thirst', 'always parched', 'unquenchable thirst',
      'dry mouth', 'cotton mouth', 'dehydrated all the time',
      'thirsty as a camel', 'thirsty all the time', 'extreme polydipsia',
      'dry throat', 'thirst spikes'
    ],
    departments: { endokrinoloji: 0.5, dahiliye: 0.3, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },
  {
    id: 'unutkanlik',
    keywords: [
      'unutkanlık', 'hafıza kaybı', 'hatırlayamıyorum', 'bellek sorunu',
      'konsantrasyon bozukluğu', 'aklıma gelmiyor', 'kafam durdu',
      'aklım gidip geliyor', 'hafızam zayıfladı', 'balık hafızalıyım',
      'ne yapacağımı şaşırdım', 'dalgınlaştım', 'boşluğa düşüyorum',
      'bildiklerimi unutuyorum', 'kafa karışıklığı', 'odaklanamıyorum',
      'eskiyi hatırlamıyorum', 'aklım yerinde değil',
      'her şeyi unutur oldum'
    ],
    keywords_en: [
      'memory lapse', 'brain fog', 'forgetful',
      'lost my train of thought', 'senior moment', 'blanking out',
      'mental block', 'scatterbrained', 'fuzzy thinking',
      'memory issues', 'short-term memory loss', 'losing my edge',
      'mind is a blank'
    ],
    departments: { noroloji: 0.6, psikiyatri: 0.3, dahiliye: 0.1 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },
  // ═══════════════════════════════════
  // ÜROLOJİ
  // ═══════════════════════════════════

  {
    id: 'idrar_yanmasi',
    keywords: [
      'idrar yaparken yanma', 'idrar yakarken ağrı', 'yanmalı idrar',
      'dizüri', 'idrar ağrılı', 'tuvalette yanma', 'çiş yaparken yanıyor',
      'idrarı yaparken acıması', 'işerken sızı', 'çişini yaparken sızlama',
      'idrar kanallarının yanması', 'tuvalette sızı',
      'işeme sonrası yanma', 'idrarda batma', 'çiş yaparken acı',
      'idrar yolunda acı', 'işerken can yanması', 'idrara çıkarken sızı',
      'penis ucunda yanma', 'idrar zorluğu ve yanma'
    ],
    keywords_en: [
      'stinging when peeing', 'burning sensation during urination',
      'painful urination', 'dysuria', 'burning pee',
      'sharp pain while peeing', 'urethral burning', 'hurts to pee',
      'stinging sensation', 'burning during micturition', 'pee burns',
      'pain when passing urine'
    ],
    departments: { uroloji: 0.6, dahiliye: 0.25, kadin_dogum: 0.15 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },

  {
    id: 'sik_idrar',
    keywords: [
      'sık idrara çıkma', 'sık tuvalete gidiyorum',
      'gece sık idrara kalkıyorum', 'pollaküri', 'sürekli idrara çıkma',
      'idrar tutamıyorum', 'mesane sorunları', 'sürekli çişim geliyor',
      'tuvaletten çıkamıyorum', 'günde on kere çişe gidiyorum',
      'idrarım çok sıkışıyor', 'mesanem dolmuyor sanki',
      'gece boyu tuvaletteyim', 'idrar kaçırma hissi',
      'sıkıştım mı hemen tuvalet arıyorum',
      'sabaha kadar tuvalete kalkıyorum', 'idrarım bitmek bilmiyor',
      'yarım saatte bir tuvalet', 'idrar torbam boşalmıyor gibi',
      'tuvalet nöbeti tutuyorum', 'sürekli tuvalet ihtiyacı'
    ],
    keywords_en: [
      'frequent urination', 'peeing all the time', 'urinary frequency',
      'needing to pee often', 'constantly needing the bathroom',
      'excessive urination', 'waking up to pee', 'overactive bladder',
      'going to the toilet frequently', 'urinary urgency',
      'frequent micturition', 'always have to go',
      'constant need to urinate'
    ],
    departments: { uroloji: 0.65, dahiliye: 0.2, kadin_dogum: 0.15 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },

  {
    id: 'idrar_kanamasi',
    keywords: [
      'idrarda kan', 'kanlı idrar', 'idrar kanlı', 'hematüri',
      'idrar kırmızı', 'çişte kan', 'tuvalette kan idrar',
      'işerken kan gelmesi', 'idrar renginin kırmızı olması', 'kan işemek',
      'işemede kan', 'çişin kanlı olması', 'idrarla kan gelmesi',
      'pembe idrar', 'idrar rengi pembe', 'idrardan kan gelmesi',
      'işediğimde kan görüyorum', 'idrarın kan renginde olması',
      'kırmızı çiş'
    ],
    keywords_en: [
      'blood in urine', 'bloody pee', 'hematuria', 'red urine',
      'peeing blood', 'pink urine', 'blood in my pee', 'dark urine',
      'tea-colored urine', 'rust-colored urine',
      'visible blood in urine'
    ],
    departments: { uroloji: 0.75, dahiliye: 0.15, kadin_dogum: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: true
  },

  {
    id: 'bobrek_tasi',
    keywords: [
      'böbrek taşı', 'idrar taşı', 'taş düşürüyorum', 'renal kolik',
      'kasık ağrısı yayılan', 'böbrekte taş', 'üreter taşı',
      'böbrek sancısı', 'idrar yolu taşı', 'bel ağrısı', 'kuma döküyorum',
      'böbrek kumu', 'bıçak gibi saplanıyor', 'yan tarafım ağrıyor',
      'idrarda yanma', 'böbrek sancısı tuttu', 'idrar kanalında taş',
      'böbreğimde batma var', 'taş sancısı', 'idrarım kanlı geliyor',
      'kum dökmek', 'böbrek krizine girdim', 'kıvrandıran ağrı'
    ],
    keywords_en: [
      'kidney stones', 'kidney stone pain', 'renal colic',
      'passing a stone', 'flank pain', 'ureteral stone', 'kidney gravel',
      'sharp back pain', 'groin pain', 'blood in urine',
      'nephrolithiasis', 'painful urination', 'kidney spasms'
    ],
    departments: { uroloji: 0.8, genel_cerrahi: 0.1, dahiliye: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: false
  },

  {
    id: 'idrar_tutamama',
    keywords: [
      'idrar tutamıyorum', 'inkontinans', 'altıma kaçırdım',
      'idrar kaçırma', 'öksürünce kaçırma', 'üriner inkontinans',
      'mesane kontrolü yok', 'çişimi tutamıyorum', 'altıma ıslatıyorum',
      'istemsiz idrar geliyor', 'kaçak yapıyor', 'idrarım sızıyor',
      'idrar yetişemiyorum', 'çişim damlıyor', 'mesanem boşalıyor',
      'idrarım tutmuyor', 'altıma ıslattım', 'çiş kaçıyor',
      'idrar tutma sorunum var', 'gece altıma kaçırıyorum'
    ],
    keywords_en: [
      'leaking urine', 'bladder leakage', 'involuntary urination',
      'accidental leaks', 'wetting myself', 'loss of bladder control',
      'urinary dribbling', 'weak bladder', 'bedwetting',
      'leaking when sneezing', 'leaky bladder', 'urge incontinence'
    ],
    departments: { uroloji: 0.7, kadin_dogum: 0.2, dahiliye: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: false
  },

  {
    id: 'prostat_sorunu',
    keywords: [
      'prostat', 'idrar akışı zayıf', 'idrar bitmeden kesiliyor',
      'prostat şişmesi', 'prostatit', 'idrar başlamakta güçlük',
      'damla damla idrar', 'prostat büyümesi', 'idrara zor çıkıyorum',
      'gece idrara kalkma', 'idrarı tam boşaltamama',
      'idrar yaparken yanma', 'tuvaletten geç çıkma', 'idrar sıkışması',
      'işerken zorlanma', 'kesik kesik işeme', 'idrar torbası doluluğu',
      'idrar tutamama', 'çişe yetişememe', 'idrar kaçırma',
      'sık sık idrara çıkma', 'idrar torbası baskısı'
    ],
    keywords_en: [
      'enlarged prostate', 'weak urine stream', 'frequent urination',
      'difficulty urinating', 'nocturia', 'dribbling after urination',
      'straining to pee', 'incomplete bladder emptying',
      'urgent need to pee', 'hesitancy', 'urinary retention',
      'prostate enlargement symptoms', 'bph symptoms',
      'painful urination'
    ],
    departments: { uroloji: 0.9, dahiliye: 0.1 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },

  {
    id: 'kasik_agrisi',
    keywords: [
      'kasık ağrısı', 'kasığım ağrıyor', 'kasıkta ağrı', 'testis ağrısı',
      'husye ağrısı', 'alt karın kasık', 'kasık bölgesi ağrı',
      'kasık sancısı', 'bacak arası ağrısı', 'yumurtalık sızlaması',
      'kasıkta batma', 'kasıkta çekilme hissi', 'kasıkta yanma',
      'üreme bölgesi ağrısı', 'belden aşağıda ağrı', 'kasık krampları',
      'kasıkta zonklama', 'kasık kopması gibi', 'pelvis sızısı'
    ],
    keywords_en: [
      'groin pain', 'groin ache', 'pain in my groin', 'groin pull',
      'testicular pain', 'sharp groin pain', 'aching groin',
      'pelvic discomfort', 'pain between legs', 'groin soreness',
      'throbbing groin', 'lower abdomen pain'
    ],
    departments: { uroloji: 0.5, genel_cerrahi: 0.25, kadin_dogum: 0.15, ortopedi: 0.1 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },

  {
    id: 'idrar_yapamama',
    keywords: [
      'idrar yapamıyorum', 'idrarm gelmiyor', 'üriner retansiyon',
      'mesane doldu yapamıyorum', 'idrar tıkandı', 'hiç idrar gelmiyor',
      'tuvalete çıkamıyorum', 'işeyemiyorum', 'idrar torbam boşalmıyor',
      'idrarım içeride kaldı', 'çişim var ama çıkmıyor',
      'idrar akışım kesildi', 'tuvaletimi yaparken zorlanıyorum',
      'damla bile gelmiyor', 'idrar yolu tıkandı', 'mesanem boşalmıyor',
      'tuvalet tıkanıklığı var', 'idrar kanalım kapandı',
      'çiş yapamıyorum', 'sıkıştım ama yapamıyorum'
    ],
    keywords_en: [
      'urinary retention', 'cannot pee', 'inability to urinate',
      'blocked urine', 'stuck urine', 'cannot pass urine',
      'bladder feels full', 'urine flow stopped', 'urinary blockage',
      'difficulty urinating', 'strained urination', 'no urine output',
      'holding pee in'
    ],
    departments: { uroloji: 0.85, dahiliye: 0.15 },
    region: 'karın',
    urgency: 8,
    followUp: false
  },

  {
    id: 'cinsel_saglik',
    keywords: [
      'cinsel güçsüzlük', 'ereksiyon sorunu', 'erektil disfonksiyon',
      'cinsel isteksizlik', 'libido azalması', 'cinsel sorun', 'impotans',
      'sertleşme sorunu', 'yatakta başarısızlık', 'erkeklik gücü düştü',
      'performans düşüklüğü', 'kaldıramama', 'isteksizleştim',
      'erekte olamama', 'yatakta erken pes etme', 'tadım tuzum yok',
      'erkeklik görevini yapamama', 'sönüklük', 'cinsel soğukluk',
      'ateşim söndü', 'vücudum yanıt vermiyor'
    ],
    keywords_en: [
      'erectile dysfunction', 'cannot get it up', 'bedroom issues',
      'low sex drive', 'performance anxiety', 'losing the spark',
      'impotency', 'flaccidity', 'sexual dysfunction', 'bedroom failure',
      'low libido', 'trouble maintaining an erection',
      'lack of sexual desire', 'intimacy problems'
    ],
    departments: { uroloji: 0.6, psikiyatri: 0.2, endokrinoloji: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },
  // ═══════════════════════════════════════════════════════
  // YENİ SEMPTOMLAR — PSİKİYATRİ + KADIN-DOĞUM
  // symptom-db.js içinde SYMPTOM_DATABASE dizisinin sonuna ekle.
  // ═══════════════════════════════════════════════════════

  // ═══════════════════════════════════
  // PSİKİYATRİ
  // ═══════════════════════════════════

  {
    id: 'panik_atak',
    keywords: [
      'panik atak', 'panik krizi', 'aniden kalp çarpıntısı korku',
      'ölüm korkusu geçti', 'nefes kesilen korku', 'panik geçiriyorum',
      'aniden çok korktum', 'panik atağım var', 'felç gibi oldum',
      'boğulacak gibi hissediyorum', 'ödüm koptu', 'elim ayağım boşaldı',
      'tansiyonum fırladı sandım', 'beynim durdu', 'üzerime çöktüler',
      'kalbim yerinden çıkacak', 'kötü bir şey olacak',
      'nefesim düğümlendi', 'içim daralıyor', 'çıldıracak gibiyim',
      'gözüm karardı', 'soğuk soğuk terledim', 'kendimi kaybettim'
    ],
    keywords_en: [
      'panic attack', 'having a meltdown', 'freaking out',
      'anxiety attack', 'full-blown panic', 'losing control',
      'heart pounding', 'near death experience', 'spiraling out',
      'feeling overwhelmed', 'hyperventilating', 'dread',
      'feeling trapped', 'going crazy'
    ],
    departments: { psikiyatri: 0.8, kardiyoloji: 0.15, dahiliye: 0.05 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },

  {
    id: 'obsesif_kompulsif',
    keywords: [
      'takıntı', 'obsesyon', 'okb', 'tekrarlayan düşünceler',
      'ellerimi sürekli yıkıyorum', 'kontrol etmeden duramıyorum',
      'takıntılı davranışlar', 'kompulsif davranış', 'vesvese',
      'kılı kırk yarmak', 'evhamlı', 'huzursuz düşünceler',
      'kafaya takmak', 'aynı şeyleri yapıp durmak', 'titizlik hastası',
      'düşüncelerden kurtulamamak', 'fıttıracak gibi olmak',
      'kuruntu yapmak', 'beynim durmuyor', 'her şeyi düzenleme isteği',
      'içim rahat etmiyor', 'huzursuzluk krizi', 'takıntı hastalığı'
    ],
    keywords_en: [
      'OCD', 'compulsive habits', 'intrusive thoughts',
      'obsessive habits', 'constant checking', 'racing thoughts',
      'mental loops', 'repetitive urges', 'ritualistic behavior',
      'feeling stuck', 'need for perfection', 'anxious routines',
      'overthinking everything'
    ],
    departments: { psikiyatri: 0.9, dahiliye: 0.1 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },

  {
    id: 'travma_ptsd',
    keywords: [
      'travma', 'ptsd', 'travma sonrası stres', 'kabus görüyorum',
      'geçmişi tekrar yaşıyorum', 'flashback', 'kötü anılar geliyor',
      'travmatik olay sonrası sorun', 'o anı unutamıyorum',
      'aklımdan çıkmıyor', 'yerimde duramıyorum', 'hep tetikteyim',
      'huzurum kalmadı', 'sinirlerim bozuldu',
      'eski günler aklıma geliyor', 'içime kapandım',
      'sürekli irkiliyorum', 'gözümün önüne geliyor', 'düzenim bozuldu',
      'kötü şeyler aklımda', 'kendimi güvende hissetmiyorum',
      'yaşadıklarım peşimi bırakmıyor', 'hep diken üstündeyim'
    ],
    keywords_en: [
      'haunted by the past', 'constantly on edge', 'night terrors',
      'reliving the moment', 'jumpy', 'avoiding memories',
      'shell-shocked', 'trauma triggers', 'emotional numbness',
      'nightmares', 'feeling detached', 'anxious outbursts',
      'hypervigilance'
    ],
    departments: { psikiyatri: 0.9, dahiliye: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'yeme_bozuklugu',
    keywords: [
      'yeme bozukluğu', 'anoreksiya', 'bulimia', 'yemek yiyemiyorum',
      'aşırı yeme', 'kusarak kilo verme', 'yemekten korkuyorum',
      'kendimi aç bırakıyorum', 'iştahım kapandı', 'boğazımdan geçmiyor',
      'lokma geçmiyor', 'gözüm dönüyor', 'kilo takıntım var',
      'tıkınırcasına yiyorum', 'açlıktan bayılıyorum',
      'bir deri bir kemik', 'yemekten tiksiniyorum',
      'sadece su içsem yarıyor', 'iştahım açıldı', 'yediğimi çıkarıyorum',
      'sürekli diyet yapıyorum', 'kalori hesabı yapıyorum',
      'kilo alma korkusu'
    ],
    keywords_en: [
      'eating disorder', 'anorexia nervosa', 'bulimia nervosa',
      'binge eating', 'starving myself', 'binger', 'compulsive eating',
      'food phobia', 'purging', 'losing my appetite',
      'obsessed with calories', 'not eating enough', 'overeating',
      'body dysmorphia', 'disordered eating'
    ],
    departments: { psikiyatri: 0.75, endokrinoloji: 0.15, dahiliye: 0.1 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },

  {
    id: 'madde_kullanimi',
    keywords: [
      'alkol bağımlılığı', 'madde kullanımı', 'sigara bırakamıyorum',
      'ilaç bağımlılığı', 'alkol sorunu', 'bağımlılık', 'uyuşturucu',
      'içiciyim', 'kriz geçiriyorum', 'kafası yerinde değil',
      'hap kullanıyorum', 'kendimi kaybediyorum', 'damardan alıyorum',
      'zehir kullanmak', 'otlanmak', 'fırt çekmek', 'kurtulamıyorum',
      'madde kafası', 'torbacıdan almak', 'krizim tuttu', 'bağımlı oldum',
      'ağzımı sürmüyorum'
    ],
    keywords_en: [
      'substance abuse', 'getting high', 'addicted to meds',
      'drug habit', 'cannot stop drinking', 'junkie',
      'chasing the dragon', 'clean and sober', 'withdrawal symptoms',
      'substance dependency', 'hit rock bottom', 'tripping',
      'off the wagon', 'chemically dependent', 'rehab patient'
    ],
    departments: { psikiyatri: 0.85, dahiliye: 0.15 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'dikkat_eksikligi',
    keywords: [
      'dikkat eksikliği', 'adhd', 'odaklanamıyorum', 'dikkatim dağınık',
      'hiperaktivite', 'konsantrasyon sorunu', 'aklım sürekli dağılıyor',
      'kafa yerinde değil', 'daldan dala konuyorum', 'beynim duruyor',
      'hiçbir şeye başlayamıyorum', 'kulağım duymuyor sanki',
      'düşüncelerim uçup gidiyor', 'sabit duramıyorum',
      'kafam hep başka yerde', 'bir şeye veremiyorum kendimi',
      'oturduğum yerde huzursuzum', 'çabuk sıkılıyorum',
      'bir işi bitiremiyorum', 'takılıp kalıyorum', 'zihnim çok bulanık'
    ],
    keywords_en: [
      'brain fog', 'scatterbrained', 'short attention span', 'spacey',
      'my mind wanders', 'easily distracted', 'zoning out', 'restless',
      'mentally checked out', 'ADD', 'trouble staying on task',
      'lost my train of thought'
    ],
    departments: { psikiyatri: 0.8, noroloji: 0.2 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },

  {
    id: 'sosyal_fobi',
    keywords: [
      'sosyal fobi', 'sosyal kaygı', 'insanlardan korkuyorum',
      'topluluk korkusu', 'utangaçlık aşırı', 'sosyal ortamdan kaçınma',
      'sosyal anksiyete', 'toplum içine çıkamıyorum',
      'elalem ne der korkusu', 'insan içine karışamıyorum',
      'kendimi kısıtlanmış hissediyorum', 'ortamlara giremiyorum',
      'rezil olma korkusu', 'çekingenlikten ölüyorum',
      'kalabalık beni boğuyor', 'yanlış bir şey yaparım korkusu',
      'bakışlardan rahatsız oluyorum', 'sıkılganlık',
      'kendimi ifade edemiyorum', 'herkes bana bakıyor gibi',
      'sosyal hayattan koptum', 'toplulukta donup kalıyorum'
    ],
    keywords_en: [
      'social anxiety disorder', 'fear of social situations',
      'social phobia', 'afraid of being judged', 'social awkwardness',
      'stage fright', 'avoiding social gatherings',
      'fear of public speaking', 'people anxiety', 'social inhibition',
      'nervous around people', 'worrying about social interaction',
      'feeling judged by others', 'social discomfort',
      'spotlight effect'
    ],
    departments: { psikiyatri: 0.9, dahiliye: 0.1 },
    region: 'genel',
    urgency: 4,
    followUp: false
  },

  {
    id: 'bipolar_bozukluk',
    keywords: [
      'bipolar', 'manik depresif', 'mani', 'aşırı enerjiyim uyumuyorum',
      'çok coşkuluyum sonra çöküyorum', 'ruh hali değişimleri aşırı',
      'bipolar bozukluk', 'duygu durum iniş çıkışı', 'bir öyle bir böyle',
      'inişli çıkışlı ruh hali', 'modum sürekli değişiyor',
      'duygu karmaşası yaşıyorum', 'daldan dala atlıyorum',
      'dengesiz ruh hali', 'kafam sürekli gidip geliyor',
      'uçlarda yaşıyorum', 'duygu patlamaları', 'sinirlerim çok değişken',
      'bazen uçuyorum bazen yerlerdeyim', 'duygularım savruluyor',
      'halet-i ruhiyem karışık'
    ],
    keywords_en: [
      'mood swings', 'manic depressive', 'up and down mood',
      'emotional roller coaster', 'bipolar disorder', 'highs and lows',
      'extreme mood shifts', 'cycling moods', 'manic highs',
      'depressive slumps', 'bi-polar', 'mood instability',
      'emotional instability', 'bipolar shift'
    ],
    departments: { psikiyatri: 0.95, dahiliye: 0.05 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },

  // ═══════════════════════════════════
  // KADIN-DOĞUM
  // ═══════════════════════════════════

  {
    id: 'vajinal_akinti',
    keywords: [
      'vajinal akıntı', 'beyaz akıntı', 'renkli akıntı', 'akıntım var',
      'vajinit', 'kötü kokulu akıntı', 'akıntı kaşıntı',
      'rahim ağzı akıntısı', 'çamaşır kirlenmesi', 'akıntım kesilmiyor',
      'sarı akıntı', 'peynir kesiği gibi', 'iç çamaşırım ıslanıyor',
      'kokulu akıntı', 'fazla akıntım var', 'ilişki sonrası akıntı',
      'adet öncesi akıntı', 'yoğun sıvı gelmesi', 'cinsel bölge akıntısı',
      'günde birkaç ped', 'akıntı şikayeti'
    ],
    keywords_en: [
      'vaginal discharge', 'leaking down there', 'excessive moisture',
      'yeast infection discharge', 'abnormal discharge', 'unusual fluid',
      'smelly discharge', 'white gunk', 'down there discharge',
      'intermenstrual bleeding', 'cervical mucus', 'watery discharge',
      'clumpy discharge'
    ],
    departments: { kadin_dogum: 0.85, dahiliye: 0.15 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },

  {
    id: 'meme_sorunu',
    keywords: [
      'meme ağrısı', 'memem ağrıyor', 'memede kitle', 'memede şişlik',
      'meme başı akıntısı', 'meme kanseri şüphesi', 'memede sertlik',
      'göğüste kitle', 'meme ucu yarası', 'göğsümde sızı var',
      'meme şekil bozukluğu', 'göğsümde beze var',
      'meme derisinde çekilme', 'göğüs ucu akması', 'meme dokusunda batma',
      'göğüste yanma hissi', 'meme ucu kaşıntısı', 'göğsümde ağırlık var',
      'göğüs ucu çökmesi', 'meme ucu hassasiyeti', 'göğsümde yumru var',
      'meme kızarıklığı', 'göğüste zonklama'
    ],
    keywords_en: [
      'breast lump', 'breast pain', 'nipple discharge',
      'breast tenderness', 'sore breast', 'breast swelling',
      'nipple retraction', 'breast tightness', 'lump in chest',
      'breast skin dimpling', 'sharp breast pain', 'heavy breasts',
      'burning breast sensation', 'itchy nipples', 'breast mass'
    ],
    departments: { kadin_dogum: 0.6, genel_cerrahi: 0.3, dahiliye: 0.1 },
    region: 'göğüs',
    urgency: 6,
    followUp: true
  },

  {
    id: 'adet_agrisi',
    keywords: [
      'adet ağrısı', 'regl ağrısı', 'menstrüasyon ağrısı', 'dismenore',
      'adetimde çok ağrı', 'ağrılı adet', 'kramp adet', 'regl krampları',
      'karnım sökülüyor', 'adet sancısı', 'regl sancısı',
      'günümde ağrım var', 'kasık sancısı', 'aybaşı ağrısı',
      'karın krampları', 'adet sancılanması', 'regl sancılanması',
      'adet sancısından kıvranmak', 'karnım kasılıyor', 'periyot ağrısı',
      'adet döneminde ağrı'
    ],
    keywords_en: [
      'period pain', 'menstrual cramps', 'period cramps', 'period pains',
      'dysmenorrhea', 'uterine cramps', 'bad period pain',
      'menstrual pain', 'cramping', 'period ache', 'having cramps',
      'severe period pain', 'period agony'
    ],
    departments: { kadin_dogum: 0.85, dahiliye: 0.15 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },

  {
    id: 'gebelik_bulantisi',
    keywords: [
      'hamilelik bulantısı', 'gebelik bulantısı',
      'sabah bulantısı hamileyim', 'hamile bulantı', 'gebelikte kusma',
      'hiperemezis', 'midem bulanıyor', 'aş ermek',
      'hamilelikte mide yanması', 'çiğlik tutması',
      'sabahları midem kalkıyor', 'hamilelik kusması',
      'ağzımın tadı bozuk', 'midem ağzıma geliyor',
      'bulantıdan yemek yiyemiyorum', 'hamilelikte öğürme',
      'sabahları içim dışıma çıkıyor', 'gebelikte mide bulantısı',
      'tiksiniyorum', 'midem çok hassas'
    ],
    keywords_en: [
      'morning sickness', 'nausea during pregnancy', 'feeling nauseous',
      'throwing up', 'puking while pregnant', 'feeling queasy',
      'sick to my stomach', 'pregnancy nausea', 'morning nausea',
      'all-day sickness', 'hyperemesis', 'nauseated', 'upset stomach'
    ],
    departments: { kadin_dogum: 0.9, dahiliye: 0.1 },
    region: 'karın',
    urgency: 4,
    followUp: true
  },

  {
    id: 'menopoz',
    keywords: [
      'menopoz', 'adet kesildi', 'klimaks', 'sıcak basması',
      'gece terlemesi menopoz', 'adet görmüyorum menopoz',
      'menopoz belirtileri', 'perimenopoz', 'hayızdan kesilmek',
      'kadınlığın bitişi', 'aybaşı bitti', 'ateş basması',
      'yaşam dönemi değişimi', 'erken yaşlanma dönemi',
      'adet görmeyi bıraktım', 'ter boşalması', 'yaş dönümü',
      'üreme devri kapandı', 'hormonlarım değişti',
      'kadınlık dönemi bitti', 'adet düzenim bozuldu',
      'ateşler içinde yanmak'
    ],
    keywords_en: [
      'change of life', 'the change', 'hot flashes', 'postmenopausal',
      'menopausal transition', 'night sweats', 'stopping periods',
      'hormonal shift', 'perimenopause symptoms', 'end of fertility',
      'climacteric period', 'cessation of menses', 'midlife transition'
    ],
    departments: { kadin_dogum: 0.75, endokrinoloji: 0.15, dahiliye: 0.1 },
    region: 'genel',
    urgency: 3,
    followUp: false
  },

  {
    id: 'endometriozis',
    keywords: [
      'endometriozis', 'çikolata kisti', 'rahim dışı doku',
      'ağrılı cinsel ilişki', 'adet sırasında şiddetli ağrı',
      'kronik pelvik ağrı', 'yumurtalık kisti', 'adet sancısı',
      'kasıklarda batma', 'geçmeyen karın ağrısı', 'kısırlık kisti',
      'aşırı yoğun adet', 'sancıdan kıvranma', 'pelvis ağrısı',
      'iç kanama sancısı', 'karnım hep şiş', 'cinsel hayatı bozan ağrı',
      'tüp bebek sebebi', 'yapışıklık ağrısı', 'adet düzensizliği'
    ],
    keywords_en: [
      'endo', 'endo belly', 'painful periods', 'severe cramps',
      'pelvic floor pain', 'infertility issues',
      'endometriosis flare-up', 'chronic pelvic pain', 'dysmenorrhea',
      'laparoscopy candidate', 'pain with intercourse',
      'ovarian adhesions', 'deep pelvic ache'
    ],
    departments: { kadin_dogum: 0.9, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },

  {
    id: 'vajinal_kanama',
    keywords: [
      'vajinal kanama', 'adet dışı kanama', 'adetler arası kanama',
      'regl dışı kanama', 'postmenopozal kanama', 'ilişki sonrası kanama',
      'anormal rahim kanaması', 'adet harici kan', 'lekelenme',
      'ara kanama', 'gelip giden kan', 'beklenmedik kanama',
      'adetim bozuldu', 'özel bölgeden kan gelmesi', 'kanamam durmuyor',
      'üstüne görme', 'aybaşı dışında kanama', 'kırmızı leke',
      'adet düzensizliği kanaması', 'düzensiz kanama'
    ],
    keywords_en: [
      'spotting', 'breakthrough bleeding', 'vaginal bleeding',
      'intermenstrual bleeding', 'abnormal bleeding', 'heavy periods',
      'bleeding between cycles', 'post-coital bleeding',
      'menopause bleeding', 'unexpected discharge', 'unusual bleeding',
      'spotting between periods', 'genital bleeding'
    ],
    departments: { kadin_dogum: 0.9, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 7,
    followUp: true
  },
  // ═══════════════════════════════════════════════════════
  // YENİ SEMPTOMLAR — GASTROENTEROLOJİ + NÖROLOJİ
  // symptom-db.js içinde SYMPTOM_DATABASE dizisinin sonuna ekle.
  // ═══════════════════════════════════════════════════════

  // ═══════════════════════════════════
  // GASTROENTEROLOJİ (genişletme)
  // ═══════════════════════════════════

  {
    id: 'karaciger_sorunu',
    keywords: [
      'karaciğer ağrısı', 'karaciğerim ağrıyor', 'sağ üst karın ağrısı',
      'karaciğer yağlanması', 'hepatit', 'karaciğer iltihabı',
      'karaciğer enzimi yüksek', 'siroz', 'sağ kaburga altı sancısı',
      'karaciğerde büyüme var', 'sağ tarafımda batma',
      'karaciğer değerlerim bozuk', 'karaciğerimde leke çıktı',
      'sağ kaburgamın altı şiş', 'karaciğerimde kist var',
      'sağ boşluğumda ağrı', 'karaciğerimde gölge görüldü',
      'karaciğerde toksin birikimi', 'safra ve karaciğer sorunu',
      'karaciğerimde sertlik hissediyorum', 'sağ karnımda dolgunluk hissi',
      'karaciğerde yara var'
    ],
    keywords_en: [
      'liver pain', 'upper right quadrant pain', 'fatty liver',
      'elevated liver enzymes', 'liver discomfort', 'swollen liver',
      'liver tenderness', 'stabbing pain in side',
      'liver function issues', 'hepatic distress', 'liver congestion',
      'right-sided abdominal pain', 'enlarged liver', 'liver spots',
      'pain under right ribs'
    ],
    departments: { gastroenteroloji: 0.6, dahiliye: 0.3, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },

  {
    id: 'safra_kesesi',
    keywords: [
      'safra kesesi', 'safra taşı', 'safra kesesi ağrısı', 'kolesistit',
      'yağlı yemek sonrası ağrı', 'sağ üst karın yağlı yemek',
      'safra yolu', 'kolsistit', 'safraya vuran ağrı',
      'sağ kaburga altı sancı', 'safrada çamur', 'safra sancısı',
      'karnın sağ tarafı ağrısı', 'safrada şişlik',
      'safra kesesi patlaması', 'yemekten sonra mide sancısı',
      'safra kesesi taşı sancısı', 'safradan kaynaklı ağrı',
      'sağ tarafta bıçak saplanması', 'safra kesesi iltihabı',
      'safra kesesi ameliyatı sonrası', 'safra yolu tıkanıklığı'
    ],
    keywords_en: [
      'gallbladder attack', 'gallstone pain', 'biliary colic',
      'gallbladder flare-up', 'right upper quadrant pain', 'gallstones',
      'cholecystitis', 'post-meal abdominal pain', 'gallbladder sludge',
      'gallbladder issues', 'biliary duct pain', 'acute cholecystitis',
      'gallbladder discomfort', 'passing a gallstone'
    ],
    departments: { gastroenteroloji: 0.4, genel_cerrahi: 0.5, dahiliye: 0.1 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },

  {
    id: 'mide_ulser',
    keywords: [
      'ülser', 'mide ülseri', 'peptik ülser', 'aç karnına mide ağrısı',
      'mide yanması şiddetli', 'helikobakter', 'h pylori',
      'mide kanaması şüphesi', 'katran gibi dışkı', 'midede yara',
      'mide delinmesi', 'mide kazınması', 'mide gurultusu',
      'gece mide sancısı', 'yemekten sonra ağrı', 'mide asidi fazlalığı',
      'karnımda yanma var', 'mide erimesi', 'ağza acı su gelmesi',
      'mide guruldaması', 'içim yanıyor', 'midede kemirme hissi',
      'mide ekşimesi'
    ],
    keywords_en: [
      'stomach ulcer', 'gastric ulcer', 'stomach sores',
      'gnawing stomach pain', 'burning stomach sensation',
      'peptic ulcer disease', 'stomach lining erosion',
      'hungry stomach pain', 'epigastric pain', 'severe heartburn',
      'stomach ache after eating', 'ulcer flare-up', 'gnawing sensation'
    ],
    departments: { gastroenteroloji: 0.7, dahiliye: 0.2, genel_cerrahi: 0.1 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },

  {
    id: 'irritabl_barsak',
    keywords: [
      'irritabl barsak', 'ibs', 'irritable bowel',
      'spazmodik karın ağrısı', 'stresle karın ağrısı',
      'tuvaletten sonra rahatlamak', 'barsak spazmı',
      'fonksiyonel barsak bozukluğu', 'huzursuz bağırsak',
      'bağırsak tembelliği', 'karın şişkinliği', 'bağırsak hassasiyeti',
      'sinirsel ishal', 'gaz sancısı', 'bağırsak düğümlenmesi hissi',
      'kabızlık nöbetleri', 'bağırsak düzensizliği', 'bağırsak spazmı',
      'bağırsak gurultusu', 'gergin bağırsaklar', 'sık tuvalete çıkma'
    ],
    keywords_en: [
      'irritable bowel syndrome', 'nervous stomach', 'spastic colon',
      'gut sensitivity', 'bloated belly', 'tummy troubles',
      'digestive issues', 'frequent bowel movements', 'bowel flare-up',
      'irritable gut', 'stomach cramps', 'leaky gut feel',
      'irritable bowel', 'GI distress'
    ],
    departments: { gastroenteroloji: 0.75, dahiliye: 0.15, psikiyatri: 0.1 },
    region: 'karın',
    urgency: 3,
    followUp: true
  },

  {
    id: 'pankreas_sorunu',
    keywords: [
      'pankreas ağrısı', 'pankreatit', 'göbek üstü ağrı sırta vuruyor',
      'pankreas iltihabı', 'orta karın ağrısı sırta yayılan', 'pankreas',
      'yağlı dışkı', 'mide kuşak ağrısı', 'sırta batan sancı',
      'karın kemer ağrısı', 'karnım kuşak gibi',
      'hazımsızlık ve sırt ağrısı', 'mide üstü yanma',
      'çamaşır ipi ağrısı', 'hazımsızlık krizi', 'içim dışıma çıktı',
      'karnımda şiddetli sızı', 'sırta geçen sancı', 'mide krampları',
      'ağır yemek sonrası ağrı', 'karın kuşağı'
    ],
    keywords_en: [
      'pancreatic pain', 'mid-back pain', 'epigastric discomfort',
      'band-like abdominal pain', 'referred back pain',
      'upper belly ache', 'pain radiating to back', 'acute pancreatitis',
      'digestive system flare-up', 'girdle pain', 'stomach belt pain',
      'pancreas inflammation', 'pain after fatty food',
      'severe core pain'
    ],
    departments: { gastroenteroloji: 0.5, genel_cerrahi: 0.35, dahiliye: 0.15 },
    region: 'karın',
    urgency: 7,
    followUp: true
  },

  {
    id: 'crohn_kolit',
    keywords: [
      'crohn', 'ülseratif kolit', 'inflamatuvar barsak',
      'kronik ishal kan', 'barsak iltihabı', 'kanlı ishal tekrarlayan',
      'ibd', 'barsak hastalığı kronik', 'bağırsak yarası',
      'bağırsak çürümesi', 'sık ishal', 'bağırsak kanaması',
      'bitmek bilmeyen ishal', 'karın düğümlenmesi',
      'makattan kan gelmesi', 'bağırsak tutulması',
      'kronik bağırsak sancısı', 'kanlı dışkılama', 'sulu kanlı dışkı',
      'bağırsaklarda yara açılması', 'sürekli bağırsak ağrısı'
    ],
    keywords_en: [
      'bloody diarrhea', 'gut inflammation', 'ulcerative bowel',
      'chronic loose stools', 'bowel flare up', 'rectal bleeding',
      'inflamed colon', 'frequent bathroom visits', 'intestinal ulcers',
      'abdominal cramping', 'bowel disease', 'bloody stool',
      'chronic colitis'
    ],
    departments: { gastroenteroloji: 0.85, dahiliye: 0.15 },
    region: 'karın',
    urgency: 6,
    followUp: true
  },

  {
    id: 'yutma_agrisi',
    keywords: [
      'yutarken ağrı', 'boğazda takılma hissi', 'yemek geçmiyor',
      'özofajit', 'yemek borusu ağrısı', 'odynofaji',
      'yutunca göğsüm ağrıyor', 'lokma geçmiyor', 'boğazım acıyor',
      'yutkunurken batma', 'boğazımda bir şey var', 'yutamıyorum',
      'lokma boğazımda kalıyor', 'yutkununca canım yanıyor',
      'boğazda düğümlenme', 'yutkunmak zor geliyor',
      'boğazımda yara var sanki', 'gırtlağım acıyor',
      'yutkunurken sızlıyor', 'su içerken bile acıyor'
    ],
    keywords_en: [
      'painful swallowing', 'sore throat', 'difficulty swallowing',
      'lump in throat', 'hurts to swallow', 'feeling of blockage',
      'choking sensation', 'odynophagia', 'throat feels raw',
      'stabbing throat pain', 'swallowing discomfort'
    ],
    departments: { gastroenteroloji: 0.5, kbb: 0.3, dahiliye: 0.2 },
    region: 'karın',
    urgency: 5,
    followUp: true
  },

  // ═══════════════════════════════════
  // NÖROLOJİ (genişletme)
  // ═══════════════════════════════════

  {
    id: 'inme_belirtisi',
    keywords: [
      'yüzüm düştü', 'kolum tutmuyor', 'konuşamıyorum aniden',
      'ani güçsüzlük tek taraf', 'inme belirtisi', 'felç şüphesi',
      'fast testi', 'yüz asimetri ani', 'ağzım kaydı', 'dilim dolandı',
      'vücudumun yarısı boşaldı', 'tek tarafım uyuştu',
      'kelimeler ağzımdan çıkmıyor', 'gözüm seyirdi kaydı',
      'sağ tarafım felç oldu', 'elim ayağım boşaldı',
      'konuşmam peltekleşti', 'aniden dengemi kaybettim', 'yüzüm yamuldu',
      'tek tarafım tutmuyor', 'lafı geveliyorum', 'kaldıramıyorum kolumu',
      'vücudum çekildi'
    ],
    keywords_en: [
      'face drooping', 'slurred speech', 'sudden numbness',
      'arm weakness', 'facial paralysis', 'one-sided weakness',
      'trouble speaking', 'stroke symptoms', 'sudden confusion',
      'blurred vision', 'loss of balance', 'FAST sign',
      'facial asymmetry', 'brain attack'
    ],
    departments: { noroloji: 0.9, dahiliye: 0.1 },
    region: 'baş',
    urgency: 10,
    followUp: false
  },

  {
    id: 'konusma_bozuklugu',
    keywords: [
      'konuşamıyorum', 'konuşmam bozuldu', 'kelime bulamıyorum', 'afazi',
      'dil dolaşıyor', 'anlaşılmaz konuşma', 'konuşurken takılıyorum',
      'sözcük çıkmıyor', 'dilim dönmüyor', 'ağzım laf yapmıyor',
      'peltek konuşuyorum', 'lal oldum', 'sözcükler ağzımdan çıkmıyor',
      'ağzımda geveliyorum', 'söyleyemiyorum', 'dilim tutuldu',
      'kelimeleri yutuyorum', 'ağzım eğildi', 'bozuk konuşuyorum',
      'lafı toparlayamıyorum', 'dilim sürçüyor'
    ],
    keywords_en: [
      'slurred speech', 'trouble speaking', 'tongue tied', 'mumbling',
      'speech difficulty', 'incoherent speech', 'stumbling over words',
      'garbled speech', 'difficulty articulating', 'loss of speech',
      'dysarthria'
    ],
    departments: { noroloji: 0.85, kbb: 0.15 },
    region: 'baş',
    urgency: 8,
    followUp: false
  },

  {
    id: 'hafiza_sorunu',
    keywords: [
      'hafıza sorunu', 'unutkanlık', 'alzheimer', 'demans',
      'her şeyi unutuyorum', 'kısa süreli bellek kaybı',
      'nerede olduğumu unutuyorum', 'hafızam gidiyor',
      'aklım gidip geliyor', 'kafam çok bulanık', 'balık hafızalıyım',
      'bir dediğimi unutuyorum', 'aklımda tutamıyorum',
      'aklımı yitiriyorum sanki', 'bunalama girdim', 'hafızam zayıfladı',
      'dediklerimi hatırlayamıyorum', 'aklım yerinde değil',
      'isimleri çıkaramıyorum', 'başladığım işi unutuyorum',
      'hafızam durdu', 'aklıma gelmiyor'
    ],
    keywords_en: [
      'memory loss', 'brain fog', 'forgetful', 'memory lapses',
      'slipping mind', 'losing my train of thought', 'mental confusion',
      'failing memory', 'memory gaps', 'short-term memory issues',
      'forgetting names', 'senior moments', 'blanking out'
    ],
    departments: { noroloji: 0.7, psikiyatri: 0.2, dahiliye: 0.1 },
    region: 'baş',
    urgency: 5,
    followUp: true
  },

  {
    id: 'ms_belirtisi',
    keywords: [
      'multipl skleroz', 'ms hastalığı', 'elektrik çarpması hissi',
      'görme kaybı ve uyuşma', 'denge sorunu güçsüzlük',
      'aralıklı uyuşma güçsüzlük', 'lhermitte belirtisi',
      'sinir tutulması', 'vücudum karıncalanıyor', 'beyin yorgunluğu',
      'ayaklarımda keçeleşme', 'yürürken kayma', 'elektriklenme',
      'çift görme atakları', 'kolum boşalıyor', 'sinir sistemi hastalığı',
      'vücut uyuşması', 'kaslarım çekiliyor', 'titreme nöbetleri',
      'göz perdelenmesi', 'yürüme güçlüğü'
    ],
    keywords_en: [
      'multiple sclerosis', 'MS disease', 'tingling sensation',
      'numbness and tingling', 'myelin damage', 'vision problems',
      'balance issues', 'muscle weakness', 'pins and needles',
      'nerve pain', 'ms flare-up', 'chronic fatigue',
      'demyelinating disease'
    ],
    departments: { noroloji: 0.95, dahiliye: 0.05 },
    region: 'genel',
    urgency: 7,
    followUp: true
  },

  {
    id: 'parkinson_belirtisi',
    keywords: [
      'parkinson', 'yavaş hareket', 'rijidite', 'kasılma yürüme güçlüğü',
      'maske yüz', 'adımlar küçülüyor', 'denge kaybı düşme',
      'istirahat tremoru', 'titreme', 'el ayak titremesi',
      'hareketlerde tutukluk', 'donup kalma', 'vücut katılığı',
      'kısa adımlarla yürüme', 'yürürken ayak sürçmesi',
      'yüzde donuk ifade', 'hareketlerde hantallık', 'düğme ilikleyememe',
      'yazı yazarken zorlanma', 'beden kilitlenmesi',
      'yavaşlamış hareketler', 'sallanarak yürüme', 'yerden kalkamama'
    ],
    keywords_en: [
      'shaking hands', 'tremors', 'stiff muscles', 'freezing up',
      'shuffling gait', 'slow movement', 'masked face', 'resting tremor',
      'muscle rigidity', 'difficulty buttoning shirts', 'bradykinesia',
      'balance issues', 'postural instability', 'stiffness',
      'slowed physical movement'
    ],
    departments: { noroloji: 0.95, dahiliye: 0.05 },
    region: 'genel',
    urgency: 6,
    followUp: true
  },

  {
    id: 'siddetli_bas_agrisi',
    keywords: [
      'hayatımın en kötü baş ağrısı', 'aniden gelen şiddetli baş ağrısı',
      'başım patlar gibi', 'ense sertliği baş ağrısı ateş',
      'subaraknoid kanama', 'thunderclap headache',
      'baş ağrısı kusma ateş', 'beynim zonkluyor', 'kafam ikiye ayrılıyor',
      'gözlerim yerinden çıkacak', 'şakaklarım sızlıyor', 'başım çatlıyor',
      'beyin sızlaması', 'kafa içi baskı', 'kafamın içi yanıyor',
      'alın ağrısından duramıyorum', 'başım ağırıyor',
      'kafama çivi çakılıyor', 'beynim uyuştu', 'ensesine vuran ağrı',
      'kafa sancısı'
    ],
    keywords_en: [
      'worst headache ever', 'splitting headache', 'throbbing head',
      'brain freeze', 'pounding headache', 'intense head pain',
      'migraine attack', 'severe cranial pressure', 'head feels heavy',
      'blinding headache', 'excruciating head pain',
      'sharp head stabbing', 'skull crushing pain'
    ],
    departments: { noroloji: 0.7, dahiliye: 0.2, genel_cerrahi: 0.1 },
    region: 'baş',
    urgency: 10,
    followUp: false
  },

  {
    id: 'periferik_noropati',
    keywords: [
      'nöropati', 'periferik nöropati', 'ellerde ayaklarda yanma',
      'eldiven çorap hissi', 'uyuşma yanma birlikte', 'diyabetik nöropati',
      'sinir hasarı', 'ayaklarda karıncalanma', 'iğne batması hissi',
      'elektrik çarpması gibi', 'ayaklarda keçeleşme',
      'el ayak karıncalanması', 'sızı sızı sızlama', 'ayak altı yanması',
      'sinirlerde elektriklenme', 'parmak uçlarında uyuşukluk',
      'ayaklarda sızlama', 'el ve ayakta karıncalanma',
      'sinir uçlarında zonklama', 'hissizlik ve karıncalanma',
      'el ayak sızlaması', 'sinirlerde çekilme'
    ],
    keywords_en: [
      'pins and needles', 'tingling sensation',
      'numbness in extremities', 'nerve pain', 'burning feet',
      'nerve damage', 'prickling sensation', 'shooting pains',
      'numb feet', 'electric shock feeling', 'diabetic nerve pain',
      'peripheral nerve trouble', 'foot numbness', 'sensory loss',
      'burning nerve pain'
    ],
    departments: { noroloji: 0.6, dahiliye: 0.25, endokrinoloji: 0.15 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },

  {
    id: 'migren_aura',
    keywords: [
      'migren aurası', 'baş ağrısından önce görme bozukluğu',
      'zigzag ışıklar', 'skotom', 'görme alanı daralma baş ağrısı',
      'aura migren', 'baş ağrısı öncesi ışıklar', 'göz önünde parlamalar',
      'göz kamaşması', 'göz kararması', 'ışık çakması',
      'görüşün bulanması', 'gözün önünde şimşekler', 'renkli halkalar',
      'gözün önünde perde', 'noktalar uçuşması', 'görüşün kaybolması',
      'tünel görüşü', 'gözde karıncalanma', 'yanıp sönen ışıklar',
      'gözde kıvılcımlar', 'görüntüde dalgalanma'
    ],
    keywords_en: [
      'visual aura', 'migraine with aura', 'seeing spots',
      'flashing lights', 'visual disturbance', 'blind spots',
      'shimmering lights', 'aura symptoms', 'scintillating scotoma',
      'blurred vision', 'visual distortion', 'seeing stars',
      'kaleidoscope vision', 'light flashes', 'aura phase'
    ],
    departments: { noroloji: 0.85, goz: 0.15 },
    region: 'baş',
    urgency: 5,
    followUp: false
  },
  // ═══════════════════════════════════════════════════════
  // YENİ SEMPTOMLAR — KARDİYOLOJİ + DAHİLİYE GENİŞLETME
  // symptom-db.js içinde SYMPTOM_DATABASE dizisinin sonuna ekle.
  // ═══════════════════════════════════════════════════════

  // ═══════════════════════════════════
  // KARDİYOLOJİ (genişletme)
  // ═══════════════════════════════════

  {
    id: 'tansiyon_krizi',
    keywords: [
      'tansiyonum çok yüksek', 'tansiyon krizi', 'hipertansiyon krizi',
      '180 tansiyon', '200 tansiyon', 'tansiyonum fırladı',
      'baş ağrısı yüksek tansiyon', 'ense ağrısı tansiyon',
      'tansiyonum tavan yaptı', 'tansiyonum tepeleme oldu',
      'damarlarım çatlayacak', 'tansiyonum azdı', 'tansiyonum oynadı',
      'tansiyonum zıpladı', 'ense köküm zonkluyor',
      'tansiyonum başıma vurdu', 'tansiyonum tavan', 'kıpkırmızı oldum',
      'tansiyonum çıktı', 'başım basınç yapıyor',
      'tansiyonum tavana vurdu', 'şakaklarım patlayacak'
    ],
    keywords_en: [
      'blood pressure spike', 'hypertensive crisis', 'my BP is sky-high',
      'blood pressure surge', 'hypertensive emergency',
      'BP through the roof', 'severe hypertension', 'my BP is soaring',
      'dangerous blood pressure', 'extreme blood pressure',
      'BP hit the ceiling', 'hypertensive urgency'
    ],
    departments: { kardiyoloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 8,
    followUp: false
  },

  {
    id: 'kalp_yetmezligi',
    keywords: [
      'kalp yetmezliği', 'nefes darlığı yatarken', 'gece nefes açıyorum',
      'bacak şişliği nefes darlığı', 'ortopne',
      'kalp yetmezliği belirtisi', 'yatar pozisyonda nefes alamıyorum',
      'kalbim su topladı', 'yastıksız yatamıyorum', 'gece boğulma hissi',
      'ayaklarım davul gibi', 'çabuk yoruluyorum', 'göğsümde ağırlık var',
      'kalbim yetmiyor', 'merdiven çıkınca tıkandım',
      'sırt üstü yatamıyorum', 'nefesim yetmiyor', 'çarpıntım çok oluyor',
      'oturarak uyuyorum', 'bacaklarımda ödem var', 'kalbim çok yorgun'
    ],
    keywords_en: [
      'heart failure', 'shortness of breath', 'fluid retention',
      'swollen ankles', 'orthopnea', 'cannot lie flat',
      'feeling breathless', 'heart is weak', 'difficulty breathing',
      'sleeping propped up', 'congestion', 'heart fatigue', 'edema'
    ],
    departments: { kardiyoloji: 0.8, dahiliye: 0.15, gogus: 0.05 },
    region: 'göğüs',
    urgency: 8,
    followUp: true
  },

  {
    id: 'aritmi',
    keywords: [
      'düzensiz kalp atışı', 'atrial fibrilasyon', 'aritmi',
      'kalbim düzensiz çarpıyor', 'nabzım düzensiz', 'kalp atlıyor',
      'ritim bozukluğu', 'kalp vuruşu atlıyor', 'kalbim tekliyor',
      'göğsümde kuş çırpınıyor', 'kalp ritmim şaştı',
      'kalbim sökülüyor gibi', 'kalp takılıyor', 'göğsümde boşluk oluyor',
      'kalbim düzensiz vuruyor', 'içim cız ediyor', 'kalbim es veriyor',
      'ritmim karıştı', 'kalbim boşa düşüyor', 'yüreğim düzensiz atıyor'
    ],
    keywords_en: [
      'heart skipping a beat', 'palpitations', 'irregular heartbeat',
      'heart fluttering', 'racing heart', 'heart arrhythmia',
      'missed heartbeats', 'thumping in chest', 'heart rhythm disorder',
      'heart acting up', 'skipped beats', 'heart pounding'
    ],
    departments: { kardiyoloji: 0.9, dahiliye: 0.1 },
    region: 'göğüs',
    urgency: 7,
    followUp: true
  },

  {
    id: 'periferik_damar',
    keywords: [
      'bacakta ağrı yürüyünce', 'yürüyünce bacak ağrısı durunca geçiyor',
      'kladikasyon', 'damar tıkanıklığı bacak', 'periferik arter',
      'ayak soğukluğu uyuşma', 'damar hastalığı bacak',
      'bacakta kramp giriyor', 'yürürken bacak kilitleniyor',
      'baldırda kasılma', 'bacakta damar sertliği',
      'ayak parmağında morarma', 'yürüdükçe bacak sızlıyor',
      'bacakta çekilme hissi', 'ayaklarda nabız alamıyorum',
      'bacakta damar düğümlenmesi', 'yürüyünce bacak ağırlaşıyor',
      'ayaklarım buz kesiyor', 'bacakta karıncalanma',
      'yolda durup dinleniyorum', 'bacakta damar tıkanması',
      'ayaklarda üşüme hissi'
    ],
    keywords_en: [
      'leg cramps', 'claudication', 'poor circulation',
      'leg pain while walking', 'peripheral artery disease', 'cold feet',
      'pain in calves', 'vascular insufficiency', 'heavy legs',
      'numbness in feet', 'arterial blockage', 'leg fatigue',
      'walking pain', 'PAD', 'restless legs'
    ],
    departments: { kardiyoloji: 0.5, genel_cerrahi: 0.4, dahiliye: 0.1 },
    region: 'bacak',
    urgency: 6,
    followUp: true
  },

  {
    id: 'derin_ven_trombozu',
    keywords: [
      'derin ven trombozu', 'dvt', 'bacakta pıhtı',
      'tek bacak şişliği ağrı', 'baldır ağrısı şişlik', 'tromboemboli',
      'pıhtı bacak', 'uçak yolculuğu sonrası bacak şişliği',
      'bacakta damar tıkanıklığı', 'bacakta şişme ve morarma',
      'baldırlarda zonklama', 'bacakta ağırlaşma hissi', 'bacakta sertlik',
      'yürürken bacak krampları', 'bacakta damar pıhtısı',
      'baldırda sıcaklık artışı', 'tek bacakta gerginlik',
      'damar içi pıhtılaşma', 'bacakta kramp hissi',
      'bacaktaki şişlik ve ağrı', 'bacakta huzursuzluk',
      'bacakta kan göllenmesi'
    ],
    keywords_en: [
      'deep vein thrombosis', 'blood clot in leg', 'DVT', 'leg swelling',
      'leg pain and swelling', 'calf pain', 'thrombosis', 'blood clot',
      'deep vein blood clot', 'leg tenderness', 'venous thromboembolism',
      'swollen calf', 'leg warmth and redness', 'clotting in the vein'
    ],
    departments: { kardiyoloji: 0.4, genel_cerrahi: 0.4, dahiliye: 0.2 },
    region: 'bacak',
    urgency: 8,
    followUp: false
  },

  {
    id: 'anevrizma_belirti',
    keywords: [
      'aort anevrizma', 'karında nabız hissediyorum',
      'sırta vuran karın ağrısı', 'yırtıcı göğüs ağrısı',
      'aort diseksiyonu', 'göğüs omurga ağrısı ani',
      'karnımda atan bir şey var', 'göğsümde yırtılma hissi',
      'küt küt atan karın', 'sırtıma saplanan bıçak', 'damar genişlemesi',
      'karın bölgemde atış', 'göğsümden sırtıma yayılan acı',
      'damar balonlaşması', 'şiddetli iç ağrı', 'göğsümde zonklama',
      'karında ele gelen kitle', 'kalp atışını karında duymak',
      'ani göğüs sıkışması', 'içimde bir şey patladı',
      'karnımda nabız atıyor'
    ],
    keywords_en: [
      'throbbing abdominal sensation', 'tearing chest pain',
      'pulsating abdomen', 'aortic ballooning', 'ripping sensation',
      'abdominal aneurysm', 'chest wall throbbing', 'sharp back pain',
      'feeling a pulse in stomach', 'sudden chest tearing',
      'bulging vessel', 'abdominal pulse', 'intense tearing pain',
      'aortic bulge', 'rupture sensation'
    ],
    departments: { kardiyoloji: 0.5, genel_cerrahi: 0.4, dahiliye: 0.1 },
    region: 'göğüs',
    urgency: 10,
    followUp: false
  },

  // ═══════════════════════════════════
  // DAHİLİYE — ENFEKSİYON / HEMATOLOJİ
  // ═══════════════════════════════════

  {
    id: 'anemi',
    keywords: [
      'kansızlık', 'anemi', 'solgunluk', 'soluk görünüyorum',
      'demir eksikliği', 'hemoglobin düşük', 'kırmızı kan hücresi az',
      'çabuk yorulma solgunluk', 'kanım çekilmiş gibi',
      'yüzümde renk kalmadı', 'sürekli halsizim', 'kan değerlerim düşük',
      'tenim bembeyaz oldu', 'çabuk nefes nefese kalıyorum',
      'vitamnim eksik', 'kan yapıcı ilaç kullanıyorum',
      'göz altlarım morardı', 'başım sürekli dönüyor', 'kanım tutmuyor',
      'çabuk çarpıntım oluyor'
    ],
    keywords_en: [
      'low iron', 'feeling washed out', 'pale skin', 'low blood count',
      'always exhausted', 'feeling lightheaded', 'anaemic',
      'short of breath', 'dizzy spells', 'running on empty', 'pallor',
      'iron deficiency'
    ],
    departments: { dahiliye: 0.6, hematoloji: 0.2, aile_hekimi: 0.2 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'enfeksiyon_genel',
    keywords: [
      'enfeksiyon', 'iltihaplanma', 'mikrop kaptım', 'ateş titreme',
      'üşüme titreme ateş', 'grip belirtileri',
      'ateş halsizlik kas ağrısı', 'viral enfeksiyon', 'vücudum kırgın',
      'yatağa düştüm', 'canım çıkıyor', 'kemiklerim sızlıyor',
      'salgın hastalık', 'vücudum dökülüyor', 'soğuk algınlığı',
      'fena çarptı', 'yatak döşek yattım', 'içim dışıma çıktı',
      'bağışıklığım çöktü', 'kırgınlık var', 'üst üste üşüyorum'
    ],
    keywords_en: [
      'feeling under the weather', 'caught a bug', 'feeling run down',
      'feverish', 'chills and aches', 'coming down with something',
      'systemic infection', 'body malaise', 'feeling wiped out',
      'fighting off something', 'flu-like symptoms', 'fever spike',
      'feeling feverish'
    ],
    departments: { dahiliye: 0.4, aile_hekimi: 0.4, gogus: 0.2 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'bagisiklik_sorunu',
    keywords: [
      'bağışıklık sistemi zayıf', 'sürekli hasta oluyorum',
      'immün yetmezlik', 'tekrarlayan enfeksiyon', 'lupus',
      'otoimmün hastalık', 'romatoid artrit', 'sistemik hastalık',
      'direncim çok düşük', 'vücudum hemen çöküyor',
      'iki yakam bir araya gelmiyor', 'tuzlu suyla bile hastalanıyorum',
      'vücudum dirençsiz', 'sürekli yorgun düşüyorum',
      'savunmasız hissediyorum', 'çabuk hasta oluyorum', 'bünyem zayıf',
      'kış boyunca yatak döşek', 'vücut direncim kırık',
      'kolay hastalanıyorum', 'bir türlü toparlayamıyorum',
      'vücudum savaşamıyor'
    ],
    keywords_en: [
      'weak immune system', 'always catching colds', 'low resistance',
      'frequent infections', 'autoimmune issues', 'always getting sick',
      'compromised immunity', 'run down', 'poor body defense',
      'constant health problems', 'prone to sickness',
      'my immune system is shot', 'frequently ill', 'low immunity'
    ],
    departments: { dahiliye: 0.6, romatoloji: 0.3, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'tiroid_hipo_hiper',
    keywords: [
      'tiroid sorunu', 'hipotiroid', 'hipertiroid', 'tiroit',
      'tiroid hormonu', 'tsh yüksek', 'tsh düşük',
      'soğuğa dayanamıyorum tiroid', 'çok terliyorum tiroid', 'guatr',
      'boğazda şişlik', 'metabolizmam yavaş', 'zehirli guatr',
      'çabuk yoruluyorum', 'kilo veremiyorum', 'gözlerim pörtledi',
      'boynumda yumru', 'metabolizmam hızlı', 'sürekli üşüyorum',
      'ellerim titriyor', 'boğazım düğümleniyor', 'iyot eksikliği',
      'tiroid bezi tembelliği', 'kalbim yerinden çıkacak'
    ],
    keywords_en: [
      'underactive thyroid', 'overactive thyroid', 'goiter',
      'thyroid lump', 'sluggish metabolism', 'thyroid storm',
      'my metabolism is fast', 'feeling cold all the time',
      'racing heart', 'thyroid trouble', 'swollen neck', 'hypo', 'hyper',
      'thyroid dysfunction', 'fatigue from thyroid'
    ],
    departments: { endokrinoloji: 0.75, dahiliye: 0.2, aile_hekimi: 0.05 },
    region: 'genel',
    urgency: 4,
    followUp: true
  },

  {
    id: 'gece_terleme',
    keywords: [
      'gece terlemesi', 'geceleri terliyorum', 'gece aşırı terleme',
      'uyurken terliyorum', 'sabah yatakta ter', 'nokturnal diyaforez',
      'sırılsıklam uyanmak', 'yatak sırılsıklam oluyor', 'gece basan ter',
      'üstüm başım sırılsıklam', 'yastığım su içinde', 'gece içim yanıyor',
      'terden sırılsıklam kalkmak', 'gece yatak ıslanması',
      'uykuda ter basması', 'gece ter boşalması', 'çarşaflar ıslanıyor',
      'gece ateş basması', 'ter içinde uyanmak',
      'gece vücudumun terlemesi'
    ],
    keywords_en: [
      'night sweats', 'waking up drenched', 'sweating through sheets',
      'soaking the bed', 'waking up soaked', 'nocturnal sweating',
      'sweaty sleep', 'drenched in sweat', 'sweating at night',
      'nighttime perspiration', 'waking up in a sweat',
      'heavy night sweat', 'soaking pajamas', 'sweat-soaked bed'
    ],
    departments: { dahiliye: 0.4, endokrinoloji: 0.3, gogus: 0.2, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  {
    id: 'kas_agrisi_genel',
    keywords: [
      'kas ağrısı', 'tüm vücudum ağrıyor', 'miyalji', 'kas sızısı',
      'fibromiyalji', 'vücut ağrısı', 'kas tutulması genel', 'yaygın ağrı',
      'etim dökülüyor', 'vücudum kırılıyor', 'her yerim sızlıyor',
      'kaslarım çekiliyor', 'bütün kemiklerim sızlıyor',
      'vücut kırgınlığı', 'kaslarım zonkluyor', 'dayak yemiş gibiyim',
      'üzerimden tır geçmiş gibi', 'vücudum dökülüyor',
      'kaslarım kasılıyor', 'tüm vücudum sızlıyor', 'eklem ve kas ağrısı',
      'vücut hamlığı'
    ],
    keywords_en: [
      'body aches', 'muscle soreness', 'aching all over', 'myalgia',
      'body feels bruised', 'muscle stiffness', 'full body pain',
      'feeling achy', 'muscle fatigue', 'general body pain',
      'tender muscles', 'body soreness', 'musculoskeletal pain',
      'aching muscles'
    ],
    departments: { dahiliye: 0.4, fizik_tedavi: 0.3, romatoloji: 0.2, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 3,
    followUp: true
  },

  {
    id: 'susuzluk_cok_idrar',
    keywords: [
      'çok su içiyorum', 'aşırı susuzluk', 'polidipsi', 'poliüri',
      'hem çok içiyor hem çok idrar yapıyorum', 'diyabet belirtisi',
      'gece çok su içiyorum', 'ağzım kupkuru', 'dilim damağım kuruyor',
      'sudan çıkmıyorum', 'sürekli çişim geliyor',
      'günde kaç kere tuvalet', 'suyu su gibi içiyorum',
      'gece idrara kalkıyorum', 'boğazım hiç kurumuyor',
      'durmadan tuvalete gidiyorum', 'idrarım bitmek bilmiyor',
      'ağız kuruluğu yaşıyorum', 'su içsem yarıyor',
      'sık sık çişim geliyor', 'tuvaletle akraba oldum'
    ],
    keywords_en: [
      'excessive thirst', 'frequent urination', 'always thirsty',
      'constant peeing', 'dry mouth', 'polyuria', 'polydipsia',
      'peeing all night', 'unquenchable thirst',
      'increased urine output', 'always need the bathroom',
      'dehydration symptoms', 'excessive fluid intake'
    ],
    departments: { endokrinoloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'genel',
    urgency: 5,
    followUp: true
  },

  // ═══════════════════════════════════
  // DERMATOLOJİ
  // ═══════════════════════════════════

  {
    id: 'cilt_kasinti',
    keywords: [
      'kaşıntı', 'cilt kaşıntısı', 'derim kaşınıyor', 'kaşınıyorum',
      'vücudum kaşınıyor', 'prurit', 'deride kaşıntı',
      'tüm vücudum kaşınıyor', 'uyuz gibi kaşınmak', 'kaşıntı tuttu',
      'cildim pıtır pıtır', 'tenim zonkluyor', 'derim rahat durmuyor',
      'kudurmuş gibi kaşınıyorum', 'vücudumda karıncalanma var',
      'pütür pütür kaşıntı', 'cildim fena kaşınıyor',
      'kaşıntıdan yerimde duramıyorum', 'derim yanıyor ve kaşınıyor',
      'her yerim kabardı kaşınıyor', 'cildim pul pul kaşınıyor'
    ],
    keywords_en: [
      'itchy skin', 'feeling itchy', 'skin irritation', 'pruritus',
      'my skin is crawling', 'constant itching', 'intense skin itch',
      'allergic itch', 'dry itchy skin', 'unbearable itching',
      'skin keeps itching', 'itchy patches', 'hives and itching',
      'prickly skin'
    ],
    departments: { dermatoloji: 0.65, dahiliye: 0.2, aile_hekimi: 0.15 },
    region: 'cilt',
    urgency: 3,
    followUp: true
  },

  {
    id: 'cilt_dokuntu',
    keywords: [
      'döküntü', 'cilt döküntüsü', 'deride döküntü', 'kızarık lekeler',
      'vücudumda döküntü', 'kızarıklık ve döküntü', 'istiridye',
      'lezyonlar', 'kabarcıklar', 'pütür pütür olma', 'kurdeşen',
      'benek benek olma', 'kaşıntılı kızarıklık', 'ciltte pütürler',
      'yara bere', 'ciltte kabarma', 'su toplaması', 'ürtiker',
      'deride pıtırcıklar', 'kızamık gibi dökülme',
      'ciltte çıkan kabartılar', 'deri dökülmesi'
    ],
    keywords_en: [
      'skin rash', 'breakout', 'skin irritation', 'bumps on skin',
      'hives', 'skin blotches', 'red patches', 'skin eruption',
      'skin lesions', 'itchy spots', 'skin flare-up', 'bumpy skin',
      'dermatitis', 'skin redness'
    ],
    departments: { dermatoloji: 0.7, dahiliye: 0.2, aile_hekimi: 0.1 },
    region: 'cilt',
    urgency: 4,
    followUp: true
  },

  {
    id: 'urtiker',
    keywords: [
      'kurdeşen', 'ürtiker', 'kabarık kızarıklık', 'kaşınan şişlikler',
      'deride kabarcıklar', 'yer değiştiren kızarıklık',
      'allerjik kabarma', 'sinek ısırığı gibi', 'ciltte kabartılar',
      'vücudun su toplaması', 'deride döküntü', 'sıcak döküntüsü',
      'alaca bulaca kabarıklık', 'et benleri gibi şişlik',
      'vücutta harita gibi kızarıklık', 'ciltte pütürlenme',
      'yayılan kaşıntılı lekeler', 'cildin kabarması',
      'beyaz beyaz şişlikler', 'ciltte yama şeklinde kızarıklık'
    ],
    keywords_en: [
      'hives', 'welts', 'skin wheals', 'allergic rash', 'itchy bumps',
      'nettle rash', 'hive breakout', 'raised skin patches', 'urticaria',
      'itchy red blotches', 'skin flares', 'hive reaction'
    ],
    departments: { dermatoloji: 0.6, dahiliye: 0.3, aile_hekimi: 0.1 },
    region: 'cilt',
    urgency: 5,
    followUp: true
  },

  {
    id: 'egzama',
    keywords: [
      'egzama', 'ekzema', 'atopik dermatit', 'deride pullanma',
      'kuru kaşıntılı cilt', 'derim pullanıyor',
      'çatlak ve kaşıntılı deri', 'ciltte kızarıklık', 'kaşıntı tutması',
      'deride döküntü', 'ciltte su toplanması', 'yara gibi kaşıntı',
      'cilt egzaması', 'alerjik kaşıntı', 'tenimde pütürler',
      'ciltte yara kabuğu', 'deri kızarması', 'el egzaması',
      'vücutta kızarık lekeler', 'ciltte kaşıntılı döküntü'
    ],
    keywords_en: [
      'skin rash', 'itchy patches', 'flaky skin', 'red inflamed skin',
      'skin irritation', 'dry itchy skin', 'scaly skin', 'dermatitis',
      'skin allergy', 'sore skin', 'eczematous rash', 'bumpy skin',
      'itchy flare-up'
    ],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'cilt',
    urgency: 3,
    followUp: false
  },

  {
    id: 'sedef_hastaligi',
    keywords: [
      'sedef', 'sedef hastalığı', 'psoriasis', 'pullu plaklar',
      'gümüşi pullanma', 'deride kalın pullar', 'dirsekte pullanma',
      'ciltte kabuklanma', 'deri döküntüsü', 'pul pul deri',
      'kırmızı lekeler', 'ciltte yara izi', 'kurdeşen benzeri',
      'deride katmanlaşma', 'inadına çıkan yaralar',
      'kaşıntılı sert plaklar', 'sedef yaraları', 'derideki beyaz tabaka',
      'geçmeyen cilt kızarıklığı', 'pullanma hastalığı'
    ],
    keywords_en: [
      'psoriasis', 'scaly patches', 'silver scales', 'skin plaques',
      'flaky skin', 'psoriatic skin', 'red skin patches',
      'skin build-up', 'itchy skin lesions', 'crusty skin',
      'psoriasis flare-up', 'dry scaly skin',
      'autoimmune skin condition'
    ],
    departments: { dermatoloji: 0.9, dahiliye: 0.1 },
    region: 'cilt',
    urgency: 3,
    followUp: false
  },

  {
    id: 'sivilce_akne',
    keywords: [
      'sivilce', 'akne', 'yüzde sivilce', 'iltihaplı sivilce',
      'kistik akne', 'sırtımda sivilce', 'sivilcelerim çıkıyor',
      'akne sorunu', 'cilt pütürleri', 'yüzümde kabarcıklar',
      'ergenlik sivilcesi', 'çıban gibi sivilce', 'beyaz uçlu sivilce',
      'siyah noktalar', 'yüzümde kızarıklıklar', 'cilt lekeleri',
      'aknelerim patladı', 'yüzümde pürüzler', 'cilt döküntüsü',
      'irinli kabarcık', 'yağ bezeleri', 'gözenek dolması'
    ],
    keywords_en: [
      'pimples', 'zits', 'breakouts', 'acne flare-up', 'skin bumps',
      'clogged pores', 'whiteheads', 'blackheads', 'facial blemishes',
      'cystic acne', 'spots', 'skin eruption', 'hormonal acne',
      'blemished skin'
    ],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'cilt',
    urgency: 2,
    followUp: false
  },

  {
    id: 'cilt_lekeleri',
    keywords: [
      'ciltte leke', 'kahverengi leke', 'deride leke', 'pigmentasyon',
      'koyu lekeler', 'yüzde leke', 'melazma', 'güneş lekesi',
      'ben değişimi', 'ciltte kararma', 'yüzde pütürler', 'doğum lekesi',
      'çiller', 'yüzdeki karartılar', 'yaşlılık lekeleri',
      'ciltte renk değişimi', 'yüzde çillenme', 'sivilce izi',
      'ciltte alacalı yapı', 'yüzde kızıl lekeler', 'deride ton farkı',
      'güneş yanığı izi', 'ciltte gölge gibi', 'yüzde siyah noktalar'
    ],
    keywords_en: [
      'skin discoloration', 'dark spots', 'freckles',
      'hyperpigmentation', 'age spots', 'sun spots', 'skin blotches',
      'birthmark', 'patchy skin', 'skin darkening', 'pigment patches',
      'liver spots', 'uneven skin tone', 'blemishes', 'melanin spots'
    ],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'cilt',
    urgency: 3,
    followUp: true
  },

  {
    id: 'ben_degisimi',
    keywords: [
      'benim rengi değişti', 'ben büyüdü', 'kanamayan ben',
      'şekil değiştiren ben', 'bende değişiklik', 'asimetrik ben',
      'büyüyen ben', 'renk değiştiren ben', 'benim kabardı',
      'benim yara oldu', 'benim karardı', 'benim kaşınıyor',
      'et beni büyüdü', 'benim patladı', 'benim etrafı kızardı',
      'benim çatladı', 'benim sızlıyor', 'beni değişik görünüyor',
      'eski beni bozuldu', 'benim üstü pütürlendi', 'benim kan topladı',
      'benim kenarı bozuk', 'rengi koyulaştı'
    ],
    keywords_en: [
      'mole changing', 'mole growth', 'mole looks weird',
      'evolving mole', 'itchy mole', 'mole border change',
      'darkening mole', 'bleeding mole', 'crusting mole',
      'mole shape shifting', 'irregular mole', 'mole getting bigger',
      'changing skin spot', 'scabby mole', 'mole discoloration'
    ],
    departments: { dermatoloji: 0.9, genel_cerrahi: 0.1 },
    region: 'cilt',
    urgency: 7,
    followUp: true
  },

  {
    id: 'cilt_yanik',
    keywords: [
      'yanık', 'güneş yanığı', 'cilt yanığı', 'yanık yara',
      'kızarık yanık', 'su kabarcığı yanık', 'deri yanığı', 'ısı yanığı',
      'cildim yandı', 'kızarıklık', 'acılı kızarıklık', 'yara yeri',
      'sıcak basması', 'cayır cayır yanıyor', 'derim soyuldu',
      'kızarık yara', 'ateş yanığı', 'haşlanma', 'su toplayan yer',
      'yanan bölge', 'tahriş olmuş deri'
    ],
    keywords_en: [
      'sunburn', 'skin burn', 'scalding', 'blister', 'red skin',
      'searing pain', 'first-degree burn', 'chemical burn',
      'skin irritation', 'raw skin', 'burned patch', 'heat rash',
      'tender skin'
    ],
    departments: { dermatoloji: 0.5, genel_cerrahi: 0.3, aile_hekimi: 0.2 },
    region: 'cilt',
    urgency: 6,
    followUp: true
  },

  {
    id: 'yara_iyilesmeme',
    keywords: [
      'yara iyileşmiyor', 'kapanmayan yara', 'uzun süren yara',
      'iltihaplı yara', 'yara akıntısı', 'enfekte yara', 'baskı yarası',
      'yara kabuk bağlamıyor', 'geçmek bilmeyen yara',
      'yaram bir türlü kurumadı', 'yara sulanıyor',
      'deri kendini onarmıyor', 'yara ağzı açık kaldı',
      'yara çürüyor sanki', 'iyileşme durdu', 'yara etini tutmuyor',
      'sürekli taze yara', 'yara kapanmıyor', 'yara yerinde oyuk var',
      'bir türlü kabuk atmadı'
    ],
    keywords_en: [
      'non-healing wound', 'persistent sore', 'weeping wound',
      'slow-healing ulcer', 'chronic wound', 'wound not knitting',
      'oozing sore', 'stubborn skin lesion', 'unhealed skin break',
      'open sore', 'ulcer refusing to heal', 'refractory wound'
    ],
    departments: { dermatoloji: 0.5, genel_cerrahi: 0.3, dahiliye: 0.2 },
    region: 'cilt',
    urgency: 6,
    followUp: true
  },

  {
    id: 'tirnak_sorunu',
    keywords: [
      'tırnak sorunu', 'tırnağım döküldü', 'mantar tırnak', 'onikomikoz',
      'tırnak içe batması', 'sarı tırnak', 'tırnak kırılıyor',
      'tırnak enfeksiyonu', 'tırnak ayrılması', 'tırnakta boşalma',
      'tırnak kararması', 'tırnak dibi şişmesi', 'tırnakta beyaz lekeler',
      'tırnak etrafı iltihabı', 'tırnak soyulması',
      'tırnakta şekil bozukluğu', 'tırnak kalınlaşması',
      'tırnak yatağı ağrısı', 'tırnakta kan oturması', 'tırnak düşmesi',
      'tırnakta oyulma', 'tırnak uzamaması', 'tırnakta çizgilenme'
    ],
    keywords_en: [
      'nail fungus', 'ingrown toenail', 'brittle nails',
      'nail bed infection', 'discolored nails', 'nail separation',
      'paronychia', 'thickened toenails', 'nail trauma',
      'subungual hematoma', 'nail splitting', 'nail pitting',
      'cracked nails', 'peeling nails', 'onycholysis'
    ],
    departments: { dermatoloji: 0.8, genel_cerrahi: 0.1, aile_hekimi: 0.1 },
    region: 'cilt',
    urgency: 3,
    followUp: false
  },

  {
    id: 'cilt_mantari',
    keywords: [
      'cilt mantarı', 'mantar enfeksiyonu', 'kasıkta mantar',
      'ayak mantarı', 'tinea', 'ringworm', 'halka şeklinde döküntü',
      'ayak parmakları arası mantar', 'mantar kapmak', 'ciltte kızarıklık',
      'kaşıntılı bölge', 'tenimde leke', 'ayak dibi kaşıntısı',
      'cildim soyuluyor', 'beyaz pul pul döküntü', 'geçmeyen kaşıntı',
      'tenimde kabuklanma', 'pişik gibi kızarıklık', 'bölgesel döküntü',
      'parmak arası yarası'
    ],
    keywords_en: [
      'jock itch', 'yeast infection', 'skin rash', 'itchy patches',
      'fungal infection', 'dermatophytosis', 'flaky skin', 'tinea pedis',
      'scaly skin', 'red itchy bumps', 'skin fungus'
    ],
    departments: { dermatoloji: 0.8, aile_hekimi: 0.2 },
    region: 'cilt',
    urgency: 3,
    followUp: false
  },

  {
    id: 'rozase',
    keywords: [
      'rozase', 'yüzde kızarıklık', 'yanaklarım kızarıyor',
      'yüz kızarması', 'kıl dipleri kızarık', 'burun kızarıklığı',
      'yüzüm sürekli kızarıyor', 'yüzde gül hastalığı',
      'yüzde damar belirginleşmesi', 'yüzümde al al lekeler',
      'ciltte yanma hissi', 'yüzümde sıcak basması',
      'yanaklarımda kılcal damarlar', 'yüzde döküntü',
      'güneşten yanan yüz', 'yüzde sivilce gibi kızarıklık',
      'ciltte pul pul dökülme', 'yüzümde kırmızı noktalar',
      'yüzdeki kılcal damar çatlaması', 'alerjik kızarıklık',
      'yüzüm ateş gibi'
    ],
    keywords_en: [
      'rosacea', 'red face', 'acne rosacea', 'flushed skin',
      'facial redness', 'spider veins on face', 'rosy cheeks',
      'stinging skin', 'persistent skin redness', 'broken capillaries',
      'burning sensation on face', 'sensitive red skin',
      'rosacea flare-up', 'visible blood vessels'
    ],
    departments: { dermatoloji: 0.85, aile_hekimi: 0.15 },
    region: 'cilt',
    urgency: 2,
    followUp: false
  },

  {
    id: 'vitiligo',
    keywords: [
      'vitiligo', 'ciltte beyaz leke', 'renk kaybı cilt',
      'deride beyazlama', 'pigment kaybı', 'beyaz yama cilt',
      'ala hastalığı', 'ciltte ağarma', 'derideki beyaz benekler',
      'yüzde beyazlık', 'tenin renginin atması', 'cilt alaca olması',
      'deride süt beyaz leke', 'ciltte renk açılması', 'ten rengi kaybı',
      'vücutta beyazlıklar', 'alaca hastalığı', 'ciltte lekelenme',
      'deri renginin solması'
    ],
    keywords_en: [
      'skin depigmentation', 'white patches on skin', 'leukoderma',
      'loss of skin color', 'skin whitening', 'uneven skin tone',
      'pigment loss', 'patchy skin', 'skin discoloration', 'white spots',
      'hypopigmentation', 'milky white skin patches'
    ],
    departments: { dermatoloji: 0.9, dahiliye: 0.1 },
    region: 'cilt',
    urgency: 2,
    followUp: false
  },

  {
    id: 'cilt_sisligi',
    keywords: [
      'deride şişlik', 'ciltte kabarma', 'apse', 'çıban', 'furunkül',
      'iltihaplı şişlik', 'cilt altı şişlik', 'lenf bezi şişliği cilt',
      'şiş', 'beze', 'yumru', 'kabartı', 'pırtlak', 'şişkinlik',
      'et benle karışık şişlik', 'sivilce gibi şiş', 'su toplayan şişlik',
      'topaklanma', 'boduç', 'ur', 'sert şişlik', 'şişen yer'
    ],
    keywords_en: [
      'lump', 'bump', 'swelling', 'puffy skin', 'nodule', 'cyst',
      'skin mass', 'raised area', 'welt', 'boil', 'abscess', 'pustule',
      'growth', 'inflammation'
    ],
    departments: { dermatoloji: 0.5, genel_cerrahi: 0.35, dahiliye: 0.15 },
    region: 'cilt',
    urgency: 5,
    followUp: true
  },
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
  'nefes': ['soluk', 'solunum'],
  'baş ağrısı': ['sefali', 'baş sızısı', 'migren', 'baş sancısı', 'kafa ağrısı', 'şakak ağrısı', 'zonklama'],
  'migren': ['damar atması', 'baş tutması', 'ağır baş'],
  'zonklayan ağrı': ['çakma yapan ağrı', 'damar atması'],
  'tek taraflı baş ağrısı': ['başın tek tarafı', 'yarım baş'],
  'baş dönmesi': ['sersemlik', 'vertigo', 'dengesizlik', 'yalpalama'],
  'bulanık': ['puslu', 'buğulu', 'silik', 'tüllü', 'dumanlı'],
  'görme': ['bakış', 'gözün seçmesi', 'odaklanma'],
  'kararma': ['göz kararması', 'baygınlık hissi', 'göz önünde şimşek çakması'],
  'görme kaybı': ['görüş yitimi', 'görememe durumu', 'körleşme'],
  'çift görme': ['ikileşme', 'görüntü kayması', 'göz ayrılması'],
  'göz': ['göz yuvarı', 'göz çevresi'],
  'çapaklanma': ['irin', 'iltihap', 'göz akıntısı'],
  'işitme': ['duyma', 'işiti', 'işitme yetisi'],
  'kayıp': ['azalma', 'zayıflama', 'yitimi', 'körelme'],
  'çınlama': ['uğultu', 'çınlayış', 'vınlama', 'ötüş'],
  'tinnitus': ['kulak çınlaması', 'kulak uğultusu'],
  'burun tıkanıklığı': ['geniz tıkanıklığı', 'nazal tıkanıklık', 'burun tutukluğu'],
  'burun akıntısı': ['nezle', 'rinit', 'burun şıpırtısı'],
  'sümük': ['burun salgısı', 'mukus'],
  'burun': ['geniz', 'burun içi'],
  'kanama': ['akıntı', 'kan gelmesi', 'sızıntı', 'kan', 'lekelenme', 'gelen'],
  'yüz ağrısı': ['yüz sızısı', 'yüz sancısı', 'yüzde zonklama'],
  'elmacık ağrısı': ['yanak ağrısı', 'elmacık kemiği sızısı'],
  'alın ağrısı': ['alın sızlaması', 'alın baskısı'],
  'diş ağrısı': ['diş sızısı', 'diş zonklaması', 'diş sancısı'],
  'çürük': ['diş kovuğu', 'diş deliği', 'diş harabiyeti'],
  'boyun ağrısı': ['boyun sızlaması', 'ense sancısı', 'boyun tutulması'],
  'boyun tutulması': ['boyun katılığı', 'boyun kilitlenmesi', 'ense sertliği'],
  'yutkunma': ['yutkunamama', 'yutkunurken güçlük'],
  'yutkunma güçlüğü': ['yutma zorluğu', 'yutkunma zorluğu', 'takılma hissi'],
  'ses kısıklığı': ['disfoni', 'ses kaybı', 'ses tutukluğu'],
  'tiroid': ['guatr', 'bez', 'boğaz şişliği', 'bezeler'],
  'sıkışma': ['daralma', 'bunalma', 'nefes darlığı'],
  'nefes darlığı': ['dispne', 'solunum güçlüğü', 'nefes açlığı', 'nefes yetmemesi', 'tıkanma', 'boğulma hissi'],
  'çarpıntı': ['kalp atım bozukluğu', 'ritim düzensizliği', 'taşikardi hissi'],
  'öksürük': ['aksırtı', 'gıcık', 'öksüre'],
  'balgamlı': ['hırıltılı', 'ciğerli', 'sökülen'],
  'balgam': ['geniz akıntısı', 'sümüksü sıvı', 'öksürük artığı'],
  'hemoptizi': ['kanlı öksürük', 'akciğer kanaması', 'kan tükürme'],
  'mide bulantısı': ['bulantı', 'iç kalkması', 'tiksinti'],
  'şişkinlik': ['gerginlik', 'hazımsızlık', 'gaz doluluğu'],
  'reflü': ['mide fıtığı belirtisi', 'asit kaçağı'],
  'mide yanması': ['mide kazınması', 'mide sancısı', 'mide ekşimesi', 'mide asidi'],
  'mide ekşimesi': ['ağız ekşimesi', 'asitli geğirme'],
  'dışkı': ['kaka', 'abdest', 'pislik', 'büyük tuvalet'],
  'kan': ['kızıllık', 'kanama', 'pıhtı', 'al', 'kırmızı renk'],
  'makat': ['anüs', 'arka taraf', 'çıkış yolu'],
  'kasık': ['bacak arası', 'pelvik bölge', 'pelvis bölgesi', 'alt karın', 'cinsel bölge'],
  'sol alt karın': ['sol taraf', 'sol kasık', 'sol boşluk', 'sol alt bölge'],
  'sarılık': ['ikter', 'sararma', 'beniz sararması'],
  'kol': ['pazu', 'ön kol', 'dirsek çevresi'],
  'omuz_agrisi': ['omuz sızısı', 'omuz sancısı', 'omuz rahatsızlığı'],
  'el': ['avuç', 'parmaklar', 'uzuv'],
  'titreme': ['sallanma', 'seğirme', 'zangırdama', 'titreşim', 'titrek el'],
  'bilek': ['el eklemi', 'el başı'],
  'diz ağrısı': ['diz sızlaması', 'diz kapağı sancısı'],
  'menisküs': ['diz yırtığı', 'diz kıkırdağı zedelenmesi'],
  'ayak ağrısı': ['ayak sızlaması', 'ayak acısı', 'ayak zonklaması'],
  'ayak tabanı': ['ayak altı', 'taban'],
  'ayak şişliği': ['ayak ödemi', 'ayak kabarması'],
  'bacak': ['ayak', 'alt ekstremite', 'baldır', 'diz altı'],
  'bel ağrısı': ['bel sancısı', 'bel sızısı', 'bel rahatsızlığı'],
  'bel fıtığı': ['bel kayması', 'fıtık başlangıcı'],
  'dermansızlık': ['mecalsizlik', 'takatsizlik'],
  'yorgunluk': ['yorgun düşmek', 'tükenmişlik hali'],
  'kilo_kaybi': ['zayıflama', 'erime', 'çökme', 'süzülme'],
  'kilo alma': ['kilo artışı', 'bedensel irileşme', 'ağırlık kazanımı'],
  'şişmanlama': ['topaçlaşma', 'balık etli olma', 'iri yarı olma'],
  'terleme': ['ter basması', 'ter boşalması', 'terleme atağı', 'ter atma', 'sırılsıklam olma'],
  'uyku bozukluğu': ['uyku düzensizliği', 'uyku problemi'],
  'gece uyanma': ['bölünmüş uyku', 'gece yarısı uyanması'],
  'mutsuzluk': ['keyifsizlik', 'neşe kaybı'],
  'isteksizlik': ['atalet', 'hayattan kopma'],
  'umutsuzluk': ['çaresizlik', 'karamsarlık'],
  'hayattan zevk almama': ['anhedoni', 'zevk alamamak'],
  'anksiyete': ['evham', 'kuruntu', 'vesvese', 'iç sıkıntısı'],
  'korku': ['öd kopması', 'dehşet', 'ürperti'],
  'endişe': ['telaş', 'merak', 'tasalanma'],
  'kurdeşen': ['dabaz', 'sivilce benzeri kabartı', 'döküntü', 'alerjik reaksiyon', 'cilt kabarması'],
  'kaşıntı': ['kaşınma', 'vücudun kaşınması', 'tatlı kaşıntı', 'deri kaşınması', 'hırtı', 'pürtük', 'uyuzluk', 'gıdıklanma', 'rahatsızlık hissi'],
  'hapsırık': ['aksırma', 'hapşırma'],
  'döküntü': ['cilt kızarıklığı', 'kızarıklıklar', 'kurdeşen', 'deri dökülmesi', 'pütürlenme', 'kabartı', 'lezyon', 'kızarıklık', 'yara', 'leke'],
  'leke': ['yüz lekesi', 'güneş lekesi', 'iz', 'karartı', 'benek', 'ton farkı'],
  'sivilce': ['akne', 'ergenlik sivilcesi', 'çıban', 'kabarcık', 'pütür', 'leke'],
  'kellik': ['kel kalmak', 'saçsızlık', 'seyreklik'],
  'saç dökülmesi': ['saç kaybı', 'saçların dökülmesi', 'saç kaybı süreci'],
  'idrar': ['çiş', 'sidik', 'işeme', 'küçük tuvalet', 'tuvalet'],
  'yanma': ['sızı', 'acı', 'batma', 'ısı basması', 'zonklama'],
  'sık idrara çıkma': ['tuvaletten çıkamamak', 'sürekli çişe kalkmak', 'pollaküri', 'sıkışma hissi', 'idrar sıklığı'],
  'böbrek ağrısı': ['bel sancısı', 'yan sızısı'],
  'böbrek taşı': ['taş sancısı', 'kum dökme ağrısı', 'taş', 'kum', 'böbrek sancısı', 'böbrek kumu'],
  'adet': ['aybaşı', 'regl', 'periyot', 'gün görme', 'hayıt', 'günüm', 'özel gün'],
  'düzensiz': ['şaşmış', 'kaymış', 'dengesiz', 'bozuk', 'aksak'],
  'hamilelik': ['gebelik durumu', 'annelik süreci', 'bebek beklentisi', 'gebelik', 'gebe kalmak', 'bebek beklemek'],
  'hamile': ['bebek bekleyen', 'iki canlı', 'gebe'],
  'şeker hastalığı': ['diyabet', 'şeker rahatsızlığı', 'glikoz metabolizması bozukluğu'],
  'kan şekeri': ['kan glikozu', 'şeker oranı'],
  'insülin': ['iğne', 'şeker ilacı'],
  'tansiyon': ['kan basıncı', 'damar gerilimi', 'tansiyon değeri', 'baskı'],
  'eklem': ['mafsal', 'oynak yeri'],
  'bayılma': ['hüşu kaybı', 'kendinden gitme', 'huşu geçirme'],
  'nöbet': ['kriz', 'atak', 'tutma'],
  'kasılma': ['katılma', 'gerilme', 'sertleşme'],
  'havale': ['ateşli nöbet', 'çocukluk krizi'],
  'felç': ['inme', 'damar tıkanıklığı', 'tutmama', 'hareket kaybı'],
  'soğuk algınlığı': ['üşütme', 'kırgınlık', 'hastalık'],
  'nezle': ['burun akıntısı', 'sümük', 'gripal enfeksiyon'],
  'hemoroid': ['basur', 'mayasıl'],
  'makatta kanama': ['dışkıda kan', 'kanlı dışkılama'],
  'makatta şişlik': ['makatta meme', 'makatta et beni'],
  'fıtık': ['yumru', 'şişkinlik', 'sarkma'],
  'kasık fıtığı': ['kasıkta yumru', 'bacak arası şişliği'],
  'göbek fıtığı': ['göbek çökmesi', 'göbekte şişlik'],
  'beze': ['lenf düğümü', 'lenf nodu', 'şişlik', 'kitle', 'yumru'],
  'susuzluk': ['hararet', 'susama', 'tatta', 'ağız kuruluğu'],
  'unutkanlık': ['nasiyan', 'hafıza zafiyeti', 'dalgınlık', 'hafıza zayıflığı', 'bellek kaybı'],
  'hafıza': ['bellek', 'akıl defteri', 'zihin', 'akıl'],
  'hematüri': ['idrar yolu kanaması', 'idrarda kan sızıntısı'],
  'idrar_kaçırma': ['altına kaçırma', 'istemsiz işeme', 'idrar sızması'],
  'inkontinans': ['mesane zayıflığı', 'idrar torbası gevşekliği'],
  'prostat': ['erbezi kanalı tıkanıklığı', 'sidik zorluğu', 'idrar yolu tutukluğu'],
  'yapamama': ['çıkamama', 'tılanma', 'boşaltamama', 'akmaması'],
  'cinsel güçsüzlük': ['erkeklik gücü kaybı', 'takatsizlik'],
  'ereksiyon sorunu': ['sertleşememe', 'kalkmama problemi'],
  'cinsel isteksizlik': ['cinsel soğukluk', 'istek kaybı'],
  'impotans': ['iktidarsızlık', 'erkeklik işlevinin kaybı'],
  'panik atak': ['kriz', 'nöbet', 'tutulma', 'sıkışma'],
  'takıntı': ['vesvese', 'kuruntu', 'evham'],
  'kompulsif davranış': ['ritüel', 'tekrarlayan hareketler', 'zorlantı'],
  'flashback': ['anı tazelemesi', 'o ana geri dönmek', 'göz önünde canlanma'],
  'travma': ['sarsıntı', 'ağır olay', 'kötü yaşanmışlık'],
  'tetikte olma': ['diken üstünde olma', 'sürekli tetikte', 'huysuzluk'],
  'yeme bozukluğu': ['iştah sorunu', 'beslenme düzensizliği'],
  'anoreksiya': ['yememe hastalığı', 'iştahsızlık'],
  'bulimia': ['kusma hastalığı', 'tıkınma nöbeti'],
  'aşırı yeme': ['kriz yemek', 'yemek krizleri'],
  'alkol': ['içki', 'keyif verici madde', 'zıkkım'],
  'bağımlılık': ['tiryakilik', 'düşkünlük', 'esiri olmak'],
  'uyuşturucu': ['keyif verici madde', 'zehir', 'hap', 'mal'],
  'madde kullanımı': ['madde alışkanlığı', 'kullanım bozukluğu'],
  'odaklanamıyorum': ['konsantre olamıyorum', 'bir noktaya kilitlenemiyorum'],
  'dikkatim dağınık': ['algım kapalı', 'zihnim dağınık'],
  'hiperaktivite': ['yerinde duramama', 'aşırı hareketlilik'],
  'sosyal fobi': ['halk içine çıkamama', 'elalem çekincesi', 'sosyal çekingenlik'],
  'kaygı': ['vesvese', 'huzursuzluk', 'iç sıkıntısı'],
  'kaçınma': ['uzak durma', 'kabuğuna çekilme', 'soyutlanma'],
  'bipolar': ['çift kutuplu', 'iki uçlu'],
  'manik': ['aşırı neşeli', 'coşkulu dönem'],
  'depresif': ['çöküş', 'dipte olmak', 'karanlık dönem'],
  'akıntı': ['gelen sıvı', 'akış', 'nemlilik', 'ıslaklık'],
  'meme': ['göğüs', 'buse', 'döş'],
  'kitle': ['beze', 'yumru', 'pırtı', 'şişlik'],
  'bulantı': ['iç kalkması', 'mide bulanması', 'öğürme'],
  'menopoz': ['yaş dönümü', 'hayızdan kesilme', 'aybaşı kesilmesi'],
  'sıcak basması': ['ateş basması', 'basmak'],
  'gece terlemesi': ['ter basması', 'gece ter boşalması'],
  'çikolata kisti': ['yumurtalıkta leke', 'kistim var'],
  'adet sırasında şiddetli ağrı': ['aybaşı sancısı', 'karnım kopuyor', 'sancılı dönem'],
  'endometriozis': ['kadın hastalığı', 'rahim yapışıklığı'],
  'karaciğer': ['ciğer', 'sağ taraf'],
  'karaciğer yağlanması': ['karaciğerde yağlanma', 'yağlı karaciğer'],
  'karaciğer ağrısı': ['karaciğer sızısı', 'sağ yan sancısı'],
  'sağ üst karın ağrısı': ['sağ kaburga altı ağrısı', 'sağ böğür ağrısı'],
  'safra kesesi': ['öd kesesi', 'öd'],
  'safra taşı': ['öd taşı'],
  'kolesistit': ['safra kesesi iltihabı', 'öd kesesi iltihaplanması'],
  'ülser': ['mide yarası', 'mide aşınması'],
  'katran dışkı': ['siyah dışkı', 'kanlı dışkılama'],
  'irritabl barsak': ['huzursuz bağırsak', 'sinirsel bağırsak', 'bağırsak hassasiyeti'],
  'spazm': ['kramp', 'kasılma', 'burulma'],
  'karın şişkinliği': ['gaz', 'gerginlik', 'davul gibi olma'],
  'pankreas ağrısı': ['kuşak ağrısı', 'sırta vuran sızı'],
  'pankreatit': ['pankreas yangısı', 'pankreas iltihabı'],
  'yağlı dışkı': ['parlak dışkı', 'yapışkan kaka', 'yağlı kaka'],
  'crohn_kolit': ['bağırsak romatizması', 'bağırsak tutulumu', 'sindirim yolu iltihabı'],
  'yutma_agrisi': ['odinofaji', 'yutkunma güçlüğü', 'boğaz sancısı'],
  'inme': ['felç', 'beyin kanaması', 'beyin damarı tıkanıklığı'],
  'konuşamama': ['dili tutulmak', 'peltek konuşmak', 'kelime bulamamak'],
  'güçsüzlük': ['tutmama', 'boşalma', 'halsiz düşme', 'halsizlik', 'kolun boşalması', 'takatsizlik'],
  'afazi': ['konuşma yitimi', 'söz yitimi'],
  'peltek': ['ağzında geveleyen', 'anlaşılmaz'],
  'dil sürçmesi': ['takılma', 'dilin dolanması'],
  'karışıklık': ['bulanıklık', 'sersemlik', 'dalgınlık'],
  'denge sorunu': ['sersemlik', 'yürüyememe', 'düşme hissi'],
  'rijidite': ['katılık', 'kaskatı olma', 'kas sertleşmesi'],
  'yavaş hareket': ['hantallaşma', 'ağır hareket etme', 'hızın kesilmesi'],
  'yürüme güçlüğü': ['yürüyememe', 'paytak yürüme', 'adım atamama'],
  'skotom': ['kör nokta', 'görüş kaybı alanı'],
  'aura': ['öncü belirti', 'uyarı sinyali', 'gözün öncü belirtisi'],
  'görme bozukluğu': ['gözün kararması', 'görüşün bulanması'],
  'kriz': ['patlama', 'atak', 'ziplama', 'yükselme'],
  'bacak şişliği': ['ayakların şişmesi', 'ödem', 'su toplaması'],
  'ortopne': ['yastıkla yatma', 'oturarak uyuma', 'yatınca nefes alamama'],
  'aritmi': ['kalp ritim bozukluğu', 'taşikardi', 'ekstrasistol'],
  'kladikasyon': ['yürüme ağrısı', 'aralıklı topallama'],
  'damar tıkanıklığı': ['damar sertleşmesi', 'damar daralması'],
  'periferik': ['çevresel', 'uzuv'],
  'pıhtı': ['damar tıkanıklığı', 'kan pıhtısı', 'damar içi birikinti'],
  'anevrizma': ['damar balonlaşması', 'damar genişlemesi'],
  'diseksiyon': ['yırtılma', 'damar yırtığı'],
  'nabız': ['atış', 'küt küt atma', 'zonklama'],
  'kansızlık': ['anemi', 'kan azlığı', 'demir düşüklüğü'],
  'solgunluk': ['rengi atmak', 'benzi solmak', 'sararmak'],
  'enfeksiyon': ['mikrop', 'iltihap', 'enfekte'],
  'halsizlik': ['kırgınlık', 'dermansızlık', 'bitkinlik'],
  'bağışıklık': ['savunma sistemi', 'vücut direnci', 'bünye'],
  'hastalık': ['rahatsızlık', 'halsizlik', 'çöküş'],
  'hipotiroid': ['tiroid tembelliği', 'yavaş metabolizma'],
  'hipertiroid': ['zehirli guatr', 'hızlı metabolizma', 'tiroid çok çalışması'],
  'kas ağrısı': ['kas sızısı', 'kas sancısı', 'kas ağrısı'],
  'vücut ağrısı': ['tüm vücut sızısı', 'beden ağrısı', 'vücut kırgınlığı'],
  'kas tutulması': ['kas kaskatı olması', 'kas çekilmesi'],
  'polidipsi': ['çok su içme', 'aşırı susama'],
  'poliüri': ['çok idrara çıkma', 'sık idrar yapma'],
  'kabarcık': ['vezikül', 'su keseciği'],
  'ürtiker': ['hives', 'welts'],
  'egzama': ['cilt alerjisi', 'deri iltihabı', 'kaşıntılı döküntü'],
  'sedef': ['sedef hastalığı', 'pullanma', 'deri döküntüsü'],
  'kabuklanma': ['pullanma', 'katmanlaşma', 'sertleşme'],
  'cilt': ['ten', 'deri', 'yüz'],
  'ben': ['et beni', 'leke', 'iz', 'yara', 'cilt kabartısı'],
  'değişim': ['bozulma', 'başkalaşma', 'gelişme', 'farklılaşma'],
  'yanık': ['haşlanma', 'kızarıklık', 'yara'],
  'su kabarcığı': ['bül', 'su toplaması', 'kabarcık'],
  'yara': ['berelenme', 'kesik', 'ülser', 'sıyırık', 'dokusu bozulmuş bölge'],
  'iyileşmeme': ['kapanmama', 'onarılmama', 'düzelmeme', 'sebat etme'],
  'iltihaplı': ['cerahatli', 'irinli', 'enfeksiyonlu', 'iltihaplanmış'],
  'tırnak mantarı': ['tırnak mantarı', 'tırnakta mantar'],
  'tırnak batması': ['tırnak batması', 'tırnak gömülmesi'],
  'tırnak kırılması': ['tırnak kırılması', 'tırnak çatlaması'],
  'tırnak enfeksiyonu': ['tırnak iltihabı', 'tırnakta dolama'],
  'cilt mantarı': ['mantar', 'deri mantarı', 'mantar enfeksiyonu'],
  'rozase': ['gül hastalığı', 'gülleme', 'yüz damar hastalığı'],
  'vitiligo': ['ala hastalığı', 'alaca', 'cilt ağarması'],
  'iltihaplı şişlik': ['çıban', 'apse', 'pırtlak'],
  'cilt altı şişlik': ['topaklanma', 'ur']
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
