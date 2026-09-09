/* Nzinga visual polish + recommended pricing. */
(function(){
'use strict';
function money(v){return Number(v).toLocaleString('pt-AO')+' Kz'}
function recommended(v){
  var n=Number(v); if(!Number.isFinite(n)) return null;
  if(n<=1000) return n;
  var r=Math.round((n*.8)/500)*500;
  return Math.max(1000,r);
}
function applyPricing(){
  if(!/servicos\.html$/.test(location.pathname)) return;
  document.querySelectorAll('.service-card').forEach(function(card){
    card.querySelectorAll('.mini-price b').forEach(function(el){
      var raw=el.textContent.replace(/[^0-9]/g,'');
      if(!raw) return;
      var old=Number(raw), next=recommended(old);
      if(next===null) return;
      el.textContent=money(next);
      el.dataset.oldPrice=money(old);
      el.title='Preço recomendado Nzinga — cerca de 20% abaixo da referência anterior';
    });
  });
}
function observePricing(){
  var root=document.getElementById('catalog'); if(!root) return;
  applyPricing();
  new MutationObserver(applyPricing).observe(root,{childList:true,subtree:true});
  setTimeout(applyPricing,80); setTimeout(applyPricing,400);
}
function visualPolish(){
  if(document.getElementById('nzinga-polish-style')) return;
  var s=document.createElement('style'); s.id='nzinga-polish-style'; s.textContent=`
    html{scroll-behavior:smooth}body{overflow-x:hidden}
    .button,.request-btn,.details-btn,.filter,.avatar-action,.close,.submit,.card-actions button,.nav a,.bottom-nav a{transition:transform .2s ease,background-color .2s ease,color .2s ease,border-color .2s ease,box-shadow .2s ease,opacity .2s ease}
    .button:hover,.request-btn:hover,.details-btn:hover,.filter:hover,.avatar-action:hover,.close:hover,.submit:hover{transform:translateY(-2px)}
    .service-card,.panel,.topic,.note-card,.illustration,.how,.rating,.auth-box{animation:nzFadeUp .55s ease both}
    .service-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.10)}
    :focus-visible{outline:3px solid var(--red,#d71920)!important;outline-offset:3px}
    body.dark-mode,html.dark-mode body{color:#fff}
    body.dark-mode .service-card,body.dark-mode .panel,body.dark-mode .box,body.dark-mode input,body.dark-mode textarea,body.dark-mode select,html.dark-mode .service-card,html.dark-mode .panel,html.dark-mode .box,html.dark-mode input,html.dark-mode textarea,html.dark-mode select{color:#fff;border-color:#fff;background:#121826}
    body.dark-mode .service-card p,body.dark-mode .panel p,html.dark-mode .service-card p,html.dark-mode .panel p{color:#f2f2f2}
    body.dark-mode .service-card h3,body.dark-mode .panel h2,body.dark-mode .category h2,html.dark-mode .service-card h3,html.dark-mode .panel h2,html.dark-mode .category h2{color:#fff}
    .samakaka{position:relative;isolation:isolate;overflow:hidden}
    .samakaka:after{content:'';position:absolute;inset:0;z-index:-1;background:repeating-linear-gradient(135deg,transparent 0 16px,#d71920 16px 20px,transparent 20px 36px,#f2c400 36px 40px,transparent 40px 56px);opacity:.72}
    @keyframes nzFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.button,.request-btn,.details-btn,.filter,.avatar-action,.close,.submit,.card-actions button,.nav a,.bottom-nav a{transition:none}.service-card,.panel,.topic,.note-card,.illustration,.how,.rating,.auth-box{animation:none}}
  `; document.head.appendChild(s);
}
function boot(){visualPolish();observePricing()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
