importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const CACHE_NAME = "ff-chat-cache-v2";
const urlsToCache = [
  "/ff-chat/",
  "/ff-chat/index.html",
  "/ff-chat/manifest.webmanifest",
  "/ff-chat/icons/icon-192.png",
  "/ff-chat/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/ff-chat/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/ff-chat/index.html"))
    );
    return;
  }

  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.url.endsWith(".js") ||
    req.url.endsWith(".css")
  ) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});

firebase.initializeApp({
  apiKey: "SUA_API_KEY",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[ff-chat/sw.js] background message:", payload);

  const titulo = payload?.notification?.title || "Nova mensagem";
  const opcoes = {
    body: payload?.notification?.body || "Você recebeu uma nova mensagem",
    icon: payload?.notification?.icon || "/ff-chat/icons/icon-192.png",
    badge: "/ff-chat/icons/icon-192.png",
    data: payload?.data || {},
    vibrate: [200, 100, 200],
    tag: "ff-chat-msg"
  };

  self.registration.showNotification(titulo, opcoes);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlDestino = "/ff-chat/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(urlDestino);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlDestino);
      }
    })
  );
});
