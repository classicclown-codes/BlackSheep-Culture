document.addEventListener('DOMContentLoaded', () => {
  // Header Scroll Hide with RAF optimization
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile Menu
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  menuToggle.addEventListener('click', () => {
    const isExpanded = siteNav.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    menuToggle.textContent = isExpanded ? '✕' : '☰';
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
      siteNav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }
  });

  // Hero Animation Trigger with stagger
  const hero = document.getElementById('hero');
  setTimeout(() => {
    hero.classList.add('animated');
  }, 300);

  // Intersection Observer for Reveals with stagger
  const reveals = document.querySelectorAll('.reveal');
  const sectionHeads = document.querySelectorAll('.section-head');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => revealObserver.observe(reveal));
  sectionHeads.forEach(head => revealObserver.observe(head));

  // Lookbook Slider with fade transition and auto-play
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('[data-prev]');
    const nextBtn = slider.querySelector('[data-next]');
    let current = 0;
    let autoPlayInterval;

    const progressBar = slider.querySelector('.slider-progress__bar');

    const updateProgress = (index) => {
      const percent = ((index + 1) / slides.length) * 100;
      if (progressBar) progressBar.style.width = `${percent}%`;
    };

    const showSlide = (index) => {
      slides[current].classList.remove('active');
      slides[index].classList.add('active');
      current = index;
      updateProgress(index);
    };

    const nextSlide = () => {
      const next = (current + 1) % slides.length;
      showSlide(next);
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
    };

    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      const prev = (current - 1 + slides.length) % slides.length;
      showSlide(prev);
      startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    updateProgress(current);
    startAutoPlay(); // Start auto-play initially
  }

  // Scroll to Top Button + sticky CTA
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const stickyCta = document.getElementById('stickyCta');
  const dropSection = document.getElementById('drop');

  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;

    if (offset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }

    if (dropSection) {
      const trigger = dropSection.offsetTop + dropSection.offsetHeight;
      if (offset > trigger) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Scroll-spy navigation
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, {
    threshold: 0.5
  });

  sections.forEach(section => navObserver.observe(section));

  // Tilt effect for [data-tilt] elements
  document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  // Video playlist (Brand Film)
  const brandVideo = document.getElementById('brandVideo');
  const playlistItems = document.querySelectorAll('.playlist-item');

  if (brandVideo && playlistItems.length) {
    const setActive = (item) => {
      playlistItems.forEach(btn => {
        btn.classList.toggle('active', btn === item);
        btn.setAttribute('aria-selected', btn === item ? 'true' : 'false');
      });
    };

    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const poster = item.getAttribute('data-poster');
        if (!src) return;

        brandVideo.pause();
        brandVideo.setAttribute('src', src);
        if (poster) brandVideo.setAttribute('poster', poster);
        brandVideo.load();
        brandVideo.play().catch(() => {});
        setActive(item);
      });
    });
  }

  // Magnetic hover for buttons [data-hover]
  document.querySelectorAll('[data-hover]').forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });
});
