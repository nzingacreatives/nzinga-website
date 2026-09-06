/* Shared Admin navigation + responsive viewport fix. Does not touch Admin data/chat logic. */
(function(){
  'use strict';

  function init(){
    if(!document.body || !/admin\.html$/i.test(location.pathname)) return;
    if(document.getElementById('nz-admin-global-nav')) return;

    var style=document.createElement('style');
    style.id='nz-admin-global-nav-style';
    style.textContent=''
      +'html{width:100%;max-width:100%;overflow-x:hidden}'
      +'body{width:100%;max-width:100%;min-width:0;overflow-x:hidden}'
      +'.admin-wrap{width:100%;max-width:1280px;box-sizing:border-box}'
      +'.admin-wrap,.admin-wrap *{box-sizing:border-box}'
      +'.admin-shell,.admin-main,.admin-content,.admin-panel,.admin-card,.admin-form{min-width:0;max-width:100%}'
      +'.admin-card,.admin-form,.admin-top,.panel-head,.stat{overflow-wrap:anywhere;word-break:break-word}'
      +'#nz-admin-global-nav{width:100%;height:68px;box-sizing:border-box;display:flex!important;align-items:center;justify-content:space-between;padding:0 max(5vw,18px);border-bottom:2px solid #ededed;background:#101010;position:sticky;top:0;z-index:100000!important;isolation:isolate;pointer-events:auto!important}'
      +'#nz-admin-global-nav *{pointer-events:auto!important;box-sizing:border-box}'
      +'#nz-admin-global-nav .nz-logo{color:#fff!important;text-decoration:none;font-weight:800;letter-spacing:.08em;line-height:1;display:block;cursor:pointer;flex:0 0 auto}'
      +'#nz-admin-global-nav .nz-logo span{display:block;font-size:.55rem;letter-spacing:.28em;margin-top:4px}'
      +'#nz-admin-global-nav .nz-menu{display:none!important;background:#101010!important;border:2px solid #fff!important;color:#fff!important;padding:7px 10px;font-size:1.25rem;line-height:1;cursor:pointer;touch-action:manipulation;position:relative;z-index:100002}'
      +'#nz-admin-global-nav .nz-links{display:flex!important;align-items:center;gap:clamp(12px,2vw,26px);min-width:0}'
      +'#nz-admin-global-nav .nz-links a{color:#fff!important;text-decoration:none;font-size:.82rem;cursor:pointer;touch-action:manipulation;display:block;position:relative;z-index:100001;white-space:nowrap}'
      +'#nz-admin-global-nav .nz-links a:hover{color:#f7c515!important}'
      +'#nz-admin-global-nav .nz-links .nz-start{background:#c91510!important;color:#fff!important;border:2px solid #fff;padding:9px 14px;font-weight:700}'
      +'.nz-admin-samakaka{height:14px;background:#111;border-bottom:2px solid #f7c515;position:relative;z-index:99998}'
      +'#nz-admin-fixed-nav{position:fixed!important;display:none;left:0!important;right:0!important;bottom:0!important;top:auto!important;width:100%!important;height:64px;background:#101010;border-top:2px solid #333;z-index:100000!important;box-shadow:0 -4px 18px rgba(0,0,0,.35);grid-template-columns:repeat(5,minmax(0,1fr));padding-bottom:env(safe-area-inset-bottom);pointer-events:auto!important;isolation:isolate;box-sizing:border-box}'
      +'#nz-admin-fixed-nav *{pointer-events:auto!important;box-sizing:border-box}'
      +'#nz-admin-fixed-nav a{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:#aaa!important;font-size:1rem;cursor:pointer;touch-action:manipulation;position:relative;z-index:100001;min-width:0;overflow:hidden}'
      +'#nz-admin-fixed-nav a span{line-height:1}'
      +'#nz-admin-fixed-nav a small{font-size:.5rem;font-weight:700;white-space:nowrap}'
      +'#nz-admin-fixed-nav a.active{color:#e21d2f!important}'
      +'@media(max-width:900px){'
        +'#nz-admin-global-nav .nz-menu{display:block!important}'
        +'#nz-admin-global-nav .nz-links{display:none!important;position:absolute;top:68px;left:0;right:0;width:100%;max-width:100vw;background:#101010;padding:16px 18px;flex-direction:column;align-items:stretch;border-bottom:2px solid #ededed;box-shadow:0 8px 20px rgba(0,0,0,.35);z-index:100001!important}'
        +'#nz-admin-global-nav .nz-links.open{display:flex!important}'
        +'#nz-admin-fixed-nav{display:grid!important}'
        +'body{padding-bottom:calc(64px + env(safe-area-inset-bottom))!important}'
        +'.admin-wrap{width:100%;max-width:100%;padding-left:12px!important;padding-right:12px!important}'
        +'.admin-shell{width:100%;max-width:100%;grid-template-columns:minmax(0,1fr)!important;gap:14px!important}'
        +'.admin-main{width:100%;max-width:100%;overflow:visible}'
        +'.admin-side{width:100%;max-width:100%;overflow:hidden}'
        +'.side-nav{width:100%;max-width:100%;overflow-x:auto;overscroll-behavior-x:contain}'
        +'.admin-content{width:100%;max-width:100%;overflow:hidden}'
      +'}'
      +'@media(max-width:560px){'
        +'.admin-top{width:100%;display:block!important}'
        +'.admin-top h1{max-width:100%;font-size:2.1rem!important;line-height:1.02}'
        +'.stats{width:100%;max-width:100%;grid-template-columns:repeat(2,minmax(0,1fr))!important}'
        +'.stat{min-width:0}'
        +'.panel-head{width:100%;min-width:0}'
        +'.panel-head h2{min-width:0}'
        +'.admin-actions{max-width:100%;overflow:hidden}'
        +'.admin-actions button,.admin-actions select{max-width:100%;min-width:0}'
        +'.admin-form input,.admin-form textarea,.admin-form select{width:100%;max-width:100%;min-width:0}'
      +'}'
      +'@media(min-width:901px){#nz-admin-global-nav .nz-links{display:flex!important}}';
    document.head.appendChild(style);

    var header=document.createElement('header');
    header.id='nz-admin-global-nav';
    header.innerHTML='<a class="nz-logo" href="/index.html">NZINGA<span>CREATIVES</span></a>'
      +'<button type="button" class="nz-menu" id="nzAdminMenu" aria-label="Abrir menu" aria-expanded="false">☰</button>'
      +'<nav class="nz-links" id="nzAdminLinks" aria-label="Navegação principal">'
      +'<a href="/index.html">Início</a><a href="/servicos.html">Serviços</a><a href="/nzingagpt.html">NzingaGPT</a><a href="/surpresas.html">Surpresas</a><a href="/market.html">Market</a><a href="/raizes.html">Raízes</a><a class="nz-start" href="/minha-nzinga.html">Minha Nzinga</a></nav>';
    document.body.insertBefore(header,document.body.firstChild);

    var strip=document.createElement('div');
    strip.className='nz-admin-samakaka';
    strip.setAttribute('aria-hidden','true');
    header.insertAdjacentElement('afterend',strip);

    var fixed=document.createElement('nav');
    fixed.id='nz-admin-fixed-nav';
    fixed.setAttribute('aria-label','Navegação rápida');
    fixed.innerHTML='<a href="/index.html"><span>⌂</span><small>Início</small></a>'
      +'<a href="/servicos.html"><span>✦</span><small>Serviços</small></a>'
      +'<a href="/nzingagpt.html"><span>✺</span><small>NzingaGPT</small></a>'
      +'<a href="/market.html"><span>▣</span><small>Market</small></a>'
      +'<a href="/minha-nzinga.html"><span>☻</span><small>Minha Nzinga</small></a>';
    document.body.appendChild(fixed);

    document.addEventListener('click',function(e){
      var menu=e.target&&e.target.closest?e.target.closest('#nzAdminMenu'):null;
      if(menu){
        e.preventDefault();
        e.stopPropagation();
        var links=document.getElementById('nzAdminLinks');
        if(!links) return;
        var open=links.classList.toggle('open');
        menu.setAttribute('aria-expanded',String(open));
        return;
      }

      var link=e.target&&e.target.closest?e.target.closest('#nz-admin-global-nav a, #nz-admin-fixed-nav a'):null;
      if(link){
        var href=link.getAttribute('href');
        if(!href) return;
        e.preventDefault();
        e.stopPropagation();
        window.location.assign(href);
      }
    },true);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
