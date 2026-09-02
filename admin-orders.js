/* Nzinga Admin — gestão avançada de pedidos. Mantém a lógica existente e acrescenta pesquisa, filtros e detalhe completo. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase || !window.NZINGA_SUPABASE || !document.getElementById('panel-orders')) return;
    var sb=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey);
    var panel=document.getElementById('panel-orders');
    var lastSignature='';

    var style=document.createElement('style');
    style.textContent=''+
      '.orders-tools{padding:14px 20px;border-bottom:1px solid var(--admin-line);display:grid;grid-template-columns:minmax(180px,1fr) 190px auto;gap:8px;background:var(--admin-soft)}'+
      '.orders-tools input,.orders-tools select{width:100%;box-sizing:border-box;padding:10px 11px;border:1px solid var(--admin-line);border-radius:10px;background:#0b0b0b;color:inherit;font:inherit}'+
      '.orders-tools button{border:1px solid var(--admin-line);border-radius:10px;background:#fff;color:#050505;font-weight:800;padding:10px 14px;cursor:pointer}'+
      '.order-hidden{display:none!important}'+
      '.order-details{margin-top:12px;padding:14px;border:1px solid var(--admin-line);border-radius:14px;background:var(--admin-soft);display:grid;gap:8px}'+
      '.order-details dl{margin:0;display:grid;grid-template-columns:150px 1fr;gap:7px 12px;font-size:.84rem}'+
      '.order-details dt{opacity:.52}.order-details dd{margin:0;word-break:break-word}'+
      '.order-detail-btn{border:1px solid var(--admin-line)!important;background:transparent!important;color:inherit!important;font-weight:500!important}'+
      '.orders-count-note{font-size:.76rem;opacity:.55;padding:0 20px 12px}'+
      '@media(max-width:600px){.orders-tools{grid-template-columns:1fr}.order-details dl{grid-template-columns:1fr}.order-details dt{margin-top:5px}}';
    document.head.appendChild(style);

    function esc(value){return String(value==null?'':value).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
    function formatValue(key,value){
      if(value==null||value==='')return '—';
      if(key==='created_at'||key.endsWith('_at')){var d=new Date(value);if(!isNaN(d))return d.toLocaleString('pt-AO')}
      if(typeof value==='object')return JSON.stringify(value,null,2);
      return String(value);
    }

    function installTools(){
      if(panel.querySelector('.orders-tools'))return;
      var head=panel.querySelector('.panel-head');
      if(!head)return;
      var tools=document.createElement('div');
      tools.className='orders-tools';
      tools.innerHTML='<input id="ordersSearch" type="search" placeholder="Pesquisar por cliente, contacto ou serviço…" aria-label="Pesquisar pedidos">'+
        '<select id="ordersStatus" aria-label="Filtrar por estado"><option value="">Todos os estados</option><option>Pedido iniciado</option><option>Aguardando pagamento</option><option>Em produção</option><option>Concluído</option><option>Cancelado</option></select>'+
        '<button id="ordersRefresh" type="button">Atualizar</button>';
      head.insertAdjacentElement('afterend',tools);
      var note=document.createElement('div');note.className='orders-count-note';note.id='ordersCountNote';tools.insertAdjacentElement('afterend',note);
      tools.querySelector('#ordersSearch').addEventListener('input',filter);
      tools.querySelector('#ordersStatus').addEventListener('change',filter);
      tools.querySelector('#ordersRefresh').addEventListener('click',function(){location.reload()});
    }

    function filter(){
      var q=(document.getElementById('ordersSearch')?.value||'').toLowerCase().trim();
      var status=document.getElementById('ordersStatus')?.value||'';
      var cards=panel.querySelectorAll('.admin-card');var visible=0;
      cards.forEach(function(card){
        var text=card.textContent.toLowerCase();
        var matchText=!q||text.indexOf(q)!==-1;
        var matchStatus=!status||text.indexOf(status.toLowerCase())!==-1;
        var show=matchText&&matchStatus;card.classList.toggle('order-hidden',!show);if(show)visible++;
      });
      var note=document.getElementById('ordersCountNote');if(note)note.textContent=visible+' pedido'+(visible===1?'':'s')+' visível'+(visible===1?'':'is');
    }

    function enhanceCards(){
      panel.querySelectorAll('.admin-card').forEach(function(card){
        if(card.dataset.enhanced==='1')return;
        var form=card.querySelector('[data-order]');if(!form)return;
        var id=form.dataset.order;
        var button=document.createElement('button');button.type='button';button.className='order-detail-btn';button.textContent='Ver pedido completo';
        button.addEventListener('click',async function(){
          var old=card.querySelector('.order-details');
          if(old){old.remove();button.textContent='Ver pedido completo';return}
          button.disabled=true;button.textContent='A carregar…';
          try{
            var result=await sb.from('orders').select('*').eq('id',id).maybeSingle();
            if(result.error)throw result.error;
            var data=result.data;if(!data)throw new Error('Pedido não encontrado');
            var details=document.createElement('div');details.className='order-details';
            var dl=document.createElement('dl');
            Object.keys(data).forEach(function(key){var dt=document.createElement('dt');dt.textContent=key;var dd=document.createElement('dd');dd.textContent=formatValue(key,data[key]);dl.append(dt,dd)});
            details.appendChild(dl);card.appendChild(details);button.textContent='Fechar detalhes';
          }catch(error){console.error('Order details:',error);alert('Não foi possível carregar os detalhes deste pedido.')}finally{button.disabled=false}
        });
        form.appendChild(button);card.dataset.enhanced='1';
      });
      filter();
    }

    function watch(){
      var signature=panel.innerHTML.length+'|'+panel.querySelectorAll('.admin-card').length;
      if(signature!==lastSignature){lastSignature=signature;installTools();enhanceCards();}
    }
    new MutationObserver(function(){setTimeout(watch,0)}).observe(panel,{childList:true,subtree:true});
    setTimeout(watch,300);
    setTimeout(watch,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
