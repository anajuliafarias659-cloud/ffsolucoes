const CACHE = "ffhotspot-v6";

const arquivos = [
  "/hotspot/",
  "/hotspot/admin.html",
  "/hotspot/config.html",
  "/hotspot/clientes.html",
  "/hotspot/planos.html",
  "/hotspot/pagamentos.html"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(arquivos))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
