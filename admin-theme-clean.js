/* Nzinga Admin — remove o controlo de tema do cabeçalho. */
(function(){
  'use strict';
  if(!/admin\.html$/i.test(location.pathname))return;
  function clean(){
    var btn=document.getElementById('nz-admin-theme-toggle');
    if(btn)btn.remove();
    document.body.classList.remove('admin-theme-dark');
    document.body.classList.add('admin-theme-light');
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content','#f4f1eb');
    if(!document.getElementById('nz-admin-theme-clean-style')){
      var s=document.createElement('style');s.id='nz-admin-theme-clean-style';s.textContent='#nz-admin-theme-toggle{display:none!important}';document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){clean();setTimeout(clean,150);setTimeout(clean,500)},{once:true});else{clean();setTimeout(clean,150);setTimeout(clean,500)}
})();
