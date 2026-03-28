importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgar59yF1k6XmfG0iNOXvWCWKIa9dHcdI",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Mensagem em background:", payload);

  const title = payload?.notification?.title || "Nova mensagem";

  self.registration.showNotification(title, {
    body: payload?.notification?.body || "Mensagem nova",
    icon: "/ff-chat/icons/icon-192.png"
  });
});
