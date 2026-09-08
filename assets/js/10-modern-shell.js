// ACIKLAMA: Gorunum katmani; mali kayitlari degistirmeden aylik ozet ve mobil gezinme sunar.
let shellMonth = "";
let shellAmountsHidden = false;

let shellToolbarPinRaf = 0;
let shellToolbarNaturalTop = null;
let shellToolbarSidebarObserver = null;

function getShellToolbarPlaceholder(toolbar) {
  if (!toolbar) return null;
  let placeholder = toolbar.nextElementSibling;
  if (!placeholder || !placeholder.classList.contains("shell-toolbar-placeholder")) {
    placeholder = document.createElement("div");
    placeholder.className = "shell-toolbar-placeholder";
    placeholder.hidden = true;
    toolbar.after(placeholder);
  }
  return placeholder;
}

function rememberDesktopShellToolbarNaturalTop(toolbar = document.querySelector(".shell-toolbar")) {
  if (!toolbar || toolbar.classList.contains("is-desktop-fixed")) return;
  shellToolbarNaturalTop = toolbar.getBoundingClientRect().top + window.scrollY;
}

function releaseDesktopShellToolbarPin(toolbar = document.querySelector(".shell-toolbar")) {
  if (!toolbar) return;
  const placeholder = getShellToolbarPlaceholder(toolbar);
  toolbar.classList.remove("is-desktop-fixed");
  toolbar.style.removeProperty("--shell-toolbar-fixed-left");
  toolbar.style.removeProperty("--shell-toolbar-fixed-width");
  toolbar.style.removeProperty("--shell-toolbar-fixed-top");
  if (placeholder) {
    placeholder.hidden = true;
    placeholder.style.height = "0px";
  }
  window.requestAnimationFrame(() => rememberDesktopShellToolbarNaturalTop(toolbar));
}

function syncDesktopShellToolbarPin() {
  const toolbar = document.querySelector(".shell-toolbar");
  if (!toolbar) return;

  const isDesktop = window.matchMedia("(min-width: 981px)").matches;
  if (!isDesktop) {
    releaseDesktopShellToolbarPin(toolbar);
    shellToolbarNaturalTop = null;
    return;
  }

  const placeholder = getShellToolbarPlaceholder(toolbar);
  if (!toolbar.classList.contains("is-desktop-fixed")) {
    if (shellToolbarNaturalTop === null || window.scrollY <= 2) {
      rememberDesktopShellToolbarNaturalTop(toolbar);
    }
  }

  const naturalTop = shellToolbarNaturalTop ?? (toolbar.getBoundingClientRect().top + window.scrollY);
  const shouldPin = window.scrollY > 2 && window.scrollY >= Math.max(0, naturalTop - 1);

  if (!shouldPin) {
    if (toolbar.classList.contains("is-desktop-fixed")) {
      releaseDesktopShellToolbarPin(toolbar);
    }
    return;
  }

  const sourceRect = toolbar.classList.contains("is-desktop-fixed") && !placeholder.hidden
    ? placeholder.getBoundingClientRect()
    : toolbar.getBoundingClientRect();

  if (!sourceRect.width || sourceRect.width < 120) return;

  placeholder.hidden = false;
  placeholder.style.height = `${toolbar.offsetHeight}px`;
  toolbar.style.setProperty("--shell-toolbar-fixed-left", `${sourceRect.left}px`);
  toolbar.style.setProperty("--shell-toolbar-fixed-width", `${sourceRect.width}px`);
  toolbar.style.setProperty("--shell-toolbar-fixed-top", "0px");
  toolbar.classList.add("is-desktop-fixed");
}

function requestDesktopShellToolbarPinSync() {
  if (shellToolbarPinRaf) return;
  shellToolbarPinRaf = window.requestAnimationFrame(() => {
    shellToolbarPinRaf = 0;
    syncDesktopShellToolbarPin();
  });
}

function setupDesktopShellToolbarPinning() {
  if (window.__desktopShellToolbarPinningBound) return;
  window.__desktopShellToolbarPinningBound = true;

  window.addEventListener("scroll", requestDesktopShellToolbarPinSync, { passive: true });
  window.addEventListener("resize", () => {
    shellToolbarNaturalTop = null;
    requestDesktopShellToolbarPinSync();
  }, { passive: true });

  if (window.MutationObserver && appShell) {
    shellToolbarSidebarObserver = new MutationObserver(() => {
      requestDesktopShellToolbarPinSync();
      window.setTimeout(requestDesktopShellToolbarPinSync, 240);
    });
    shellToolbarSidebarObserver.observe(appShell, { attributes: true, attributeFilter: ["class"] });
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      rememberDesktopShellToolbarNaturalTop();
      requestDesktopShellToolbarPinSync();
    });
  });
}

