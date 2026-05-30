// ============================================
// SağlıkYön – script.js v3
// 4 ekranlı mimari: input → followup → result → emergency
// ============================================

import { analyzeSymptoms } from './engine/analyzer.js';
import { RATE_LIMIT_CONFIG, getRateLimitState, recordRateLimitHit, formatCooldown } from './engine/rate-limit.js';

const RATE_KEY = 'sy_rl';

// ── Yardımcı ──────────────────────────────
const $ = id => document.getElementById(id);
function readJson(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
function saveJson(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function loadRL(now = Date.now()) { return getRateLimitState(readJson(RATE_KEY, []), now, RATE_LIMIT_CONFIG); }

// ── State ─────────────────────────────────
const state = {
  theme: localStorage.getItem('sy_theme') || 'light',
  elderly: false,
  history: readJson('sy_history', []),
  queries: Number(localStorage.getItem('sy_queries') || 0),
  rl: loadRL(),
  isLoading: false,
  followUp: {
    questions: [],
    answers: [],
    index: 0,
  },
};

// ── DOM ───────────────────────────────────
const DOM = {
  input: $('symptomInput'),
  charCount: $('charCount'),
  rateStatus: $('rateLimitStatus'),
  analyzeBtn: $('analyzeBtn'),
  voiceBtn: $('voiceBtn'),
  voiceStatus: $('voiceStatus'),
  errorMsg: $('errorMsg'),
  themeToggle: $('themeToggle'),
  elderlyToggle: $('elderlyToggle'),
  historyBtn: $('historyBtn'),
  historyPanel: $('historyPanel'),
  historyList: $('historyList'),
  closeHistory: $('closeHistory'),
  clearHistory: $('clearHistory'),
  queriesBadge: $('totalQueries'),
  // Screens
  sInput: $('screenInput'),
  sFollowup: $('screenFollowup'),
  sResult: $('screenResult'),
  sEmergency: $('screenEmergency'),
  sLoading: $('loading'),
  // Followup
  followupBody: $('followupBody'),
  progressFill: $('progressFill'),
  progressLabel: $('progressLabel'),
  backToInput: $('backToInput'),
  // Result
  resultContent: $('resultContent'),
  backFromResult: $('backFromResult'),
  // Emergency
  emergencyMsg: $('emergencyMsg'),
  backFromEmerg: $('backFromEmergency'),
};

// ── Ekran yönetimi ────────────────────────
const SCREENS = ['screenInput', 'screenFollowup', 'screenResult', 'screenEmergency', 'loading'];

function showScreen(id) {
  SCREENS.forEach(s => {
    const el = $(s);
    if (el) el.classList.toggle('hidden', s !== id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init ──────────────────────────────────
function init() {
  applyTheme(state.theme);
  updateBadge();
  refreshRL();
  setInterval(refreshRL, 1000);
  bindEvents();
  import('./engine/body-map.js')
    .then(({ initBodyMap }) => initBodyMap(DOM.input, DOM.analyzeBtn))
    .catch(e => console.warn('Body map yüklenemedi:', e));
}

// ── Rate limit UI ─────────────────────────
function refreshRL() {
  state.rl = loadRL();
  const { isLimited, remaining, limit, resetInMs } = state.rl;
  if (DOM.rateStatus) {
    if (isLimited) {
      DOM.rateStatus.textContent = `Limit: ${formatCooldown(resetInMs)} bekleyin`;
      DOM.rateStatus.classList.add('warn');
    } else {
      DOM.rateStatus.textContent = `Kalan: ${remaining}/${limit}`;
      DOM.rateStatus.classList.remove('warn');
    }
  }
  if (DOM.analyzeBtn) DOM.analyzeBtn.disabled = state.isLoading || isLimited;
}

// ── Event listeners ───────────────────────
function bindEvents() {
  DOM.input.addEventListener('input', onInput);
  DOM.input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startAnalysis(); }
  });
  DOM.analyzeBtn.addEventListener('click', startAnalysis);
  DOM.themeToggle.addEventListener('click', toggleTheme);
  DOM.elderlyToggle.addEventListener('click', toggleElderly);
  DOM.historyBtn.addEventListener('click', toggleHistory);
  DOM.closeHistory.addEventListener('click', () => DOM.historyPanel.classList.add('hidden'));
  DOM.clearHistory.addEventListener('click', clearHistory);
  DOM.backToInput.addEventListener('click', () => showScreen('screenInput'));
  DOM.backFromResult.addEventListener('click', () => { showScreen('screenInput'); DOM.input.focus(); });
  DOM.backFromEmerg.addEventListener('click', () => showScreen('screenInput'));

  // Chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      DOM.input.value = c.textContent.replace(' + ', ', ');
      onInput(); DOM.input.focus();
    });
  });

  // Dışarı tıklayınca history kapat
  document.addEventListener('click', e => {
    if (!e.target.closest('#historyPanel') && !e.target.closest('#historyBtn')) {
      DOM.historyPanel.classList.add('hidden');
    }
  });

  // Voice
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    DOM.voiceBtn.addEventListener('click', toggleVoice);
  } else {
    DOM.voiceBtn.classList.add('hidden');
  }
}

