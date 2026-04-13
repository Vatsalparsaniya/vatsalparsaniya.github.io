/* ── Fry Factory – A Potato Game for Sathi ── */
const $ = s => document.querySelector(s);
const rand = (a, b) => Math.random() * (b - a) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ── Config ── */
const GAME_DURATION = 30;
const POTATO_INTERVAL_START = 800;
const POTATO_INTERVAL_MIN = 300;

const funnyMessages = [
  "🥔 Fry them ALL!",
  "🍟 Sathi's Fry Factory!",
  "🥔 Potato Queen!",
  "🍟 Golden & Crispy!",
  "🥔 More Potatoes!",
  "🍟 She can't stop!",
  "🥔 Fry-day Everyday!",
  "🍟 Sizzle Sizzle!",
  "🥔 Potato Power!",
  "🍟 Crispy Legend!",
  "🥔 Fry-nally!",
  "🍟 Hot & Ready!",
  "🥔 Spud-tacular!",
  "🍟 Fry-tastic!",
  "🥔 Tot-ally Amazing!",
];

const finaleMessages = [
  { msg: "You're the Fry Queen 👑", sub: "No potato is safe around you. 🥔🍟" },
  { msg: "Potato Whisperer 🥔", sub: "They jumped into the fryer willingly for you." },
  { msg: "Golden Crispy Legend 🍟", sub: "McDonald's wants your number. 📞" },
  { msg: "Chief Frying Officer 👩‍🍳", sub: "Your fry game is unmatched, Sathi." },
  { msg: "Fry-day is YOUR day 🎉", sub: "Every day is Fry-day when you're around. 🍟💛" },
];

/* ── State ── */
let score = 0;
let timeLeft = GAME_DURATION;
let gameRunning = false;
let spawnTimer = null;
let countdownTimer = null;
let animFrame = null;
let potatoes = [];
let fryParticles = [];
let steamParticles = [];
let msgTimeout = null;

/* ── Canvas refs ── */
let gCanvas, gCtx, fCanvas, fCtx;
let W, H;

/* ── Drawing helpers ── */
function drawPotato(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  // potato body
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.75, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#c8a96e';
  ctx.fill();
  ctx.strokeStyle = '#8d6e3f';
  ctx.lineWidth = 2;
  ctx.stroke();
  // spots
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const sx = rand(-r * 0.4, r * 0.4);
    const sy = rand(-r * 0.3, r * 0.3);
    ctx.arc(sx, sy, r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#a0845a';
    ctx.fill();
  }
  // cute face
  const eyeY = -r * 0.1;
  ctx.fillStyle = '#3e2723';
  ctx.beginPath(); ctx.arc(-r * 0.22, eyeY, r * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.22, eyeY, r * 0.08, 0, Math.PI * 2); ctx.fill();
  // eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-r * 0.19, eyeY - r * 0.03, r * 0.03, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(r * 0.25, eyeY - r * 0.03, r * 0.03, 0, Math.PI * 2); ctx.fill();
  // smile
  ctx.beginPath();
  ctx.arc(0, r * 0.12, r * 0.18, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawFry(ctx, x, y, len, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const w = len * 0.18;
  // fry body
  ctx.fillStyle = '#ffd54f';
  ctx.strokeStyle = '#f9a825';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -len / 2, w, len, 3);
  ctx.fill();
  ctx.stroke();
  // crispy tip
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.roundRect(-w / 2, -len / 2, w, len * 0.2, 3);
  ctx.fill();
  ctx.restore();
}

/* ── Particle classes ── */
class FryParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.len = rand(20, 40);
    this.angle = rand(0, Math.PI * 2);
    this.vx = rand(-4, 4);
    this.vy = rand(-8, -2);
    this.va = rand(-0.1, 0.1);
    this.life = 1;
    this.decay = rand(0.015, 0.03);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.angle += this.va;
    this.life -= this.decay;
  }
  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    drawFry(ctx, this.x, this.y, this.len, this.angle);
    ctx.globalAlpha = 1;
  }
}

class SteamParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = rand(3, 8);
    this.vx = rand(-0.5, 0.5);
    this.vy = rand(-2, -0.5);
    this.life = 1;
    this.decay = rand(0.02, 0.04);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.r += 0.1;
    this.life -= this.decay;
  }
  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life) * 0.4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/* ── Potato (falling object) ── */
class Potato {
  constructor(W, H) {
    this.r = rand(28, 45);
    this.x = rand(this.r + 10, W - this.r - 10);
    this.y = -this.r * 2;
    this.vy = rand(2, 4.5);
    this.vx = rand(-1, 1);
    this.wobble = rand(0, Math.PI * 2);
    this.wobbleSpeed = rand(0.03, 0.07);
    this.alive = true;
    this.fried = false;
  }
  update() {
    this.y += this.vy;
    this.x += Math.sin(this.wobble) * 0.5 + this.vx;
    this.wobble += this.wobbleSpeed;
  }
  draw(ctx) {
    drawPotato(ctx, this.x, this.y, this.r);
  }
  isOffScreen(H) { return this.y > H + this.r * 2; }
  hitTest(px, py) {
    const dx = px - this.x, dy = py - this.y;
    return dx * dx + dy * dy < this.r * this.r * 1.5;
  }
}

