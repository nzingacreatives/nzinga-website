(function(){
  const images={
    'Design Gráfico':'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=82',
    'Conteúdo':'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=82',
    'Documentos':'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=82',
    'Digital & Web':'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=82',
    'Multimédia':'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=82'
  };
  function paint(){
    document.querySelectorAll('#serviceList .category').forEach(function(section){
      const name=section.querySelector('h3')?.textContent.trim();
      const url=images[name]; if(!url)return;
      section.dataset.category=name;
      section.querySelectorAll('.visual').forEach(function(el){
        el.style.backgroundImage='linear-gradient(180deg,rgba(9,9,9,.10),rgba(9,9,9,.72)),url("'+url+'")';
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.style.color='#fff';
        el.style.textShadow='0 2px 12px rgba(0,0,0,.8)';
      });
    });
  }
  function boot(){
    const list=document.getElementById('serviceList');if(!list)return;
    paint();
    new MutationObserver(paint).observe(list,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
