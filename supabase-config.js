window.NZINGA_SUPABASE = {
  url: 'https://hvfowjaliddrxnentkkb.supabase.co',
  publishableKey: 'sb_publishable_c1LN2ZBksf2HCfdBucEleQ_H9hMTJcd'
};

/* Fallback bootstrap: the account page must reveal the signed-in state even
   if its inline authentication handler is not able to finish the transition. */
(function(){
  function boot(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var box=document.getElementById('authBox');
    var head=document.getElementById('profileHead');
    var grid=document.getElementById('accountGrid');
    if(!box||!head||!grid)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    sb.auth.getSession().then(function(result){
      var session=result&&result.data&&result.data.session;
      if(!session)return;
      box.classList.add('hidden');
      head.classList.remove('hidden');
      grid.classList.remove('hidden');
      var email=document.getElementById('profileEmail');
      if(email)email.textContent=session.user.email||'';
      var title=document.getElementById('profileTitle');
      if(title)title.textContent='Olá, '+((session.user.email||'Nzinga').split('@')[0])+'.';
    }).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
