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

  // Product image cycling + cart tracking
  const cartToggle = document.getElementById('cartToggle');
  const cartPanel = document.getElementById('cartPanel');
  const cartClose = document.getElementById('cartClose');
  const cartCount = document.getElementById('cartCount');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const formatCurrency = (value) => `₦${value.toLocaleString('en-NG')}`;

  const cart = {
    items: []
  };

  const getCartItemKey = (productId, variantIndex) => `${productId}::${variantIndex}`;

  const findCartItem = (productId, variantIndex) => {
    return cart.items.find(item => item.key === getCartItemKey(productId, variantIndex));
  };

  const getProductData = (card) => {
    const productId = card.getAttribute('data-product');
    const name = card.querySelector('h3')?.textContent?.trim();
    const priceText = card.querySelector('span')?.textContent || '';
    const price = Number(priceText.replace(/[^0-9]/g, '')) || 0;
    const variantLabels = (card.getAttribute('data-variant-labels') || '')
      .split('|')
      .map(v => v.trim())
      .filter(Boolean);

    const currentVariantIndex = Number(card.dataset.variantIndex || 0);
    const variantLabel = variantLabels[currentVariantIndex] || `Variant ${currentVariantIndex + 1}`;

    return { productId, name, price, variantLabel, variantIndex: currentVariantIndex };
  };

  const updateCartSummary = () => {
    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    cartTotal.textContent = formatCurrency(total);
  };

  const renderCart = () => {
    if (!cart.items.length) {
      cartBody.innerHTML = '<p class="cart-empty">No items yet. Add something cool.</p>';
      updateCartSummary();
      return;
    }

    cartBody.innerHTML = '';

    cart.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const info = document.createElement('div');
      info.className = 'cart-item-info';

      const title = document.createElement('div');
      title.className = 'cart-item-title';
      title.textContent = item.name;

      const variant = document.createElement('div');
      variant.className = 'cart-item-variant';
      variant.textContent = item.variantLabel;

      const meta = document.createElement('div');
      meta.className = 'cart-item-meta';
      meta.textContent = `${formatCurrency(item.price)} each`; 

      const qtyRow = document.createElement('div');
      qtyRow.className = 'cart-quantity';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '-';
      minus.addEventListener('click', () => {
        if (item.quantity <= 1) {
          cart.items = cart.items.filter(i => i.key !== item.key);
        } else {
          item.quantity -= 1;
        }
        renderCart();
      });

      const qty = document.createElement('span');
      qty.textContent = item.quantity;

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.addEventListener('click', () => {
        item.quantity += 1;
        renderCart();
      });

      qtyRow.append(minus, qty, plus);

      info.append(title, variant, meta, qtyRow);

      const subtotal = document.createElement('div');
      subtotal.className = 'cart-item-meta';
      subtotal.textContent = formatCurrency(item.price * item.quantity);

      row.append(info, subtotal);
      cartBody.append(row);
    });

    updateCartSummary();
  };

  const addToCart = (productId, variantIndex) => {
    const card = document.querySelector(`.product-card[data-product="${productId}"]`);
    if (!card) return;

    const name = card.querySelector('h3')?.textContent?.trim() || 'Product';
    const priceText = card.querySelector('span')?.textContent || '';
    const price = Number(priceText.replace(/[^0-9]/g, '')) || 0;
    const variantLabels = (card.getAttribute('data-variant-labels') || '')
      .split('|')
      .map(v => v.trim())
      .filter(Boolean);

    const variantLabel = variantLabels[variantIndex] || `Variant ${variantIndex + 1}`;
    const key = getCartItemKey(productId, variantIndex);

    const existing = cart.items.find(item => item.key === key);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        key,
        productId,
        name,
        price,
        variantLabel,
        variantIndex,
        quantity: 1
      });
    }

    renderCart();
    openCart();
    cartToggle.classList.add('pulse');
    setTimeout(() => cartToggle.classList.remove('pulse'), 600);
  };

  const openCart = () => {
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
  };

  const closeCart = () => {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  };

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);

  checkoutBtn.addEventListener('click', () => {
    if (!cart.items.length) {
      alert('Add something to cart first.');
      return;
    }

    const lines = ['Hi! I would like to order:'];
    cart.items.forEach(item => {
      lines.push(`- ${item.name} (${item.variantLabel}) x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`);
    });

    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    lines.push(`\nTotal: ${formatCurrency(total)}`);

    const message = encodeURIComponent(lines.join('\n'));
    const phone = '2348134608481';
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  });

  const productVariants = {};

  const productCards = document.querySelectorAll('.product-card[data-product]');
  productCards.forEach(card => {
    const productId = card.getAttribute('data-product');
    const img = card.querySelector('img');
    const prevBtn = card.querySelector('.product-prev');
    const nextBtn = card.querySelector('.product-next');
    const addButton = card.querySelector('.cart-add');

    const variantLabels = (card.getAttribute('data-variant-labels') || '')
      .split('|')
      .map(v => v.trim())
      .filter(Boolean);

    const variants = [
      `images/product${productId}.jpg`,
      `images/product${productId}-2.jpg`,
      `images/product${productId}-3.jpg`,
      `images/product${productId}-4.jpg`,
      `images/product${productId}-5.jpg`
    ];

    let currentIndex = 0;
    card.dataset.variantIndex = currentIndex;

    const selector = card.querySelector('.variant-selector');
    const dotsContainer = card.querySelector('.variant-dots');

    const colorMap = {
      'White': '#FFFFFF',
      'Black': '#000000',
      'Brown': '#654321',
      'Red': '#800000',
      'Grey': '#A9A9A9',
    };

    const updateVariantDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';

      variantLabels.forEach((label, index) => {
        const dot = document.createElement('div');
        dot.className = 'variant-dot';
        dot.style.backgroundColor = colorMap[label] || '#ccc';
        dot.title = label;
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateImage();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const updateVariantSelector = () => {
      if (!selector) return;
      selector.innerHTML = '';

      variantLabels.forEach((label, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'variant-option';
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', index === currentIndex ? 'true' : 'false');
        button.textContent = label;

        button.addEventListener('click', () => {
          currentIndex = index;
          updateImage();
        });

        selector.appendChild(button);
      });
    };

    const updateImage = () => {
      img.src = variants[currentIndex];
      card.dataset.variantIndex = currentIndex;

      if (selector) {
        selector.querySelectorAll('.variant-option').forEach((btn, idx) => {
          btn.setAttribute('aria-checked', idx === currentIndex ? 'true' : 'false');
        });
      }
    };

    updateVariantDots();
    updateVariantSelector();

    const nextVariant = () => {
      currentIndex = (currentIndex + 1) % variants.length;
      updateImage();
    };

    const prevVariant = () => {
      currentIndex = (currentIndex - 1 + variants.length) % variants.length;
      updateImage();
    };

    nextBtn.addEventListener('click', nextVariant);
    prevBtn.addEventListener('click', prevVariant);

    if (addButton) {
      addButton.addEventListener('click', () => {
        addToCart(productId, currentIndex);
      });
    }

    // Auto-cycle every 5 seconds
    setInterval(nextVariant, 5000);

    productVariants[productId] = {
      variants,
      labels: variantLabels
    };
  });

  renderCart();
});
