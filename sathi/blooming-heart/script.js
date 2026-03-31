/* ═══════════════════════════════════════════
   Blooming Heart — script.js
   Inspired by ritvikbhatia/LoveProject
   Rewritten from scratch, no jQuery, adapted
   for Sathi project dark romantic theme.
   ═══════════════════════════════════════════ */

// ── Vector helper ──
class Vec {
  constructor(x, y) { this.x = x; this.y = y; }
  rotate(t) {
    const c = Math.cos(t), s = Math.sin(t);
    const x = c * this.x - s * this.y;
    const y = s * this.x + c * this.y;
    this.x = x; this.y = y;
    return this;
  }
  mult(f) { this.x *= f; this.y *= f; return this; }
  clone() { return new Vec(this.x, this.y); }
}

// ── Petal ──
class Petal {
  constructor(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
    this.stretchA = stretchA;
    this.stretchB = stretchB;
    this.startAngle = startAngle;
    this.angle = angle;
    this.bloom = bloom;
    this.growFactor = growFactor;
    this.r = 1;
    this.done = false;
  }
  draw() {
    const ctx = this.bloom.garden.ctx;
    const deg = a => (Math.PI * 2 / 360) * a;
    const v1 = new Vec(0, this.r).rotate(deg(this.startAngle));
    const v2 = v1.clone().rotate(deg(this.angle));
    const v3 = v1.clone().mult(this.stretchA);
    const v4 = v2.clone().mult(this.stretchB);
    ctx.strokeStyle = this.bloom.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
    ctx.stroke();
  }
  render() {
    if (this.r <= this.bloom.r) {
      this.r += this.growFactor;
      this.draw();
    } else {
      this.done = true;
    }
  }
}

// ── Bloom (a single flower) ──
class Bloom {
  constructor(x, y, r, color, petalCount, garden) {
    this.x = x; this.y = y;
    this.r = r; this.color = color;
    this.petals = [];
    this.garden = garden;
    const angle = 360 / petalCount;
    const start = Math.floor(Math.random() * 90);
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(new Petal(
        rand(0.1, 3), rand(0.1, 3),
        start + i * angle, angle,
        rand(0.1, 1), this
      ));
    }
    garden.blooms.push(this);
  }
  draw() {
    const ctx = this.garden.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    let allDone = true;
    for (const p of this.petals) {
      p.render();
      if (!p.done) allDone = false;
    }
    ctx.restore();
    return allDone;
  }
}

// ── Garden (canvas manager) ──
class GardenCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.globalCompositeOperation = 'lighter';
    this.blooms = [];
    this.timer = null;
  }
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.globalCompositeOperation = 'lighter';
  }
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.render(), 1000 / 60);
  }
  render() {
    this.blooms = this.blooms.filter(b => !b.draw());
  }
  clear() {
    this.blooms = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  createBloom(x, y) {
    const r = randInt(8, 10);
    const pc = randInt(8, 15);
    // Pink/rose color palette — higher opacity so it's visible on dark bg
    const cr = Math.round(rand(180, 255));
    const cg = Math.round(rand(50, 150));
    const cb = Math.round(rand(80, 180));
    const color = `rgba(${cr},${cg},${cb},0.3)`;
    new Bloom(x, y, r, color, pc, this);
  }
  // CSS-pixel dimensions (not device pixels)
  get cssWidth() {
    return this.canvas.parentElement.getBoundingClientRect().width;
  }
  get cssHeight() {
    return this.canvas.parentElement.getBoundingClientRect().height;
  }
}

// ── Helpers ──
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ── Heart parametric curve ──
function getHeartPoint(angle, ox, oy, scale) {
  const t = angle / Math.PI;
  const x = scale * (16 * Math.pow(Math.sin(t), 3));
  const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return [ox + x, oy + y];
}

// ── Heart bloom animation ──
function startHeartAnimation(garden) {
  const w = garden.cssWidth;
  const h = garden.cssHeight;
  const ox = w / 2;
  const oy = h / 2 - 10;
  const scale = Math.min(w, h) / 34;

  let angle = 10;
  const plotted = [];

  const timer = setInterval(() => {
    const pt = getHeartPoint(angle, ox, oy, scale);
    let tooClose = false;
    for (const p of plotted) {
      const dist = Math.sqrt((p[0] - pt[0]) ** 2 + (p[1] - pt[1]) ** 2);
      if (dist < 10) { tooClose = true; break; }
    }
    if (!tooClose) {
      plotted.push(pt);
      garden.createBloom(pt[0], pt[1]);
    }
    if (angle >= 30) {
      clearInterval(timer);
    } else {
      angle += 0.15;
    }
  }, 40);
}

// ── Typewriter effect (no jQuery) ──
function typewrite(el, html, speed = 60) {
  return new Promise(resolve => {
    el.innerHTML = '';
    el.style.opacity = '1';
    el.classList.add('typed');
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.textContent = '_';

    function tick() {
      if (i < html.length) {
        // Skip over HTML tags entirely
        if (html[i] === '<') {
          const close = html.indexOf('>', i);
          i = close !== -1 ? close + 1 : i + 1;
          // If it was a self-closing or end tag followed by more tags, keep skipping
          while (i < html.length && html[i] === '<') {
            const next = html.indexOf('>', i);
            i = next !== -1 ? next + 1 : i + 1;
          }
        }
        // Now advance one visible character
        if (i < html.length && html[i] !== '<') {
          i++;
        }
        el.innerHTML = html.substring(0, i);
        el.appendChild(cursor);
        setTimeout(tick, speed);
      } else {
        el.innerHTML = html;
        setTimeout(() => { if (cursor.parentNode) cursor.remove(); }, 1500);
        resolve();
      }
    }
    tick();
  });
}

// ── Floating Hearts ──
const hEl = document.getElementById('hearts');
const emo = ['✨', '🌸', '💗'];
function spawnHeart() {
  if (hEl.childElementCount >= 3) return;
  const h = document.createElement('span');
  h.classList.add('heart');
  h.textContent = emo[Math.floor(Math.random() * emo.length)];
  h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = (Math.random() * 0.4 + 0.4) + 'rem';
  const dur = Math.random() * 10 + 10;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay = Math.random() * 2 + 's';
  hEl.appendChild(h);
  setTimeout(() => h.remove(), (dur + 3) * 1000);
}
setInterval(spawnHeart, 4500);
for (let i = 0; i < 2; i++) setTimeout(spawnHeart, i * 700);

// ── Init ──
const gardenCanvas = document.getElementById('garden');
const garden = new GardenCanvas(gardenCanvas);

// Wait for layout to settle before sizing canvas
function initGarden() {
  garden.resize();
  garden.start();
}

// Use requestAnimationFrame to ensure layout is computed
if (document.readyState === 'complete') {
  requestAnimationFrame(initGarden);
} else {
  window.addEventListener('load', () => requestAnimationFrame(initGarden));
}

// Resize handling
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => garden.resize(), 200);
});

// Typewriter the code section, then enable the heart button
const codeEl = document.getElementById('code');
const codeHTML = codeEl.innerHTML;

// Start typewriter
typewrite(codeEl, codeHTML, 30);

// Heart button — use event delegation since typewriter rebuilds the DOM
let bloomed = false;
codeEl.addEventListener('click', (e) => {
  const btn = e.target.closest('#btn-bloom');
  if (!btn || bloomed) return;
  bloomed = true;
  btn.style.animation = 'none';
  btn.style.transform = 'scale(1.3)';
  btn.style.opacity = '0.5';
  startHeartAnimation(garden);
});
