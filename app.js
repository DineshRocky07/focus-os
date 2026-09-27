/**
 * FocusOS Clean Engine (Light Theme Edition)
 */

const STORAGE_KEY = 'FOCUS_OS_LIGHT_STATE';

const defaultState = {
  geminiKey1: '',
  geminiKey2: '',
  activeKeyIndex: 1,
  nativeMode: false,
  dailyChecks: {
    'rep-lms': false,
    'rep-udemy': false,
    'rep-english': false,
    'rep-code': false,
  },
  ideas: [
    { id: 1, title: 'AI Job Application Agent', desc: 'LangGraph + RAG pipeline to match skills and auto-tailor resumes.', lane: 'icebox' },
    { id: 2, title: 'Direct Automation Freelancing', desc: 'Packaging Python data pipelines for local businesses to save hours.', lane: 'icebox' },
    { id: 3, title: 'Telegram Search / Deal Bot', desc: 'Automated deal alerts delivered directly to Telegram.', lane: 'icebox' },
    { id: 4, title: 'Robotics & Physical AI Systems', desc: 'Microcontrollers, ROS, embedded Linux, actuator control (Jan 1 Launch).', lane: 'horizon' },
    { id: 5, title: 'Custom Programming Language', desc: 'Python simplicity + Rust speed + Go compilation + AI APIs.', lane: 'horizon' },
    { id: 6, title: 'Story / Video Agent Factory', desc: 'Multi-agent scriptwriter, scene director, and video generator.', lane: 'horizon' }
  ]
};

let appState = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    return { ...defaultState, ...JSON.parse(saved) };
  } catch (e) {
    return defaultState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

// 1. COUNTDOWN CLOCK
function updateCountdown() {
  const targetDate = new Date('2027-01-01T00:00:00');
  const now = new Date();
  const diff = targetDate - now;

  const display = document.getElementById('countdownTimer');
  if (!display) return;

  if (diff <= 0) {
    display.innerHTML = '🎯 Robotics Launch Active';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  display.innerHTML = `Robotics Kickoff: <strong>${days}d ${hours}h</strong>`;
}

// 2. NATIVE VILLAGE MODE
function toggleNativeMode() {
  appState.nativeMode = !appState.nativeMode;
  saveState();
  applyNativeModeUI();
}

function applyNativeModeUI() {
  const statusLabel = document.getElementById('nativeModeStatus');
  const alertBox = document.getElementById('nativeAlertBox');
  const desc = document.getElementById('lmsTaskDesc');

  if (appState.nativeMode) {
    if (statusLabel) {
      statusLabel.textContent = 'ON';
      statusLabel.style.color = '#2563eb';
    }
    if (alertBox) alertBox.style.display = 'flex';
    if (desc) {
      desc.textContent = '[Native Travel Mode] Review LMS models mentally on your phone. No laptop coding needed.';
    }
  } else {
    if (statusLabel) {
      statusLabel.textContent = 'OFF';
      statusLabel.style.color = 'var(--text-muted)';
    }
    if (alertBox) alertBox.style.display = 'none';
    if (desc) {
      desc.textContent = 'Inspect the Pandas data pipeline or run LightGBM/Prophet scripts. Understand the code inputs and outputs.';
    }
  }
}

// 3. CONFIDENCE PROGRESS
function updateConfidence() {
  const checkboxes = document.querySelectorAll('.custom-checkbox');
  let checked = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checked++;
  });

  const percentage = Math.round((checked / checkboxes.length) * 100);
  const scoreVal = document.getElementById('confidenceScoreVal');
  const levelVal = document.getElementById('confidenceLevel');
  const bar = document.getElementById('confidenceBar');

  if (scoreVal) scoreVal.textContent = `${percentage}%`;
  if (bar) bar.style.width = `${percentage}%`;

  if (levelVal) {
    if (percentage === 100) {
      levelVal.textContent = 'Prepared & Confident 🔥';
      levelVal.style.color = 'var(--success)';
    } else if (percentage >= 50) {
      levelVal.textContent = 'Solid Progress 💪';
      levelVal.style.color = 'var(--accent)';
    } else {
      levelVal.textContent = 'Ready to start';
      levelVal.style.color = 'var(--text-muted)';
    }
  }
}

