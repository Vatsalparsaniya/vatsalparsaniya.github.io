# Customization Guide

Everything is controlled from `site-config.yaml`. This document explains every section and how to modify it.

---

## Table of Contents

1. [Site Metadata](#site-metadata)
2. [Theme](#theme)
3. [Navigation](#navigation)
4. [Hero Section](#hero-section)
5. [About Section](#about-section)
6. [Experience Section](#experience-section)
7. [Skills Section](#skills-section)
8. [Projects Section](#projects-section)
9. [Accomplishments Section](#accomplishments-section)
10. [Contact Section](#contact-section)
11. [Footer](#footer)
12. [Adding a New Section](#adding-a-new-section)
13. [Adding New Icons/Images](#adding-new-iconsimages)

---

## Site Metadata

```yaml
site:
  title: "Your Name"
  description: "Your tagline for SEO"
  url: "https://yourdomain.com"
  favicon: "/media/your-icon-32x32.png"
  ogImage: "/media/your-icon-512x512.png"
```

> Note: `og:title`, `og:description`, and `og:image` in `index.html` should also be updated manually if you change these.

---

## Theme

```yaml
theme:
  defaultMode: "light"    # "dark" or "light" — what visitors see first
  accentColor: "#6C63FF"  # Primary brand color
```

To change the accent color across the site, update `--accent` and `--accent-rgb` in `css/portfolio.css`:

```css
:root {
  --accent: #6C63FF;
  --accent-rgb: 108, 99, 255;  /* same color as RGB values */
  --accent-gradient: linear-gradient(135deg, #6C63FF 0%, #3B82F6 50%, #06B6D4 100%);
}
```

---

## Navigation

```yaml
nav:
  logo: "VP"              # Text shown in top-left
  links:
    - label: "About"      # Display text
      href: "#about"      # Section anchor
    - label: "Projects"
      href: "#projects"
```

To add/remove nav items, just add/remove entries. The `href` must match a section's `id`.

---

## Hero Section

```yaml
hero:
  enabled: true           # Set false to hide entirely
  greeting: "Hi, I'm"
  name: "Your Name"
  titles:                 # These rotate with typing animation
    - "Data Scientist"
    - "ML Engineer"
  tagline: "One-liner about what you do."
  avatar: "/authors/admin/avatar.jpg"
  cta:
    - label: "View Projects"
      href: "#projects"
      primary: true       # Gradient button
    - label: "Get in Touch"
      href: "#contact"
      primary: false      # Outline button
  socials:
    - icon: "fab fa-github"       # Font Awesome class
      url: "https://github.com/you"
      label: "GitHub"             # Accessibility label
```

---

## About Section

```yaml
about:
  enabled: true
  title: "About Me"
  bio: |
    First paragraph.

    Second paragraph (separated by blank line).
  interests:
    - "Machine Learning"
    - "NLP"
  education:
    - degree: "B.Tech in CS"
      institution: "University Name"
      year: "2021"
```

The `bio` field uses YAML multiline (`|`). Paragraphs are split on double newlines.

---

## Experience Section

```yaml
experience:
  enabled: true
  title: "Experience"
  positions:
    - role: "Data Scientist"
      company: "Company Name"
      companyUrl: "https://company.com"   # Optional — leave "" for no link
      logo: "/media/icons/brands/company.svg"
      location: "City"
      startDate: "Sep 2021"
      endDate: "Present"                  # "Present" shows pulsing dot
      highlights:
        - title: "Project Name"
          description: "What you did and the impact."
```

To add a new position, copy an existing block and modify. Order in the YAML = order on page.

---

## Skills Section

```yaml
skills:
  enabled: true
  title: "Tools & Technologies"
  categories:
    - name: "ML & Deep Learning"    # Category heading
      items:
        - name: "PyTorch"
          icon: "/media/icons/pytorch.svg"
```

To add a new skill:
1. Place the SVG icon in `media/icons/`
2. Add an entry under the appropriate category

---

## Projects Section

```yaml
projects:
  enabled: true
  title: "Projects"
  filters:                          # Filter buttons
    - label: "All"
      tag: "*"                      # "*" shows all
    - label: "Deep Learning"
      tag: "deep-learning"          # Must match tags on items
  items:
    - title: "Project Name"
      description: "Short description."
      image: "/project/folder/image.webp"
      tags: ["deep-learning", "computer-vision"]
      links:
        - label: "Repository"
          url: "https://github.com/..."
          icon: "fab fa-github"
```

To add a new project:
1. Create a folder in `project/your-project/` with a thumbnail image
2. Add the entry in `site-config.yaml`
3. Add any new filter tags to the `filters` list

---

## Accomplishments Section

```yaml
accomplishments:
  enabled: true
  title: "Achievements & Certifications"
  items:
    - title: "Certificate Name"
      organization: "Org Name"
      orgLogo: "/media/icons/brands/org.svg"
      orgUrl: "https://org.com"
      date: "Sep 2023"
      description: "What you learned or achieved."
      certUrl: "https://link-to-certificate"
```

---

## Contact Section

```yaml
contact:
  enabled: true
  title: "Get in Touch"
  subtitle: "Have a question?"
  email: "you@email.com"
  socials:
    - icon: "fab fa-github"
      url: "https://github.com/you"
      label: "GitHub"
```

---

## Footer

```yaml
footer:
  enabled: true
  text: "© 2026 Your Name"
  links:
    - label: "GitHub"
      url: "https://github.com/you"
```

---

## Adding a New Section

To add a completely new section type:

1. **site-config.yaml** — Add a new top-level key:
   ```yaml
   publications:
     enabled: true
     title: "Publications"
     items:
       - title: "Paper Title"
         venue: "Conference 2024"
         url: "https://arxiv.org/..."
   ```

2. **js/portfolio.js** — Add a render function:
   ```javascript
   function renderPublications(pub) {
     const items = (pub.items || []).map(p => `
       <div class="glass-card reveal" style="padding:24px;margin-bottom:16px">
         <h3><a href="${p.url}" target="_blank">${esc(p.title)}</a></h3>
         <p style="color:var(--text-muted)">${esc(p.venue)}</p>
       </div>
     `).join('');
     return `
     <section class="section" id="publications">
       <div class="container">
         <div class="section-header reveal"><h2 class="section-title">${esc(pub.title)}</h2></div>
         ${items}
       </div>
     </section>`;
   }
   ```

3. **js/portfolio.js** — Add to the build sequence (after the other `if` blocks):
   ```javascript
   if (config.publications?.enabled) sections.push(renderPublications(config.publications));
   ```

4. **site-config.yaml** — Add nav link:
   ```yaml
   nav:
     links:
       - label: "Publications"
         href: "#publications"
   ```

---

## Adding New Icons/Images

### Skill icons
- Place SVG files in `media/icons/`
- Reference as `/media/icons/filename.svg` in YAML

### Brand/company logos
- Place SVG files in `media/icons/brands/`
- Reference as `/media/icons/brands/filename.svg` in YAML

### Project thumbnails
- Create folder `project/your-project-name/`
- Place image (`.webp`, `.jpg`, `.png`) inside
- Reference as `/project/your-project-name/image.webp` in YAML

### Profile photo
- Replace `authors/admin/avatar.jpg`
- Or update the path in `hero.avatar` in YAML

---

## Font Awesome Icons Reference

Used for social links, project links, and UI elements. Find icons at:
https://fontawesome.com/search?o=r&m=free

Common ones used:
- `fab fa-github` — GitHub
- `fab fa-linkedin` — LinkedIn
- `fab fa-kaggle` — Kaggle
- `fab fa-twitter` — Twitter/X
- `fab fa-youtube` — YouTube
- `fab fa-stack-overflow` — Stack Overflow
- `fas fa-external-link-alt` — External link
- `fas fa-graduation-cap` — Education
- `fas fa-sun` / `fas fa-moon` — Theme toggle
