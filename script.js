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
   HERO CANVAS — FLOATING PARTICLES
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

  const PALETTE = ['#a8c8b8', '#7eaa94', '#c8d5cd', '#d4e6dc', '#b8d0c4'];
  const COUNT   = 34;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeParticle(randomY) {
    return {
      x:          rand(0, W),
      y:          randomY ? rand(-40, H) : rand(H + 10, H + 80),
      vx:         rand(-0.16, 0.16),
      vy:         -rand(0.10, 0.40),
      size:       rand(3, 14),
      rotation:   rand(0, Math.PI * 2),
      rotSpeed:   rand(-0.007, 0.007),
      alpha:      rand(0.04, 0.14),
      wobble:     rand(0, Math.PI * 2),
      wobbleAmp:  rand(0.08, 0.32),
      wobbleFreq: rand(0.003, 0.010),
      color:      PALETTE[Math.floor(rand(0, PALETTE.length))],
      // 0 = leaf, 1 = oval, 2 = small circle
      shape:      Math.floor(rand(0, 2.8)),
    };
  }

  const particles = Array.from({ length: COUNT }, () => makeParticle(true));

  function drawLeaf(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo( s * 0.65, -s * 0.35,  s * 0.65, s * 0.35, 0, s);
    ctx.bezierCurveTo(-s * 0.65,  s * 0.35, -s * 0.65, -s * 0.35, 0, -s);
    ctx.fill();
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
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;

      if (p.shape === 0) {
        drawLeaf(p.size);
      } else if (p.shape === 1) {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.38, p.size * 0.92, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.44, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Recycle when floated off the top
      if (p.y < -p.size - 20) {
        particles[i] = makeParticle(false);
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
