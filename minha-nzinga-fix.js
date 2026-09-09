/* Nzinga Minha — profile photo crop, clearer feedback and motion polish. */
(function(){
'use strict';
function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn()}
ready(function(){
  var cfg=window.NZINGA_SUPABASE;
  if(!window.supabase||!cfg?.url||!cfg?.publishableKey)return;
  var sb=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  var $=function(id){return document.getElementById(id)};
  var stars=$('stars'),save=$('saveReview'),text=$('reviewText'),status=$('reviewStatus');
  if(stars&&save&&text){
    var selected=0;
    function esc(v){return String(v??'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function paint(){stars.querySelectorAll('button').forEach(function(b){var n=Number(b.dataset.star);b.classList.toggle('on',n<=selected);b.setAttribute('aria-pressed',n===selected?'true':'false')})}
    var fresh=stars.cloneNode(true);stars.replaceWith(fresh);stars=fresh;
    stars.querySelectorAll('button').forEach(function(b){b.type='button';b.addEventListener('click',function(){selected=Number(b.dataset.star)||0;paint()})});paint();
    save.onclick=async function(){
      var session=(await sb.auth.getSession()).data?.session;if(!session){if(status)status.textContent='Entra na tua conta para avaliar.';return}
      if(!selected){if(status)status.textContent='Escolhe uma avaliação de 1 a 5 estrelas.';return}
      var comment=text.value.trim();save.disabled=true;if(status)status.textContent='A enviar avaliação…';
      var r=await sb.from('reviews').insert({user_id:session.user.id,stars:selected,text:comment,status:'pending'});
      if(r.error){if(status)status.textContent='Não foi possível enviar: '+r.error.message;save.disabled=false;return}
      text.value='';selected=0;paint();if(status)status.textContent='Avaliação enviada. Obrigado.';save.disabled=false;await loadMyReviews(session.user.id);
    };
    async function loadMyReviews(uid){
      var box=$('reviewList');if(!box)return;var r=await sb.from('reviews').select('id,stars,text,created_at,status').eq('user_id',uid).order('created_at',{ascending:false});
      if(r.error){box.innerHTML='<div class="empty">Não foi possível carregar as avaliações: '+esc(r.error.message)+'</div>';return}
      var list=r.data||[],count=$('reviewCount');if(count)count.textContent=list.length;
      box.innerHTML=list.length?list.map(function(x){var n=Math.max(0,Math.min(5,Number(x.stars)||0));return '<article class="review-item"><div class="review-stars" aria-label="'+n+' de 5 estrelas">'+('★'.repeat(n))+('☆'.repeat(5-n))+'</div><p>'+esc(x.text||'')+'</p><small>'+new Date(x.created_at).toLocaleDateString('pt-AO')+' · '+esc(x.status||'pending')+'</small></article>'}).join(''):'<p style="color:#999">Ainda não tens avaliações.</p>';
    }
    sb.auth.getSession().then(function(r){if(r.data?.session)loadMyReviews(r.data.session.user.id)});
    var form=$('authForm'),authStatus=$('authStatus');
    if(form&&authStatus){var signup=$('signupBtn');if(signup)signup.addEventListener('click',function(){setTimeout(function(){var m=authStatus.textContent||'';if(/already registered|already exists|user already/i.test(m))authStatus.textContent='Este e-mail já tem uma conta. Usa Entrar em vez de Criar conta.';else if(/email.*confirm|confirm.*email/i.test(m))authStatus.textContent='Conta criada. Confirma o e-mail recebido e depois entra na tua conta.'},50)})}
  }

  /* Photo cropper: square output with zoom + drag, then uploads only the cropped result. */
  var input=$('avatarInput'),profileStatus=$('profileStatus'),remove=$('removeAvatar');
  if(input){
    var style=document.createElement('style');style.textContent=`
      .nz-crop-overlay{position:fixed;inset:0;z-index:12000;background:rgba(8,10,16,.82);display:flex;align-items:center;justify-content:center;padding:18px}
      .nz-crop-box{width:min(520px,100%);background:#fff;color:#111;border:3px solid #111;border-radius:22px;padding:20px;box-shadow:10px 10px 0 #c91510}
      .nz-crop-box h2{margin:0 0 6px;font-family:'Playfair Display',serif;font-size:2rem}.nz-crop-box p{margin:0 0 14px;color:#444}
      .nz-crop-stage{width:min(390px,82vw);height:min(390px,82vw);margin:0 auto 16px;background:#111;border:3px solid #111;border-radius:18px;overflow:hidden;position:relative;touch-action:none;cursor:grab}
      .nz-crop-stage:after{content:'';position:absolute;inset:0;border:2px solid rgba(255,255,255,.75);border-radius:16px;pointer-events:none;box-shadow:inset 0 0 0 999px rgba(0,0,0,.08)}
      .nz-crop-img{position:absolute;left:50%;top:50%;max-width:none;user-select:none;touch-action:none;transform-origin:center center;pointer-events:none}
      .nz-crop-controls{display:grid;gap:8px}.nz-crop-controls label{font-weight:800;font-size:.85rem}.nz-crop-controls input{width:100%}
      .nz-crop-actions{display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:15px}.nz-crop-actions button{border:2px solid #111;border-radius:10px;padding:10px 14px;font:inherit;font-weight:800;cursor:pointer}.nz-crop-cancel{background:#fff;color:#111}.nz-crop-confirm{background:#c91510;color:#fff}
      @media(prefers-reduced-motion:no-preference){.nz-crop-box{animation:nzCropIn .22s ease}@keyframes nzCropIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}}
    `;document.head.appendChild(style);
    var uploading=false;
    function makeCrop(file){return new Promise(function(resolve,reject){
      var url=URL.createObjectURL(file),img=new Image();img.onload=function(){
        var overlay=document.createElement('div');overlay.className='nz-crop-overlay';overlay.innerHTML='<section class="nz-crop-box" role="dialog" aria-modal="true" aria-label="Cortar foto de perfil"><h2>Ajustar foto.</h2><p>Arrasta a imagem e aproxima para enquadrar o rosto.</p><div class="nz-crop-stage"><img class="nz-crop-img" draggable="false"></div><div class="nz-crop-controls"><label for="nzCropZoom">Zoom</label><input id="nzCropZoom" type="range" min="1" max="3" step="0.01" value="1"></div><div class="nz-crop-actions"><button type="button" class="nz-crop-cancel">Cancelar</button><button type="button" class="nz-crop-confirm">Usar esta foto →</button></div></section>';document.body.appendChild(overlay);
        var stage=overlay.querySelector('.nz-crop-stage'),view=overlay.querySelector('.nz-crop-img'),zoom=overlay.querySelector('#nzCropZoom');view.src=url;
        var baseScale=Math.max(stage.clientWidth/img.naturalWidth,stage.clientHeight/img.naturalHeight),scale=baseScale,offsetX=0,offsetY=0;
        function render(){view.style.width=img.naturalWidth*scale+'px';view.style.height=img.naturalHeight*scale+'px';view.style.transform='translate(calc(-50% + '+offsetX+'px),calc(-50% + '+offsetY+'px))'}
        render();
        zoom.oninput=function(){var old=scale;scale=baseScale*Number(zoom.value);var ratio=scale/old;offsetX*=ratio;offsetY*=ratio;render()};
        var dragging=false,sx=0,sy=0,ox=0,oy=0;
        stage.addEventListener('pointerdown',function(e){dragging=true;sx=e.clientX;sy=e.clientY;ox=offsetX;oy=offsetY;stage.setPointerCapture(e.pointerId);stage.style.cursor='grabbing'});
        stage.addEventListener('pointermove',function(e){if(!dragging)return;offsetX=ox+e.clientX-sx;offsetY=oy+e.clientY-sy;render()});
        stage.addEventListener('pointerup',function(){dragging=false;stage.style.cursor='grab'});stage.addEventListener('pointercancel',function(){dragging=false;stage.style.cursor='grab'});
        function close(){URL.revokeObjectURL(url);overlay.remove()}
        overlay.querySelector('.nz-crop-cancel').onclick=function(){close();reject(new Error('cancelled'))};
        overlay.querySelector('.nz-crop-confirm').onclick=function(){
          var canvas=document.createElement('canvas'),size=600;canvas.width=size;canvas.height=size;var ctx=canvas.getContext('2d');
          var sourceScale=scale;var sx=(stage.clientWidth/2-(stage.clientWidth/2+offsetX))/sourceScale;var sy=(stage.clientHeight/2-(stage.clientHeight/2+offsetY))/sourceScale;var sw=stage.clientWidth/sourceScale,sh=stage.clientHeight/sourceScale;
          ctx.drawImage(img,sx,sy,sw,sh,0,0,size,size);canvas.toBlob(function(blob){close();blob?resolve(new File([blob],'perfil.jpg',{type:'image/jpeg',lastModified:Date.now()})):reject(new Error('crop failed'))},'image/jpeg',.9);
        };
      };img.onerror=function(){URL.revokeObjectURL(url);reject(new Error('image failed'))};img.src=url;
    })}
    async function uploadCropped(file){
      if(uploading)return;uploading=true;if(profileStatus)profileStatus.textContent='A preparar a foto…';
      try{
        var session=(await sb.auth.getSession()).data?.session;if(!session){if(profileStatus)profileStatus.textContent='Entra na tua conta primeiro.';return}
        var cropped=await makeCrop(file);if(!cropped)return;
        if(profileStatus)profileStatus.textContent='A guardar a foto…';
        var path=session.user.id+'/'+Date.now()+'.jpg';var r=await sb.storage.from('profile-photos').upload(path,cropped,{contentType:'image/jpeg',cacheControl:'3600',upsert:false});
        if(r.error){if(profileStatus)profileStatus.textContent='Não foi possível enviar a foto.';return}
        var p=await sb.from('profiles').upsert({id:session.user.id,avatar_path:path,updated_at:new Date().toISOString()});
        if(p.error){if(profileStatus)profileStatus.textContent='Foto enviada, mas o perfil não foi atualizado.';return}
        var publicUrl=sb.storage.from('profile-photos').getPublicUrl(path).data.publicUrl+'?v='+Date.now();var avatar=$('avatarImage'),initials=$('avatarInitials');if(avatar){avatar.src=publicUrl;avatar.classList.remove('hidden')}if(initials)initials.classList.add('hidden');if(profileStatus)profileStatus.textContent='Foto de perfil atualizada.';
      }catch(e){if(e.message!=='cancelled'&&profileStatus)profileStatus.textContent='Não foi possível preparar a foto.'}finally{uploading=false;input.value=''}
    }
    input.onchange=function(e){var file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){if(profileStatus)profileStatus.textContent='Escolhe uma imagem válida.';return}if(file.size>12*1024*1024){if(profileStatus)profileStatus.textContent='A foto deve ter no máximo 12 MB.';return}uploadCropped(file)};
  }
  if(remove){remove.onclick=async function(){var session=(await sb.auth.getSession()).data?.session;if(!session)return;var r=await sb.from('profiles').select('avatar_path').eq('id',session.user.id).maybeSingle();if(r.data?.avatar_path)await sb.storage.from('profile-photos').remove([r.data.avatar_path]);await sb.from('profiles').upsert({id:session.user.id,avatar_path:null,updated_at:new Date().toISOString()});var img=$('avatarImage'),ini=$('avatarInitials');if(img){img.removeAttribute('src');img.classList.add('hidden')}if(ini){ini.classList.remove('hidden');ini.textContent='N'}if(profileStatus)profileStatus.textContent='Foto removida.'}}
  var img=$('avatarImage');if(img&&img.src)img.src=img.src+(img.src.indexOf('?')>-1?'&':'?')+'v='+Date.now();
});
})();
