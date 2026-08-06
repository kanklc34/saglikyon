// ============================================
// SağlıkYön – script.js v4
// Dil desteği: TR / EN toggle
// ============================================

import { analyzeSymptoms, DEPARTMENTS } from './engine/analyzer.js';
import { STRINGS } from './engine/i18n.js';
import { RATE_LIMIT_CONFIG, getRateLimitState, recordRateLimitHit, formatCooldown } from './engine/rate-limit.js';
import { getSemanticCandidates } from './engine/semantic-fallback.js';

const RATE_KEY = 'sy_rl';

// ── Yardımcı ──────────────────────────────
const $ = id => document.getElementById(id);
function readJson(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
function saveJson(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function loadRL(now = Date.now()) { return getRateLimitState(readJson(RATE_KEY, []), now, RATE_LIMIT_CONFIG); }

// ── State ─────────────────────────────────
const state = {
  theme: localStorage.getItem('sy_theme') || 'light',
  lang: localStorage.getItem('sy_lang') || 'tr',
  elderly: false,
  history: readJson('sy_history', []),
  queries: Number(localStorage.getItem('sy_queries') || 0),
  rl: loadRL(),
  isLoading: false,
  followUp: { questions: [], answers: [], index: 0 },
};

// ── Strings shortcut ──────────────────────
function t() { return STRINGS[state.lang]; }

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
  langToggle: $('langToggle'),
  historyBtn: $('historyBtn'),
  historyPanel: $('historyPanel'),
  historyList: $('historyList'),
  closeHistory: $('closeHistory'),
  clearHistory: $('clearHistory'),
  queriesBadge: $('totalQueries'),
  sInput: $('screenInput'),
  sFollowup: $('screenFollowup'),
  sResult: $('screenResult'),
  sEmergency: $('screenEmergency'),
  sLoading: $('loading'),
  followupBody: $('followupBody'),
  progressFill: $('progressFill'),
  progressLabel: $('progressLabel'),
  backToInput: $('backToInput'),
  resultContent: $('resultContent'),
  backFromResult: $('backFromResult'),
  emergencyMsg: $('emergencyMsg'),
  backFromEmerg: $('backFromEmergency'),
};

// ── Ekran yönetimi ────────────────────────
const SCREENS = ['screenInput', 'screenBodyMap', 'screenFollowup', 'screenResult', 'screenEmergency', 'loading'];
function showScreen(id) {
  SCREENS.forEach(s => { const el = $(s); if (el) el.classList.toggle('hidden', s !== id); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Dil güncelleme ────────────────────────
function applyLang() {

  const s = t();
  // Header
  const langBtn = DOM.langToggle;
  if (langBtn) langBtn.querySelector('.hbtn-label').textContent = s.langToggle;
  const elderlyLbl = DOM.elderlyToggle?.querySelector('.hbtn-label');
  if (elderlyLbl) elderlyLbl.textContent = state.elderly ? s.standardMode : s.elderlyMode;

  // Hero
  const eyebrow = document.querySelector('.hero-eyebrow span:last-child');
  if (eyebrow) eyebrow.textContent = s.eyebrow;
  const heroH1 = document.querySelector('.hero-h1');
  if (heroH1) heroH1.textContent = s.heroTitle;
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = s.heroSub;

  // Input
  DOM.input.placeholder = s.placeholder;
  const analyzeBtnText = DOM.analyzeBtn.querySelector('span:not(.material-symbols-outlined)');
  if (analyzeBtnText) {
    analyzeBtnText.textContent = s.analyzeBtn;
  } else {
    DOM.analyzeBtn.innerHTML = `<span class="material-symbols-outlined">search</span><span>${s.analyzeBtn}</span>`;
  }

  // Chips
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip, i) => { if (s.chips[i]) chip.textContent = s.chips[i]; });

  // Body map hint
  const hint = document.querySelector('.bm-hint span:last-child');
  if (hint) hint.textContent = s.bodyMapHint;
  const bmToggleLabel = document.querySelector('#bmToggle > span:first-child');
  if (bmToggleLabel) bmToggleLabel.lastChild.textContent = ' ' + s.bmToggleLabel;
  const bodyMapScreenTitle = document.getElementById('bodyMapScreenTitle');
  if (bodyMapScreenTitle) bodyMapScreenTitle.textContent = s.bodyMapScreenTitle;

  const sevEls = document.querySelectorAll('.severity-row .sev');
  if (sevEls.length === 3) {
    sevEls[0].textContent = s.sevEmergency;
    sevEls[1].textContent = s.sevSoon;
    sevEls[2].textContent = s.sevRoutine;
  }

  // View tabs
  const tabFront = $('tabFront');
  const tabBack = $('tabBack');
  if (tabFront) tabFront.textContent = s.viewFront;
  if (tabBack) tabBack.textContent = s.viewBack;

  // Trust row
  const trustItems = document.querySelectorAll('.trust-item span:last-child');
  trustItems.forEach((item, i) => { if (s.trust[i]) item.textContent = s.trust[i]; });

  // Loading steps
  const loadingSteps = document.querySelectorAll('.ls');
  loadingSteps.forEach((step, i) => { if (s.loadingSteps[i]) step.textContent = s.loadingSteps[i]; });

  // Loading title
  const loadingTitle = document.querySelector('.loading-title');
  if (loadingTitle) loadingTitle.textContent = s.loadingTitle;

  // History
  const histTitle = document.querySelector('.hp-header h3');
  if (histTitle) histTitle.textContent = s.historyTitle;
  if (!state.history.length) {
    const empty = document.querySelector('.hp-empty');
    if (empty) empty.textContent = s.historyEmpty;
  }
  const clearBtn = DOM.clearHistory;
  if (clearBtn) clearBtn.querySelector('span:last-child') && (clearBtn.innerHTML = `<span class="material-symbols-outlined">delete</span> ${s.clearHistory}`);

  // Back buttons
  const backResult = DOM.backFromResult;
  if (backResult) backResult.innerHTML = `<span class="material-symbols-outlined">arrow_back</span> ${s.newQuery}`;

  // Emergency
  const emergTitle = document.querySelector('.emergency-title');
  if (emergTitle) emergTitle.textContent = s.emergencyTitle;
  const callBtn = document.querySelector('.btn-112');
  if (callBtn) callBtn.innerHTML = `<span class="material-symbols-outlined">phone_in_talk</span> ${s.callBtn}`;
  const emergNote = document.querySelector('.emergency-note');
  if (emergNote) emergNote.textContent = s.emergencyNote;

  const eyebrowEl = document.getElementById('eyebrowText');
  if (eyebrowEl) eyebrowEl.textContent = s.eyebrow;

  // Footer
  const footerWarn = document.querySelector('.footer span:first-child');
  if (footerWarn) footerWarn.textContent = s.footerWarning;

  // Voice lang
  if (window._recog) {
    window._recog.lang = state.lang === 'en' ? 'en-US' : 'tr-TR';
  }

  // Rate limit yenile
  refreshRL();
}

// ── Init ──────────────────────────────────
function init() {
  applyTheme(state.theme);
  applyLang();
  updateBadge();
  refreshRL();
  setInterval(refreshRL, 1000);
  bindEvents();
  import('./engine/body-map.js')
    .then(({ initBodyMap }) => initBodyMap(DOM.input, DOM.analyzeBtn, state.lang))
    .catch(e => console.warn('Body map yüklenemedi:', e));
}

// ── Rate limit UI ─────────────────────────
function refreshRL() {
  state.rl = loadRL();
  const { isLimited, remaining, limit, resetInMs } = state.rl;
  if (DOM.rateStatus) {
    if (isLimited) {
      DOM.rateStatus.textContent = (t()?.rateLimitWait || 'Limit: {t}').replace('{t}', formatCooldown(resetInMs));
      DOM.rateStatus.classList.add('warn');
    } else {
      DOM.rateStatus.textContent = (t()?.rateLimitRemaining || 'Kalan: {r}/{l}').replace('{r}', remaining).replace('{l}', limit);
      DOM.rateStatus.classList.remove('warn');
    }
  }
  if (DOM.analyzeBtn) DOM.analyzeBtn.disabled = state.isLoading || isLimited;
}

// ── Events ────────────────────────────────
function bindEvents() {
  DOM.input.addEventListener('input', onInput);
  DOM.input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startAnalysis(); } });
  DOM.analyzeBtn.addEventListener('click', startAnalysis);
  DOM.themeToggle.addEventListener('click', toggleTheme);
  DOM.elderlyToggle.addEventListener('click', toggleElderly);
  if (DOM.langToggle) DOM.langToggle.addEventListener('click', toggleLang);
  DOM.historyBtn.addEventListener('click', toggleHistory);
  DOM.closeHistory.addEventListener('click', () => DOM.historyPanel.classList.add('hidden'));
  DOM.clearHistory.addEventListener('click', clearHistory);
  DOM.backToInput.addEventListener('click', () => showScreen('screenInput'));
  DOM.backFromResult.addEventListener('click', () => { showScreen('screenInput'); DOM.input.focus(); });

  // Logo/marka: sayfanın herhangi bir ekranından (sonuç, soru, acil, vücut
  // haritası) tek tıkla ana giriş ekranına dönüş sağlamalı — href="#" tek
  // başına hiçbir şey yapmıyordu, sayfa en üste bile kaymıyordu.
  const brandHome = document.getElementById('brandHome');
  if (brandHome) {
    brandHome.addEventListener('click', (e) => {
      e.preventDefault();
      showScreen('screenInput');
    });
  }
  DOM.backFromEmerg.addEventListener('click', () => showScreen('screenInput'));

  const bmToggle = document.getElementById('bmToggle');
  if (bmToggle) {
    bmToggle.addEventListener('click', () => showScreen('screenBodyMap'));
  }
  const backFromBodyMap = document.getElementById('backFromBodyMap');
  if (backFromBodyMap) {
    backFromBodyMap.addEventListener('click', () => showScreen('screenInput'));
  }

  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => { DOM.input.value = c.textContent.replace(' + ', ', '); onInput(); DOM.input.focus(); });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#historyPanel') && !e.target.closest('#historyBtn')) DOM.historyPanel.classList.add('hidden');
  });

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
function applyTheme(th) {
  document.documentElement.setAttribute('data-theme', th);
  const icon = DOM.themeToggle.querySelector('.theme-icon');
  if (icon) icon.textContent = th === 'dark' ? 'light_mode' : 'dark_mode';
}

