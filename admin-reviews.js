/* Nzinga Admin — moderação de avaliações. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase||!window.NZINGA_SUPABASE)return;
    var panel=document.getElementById('panel-reviews'); if(!panel)return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey),admin=null,rows=[];
    addStyle(); sb.auth.getSession().then(function(r){admin=r?.data?.session?.user||null;load()});
    function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function date(v){var d=new Date(v);return isNaN(d)?'—':d.toLocaleString('pt-AO')}
    function label(s){return s==='hidden'?'Oculta':'Publicada'}
    async function load(){
      panel.innerHTML='<div class="panel-head"><h2>Avaliações</h2><span>A carregar…</span></div><div class="empty">A carregar avaliações…</div>';
      var r=await sb.from('reviews').select('*').order('created_at',{ascending:false});
      if(r.error){panel.innerHTML='<div class="empty"><strong>Não foi possível carregar as avaliações.</strong>'+esc(r.error.message)+'</div>';return}
      rows=r.data||[];render();
    }
    function render(){
      var q=(document.getElementById('reviewsSearch')?.value||'').toLowerCase().trim(),f=document.getElementById('reviewsFilter')?.value||'';
      var list=rows.filter(function(x){var text=[x.text,x.user_id,x.status,x.stars].join(' ').toLowerCase();return (!q||text.indexOf(q)!==-1)&&(!f||x.status===f)});
      panel.innerHTML='<div class="panel-head"><h2>Avaliações</h2><span>'+rows.length+' registo'+(rows.length===1?'':'s')+'</span></div><div class="reviews-tools"><input id="reviewsSearch" type="search" placeholder="Pesquisar avaliação, utilizador ou estrelas…"><select id="reviewsFilter"><option value="">Todos os estados</option><option value="published">Publicadas</option><option value="hidden">Ocultas</option></select><button id="reviewsRefresh" type="button">Atualizar</button></div><div class="reviews-count">'+list.length+' avaliação'+(list.length===1?'':'ções')+' visível'+(list.length===1?'':'is')+'</div>';
      document.getElementById('reviewsSearch').value=q;document.getElementById('reviewsFilter').value=f;
      document.getElementById('reviewsSearch').oninput=render;document.getElementById('reviewsFilter').onchange=render;document.getElementById('reviewsRefresh').onclick=load;
      if(!list.length){var e=document.createElement('div');e.className='empty';e.innerHTML='<strong>Nenhuma avaliação encontrada</strong>Ajusta a pesquisa ou o filtro.';panel.appendChild(e);return}
      list.forEach(function(x){var card=document.createElement('article');card.className='admin-card';card.innerHTML='<span class="admin-meta">'+label(x.status)+' · '+esc(x.stars)+' ★ · '+esc(date(x.created_at))+'</span><p class="review-text">'+esc(x.text||'Sem comentário')+'</p><small class="review-id">Utilizador: '+esc(x.user_id)+'</small>'+(x.moderated_at?'<p class="admin-meta">Moderada em '+esc(date(x.moderated_at))+'</p>':'')+'<div class="admin-actions"><button type="button" class="approve">'+(x.status==='published'?'Ocultar':'Publicar')+'</button><button type="button" data-review-details>Ver detalhes</button></div>';
        card.querySelector('.approve').onclick=function(){moderate(x.id,x.status==='published'?'hidden':'published')};card.querySelector('[data-review-details]').onclick=function(){details(card,x)};panel.appendChild(card)});
    }
    async function moderate(id,status){if(!admin)return;var r=await sb.from('reviews').update({status:status,moderated_at:new Date().toISOString(),moderated_by:admin.id}).eq('id',id);if(r.error){alert('Não foi possível moderar: '+r.error.message);return}await load()}
    function details(card,x){var old=card.querySelector('.review-details');if(old){old.remove();return}var d=document.createElement('div');d.className='review-details';d.innerHTML='<dl><dt>ID da avaliação</dt><dd>'+esc(x.id)+'</dd><dt>Utilizador</dt><dd>'+esc(x.user_id)+'</dd><dt>Classificação</dt><dd>'+esc(x.stars)+' / 5</dd><dt>Estado</dt><dd>'+esc(label(x.status))+'</dd><dt>Criada</dt><dd>'+esc(date(x.created_at))+'</dd><dt>Moderada</dt><dd>'+esc(date(x.moderated_at))+'</dd><dt>Moderador</dt><dd>'+esc(x.moderated_by||'—')+'</dd></dl>';card.appendChild(d)}
    function addStyle(){var s=document.createElement('style');s.textContent='.reviews-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 190px auto;gap:8px;background:var(--admin-soft)}.reviews-tools input,.reviews-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}.reviews-tools button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}.reviews-count{font-size:.76rem;opacity:.55;padding:0 20px 12px}.review-text{font-size:1rem;line-height:1.6}.review-id{opacity:.4;word-break:break-all}.review-details{margin-top:12px;padding:14px;border:1px solid var(--admin-line);border-radius:14px;background:var(--admin-soft)}.review-details dl{margin:0;display:grid;grid-template-columns:150px 1fr;gap:7px 12px;font-size:.84rem}.review-details dt{opacity:.5}.review-details dd{margin:0;word-break:break-word}@media(max-width:650px){.reviews-tools{grid-template-columns:1fr}.review-details dl{grid-template-columns:1fr}}';document.head.appendChild(s)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
