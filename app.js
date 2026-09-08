/**
 * Happy Birthday Jannat - Interactive Application Engine
 * Accurate Pakistan Standard Time (PKT), iOS Glass Physics & PWA Install
 */

document.addEventListener('DOMContentLoaded', () => {
  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
      .catch((err) => console.warn('PWA Service Worker registration failed:', err));
  }

  initSparkles();
  initPakistanTimeAndCountdown();
  initCalendar();
  initCakeAndCandle();
  initVinceLetter();
  initBalloons();
  initWishesGuestbook();
  initPwaInstall();
  initAudioEngine();
  const voiceController = initRoboticVoice();
  initDailyNotifications();
  initSeptember18CelebrationMode(voiceController);
});

/* ==========================================================================
   1. ACCURATE PAKISTAN STANDARD TIME (PKT, UTC+5) & COUNTDOWN
   ========================================================================== */
function getPakistanDate() {
  try {
    const now = new Date();
    // Using Intl.DateTimeFormat with formatToParts guarantees 100% accuracy across all locales
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const d = {};
    for (const p of parts) {
      if (p.type !== 'literal') d[p.type] = parseInt(p.value, 10);
    }
    const hr = d.hour % 24;
    return new Date(d.year, d.month - 1, d.day, hr, d.minute, d.second);
  } catch (err) {
    // Fallback: direct UTC + 5 hours (Pakistan Standard Time, UTC+5)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5));
  }
}

