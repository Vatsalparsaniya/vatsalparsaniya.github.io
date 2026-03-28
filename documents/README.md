# Vatsal Parsaniya — Portfolio Website

## Overview

A modern, single-page portfolio website built with pure HTML/CSS/JS. All content is driven by a single YAML configuration file (`site-config.yaml`). No build tools, no frameworks, no static site generators — just edit the YAML and push.

**Live:** [vatsalparsaniya.com](https://vatsalparsaniya.com)  
**Hosting:** GitHub Pages (via `vatsalparsaniya.github.io` repo)  
**Domain:** Custom domain configured via `CNAME` file

---

## File Structure

```
.
├── index.html              # Main HTML shell (minimal, loads CSS/JS)
├── site-config.yaml        # ★ SINGLE SOURCE OF TRUTH — edit this to change everything
├── css/
│   └── portfolio.css       # All styles (themes, layout, animations)
├── js/
│   └── portfolio.js        # Rendering engine (reads YAML → builds DOM)
├── 404.html                # Custom 404 page
├── CNAME                   # Custom domain: vatsalparsaniya.com
├── manifest.webmanifest    # PWA manifest
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # Sitemap for SEO
├── authors/
│   └── admin/
│       └── avatar.jpg      # Profile photo
├── media/
│   ├── icon_hu*.png        # Favicon & app icons (32, 180, 192, 512px)
│   └── icons/
│       ├── python.svg      # Skill icons (tools & languages)
│       ├── pytorch.svg
│       ├── ...             # 18 total skill SVGs
│       └── brands/
│           ├── embibe.svg  # Company/org logos
│           ├── coursera.svg
│           └── ...         # 8 total brand SVGs
├── project/
│   ├── yolo_segmentation_chess/
│   │   └── featured_*.webp # Project thumbnail
│   ├── siim_isic_melanoma_classification_kaggle/
│   │   └── featured_*.webp
│   └── social_distance_surveillance/
│       └── featured_*.webp
└── documents/
    ├── README.md           # ← You are here
    ├── ARCHITECTURE.md     # Technical architecture details
    └── CUSTOMIZATION.md    # How to customize & add/remove sections
```

---

## How It Works

1. Browser loads `index.html` (a minimal shell with no content)
2. `js/portfolio.js` fetches and parses `site-config.yaml` using the `js-yaml` library
3. Each section defined in the YAML is rendered into HTML and injected into `<main id="app">`
4. CSS handles all theming, animations, and responsive layout
5. Interactive features (particles, tilt, typing effect) are initialized after render

---

## Quick Start — Local Development

```bash
# Serve locally (required — file:// won't work due to fetch/CORS)
cd /path/to/vatsalparsaniya.github.io
python3 -m http.server 8888

# Open http://localhost:8888
```

---

## Deployment

Just push to the `main` branch. GitHub Pages serves the root directory automatically.

```bash
git add .
git commit -m "update portfolio"
git push origin main
```

No build step needed.

---

## External Dependencies (loaded via CDN)

| Library | Purpose | CDN |
|---------|---------|-----|
| Inter + JetBrains Mono | Fonts | Google Fonts |
| Font Awesome 6.5.1 | Icons | cdnjs |
| js-yaml 4.1.0 | YAML parsing | jsDelivr |

No npm, no node_modules, no bundler.