function onInput() {
  const len = Math.min(DOM.input.value.length, 500);
  if (DOM.input.value.length > 500) DOM.input.value = DOM.input.value.slice(0, 500);
  DOM.charCount.textContent = len;
  DOM.input.style.height = 'auto';
  DOM.input.style.height = Math.min(DOM.input.scrollHeight, 180) + 'px';
  DOM.errorMsg.classList.add('hidden');
}

// ── Theme ─────────────────────────────────
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  localStorage.setItem('sy_theme', state.theme);
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const icon = DOM.themeToggle.querySelector('.theme-icon');
  if (icon) icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
}

function toggleElderly() {
  state.elderly = !state.elderly;
  document.body.classList.toggle('elderly-mode', state.elderly);
  const lbl = DOM.elderlyToggle.querySelector('.hbtn-label');
  if (lbl) lbl.textContent = state.elderly ? 'Standart' : 'Yaşlı Modu';
  DOM.elderlyToggle.setAttribute('aria-pressed', String(state.elderly));
}

// ── Analysis ──────────────────────────────
async function startAnalysis() {
  const text = DOM.input.value.trim();
  if (text.length < 5) {
    showError('Lütfen şikayetinizi en az 5 karakter ile açıklayın.');
    return;
  }

  const rl = loadRL();
  if (rl.isLimited) {
    showError(`Çok hızlı sorgu. ${formatCooldown(rl.resetInMs)} sonra tekrar deneyin.`);
    return;
  }

  const updated = recordRateLimitHit(rl.timestamps, Date.now(), RATE_LIMIT_CONFIG);
  saveJson(RATE_KEY, updated.timestamps);

  DOM.errorMsg.classList.add('hidden');
  state.isLoading = true;
  refreshRL();
  showScreen('loading');
  animateSteps();

  await new Promise(r => setTimeout(r, 1200));

  try {
    const result = analyzeSymptoms(text);

    if (result.error) {
      showScreen('screenInput');
      showError(result.error);
    } else if (result.noMatch) {
      showScreen('screenInput');
      showError(result.message || 'Şikayetinizi anlayamadım. Lütfen daha detaylı yazın.');
    } else if (result.isEmergency) {
      showEmergency(result);
    } else if (result.needsMoreInfo) {
      startFollowUp(result, text);
    } else {
      showResult(result, text);
    }
  } catch (err) {
    console.error(err);
    showScreen('screenInput');
    showError('Analiz hatası. Lütfen tekrar deneyin.');
  } finally {
    state.isLoading = false;
    refreshRL();
  }
}

function animateSteps() {
  [0, 1, 2].forEach(i => $('ls' + i)?.classList.remove('active'));
  setTimeout(() => $('ls0')?.classList.add('active'), 100);
  setTimeout(() => $('ls1')?.classList.add('active'), 500);
  setTimeout(() => $('ls2')?.classList.add('active'), 900);
}

function showError(msg) {
  DOM.errorMsg.innerHTML = `<span class="material-symbols-outlined">warning</span><span>${msg}</span>`;
  DOM.errorMsg.classList.remove('hidden');
}

// ── Emergency ─────────────────────────────
function showEmergency(result) {
  DOM.emergencyMsg.textContent = result.emergencyMessage || 'Belirtileriniz acil müdahale gerektirebilir.';
  showScreen('screenEmergency');
  saveToHistory(DOM.input.value, result);
}

// ── Follow-up ─────────────────────────────
function startFollowUp(result, text) {
  state.followUp.questions = result.followUpQuestions || [];
  state.followUp.answers = [];
  state.followUp.index = 0;
  state._originalText = text;
  state._partialResult = result;
  showScreen('screenFollowup');
  renderFollowUp();
}

