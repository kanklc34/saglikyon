// Backend URL (localhost'ta çalışıyor)
const BACKEND_URL = 'http://localhost:3001';

let currentQuestionIndex = 0;
let allQuestions = [];
let followUpAnswers = [];

const confidenceLabels = {
  high: 'Yüksek Güven',
  medium: 'Orta Güven',
  low: 'Düşük Güven'
};

// Karakter sayacı
const textarea = document.getElementById('symptom');
textarea.addEventListener('input', () => {
  const count = textarea.value.length;
  document.getElementById('charCount').textContent = count;
  
  if (count > 500) {
    textarea.value = textarea.value.substring(0, 500);
    document.getElementById('charCount').textContent = 500;
  }
});

// Yaşlı modu
function toggleElderlyMode() {
  const body = document.body;
  const btn = document.querySelector('.elderly-toggle');
  
  body.classList.toggle('elderly-mode');
  
  if (body.classList.contains('elderly-mode')) {
    btn.textContent = '👴 Yaşlı Modu: AÇIK';
    btn.style.background = '#28a745';
  } else {
    btn.textContent = '👴 Yaşlı Modunu Aç';
    btn.style.background = '#6c757d';
  }
}

// Ana analiz fonksiyonu
async function analyze() {
  const symptom = document.getElementById('symptom').value;
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const resultEl = document.getElementById('result');
  const button = document.getElementById('analyzeBtn');

  // Temizle
  loadingEl.classList.add('hidden');
  errorEl.classList.add('hidden');
  resultEl.classList.add('hidden');

  // Validasyon
  if (!symptom || symptom.trim().length < 10) {
    errorEl.textContent = '❌ Lütfen şikâyetinizi en az 10 karakter ile açıklayın.';
    errorEl.classList.remove('hidden');
    return;
  }

  // Loading
  loadingEl.classList.remove('hidden');
  button.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symptom: symptom.trim() })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Bir hata oluştu');
    }

    displayResult(data.data);

  } catch (error) {
    console.error('Error:', error);
    errorEl.innerHTML = `
      ❌ ${error.message}<br>
      <small>Backend çalışıyor mu kontrol edin (Terminal'de npm start).</small>
    `;
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
    button.disabled = false;
  }
}

