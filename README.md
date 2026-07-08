# SağlıkYön – Algoritmik Ön Değerlendirme Sistemi

SağlıkYön, kullanıcıların sağlık şikayetlerini (metin, ses veya vücut haritası yoluyla) analiz eden, **yapay zeka maliyeti olmayan**, tamamen kural tabanlı (rule-based) ve istemci tarafında (client-side) çalışan bir sağlık yönlendirme platformudur.

## 🚀 Projenin Amacı ve Avantajları

SağlıkYön, tüm yapıyı açık kaynak ve yayınlanabilir bir temelde kurgular:

- **Tamamen Ücretsiz**: API anahtarı veya backend sunucusuna ihtiyaç yok. GitHub Pages gibi ortamlarda statik site olarak host edilir.
- **Gizlilik Odaklı**: Tüm analiz tarayıcıda çalışır — hiçbir şikayet metni bir sunucuya gönderilmez. Bu, bir LLM API'sine bağımlı sistemlerin sunamayacağı bir garanti.
- **Hızlı ve Belirlenimci (Deterministic)**: Aynı girdi her zaman aynı sonucu verir; sonuçlar test edilebilir, versiyonlanabilir ve denetlenebilir (bkz. aşağıdaki "Test ve Kalite Güvencesi").
- **Katmanlı Triage**: Her şikayet doğrudan `112` önerisine gitmez; sistem önce semptomları filtreler, gerekirse ek soru sorar (yaş grubu dahil), ardından `rutin`, `yakın zamanda`, `aynı gün` ve gerçekten `acil` seviyelerini ayırır.

## ✨ Özellikler

- **NLP (Doğal Dil İşleme) Motoru**: Levenshtein tabanlı bulanık eşleştirme, Türkçe stop-word temizleme, kök bulma ve eş anlamlı çözümleme.
- **Performans: Silme-Komşuluğu (SymSpell tarzı) Ters İndeks** — her analizde 142 semptomun tamamını taramak yerine, girdiyle ortak kök paylaşan semptomları önceden daraltan bir aday-daraltma katmanı (`engine/keyword-index.js`). Ortalama analiz süresini ~%45-50 kısaltır; motorun kendi yazım-hatası toleransıyla matematiksel olarak tutarlıdır (508 vakalık regresyon setinde orijinal davranışla birebir aynı sonucu verdiği doğrulanmıştır).
- **Adım-Adım (Wizard) Arayüz**: Giriş → (isteğe bağlı) Vücut Haritası → Takip Soruları → Sonuç, hepsi aynı sabit alanda, sayfa hiç uzamadan değişir. Vücut haritası kendi bağımsız ekranıdır (geri butonuyla).
- **Yaş Grubuna Duyarlı Yönlendirme**: Ateş, öksürük, karın ağrısı gibi yaşa duyarlı semptomlarda, metinden yaş çıkarılamıyorsa tek bir soru sorulur ("Bu değerlendirme kimin için?"). Bebek/çocuk seçilirse Çocuk Sağlığı bölümüne yönlendirme güçlenir; kullanılan yaş grubu sonuç ekranında her zaman görünür kalır (sessiz varsayım yapılmaz).
- **Anlamlı Takip Soruları**: Her soru tipi kendi cevap biçimiyle eşleşir — "Kaç gündür?" gibi sorular artık Evet/Hayır değil, gün aralığı seçenekleri sunar; süre bilgisi gerçekten skora yansır.
- **Güven Skoru Şeffaflığı**: Sonuç ekranındaki güven yüzdesinin yanında, ne anlama geldiğini açıklayan bir bilgi butonu.
- **Basit Geri Bildirim**: Sonuca "itiraz" yerine, ikon tabanlı (emoji değil) "Faydalı oldu / olmadı" geri bildirimi.
- **Tarayıcı Tarafı İstek Limiti**: Kısa sürede aşırı sorgu yapılmasını engelleyen yerel rate-limit katmanı.
- **Sesli Şikayet Alma**: Şikayeti konuşarak ekleme imkanı.
- **Çok Dilli (TR/EN)** ve **Yaşlı (Erişilebilirlik) Modu**.

