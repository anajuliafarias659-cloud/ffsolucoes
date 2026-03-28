importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "SUA_API_KEY",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",
  storageBucket: "servicospc-b3382.firebasestorage.app",
  messagingSenderId: "35103134828",
  appId: "1:35103134828:web:a57b932f6bd698b8e3b449",
  measurementId: "G-FNFPRJW3HB"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};
  const isCall = data.tipo === "chamada";

  self.registration.showNotification(data.title || "FF Chat", {
    body: data.body || "Nova mensagem",
    icon: "/ff-chat/icons/icon-192.png",
    badge: "/ff-chat/icons/icon-192.png",
    tag: data.tag || (isCall ? "ff-chat-call" : "ff-chat-msg"),
    renotify: true,
    requireInteraction: isCall,
    vibrate: isCall ? [400, 200, 400, 200, 400] : [200, 100, 200],
    data: {
      url: data.url || "/ff-chat/"
    }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/ff-chat/";
  event.waitUntil(clients.openWindow(url));
});
