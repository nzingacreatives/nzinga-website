window.NZINGA_SUPABASE = {
  url: 'https://hvfowjaliddrxnentkkb.supabase.co',
  publishableKey: 'sb_publishable_c1LN2ZBksf2HCfdBucEleQ_H9hMTJcd'
};

/* Account bootstrap + reliable logout/admin controls. */
(function(){
  function boot(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var box=document.getElementById('authBox');
    var head=document.getElementById('profileHead');
    var grid=document.getElementById('accountGrid');

    if(location.pathname.endsWith('/admin.html')||location.pathname.endsWith('admin.html')){
      ['admin-orders.js?v=1','admin-users.js?v=1','admin-reviews.js?v=1'].forEach(function(src){
        var adminScript=document.createElement('script');
        adminScript.src=src;
        adminScript.defer=true;
        document.head.appendChild(adminScript);
      });
    }

    if(!box||!head||!grid)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);

    document.addEventListener('click',function(event){
      var target=event.target&&event.target.closest?event.target.closest('#logoutBtn'):null;
      if(!target)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      target.disabled=true;
      target.textContent='A sair…';
      sb.auth.signOut({scope:'local'}).then(function(result){
        if(result&&result.error)throw result.error;
        try{Object.keys(localStorage).forEach(function(key){if(key.indexOf('sb-')===0||key.indexOf('supabase')!==-1)localStorage.removeItem(key)})}catch(e){}
        window.location.replace('minha-nzinga.html?logged_out=1');
      }).catch(function(error){
        console.error('Nzinga logout error:',error);target.disabled=false;target.textContent='Sair da conta';alert('Não foi possível terminar a sessão. Tenta novamente.');
      });
    },true);

    sb.auth.getSession().then(function(result){
      var session=result&&result.data&&result.data.session;
      if(!session)return;
      box.classList.add('hidden');head.classList.remove('hidden');grid.classList.remove('hidden');
      var email=document.getElementById('profileEmail');if(email)email.textContent=session.user.email||'';
      var title=document.getElementById('profileTitle');if(title)title.textContent='Olá, '+((session.user.email||'Nzinga').split('@')[0])+'.';
      sb.from('admin_users').select('role').eq('user_id',session.user.id).maybeSingle().then(function(adminResult){
        if(adminResult&&adminResult.error){console.warn('Admin check:',adminResult.error);return}
        if(!adminResult||!adminResult.data)return;
        if(document.getElementById('adminPanelBtn'))return;
        var logout=document.getElementById('logoutBtn');var link=document.createElement('a');link.id='adminPanelBtn';link.href='admin.html';link.className='button';link.textContent='Painel Admin →';link.style.marginTop='10px';
        if(logout&&logout.parentElement)logout.parentElement.insertBefore(link,logout);else head.appendChild(link);
      }).catch(function(error){console.warn('Admin check:',error)});
    }).catch(function(error){console.warn('Session bootstrap:',error)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
