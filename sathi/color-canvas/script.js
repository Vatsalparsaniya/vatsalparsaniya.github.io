(() => {
  "use strict";

  // ── SVG source: pavelkukov/coloring-pages (CC BY-SA 4.0) ──
  const BASE = "https://raw.githubusercontent.com/pavelkukov/coloring-pages/master/images/";

  const PICKS = [
    // 🐾 Animals
    "bear_with_flower.svg", "sleeping_cat.svg", "cartoon_frog.svg",
    "owl.svg", "alpaca.svg", "donkey.svg", "cute_cow.svg",
    "cute_horse.svg", "shark_jaws.svg", "horse_caricature.svg",
    // 🦋 Insects & Birds
    "cute_butterfly.svg", "ladybug_on_leaf.svg", "hummingbird.svg",
    "spring_bird.svg", "cute_butterfly_flies_over_pumpkin.svg", "dove.svg",
    // 🌊 Sea creatures
    "jellyfish.svg", "octopus.svg", "fishing_fish.svg", "octo.svg",
    // 🏰 Fantasy & Fun
    "kawaii_unicorn_cloud.svg", "creazilla_dragon.svg", "dragon.svg",
    "little_pony.svg", "chibi_princess.svg", "p_is_for_princess.svg",
    "knight_on_horse.svg",
    // 🍎 Food & Objects
    "bitten_apple.svg", "pumpkin.svg", "grape.svg",
    "c_is_for_cake.svg", "d_is_for_donut.svg", "juice_and_cake.svg",
    "gingerbread_man.svg", "easter_basket.svg",
    // ❤️ Shapes & Patterns
    "heart.svg", "five_pointed_star.svg", "butterfly_tattoo.svg",
    "easter_egg.svg", "easter_egg_with_stars.svg",
    "mosaic_heart.svg", "celtic_mandala.svg", "mandala_pattern_2.svg",
    // 🌳 Nature & Scenes
    "trees.svg", "spring_flowers.svg", "spring_rain.svg",
    "summer_beach.svg", "boy_surfer.svg", "camel.svg",
    // 🐰 Easter & Holiday
    "bunny_and_eggs.svg", "two_easter_bunnies.svg",
    "snowman.svg", "santa_and_rudolf.svg",
    // ✏️ Letters
    "a_is_for_airplane.svg", "b_is_for_bird.svg", "e_is_for_egg.svg",
    // 🎨 Art
    "abstract_mandala.svg", "sun_mandala.svg",
    "peace_dove_by_picasso.svg", "locked_heart.svg",
    "girl_with_a_pearl_earring.svg"
  ];

  // ── Expanded color palette (36 colors) ──
  const COLORS = [
    // Reds & Pinks
    "#FF6B6B", "#EF5350", "#E91E63", "#F06292", "#FF80AB",
    // Oranges & Yellows
    "#FF8A65", "#FFB74D", "#FFD54F", "#FFF176", "#FFEE58",
    // Greens
    "#AED581", "#66BB6A", "#4CAF50", "#2E7D32", "#00E676",
    // Teals & Cyans
    "#4DB6AC", "#26A69A", "#00BCD4", "#00E5FF",
    // Blues
    "#4FC3F7", "#64B5F6", "#42A5F5", "#1E88E5", "#1565C0",
    // Purples & Lavenders
    "#7986CB", "#BA68C8", "#AB47BC", "#7C4DFF", "#CE93D8",
    // Browns & Skin tones
    "#A1887F", "#8D6E63", "#FFCCBC", "#D7CCC8",
    // Neutrals
    "#FFFFFF", "#E0E0E0", "#90A4AE", "#455A64", "#263238"
  ];

  // ── Love notes that appear while Sathi colors ──
  const LOVE_NOTES = [
    "you make everything more colorful, Sathi 🎨",
    "even this drawing is jealous of how pretty you are 💕",
    "I wish I could color your world every day ✨",
    "you're my favorite masterpiece 🌸",
    "this is so us — you bring the color, I bring the chaos 😂",
    "watching you create is my favorite thing 💫",
    "every color reminds me of something about you 🦋",
    "you could color outside the lines and I'd still think it's perfect 💗",
    "Sathi + colors = the cutest combination ever 🌈",
    "I made this just so I could see you smile 😊",
    "your happiness is my favorite shade of everything 💜",
    "if love was a color, it'd be whatever you pick next 🎀",
    "V + S, even in coloring books 💌",
    "you're the reason I believe in beautiful things ✨",
    "this is our little world — color it however you want 🌍💕",
  ];

  // ── Encouraging messages on fill ──
  const FILL_MESSAGES = [
    "pretty! 🌸", "love that color! 💕", "ooh nice pick ✨",
    "beautiful! 🎨", "you're so good at this 💗", "perfect! 🌈",
    "gorgeous! 💜", "that's the one! ⭐", "wow Sathi! 🦋",
    "keep going! 💫", "so pretty! 🌺", "artist vibes 🎀",
  ];

  // ── State ──
  let currentColor = COLORS[0];
  let history = [];
  let lineImageData = null;
  let currentFile = "";
  let fillCount = 0;
  let noteShown = false;
  let lastNoteIdx = -1;

  // ── DOM ──
  const intro = document.getElementById("intro");
  const gallery = document.getElementById("gallery");
  const galleryGrid = document.getElementById("galleryGrid");
  const coloring = document.getElementById("coloring");
  const canvasArea = document.getElementById("canvasArea");
  const canvas = document.getElementById("mainCanvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const paletteBar = document.getElementById("paletteBar");
  const drawingName = document.getElementById("drawingName");
  const loveNote = document.getElementById("loveNote");
  const introCanvas = document.getElementById("introCanvas");

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  function prettyName(f) {
    return f.replace(".svg", "").replace(/_/g, " ");
  }

  function randomFrom(arr) {
    let idx;
    do { idx = Math.floor(Math.random() * arr.length); } while (idx === lastNoteIdx && arr.length > 1);
    lastNoteIdx = idx;
    return arr[idx];
  }

  // ══════════════════════
  // Floating hearts background
  // ══════════════════════
  function createFloatingHearts() {
    const container = document.getElementById("floatingHearts");
    const hearts = ["💕", "💗", "💜", "🩷", "🤍", "✨", "🌸"];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.animationDuration = (8 + Math.random() * 12) + "s";
      heart.style.animationDelay = (Math.random() * 10) + "s";
      heart.style.fontSize = (0.8 + Math.random() * 0.8) + "rem";
      container.appendChild(heart);
    }
  }
  createFloatingHearts();

  // ══════════════════════
  // Intro sparkle canvas
  // ══════════════════════
  function initIntroCanvas() {
    const c = introCanvas;
    const cx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.3 + 0.1
      });
    }
    function draw() {
      cx.clearRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255, 107, 138, ${p.o})`;
        cx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > c.width) p.dx *= -1;
        if (p.y < 0 || p.y > c.height) p.dy *= -1;
      });
      if (!intro.classList.contains("hidden")) requestAnimationFrame(draw);
    }
    draw();
  }
  initIntroCanvas();

  // ══════════════════════
  // Intro → Gallery
  // ══════════════════════
  document.getElementById("startBtn").addEventListener("click", () => {
    intro.style.opacity = "0";
    intro.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      intro.classList.add("hidden");
      gallery.classList.remove("hidden");
      loadGallery();
    }, 500);
  });

  function loadGallery() {
    galleryGrid.innerHTML = "";
    PICKS.forEach((file, i) => {
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.style.animation = `cardIn 0.3s ease ${i * 0.03}s both`;
      const img = document.createElement("img");
      img.src = BASE + file;
      img.alt = prettyName(file);
      img.loading = "lazy";
      const label = document.createElement("span");
      label.textContent = prettyName(file);
      card.appendChild(img);
      card.appendChild(label);
      card.addEventListener("click", () => openColoring(file));
      galleryGrid.appendChild(card);
    });
  }

  // ══════════════════════
  // Open coloring page
  // ══════════════════════
  async function openColoring(file) {
    currentFile = file;
    fillCount = 0;
    noteShown = false;
    gallery.classList.add("hidden");
    coloring.classList.remove("hidden");
    drawingName.textContent = prettyName(file);
    history = [];
    lineImageData = null;
    buildPalette();

    try {
      const res = await fetch(BASE + file);
      const svgText = await res.text();
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const areaRect = canvasArea.getBoundingClientRect();
        const maxW = areaRect.width - 16;
        const maxH = areaRect.height - 16;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1.5);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);

        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);

        lineImageData = ctx.getImageData(0, 0, w, h);
        saveState();
        toast("tap any white area to fill it 🎨");
      };
      img.onerror = () => toast("couldn't load this one 😢");
      img.src = url;
    } catch {
      toast("couldn't load this one 😢");
    }
  }

  // ══════════════════════
  // Show love note
  // ══════════════════════
  function showLoveNote() {
    loveNote.textContent = randomFrom(LOVE_NOTES);
    loveNote.classList.remove("visible");
    void loveNote.offsetWidth; // reflow
    loveNote.classList.add("visible");
    setTimeout(() => loveNote.classList.remove("visible"), 3500);
  }

  // ══════════════════════
  // Flood Fill
  // ══════════════════════
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16)
    ];
  }

  function floodFill(startX, startY, fillHex) {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const [fr, fg, fb] = hexToRgb(fillHex);

    const startIdx = (startY * w + startX) * 4;
    const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2];

    if (sr === fr && sg === fg && sb === fb) return false;
    if (sr < 50 && sg < 50 && sb < 50) return false;

    const tolerance = 30;
    const visited = new Uint8Array(w * h);

    function matches(i) {
      return Math.abs(data[i] - sr) <= tolerance &&
             Math.abs(data[i + 1] - sg) <= tolerance &&
             Math.abs(data[i + 2] - sb) <= tolerance;
    }

    const queue = [[startX, startY]];
    visited[startY * w + startX] = 1;

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();
      let lx = cx;
      while (lx > 0 && !visited[cy * w + (lx - 1)] && matches((cy * w + (lx - 1)) * 4)) {
        lx--; visited[cy * w + lx] = 1;
      }
      let rx = cx;
      while (rx < w - 1 && !visited[cy * w + (rx + 1)] && matches((cy * w + (rx + 1)) * 4)) {
        rx++; visited[cy * w + rx] = 1;
      }
      for (let x = lx; x <= rx; x++) {
        const pi = (cy * w + x) * 4;
        data[pi] = fr; data[pi + 1] = fg; data[pi + 2] = fb; data[pi + 3] = 255;
      }
      for (let x = lx; x <= rx; x++) {
        if (cy > 0) {
          const ni = (cy - 1) * w + x;
          if (!visited[ni] && matches(ni * 4)) { visited[ni] = 1; queue.push([x, cy - 1]); }
        }
        if (cy < h - 1) {
          const ni = (cy + 1) * w + x;
          if (!visited[ni] && matches(ni * 4)) { visited[ni] = 1; queue.push([x, cy + 1]); }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Restore black outlines
    if (lineImageData) {
      const ld = lineImageData.data;
      const cd = ctx.getImageData(0, 0, w, h);
      const d = cd.data;
      for (let i = 0; i < ld.length; i += 4) {
        if (ld[i] < 60 && ld[i + 1] < 60 && ld[i + 2] < 60) {
          d[i] = ld[i]; d[i + 1] = ld[i + 1]; d[i + 2] = ld[i + 2]; d[i + 3] = ld[i + 3];
        }
      }
      ctx.putImageData(cd, 0, 0);
    }
    return true;
  }

  // ══════════════════════
  // Canvas click → fill
  // ══════════════════════
  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY)
    };
  }

  function handleFill(x, y) {
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
    const filled = floodFill(x, y, currentColor);
    if (filled) {
      saveState();
      fillCount++;

      // Show encouraging message every few fills
      if (fillCount % 3 === 0) {
        toast(randomFrom(FILL_MESSAGES));
      }

      // Show a love note after some coloring
      if (fillCount === 5 && !noteShown) {
        noteShown = true;
        setTimeout(() => showLoveNote(), 500);
      }
      if (fillCount > 5 && fillCount % 8 === 0) {
        setTimeout(() => showLoveNote(), 300);
      }
    }
  }

  canvas.addEventListener("click", (e) => {
    const pos = getCanvasPos(e);
    handleFill(pos.x, pos.y);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const t = e.changedTouches[0];
    handleFill(
      Math.round((t.clientX - rect.left) * scaleX),
      Math.round((t.clientY - rect.top) * scaleY)
    );
  });

  // ══════════════════════
  // Palette
  // ══════════════════════
  function buildPalette() {
    paletteBar.innerHTML = "";
    COLORS.forEach(c => {
      const dot = document.createElement("div");
      dot.className = "color-dot" + (c === currentColor ? " active" : "");
      dot.style.background = c;
      if (c === "#FFFFFF") dot.style.border = "3px solid #ddd";
      dot.addEventListener("click", () => {
        currentColor = c;
        document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
      });
      paletteBar.appendChild(dot);
    });
  }

  // ══════════════════════
  // Undo / Save / Back
  // ══════════════════════
  function saveState() {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 30) history.shift();
  }

  document.getElementById("undoBtn").addEventListener("click", () => {
    if (history.length > 1) {
      history.pop();
      ctx.putImageData(history[history.length - 1], 0, 0);
    } else {
      toast("nothing to undo 🤷‍♂️");
    }
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    // Add a cute watermark before saving
    const w = canvas.width, h = canvas.height;
    const saved = ctx.getImageData(0, 0, w, h);

    ctx.font = `${Math.max(12, w * 0.025)}px Caveat, cursive`;
    ctx.fillStyle = "rgba(180, 140, 170, 0.35)";
    ctx.textAlign = "right";
    ctx.fillText("colored by Sathi 💕 — V+S", w - 8, h - 8);

    const link = document.createElement("a");
    link.download = prettyName(currentFile).replace(/\s+/g, "_") + "_by_sathi.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Restore canvas without watermark
    ctx.putImageData(saved, 0, 0);
    toast("saved your masterpiece! 📥💕");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    coloring.classList.add("hidden");
    gallery.classList.remove("hidden");
    history = [];
    lineImageData = null;
    loveNote.classList.remove("visible");
  });
})();
