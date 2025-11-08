// Basic interactions: theme toggle, mobile nav, smooth scrolling, form validation, reveal animations, year
(function () {
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');
  const form = document.getElementById('contact-form');
  const yearEl = document.getElementById('year');

  // Set year
  yearEl.textContent = new Date().getFullYear();

  // THEME: persist setting
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light');
    localStorage.setItem('theme', next);
  }
  themeToggle.addEventListener('click', toggleTheme);

  // MOBILE NAV
  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Close mobile nav after clicking a link
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // SMOOTH SCROLL (native smooth scroll via CSS fallback using JS)
  // Ensure HTML uses smooth scroll (but some browsers may need JS)
  document.documentElement.style.scrollBehavior = 'smooth';

  // CONTACT FORM VALIDATION (no backend)
  function showError(input, message) {
    const err = form.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    const err = form.querySelector(`.error[data-for="${input.id}"]`);
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
  }
  function isEmail(email) {
    // simple but effective regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    if (!name.value.trim()) { showError(name, 'Please enter your name'); valid = false; } else clearError(name);
    if (!email.value.trim() || !isEmail(email.value.trim())) { showError(email, 'Please enter a valid email'); valid = false; } else clearError(email);
    if (!message.value.trim() || message.value.trim().length < 10) { showError(message, 'Message must be at least 10 characters'); valid = false; } else clearError(message);

    if (!valid) return;

    // Simulate success (no backend) — show success message and reset
    const success = document.getElementById('form-success');
    success.textContent = 'Message ready! (This is a demo — no backend connected)';
    form.reset();

    setTimeout(() => { success.textContent = ''; }, 4500);
  });

  // SCROLL REVEAL using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // optionally unobserve to run once
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => obs.observe(r));

  // Small accessibility enhancement: focus outline for keyboard only
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // Nice-to-have: animate progress bars (in case they were loaded before reveal)
  function animateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(pb => {
      const w = pb.style.width || '0%';
      pb.style.width = '0%';
      // small microtask so transition runs
      requestAnimationFrame(() => {
        pb.style.transition = 'width 900ms cubic-bezier(.2,.9,.3,1)';
        pb.style.width = w;
      });
    });
  }
  // Run after reveal first batch
  animateProgressBars();

  // Close mobile nav when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) nav.classList.remove('open');
  });
})();