function toggleElderly() {
  state.elderly = !state.elderly;
  document.body.classList.toggle('elderly-mode', state.elderly);
  const lbl = DOM.elderlyToggle.querySelector('.hbtn-label');
  if (lbl) lbl.textContent = state.elderly ? t().standardMode : t().elderlyMode;
  DOM.elderlyToggle.setAttribute('aria-pressed', String(state.elderly));
}

function toggleLang() {
  state.lang = state.lang === 'tr' ? 'en' : 'tr';
  localStorage.setItem('sy_lang', state.lang);
  applyLang();
  import('./engine/body-map.js')
    .then(({ setBodyMapLang }) => setBodyMapLang(state.lang))
    .catch(() => { });
}

// ── Analysis ──────────────────────────────
async function startAnalysis() {
  const text = DOM.input.value.trim();
  if (text.length < 5) { showError(t().errorMin); return; }

  const rl = loadRL();
  if (rl.isLimited) { showError(t().errorRateLimit.replace('{t}', formatCooldown(rl.resetInMs))); return; }

  const updated = recordRateLimitHit(rl.timestamps, Date.now(), RATE_LIMIT_CONFIG);
  saveJson(RATE_KEY, updated.timestamps);

  DOM.errorMsg.classList.add('hidden');
  state.isLoading = true;
  refreshRL();
  showScreen('loading');
  animateSteps();

  await new Promise(r => setTimeout(r, 1200));

  try {
    const result = analyzeSymptoms(text, null, state.lang, t().followUpUniversal);

    if (result.error) { showScreen('screenInput'); showError(result.error); }
    else if (result.noMatch) { await tryShowSemanticSuggestions(text); }
    else if (result.isEmergency) { showEmergency(result, text); }
    else if (result.needsMoreInfo) { startFollowUp(result, text); }
    else { showResult(result, text); }
  } catch (err) {
    console.error(err);
    showScreen('screenInput');
    showError(t().errorAnalysis);
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

// ── Semantik Fallback ─────────────────────
// Lexical motor hiçbir eşleşme bulamadığında (noMatch: true) devreye
// girer. Model 118MB olduğu için burada ilk kez indirilir — kasıtlı
// olarak lazy, çoğu kullanıcı bu koda hiç girmeyecek.
async function tryShowSemanticSuggestions(text) {
  showScreen('loading');
  const candidates = await getSemanticCandidates(text, 3);
  if (candidates.length === 0) {
    // Model inemedi, ağ sorunu, ya da anlamsal olarak da hiçbir şey
    // bulunamadı — eski, düz "anlayamadım" mesajına düşüyoruz.
    showScreen('screenInput');
    showError(t().errorNoMatch);
    return;
  }
  showSemanticSuggestionScreen(candidates, text);
}

function showSemanticSuggestionScreen(candidates, text) {
  const s = t();

  const cardsHtml = candidates.map(c => {
    const dept = DEPARTMENTS[c.department];
    const name = dept?.name || c.department;
    const icon = dept?.icon || '';
    return `
      <button class="semantic-suggestion-card" data-department="${c.department}" type="button">
        <span class="semantic-suggestion-icon">${icon}</span>
        <span>${name}</span>
      </button>`;
  }).join('');

  DOM.resultContent.innerHTML = `
    <div class="semantic-suggestion-box">
      <div class="semantic-disclaimer">
        <span class="material-symbols-outlined">info</span>
        <span>${s.semanticDisclaimer}</span>
      </div>
      <p class="semantic-pick-prompt">${s.semanticPickPrompt}</p>
      <div class="semantic-suggestion-list">${cardsHtml}</div>
      <button class="semantic-none-btn" id="semanticNoneBtn" type="button">${s.semanticNoneApply}</button>
    </div>`;

  showScreen('screenResult');

  DOM.resultContent.querySelectorAll('.semantic-suggestion-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const department = btn.dataset.department;
      showSemanticConfirmedResult(department, text);
    });
  });

  document.getElementById('semanticNoneBtn')?.addEventListener('click', () => {
    showScreen('screenInput');
    showError(t().errorNoMatch);
  });
}

