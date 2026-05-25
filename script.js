/* ═══════════════════════════════════════════════════════════
   ADEBAYO OLAIYA PORTFOLIO — script.js
   Features:
     - Navbar scroll effect
     - Mobile menu toggle
     - Scroll reveal animations (IntersectionObserver)
     - Animated stat counters
     - Contact form validation & submission
     - Active nav link highlighting
     - Footer year
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ─── UTILITIES ────────────────────────────────────────────
/**
 * Shorthand for document.querySelector
 * @param {string} sel - CSS selector
 * @param {Document|Element} ctx - context (default: document)
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Shorthand for document.querySelectorAll → Array
 * @param {string} sel - CSS selector
 * @param {Document|Element} ctx - context (default: document)
 */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── NAVBAR SCROLL BEHAVIOUR ──────────────────────────────
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
})();

// ─── ACTIVE NAV LINK HIGHLIGHTING ─────────────────────────
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('#navLinks a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();

// ─── MOBILE NAV TOGGLE ────────────────────────────────────
(function initMobileNav() {
  const toggle   = $('#navToggle');
  const navLinks = $('#navLinks');
  if (!toggle || !navLinks) return;

  // Create overlay element for tap-outside-to-close
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const openMenu  = () => { navLinks.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { navLinks.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };
  const isOpen    = () => navLinks.classList.contains('open');

  toggle.addEventListener('click', () => isOpen() ? closeMenu() : openMenu());
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  $$('#navLinks a').forEach(link => link.addEventListener('click', closeMenu));
})();

// ─── SCROLL REVEAL (IntersectionObserver) ─────────────────
(function initReveal() {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

// ─── ANIMATED STAT COUNTERS ───────────────────────────────
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  /**
   * Animate a number from 0 to target over `duration` ms using easeOut
   * @param {HTMLElement} el - the element to update
   * @param {number} target - final value
   * @param {number} duration - animation duration in ms
   */
  const animateCounter = (el, target, duration = 1600) => {
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target; // Ensure exact final value
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

// ─── CONTACT FORM ─────────────────────────────────────────
(function initContactForm() {
  const form    = $('#contactForm');
  const btn     = $('#formBtn');
  const noteEl  = $('#formNote');
  if (!form) return;

  /**
   * Basic email validation
   * @param {string} email
   */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /**
   * Show a status message in the form note element
   * @param {string} message
   * @param {'success'|'error'} type
   */
  const showNote = (message, type) => {
    noteEl.textContent = message;
    noteEl.className = `form-note ${type}`;
  };

  /**
   * Set loading state on the submit button
   * @param {boolean} loading
   */
  const setLoading = (loading) => {
    if (loading) {
      btn.disabled = true;
      btn.querySelector('.btn-text').textContent = 'Sending…';
    } else {
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Message';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect values
    const name    = $('#name', form).value.trim();
    const email   = $('#email', form).value.trim();
    const message = $('#message', form).value.trim();

    // Validate
    if (!name) { showNote('Please enter your name.', 'error'); $('#name', form).focus(); return; }
    if (!isValidEmail(email)) { showNote('Please enter a valid email address.', 'error'); $('#email', form).focus(); return; }
    if (!message) { showNote('Please write a message.', 'error'); $('#message', form).focus(); return; }

    setLoading(true);
    showNote('', '');

    /* ─────────────────────────────────────────────────────────────
       FORM SUBMISSION INSTRUCTIONS
       ─────────────────────────────────────────────────────────────
       Choose ONE of the options below and uncomment it.

       OPTION A — Formspree (recommended, free tier available)
         1. Sign up at https://formspree.io
         2. Create a new form and get your endpoint URL
         3. Replace 'YOUR_FORMSPREE_ID' with your form ID
         4. Uncomment the try/catch block labeled "OPTION A"

       OPTION B — EmailJS (free tier, no backend needed)
         1. Sign up at https://emailjs.com
         2. Set up a service + template
         3. Replace the placeholders and uncomment "OPTION B"

       OPTION C — mailto fallback (no backend, opens email client)
         Uncomment the line labeled "OPTION C"
       ───────────────────────────────────────────────────────────── */

    // ── OPTION A: Formspree ──────────────────────────────────────
    try {
      const response = await fetch('https://formspree.io/f/xgoqldrr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: $('#subject', form).value.trim() || '(No subject)',
          message
        })
      });

      if (response.ok) {
        showNote('✓ Message sent! I\'ll be in touch soon.', 'success');
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        showNote(data.error || 'Something went wrong. Please try emailing directly.', 'error');
      }
    } catch {
      // ── OPTION C: mailto fallback (if fetch fails / no backend configured) ──
      const subject = encodeURIComponent($('#subject', form).value.trim() || 'Portfolio Contact');
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      // Replace with your actual email address below ↓
      window.location.href = `mailto:adebayo.olaiya@email.com?subject=${subject}&body=${body}`;
      showNote('Opening your email client…', 'success');
    } finally {
      setLoading(false);
    }

  });
})();

// ─── SMOOTH SCROLL for anchor links ───────────────────────
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // Navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── FOOTER YEAR ──────────────────────────────────────────
(function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ─── CURSOR GLOW EFFECT (subtle, desktop only) ────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow using rAF
  const follow = () => {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = currentX + 'px';
    glow.style.top  = currentY + 'px';
    requestAnimationFrame(follow);
  };
  follow();
})();

// ─── HERO GRID PARALLAX ───────────────────────────────────
(function initParallax() {
  const grid = $('.hero-grid');
  if (!grid) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
})();

// ─── SKILL CARD stagger on hover neighbour ─────────────────
(function initCardHoverStagger() {
  const cards = $$('.skill-card');
  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((c, j) => {
        const dist = Math.abs(i - j);
        c.style.transition = `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${dist * 30}ms,
                              border-color 0.3s, box-shadow 0.3s`;
      });
    });
  });
})();
