/* Nzinga Checkout — grava o pedido com o esquema real de orders e respeita a política inicial. */
(function(){'use strict';
function start(){
 var btn=document.getElementById('confirm');if(!btn||!window.supabase||!window.NZINGA_SUPABASE)return;
 var current=JSON.parse(localStorage.getItem('nzingaCurrentOrder')||'null');if(!current)return;
 var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey),status=document.getElementById('status'),auth=document.getElementById('authState'),required=document.getElementById('authRequired'),area=document.getElementById('checkoutArea'),success=document.getElementById('success');
 btn.onclick=async function(){var sessionResult=await sb.auth.getSession(),session=sessionResult&&sessionResult.data&&sessionResult.data.session;if(!session){if(required)required.classList.add('show');return}btn.disabled=true;btn.textContent='A guardar pedido…';if(status)status.textContent='';
  var payload={user_id:session.user.id,service:String(current.service||'Projeto Nzinga'),tier:String(current.tier||'Normal'),name:String(current.name||''),contact:String(current.contact||''),idea:String(current.idea||''),status:'Pedido iniciado'};
  var r=await sb.from('orders').insert(payload).select('id,created_at').single();
  if(r.error){console.error('Checkout order:',r.error);if(status)status.textContent='Não foi possível guardar o pedido: '+r.error.message;btn.disabled=false;btn.textContent='Confirmar pedido →';return}
  var local=JSON.parse(localStorage.getItem('nzingaOrders')||'[]'),i=local.findIndex(function(o){return String(o.id)===String(current.id)});if(i>=0){local[i]={...local[i],status:'Pedido iniciado',supabaseId:r.data.id,updatedAt:r.data.created_at};localStorage.setItem('nzingaOrders',JSON.stringify(local))}
  localStorage.setItem('nzingaCurrentOrder',JSON.stringify({...current,status:'Pedido iniciado',supabaseId:r.data.id}));if(area)area.style.display='none';if(success)success.classList.add('show');
 };
 if(auth)auth.textContent='Conta autenticada: '+(JSON.parse(localStorage.getItem('supabase.auth.token')||'null')?.user?.email||'sessão ativa');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,0);
})();
