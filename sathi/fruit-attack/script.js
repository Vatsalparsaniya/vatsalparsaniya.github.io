(() => {
  /* ─── Helpers ─── */
  const $ = s => document.querySelector(s);
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ─── DOM refs ─── */
  const intro    = $('#intro');
  const chaos    = $('#chaos');
  const finale   = $('#finale');
  const openBtn  = $('#open-btn');
  const escapeBtn = $('#escape-btn');
  const msgText  = $('#msg-text');
  const canvas   = $('#fruit-canvas');
  const ctx      = canvas.getContext('2d');
  const fCanvas  = $('#finale-canvas');
  const fCtx     = fCanvas.getContext('2d');

  /* ─── Fruit definitions — realistic colors & shapes ─── */
  const FRUIT_TYPES = [
    {
      name: 'apple',
      outer: ['#dc2626','#b91c1c','#ef4444'],
      inner: '#fef9c3',
      seeds: '#78350f',
      stem: '#5c4033',
      leaf: '#22c55e',
      radius: 1,
      drawOuter(c, r) { drawAppleShape(c, r); },
      drawInner(c, r) { drawAppleCross(c, r); }
    },
    {
      name: 'orange',
      outer: ['#f97316','#ea580c','#fb923c'],
      inner: '#fed7aa',
      seeds: '#9a3412',
      stem: '#5c4033',
      leaf: '#16a34a',
      radius: 1,
      drawOuter(c, r) { drawCircleFruit(c, r); },
      drawInner(c, r) { drawOrangeCross(c, r); }
    },
    {
      name: 'watermelon',
      outer: ['#166534','#15803d','#22c55e'],
      inner: '#fca5a5',
      seeds: '#1c1917',
      stem: null,
      leaf: null,
      radius: 1.25,
      drawOuter(c, r) { drawOvalFruit(c, r, 1.25); },
      drawInner(c, r) { drawWatermelonCross(c, r); }
    },
    {
      name: 'kiwi',
      outer: ['#78716c','#8b7355','#a3a08a'],
      inner: '#86efac',
      seeds: '#1c1917',
      stem: null,
      leaf: null,
      radius: 0.85,
      drawOuter(c, r) { drawOvalFruit(c, r, 1.1); },
      drawInner(c, r) { drawKiwiCross(c, r); }
    },
    {
      name: 'mango',
      outer: ['#facc15','#f59e0b','#fbbf24'],
      inner: '#fef08a',
      seeds: '#a16207',
      stem: '#5c4033',
      leaf: '#16a34a',
      radius: 1.1,
      drawOuter(c, r) { drawMangoShape(c, r); },
      drawInner(c, r) { drawMangoCross(c, r); }
    },
    {
      name: 'strawberry',
      outer: ['#dc2626','#ef4444','#f87171'],
      inner: '#fecaca',
      seeds: '#fef08a',
      stem: null,
      leaf: '#16a34a',
      radius: 0.9,
      drawOuter(c, r) { drawStrawberryShape(c, r); },
      drawInner(c, r) { drawStrawberryCross(c, r); }
    },
    {
      name: 'grape',
      outer: ['#7c3aed','#6d28d9','#a78bfa'],
      inner: '#c4b5fd',
      seeds: '#4c1d95',
      stem: '#5c4033',
      leaf: '#22c55e',
      radius: 0.6,
      drawOuter(c, r) { drawCircleFruit(c, r); },
      drawInner(c, r) { drawGrapeCross(c, r); }
    },
    {
      name: 'peach',
      outer: ['#fb923c','#fdba74','#fca5a5'],
      inner: '#fef3c7',
      seeds: '#92400e',
      stem: '#5c4033',
      leaf: '#22c55e',
      radius: 0.95,
      drawOuter(c, r) { drawPeachShape(c, r); },
      drawInner(c, r) { drawPeachCross(c, r); }
    }
  ];

  /* ─── Fruit shape drawing functions ─── */

  function drawCircleFruit(c, r) {
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.closePath();
  }

  function drawOvalFruit(c, r, stretch) {
    c.beginPath();
    c.ellipse(0, 0, r * stretch, r, 0, 0, Math.PI * 2);
    c.closePath();
  }

  function drawAppleShape(c, r) {
    c.beginPath();
    c.moveTo(0, -r * 0.85);
    c.bezierCurveTo(-r * 0.4, -r * 1.1, -r * 1.15, -r * 0.6, -r * 0.95, 0);
    c.bezierCurveTo(-r * 0.8, r * 0.7, -r * 0.3, r * 1.05, 0, r);
    c.bezierCurveTo(r * 0.3, r * 1.05, r * 0.8, r * 0.7, r * 0.95, 0);
    c.bezierCurveTo(r * 1.15, -r * 0.6, r * 0.4, -r * 1.1, 0, -r * 0.85);
    c.closePath();
  }

  function drawMangoShape(c, r) {
    c.beginPath();
    c.moveTo(0, -r);
    c.bezierCurveTo(-r * 0.6, -r * 0.9, -r * 0.9, -r * 0.2, -r * 0.75, r * 0.3);
    c.bezierCurveTo(-r * 0.6, r * 0.8, -r * 0.2, r * 1.1, 0, r * 1.05);
    c.bezierCurveTo(r * 0.2, r * 1.1, r * 0.6, r * 0.8, r * 0.75, r * 0.3);
    c.bezierCurveTo(r * 0.9, -r * 0.2, r * 0.6, -r * 0.9, 0, -r);
    c.closePath();
  }

  function drawStrawberryShape(c, r) {
    c.beginPath();
    c.moveTo(0, -r * 0.7);
    c.bezierCurveTo(-r * 0.5, -r * 0.9, -r * 0.9, -r * 0.3, -r * 0.7, r * 0.2);
    c.bezierCurveTo(-r * 0.5, r * 0.7, -r * 0.15, r * 1.1, 0, r * 1.15);
    c.bezierCurveTo(r * 0.15, r * 1.1, r * 0.5, r * 0.7, r * 0.7, r * 0.2);
    c.bezierCurveTo(r * 0.9, -r * 0.3, r * 0.5, -r * 0.9, 0, -r * 0.7);
    c.closePath();
  }

  function drawPeachShape(c, r) {
    c.beginPath();
    c.moveTo(0, -r * 0.8);
    c.bezierCurveTo(-r * 0.3, -r * 1.0, -r * 1.05, -r * 0.5, -r * 0.9, r * 0.1);
    c.bezierCurveTo(-r * 0.75, r * 0.7, -r * 0.2, r * 1.0, 0, r * 0.95);
    c.bezierCurveTo(r * 0.2, r * 1.0, r * 0.75, r * 0.7, r * 0.9, r * 0.1);
    c.bezierCurveTo(r * 1.05, -r * 0.5, r * 0.3, -r * 1.0, 0, -r * 0.8);
    c.closePath();
  }

  /* ─── Cross-section (sliced) drawing functions ─── */

  function drawAppleCross(c, r) {
    // Cream interior
    c.beginPath();
    c.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    c.fillStyle = '#fef9c3';
    c.fill();
    // Core
    c.beginPath();
    c.ellipse(0, 0, r * 0.2, r * 0.35, 0, 0, Math.PI * 2);
    c.fillStyle = '#fde68a';
    c.fill();
    // Seeds
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      c.save();
      c.translate(Math.cos(a) * r * 0.25, Math.sin(a) * r * 0.25);
      c.rotate(a + Math.PI / 2);
      c.beginPath();
      c.ellipse(0, 0, r * 0.03, r * 0.07, 0, 0, Math.PI * 2);
      c.fillStyle = '#78350f';
      c.fill();
      c.restore();
    }
  }

  function drawOrangeCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    c.fillStyle = '#fed7aa';
    c.fill();
    // Segments
    const segs = 8;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      c.save();
      c.rotate(a);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(r * 0.15, r * 0.65);
      c.arc(0, 0, r * 0.7, Math.atan2(r * 0.65, r * 0.15), Math.PI / segs);
      c.closePath();
      c.fillStyle = 'rgba(251, 146, 60, 0.5)';
      c.fill();
      c.strokeStyle = 'rgba(234, 88, 12, 0.3)';
      c.lineWidth = 0.5;
      c.stroke();
      c.restore();
    }
    // Center
    c.beginPath();
    c.arc(0, 0, r * 0.1, 0, Math.PI * 2);
    c.fillStyle = '#fff7ed';
    c.fill();
  }

  function drawWatermelonCross(c, r) {
    // Pink flesh
    c.beginPath();
    c.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    c.fillStyle = '#fca5a5';
    c.fill();
    // Lighter center
    const cg = c.createRadialGradient(0, 0, 0, 0, 0, r * 0.85);
    cg.addColorStop(0, 'rgba(254,202,202,0.6)');
    cg.addColorStop(1, 'rgba(252,165,165,0)');
    c.fillStyle = cg;
    c.fill();
    // Seeds
    for (let i = 0; i < 12; i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(r * 0.15, r * 0.65);
      c.save();
      c.translate(Math.cos(a) * d, Math.sin(a) * d);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 0, r * 0.025, r * 0.05, 0, 0, Math.PI * 2);
      c.fillStyle = '#1c1917';
      c.fill();
      c.restore();
    }
  }

  function drawKiwiCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    c.fillStyle = '#86efac';
    c.fill();
    // White center
    c.beginPath();
    c.ellipse(0, 0, r * 0.12, r * 0.25, 0, 0, Math.PI * 2);
    c.fillStyle = '#f0fdf4';
    c.fill();
    // Seed rays
    const rays = 20;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      c.save();
      c.rotate(a);
      // Ray line
      c.beginPath();
      c.moveTo(0, r * 0.15);
      c.lineTo(0, r * 0.7);
      c.strokeStyle = 'rgba(34,197,94,0.3)';
      c.lineWidth = 0.5;
      c.stroke();
      // Tiny seeds along ray
      for (let j = 0; j < 3; j++) {
        const d = r * 0.3 + j * r * 0.15;
        c.beginPath();
        c.arc(0, d, r * 0.015, 0, Math.PI * 2);
        c.fillStyle = '#1c1917';
        c.fill();
      }
      c.restore();
    }
  }

  function drawMangoCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    c.fillStyle = '#fef08a';
    c.fill();
    // Pit
    c.beginPath();
    c.ellipse(0, 0, r * 0.25, r * 0.4, 0, 0, Math.PI * 2);
    c.fillStyle = '#fde68a';
    c.strokeStyle = '#d97706';
    c.lineWidth = 1;
    c.fill();
    c.stroke();
  }

  function drawStrawberryCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    c.fillStyle = '#fecaca';
    c.fill();
    // Seeds on surface
    for (let i = 0; i < 15; i++) {
      const a = rand(0, Math.PI * 2);
      const d = rand(r * 0.1, r * 0.7);
      c.beginPath();
      c.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.02, 0, Math.PI * 2);
      c.fillStyle = '#fef08a';
      c.fill();
    }
    // Center
    c.beginPath();
    c.arc(0, 0, r * 0.12, 0, Math.PI * 2);
    c.fillStyle = '#fca5a5';
    c.fill();
  }

  function drawGrapeCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    c.fillStyle = '#c4b5fd';
    c.fill();
    // Seeds
    c.save();
    c.translate(-r * 0.1, 0);
    c.beginPath();
    c.ellipse(0, 0, r * 0.06, r * 0.12, -0.3, 0, Math.PI * 2);
    c.fillStyle = '#4c1d95';
    c.fill();
    c.restore();
    c.save();
    c.translate(r * 0.1, 0);
    c.beginPath();
    c.ellipse(0, 0, r * 0.06, r * 0.12, 0.3, 0, Math.PI * 2);
    c.fillStyle = '#4c1d95';
    c.fill();
    c.restore();
  }

  function drawPeachCross(c, r) {
    c.beginPath();
    c.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    c.fillStyle = '#fef3c7';
    c.fill();
    // Pit
    c.beginPath();
    c.ellipse(0, 0, r * 0.2, r * 0.28, 0, 0, Math.PI * 2);
    c.fillStyle = '#92400e';
    c.fill();
    // Pit texture
    c.beginPath();
    c.ellipse(0, 0, r * 0.15, r * 0.22, 0, 0, Math.PI * 2);
    c.fillStyle = '#78350f';
    c.fill();
  }

  /* ─── Draw a complete whole fruit ─── */
  function drawWholeFruit(c, type, r) {
    c.save();
    // Shadow
    c.shadowColor = 'rgba(0,0,0,0.25)';
    c.shadowBlur = r * 0.3;
    c.shadowOffsetY = r * 0.1;

    // Main body
    type.drawOuter(c, r);
    const grad = c.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, type.outer[2] || type.outer[0]);
    grad.addColorStop(0.6, type.outer[0]);
    grad.addColorStop(1, type.outer[1]);
    c.fillStyle = grad;
    c.fill();

    // Specular highlight
    c.shadowColor = 'transparent';
    c.beginPath();
    c.ellipse(-r * 0.25, -r * 0.3, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fill();

    // Stem
    if (type.stem) {
      c.beginPath();
      c.moveTo(0, -r * 0.85);
      c.quadraticCurveTo(r * 0.05, -r * 1.15, r * 0.08, -r * 1.25);
      c.lineWidth = r * 0.06;
      c.strokeStyle = type.stem;
      c.lineCap = 'round';
      c.stroke();
    }

    // Leaf
    if (type.leaf) {
      c.save();
      c.translate(r * 0.08, -r * 1.1);
      c.rotate(0.4);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(r * 0.15, -r * 0.1, r * 0.3, -r * 0.05, r * 0.35, r * 0.05);
      c.bezierCurveTo(r * 0.25, r * 0.1, r * 0.1, r * 0.08, 0, 0);
      c.fillStyle = type.leaf;
      c.fill();
      // Leaf vein
      c.beginPath();
      c.moveTo(r * 0.02, r * 0.01);
      c.quadraticCurveTo(r * 0.18, -r * 0.01, r * 0.32, r * 0.04);
      c.strokeStyle = 'rgba(0,0,0,0.15)';
      c.lineWidth = 0.5;
      c.stroke();
      c.restore();
    }

    c.restore();
  }

  /* ─── Draw a sliced half ─── */
  function drawSlicedHalf(c, type, r, isLeft) {
    c.save();
    // Clip to half
    c.beginPath();
    if (isLeft) {
      c.rect(-r * 1.5, -r * 1.5, r * 1.5, r * 3);
    } else {
      c.rect(0, -r * 1.5, r * 1.5, r * 3);
    }
    c.clip();

    // Outer skin ring
    type.drawOuter(c, r);
    const grad = c.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, type.outer[2] || type.outer[0]);
    grad.addColorStop(0.6, type.outer[0]);
    grad.addColorStop(1, type.outer[1]);
    c.fillStyle = grad;
    c.fill();

    // Inner cross-section
    type.drawInner(c, r);

    c.restore();
  }

  /* ─── Juice particle class ─── */
  class JuiceParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.vx = rand(-4, 4);
      this.vy = rand(-6, 2);
      this.r = rand(2, 6);
      this.color = color;
      this.life = 1;
      this.decay = rand(0.015, 0.035);
      this.gravity = 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.life -= this.decay;
    }
    draw(c) {
      if (this.life <= 0) return;
      c.globalAlpha = this.life * 0.8;
      c.beginPath();
      c.arc(this.x, this.y, this.r * this.life, 0, Math.PI * 2);
      c.fillStyle = this.color;
      c.fill();
      c.globalAlpha = 1;
    }
  }

  /* ─── Fruit object (whole, flying up) ─── */
  class Fruit {
    constructor(W, H) {
      this.type = pick(FRUIT_TYPES);
      this.r = rand(28, 48) * (Math.min(W, H) / 700);
      this.x = rand(W * 0.15, W * 0.85);
      this.y = H + this.r * 2;
      this.vx = rand(-2, 2);
      this.vy = rand(-H * 0.014, -H * 0.009);
      this.gravity = H * 0.00012;
      this.rotation = rand(0, Math.PI * 2);
      this.rotSpeed = rand(-0.06, 0.06);
      this.sliced = false;
      this.halves = null;
    }
    update() {
      if (this.sliced) return;
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.rotSpeed;
    }
    draw(c) {
      if (this.sliced) return;
      c.save();
      c.translate(this.x, this.y);
      c.rotate(this.rotation);
      drawWholeFruit(c, this.type, this.r);
      c.restore();
    }
    isOffScreen(H) {
      return this.y > H + this.r * 3;
    }
    hitTest(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      return Math.sqrt(dx * dx + dy * dy) < this.r * 1.3;
    }
  }

  /* ─── Sliced half ─── */
  class FruitHalf {
    constructor(x, y, type, r, isLeft) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.r = r;
      this.isLeft = isLeft;
      this.vx = isLeft ? rand(-5, -2) : rand(2, 5);
      this.vy = rand(-4, -1);
      this.gravity = 0.18;
      this.rotation = rand(0, Math.PI * 2);
      this.rotSpeed = isLeft ? rand(-0.1, -0.04) : rand(0.04, 0.1);
      this.life = 1;
      this.decay = 0.008;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
    }
    draw(c) {
      if (this.life <= 0) return;
      c.save();
      c.globalAlpha = Math.max(0, this.life);
      c.translate(this.x, this.y);
      c.rotate(this.rotation);
      drawSlicedHalf(c, this.type, this.r, this.isLeft);
      c.globalAlpha = 1;
      c.restore();
    }
  }

  /* ─── Slash trail ─── */
  class SlashTrail {
    constructor() {
      this.points = [];
      this.life = 1;
    }
    addPoint(x, y) {
      this.points.push({ x, y, t: Date.now() });
      if (this.points.length > 20) this.points.shift();
    }
    draw(c) {
      const now = Date.now();
      this.points = this.points.filter(p => now - p.t < 200);
      if (this.points.length < 2) return;
      c.save();
      c.lineCap = 'round';
      c.lineJoin = 'round';
      for (let i = 1; i < this.points.length; i++) {
        const age = (now - this.points[i].t) / 200;
        const alpha = 1 - age;
        const width = (1 - age) * 4 + 1;
        c.beginPath();
        c.moveTo(this.points[i - 1].x, this.points[i - 1].y);
        c.lineTo(this.points[i].x, this.points[i].y);
        c.strokeStyle = `rgba(255,255,255,${alpha * 0.7})`;
        c.lineWidth = width;
        c.stroke();
      }
      c.restore();
    }
  }

  /* ─── Messages ─── */
  const messages = [
    '🍎 SURPRISE! 🍎',
    'EAT FRUITS SATHI 🍌',
    "You can't escape 🍇",
    'Fruits love you 🍓',
    'Vitamin C is calling 🍊',
    'One mango? Please? 🥭',
    'Just one bite? 🍑',
    'Fruits miss you 😢🍉',
    'Your body needs us 🍍',
    "We're not leaving 🥝",
  ];

  /* ─── Main chaos engine ─── */
  let W, H;
  let fruits = [];
  let halves = [];
  let juiceParticles = [];
  let slashTrail = new SlashTrail();
  let chaosRunning = false;
  let spawnTimer = 0;
  let msgIndex = 0;
  let msgTimer = 0;
  let isPointerDown = false;
  let lastPointer = { x: 0, y: 0 };

  function resizeCanvas(cvs) {
    cvs.width = cvs.clientWidth * dpr;
    cvs.height = cvs.clientHeight * dpr;
  }

  function sizeAll() {
    W = window.innerWidth;
    H = window.innerHeight;
    resizeCanvas(canvas);
    resizeCanvas(fCanvas);
  }

  function sliceFruit(fruit) {
    fruit.sliced = true;
    // Spawn two halves
    halves.push(new FruitHalf(fruit.x, fruit.y, fruit.type, fruit.r, true));
    halves.push(new FruitHalf(fruit.x, fruit.y, fruit.type, fruit.r, false));
    // Juice burst
    const juiceColor = fruit.type.inner;
    const splashColor = fruit.type.outer[0];
    for (let i = 0; i < 18; i++) {
      juiceParticles.push(new JuiceParticle(fruit.x, fruit.y, i % 3 === 0 ? splashColor : juiceColor));
    }
  }

  function checkSlice(px, py) {
    for (const f of fruits) {
      if (!f.sliced && f.hitTest(px, py)) {
        sliceFruit(f);
      }
    }
  }

  function chaosLoop() {
    if (!chaosRunning) return;
    const c = ctx;
    c.save();
    c.scale(dpr, dpr);
    c.clearRect(0, 0, W, H);

    // Spawn fruits
    spawnTimer++;
    if (spawnTimer % 30 === 0) {
      fruits.push(new Fruit(W, H));
    }
    if (spawnTimer % 50 === 0 && fruits.length < 15) {
      fruits.push(new Fruit(W, H));
    }

    // Messages
    msgTimer++;
    if (msgTimer % 120 === 0) {
      msgIndex = (msgIndex + 1) % messages.length;
      msgText.textContent = messages[msgIndex];
    }

    // Update & draw fruits
    fruits.forEach(f => { f.update(); f.draw(c); });
    fruits = fruits.filter(f => !f.isOffScreen(H) || f.sliced);
    // Remove old sliced
    fruits = fruits.filter(f => !f.sliced);

    // Halves
    halves.forEach(h => { h.update(); h.draw(c); });
    halves = halves.filter(h => h.life > 0);

    // Juice
    juiceParticles.forEach(p => { p.update(); p.draw(c); });
    juiceParticles = juiceParticles.filter(p => p.life > 0);

    // Slash trail
    slashTrail.draw(c);

    c.restore();
    requestAnimationFrame(chaosLoop);
  }

  /* ─── Pointer / touch handling ─── */
  function getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  canvas.addEventListener('pointerdown', e => {
    isPointerDown = true;
    const p = getPointerPos(e);
    lastPointer = p;
    slashTrail = new SlashTrail();
    slashTrail.addPoint(p.x, p.y);
    checkSlice(p.x, p.y);
  });

  canvas.addEventListener('pointermove', e => {
    if (!isPointerDown) return;
    const p = getPointerPos(e);
    slashTrail.addPoint(p.x, p.y);
    // Check along the line from last to current
    const dx = p.x - lastPointer.x;
    const dy = p.y - lastPointer.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / 10));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      checkSlice(lastPointer.x + dx * t, lastPointer.y + dy * t);
    }
    lastPointer = p;
  });

  canvas.addEventListener('pointerup', () => { isPointerDown = false; });
  canvas.addEventListener('pointerleave', () => { isPointerDown = false; });

  /* ─── Finale engine ─── */
  let finaleRunning = false;
  let finaleFruits = [];
  let finaleJuice = [];
  let finaleHalves = [];

  const finaleMessages = [
    { emoji: '🍉', h2: 'You thought you could escape fruits?', sub: 'Never. They love you. Eat them. 🥭🍇🍓' },
    { emoji: '🍌', h2: 'Potassium is chasing you', sub: "You literally cannot run from bananas 🏃‍♀️💨" },
    { emoji: '🍎', h2: 'An apple a day...', sub: '...keeps nobody away from annoying you 😈' },
    { emoji: '🥭', h2: 'Mango says hi', sub: "It's the king of fruits. Bow down, Sathi. 👑" },
    { emoji: '🍓', h2: 'Strawberry forever', sub: 'Sweet, red, and absolutely not leaving you alone 💃' },
  ];

  function startFinaleLoop() {
    if (!finaleRunning) return;
    const c = fCtx;
    c.save();
    c.scale(dpr, dpr);
    c.clearRect(0, 0, W, H);

    // Ambient floating fruits
    if (Math.random() < 0.04 && finaleFruits.length < 12) {
      const f = new Fruit(W, H);
      f.vy = rand(-1.5, -0.5);
      f.gravity = 0.003;
      f.r *= 0.7;
      finaleFruits.push(f);
    }

    finaleFruits.forEach(f => { f.update(); f.draw(c); });
    finaleFruits = finaleFruits.filter(f => !f.isOffScreen(H));

    // Auto-slice random fruits for visual effect
    for (const f of finaleFruits) {
      if (!f.sliced && f.y < H * 0.4 && Math.random() < 0.01) {
        f.sliced = true;
        finaleHalves.push(new FruitHalf(f.x, f.y, f.type, f.r, true));
        finaleHalves.push(new FruitHalf(f.x, f.y, f.type, f.r, false));
        for (let i = 0; i < 10; i++) {
          finaleJuice.push(new JuiceParticle(f.x, f.y, f.type.inner));
        }
      }
    }
    finaleFruits = finaleFruits.filter(f => !f.sliced);

    finaleHalves.forEach(h => { h.update(); h.draw(c); });
    finaleHalves = finaleHalves.filter(h => h.life > 0);

    finaleJuice.forEach(p => { p.update(); p.draw(c); });
    finaleJuice = finaleJuice.filter(p => p.life > 0);

    c.restore();
    requestAnimationFrame(startFinaleLoop);
  }

  /* ─── Screen transitions ─── */
  function showScreen(screen) {
    [intro, chaos, finale].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  function startChaos() {
    sizeAll();
    showScreen(chaos);
    chaosRunning = true;
    requestAnimationFrame(chaosLoop);
  }

  function startFinale() {
    chaosRunning = false;
    showScreen(finale);
    finaleRunning = true;

    // Cycle finale messages
    let fi = 0;
    const fd = $('#finale-fruit-display');
    const fm = $('#finale-msg');
    const fs = $('#sub-msg');
    fd.textContent = finaleMessages[0].emoji;
    fm.textContent = finaleMessages[0].h2;
    fs.textContent = finaleMessages[0].sub;
    setInterval(() => {
      fi = (fi + 1) % finaleMessages.length;
      fd.textContent = finaleMessages[fi].emoji;
      fm.textContent = finaleMessages[fi].h2;
      fs.textContent = finaleMessages[fi].sub;
    }, 3000);

    requestAnimationFrame(startFinaleLoop);
  }

  /* ─── Escape button dodge ─── */
  let escapeCount = 0;
  escapeBtn.addEventListener('mouseenter', () => {
    if (escapeCount < 3) {
      escapeCount++;
      const x = rand(-35, 35);
      const y = rand(-15, 15);
      escapeBtn.style.transform = `translate(${x}vw, ${y}vh)`;
      escapeBtn.style.transition = 'transform 0.3s ease';
    }
  });

  escapeBtn.addEventListener('click', () => startFinale());
  openBtn.addEventListener('click', () => startChaos());

  window.addEventListener('resize', () => {
    sizeAll();
  });
})();
