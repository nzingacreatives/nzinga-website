(() => {
  'use strict';

  const currentPage = () => location.pathname.split('/').pop() || 'index.html';

  function initNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const nav = document.getElementById('navLinks');

    if (menuBtn && nav && !menuBtn.dataset.nzingaNavReady) {
      menuBtn.dataset.nzingaNavReady = '1';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });

      document.addEventListener('click', (event) => {
        if (!nav.classList.contains('open')) return;
        if (nav.contains(event.target) || menuBtn.contains(event.target)) return;
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Native links stay native: no global preventDefault/stopImmediatePropagation.
    const items = [
      ['index.html', '⌂', 'Início'],
      ['servicos.html', '◇', 'Serviços'],
      ['surpresas.html', '✦', 'Surpresas'],
      ['nzingagpt.html', '◉', 'NzingaGPT'],
      ['market.html', '▣', 'Market'],
      ['raizes.html', '✺', 'Raízes'],
      ['minha-nzinga.html', '☻', 'Minha Nzinga']
    ];

    let bottomNav = document.querySelector('.bottom-nav, .nzinga-bottom-nav');
    if (!bottomNav && document.body) {
      bottomNav = document.createElement('nav');
      bottomNav.className = 'bottom-nav';
      bottomNav.setAttribute('aria-label', 'Navegação rápida');
      const path = currentPage();
      bottomNav.innerHTML = items.map(([href, icon, label]) =>
        `<a href="${href}" class="${path === href ? 'active' : ''}" aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`
      ).join('');
      document.body.appendChild(bottomNav);
    }
  }

  function initProverb() {
    const quote = document.querySelector('[data-proverb]');
    if (!quote) return;
    const proverbs = [
      'A sabedoria é como um embondeiro: ninguém consegue abraçá-la sozinho.',
      'Até o rio mais longo começa com pequenas gotas.',
      'Quem pergunta não se perde no caminho.',
      'Uma única mão não consegue amarrar um pacote.',
      'Quando as raízes são profundas, não há razão para temer o vento.'
    ];
    quote.textContent = proverbs[Math.floor(Math.random() * proverbs.length)];
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => s.src.includes(src));
      if (existing) return existing.addEventListener('load', resolve, { once: true });
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function initMarket() {
    const products = document.getElementById('products');
    const sell = document.querySelector('.sell');
    if (!products || !sell) return;

    try {
      if (!window.supabase) await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      if (!window.NZINGA_SUPABASE) await loadScript('supabase-config.js');
    } catch (error) {
      console.warn('Nzinga Market bootstrap:', error);
      return;
    }

    const cfg = window.NZINGA_SUPABASE;
    if (!cfg || !window.supabase) return;
    const sb = window.supabase.createClient(cfg.url, cfg.publishableKey);
    const escapeHtml = s => String(s ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[c]));
    const money = (value, currency) => `${Number(value || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'AOA'}`;
    const renderProduct = p => `<article class="product" data-category="${escapeHtml(p.category || 'arte')}" data-db-product="true"><div class="cover">${escapeHtml((p.title || 'NZINGA').slice(0,22))}</div><div class="product-info"><span class="tag">${escapeHtml(String(p.category || 'Digital').toUpperCase())}</span><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.description || 'Recurso digital criado na comunidade Nzinga.')}</p><div class="product-bottom"><span class="price">${money(p.price, p.currency)}</span><button class="buy" type="button" disabled>Em breve</button></div></div></article>`;

    async function loadPublished() {
      const { data, error } = await sb.from('market_products').select('id,title,description,price,currency,category,image_path').eq('status','published').order('created_at',{ascending:false});
      if (error) return;
      products.querySelectorAll('[data-db-product]').forEach(x => x.remove());
      (data || []).forEach(p => products.insertAdjacentHTML('afterbegin', renderProduct(p)));
      bindFilters();
    }

    function bindFilters() {
      document.querySelectorAll('.filter').forEach(f => {
        if (f.dataset.nzingaFilterReady) return;
        f.dataset.nzingaFilterReady = '1';
        f.addEventListener('click', () => {
          document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
          f.classList.add('active');
          const wanted = f.dataset.filter;
          let visible = 0;
          products.querySelectorAll('.product').forEach(i => {
            const show = wanted === 'all' || i.dataset.category === wanted;
            i.style.display = show ? 'block' : 'none';
            if (show) visible++;
          });
          const empty = document.getElementById('empty');
          if (empty) empty.style.display = visible ? 'none' : 'block';
        });
      });
    }

    if (!document.getElementById('nzingaMarketPublisher')) {
      const box = document.createElement('div');
      box.id = 'nzingaMarketPublisher';
      box.style.cssText = 'margin-top:18px;border:2px solid #fff;padding:22px;background:#181818;display:none;';
      box.innerHTML = '<h3 style="margin-top:0">Publicar no Market</h3><p>Envia o teu recurso para revisão. Ele ficará como rascunho até ser aprovado pela Nzinga.</p><form id="marketForm" style="display:grid;gap:10px"><input name="title" placeholder="Nome do produto" maxlength="120" required style="padding:12px"><textarea name="description" placeholder="Descrição" maxlength="1000" style="padding:12px;min-height:80px"></textarea><select name="category" style="padding:12px"><option value="template">Template</option><option value="documento">Documento</option><option value="ebook">Ebook</option><option value="arte">Arte</option><option value="Digital">Outro digital</option></select><input name="price" type="number" min="0" step="0.01" placeholder="Preço em AOA" required style="padding:12px"><button class="button button-main" type="submit">Enviar para revisão →</button><p id="marketStatus" style="min-height:1.3em;margin:0"></p></form>';
      sell.appendChild(box);

      const action = sell.querySelector('.button-main');
      if (action) {
        action.removeAttribute('href');
        action.textContent = 'Quero participar →';
        action.style.cursor = 'pointer';
        action.addEventListener('click', async () => {
          const { data: { session } } = await sb.auth.getSession();
          if (!session) { location.href = 'minha-nzinga.html'; return; }
          box.style.display = box.style.display === 'none' ? 'block' : 'none';
        });
      }

      box.querySelector('#marketForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = box.querySelector('#marketStatus');
        const { data: { session } } = await sb.auth.getSession();
        if (!session) { status.textContent = 'Entra na tua conta primeiro.'; return; }
        const fd = new FormData(event.target);
        const { error } = await sb.from('market_products').insert({
          creator_id: session.user.id,
          title: String(fd.get('title') || '').trim(),
          description: String(fd.get('description') || '').trim(),
          category: String(fd.get('category') || 'Digital'),
          price: Number(fd.get('price') || 0),
          currency: 'AOA',
          status: 'draft'
        });
        status.textContent = error ? 'Não foi possível enviar agora.' : 'Enviado para revisão. O produto ainda não está público.';
        if (!error) event.target.reset();
      });
    }

    await loadPublished();
  }

  function boot() {
    initNavigation();
    initProverb();
    if (currentPage() === 'market.html') initMarket();
    document.documentElement.classList.add('ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
