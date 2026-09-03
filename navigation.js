(()=>{'use strict';
const items=[['index.html','⌂','Início'],['servicos.html','◇','Serviços'],['nzingagpt.html','◉','NzingaGPT'],['surpresas.html','✦','Surpresas'],['market.html','▣','Market'],['raizes.html','◆','Raízes'],['minha-nzinga.html','☻','Minha Nzinga'],['admin.html','♜','Admin']];
function init(){
  if(!document.body||document.querySelector('.bottom-nav'))return;
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const bar=document.createElement('nav');
  bar.className='bottom-nav';
  bar.setAttribute('aria-label','Navegação rápida');
  bar.innerHTML=items.map(([href,icon,label])=>`<a href="${href}"${current===href?' class="active"':''} aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`).join('');
  document.body.appendChild(bar);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();