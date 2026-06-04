  /**
   * script.js — Personal Portfolio
   * Author: Rahul Kumar
   * Features:
   *   - Sticky navbar with scroll detection
   *   - Active nav link highlighting
   *   - Hamburger menu toggle
   *   - Typing / typewriter effect in hero
   *   - Scroll reveal animations
   *   - Skill bar fill on scroll
   *   - Contact form handling
   */

  /* ──────────────────────────────────────────────────────────
    NAVBAR — sticky & active highlighting
  ──────────────────────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ──────────────────────────────────────────────────────────
    HAMBURGER MENU
  ──────────────────────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const navLinksEl  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ──────────────────────────────────────────────────────────
    TYPING EFFECT
  ──────────────────────────────────────────────────────────── */
  const typedTextEl = document.getElementById('typedText');
  const words = [
    'Flutter Developer',
    'Mobile App Builder',
    'Firebase Enthusiast',
    'UI/UX Thinker',
  ];

  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typeDelay  = 120;

  function type() {
    if (!typedTextEl) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Remove one character
      typedTextEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 60;
    } else {
      // Add one character
      typedTextEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 120;
    }

    // Finished typing word — pause then start deleting
    if (!isDeleting && charIndex === currentWord.length) {
      typeDelay = 1800;
      isDeleting = true;
    }

    // Finished deleting — move to next word
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      typeDelay  = 400;
    }

    setTimeout(type, typeDelay);
  }

  // Start typing after a short delay
  setTimeout(type, 900);


  /* ──────────────────────────────────────────────────────────
    SCROLL REVEAL (hero + general sections)
  ──────────────────────────────────────────────────────────── */

  /**
   * Trigger .reveal-up elements immediately on load with staggered delays.
   * These are inside the Hero section and should animate in on page load.
   */
  function revealHero() {
    const heroEls = document.querySelectorAll('.reveal-up');
    heroEls.forEach((el, i) => {
      const delay = el.classList.contains('delay-1') ? 150
                  
                  : el.classList.contains('delay-3') ? 300
                  : el.classList.contains('delay-4') ? 450
                  : el.classList.contains('delay-5') ? 600
                  : 0;
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }
  revealHero();


  /**
   * IntersectionObserver for .scroll-reveal elements.
   */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        revealObserver.unobserve(el); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ──────────────────────────────────────────────────────────
    SKILL BARS — animate fill width on scroll
  ──────────────────────────────────────────────────────────── */
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('visible'); // trigger card fade-in

        // Find the skill bar inside this card
        const bar  = card.querySelector('.skill-bar');
        const fill = card.querySelector('.skill-fill');
        if (bar && fill) {
          const pct = bar.getAttribute('data-pct') || '0';
          // Delay slightly for visual polish
          setTimeout(() => {
            fill.style.width = pct + '%';
          }, 300);
        }
        skillBarObserver.unobserve(card);
      }
    });
  }, {
    threshold: 0.2,
  });

  document.querySelectorAll('.skill-card').forEach(card => {
    skillBarObserver.observe(card);
  });


  /* ──────────────────────────────────────────────────────────
    PROJECT CARDS — reveal stagger
  ──────────────────────────────────────────────────────────── */
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = (parseInt(card.style.getPropertyValue('--i')) || 0) * 120;
        setTimeout(() => card.classList.add('visible'), delay);
        projectObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
  });


  /* ──────────────────────────────────────────────────────────
    SMOOTH SCROLL — for internal anchor links
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
    CONTACT FORM — simple validation & success state
  ──────────────────────────────────────────────────────────── */
  const sendBtn     = document.getElementById('sendBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        shakeButton(sendBtn);
        return;
      }
      if (!isValidEmail(email)) {
        shakeButton(sendBtn);
        return;
      }

      // Simulate send (replace with real API call / EmailJS / FormSpree)
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending…';

      setTimeout(() => {
        sendBtn.innerHTML = '<i class="ri-check-line"></i> Sent!';
        formSuccess.classList.add('show');

        // Reset after 3s
        setTimeout(() => {
          sendBtn.disabled = false;
          sendBtn.innerHTML = 'Send Message <i class="ri-send-plane-fill"></i>';
          formSuccess.classList.remove('show');
          document.getElementById('name').value    = '';
          document.getElementById('email').value   = '';
          document.getElementById('subject').value = '';
          document.getElementById('message').value = '';
        }, 3000);
      }, 1500);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeButton(btn) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 600);
  }


  /* ──────────────────────────────────────────────────────────
    PARALLAX ORBS (subtle mouse parallax on hero)
  ──────────────────────────────────────────────────────────── */
  const heroSection = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.orb');

  if (heroSection && window.matchMedia('(hover: hover)').matches) {
    heroSection.addEventListener('mousemove', e => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      orbs.forEach(orb => {
        orb.style.transform = '';
      });
    });
  }


  /* ──────────────────────────────────────────────────────────
    INJECT SHAKE + SPIN CSS dynamically
  ──────────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%  { transform: translateX(-6px); }
      40%  { transform: translateX(6px); }
      60%  { transform: translateX(-4px); }
      80%  { transform: translateX(4px); }
    }
    .shake { animation: shake 0.5s ease; }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .spin { display: inline-block; animation: spin 0.8s linear infinite; }
  `;
  document.head.appendChild(style);
