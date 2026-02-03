self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(resp => {
        const clone = resp.clone();
        caches.open("pwa-loja").then(cache => {
          cache.put(event.request, clone);
        });
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});