// Kullanıcı 3 adaydan birini seçtikten sonraki basit onay kartı.
// BİLİNÇLİ OLARAK renderDeptCard'ın güven-yüzdesi barını (conf-row)
// EKLEMİYORUZ — embedding benzerlik skoru, lexical motorun 0-100 güven
// skalasıyla aynı anlama gelmiyor; ikisini aynı görselde göstermek
// yanlış bir kesinlik izlenimi verir. Görsel iskeleti (.dept-card,
// .dept-overline) mevcut renderDeptCard ile TUTARLI tutuyoruz, sadece
// güven barını ve semptom/alternatif bölümlerini çıkarıyoruz.
function showSemanticConfirmedResult(department, text) {
  const s = t();
  const dept = DEPARTMENTS[department];
  const name = dept?.name || department;

  DOM.resultContent.innerHTML = `
    <div class="dept-card">
      <div class="dept-card-glow"></div>
      <div class="dept-card-body">
        <div class="dept-overline">
          <span class="material-symbols-outlined">stethoscope</span>
          ${s.suggestedDept}
        </div>
        <div class="dept-name">${name}</div>
        <p class="dept-reasoning">${s.semanticDisclaimer}</p>
      </div>
    </div>`;

  showScreen('screenResult');
}

// ── Emergency ─────────────────────────────
function showEmergency(result, originalText) {
  DOM.emergencyMsg.textContent = result.emergencyMessage || t().emergencyDefault;
  showScreen('screenEmergency');
  saveToHistory(DOM.input.value, result);

  const verifyBox = document.getElementById('emergencyVerify');
  if (result.verification && originalText) {
    const v = result.verification;
    document.getElementById('emergencyVerifyQuestion').textContent = v.question;
    const confirmBtn = document.getElementById('emergencyVerifyConfirm');
    const reassureBtn = document.getElementById('emergencyVerifyReassure');
    confirmBtn.textContent = v.confirmLabel;
    reassureBtn.textContent = v.reassureLabel;

    confirmBtn.onclick = () => {
      // Kullanıcı kırmızı bayrağı doğruladı — uyarı kesinleşir, soru kapanır.
      verifyBox.classList.add('hidden');
    };
    reassureBtn.onclick = async () => {
      // Kullanıcı bu belirtinin endişe verici olmadığını söyledi — bu TEK
      // kırmızı bayrağı dışlayıp analizi yeniden çalıştırıyoruz. Başka bir
      // kırmızı bayrak hâlâ eşleşiyorsa (örn. iki ayrı ciddi belirti aynı
      // anda varsa) acil ekranı kalır; yoksa normal akışa (sonuç/takip
      // sorusu) güvenle geçilir.
      state.isLoading = true;
      try {
        const r2 = analyzeSymptoms(originalText, null, state.lang, t().followUpUniversal, [v.symptomId]);
        if (r2.isEmergency) { showEmergency(r2, originalText); }
        else if (r2.needsMoreInfo) { startFollowUp(r2, originalText); }
        else if (r2.noMatch) { showScreen('screenInput'); showError(r2.message || t().errorNoMatch); }
        else { showResult(r2, originalText); }
      } catch (err) {
        console.error(err);
      } finally {
        state.isLoading = false;
      }
    };
    verifyBox.classList.remove('hidden');
  } else {
    verifyBox.classList.add('hidden');
  }
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
  const pct = total > 0 ? (index / total) * 100 : 0;
  DOM.progressFill.style.width = pct + '%';
  DOM.progressLabel.textContent = `${index + 1} / ${total}`;

  if (index >= total) { finishFollowUp(); return; }

  const q = questions[index];
  const type = q.type || 'yesno';
  const isAgeBandQuestion = q.symptomId === '__age_band__';

  const card = document.createElement('div');
  card.className = 'fq-card';
  card.innerHTML = `
    <div class="fq-symptom-tag">
      <span class="material-symbols-outlined" style="font-size:12px">${isAgeBandQuestion ? 'group' : 'clinical_notes'}</span> ${isAgeBandQuestion ? 'Genel' : (q.symptomId || '')}
    </div>
    <div class="fq-question">${q.question}</div>
    ${renderQuestionInputs(q, type)}
  `;

  DOM.followupBody.innerHTML = '';
  DOM.followupBody.appendChild(card);
  bindQuestionEvents(card, q, type);
}

