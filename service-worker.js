const CACHE_NAME = "akis-butce-v458";
const APP_ASSETS = [
  "./assets/js/20-assistant-images.js?v=458",
  "./assets/css/26-assistant-images.css?v=458",
  "./assets/css/16-budget-assistant.css?v=452",
  "./assets/js/17-assistant-insights.js?v=448",
  "./assets/js/12-budget-assistant.js?v=454",
  "./assets/js/18-assistant-logs.js?v=448",
  "./assets/css/25-assistant-logs.css?v=448",
  "./assets/js/16-assistant-microphone.js?v=455",
  "./assets/css/19-controls-mobile-layout.css?v=448",
  "./assets/css/20-mobile-corrections.css?v=448",
  "./assets/css/21-card-help-layout.css?v=448",
  "./assets/css/22-modal-menu-layout.css?v=448",
  "./assets/css/23-compact-navigation.css?v=448",
  "./assets/css/24-navigation-assistant-stability.css?v=448",
  "./assets/css/18-interaction-performance.css?v=448",
  "./assets/js/13-interaction-feedback.js?v=448",
  "./assets/css/17-mobile-viewport.css?v=448",
  "./assets/images/budget-assistant-mascot.png",
  "./assets/css/15-summary-category-details.css?v=448",
  "./assets/css/14-settings-dialogs.css?v=448",
  "./assets/js/10-settings-layout.js?v=448",
  "./assets/js/15-help-loading.js?v=448",
  "./assets/css/13-modern-shell.css?v=448",
  "./assets/js/10-modern-shell.js?v=448",
  "./assets/vendor/lucide.min.js?v=448",
  "./",
  "./index.html",
  "./assets/css/01-base.css?v=448",
  "./assets/css/02-auth-forms.css?v=448",
  "./assets/css/03-shell-navigation.css?v=448",
  "./assets/css/04-dashboard-history-export.css?v=448",
  "./assets/css/05-modals-payment-splash.css?v=448",
  "./assets/css/06-mobile-payment-assets.css?v=448",
  "./assets/css/07-theme-settings.css?v=448",
  "./assets/css/08-modal-filters-home.css?v=448",
  "./assets/css/09-bank-import-filters-wide.css?v=448",
  "./assets/css/10-responsive-pwa-overrides.css?v=448",
  "./assets/css/11-bulk-recent-final.css?v=448",
  "./assets/css/12-debts-receivables.css?v=448",
  "./assets/js/00-theme-preload.js?v=448",
  "./firebase-config.js?v=448",
  "./assets/js/01-config-dom.js?v=448",
  "./assets/js/02-ui-preferences-reminders.js?v=448",
  "./assets/js/03-init-entry-forms.js?v=448",
  "./assets/js/04-storage-home-render.js?v=448",
  "./assets/js/05-assets-payments-bes-market.js?v=448",
  "./assets/js/06-summary-history-categories-navigation.js?v=448",
  "./assets/js/14-transaction-details.js?v=448",
  "./assets/js/07-backup-export-import-sync.js?v=448",
  "./assets/js/08-auth-firebase-cloud.js?v=448",
  "./assets/js/09-bank-import-ocr-parsers.js?v=457",
  "./assets/js/10-debts-receivables.js?v=448",
  "./assets/js/10-startup-pwa.js?v=448",
  "./assets/js/11-state-startup.js?v=448",
  "./manifest.json?v=448",
  "./icon.svg",
  "./icon-180.png",
  "./icon-512.png",
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
