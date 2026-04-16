/* ================================================
   PRANAV AGGARWAL PORTFOLIO — script.js
   Handles: typing animation, scroll reveal,
   navbar, theme toggle, skill bars, mobile menu
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. TYPING ANIMATION
  // ─────────────────────────────────────────────
  const phrases = [
    'CS Student @ MRISU',
    'Python Developer',
    'AI / ML Enthusiast',
    'Problem Solver',
    'Open Source Learner',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  const typedEl = document.getElementById('typed-text');

  function type() {
    if (!typedEl) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      // Pause at end
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  // Small delay before starting
  setTimeout(type, 800);


  // ─────────────────────────────────────────────
  // 2. SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Respect animation-delay from inline style
        const delay = entry.target.style.animationDelay || '0s';
        const delayMs = parseFloat(delay) * 1000;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delayMs);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal-item').forEach((el) => {
    revealObserver.observe(el);
  });


  // ─────────────────────────────────────────────
  // 3. SKILL BAR ANIMATION
  // ─────────────────────────────────────────────
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-bar[data-width]');
        bars.forEach((bar) => {
          const targetWidth = bar.dataset.width;
          // Small delay for stagger feel
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);


  // ─────────────────────────────────────────────
  // 4. NAVBAR — scroll state
  // ─────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  // ─────────────────────────────────────────────
  // 5. ACTIVE NAV LINK (scroll spy)
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('text-cyan-400');
          link.classList.add('text-slate-400');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.remove('text-slate-400');
            link.classList.add('text-cyan-400');
          }
        });
      }
    });
  }, {
    threshold: 0.4,
  });

  sections.forEach((s) => navObserver.observe(s));


  // ─────────────────────────────────────────────
  // 6. MOBILE MENU
  // ─────────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  menuToggle?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
      mobileMenu.classList.add('hidden');
      menuToggle.classList.remove('open');
    } else {
      mobileMenu.classList.remove('hidden');
      menuToggle.classList.add('open');
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
      menuToggle?.classList.remove('open');
    });
  });


  // ─────────────────────────────────────────────
  // 7. SMOOTH SCROLL for all anchor links
  // ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar?.offsetHeight || 72;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  // ─────────────────────────────────────────────
  // 8. THEME TOGGLE
  // ─────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;

  // Load saved preference
  const savedTheme = localStorage.getItem('pa-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('pa-theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      html.classList.add('dark');
      if (themeIcon) themeIcon.textContent = '☀';
    } else {
      html.classList.remove('dark');
      if (themeIcon) themeIcon.textContent = '☾';
    }
  }


  // ─────────────────────────────────────────────
  // 9. CONTACT FORM (simulated submit)
  // ─────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate async submission
    setTimeout(() => {
      btn.textContent = '✓ Sent!';
      btn.style.background = '#34d399';
      successMsg?.classList.remove('hidden');
      form.reset();

      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '';
        successMsg?.classList.add('hidden');
      }, 3500);
    }, 1200);
  });


  // ─────────────────────────────────────────────
  // 10. HERO PARTICLES (subtle floating dots)
  // ─────────────────────────────────────────────
  function createParticles() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const dur = Math.random() * 8 + 4;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.3 + 0.05;

      dot.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? '#22d3ee' : '#34d399'};
        opacity: ${opacity};
        animation: float ${dur}s ease-in-out ${delay}s infinite;
        pointer-events: none;
        z-index: 1;
      `;
      hero.appendChild(dot);
    }
  }

  createParticles();


  // ─────────────────────────────────────────────
  // 11. PROJECT CARD tilt effect (subtle)
  // ─────────────────────────────────────────────
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ─────────────────────────────────────────────
  // 12. Trigger reveal for items already in view
  // ─────────────────────────────────────────────
  // Run after a short delay to let DOM settle
  setTimeout(() => {
    document.querySelectorAll('.reveal-item').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        const delay = parseFloat(el.style.animationDelay || '0') * 1000;
        setTimeout(() => el.classList.add('revealed'), delay);
      }
    });
  }, 100);

});