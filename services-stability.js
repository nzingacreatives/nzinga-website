/* Nzinga Creatives — services catalog stability guard */
(function(){
  'use strict';
  function check(){
    var root=document.getElementById('catalog');
    if(!root) return;
    var cards=root.querySelectorAll('.service-card').length;
    if(cards>0) return;
    try{
      if(typeof render==='function') render();
    }catch(e){ console.error('Nzinga Serviços:',e); }
  }
  function start(){
    check();
    setTimeout(check,250);
    setTimeout(check,800);
    setTimeout(check,1600);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
