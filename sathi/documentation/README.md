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
