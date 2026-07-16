document.addEventListener('DOMContentLoaded', () => {

  // ========== VANTA.JS BACKGROUND EFFECTS ==========
  if (window.VANTA && window.VANTA.HALO) {
    VANTA.HALO({
      el: "#hero-vanta",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      amplitudeFactor: 1.5,
      xOffset: 0.1,
      yOffset: 0.1,
      size: 1.5,
      baseColor: 0x07141e,
      backgroundColor: 0xf8fafc
    });

    VANTA.HALO({
      el: "#paywall-vanta",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      baseColor: 0xff552f,
      backgroundColor: 0x07141e,
      size: 2
    });
  }

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(255, 255, 255, 0.85)';
    }
  });

  // ========== SCROLL ANIMATIONS ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.anim-ready').forEach(el => observer.observe(el));

  // ========== STAT COUNTERS ==========
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const inc = target / 50;
        const update = () => {
          current += inc;
          if (current < target) {
            el.innerText = Math.ceil(current);
            requestAnimationFrame(update);
          } else {
            el.innerText = target;
          }
        };
        update();
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));


  // ========== AWESOME CLICK EFFECT (Lindelof style) ==========
  // Creates a burst of particles on click
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 6 - 3;
      this.color = ['#FF552F', '#0072D2', '#07141E', '#FF8A65'][Math.floor(Math.random() * 4)];
      this.life = 1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.size *= 0.95;
      this.life -= 0.02;
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0 || particles[i].size <= 0.2) {
        particles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(e.clientX, e.clientY));
    }
  });


  // ========== PAYWALL MODAL ==========
  const paywallOverlay = document.getElementById('paywallOverlay');
  const paywallClose = document.getElementById('paywallClose');
  const paywallResult = document.getElementById('paywallResult');
  const payBtns = document.querySelectorAll('.pay-btn');

  function openPaywall(e) {
    e.preventDefault();
    e.stopPropagation();
    paywallResult.textContent = '';
    paywallResult.style.color = '#FF552F';
    paywallOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePaywall() {
    paywallOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Intercept links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        closePaywall();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    if (href && (href.startsWith('tel:') || href.startsWith('mailto:'))) return;

    openPaywall(e);
  });

  paywallClose.addEventListener('click', closePaywall);
  paywallOverlay.addEventListener('click', (e) => {
    if (e.target === paywallOverlay) closePaywall();
  });

  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      btn.disabled = true;
      btn.textContent = 'Processing...';
      
      setTimeout(() => {
        if (type === 'retainer') {
          paywallResult.textContent = 'Transaction Failed: Card declined for $100. Thomas Harden remains unpaid.';
        } else {
          paywallResult.textContent = 'Transaction Failed: Insufficient funds for $400. Thomas Harden remains unpaid.';
        }
        btn.disabled = false;
        btn.textContent = type === 'retainer' ? 'Select Option A' : 'Select Option B';
      }, 1500);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaywall();
  });

});
