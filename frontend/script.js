// ============================================
// SağlıkYön v2 – Main application logic
// Connects UI with local algorithmic engine
// ============================================

import { analyzeSymptoms } from './engine/analyzer.js';

// --- State ---
const state = {
  currentResult: null,
  followUpQuestions: [],
  followUpAnswers: [],
  currentQuestionIndex: 0,
  history: JSON.parse(localStorage.getItem('sy_history') || '[]'),
  totalQueries: parseInt(localStorage.getItem('sy_total_queries') || '0'),
  theme: localStorage.getItem('sy_theme') || 'light'
};

// --- DOM Elements ---
const DOM = {
  input: document.getElementById('symptomInput'),
  charCount: document.getElementById('charCount'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  voiceBtn: document.getElementById('voiceBtn'),
  voiceStatus: document.getElementById('voiceStatus'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error'),
  result: document.getElementById('result'),
  themeToggle: document.getElementById('themeToggle'),
  elderlyToggle: document.getElementById('elderlyToggle'),
  bodyMapParts: document.querySelectorAll('.body-part'),
  popupContainer: document.getElementById('popupContainer'),
  welcomeModal: document.getElementById('welcomeModal'),
  welcomeBtn: document.getElementById('welcomeBtn'),
  historyBtn: document.getElementById('historyBtn'),
  historyPanel: document.getElementById('historyPanel'),
  historyList: document.getElementById('historyList'),
  closeHistoryBtn: document.getElementById('closeHistory'),
  clearHistoryBtn: document.getElementById('clearHistory'),
  statsBadge: document.getElementById('totalQueries')
};

// --- Initialization ---
function init() {
  applyTheme(state.theme);
  updateStats();
  setupEventListeners();
  checkWelcomeModal();
  initBodyMap();
}

function setupEventListeners() {
  DOM.input.addEventListener('input', handleInput);
  DOM.analyzeBtn.addEventListener('click', startAnalysis);
  DOM.themeToggle.addEventListener('click', toggleTheme);
  DOM.elderlyToggle.addEventListener('click', toggleElderlyMode);
  DOM.welcomeBtn.addEventListener('click', closeWelcomeModal);
  
  // History panel
  DOM.historyBtn.addEventListener('click', toggleHistoryPanel);
  DOM.closeHistoryBtn.addEventListener('click', () => DOM.historyPanel.classList.add('hidden'));
  DOM.clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Voice input
  if (DOM.voiceBtn) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         DOM.voiceBtn.addEventListener('click', toggleVoiceInput);
      } else {
         DOM.voiceBtn.style.display = 'none';
      }
  }

  // Global click to close popups
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.symptom-popup') && !e.target.closest('.body-part')) {
      closeAllPopups();
    }
  });
}

function checkWelcomeModal() {
  const seen = localStorage.getItem('sy_welcome_seen');
  if (!seen) {
    DOM.welcomeModal.classList.remove('hidden');
  } else {
    DOM.welcomeModal.classList.add('hidden');
  }
}

function closeWelcomeModal() {
  DOM.welcomeModal.classList.add('hidden');
  localStorage.setItem('sy_welcome_seen', 'true');
}

// --- UI Logic ---
function handleInput() {
  const count = DOM.input.value.length;
  DOM.charCount.textContent = count;
  if (count > 500) {
    DOM.input.value = DOM.input.value.substring(0, 500);
    DOM.charCount.textContent = 500;
  }
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  localStorage.setItem('sy_theme', state.theme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    DOM.themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
  } else {
    document.body.removeAttribute('data-theme');
    DOM.themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
  }
}

function toggleElderlyMode() {
  const isElderly = document.body.classList.toggle('elderly-mode');
  if (isElderly) {
    DOM.elderlyToggle.innerHTML = '👩‍🦳 Standart Mod';
    DOM.elderlyToggle.style.borderColor = 'var(--accent)';
    DOM.elderlyToggle.style.color = 'var(--accent)';
  } else {
    DOM.elderlyToggle.innerHTML = '👴 Yaşlı Modu';
    DOM.elderlyToggle.removeAttribute('style');
  }
}

