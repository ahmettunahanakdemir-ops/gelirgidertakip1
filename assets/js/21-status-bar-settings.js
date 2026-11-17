// Tema/palet değişikliği sonrası iPhone ana ekran uygulaması yenilendiyse Ayarlar'a geri dön.
(() => {
  let reopen = false;
  try {
    reopen = sessionStorage.getItem("akis-budget-reopen-settings") === "1";
    sessionStorage.removeItem("akis-budget-reopen-settings");
  } catch {}
  if (!reopen) return;
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const shell = document.getElementById("appShell");
    if (shell && !shell.hidden && typeof switchView === "function") {
      clearInterval(timer);
      switchView("settingsView");
    } else if (Date.now() - startedAt > 20000) {
      clearInterval(timer);
    }
  }, 200);
})();
