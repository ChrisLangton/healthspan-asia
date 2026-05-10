/* ============================
   NAVIGATION — scroll behaviour
   ============================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================
   MOBILE MENU
   ============================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

/* ============================
   TESTIMONIAL SLIDER
   ============================ */
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('pagePrev');
const nextBtn = document.getElementById('pageNext');
const counter = document.getElementById('testimonialCounter');
const totalSlides = dots.length;
let currentSlide = 0;
let autoplayTimer = null;

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === totalSlides - 1;
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 7000);
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});

// Touch / swipe
let touchStartX = 0;
const slider = document.getElementById('testimonialSlider');
slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
}, { passive: true });

// Keyboard
document.addEventListener('keydown', e => {
  const rect = slider.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  }
});

goToSlide(0);

/* ============================
   FAQ ACCORDION
   ============================ */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const arrow = btn.querySelector('.faq-arrow');
  const isOpen = answer.classList.contains('open');

  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-arrow').forEach(a => a.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    arrow.classList.add('open');
  }
}

/* ============================
   GLOSSARY ACCORDION
   ============================ */
function toggleGlossary(btn) {
  const def = btn.nextElementSibling;
  const arrow = btn.querySelector('.glossary-arrow');
  const isOpen = def.classList.contains('open');

  document.querySelectorAll('.glossary-def').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.glossary-arrow').forEach(a => a.classList.remove('open'));

  if (!isOpen) {
    def.classList.add('open');
    arrow.classList.add('open');
    // Smooth scroll to term if partially off-screen
    setTimeout(() => {
      const bounding = btn.getBoundingClientRect();
      if (bounding.top < 80) btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

/* ============================
   OBJECTIVES SELECTOR
   ============================ */
function selectObjective(card) {
  card.classList.toggle('selected');
  const anySelected = document.querySelectorAll('.objective-card.selected').length > 0;
  const cta = document.getElementById('objectivesCta');
  cta.style.display = anySelected ? 'flex' : 'none';
}

/* ============================
   CTA FORM
   ============================ */
function handleFormSubmit(e) {
  e.preventDefault();
  document.getElementById('ctaForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

/* ============================
   HEALTHSPAN BAR ANIMATION
   ============================ */
const hsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.hs-bar').forEach(bar => {
        bar.classList.add('animated');
      });
      hsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const hsChart = document.querySelector('.hs-chart');
if (hsChart) hsObserver.observe(hsChart);

/* ============================
   SCROLL-TRIGGERED FADE-UPS
   ============================ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

const animateSelectors = [
  '.service-card', '.pain-card', '.affect-card',
  '.objective-card', '.how-card', '.personal-card',
  '.testimonial-card', '.glossary-item', '.proof-item',
  '.dimension-card', '.faq-item'
];

document.querySelectorAll(animateSelectors.join(',')).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  fadeObserver.observe(el);
});

/* ============================
   SERVICES CAROUSEL
   ============================ */
(function initServicesCarousel() {
  const wrap    = document.getElementById('servicesWrap');
  const track   = document.getElementById('servicesTrack');
  const prevBtn = document.getElementById('svcPrev');
  const nextBtn = document.getElementById('svcNext');
  const fill    = document.getElementById('svcProgressFill');
  const counter = document.getElementById('svcCounter');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.service-card'));
  const total = cards.length;
  let index = 0;

  function visibleCount() {
    // Read how many cards fit by checking card width vs wrapper width
    const cardW = cards[0].offsetWidth;
    const wrapW = wrap.offsetWidth;
    const gap   = 16;
    return Math.round((wrapW + gap) / (cardW + gap));
  }

  function maxIndex() {
    return Math.max(0, total - visibleCount());
  }

  const outer = track.closest('.services-carousel-outer');

  function update(animate) {
    if (!animate) track.style.transition = 'none';
    const cardW  = cards[0].offsetWidth;
    const gap    = 16;
    const offset = index * (cardW + gap);
    track.style.transform = `translateX(-${offset}px)`;
    if (!animate) {
      track.offsetHeight; // force reflow
      track.style.transition = '';
    }

    const vis   = visibleCount();
    const last  = Math.min(index + vis, total);
    const pct   = (last / total) * 100;
    fill.style.width    = pct + '%';
    counter.textContent = `${index + 1}\u2013${last} of ${total}`;
    prevBtn.disabled    = index === 0;
    nextBtn.disabled    = index >= maxIndex();

    // Show/hide right-edge fade based on whether more slides exist
    if (outer) outer.classList.toggle('at-end', index >= maxIndex());
  }

  prevBtn.addEventListener('click', () => {
    if (index > 0) { index--; update(true); }
  });
  nextBtn.addEventListener('click', () => {
    if (index < maxIndex()) { index++; update(true); }
  });

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && index < maxIndex()) { index++; update(true); }
    if (diff < -50 && index > 0)         { index--; update(true); }
  }, { passive: true });

  // Recalculate on resize (index may need clamping)
  window.addEventListener('resize', () => {
    index = Math.min(index, maxIndex());
    update(false);
  }, { passive: true });

  update(false);
})();

/* ============================
   HERO CANVAS — FLOATING LEAVES
   Tuned for light/white background.
   Leaves are filled + stroked in two
   greens so they read clearly on white.
   ============================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Each particle carries its own fill + stroke so leaves vary naturally
  const VARIANTS = [
    { fill: 'rgba(0,168,120,0.13)',  stroke: 'rgba(0,136,96,0.18)'  },
    { fill: 'rgba(0,168,120,0.09)',  stroke: 'rgba(0,136,96,0.13)'  },
    { fill: 'rgba(90,196,160,0.11)', stroke: 'rgba(0,168,120,0.15)' },
    { fill: 'rgba(168,222,202,0.18)',stroke: 'rgba(0,168,120,0.12)' },
    { fill: 'rgba(0,168,120,0.07)',  stroke: 'rgba(0,100,70,0.10)'  },
  ];

  const COUNT = 38;

  function makeParticle(randomY) {
    const v = VARIANTS[Math.floor(rand(0, VARIANTS.length))];
    return {
      x:         rand(0, W),
      y:         randomY ? rand(-40, H) : rand(H + 10, H + 100),
      vx:        rand(-0.14, 0.14),
      vy:        -rand(0.08, 0.36),
      // Leaves come in two size bands: small and medium
      size:      Math.random() < 0.6 ? rand(6, 14) : rand(14, 24),
      rotation:  rand(0, Math.PI * 2),
      rotSpeed:  rand(-0.006, 0.006),
      wobble:    rand(0, Math.PI * 2),
      wobbleAmp: rand(0.1, 0.38),
      wobbleFreq:rand(0.003, 0.009),
      fill:      v.fill,
      stroke:    v.stroke,
      // Midrib line visible on larger leaves
      midrib:    Math.random() < 0.55,
    };
  }

  const particles = Array.from({ length: COUNT }, () => makeParticle(true));

  function drawLeaf(p) {
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    // Right side of leaf
    ctx.bezierCurveTo( s * 0.7, -s * 0.3,  s * 0.7,  s * 0.3, 0,  s);
    // Left side of leaf
    ctx.bezierCurveTo(-s * 0.7,  s * 0.3, -s * 0.7, -s * 0.3, 0, -s);

    ctx.fillStyle   = p.fill;
    ctx.fill();

    ctx.strokeStyle = p.stroke;
    ctx.lineWidth   = 0.7;
    ctx.stroke();

    // Midrib (centre vein)
    if (p.midrib && s > 9) {
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0,  s * 0.85);
      ctx.strokeStyle = p.stroke;
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];

      p.wobble += p.wobbleFreq;
      p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      drawLeaf(p);

      ctx.restore();

      if (p.y < -p.size - 20) {
        particles[i] = makeParticle(false);
        particles[i].x = rand(0, W);
      }
    }

    requestAnimationFrame(tick);
  }

  tick();
})();

/* ============================
   SMOOTH ANCHOR OFFSET
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