// --- Analysis Logic ---
async function startAnalysis() {
  const text = DOM.input.value.trim();
  
  if (text.length < 5) {
    showError('Lütfen şikayetinizi daha detaylı açıklayın (en az 5 karakter).');
    return;
  }
  
  DOM.error.classList.add('hidden');
  DOM.result.classList.add('hidden');
  DOM.loading.classList.remove('hidden');
  DOM.analyzeBtn.disabled = true;
  
  // Simulate network delay for UX (loading animation)
  animateLoadingSteps();
  await new Promise(r => setTimeout(r, 1500));
  
  try {
    const result = analyzeSymptoms(text);
    
    if (result.error) {
      showError(result.error);
    } else if (result.noMatch) {
      showError(result.message);
    } else if (result.needsMoreInfo) {
      startFollowUp(result);
    } else {
      displayResult(result, text);
    }
  } catch (err) {
    console.error('Analiz hatası:', err);
    showError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    DOM.loading.classList.add('hidden');
    DOM.analyzeBtn.disabled = false;
  }
}

function animateLoadingSteps() {
  const steps = document.querySelectorAll('.loading-steps .step');
  steps.forEach(s => s.classList.remove('active'));
  
  setTimeout(() => steps[0] && steps[0].classList.add('active'), 100);
  setTimeout(() => steps[1] && steps[1].classList.add('active'), 600);
  setTimeout(() => steps[2] && steps[2].classList.add('active'), 1100);
}

function showError(msg) {
  DOM.error.innerHTML = `⚠️ ${msg}`;
  DOM.error.classList.remove('hidden');
  DOM.loading.classList.add('hidden');
  DOM.analyzeBtn.disabled = false;
}

// --- Follow-Up Questions ---
function startFollowUp(result) {
  state.followUpQuestions = result.followUpQuestions;
  state.followUpAnswers = [];
  state.currentQuestionIndex = 0;
  state.currentResult = result;
  
  renderChatUI();
}

