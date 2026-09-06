/* Nzinga Admin — centralização das áreas, ícones, ações e navegação por secção. */
(function(){
  'use strict';
  function start(){
    if(!/admin\.html$/i.test(location.pathname)||!window.supabase||!window.NZINGA_SUPABASE)return;
    var nav=document.querySelector('.side-nav'),content=document.querySelector('.admin-content');
    if(!nav||!content||document.getElementById('nz-admin-center-ready'))return;
    var marker=document.createElement('span');marker.id='nz-admin-center-ready';marker.hidden=true;document.body.appendChild(marker);
    var svg={
      all:'<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
      market:'<svg viewBox="0 0 24 24"><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/></svg>',
      orders:'<svg viewBox="0 0 24 24"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/></svg>',
      reviews:'<svg viewBox="0 0 24 24"><path d="m12 4 2.2 4.5 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 9.2l4.8-.7z"/></svg>',
      users:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 20c.8-3.5 3.2-5 7-5s6.2 1.5 7 5"/></svg>',
      team:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.7-3.4 2.7-5 6-5s5.3 1.6 6 5M15 15c2.8-.1 4.7 1.5 5.5 4"/></svg>',
      audit:'<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h6M8 17h4"/></svg>'
    };
    function icon(k){return '<span class="nz-admin-nav-icon" aria-hidden="true">'+svg[k]+'</span>'}
    function addStyle(){var s=document.createElement('style');s.id='nzinga-admin-center-style';s.textContent=''
      +'.side-nav button{gap:11px!important}.nz-admin-nav-icon{width:20px;height:20px;display:grid;place-items:center;flex:none}.nz-admin-nav-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'
      +'.side-nav button.active{box-shadow:4px 4px 0 #c91510!important}'
      +'.nz-admin-overview{display:grid;gap:14px;padding:18px 20px}.nz-admin-overview-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.nz-admin-overview-card{border:1px solid var(--admin-line);border-radius:16px;padding:16px;background:var(--admin-soft)}.nz-admin-overview-card strong{display:block;font-size:1.7rem;margin-top:5px}.nz-admin-overview-card span{font-size:.76rem;opacity:.7}.nz-admin-overview-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.nz-admin-overview-link{border:1px solid var(--admin-line);border-radius:14px;padding:13px;text-decoration:none;color:inherit;background:transparent;cursor:pointer;text-align:left;font:inherit}.nz-admin-overview-link strong{display:block}.nz-admin-overview-link small{opacity:.6}.admin-card .nz-admin-delete{border:1px solid #c91510!important;background:transparent!important;color:inherit!important}.nz-admin-delete:focus-visible,.admin-actions button:focus-visible,.admin-actions select:focus-visible{outline:3px solid #f7c515;outline-offset:2px}'
      +'body.admin-theme-light .nz-admin-overview-card,body.admin-theme-light .nz-admin-overview-link{background:#fff!important;color:#1c1c1c!important;border-color:#c9c4ba!important}'
      +'body.admin-theme-light .nz-admin-delete{color:#9e0d16!important;border-color:#c91510!important}'
      +'body.admin-theme-dark .nz-admin-overview-card,body.admin-theme-dark .nz-admin-overview-link{background:#171717!important;color:#f1f1f1!important;border-color:#444!important}'
      +'body.admin-theme-dark .nz-admin-delete{color:#fff!important;border-color:#c91510!important}'
      +'@media(max-width:850px){.nz-admin-overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.nz-admin-overview-links{grid-template-columns:1fr}}';document.head.appendChild(s)}
    function normalizeNav(){
      var defs=[['overview','Tudo','all'],['products','Market','market'],['orders','Pedidos','orders'],['reviews','Avaliações','reviews'],['users','Utilizadores','users'],['team','Equipa','team'],['audit','Atividades','audit']];
      defs.forEach(function(d){var b=nav.querySelector('button[data-tab="'+d[0]+'"]');if(b)b.innerHTML=icon(d[2])+'<span>'+d[1]+'</span>'});
      [].slice.call(nav.querySelectorAll('button')).forEach(function(b){b.title=b.textContent.trim();b.setAttribute('aria-label',b.textContent.trim())});
    }
    function ensureOverview(){
      var b=nav.querySelector('button[data-tab="overview"]');
      if(!b){b=document.createElement('button');b.type='button';b.dataset.tab='overview';nav.insertBefore(b,nav.firstChild)}
      b.innerHTML=icon('all')+'<span>Tudo</span>';
      var p=document.getElementById('panel-overview');
      if(!p){p=document.createElement('div');p.id='panel-overview';p.className='admin-panel';p.hidden=true;content.insertBefore(p,content.firstChild)}
      b.addEventListener('click',function(e){e.preventDefault();activate('overview')});
      return {button:b,panel:p};
    }
    function overview(){
      var p=document.getElementById('panel-overview'),cards=[['Produtos','panel-products'],['Pedidos','panel-orders'],['Avaliações','panel-reviews'],['Utilizadores','panel-users']];
      p.innerHTML='<div class="panel-head"><h2>Visão geral</h2><span>Tudo num só lugar</span></div><div class="nz-admin-overview"><div class="nz-admin-overview-grid">'+cards.map(function(x){return '<div class="nz-admin-overview-card"><span>'+x[0]+'</span><strong>'+(document.getElementById(x[1])?.dataset.count||0)+'</strong></div>'}).join('')+'</div><div class="nz-admin-overview-links"><button class="nz-admin-overview-link" data-go="products"><strong>Market</strong><small>Produtos, publicação, edição e remoção</small></button><button class="nz-admin-overview-link" data-go="orders"><strong>Pedidos</strong><small>Consultar e atualizar pedidos</small></button><button class="nz-admin-overview-link" data-go="reviews"><strong>Avaliações</strong><small>Moderar avaliações</small></button><button class="nz-admin-overview-link" data-go="users"><strong>Utilizadores</strong><small>Gerir utilizadores</small></button><button class="nz-admin-overview-link" data-go="team"><strong>Equipa</strong><small>Administradores e funções</small></button><button class="nz-admin-overview-link" data-go="audit"><strong>Atividades</strong><small>Histórico administrativo</small></button></div></div>';
      p.querySelectorAll('[data-go]').forEach(function(x){x.addEventListener('click',function(){activate(x.dataset.go)})});
    }
    function activate(tab){
      normalizeNav();
      nav.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab)});
      document.querySelectorAll('.admin-panel').forEach(function(p){p.hidden=p.id!=='panel-'+tab});
      if(tab==='overview')overview();
      var stats=document.getElementById('stats');if(stats)stats.hidden=tab!=='overview';
      window.scrollTo({top:0,behavior:'smooth'});
    }
    function installNavigation(){
      var ov=ensureOverview();
      normalizeNav();
      nav.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button[data-tab]');if(!b||b===ov.button)return;setTimeout(function(){activate(b.dataset.tab)},0)},true);
      setTimeout(function(){activate('overview')},900);
    }
    function addDelete(panel,type){panel.querySelectorAll('.admin-card').forEach(function(card){if(card.querySelector('.nz-admin-delete'))return;var id=null;if(type==='product'){var e=card.querySelector('[data-edit]');id=e&&e.dataset.edit}if(type==='order'){var e2=card.querySelector('[data-order]');id=e2&&e2.dataset.order}if(type==='review'){var d=card.querySelector('.review-id');if(d)id=d.textContent.replace(/^.*?:\s*/,'').trim()}if(type==='user')id=card.dataset.userId;if(!id)return;var actions=card.querySelector('.admin-actions');if(!actions)return;var b=document.createElement('button');b.type='button';b.className='nz-admin-delete';b.textContent=type==='product'?'Eliminar produto':type==='order'?'Eliminar pedido':type==='review'?'Eliminar avaliação':'Eliminar utilizador';b.addEventListener('click',function(){remove(type,id,b)});actions.appendChild(b)})}
    async function remove(type,id,button){var labels={product:'produto',order:'pedido',review:'avaliação',user:'utilizador'};if(type==='user'){var r=await window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey).auth.getSession();if(r.data?.session?.user?.id===id){alert('Não podes apagar a tua própria conta administrativa.');return}}if(!confirm('Eliminar este '+labels[type]+' permanentemente? Esta ação não pode ser desfeita.'))return;button.disabled=true;button.textContent='A eliminar…';var table={product:'market_products',order:'orders',review:'reviews',user:'profiles'}[type];var result=await window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey).from(table).delete().eq('id',id);if(result.error){button.disabled=false;button.textContent='Eliminar '+labels[type];alert('Não foi possível eliminar: '+result.error.message);return}location.reload()}
    function watchPanels(){['panel-products','panel-orders','panel-reviews','panel-users','panel-team','panel-audit'].forEach(function(id){var p=document.getElementById(id);if(!p)return;new MutationObserver(function(){setTimeout(function(){if(id==='panel-products')addDelete(p,'product');if(id==='panel-orders')addDelete(p,'order');if(id==='panel-reviews')addDelete(p,'review');if(id==='panel-users')addDelete(p,'user')},80)}).observe(p,{childList:true,subtree:true});setTimeout(function(){if(id==='panel-products')addDelete(p,'product');if(id==='panel-orders')addDelete(p,'order');if(id==='panel-reviews')addDelete(p,'review');if(id==='panel-users')addDelete(p,'user')},1200)})}
    addStyle();installNavigation();watchPanels();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();