self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {}

  const isCall = data.tipo === "chamada";

  event.waitUntil(
    self.registration.showNotification(data.title || "FF Chat", {
      body: data.body || "Você recebeu uma nova mensagem",
      icon: data.icon || "/ff-chat/icons/icon-192.png",
      badge: data.badge || "/ff-chat/icons/icon-192.png",
      tag: data.tag || (isCall ? "ff-chat-call" : "ff-chat-msg"),
      renotify: true,
      requireInteraction: isCall,
      vibrate: isCall ? [400, 200, 400, 200, 400] : [200, 100, 200],
      data: { url: data.url || "/ff-chat/" }
    })
  );
});
