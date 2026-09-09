/* Nzinga account — direct support chat with the Nzinga team. */
(function(){
'use strict';
function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn()}
ready(async function(){
  if(!location.pathname.endsWith('minha-nzinga.html'))return;
  var cfg=window.NZINGA_SUPABASE;if(!window.supabase||!cfg)return;
  var sb=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}),$=id=>document.getElementById(id);
  var session=(await sb.auth.getSession()).data?.session;if(!session)return;
  var grid=$('accountGrid');if(!grid||document.getElementById('supportPanel'))return;
  var panel=document.createElement('section');panel.className='panel';panel.id='supportPanel';panel.style.gridColumn='1/-1';panel.innerHTML='<h2>Falar com a Nzinga</h2><p style="color:var(--muted);margin-top:-10px">Envia uma mensagem para a equipa. A resposta aparecerá aqui na tua conta.</p><div id="supportThread" class="support-thread"><div class="empty">A carregar mensagens…</div></div><form id="supportForm" class="support-form"><textarea name="content" maxlength="5000" placeholder="Escreve a tua mensagem…" required></textarea><button class="button button-main" type="submit">Enviar mensagem →</button><p id="supportStatus" style="min-height:1.2em"></p></form>';
  grid.insertBefore(panel,grid.firstElementChild?.nextElementSibling||grid.firstChild);
  var css=document.createElement('style');css.textContent=`
    #supportPanel{animation:nzFadeUp .45s ease both}.support-thread{min-height:90px;max-height:420px;overflow:auto;border:2px solid var(--line);border-radius:14px;padding:14px;background:rgba(127,127,127,.04);margin:16px 0}.support-bubble{max-width:82%;padding:11px 13px;border:1px solid var(--line);border-radius:14px;background:var(--paper);margin:0 0 10px;line-height:1.5}.support-bubble.admin{margin-left:auto;background:#fff0f0;border-color:#efb4b7}.support-bubble small{display:block;margin-top:5px;color:var(--muted);font-size:.68rem}.support-form{display:grid;gap:9px}.support-form textarea{width:100%;min-height:90px;resize:vertical;padding:13px;border:2px solid var(--black);border-radius:12px;background:transparent;color:var(--ink);font:inherit}.support-form textarea:focus{border-color:var(--red);box-shadow:0 0 0 3px rgba(201,21,16,.12);outline:none}.support-form button:disabled{opacity:.55;cursor:not-allowed}
    html[data-nzinga-theme="dark"] .support-bubble.admin{background:#3a1719;border-color:#a90f15}html[data-nzinga-theme="dark"] .support-form textarea{color:#fff;border-color:#fff;background:#121826}
  `;document.head.appendChild(css);
  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
  function fmt(v){return new Date(v).toLocaleString('pt-AO',{dateStyle:'short',timeStyle:'short'})}
  async function load(){
    var thread=$('supportThread');var c=await sb.from('support_conversations').select('id,subject,updated_at').eq('user_id',session.user.id).order('updated_at',{ascending:false}).limit(1);if(c.error){thread.innerHTML='<div class="empty">Não foi possível carregar as mensagens.</div>';return}
    var conv=c.data?.[0];if(!conv){thread.innerHTML='<div class="empty">Ainda não tens mensagens. Escreve a primeira e fala diretamente com a equipa Nzinga.</div>';return}
    var r=await sb.from('support_messages').select('id,sender_type,content,created_at,read_by_user').eq('conversation_id',conv.id).order('created_at',{ascending:true});if(r.error){thread.innerHTML='<div class="empty">Não foi possível carregar a conversa.</div>';return}
    var msgs=r.data||[];thread.innerHTML=msgs.length?msgs.map(m=>'<article class="support-bubble '+(m.sender_type==='admin'?'admin':'user')+'"><div>'+esc(m.content).replace(/\n/g,'<br>')+'</div><small>'+(m.sender_type==='admin'?'Nzinga':'Tu')+' · '+fmt(m.created_at)+'</small></article>').join(''):'<div class="empty">Sem mensagens.</div>';thread.scrollTop=thread.scrollHeight;
    var unread=msgs.filter(m=>m.sender_type==='admin'&&!m.read_by_user).map(m=>m.id);if(unread.length)await sb.from('support_messages').update({read_by_user:true}).in('id',unread);
  }
  var form=$('supportForm');form.onsubmit=async function(e){e.preventDefault();var fd=new FormData(form),content=String(fd.get('content')||'').trim(),st=$('supportStatus'),btn=form.querySelector('button');if(!content)return;btn.disabled=true;st.textContent='A enviar…';
    var c=await sb.from('support_conversations').select('id').eq('user_id',session.user.id).order('updated_at',{ascending:false}).limit(1),conv=c.data?.[0];if(!conv){var n=await sb.from('support_conversations').insert({user_id:session.user.id,subject:'Mensagem para a Nzinga'}).select('id').single();if(n.error){st.textContent='Não foi possível iniciar a conversa.';btn.disabled=false;return}conv=n.data}
    var r=await sb.from('support_messages').insert({conversation_id:conv.id,user_id:session.user.id,sender_type:'user',content:content,read_by_admin:false,read_by_user:true});if(r.error){st.textContent='Não foi possível enviar a mensagem.';btn.disabled=false;return}await sb.from('support_conversations').update({updated_at:new Date().toISOString()}).eq('id',conv.id);form.reset();st.textContent='Mensagem enviada.';btn.disabled=false;await load();
  };
  await load();setInterval(load,30000);
});
})();
