/* Nzinga Admin — deterministic theme + readability fix. Does not touch data/auth logic. */
(function(){
  'use strict';
  if(!/admin\.html$/i.test(location.pathname)) return;
  function init(){
    if(!document.body) return;
    if(document.getElementById('nz-admin-theme-style')) return;
    var style=document.createElement('style');style.id='nz-admin-theme-style';
    style.textContent=''
      +':root{color-scheme:light}'
      +'body.admin-theme-light{background:#f4f1eb!important;color:#1c1c1c!important}'
      +'body.admin-theme-dark{background:#101010!important;color:#f1f1f1!important}'
      +'.admin-wrap{color:inherit!important}'
      +'.admin-side,.admin-content,.stat,.admin-card,.admin-form{transition:background-color .18s ease,color .18s ease,border-color .18s ease}'
      +'body.admin-theme-light .admin-side{background:#fff!important;color:#1c1c1c!important;border-color:#c9c4ba!important}'
      +'body.admin-theme-light .admin-content{background:#fff!important;color:#1c1c1c!important;border-color:#c9c4ba!important}'
      +'body.admin-theme-light .stat{background:#fff!important;color:#1c1c1c!important;border-color:#c9c4ba!important}'
      +'body.admin-theme-light .stat span,body.admin-theme-light .stat small{color:#555!important;opacity:1!important}'
      +'body.admin-theme-light .stat strong{display:block!important;color:#111!important;opacity:1!important;visibility:visible!important}'
      +'body.admin-theme-light .admin-card{color:#1c1c1c!important;border-bottom-color:#ddd7cd!important}'
      +'body.admin-theme-light .admin-card p{color:#333!important;opacity:1!important}'
      +'body.admin-theme-light .admin-meta{color:#b3130e!important;opacity:1!important}'
      +'body.admin-theme-light .panel-head{color:#111!important;border-bottom-color:#ddd7cd!important}'
      +'body.admin-theme-light .side-nav button{color:#222!important}'
      +'body.admin-theme-light .side-nav button:hover{background:#eeeae2!important}'
      +'body.admin-theme-light .side-nav button.active{background:#111!important;color:#fff!important;box-shadow:4px 4px 0 #c91510!important}'
      +'body.admin-theme-light .logout{color:#111!important;border-color:#bdb7ad!important}'
      +'body.admin-theme-light .admin-actions button,body.admin-theme-light .admin-actions select{background:#fff!important;color:#111!important;border-color:#aaa!important}'
      +'body.admin-theme-light .admin-actions .approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-light .admin-actions .danger{color:#b3130e!important;border-color:#c91510!important}'
      +'body.admin-theme-light .admin-form{background:#f1eee8!important;border-color:#d0cbc2!important}'
      +'body.admin-theme-light .admin-form input,body.admin-theme-light .admin-form textarea,body.admin-theme-light .admin-form select{background:#fff!important;color:#111!important;border-color:#aaa!important}'
      +'body.admin-theme-light .empty{color:#555!important}'
      +'body.admin-theme-light .admin-top p{color:#555!important;opacity:1!important}'
      +'body.admin-theme-dark .admin-side{background:#111!important;color:#f1f1f1!important;border-color:#3a3a3a!important}'
      +'body.admin-theme-dark .admin-content{background:#0d0d0d!important;color:#f1f1f1!important;border-color:#3a3a3a!important}'
      +'body.admin-theme-dark .stat{background:#171717!important;color:#f1f1f1!important;border-color:#444!important}'
      +'body.admin-theme-dark .stat span,body.admin-theme-dark .stat small{color:#d0d0d0!important;opacity:1!important}'
      +'body.admin-theme-dark .stat strong{display:block!important;color:#fff!important;opacity:1!important;visibility:visible!important}'
      +'body.admin-theme-dark .admin-card{color:#f1f1f1!important;border-bottom-color:#333!important}'
      +'body.admin-theme-dark .admin-card p{color:#e7e7e7!important;opacity:1!important}'
      +'body.admin-theme-dark .admin-meta{color:#f7c515!important;opacity:1!important}'
      +'body.admin-theme-dark .panel-head{color:#fff!important;border-bottom-color:#333!important}'
      +'body.admin-theme-dark .side-nav button{color:#eee!important}'
      +'body.admin-theme-dark .side-nav button:hover{background:#242424!important}'
      +'body.admin-theme-dark .side-nav button.active{background:#fff!important;color:#111!important;box-shadow:4px 4px 0 #c91510!important}'
      +'body.admin-theme-dark .logout{color:#fff!important;border-color:#555!important}'
      +'body.admin-theme-dark .admin-actions button,body.admin-theme-dark .admin-actions select{background:#171717!important;color:#fff!important;border-color:#555!important}'
      +'body.admin-theme-dark .admin-actions .approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-dark .admin-actions .danger{color:#fff!important;border-color:#c91510!important}'
      +'body.admin-theme-dark .admin-form{background:#171717!important;border-color:#3a3a3a!important}'
      +'body.admin-theme-dark .admin-form input,body.admin-theme-dark .admin-form textarea,body.admin-theme-dark .admin-form select{background:#090909!important;color:#fff!important;border-color:#555!important}'
      +'body.admin-theme-dark .empty{color:#ccc!important}'
      +'body.admin-theme-dark .admin-top p{color:#d0d0d0!important;opacity:1!important}'
      +'#nz-admin-theme-toggle{display:inline-flex!important;align-items:center;gap:7px;border:2px solid currentColor!important;background:transparent!important;color:inherit!important;padding:8px 11px;border-radius:999px;cursor:pointer;font:700 .75rem/1 "DM Sans",sans-serif;white-space:nowrap;margin-left:8px}'
      +'#nz-admin-theme-toggle:hover{background:rgba(127,127,127,.12)!important}'
      +'#nz-admin-global-nav .nz-theme-wrap{display:flex;align-items:center;gap:6px;margin-left:auto}'
      +'@media(max-width:900px){#nz-admin-theme-toggle{position:absolute;right:58px;top:13px;margin:0;padding:7px 9px;font-size:.7rem}.admin-top .user-chip{margin-top:10px}}';
    document.head.appendChild(style);
    var saved=localStorage.getItem('nzinga-admin-theme');
    /* Admin opens in light mode unless the administrator explicitly chose dark. */
    var theme=saved==='dark'?'dark':'light';
    apply(theme);
    var attempts=0;
    function mount(){
      var header=document.getElementById('nz-admin-global-nav');
      if(!header){if(attempts++<40)setTimeout(mount,100);return}
      if(document.getElementById('nz-admin-theme-toggle'))return;
      var btn=document.createElement('button');btn.type='button';btn.id='nz-admin-theme-toggle';btn.setAttribute('aria-label','Alternar tema');header.appendChild(btn);updateButton(btn,theme);
      btn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';localStorage.setItem('nzinga-admin-theme',theme);apply(theme);updateButton(btn,theme);});
    }
    mount();
    function apply(value){document.body.classList.remove('admin-theme-light','admin-theme-dark');document.body.classList.add('admin-theme-'+value);document.documentElement.style.colorScheme=value;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',value==='dark'?'#101010':'#f4f1eb')}
    function updateButton(btn,value){btn.innerHTML=value==='dark'?'☀︎ Claro':'☾ Escuro';btn.setAttribute('aria-pressed',value==='dark'?'true':'false')}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