function initPakistanTimeAndCountdown() {
  const timeEl = document.getElementById('pkt-time');
  const periodEl = document.getElementById('pkt-period');
  const dateEl = document.getElementById('pkt-date');
  const islandTimeEl = document.getElementById('island-pkt-time');

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  const bannerEl = document.getElementById('celebration-banner');
  const ageYearsEl = document.getElementById('age-years');
  const ageDaysEl = document.getElementById('age-days');
  const ageHoursEl = document.getElementById('age-hours');

  function update() {
    const pktNow = getPakistanDate();

    // 1. Live Time Formatting
    let hours = pktNow.getHours();
    const minutes = pktNow.getMinutes();
    const seconds = pktNow.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (timeEl) timeEl.textContent = formattedTime;
    if (periodEl) periodEl.textContent = ampm;
    if (islandTimeEl) islandTimeEl.textContent = `${formattedTime} ${ampm} PKT`;

    // 2. Date Formatting
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Karachi' };
    const formattedDate = pktNow.toLocaleDateString("en-US", options);
    if (dateEl) dateEl.textContent = formattedDate;

    // 3. Birthday Countdown Calculation (Target: 18 September)
    const currentYear = pktNow.getFullYear();
    let bdayThisYear = new Date(currentYear, 8, 18, 0, 0, 0); // Month is 0-indexed (8 = September)

    // Check if TODAY is September 18th in Pakistan!
    const isBirthdayToday = (pktNow.getMonth() === 8 && pktNow.getDate() === 18);

    if (isBirthdayToday) {
      if (bannerEl) bannerEl.classList.add('active');
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
    } else {
      if (bannerEl) bannerEl.classList.remove('active');
      let targetBday = bdayThisYear;
      if (pktNow.getTime() > bdayThisYear.getTime()) {
        targetBday = new Date(currentYear + 1, 8, 18, 0, 0, 0);
      }
      
      const diffMs = targetBday.getTime() - pktNow.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      const d = Math.floor(diffSecs / (3600 * 24));
      const h = Math.floor((diffSecs % (3600 * 24)) / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;

      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
    }

    // 4. Milestone Tracker (Born: 18 September 2006)
    const birthDate = new Date(2006, 8, 18, 0, 0, 0);
    const lifeDiffMs = pktNow.getTime() - birthDate.getTime();
    if (lifeDiffMs > 0) {
      const totalDays = Math.floor(lifeDiffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const totalHours = Math.floor(lifeDiffMs / (1000 * 60 * 60));

      if (ageYearsEl) ageYearsEl.textContent = `${years} Years`;
      if (ageDaysEl) ageDaysEl.textContent = `${totalDays.toLocaleString()} Days`;
      if (ageHoursEl) ageHoursEl.textContent = `${totalHours.toLocaleString()} Hours`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. INTERACTIVE CALENDAR WIDGET
   ========================================================================== */
function initCalendar() {
  const monthTitleEl = document.getElementById('calendar-month-title');
  const daysGridEl = document.getElementById('calendar-days-grid');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');

  if (!daysGridEl) return;

  const pktNow = getPakistanDate();
  // Default to September (Month 8) of current or next celebration year
  let viewYear = pktNow.getFullYear();
  let viewMonth = 8; // September

  function renderCalendar(year, month) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (monthTitleEl) {
      monthTitleEl.textContent = `${monthNames[month]} ${year}`;
    }

    daysGridEl.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill blank cells before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell empty';
      daysGridEl.appendChild(emptyCell);
    }

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.textContent = day;

      // Check if today
      if (pktNow.getFullYear() === year && pktNow.getMonth() === month && pktNow.getDate() === day) {
        cell.classList.add('today');
      }

      // Check if Jannat's Birthday (September 18)
      if (month === 8 && day === 18) {
        cell.classList.add('bday-highlight');
        cell.title = "Jannat's Birthday! 👑";
      }

      cell.addEventListener('click', () => {
        if (month === 8 && day === 18) {
          triggerConfetti(50);
          showToast("🎂 September 18: Jannat's Special Birthday!");
        } else {
          showToast(`✨ Selected: ${monthNames[month]} ${day}, ${year}`);
        }
      });

      daysGridEl.appendChild(cell);
    }
  }

  renderCalendar(viewYear, viewMonth);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }
}

/* ==========================================================================
   3. INTERACTIVE 3D CAKE & CANDLE
   ========================================================================== */
function initCakeAndCandle() {
  const flame = document.getElementById('candle-flame');
  const blowBtn = document.getElementById('blow-candle-btn');
  const relightBtn = document.getElementById('relight-candle-btn');

  let isBlown = false;

  function blowOut() {
    if (isBlown) return;
    isBlown = true;

    if (flame) flame.classList.add('extinguished');
    playBlowSound();
    playChimeMelody();
    triggerConfetti(120);

    showToast("🎉 Happy Birthday Jannat! May all your wishes come true! 🎂");

    if (blowBtn) blowBtn.style.display = 'none';
    if (relightBtn) relightBtn.style.display = 'inline-flex';
  }

  function relight() {
    isBlown = false;
    if (flame) flame.classList.remove('extinguished');
    showToast("✨ Candle relit! Make another wish! ✨");

    if (blowBtn) blowBtn.style.display = 'inline-flex';
    if (relightBtn) relightBtn.style.display = 'none';
  }

  if (blowBtn) blowBtn.addEventListener('click', blowOut);
  if (flame) flame.parentElement.addEventListener('click', () => {
    if (isBlown) relight();
    else blowOut();
  });
  if (relightBtn) relightBtn.addEventListener('click', relight);
}

/* ==========================================================================
   4. HEARTFELT LETTER FROM VINCE (WAX SEAL ENVELOPE)
   ========================================================================== */
function initVinceLetter() {
  const envelope = document.getElementById('vince-envelope');
  const modal = document.getElementById('letter-modal-backdrop');
  const closeBtn = document.getElementById('close-letter-btn');

  function openLetter() {
    playChimeMelody();
    triggerConfetti(40);
    if (modal) modal.classList.add('open');
  }

  function closeLetter() {
    if (modal) modal.classList.remove('open');
  }

  if (envelope) envelope.addEventListener('click', openLetter);
  if (closeBtn) closeBtn.addEventListener('click', closeLetter);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLetter();
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE BALLOONS & WISHES
   ========================================================================== */
const AFFIRMATIONS = [
  "Your smile brings warmth wherever you go! 💖",
  "May your 20th year be filled with boundless wonder and joy! ✨",
  "You are capable of achieving anything your heart desires! 🌸",
  "Never forget how deeply cherished and appreciated you are! 🌟",
  "Here's to laughter that makes your stomach hurt and memories to last forever! 🥂"
];

function initBalloons() {
  const balloons = document.querySelectorAll('.floating-balloon');
  balloons.forEach((b, index) => {
    b.addEventListener('click', (e) => {
      playBalloonPop();
      b.style.transform = 'scale(0)';
      b.style.opacity = '0';
      triggerConfetti(30, e.clientX, e.clientY);
      
      const message = AFFIRMATIONS[index % AFFIRMATIONS.length];
      showToast(message);

      setTimeout(() => {
        b.style.transform = '';
        b.style.opacity = '';
      }, 3500);
    });
  });
}

/* ==========================================================================
   6. WISHES GUESTBOOK
   ========================================================================== */
function initWishesGuestbook() {
  const input = document.getElementById('wish-input');
  const sendBtn = document.getElementById('send-wish-btn');
  const list = document.getElementById('wishes-list');

  const STORAGE_KEY = 'jannat_bday_wishes_v1';
  let wishes = [];
  try {
    wishes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    wishes = [];
  }

  function renderWishes() {
    if (!list) return;
    list.innerHTML = '';
    wishes.slice(-5).reverse().forEach(w => {
      const item = document.createElement('div');
      item.className = 'milestone-item';
      item.style.cssText = 'background: rgba(255,255,255,0.06); padding: 10px 16px; border-radius: 12px; margin-top: 8px; border: 1px solid rgba(255,255,255,0.12);';
      item.innerHTML = `<span style="color:#ffeaa7; font-weight:600;">✨ "${escapeHtml(w.text)}"</span> <span style="font-size:0.75rem; color:rgba(255,255,255,0.5);">${w.time}</span>`;
      list.appendChild(item);
    });
  }

  function submitWish() {
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const newWish = {
      text,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    wishes.push(newWish);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    input.value = '';

    triggerConfetti(60);
    showToast("💌 Your birthday wish has been sealed in the memory jar!");
    renderWishes();
  }

  if (sendBtn) sendBtn.addEventListener('click', submitWish);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitWish();
    });
  }

  renderWishes();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   7. PWA INSTALL / MOBILE DOWNLOAD PROMPT ("pwd download")
   ========================================================================== */
let deferredInstallPrompt = null;

function initPwaInstall() {
  const installBannerBtn = document.getElementById('install-pwa-btn');
  const headerInstallBtn = document.getElementById('header-install-btn');
  const installModal = document.getElementById('pwa-modal-backdrop');
  const closeInstallBtn = document.getElementById('close-pwa-modal-btn');
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (headerInstallBtn) headerInstallBtn.style.display = 'inline-flex';
  });

  if (isStandalone) {
    if (headerInstallBtn) headerInstallBtn.innerHTML = '📲 <span>Installed ✓</span>';
    if (installBannerBtn) installBannerBtn.innerHTML = '<span>App Installed on Device ✓</span>';
  }

  function handleInstallClick() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast("🎉 Thank you for installing Happy Birthday Jannat!");
        }
        deferredInstallPrompt = null;
      });
    } else {
      // Show iOS / Universal instructions modal
      if (installModal) installModal.classList.add('open');
    }
  }

  if (installBannerBtn) installBannerBtn.addEventListener('click', handleInstallClick);
  if (headerInstallBtn) headerInstallBtn.addEventListener('click', handleInstallClick);
  if (closeInstallBtn) closeInstallBtn.addEventListener('click', () => {
    if (installModal) installModal.classList.remove('open');
  });
  if (installModal) {
    installModal.addEventListener('click', (e) => {
      if (e.target === installModal) installModal.classList.remove('open');
    });
  }
}