function initCheckboxes() {
  const ids = ['rep-lms', 'rep-udemy', 'rep-english', 'rep-code'];
  ids.forEach(id => {
    const cb = document.getElementById(id);
    if (!cb) return;
    cb.checked = !!appState.dailyChecks[id];
    cb.addEventListener('change', () => {
      appState.dailyChecks[id] = cb.checked;
      saveState();
      updateConfidence();
    });
  });
  updateConfidence();
}

// 4. 60-SECOND ENGLISH GYM
let timerInterval = null;
let timeLeft = 60;

const prompts = [
  "Explain why we selected LightGBM instead of standard Random Forest for the office LMS system.",
  "Describe how you solved a data transformation bug in a Pandas pipeline.",
  "Explain how Facebook Prophet handles weekly weekend drops in license usage.",
  "Explain what Model Context Protocol (MCP) is and why it replaces custom API connectors.",
  "Explain why we use Docker port mapping (-p 8000:8000) for local container testing."
];

function initEnglishGym() {
  const display = document.getElementById('gymTimerDisplay');
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const nextPromptBtn = document.getElementById('nextPromptBtn');
  const promptEl = document.getElementById('drillPrompt');
  const speechMicBtn = document.getElementById('speechMicBtn');
  const notesEl = document.getElementById('drillNotes');
  const critiqueBtn = document.getElementById('critiqueDrillBtn');
  const feedbackBox = document.getElementById('drillFeedbackBox');

  if (!display || !startBtn) return;

  nextPromptBtn.addEventListener('click', () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    promptEl.textContent = `"${random}"`;
  });

  startBtn.addEventListener('click', () => {
    if (timerInterval) return;
    startBtn.disabled = true;
    startBtn.style.opacity = '0.6';

    timerInterval = setInterval(() => {
      timeLeft--;
      display.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        display.textContent = "Done!";
        startBtn.disabled = false;
        startBtn.style.opacity = '1';

        const repCb = document.getElementById('rep-english');
        if (repCb && !repCb.checked) {
          repCb.checked = true;
          appState.dailyChecks['rep-english'] = true;
          saveState();
          updateConfidence();
        }
      }
    }, 1000);
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 60;
    display.textContent = "60";
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
  });

  // Speech-to-text
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec && speechMicBtn) {
    const rec = new SpeechRec();
    rec.continuous = false;
    rec.lang = 'en-US';

    speechMicBtn.addEventListener('click', () => {
      speechMicBtn.innerHTML = '<span style="color: #d97706;">● Listening...</span>';
      rec.start();
    });

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      notesEl.value += (notesEl.value ? ' ' : '') + text;
      speechMicBtn.innerHTML = '<i data-lucide="mic" style="width: 14px; height: 14px;"></i> Use Mic';
      if (window.lucide) lucide.createIcons();
    };

    rec.onerror = rec.onend = () => {
      speechMicBtn.innerHTML = '<i data-lucide="mic" style="width: 14px; height: 14px;"></i> Use Mic';
      if (window.lucide) lucide.createIcons();
    };
  } else if (speechMicBtn) {
    speechMicBtn.style.display = 'none';
  }

  // Critique via Gemini
  critiqueBtn.addEventListener('click', async () => {
    const text = notesEl.value.trim();
    if (!text) {
      alert('Type or speak a few words first!');
      return;
    }

    feedbackBox.style.display = 'block';
    feedbackBox.innerHTML = '<span style="color: var(--accent); font-weight: 600;">Evaluating with Gemini...</span>';

    const prompt = `You are a Senior Tech Lead evaluating an engineer's 60-second explanation:
Question: ${promptEl.textContent}
Answer: "${text}"

Evaluate in 3 concise bullet points:
1. Framework Check (Did they use Problem -> Approach -> Result -> Next Step?)
2. Technical Accuracy
3. Better phrasing for client/team meetings.`;

    const feedback = await callGeminiAPI(prompt);
    feedbackBox.innerHTML = `<strong style="color: var(--text-primary); font-size: 0.875rem;">Lead Feedback:</strong><br><br>${formatMarkdown(feedback)}`;
  });
}

