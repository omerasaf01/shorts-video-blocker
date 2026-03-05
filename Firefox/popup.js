// Popup JavaScript for Firefox

// ─── Constants ───────────────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 68; // r=68 → 427.26
const BREAK_MINUTES  = 5;

// ─── State ──────────────────────────────────────────────────
let pomoState = {
  phase:       'work',   // 'work' | 'break'
  running:     false,
  workMinutes: 25,
  totalSeconds: 25 * 60,
  remaining:   25 * 60,
  sessions:    0,
  focusMin:    0,
  streak:      0,
  intervalId:  null,
};

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupToggleListeners();
  setupTabs();
  setupPomodoro();
});

// ═══════════════════════════════════════
// Tab switching
// ═══════════════════════════════════════
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ═══════════════════════════════════════
// Settings tab
// ═══════════════════════════════════════
function loadSettings() {
  const keys = ['blockYouTubeShorts','blockInstagramReels','removeShortsButtons','removeReelsButtons'];
  try {
    browser.storage.sync.get(keys).then(applySettings).catch(() => applySettings(defaultSettings()));
  } catch (e) {
    applySettings(defaultSettings());
  }
}

function defaultSettings() {
  return { blockYouTubeShorts: true, blockInstagramReels: true, removeShortsButtons: true, removeReelsButtons: true };
}

function applySettings(settings) {
  ['blockYouTubeShorts','blockInstagramReels','removeShortsButtons','removeReelsButtons'].forEach(k => {
    updateToggle(k, settings[k]);
  });
  updateStatus(settings);
}

function setupToggleListeners() {
  ['blockYouTubeShorts','blockInstagramReels','removeShortsButtons','removeReelsButtons'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => toggleSetting(id));
  });
}

function updateToggle(id, isActive) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('active', !!isActive);
}

function toggleSetting(settingId) {
  try {
    browser.storage.sync.get([settingId]).then(result => {
      const newValue = !result[settingId];
      browser.storage.sync.set({ [settingId]: newValue }).then(() => {
        updateToggle(settingId, newValue);
        browser.storage.sync.get(
          ['blockYouTubeShorts','blockInstagramReels','removeShortsButtons','removeReelsButtons']
        ).then(s => { updateStatus(s); refreshActiveTab(); });
      });
    });
  } catch (e) {
    console.error('ShortBlocker: Ayar değiştirilemedi:', e);
  }
}

function updateStatus(settings) {
  const statusEl = document.getElementById('status');
  const dotEl    = document.getElementById('statusDot');
  const count = ['blockYouTubeShorts','blockInstagramReels','removeShortsButtons','removeReelsButtons']
    .filter(k => settings[k]).length;
  if (count === 4) {
    if (statusEl) statusEl.textContent = 'Tüm özellikler aktif';
    if (dotEl) dotEl.className = 'status-dot active';
  } else if (count > 0) {
    if (statusEl) statusEl.textContent = `${count}/4 özellik aktif`;
    if (dotEl) dotEl.className = 'status-dot partial';
  } else {
    if (statusEl) statusEl.textContent = 'Hiçbir özellik aktif değil';
    if (dotEl) dotEl.className = 'status-dot';
  }
}

function refreshActiveTab() {
  try {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url && (url.includes('youtube.com') || url.includes('instagram.com'))) {
          browser.tabs.reload(tabs[0].id);
        }
      }
    });
  } catch (e) {
    console.error('ShortBlocker: Tab yenilenemedi:', e);
  }
}

// ═══════════════════════════════════════
// Pomodoro
// ═══════════════════════════════════════
function setupPomodoro() {
  // Restore persisted stats
  try {
    browser.storage.local.get(['pomoSessions','pomoFocusMin','pomoStreak']).then(data => {
      if (data.pomoSessions) pomoState.sessions = data.pomoSessions;
      if (data.pomoFocusMin) pomoState.focusMin = data.pomoFocusMin;
      if (data.pomoStreak)   pomoState.streak   = data.pomoStreak;
      renderPomoStats();
    }).catch(() => {});
  } catch (e) {}

  document.getElementById('pomoStartBtn').addEventListener('click', pomoToggle);
  document.getElementById('pomoResetBtn').addEventListener('click', pomoReset);

  document.querySelectorAll('.dur-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (pomoState.running) return;
      document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      pomoState.workMinutes = parseInt(btn.dataset.minutes, 10);
      pomoState.totalSeconds = pomoState.workMinutes * 60;
      pomoState.remaining    = pomoState.totalSeconds;
      pomoState.phase = 'work';
      renderPomoUI();
    });
  });

  renderPomoUI();
}

function pomoToggle() {
  if (pomoState.running) {
    pomoPause();
  } else {
    pomoStart();
  }
}

