
/* FF HOTSPOT - SEM CACHE */

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        const nomes = await caches.keys();

        await Promise.all(
            nomes.map(nome => caches.delete(nome))
        );

        await self.clients.claim();
    })());
});

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    event.respondWith(
        fetch(request, {
            cache: "no-store"
        }).then(resposta => {
            const novaResposta = new Response(resposta.body, resposta);

            novaResposta.headers.set(
                "Cache-Control",
                "no-store, no-cache, must-revalidate, max-age=0"
            );

            novaResposta.headers.set("Pragma", "no-cache");
            novaResposta.headers.set("Expires", "0");

            return novaResposta;
        }).catch(() => {
            return new Response(
                "Sem conexão com a internet.",
                {
                    status: 503,
                    headers: {
                        "Cache-Control": "no-store"
                    }
                }
            );
        })
    );
});