function shellIcon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function getShellAddContext(view = activeView) {
  if (["homeView", "entryView", "summaryView", "historyView"].includes(view)) {
    return { mode: "menu", menu: "transactions", label: "Yeni işlem" };
  }
  if (view === "assetsView") {
    return { mode: "direct", action: "asset", label: "Varlık ekle" };
  }
  if (view === "cardsView") {
    return { mode: "direct", action: "account", label: "Kart / hesap ekle" };
  }
  if (view === "besView") {
    return { mode: "direct", action: "bes", label: "BES ekle" };
  }
  if (view === "debtsView") {
    return { mode: "menu", menu: "debts", label: "Borç / alacak ekle" };
  }
  return { mode: "hidden", label: "Yeni kayıt" };
}

function updateShellAddContext() {
  const button = document.querySelector("[data-shell-add]");
  const menu = document.querySelector("[data-shell-quick-actions]");
  if (!button || !menu) return;

  const context = getShellAddContext(activeView);
  button.hidden = context.mode === "hidden";
  button.title = context.label;
  button.setAttribute("aria-label", context.label);

  menu.querySelectorAll("[data-shell-context]").forEach((item) => {
    item.hidden = item.dataset.shellContext !== context.menu;
  });

  if (context.mode !== "menu") {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }
}

function runShellDirectAddAction(action) {
  if (action === "asset") {
    openAssetAddModal();
    return;
  }
  if (action === "account") {
    openPaymentAccountModal();
    return;
  }
  if (action === "bes") {
    openBesModal();
  }
}

