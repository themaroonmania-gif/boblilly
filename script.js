/* ===================================
   BOB LILLY PROMOTIONS — PREMIUM JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  const paywallModal = document.getElementById('paywallModal');
  const paywallClose = document.getElementById('paywallClose');
  const paywallPayBtn = document.getElementById('paywallPayBtn');
  const paywallAdmireBtn = document.getElementById('paywallAdmireBtn');
  const paywallResult = document.getElementById('paywallResult');

  function openPaywall(e) {
    e.preventDefault();
    e.stopPropagation();
    paywallResult.textContent = '';
    paywallResult.className = 'paywall-result';
    paywallPayBtn.textContent = '💰 Pay Thomas Harden';
    paywallPayBtn.disabled = false;
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
    
    // Allow tel: links
    if (href && href.startsWith('tel:')) return;
    
    // Allow mailto: links
    if (href && href.startsWith('mailto:')) return;

    // Everything else triggers paywall
    openPaywall(e);
  });

  paywallClose.addEventListener('click', closePaywall);
  paywallAdmireBtn.addEventListener('click', closePaywall);

  paywallOverlay.addEventListener('click', (e) => {
    if (e.target === paywallOverlay) closePaywall();
  });

  // Pay button animation
  paywallPayBtn.addEventListener('click', () => {
    paywallPayBtn.disabled = true;
    paywallPayBtn.textContent = '⏳ Processing...';
    paywallResult.textContent = 'Contacting Thomas Harden\'s bank...';
    paywallResult.className = 'paywall-result processing';

    setTimeout(() => {
      paywallResult.textContent = 'Verifying funds...';
    }, 1200);

    setTimeout(() => {
      paywallResult.textContent = 'Checking with Thomas Harden\'s accountant...';
    }, 2400);

    setTimeout(() => {
      paywallPayBtn.textContent = '❌ Payment Failed';
      paywallResult.textContent = 'Payment Failed: Insufficient funds. Thomas Harden remains unpaid. 😔';
      paywallResult.className = 'paywall-result failed';
    }, 3800);
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
