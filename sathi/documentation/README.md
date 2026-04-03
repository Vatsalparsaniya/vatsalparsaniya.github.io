# Sathi — A Romantic GitHub Pages Site 💕

A personal romantic website made by **Vatsal** for **Sathi**.  
Hosted on GitHub Pages at `https://<username>.github.io/sathi/`

---

## Project Structure

```
sathi/
├── index.html                  ← Landing page (no event links — surprises only)
├── documentation/              ← You are here
│   └── README.md
├── date-ask/                   ← Event: Asking her on a date
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── her-photo.jpg           ← (add Sathi's photo here)
├── airport-pickup/             ← Event: Flight CCU→BLR pickup countdown
│   ├── index.html
│   ├── style.css
│   └── script.js
├── memory-lane/                ← Event: Scroll journey through memories
│   ├── index.html
│   ├── style.css
│   └── script.js
├── blooming-heart/             ← Event: Blooming flower heart + code letter
│   ├── index.html
│   ├── style.css
│   └── script.js
├── bangalore-dreams/           ← Event: Bangalore wishlist mood board
│   ├── index.html
│   ├── style.css
│   └── script.js
├── flower-vase/                ← Event: Interactive flower garden
│   ├── index.html
│   ├── style.css
│   └── script.js
├── fruit-attack/               ← Event: Fruit prank page to annoy Sathi
│   ├── index.html
│   ├── style.css
│   └── script.js
├── hot-wheels/                 ← Event: (WIP)
│   └── images/
├── wallet-photo/               ← Event: (WIP — empty)
├── <future-event>/             ← Each new event gets its own folder
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── her-photo.jpg
└── .kiro/
    └── steering/
        └── project-context.md  ← AI context file (for Kiro)
```

---

## Events

| Folder            | Description                                      | Status |
|-------------------|--------------------------------------------------|--------|
| `date-ask/`       | "Will you go on a date with me?" 🌹               | ✅ Done |
| `airport-pickup/` | Flight tracker CCU→BLR with countdown & welcome 🛬 | ✅ Done |
| `memory-lane/`    | Interactive scroll journey through memories 🌌     | ✅ Done |
| `blooming-heart/` | Blooming flower heart animation with love letter 🌸 | ✅ Done |
| `bangalore-dreams/`| Bangalore places wishlist mood board ✈️            | ✅ Done |
| `flower-vase/`    | Interactive flower garden with whispered thoughts 🌷| ✅ Done |
| `fruit-attack/`   | Fruit prank — raining fruits to annoy Sathi 🍉      | ✅ Done |
| `hot-wheels/`     | (Work in progress) 🏎️                             | 🚧 WIP |
| `wallet-photo/`   | (Work in progress) 📸                              | 🚧 WIP |

---

## How to Add a New Event

1. Create a new folder with the event name (e.g. `birthday/`, `anniversary/`)
2. Inside it, create:
   - `index.html` — the page content
   - `style.css` — styles for this event
   - `script.js` — interactions and animations
3. Optionally drop a `her-photo.jpg` in the folder
4. Share the direct URL with Sathi: `https://<username>.github.io/sathi/<event-name>/`
5. The root `index.html` does NOT list events — each event is a standalone surprise

---

## Design Language

