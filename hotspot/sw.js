// FF Hotspot - Service Worker sem cache

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => caches.delete(key)))
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {

    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response("Sem conexão com a internet.", {
                status: 503,
                statusText: "Offline"
            });
        })
    );

});
