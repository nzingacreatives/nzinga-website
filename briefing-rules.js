(function(){
  'use strict';
  if(!location.pathname.endsWith('/servico.html') && !location.pathname.endsWith('servico.html')) return;

  const MAX_FILES=5;
  const MAX_FILE_BYTES=20*1024*1024;
  const MAX_TOTAL_BYTES=100*1024*1024;
  const WHATSAPP='https://wa.me/244949805066';

  function waitForForm(){
    const form=document.getElementById('orderForm');
    if(!form){setTimeout(waitForForm,100);return}
    setup(form);
  }

  function setup(form){
    if(form.dataset.briefingRulesReady==='1')return;
    form.dataset.briefingRulesReady='1';

    const deadline=document.getElementById('orderDeadline');
    if(deadline){
      const label=deadline.closest('label');
      if(label)label.remove();
    }

    const filesInput=document.getElementById('orderFiles');
    const fileList=document.getElementById('fileList');
    const status=document.getElementById('orderStatus');
    const accountBtn=document.getElementById('orderAccount');
    const whatsappBtn=document.getElementById('orderWhatsApp');
    const emailBtn=document.getElementById('orderEmail');

    const uploadLabel=filesInput&&filesInput.closest('.upload-zone');
    if(uploadLabel){
      const small=uploadLabel.querySelector('small');
      if(small)small.textContent='Até 5 ficheiros, 20 MB por ficheiro e 100 MB no total. O armazenamento é privado. Os ficheiros ficam disponíveis durante 7 dias e são apagados automaticamente depois desse período.';
    }

    if(!document.getElementById('briefWhatsappFallback')){
      const p=document.createElement('p');
      p.id='briefWhatsappFallback';
      p.className='brief-hint';
      p.innerHTML='Não consegues concluir o briefing? <a href="'+WHATSAPP+'?text='+encodeURIComponent('Olá, Nzinga Creatives. Não consegui concluir o briefing e quero enviar o pedido e os anexos diretamente pelo WhatsApp.')+'" target="_blank" rel="noopener">Envia o pedido e os anexos diretamente pelo WhatsApp.</a>';
      const actions=form.querySelector('.order-actions');
      if(actions)actions.parentNode.insertBefore(p,actions);
    }

    function selected(selector){return [...document.querySelectorAll(selector+':checked')].map(x=>x.value)}
    function makeId(){return (window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16)})}
    function data(){
      const qs=new URLSearchParams(location.search);
      const service=qs.get('servico')||'Serviço';
      const area=qs.get('area')||'';
      const experimental=area.toLowerCase().includes('multimédia');
      const goalInputs=[...document.querySelectorAll('#orderGoal')];
      let goal='';
      if(goalInputs.length>1) goal=goalInputs[1].value.trim();
      else if(goalInputs[0]) goal=goalInputs[0].value.trim();
      return {
        service,
        tier:experimental?'Experimental':(document.getElementById('orderTier')||{}).value||'Normal',
        name:(document.getElementById('orderName')||{}).value?.trim()||'',
        contact:(document.getElementById('orderContact')||{}).value?.trim()||'',
        location:(document.getElementById('orderLocation')||{}).value?.trim()||'',
        goal,
        audience:(document.getElementById('orderAudience')||{}).value?.trim()||'',
        use:(document.getElementById('orderUse')||{}).value?.trim()||'',
        format:(document.getElementById('orderFormat')||{}).value?.trim()||'',
        style:selected('#styleChoices input').concat((document.getElementById('orderStyleOther')||{}).value?.trim()||'').filter(Boolean).join(', '),
        colors:selected('#colorPalette input').concat((document.getElementById('orderColorOther')||{}).value?.trim()||'').filter(Boolean).join(', '),
        references:(document.getElementById('orderReferences')||{}).value?.trim()||'',
        idea:(document.getElementById('orderIdea')||{}).value?.trim()||'',
        files:filesInput?[...filesInput.files]:[]
      };
    }
    function validateFiles(files){
      if(files.length>MAX_FILES)throw new Error('Seleciona no máximo 5 ficheiros.');
      const total=files.reduce((n,f)=>n+f.size,0);
      if(total>MAX_TOTAL_BYTES)throw new Error('O conjunto dos ficheiros não pode ultrapassar 100 MB.');
      for(const f of files)if(f.size>MAX_FILE_BYTES)throw new Error('O ficheiro '+f.name+' ultrapassa 20 MB.');
    }
    function message(o,paths){
      return 'Olá, Nzinga Creatives. Quero '+(o.tier==='Experimental'?'manifestar interesse no serviço experimental ':'encomendar ')+o.service+'.\n'+
        'Nome: '+o.name+'\nWhatsApp / contacto: '+o.contact+'\nLocalização: '+o.location+'\nTipo: '+o.tier+'\n'+
        'Objetivo: '+(o.goal||'A conversar')+'\nPúblico-alvo: '+(o.audience||'A definir')+'\nUtilização: '+(o.use||'A definir')+'\n'+
        'Formato: '+(o.format||'A definir')+'\nEstilo pretendido: '+(o.style||'A definir')+'\nCores escolhidas: '+(o.colors||'A definir')+'\n'+
        'Referências: '+(o.references||'A conversar')+'\nIdeia e detalhes: '+o.idea+'\nFicheiros guardados: '+(paths.length?paths.join(', '):'Nenhum')+'\n\n'+
        'Os ficheiros enviados para o briefing ficam em armazenamento privado durante 7 dias e são apagados automaticamente depois desse período.';
    }
    async function client(){
      if(!window.supabase||!window.NZINGA_SUPABASE)throw new Error('Não foi possível ligar ao armazenamento.');
      return window.__nzingaBriefingRulesClient||(window.__nzingaBriefingRulesClient=window.supabase.createClient(window.NZINGA_SUPABASE.url,window.NZINGA_SUPABASE.publishableKey));
    }
    async function upload(sb,session,o){
      validateFiles(o.files);
      if(!o.files.length)return [];
      const id=makeId(),folder=session?session.user.id:'guest',paths=[];
      for(let i=0;i<o.files.length;i++){
        const f=o.files[i];
        const safe=f.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(-100);
        const path=folder+'/'+id+'/'+(i+1)+'-'+safe;
        status.textContent='A enviar ficheiros ('+(i+1)+'/'+o.files.length+')…';
        const result=await sb.storage.from('project-briefs').upload(path,f,{contentType:f.type||'application/octet-stream',upsert:false});
        if(result.error)throw result.error;
        paths.push(path);
      }
      return paths;
    }

    if(filesInput)filesInput.addEventListener('change',function(){
      try{validateFiles([...filesInput.files]);fileList.textContent=filesInput.files.length?[...filesInput.files].map(f=>f.name+' ('+(f.size/1048576).toFixed(1)+' MB)').join(' · '):'Ainda não selecionaste ficheiros.';status.textContent=''}
      catch(e){fileList.textContent=e.message;status.textContent=e.message;filesInput.value=''}
    });

    async function runWhatsApp(){
      if(!form.reportValidity())return;
      let popup=window.open('about:blank','_blank');
      if(!popup){status.textContent='Permite a abertura de janelas para continuar pelo WhatsApp.';return}
      whatsappBtn.disabled=true;
      try{const sb=await client(),auth=await sb.auth.getSession(),o=data(),paths=await upload(sb,auth.data.session,o);popup.location.href=WHATSAPP+'?text='+encodeURIComponent(message(o,paths))}
      catch(e){popup.close();status.textContent='Não foi possível preparar o pedido: '+(e.message||'erro no envio dos ficheiros')}
      finally{whatsappBtn.disabled=false}
    }
    async function runEmail(){
      if(!form.reportValidity())return;
      emailBtn.disabled=true;
      try{const sb=await client(),auth=await sb.auth.getSession(),o=data(),paths=await upload(sb,auth.data.session,o);location.href='mailto:nzingacreatives@gmail.com?subject='+encodeURIComponent('Pedido Nzinga — '+o.service)+'&body='+encodeURIComponent(message(o,paths))}
      catch(e){status.textContent='Não foi possível preparar o pedido: '+(e.message||'erro no envio dos ficheiros')}
      finally{emailBtn.disabled=false}
    }
    async function runAccount(){
      if(!form.reportValidity())return;
      accountBtn.disabled=true;
      try{const sb=await client(),auth=await sb.auth.getSession(),session=auth.data.session;if(!session){status.textContent='Entra na tua conta para guardar o pedido e os ficheiros. Também podes continuar pelo WhatsApp.';return}const o=data(),paths=await upload(sb,session,o);const idea=[o.idea,'Objetivo: '+o.goal,'Público-alvo: '+o.audience,'Utilização: '+o.use,'Formato: '+o.format,'Estilo: '+o.style,'Cores: '+o.colors,'Localização: '+o.location,'Referências: '+o.references,'Ficheiros no armazenamento (retenção: 7 dias): '+paths.join(', ')].filter(Boolean).join('\n\n');const saved=await sb.from('orders').insert({user_id:session.user.id,service:o.service,tier:o.tier,name:o.name,contact:o.contact,idea,status:'Pedido iniciado'});if(saved.error)throw saved.error;status.textContent=o.tier==='Experimental'?'Interesse registado na tua conta.':'Pedido guardado na tua conta. A equipa entrará em contacto.';form.reset();fileList.textContent='Ainda não selecionaste ficheiros.'}
      catch(e){status.textContent='Não foi possível guardar o pedido: '+(e.message||'erro inesperado')}
      finally{accountBtn.disabled=false}
    }
    whatsappBtn.onclick=runWhatsApp;
    emailBtn.onclick=runEmail;
    accountBtn.onclick=runAccount;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitForForm);else waitForForm();
})();
