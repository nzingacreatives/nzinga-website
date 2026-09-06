/* Nzinga Admin — final cleanup for the first Admin stage. */
(function(){
  'use strict';
  function start(){
    if(!/admin\.html$/i.test(location.pathname))return;
    var h=document.querySelector('.admin-top h1');
    var p=document.querySelector('.admin-top p');
    if(h)h.textContent='Visão geral';
    if(p)p.textContent='Resumo administrativo da Nzinga Creatives.';
    var panel=document.getElementById('panel-orders');
    if(!panel)return;
    function add(){
      panel.querySelectorAll('.admin-card').forEach(function(card){
        var form=card.querySelector('form[data-order]');
        if(!form||card.querySelector('.nz-order-delete'))return;
        var id=form.dataset.order;
        var b=document.createElement('button');
        b.type='button';b.className='nz-order-delete';b.textContent='Eliminar pedido';
        b.onclick=async function(){
          if(!confirm('Eliminar este pedido permanentemente? Esta ação não pode ser desfeita.'))return;
          b.disabled=true;b.textContent='A eliminar…';
          var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
          var r=await sb.from('orders').delete().eq('id',id);
          if(r.error){b.disabled=false;b.textContent='Eliminar pedido';alert('Não foi possível eliminar: '+r.error.message);return}
          card.remove();
        };
        form.appendChild(b);
      });
    }
    var s=document.createElement('style');s.textContent='.nz-order-delete{background:#fff!important;color:#a30f0a!important;border:1px solid #c91510!important;padding:9px 12px;border-radius:10px;cursor:pointer;font-weight:700}body.admin-theme-dark .nz-order-delete{background:#171717!important;color:#fff!important;border-color:#c91510!important}';document.head.appendChild(s);
    new MutationObserver(add).observe(panel,{childList:true,subtree:true});
    setTimeout(add,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
