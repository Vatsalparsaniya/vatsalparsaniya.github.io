/* ═══════════════════════════════════════════
   Our Memory Lane — script.js
   ═══════════════════════════════════════════ */

// ── Star-field Canvas ──
const cv = document.getElementById('sky-canvas');
const cx = cv.getContext('2d');
let stars = [];

function initStars() {
  cv.width = innerWidth;
  cv.height = innerHeight;
  const n = Math.min(Math.floor(innerWidth / 8), 140);
  stars = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.006 + 0.001,
      d: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawStars() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (const s of stars) {
    s.a += s.s * s.d;
    if (s.a >= 1) s.d = -1;
    if (s.a <= 0.05) s.d = 1;
    cx.beginPath();
    cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(248,187,208,${s.a * 0.4})`;
    cx.fill();
  }
  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
let resizeTimer;
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(initStars, 200); });

// ── Floating Hearts ──
const hEl = document.getElementById('hearts');
const emo = ['💕', '💗', '💖', '✨', '🌸', '💜'];
function spawnHeart() {
  if (hEl.childElementCount >= 5) return;
  const h = document.createElement('span');
  h.classList.add('heart');
  h.textContent = emo[Math.floor(Math.random() * emo.length)];
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = (Math.random() * 0.4 + 0.4) + 'rem';
  const dur = Math.random() * 10 + 10;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay = Math.random() * 3 + 's';
  hEl.appendChild(h);
  setTimeout(() => h.remove(), (dur + 4) * 1000);
}
setInterval(spawnHeart, 3000);
for (let i = 0; i < 3; i++) setTimeout(spawnHeart, i * 600);

// ── Scroll Progress ──
const scrollFill = document.getElementById('scroll-fill');
function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollFill.style.width = pct + '%';
}
addEventListener('scroll', updateScrollProgress, { passive: true });

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Memory Jar Notes ──
const noteModal = document.getElementById('note-modal');
const noteText = document.getElementById('note-text');
const noteContent = document.getElementById('note-content');
const noteBackdrop = document.getElementById('note-backdrop');
const noteClose = document.getElementById('note-close');

document.querySelectorAll('.memory-note').forEach(note => {
  note.addEventListener('click', () => {
    const memory = note.getAttribute('data-memory');
    const color = note.getAttribute('data-color');
    noteText.textContent = memory;
    noteContent.querySelector('.note-paper').style.borderColor = color + '60';
    noteContent.querySelector('.note-paper').style.boxShadow = `0 20px 60px ${color}25`;
    noteModal.classList.remove('hidden');
  });
});

function closeNoteModal() {
  noteModal.classList.add('hidden');
}
noteBackdrop.addEventListener('click', closeNoteModal);
noteClose.addEventListener('click', closeNoteModal);

// ── Typewriter — Reasons I Love You ──
const reasons = [
  "Because your smile could literally power a small city ⚡😊",
  "Because you remember the little things I say, even when I forget them myself 🥹",
  "Because talking to you feels like coming home 🏠💕",
  "Because you make me want to be a better person, every single day ✨",
  "Because your laugh is my favorite sound in the entire universe 🎵",
  "Because you're the first person I want to tell everything to 📱",
  "Because even silence with you feels comfortable and warm 🤍",
  "Because you believed in me when I didn't believe in myself 💪",
  "Because you make even boring days feel like an adventure 🗺️",
  "Because the way you care about people is the most beautiful thing I've ever seen 🌸",
  "Because you're my favorite notification 📲💗",
  "Because I can be my weirdest self around you and you still stay 😂",
  "Because you make 'I miss you' feel like the most powerful sentence 💌",
  "Because every plan I make for the future has you in it 🔮",
  "Because you're not just my favorite person — you're my person 💕",
];

let currentReason = 0;
let typewriterTimeout = null;
const typewriterEl = document.getElementById('typewriter-text');
const cursorEl = document.getElementById('cursor');
const reasonNum = document.getElementById('reason-num');
const btnNext = document.getElementById('btn-next');

function typeReason(text, idx = 0) {
  if (idx === 0) typewriterEl.textContent = '';
  if (idx < text.length) {
    typewriterEl.textContent += text[idx];
    typewriterTimeout = setTimeout(() => typeReason(text, idx + 1), 35);
  }
}

function showNextReason() {
  clearTimeout(typewriterTimeout);
  typewriterEl.textContent = '';
  reasonNum.textContent = currentReason + 1;
  typeReason(reasons[currentReason]);
  currentReason = (currentReason + 1) % reasons.length;
}

// Start first reason when section becomes visible
const reasonsSection = document.querySelector('.section-reasons');
const reasonObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      showNextReason();
      reasonObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
reasonObserver.observe(reasonsSection);

btnNext.addEventListener('click', showNextReason);

// ── Vinyl Player ──
const vinyl = document.getElementById('vinyl');
const vinylArm = document.getElementById('vinyl-arm');
let activeSong = null;

document.querySelectorAll('.song-card').forEach(card => {
  card.addEventListener('click', () => {
    const wasActive = card.classList.contains('active');
    document.querySelectorAll('.song-card').forEach(c => c.classList.remove('active'));

    if (wasActive) {
      vinyl.classList.remove('spinning');
      vinylArm.classList.remove('playing');
      activeSong = null;
    } else {
      card.classList.add('active');
      vinyl.classList.add('spinning');
      vinylArm.classList.add('playing');
      activeSong = card.getAttribute('data-song');
    }
  });
});

// ── Fireflies ──
const firefliesEl = document.getElementById('fireflies');
function createFirefly() {
  const f = document.createElement('div');
  f.classList.add('firefly');
  f.style.left = Math.random() * 100 + '%';
  f.style.top = Math.random() * 100 + '%';
  const dx = (Math.random() - 0.5) * 200;
  const dy = (Math.random() - 0.5) * 200;
  f.style.setProperty('--dx', dx + 'px');
  f.style.setProperty('--dy', dy + 'px');
  const dur = Math.random() * 6 + 4;
  f.style.animationDuration = dur + 's';
  f.style.animationDelay = Math.random() * 3 + 's';
  firefliesEl.appendChild(f);
  setTimeout(() => f.remove(), (dur + 4) * 1000);
}

// Spawn fireflies when final section is visible
const finalSection = document.querySelector('.section-final');
let firefliesStarted = false;
const finalObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !firefliesStarted) {
      firefliesStarted = true;
      for (let i = 0; i < 15; i++) setTimeout(createFirefly, i * 200);
      setInterval(createFirefly, 1500);
      // Heart burst
      launchHeartBurst();
    }
  });
}, { threshold: 0.2 });
finalObserver.observe(finalSection);

function launchHeartBurst() {
  const burst = document.getElementById('heart-burst');
  const hearts = ['💕', '💗', '💖', '💝', '🌸', '✨'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const h = document.createElement('span');
      h.classList.add('heart');
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
      const dur = Math.random() * 6 + 6;
      h.style.animationDuration = dur + 's';
      h.style.animationDelay = Math.random() * 0.5 + 's';
      burst.appendChild(h);
      setTimeout(() => h.remove(), (dur + 2) * 1000);
    }, i * 150);
  }
}
