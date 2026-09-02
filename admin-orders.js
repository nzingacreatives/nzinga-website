/* Nzinga Admin — ferramentas avançadas para Pedidos e Market. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase || !window.NZINGA_SUPABASE) return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);

    /* ---------- PEDIDOS ---------- */
    var ordersPanel=document.getElementById('panel-orders');
    if(ordersPanel) startOrders(sb,ordersPanel);

    /* ---------- MARKET ---------- */
    var marketPanel=document.getElementById('panel-products');
    if(marketPanel) startMarket(sb,marketPanel);
  }

  function esc(value){return String(value==null?'':value).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
  function formatValue(key,value){
    if(value==null||value==='')return '—';
    if(key==='created_at'||key.endsWith('_at')){var d=new Date(value);if(!isNaN(d))return d.toLocaleString('pt-AO')}
    if(typeof value==='object')return JSON.stringify(value,null,2);
    return String(value);
  }

  function startOrders(sb,panel){
    var lastSignature='';
    addStyle('nzinga-orders-style',''+
      '.orders-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 190px auto;gap:8px;background:var(--admin-soft)}'+
      '.orders-tools input,.orders-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}'+
      '.orders-tools button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}'+
      '.order-hidden{display:none!important}.order-details{margin-top:12px;padding:14px;border:1px solid var(--admin-line);border-radius:14px;background:var(--admin-soft);display:grid;gap:8px}.order-details dl{margin:0;display:grid;grid-template-columns:150px 1fr;gap:7px 12px;font-size:.84rem}.order-details dt{opacity:.52}.order-details dd{margin:0;word-break:break-word}.order-detail-btn{border:1px solid var(--admin-line)!important;background:transparent!important;color:inherit!important;font-weight:500!important}.orders-count-note{font-size:.76rem;opacity:.55;padding:0 20px 12px}@media(max-width:600px){.orders-tools{grid-template-columns:1fr}.order-details dl{grid-template-columns:1fr}.order-details dt{margin-top:5px}}');
    function installTools(){
      if(panel.querySelector('.orders-tools'))return;
      var head=panel.querySelector('.panel-head');if(!head)return;
      var tools=document.createElement('div');tools.className='orders-tools';
      tools.innerHTML='<input id="ordersSearch" type="search" placeholder="Pesquisar por cliente, contacto ou serviço…" aria-label="Pesquisar pedidos">'+
        '<select id="ordersStatus" aria-label="Filtrar por estado"><option value="">Todos os estados</option><option>Pedido iniciado</option><option>Aguardando pagamento</option><option>Em produção</option><option>Concluído</option><option>Cancelado</option></select><button id="ordersRefresh" type="button">Atualizar</button>';
      head.insertAdjacentElement('afterend',tools);
      var note=document.createElement('div');note.className='orders-count-note';note.id='ordersCountNote';tools.insertAdjacentElement('afterend',note);
      tools.querySelector('#ordersSearch').addEventListener('input',filter);tools.querySelector('#ordersStatus').addEventListener('change',filter);tools.querySelector('#ordersRefresh').addEventListener('click',function(){location.reload()});
    }
    function filter(){
      var q=(document.getElementById('ordersSearch')?.value||'').toLowerCase().trim(),status=document.getElementById('ordersStatus')?.value||'',cards=panel.querySelectorAll('.admin-card'),visible=0;
      cards.forEach(function(card){var text=card.textContent.toLowerCase();var show=(!q||text.indexOf(q)!==-1)&&(!status||text.indexOf(status.toLowerCase())!==-1);card.classList.toggle('order-hidden',!show);if(show)visible++});
      var note=document.getElementById('ordersCountNote');if(note)note.textContent=visible+' pedido'+(visible===1?'':'s')+' visível'+(visible===1?'':'is');
    }
    function enhanceCards(){
      panel.querySelectorAll('.admin-card').forEach(function(card){if(card.dataset.enhanced==='1')return;var form=card.querySelector('[data-order]');if(!form)return;var id=form.dataset.order;
        var button=document.createElement('button');button.type='button';button.className='order-detail-btn';button.textContent='Ver pedido completo';
        button.addEventListener('click',async function(){var old=card.querySelector('.order-details');if(old){old.remove();button.textContent='Ver pedido completo';return}button.disabled=true;button.textContent='A carregar…';try{var result=await sb.from('orders').select('*').eq('id',id).maybeSingle();if(result.error)throw result.error;if(!result.data)throw new Error('Pedido não encontrado');var details=document.createElement('div');details.className='order-details';var dl=document.createElement('dl');Object.keys(result.data).forEach(function(key){var dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=formatValue(key,result.data[key]);dl.append(dt,dd)});details.appendChild(dl);card.appendChild(details);button.textContent='Fechar detalhes'}catch(error){console.error('Order details:',error);alert('Não foi possível carregar os detalhes deste pedido.')}finally{button.disabled=false}});
        form.appendChild(button);card.dataset.enhanced='1';
      });filter();
    }
    function watch(){var signature=panel.innerHTML.length+'|'+panel.querySelectorAll('.admin-card').length;if(signature!==lastSignature){lastSignature=signature;installTools();enhanceCards()}}
    new MutationObserver(function(){setTimeout(watch,0)}).observe(panel,{childList:true,subtree:true});setTimeout(watch,300);setTimeout(watch,1200);
  }

  function startMarket(sb,panel){
    var adminUser=null,lastSignature='';
    addStyle('nzinga-market-style',''+
      '.market-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 170px 170px auto;gap:8px;background:var(--admin-soft)}'+
      '.market-tools input,.market-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}'+
      '.market-tools button,.market-create button,.market-editor button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}'+
      '.market-create{margin:14px 20px;padding:16px;border:1px solid var(--admin-line);border-radius:16px;background:var(--admin-soft);display:grid;gap:10px}.market-create-grid,.market-editor-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px}.market-create input,.market-create textarea,.market-create select,.market-editor input,.market-editor textarea,.market-editor select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:9px;background:#0b0b0b;color:inherit;font:inherit}.market-create textarea,.market-editor textarea{min-height:80px;resize:vertical}.market-create h3{margin:0;font-size:1rem}.market-create .status,.market-editor .status{font-size:.8rem;opacity:.7;min-height:1em}.market-hidden{display:none!important}.market-badge{display:inline-block;padding:4px 8px;border:1px solid var(--admin-line);border-radius:999px;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em}.market-editor{margin-top:12px;padding:14px;border:1px solid var(--admin-line);border-radius:14px;background:var(--admin-soft);display:grid;gap:9px}.market-editor-grid{grid-template-columns:2fr 1fr 1fr 1fr}.market-count-note{font-size:.76rem;opacity:.55;padding:0 20px 12px}@media(max-width:700px){.market-tools,.market-create-grid,.market-editor-grid{grid-template-columns:1fr}}');
    sb.auth.getSession().then(function(r){adminUser=r?.data?.session?.user||null;watch()});

    function categories(){return ['Digital','Design','Branding','Conteúdo','Web','Multimédia','Educação','Templates','Outros']}
    function statuses(){return ['draft','pending','published','archived','rejected']}
    function labelStatus(s){return ({draft:'Rascunho',pending:'Em análise',published:'Publicado',archived:'Arquivado',rejected:'Rejeitado'})[s]||s||'Rascunho'}
    function installMarketTools(){
      if(panel.querySelector('.market-tools'))return;
      var head=panel.querySelector('.panel-head');if(!head)return;
      var tools=document.createElement('div');tools.className='market-tools';
      tools.innerHTML='<input id="marketSearch" type="search" placeholder="Pesquisar produto…" aria-label="Pesquisar produtos">'+
        '<select id="marketCategory"><option value="">Todas as categorias</option>'+categories().map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select>'+
        '<select id="marketStatus"><option value="">Todos os estados</option>'+statuses().map(function(s){return '<option value="'+s+'">'+esc(labelStatus(s))+'</option>'}).join('')+'</select>'+
        '<button id="marketRefresh" type="button">Atualizar</button>';
      head.insertAdjacentElement('afterend',tools);
      var create=document.createElement('form');create.className='market-create';create.id='marketCreate';create.innerHTML='<h3>+ Criar produto</h3><div class="market-create-grid"><input name="title" maxlength="120" required placeholder="Nome do produto"><input name="price" type="number" min="0" step="0.01" required placeholder="Preço (AOA)"><select name="category">'+categories().map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select></div><textarea name="description" maxlength="2000" placeholder="Descrição do produto"></textarea><div><button type="submit">Criar como rascunho</button></div><div class="status"></div>';
      tools.insertAdjacentElement('afterend',create);
      var note=document.createElement('div');note.className='market-count-note';note.id='marketCountNote';create.insertAdjacentElement('afterend',note);
      tools.querySelector('#marketSearch').addEventListener('input',filterMarket);tools.querySelector('#marketCategory').addEventListener('change',filterMarket);tools.querySelector('#marketStatus').addEventListener('change',filterMarket);tools.querySelector('#marketRefresh').addEventListener('click',function(){location.reload()});
      create.addEventListener('submit',createProduct);
    }
    async function createProduct(event){
      event.preventDefault();var form=event.currentTarget,status=form.querySelector('.status'),fd=new FormData(form);status.textContent='A criar…';
      if(!adminUser){status.textContent='Sessão administrativa não encontrada.';return}
      var payload={creator_id:adminUser.id,title:String(fd.get('title')||'').trim(),description:String(fd.get('description')||'').trim(),price:Number(fd.get('price')||0),currency:'AOA',category:String(fd.get('category')||'Digital'),status:'draft'};
      if(!payload.title){status.textContent='Indica um nome.';return}
      var result=await sb.from('market_products').insert(payload).select().single();
      if(result.error){console.error('Market create:',result.error);status.textContent='Erro ao criar: '+(result.error.message||'sem permissão');return}
      form.reset();status.textContent='Produto criado como rascunho.';await waitAndWatch();
    }
    function filterMarket(){
      var q=(document.getElementById('marketSearch')?.value||'').toLowerCase().trim(),cat=document.getElementById('marketCategory')?.value||'',stat=document.getElementById('marketStatus')?.value||'',cards=panel.querySelectorAll('.admin-card'),visible=0;
      cards.forEach(function(card){var text=card.textContent.toLowerCase();var show=(!q||text.indexOf(q)!==-1)&&(!cat||text.indexOf(cat.toLowerCase())!==-1)&&(!stat||text.indexOf(labelStatus(stat).toLowerCase())!==-1||text.indexOf(stat.toLowerCase())!==-1);card.classList.toggle('market-hidden',!show);if(show)visible++});
      var note=document.getElementById('marketCountNote');if(note)note.textContent=visible+' produto'+(visible===1?'':'s')+' visível'+(visible===1?'':'is');
    }
    function enhanceMarketCards(){
      panel.querySelectorAll('.admin-card').forEach(function(card){if(card.dataset.marketEnhanced==='1')return;
        var meta=card.querySelector('.admin-meta'),edit=card.querySelector('[data-edit]');if(!meta||!edit)return;var id=edit.dataset.edit;
        /* Add a real status selector without removing the existing moderation controls. */
        var actions=card.querySelector('.admin-actions');if(!actions)return;
        var statusBox=document.createElement('select');statusBox.setAttribute('aria-label','Estado do produto');statusBox.innerHTML=statuses().map(function(s){return '<option value="'+s+'">'+esc(labelStatus(s))+'</option>'}).join('');
        var statusText=(meta.textContent||'').toLowerCase();var current=statuses().find(function(s){return statusText.indexOf(s)!==-1||statusText.indexOf(labelStatus(s).toLowerCase())!==-1})||'draft';statusBox.value=current;
        statusBox.addEventListener('change',async function(){var old=statusBox.value;statusBox.disabled=true;var patch={status:old,updated_at:new Date().toISOString()};if(old==='published'){patch.rejection_reason=null;patch.reviewed_at=new Date().toISOString();if(adminUser)patch.reviewed_by=adminUser.id}var result=await sb.from('market_products').update(patch).eq('id',id);if(result.error){alert('Não foi possível alterar o estado: '+result.error.message);statusBox.value=current}else{await waitAndWatch()};statusBox.disabled=false});
        actions.appendChild(statusBox);

        /* Replace the small legacy editor with a richer editor that includes category and currency. */
        var legacy=card.querySelector('[data-form]');
        if(legacy){legacy.hidden=true;var editor=document.createElement('form');editor.className='market-editor';editor.dataset.marketEditor=id;editor.hidden=true;editor.innerHTML='<div class="market-editor-grid"><input name="title" maxlength="120" required><input name="price" type="number" min="0" step="0.01" required><select name="currency"><option>AOA</option><option>USD</option><option>EUR</option></select><select name="category">'+categories().map(function(c){return '<option>'+esc(c)+'</option>'}).join('')+'</select></div><textarea name="description" maxlength="2000"></textarea><div><button type="submit">Guardar produto</button></div><div class="status"></div>';
          actions.insertAdjacentElement('afterend',editor);var legacyEdit=edit;legacyEdit.textContent='Editar produto';legacyEdit.addEventListener('click',async function(e){e.preventDefault();editor.hidden=!editor.hidden;if(!editor.hidden){var r=await sb.from('market_products').select('title,description,price,currency,category').eq('id',id).single();if(!r.error&&r.data){editor.elements.title.value=r.data.title||'';editor.elements.description.value=r.data.description||'';editor.elements.price.value=r.data.price||0;editor.elements.currency.value=r.data.currency||'AOA';editor.elements.category.value=r.data.category||'Digital'}}});
          editor.addEventListener('submit',async function(e){e.preventDefault();var fd=new FormData(editor),patch={title:String(fd.get('title')||'').trim(),description:String(fd.get('description')||'').trim(),price:Number(fd.get('price')||0),currency:String(fd.get('currency')||'AOA'),category:String(fd.get('category')||'Digital'),updated_at:new Date().toISOString()};var r=await sb.from('market_products').update(patch).eq('id',id);editor.querySelector('.status').textContent=r.error?'Erro: '+r.error.message:'Produto atualizado.';if(!r.error)await waitAndWatch()});
        }
        card.dataset.marketEnhanced='1';
      });filterMarket();
    }
    async function waitAndWatch(){setTimeout(watch,150);setTimeout(watch,600)}
    function watch(){var signature=panel.innerHTML.length+'|'+panel.querySelectorAll('.admin-card').length;if(signature!==lastSignature){lastSignature=signature;installMarketTools();enhanceMarketCards()}else{filterMarket()}}
    new MutationObserver(function(){setTimeout(watch,0)}).observe(panel,{childList:true,subtree:true});setTimeout(watch,250);setTimeout(watch,1000);setTimeout(watch,2200);
  }

  function addStyle(id,css){if(document.getElementById(id))return;var style=document.createElement('style');style.id=id;style.textContent=css;document.head.appendChild(style)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();