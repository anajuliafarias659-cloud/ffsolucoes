const CACHE_NAME = "ff-borracharia-v6";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nunca cachear HTML/navegação
  if (req.mode === "navigate") {
    event.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }

  // Nunca cachear chamadas do Supabase
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }

  // Cache só arquivos estáticos
  event.respondWith(
    caches.match(req).then(async (cached) => {
      if (cached) return cached;

      const response = await fetch(req);
      const copy = response.clone();

      if (
        req.method === "GET" &&
        (url.pathname.endsWith(".css") ||
         url.pathname.endsWith(".js") ||
         url.pathname.endsWith(".png") ||
         url.pathname.endsWith(".jpg") ||
         url.pathname.endsWith(".jpeg") ||
         url.pathname.endsWith(".webp") ||
         url.pathname.endsWith(".svg") ||
         url.pathname.endsWith(".json"))
      ) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, copy);
      }

      return response;
    })
  );
});
