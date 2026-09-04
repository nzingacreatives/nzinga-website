(()=>{'use strict';
const items=[['index.html','⌂','Início'],['servicos.html','◇','Serviços'],['nzingagpt.html','◉','NzingaGPT'],['market.html','▣','Market'],['minha-nzinga.html','☻','Minha Nzinga']];
function init(){
 if(!document.body)return;
 const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 let bar=document.querySelector('.bottom-nav');
 if(!bar){bar=document.createElement('nav');bar.className='bottom-nav';bar.setAttribute('aria-label','Navegação rápida');document.body.appendChild(bar);}
 bar.innerHTML=items.map(([href,icon,label])=>`<a href="/${href}"${current===href?' class="active"':''} aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`).join('');
 bar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{window.location.href=a.href;}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();