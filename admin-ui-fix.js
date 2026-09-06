/* Shared Admin navigation + responsive viewport fix. Visual/admin navigation only. */
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
      +'#nz-admin-global-nav{width:100%;height:68px;display:flex!important;align-items:center;justify-content:space-between;padding:0 max(5vw,18px);border-bottom:2px solid #ededed;background:#101010;position:sticky;top:0;z-index:100000!important;isolation:isolate;pointer-events:auto!important}'
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
      +'#nz-admin-fixed-nav a{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;text-decoration:none;color:#fff!important;font-size:1rem;cursor:pointer;touch-action:manipulation;position:relative;z-index:100001;min-width:0;overflow:hidden}'
      +'#nz-admin-fixed-nav a .nav-icon{width:22px;height:22px;display:grid;place-items:center}'
      +'#nz-admin-fixed-nav a svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;display:block}'
      +'#nz-admin-fixed-nav a small{font-size:.5rem;font-weight:700;white-space:nowrap}'
      +'#nz-admin-fixed-nav a.active{color:#f7c515!important}'
      +'.admin-side{background:rgba(17,17,17,.96)!important;border-color:#333!important}'
      +'.side-nav button{border:1px solid transparent!important}'
      +'.side-nav button.active{box-shadow:4px 4px 0 #c91510}'
      +'.admin-top .eyebrow{color:#f7c515!important;opacity:1}'
      +'.admin-top p,.admin-card p{color:#fff!important;opacity:.78!important}'
      +'.admin-meta{color:#f7c515!important;opacity:1!important}'
      +'.stat{border-color:#444!important;background:linear-gradient(145deg,#171717,#0d0d0d)!important}'
      +'.stat span,.stat small{color:#fff!important;opacity:.72!important}'
      +'.admin-content{border-color:#333!important;background:#0d0d0d!important}'
      +'.admin-card{border-bottom-color:#333!important}'
      +'.admin-actions button,.admin-actions select{border-color:#555!important;background:#151515!important;color:#fff!important}'
      +'.admin-actions .approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'.admin-actions .danger{border-color:#c91510!important;color:#fff!important}'
      +'.admin-form{background:#171717!important;border:1px solid #333}'
      +'.admin-form input,.admin-form textarea,.admin-form select{background:#0b0b0b!important;color:#fff!important;border-color:#555!important}'
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

    var icons={
      home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-5h6v5"/></svg>',
      services:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
      gpt:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c4.8 0 8 2.7 8 6.8 0 3.9-3.2 6.2-8 6.2s-8-2.3-8-6.2C4 5.7 7.2 3 12 3Z"/><path d="M8 19c1.2 1.4 2.6 2 4 2s2.8-.6 4-2"/><circle cx="9" cy="9" r=".8"/><circle cx="15" cy="9" r=".8"/></svg>',
      market:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/><path d="M8 12v.1M16 12v.1"/></svg>',
      account:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.3 3-5 7-5s6.3 1.7 7 5"/></svg>'
    };
    var fixed=document.createElement('nav');
    fixed.id='nz-admin-fixed-nav';
    fixed.setAttribute('aria-label','Navegação rápida');
    fixed.innerHTML='<a href="/index.html" data-page="index.html"><span class="nav-icon">'+icons.home+'</span><small>Início</small></a>'
      +'<a href="/servicos.html" data-page="servicos.html"><span class="nav-icon">'+icons.services+'</span><small>Serviços</small></a>'
      +'<a href="/nzingagpt.html" data-page="nzingagpt.html"><span class="nav-icon">'+icons.gpt+'</span><small>NzingaGPT</small></a>'
      +'<a href="/market.html" data-page="market.html"><span class="nav-icon">'+icons.market+'</span><small>Market</small></a>'
      +'<a href="/minha-nzinga.html" data-page="minha-nzinga.html"><span class="nav-icon">'+icons.account+'</span><small>Minha Nzinga</small></a>';
    document.body.appendChild(fixed);

    var path=(location.pathname.split('/').pop()||'index.html');
    var current=fixed.querySelector('[data-page="'+path+'"]');
    if(current)current.classList.add('active');

    document.addEventListener('click',function(e){
      var menu=e.target&&e.target.closest?e.target.closest('#nzAdminMenu'):null;
      if(menu){
        e.preventDefault();e.stopPropagation();
        var links=document.getElementById('nzAdminLinks');if(!links)return;
        var open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));return;
      }
      var link=e.target&&e.target.closest?e.target.closest('#nz-admin-global-nav a, #nz-admin-fixed-nav a'):null;
      if(link){var href=link.getAttribute('href');if(!href)return;e.preventDefault();e.stopPropagation();window.location.assign(href);}
    },true);

    var side=document.querySelector('.side-nav');
    if(side){side.querySelectorAll('button').forEach(function(btn){btn.setAttribute('aria-label',btn.textContent.trim());});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
