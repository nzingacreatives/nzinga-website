/* Nzinga Admin — gestão de utilizadores e perfis. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var panel=document.getElementById('panel-users');
    if(!panel)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    var currentUser=null, profiles=[], admins=[];
    addStyle();
    sb.auth.getSession().then(function(r){currentUser=r&&r.data&&r.data.session?r.data.session.user:null; load()});

    function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function date(v){if(!v)return '—';var d=new Date(v);return isNaN(d)?'—':d.toLocaleString('pt-AO')}
    function initials(name,email){var s=(name||email||'Nz').trim();var p=s.split(/\s+/).filter(Boolean);return ((p[0]||'N')[0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase().slice(0,2)}
    function avatar(path,name,email){if(!path)return '<div class="user-avatar user-avatar-fallback">'+esc(initials(name,email))+'</div>';var url=sb.storage.from('profile-photos').getPublicUrl(path).data.publicUrl;return '<img class="user-avatar" src="'+esc(url)+'" alt="" loading="lazy">'}
    function header(){return '<div class="panel-head"><h2>Utilizadores</h2><span id="usersTotal">'+profiles.length+' registo'+(profiles.length===1?'':'s')+'</span></div>'}
    function tools(){return '<div class="users-tools"><input id="usersSearch" type="search" placeholder="Pesquisar nome, email ou contacto…" aria-label="Pesquisar utilizadores"><select id="usersFilter"><option value="">Todos os utilizadores</option><option value="complete">Perfil completo</option><option value="incomplete">Perfil incompleto</option><option value="admin">Administradores</option></select><button id="usersRefresh" type="button">Atualizar</button></div><div class="users-count" id="usersCount"></div>'}

    async function load(){
      panel.innerHTML=header()+tools()+'<div class="empty">A carregar utilizadores…</div>';
      var [pr,ad]=await Promise.all([
        sb.from('profiles').select('id,name,contact,avatar_path,created_at,updated_at').order('updated_at',{ascending:false}),
        sb.from('admin_users').select('user_id,role,created_at')
      ]);
      if(pr.error){panel.innerHTML=header()+tools()+'<div class="empty"><strong>Não foi possível carregar os utilizadores.</strong>'+esc(pr.error.message||'Verifica as permissões de acesso.')+'</div>';bindTools();return}
      profiles=pr.data||[];admins=ad.data||[];
      render();bindTools();
    }
    function bindTools(){
      var s=document.getElementById('usersSearch'),f=document.getElementById('usersFilter'),r=document.getElementById('usersRefresh');
      if(s)s.addEventListener('input',render);if(f)f.addEventListener('change',render);if(r)r.addEventListener('click',load);
    }
    function isAdmin(id){return admins.find(function(a){return a.user_id===id})||null}
    function complete(p){return !!(p.name&&p.name.trim()&&p.contact&&p.contact.trim()&&p.avatar_path)}
    function render(){
      var s=(document.getElementById('usersSearch')?.value||'').toLowerCase().trim(),f=document.getElementById('usersFilter')?.value||'';
      var list=profiles.filter(function(p){
        var a=isAdmin(p.id), text=[p.name,p.contact,p.id].join(' ').toLowerCase();
        var okSearch=!s||text.indexOf(s)!==-1;
        var okFilter=!f||(f==='admin'&&a)||(f==='complete'&&complete(p))||(f==='incomplete'&&!complete(p));
        return okSearch&&okFilter;
      });
      var head=panel.querySelector('.panel-head'),tool=panel.querySelector('.users-tools'),count=panel.querySelector('#usersCount');
      if(count)count.textContent=list.length+' utilizador'+(list.length===1?'':'es')+' visível'+(list.length===1?'':'is');
      panel.querySelectorAll('.user-card,.users-empty').forEach(function(x){x.remove()});
      if(!list.length){var e=document.createElement('div');e.className='empty users-empty';e.innerHTML='<strong>Nenhum utilizador encontrado</strong>Ajusta a pesquisa ou o filtro.';panel.appendChild(e);return}
      list.forEach(function(p){
        var a=isAdmin(p.id), card=document.createElement('article');card.className='admin-card user-card';card.dataset.userId=p.id;
        card.innerHTML='<div class="user-main">'+avatar(p.avatar_path,p.name,'')+'<div class="user-info"><span class="admin-meta">'+(a?'ADMINISTRADOR · '+esc(a.role):'UTILIZADOR')+'</span><h2>'+esc(p.name||'Sem nome')+'</h2><p>'+esc(p.contact||'Sem contacto')+'</p><small>ID: '+esc(p.id)+'</small></div></div><div class="admin-actions"><button type="button" data-view-user="'+esc(p.id)+'" class="approve">Ver perfil</button></div>';
        card.querySelector('[data-view-user]').addEventListener('click',function(){toggleDetails(card,p,a)});
        panel.appendChild(card);
      });
    }
    function toggleDetails(card,p,a){
      var old=card.querySelector('.user-details');if(old){old.remove();return}
      var details=document.createElement('div');details.className='user-details';details.innerHTML='<div class="user-detail-top">'+avatar(p.avatar_path,p.name,'')+'<div><strong>'+esc(p.name||'Sem nome')+'</strong><div>'+esc(p.contact||'Sem contacto')+'</div></div></div><dl><dt>Função</dt><dd>'+(a?'Administrador ('+esc(a.role)+')':'Utilizador')+'</dd><dt>Conta</dt><dd>'+esc(date(p.created_at))+'</dd><dt>Perfil atualizado</dt><dd>'+esc(date(p.updated_at))+'</dd><dt>ID</dt><dd>'+esc(p.id)+'</dd></dl><div class="user-activity"><button type="button" data-orders-user="'+esc(p.id)+'">Ver pedidos</button><button type="button" data-reviews-user="'+esc(p.id)+'">Ver avaliações</button></div><div class="user-related" hidden></div>';
      card.appendChild(details);
      details.querySelector('[data-orders-user]').addEventListener('click',function(){loadRelated(details,p.id,'orders')});
      details.querySelector('[data-reviews-user]').addEventListener('click',function(){loadRelated(details,p.id,'reviews')});
    }
    async function loadRelated(details,id,type){
      var box=details.querySelector('.user-related');box.hidden=false;box.textContent='A carregar…';
      var table=type==='orders'?'orders':'reviews',result=await sb.from(table).select('*').eq('user_id',id).order('created_at',{ascending:false});
      if(result.error){box.textContent='Não foi possível carregar: '+result.error.message;return}
      var rows=result.data||[];
      if(!rows.length){box.textContent=type==='orders'?'Nenhum pedido associado.':'Nenhuma avaliação associada.';return}
      box.innerHTML='<strong>'+esc(type==='orders'?'Pedidos':'Avaliações')+'</strong>'+rows.map(function(x){return '<div class="related-row">'+(type==='orders'?'<b>'+esc(x.service||'Pedido')+'</b> · '+esc(x.status||''):'<b>'+esc(x.stars||'0')+' ★</b> · '+esc(x.status||'published'))+'<br><span>'+esc(date(x.created_at))+'</span></div>'}).join('');
    }
    function addStyle(){
      if(document.getElementById('nzinga-users-style'))return;
      var s=document.createElement('style');s.id='nzinga-users-style';s.textContent='.users-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 190px auto;gap:8px;background:var(--admin-soft)}.users-tools input,.users-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}.users-tools button,.user-activity button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}.users-count{font-size:.76rem;opacity:.55;padding:0 20px 12px}.user-main{display:flex;align-items:center;gap:14px}.user-avatar{width:52px;height:52px;border-radius:16px;object-fit:cover;border:1px solid var(--admin-line);flex:0 0 auto}.user-avatar-fallback{display:grid;place-items:center;background:var(--admin-soft);font-weight:900}.user-info{min-width:0}.user-info h2{margin:4px 0}.user-info p{margin:4px 0}.user-info small{opacity:.4;word-break:break-all}.user-details{margin-top:14px;padding:15px;border:1px solid var(--admin-line);border-radius:14px;background:var(--admin-soft);display:grid;gap:12px}.user-detail-top{display:flex;gap:12px;align-items:center}.user-detail-top strong{font-size:1.05rem}.user-details dl{margin:0;display:grid;grid-template-columns:150px 1fr;gap:7px 12px;font-size:.84rem}.user-details dt{opacity:.5}.user-details dd{margin:0;word-break:break-word}.user-activity{display:flex;gap:8px;flex-wrap:wrap}.user-activity button{background:transparent;color:inherit;font-weight:500}.user-related{padding:10px;border-radius:10px;background:rgba(0,0,0,.16);font-size:.82rem}.related-row{padding:8px 0;border-bottom:1px solid var(--admin-line)}.related-row:last-child{border-bottom:0}.related-row span{opacity:.5}@media(max-width:650px){.users-tools{grid-template-columns:1fr}.user-details dl{grid-template-columns:1fr}.user-avatar{width:46px;height:46px}}';document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