// Sonuç göster
function displayResult(result) {
  const resultEl = document.getElementById('result');
  
  // Acil durum
  if (result.isEmergency) {
    resultEl.innerHTML = `
      <div class="emergency">
        <h2>⚠️ ACİL DURUM!</h2>
        <p>${result.emergencyMessage}</p>
        <a href="tel:112" class="emergency-call-link">📞 112'yi Ara</a>
      </div>
    `;
    resultEl.classList.remove('hidden');
    return;
  }

  // Akıllı sorular var mı?
  if (result.needsMoreInfo && result.followUpQuestions && result.followUpQuestions.length > 0) {
    showFollowUpQuestions(result.followUpQuestions);
    return;
  }

  // Aile hekimi filtresi
  if (result.isFamilyDoctor || result.primaryDepartment === 'aile_hekimi') {
    resultEl.innerHTML = `
      <div class="family-doctor-card">
        <h3>💡 Aile Hekiminize Başvurabilirsiniz</h3>
        <div class="family-doctor-message">
          ${result.familyDoctorMessage || 'Bu şikayetiniz için hastaneye gitmenize gerek yok. Aile hekiminiz size yardımcı olabilir.'}
        </div>
        <div class="family-doctor-benefits">
          <div class="benefit-item">⏱️ Daha hızlı</div>
          <div class="benefit-item">📍 Daha yakın</div>
          <div class="benefit-item">💰 Daha kolay</div>
        </div>
        ${result.alternatives && result.alternatives.length > 0 ? `
          <div class="family-doctor-alternative">
            <small>Eğer 3 gün içinde geçmezse <strong>${DEPARTMENTS[result.alternatives[0]] || result.alternatives[0]}</strong> bölümüne başvurun.</small>
          </div>
        ` : ''}
      </div>
      ${generateDoctorNoteButton()}
    `;
    resultEl.classList.remove('hidden');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // Normal sonuç
 // Normal sonuç
  let html = `
    <div class="department-card">
      <h3>📍 Önerilen Sağlık Bölümü</h3>
      <div class="department-name">${result.primaryDepartmentName}</div>
      <span class="confidence">${confidenceLabels[result.confidence] || result.confidence}</span>
      ${result.reasoning ? `<div class="reasoning">💡 ${result.reasoning}</div>` : ''}
    </div>

    <a href="https://mhrs.gov.tr" target="_blank" class="mhrs-button">
      🏥 Online Randevu Sistemine Git
    </a>
    
     ${generateDoctorNoteButton()}  `;

  // Alternatifler
  if (result.alternativeNames && result.alternativeNames.length > 0) {
    html += `
      <div class="alternatives">
        <h4>🔄 Alternatif Bölümler (Opsiyonel)</h4>
        ${result.alternativeNames.map(name => `<span class="alt-tag">${name}</span>`).join('')}
      </div>
    `;
  }

  // Not
  html += `
    <div class="note">
      ℹ️ ${result.note}
    </div>
  `;

  resultEl.innerHTML = html;
  resultEl.classList.remove('hidden');
  
  // Smooth scroll
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
// ============================================
// VÜCUT HARİTASI FONKSİYONLARI
// ============================================

let selectedBodyRegion = null;
let currentPopup = null;
let selectedSymptoms = {};

// Sayfa yüklendiğinde event listener ekle
document.addEventListener('DOMContentLoaded', () => {
  const bodyParts = document.querySelectorAll('.body-part');
  
  bodyParts.forEach(part => {
    part.style.cursor = 'pointer';
    
    part.addEventListener('click', function(e) {
      e.stopPropagation();
      const region = this.getAttribute('data-region');
      const x = this.getAttribute('data-x');
      const y = this.getAttribute('data-y');
      toggleBodyRegion(region, x, y, this);
    });
    
    // Hover efekti
    part.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.fill = '#667eea';
      }
    });
    
    part.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.fill = '#e0e0e0';
      }
    });
  });
  
  // Dışarı tıklandığında popup'ları kapat
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.symptom-popup') && !e.target.closest('.body-part')) {
      closeAllPopups();
    }
  });
});
// ESC tuşu ile popup'ları kapat
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });
  
  // İlk gelenlere ipucu göster
 // showTooltipHint();

function toggleBodyRegion(region, x, y, element) {
  // Eğer aynı bölgeye tekrar tıklanırsa kapat
  if (element.classList.contains('active')) {
    closePopup(region, element);
    return;
  }
  
  // Diğer bölgeleri kapat
  closeAllPopups();
  
  // Bu bölgeyi aç
  element.classList.add('active');
  selectedBodyRegion = region;
  
  // Popup oluştur
  createSymptomPopup(region, x, y);
}

