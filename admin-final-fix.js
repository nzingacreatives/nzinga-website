/* Nzinga Admin — actions finais. A navegação é controlada pelo Admin Center. */
(function(){
'use strict';
function start(){
  if(!/admin\.html$/i.test(location.pathname))return;
  if(document.getElementById('nz-admin-final-style'))return;
  var style=document.createElement('style');style.id='nz-admin-final-style';style.textContent=''+
    '.admin-section-tools{padding:14px 20px;border-bottom:1px solid #e5dfd5;display:flex;gap:9px;flex-wrap:wrap;align-items:center;background:#fbf8f1}'+
    '.admin-section-tools input,.admin-section-tools select{padding:10px 11px;border:1px solid #c9c4bb;border-radius:10px;background:#fff;color:#111;font:inherit;min-width:170px}'+
    '.admin-section-tools button{padding:10px 13px;border:1px solid #d6a900;border-radius:10px;background:#f2c400;color:#111;font-weight:900;cursor:pointer}'+
    '.admin-create-form{padding:18px 20px;border-bottom:1px solid #e5dfd5;background:#fff9df;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}'+
    '.admin-create-form input,.admin-create-form textarea,.admin-create-form select{padding:11px;border:1px solid #c9c4bb;border-radius:9px;background:#fff;color:#111;font:inherit}'+
    '.admin-create-form textarea{grid-column:1/-1;min-height:90px;resize:vertical}'+
    '.admin-create-form button{padding:11px 14px;border:1px solid #d6a900;border-radius:9px;background:#f2c400;color:#111;font-weight:900;cursor:pointer}'+
    '.review-pending{border-left:4px solid #f2c400}.review-published{border-left:4px solid #2f9e44}.review-hidden{border-left:4px solid #777}.review-rejected{border-left:4px solid #d71920}'+
    '.nz-admin-delete{background:#d71920!important;color:#fff!important;border-color:#d71920!important;border-radius:10px;padding:9px 12px;cursor:pointer;font-weight:900}'+
    '.admin-actions button:not(.approve):not(.danger):not(.nz-admin-delete){background:#fff;color:#111}'+
    '@media(max-width:650px){.admin-create-form{grid-template-columns:1fr}.admin-create-form textarea{grid-column:auto}}';document.head.appendChild(style);

  function client(){return window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey)}
  function addDeleteButtons(){
    var maps=[['panel-products','[data-edit]','market_products','Eliminar produto'],['panel-orders','[data-order]','orders','Eliminar pedido'],['panel-reviews','[data-review]','reviews','Eliminar avaliação'],['panel-users','[data-user-id]','profiles','Eliminar utilizador']];
    maps.forEach(function(m){var p=document.getElementById(m[0]);if(!p)return;p.querySelectorAll('.admin-card').forEach(function(card){if(card.querySelector('.nz-admin-delete'))return;var ref=card.querySelector(m[1]);if(!ref)return;var id=ref.dataset.edit||ref.dataset.order||ref.dataset.review||ref.dataset.userId;if(!id)return;var actions=card.querySelector('.admin-actions');if(!actions)return;var b=document.createElement('button');b.type='button';b.className='nz-admin-delete';b.textContent=m[3];b.onclick=async function(){if(m[0]==='panel-users'){var s=await client().auth.getSession();if(s.data&&s.data.session&&s.data.session.user&&s.data.session.user.id===id){alert('A tua própria conta administrativa está protegida.');return}}if(!confirm('Eliminar este registo permanentemente? Esta ação não pode ser desfeita.'))return;b.disabled=true;b.textContent='A eliminar…';var r=await client().from(m[2]).delete().eq('id',id);if(r.error){b.disabled=false;b.textContent=m[3];alert('Não foi possível eliminar: '+r.error.message);return}card.remove()};actions.appendChild(b)})});
  }
  ['panel-products','panel-orders','panel-reviews','panel-users'].forEach(function(id){var p=document.getElementById(id);if(p)new MutationObserver(function(){setTimeout(addDeleteButtons,0)}).observe(p,{childList:true,subtree:true})});
  setTimeout(addDeleteButtons,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();