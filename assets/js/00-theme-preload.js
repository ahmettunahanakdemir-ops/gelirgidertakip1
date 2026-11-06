document.documentElement.dataset.mobilePlatform = /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ? "ios" : "other";
try {
  const savedTheme = localStorage.getItem("akis-budget-theme");
  if (savedTheme === "system") {
    document.documentElement.setAttribute("data-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
} catch (e) {}
document.querySelector('meta[name="theme-color"]')?.setAttribute("content",
  document.documentElement.getAttribute("data-theme") === "dark" ? "#091118" : "#eef7f5");