function renderQuestionInputs(q, type) {
  const s = t();

  if (type === 'options' && q.options) {
    return `<div class="fq-options">${q.options.map(o => `
      <button class="fq-option" data-val="${o}">
        <span class="fq-option-dot"></span> ${o}
      </button>`).join('')}</div>`;
  }

  // yesno (varsayılan)
  return `
    <div class="fq-yesno">
      <button class="fq-btn" data-val="${s.yesBtn}">
        <span class="material-symbols-outlined">check</span> ${s.yesBtn}
      </button>
      <button class="fq-btn" data-val="${s.noBtn}">
        <span class="material-symbols-outlined">close</span> ${s.noBtn}
      </button>
      <button class="fq-btn" data-val="${s.unsureBtn}">
        <span class="material-symbols-outlined">help</span> ${s.unsureBtn}
      </button>
    </div>`;
}

function bindQuestionEvents(card, q, type) {
  const s = t();
  const btns = card.querySelectorAll('.fq-btn, .fq-option');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.disabled = true);
      const val = btn.getAttribute('data-val');

      if (type === 'yesno') {
        btn.classList.add(val === s.yesBtn ? 'selected-yes' : val === s.noBtn ? 'selected-no' : 'selected-skip');
      } else {
        btn.classList.add('selected');
      }

      state.followUp.answers.push({
        question: q.question,
        answer: val,
        impact: q.impact || {},
        selectedOption: type === 'options' ? val : undefined,
        options: q.options,
        optionDays: q.optionDays,
        thresholdDays: q.thresholdDays,
        optionWeights: q.optionWeights,
        symptomId: q.symptomId,
        ageBandValues: q.ageBandValues,
      });

      state.followUp.index++;
      setTimeout(renderFollowUp, 350);
    });
  });
}