function setupModernShell() {
  shellMonth = getTurkeyTodayISO().slice(0, 7);
  document.documentElement.classList.add("modern-budget");
  const nav = document.createElement("nav");
  nav.className = "mobile-dock";
  nav.setAttribute("aria-label", "Hızlı gezinme");
  const destinations = [
    ["homeView", "house", "Ana Sayfa"], ["debtsView", "users", "Borçlar"],
    ["cardsView", "credit-card", "Hesaplar"], ["assetsView", "wallet", "Birikimler"],
    ["besView", "chart-no-axes-combined", "BES"], ["summaryView", "chart-pie", "Özet"],
    ["historyView", "history", "Kayıtlar"],
  ];
  destinations.forEach(([view, icon, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.shellView = view;
    button.title = label;
    button.setAttribute("aria-label", label);
    button.innerHTML = shellIcon(icon) + `<span>${label}</span>`;
    button.addEventListener("click", () => {
      if (view === "menu") { toggleSidebar(); return; }
      setMobileSidebarOpen(false);
      switchView(view);
      window.scrollTo({top: 0, behavior: "instant"});
    });
    nav.append(button);
  });
  appShell.append(nav);
  const icons = {homeView:"house",entryView:"circle-plus",assetsView:"wallet",cardsView:"credit-card",besView:"chart-no-axes-combined",debtsView:"users",summaryView:"chart-pie",historyView:"history",settingsView:"settings"};
  document.querySelectorAll(".side-nav .nav-item").forEach(button => {
    button.querySelector(".nav-icon").innerHTML = shellIcon(icons[button.dataset.viewTarget] || "circle");
  });
  const toolbar = document.createElement("div");
  toolbar.className = "shell-toolbar";
  toolbar.innerHTML = `<button type="button" class="shell-icon-button shell-settings" data-shell-settings title="Ayarlar" aria-label="Ayarlar">${shellIcon("settings")}</button>
    <div class="shell-period"><button type="button" class="shell-icon-button" data-month-step="-1" title="Önceki ay" aria-label="Önceki ay">${shellIcon("chevron-left")}</button><span id="shellMonthLabel"></span><button type="button" class="shell-icon-button" data-month-step="1" title="Sonraki ay" aria-label="Sonraki ay">${shellIcon("chevron-right")}</button></div>
    <div class="shell-toolbar-actions">
      <button type="button" id="openHistorySearchModalButton" class="shell-icon-button shell-history-action" title="Kayıtlarda ara" aria-label="Kayıtlarda ara" hidden>${shellIcon("search")}</button>
      <button type="button" id="openRecentTransactionsButton" class="shell-icon-button shell-history-action" title="Son kayıtlar" aria-label="Son kayıtlar" hidden>${shellIcon("history")}</button>
      <button type="button" id="exportExcelButton" class="shell-icon-button shell-history-action" title="Excel olarak al" aria-label="Excel olarak al" hidden>${shellIcon("sheet")}</button>
      <button type="button" id="exportPdfButton" class="shell-icon-button shell-history-action" title="PDF olarak al" aria-label="PDF olarak al" hidden>${shellIcon("file-text")}</button>
      <button type="button" id="summaryDateFilterActionButton" class="shell-icon-button shell-summary-filter" title="Tarih filtresi" aria-label="Tarih filtresi" hidden>${shellIcon("calendar-range")}</button>
      <button type="button" class="shell-icon-button shell-refresh" data-shell-refresh title="Fiyatları yenile" aria-label="Fiyatları yenile" hidden>${shellIcon("refresh-cw")}</button>
      <button type="button" class="shell-icon-button shell-add" data-shell-add title="Yeni işlem" aria-label="Yeni işlem" aria-haspopup="menu" aria-expanded="false">${shellIcon("plus")}</button>
    </div>
    <div class="shell-quick-actions" data-shell-quick-actions role="menu" aria-label="Ekleme seçenekleri" hidden>
      <button type="button" role="menuitem" data-shell-context="transactions" data-shell-action="entry">${shellIcon("circle-plus")}<span><strong>Gelir / Gider Ekle</strong><small>Tek bir gelir, gider veya transfer kaydı oluştur.</small></span></button>
      <button type="button" role="menuitem" data-shell-context="transactions" data-shell-action="bulk">${shellIcon("list-plus")}<span><strong>Çoklu Gelir / Gider Ekle</strong><small>Birden fazla işlemi aynı anda ekle.</small></span></button>
      <button type="button" role="menuitem" data-shell-context="transactions" data-shell-action="bank">${shellIcon("file-up")}<span><strong>Kart Hareketlerini İçe Aktar</strong><small>PDF, CSV veya ekran görüntüsünden hareket aktar.</small></span></button>
      <button type="button" role="menuitem" data-shell-context="debts" data-shell-action="debt">${shellIcon("hand-coins")}<span><strong>Borç Ekle</strong><small>Yeni bir borç kaydı oluştur.</small></span></button>
      <button type="button" role="menuitem" data-shell-context="debts" data-shell-action="installment">${shellIcon("calendar-range")}<span><strong>Taksitli Borç Ekle</strong><small>Taksit planı olan bir borç kaydı oluştur.</small></span></button>
      <button type="button" role="menuitem" data-shell-context="debts" data-shell-action="receivable">${shellIcon("badge-dollar-sign")}<span><strong>Alacak Ekle</strong><small>Tahsil edeceğin yeni bir alacak kaydı oluştur.</small></span></button>
    </div>`;
  document.querySelector(".workspace").prepend(toolbar);
  toolbar.querySelector("[data-shell-settings]").addEventListener("click", () => switchView("settingsView"));

  const shellAddButton = toolbar.querySelector("[data-shell-add]");
  const shellRefreshButton = toolbar.querySelector("[data-shell-refresh]");
  const historySearchActionButton = toolbar.querySelector("#openHistorySearchModalButton");
  const historyRecentActionButton = toolbar.querySelector("#openRecentTransactionsButton");
  const historyExcelActionButton = toolbar.querySelector("#exportExcelButton");
  const historyPdfActionButton = toolbar.querySelector("#exportPdfButton");
  const summaryDateFilterActionButton = toolbar.querySelector("#summaryDateFilterActionButton");
  const shellQuickActions = toolbar.querySelector("[data-shell-quick-actions]");

  shellRefreshButton?.addEventListener("click", async () => {
    if (activeView !== "assetsView") return;
    shellRefreshButton.disabled = true;
    shellRefreshButton.classList.add("is-refreshing");
    try {
      await refreshMarketPrices();
    } finally {
      shellRefreshButton.disabled = false;
      shellRefreshButton.classList.remove("is-refreshing");
      window.lucide?.createIcons();
    }
  });
  historySearchActionButton?.addEventListener("click", () => {
    if (activeView !== "historyView") return;
    openHistorySearchModal();
  });
  historyRecentActionButton?.addEventListener("click", () => {
    if (activeView !== "historyView") return;
    openRecentTransactionsModal();
  });
  historyExcelActionButton?.addEventListener("click", () => {
    if (activeView !== "historyView") return;
    exportFilteredTransactionsExcel();
  });
  historyPdfActionButton?.addEventListener("click", () => {
    if (activeView !== "historyView") return;
    exportFilteredTransactionsPdf();
  });
  summaryDateFilterActionButton?.addEventListener("click", () => {
    if (activeView !== "summaryView") return;
    openSummaryDateFilterModal();
  });
  const closeShellQuickActions = ({ restoreFocus = false } = {}) => {
    if (!shellQuickActions || shellQuickActions.hidden) return;
    shellQuickActions.hidden = true;
    shellAddButton?.setAttribute("aria-expanded", "false");
    if (restoreFocus) shellAddButton?.focus();
  };
  const openShellQuickActions = () => {
    if (!shellQuickActions) return;
    setMobileSidebarOpen(false);
    shellQuickActions.hidden = false;
    shellAddButton?.setAttribute("aria-expanded", "true");
    window.lucide?.createIcons();
    setTimeout(() => shellQuickActions.querySelector("button:not([hidden])")?.focus(), 0);
  };

  shellAddButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const context = getShellAddContext(activeView);
    if (context.mode === "direct") {
      closeShellQuickActions();
      runShellDirectAddAction(context.action);
      return;
    }
    if (context.mode !== "menu") return;
    updateShellAddContext();
    if (shellQuickActions?.hidden) openShellQuickActions();
    else closeShellQuickActions();
  });
  shellQuickActions?.addEventListener("click", (event) => event.stopPropagation());
  shellQuickActions?.querySelector('[data-shell-action="entry"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    openEntryModal();
  });
  shellQuickActions?.querySelector('[data-shell-action="bulk"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    openBulkEntryModal();
  });
  shellQuickActions?.querySelector('[data-shell-action="bank"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    openBankImportModal();
  });
  shellQuickActions?.querySelector('[data-shell-action="debt"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    borcAlacakPenceresiniAc("", "debt");
  });
  shellQuickActions?.querySelector('[data-shell-action="installment"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    borcAlacakPenceresiniAc("", "installment");
  });
  shellQuickActions?.querySelector('[data-shell-action="receivable"]')?.addEventListener("click", () => {
    closeShellQuickActions();
    borcAlacakPenceresiniAc("", "receivable");
  });
  document.addEventListener("click", () => closeShellQuickActions());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shellQuickActions && !shellQuickActions.hidden) {
      closeShellQuickActions({ restoreFocus: true });
    }
  });
  toolbar.querySelectorAll("[data-month-step]").forEach(button => button.addEventListener("click", () => {
    const [year, month] = shellMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + Number(button.dataset.monthStep), 1, 12);
    shellMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    renderModernDashboard();
  }));
  const overview = document.createElement("div");
  overview.className = "modern-overview";
  overview.innerHTML = `<section class="month-balance" aria-label="Aylık özet">
    <div class="month-balance-top"><img src="icon-180.png" alt="" width="32" height="32"><button type="button" class="shell-icon-button" id="shellPrivacy" aria-label="Tutarları gizle" title="Tutarları gizle">${shellIcon("eye")}</button></div>
    <div class="month-balance-main"><div><span id="shellNetLabel">Aylık net</span><strong id="shellNet"></strong></div><div class="shell-saving-ring"><strong id="shellSaving"></strong><span>Tasarruf</span></div></div>
    <div class="month-balance-totals"><div><span>↑ Gelir</span><strong id="shellIncome"></strong></div><div><span>↓ Gider</span><strong id="shellExpense"></strong></div></div>
    </section><section class="shell-recent"><div class="shell-section-heading"><h2>Son İşlemler</h2><button type="button" class="text-btn" id="shellAllRecords">Tümünü Gör</button></div><div id="shellRecentList"></div></section>`;
  document.getElementById("homeView").prepend(overview);
  overview.querySelector("#shellAllRecords").addEventListener("click", () => switchView("historyView"));
  overview.querySelector("#shellPrivacy").addEventListener("click", () => {
    shellAmountsHidden = !shellAmountsHidden;
    renderModernDashboard();
    renderHome();
  });
  const shortTitles = {homeView:"Ana Sayfa",entryView:"Gelir / Gider",assetsView:"Birikimlerim",cardsView:"Kartlar / Hesaplar",besView:"BES",debtsView:"Borçlarım",summaryView:"Özet ve Tasarruf",historyView:"Kayıtlar",settingsView:"Ayarlar"};
  Object.entries(shortTitles).forEach(([id,title]) => {if(viewMeta[id]) viewMeta[id].title=title;});
  setupDesktopShellToolbarPinning();
  window.lucide?.createIcons();
  renderModernShell();
  requestDesktopShellToolbarPinSync();
}

