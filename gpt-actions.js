(()=>{'use strict';
const KEY='nzingaGPT.sessions.v2',ANON='nzingaGPT.anonymous',OPEN='nzingaGPT.open';
const isAnon=()=>sessionStorage.getItem(ANON)==='1';
const read=()=>{try{return JSON.parse((isAnon()?sessionStorage:localStorage).getItem(KEY)||'[]')}catch{return[]}};
const write=s=>{try{(isAnon()?sessionStorage:localStorage).setItem(KEY,JSON.stringify(s))}catch(e){console.warn(e)}};
const welcome='Olá. Não precisas escolher um modo. Podes simplesmente começar a falar comigo.';
const dateLabel=ts=>{try{return new Intl.DateTimeFormat('pt-AO',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(ts))}catch{return''}};
let drawer,backdrop,search;

function closeDrawer(){drawer?.classList.remove('open');backdrop?.classList.remove('open');drawer?.setAttribute('aria-hidden','true');document.getElementById('gptMenu')?.setAttribute('aria-expanded','false');document.body.classList.remove('gpt-drawer-open')}
function openDrawer(){drawer?.classList.add('open');backdrop?.classList.add('open');drawer?.setAttribute('aria-hidden','false');document.getElementById('gptMenu')?.setAttribute('aria-expanded','true');document.getElementById('gptHistorySearch')?.focus()}

function render(){
 const list=document.getElementById('gptHistoryList');if(!list)return;
 const term=(search?.value||'').trim().toLowerCase();
 if(isAnon()){list.innerHTML='<div class="gpt-history-empty">A conversa anónima não fica no histórico.</div>';return}
 const data=read().sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).filter(s=>{const t=s.messages?.find(m=>m.role==='user')?.content||'Nova conversa';return !term||t.toLowerCase().includes(term)});
 list.innerHTML=data.length?data.map(s=>{const t=s.messages?.find(m=>m.role==='user')?.content||'Nova conversa';const safe=String(t).slice(0,60).replace(/[&<>]/g,'');return '<div class="gpt-history-item"><button class="gpt-history-open" type="button" data-open="'+s.id+'"><span class="gpt-history-title">'+safe+'</span><small>'+dateLabel(s.updatedAt||s.createdAt)+'</small></button><button class="gpt-history-delete" type="button" data-delete="'+s.id+'" aria-label="Apagar conversa">×</button></div>'}).join(''):'<div class="gpt-history-empty">'+(term?'Nenhuma conversa encontrada.':'Ainda não há conversas guardadas.')+'</div>';
 list.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{sessionStorage.setItem(OPEN,b.dataset.open);closeDrawer();location.reload()});
 list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{write(read().filter(s=>s.id!==b.dataset.delete));render()});
}

function newConversation(){
 sessionStorage.removeItem(ANON);
 const s={id:crypto.randomUUID(),createdAt:Date.now(),updatedAt:Date.now(),messages:[{role:'assistant',content:welcome,time:Date.now()}]};
 const data=read();data.unshift(s);write(data.slice(0,20));sessionStorage.setItem(OPEN,s.id);closeDrawer();location.reload();
}
function anonymousConversation(){sessionStorage.setItem(ANON,'1');sessionStorage.removeItem(OPEN);closeDrawer();location.reload()}

function initDrawer(){
 drawer=document.getElementById('gptDrawer');backdrop=document.getElementById('gptDrawerBackdrop');search=document.getElementById('gptHistorySearch');
 if(!drawer)return;
 document.getElementById('gptMenu')?.addEventListener('click',()=>drawer.classList.contains('open')?closeDrawer():openDrawer());
 document.getElementById('gptClose')?.addEventListener('click',closeDrawer);
 backdrop?.addEventListener('click',closeDrawer);
 document.getElementById('gptNewTop')?.addEventListener('click',newConversation);
 document.getElementById('newGptConversation')?.addEventListener('click',newConversation);
 const anon=document.getElementById('anonymousGptConversation');
 anon?.addEventListener('click',anonymousConversation);
 if(isAnon()){anon?.classList.add('active');if(anon)anon.textContent='◉ Conversa anónima ativa'}
 search?.addEventListener('input',render);
 document.getElementById('gptClearHistory')?.addEventListener('click',()=>{if(isAnon()||!read().length)return;if(confirm('Apagar todo o histórico de conversas?')){write([]);render()}});
 render();
 window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
}

function initComposer(){
 const form=document.getElementById('chatForm'),input=document.getElementById('gptPrompt'),send=document.getElementById('sendBtn');if(!form||!input||!send||form.dataset.ready)return;form.dataset.ready='1';
 const resize=()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,180)+'px'};input.addEventListener('input',resize);resize();
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(Recognition){
  const mic=document.createElement('button');mic.type='button';mic.className='gpt-voice-btn';mic.title='Falar para escrever';mic.setAttribute('aria-label','Falar para escrever');mic.innerHTML='⌕';
  send.parentNode.insertBefore(mic,send);const r=new Recognition();r.lang='pt-AO';r.interimResults=true;r.continuous=false;let base='';
  r.onstart=()=>mic.classList.add('listening');r.onresult=e=>{let interim='',finalText='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=(finalText?' ':'')+t;else interim+=(interim?' ':'')+t}if(finalText)base+=(base?' ':'')+finalText;input.value=base+(interim?(base?' ':'')+interim:'');resize();if(finalText&&window.__nzingaVoiceMode?.()&&input.value.trim()&&!send.disabled)setTimeout(()=>form.requestSubmit(),120)};r.onend=()=>{mic.classList.remove('listening');base=''};mic.onclick=()=>{try{if(mic.classList.contains('listening'))r.stop();else{base=input.value.trim();r.start()}}catch{}}
 }
}

