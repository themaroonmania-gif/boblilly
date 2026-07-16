/* ===================================
   BOB LILLY PROMOTIONS — PREMIUM JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== AWESOME WEB EFFECTS (Lindelof style) ==========
  // 1. Vanta.js Backgrounds
  if (window.VANTA && window.VANTA.HALO) {
    VANTA.HALO({
      el: "#hero-vanta",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      amplitudeFactor: 1.5,
      size: 1.5,
      baseColor: 0x07141e,
      backgroundColor: 0xf9fafb
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

  // 2. Typed.js Effect
  if (window.Typed) {
    new Typed('.text-gradient', {
      strings: ['The Best Brands', 'Unforgettable Experiences', 'Global Fulfillment', 'Revenue Growth'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }

  // 3. Canvas Click Particles (Lindelof)
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

  // ========== NAVBAR ==========
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  // Sticky navbar shadow on scroll
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ========== SCROLL ANIMATIONS (IntersectionObserver) ==========
  const animElements = document.querySelectorAll('.anim-ready');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(el => animObserver.observe(el));


  // ========== COUNTER ANIMATION ==========
  const counterElements = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased);
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target;
          }
        };
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));


  // ========== TESTIMONIAL CAROUSEL ==========
  const carousel = document.getElementById('testimonialCarousel');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('tcDots');
  const prevBtn = carousel.closest('.testimonial-carousel-wrap').querySelector('.tc-prev');
  const nextBtn = carousel.closest('.testimonial-carousel-wrap').querySelector('.tc-next');
  let currentSlide = 0;
  let autoPlayInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.tc-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetAutoPlay();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  resetAutoPlay();

  // Pause on hover
  const carouselWrap = carousel.closest('.testimonial-carousel-wrap');
  carouselWrap.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselWrap.addEventListener('mouseleave', resetAutoPlay);


  // ========== PAYWALL MODAL ==========
  const paywallOverlay = document.getElementById('paywallOverlay');
  const paywallClose = document.getElementById('paywallClose');

  function openPaywall(e) {
    e.preventDefault();
    e.stopPropagation();
    paywallOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePaywall() {
    paywallOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Intercept ALL anchor clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Allow smooth scroll to page sections
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        closePaywall();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    
    // Allow tel: and mailto: links natively
    if (href && (href.startsWith('tel:') || href.startsWith('mailto:'))) return;

    // Everything else triggers paywall
    openPaywall(e);
  });

  paywallClose.addEventListener('click', closePaywall);

  paywallOverlay.addEventListener('click', (e) => {
    if (e.target === paywallOverlay) closePaywall();
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaywall();
  });


  // ========== SMOOTH PARALLAX on hero merch ==========
  const heroMerch = document.querySelectorAll('.hero-merch');
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroMerch.forEach((img, i) => {
            const speed = 0.02 + (i * 0.01);
            img.style.transform = `translateY(${scrollY * speed}px)`;
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });


  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.style.color = '';
          if (item.getAttribute('href') === `#${id}`) {
            item.style.color = '#FF552F';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-72px 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

});
