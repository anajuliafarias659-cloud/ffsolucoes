self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Permite forçar atualização do SW
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Recebe push do servidor (Edge Function)
self.addEventListener("push", (event) => {
  let data = {
    title: "Nova mensagem",
    body: "Você recebeu uma nova mensagem",
    icon: "/ff-chat/icons/icon-192.png",
    badge: "/ff-chat/icons/icon-192.png",
    url: "/ff-chat/",
    tag: "ff-chat-msg",
    numero: ""
  };

  try {
    if (event.data) {
      const json = event.data.json();
      data = { ...data, ...json };
    }
  } catch (e) {
    console.error("Erro ao ler push:", e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag || "ff-chat-msg",
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/ff-chat/",
        numero: data.numero || ""
      }
    })
  );
});

// Clique na notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/ff-chat/";
  const numero = event.notification?.data?.numero || "";

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of allClients) {
      const clientUrl = new URL(client.url);

      // se já tiver o chat aberto
      if (clientUrl.pathname.includes("/ff-chat/")) {
        await client.focus();

        // manda mensagem pro HTML abrir a conversa certa
        client.postMessage({
          type: "PUSH_NOTIFICATION_CLICK",
          numero
        });

        return;
      }
    }

    // se não tiver aberto, abre nova aba
    await clients.openWindow(url);
  })());
});
