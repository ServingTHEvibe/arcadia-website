/* ═══════════════════════════════════════════════════════════════
   ARCADIA — Main JS
   STV 3D Web Builder System · MDX Earthy Luxury
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const GOLD  = 'rgba(201,136,42,';
const CREAM = 'rgba(245,239,224,';
const GREEN = 'rgba(27,51,32,';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── LOADER ──────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  const label  = document.getElementById('loaderLabel');
  if (!loader) return;

  document.body.classList.add('loading');

  let progress = 0;
  const tick = () => {
    progress += Math.random() * 0.14 + 0.06;
    if (progress > 1) progress = 1;
    bar.style.width = (progress * 100) + '%';
    if (progress < 1) setTimeout(tick, 120 + Math.random() * 180);
    else setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      initAll();
    }, 350);
  };
  setTimeout(tick, 250);
})();

/* ── INIT ALL ────────────────────────────────────────────────── */
function initAll() {
  initParticles();
  initNavbar();
  initMobileNav();
  initScrollProgress();
  initRevealAnimations();
  initHeroReveal();
  initFarmStory();
  initStats();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  }
}

/* ── PARTICLES ───────────────────────────────────────────────── */
function initParticles() {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth  * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * W(), y: Math.random() * H(),
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: (Math.random() - 0.5) * 0.18 - 0.08,
    opacity: Math.random() * 0.35 + 0.08,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    type: Math.random() > 0.72 ? 'leaf' : 'dot',
    angle: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.007,
    color: Math.random() > 0.5 ? GOLD : (Math.random() > 0.5 ? CREAM : GREEN),
  }));

  function drawLeaf(cx, cy, sz, angle, op, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -sz * 2.5);
    ctx.bezierCurveTo(sz * 1.2, -sz * 1.5, sz * 1.2, sz * 0.5, 0, sz * 1.2);
    ctx.bezierCurveTo(-sz * 1.2, sz * 0.5, -sz * 1.2, -sz * 1.5, 0, -sz * 2.5);
    ctx.fillStyle = color + op + ')';
    ctx.fill();
    ctx.restore();
  }

  let active = true;
  function draw() {
    if (!active) return;
    ctx.clearRect(0, 0, W(), H());
    particles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      p.angle   += p.rotSpeed;
      const op = Math.max(0.04, p.opacity + Math.sin(p.twinkle) * 0.12);
      p.type === 'leaf'
        ? drawLeaf(p.x, p.y, p.size * 1.3, p.angle, op * 0.55, p.color)
        : (ctx.beginPath(), ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2), ctx.fillStyle = p.color + op + ')', ctx.fill());
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < -20) p.x = W() + 20;
      if (p.x > W() + 20) p.x = -20;
      if (p.y < -20) p.y = H() + 20;
      if (p.y > H() + 20) p.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
  document.addEventListener('visibilitychange', () => {
    active = document.visibilityState === 'visible';
    if (active) draw();
  });
}

/* ── NAVBAR ──────────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

/* ── MOBILE NAV ──────────────────────────────────────────────── */
function initMobileNav() {
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggle || !mobileNav) return;
  let open = false;

  function toggleNav() {
    open = !open;
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  toggle.addEventListener('click', toggleNav);
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (open) toggleNav(); });
  });
}

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ── REVEAL ANIMATIONS ───────────────────────────────────────── */
function initRevealAnimations() {
  const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── HERO REVEAL ─────────────────────────────────────────────── */
function initHeroReveal() {
  const monument = document.querySelector('.hero-monument');
  const items    = document.querySelectorAll('#hero .reveal-up');
  if (prefersReducedMotion) {
    if (monument) monument.classList.add('visible');
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  /* Monument fades in first, then copy staggers in below */
  if (monument) setTimeout(() => monument.classList.add('visible'), 100);
  items.forEach((el, i) => setTimeout(() => el.classList.add('visible'), 500 + i * 140));
}


/* ── FARM STORY ──────────────────────────────────────────────── */
function initFarmStory() {
  const section = document.querySelector('.farm-story');
  const storyFrames = document.querySelectorAll('.story-frame');
  const storyImgs   = document.querySelectorAll('.story-img');
  if (!section || !storyFrames.length) return;

  /* Add dot indicators */
  const storyLeft = document.querySelector('.story-left');
  if (storyLeft) {
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'story-progress';
    storyFrames.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'story-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
    });
    storyLeft.appendChild(dotsWrap);
  }

  let current = 0;
  function setFrame(idx) {
    if (idx === current) return;
    storyFrames[current].classList.remove('active');
    if (storyImgs[current]) storyImgs[current].classList.remove('active');
    current = idx;
    storyFrames[current].classList.add('active');
    if (storyImgs[current]) storyImgs[current].classList.add('active');
    document.querySelectorAll('.story-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  window.addEventListener('scroll', () => {
    const rect     = section.getBoundingClientRect();
    const total    = section.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / total));
    setFrame(Math.min(storyFrames.length - 1, Math.floor(progress * storyFrames.length)));
  }, { passive: true });
}

/* ── STATS COUNT-UP ──────────────────────────────────────────── */
function initStats() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  function countUp(el, target) {
    if (prefersReducedMotion) { el.textContent = target; return; }
    const duration = 1800;
    const start    = performance.now();
    const easeOut  = t => 1 - Math.pow(1 - t, 4);
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => countUp(e.target, parseInt(e.target.dataset.target, 10)), i * 150);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
}

/* ── GSAP ENHANCEMENTS ───────────────────────────────────────── */
function initGSAP() {
  if (prefersReducedMotion) return;

  /* Hero orb parallax */
  ['orb-gold', 'orb-green'].forEach((cls, i) => {
    const el = document.querySelector('.' + cls);
    if (!el) return;
    gsap.to(el, {
      yPercent: i === 0 ? -25 : 20,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* Bento card stagger entrance */
  const bentoCards = document.querySelectorAll('.bento-card');
  if (bentoCards.length) {
    gsap.from(bentoCards, {
      opacity: 0, y: 50, stagger: 0.08, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.bento-grid', start: 'top 82%', toggleActions: 'play none none none' }
    });
  }

  /* Event cards stagger */
  const evCards = document.querySelectorAll('.event-card');
  if (evCards.length) {
    gsap.from(evCards, {
      opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.events-cards', start: 'top 82%', toggleActions: 'play none none none' }
    });
  }

  /* Final CTA orb pulse */
  const ctaOrb = document.querySelector('.final-cta-orb');
  if (ctaOrb) gsap.to(ctaOrb, { scale: 1.18, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });

  /* Ticker hover pause */
  const track = document.querySelector('.ticker-track');
  const wrap  = document.querySelector('.ticker-wrap');
  if (track && wrap) {
    wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* Hover tilt on cards */
  document.querySelectorAll('.bento-card, .event-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotateX: -dy * 5, rotateY: dx * 5, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });

  /* Value pills */
  const pills = document.querySelectorAll('.value-pill');
  if (pills.length) {
    gsap.from(pills, {
      opacity: 0, scale: 0.8, stagger: 0.07, duration: 0.6, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.about-values', start: 'top 85%', toggleActions: 'play none none none' }
    });
  }
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});
