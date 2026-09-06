/* Nzinga Admin — final organization/readability pass. */
(function(){
  'use strict';
  if(!/admin\.html$/i.test(location.pathname))return;
  function start(){
    var nav=document.querySelector('.side-nav'),content=document.querySelector('.admin-content');
    if(!nav||!content||document.getElementById('nz-admin-final-fix'))return;
    var marker=document.createElement('span');marker.id='nz-admin-final-fix';marker.hidden=true;document.body.appendChild(marker);
    var style=document.createElement('style');style.id='nz-admin-final-style';style.textContent=''
      +'body{background:#f4f1eb!important;color:#1c1c1c!important}'
      +'body.admin-theme-light .admin-wrap{background:transparent!important}'
      +'body.admin-theme-light .admin-side,body.admin-theme-light .admin-content,body.admin-theme-light .stat,body.admin-theme-light .admin-card{background:#fff!important;color:#1c1c1c!important;border-color:#d3cec5!important}'
      +'body.admin-theme-light .admin-form{background:#f7f5f1!important;color:#111!important;border:1px solid #d3cec5!important}'
      +'body.admin-theme-light .admin-form input,body.admin-theme-light .admin-form textarea,body.admin-theme-light .admin-form select{background:#fff!important;color:#111!important;border:1px solid #aaa!important}'
      +'body.admin-theme-light .admin-actions button,body.admin-theme-light .admin-actions select{background:#fff!important;color:#111!important;border:1px solid #aaa!important}'
      +'body.admin-theme-light .admin-actions .approve{background:#f7c515!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-light .admin-actions .danger,.body.admin-theme-light .nz-admin-delete{color:#a30f0a!important}'
      +'body.admin-theme-light .panel-head{background:#fff!important;color:#111!important;border-color:#ddd7cd!important}'
      +'body.admin-theme-light .admin-card p{color:#333!important;opacity:1!important}'
      +'body.admin-theme-light .admin-meta{color:#a30f0a!important;opacity:1!important}'
      +'body.admin-theme-light .side-nav button{color:#222!important}'
      +'body.admin-theme-light .side-nav button.active{background:#111!important;color:#fff!important}'
      +'body.admin-theme-light #nz-admin-theme-toggle{background:#fff!important;color:#111!important;border-color:#111!important}'
      +'body.admin-theme-light .nz-admin-overview-card,body.admin-theme-light .nz-admin-overview-link{background:#fff!important;color:#111!important}'
      +'.nz-admin-overview{padding:18px 20px!important}'
      +'.nz-admin-overview-card,.nz-admin-overview-link{box-shadow:none!important}'
      +'.nz-admin-section-title{padding:18px 20px 6px;font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#a30f0a}'
      +'.nz-admin-delete{background:#fff!important;border:1px solid #c91510!important;color:#a30f0a!important}'
      +'body.admin-theme-dark .nz-admin-delete{background:#171717!important;color:#fff!important}'
      +'body.admin-theme-dark .admin-actions button,body.admin-theme-dark .admin-actions select{color:#fff!important}'
      +'@media(max-width:900px){.nz-admin-overview{padding:15px!important}.nz-admin-overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}';document.head.appendChild(style);
    function overview(){
      var p=document.getElementById('panel-overview');if(!p)return;
      var cards=[['Produtos','panel-products'],['Pedidos','panel-orders'],['Avaliações','panel-reviews'],['Utilizadores','panel-users']];
      p.innerHTML='<div class="panel-head"><h2>Visão geral</h2><span>Resumo administrativo</span></div><div class="nz-admin-overview"><div class="nz-admin-overview-grid">'+cards.map(function(x){return '<div class="nz-admin-overview-card"><span>'+x[0]+'</span><strong>'+(document.getElementById(x[1])?.dataset.count||0)+'</strong></div>'}).join('')+'</div><div class="nz-admin-overview-links"><button class="nz-admin-overview-link" data-go="products"><strong>Market</strong><small>Produtos e catálogo</small></button><button class="nz-admin-overview-link" data-go="orders"><strong>Pedidos</strong><small>Pedidos e estados</small></button><button class="nz-admin-overview-link" data-go="reviews"><strong>Avaliações</strong><small>Publicadas e pendentes</small></button><button class="nz-admin-overview-link" data-go="users"><strong>Utilizadores</strong><small>Contas da comunidade</small></button><button class="nz-admin-overview-link" data-go="team"><strong>Equipa</strong><small>Administradores e moderadores</small></button><button class="nz-admin-overview-link" data-go="audit"><strong>Atividades</strong><small>Histórico administrativo</small></button></div></div>';
      p.querySelectorAll('[data-go]').forEach(function(b){b.onclick=function(){activate(b.dataset.go)}});
    }
    function activate(tab){
      nav.querySelectorAll('button[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===tab)});
      document.querySelectorAll('.admin-panel').forEach(function(p){p.hidden=p.id!=='panel-'+tab});
      var stats=document.getElementById('stats');if(stats)stats.hidden=tab!=='overview';
      if(tab==='overview')overview();
      window.scrollTo({top:0,behavior:'smooth'});
    }
    var defs=[['overview','Tudo','all'],['products','Market','market'],['orders','Pedidos','orders'],['reviews','Avaliações','reviews'],['users','Utilizadores','users'],['team','Equipa','team'],['audit','Atividades','audit']];
    var icons={all:'▦',market:'◫',orders:'□',reviews:'★',users:'♙',team:'♙',audit:'≡'};
    defs.forEach(function(d){var b=nav.querySelector('button[data-tab="'+d[0]+'"]');if(!b){b=document.createElement('button');b.type='button';b.dataset.tab=d[0];nav.appendChild(b)}b.innerHTML='<span class="nz-admin-simple-icon">'+icons[d[2]]+'</span><span>'+d[1]+'</span>'});
    var overviewPanel=document.getElementById('panel-overview');if(!overviewPanel){overviewPanel=document.createElement('div');overviewPanel.id='panel-overview';overviewPanel.className='admin-panel';overviewPanel.hidden=true;content.insertBefore(overviewPanel,content.firstChild)}
    nav.onclick=function(e){var b=e.target.closest&&e.target.closest('button[data-tab]');if(b){e.preventDefault();activate(b.dataset.tab)}};
    content.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-go]');if(b)activate(b.dataset.go)});
    var allPanels=document.querySelectorAll('.admin-panel');allPanels.forEach(function(p){p.hidden=true});activate('overview');
    function addDeleteButtons(){
      var map=[['panel-products','product','[data-edit]','market_products','Eliminar produto'],['panel-orders','order','[data-order]','orders','Eliminar pedido'],['panel-reviews','review','.review-id','reviews','Eliminar avaliação'],['panel-users','user','[data-user-id]','profiles','Eliminar utilizador']];
      map.forEach(function(m){var p=document.getElementById(m[0]);if(!p)return;p.querySelectorAll('.admin-card').forEach(function(card){if(card.querySelector('.nz-admin-delete'))return;var ref=card.querySelector(m[2]),id=null;if(m[1]==='review'&&ref)id=ref.textContent.replace(/^.*?:\s*/,'').trim();else if(ref)id=ref.dataset.edit||ref.dataset.order||ref.dataset.userId;if(!id)return;var actions=card.querySelector('.admin-actions');if(!actions)return;var b=document.createElement('button');b.type='button';b.className='nz-admin-delete';b.textContent=m[4];b.onclick=async function(){if(m[1]==='user'){var s=await client().auth.getSession();if(s.data?.session?.user?.id===id){alert('Não podes apagar a tua própria conta administrativa.');return}}if(!confirm('Eliminar este registo permanentemente? Esta ação não pode ser desfeita.'))return;b.disabled=true;b.textContent='A eliminar…';var r=await client().from(m[3]).delete().eq('id',id);if(r.error){b.disabled=false;b.textContent=m[4];alert('Não foi possível eliminar: '+r.error.message);return}location.reload()};actions.appendChild(b)})})
    }
    function client(){return window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey)}
    ['panel-products','panel-orders','panel-reviews','panel-users'].forEach(function(id){var p=document.getElementById(id);if(p)new MutationObserver(addDeleteButtons).observe(p,{childList:true,subtree:true})});
    setTimeout(addDeleteButtons,1500);
    var themeBtn=document.getElementById('nz-admin-theme-toggle');
    var menu=document.getElementById('nzAdminMenu'),links=document.getElementById('nzAdminLinks');
    if(themeBtn&&links){var wrap=document.createElement('div');wrap.className='nz-admin-theme-menu-item';wrap.appendChild(themeBtn);links.appendChild(wrap)}
    setTimeout(function(){var btn=document.getElementById('nz-admin-theme-toggle');if(btn&&links&&!links.contains(btn)){var wrap=document.createElement('div');wrap.className='nz-admin-theme-menu-item';wrap.appendChild(btn);links.appendChild(wrap)}},500);
    if(menu)menu.setAttribute('aria-label','Abrir menu e definições');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
