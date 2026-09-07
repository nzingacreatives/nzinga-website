(()=>{'use strict';
function boot(){
 const ordersEl=document.getElementById('orders'),countEl=document.getElementById('orderCount'),activeEl=document.getElementById('activeCount');
 const cfg=window.NZINGA_SUPABASE;if(!ordersEl||!cfg||!window.supabase)return;
 const sb=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true}});
 const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
 async function render(){
  const {data:{user}}=await sb.auth.getUser();if(!user)return;
  const r=await sb.from('orders').select('id,service,tier,idea,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false});
  if(r.error){console.error('Nzinga orders:',r.error);return}
  const list=r.data||[]; if(countEl)countEl.textContent=list.length; if(activeEl)activeEl.textContent=list.filter(o=>!['Concluído','Cancelado'].includes(o.status)).length;
  if(!list.length){ordersEl.innerHTML='<div class="empty">Ainda não tens pedidos. Quando começares um projeto em Serviços, ele aparecerá aqui.</div>';return}
  ordersEl.innerHTML=list.map(o=>`<article class="order"><div><h3>${esc(o.service||'Projeto Nzinga')}</h3><p>${esc(o.tier||'Normal')} · ${o.created_at?new Date(o.created_at).toLocaleDateString('pt-AO'):''}<br>${esc((o.idea||'').slice(0,180))}</p></div><span class="status">${esc(o.status||'Pedido iniciado')}</span></article>`).join('');
 }
 sb.auth.onAuthStateChange((event)=>{if(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='TOKEN_REFRESHED')setTimeout(render,50)});render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();