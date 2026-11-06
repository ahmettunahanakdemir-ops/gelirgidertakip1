function hideStartupSplash() {

  const finishStartup = () => {
    startupSplashFinished = true;
    document.documentElement.classList.remove("startup-splash-active");
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

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
