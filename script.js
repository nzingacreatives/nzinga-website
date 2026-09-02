(() => {
  'use strict';

  const go = (href) => {
    if (!href || href === '#') return;
    window.location.href = href;
  };

  const initNavigation = () => {
    const menuBtn = document.getElementById('menuBtn');
    const nav = document.getElementById('navLinks');

    if (menuBtn && nav && !menuBtn.dataset.navReady) {
      menuBtn.dataset.navReady = '1';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });
    }

    // Keep normal anchors native. This avoids page-specific scripts cancelling navigation.
    document.querySelectorAll('.nav a, #navLinks a, .bottom-nav a').forEach((link) => {
      if (link.dataset.navReady) return;
      link.dataset.navReady = '1';
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        if (event.defaultPrevented) {
          event.stopImmediatePropagation();
          go(href);
        }
      }, true);
    });

    let bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav && document.body) {
      bottomNav = document.createElement('nav');
      bottomNav.className = 'bottom-nav';
      bottomNav.setAttribute('aria-label', 'Navegação rápida');
      const path = location.pathname.split('/').pop() || 'index.html';
      const items = [
        ['index.html', '⌂', 'Início'],
        ['servicos.html', '◇', 'Serviços'],
        ['surpresas.html', '✦', 'Surpresas'],
        ['nzingagpt.html', '◉', 'NzingaGPT'],
        ['minha-nzinga.html', '☻', 'Minha Nzinga'],
        ['admin.html', '♜', 'Admin']
      ];
      bottomNav.innerHTML = items.map(([href, icon, label]) =>
        `<a href="${href}" class="${path === href ? 'active' : ''}" aria-label="${label}"><span>${icon}</span><small>${label}</small></a>`
      ).join('');
      document.body.appendChild(bottomNav);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
  } else {
    initNavigation();
  }

  const quote = document.querySelector('[data-proverb]');
  const proverbs = [
    'A sabedoria é como um embondeiro: ninguém consegue abraçá-la sozinho.',
    'Até o rio mais longo começa com pequenas gotas.',
    'Quem pergunta não se perde no caminho.',
    'Uma única mão não consegue amarrar um pacote.',
    'Quando as raízes são profundas, não há razão para temer o vento.'
  ];
  if (quote) quote.textContent = proverbs[Math.floor(Math.random() * proverbs.length)];

  const path = location.pathname.split('/').pop() || 'index.html';

  if (path === 'market.html') initMarket();
  if (path === 'minha-nzinga.html') initMinhaNzingaAuth();

  async function initMarket() {
    const loadScript = src => new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
    try {
      if (!window.supabase) await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      if (!window.NZINGA_SUPABASE) await loadScript('supabase-config.js');
    } catch { return; }
    const cfg = window.NZINGA_SUPABASE;
    if (!cfg || !window.supabase) return;
    const sb = window.supabase.createClient(cfg.url, cfg.publishableKey);
    const products = document.getElementById('products');
    const sell = document.querySelector('.sell');
    if (!products || !sell) return;
    const escapeHtml = s => String(s ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[c]));
    const money = (value, currency) => `${Number(value || 0).toLocaleString('pt-AO', {minimumFractionDigits:2, maximumFractionDigits:2})} ${currency || 'AOA'}`;
    const renderProduct = p => `<article class="product" data-category="${escapeHtml(p.category || 'arte')}" data-db-product="true"><div class="cover">${escapeHtml((p.title || 'NZINGA').slice(0,22))}</div><div class="product-info"><span class="tag">${escapeHtml(String(p.category || 'Digital').toUpperCase())}</span><h2>${escapeHtml(p.title)}</h2><p>${escapeHtml(p.description || 'Recurso digital criado na comunidade Nzinga.')}</p><div class="product-bottom"><span class="price">${money(p.price,p.currency)}</span><button class="buy" type="button" disabled>Em breve</button></div></div></article>`;
    async function loadPublished() { const {data,error}=await sb.from('market_products').select('id,title,description,price,currency,category,image_path').eq('status','published').order('created_at',{ascending:false}); if(error)return; products.querySelectorAll('[data-db-product]').forEach(x=>x.remove()); (data||[]).forEach(p=>products.insertAdjacentHTML('afterbegin',renderProduct(p))); bindFilters(); }
    function bindFilters() { document.querySelectorAll('.filter').forEach(f=>{f.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');const wanted=f.dataset.filter;let visible=0;products.querySelectorAll('.product').forEach(i=>{const show=wanted==='all'||i.dataset.category===wanted;i.style.display=show?'block':'none';if(show)visible++});const empty=document.getElementById('empty');if(empty)empty.style.display=visible?'none':'block';}}); }
    const box=document.createElement('div');box.style.cssText='margin-top:18px;border:2px solid #fff;padding:22px;background:#181818;display:none;';box.innerHTML='<h3 style="margin-top:0">Publicar no Market</h3><p>Envia o teu recurso para revisão. Ele ficará como rascunho até ser aprovado pela Nzinga.</p><form id="marketForm" style="display:grid;gap:10px"><input name="title" placeholder="Nome do produto" maxlength="120" required style="padding:12px"><textarea name="description" placeholder="Descrição" maxlength="1000" style="padding:12px;min-height:80px"></textarea><select name="category" style="padding:12px"><option value="template">Template</option><option value="documento">Documento</option><option value="ebook">Ebook</option><option value="arte">Arte</option><option value="Digital">Outro digital</option></select><input name="price" type="number" min="0" step="0.01" placeholder="Preço em AOA" required style="padding:12px"><button class="button button-main" type="submit">Enviar para revisão →</button><p id="marketStatus" style="min-height:1.3em;margin:0"></p></form>';sell.appendChild(box);
    const action=sell.querySelector('.button-main');if(action){action.removeAttribute('href');action.textContent='Quero participar →';action.style.cursor='pointer';action.onclick=async()=>{const {data:{session}}=await sb.auth.getSession();if(!session){location.href='minha-nzinga.html';return}box.style.display=box.style.display==='none'?'block':'none'}}
    box.querySelector('#marketForm').onsubmit=async e=>{e.preventDefault();const status=box.querySelector('#marketStatus');const {data:{session}}=await sb.auth.getSession();if(!session){status.textContent='Entra na tua conta primeiro.';return}const fd=new FormData(e.target);const {error}=await sb.from('market_products').insert({creator_id:session.user.id,title:String(fd.get('title')||'').trim(),description:String(fd.get('description')||'').trim(),category:String(fd.get('category')||'Digital'),price:Number(fd.get('price')||0),currency:'AOA',status:'draft'});status.textContent=error?'Não foi possível enviar agora.':'Enviado para revisão. O produto ainda não está público.';if(!error)e.target.reset()};await loadPublished();
  }

  function initMinhaNzingaAuth() {
    const form=document.getElementById('authForm');if(!form||form.dataset.nzingaAuthReady==='1')return;form.dataset.nzingaAuthReady='1';const email=document.getElementById('authEmail');const password=document.getElementById('authPassword');const status=document.getElementById('authStatus');let signup=document.getElementById('signupBtn');
    if(!signup){signup=document.createElement('button');signup.id='signupBtn';signup.type='button';signup.className='button';signup.textContent='Criar conta';form.appendChild(signup)}
    const message=(text,error=false)=>{if(status){status.textContent=text;status.style.color=error?'#ffb3b3':'#fff';status.style.display='block'}};
    const showAccountCreated=(confirmed=false)=>{if(!status)return;status.innerHTML=confirmed?'<strong>Conta criada e e-mail confirmado.</strong><br>A tua sessão foi activada. A abrir a Minha Nzinga…':'<strong>Conta criada com sucesso.</strong><br>Agora verifica o teu e-mail e clica no botão de confirmação. Depois volta a esta página para entrar na tua conta.';status.style.color='#fff';status.style.display='block';status.style.padding='14px 16px';status.style.marginTop='14px';status.style.border='2px solid #fff';status.style.lineHeight='1.55'};
    const getClient=()=>{if(window.supabase&&window.NZINGA_SUPABASE)return window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);throw new Error('O serviço de contas não carregou. Atualiza a página e tenta novamente.')};
    signup.addEventListener('click',async event=>{event.preventDefault();event.stopImmediatePropagation();try{const sb=getClient();const e=(email?.value||'').trim();const p=password?.value||'';if(!e||p.length<6){message('Preenche o e-mail e usa uma palavra-passe com pelo menos 6 caracteres.',true);return}signup.disabled=true;signup.textContent='A criar conta…';message('A criar a tua conta…');const {data,error}=await sb.auth.signUp({email:e,password:p,options:{emailRedirectTo:location.origin+'/minha-nzinga.html'}});if(error)throw error;if(data?.session){showAccountCreated(true);setTimeout(()=>location.reload(),1200)}else{showAccountCreated(false);signup.textContent='E-mail enviado ✓';signup.disabled=true}},true);
    form.addEventListener('submit',async event=>{event.preventDefault();event.stopImmediatePropagation();try{const sb=getClient();const e=(email?.value||'').trim();const p=password?.value||'';if(!e||p.length<6){message('Preenche o e-mail e usa uma palavra-passe com pelo menos 6 caracteres.',true);return}const button=form.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent='A entrar…'}message('A verificar a tua conta…');const {data,error}=await sb.auth.signInWithPassword({email:e,password:p});if(error)throw error;if(!data?.session)throw new Error('A conta foi encontrada, mas a sessão não foi criada. Confirma o teu e-mail primeiro.');message('Entrada confirmada. A abrir a tua Minha Nzinga…');setTimeout(()=>location.reload(),500)}catch(err){const raw=String(err?.message||'');const friendly=/not confirmed|email not confirmed/i.test(raw)?'O e-mail ainda não foi confirmado. Abre a mensagem da Nzinga no teu e-mail e confirma a conta primeiro.':raw||'Não foi possível entrar agora. Confirma o e-mail e os dados.';message(friendly,true)}finally{const button=form.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent='Entrar'}}},true);
    try{const sb=getClient();sb.auth.getSession().then(({data})=>{if(data?.session&&status){status.innerHTML='<strong>Conta confirmada.</strong><br>A tua sessão está activa. A carregar a Minha Nzinga…';status.style.display='block';setTimeout(()=>location.reload(),350)}})}catch{}
  }

  function initMinhaNzingaProfileFix(){
    if(location.pathname.split('/').pop()!=='minha-nzinga.html') return;
    if(!window.supabase || !window.NZINGA_SUPABASE) return;
    const sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    const $=id=>document.getElementById(id); const status=()=>$('profileStatus'); const setStatus=(text,error=false)=>{const el=status();if(!el)return;el.textContent=text;el.style.color=error?'#b00020':''};
    const getSession=async()=>{const {data,error}=await sb.auth.getSession();if(error)throw error;if(!data?.session)throw new Error('Sessão expirada. Entra novamente.');return data.session};
    const saveProfile=async()=>{try{const session=await getSession();const name=($('profileName')?.value||'').trim();const contact=($('profileContact')?.value||'').trim();const {data,error}=await sb.from('profiles').upsert({id:session.user.id,name,contact,updated_at:new Date().toISOString()},{onConflict:'id'}).select('id,name,contact').single();if(error)throw error;if($('profileTitle'))$('profileTitle').textContent='Olá, '+(data?.name||session.user.email?.split('@')[0]||'Nzinga')+'.';setStatus('✓ Perfil guardado com sucesso.')}catch(err){console.error('Nzinga profile save:',err);setStatus('Não foi possível guardar: '+(err?.message||'erro desconhecido'),true)}};
    const uploadAvatar=async(file)=>{try{const session=await getSession();if(!file)return;if(!file.type.startsWith('image/'))throw new Error('Escolhe uma imagem válida.');if(file.size>6*1024*1024)throw new Error('A foto deve ter no máximo 6 MB.');const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';const path=session.user.id+'/'+Date.now()+'.'+ext;const {error:uploadError}=await sb.storage.from('profile-photos').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false});if(uploadError)throw uploadError;const {error:profileError}=await sb.from('profiles').upsert({id:session.user.id,avatar_path:path,updated_at:new Date().toISOString()},{onConflict:'id'});if(profileError){await sb.storage.from('profile-photos').remove([path]);throw profileError}const url=sb.storage.from('profile-photos').getPublicUrl(path).data.publicUrl;if($('avatarImage')){$('avatarImage').src=url;$('avatarImage').classList.remove('hidden')}if($('avatarInitials'))$('avatarInitials').classList.add('hidden');setStatus('✓ Foto de perfil atualizada.')}catch(err){console.error('Nzinga avatar upload:',err);setStatus('Não foi possível guardar a foto: '+(err?.message||'erro desconhecido'),true)}};
    const bind=()=>{const form=$('profileForm');if(form&&!form.dataset.profileFixReady){form.dataset.profileFixReady='1';form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();saveProfile()},true)}const input=$('avatarInput');if(input&&!input.dataset.profileFixReady){input.dataset.profileFixReady='1';input.addEventListener('change',e=>{e.stopImmediatePropagation();uploadAvatar(e.target.files?.[0]);e.target.value=''},true)}};
    bind();setTimeout(bind,250);
  }
  if(path==='minha-nzinga.html') setTimeout(initMinhaNzingaProfileFix,0);
  requestAnimationFrame(()=>document.documentElement.classList.add('ready'));
})();