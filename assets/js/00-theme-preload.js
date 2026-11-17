const budgetPaletteKey = "akis-budget-palette";
const budgetPalettes = ["mint", "ocean", "lavender", "sunset"];
const budgetReopenSettingsKey = "akis-budget-reopen-settings";

// Her palet ve modun sayfa zemini (--bg). iPhone/Safari üst çubuğu (saat, şarj) bu renkle birebir aynı olur.
const budgetPageColors = {
  mint: { light: "#e4f6f1", dark: "#101d2b" },
  ocean: { light: "#e6f1fa", dark: "#0e1c31" },
  lavender: { light: "#f1eaf8", dark: "#1f192d" },
  sunset: { light: "#fceee7", dark: "#271b24" }
};

// iOS değişikliği her zaman fark etmediği için etiket yerinde değiştirilmez, yeniden oluşturulur.
// Ana ekrana eklenen iPhone uygulaması bu rengi yalnızca açılışta okur: kullanıcı tema/palet
// değiştirince uygulama kısa bir yenilemeyle Ayarlar'a geri döner.
function syncBudgetStatusBarColor(options = {}) {
  const root = document.documentElement;
  const palette = budgetPalettes.includes(root.dataset.palette) ? root.dataset.palette : "mint";
  const mode = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const color = budgetPageColors[palette][mode];
  const metas = [...document.querySelectorAll('meta[name="theme-color"]')];
  if (metas.length === 1 && metas[0].getAttribute("content") === color) return false;
  metas.forEach(meta => meta.remove());
  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = color;
  document.head.appendChild(meta);
  if (options.fromUser && root.classList.contains("ios-standalone")) {
    try { sessionStorage.setItem(budgetReopenSettingsKey, "1"); } catch {}
    setTimeout(() => location.reload(), 250);
  }
  return true;
}
window.syncBudgetStatusBarColor = syncBudgetStatusBarColor;

function applyBudgetPalette(palette, persist = true) {
  const value = budgetPalettes.includes(palette) ? palette : "mint";
  document.documentElement.dataset.palette = value;
  if (persist) {
    try { localStorage.setItem(budgetPaletteKey, value); } catch {}
  }
  syncBudgetStatusBarColor({ fromUser: persist });
}

document.documentElement.dataset.mobilePlatform = /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "ios" : "other";
if (navigator.standalone === true) document.documentElement.classList.add("ios-standalone");
try {
  applyBudgetPalette(localStorage.getItem(budgetPaletteKey), false);
  const savedTheme = localStorage.getItem("akis-budget-theme");
  if (savedTheme === "system") {
    document.documentElement.setAttribute("data-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
} catch (e) {}
syncBudgetStatusBarColor();
