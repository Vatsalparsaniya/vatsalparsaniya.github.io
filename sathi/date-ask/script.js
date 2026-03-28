// ── Floating hearts background ──
const heartsContainer = document.getElementById('hearts');
const heartEmojis = ['💕', '💗', '💖', '💘', '💝', '♥️', '🌹', '✨'];

function createHeart() {
  const heart = document.createElement('span');
  heart.classList.add('heart');
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
  heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
  heart.style.animationDelay = (Math.random() * 2) + 's';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}

// Fewer hearts on mobile to save performance
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const heartInterval = isMobile ? 1200 : 800;
const initialHearts = isMobile ? 5 : 8;

setInterval(createHeart, heartInterval);
for (let i = 0; i < initialHearts; i++) setTimeout(createHeart, i * 300);

// ── Button interactions ──
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const mainContent = document.getElementById('main-content');
const yesScreen = document.getElementById('yes-screen');

// Yes button
btnYes.addEventListener('click', () => {
  mainContent.style.display = 'none';
  yesScreen.classList.remove('hidden');
  launchCelebration();
});

// No button — it runs away!
let noClickCount = 0;
const noMessages = [
  "Are you sure? 🥺",
  "Think again... 💭",
  "Pretty please? 🌸",
  "One more chance? 🙏",
  "I won't give up! 💪",
];

function dodgeButton() {
  const padding = 20;
  const btnW = btnNo.offsetWidth || 100;
  const btnH = btnNo.offsetHeight || 45;
  const maxX = window.innerWidth - btnW - padding;
  const maxY = window.innerHeight - btnH - padding;

  const newX = Math.max(padding, Math.random() * maxX);
  const newY = Math.max(padding, Math.random() * maxY);

  btnNo.style.position = 'fixed';
  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';
  btnNo.style.zIndex = '50';
  btnNo.style.transition = 'left 0.15s ease, top 0.15s ease';

  noClickCount++;
  if (noClickCount <= noMessages.length) {
    btnNo.textContent = noMessages[noClickCount - 1];
  }
}

// Desktop: dodge on hover
btnNo.addEventListener('mouseenter', dodgeButton);

// Mobile: dodge on tap (click fires after touchstart on mobile)
btnNo.addEventListener('click', (e) => {
  // Only dodge if it hasn't already been handled by mouseenter (desktop)
  if ('ontouchstart' in window) {
    e.preventDefault();
    dodgeButton();
  }
});

// ── Celebration effect ──
function launchCelebration() {
  const celebration = document.getElementById('celebration');
  const colors = ['#ec407a', '#f48fb1', '#f8bbd0', '#ff6090', '#ff80ab', '#ffd54f', '#fff176'];
  const confettiCount = isMobile ? 40 : 80;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (Math.random() * 8 + 5) + 'px';
      confetti.style.height = (Math.random() * 8 + 5) + 'px';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.animationDelay = (Math.random() * 0.5) + 's';
      celebration.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }, i * 50);
  }

  // Hearts on the yes screen
  setInterval(() => {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
    celebration.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }, isMobile ? 900 : 600);
}