function createSymptomPopup(region, x, y) {
  const symptomData = {
    'baş': [
      { 
        title: 'Baş Ağrısı', 
        details: ['Şiddetli ağrı', 'Hafif ağrı', 'Migren tarzı', 'Sabahları başlıyor', 'Zonklayıcı'] 
      },
      { 
        title: 'Göz Sorunları', 
        details: ['Bulanık görme', 'Çift görme', 'Işık hassasiyeti', 'Göz ağrısı'] 
      },
      { 
        title: 'Kulak Sorunları', 
        details: ['Kulak çınlaması', 'İşitme kaybı', 'Kulak ağrısı', 'Dolgunluk hissi'] 
      }
    ],
    'boyun': [
      { title: 'Boyun Ağrısı', details: ['Şiddetli', 'Hareketle artan', 'Sabah tutukluğu', 'Kas gerginliği'] },
      { title: 'Boyun Tutulması', details: ['Ani başlayan', 'Hareket kısıtlılığı', 'Sertlik'] },
      { title: 'Yutkunma Güçlüğü', details: ['Ağrılı yutkunma', 'Boğaz kuruluğu'] }
    ],
    'göğüs': [
      { title: 'Göğüs Ağrısı', details: ['Şiddetli', 'Nefes darlığı ile', 'Eforla artan', 'Sıkışma hissi'] },
      { title: 'Solunum Sorunları', details: ['Nefes darlığı', 'Hırıltı', 'Öksürük'] },
      { title: 'Kalp Çarpıntısı', details: ['Hızlı kalp atışı', 'Düzensiz atım', 'Göğüste çırpınma'] }
    ],
    'karın': [
      { title: 'Karın Ağrısı', details: ['Şiddetli', 'Kramp şeklinde', 'Sürekli', 'Yemekten sonra'] },
      { title: 'Sindirim Sorunları', details: ['Mide bulantısı', 'Kusma', 'İshal', 'Kabızlık'] },
      { title: 'Şişkinlik', details: ['Gaz', 'Geğirme', 'Karında dolgunluk'] }
    ],
    'sol kol': [
      { title: 'Kol Ağrısı', details: ['Şiddetli', 'Hareketle artan', 'Gece ağrısı'] },
      { title: 'Uyuşma/Karıncalanma', details: ['Parmak uçlarında', 'Tüm kolda', 'Geceleri artan'] },
      { title: 'Güçsüzlük', details: ['Kuvvet kaybı', 'Tutamama', 'Yorgunluk'] }
    ],
    'sağ kol': [
      { title: 'Kol Ağrısı', details: ['Şiddetli', 'Hareketle artan', 'Gece ağrısı'] },
      { title: 'Uyuşma/Karıncalanma', details: ['Parmak uçlarında', 'Tüm kolda', 'Geceleri artan'] },
      { title: 'Güçsüzlük', details: ['Kuvvet kaybı', 'Tutamama', 'Yorgunluk'] }
    ],
    'sol bacak': [
      { title: 'Bacak Ağrısı', details: ['Yürürken', 'Dinlenirkende', 'Gece krampları'] },
      { title: 'Şişlik', details: ['Ayak bileğinde', 'Tüm bacakta', 'Akşamları artan'] },
      { title: 'Hareket Kısıtlılığı', details: ['Topallama', 'Eklem sertliği', 'Güçsüzlük'] }
    ],
    'sağ bacak': [
      { title: 'Bacak Ağrısı', details: ['Yürürken', 'Dinlenirkende', 'Gece krampları'] },
      { title: 'Şişlik', details: ['Ayak bileğinde', 'Tüm bacakta', 'Akşamları artan'] },
      { title: 'Hareket Kısıtlılığı', details: ['Topallama', 'Eklem sertliği', 'Güçsüzlük'] }
    ]
  };

  const problems = symptomData[region] || [];
  if (problems.length === 0) return;

  const popup = document.createElement('div');
  popup.className = `symptom-popup popup-${region.replace(/ /g, '-')}`;
  popup.id = `popup-${region}`;
  
  let problemsHTML = '';
  problems.forEach((problem, index) => {
    problemsHTML += `
      <div class="problem-card" data-problem="${problem.title}" data-index="${index}">
        <div class="problem-title">
          <span>${problem.title}</span>
          <span class="problem-arrow">›</span>
        </div>
        <div class="problem-details">
          ${problem.details.map(detail => `
            <div class="detail-option" data-detail="${detail}">
              ${detail}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  popup.innerHTML = `
    <div class="popup-header">
      <span class="popup-title">${region.toUpperCase()}</span>
      <button class="popup-close" onclick="closePopup('${region}')">×</button>
    </div>
    <div class="main-problems">
      ${problemsHTML}
    </div>
    <button class="popup-submit" onclick="submitSymptoms('${region}')">
      ✓ Ekle ve Devam Et
    </button>
    <div class="selection-counter">
      <span id="counter-${region}">0 seçim</span>
    </div>
  `;
  
  document.getElementById('popupContainer').appendChild(popup);
  
  // Problem kartlarına click event
  popup.querySelectorAll('.problem-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.classList.contains('detail-option')) {
        this.classList.toggle('expanded');
        updateSelectionCounter(region);
      }
    });
  });
  
  // Detay seçeneklerine click event
  popup.querySelectorAll('.detail-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('selected');
      updateSelectionCounter(region);
    });
  });
  
  // İlk seçimleri sakla
  if (!selectedSymptoms[region]) {
    selectedSymptoms[region] = [];
  }
}

function updateSelectionCounter(region) {
  const popup = document.getElementById(`popup-${region}`);
  if (!popup) return;
  
  const selected = popup.querySelectorAll('.detail-option.selected').length;
  const counter = document.getElementById(`counter-${region}`);
  if (counter) {
    counter.textContent = `${selected} seçim`;
  }
}