// 5. GEMINI API WITH DUAL KEY FAILOVER
async function callGeminiAPI(prompt) {
  const k1 = appState.geminiKey1?.trim();
  const k2 = appState.geminiKey2?.trim();

  if (!k1 && !k2) {
    return `[Offline Mode: Add your free Gemini keys in the header to get live feedback]
• Framework Check: Clear attempt. Ensure you state the problem and the numbers clearly.
• Technical Accuracy: Good mention of LightGBM. Contrast its histogram speed against Random Forest.
• Meeting Tip: "In our LMS, LightGBM trains 3x faster and uses less memory on large license usage tables."`;
  }

  try {
    const key = appState.activeKeyIndex === 1 ? (k1 || k2) : (k2 || k1);
    return await fetchGemini(key, prompt);
  } catch (err) {
    appState.activeKeyIndex = appState.activeKeyIndex === 1 ? 2 : 1;
    saveState();
    const backup = appState.activeKeyIndex === 1 ? k1 : k2;
    if (backup) {
      try {
        return await fetchGemini(backup, prompt);
      } catch (e2) {
        return `API Error: ${e2.message}`;
      }
    }
    return `API error: ${err.message}`;
  }
}

async function fetchGemini(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Call failed');
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
}

// 6. RENDER IDEAS VAULT
function renderIdeas() {
  const ice = document.getElementById('lane-icebox');
  const hor = document.getElementById('lane-horizon');
  if (!ice || !hor) return;

  ice.innerHTML = '';
  hor.innerHTML = '';

  appState.ideas.forEach(item => {
    const div = document.createElement('div');
    div.style.padding = '0.9rem 1rem';
    div.style.background = '#ffffff';
    div.style.border = '1px solid var(--border)';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
    div.innerHTML = `
      <div style="font-size: 0.84375rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">${escapeHtml(item.title)}</div>
      <div style="font-size: 0.78125rem; color: var(--text-secondary); line-height: 1.45;">${escapeHtml(item.desc)}</div>
    `;

    if (item.lane === 'horizon') {
      hor.appendChild(div);
    } else {
      ice.appendChild(div);
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary);">$1</strong>')
    .replace(/\n/g, '<br>');
}

// 7. MODALS
function initModals() {
  // API Modal
  const apiModal = document.getElementById('apiSettingsModal');
  const openApi = document.getElementById('openApiSettingsBtn');
  const closeApi = document.getElementById('closeApiSettingsBtn');
  const saveApi = document.getElementById('saveApiKeysBtn');
  const k1 = document.getElementById('geminiKey1');
  const k2 = document.getElementById('geminiKey2');

  openApi.addEventListener('click', () => {
    k1.value = appState.geminiKey1 || '';
    k2.value = appState.geminiKey2 || '';
    apiModal.style.display = 'flex';
  });

  closeApi.addEventListener('click', () => apiModal.style.display = 'none');

  saveApi.addEventListener('click', () => {
    appState.geminiKey1 = k1.value.trim();
    appState.geminiKey2 = k2.value.trim();
    saveState();
    apiModal.style.display = 'none';
  });

  // Idea Modal
  const ideaModal = document.getElementById('addIdeaModal');
  const openIdea = document.getElementById('addIdeaModalBtn');
  const closeIdea = document.getElementById('closeIdeaModalBtn');
  const saveIdea = document.getElementById('saveNewIdeaBtn');
  const tInput = document.getElementById('newIdeaTitle');
  const dInput = document.getElementById('newIdeaDesc');
  const lInput = document.getElementById('newIdeaLane');

  openIdea.addEventListener('click', () => {
    tInput.value = '';
    dInput.value = '';
    ideaModal.style.display = 'flex';
  });

  closeIdea.addEventListener('click', () => ideaModal.style.display = 'none');

  saveIdea.addEventListener('click', () => {
    if (!tInput.value.trim()) return;
    appState.ideas.push({
      id: Date.now(),
      title: tInput.value.trim(),
      desc: dInput.value.trim(),
      lane: lInput.value
    });
    saveState();
    renderIdeas();
    ideaModal.style.display = 'none';
  });
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 60000);

  document.getElementById('nativeModeToggle').addEventListener('click', toggleNativeMode);
  document.getElementById('disableNativeAlertBtn').addEventListener('click', toggleNativeMode);
  applyNativeModeUI();

  initCheckboxes();
  initEnglishGym();
  initModals();
  renderIdeas();

  document.getElementById('resetDailyBtn').addEventListener('click', () => {
    if (confirm('Reset daily checklist for today?')) {
      appState.dailyChecks = {
        'rep-lms': false,
        'rep-udemy': false,
        'rep-english': false,
        'rep-code': false,
      };
      saveState();
      initCheckboxes();
    }
  });

  if (window.lucide) lucide.createIcons();
});
