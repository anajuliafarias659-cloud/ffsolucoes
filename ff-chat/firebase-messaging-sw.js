importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgar59yF1k6XmfG0iNOXvWCWKIa9dHcdI",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",

  /* OBRIGATÓRIO PREENCHER */
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensagem recebida em background:", payload);

  const notificationTitle =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Nova mensagem";

  const notificationOptions = {
    body:
      payload?.notification?.body ||
      payload?.data?.body ||
      "Você recebeu uma nova mensagem",
    icon:
      payload?.notification?.icon ||
      payload?.data?.icon ||
      "/ff-chat/icons/icon-192.png",
    badge:
      payload?.data?.badge ||
      "/ff-chat/icons/icon-192.png",
    data: {
      url: payload?.data?.url || "/ff-chat/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  const urlToOpen = event.notification?.data?.url || "/ff-chat/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
