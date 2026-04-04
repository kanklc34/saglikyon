# SağlıkYön v2 – Algoritmik Triage Sistemi

SağlıkYön, kullanıcıların sağlık şikayetlerini (metin veya ses yoluyla) analiz eden, **yapay zeka maliyeti olmayan**, tamamen kural tabanlı (rule-based) ve istemci tarafında (client-side) çalışan bir sağlık yönlendirme platformudur.

## 🚀 Projenin Amacı ve Avantajları
İlk sürümde dış bir yapay zeka servisine (Gemini API vb.) bağımlılığımız vardı. Bu durum; hem sunucu maliyetlerine neden oluyor hem de hız kayıpları yaşatıyordu.

SağlıkYön v2 ile her şeyi baştan inşa ettik:
- **Tamamen Ücretsiz**: API anahtarı veya backend sunucusuna ihtiyacınız yok. GitHub Pages vb. ortamlarda statik site olarak host edilebilir.
- **Hızlı ve Güvenilir**: Karar motoru JSON tabanlı veritabanı ile çalışır. Analiz anında biter.
- **Gizlilik Odaklı**: Tüm verileriniz yerel cihazınızdadır, hiçbir şikayet uzak bir sunucuya gitmez.
- **Acil Durum Sensörü**: Kritik şikayetler (kalp krizi belirtisi vb.) girildiğinde, sistem anında 112 araması uyarısı verir.

## ✨ Özellikler

- **NLP (Doğal Dil İşleme) Modülü**: Levenshtein tabanlı bulanık arama (Fuzzy-matching), Türkçe stop-word temizleme ve kök bulma yetenekleri.
- **Katmanlı Analiz Motoru**: Semptom → Ağırlık Skorlama → Acil Durum Kontrolü → Akıllı Follow-Up (Ek Sorular) algoritmaları üzerinden departman belirleme.
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
├── custom-vars.css       // CSS Değişkenleri
├── script.js             // DOM manipülasyonu, Event Listener'lar
└── engine/               // ANA KARAR MOTORU (ALGORITMA)
    ├── symptom-db.js     // 500+ Semptom DB, Departmanları, Acil Durum Kuralları
    ├── nlp.js            // Fuzzy matching, Türkçe dil işleme
    └── analyzer.js       // Sonuç skoru çıkaran ana mantık
```

## 🛠️ Nasıl Çalıştırılır?

Projenin bir arayüze, NodeJS'e (backend için) veya kütüphane kurulumuna (npm install vb.) kesinlikle ihtiyacı yoktur.

1. Repoyu klonlayın.
2. `frontend` klasörü içine girin.
3. `index.html` dosyasını tarayıcınızda açın (Veya Live Server eklentisini kullanın).
4. Hepsi bu! Sistem kullanıma hazır.

---

> **🚨 Yasal Uyarı:** 
> SağlıkYön v2, bir "öneri sistemidir". Yapılan tahlillere dayanarak size "hangi sağlık uzmanına danışmanız gerektiğini" yaklaşık olarak gösterir. Kesinlikle bir doktor tavsiyesi, tıbbi tanı (teşhis) veya tedavi amacı taşımaz. Gerçek tıp uzmanlarının yerini alamaz. Acil ve şüpheye düştüğünüz durumlarda daima en yakın sağlık kuruluşuna başvurunuz.

Bu platform açık kaynaklıdır (MIT License). Katkıda bulunmaktan çekinmeyin!