async function finishFollowUp() {
  DOM.followupBody.innerHTML = `
    <div class="fq-card" style="text-align:center;padding:40px">
      <div class="loading-ring" style="margin:0 auto 16px"><div class="ring-track"></div>
        <span class="material-symbols-outlined loading-icon">biotech</span></div>
      <p style="font-weight:600;color:var(--text-2)">${t().evaluating}</p>
    </div>`;

  await new Promise(r => setTimeout(r, 600));
  const result = analyzeSymptoms(state._originalText, state.followUp.answers, state.lang, t().followUpUniversal);
  if (result.isEmergency) showEmergency(result, state._originalText);
  else showResult(result, state._originalText, true);
}

// ── Result ────────────────────────────────
const AGE_BAND_LABELS = {
  bebek: 'Bebek (0-2 yaş)',
  cocuk: 'Çocuk (2-12 yaş)',
  yetiskin: 'Genç/Yetişkin (12-65 yaş)',
  yasli: '65 yaş üstü',
};

// Sonuç ekranında hangi yaş grubunun kullanıldığını HER ZAMAN görünür
// yapıyoruz — sessiz, düzeltilemez bir varsayım olmasın diye. "Varsayılan"
// ibaresi, kullanıcı soruyu cevaplamadıysa (metinden de çıkarılamadıysa)
// gösteriliyor; bu durumda kullanıcı yanlış olduğunu fark edip yeniden
// başlatabilir.
function renderAgeBandLabel(result) {
  if (!result.ageBand) return '';
  const label = AGE_BAND_LABELS[result.ageBand] || result.ageBand;
  const suffix = result.ageBandWasAssumed ? ' (varsayılan)' : '';
  return `<div class="age-band-label"><span class="material-symbols-outlined">group</span> Bu değerlendirme: <strong>${label}${suffix}</strong> için yapıldı</div>`;
}