function pomoStart() {
  if (pomoState.phase === 'work') {
    // Auto-enable all blocking features
    const all = { blockYouTubeShorts: true, blockInstagramReels: true,
                  removeShortsButtons: true, removeReelsButtons: true };
    try {
      browser.storage.sync.set(all).then(() => {
        applySettings(all);
        refreshActiveTab();
      }).catch(() => applySettings(all));
    } catch (e) { applySettings(all); }
  }

  pomoState.running = true;
  pomoState.intervalId = setInterval(pomoTick, 1000);
  renderPomoUI();
}

function pomoPause() {
  pomoState.running = false;
  clearInterval(pomoState.intervalId);
  renderPomoUI();
}

function pomoReset() {
  pomoPause();
  pomoState.phase        = 'work';
  pomoState.totalSeconds = pomoState.workMinutes * 60;
  pomoState.remaining    = pomoState.totalSeconds;
  renderPomoUI();
}

function pomoTick() {
  pomoState.remaining--;

  if (pomoState.phase === 'work') {
    pomoState.focusMin = Math.floor(
      (pomoState.totalSeconds - pomoState.remaining) / 60
    );
  }

  if (pomoState.remaining <= 0) {
    clearInterval(pomoState.intervalId);
    pomoState.running = false;

    if (pomoState.phase === 'work') {
      // Work session completed
      pomoState.sessions++;
      pomoState.streak++;
      pomoState.focusMin += Math.round(pomoState.workMinutes);
      persistPomoStats();

      // Switch to break
      pomoState.phase        = 'break';
      pomoState.totalSeconds = BREAK_MINUTES * 60;
      pomoState.remaining    = pomoState.totalSeconds;

      try { browser.notifications.create({ type:'basic', iconUrl:'icons/icon48.png',
        title:'ShortBlocker — Mola!', message:'Çalışma bitti. 5 dakika mola. 🎉' }); } catch(e) {}
    } else {
      // Break session completed → reset to work
      pomoState.phase        = 'work';
      pomoState.totalSeconds = pomoState.workMinutes * 60;
      pomoState.remaining    = pomoState.totalSeconds;
      try { browser.notifications.create({ type:'basic', iconUrl:'icons/icon48.png',
        title:'ShortBlocker — Odaklan!', message:'Mola bitti. Çalışmaya devam et! 🚀' }); } catch(e) {}
    }
  }

  renderPomoUI();
  renderPomoStats();
}

function persistPomoStats() {
  try {
    browser.storage.local.set({
      pomoSessions: pomoState.sessions,
      pomoFocusMin: pomoState.focusMin,
      pomoStreak:   pomoState.streak,
    }).catch(() => {});
  } catch (e) {}
}

function renderPomoUI() {
  const isWork  = pomoState.phase === 'work';
  const isBreak = pomoState.phase === 'break';

  // Phase label
  const lbl = document.getElementById('pomoPhaseLabel');
  lbl.textContent = isWork ? 'ÇALIŞMA' : 'MOLA';
  lbl.className   = 'pomo-phase-label ' + (isWork ? 'work' : 'break');

  // Ring wrap class
  const wrap = document.getElementById('pomoRingWrap');
  wrap.classList.toggle('break', isBreak);

  // Time display
  const m = Math.floor(pomoState.remaining / 60);
  const s = pomoState.remaining % 60;
  document.getElementById('pomoTime').textContent =
    String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  document.getElementById('pomoTimeSub').textContent =
    isWork ? 'odaklan' : (pomoState.running ? 'dinlen' : 'hazır');

  // Ring progress
  const progress = pomoState.remaining / pomoState.totalSeconds;
  document.getElementById('pomoRingFg').style.strokeDashoffset =
    (CIRCUMFERENCE * (1 - progress)).toFixed(2);

  // Start/Pause button
  const startBtn = document.getElementById('pomoStartBtn');
  startBtn.textContent = pomoState.running ? '⏸ Duraklat' : '▶ Başlat';
  startBtn.className   = 'pomo-btn primary' + (isBreak ? ' break-mode' : '');

  // Duration buttons (disabled while running)
  document.querySelectorAll('.dur-btn').forEach(b => {
    b.disabled = pomoState.running;
  });

  // Info note
  const note = document.getElementById('pomoNote');
  if (pomoState.running && isWork) {
    note.className = 'pomo-note active';
    note.textContent = '🔒 Tüm engelleme özellikleri aktif — odaklan!';
  } else if (isBreak) {
    note.className = 'pomo-note active';
    note.textContent = '☕ Mola zamanı — biraz dinlen.';
  } else {
    note.className = 'pomo-note';
    note.textContent = 'Pomodoro başlatıldığında tüm engelleme özellikleri otomatik aktif olur.';
  }
}

function renderPomoStats() {
  document.getElementById('pomoSessions').textContent = pomoState.sessions;
  document.getElementById('pomoFocusMin').textContent = pomoState.focusMin;
  document.getElementById('pomoStreak').textContent   = pomoState.streak;
}
