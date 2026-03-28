importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const CACHE_NAME = "ff-chat-cache-v1";
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
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
  console.log("[firebase-messaging-sw.js] background message:", payload);

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
