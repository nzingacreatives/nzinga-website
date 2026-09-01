(() => {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if (menuBtn && nav) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  requestAnimationFrame(() => document.documentElement.classList.add('ready'));
})();