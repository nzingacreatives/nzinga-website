(function(){
  function boot(){
    if(!document.querySelector('.nz-home')) return;
    document.querySelectorAll('.nz-home .nz-service-item[href="/servicos.html"],.nz-home .nz-services>.square-link[href="/servicos.html"]').forEach(function(a){
      a.addEventListener('click',function(e){e.preventDefault();var target=document.getElementById('o-que-fazemos');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
