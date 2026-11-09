
// FF Hotspot - Service Worker
// Atualização de HTML e consultas sem utilizar cache antigo

const VERSAO_SW = 'ff-hotspot-v3';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Remove caches antigos do FF Hotspot
        const cachesAntigos = await caches.keys();

        await Promise.all(
            cachesAntigos
                .filter(nome => nome.startsWith('ff-hotspot-'))
                .map(nome => caches.delete(nome))
        );

        // Assume o controle das páginas abertas
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Não intercepta requisições que não sejam GET
    if (request.method !== 'GET') return;

    event.respondWith((async () => {
        try {
            // Busca diretamente na rede, ignorando cache HTTP
            const resposta = await fetch(request, {
                cache: 'no-store'
            });

            return resposta;

        } catch (erro) {
            console.error('[FF HOTSPOT] Falha na conexão:', erro);

            return new Response(
                'Sem conexão com a internet. Verifique sua conexão.',
                {
                    status: 503,
                    statusText: 'Offline',
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'Cache-Control': 'no-store'
                    }
                }
            );
        }
    })());
});