/* ── Canvas setup ── */
function resizeCanvas(cvs) {
  cvs.width = cvs.clientWidth * devicePixelRatio;
  cvs.height = cvs.clientHeight * devicePixelRatio;
  cvs.getContext('2d').setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function sizeAll() {
  W = window.innerWidth; H = window.innerHeight;
  if (gCanvas) resizeCanvas(gCanvas);
  if (fCanvas) resizeCanvas(fCanvas);
}

/* ── Fry a potato (on tap) ── */
function fryPotato(potato) {
  potato.alive = false;
  score++;
  $('#score').textContent = score;
  // spawn fry particles
  for (let i = 0; i < 8; i++) fryParticles.push(new FryParticle(potato.x, potato.y));
  // spawn steam
  for (let i = 0; i < 5; i++) steamParticles.push(new SteamParticle(potato.x, potato.y - potato.r));
  // funny message every 5 fries
  if (score % 5 === 0) {
    const m = pick(funnyMessages);
    $('#msg-text').textContent = m;
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => { $('#msg-text').textContent = ''; }, 1500);
  }
}

function checkTap(px, py) {
  for (const p of potatoes) {
    if (p.alive && p.hitTest(px, py)) { fryPotato(p); break; }
  }
}

/* ── Game loop ── */
function gameLoop() {
  if (!gameRunning) return;
  gCtx.clearRect(0, 0, W, H);

  // draw & update potatoes
  for (let i = potatoes.length - 1; i >= 0; i--) {
    const p = potatoes[i];
    if (!p.alive || p.isOffScreen(H)) { potatoes.splice(i, 1); continue; }
    p.update();
    p.draw(gCtx);
  }
  // fry particles
  for (let i = fryParticles.length - 1; i >= 0; i--) {
    const fp = fryParticles[i];
    fp.update();
    if (fp.life <= 0) { fryParticles.splice(i, 1); continue; }
    fp.draw(gCtx);
  }
  // steam
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    const sp = steamParticles[i];
    sp.update();
    if (sp.life <= 0) { steamParticles.splice(i, 1); continue; }
    sp.draw(gCtx);
  }

  animFrame = requestAnimationFrame(gameLoop);
}

/* ── Spawn potatoes ── */
function spawnPotato() {
  if (!gameRunning) return;
  potatoes.push(new Potato(W, H));
  const elapsed = GAME_DURATION - timeLeft;
  const interval = Math.max(POTATO_INTERVAL_MIN, POTATO_INTERVAL_START - elapsed * 20);
  spawnTimer = setTimeout(spawnPotato, interval);
}

/* ── Pointer events ── */
function getPointerPos(e) {
  const ev = e.touches ? e.touches[0] : e;
  return { x: ev.clientX, y: ev.clientY };
}

/* ── Finale confetti (falling fries) ── */
let finaleParticles = [];
function startFinaleLoop() {
  fCtx.clearRect(0, 0, W, H);
  // spawn new fries
  if (Math.random() < 0.3) {
    finaleParticles.push({
      x: rand(0, W), y: -30,
      len: rand(25, 50),
      angle: rand(0, Math.PI * 2),
      vy: rand(1, 3),
      va: rand(-0.02, 0.02),
      alpha: 1
    });
  }
  for (let i = finaleParticles.length - 1; i >= 0; i--) {
    const p = finaleParticles[i];
    p.y += p.vy;
    p.angle += p.va;
    if (p.y > H + 60) { finaleParticles.splice(i, 1); continue; }
    fCtx.globalAlpha = 0.7;
    drawFry(fCtx, p.x, p.y, p.len, p.angle);
    fCtx.globalAlpha = 1;
  }
  requestAnimationFrame(startFinaleLoop);
}

/* ── Screen transitions ── */
function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(screen).classList.add('active');
}

function startGame() {
  score = 0;
  timeLeft = GAME_DURATION;
  potatoes = [];
  fryParticles = [];
  steamParticles = [];
  gameRunning = true;
  $('#score').textContent = '0';
  $('#timer').textContent = timeLeft;
  $('#msg-text').textContent = '🥔 TAP THE POTATOES! 🥔';
  clearTimeout(msgTimeout);
  msgTimeout = setTimeout(() => { $('#msg-text').textContent = ''; }, 2000);

  gCanvas = $('#game-canvas');
  gCtx = gCanvas.getContext('2d');
  sizeAll();
  showScreen('#game');

  spawnPotato();
  gameLoop();

  countdownTimer = setInterval(() => {
    timeLeft--;
    $('#timer').textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearTimeout(spawnTimer);
  clearInterval(countdownTimer);
  cancelAnimationFrame(animFrame);
  startFinale();
}

function startFinale() {
  fCanvas = $('#finale-canvas');
  fCtx = fCanvas.getContext('2d');
  sizeAll();

  const f = pick(finaleMessages);
  $('#finale-msg').textContent = f.msg;
  $('#sub-msg').textContent = f.sub;

  // score-based display
  let display = '🍟';
  if (score >= 30) display = '🍟👑🍟';
  else if (score >= 20) display = '🍟🔥🍟';
  else if (score >= 10) display = '🍟✨🍟';
  $('#finale-display').textContent = display;
  $('#final-score').textContent = `You fried ${score} potatoes!`;

  showScreen('#finale');
  startFinaleLoop();
}

/* ── Event listeners ── */
window.addEventListener('resize', sizeAll);

$('#open-btn').addEventListener('click', startGame);
$('#skip-btn').addEventListener('click', endGame);

// Tap / click on game canvas
function handleTap(e) {
  e.preventDefault();
  const pos = getPointerPos(e);
  checkTap(pos.x, pos.y);
}

document.addEventListener('DOMContentLoaded', () => {
  // We attach to #game so taps only register during the game
  const gameEl = $('#game');
  gameEl.addEventListener('pointerdown', handleTap);
  gameEl.addEventListener('touchstart', handleTap, { passive: false });
});
