// ACIKLAMA: Mevcut ayar kontrolleri tasinir; kimlikleri ve kaydetme olaylari korunur.
function setupSettingsLayout() {
  const view = document.getElementById("settingsView");
  const categories = view.querySelector(".settings-category-panel");
  const filter = view.querySelector(".home-summary-filter-standalone");
  const fonts = document.getElementById("settingsFontFamily").closest(".settings-block");
  const notifications = view.querySelector(".notification-settings-block");
  const backups = view.querySelector(".cloud-backup-settings-block");
  const profile = document.getElementById("profileForm");
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
    nav.innerHTML = '<button type="button" class="preferences-close preferences-back" aria-label="Ayarlara dön" title="Ayarlara dön">' + shellIcon("chevron-left") + '</button><h2 tabindex="-1"></h2><span class="preferences-header-spacer" aria-hidden="true"></span>';
    nav.querySelector("h2").textContent = title;
    let scrollPosition = 0;
    let nestedPage = null;
    const returnToSettingsMenu = () => {
      if (nestedPage) nestedPage.hidden = true;
      page.hidden = true;
      menu.hidden = false;
      header.hidden = false;
      summary.focus({ preventScroll: true });
      window.scrollTo(0, scrollPosition);
    };
    if (pageKey === "profile") {
      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "preferences-header-save";
      saveButton.textContent = "Kaydet";
      saveButton.addEventListener("click", () => profile?.requestSubmit());
      if (profile && profile.dataset.settingsReturnBound !== "true") {
        profile.dataset.settingsReturnBound = "true";
        profile.addEventListener("settings-profile-saved", returnToSettingsMenu);
      }
      const headerActions = document.createElement("div");
      headerActions.className = "preferences-header-actions";
      headerActions.append(saveButton);
      nav.querySelector(".preferences-header-spacer")?.replaceWith(headerActions);
    }
    if (pageKey === "date-filter") {
      // Eski temizle butonu doğrudan çalışmasın; yerine onaylı bir "Varsayılana dön" satırı kullanılır.
      const oldClearButton = content.querySelector("#clearHomeSummaryFilterButton");
      oldClearButton?.remove();

      const resetCard = document.createElement("button");
      resetCard.type = "button";
      resetCard.className = "date-filter-reset-card";
      resetCard.innerHTML = shellIcon("rotate-ccw") + '<span>Varsayılana dön</span>';
      resetCard.addEventListener("click", () => {
        openGenericConfirmModal(
          "Varsayılana dönülsün mü?",
          "Bütün özet tarihleri sıfırlanacak. Emin misiniz?",
          () => {
            clearHomeSummaryFilter();
          },
          { confirmLabel: "Varsayılana dön", cancelLabel: "Vazgeç" }
        );
      });
      content.append(resetCard);

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "preferences-header-save";
      saveButton.textContent = "Kaydet";
      saveButton.addEventListener("click", () => {
        const applyButton = content.querySelector("#applyHomeSummaryFilterButton");
        applyButton?.click();
        returnToSettingsMenu();
      });
      const headerActions = document.createElement("div");
      headerActions.className = "preferences-header-actions";
      headerActions.append(saveButton);
      nav.querySelector(".preferences-header-spacer")?.replaceWith(headerActions);
    }
    if (pageKey === "typography") {
      const resetButton = document.getElementById("resetAppearanceButton");
      if (resetButton) {
        resetButton.classList.add("preferences-header-reset");
        const headerActions = document.createElement("div");
        headerActions.className = "preferences-header-actions";
        headerActions.append(resetButton);
        nav.querySelector(".preferences-header-spacer")?.replaceWith(headerActions);
      }
      const typographyActions = content.querySelector(".settings-actions");
      if (typographyActions) typographyActions.remove();
    }
    const body = document.createElement("div");body.className = "preferences-content";
    body.append(content);page.append(nav,body);layout.append(page);rows.append(summary);

    if (pageKey === "profile") {
      const passwordButton = content.querySelector("#profilePasswordSettingsButton");
      const passwordFields = content.querySelector("#profilePasswordFields");
      if (passwordButton && passwordFields) {
        nestedPage = document.createElement("section");
        nestedPage.className = "preferences-subpage preferences-nested-subpage";
        nestedPage.dataset.settingsPage = "password";
        nestedPage.hidden = true;

        const passwordNav = document.createElement("header");
        passwordNav.className = "preferences-header";
        passwordNav.innerHTML = '<button type="button" class="preferences-close preferences-back" aria-label="Hesap bilgilerine dön" title="Hesap bilgilerine dön">' + shellIcon("chevron-left") + '</button><h2 tabindex="-1">Şifre işlemleri</h2><div class="preferences-header-actions"><button type="button" class="preferences-header-save">Kaydet</button></div>';

        const passwordBody = document.createElement("div");
        passwordBody.className = "preferences-content password-settings-content";
        const passwordCard = document.createElement("div");
        passwordCard.className = "settings-profile-password-fields-card";
        passwordFields.hidden = false;
        passwordFields.classList.add("is-settings-password-page");
        passwordFields.querySelectorAll("input").forEach((input) => input.setAttribute("form", "profileForm"));
        passwordCard.append(passwordFields);
        passwordBody.append(passwordCard);
        nestedPage.append(passwordNav, passwordBody);
        layout.append(nestedPage);

        passwordButton.setAttribute("aria-expanded", "false");
        passwordButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          page.hidden = true;
          nestedPage.hidden = false;
          window.scrollTo(0, 0);
          passwordNav.querySelector("h2")?.focus({ preventScroll: true });
        }, true);

        passwordNav.querySelector(".preferences-back")?.addEventListener("click", () => {
          nestedPage.hidden = true;
          page.hidden = false;
          window.scrollTo(0, 0);
          passwordButton.focus({ preventScroll: true });
        });
        passwordNav.querySelector(".preferences-header-save")?.addEventListener("click", () => profile?.requestSubmit());
      }
    }

    summary.addEventListener("click", () => {
      scrollPosition = window.scrollY;
      menu.hidden = true;
      header.hidden = true;
      page.hidden = false;
      window.scrollTo(0, 0);
      nav.querySelector("h2").focus({preventScroll:true});
    });
    nav.querySelector("button").addEventListener("click", returnToSettingsMenu);
  };
  const appearance = group("Görünüm");
  const themeRow = document.createElement("label");themeRow.className = "preferences-value-row";
  themeRow.innerHTML = '<span>Tema</span><select id="preferencesTheme" aria-label="Tema"><option value="system">Sistem</option><option value="light">Açık</option><option value="dark">Koyu</option></select>';
  appearance.append(themeRow);
  themeRow.querySelector("select").value = uiSettings.theme;
  themeRow.querySelector("select").addEventListener("change", event => applyTheme(event.target.value));
  disclosure(appearance,"Yazı ve boyut","type",fonts,"typography");
  disclosure(group("Profil"),"Hesap bilgileri","user",profile,"profile");
  const general = group("Genel");
  disclosure(general,"Bildirimler","bell",notifications,"notifications");
  disclosure(general,"Tarih işlemleri","calendar-days",filter,"date-filter");
  disclosure(group("Yedekleme ve Veri"),"Yedekleme işlemleri","database-backup",backups,"backup");
  disclosure(group("Daha Fazla"),"Kategoriler","layout-grid",categories,"categories");
  // Eski kapsayicilar kaldirilir; iclerindeki canli kontroller yukarida tasinmistir.
  view.replaceChildren(layout);
  window.lucide?.createIcons();
}
