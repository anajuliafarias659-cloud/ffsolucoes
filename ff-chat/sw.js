const CACHE_NAME = "ff-chat-cache-v12";
const STATIC_ASSETS = [
  "/ff-chat/manifest.webmanifest",
  "/ff-chat/icons/icon-192.png",
  "/ff-chat/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  // HTML sempre na rede primeiro
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }

  // JS/CSS sem cache
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".html")
  ) {
    event.respondWith(fetch(req, { cache: "no-store" }));
    return;
  }

  // Só imagens/manifest no cache
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());
    return res;
  })());
});