function closePopup(region, element) {
  const popup = document.getElementById(`popup-${region}`);
  if (popup) {
    popup.remove();
  }
  
  if (element) {
    element.classList.remove('active');
  } else {
    const bodyPart = document.querySelector(`[data-region="${region}"]`);
    if (bodyPart) {
      bodyPart.classList.remove('active');
      bodyPart.style.fill = '#e0e0e0';
    }
  }
}

function closeAllPopups() {
  document.querySelectorAll('.symptom-popup').forEach(popup => popup.remove());
  document.querySelectorAll('.body-part').forEach(part => {
    part.classList.remove('active');
    part.style.fill = '#e0e0e0';
  });
  selectedBodyRegion = null;
}

function submitSymptoms(region) {
  const popup = document.getElementById(`popup-${region}`);

  if (!popup) return;
  
  const selections = [];
  
  // Seçilen detayları topla
  popup.querySelectorAll('.problem-card.expanded').forEach(card => {
    const problemTitle = card.querySelector('.problem-title span').textContent;
    const selectedDetails = [];
    
    card.querySelectorAll('.detail-option.selected').forEach(detail => {
      selectedDetails.push(detail.textContent.trim());
    });
    
    if (selectedDetails.length > 0) {
      selections.push(`${problemTitle}: ${selectedDetails.join(', ')}`);
    }
  });
  
  if (selections.length === 0) {
    alert('Lütfen en az bir semptom seçin!');
    return;
  }
  
  // Textarea'ya ekle
  const textarea = document.getElementById('symptom');
  const text = `${region.toUpperCase()} bölgesinde şikayetlerim:\n${selections.join('\n')}\n\n`;
  
  if (textarea.value.trim() === '') {
    textarea.value = text;
  } else {
    textarea.value += text;
  }
  
  document.getElementById('charCount').textContent = textarea.value.length;
  
  // Popup'ı kapat
  closePopup(region);
  
  // Input'a scroll
  textarea.focus();
  document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// ============================================
// AKILLI SORULAR - CHAT TARZI
// ============================================



function showFollowUpQuestions(questions) {
  allQuestions = questions;
  currentQuestionIndex = 0;
  followUpAnswers = [];
  
  const resultEl = document.getElementById('result');
  
  resultEl.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <h3>💬 Birkaç Ek Soru</h3>
        <p class="chat-hint">Daha doğru yönlendirme için lütfen cevaplayın</p>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
    </div>
  `;
  resultEl.classList.remove('hidden');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // İlk soruyu göster
  showNextQuestion();
}

function showNextQuestion() {
  if (currentQuestionIndex >= allQuestions.length) {
    // Tüm sorular bitti, tekrar analiz et
    submitAllAnswers();
    return;
  }
  
   const question = allQuestions[currentQuestionIndex];
  const chatMessages = document.getElementById('chatMessages');
  
  // AI sorusunu ekle
  const questionDiv = document.createElement('div');
  questionDiv.className = 'chat-message ai-message';
  questionDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <p>${question}</p>
      <div class="message-buttons">
        <button class="chat-btn chat-btn-yes" onclick="handleAnswer('Evet')">✓ Evet</button>
        <button class="chat-btn chat-btn-no" onclick="handleAnswer('Hayır')">✗ Hayır</button>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(questionDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleAnswer(answer) {
  followUpAnswers[currentQuestionIndex] = answer;
  
  const chatMessages = document.getElementById('chatMessages');
  
  // Butonları devre dışı bırak
  const lastMessage = chatMessages.lastElementChild;
  const buttons = lastMessage.querySelectorAll('.chat-btn');
  buttons.forEach(btn => btn.disabled = true);
  
 // Seçilen butonu vurgula
  const selectedBtn = answer === 'Evet' 
    ? lastMessage.querySelector('.chat-btn-yes')
    : lastMessage.querySelector('.chat-btn-no');
  selectedBtn.classList.add('selected');
  
  // Kullanıcı cevabını ekle
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-message user-message';
  userDiv.innerHTML = `
    <div class="message-content">
      <p>${answer}</p>
    </div>
    <div class="message-avatar">👤</div>
  `;
  
  chatMessages.appendChild(userDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Sonraki soruya geç (kısa bir gecikme ile)
  currentQuestionIndex++;
  setTimeout(() => {
    showNextQuestion();
  }, 500);
}

function submitAllAnswers() {
  const chatMessages = document.getElementById('chatMessages');
  
  // "Analiz ediliyor..." mesajı
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-message ai-message';
  loadingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <p>Cevaplarınızı analiz ediyorum...</p>
    </div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Tüm cevapları ekleyip tekrar gönder
  const originalSymptom = document.getElementById('symptom').value;
  const answersText = followUpAnswers.map((a, i) => {
    return `${allQuestions[i]} → ${a}`;
  }).join('\n');

  document.getElementById('symptom').value = `${originalSymptom}\n\nEk Bilgiler:\n${answersText}`;
  
  // Tekrar analiz et
  setTimeout(() => {
    followUpAnswers = [];
    allQuestions = [];
    currentQuestionIndex = 0;
    analyze();
  }, 800);
}

// ============================================
// DOKTOR NOTU
// ============================================

function generateDoctorNoteButton() {
  return `
    <button class="doctor-note-btn" onclick="generateDoctorNote()">
      📋 Doktor İçin Özet Hazırla
    </button>
  `;
}

function generateDoctorNote() {
  const symptom = document.getElementById('symptom').value;
  const today = new Date().toLocaleDateString('tr-TR');
  
  const note = `
HASTA BEYANI ÖZETİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tarih: ${today}
Platform: SağlıkYön (AI Asistanı)

ŞİKAYETLER:
${symptom}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOT: Bu özet hastanın kendi beyanı olup,
SağlıkYön AI asistanı tarafından muayene
öncesi organize edilmiştir.

Kesin tanı için doktor muayenesi gereklidir.
  `.trim();
  
  // Kopyala
  navigator.clipboard.writeText(note).then(() => {
    alert('✅ Doktor notu kopyalandı! Doktora gösterebilirsiniz.');
  }).catch(() => {
    // Fallback: Metin alanı göster
    const modal = document.createElement('div');
    modal.className = 'doctor-note-modal';
    modal.innerHTML = `
      <div class="doctor-note-content">
        <h3>📋 Doktor İçin Özet</h3>
        <textarea readonly rows="12">${note}</textarea>
        <div class="doctor-note-actions">
          <button onclick="this.parentElement.parentElement.parentElement.remove()">Kapat</button>
          <button onclick="copyNoteManually()">Kopyala</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    window.copyNoteManually = function() {
      const textarea = modal.querySelector('textarea');
      textarea.select();
      document.execCommand('copy');
      alert('✅ Kopyalandı!');
      modal.remove();
    };
  });
}