function showResult(result, text, fromFollowUp = false) {
  DOM.resultContent.innerHTML = (result.isFamilyDoctor ? renderFamilyCard(result) : renderDeptCard(result)) + renderAgeBandLabel(result) + renderFeedbackWidget();
  showScreen('screenResult');

  requestAnimationFrame(() => {
    const bar = document.getElementById('confFill');
    if (bar) bar.style.width = (result.confidenceScore || 0) + '%';
  });

  document.getElementById('copyBtn')?.addEventListener('click', () => copyNote(result, text));
  bindFeedbackWidget(result, text);
  bindConfInfo();
  saveToHistory(text, result);
}

function bindConfInfo() {
  const btn = document.getElementById('confInfoBtn');
  const text = document.getElementById('confInfoText');
  if (!btn || !text) return;
  btn.addEventListener('click', () => {
    const willShow = text.classList.contains('hidden');
    text.classList.toggle('hidden', !willShow);
    btn.setAttribute('aria-expanded', String(willShow));
  });
}

// Sonuca "itiraz" yerine basit, ikon tabanlı (emoji değil) bir geri
// bildirim: kullanıcı sonucun faydalı olup olmadığını tek dokunuşla
// belirtebiliyor. Sunucuya gönderilmiyor (veri cihazda kalır ilkesiyle
// tutarlı) — sadece arayüzde teşekkür mesajına dönüşüyor.
function renderFeedbackWidget() {
  const s = t();
  return `
    <div class="result-feedback" id="resultFeedback">
      <span class="result-feedback-label">${s.feedbackQuestion}</span>
      <div class="result-feedback-btns">
        <button class="fq-btn feedback-btn" data-feedback="yes" type="button">
          <span class="material-symbols-outlined">check</span> ${s.feedbackYes}
        </button>
        <button class="fq-btn feedback-btn" data-feedback="no" type="button">
          <span class="material-symbols-outlined">close</span> ${s.feedbackNo}
        </button>
      </div>
    </div>`;
}

function bindFeedbackWidget(result, text) {
  const s = t();
  const widget = document.getElementById('resultFeedback');
  if (!widget) return;
  const btns = widget.querySelectorAll('.feedback-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-feedback');
      btns.forEach(b => {
        b.disabled = true;
        b.classList.toggle('selected-yes', b === btn && val === 'yes');
        b.classList.toggle('selected-no', b === btn && val === 'no');
      });
      const label = widget.querySelector('.result-feedback-label');
      if (label) label.textContent = s.feedbackThanks;
      saveFeedbackEntry(result, text, val);
    });
  });
}