/* ==========================================================================
   8. WEB AUDIO SYNTHESIZER (MUSIC & SFX)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.4, type = 'sine', gainVal = 0.15) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// Chime Melodic Fanfare
function playChimeMelody() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.6, 'triangle', 0.2);
    }, idx * 120);
  });
}

// Blow Sound (Puff effect)
function playBlowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

// Balloon Pop SFX
function playBalloonPop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(350, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

// Background Music Box "Happy Birthday" Melody
function initAudioEngine() {
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (!musicToggleBtn) return;

  const melodyNotes = [
    // Happy Birthday in C Major:
    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.0 },
    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.0 },
    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.9 },
    { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.25 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }
  ];

  let noteIndex = 0;

  function playNextNote() {
    if (!isMusicPlaying) return;
    const current = melodyNotes[noteIndex];
    playTone(current.f, current.d + 0.2, 'triangle', 0.12);
    noteIndex = (noteIndex + 1) % melodyNotes.length;
    musicInterval = setTimeout(playNextNote, (current.d + 0.15) * 1000);
  }

  musicToggleBtn.addEventListener('click', () => {
    getAudioContext();
    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
      musicToggleBtn.innerHTML = '🎵 <span>Music Playing</span>';
      musicToggleBtn.classList.add('primary');
      showToast("🎶 Playing Happy Birthday music box melody...");
      playNextNote();
    } else {
      musicToggleBtn.innerHTML = '🎵 <span>Play Melody</span>';
      musicToggleBtn.classList.remove('primary');
      clearTimeout(musicInterval);
    }
  });
}

/* ==========================================================================
   9. HIGH-PERFORMANCE CANVAS CONFETTI
   ========================================================================== */
