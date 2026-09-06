(()=>{'use strict';
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
ready(async()=>{
 const ids=['profileForm','profileName','profileContact','profileStatus','profileTitle','profileEmail','avatarInput','avatarImage','avatarInitials','removeAvatar'];
 if(!ids.some(id=>document.getElementById(id)))return;
 const cfg=window.NZINGA_SUPABASE;
 if(!window.supabase||!cfg?.url||!cfg?.publishableKey)return;
 const sb=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const $=id=>document.getElementById(id);
 let user=null;
 const initials=v=>(String(v||'N').trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2)||'N').toUpperCase();
 const status=(msg,bad=false)=>{const el=$('profileStatus');if(el){el.textContent=msg;el.style.color=bad?'#b00020':''}};
 const showAvatar=(url,name)=>{if($('avatarInitials'))$('avatarInitials').textContent=initials(name);if(url){$('avatarImage').src=url+'?v='+Date.now();$('avatarImage').classList.remove('hidden');$('avatarInitials').classList.add('hidden')}else{$('avatarImage').removeAttribute('src');$('avatarImage').classList.add('hidden');$('avatarInitials').classList.remove('hidden')}};
 async function getUser(){const r=await sb.auth.getUser();return r?.data?.user||null}
 async function refresh(){
  user=await getUser(); if(!user)return;
  const r=await sb.from('profiles').select('name,contact,avatar_path').eq('id',user.id).maybeSingle();
  if(r.error){status('Não foi possível carregar o perfil: '+r.error.message,true);return}
  const p=r.data||{};
  if($('profileEmail'))$('profileEmail').textContent=user.email||'';
  if($('profileName'))$('profileName').value=p.name||'';
  if($('profileContact'))$('profileContact').value=p.contact||'';
  if($('profileTitle'))$('profileTitle').textContent='Olá, '+(p.name||user.email?.split('@')[0]||'Nzinga')+'.';
  let url=null;if(p.avatar_path)url=sb.storage.from('profile-photos').getPublicUrl(p.avatar_path).data.publicUrl;
  showAvatar(url,p.name||user.email);
 }
 const form=$('profileForm');
 if(form)form.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();if(!user)user=await getUser();if(!user){status('A sessão expirou. Entra novamente.',true);return}const name=$('profileName').value.trim(),contact=$('profileContact').value.trim();status('A guardar…');const r=await sb.from('profiles').upsert({id:user.id,name,contact,updated_at:new Date().toISOString()},{onConflict:'id'});if(r.error){status('Erro ao guardar: '+r.error.message,true);return}if($('profileTitle'))$('profileTitle').textContent='Olá, '+(name||user.email?.split('@')[0]||'Nzinga')+'.';status('Perfil guardado com sucesso.');},{capture:true});
 const input=$('avatarInput');
 if(input)input.addEventListener('change',async e=>{e.preventDefault();e.stopImmediatePropagation();if(!user)user=await getUser();const file=e.target.files?.[0];if(!user||!file)return;if(!file.type.startsWith('image/')){status('Escolhe uma imagem válida.',true);return}if(file.size>6*1024*1024){status('A foto deve ter no máximo 6 MB.',true);return}status('A enviar foto…');const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';const path=user.id+'/'+Date.now()+'.'+ext;const up=await sb.storage.from('profile-photos').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false});if(up.error){status('Erro ao enviar foto: '+up.error.message,true);return}const old=await sb.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle();const pr=await sb.from('profiles').upsert({id:user.id,avatar_path:path,updated_at:new Date().toISOString()},{onConflict:'id'});if(pr.error){await sb.storage.from('profile-photos').remove([path]);status('Erro ao guardar a foto: '+pr.error.message,true);return}if(old.data?.avatar_path&&old.data.avatar_path!==path)await sb.storage.from('profile-photos').remove([old.data.avatar_path]);showAvatar(sb.storage.from('profile-photos').getPublicUrl(path).data.publicUrl,$('profileName').value);status('Foto de perfil atualizada.');input.value='';},{capture:true});
 const remove=$('removeAvatar');
 if(remove)remove.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();if(!user)user=await getUser();if(!user)return;status('A remover foto…');const r=await sb.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle();if(r.error){status('Erro ao localizar a foto: '+r.error.message,true);return}if(r.data?.avatar_path)await sb.storage.from('profile-photos').remove([r.data.avatar_path]);const pr=await sb.from('profiles').upsert({id:user.id,avatar_path:null,updated_at:new Date().toISOString()},{onConflict:'id'});if(pr.error){status('Erro ao remover: '+pr.error.message,true);return}showAvatar(null,$('profileName').value);status('Foto removida.');},{capture:true});
 await refresh();
});
})();