(() => {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if (menuBtn && nav) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  const quote = document.querySelector('[data-proverb]');
  const proverbs = ['A sabedoria é como um embondeiro: ninguém consegue abraçá-la sozinho.','Até o rio mais longo começa com pequenas gotas.','Quem pergunta não se perde no caminho.','Uma única mão não consegue amarrar um pacote.','Quando as raízes são profundas, não há razão para temer o vento.'];
  if (quote) quote.textContent = proverbs[Math.floor(Math.random() * proverbs.length)];
  const bottomNav = document.createElement('nav'); bottomNav.className='bottom-nav'; bottomNav.setAttribute('aria-label','Navegação rápida');
  const path=location.pathname.split('/').pop()||'index.html'; const items=[['index.html','⌂','Início'],['servicos.html','◇','Serviços'],['surpresas.html','✦','Surpresas'],['nzingagpt.html','◉','NzingaGPT'],['minha-nzinga.html','☻','Minha Nzinga']];
  bottomNav.innerHTML=items.map(([href,icon,label])=>`<a href="${href}" class="${path===href?'active':''}" aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`).join(''); document.body.appendChild(bottomNav);
  if(path==='market.html') initMarket(); if(path==='minha-nzinga.html') initMinhaNzingaAuth();
  async function initMarket(){
    const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
    try{if(!window.supabase)await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');if(!window.NZINGA_SUPABASE)await loadScript('supabase-config.js')}catch{return}
    const cfg=window.NZINGA_SUPABASE;if(!cfg||!window.supabase)return;const sb=window.supabase.createClient(cfg.url,cfg.publishableKey);const products=document.getElementById('products');const sell=document.querySelector('.sell');if(!products||!sell)return;
    const escapeHtml=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));const money=(value,currency)=>`${Number(value||0).toLocaleString('pt-AO',{minimumFractionDigits:2,maximumFractionDigits:2})} ${currency||'AOA'}`;
    const renderProduct=p=>`<article class="product" data-category="${escapeHtml(p.category||'arte')}" data-db-product="true"><div class="cover">${escapeHtml((p.title||'NZINGA').slice(0,22))}</div><div class="product-info"><span class="tag">${escapeHtml(String(p.category||'Digital').toUpperCase())}</span><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.description||'Recurso digital criado na comunidade Nzinga.')}</p><div class="product-bottom"><span class="price">${money(p.price,p.currency)}</span><button class="buy" type="button" disabled>Em breve</button></div></div></article>`;
    async function loadPublished(){const {data,error}=await sb.from('market_products').select('id,title,description,price,currency,category,image_path').eq('status','published').order('created_at',{ascending:false});if(error)return;products.querySelectorAll('[data-db-product]').forEach(x=>x.remove());(data||[]).forEach(p=>products.insertAdjacentHTML('afterbegin',renderProduct(p)));bindFilters()}
    function bindFilters(){document.querySelectorAll('.filter').forEach(f=>{f.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');const wanted=f.dataset.filter;let visible=0;products.querySelectorAll('.product').forEach(i=>{const show=wanted==='all'||i.dataset.category===wanted;i.style.display=show?'block':'none';if(show)visible++});const empty=document.getElementById('empty');if(empty)empty.style.display=visible?'none':'block'}})}
    const box=document.createElement('div');box.style.cssText='margin-top:18px;border:2px solid #fff;padding:22px;background:#181818;display:none;';box.innerHTML='<h3 style="margin-top:0">Publicar no Market</h3><p>Envia o teu recurso para revisão. Ele ficará como rascunho até ser aprovado pela Nzinga.</p><form id="marketForm" style="display:grid;gap:10px"><input name="title" placeholder="Nome do produto" maxlength="120" required style="padding:12px"><textarea name="description" placeholder="Descrição" maxlength="1000" style="padding:12px;min-height:80px"></textarea><select name="category" style="padding:12px"><option value="template">Template</option><option value="documento">Documento</option><option value="ebook">Ebook</option><option value="arte">Arte</option><option value="Digital">Outro digital</option></select><input name="price" type="number" min="0" step="0.01" placeholder="Preço em AOA" required style="padding:12px"><button class="button button-main" type="submit">Enviar para revisão →</button><p id="marketStatus" style="min-height:1.3em;margin:0"></p></form>';sell.appendChild(box);
    const action=sell.querySelector('.button-main');if(action){action.removeAttribute('href');action.textContent='Quero participar →';action.style.cursor='pointer';action.onclick=async()=>{const {data:{session}}=await sb.auth.getSession();if(!session){location.href='minha-nzinga.html';return}box.style.display=box.style.display==='none'?'block':'none'}}
    box.querySelector('#marketForm').onsubmit=async e=>{e.preventDefault();const status=box.querySelector('#marketStatus');const {data:{session}}=await sb.auth.getSession();if(!session){status.textContent='Entra na tua conta primeiro.';return}const fd=new FormData(e.target);const {error}=await sb.from('market_products').insert({creator_id:session.user.id,title:String(fd.get('title')||'').trim(),description:String(fd.get('description')||'').trim(),category:String(fd.get('category')||'Digital'),price:Number(fd.get('price')||0),currency:'AOA',status:'draft'});status.textContent=error?'Não foi possível enviar agora.':'Enviado para revisão. O produto ainda não está público.';if(!error)e.target.reset()};await loadPublished()
  }
  function initMinhaNzingaAuth(){
    const form=document.getElementById('authForm');if(!form||form.dataset.nzingaAuthReady==='1')return;form.dataset.nzingaAuthReady='1';const email=document.getElementById('authEmail');const password=document.getElementById('authPassword');const status=document.getElementById('authStatus');let signup=document.getElementById('signupBtn');
    if(!signup){signup=document.createElement('button');signup.id='signupBtn';signup.type='button';signup.className='button';signup.textContent='Criar conta';form.appendChild(signup)}
    const message=(text,error=false)=>{if(status){status.textContent=text;status.style.color=error?'#ffb3b3':'#fff';status.style.display='block'}};
    const showAccountCreated=(confirmed=false)=>{
      if(!status)return;
      status.innerHTML=confirmed
        ? '<strong>Conta criada e e-mail confirmado.</strong><br>A tua sessão foi activada. A abrir a Minha Nzinga…'
        : '<strong>Conta criada com sucesso.</strong><br>Agora verifica o teu e-mail e clica no botão de confirmação. Depois volta a esta página para entrar na tua conta.';
      status.style.color='#fff';status.style.display='block';status.style.padding='14px 16px';status.style.marginTop='14px';status.style.border='2px solid #fff';status.style.lineHeight='1.55';
    };
    const getClient=()=>{if(window.supabase&&window.NZINGA_SUPABASE)return window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);throw new Error('O serviço de contas não carregou. Atualiza a página e tenta novamente.')};
    signup.addEventListener('click',async event=>{event.preventDefault();event.stopImmediatePropagation();try{const sb=getClient();const e=(email?.value||'').trim();const p=password?.value||'';if(!e||p.length<6){message('Preenche o e-mail e usa uma palavra-passe com pelo menos 6 caracteres.',true);return}signup.disabled=true;signup.textContent='A criar conta…';message('A criar a tua conta…');const {data,error}=await sb.auth.signUp({email:e,password:p,options:{emailRedirectTo:location.origin+'/minha-nzinga.html'}});if(error)throw error;if(data?.session){showAccountCreated(true);setTimeout(()=>location.reload(),1200)}else{showAccountCreated(false);signup.textContent='E-mail enviado ✓';signup.disabled=true}},true);
    form.addEventListener('submit',async event=>{event.preventDefault();event.stopImmediatePropagation();try{const sb=getClient();const e=(email?.value||'').trim();const p=password?.value||'';if(!e||p.length<6){message('Preenche o e-mail e usa uma palavra-passe com pelo menos 6 caracteres.',true);return}const button=form.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent='A entrar…'}message('A verificar a tua conta…');const {data,error}=await sb.auth.signInWithPassword({email:e,password:p});if(error)throw error;if(!data?.session)throw new Error('A conta foi encontrada, mas a sessão não foi criada. Confirma o teu e-mail primeiro.');message('Entrada confirmada. A abrir a tua Minha Nzinga…');setTimeout(()=>location.reload(),500)}catch(err){const raw=String(err?.message||'');const friendly=/not confirmed|email not confirmed/i.test(raw)?'O e-mail ainda não foi confirmado. Abre a mensagem da Nzinga no teu e-mail e confirma a conta primeiro.':raw||'Não foi possível entrar agora. Confirma o e-mail e os dados.';message(friendly,true)}finally{const button=form.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent='Entrar'}}},true);
    try{const sb=getClient();sb.auth.getSession().then(({data})=>{if(data?.session&&status){status.innerHTML='<strong>Conta confirmada.</strong><br>A tua sessão está activa. A carregar a Minha Nzinga…';status.style.display='block';setTimeout(()=>location.reload(),350)}})}catch{}
  }
  requestAnimationFrame(()=>document.documentElement.classList.add('ready'));
})();