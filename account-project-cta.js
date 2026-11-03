(function(){
  function boot(){
    const grid=document.getElementById('accountGrid');if(!grid||document.getElementById('accountProjectCta'))return;
    const cta=document.createElement('section');
    cta.id='accountProjectCta';
    cta.className='account-project-cta';
    cta.innerHTML='<div><span>PROJETO / NOVO PEDIDO</span><h2>Queres começar um projeto?</h2><p>Abre o briefing, explica a tua ideia e envia os anexos. O pedido fica registado e entra na espera para atendimento.</p></div><a href="#accountBriefing">CRIAR PROJETO →</a>';
    grid.insertBefore(cta,grid.firstElementChild);
    const style=document.createElement('style');
    style.textContent=`.account-project-cta{grid-column:1/-1;background:#e52b2f;color:#fff;padding:26px 30px;display:flex;justify-content:space-between;align-items:center;gap:25px;border:3px solid #090909}.account-project-cta span{font-size:.58rem;font-weight:800;letter-spacing:.15em;color:#f3c62f}.account-project-cta h2{margin:8px 0;font:800 clamp(1.8rem,3.5vw,3rem) Manrope,sans-serif;letter-spacing:-.04em}.account-project-cta p{margin:0;max-width:620px;color:#ffe8e8;line-height:1.55}.account-project-cta a{display:inline-flex;align-items:center;justify-content:center;min-width:190px;padding:16px 20px;background:#101b36;color:#fff;font-size:.62rem;font-weight:800;letter-spacing:.12em;white-space:nowrap}.account-project-cta a:hover{background:#090909}@media(max-width:700px){.account-project-cta{display:block;padding:22px}.account-project-cta a{margin-top:18px;width:100%}}`;
    document.head.appendChild(style);
    cta.querySelector('a').addEventListener('click',function(e){e.preventDefault();document.getElementById('accountBriefing')?.scrollIntoView({behavior:'smooth',block:'start'});});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
