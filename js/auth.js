/* NzingaGPT Auth adapter. Values are intentionally injected by the site at runtime. */
(function(){
  const cfg=window.NzingaConfig||{};
  let client=null;
  async function load(){
    if(client)return client;
    if(!window.supabase){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
    if(!cfg.supabaseUrl||!cfg.supabaseKey)throw new Error('Supabase ainda não foi configurado.');
    client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey);return client;
  }
  window.NzingaAuth={
    getClient:load,
    getSession:async()=>{const c=await load();return (await c.auth.getSession()).data.session},
    signIn:async(email,password)=>{const c=await load();return c.auth.signInWithPassword({email,password})},
    signUp:async(email,password)=>{const c=await load();return c.auth.signUp({email,password})},
    signOut:async()=>{const c=await load();return c.auth.signOut()},
    onAuthStateChange:async callback=>{const c=await load();return c.auth.onAuthStateChange(callback)}
  };
})();
