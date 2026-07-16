/* ============================================================
   Bob Lilly Promotions — homepage concept
   Vanilla JS only. Every effect is fail-safe: content stays
   visible and usable if anything below never runs.
   ============================================================ */

// Arm the reveal system only when JS is actually running.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Reveal on scroll (fail-safe) ---------- */
  const reveals = document.querySelectorAll('.reveal, .accent-sweep');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
    // Safety valve: anything still hidden after 4s becomes visible.
    setTimeout(() => reveals.forEach(el => el.classList.add('in')), 4000);
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('.count');
  const runCounter = el => {
    const target = parseFloat(el.dataset.count || '0');
    const comma = el.dataset.comma === '1';
    const dur = 1600;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      let val = Math.round(target * eased);
      el.textContent = comma ? val.toLocaleString('en-US') : val;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !prefersReduced) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          runCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
    // Safety valve: never leave a "0" on screen.
    setTimeout(() => counters.forEach(el => {
      if (el.textContent === '0') {
        const v = parseFloat(el.dataset.count || '0');
        el.textContent = el.dataset.comma === '1' ? v.toLocaleString('en-US') : v;
      }
    }), 4000);
  } else {
    counters.forEach(el => {
      const v = parseFloat(el.dataset.count || '0');
      el.textContent = el.dataset.comma === '1' ? v.toLocaleString('en-US') : v;
    });
  }

  /* ---------- Hero word rotator ---------- */
  const rotator = document.getElementById('rotator');
  if (rotator && !prefersReduced) {
    const words = ['promo', 'creative', 'merch', 'strategy', 'brand'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      rotator.classList.remove('swap');
      // force reflow so the animation restarts
      void rotator.offsetWidth;
      rotator.textContent = words[i];
      rotator.classList.add('swap');
    }, 2600);
  }

  /* ---------- Services hover preview ---------- */
  const svcItems = document.querySelectorAll('.svc-item');
  const svcImg = document.getElementById('svcPreviewImg');
  if (svcItems.length && svcImg) {
    // Preload the preview images once the page is idle.
    const preload = () => svcItems.forEach(it => { new Image().src = it.dataset.img; });
    ('requestIdleCallback' in window) ? requestIdleCallback(preload) : setTimeout(preload, 1200);

    let current = svcImg.getAttribute('src');
    svcItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        svcItems.forEach(i => i.classList.remove('is-active'));
        item.classList.add('is-active');
        const next = item.dataset.img;
        if (next && next !== current) {
          current = next;
          svcImg.classList.add('fade');
          setTimeout(() => {
            svcImg.src = next;
            svcImg.classList.remove('fade');
          }, 180);
        }
      });
    });
  }

  /* ---------- Testimonial carousel ---------- */
  const stage = document.getElementById('quoteStage');
  if (stage) {
    const cards = Array.from(stage.querySelectorAll('.quote-card'));
    const dotsWrap = document.getElementById('qDots');
    let idx = 0;
    let timer = null;

    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'qdot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      d.addEventListener('click', () => show(i, true));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    const show = (i, manual) => {
      idx = (i + cards.length) % cards.length;
      cards.forEach((c, n) => c.classList.toggle('is-active', n === idx));
      dots.forEach((d, n) => d.classList.toggle('on', n === idx));
      if (manual) restart();
    };
    const restart = () => {
      if (prefersReduced) return;
      clearInterval(timer);
      timer = setInterval(() => show(idx + 1), 6500);
    };
    document.getElementById('qPrev').addEventListener('click', () => show(idx - 1, true));
    document.getElementById('qNext').addEventListener('click', () => show(idx + 1, true));
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', restart);
    restart();
  }

  /* ---------- "Like what you see?" pill ---------- */
  const pill = document.getElementById('conceptPill');
  if (pill) {
    const onScrollPill = () => {
      pill.classList.toggle('show', window.scrollY > window.innerHeight * 0.9);
    };
    onScrollPill();
    window.addEventListener('scroll', onScrollPill, { passive: true });
  }

});
