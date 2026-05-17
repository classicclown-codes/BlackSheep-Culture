document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const hero = document.getElementById('hero');
  const scrollToTopBtn = document.getElementById('scrollToTop');
  const stickyCta = document.getElementById('stickyCta');
  const dropSection = document.getElementById('drop');

  if (header) {
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 100);
        lastScroll = currentScroll;
        ticking = false;
      });

      ticking = true;
    }, { passive: true });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = siteNav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isExpanded));
      menuToggle.textContent = isExpanded ? '\u2715' : '\u2630';
    });

    document.addEventListener('click', (event) => {
      if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
        siteNav.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '\u2630';
      }
    });
  }

  if (hero) {
    setTimeout(() => {
      hero.classList.add('animated');
    }, 300);
  }

  const animatedElements = document.querySelectorAll('.reveal, .section-head');

  if (animatedElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    animatedElements.forEach(element => revealObserver.observe(element));
  } else {
    animatedElements.forEach(element => element.classList.add('visible'));
  }

  const slider = document.querySelector('[data-slider]');

  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('[data-prev]');
    const nextBtn = slider.querySelector('[data-next]');
    const progressBar = slider.querySelector('.slider-progress__bar');
    let current = 0;
    let autoPlayInterval;

    const updateProgress = (index) => {
      if (!progressBar || !slides.length) return;
      progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    };

    const showSlide = (index) => {
      if (!slides.length || !slides[current] || !slides[index]) return;
      slides[current].classList.remove('active');
      slides[index].classList.add('active');
      current = index;
      updateProgress(index);
    };

    const nextSlide = () => showSlide((current + 1) % slides.length);
    const startAutoPlay = () => {
      if (slides.length > 1) autoPlayInterval = setInterval(nextSlide, 4000);
    };
    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        showSlide((current - 1 + slides.length) % slides.length);
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
      });
    }

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    updateProgress(current);
    startAutoPlay();
  }

  if (scrollToTopBtn || stickyCta) {
    window.addEventListener('scroll', () => {
      const offset = window.pageYOffset;

      if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('visible', offset > 300);
      }

      if (stickyCta && dropSection) {
        const trigger = dropSection.offsetTop + dropSection.offsetHeight;
        stickyCta.classList.toggle('visible', offset > trigger);
      }
    }, { passive: true });
  }

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { threshold: 0.5 });

    sections.forEach(section => navObserver.observe(section));
  }

  document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  const brandVideo = document.getElementById('brandVideo');
  const playlistItems = document.querySelectorAll('.playlist-item');

  if (brandVideo && playlistItems.length) {
    const setActive = (item) => {
      playlistItems.forEach(button => {
        button.classList.toggle('active', button === item);
        button.setAttribute('aria-selected', button === item ? 'true' : 'false');
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

  document.querySelectorAll('[data-hover]').forEach(button => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / 20;
      const y = (event.clientY - rect.top - rect.height / 2) / 20;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
    });
  });

  const cartToggle = document.getElementById('cartToggle');
  const cartPanel = document.getElementById('cartPanel');
  const cartClose = document.getElementById('cartClose');
  const cartCount = document.getElementById('cartCount');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const productCards = document.querySelectorAll('.product-card[data-product]');
  const hasCart = cartToggle && cartPanel && cartClose && cartCount && cartBody && cartTotal && checkoutBtn;
  const formatCurrency = (value) => `\u20a6${value.toLocaleString('en-NG')}`;
  const CART_STORAGE_KEY = 'blacksheepCart';
  const cart = { items: [] };
  const getCartItemKey = (productId, variantIndex, sizeLabel) => `${productId}::${variantIndex}::${sizeLabel}`;

  const saveCart = () => {
    if (!hasCart) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
  };

  const loadCart = () => {
    if (!hasCart) return;

    try {
      const savedItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      cart.items = Array.isArray(savedItems)
        ? savedItems.filter(item => item && item.key && item.name && item.sizeLabel && Number.isFinite(item.price) && Number.isFinite(item.quantity))
        : [];
    } catch {
      cart.items = [];
    }
  };

  const openCart = () => {
    if (!cartPanel) return;
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
  };

  const closeCart = () => {
    if (!cartPanel) return;
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  };

  const updateCartSummary = () => {
    if (!hasCart) return;
    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    cartCount.textContent = count;
    cartTotal.textContent = formatCurrency(total);
  };

  const renderCart = () => {
    if (!hasCart) return;

    if (!cart.items.length) {
      cartBody.innerHTML = '<p class="cart-empty">No items yet. Add something cool.</p>';
      updateCartSummary();
      return;
    }

    cartBody.innerHTML = '';

    cart.items.forEach(item => {
      const row = document.createElement('div');
      const info = document.createElement('div');
      const title = document.createElement('div');
      const variant = document.createElement('div');
      const meta = document.createElement('div');
      const qtyRow = document.createElement('div');
      const minus = document.createElement('button');
      const qty = document.createElement('span');
      const plus = document.createElement('button');
      const subtotal = document.createElement('div');

      row.className = 'cart-item';
      info.className = 'cart-item-info';
      title.className = 'cart-item-title';
      variant.className = 'cart-item-variant';
      meta.className = 'cart-item-meta';
      qtyRow.className = 'cart-quantity';
      subtotal.className = 'cart-item-meta';

      title.textContent = item.name;
      variant.textContent = item.variantLabel;
      meta.textContent = `${item.sizeLabel} / ${item.statusLabel} / ${formatCurrency(item.price)} each`;
      qty.textContent = item.quantity;
      subtotal.textContent = formatCurrency(item.price * item.quantity);

      minus.type = 'button';
      minus.textContent = '-';
      minus.addEventListener('click', () => {
        if (item.quantity <= 1) {
          cart.items = cart.items.filter(cartItem => cartItem.key !== item.key);
        } else {
          item.quantity -= 1;
        }
        saveCart();
        renderCart();
      });

      plus.type = 'button';
      plus.textContent = '+';
      plus.addEventListener('click', () => {
        item.quantity += 1;
        saveCart();
        renderCart();
      });

      qtyRow.append(minus, qty, plus);
      info.append(title, variant, meta, qtyRow);
      row.append(info, subtotal);
      cartBody.append(row);
    });

    updateCartSummary();
  };

  const addToCart = (productId, variantIndex, sizeLabel) => {
    if (!hasCart) return;

    const card = document.querySelector(`.product-card[data-product="${productId}"]`);
    if (!card) return;

    const stock = card.dataset.stock || 'available';
    if (stock === 'sold-out') return;

    const name = card.querySelector('h3')?.textContent?.trim() || 'Product';
    const priceText = card.querySelector('.product-price')?.textContent || card.querySelector('span')?.textContent || '';
    const price = Number(priceText.replace(/[^0-9]/g, '')) || 0;
    const variantLabels = (card.getAttribute('data-variant-labels') || '')
      .split('|')
      .map(value => value.trim())
      .filter(Boolean);
    const variantKind = card.dataset.variantKind || 'color';
    const variantLabel = variantKind === 'view'
      ? 'Standard'
      : variantLabels[variantIndex] || `Variant ${variantIndex + 1}`;
    const statusLabel = card.dataset.stockLabel || (stock === 'preorder' ? 'Pre-order' : 'Available');
    const cartVariantIndex = variantKind === 'view' ? 0 : variantIndex;
    const key = getCartItemKey(productId, cartVariantIndex, sizeLabel);
    const existing = cart.items.find(item => item.key === key);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ key, productId, name, price, variantLabel, variantIndex, sizeLabel, statusLabel, quantity: 1 });
    }

    renderCart();
    saveCart();
    openCart();
    cartToggle.classList.add('pulse');
    setTimeout(() => cartToggle.classList.remove('pulse'), 600);
  };

  if (hasCart) {
    loadCart();

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);

    checkoutBtn.addEventListener('click', () => {
      if (!cart.items.length) {
        alert('Add something to cart first.');
        return;
      }

      const lines = ['Hi! I would like to order:'];
      cart.items.forEach(item => {
        lines.push(`- ${item.name} (${item.variantLabel}, ${item.sizeLabel}, ${item.statusLabel}) x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`);
      });

      const total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      lines.push(`\nTotal: ${formatCurrency(total)}`);

      const message = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/2348134608481?text=${message}`, '_blank');
    });
  }

  productCards.forEach(card => {
    const productId = card.getAttribute('data-product');
    const img = card.querySelector('img');
    const prevBtn = card.querySelector('.product-prev');
    const nextBtn = card.querySelector('.product-next');
    const addButton = card.querySelector('.cart-add');
    const selector = card.querySelector('.variant-selector');
    const sizeSelector = card.querySelector('.size-selector');
    const dotsContainer = card.querySelector('.variant-dots');
    const stock = card.dataset.stock || 'available';
    const stockLabel = card.dataset.stockLabel || (stock === 'preorder' ? 'Pre-order' : stock === 'sold-out' ? 'Sold out' : 'Available');
    const variantLabels = (card.getAttribute('data-variant-labels') || '')
      .split('|')
      .map(value => value.trim())
      .filter(Boolean);
    const sizeLabels = (card.getAttribute('data-sizes') || '')
      .split('|')
      .map(value => value.trim())
      .filter(Boolean);

    if (!img || !variantLabels.length) return;

    const variants = [
      `images/product${productId}.jpg`,
      `images/product${productId}-2.jpg`,
      `images/product${productId}-3.jpg`,
      `images/product${productId}-4.jpg`,
      `images/product${productId}-5.jpg`,
      `images/product${productId}-6.jpg`,
      `images/product${productId}-7.jpg`,
      `images/product${productId}-8.jpg`
    ].slice(0, variantLabels.length);
    const colorMap = {
      White: '#FFFFFF',
      Black: '#000000',
      Brown: '#654321',
      Red: '#800000',
      Grey: '#A9A9A9',
      Purple: '#800580',
      Cream: '#FFFDD0',
      Front: '#111111',
      Back: '#3a3a3a'
    };
    const getSwatchColor = (label) => colorMap[label] || colorMap[label.split(' ')[0]] || '#cccccc';
    let currentIndex = 0;
    let currentSizeIndex = sizeLabels.length === 1 ? 0 : -1;

    if (variants.length <= 1) {
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      if (selector) selector.hidden = true;
      if (dotsContainer) dotsContainer.hidden = true;
    }

    const syncVariantUi = () => {
      const variantLabel = variantLabels[currentIndex];
      const productName = card.querySelector('h3')?.textContent?.trim() || 'BlackSheep product';

      card.dataset.variantIndex = currentIndex;
      img.src = variants[currentIndex];
      img.alt = variantLabel
        ? `${productName} - ${variantLabel}`
        : productName;

      if (selector) {
        selector.querySelectorAll('.variant-option').forEach((button, index) => {
          button.setAttribute('aria-checked', index === currentIndex ? 'true' : 'false');
        });
      }

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.variant-dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
          dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
        });
      }
    };

    const syncSizeUi = () => {
      if (!sizeSelector) return;

      sizeSelector.querySelectorAll('.size-option').forEach((button, index) => {
        button.setAttribute('aria-checked', index === currentSizeIndex ? 'true' : 'false');
      });
    };

    const syncProductState = () => {
      if (!addButton) return;

      if (stock === 'sold-out') {
        addButton.disabled = true;
        addButton.textContent = 'Sold out';
        return;
      }

      addButton.disabled = false;
      addButton.textContent = stock === 'preorder' ? 'Pre-order via cart' : 'Add to cart';
    };

    if (dotsContainer) {
      dotsContainer.innerHTML = '';

      variantLabels.forEach((label, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'variant-dot';
        dot.style.backgroundColor = getSwatchColor(label);
        dot.setAttribute('aria-label', label);
        dot.addEventListener('click', () => {
          currentIndex = index;
          syncVariantUi();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (selector) {
      selector.innerHTML = '';

      variantLabels.forEach((label, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'variant-option';
        button.setAttribute('role', 'radio');
        button.textContent = label;
        button.addEventListener('click', () => {
          currentIndex = index;
          syncVariantUi();
        });
        selector.appendChild(button);
      });
    }

    if (sizeSelector) {
      sizeSelector.innerHTML = '';

      sizeLabels.forEach((label, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'size-option';
        button.setAttribute('role', 'radio');
        button.textContent = label;
        button.addEventListener('click', () => {
          currentSizeIndex = index;
          syncSizeUi();
        });
        sizeSelector.appendChild(button);
      });

      syncSizeUi();
    }

    const nextVariant = () => {
      currentIndex = (currentIndex + 1) % variants.length;
      syncVariantUi();
    };

    const prevVariant = () => {
      currentIndex = (currentIndex - 1 + variants.length) % variants.length;
      syncVariantUi();
    };

    if (nextBtn) nextBtn.addEventListener('click', nextVariant);
    if (prevBtn) prevBtn.addEventListener('click', prevVariant);
    if (addButton) {
      addButton.addEventListener('click', () => {
        const sizeLabel = sizeLabels[currentSizeIndex];

        if (!sizeLabel) {
          addButton.textContent = 'Choose a size';
          setTimeout(syncProductState, 1200);
          return;
        }

        addToCart(productId, currentIndex, sizeLabel);
      });
    }

    syncVariantUi();
    syncProductState();
    if (variants.length > 1) setInterval(nextVariant, 5000);
  });

  renderCart();
});
