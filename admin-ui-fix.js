/* Restore the shared Nzinga navigation on the Admin page without touching admin logic. */
(function(){
  function init(){
    if(!document.body || !location.pathname.match(/admin\.html$/)) return;
    if(document.getElementById('nz-admin-global-nav')) return;

    var style=document.createElement('style');
    style.id='nz-admin-global-nav-style';
    style.textContent=`
      #nz-admin-global-nav{height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 max(5vw,18px);border-bottom:2px solid var(--black,#ededed);background:var(--paper,#101010);position:sticky;top:0;z-index:10001}
      #nz-admin-global-nav .nz-logo{color:var(--black,#ededed);text-decoration:none;font-weight:700;letter-spacing:.08em;line-height:1}
      #nz-admin-global-nav .nz-logo span{display:block;font-size:.55rem;letter-spacing:.28em;margin-top:4px}
      #nz-admin-global-nav .nz-menu{display:none;background:none;border:2px solid var(--black,#ededed);color:inherit;padding:7px 10px;font-size:1.25rem;line-height:1;cursor:pointer}
      #nz-admin-global-nav .nz-links{display:flex;align-items:center;gap:clamp(12px,2vw,26px)}
      #nz-admin-global-nav .nz-links a{color:var(--ink,#ededed);text-decoration:none;font-size:.82rem}
      #nz-admin-global-nav .nz-links a:hover{color:var(--red,#c91510)}
      #nz-admin-global-nav .nz-links .nz-start{background:var(--red,#c91510);color:#fff;border:2px solid var(--black,#ededed);padding:9px 14px;font-weight:700}
      .nz-admin-samakaka{height:14px;background:var(--black,#ededed);border-bottom:2px solid var(--yellow,#f7c515)}
      #nz-admin-fixed-nav{position:fixed;display:none;left:0;right:0;bottom:0;height:64px;background:var(--paper,#101010);border-top:1px solid var(--line,#333);z-index:10000;box-shadow:0 -4px 18px rgba(0,0,0,.18);grid-template-columns:repeat(5,1fr);padding-bottom:env(safe-area-inset-bottom)}
      #nz-admin-fixed-nav a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:var(--muted,#aaa);font-size:1rem}
      #nz-admin-fixed-nav a span{line-height:1}
      #nz-admin-fixed-nav a small{font-size:.5rem;font-weight:700}
      #nz-admin-fixed-nav a.active{color:var(--red,#c91510)!important}
      @media(max-width:900px){
        #nz-admin-global-nav .nz-menu{display:block}
        #nz-admin-global-nav .nz-links{display:none;position:absolute;top:68px;left:0;right:0;background:var(--paper,#101010);padding:16px 18px;flex-direction:column;align-items:stretch;border-bottom:2px solid var(--black,#ededed);box-shadow:0 8px 20px rgba(0,0,0,.16)}
        #nz-admin-global-nav .nz-links.open{display:flex}
        #nz-admin-fixed-nav{display:grid}
        body{padding-bottom:calc(64px + env(safe-area-inset-bottom))}
      }
      @media(min-width:901px){#nz-admin-global-nav .nz-links{display:flex!important}}
    `;
    document.head.appendChild(style);

    var header=document.createElement('header');
    header.id='nz-admin-global-nav';
    header.innerHTML=`<a class="nz-logo" href="index.html">NZINGA<span>CREATIVES</span></a><button class="nz-menu" id="nzAdminMenu" aria-label="Abrir menu" aria-expanded="false">☰</button><nav class="nz-links" id="nzAdminLinks"><a href="index.html">Início</a><a href="servicos.html">Serviços</a><a href="nzingagpt.html">NzingaGPT</a><a href="surpresas.html">Surpresas</a><a href="market.html">Market</a><a href="raizes.html">Raízes</a><a class="nz-start" href="minha-nzinga.html">Minha Nzinga</a></nav>`;
    document.body.insertBefore(header,document.body.firstChild);

    var strip=document.createElement('div');
    strip.className='nz-admin-samakaka';
    strip.setAttribute('aria-hidden','true');
    header.insertAdjacentElement('afterend',strip);

    var fixed=document.createElement('nav');
    fixed.id='nz-admin-fixed-nav';
    fixed.setAttribute('aria-label','Navegação rápida');
    fixed.innerHTML=`<a href="index.html"><span>⌂</span><small>Início</small></a><a href="servicos.html"><span>✦</span><small>Serviços</small></a><a href="nzingagpt.html"><span>✺</span><small>NzingaGPT</small></a><a class="active" href="admin.html"><span>♜</span><small>Admin</small></a><a href="minha-nzinga.html"><span>♙</span><small>Conta</small></a>`;
    document.body.appendChild(fixed);

    var menu=document.getElementById('nzAdminMenu'),links=document.getElementById('nzAdminLinks');
    if(menu&&links){
      menu.addEventListener('click',function(){
        var open=links.classList.toggle('open');
        menu.setAttribute('aria-expanded',String(open));
      });
      links.addEventListener('click',function(e){if(e.target.closest('a')){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
