/* Nzinga Creatives — tema global controlado pela Minha Nzinga. */
(function(){
  'use strict';
  var KEY='nzinga-site-theme';
  function getTheme(){var saved=localStorage.getItem(KEY);return saved==='dark'||saved==='light'?saved:'light'}
  function apply(theme){
    theme=theme==='dark'?'dark':'light';
    document.documentElement.dataset.nzingaTheme=theme;
    document.documentElement.style.colorScheme=theme;
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',theme==='dark'?'#101010':'#f4f1eb');
  }
  function injectStyles(){
    if(document.getElementById('nzinga-site-theme-style'))return;
    var s=document.createElement('style');s.id='nzinga-site-theme-style';
    s.textContent=''
      +'html[data-nzinga-theme="light"]{color-scheme:light!important}html[data-nzinga-theme="dark"]{color-scheme:dark!important}'
      +'html[data-nzinga-theme="dark"] body{--paper:#101010;--black:#f1f1f1;--ink:#f1f1f1;--muted:#d2d2d2;background:#101010!important;color:#f1f1f1!important}'
      +'html[data-nzinga-theme="dark"] .nav{background:#101010!important;border-color:#f1f1f1!important}'
      +'html[data-nzinga-theme="dark"] .logo,html[data-nzinga-theme="dark"] nav a,html[data-nzinga-theme="dark"] .menu{color:#fff!important}'
      +'html[data-nzinga-theme="dark"] .menu{background:#101010!important;border-color:#fff!important}'
      +'html[data-nzinga-theme="dark"] .section,html[data-nzinga-theme="dark"] .service-grid,html[data-nzinga-theme="dark"] .home-cards,html[data-nzinga-theme="dark"] .portfolio-grid div{border-color:#555!important}'
      +'html[data-nzinga-theme="dark"] .portfolio{background:#171717!important}'
      +'html[data-nzinga-theme="dark"] .service-grid a,html[data-nzinga-theme="dark"] .home-cards a{border-color:#555!important;color:#f1f1f1!important}'
      +'html[data-nzinga-theme="dark"] .service-grid p,html[data-nzinga-theme="dark"] .home-cards p,html[data-nzinga-theme="dark"] .hero-copy>p:not(.eyebrow),html[data-nzinga-theme="dark"] .section-intro>p:last-child{color:#d2d2d2!important}'
      +'html[data-nzinga-theme="dark"] .starter,html[data-nzinga-theme="dark"] .filter{background:#171717!important;color:#fff!important;border-color:#aaa!important}'
      +'html[data-nzinga-theme="dark"] .panel,html[data-nzinga-theme="dark"] .stat{background:#151515!important;color:#f1f1f1!important;border-color:#666!important}'
      +'html[data-nzinga-theme="dark"] .profile-form input,html[data-nzinga-theme="dark"] input,html[data-nzinga-theme="dark"] textarea,html[data-nzinga-theme="dark"] select{background:#151515!important;color:#fff!important;border-color:#777!important}'
      +'html[data-nzinga-theme="dark"] .empty{color:#ddd!important;border-color:#aaa!important}'
      +'html[data-nzinga-theme="dark"] footer{background:#050505!important;color:#fff!important}'
      +'html[data-nzinga-theme="dark"] .bottom-nav{background:#101010!important;border-color:#666!important}'
      +'html[data-nzinga-theme="dark"] .bottom-nav a{color:#d2d2d2!important}'
      +'html[data-nzinga-theme="dark"] .account-theme-panel{background:#151515!important;color:#fff!important;border-color:#777!important}'
      +'.account-theme-panel{margin-top:18px;border:3px solid var(--black);padding:28px;background:var(--paper)}.account-theme-panel h2{font-family:"Playfair Display",serif;font-size:2.2rem;margin:0 0 8px}.account-theme-panel p{color:var(--muted);line-height:1.6;margin:0 0 18px}.theme-choice-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.theme-choice{border:2px solid var(--black);background:transparent;color:var(--ink);padding:15px;text-align:left;font:700 1rem "DM Sans",sans-serif;cursor:pointer}.theme-choice.active{background:var(--black);color:var(--paper);box-shadow:5px 5px 0 var(--red)}.theme-choice small{display:block;font-weight:400;margin-top:5px;opacity:.7}@media(max-width:560px){.theme-choice-row{grid-template-columns:1fr}.account-theme-panel{padding:20px}}';
    document.head.appendChild(s);
  }
  function settings(){
    if(!/minha-nzinga\.html$/i.test(location.pathname))return;
    var grid=document.getElementById('accountGrid');if(!grid||document.getElementById('nzingaThemeSettings'))return;
    var panel=document.createElement('section');panel.id='nzingaThemeSettings';panel.className='account-theme-panel';panel.innerHTML='<h2>Definições</h2><p>Escolhe como queres ver a Nzinga Creatives. A escolha fica guardada neste dispositivo.</p><div class="theme-choice-row"><button type="button" class="theme-choice" data-theme-choice="light">☀ Claro<small>Visual claro e limpo.</small></button><button type="button" class="theme-choice" data-theme-choice="dark">☾ Escuro<small>Visual escuro para ambientes com pouca luz.</small></button></div>';
    grid.appendChild(panel);var buttons=panel.querySelectorAll('[data-theme-choice]');function refresh(){var t=getTheme();buttons.forEach(function(b){b.classList.toggle('active',b.dataset.themeChoice===t);b.setAttribute('aria-pressed',b.dataset.themeChoice===t?'true':'false')})}buttons.forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.themeChoice;localStorage.setItem(KEY,t);apply(t);refresh()})});refresh();
  }
  function boot(){injectStyles();apply(getTheme());settings()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
