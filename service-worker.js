const CACHE_NAME = "akis-butce-v198";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=198",
  "./app.js?v=198",
  "./firebase-config.js?v=198",
  "./manifest.json?v=198",
  "./icon.svg",
  "./login-pattern.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isHtmlRequest =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() => caches.match("./index.html").then((cached) => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification?.data?.url || "./", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});
