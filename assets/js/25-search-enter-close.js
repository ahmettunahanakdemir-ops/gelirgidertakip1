// Ortak: dokunmatik cihazlarda arama kutusunda klavyenin "Ara/Enter" tuşuna basınca klavye kapanır,
// sonuçlar ekranda görünür. Yalnızca arama kutuları etkilenir (type=search veya adı/ipucu "ara/arama/search/filtre").
(function () {
  if (window.__tmSearchEnterClose) return;
  window.__tmSearchEnterClose = true;
  var TOKENS = { ara: 1, arama: 1, search: 1, filtre: 1, filter: 1, bul: 1, query: 1, q: 1, sorgu: 1 };
  function tokens(value) {
    return String(value || "")
      .replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, "$1 $2")
      .toLocaleLowerCase("tr-TR")
      .split(/[^a-zçğıöşü0-9]+/)
      .filter(Boolean);
  }
  function isSearchField(el) {
    if (!el || el.tagName !== "INPUT" || el.readOnly || el.disabled) return false;
    if (el.hasAttribute("data-keep-keyboard")) return false; // ör. Kasa: art arda ürün girişi
    var type = String(el.type || "text").toLowerCase();
    if (type === "search") return true;
    if (type !== "text") return false;
    var words = tokens([el.id, el.name, el.className, el.getAttribute("aria-label"), el.placeholder, el.getAttribute("role")].join(" "));
    return words.some(function (w) { return TOKENS[w] === 1; });
  }
  function touchDevice() {
    try { return (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || navigator.maxTouchPoints > 0; } catch (e) { return false; }
  }
  document.addEventListener("focusin", function (e) {
    var el = e.target;
    if (isSearchField(el) && !el.hasAttribute("enterkeyhint")) el.setAttribute("enterkeyhint", "search");
  }, true);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.isComposing || e.keyCode === 229) return;
    var el = e.target;
    if (!isSearchField(el) || !touchDevice()) return;
    // Sayfanın kendi Enter işlemi (filtreleme/arama) önce çalışsın, sonra klavye kapansın.
    setTimeout(function () {
      try { el.blur(); } catch (err) {}
    }, 0);
  }, false);
})();
