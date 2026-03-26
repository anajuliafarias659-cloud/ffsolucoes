self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  let data = {
    title: "Nova mensagem",
    body: "Você recebeu uma nova mensagem",
    icon: "/ff-chat/icons/icon-192.png",
    badge: "/ff-chat/icons/icon-192.png",
    url: "/ff-chat/",
    numero: ""
  };

  try {
    if (event.data) {
      const json = event.data.json();
      data = { ...data, ...json };
    }
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: {
        url: data.url || "/ff-chat/",
        numero: data.numero || ""
      },
      vibrate: [200, 100, 200],
      tag: data.tag || "ff-chat-msg",
      renotify: true
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const urlToOpen = event.notification?.data?.url || "/ff-chat/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
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