function renderTriageBanner(result) {
  const level = result.careLevel || 'routine';
  const map = {
    emergency: { cls: 'emergency', icon: 'emergency', label: result.careLabel },
    urgent: { cls: 'urgent', icon: 'schedule', label: result.careLabel },
    soon: { cls: 'soon', icon: 'event', label: result.careLabel },
    routine: { cls: 'routine', icon: 'calendar_month', label: result.careLabel },
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
  const s = t();
  const score = result.confidenceScore || 0;
  const confText = score >= 72 ? s.highConf : score >= 55 ? s.medConf : s.lowConf;

  const symptoms = result.matchedSymptoms?.length ? `
    <div class="dept-symptoms-section">
      <div class="dept-symptoms-label">${s.detectedSymptoms}</div>
      <div class="symptom-tags">
        ${result.matchedSymptoms.map(sym => `
          <span class="symptom-tag">
            <span class="material-symbols-outlined">check_circle</span>
            ${sym.keyword || sym}
          </span>`).join('')}
      </div>
    </div>` : '';

  const alts = result.alternatives?.length ? `
    <div class="alt-section">
      <span class="alt-label">${s.otherOptions}</span>
      ${result.alternatives.map(a => `<span class="alt-tag">${a.icon || ''} ${a.name}</span>`).join('')}
    </div>` : '';

  return `
    ${renderTriageBanner(result)}
    <div class="dept-card">
      <div class="dept-card-glow"></div>
      <div class="dept-card-body">
        <div class="dept-overline">
          <span class="material-symbols-outlined">stethoscope</span>
          ${s.suggestedDept}
        </div>
        <div class="dept-name">${result.primaryDepartmentName || '—'}</div>
        <p class="dept-reasoning">${result.reasoning || ''}</p>
        <div class="conf-row">
          <div class="conf-track"><div class="conf-fill" id="confFill" style="width:0%"></div></div>
          <span class="conf-label">${confText} · %${score}</span>
          <button class="conf-info-btn" id="confInfoBtn" type="button" aria-expanded="false" aria-controls="confInfoText" aria-label="Güven skoru ne anlama geliyor?">
            <span class="material-symbols-outlined">info</span>
          </button>
        </div>
        <p class="conf-info-text hidden" id="confInfoText">${s.confInfoText}</p>
      </div>
      ${symptoms}
      ${alts}
      <div class="dept-card-footer">
        <a href="https://mhrs.gov.tr" target="_blank" rel="noopener" class="btn-mhrs">
          <span class="material-symbols-outlined">calendar_month</span> ${s.mhrsBtn}
        </a>
        <button class="btn-copy" id="copyBtn">
          <span class="material-symbols-outlined">content_copy</span> ${s.copyBtn}
        </button>
      </div>
    </div>
    <div class="result-disclaimer">
      <span class="material-symbols-outlined">info</span>
      <span>${result.note || s.disclaimer}</span>
    </div>`;
}

function renderFamilyCard(result) {
  const s = t();
  return `
    ${renderTriageBanner(result)}
    <div class="family-card">
      <div class="family-top">
        <div class="family-icon"><span class="material-symbols-outlined">stethoscope</span></div>
        <div>
          <div class="family-title">${s.familyDoctorTitle}</div>
          <div class="family-sub">${s.familyDoctorSub}</div>
        </div>
      </div>
      <div class="family-body">
        <p class="family-msg">${result.familyDoctorMessage || ''}</p>
        <div class="family-benefits">
          ${s.familyBenefits.map((b, i) => {
    const icons = ['schedule', 'location_on', 'swap_horiz'];
    return `<div class="benefit-item"><span class="material-symbols-outlined">${icons[i]}</span><span>${b}</span></div>`;
  }).join('')}
        </div>
      </div>
      <div class="family-footer">
        <a href="https://mhrs.gov.tr" target="_blank" rel="noopener" class="btn-mhrs">
          <span class="material-symbols-outlined">calendar_month</span> ${s.mhrsBtn}
        </a>
        <button class="btn-copy" id="copyBtn">
          <span class="material-symbols-outlined">content_copy</span> ${s.copyBtn}
        </button>
      </div>
    </div>
    <div class="result-disclaimer">
      <span class="material-symbols-outlined">info</span>
      <span>${result.note || s.disclaimer}</span>
    </div>`;
}

// ── Copy ──────────────────────────────────
function copyNote(result, text) {
  const s = t();
  const d = new Date().toLocaleDateString(state.lang === 'en' ? 'en-GB' : 'tr-TR');
  let note = `${s.copyDate(d)}\n\n${s.copyComplaint}: ${text}\n\n`;
  if (result.isEmergency) {
    note += `⚠️ ${result.emergencyMessage}`;
  } else {
    note += `${s.copyDept}: ${result.primaryDepartmentName || ''}\n`;
    note += `${s.copyUrgency}: ${result.careLabel || ''}\n`;
    if (result.confidenceScore) note += `${s.copyConf}: %${result.confidenceScore}\n`;
    if (result.matchedSymptoms?.length) note += `${s.copySymptoms}: ${result.matchedSymptoms.map(sym => sym.keyword || sym).join(', ')}\n`;
  }
  if (state.followUp.answers.length) {
    note += `\n${s.copyExtra}:\n`;
    state.followUp.answers.forEach(a => { note += `- ${a.question}: ${a.answer}\n`; });
  }
  note += `\n${s.copyDisclaimer}`;

  navigator.clipboard.writeText(note).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      btn.innerHTML = `<span class="material-symbols-outlined">check</span> ${s.copied}`;
      btn.style.color = 'var(--green)';
      setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined">content_copy</span> ${s.copyBtn}`;
        btn.style.color = '';
      }, 2500);
    }
  }).catch(() => alert(s.copyBtn + ' failed.'));
}