const DEPARTMENTS = {
  'dahiliye': 'Dahiliye (İç Hastalıkları)',
  'kardiyoloji': 'Kardiyoloji',
  'noroloji': 'Nöroloji',
  'ortopedi': 'Ortopedi ve Travmatoloji',
  'kbb': 'Kulak Burun Boğaz',
  'goz': 'Göz Hastalıkları',
  'dermatoloji': 'Dermatoloji',
  'psikiyatri': 'Psikiyatri',
  'kadin_dogum': 'Kadın Hastalıkları ve Doğum',
  'uroloji': 'Üroloji',
  'cocuk': 'Çocuk Sağlığı ve Hastalıkları',
  'fizik_tedavi': 'Fizik Tedavi ve Rehabilitasyon',
  'genel_cerrahi': 'Genel Cerrahi',
  'gogus': 'Göğüs Hastalıkları',
  'aile_hekimi': 'Aile Hekimi'
};
// ============================================
// SESLİ GİRİŞ (Web Speech API)
// ============================================

(function() {
  let recognition = null;
  let isListening = false;

  // Tarayıcı desteği kontrolü ve başlatma
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = function() {
      console.log('🎤 Dinleme başladı');
      isListening = true;
      
      const btn = document.getElementById('voiceBtn');
      const status = document.getElementById('voiceStatus');
      
      if (btn) btn.classList.add('listening');
      if (status) {
        status.classList.remove('hidden', 'error');
        status.textContent = '🎤 Dinliyorum... Konuşun';
      }
    };
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      console.log('✅ Algılanan:', transcript);
      
      const textarea = document.getElementById('symptom');
      
      if (textarea.value.trim()) {
        textarea.value += ' ' + transcript;
      } else {
        textarea.value = transcript;
      }
      
      document.getElementById('charCount').textContent = textarea.value.length;
      
      const status = document.getElementById('voiceStatus');
      if (status) {
        status.textContent = '✅ Eklendi: "' + transcript + '"';
        status.classList.remove('error');
        setTimeout(() => status.classList.add('hidden'), 3000);
      }
    };
    
    recognition.onerror = function(event) {
      console.error('❌ Hata:', event.error);
      
      const errorMessages = {
        'no-speech': '❌ Ses algılanamadı. Tekrar deneyin.',
        'audio-capture': '❌ Mikrofon bulunamadı.',
        'not-allowed': '❌ Mikrofon izni gerekli.',
        'network': '❌ İnternet bağlantısı gerekli.'
      };
      
      const status = document.getElementById('voiceStatus');
      if (status) {
        status.textContent = errorMessages[event.error] || '❌ Bir hata oluştu.';
        status.classList.add('error');
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 5000);
      }
    };
    
    recognition.onend = function() {
      console.log('🎤 Dinleme bitti');
      isListening = false;
      
      const btn = document.getElementById('voiceBtn');
      if (btn) btn.classList.remove('listening');
    };
    
    console.log('✅ Sesli giriş hazır');
  } else {
    console.warn('⚠️ Tarayıcı sesli girişi desteklemiyor');
  }

  // Global fonksiyon - window'a ekle
  window.toggleVoiceInput = function() {
    console.log('🎤 Butona tıklandı');
    
    if (!recognition) {
      alert('❌ Tarayıcınız sesli girişi desteklemiyor.\n\nChrome, Edge veya Safari kullanın.');
      return;
    }
    
    if (isListening) {
      console.log('🛑 Durduruluyor');
      recognition.stop();
      return;
    }
    
    console.log('▶️ Başlatılıyor');
    try {
      recognition.start();
    } catch (error) {
      console.error('❌ Başlatma hatası:', error);
      
      if (error.message && error.message.includes('already')) {
        recognition.stop();
        setTimeout(() => recognition.start(), 200);
      } else {
        alert('Mikrofon başlatılamadı.\nTarayıcı ayarlarından mikrofon iznini kontrol edin.');
      }
    }
  };
  // Global fonksiyon - window'a ekle
  window.toggleVoiceInput = function() {
    console.log('🎤 Butona tıklandı');
    
    if (!recognition) {
      alert('❌ Tarayıcınız sesli girişi desteklemiyor.\n\nChrome, Edge veya Safari kullanın.');
      return;
    }
    
    if (isListening) {
      console.log('🛑 Durduruluyor');
      recognition.stop();
      return;
    }
    
    console.log('▶️ Başlatılıyor');
    try {
      recognition.start();
    } catch (error) {
      console.error('❌ Başlatma hatası:', error);
      
      if (error.message && error.message.includes('already')) {
        recognition.stop();
        setTimeout(() => recognition.start(), 200);
      } else {
        alert('Mikrofon başlatılamadı.\nTarayıcı ayarlarından mikrofon iznini kontrol edin.');
      }
    }
  };
  
  // Event listener ekle - DOMContentLoaded'dan sonra
  document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', window.toggleVoiceInput);
      console.log('✅ Mikrofon butonu event listener eklendi');
    }
  });
})();

// ============================================
// KARŞILAMA EKRANI
// ============================================

function closeWelcome() {
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.add('hidden');
    
    // localStorage'a kaydet (bir daha gösterme)
    try {
      localStorage.setItem('welcomeSeen', 'true');
    } catch (e) {
      console.log('localStorage kullanılamıyor');
    }
  }
}

// Sayfa yüklendiğinde kontrol et
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('welcomeModal');
  
  if (modal) {
    try {
      const seen = localStorage.getItem('welcomeSeen');
      if (seen === 'true') {
        // Daha önce görmüş, gizle
        modal.classList.add('hidden');
      }
    } catch (e) {
      // localStorage yoksa her seferinde göster
      console.log('localStorage kullanılamıyor, modal gösteriliyor');
    }
  }
});