function renderFollowUp() {
  const { questions, index } = state.followUp;
  const total = questions.length;

  // Progress
  const pct = total > 0 ? (index / total) * 100 : 0;
  DOM.progressFill.style.width = pct + '%';
  DOM.progressLabel.textContent = `${index + 1} / ${total}`;

  if (index >= total) { finishFollowUp(); return; }

  const q = questions[index];
  const type = q.type || 'yesno'; // yesno | duration | severity

  const card = document.createElement('div');
  card.className = 'fq-card';
  card.innerHTML = `
    <div class="fq-symptom-tag">
      <span class="material-symbols-outlined" style="font-size:12px">clinical_notes</span>
      ${q.symptomId || 'Ek Bilgi'}
    </div>
    <div class="fq-question">${q.question}</div>
    ${renderQuestionInputs(q, type)}
  `;

  DOM.followupBody.innerHTML = '';
  DOM.followupBody.appendChild(card);

  // Event'leri bağla
  bindQuestionEvents(card, q, type);
}

function renderQuestionInputs(q, type) {
  if (type === 'duration') {
    const opts = ['Bugün başladı', '2-3 gündür', '1 haftadır', '1 aydan uzun'];
    return `<div class="fq-options">${opts.map(o => `
      <button class="fq-option" data-val="${o}">
        <span class="fq-option-dot"></span>${o}
      </button>`).join('')}</div>`;
  }

  if (type === 'severity') {
    const opts = ['Hafif', 'Orta', 'Şiddetli', 'Dayanılmaz'];
    return `<div class="fq-options">${opts.map(o => `
      <button class="fq-option" data-val="${o}">
        <span class="fq-option-dot"></span>${o}
      </button>`).join('')}</div>`;
  }

  // Varsayılan: yesno
  return `
    <div class="fq-yesno">
      <button class="fq-btn" data-val="Evet">
        <span class="material-symbols-outlined">check</span>Evet
      </button>
      <button class="fq-btn" data-val="Hayır">
        <span class="material-symbols-outlined">close</span>Hayır
      </button>
      <button class="fq-btn" data-val="Emin Değilim">
        <span class="material-symbols-outlined">help</span>Emin Değilim
      </button>
    </div>`;
}

function bindQuestionEvents(card, q, type) {
  const btns = card.querySelectorAll('.fq-btn, .fq-option');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.disabled = true);
      const val = btn.getAttribute('data-val');

      // Görsel seçim
      if (type === 'yesno') {
        btn.classList.add(val === 'Evet' ? 'selected-yes' : val === 'Hayır' ? 'selected-no' : 'selected-skip');
      } else {
        btn.classList.add('selected');
      }

      // Cevabı kaydet
      state.followUp.answers.push({
        question: q.question,
        answer: val,
        impact: q.impact || {},
      });

      state.followUp.index++;
      setTimeout(renderFollowUp, 350);
    });
  });
}

async function finishFollowUp() {
  // Tüm cevaplarla yeniden analiz
  DOM.followupBody.innerHTML = `
    <div class="fq-card" style="text-align:center;padding:40px">
      <div class="loading-ring" style="margin:0 auto 16px"><div class="ring-track"></div>
        <span class="material-symbols-outlined loading-icon">biotech</span></div>
      <p style="font-weight:600;color:var(--text-2)">Cevaplarınız değerlendiriliyor…</p>
    </div>`;

  await new Promise(r => setTimeout(r, 600));

  const result = analyzeSymptoms(state._originalText, state.followUp.answers);

  if (result.isEmergency) {
    showEmergency(result);
  } else {
    showResult(result, state._originalText, true);
  }
}

// ── Result ────────────────────────────────
function showResult(result, text, fromFollowUp = false) {
  DOM.resultContent.innerHTML = result.isFamilyDoctor
    ? renderFamilyCard(result)
    : renderDeptCard(result);

  showScreen('screenResult');

  // Confidence bar animate
  requestAnimationFrame(() => {
    const bar = document.getElementById('confFill');
    if (bar) bar.style.width = (result.confidenceScore || 0) + '%';
  });

  document.getElementById('copyBtn')?.addEventListener('click', () => copyNote(result, text));
  saveToHistory(text, result);
}

