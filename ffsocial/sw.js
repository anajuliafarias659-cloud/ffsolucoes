/* HÃ? SMART CACHE v2 — evita falso aviso a cada F5. */
const CACHE_NAME='ha-social-shell-v2';
const APP_SHELL='./';
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  try{
   const cache=await caches.open(CACHE_NAME);
   const response=await fetch(APP_SHELL,{cache:'no-store'});
   if(response.ok) await cache.put(APP_SHELL,response.clone());
  }catch(error){/* primeira instalação offline: segue sem cache inicial */}
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('ha-social-shell-')&&name!==CACHE_NAME).map(name=>caches.delete(name)));
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type==='FF_SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 const url=new URL(request.url);
 // Não intercepta Supabase, APIs, pagamentos, autenticação ou requisições POST.
 if(request.method!=='GET' || url.origin!==self.location.origin || request.mode!=='navigate') return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(APP_SHELL);
  const refresh=(async()=>{
   try{
    const fresh=await fetch(request,{cache:'no-store'});
    if(fresh.ok) await cache.put(APP_SHELL,fresh.clone());
    return fresh;
   }catch(error){return cached || Response.error();}
  })();
  // Mostra a interface já guardada; atualiza a cópia silenciosamente em segundo plano.
  if(cached){event.waitUntil(refresh.then(()=>{}));return cached;}
  return refresh;
 })());
});