## ⚙️ Teknik Mimari

Proje, vanilla HTML, CSS ve JavaScript (ES6 Modules) kullanılarak bir "Single Page Application (SPA)" niteliğinde kurgulanmıştır.

Dosya hiyerarşisi:
```text
frontend/
├── index.html            // Ana arayüz ve DOM elemanları (ekran bazlı yapı)
├── style.css              // Tasarım, animasyonlar
├── manifest.json          // PWA / tarayıcı metadata
├── body-map.svg           // Vücut haritası görseli
├── script.js               // DOM manipülasyonu, ekran geçişleri, Event Listener'lar
└── engine/                // ANA KARAR MOTORU (ALGORİTMA)
    ├── symptom-db.js       // 142 semptom, departmanlar, follow-up şablonları, yaşa-duyarlı semptom listesi
    ├── nlp.js              // Türkçe tokenize/normalize/fuzzy eşleştirme katmanı
    ├── keyword-index.js    // Performans: ters indeks (aday daraltma), motora doğrudan bağlı
    ├── analyzer.js         // Katmanlı analiz motoru: eşleştirme → triyaj → yaş grubu → bölüm skorlama
    ├── i18n.js             // TR/EN metin sözlüğü
    ├── body-map.js         // Vücut haritası etkileşimi (dinamik olarak yükleniyor)
    └── rate-limit.js       // Tarayıcı tarafı istek limiti yardımcıları
tools/
    ├── build-frontend-bundle.mjs   // dist/ için tek-dosya bundle üretici
    ├── build_regression_corpus.mjs // Regresyon test korpusu üretici (508 vaka)
    ├── run_regression_baseline.mjs // Motoru korpusla çalıştırıp "altın referans" kaydeder
    ├── validate_index_coverage.mjs // keyword-index.js'in hiçbir eşleşmeyi kaçırmadığını doğrular
    ├── final_check_vs_golden.mjs   // Üretim kodunu golden referansla karşılaştırır
    └── test_age_band.mjs            // Yaş grubu özelliğinin manuel/hızlı testi
```

## 🧪 Test ve Kalite Güvencesi

Bu proje, tipik bir hobi projesinden farklı olarak **gerçek bir regresyon test altyapısına** sahiptir:

- `tools/regression_corpus.json` — 142 semptomun tamamını kapsayan, gerçek örnekler ve kenar durumlar içeren 508 vakalık test seti.
- `tools/regression_baseline.json` — bu 508 vakanın, motorun **orijinal (hiç dokunulmamış) hâlinden** kaydedilmiş "altın referans" sonuçları.
- Herhangi bir motor değişikliğinden sonra `node tools/final_check_vs_golden.mjs` çalıştırılarak, üretim kodunun bu referansla **birebir aynı** sonucu verip vermediği doğrulanabilir.
- Yaş grubu özelliği için: `node tools/test_age_band.mjs`.

Bunun anlamı: sisteme yapılan her değişiklik, "bir şeyi kırdım mı?" sorusuna öznel bir izlenimle değil, somut bir karşılaştırmayla cevap verebiliyor.

## 🛠️ Nasıl Çalıştırılır?

1. Repoyu klonlayın.
2. Repo kök dizininde `node tools/build-frontend-bundle.mjs` komutunu bir kez çalıştırın.
3. `dist/index.html` dosyasını (üretim/yayın hâli) veya geliştirme için `cd dist && npx serve .` ile yerel sunucu üzerinden açın.
4. Kaynak dosyalarda (`script.js`, `engine/*.js`) değişiklik yaptıktan sonra yeniden `node tools/build-frontend-bundle.mjs` çalıştırmayı unutmayın — build script'i `frontend/engine/` altındaki dosyaları elle listelenmiş bir `sources` dizisinden okur; **yeni bir engine dosyası eklerseniz bu diziye de eklemeniz gerekir**, aksi halde dosya bundle'a dahil olmaz (bu, geçmişte birkaç kez gerçek bir hataya yol açmıştı).