function renderChatUI() {
  DOM.result.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <h3>💬 Birkaç Ek Soru</h3>
        <p class="chat-hint">Algoritmanın daha doğru karar vermesi için lütfen cevaplayın</p>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
    </div>
  `;
  DOM.result.classList.remove('hidden');
  DOM.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  showNextQuestion();
}

function showNextQuestion() {
  if (state.currentQuestionIndex >= state.followUpQuestions.length) {
    finishFollowUp();
    return;
  }
  
  const q = state.followUpQuestions[state.currentQuestionIndex];
  const chatMessages = document.getElementById('chatMessages');
  
  const qDiv = document.createElement('div');
  qDiv.className = 'chat-message ai-message';
  qDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <p>${q.question}</p>
      <div class="message-buttons">
        <button class="chat-btn chat-btn-yes" data-ans="Evet">Evet</button>
        <button class="chat-btn chat-btn-no" data-ans="Hayır">Hayır</button>
        <button class="chat-btn chat-btn-skip" data-ans="Emin Değilim">Emin Değilim</button>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(qDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Event listeners for buttons
  qDiv.querySelectorAll('.chat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ans = e.target.getAttribute('data-ans');
      const allBtns = qDiv.querySelectorAll('.chat-btn');
      allBtns.forEach(b => b.disabled = true);
      e.target.classList.add('selected');
      
      handleAnswer(ans, q);
    });
  });
}

function handleAnswer(answer, questionObj) {
  state.followUpAnswers.push({
    question: questionObj.question,
    answer: answer,
    impact: questionObj.impact
  });
  
  const chatMessages = document.getElementById('chatMessages');
  const uDiv = document.createElement('div');
  uDiv.className = 'chat-message user-message';
  uDiv.innerHTML = `
    <div class="message-content"><p>${answer}</p></div>
    <div class="message-avatar">👤</div>
  `;
  
  chatMessages.appendChild(uDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  state.currentQuestionIndex++;
  setTimeout(showNextQuestion, 400);
}

async function finishFollowUp() {
  const chatMessages = document.getElementById('chatMessages');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-message ai-message';
  loadingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content"><p>Cevaplarınız analiz ediliyor...</p></div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  await new Promise(r => setTimeout(r, 800));
  
  const originalText = DOM.input.value;
  const finalResult = analyzeSymptoms(originalText, state.followUpAnswers);
  displayResult(finalResult, originalText, true);
}

// --- Show Final Result ---
function displayResult(result, originalText, fromFollowUp = false) {
  let html = '';
  
  if (result.isEmergency) {
    html = `
      <div class="emergency-card">
        <h2>⚠️ DİKKAT!</h2>
        <p>${result.emergencyMessage}</p>
        <a href="tel:112" class="emergency-call">📞 112'yi Ara</a>
      </div>
    `;
  } else if (result.isFamilyDoctor) {
    html = `
      <div class="family-card">
        <h3>👨‍⚕️ Aile Hekiminize Başvurabilirsiniz</h3>
        <p>${result.familyDoctorMessage}</p>
        <div class="family-benefits">
          <div class="benefit-item">⏱️ Daha hızlı</div>
          <div class="benefit-item">📍 Daha yakın</div>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="dept-card">
        <div class="dept-label">Önerilen Bölüm</div>
        <div class="dept-name">
          <span class="dept-icon">${result.primaryDepartmentIcon}</span>
          ${result.primaryDepartmentName}
        </div>
        <div class="confidence-badge confidence-${result.confidence}">
          Güven Skoru: %${result.confidenceScore}
        </div>
        <div class="reasoning-box">
          ${result.reasoning}
        </div>
        
        ${result.matchedSymptoms && result.matchedSymptoms.length > 0 ? `
          <div class="matched-symptoms">
            ${result.matchedSymptoms.map(s => `<span class="symptom-tag">🔍 ${s.keyword}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      
      <a href="https://mhrs.gov.tr" target="_blank" class="mhrs-btn">
        📅 MHRS Online Randevu
      </a>
      
      ${result.alternatives && result.alternatives.length > 0 ? `
        <div class="alt-section">
          <div class="alt-title">Alternatif Bölümler</div>
          <div class="alt-tags">
            ${result.alternatives.map(alt => `<span class="alt-tag">${alt.icon} ${alt.name}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="note-box">
        ${result.note}
      </div>
    `;
  }
  
  // Doctor note button
  html += `
    <button class="doctor-note-btn" id="generateNoteBtn">
      📝 Doktora Göstermek İçin Özet Kopyala
    </button>
  `;
  
  DOM.result.innerHTML = html;
  
  if (!fromFollowUp) {
    DOM.result.classList.remove('hidden');
  }
  
  DOM.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Add logical event listeners inside
  document.getElementById('generateNoteBtn')?.addEventListener('click', () => {
    generateDoctorNote(result, originalText);
  });
  
  // Save to history
  saveToHistory(originalText, result);
}

function generateDoctorNote(result, text) {
  const d = new Date().toLocaleDateString('tr-TR');
  let note = `Tarih: ${d}\nPlatform: SağlıkYön Algoritması\n\nHASTA ŞİKAYETİ:\n${text}\n`;
  
  if (state.followUpAnswers.length > 0) {
    note += `\nEK BİLGİLER:\n`;
    state.followUpAnswers.forEach(ans => {
      note += `- ${ans.question} -> ${ans.answer}\n`;
    });
  }
  
  navigator.clipboard.writeText(note).then(() => {
    alert('✅ Doktor notu kopyalandı!');
  }).catch(() => {
    alert('Kopyalama başarısız, lütfen manuel yapın.');
  });
}

// --- History & Stats ---
function saveToHistory(text, result) {
  const deptName = result.isEmergency ? 'ACİL' : 
                   result.isFamilyDoctor ? 'Aile Hekimi' : 
                   result.primaryDepartmentName;
                   
  const item = {
    text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    dept: deptName,
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  };
  
  state.history.unshift(item);
  if (state.history.length > 10) state.history.pop();
  
  localStorage.setItem('sy_history', JSON.stringify(state.history));
  
  state.totalQueries++;
  localStorage.setItem('sy_total_queries', state.totalQueries.toString());
  updateStats();
  renderHistory();
}

function toggleHistoryPanel() {
  DOM.historyPanel.classList.toggle('hidden');
  if (!DOM.historyPanel.classList.contains('hidden')) {
    renderHistory();
  }
}

function renderHistory() {
  if (state.history.length === 0) {
    DOM.historyList.innerHTML = '<p class="history-empty">Henüz sorgulama yapılmadı.</p>';
    return;
  }
  
  DOM.historyList.innerHTML = state.history.map(item => `
    <div class="history-item">
      <div class="history-symptom">"${item.text}"</div>
      <div style="display:flex; justify-content:space-between;">
        <span class="history-dept">${item.dept}</span>
        <span class="history-date">${item.date}</span>
      </div>
    </div>
  `).join('');
}

function clearHistory() {
  state.history = [];
  localStorage.removeItem('sy_history');
  renderHistory();
}

function updateStats() {
  if (DOM.statsBadge) {
    DOM.statsBadge.textContent = state.totalQueries;
  }
}

// --- Voice Recognition ---
let recognition = null;
let isListening = false;

function toggleVoiceInput() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    
    recognition.onstart = () => {
      isListening = true;
      DOM.voiceBtn.classList.add('listening');
      DOM.voiceStatus.textContent = '🎤 Dinliyorum...';
      DOM.voiceStatus.classList.remove('hidden', 'error');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (DOM.input.value.trim()) {
        DOM.input.value += ' ' + transcript;
      } else {
        DOM.input.value = transcript;
      }
      handleInput();
      DOM.voiceStatus.textContent = `✅ "${transcript}" eklendi`;
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    
    recognition.onerror = (event) => {
      DOM.voiceStatus.textContent = '⚠️ Hata: Ses anlaşılamadı veya izin yok.';
      DOM.voiceStatus.classList.add('error');
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    
    recognition.onend = () => {
      isListening = false;
      DOM.voiceBtn.classList.remove('listening');
    };
  }
  
  if (isListening) recognition.stop();
  else recognition.start();
}

// --- Body Map Interactions ---
function initBodyMap() {
  DOM.bodyMapParts.forEach(part => {
    part.addEventListener('click', function(e) {
      e.stopPropagation();
      const region = this.getAttribute('data-region');
      
      // Close others
      DOM.bodyMapParts.forEach(p => p.classList.remove('active'));
      closeAllPopups();
      
      this.classList.add('active');
      showPopup(region);
    });
  });
}

function closeAllPopups() {
  const container = document.getElementById('popupContainer');
  if (container) container.innerHTML = '';
  DOM.bodyMapParts.forEach(p => p.classList.remove('active'));
}

function showPopup(region) {
  const symptomsByRegion = {
    'baş': ['Baş ağrısı', 'Gözlerim bulanık', 'Kulak ağrısı', 'Baş dönmesi'],
    'boyun': ['Boyun ağrısı', 'Boğaz ağrısı', 'Yutkunma güçlüğü'],
    'göğüs': ['Göğüs ağrısı', 'Nefes darlığı', 'Çarpıntı', 'Öksürük'],
    'karın': ['Karın ağrısı', 'Mide bulantısı', 'İshal'],
    'sol kol': ['Sol kol ağrısı', 'Sol el uyuşması'],
    'sağ kol': ['Sağ kol ağrısı', 'Sağ el uyuşması'],
    'sol bacak': ['Sol bacak ağrısı', 'Sol diz ağrısı'],
    'sağ bacak': ['Sağ bacak ağrısı', 'Sağ diz ağrısı']
  };
  
  const options = symptomsByRegion[region];
  if (!options) return;
  
  const popup = document.createElement('div');
  popup.className = `symptom-popup`;
  popup.innerHTML = `
    <div class="popup-header">
      <span class="popup-title">${region.toUpperCase()}</span>
      <button class="popup-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
    <div class="problem-details" style="display:block">
      ${options.map(opt => `<div class="detail-option" data-sym="${opt}">${opt}</div>`).join('')}
    </div>
  `;
  
  document.getElementById('popupContainer').appendChild(popup);
  
  popup.querySelectorAll('.detail-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      const sym = e.target.getAttribute('data-sym');
      const current = DOM.input.value.trim();
      DOM.input.value = current ? `${current}, ${sym}` : sym;
      handleInput();
      closeAllPopups();
    });
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
