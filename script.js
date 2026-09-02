/* Nzinga Creatives — global interactions */
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';

  function initBottomNav(){
    if(document.querySelector('.bottom-nav')) return;
    const nav=document.createElement('nav');
    nav.className='bottom-nav';
    nav.setAttribute('aria-label','Navegação principal');
    nav.innerHTML=`<a href="index.html">Início</a><a href="servicos.html">Serviços</a><a href="surpresas.html">Surpresas</a><a href="nzingagpt.html">NzingaGPT</a><a href="minha-nzinga.html">Minha Nzinga</a>`;
    document.body.appendChild(nav);
  }

  function initMenu(){
    const btn=document.getElementById('menuBtn');
    const links=document.getElementById('navLinks');
    if(btn&&links) btn.addEventListener('click',()=>links.classList.toggle('open'));
  }

  function initProverb(){
    const el=document.querySelector('[data-proverb]');
    if(!el) return;
    const list=['A união faz a força.','Quem caminha com propósito chega mais longe.','A sabedoria cresce quando é partilhada.','Uma ideia pode transformar um caminho.'];
    el.textContent=list[Math.floor(Math.random()*list.length)];
  }

  function loadSupabase(){
    return new Promise((resolve,reject)=>{
      if(window.supabase && window.NZINGA_SUPABASE) return resolve(window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey));
      const cfg=document.createElement('script');
      cfg.src='supabase-config.js';
      cfg.onload=()=>{
        if(!window.supabase){reject(new Error('Supabase não carregou.'));return;}
        resolve(window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey));
      };
      cfg.onerror=()=>reject(new Error('Não foi possível carregar a configuração.'));
      document.head.appendChild(cfg);
    });
  }

  function initMinhaNzingaAuth(){
    const form=document.getElementById('authForm');
    if(!form) return;
    const email=document.getElementById('authEmail');
    const password=document.getElementById('authPassword');
    const status=document.getElementById('authStatus');
    let signup=document.getElementById('signupBtn');

    // Corrige versões antigas/cacheadas onde o botão não chegou a ser renderizado.
    if(!signup){
      signup=document.createElement('button');
      signup.id='signupBtn';
      signup.type='button';
      signup.className='button';
      signup.textContent='Criar conta';
      form.appendChild(signup);
    }

    function message(text,error=false){
      if(!status) return;
      status.textContent=text;
      status.style.color=error?'#ffb3b3':'#fff';
    }

    let sb;
    loadSupabase().then(client=>{sb=client;}).catch(err=>message(err.message,true));

    // addEventListener não substitui handlers inline existentes e funciona mesmo se o HTML antigo estiver em cache.
    signup.addEventListener('click',async()=>{
      try{
        if(!sb) sb=await loadSupabase();
        const e=(email?.value||'').trim();
        const p=password?.value||'';
        if(!e||p.length<6){message('Preenche o e-mail e usa uma palavra-passe com pelo menos 6 caracteres.',true);return;}
        signup.disabled=true;
        signup.textContent='A criar conta…';
        message('A criar a tua conta…');
        const {data,error}=await sb.auth.signUp({email:e,password:p,options:{emailRedirectTo:location.origin+'/minha-nzinga.html'}});
        if(error) throw error;
        if(data?.session){message('Conta criada com sucesso. A entrar…');setTimeout(()=>location.reload(),500);}
        else message('Conta criada. Verifica o teu e-mail para confirmar o acesso.');
      }catch(err){message(err?.message||'Não foi possível criar a conta agora.',true);}
      finally{signup.disabled=false;signup.textContent='Criar conta';}
    });

    form.addEventListener('submit',async e=>{
      // O handler original continua responsável pelo login; este listener apenas garante feedback em versões antigas.
      if(e.defaultPrevented) return;
      e.preventDefault();
      try{
        if(!sb) sb=await loadSupabase();
        const {data,error}=await sb.auth.signInWithPassword({email:(email?.value||'').trim(),password:password?.value||''});
        if(error) throw error;
        if(data?.session) location.reload();
      }catch(err){message(err?.message||'Não foi possível entrar. Verifica os dados.',true);}
    });
  }

  function init(){
    initMenu();
    initBottomNav();
    initProverb();
    if(path==='minha-nzinga.html') initMinhaNzingaAuth();
    if(path==='market.html' && typeof window.initMarket==='function') window.initMarket();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();