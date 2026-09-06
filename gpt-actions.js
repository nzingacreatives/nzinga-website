(() => {
  'use strict';
  const KEY = 'nzingaGPT.sessions.v2';
  const ANON_KEY = 'nzingaGPT.anonymous';
  const welcome = { role: 'assistant', content: 'Olá. Não precisas escolher um modo. Podes simplesmente começar a falar comigo.', time: Date.now() };

  function readSessions(){
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  function writeSessions(sessions){
    try { localStorage.setItem(KEY, JSON.stringify(sessions)); } catch(e) { console.warn(e); }
  }
  function addControls(){
    const sidebar = document.querySelector('.chat-sidebar');
    if(!sidebar || document.getElementById('gptActions')) return;
    const box = document.createElement('div');
    box.id = 'gptActions';
    box.className = 'gpt-actions';
    box.innerHTML = '<p class="side-label">CONVERSA</p><div class="gpt-action-grid"><button type="button" id="newGptConversation">＋ Nova conversa</button><button type="button" id="anonymousGptConversation">◌ Conversa anónima</button></div><p class="gpt-action-note" id="gptActionNote">A conversa anónima não fica guardada no histórico.</p>';
    sidebar.prepend(box);
    document.getElementById('newGptConversation').addEventListener('click', () => {
      sessionStorage.removeItem(ANON_KEY);
      const sessions = readSessions();
      sessions.unshift({id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now(), messages:[{...welcome, time:Date.now()}]});
      writeSessions(sessions.slice(0,20));
      location.reload();
    });
    document.getElementById('anonymousGptConversation').addEventListener('click', () => {
      sessionStorage.setItem(ANON_KEY, '1');
      location.reload();
    });
  }

  function maintainAnonymousMode(){
    if(sessionStorage.getItem(ANON_KEY) !== '1') return;
    const note = document.getElementById('gptActionNote');
    if(note) note.textContent = 'Modo anónimo ativo. Esta conversa não será guardada no histórico.';
    const btn = document.getElementById('anonymousGptConversation');
    if(btn){ btn.classList.add('active'); btn.textContent = '● Conversa anónima ativa'; }
    const purge = () => { try { localStorage.removeItem(KEY); } catch(e) {} };
    setTimeout(purge, 0);
    setInterval(purge, 500);
    window.addEventListener('beforeunload', purge);
  }

  function init(){
    addControls();
    maintainAnonymousMode();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
