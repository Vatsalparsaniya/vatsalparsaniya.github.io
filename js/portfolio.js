/* ============================================
   PORTFOLIO ENGINE v2 — Cool GenZ Edition
   ============================================ */

(async function () {
  const app = document.getElementById('app');
  const loader = document.getElementById('loader');

  // Load and parse YAML config
  let config;
  try {
    const base = document.querySelector('base')?.href || window.location.origin + '/';
    const res = await fetch(new URL('site-config.yaml', base));
    const text = await res.text();
    config = jsyaml.load(text);
  } catch (e) {
    app.innerHTML = '<div style="padding:100px;text-align:center;color:#f55">Failed to load site-config.yaml</div>';
    loader.classList.add('hidden');
    return;
  }

  // Add scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  // Build all sections with dividers between them
  const sections = [];
  if (config.hero?.enabled) sections.push(renderHero(config.hero));
  if (config.about?.enabled) sections.push(renderAbout(config.about));
  if (config.experience?.enabled) sections.push(renderExperience(config.experience));
  if (config.skills?.enabled) sections.push(renderSkills(config.skills));
  if (config.projects?.enabled) sections.push(renderProjects(config.projects));
  if (config.accomplishments?.enabled) sections.push(renderAccomplishments(config.accomplishments));
  if (config.contact?.enabled) sections.push(renderContact(config.contact));
  app.innerHTML = sections.join('<div class="section-divider"></div>');

  // Render nav & footer
  renderNav(config.nav);
  renderFooter(config.footer);

  // Init all interactions
  initThemeToggle(config.theme);
  initScrollProgress();
  initScrollEffects();
  initRevealAnimations();
  initTypingEffect(config.hero?.titles || []);
  initProjectFilters();
  initMobileMenu();
  initParticles();
  initTiltCards();

  // Hide loader
  setTimeout(() => loader.classList.add('hidden'), 400);

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderHero(h) {
    const socials = (h.socials || []).map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}"><i class="${s.icon}"></i></a>`
    ).join('');
    const ctas = (h.cta || []).map(c =>
      `<a href="${c.href}" class="btn ${c.primary ? 'btn-primary' : 'btn-outline'}">${c.label}</a>`
    ).join('');

    return `
    <section class="hero" id="hero">
      <div class="hero-mesh">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <canvas id="particle-canvas"></canvas>
      <div class="container">
        <div class="hero-content">
          <div class="hero-greeting">${esc(h.greeting || '')}</div>
          <h1 class="hero-name">${esc(h.name)}</h1>
          <div class="hero-title"><span class="typed-text" id="typed-text"></span><span class="cursor"></span></div>
          <p class="hero-tagline">${esc(h.tagline || '')}</p>
          <div class="hero-cta">${ctas}</div>
          <div class="hero-socials">${socials}</div>
        </div>
        ${h.avatar ? `<div class="hero-avatar"><img src="${h.avatar}" alt="${esc(h.name)}" width="280" height="280"></div>` : ''}
      </div>
    </section>`;
  }

  function renderAbout(a) {
    const bio = (a.bio || '').split('\n\n').map(p => `<p>${esc(p.trim())}</p>`).join('');
    const interests = (a.interests || []).map((item, i) =>
      `<span class="interest-tag reveal-delay-${(i % 4) + 1}">${esc(item)}</span>`
    ).join('');
    const edu = (a.education || []).map(e => `
      <div class="edu-item">
        <i class="fas fa-graduation-cap"></i>
        <div>
          <div class="edu-degree">${esc(e.degree)}, ${esc(e.year)}</div>
          <div class="edu-institution">${esc(e.institution)}</div>
        </div>
      </div>`).join('');

    return `
    <section class="section" id="about">
      <div class="container">
        <div class="section-header reveal"><h2 class="section-title">${esc(a.title)}</h2></div>
        <div class="about-grid reveal">
          <div class="about-bio">${bio}</div>
          <div class="about-sidebar">
            ${interests ? `<div class="sidebar-block"><div class="sidebar-label">Interests</div><div class="interest-tags">${interests}</div></div>` : ''}
            ${edu ? `<div class="sidebar-block"><div class="sidebar-label">Education</div>${edu}</div>` : ''}
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderExperience(exp) {
    const items = (exp.positions || []).map((p) => {
      const isCurrent = (p.endDate || '').toLowerCase() === 'present';
      const highlights = (p.highlights || []).map(h => `
        <div class="exp-highlight">
          <h4>${esc(h.title)}</h4>
          <p>${esc(h.description)}</p>
        </div>`).join('');
      const companyHtml = p.companyUrl
        ? `<a href="${p.companyUrl}" target="_blank" rel="noopener" class="company">${esc(p.company)}</a>`
        : `<span class="company">${esc(p.company)}</span>`;

      return `
      <div class="exp-item ${isCurrent ? 'current' : ''} reveal">
        <div class="exp-card glass-card">
          <div class="exp-header">
            ${p.logo ? `<img src="${p.logo}" alt="${esc(p.company)}" class="exp-logo">` : ''}
            <div class="exp-meta">
              <h3>${esc(p.role)}</h3>
              ${companyHtml}
              <div class="date-location">${esc(p.startDate)} — ${esc(p.endDate)} · ${esc(p.location)}</div>
            </div>
          </div>
          ${highlights ? `<div class="exp-highlights">${highlights}</div>` : ''}
        </div>
      </div>`;
    }).join('');

    return `
    <section class="section" id="experience">
      <div class="container">
        <div class="section-header reveal"><h2 class="section-title">${esc(exp.title)}</h2></div>
        <div class="exp-timeline">${items}</div>
      </div>
    </section>`;
  }

  function renderSkills(sk) {
    const categories = (sk.categories || []).map(cat => {
      const items = (cat.items || []).map(item => `
        <div class="skill-item">
          ${item.icon ? `<img src="${item.icon}" alt="${esc(item.name)}" loading="lazy">` : ''}
          <span>${esc(item.name)}</span>
        </div>`).join('');
      return `
      <div class="skill-category reveal">
        <h3>${esc(cat.name)}</h3>
        <div class="skill-grid">${items}</div>
      </div>`;
    }).join('');

    return `
    <section class="section" id="skills">
      <div class="container">
        <div class="section-header reveal"><h2 class="section-title">${esc(sk.title)}</h2></div>
        <div class="skills-categories">${categories}</div>
      </div>
    </section>`;
  }

  function renderProjects(proj) {
    const filters = (proj.filters || []).map(f =>
      `<button class="filter-btn ${f.tag === '*' ? 'active' : ''}" data-filter="${f.tag}">${esc(f.label)}</button>`
    ).join('');
    const cards = (proj.items || []).map(p => {
      const tags = (p.tags || []).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
      const links = (p.links || []).map(l =>
        `<a href="${l.url}" target="_blank" rel="noopener" class="project-link"><i class="${l.icon}"></i> ${esc(l.label)}</a>`
      ).join('');
      return `
      <div class="project-card glass-card reveal tilt-card" data-tags="${(p.tags || []).join(' ')}">
        ${p.image ? `<div class="project-image-wrap"><img src="${p.image}" alt="${esc(p.title)}" class="project-image" loading="lazy"></div>` : ''}
        <div class="project-body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          ${tags ? `<div class="project-tags">${tags}</div>` : ''}
          ${links ? `<div class="project-links">${links}</div>` : ''}
        </div>
      </div>`;
    }).join('');

    return `
    <section class="section" id="projects">
      <div class="container">
        <div class="section-header reveal"><h2 class="section-title">${esc(proj.title)}</h2></div>
        ${filters ? `<div class="project-filters reveal">${filters}</div>` : ''}
        <div class="project-grid">${cards}</div>
      </div>
    </section>`;
  }

  function renderAccomplishments(acc) {
    const cards = (acc.items || []).map(a => {
      const orgLink = a.orgUrl
        ? `<a href="${a.orgUrl}" target="_blank" rel="noopener" class="org-name">${esc(a.organization)}</a>`
        : `<span class="org-name">${esc(a.organization)}</span>`;
      return `
      <div class="accomplishment-card glass-card reveal">
        <div class="accomplishment-header">
          ${a.orgLogo ? `<img src="${a.orgLogo}" alt="${esc(a.organization)}" loading="lazy">` : ''}
          <div class="org-info">${orgLink}<div class="date">${esc(a.date)}</div></div>
        </div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.description)}</p>
        ${a.certUrl ? `<a href="${a.certUrl}" target="_blank" rel="noopener" class="cert-link"><i class="fas fa-external-link-alt"></i> View Certificate</a>` : ''}
      </div>`;
    }).join('');

    return `
    <section class="section" id="accomplishments">
      <div class="container">
        <div class="section-header reveal"><h2 class="section-title">${esc(acc.title)}</h2></div>
        <div class="accomplishments-grid">${cards}</div>
      </div>
    </section>`;
  }

  function renderContact(c) {
    const socials = (c.socials || []).map(s =>
      `<a href="${s.url}" target="_blank" rel="noopener" class="contact-social" aria-label="${s.label}"><i class="${s.icon}"></i></a>`
    ).join('');
    return `
    <section class="section" id="contact">
      <div class="container">
        <div class="contact-content reveal">
          <div class="section-header"><h2 class="section-title">${esc(c.title)}</h2></div>
          ${c.subtitle ? `<p class="subtitle">${esc(c.subtitle)}</p>` : ''}
          ${c.email ? `<a href="mailto:${c.email}" class="contact-email">${esc(c.email)}</a>` : ''}
          <div class="contact-socials">${socials}</div>
        </div>
      </div>
    </section>`;
  }

  function renderNav(nav) {
    const logo = document.getElementById('nav-logo');
    const links = document.getElementById('nav-links');
    if (nav?.logo) logo.textContent = nav.logo;
    if (nav?.links) {
      links.innerHTML = nav.links.map(l =>
        `<li><a href="${l.href}">${esc(l.label)}</a></li>`
      ).join('');
    }
  }

  function renderFooter(f) {
    if (!f?.enabled) return;
    const footer = document.getElementById('site-footer');
    const links = (f.links || []).map(l =>
      `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    ).join('');
    footer.innerHTML = `<div class="container">
      <div class="footer-text">${esc(f.text || '')}</div>
      ${links ? `<div class="footer-links">${links}</div>` : ''}
    </div>`;
    footer.style.display = 'block';
  }

  // ============================================
  // INTERACTIONS
  // ============================================

  function initThemeToggle(theme) {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme') || (theme?.defaultMode || 'light');
    html.setAttribute('data-theme', saved);
    updateToggleIcon(saved);
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon(next);
    });
    function updateToggleIcon(mode) {
      toggle.innerHTML = mode === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  }

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    }, { passive: true });
  }

  function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const secs = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      let current = '';
      secs.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    }, { passive: true });
  }

  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // Stagger children if they have reveal-delay classes
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function initTypingEffect(titles) {
    if (!titles.length) return;
    const el = document.getElementById('typed-text');
    if (!el) return;
    let titleIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const current = titles[titleIdx];
      if (deleting) {
        el.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) { deleting = false; titleIdx = (titleIdx + 1) % titles.length; setTimeout(type, 400); return; }
        setTimeout(type, 30);
      } else {
        el.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
        setTimeout(type, 60);
      }
    }
    setTimeout(type, 600);
  }

  function initProjectFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const show = filter === '*' || (card.dataset.tags || '').includes(filter);
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const links = document.getElementById('nav-links');
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.innerHTML = links.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.innerHTML = '<i class="fas fa-bars"></i>'; }
    });
  }

  // ============================================
  // PARTICLE NETWORK — lightweight canvas
  // ============================================
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;
    const MAX_DIST = 120;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        // Mouse repulsion
        if (mouse.x !== null) {
          const dx = this.x - mouse.x, dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            this.x += dx / dist * 1.5;
            this.y += dy / dist * 1.5;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const style = getComputedStyle(document.documentElement);
      ctx.fillStyle = style.getPropertyValue('--particle-color').trim() || 'rgba(108,99,255,0.12)';
      ctx.strokeStyle = style.getPropertyValue('--particle-color').trim() || 'rgba(108,99,255,0.12)';
      ctx.lineWidth = 0.5;

      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.globalAlpha = 1 - dist / MAX_DIST;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ============================================
  // TILT EFFECT on project cards
  // ============================================
  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============================================
  // HELPERS
  // ============================================
  function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
