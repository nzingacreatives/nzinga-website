window.NZINGA_SUPABASE = {
  url: 'https://hvfowjaliddrxnentkkb.supabase.co',
  publishableKey: 'sb_publishable_c1LN2ZBksf2HCfdBucEleQ_H9hMTJcd'
};
(function(){
  function load(src){var s=document.createElement('script');s.src=src;s.async=false;document.head.appendChild(s)}
  function boot(){
    load('site-visual-fix.js?v=3');
    if(location.pathname.endsWith('/index.html')||location.pathname.endsWith('/')||location.pathname==='')load('public-reviews.js?v=1');
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var box=document.getElementById('authBox'),head=document.getElementById('profileHead'),grid=document.getElementById('accountGrid');
    if(location.pathname.endsWith('/admin.html')||location.pathname.endsWith('admin.html')){
      ['admin-orders.js?v=1','admin-users.js?v=1','admin-reviews.js?v=1','admin-team.js?v=1','admin-audit.js?v=1','admin-ui-fix.js?v=4','admin-theme-fix.js?v=1','admin-center.js?v=1','admin-overview.js?v=1','admin-final-fix.js?v=2','admin-team-light-fix.js?v=1','admin-stage-cleanup.js?v=1','admin-team-fix.js?v=1','admin-audit-fix.js?v=1','admin-orders-fix.js?v=1','admin-theme-clean.js?v=1','admin-messages.js?v=1'].forEach(load);
    }
    if(location.pathname.endsWith('/checkout.html')||location.pathname.endsWith('checkout.html'))load('checkout-fix.js?v=1');
    if(!box||!head||!grid)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    document.addEventListener('click',function(event){var target=event.target&&event.target.closest?event.target.closest('#logoutBtn'):null;if(!target)return;event.preventDefault();event.stopImmediatePropagation();target.disabled=true;target.textContent='A sair…';sb.auth.signOut({scope:'local'}).then(function(result){if(result&&result.error)throw result.error;try{Object.keys(localStorage).forEach(function(key){if(key.indexOf('sb-')===0||key.indexOf('supabase')!==-1)localStorage.removeItem(key)})}catch(e){}window.location.replace('minha-nzinga.html?logged_out=1')}).catch(function(error){console.error('Nzinga logout error:',error);target.disabled=false;target.textContent='Sair da conta';alert('Não foi possível terminar a sessão. Tenta novamente.')})},true);
    sb.auth.getSession().then(function(result){var session=result&&result.data&&result.data.session;if(!session)return;box.classList.add('hidden');head.classList.remove('hidden');grid.classList.remove('hidden');var email=document.getElementById('profileEmail');if(email)email.textContent=session.user.email||'';var title=document.getElementById('profileTitle');if(title)title.textContent='Olá, '+((session.user.email||'Nzinga').split('@')[0])+'.';sb.from('admin_users').select('role').eq('user_id',session.user.id).maybeSingle().then(function(adminResult){if(adminResult&&adminResult.error)return;if(!adminResult||!adminResult.data)return;if(document.getElementById('adminPanelBtn'))return;var logout=document.getElementById('logoutBtn'),link=document.createElement('a');link.id='adminPanelBtn';link.href='admin.html';link.className='button';link.textContent='Painel Admin →';link.style.marginTop='10px';if(logout&&logout.parentElement)logout.parentElement.insertBefore(link,logout);else head.appendChild(link)})});
    setTimeout(function(){if(location.pathname.endsWith('/minha-nzinga.html')||location.pathname.endsWith('minha-nzinga.html')){load('minha-nzinga-fix.js?v=2');load('support-user.js?v=1');load('account-enhancements.js?v=1')}},800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
