/* Nzinga Admin — final cleanup for the first Admin stage. */
(function(){
'use strict';
function start(){
 if(!/admin\.html$/i.test(location.pathname))return;
 var h=document.querySelector('.admin-top h1'),p=document.querySelector('.admin-top p');
 if(h)h.textContent='Nzinga Admin';
 if(p)p.textContent='Gestão separada por Market, Pedidos, Avaliações, Utilizadores, Equipa e Atividades.';
 var nav=document.querySelector('.side-nav');
 function fix(){if(!nav)return;var b=nav.querySelector('button[data-tab="audit"]');if(b)b.innerHTML='<span aria-hidden="true">♜</span><span>Atividades</span>';nav.querySelectorAll('button[data-tab="overview"]').forEach(function(x){x.remove()})}
 fix();if(nav)new MutationObserver(fix).observe(nav,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
