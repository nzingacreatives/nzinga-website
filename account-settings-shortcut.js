(()=>{'use strict';
function boot(){
  if(!location.pathname.includes('minha-nzinga'))return;
  const grid=document.getElementById('accountGrid');
  if(!grid)return;
  if(document.getElementById('nz-account-settings'))return;
  const s=document.createElement('section');
  s.id='nz-account-settings';
  s.className='panel nz-account-settings';
  s.style.cssText='grid-column:1/-1;margin:18px 0 0;padding:24px;border:3px solid var(--black);background:var(--paper);color:var(--ink)';
  const es=localStorage.getItem('nzinga-language')==='es';
  s.innerHTML='<p class="eyebrow">'+(es?'PREFERENCIAS':'PREFERÊNCIAS')+'</p><h2 style="margin-bottom:10px">'+(es?'Configuración':'Definições')+'</h2><p style="color:var(--muted);line-height:1.6;margin:0 0 16px">'+(es?'Personaliza el idioma, tema y preferencias de tu experiencia Nzinga.':'Personaliza o idioma, tema e preferências da tua experiência Nzinga.')+'</p><a class="button button-main" href="settings.html">⚙ '+(es?'Abrir configuración':'Abrir definições')+' →</a>';
  const rating=grid.querySelector('.rating');
  if(rating)rating.parentNode.insertBefore(s,rating);
  else grid.appendChild(s);
}
function wait(){boot();if(!document.getElementById('nz-account-settings'))setTimeout(boot,300);if(!document.getElementById('nz-account-settings'))setTimeout(boot,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();