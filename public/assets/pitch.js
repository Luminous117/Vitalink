// Pitch page interactivity: scroll progress, reveal animations,
// number counters, and section-aware side nav highlighting.
(function () {
  // Respect users who prefer reduced motion.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1. Scroll progress bar --------------------------------------------------
  const bar = document.getElementById('scroll-progress');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.transform = 'scaleX(' + Math.min(Math.max(scrolled, 0), 1) + ')';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- 2. Reveal on scroll -----------------------------------------------------
  const revealTargets = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  // ---- 3. Number counters ------------------------------------------------------
  // Any element with data-count="72" gets counted up when it enters the viewport.
  // Optional data-prefix / data-suffix. Preserves punctuation in the target format.
  const counters = document.querySelectorAll('[data-count]');
  const formatNum = (n, integerFormat) => {
    if (integerFormat === 'plain') return Math.round(n).toString();
    return Math.round(n).toLocaleString();
  };
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = el.dataset.format || 'comma';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + formatNum(target * eased, fmt) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!prefersReduced && 'IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || '');
    });
  }

  // ---- 4. Section-aware floating side nav -------------------------------------
  const sections = Array.from(document.querySelectorAll('section[data-nav]'));
  const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const highlight = (id) => {
      navLinks.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    };
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) highlight(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => sio.observe(s));
  }

  // ---- 5. Smooth scroll for anchor links (offset for sticky nav) --------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  // ---- 6. Parallax on hero mesh (subtle) --------------------------------------
  const mesh = document.querySelector('.pitch-hero .mesh-bg');
  if (mesh && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 800) mesh.style.transform = 'translate3d(0,' + y * 0.15 + 'px,0)';
    }, { passive: true });
  }
})();