- **Theme:** Dark romantic — deep backgrounds (#1a0011, #2d0a1e) with pink/rose accents
- **Fonts:**
  - `Dancing Script` — cursive, used for headings and signatures
  - `Quicksand` — clean body text
  - `JetBrains Mono` — monospace, used for codes, dates, countdown values
- **Color Palette:**
  - Primary: `#ec407a`
  - Light pink: `#f48fb1`, `#f8bbd0`, `#fce4ec`
  - Deep pink: `#ad1457`
- **Responsiveness:** Uses `clamp()`, `dvh` units, fluid sizing — works on phone and laptop
- **Performance:** Fewer particles/animations on mobile devices
- **Layout:** Single-viewport on desktop, scrollable full-screen sections on mobile
- **Personalization:** All content references Sathi and Vatsal by name
- **Signature:** Every event is signed from Vatsal

---

## Tech Stack

- Pure HTML, CSS, JavaScript — no frameworks, no build tools
- Google Fonts via CDN
- Static hosting on GitHub Pages

---

## Adding Sathi's Photo

Drop a photo named `her-photo.jpg` into any event folder.  
It will appear as a circular image at the top of the page.  
If no photo is found, a placeholder with instructions is shown instead.

---

## date-ask/ — Details

The first event page features:
- Floating heart emojis in the background
- Animated letter-style text that reveals line by line
- "Will you go on a date with me?" question
- **Yes** button → confetti celebration + sweet message
- **No** button → dodges away on hover (desktop) and tap (mobile), with changing text
- Signed from Vatsal

---

## airport-pickup/ — Details

Personalized countdown page for Sathi's flight from Kolkata (CCU) to Bangalore (BLR) on April 5, 2026, landing at 23:20 IST. Dual-layout: scrollable sections on mobile, single-viewport on desktop.

### Mobile Experience (≤768px)
- **Scrollable full-screen sections** — each section (hero, boarding pass, timeline, countdown) gets its own viewport-height screen
- **Sticky flight progress bar** at top — live CCU→BLR progress with animated plane icon based on departure/landing dates
- **Scroll-reveal animations** — sections and timeline items fade in via IntersectionObserver
- **"Swipe up" hint** on hero that fades after first scroll
- **Vertical timeline** with alternating left/right glassmorphic cards

### Desktop Experience (>768px)
- **Single-viewport** — everything fits in one screen, no scrolling
- **Horizontal wavy SVG timeline** — animated plane draws the dashed path on load, revealing milestones as it passes
- Flight progress bar hidden (not needed when everything's visible)

### Shared Features
- **Twinkling star-field** canvas background with floating heart emojis
- **Glassmorphic boarding pass** — "Vatsal Airlines, Love Class" with shimmer animation, tear-off edges (mobile), dashed divider, barcode section, detail grid (date, boarding time, passenger: SATHI, picked up by: VATSAL)
- **5 personalized timeline milestones:**
  - Mar 22: Sathi left for Kolkata 🧳
  - Mar 25: Vatsal missing her already 📱
  - Mar 29: Late night "one more minute" calls 🌙
  - Apr 1: Vatsal counting every hour 📅
  - Apr 5: Sathi & Vatsal together again 🫂
- **Live countdown timer** — days/hours/min/sec to landing (23:20 IST, Apr 5 2026)
- **12 personalized rotating messages** — all written from Vatsal to Sathi by name, cycling every 5 seconds
- **Signed** "Vatsal, already at BLR waiting for you 💌"
- **Performance:** reduced stars/hearts on mobile, debounced resize

---

## memory-lane/ — Details

An interactive, scroll-driven journey through Vatsal & Sathi's relationship. Six full-screen sections, each with unique interactions and animations.

### Sections

1. **Hero with Constellation Sky** — Twinkling star-field canvas, animated title with gradient glow, scroll-down hint with bouncing arrow
2. **Memory Jar 🫙** — A glass jar containing 6 tappable memory notes. Each note opens a modal with a personalized memory written from Vatsal. Notes wobble gently inside the jar with a soft glow underneath
3. **Reasons I Love You 💝** — Typewriter effect that types out reasons one by one on lined paper. "Tell me another" button cycles through 15 personalized reasons with a character-by-character animation (35ms per char)
4. **Songs That Remind Me of You 🎵** — Vinyl record player with spinning animation. 4 song cards (mix of English & Hindi). Tapping a song spins the vinyl and moves the arm. Each card reveals a personal quote on hover/tap
5. **Promise Wall 🤞** — 2-column grid of 6 glassmorphic promise cards. Each card staggers in with a cascading delay when scrolled into view. Promises are sweet, funny, and personal
6. **Final Letter with Fireflies** — Warm closing letter with lines that fade in sequentially. Fireflies drift across the screen. Heart burst animation triggers on entry. Signed from Vatsal

### Shared Features
- Twinkling star-field canvas background
- Floating heart emojis
- Pink gradient scroll progress bar at top
- IntersectionObserver-based scroll reveal for all sections
- Fully responsive (clamp-based sizing, single-column promises on small screens)
- Dark romantic theme matching the project design language
- Performance-conscious (capped particles, debounced resize)

---

## blooming-heart/ — Details

Inspired by [ritvikbhatia/LoveProject](https://github.com/ritvikbhatia/LoveProject)'s blooming heart canvas animation. Rewritten from scratch with no jQuery dependency, using modern ES6 classes, adapted to the Sathi project's dark romantic theme with pink/rose bloom colors.

### Content
A code-style love letter referencing real memories — Loco Bear arcade date, winning 3 toys, chai sessions, ice cream runs, cooking together (Bengali dish + dal), Mogu Mogu strawberry, good conversations. Tone is early-days: warm, playful, no big declarations. Closing line: "I don't know what to call this yet, but I know I don't want it to stop."

### How It Works
- Page loads → the code letter types itself out character by character (typewriter effect)
- A pulsing ❤️ button appears at the end of the letter
- Tapping the heart triggers the **blooming heart animation** on the canvas below (mobile) or beside (desktop)
- Flowers bloom along a parametric heart curve (`16sin³(t)` formula), each flower made of 8–15 bezier-curve petals
- Canvas uses `globalCompositeOperation: 'lighter'` for a glowing additive-blend effect
- The heart is purely visual — no text overlay inside it

### Technical Details
- **Vector class** — rotation, scaling, cloning for petal geometry
- **Petal class** — bezier curve petals that grow outward from center (lineWidth 1.5)
- **Bloom class** — a single flower with randomized petal count, stretch, and color
- **GardenCanvas class** — manages the canvas, render loop (60fps), bloom lifecycle, DPR-aware sizing
- **Heart curve** — `getHeartPoint()` plots points along the classic parametric heart, scaled to CSS pixel size
- **Typewriter** — pure JS, handles HTML tags, shows blinking cursor, uses event delegation for the button (since innerHTML rebuild destroys original DOM)
- **Colors** — pink/rose/magenta palette (r:180–255, g:50–150, b:80–180) at 0.3 opacity for the glow effect
- **DPR scaling** — canvas uses `devicePixelRatio` for crisp rendering on high-DPI Android/iOS screens

### Layout
- Mobile-first: letter on top, blooming heart below (column layout)
- Desktop (900px+): side-by-side (letter left, heart right)
- Fully responsive with clamp-based sizing
- Minimal floating hearts (max 3, slow spawn)

---

## bangalore-dreams/ — Details

A mood board of aesthetic Bangalore places Vatsal and Sathi will explore together. Completely different visual style from other events — editorial, magazine-like with a masonry grid layout.

### Design
- **Fonts:** `Cormorant Garamond` (elegant serif headings) + `Inter` (clean body) — distinct from other events
- **Color palette:** Deep dark backgrounds with warm cream/gold accents, muted earth tones
- **Cursor glow** — a soft radial glow follows the mouse on desktop
- **Floating particle canvas** — subtle ambient particles in the background

### Sections

1. **Hero** — Full-viewport with "Bangalore Dreams" title, "someday, together" whisper, scroll hint with animated line
2. **Intro** — "Not all those who wander are lost" quote, sets the tone for the page
3. **Places Grid (Masonry)** — 9 place cards in a CSS masonry layout with tilt effect on hover:
   - Lalbagh Botanical Garden, Bangalore Palace, Jacaranda Streets, Rooftop Sunset, Cubbon Park, Night Market Walks, Flower Shows, Ulsoor Lake, Café Hopping
   - Each card has a numbered badge, image from Unsplash/Pexels (free), description, and mood tag
   - Cards come in `tall` and `wide` variants for visual rhythm
4. **Promise Section** — "This isn't just a page. It's a promise." closing message
5. **Footer** — Hearts, "made with love, for Sathi", photo credits

### Technical
- Images loaded lazily via `loading="lazy"`
- `data-tilt` attribute on cards for interactive tilt (handled in script.js)
- Scroll-reveal animations via IntersectionObserver
- Responsive masonry grid collapses to single column on mobile

---

## flower-vase/ — Details

An interactive single-viewport flower garden where Sathi taps to grow flowers, each revealing a whispered thought. Completely unique aesthetic — minimal, dark, poetic. No scrolling.

### Design Philosophy
- **Intentionally different** from all other events — no Dancing Script, no pink gradients, no floating hearts
- **Fonts:** `Playfair Display` (serif titles) + `Space Grotesk` (minimal UI) + `Caveat` (handwritten whispers)
- **Color palette:** Near-black background (#070710), warm gold/earth accents, muted greens for stems
- **Mood:** Quiet, intimate, like a secret garden at night

### Experience Flow

1. **Intro overlay** — Starfield canvas background, seed emoji with bounce animation, "A Little Garden / that grows only for you, Sathi / tap, and watch a thought bloom", button: "plant our story"
2. **Garden scene** — Single viewport, no scroll. Hint text: "tap anywhere to grow a thought." SVG ceramic vase at bottom with "V + S" label and heart engraving. Golden firefly particles drift across the dark background
3. **Planting flowers** — Each tap above the vase grows a flower with:
   - Animated stem (bezier curve with personality — each stem curves differently)
   - Organic leaves with veins that unfurl as the stem grows
   - 3 flower types: round petals, pointed petals, daisy-style elongated petals
   - 10 color palettes (rose, lavender, sunflower, sky, coral, blush, mint, marigold, plum, honey)
   - Soft glow halo around each bloom
   - Gentle sway animation simulating a breeze
   - Petal burst particles (circles + stars) on plant
4. **Whispered thoughts** — Each flower reveals a unique poetic line in Caveat font, floating as a toast:
   - "you showed up and the noise went quiet"
   - "some people feel like home before you even arrive"
   - "there's a version of me that only exists when you're around"
   - "you're the 2am thought that stays till morning"
   - ...14 total, all original — no overlap with blooming-heart or memory-lane content
5. **Final letter** — After all 14 thoughts are planted, a full-screen overlay fades in with a staggered letter:
   - "if feelings were seeds, you'd have a forest by now... but I started with a garden"
   - Tap to dismiss and return to the garden
6. **Counter** — "X thoughts bloomed" tracks progress

### Technical Details
- **Canvas rendering** — flowers drawn on HTML5 canvas for smooth 60fps animation
- **Bezier stems** — `bezierCurveTo` with randomized control points for organic curves
- **Leaf geometry** — custom bezier leaf shapes with vein detail
- **3 petal renderers** — `drawRoundPetals()`, `drawPointedPetals()`, `drawDaisyPetals()` for visual variety
- **easeOutBack** easing on bloom animation for a satisfying pop
- **DPR-aware** — canvas scales with `devicePixelRatio` for crisp rendering
- **Touch support** — `touchstart` handler with `preventDefault` for mobile
- **No scrolling** — `overflow: hidden` on html/body, all elements `position: fixed/absolute`
- **Memory toast** — CSS animation `toastIn` with scale + fade for each whispered thought
- **Fireflies** — 30 ambient particles with independent drift angles, alpha oscillation, and warm golden glow
- **Intro stars** — 80 twinkling stars on the intro overlay canvas

---

## fruit-attack/ — Details

A playful prank page designed to annoy Sathi with her least favorite thing — fruits. Three-stage experience, all viewport-locked with zero scrolling.

### Design
- **Intentionally different** from the romantic events — bright, chaotic, funny
- **Fonts:** `Dancing Script` (headings) + `Quicksand` (body) — consistent with project
- **Color palette:** Stage 1 uses the dark romantic theme (bait), Stage 2 explodes into orange/amber, Stage 3 shifts to green
- **Mood:** Innocent → chaotic → inescapable

### Experience Flow

1. **Intro (The Bait)** — Dark romantic background matching the project theme. Gift emoji with wiggle animation, "Hey Sathi! I made something special for you...", pink "Open Your Gift 💝" button. Looks completely innocent and sweet
2. **Chaos (The Attack)** — Orange gradient background. Fruits rain from the sky (3 spawned every 200ms). 6 emoji fruits orbit the center. Rotating messages cycle every 2 seconds:
   - "EAT FRUITS SATHI 🍌"
   - "You can't escape 🍇"
   - "Fruits love you 🍓"
   - "One mango? Please? 🥭"
   - ...10 total messages
   - "Make It Stop 😭" button that dodges away from the mouse 3 times on desktop before allowing a click
3. **Finale (No Escape)** — Green gradient background. 20 randomly placed spinning fruit emojis. Giant rotating fruit in center. Cycling messages every 3 seconds:
   - "You thought you could escape fruits?"
   - "Potassium is chasing you — You literally cannot run from bananas 🏃‍♀️💨"
   - "An apple a day keeps nobody away from annoying you 😈"
   - "Mango says hi — It's the king of fruits. Bow down, Sathi. 👑"
   - "Strawberry forever — Sweet, red, and absolutely not leaving you alone 💃"

### Technical Details
- **14 fruit emojis** — 🍎🍌🍇🍉🍓🍑🥭🍍🥝🍒🍊🫐🍋🥥 (no image downloads needed)
- **No scrolling** — `overflow: hidden` on html/body, all screens `position: fixed`
- **Screen transitions** — opacity-based with pointer-events toggle
- **Rain system** — DOM elements with CSS `fall` animation, auto-removed on `animationend`
- **Orbit system** — CSS `rotate + translateX + counter-rotate` trick for circular paths
- **Escape button dodge** — `mouseenter` handler repositions button via `translate()` (3 dodges max)
- **Responsive** — `clamp()` sizing throughout, works on phone and desktop
- **Zero dependencies** — pure HTML/CSS/JS, emoji-only graphics