function triggerConfetti(count = 70, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#f7ce68', '#ff9a9e', '#fecfef', '#c471ed', '#4facfe', '#00f2fe', '#ffffff', '#ffd32a'];
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // friction
      p.rotation += p.rSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

/* ==========================================================================
   10. SPARKLE GENERATOR & TOAST NOTIFICATION
   ========================================================================== */
function initSparkles() {
  const container = document.getElementById('sparkle-particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${6 + Math.random() * 8}s`;
    dot.style.animationDelay = `${Math.random() * 5}s`;
    dot.style.opacity = Math.random();
    container.appendChild(dot);
  }
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   11. DAILY MIDNIGHT NOTIFICATIONS (12:00 AM PKT) & BIRTHDAY ALERT
   ========================================================================== */
function initDailyNotifications() {
  const reminderBtn = document.getElementById('reminder-toggle-btn');
  const NOTIF_KEY = 'jannat_daily_reminder_enabled';
  let isReminderEnabled = localStorage.getItem(NOTIF_KEY) === 'true';

  function updateButtonState() {
    if (!reminderBtn) return;
    if (isReminderEnabled && Notification.permission === 'granted') {
      reminderBtn.innerHTML = '🔔 <span>Reminders: ON (12 AM PKT)</span>';
      reminderBtn.classList.add('notification-active-badge');
    } else {
      reminderBtn.innerHTML = '🔔 <span>Midnight Reminder</span>';
      reminderBtn.classList.remove('notification-active-badge');
    }
  }

  async function requestNotificationAccess() {
    if (!('Notification' in window)) {
      showToast("⚠️ Notifications are not supported by this browser.");
      return;
    }

    if (Notification.permission === 'granted') {
      isReminderEnabled = !isReminderEnabled;
      localStorage.setItem(NOTIF_KEY, isReminderEnabled);
      updateButtonState();
      if (isReminderEnabled) {
        sendBirthdayNotification(true); // send test confirmation
        scheduleMidnightNotification();
      } else {
        showToast("🔕 Daily midnight reminder turned OFF.");
      }
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        isReminderEnabled = true;
        localStorage.setItem(NOTIF_KEY, 'true');
        updateButtonState();
        sendBirthdayNotification(true);
        scheduleMidnightNotification();
      } else {
        showToast("Notifications permission was not granted.");
      }
    } else {
      showToast("⚠️ Notifications are blocked in browser settings. Please allow notifications to receive midnight reminders.");
    }
  }

  function scheduleMidnightNotification() {
    if (!isReminderEnabled || Notification.permission !== 'granted') return;

    const pktNow = getPakistanDate();
    // Compute next 12:00:00 AM (midnight) in Pakistan Time
    const nextMidnight = new Date(pktNow.getFullYear(), pktNow.getMonth(), pktNow.getDate() + 1, 0, 0, 0);
    const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - pktNow.getTime());

    setTimeout(() => {
      sendBirthdayNotification(false);
      scheduleMidnightNotification(); // Repeat for next day
    }, msUntilMidnight);
  }

  function sendBirthdayNotification(isTest = false) {
    if (Notification.permission !== 'granted') return;

    const pktNow = getPakistanDate();
    const isBirthdayToday = (pktNow.getMonth() === 8 && pktNow.getDate() === 18);

    let title, body;
    if (isBirthdayToday) {
      title = "🎉 HAPPY BIRTHDAY JANNAT! 🎂👑";
      body = "Today is your special day! Happy Birthday from Vince with all love! May all your wishes come true! ❤️";
    } else if (isTest) {
      title = "🔔 Daily Birthday Reminder Activated!";
      body = "You will receive a birthday reminder at 12:00 AM midnight Pakistan Time every day until 18 September! — From Vince";
    } else {
      const currentYear = pktNow.getFullYear();
      let targetBday = new Date(currentYear, 8, 18, 0, 0, 0);
      if (pktNow.getTime() > targetBday.getTime()) {
        targetBday = new Date(currentYear + 1, 8, 18, 0, 0, 0);
      }
      const daysLeft = Math.ceil((targetBday.getTime() - pktNow.getTime()) / (1000 * 3600 * 24));
      title = "🎂 Jannat's Birthday Reminder";
      body = `Only ${daysLeft} days left until 18 September! Vince is counting down the moments to celebrate you! ✨`;
    }

    const options = {
      body: body,
      icon: 'assets/icons/icon-192.png',
      badge: 'assets/icons/favicon-32x32.png',
      vibrate: [200, 100, 200, 100, 300],
      tag: 'jannat-bday-reminder',
      renotify: true
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }

  if (reminderBtn) {
    reminderBtn.addEventListener('click', requestNotificationAccess);
  }

  updateButtonState();
  if (isReminderEnabled) {
    scheduleMidnightNotification();
  }
}

/* ==========================================================================
   12. ROBOTIC VOICE BIRTHDAY WISHES (WEB SPEECH API)
   ========================================================================== */
function initRoboticVoice() {
  const speakBtn = document.getElementById('speak-wishes-btn');
  const stopBtn = document.getElementById('stop-speech-btn');
  const visualizer = document.getElementById('voice-visualizer');

  if (!('speechSynthesis' in window)) {
    if (speakBtn) speakBtn.style.display = 'none';
    return { speak: () => {}, stop: () => {} };
  }

  const birthdayGreetingText =
    "Attention everyone! Today we celebrate an extraordinary soul. " +
    "Happy Birthday, Jannat! Born on September eighteenth, two thousand and six. " +
    "This special digital universe was crafted for you with endless warmth and admiration by Vince. " +
    "Jannat, your radiant smile brings warmth to everyone around you, and your heart is pure gold. " +
    "May this year ahead bless you with immense joy, laughter, inner peace, and the courage to achieve every ambition you hold dear. " +
    "Always remember how treasured and deeply cherished you are. Happy Birthday, Jannat!";

  let currentUtterance = null;

  function speak() {
    window.speechSynthesis.cancel(); // Stop any previous speech

    currentUtterance = new SpeechSynthesisUtterance(birthdayGreetingText);
    
    // Choose voice - prefer English voices
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en')) || voices[0];
    if (preferredVoice) currentUtterance.voice = preferredVoice;

    // Pitch & rate for futuristic, friendly robotic warmth
    currentUtterance.pitch = 1.12;
    currentUtterance.rate = 0.96;

    currentUtterance.onstart = () => {
      if (visualizer) visualizer.classList.add('speaking');
      if (stopBtn) stopBtn.style.display = 'inline-flex';
      if (speakBtn) speakBtn.innerHTML = '🎙️ <span>Speaking Wishes...</span>';
    };

    currentUtterance.onend = () => {
      if (visualizer) visualizer.classList.remove('speaking');
      if (stopBtn) stopBtn.style.display = 'none';
      if (speakBtn) speakBtn.innerHTML = '🎙️ <span>Hear Robotic Voice Wishes</span>';
    };

    currentUtterance.onerror = () => {
      if (visualizer) visualizer.classList.remove('speaking');
      if (stopBtn) stopBtn.style.display = 'none';
      if (speakBtn) speakBtn.innerHTML = '🎙️ <span>Hear Robotic Voice Wishes</span>';
    };

    window.speechSynthesis.speak(currentUtterance);
    showToast("🤖 Robotic voice speaking birthday wishes for Jannat...");
  }

  function stop() {
    window.speechSynthesis.cancel();
    if (visualizer) visualizer.classList.remove('speaking');
    if (stopBtn) stopBtn.style.display = 'none';
    if (speakBtn) speakBtn.innerHTML = '🎙️ <span>Hear Robotic Voice Wishes</span>';
  }

  if (speakBtn) speakBtn.addEventListener('click', speak);
  if (stopBtn) stopBtn.addEventListener('click', stop);

  return { speak, stop };
}

/* ==========================================================================
   13. SEPTEMBER 18 GRAND CELEBRATION MODE & PREVIEW CONTROLLER
   ========================================================================== */
function initSeptember18CelebrationMode(voiceController) {
  const previewBtn = document.getElementById('preview-mode-btn');
  const swarmOverlay = document.getElementById('balloon-swarm-overlay');

  let isBirthdayModeActive = false;

  function spawnBalloonSwarm() {
    if (!swarmOverlay) return;
    swarmOverlay.innerHTML = '';
    const colors = [
      'radial-gradient(circle at 35% 35%, #ff9ff3 0%, #f368e0 70%, #833471 100%)',
      'radial-gradient(circle at 35% 35%, #ffeaa7 0%, #feca57 70%, #e67e22 100%)',
      'radial-gradient(circle at 35% 35%, #48dbfb 0%, #0abde3 70%, #10ac84 100%)',
      'radial-gradient(circle at 35% 35%, #c56cf0 0%, #7d5fff 70%, #4b4b4b 100%)',
      'radial-gradient(circle at 35% 35%, #ff6b81 0%, #ee5253 70%, #b33939 100%)',
      'radial-gradient(circle at 35% 35%, #ffffff 0%, #ffd32a 70%, #d49419 100%)'
    ];

    const balloonCount = 35;
    for (let i = 0; i < balloonCount; i++) {
      const b = document.createElement('div');
      b.className = 'swarm-balloon';
      b.style.left = `${Math.random() * 95}%`;
      b.style.background = colors[Math.floor(Math.random() * colors.length)];
      const duration = 7 + Math.random() * 8;
      const delay = Math.random() * 10;
      b.style.animationDuration = `${duration}s`;
      b.style.animationDelay = `${delay}s`;
      const scale = 0.75 + Math.random() * 0.7;
      b.style.transform = `scale(${scale})`;
      swarmOverlay.appendChild(b);
    }
  }

  function setBirthdayMode(enable) {
    isBirthdayModeActive = enable;
    if (isBirthdayModeActive) {
      document.body.classList.add('birthday-mode-active');
      if (previewBtn) {
        previewBtn.innerHTML = '✨ <span>Exit 18 Sept Mode</span>';
        previewBtn.classList.add('primary');
      }
      spawnBalloonSwarm();
      triggerConfetti(150);
      showToast("🎉 GRAND CELEBRATION MODE: Happy Birthday Jannat! 👑");

      // Auto-start music if not playing
      const musicBtn = document.getElementById('music-toggle-btn');
      if (musicBtn && !isMusicPlaying) {
        musicBtn.click();
      }

      // Auto-play robotic voice wishes after gentle intro
      setTimeout(() => {
        if (voiceController && voiceController.speak) {
          voiceController.speak();
        }
      }, 1400);

    } else {
      document.body.classList.remove('birthday-mode-active');
      if (previewBtn) {
        previewBtn.innerHTML = '🎉 <span>Test 18 Sept Mode</span>';
        previewBtn.classList.remove('primary');
      }
      if (swarmOverlay) swarmOverlay.innerHTML = '';
      if (voiceController && voiceController.stop) {
        voiceController.stop();
      }
      showToast("Standard Mode restored.");
    }
  }

  // Check if today is September 18th in Pakistan
  const pktNow = getPakistanDate();
  if (pktNow.getMonth() === 8 && pktNow.getDate() === 18) {
    setBirthdayMode(true);
  }

  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      setBirthdayMode(!isBirthdayModeActive);
    });
  }
}

