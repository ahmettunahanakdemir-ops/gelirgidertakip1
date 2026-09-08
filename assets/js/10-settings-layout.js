// ACIKLAMA: Mevcut ayar kontrolleri tasinir; kimlikleri ve kaydetme olaylari korunur.
function setupSettingsLayout() {
  const view = document.getElementById("settingsView");
  const categories = view.querySelector(".settings-category-panel");
  const filter = view.querySelector(".home-summary-filter-standalone");
  const fonts = document.getElementById("settingsFontFamily").closest(".settings-block");
  const notifications = view.querySelector(".notification-settings-block");
  const backups = view.querySelector(".cloud-backup-settings-block");
  const profile = document.getElementById("profileForm");
  const danger = view.querySelector(".danger-zone");
  const layout = document.createElement("div");
  layout.className = "preferences-layout";
  const header = document.createElement("header");
  header.className = "preferences-header";
  header.innerHTML = '<button type="button" class="preferences-close">Kapat</button><h2>Ayarlar</h2><span></span>';
  header.querySelector("button").addEventListener("click", () => switchView("homeView"));
  layout.append(header);
  const menu = document.createElement("div");
  menu.className = "preferences-menu";
  layout.append(menu);
  const group = (title) => {
    const section = document.createElement("section");
    section.className = "preferences-section";
    const heading = document.createElement("h3");heading.textContent = title;
    const rows = document.createElement("div");rows.className = "preferences-rows";
    section.append(heading, rows);menu.append(section);return rows;
  };
  const disclosure = (rows, title, icon, content, pageKey) => {
    const summary = document.createElement("button");
    summary.type = "button";
    summary.className = "preferences-link";
    summary.innerHTML = shellIcon(icon) + `<span>${title}</span>` + shellIcon("chevron-right");
    const page = document.createElement("section");
    page.className = "preferences-subpage";
    page.dataset.settingsPage = pageKey;
    page.hidden = true;
    const nav = document.createElement("header");
    nav.className = "preferences-header";
    nav.innerHTML = '<button type="button" class="preferences-close preferences-back" aria-label="Ayarlara dön" title="Ayarlara dön">' + shellIcon("chevron-left") + '</button><h2 tabindex="-1"></h2><span></span>';
    nav.querySelector("h2").textContent = title;
    const body = document.createElement("div");body.className = "preferences-content";
    body.append(content);page.append(nav,body);layout.append(page);rows.append(summary);
    let scrollPosition = 0;
    summary.addEventListener("click", () => {
      scrollPosition = window.scrollY;
      menu.hidden = true;
      header.hidden = true;
      page.hidden = false;
      window.scrollTo(0, 0);
      nav.querySelector("h2").focus({preventScroll:true});
    });
    nav.querySelector("button").addEventListener("click", () => {
      page.hidden = true;
      menu.hidden = false;
      header.hidden = false;
      summary.focus({preventScroll:true});
      window.scrollTo(0, scrollPosition);
    });
  };
  const appearance = group("Görünüm");
  const themeRow = document.createElement("label");themeRow.className = "preferences-value-row";
  themeRow.innerHTML = '<span>Tema</span><select id="preferencesTheme" aria-label="Tema"><option value="system">Sistem</option><option value="light">Açık</option><option value="dark">Koyu</option></select>';
  appearance.append(themeRow);
  themeRow.querySelector("select").value = uiSettings.theme;
  themeRow.querySelector("select").addEventListener("change", event => applyTheme(event.target.value));
  disclosure(appearance,"Yazı ve boyut","type",fonts,"typography");
  disclosure(group("Profil"),"Profil ve şifre","user",profile,"profile");
  const general = group("Genel");
  disclosure(general,"Bildirimler","bell",notifications,"notifications");
  disclosure(general,"Gelir / gider tarih filtresi","calendar-days",filter,"date-filter");
  disclosure(group("Yedekleme ve Veri"),"Yedekleme işlemleri","database-backup",backups,"backup");
  disclosure(group("Daha Fazla"),"Kategoriler","layout-grid",categories,"categories");
  const dangerRows = group("Tehlikeli Bölge");dangerRows.classList.add("preferences-danger");
  disclosure(dangerRows,"Hesabı sil","trash-2",danger,"danger");
  // Eski kapsayicilar kaldirilir; iclerindeki canli kontroller yukarida tasinmistir.
  view.replaceChildren(layout);
  window.lucide?.createIcons();
}
