/* Nzinga Admin — centralização das áreas e ações destrutivas. */
(function(){
  'use strict';
  function start(){
    if(!/admin\.html$/i.test(location.pathname)||!window.supabase||!window.NZINGA_SUPABASE)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    var nav=document.querySelector('.side-nav');
    if(!nav||document.getElementById('nz-admin-center-ready'))return;
    var marker=document.createElement('span');marker.id='nz-admin-center-ready';marker.hidden=true;document.body.appendChild(marker);
    addStyle();
    setTimeout(function(){normalizeNav();watchPanels()},700);

    function normalizeNav(){
      var audit=document.getElementById('auditTab');if(audit)audit.innerHTML='<span>♧</span> Atividades';
      var team=document.querySelector('.side-nav button[data-tab="team"]');if(team)team.innerHTML='<span>♜</span> Equipa';
      var buttons=[].slice.call(nav.querySelectorAll('button'));
      buttons.forEach(function(b){b.title=b.textContent.trim()});
    }
    function addStyle(){
      var s=document.createElement('style');s.id='nzinga-admin-center-style';s.textContent=''
      +'.side-nav button[data-tab="team"],.side-nav button[data-tab="audit"]{font-weight:700}'
      +'.admin-card .nz-admin-delete{border:1px solid #c91510!important;background:transparent!important;color:inherit!important}'
      +'.nz-admin-delete:focus-visible,.admin-actions button:focus-visible,.admin-actions select:focus-visible{outline:3px solid #f7c515;outline-offset:2px}'
      +'body.admin-theme-light .nz-admin-delete{color:#9e0d16!important;border-color:#c91510!important}'
      +'body.admin-theme-dark .nz-admin-delete{color:#fff!important;border-color:#c91510!important}'
      +'.nz-admin-danger-note{font-size:.72rem;opacity:.58;margin-top:6px}'
      +'@media(max-width:650px){.side-nav button{flex:0 0 auto}.nz-admin-delete{width:100%}}';document.head.appendChild(s);
    }
    function watchPanels(){
      ['panel-products','panel-orders','panel-reviews','panel-users'].forEach(function(id){var p=document.getElementById(id);if(!p)return;new MutationObserver(function(){setTimeout(function(){enhance(id,p)},80)}).observe(p,{childList:true,subtree:true});setTimeout(function(){enhance(id,p)},1200)});
    }
    function enhance(id,panel){
      if(id==='panel-products')addDelete(panel,'product');
      if(id==='panel-orders')addDelete(panel,'order');
      if(id==='panel-reviews')addDelete(panel,'review');
      if(id==='panel-users')addDelete(panel,'user');
      normalizeNav();
    }
    function addDelete(panel,type){
      panel.querySelectorAll('.admin-card').forEach(function(card){
        if(card.querySelector('.nz-admin-delete'))return;
        var id=null;
        if(type==='product'){var e=card.querySelector('[data-edit]');id=e&&e.dataset.edit}
        if(type==='order'){var e2=card.querySelector('[data-order]');id=e2&&e2.dataset.order}
        if(type==='review'){var d=card.querySelector('[data-review-details]');if(d){var text=card.querySelector('.review-id');id=text?text.textContent.replace(/^.*?:\\s*/,'').trim():null}}
        if(type==='user')id=card.dataset.userId;
        if(!id)return;
        var actions=card.querySelector('.admin-actions');if(!actions)return;
        var b=document.createElement('button');b.type='button';b.className='nz-admin-delete';b.textContent=type==='product'?'Eliminar produto':type==='order'?'Eliminar pedido':type==='review'?'Eliminar avaliação':'Eliminar utilizador';
        b.addEventListener('click',function(){remove(type,id,b)});actions.appendChild(b);
      });
    }
    async function remove(type,id,button){
      var labels={product:'produto',order:'pedido',review:'avaliação',user:'utilizador'};
      if(!confirm('Eliminar este '+labels[type]+' permanentemente? Esta ação não pode ser desfeita.'))return;
      button.disabled=true;button.textContent='A eliminar…';
      var table={product:'market_products',order:'orders',review:'reviews',user:'profiles'}[type];
      var result=await sb.from(table).delete().eq('id',id);
      if(result.error){button.disabled=false;button.textContent='Eliminar '+labels[type];alert('Não foi possível eliminar: '+result.error.message);return}
      await audit(type,id);
      location.reload();
    }
    async function audit(type,id){
      try{var r=await sb.auth.getSession(),u=r&&r.data&&r.data.session?r.data.session.user:null;if(!u)return;var actions={product:'market.product_deleted',order:'orders.order_deleted',review:'reviews.deleted',user:'users.profile_deleted'};var tables={product:'market_products',order:'orders',review:'reviews',user:'profiles'};await sb.from('admin_audit_logs').insert({actor_id:u.id,action:actions[type],target_table:tables[type],target_id:id,details:{source:'admin-center'}})}catch(e){console.warn('Audit:',e)}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