Not:
- `app.bundle.js`, ES module dosyalarının tek dosyada birleştirilmiş hâlidir.
- `dist/` klasörü yalnızca yayına gerekli dosyaları içerir; `dist/index.html` içindeki script referansı build sırasında otomatik olarak `app.bundle.js`'e çevrilir.
- `body-map.js` ve `i18n.js`, `script.js` içinde **dinamik** (`import()`) olarak yüklendiği için, bundle'a ek olarak `dist/engine/` altına gerçek dosya olarak da kopyalanır.

## 🌐 GitHub Pages ile Yayına Alma

Repo GitHub Pages için hazırdır. `.github/workflows/deploy-pages.yml`, build sonrası oluşan `dist/` klasörünü Pages artifact olarak yayınlar.

1. Push edin → `Settings > Pages > Source: GitHub Actions` seçili olduğundan emin olun.
2. Workflow otomatik çalışır; manuel tetikleme için `Actions > Deploy Frontend to GitHub Pages > Run workflow`.
3. Deploy sonrası tarayıcıda **sert yenileme** (Ctrl+Shift+R) yapın — önbellek eski dosyayı gösterebilir.

## 📍 Şu Anki Durum ve Yol Haritası

**Tamamlananlar (bu sürümde):**
- Performans optimizasyonu (ters indeks), 0 regresyon ile doğrulandı.
- Ekran-bazlı (wizard) arayüz mimarisi — giriş/vücut haritası/soru/sonuç artık gerçekten birbirinin yerini alıyor.
- Yaş grubuna duyarlı yönlendirme (bebek/çocuk → Çocuk Sağlığı bölümü artık gerçekten erişilebilir) — **20 semptomu kapsayan** genişletilmiş liste.
- Takip sorularının cevap tipleri düzeltildi (süre soruları artık Evet/Hayır değil).
- **"Seçenek" tipi genel sorularda (şiddet, genel süre) cevap artık gerçekten skora orantılı yansıyor** (önceden tamamen ölüydü).
- **Geri bildirim (👍/👎) artık cihazda kalıcı olarak saklanıyor** (localStorage) — hangi semptom/bölüm eşleşmesinin faydasız işaretlendiği artık kaybolmuyor. Geliştirici, tarayıcı konsolunda `exportFeedbackData()` çağırarak bu veriyi kendi cihazından bir JSON dosyası olarak indirebilir (hiçbir sunucuya gönderilmiyor).
- Güven skoru açıklaması, basit geri bildirim widget'ı.

**Bilinen sınırlamalar / henüz yapılmayanlar:**
- Yaşa-duyarlı semptom listesi 20 semptomu kapsıyor (`AGE_SENSITIVE_SYMPTOM_IDS`) — daha da genişletilebilir, ve bazı semptomların anahtar kelime kapsamı hâlâ dar (örn. "kilo kaybediyorum" gibi doğal ifadeler bazı semptomları hiç eşleştirmeyebiliyor).
- Semptom veritabanı büyütülürken (500'e doğru), düz anahtar-kelime listesi yerine daha yapılandırılmış bir modele geçiş önerilir.
- Vücut haritasının çocuk/bebek için ayrı bir görsel varyantı yok (öncelik düşük görüldü).

**Sonraki adımlar için düşünülenler:**
- Semptom eşleştirmenin, saf anahtar-kelime yerine küçük bir yerel embedding modeliyle desteklenmesi (gizlilik ilkesi korunarak).
- Kürasyonlu bir bilgi tabanı + RAG katmanı (yalnızca "hangi bölüm" değil, "neden" ve "ne yapılmalı" bilgisi sunmak için).
- Geri bildirimin (anonim, yerel) kalıcı hâle getirilip veritabanı iyileştirmesinde kullanılması.

---

> **🚨 Yasal Uyarı:**
> SağlıkYön bir "öneri sistemidir". Yapılan analizlere dayanarak size "hangi sağlık uzmanına danışmanız gerektiğini" yaklaşık olarak gösterir. Kesinlikle bir doktor tavsiyesi, tıbbi tanı (teşhis) veya tedavi amacı taşımaz. Acil ve şüpheye düştüğünüz durumlarda daima en yakın sağlık kuruluşuna başvurunuz.

Bu platform açık kaynaklıdır (MIT License).