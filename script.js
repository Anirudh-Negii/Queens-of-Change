// ─── THEME TOGGLE ─────────────────────────────────────
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Restore saved theme
  const savedTheme = localStorage.getItem('qoc-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('qoc-theme', next);
  });

  // ─── NAVBAR SCROLL BEHAVIOUR ──────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }, { passive: true });

  // ─── ACTIVE NAV LINK ──────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  }

  // ─── HAMBURGER MENU ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    if (open) {
      mobileNav.classList.add('open');
      mobileNav.style.display = 'flex';
      requestAnimationFrame(() => {
        mobileNav.style.opacity = '1';
        mobileNav.style.transform = 'translateY(0)';
      });
    } else {
      mobileNav.style.opacity = '0';
      mobileNav.style.transform = 'translateY(-10px)';
      setTimeout(() => { mobileNav.classList.remove('open'); }, 300);
    }
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.style.opacity = '0';
      mobileNav.style.transform = 'translateY(-10px)';
      setTimeout(() => { mobileNav.classList.remove('open'); }, 300);
    });
  });

  // ─── SCROLL REVEAL ────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED COUNTERS ────────────────────────────────
  const counterEls = document.querySelectorAll('.impact-number[data-target]');
  let countersStarted = false;

  function formatNumber(n, target) {
    if (target >= 100000) {
      return (n / 100000).toFixed(n === target ? 0 : 1).replace(/\.0$/, '') + ',00,000';
    }
    if (target >= 50000) {
      return (n / 1000).toFixed(0) + ',000';
    }
    return n.toLocaleString('en-IN');
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counterEls.forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 2200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (target >= 100000) {
          el.textContent = '2,00,000' + suffix;
          if (progress < 1) {
            const raw = Math.round(eased * target);
            const lakh = Math.floor(raw / 100000);
            const thou = Math.floor((raw % 100000) / 1000);
            el.textContent = lakh + ',' + String(thou).padStart(2, '0') + ',000' + suffix;
          }
        } else {
          el.textContent = current.toLocaleString('en-IN') + suffix;
        }

        if (progress < 1) requestAnimationFrame(tick);
        else {
          // Set final value
          if (target === 200000) el.textContent = '2,00,000+';
          else el.textContent = target.toLocaleString('en-IN') + suffix;
        }
      }
      requestAnimationFrame(tick);
    });
  }

  // Trigger counters when impact section enters view
  const impactSection = document.getElementById('impact');
  const impactObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCounters();
      impactObserver.disconnect();
    }
  }, { threshold: 0.2 });

  impactObserver.observe(impactSection);

  // ─── SMOOTH SCROLL (for older browsers without CSS support) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });