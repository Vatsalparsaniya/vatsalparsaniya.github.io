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

| Folder      | Description                          | Status |
|-------------|--------------------------------------|--------|
| `date-ask/` | "Will you go on a date with me?" 🌹  | ✅ Done |

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
- **Color Palette:**
  - Primary: `#ec407a`
  - Light pink: `#f48fb1`, `#f8bbd0`, `#fce4ec`
  - Deep pink: `#ad1457`
- **Responsiveness:** Uses `clamp()`, `dvh` units, fluid sizing — works on phone and laptop
- **Performance:** Fewer particles/animations on mobile devices
- **Signature:** Every event is signed "— Vatsal" or "— Your Vatsal"

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