function addReliability(){
 const status=document.getElementById('status'),form=document.getElementById('chatForm'),input=document.getElementById('gptPrompt'),send=document.getElementById('sendBtn');if(!form||!input||!send)return;
 let latest=null;
 const AC=window.AbortController;if(AC&&!window.__nzingaAbortWrapped){const Native=AC;window.AbortController=class extends Native{constructor(){super();latest=this;window.__nzingaLatestAbortController=this}};window.__nzingaAbortWrapped=true}
 if(!window.__nzingaFetchWrapped){const native=window.fetch.bind(window);window.fetch=async(r,o)=>{const u=typeof r==='string'?r:r?.url||'';if(!u.includes('/api/chat'))return native(r,o);for(let i=0;;i++){try{return await native(r,o)}catch(e){if(o?.signal?.aborted||i>=2)throw e;await new Promise(x=>setTimeout(x,1200))}}};window.__nzingaFetchWrapped=true}
 let stop=document.getElementById('gptStopBtn');if(!stop){stop=document.createElement('button');stop.id='gptStopBtn';stop.type='button';stop.textContent='Parar';stop.hidden=true;send.parentNode.insertBefore(stop,send)}
 stop.onclick=()=>{window.__nzingaUserStopped=true;try{(window.__nzingaLatestAbortController||latest)?.abort()}catch{};stop.hidden=true};
 const obs=new MutationObserver(()=>{if(!status)return;const t=status.textContent||'';stop.hidden=!t.includes('A PENSAR')});if(status)obs.observe(status,{childList:true,characterData:true,subtree:true});
}

function addMessageTools(){
 const root=document.getElementById('messages'),send=document.getElementById('sendBtn');if(!root||root.dataset.tools)return;root.dataset.tools='1';
 const speak=t=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-AO';u.rate=.98;speechSynthesis.speak(u)};
 const copy=async t=>{try{await navigator.clipboard.writeText(t);return true}catch{return false}};
 const decorate=b=>{if(!b.classList.contains('assistant')||b.dataset.toolsReady||!b.textContent.trim()||b.textContent.trim()==='...')return;b.dataset.toolsReady='1';
  const bar=document.createElement('div');bar.className='gpt-message-tools';bar.innerHTML='<button type="button" data-a="like">♡</button><button type="button" data-a="copy">⧉</button><button type="button" data-a="listen">🔊</button><button type="button" data-a="share">↗</button><button type="button" data-a="regen">↻</button>';b.appendChild(bar);
  bar.onclick=async e=>{const x=e.target.closest('button');if(!x)return;const a=x.dataset.a,t=b.cloneNode(true).innerText;
   if(a==='like'){x.classList.toggle('active');x.textContent=x.classList.contains('active')?'♥':'♡'}
   if(a==='copy'){x.textContent=await copy(t)?'✓':'!';setTimeout(()=>x.textContent='⧉',900)}
   if(a==='listen'){if(speechSynthesis?.speaking){speechSynthesis.cancel();x.textContent='🔊'}else{x.textContent='■';speak(t);setTimeout(()=>x.textContent='🔊',1200)}}
   if(a==='share'){try{if(navigator.share)await navigator.share({title:'NzingaGPT',text:t});else await copy(t);x.textContent='✓';setTimeout(()=>x.textContent='↗',900)}catch{}}
   if(a==='regen'){const u=[...root.querySelectorAll('.bubble.user')].at(-1);if(u){const i=document.getElementById('gptPrompt');i.value=u.innerText;document.getElementById('chatForm')?.requestSubmit()}}
  };
 };
 new MutationObserver(()=>root.querySelectorAll('.bubble.assistant').forEach(decorate)).observe(root,{childList:true,subtree:true});
 let voiceMode=false;const voice=document.createElement('button');voice.type='button';voice.className='gpt-voice-mode';voice.textContent='◉ Voz';voice.title='Conversar por voz';send?.parentNode.insertBefore(voice,send);
 voice.onclick=()=>{voiceMode=!voiceMode;voice.classList.toggle('active',voiceMode);voice.textContent=voiceMode?'● Voz ativa':'◉ Voz';if(!voiceMode)speechSynthesis?.cancel()};window.__nzingaVoiceMode=()=>voiceMode;
 const status=document.getElementById('status');let spoken='';new MutationObserver(()=>{if(!voiceMode||!status?.textContent.includes('ONLINE'))return;const b=[...root.querySelectorAll('.bubble.assistant')].at(-1);if(b&&b.textContent.trim()&&b.textContent.trim()!=='...'&&!b.dataset.spoken){b.dataset.spoken='1';const t=b.innerText;if(t!==spoken){spoken=t;speak(t)}}}).observe(status,{childList:true,characterData:true,subtree:true});
}

function init(){
 initDrawer();initComposer();addReliability();addMessageTools();
 document.querySelectorAll('[data-gpt-mode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-gpt-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const map={ideia:'Quero explorar uma ideia comigo. Ajuda-me a desenvolver possibilidades concretas.',aprender:'Quero aprender sobre um assunto. Explica de forma clara e por etapas.',organizar:'Quero organizar uma tarefa ou problema. Ajuda-me a definir prioridades e passos.',escrever:'Quero escrever ou melhorar um texto. Ajuda-me a criar uma versão pronta para editar.'};const i=document.getElementById('gptPrompt');i.value=map[b.dataset.gptMode]||'';i.focus();i.dispatchEvent(new Event('input'))}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();