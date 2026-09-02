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

  const quote = document.querySelector('[data-proverb]');
  const proverbs = [
    'A sabedoria é como um embondeiro: ninguém consegue abraçá-la sozinho.',
    'Até o rio mais longo começa com pequenas gotas.',
    'Quem pergunta não se perde no caminho.',
    'Uma única mão não consegue amarrar um pacote.',
    'Quando as raízes são profundas, não há razão para temer o vento.'
  ];
  if (quote) quote.textContent = proverbs[Math.floor(Math.random() * proverbs.length)];

  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  bottomNav.setAttribute('aria-label', 'Navegação rápida');
  const path = location.pathname.split('/').pop() || 'index.html';
  const items = [
    ['index.html','⌂','Início'],
    ['servicos.html','◇','Serviços'],
    ['surpresas.html','✦','Surpresas'],
    ['nzingagpt.html','◉','NzingaGPT'],
    ['minha-nzinga.html','☻','Minha Nzinga']
  ];
  bottomNav.innerHTML = items.map(([href,icon,label]) => `<a href="${href}" class="${path === href ? 'active' : ''}" aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`).join('');
  document.body.appendChild(bottomNav);

  requestAnimationFrame(() => document.documentElement.classList.add('ready'));
})();