function renderModernShell() {
  if (!document.querySelector(".shell-toolbar")) return;
  document.documentElement.dataset.activeView = activeView;
  updateShellAddContext();

  const shellPeriod = document.querySelector(".shell-period");
  if (shellPeriod) shellPeriod.hidden = activeView !== "homeView";

  const shellRefreshButton = document.querySelector("[data-shell-refresh]");
  if (shellRefreshButton) shellRefreshButton.hidden = activeView !== "assetsView";

  document.querySelectorAll(".shell-history-action").forEach((button) => {
    button.hidden = activeView !== "historyView";
  });

  const summaryFilterButton = document.getElementById("summaryDateFilterActionButton");
  if (summaryFilterButton) {
    summaryFilterButton.hidden = activeView !== "summaryView";
    summaryFilterButton.classList.toggle("is-active", activeView === "summaryView" && typeof isHomeSummaryFilterActive === "function" && isHomeSummaryFilterActive());
    summaryFilterButton.setAttribute("aria-pressed", String(activeView === "summaryView" && typeof isHomeSummaryFilterActive === "function" && isHomeSummaryFilterActive()));
  }

  document.querySelectorAll("[data-shell-view]").forEach(button => {
    const selected = button.dataset.shellView === activeView;
    button.classList.toggle("active", selected);
    if(selected) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  const mobileDock = document.querySelector(".mobile-dock");
  if (mobileDock) {
    const dockButtons = Array.from(mobileDock.querySelectorAll("[data-shell-view]"));
    const activeDockIndex = dockButtons.findIndex(button => button.dataset.shellView === activeView);
    mobileDock.style.setProperty("--dock-count", String(dockButtons.length || 1));
    if (activeDockIndex >= 0) {
      mobileDock.style.setProperty("--dock-index", String(activeDockIndex));
      mobileDock.classList.add("has-active-item");
    } else {
      mobileDock.classList.remove("has-active-item");
    }
  }
  renderModernDashboard();
  requestDesktopShellToolbarPinSync();
}

function renderModernDashboard() {
  const label = document.getElementById("shellMonthLabel");
  if (!label) return;
  const [year, month] = shellMonth.split("-").map(Number);
  label.textContent = new Intl.DateTimeFormat("tr-TR", {month:"long",year:"numeric"}).format(new Date(year,month-1,1));
  const records = transactions.filter(item => String(item.date || "").slice(0,7) === shellMonth);
  const totals = getTransactionTotals(records);
  const money = value => shellAmountsHidden ? "••••" : currency.format(value);
  document.getElementById("shellNetLabel").textContent = `${label.textContent} neti`;
  document.getElementById("shellNet").textContent = money(totals.balance);
  document.getElementById("shellIncome").textContent = money(totals.income);
  document.getElementById("shellExpense").textContent = money(totals.expense);
  const rate = totals.income > 0 ? Math.round((totals.income - totals.expense) / totals.income * 100) : 0;
  document.getElementById("shellSaving").textContent = shellAmountsHidden ? "••" : `%${rate}`;
  const privacy = document.getElementById("shellPrivacy");
  privacy.setAttribute("aria-label", shellAmountsHidden ? "Tutarları göster" : "Tutarları gizle");
  privacy.setAttribute("aria-pressed", String(shellAmountsHidden));
  privacy.title = privacy.getAttribute("aria-label");
  const list = document.getElementById("shellRecentList");
  list.replaceChildren();
  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "shell-empty";
    empty.innerHTML = `${shellIcon("inbox")}<p>Bu ay henüz işlem yok</p><button type="button" class="primary-btn">İşlem Ekle</button>`;
    empty.querySelector("button").addEventListener("click", openEntryModal);
    list.append(empty);
  }
  records.slice().sort(compareTransactionsNewestFirst).slice(0,5).forEach(item => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `shell-transaction ${item.type}`;
    const icon = document.createElement("span");
    icon.className="shell-transaction-icon";
    icon.innerHTML = shellIcon(item.type === "income" ? "arrow-down-left" : item.type === "transfer" ? "arrow-left-right" : "arrow-up-right");
    const copy = document.createElement("span");
    const title = document.createElement("strong");title.textContent=item.title;
    const meta=document.createElement("small");
    const dateParts=String(item.date).split("-").map(Number);
    const dateLabel=new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"short",year:"numeric"}).format(new Date(dateParts[0],dateParts[1]-1,dateParts[2],12));
    meta.textContent=[dateLabel,item.category].filter(Boolean).join(" · ");
    copy.append(title,meta);
    const amount=document.createElement("b");amount.textContent=(shellAmountsHidden ? "" : item.type === "income" ? "+ " : item.type === "expense" ? "− " : "")+money(item.amount);
    row.append(icon,copy,amount);
    row.addEventListener("click",()=>editTransaction(item));
    list.append(row);
  });
  window.lucide?.createIcons();
}
