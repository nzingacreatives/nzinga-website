/* Nzinga Admin — organização final sem criar uma segunda navegação. */
(function(){
  'use strict';
  if(!/admin\.html$/i.test(location.pathname)) return;
  function start(){
    var nav=document.querySelector('.side-nav'), content=document.querySelector('.admin-content');
    if(!nav||!content) return;
    if(document.getElementById('nz-admin-final-style')) return;
    var style=document.createElement('style'); style.id='nz-admin-final-style';
    style.textContent=''
      +'body{color:#181818!important;background:#f4f1eb!important}'
      +'body.admin-theme-light .admin-side,body.admin-theme-light .admin-content,body.admin-theme-light .stat,body.admin-theme-light .admin-card{background:#fff!important;color:#181818!important;border-color:#d3cec5!important}'
      +'body.admin-theme-light .admin-form{background:#f7f5f1!important;color:#111!important;border-color:#d3cec5!important}'
      +'body.admin-theme-light .admin-form input,body.admin-theme-light .admin-form textarea,body.admin-theme-light .admin-form select{background:#fff!important;color:#111!important;border-color:#aaa!important}'
      +'body.admin-theme-light .admin-actions button,body.admin-theme-light .admin-actions select{background:#fff!important;color:#111!important;border-color:#aaa!important}'
      +'body.admin-theme-light .admin-actions .approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-light .admin-actions .danger,.body.admin-theme-light .nz-admin-delete{color:#a30f0a!important}'
      +'body.admin-theme-light .panel-head{background:#fff!important;color:#111!important;border-color:#ddd7cd!important}'
      +'body.admin-theme-light .admin-card p{color:#333!important;opacity:1!important}'
      +'body.admin-theme-light .admin-meta{color:#a30f0a!important;opacity:1!important}'
      +'body.admin-theme-light .side-nav button{color:#222!important}'
      +'body.admin-theme-light .side-nav button.active{background:#111!important;color:#fff!important}'
      +'body.admin-theme-dark .admin-actions button,body.admin-theme-dark .admin-actions select{color:#fff!important}'
      +'body.admin-theme-dark .nz-admin-delete{background:#171717!important;color:#fff!important}'
      +'.nz-admin-delete{background:#fff!important;border:1px solid #c91510!important;color:#a30f0a!important;border-radius:10px;padding:9px 12px;cursor:pointer}'
      +'.admin-section-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:flex;gap:9px;flex-wrap:wrap;align-items:center;background:var(--admin-soft)}'
      +'.admin-section-tools input,.admin-section-tools select{padding:10px 11px;border:1px solid #aaa;border-radius:10px;background:#fff;color:#111;font:inherit;min-width:170px}'
      +'.admin-section-tools button{padding:10px 13px;border:1px solid #222;border-radius:10px;background:#111;color:#fff;font-weight:800;cursor:pointer}'
      +'.admin-create-form{padding:18px 20px;border-bottom:1px solid var(--admin-line);background:var(--admin-soft);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}'
      +'.admin-create-form input,.admin-create-form textarea,.admin-create-form select{padding:11px;border:1px solid #aaa;border-radius:9px;background:#fff;color:#111;font:inherit}'
      +'.admin-create-form textarea{grid-column:1/-1;min-height:90px;resize:vertical}'
      +'.admin-create-form button{padding:11px 14px;border:1px solid #111;border-radius:9px;background:#f7c515;color:#111;font-weight:900;cursor:pointer}'
      +'.admin-create-status{grid-column:1/-1;margin:0;font-size:.82rem}'
      +'.review-pending{border-left:4px solid #f7c515}.review-rejected{border-left:4px solid #c91510}.review-published{border-left:4px solid #35a853}'
      +'@media(max-width:650px){.admin-create-form{grid-template-columns:1fr}.admin-section-tools input,.admin-section-tools select{width:100%;min-width:0}.admin-create-form textarea,.admin-create-status{grid-column:auto}}';
    document.head.appendChild(style);

    /* Keep exactly one item per real administrative section. Never add another bar. */
    var allowed={products:'Market',orders:'Pedidos',reviews:'Avaliações',users:'Utilizadores',team:'Equipa',audit:'Atividades'};
    Object.keys(allowed).forEach(function(key){
      var buttons=Array.from(nav.querySelectorAll('button[data-tab="'+key+'"]'));
      buttons.forEach(function(b,i){ if(i>0) b.remove(); });
      if(buttons[0]){buttons[0].innerHTML='<span aria-hidden="true">'+({products:'▦',orders:'◷',reviews:'★',users:'♙',team:'♜',audit:'♜'}[key])+'</span> '+allowed[key];}
    });
    nav.querySelectorAll('button[data-tab="overview"]').forEach(function(b){b.remove()});

    function activate(tab){
      nav.querySelectorAll('button[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab)});
      content.querySelectorAll('.admin-panel').forEach(function(p){p.hidden=p.id!=='panel-'+tab});
      var stats=document.getElementById('stats'); if(stats) stats.hidden=true;
      window.scrollTo({top:0,behavior:'smooth'});
    }
    nav.onclick=function(e){var b=e.target.closest&&e.target.closest('button[data-tab]');if(!b)return;e.preventDefault();activate(b.dataset.tab)};
    content.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-admin-section]');if(b)activate(b.dataset.adminSection)});

    /* Delete actions: one clear action, confirmation, and self-protection. */
    function client(){return window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey)}
    function addDeleteButtons(){
      var maps=[['panel-products','[data-edit]','market_products','Eliminar produto'],['panel-orders','[data-order]','orders','Eliminar pedido'],['panel-reviews','[data-review]','reviews','Eliminar avaliação'],['panel-users','[data-user-id]','profiles','Eliminar utilizador']];
      maps.forEach(function(m){var p=document.getElementById(m[0]);if(!p)return;p.querySelectorAll('.admin-card').forEach(function(card){if(card.querySelector('.nz-admin-delete'))return;var ref=card.querySelector(m[1]);if(!ref)return;var id=ref.dataset.edit||ref.dataset.order||ref.dataset.review||ref.dataset.userId;if(!id)return;var actions=card.querySelector('.admin-actions');if(!actions)return;var b=document.createElement('button');b.type='button';b.className='nz-admin-delete';b.textContent=m[3];b.onclick=async function(){if(m[0]==='panel-users'){var s=await client().auth.getSession();if(s.data&&s.data.session&&s.data.session.user&&s.data.session.user.id===id){alert('A tua própria conta administrativa está protegida.');return}}if(!confirm('Eliminar este registo permanentemente? Esta ação não pode ser desfeita.'))return;b.disabled=true;b.textContent='A eliminar…';var r=await client().from(m[2]).delete().eq('id',id);if(r.error){b.disabled=false;b.textContent=m[3];alert('Não foi possível eliminar: '+r.error.message);return}card.remove()};actions.appendChild(b)})});
    }
    ['panel-products','panel-orders','panel-reviews','panel-users'].forEach(function(id){var p=document.getElementById(id);if(p)new MutationObserver(addDeleteButtons).observe(p,{childList:true,subtree:true})});
    setTimeout(addDeleteButtons,1000);
    activate(nav.querySelector('button[data-tab].active')?.dataset.tab || 'products');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
