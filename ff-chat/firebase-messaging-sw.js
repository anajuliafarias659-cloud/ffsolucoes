importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBgar59yF1k6XmfG0iNOXvWCWKIa9dHcdI",
  authDomain: "servicospc-b3382.firebaseapp.com",
  projectId: "servicospc-b3382",
  messagingSenderId: "35103134828",
  appId: "1:35103134828:web:a57b932f6bd698b8e3b449"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload?.notification?.title || "Nova mensagem",
    {
      body: payload?.notification?.body || "Mensagem nova",
      icon: "/ff-chat/icons/icon-192.png"
    }
  );
});