function renderTriageBanner(result) {
  const level = result.careLevel || 'routine';
  const map = {
    emergency: { cls: 'emergency', icon: 'emergency', label: result.careLabel || 'Acil değerlendirme' },
    urgent: { cls: 'urgent', icon: 'schedule', label: result.careLabel || 'Aynı gün randevu' },
    soon: { cls: 'soon', icon: 'event', label: result.careLabel || 'Kısa sürede randevu' },
    routine: { cls: 'routine', icon: 'calendar_month', label: result.careLabel || 'Rutin poliklinik' },
  };
  const { cls, icon, label } = map[level] || map.routine;
  return `
    <div class="triage-banner ${cls}">
      <div class="triage-icon"><span class="material-symbols-outlined">${icon}</span></div>
      <div>
        <div class="triage-label">${label}</div>
        ${result.careAdvice ? `<div class="triage-desc">${result.careAdvice}</div>` : ''}
      </div>
    </div>`;
}

function renderDeptCard(result) {
  const score = result.confidenceScore || 0;
  const confText = score >= 72 ? 'Yüksek güven' : score >= 55 ? 'Orta güven' : 'Düşük güven';

  const symptoms = result.matchedSymptoms?.length ? `
    <div class="dept-symptoms-section">
      <div class="dept-symptoms-label">Tespit edilen belirtiler</div>
      <div class="symptom-tags">
        ${result.matchedSymptoms.map(s => `
          <span class="symptom-tag">
            <span class="material-symbols-outlined">check_circle</span>
            ${s.keyword || s}
          </span>`).join('')}
      </div>
    </div>` : '';

  const alts = result.alternatives?.length ? `
    <div class="alt-section">
      <span class="alt-label">Diğer olasılıklar:</span>
      ${result.alternatives.map(a => `<span class="alt-tag">${a.icon || ''} ${a.name}</span>`).join('')}
    </div>` : '';

  return `
    ${renderTriageBanner(result)}
    <div class="dept-card">
      <div class="dept-card-glow"></div>
      <div class="dept-card-body">
        <div class="dept-overline">
          <span class="material-symbols-outlined">stethoscope</span>
          Önerilen Bölüm
        </div>
        <div class="dept-name">${result.primaryDepartmentName || '—'}</div>
        <p class="dept-reasoning">${result.reasoning || ''}</p>
        <div class="conf-row">
          <div class="conf-track">
            <div class="conf-fill" id="confFill" style="width:0%"></div>
          </div>
          <span class="conf-label">${confText} · %${score}</span>
        </div>
      </div>
      ${symptoms}
      ${alts}
      <div class="dept-card-footer">
        <a href="https://mhrs.gov.tr" target="_blank" rel="noopener" class="btn-mhrs">
          <span class="material-symbols-outlined">calendar_month</span>
          MHRS Randevu
        </a>
        <button class="btn-copy" id="copyBtn">
          <span class="material-symbols-outlined">content_copy</span>
          Özet Kopyala
        </button>
      </div>
    </div>
    <div class="result-disclaimer">
      <span class="material-symbols-outlined">info</span>
      <span>${result.note || 'Bu öneri teşhis değildir. Kesin tanı için doktora gidiniz.'}</span>
    </div>`;
}

function renderFamilyCard(result) {
  return `
    ${renderTriageBanner(result)}
    <div class="family-card">
      <div class="family-top">
        <div class="family-icon"><span class="material-symbols-outlined">stethoscope</span></div>
        <div>
          <div class="family-title">Aile Hekiminize Başvurun</div>
          <div class="family-sub">Belirtileriniz aile hekimi düzeyinde değerlendirilebilir.</div>
        </div>
      </div>
      <div class="family-body">
        <p class="family-msg">${result.familyDoctorMessage || 'Gerekirse doğru branşa yönlendirme yapılabilir.'}</p>
        <div class="family-benefits">
          <div class="benefit-item"><span class="material-symbols-outlined">schedule</span><span>Daha hızlı randevu</span></div>
          <div class="benefit-item"><span class="material-symbols-outlined">location_on</span><span>Daha yakın konum</span></div>
          <div class="benefit-item"><span class="material-symbols-outlined">swap_horiz</span><span>Sevk kolaylığı</span></div>
        </div>
      </div>
      <div class="family-footer">
        <a href="https://mhrs.gov.tr" target="_blank" rel="noopener" class="btn-mhrs">
          <span class="material-symbols-outlined">calendar_month</span>MHRS Randevu
        </a>
        <button class="btn-copy" id="copyBtn">
          <span class="material-symbols-outlined">content_copy</span>Özet Kopyala
        </button>
      </div>
    </div>
    <div class="result-disclaimer">
      <span class="material-symbols-outlined">info</span>
      <span>${result.note || 'Bu öneri teşhis değildir. Kesin tanı için doktora gidiniz.'}</span>
    </div>`;
}

