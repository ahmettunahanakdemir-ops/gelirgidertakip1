// ACIKLAMA: Acilis ekrani ve service worker kaydi yardimcilari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

function hideStartupSplash() {
  // ACIKLAMA: finishStartup degiskeninin Turkce karsiligi "finish baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const finishStartup = () => {
    startupSplashFinished = true;
    renderAuthState();

    if (loginScreen && !currentUser) {
      loginScreen.removeAttribute("aria-hidden");
    }

    if (appShell && currentUser) {
      appShell.removeAttribute("aria-hidden");
    }
  };

  if (!appSplashScreen) {
    finishStartup();
    return;
  }

  loginScreen.hidden = true;
  loginScreen.setAttribute("aria-hidden", "true");
  appShell.hidden = true;
  appShell.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    appSplashScreen.classList.add("is-hidden");
    finishStartup();
  }, 1400);

  window.setTimeout(() => {
    appSplashScreen.remove();
  }, 2100);
}

// ACIKLAMA: registerServiceWorker fonksiyonunun Turkce karsiligi "service worker kaydet"; ilgili uygulama islemini calistirir.
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  // ACIKLAMA: isHttp degiskeninin Turkce karsiligi "mi http"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
