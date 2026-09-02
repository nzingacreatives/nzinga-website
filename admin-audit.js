/* Nzinga Admin — Atividade administrativa / auditoria. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    var app=document.getElementById('app');
    var nav=document.querySelector('.side-nav');
    var content=document.querySelector('.admin-content');
    if(!app||!nav||!content)return;
    if(document.getElementById('auditTab'))return;

    addStyle('nzinga-audit-style',''+
      '.audit-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 180px 180px auto;gap:8px;background:var(--admin-soft)}'+
      '.audit-tools input,.audit-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}'+
      '.audit-tools button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}'+
      '.audit-summary{display:flex;gap:8px;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--admin-line)}'+
      '.audit-pill{padding:7px 10px;border:1px solid var(--admin-line);border-radius:999px;font-size:.74rem}.audit-list{display:grid}'+
      '.audit-row{padding:17px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:12px;align-items:start}'+
      '.audit-icon{width:38px;height:38px;border:1px solid var(--admin-line);border-radius:12px;display:grid;place-items:center;font-weight:900}'+
      '.audit-row h3{margin:0 0 5px;font-size:.98rem}.audit-row p{margin:3px 0;opacity:.62;font-size:.82rem;line-height:1.45}.audit-time{font-size:.72rem;opacity:.48;white-space:nowrap}.audit-details{margin-top:8px;padding:9px 11px;border-radius:10px;background:var(--admin-soft);font-size:.72rem;white-space:pre-wrap;word-break:break-word;opacity:.68}.audit-empty{padding:44px 20px;text-align:center;opacity:.5}.audit-more{padding:14px 20px;text-align:center}.audit-more button{border:1px solid var(--admin-line);background:transparent;color:inherit;border-radius:10px;padding:9px 14px;cursor:pointer}'+
      '@media(max-width:700px){.audit-tools{grid-template-columns:1fr}.audit-row{grid-template-columns:36px minmax(0,1fr)}.audit-time{grid-column:2;white-space:normal}.audit-icon{width:34px;height:34px}}');

    var tab=document.createElement('button');tab.id='auditTab';tab.dataset.tab='audit';tab.innerHTML='<span>♧</span> Atividade';nav.appendChild(tab);
    var panel=document.createElement('div');panel.id='panel-audit';panel.className='admin-panel';panel.hidden=true;content.appendChild(panel);

    var page=0,limit=50,lastRows=[];
    var actionLabels={
      'admin.member_added':'Membro adicionado à equipa','admin.role_changed':'Função da equipa alterada','admin.member_removed':'Membro removido da equipa',
      'market.product_created':'Produto criado','market.product_updated':'Produto atualizado','market.product_deleted':'Produto eliminado',
      'orders.status_changed':'Estado do pedido alterado','orders.order_deleted':'Pedido eliminado',
      'reviews.moderated':'Avaliação moderada','reviews.deleted':'Avaliação eliminada'
    };
    var tableLabels={admin_users:'Equipa',market_products:'Market',orders:'Pedidos',reviews:'Avaliações'};

    function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function labelAction(a){return actionLabels[a]||a||'Atividade administrativa'}
    function icon(a){if(a&&a.indexOf('market.')===0)return '▦';if(a&&a.indexOf('orders.')===0)return '◷';if(a&&a.indexOf('reviews.')===0)return '★';return '♜'}
    function localDate(v){var d=new Date(v);return isNaN(d)?'—':d.toLocaleString('pt-AO')}

    async function load(reset){
      if(reset){page=0;lastRows=[]}
      panel.innerHTML='<div class="panel-head"><h2>Atividade administrativa</h2><span>A carregar…</span></div>';
      var from=page*limit,to=from+limit-1;
      var r=await sb.from('admin_audit_logs').select('*').order('created_at',{ascending:false}).range(from,to);
      if(r.error){panel.innerHTML='<div class="empty">Não foi possível carregar a atividade administrativa.<br><small>'+esc(r.error.message)+'</small></div>';return}
      var rows=r.data||[];lastRows=rows;
      var actorIds=[...new Set(rows.map(function(x){return x.actor_id}).filter(Boolean))];
      var profiles={};
      if(actorIds.length){var pr=await sb.from('profiles').select('id,name,contact').in('id',actorIds);(pr.data||[]).forEach(function(x){profiles[x.id]=x})}
      render(rows,profiles,from>0);
    }

    function render(rows,profiles,append){
      var q=(document.getElementById('auditSearch')?.value||'').toLowerCase().trim();
      var action=(document.getElementById('auditAction')?.value||'');
      var table=(document.getElementById('auditTable')?.value||'');
      var filtered=rows.filter(function(x){var p=profiles[x.actor_id]||{};var hay=[x.action,x.target_table,x.target_id,p.name,p.contact,JSON.stringify(x.details||{})].join(' ').toLowerCase();return (!q||hay.indexOf(q)!==-1)&&(!action||x.action===action)&&(!table||x.target_table===table)});
      if(!append)panel.innerHTML='';
      if(!append){
        var head=document.createElement('div');head.className='panel-head';head.innerHTML='<h2>Atividade administrativa</h2><span>'+filtered.length+' registo'+(filtered.length===1?'':'s')+' nesta página</span>';panel.appendChild(head);
        var tools=document.createElement('div');tools.className='audit-tools';tools.innerHTML='<input id="auditSearch" type="search" placeholder="Pesquisar atividade, administrador ou ID…" aria-label="Pesquisar atividade">'+
          '<select id="auditAction"><option value="">Todas as ações</option>'+Object.keys(actionLabels).map(function(k){return '<option value="'+esc(k)+'">'+esc(actionLabels[k])+'</option>'}).join('')+'</select>'+
          '<select id="auditTable"><option value="">Todas as áreas</option>'+Object.keys(tableLabels).map(function(k){return '<option value="'+k+'">'+tableLabels[k]+'</option>'}).join('')+'</select><button id="auditRefresh" type="button">Atualizar</button>';panel.appendChild(tools);
        var summary=document.createElement('div');summary.className='audit-summary';summary.innerHTML='<span class="audit-pill">Hoje: '+rows.filter(function(x){return new Date(x.created_at).toDateString()===new Date().toDateString()}).length+'</span><span class="audit-pill">Carregados: '+rows.length+'</span>';panel.appendChild(summary);
        tools.querySelector('#auditSearch').addEventListener('input',function(){render(lastRows,profiles,false)});tools.querySelector('#auditAction').addEventListener('change',function(){render(lastRows,profiles,false)});tools.querySelector('#auditTable').addEventListener('change',function(){render(lastRows,profiles,false)});tools.querySelector('#auditRefresh').addEventListener('click',function(){load(true)});
      }
      var list=document.createElement('div');list.className='audit-list';
      if(filtered.length){list.innerHTML=filtered.map(function(x){var p=profiles[x.actor_id]||{};var actor=p.name||p.contact||'Administrador';var details=x.details&&Object.keys(x.details).length?'<div class="audit-details">'+esc(JSON.stringify(x.details,null,2))+'</div>':'';return '<article class="audit-row"><div class="audit-icon">'+icon(x.action)+'</div><div><h3>'+esc(labelAction(x.action))+'</h3><p><strong>'+esc(actor)+'</strong> · '+esc(tableLabels[x.target_table]||x.target_table||'—')+' · '+esc(x.target_id||'—')+'</p>'+details+'</div><time class="audit-time">'+esc(localDate(x.created_at))+'</time></article>'}).join('')}else{list.innerHTML='<div class="audit-empty"><strong>Nenhuma atividade encontrada</strong><br>Ajusta os filtros ou aguarda novas ações administrativas.</div>'}
      panel.appendChild(list);
      var more=document.createElement('div');more.className='audit-more';more.innerHTML='<button type="button">Carregar mais</button>';more.querySelector('button').disabled=rows.length<limit;more.querySelector('button').addEventListener('click',function(){page++;load(false)});panel.appendChild(more);
    }

    function activate(){
      document.querySelectorAll('.side-nav button').forEach(function(b){b.classList.toggle('active',b===tab)});
      document.querySelectorAll('.admin-panel').forEach(function(p){p.hidden=p!==panel});
      load(true);
    }
    tab.addEventListener('click',activate);
    // Keep the visual tab functional even when the legacy admin.html handlers run.
    new MutationObserver(function(){if(!document.getElementById('auditTab'))nav.appendChild(tab)}).observe(nav,{childList:true});
  }
  function addStyle(id,css){if(document.getElementById(id))return;var s=document.createElement('style');s.id=id;s.textContent=css;document.head.appendChild(s)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(start,250)});else setTimeout(start,250);
})();