// ── Copy note ─────────────────────────────
function copyNote(result, text) {
  const d = new Date().toLocaleDateString('tr-TR');
  let note = `SağlıkYön – ${d}\n\nŞikayet: ${text}\n\n`;
  if (result.isEmergency) {
    note += `⚠️ Acil: ${result.emergencyMessage}`;
  } else {
    note += `Önerilen Bölüm: ${result.primaryDepartmentName || 'Aile Hekimi'}\n`;
    note += `Aciliyet: ${result.careLabel || ''}\n`;
    if (result.confidenceScore) note += `Güven: %${result.confidenceScore}\n`;
    if (result.matchedSymptoms?.length)
      note += `Belirtiler: ${result.matchedSymptoms.map(s => s.keyword || s).join(', ')}\n`;
  }
  if (state.followUp.answers.length) {
    note += `\nEk Bilgiler:\n`;
    state.followUp.answers.forEach(a => { note += `- ${a.question}: ${a.answer}\n`; });
  }
  note += `\nBu öneri teşhis değildir.`;

  navigator.clipboard.writeText(note).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.innerHTML = '<span class="material-symbols-outlined">check</span>Kopyalandı';
      btn.style.color = 'var(--green)';
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>Özet Kopyala';
        btn.style.color = '';
      }, 2500);
    }
  }).catch(() => alert('Kopyalanamadı.'));
}

// ── History ───────────────────────────────
function saveToHistory(text, result) {
  const dept = result.isEmergency ? '🚨 ACİL'
    : result.isFamilyDoctor ? '👨‍⚕️ Aile Hekimi'
      : result.primaryDepartmentName || '—';
  state.history.unshift({
    text: text.slice(0, 60) + (text.length > 60 ? '…' : ''),
    dept,
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  });
  if (state.history.length > 10) state.history.pop();
  saveJson('sy_history', state.history);
  state.queries++;
  localStorage.setItem('sy_queries', state.queries);
  updateBadge();
  renderHistory();
}
function updateBadge() {
  if (DOM.queriesBadge) DOM.queriesBadge.textContent = state.queries;
}
function toggleHistory() {
  const hidden = DOM.historyPanel.classList.toggle('hidden');
  if (!hidden) renderHistory();
}
function renderHistory() {
  if (!state.history.length) {
    DOM.historyList.innerHTML = '<p class="hp-empty">Henüz sorgulama yok.</p>';
    return;
  }
  DOM.historyList.innerHTML = state.history.map(item => `
    <div class="hp-item" data-text="${item.text.replace(/"/g, '&quot;')}">
      <div class="hp-symptom">"${item.text}"</div>
      <div class="hp-meta">
        <span class="hp-dept">${item.dept}</span>
        <span class="hp-date">${item.date}</span>
      </div>
    </div>`).join('');
  DOM.historyList.querySelectorAll('.hp-item').forEach(el => {
    el.addEventListener('click', () => {
      DOM.input.value = el.dataset.text.replace('…', '');
      onInput();
      DOM.historyPanel.classList.add('hidden');
      showScreen('screenInput');
      DOM.input.focus();
    });
  });
}
function clearHistory() {
  state.history = [];
  localStorage.removeItem('sy_history');
  renderHistory();
}

// ── Voice ─────────────────────────────────
let recog = null, listening = false;
function toggleVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  if (!recog) {
    recog = new SR();
    recog.lang = 'tr-TR';
    recog.onstart = () => {
      listening = true;
      DOM.voiceBtn.classList.add('listening');
      DOM.voiceStatus.textContent = 'Dinliyorum…';
      DOM.voiceStatus.classList.remove('hidden', 'error');
    };
    recog.onresult = e => {
      const t = e.results[0][0].transcript;
      DOM.input.value = DOM.input.value.trim() ? DOM.input.value + ' ' + t : t;
      onInput();
      DOM.voiceStatus.textContent = `✓ "${t}" eklendi`;
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    recog.onerror = () => {
      DOM.voiceStatus.textContent = 'Ses anlaşılamadı.';
      DOM.voiceStatus.classList.add('error');
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    recog.onend = () => { listening = false; DOM.voiceBtn.classList.remove('listening'); };
  }
  if (listening) recog.stop(); else recog.start();
}

// ── Start ─────────────────────────────────
document.addEventListener('DOMContentLoaded', init);