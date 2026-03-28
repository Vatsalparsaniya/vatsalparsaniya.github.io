# Architecture & Technical Details

## Rendering Pipeline

```
site-config.yaml
      │
      ▼
  js-yaml parser (CDN)
      │
      ▼
  portfolio.js engine
      │
      ├── renderHero()           → <section class="hero">
      ├── renderAbout()          → <section id="about">
      ├── renderExperience()     → <section id="experience">
      ├── renderSkills()         → <section id="skills">
      ├── renderProjects()       → <section id="projects">
      ├── renderAccomplishments()→ <section id="accomplishments">
      ├── renderContact()        → <section id="contact">
      ├── renderNav()            → populates <nav> links
      └── renderFooter()         → populates <footer>
      │
      ▼
  Injected into <main id="app">
      │
      ▼
  Interactive features initialized:
      ├── initThemeToggle()      → dark/light mode with localStorage
      ├── initScrollProgress()   → gradient progress bar at top
      ├── initScrollEffects()    → navbar blur on scroll, active nav link
      ├── initRevealAnimations() → IntersectionObserver fade-in
      ├── initTypingEffect()     → rotating titles in hero
      ├── initProjectFilters()   → tag-based project filtering
      ├── initMobileMenu()       → hamburger menu toggle
      ├── initParticles()        → canvas particle network in hero
      └── initTiltCards()        → 3D tilt on project cards
```

## CSS Architecture

### Theming System

All colors are CSS custom properties on `[data-theme="dark"]` and `[data-theme="light"]`. Switching themes just changes the `data-theme` attribute on `<html>`.

Key variables:
- `--bg-primary`, `--bg-secondary` — page backgrounds
- `--bg-card`, `--bg-card-hover` — glassmorphism card backgrounds
- `--bg-glass` — navbar/overlay backdrop
- `--border`, `--border-hover` — subtle borders
- `--text-primary`, `--text-secondary`, `--text-muted` — text hierarchy
- `--accent`, `--accent-rgb`, `--accent-gradient` — brand colors
- `--mesh-1/2/3` — hero gradient blob colors
- `--particle-color` — canvas particle color

### Visual Effects

| Effect | Implementation |
|--------|---------------|
| Glassmorphism | `backdrop-filter: blur(20px)` + semi-transparent bg + border |
| Mesh gradient | 3 absolutely-positioned divs with `radial-gradient` + `filter: blur(80px)` + CSS animation |
| Particle network | HTML5 Canvas with connected dots, mouse-reactive |
| Noise texture | SVG feTurbulence filter applied via `body::after` pseudo-element |
| Scroll progress | Fixed div at top, width updated on scroll via JS |
| Reveal animations | `IntersectionObserver` adds `.visible` class, CSS handles transition |
| Typing effect | JS character-by-character with delete/retype loop |
| 3D tilt | `mousemove` calculates rotation from cursor position, applies `perspective` + `rotateX/Y` |
| Avatar ring | `::before` pseudo-element with gradient background + `animation: rotate` |
| Pulse dot | CSS `@keyframes pulse` on timeline current-job indicator |

### Responsive Breakpoints

- `768px` — mobile layout (stacked hero, single-column grids, hamburger menu)
- `480px` — extra small (tighter padding, smaller hero text)

## Security

- All external links use `target="_blank" rel="noopener"`
- All user content is escaped via `esc()` helper (creates text node, reads innerHTML)
- No inline scripts, no eval, no dynamic script injection
- CSP-friendly (no inline styles from JS, all styles in CSS file)

## Performance

- No build step = no bundle overhead
- Images use `loading="lazy"`
- Fonts use `display=swap` for fast first paint
- CSS loaded in `<head>`, JS loaded at end of `<body>`
- Particle canvas uses `requestAnimationFrame` with reduced count on mobile
- Scroll handlers use `{ passive: true }`
