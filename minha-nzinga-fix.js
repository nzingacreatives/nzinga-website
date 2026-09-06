/* Nzinga Minha — fix for editable ratings, profile avatars and clearer auth errors. */
(function(){
  'use strict';
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn()}
  ready(function(){
    var cfg=window.NZINGA_SUPABASE;
    if(!window.supabase||!cfg?.url||!cfg?.publishableKey)return;
    var sb=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    var $=function(id){return document.getElementById(id)};
    var stars=$('stars'),save=$('saveReview'),text=$('reviewText'),status=$('reviewStatus');
    if(!stars||!save||!text)return;
    var selected=0;
    function esc(v){return String(v??'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function paint(){stars.querySelectorAll('button').forEach(function(b){var n=Number(b.dataset.star);b.classList.toggle('on',n<=selected);b.setAttribute('aria-pressed',n===selected?'true':'false')})}
    function bindStars(){
      var fresh=stars.cloneNode(true);stars.replaceWith(fresh);stars=fresh;
      stars.querySelectorAll('button').forEach(function(b){b.type='button';b.addEventListener('click',function(){selected=Number(b.dataset.star)||0;paint()})});
      paint();
    }
    bindStars();
    save.onclick=async function(){
      var session=(await sb.auth.getSession()).data?.session;
      if(!session){if(status)status.textContent='Entra na tua conta para avaliar.';return}
      if(!selected){if(status)status.textContent='Escolhe uma avaliação de 1 a 5 estrelas.';return}
      var comment=text.value.trim();
      save.disabled=true;
      if(status)status.textContent='A enviar avaliação…';
      var r=await sb.from('reviews').insert({user_id:session.user.id,stars:selected,text:comment,status:'pending'});
      if(r.error){if(status)status.textContent='Não foi possível enviar: '+r.error.message;save.disabled=false;return}
      text.value='';selected=0;paint();if(status)status.textContent='Avaliação enviada. Obrigado.';save.disabled=false;await loadMyReviews(session.user.id);
    };
    async function loadMyReviews(uid){
      var box=$('reviewList');if(!box)return;
      var r=await sb.from('reviews').select('id,stars,text,created_at,status').eq('user_id',uid).order('created_at',{ascending:false});
      if(r.error){box.innerHTML='<div class="empty">Não foi possível carregar as avaliações: '+esc(r.error.message)+'</div>';return}
      var list=r.data||[];var count=$('reviewCount');if(count)count.textContent=list.length;
      box.innerHTML=list.length?list.map(function(x){var n=Math.max(0,Math.min(5,Number(x.stars)||0));return '<article class="review-item"><div class="review-stars" aria-label="'+n+' de 5 estrelas">'+('★'.repeat(n))+('☆'.repeat(5-n))+'</div><p>'+esc(x.text||'')+'</p><small>'+new Date(x.created_at).toLocaleDateString('pt-AO')+' · '+esc(x.status||'pending')+'</small></article>'}).join(''):'<p style="color:#999">Ainda não tens avaliações.</p>';
    }
    sb.auth.getSession().then(function(r){if(r.data?.session)loadMyReviews(r.data.session.user.id)});
    var form=$('authForm'),authStatus=$('authStatus');
    if(form&&authStatus){
      var translate=function(message){
        var m=String(message||'');
        if(/already registered|already exists|user already/i.test(m))return 'Este e-mail já tem uma conta. Usa Entrar em vez de Criar conta.';
        if(/email.*confirm|confirm.*email/i.test(m))return 'Conta criada. Confirma o e-mail recebido e depois entra na tua conta.';
        if(/password/i.test(m)&&/6|short|length/i.test(m))return 'A palavra-passe deve ter pelo menos 6 caracteres.';
        return m;
      };
      var signup=$('signupBtn');if(signup)signup.addEventListener('click',function(){setTimeout(function(){if(authStatus.textContent)authStatus.textContent=translate(authStatus.textContent)},50)});
    }
    var img=$('avatarImage');
    if(img&&img.src){img.src=img.src+(img.src.indexOf('?')>-1?'&':'?')+'v='+Date.now()}
  });
})();
