(() => {
  'use strict';
  const pages=[['index.html','⌂','Início'],['servicos.html','◇','Serviços'],['surpresas.html','✦','Surpresas'],['nzingagpt.html','◉','NzingaGPT'],['minha-nzinga.html','☻','Minha Nzinga'],['admin.html','♜','Admin']];
  const init=()=>{
    const path=(location.pathname.split('/').pop()||'index.html');
    let nav=document.getElementById('navLinks');
    let btn=document.getElementById('menuBtn');
    if(btn&&nav){
      const toggle=e=>{e.preventDefault();e.stopPropagation();nav.classList.toggle('open');document.body.classList.toggle('nav-open',nav.classList.contains('open'));};
      btn.onclick=toggle;
      btn.addEventListener('touchend',toggle,{passive:false});
      nav.querySelectorAll('a[href]').forEach(a=>{a.onclick=null;a.addEventListener('click',()=>{location.assign(a.href);},{capture:true});});
    }
    let bottom=document.getElementById('nzingaBottomNav');
    if(!bottom){bottom=document.createElement('nav');bottom.id='nzingaBottomNav';bottom.className='nzinga-bottom-nav';bottom.setAttribute('aria-label','Navegação principal');bottom.innerHTML=pages.map(([href,icon,label])=>`<a href="/${href}" class="${path===href?'active':''}"><span>${icon}</span><small>${label}</small></a>`).join('');document.body.appendChild(bottom);}
    bottom.querySelectorAll('a').forEach(a=>{a.onclick=e=>{e.preventDefault();location.assign(a.href);};});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();