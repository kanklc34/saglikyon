# SağlıkYön – Algoritmik Ön Değerlendirme Sistemi

SağlıkYön, kullanıcıların sağlık şikayetlerini (metin veya ses yoluyla) analiz eden, **yapay zeka maliyeti olmayan**, tamamen kural tabanlı (rule-based) ve istemci tarafında (client-side) çalışan bir sağlık yönlendirme platformudur.

## 🚀 Projenin Amacı ve Avantajları
İlk sürümde dış bir yapay zeka servisine (Gemini API vb.) bağımlılığımız vardı. Bu durum; hem sunucu maliyetlerine neden oluyor hem de hız kayıpları yaşatıyordu.

SağlıkYön ile tüm yapıyı açık kaynak ve yayınlanabilir bir temelde yeniden kurguladık:
- **Tamamen Ücretsiz**: API anahtarı veya backend sunucusuna ihtiyacınız yok. GitHub Pages vb. ortamlarda statik site olarak host edilebilir.
- **Hızlı ve Güvenilir**: Karar motoru JSON tabanlı veritabanı ile çalışır. Analiz anında biter.
- **Gizlilik Odaklı**: Tüm verileriniz yerel cihazınızdadır, hiçbir şikayet uzak bir sunucuya gitmez.
- **Katmanlı Triage**: Her şikayet doğrudan `112` önerisine gitmez; sistem önce semptomları filtreler, gerekirse ek soru sorar, ardından `rutin`, `yakın zamanda`, `aynı gün` ve gerçekten `acil` seviyelerini ayırır.

## ✨ Özellikler

- **NLP (Doğal Dil İşleme) Modülü**: Levenshtein tabanlı bulanık arama (Fuzzy-matching), Türkçe stop-word temizleme ve kök bulma yetenekleri.
- **Katmanlı Analiz Motoru**: Semptom eşleştirme → Gürültü filtreleme → Risk sınıflandırma → Akıllı Follow-Up (Ek Sorular) → Bölüm skorlama akışıyla daha dengeli yönlendirme üretir.
- **Tarayıcı Tarafı İstek Limiti**: Kısa sürede aşırı sorgu yapılmasını engelleyen yerel rate-limit katmanı, demo güvenilirliğini ve kullanıcı deneyimini korur.
- **Premium Arayüz (UI)**: Glassmorphism tasarım, interaktif "Vücut Haritası (Body Map)", Karanlık (Dark) / Aydınlık (Light) mod seçenekleri.
- **Sesli Şikayet Alma**: Şikayetlerinizi klavyeyle yazmak yerine doğrudan konuşarak ekleme imkanı.
- **Yaşlı (Erişilebilirlik) Modu**: Menüler, butonlar ve yazılar tek tıkla büyütülebilir.

## ⚙️ Teknik Mimari

Proje, vanilla HTML, CSS ve JavaScript (ES6 Modules) kullanılarak modern bir "Single Page Application (SPA)" niteliğinde kurgulanmıştır.

Dosya hiyerarşisi:
```text
frontend/
├── index.html            // Ana arayüz ve DOM elemanları
├── style.css             // Premium tasarım, animasyonlar
├── manifest.json         // PWA / tarayıcı metadata
├── body-map.svg          // Vücut haritası görseli
├── script.js             // DOM manipülasyonu, Event Listener'lar
└── engine/               // ANA KARAR MOTORU (ALGORITMA)
    ├── symptom-db.js     // 500+ Semptom DB, departmanlar ve follow-up şablonları
    ├── nlp.js            // Gürültüyü azaltan Türkçe eşleştirme katmanı
    ├── analyzer.js       // Katmanlı ön değerlendirme ve bölüm öneri motoru
    └── rate-limit.js     // Tarayıcı tarafı istek limiti yardımcıları
```

## 🛠️ Nasıl Çalıştırılır?

Projenin bir arayüze, NodeJS'e (backend için) veya kütüphane kurulumuna (npm install vb.) kesinlikle ihtiyacı yoktur.

1. Repoyu klonlayın.
2. Repo kök dizininde `node tools/build-frontend-bundle.mjs` komutunu bir kez çalıştırın.
3. İsterseniz `frontend/index.html` dosyasını tarayıcınızda çift tıklayarak açın veya temiz yayın paketi için `dist/index.html` dosyasını kullanın.
4. Hepsi bu! Sistem kullanıma hazır.

Not:
- `app.bundle.js`, ES module dosyalarının tarayıcıda `file://` üzerinden de çalışabilmesi için üretilen tek dosyalık bundle'dır.
- `dist/` klasörü, yalnızca yayına gerekli dosyaları içeren temiz paket olarak üretilir.
- Kaynak dosyalarda (`script.js`, `engine/*.js`) değişiklik yaptıktan sonra yeniden `node tools/build-frontend-bundle.mjs` çalıştırın.

## 🌐 GitHub Pages ile Yayına Alma

Repo artık GitHub Pages için hazırdır. `.github/workflows/deploy-pages.yml` dosyası, build sonrası oluşan `dist/` klasörünü Pages artifact olarak yayınlar.

1. Bu repoyu GitHub'a push edin.
2. GitHub repo ayarlarında `Settings > Pages` bölümüne gidin.
3. `Source` olarak `GitHub Actions` seçin.
4. Varsayılan branch'inize (`main` veya `master`) push yaptığınızda workflow otomatik çalışacaktır.
5. Workflow tamamlandığında site GitHub Pages URL'sinde yayında olur.

Notlar:
- Workflow manuel olarak da `Actions > Deploy Frontend to GitHub Pages > Run workflow` üzerinden tetiklenebilir.
- Workflow yayın öncesi otomatik olarak `node tools/build-frontend-bundle.mjs` çalıştırır.
- Footer'daki lisans ibaresi artık repo kökündeki `LICENSE` dosyasıyla uyumludur.

## ☁️ Cloudflare Pages ile Yayına Alma

Cloudflare Pages üzerinden yayınlayacaksanız iki pratik yol var:

1. Repoyu Cloudflare Pages'e bağlayın.
2. Build komutu olarak `node tools/build-frontend-bundle.mjs` girin.
3. Output dizini olarak `dist` seçin.
4. Deploy tamamlandığında site yayınlanır.

Manuel yükleme yapacaksanız:

1. Önce repo kökünde `node tools/build-frontend-bundle.mjs` çalıştırın.
2. Ardından yalnızca `dist/` klasörünün içeriğini yayın klasörü olarak yükleyin.
3. `dist/_headers` dosyasını mutlaka birlikte yükleyin; güvenlik başlıkları burada tanımlıdır.

---

> **🚨 Yasal Uyarı:** 
> SağlıkYön, bir "öneri sistemidir". Yapılan tahlillere dayanarak size "hangi sağlık uzmanına danışmanız gerektiğini" yaklaşık olarak gösterir. Kesinlikle bir doktor tavsiyesi, tıbbi tanı (teşhis) veya tedavi amacı taşımaz. Gerçek tıp uzmanlarının yerini alamaz. Acil ve şüpheye düştüğünüz durumlarda daima en yakın sağlık kuruluşuna başvurunuz.

Bu platform açık kaynaklıdır (MIT License). Katkıda bulunmaktan çekinmeyin!
