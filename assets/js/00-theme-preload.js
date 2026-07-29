// ACIKLAMA: CSS yuklenmeden once kayitli acik/koyu tema tercihini HTML kokune uygular.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

// ACIKLAMA: CSS yuklenmeden once kayitli tema tercihini uygular; boylece tema gecisinde ekran parlamasi azalir.
try {
  const savedTheme = localStorage.getItem("akis-budget-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
} catch (e) {}