// ── Geri bildirim kalıcılığı ──────────────────
// AMAÇ: 👍/👎 geri bildirimi artık sadece arayüzde gösterilip kaybolmuyor,
// bu cihazda (localStorage) kalıcı olarak saklanıyor. "Veri cihazda kalır"
// ilkesiyle tutarlı olması için hiçbir sunucuya gönderilmiyor — geliştirici
// bu veriye ihtiyaç duyarsa, tarayıcı konsolundan exportFeedbackData()
// çağırarak kendi cihazından bir JSON dosyası olarak indirebilir.
const FEEDBACK_STORAGE_KEY = 'sy_feedback_log';
const MAX_FEEDBACK_ENTRIES = 300;

function saveFeedbackEntry(result, text, value) {
  try {
    const log = readJson(FEEDBACK_STORAGE_KEY, []);
    log.unshift({
      timestamp: new Date().toISOString(),
      textExcerpt: text.slice(0, 80),
      matchedSymptoms: result.matchedSymptoms || [],
      primaryDepartmentId: result.primaryDepartment || null,
      confidenceScore: result.confidenceScore ?? null,
      ageBand: result.ageBand || null,
      feedback: value, // 'yes' | 'no'
    });
    if (log.length > MAX_FEEDBACK_ENTRIES) log.length = MAX_FEEDBACK_ENTRIES;
    saveJson(FEEDBACK_STORAGE_KEY, log);
  } catch (e) {
    // localStorage dolu/erişilemez olabilir (gizlilik modu vb.) — geri
    // bildirim özelliğinin kendisi bu yüzden çökmemeli, sessizce yutuyoruz.
  }
}

// Geliştirici aracı: tarayıcı konsolunda `exportFeedbackData()` çağrılırsa,
// bu cihazda birikmiş TÜM geri bildirim kayıtlarını bir .json dosyası
// olarak indirir. Kullanıcı arayüzünde görünmez (bilinçli tercih —
// sıradan kullanıcı için gereksiz bir buton kalabalığı yaratmamak için),
// ama geliştirme/analiz sırasında kolayca erişilebilir.
window.exportFeedbackData = function () {
  const log = readJson(FEEDBACK_STORAGE_KEY, []);
  const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `saglikyon_feedback_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  console.log(`${log.length} geri bildirim kaydı indirildi.`);
  return log;
};

// ── History ───────────────────────────────
function saveToHistory(text, result) {
  const dept = result.isEmergency ? '🚨 ACİL'
    : result.isFamilyDoctor ? '👨‍⚕️ GP'
      : result.primaryDepartmentName || '—';
  state.history.unshift({
    text: text.slice(0, 60) + (text.length > 60 ? '…' : ''),
    dept,
    date: new Date().toLocaleDateString(state.lang === 'en' ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  });
  if (state.history.length > 10) state.history.pop();
  saveJson('sy_history', state.history);
  state.queries++;
  localStorage.setItem('sy_queries', state.queries);
  updateBadge();
  renderHistory();
}

function updateBadge() { if (DOM.queriesBadge) DOM.queriesBadge.textContent = state.queries; }

function toggleHistory() {
  const hidden = DOM.historyPanel.classList.toggle('hidden');
  if (!hidden) renderHistory();
}

function renderHistory() {
  const s = t();
  if (!state.history.length) {
    DOM.historyList.innerHTML = `<p class="hp-empty">${s.historyEmpty}</p>`;
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
let listening = false;
function toggleVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  if (!window._recog) {
    window._recog = new SR();
    window._recog.lang = state.lang === 'en' ? 'en-US' : 'tr-TR';
    window._recog.onstart = () => {
      listening = true;
      DOM.voiceBtn.classList.add('listening');
      DOM.voiceStatus.textContent = t().voiceListening;
      DOM.voiceStatus.classList.remove('hidden', 'error');
    };
    window._recog.onresult = e => {
      const text = e.results[0][0].transcript;
      DOM.input.value = DOM.input.value.trim() ? DOM.input.value + ' ' + text : text;
      onInput();
      DOM.voiceStatus.textContent = t().voiceAdded.replace('{t}', text);
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    window._recog.onerror = () => {
      DOM.voiceStatus.textContent = t().voiceError;
      DOM.voiceStatus.classList.add('error');
      setTimeout(() => DOM.voiceStatus.classList.add('hidden'), 3000);
    };
    window._recog.onend = () => { listening = false; DOM.voiceBtn.classList.remove('listening'); };
  }
  window._recog.lang = state.lang === 'en' ? 'en-US' : 'tr-TR';
  if (listening) window._recog.stop(); else window._recog.start();
}

// ── Start ─────────────────────────────────
document.addEventListener('DOMContentLoaded', init);