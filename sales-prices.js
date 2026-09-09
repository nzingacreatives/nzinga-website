/* Nzinga Creatives — pricing correction v4.
   Keeps the catalog data intact and updates ONLY the rendered price cells.
   This runs after the catalog has rendered, so filtered/re-rendered cards are corrected too. */
(function () {
  'use strict';

  const PRICES = {
    'Logotipo':[8000,16000,28000], 'Isotipo':[6000,12000,20000], 'Monograma':[6000,12000,20000],
    'Post':[1600,3200,4800], 'Story':[1200,2400,4000], 'Flyer':[4000,8000,12000], 'Cartaz':[4000,8000,12000],
    'Banner':[4000,8000,12000], 'Certificado':[2400,4800,8000], 'Menu digital':[4000,8000,14000],
    'Convite digital':[4000,6400,12000], 'Cartão de visita':[2400,4800,8000], 'Apresentação':[6000,12000,20000],
    'Pack de posts':[6000,12000,20000], 'Catálogo':[8000,16000,28000], 'Brochura':[8000,16000,28000],
    'Design de embalagem':[12000,24000,36000], 'Ilustração':[4000,8000,16000], 'Infográfico':[4000,8000,16000],
    'Mockup':[2400,4800,8000],
    'Identidade de marca':[20000,40000,72000], 'Kit de marca':[16000,32000,56000], 'Manual de identidade':[20000,40000,64000],
    'Rebranding':[16000,36000,64000], 'Estratégia visual':[12000,24000,40000], 'Identidade + estratégia':[28000,56000,96000],
    'Branding completo':[40000,80000,120000], 'Paleta de cores':[6000,12000,20000], 'Tipografia da marca':[6000,12000,20000],
    'Estratégia de marca':[16000,32000,56000], 'Naming':[8000,16000,28000], 'Slogan':[4000,8000,12000], 'Posicionamento':[12000,24000,40000],
    'Post individual':[1600,3200,4800], 'Carrossel':[3200,6000,9600], 'Legenda':[800,1600,2800], 'Copy':[1600,3200,6000],
    'Roteiro curto':[2000,4000,6400], 'Roteiro anúncio':[2800,6000,9600], 'Roteiro vídeo':[4000,8000,14000],
    'Roteiro cinematográfico':[6000,12000,20000], 'Pack 5 posts':[6000,12000,20000], 'Pack 10 posts':[10000,20000,32000],
    'Pack 20 posts':[16000,32000,52000], 'Pack 7 dias':[8000,16000,28000], 'Pack mensal':[24000,48000,80000],
    'Calendário de conteúdo':[4000,8000,14000], 'Estratégia de conteúdo':[8000,16000,28000], 'Bio profissional':[2000,4000,6400],
    'Roteiro Reels/TikTok':[3200,6400,12000], 'Pack Instagram':[8000,20000,32000], 'Pack TikTok':[8000,20000,32000],
    'Pack Facebook':[8000,20000,32000], 'Conteúdo promocional':[4000,8000,16000], 'Pack frases/mensagens':[2400,6000,12000],
    'Gestão de conteúdo mensal':[20000,40000,64000],
    'CV':[2000,4000,6400], 'Carta de apresentação':[2000,4000,6400], 'Trabalho escolar':[4000,8000,16000],
    'Formatação de trabalho':[2400,6000,12000], 'Capa de trabalho':[1200,2400,4000], 'Proposta comercial':[4000,8000,16000],
    'Orçamento':[2400,4000,8000], 'Relatório':[4000,8000,16000], 'E-book personalizado':[12000,24000,48000],
    'Portfólio':[8000,16000,28000], 'Documento profissional':[4000,8000,16000],
    'Landing Page':[24000,48000,80000], 'Site pessoal':[60000,120000,200000], 'Site básico':[40000,80000,140000],
    'Site profissional':[64000,120000,200000], 'Site empresarial':[96000,160000,280000], 'Página empresarial':[60000,120000,200000],
    'Página de campanha':[24000,48000,80000], 'Loja online':[120000,200000,320000], 'Portfólio web':[32000,60000,100000],
    'Página de evento':[16000,32000,56000], 'Experiência digital':[40000,80000,160000], 'Página interativa':[40000,80000,160000],
    'Formulário digital':[8000,16000,32000], 'Link personalizado':[4000,8000,16000], 'Página de apresentação':[24000,48000,80000],
    'Sistema web':[120000,240000,400000], 'Web app':[160000,320000,480000], 'Manutenção mensal':[12000,24000,48000],
    'Atualização de site':[8000,20000,40000], 'Otimização':[12000,24000,48000], 'Integração':[16000,40000,80000],
    'Desenvolvimento personalizado':[null,120000,240000],
    'Edição de vídeo curto':[2400,4800,8000], 'Reels/TikTok':[2400,4800,8000], 'Vídeo para redes sociais':[4000,8000,16000],
    'Vídeo institucional':[8000,20000,36000], 'Vídeo promocional':[8000,20000,40000], 'Motion graphics':[8000,20000,40000],
    'Animação de logo':[6000,12000,20000], 'Animação simples':[6000,12000,24000], 'Vídeo de produto':[6000,16000,32000],
    'Apresentação animada':[8000,20000,40000], 'Slideshow':[4000,8000,16000], 'Intro/Outro':[4000,8000,16000],
    'Edição de imagem':[1600,4000,8000], 'Campanha audiovisual':[12000,28000,56000], 'Trailer':[12000,24000,48000],
    'Conteúdo audiovisual':[16000,40000,80000], 'Vídeo surpresa':[4000,8000,16000]
  };

  const money = value => value == null ? '—' : `${Number(value).toLocaleString('pt-AO')} Kz`;

  function applyPrices() {
    document.querySelectorAll('#catalog .service-card').forEach(card => {
      const title = card.querySelector('h3');
      if (!title) return;
      const key = title.textContent.trim();
      const values = PRICES[key];
      if (!values) return;

      const cells = [...card.querySelectorAll('.mini-price b')];
      values.slice(0, 3).forEach((value, index) => {
        if (cells[index]) cells[index].textContent = money(value);
      });

      const special = card.querySelector('.special-price strong');
      if (special) special.textContent = values[2] == null ? '—' : money(values[2]);
    });
  }

  function start() {
    applyPrices();
    const root = document.getElementById('catalog');
    if (root && window.MutationObserver) {
      let queued = false;
      new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => { queued = false; applyPrices(); });
      }).observe(root, { childList: true, subtree: true });
    }
    setTimeout(applyPrices, 50);
    setTimeout(applyPrices, 250);
    setTimeout(applyPrices, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
