// ACIKLAMA: CSS yuklenmeden once kayitli acik/koyu tema tercihini HTML kokune uygular.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

// ACIKLAMA: CSS yuklenmeden once kayitli tema tercihini uygular; boylece tema gecisinde ekran parlamasi azalir.
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
