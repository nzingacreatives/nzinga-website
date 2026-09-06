/* Nzinga Admin — final cleanup for the first Admin stage. */
(function(){
'use strict';
function start(){
 if(!/admin\.html$/i.test(location.pathname))return;
 var h=document.querySelector('.admin-top h1'),p=document.querySelector('.admin-top p');
 if(h)h.textContent='Nzinga Admin';
 if(p)p.textContent='Gestão separada por Market, Pedidos, Avaliações, Utilizadores, Equipa e Atividades.';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
