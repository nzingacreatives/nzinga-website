/* Nzinga Admin — gestão visual de administradores e moderadores. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var nav=document.querySelector('.side-nav');
    var main=document.querySelector('.admin-content');
    if(!nav||!main||document.getElementById('panel-team'))return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    var currentUser=null, admins=[], profiles=[];

    var tab=document.createElement('button');
    tab.type='button';tab.dataset.tab='team';tab.innerHTML='<span>♜</span> Equipa';
    nav.appendChild(tab);
    var panel=document.createElement('div');panel.id='panel-team';panel.className='admin-panel';panel.hidden=true;main.appendChild(panel);
    addStyle();

    sb.auth.getSession().then(function(r){
      currentUser=r&&r.data&&r.data.session?r.data.session.user:null;
      if(!currentUser)return;
      load();
    });

    function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function date(v){if(!v)return '—';var d=new Date(v);return isNaN(d)?'—':d.toLocaleString('pt-AO')}
    function roleFor(id){return admins.find(function(a){return a.user_id===id})||null}
    function nameFor(id){var p=profiles.find(function(x){return x.id===id});return p||{name:'Utilizador',contact:''}}
    function isCurrentAdmin(){var a=roleFor(currentUser&&currentUser.id);return a&&a.role==='admin'}
    function header(){return '<div class="panel-head"><div><h2>Equipa administrativa</h2><span>Gestão de administradores e moderadores</span></div><button id="teamRefresh" class="team-refresh" type="button">Atualizar</button></div>'}
    function form(){return '<div class="team-add"><div><strong>Adicionar membro</strong><small>Seleciona um utilizador existente e atribui uma função.</small></div><div class="team-form"><select id="teamUser"><option value="">Selecionar utilizador…</option></select><select id="teamRole"><option value="moderator">Moderador</option><option value="admin">Administrador</option></select><button id="teamAddBtn" class="approve" type="button">Adicionar</button></div><p id="teamStatus" class="team-status"></p></div>'}

    async function load(){
      panel.innerHTML=header()+form()+'<div class="empty">A carregar equipa…</div>';
      var result=await Promise.all([
        sb.from('admin_users').select('user_id,role,created_at').order('created_at',{ascending:true}),
        sb.from('profiles').select('id,name,contact,avatar_path,created_at').order('name',{ascending:true})
      ]);
      if(result[0].error||result[1].error){panel.innerHTML=header()+'<div class="empty"><strong>Não foi possível carregar a equipa.</strong>'+esc((result[0].error||result[1].error).message||'Verifica as permissões.')+'</div>';bindHeader();return}
      admins=result[0].data||[];profiles=result[1].data||[];
      render();bind();
    }
    function bindHeader(){var r=document.getElementById('teamRefresh');if(r)r.onclick=load}
    function bind(){
      bindHeader();
      var add=document.getElementById('teamAddBtn');if(add)add.onclick=addMember;
      panel.querySelectorAll('[data-role-save]').forEach(function(b){b.onclick=function(){changeRole(b.dataset.roleSave)}});
      panel.querySelectorAll('[data-remove-member]').forEach(function(b){b.onclick=function(){removeMember(b.dataset.removeMember)}});
    }
    function render(){
      var candidates=profiles.filter(function(p){return !roleFor(p.id)});
      var select=document.getElementById('teamUser');
      if(select)select.innerHTML='<option value="">Selecionar utilizador…</option>'+candidates.map(function(p){return '<option value="'+esc(p.id)+'">'+esc(p.name||'Sem nome')+' — '+esc(p.contact||p.id)+'</option>'}).join('');
      var rows=admins.map(function(a){var p=nameFor(a.user_id);var self=a.user_id===currentUser.id;return '<article class="admin-card team-card"><div class="team-person"><div class="team-avatar">'+esc((p.name||'N').trim().slice(0,1).toUpperCase())+'</div><div><span class="admin-meta">'+esc(a.role)+(self?' · A tua conta':'')+'</span><h2>'+esc(p.name||'Sem nome')+'</h2><p>'+esc(p.contact||'Sem contacto')+'</p><small>ID: '+esc(a.user_id)+'</small><small>Adicionado: '+esc(date(a.created_at))+'</small></div></div><div class="admin-actions">'+(isCurrentAdmin()?'<select data-role-select="'+esc(a.user_id)+'"><option value="moderator" '+(a.role==='moderator'?'selected':'')+'>Moderador</option><option value="admin" '+(a.role==='admin'?'selected':'')+'>Administrador</option></select><button data-role-save="'+esc(a.user_id)+'">Guardar função</button><button class="danger" data-remove-member="'+esc(a.user_id)+'">Remover</button>':'<span class="admin-meta">Sem permissões para gerir</span>')+'</div></article>'}).join('');
      panel.innerHTML=header()+form()+(rows||'<div class="empty"><strong>Nenhum membro administrativo</strong>Adiciona o primeiro administrador ou moderador.</div>');
      var st=document.getElementById('teamStatus');if(st)st.textContent=isCurrentAdmin()?'':'Apenas administradores podem alterar a equipa.';
    }
    async function addMember(){
      var uid=document.getElementById('teamUser').value,role=document.getElementById('teamRole').value,st=document.getElementById('teamStatus');
      if(!uid){if(st)st.textContent='Seleciona um utilizador.';return}
      if(!isCurrentAdmin()){if(st)st.textContent='Apenas administradores podem alterar a equipa.';return}
      var r=await sb.from('admin_users').insert({user_id:uid,role:role});
      if(r.error){if(st)st.textContent='Erro: '+r.error.message;return}
      await audit('admin.member_added',uid,{role:role});await load();
    }
    async function changeRole(uid){
      if(!isCurrentAdmin())return;
      var select=panel.querySelector('[data-role-select="'+CSS.escape(uid)+'"]');var role=select?select.value:null;if(!role)return;
      if(uid===currentUser.id&&role!=='admin'){if(!confirm('Isto altera a tua própria função. Continuar?'))return}
      var r=await sb.from('admin_users').update({role:role}).eq('user_id',uid);
      if(r.error){alert('Não foi possível alterar a função: '+r.error.message);return}
      await audit('admin.role_changed',uid,{role:role});await load();
    }
    async function removeMember(uid){
      if(!isCurrentAdmin())return;
      if(uid===currentUser.id&&!confirm('Estás prestes a remover a tua própria função administrativa. Continuar?'))return;
      if(!confirm('Remover este membro da equipa administrativa?'))return;
      var r=await sb.from('admin_users').delete().eq('user_id',uid);
      if(r.error){alert('Não foi possível remover: '+r.error.message);return}
      await audit('admin.member_removed',uid,{});await load();
    }
    async function audit(action,target,details){
      try{await sb.from('admin_audit_logs').insert({actor_id:currentUser.id,action:action,target_table:'admin_users',target_id:target,details:details||{}})}catch(e){console.warn('Audit log:',e)}
    }
    tab.addEventListener('click',function(){
      document.querySelectorAll('.side-nav button').forEach(function(b){b.classList.toggle('active',b===tab)});
      document.querySelectorAll('.admin-panel').forEach(function(p){p.hidden=p!==panel});
      load();
    });
  }
  function addStyle(){
    if(document.getElementById('nzinga-team-style'))return;
    var s=document.createElement('style');s.id='nzinga-team-style';s.textContent='.team-refresh,.team-form button{border:1px solid var(--admin-line);border-radius:10px;background:#111;color:inherit;padding:9px 13px;cursor:pointer}.team-add{padding:18px 20px;border-bottom:1px solid var(--admin-line);display:grid;gap:12px}.team-add small{display:block;opacity:.5;margin-top:4px}.team-form{display:grid;grid-template-columns:minmax(0,1fr) 180px auto;gap:8px}.team-form select{padding:10px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}.team-status{margin:0;font-size:.78rem;opacity:.6}.team-card{display:flex;justify-content:space-between;gap:16px;align-items:center}.team-person{display:flex;gap:13px;align-items:center;min-width:0}.team-avatar{width:50px;height:50px;border-radius:15px;display:grid;place-items:center;background:var(--admin-soft);border:1px solid var(--admin-line);font-weight:900;flex:0 0 auto}.team-person small{display:block;opacity:.42;word-break:break-all;margin-top:3px}.team-card select{border:1px solid var(--admin-line);background:#111;color:inherit;padding:9px 10px;border-radius:10px}@media(max-width:650px){.team-form{grid-template-columns:1fr}.team-card{display:block}.team-card .admin-actions{margin-top:14px}}';document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
