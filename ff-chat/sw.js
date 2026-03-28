importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const CACHE_NAME = "ff-chat-cache-v10";
const APP_URL = "/ff-chat/";
const FALLBACK_HTML = [
  "/ff-chat/familia.html",
  "/ff-chat/index.html"
];

const STATIC_ASSETS = [
  "/ff-chat/manifest.webmanifest",
  "/ff-chat/icons/icon-192.png",
  "/ff-chat/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;

  // HTML sempre tenta rede primeiro para não ficar versão velha
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith((async () => {
      try {
        return await fetch(req, { cache: "no-store" });
      } catch {
        for (const fallback of FALLBACK_HTML) {
          const cached = await caches.match(fallback);
          if (cached) return cached;
        }
        return Response.error();
      }
    })());
    return;
  }

  // JS / CSS / HTML sem cache para evitar quebrar atualização do chat
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

  // Imagens, manifest e afins podem usar cache
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());
    return res;
  })());
});

firebase.initializeApp({
  apiKey: "AIzaSyBgar59yF1k6XmfG0iNOXvWCWKIa9dHcdI",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",
  storageBucket: "servicospc-b3382.firebasestorage.app",
  messagingSenderId: "35103134828",
  appId: "1:35103134828:web:a57b932f6bd698b8e3b449",
  measurementId: "G-FNFPRJW3HB"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[ff-chat/sw.js] background message:", payload);

  const data = payload?.data || {};
  const notification = payload?.notification || {};
  const isCall = data.tipo === "chamada";

  const title = notification.title || data.title || "Nova mensagem";
  const options = {
    body: notification.body || data.body || "Você recebeu uma nova mensagem",
    icon: notification.icon || data.icon || "/ff-chat/icons/icon-192.png",
    badge: data.badge || "/ff-chat/icons/icon-192.png",
    data: {
      url: data.url || APP_URL,
      numero: data.numero || "",
      tipo: data.tipo || "mensagem"
    },
    vibrate: isCall ? [300, 120, 300, 120, 300, 120, 300] : [200, 100, 200],
    tag: data.tag || (isCall ? "ff-chat-call" : "ff-chat-msg"),
    renotify: true,
    requireInteraction: !!isCall
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlDestino = event.notification?.data?.url || APP_URL;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of clientList) {
      try {
        if ("focus" in client) {
          await client.navigate(urlDestino);
          return client.focus();
        }
      } catch (_) {}
    }

    if (clients.openWindow) {
      return clients.openWindow(urlDestino);
    }
  })());
});
