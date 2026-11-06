function getSummaryCategoryTypeFilterValue() {

  const value = summaryCategoryTypeFilter?.value || "expense";
  return ["income", "expense", "transfer", "all"].includes(value) ? value : "expense";
}

function getSummaryCategoryTypeLabel(type) {
  if (type === "income") {
    return "gelir";
  }

  if (type === "transfer") {
    return "transfer";
  }

  if (type === "all") {
    return "tüm işlem";
  }

  return "gider";
}

function getSummaryCategoryEmptyMessage(type) {
  if (type === "income") {
    return "Gelir ekledikçe kategori dağılımı burada görünecek.";
  }

  if (type === "transfer") {
    return "Transfer ekledikçe kategori dağılımı burada görünecek.";
  }

  if (type === "all") {
    return "Kayıt ekledikçe kategori dağılımı burada görünecek.";
  }

  return "Gider ekledikçe kategori dağılımı burada görünecek.";
}

function getSummaryCategoryAmount(item) {

  const amount = Number(item.amount || 0);
  if (item.type === "transfer") {
    return amount + Math.max(0, Number(item.transferFee || 0));
  }

  return amount;
}

function renderCategoryBreakdown() {
  if (!categoryBreakdown) {
    return;
  }

  const selectedType = getSummaryCategoryTypeFilterValue();

  const typeLabel = getSummaryCategoryTypeLabel(selectedType);

  const scopedTransactions = getSummaryScopedTransactions();

  const filteredTransactions = scopedTransactions.filter((item) =>
    selectedType === "all" ? ["income", "expense", "transfer"].includes(item.type) : item.type === selectedType
  );

  const totalAmount = filteredTransactions.reduce((sum, item) => sum + getSummaryCategoryAmount(item), 0);

  const grouped = filteredTransactions.reduce((acc, item) => {

    const category = item.category || (item.type === "transfer" ? "Transfer" : "Diğer");
    acc[category] = (acc[category] || 0) + getSummaryCategoryAmount(item);
    return acc;
  }, {});

  categoryBreakdown.innerHTML = "";

  const scopeLabel = isHomeSummaryFilterActive()
    ? `${getHomeSummaryFilterLabel()} arası`
    : "Tüm dönem";

  if (overviewMonthLabel) {
    overviewMonthLabel.textContent = `${scopeLabel} ${typeLabel} kategori dağılımı`;
  }

  if (!filteredTransactions.length) {
    categoryBreakdown.innerHTML =
      `<div class="empty-state">${getSummaryCategoryEmptyMessage(selectedType)}</div>`;
    return;
  }

  Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, amount]) => {

      const ratio = totalAmount ? (amount / totalAmount) * 100 : 0;

      const row = document.createElement("div");
      row.className = `category-row category-row-${selectedType}`;
      const summaryRow = document.createElement("div");
      summaryRow.className = "category-summary-row";
      const topline = document.createElement("div");
      topline.className = "category-topline";
      const categoryName = document.createElement("span");
      categoryName.textContent = category;
      const categoryAmount = document.createElement("span");
      categoryAmount.textContent = `${currency.format(amount)} · %${ratio.toFixed(0)}`;
      topline.append(categoryName, categoryAmount);

      const detailButton = document.createElement("button");
      detailButton.type = "button";
      detailButton.className = "category-detail-button";
      detailButton.textContent = "Detay";
      detailButton.setAttribute("aria-haspopup", "dialog");
      detailButton.setAttribute("aria-label", `${category} kategorisi kayıtlarını görüntüle`);
      detailButton.addEventListener("click", () => {
        const categoryTransactions = filteredTransactions.filter((item) =>
          (item.category || (item.type === "transfer" ? "Transfer" : "Diğer")) === category
        );
        openSummaryCategoryDetail(category, selectedType, categoryTransactions, detailButton);
      });
      summaryRow.append(topline, detailButton);

      const bar = document.createElement("div");
      bar.className = "category-bar";
      const barFill = document.createElement("span");
      barFill.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
      bar.append(barFill);
      row.append(summaryRow, bar);
      categoryBreakdown.append(row);
    });
}

let summaryCategoryDetailTrigger = null;

function openSummaryCategoryDetail(category, selectedType, categoryTransactions, trigger) {
  const modal = document.getElementById("summaryCategoryDetailModal");
  const title = document.getElementById("summaryCategoryDetailTitle");
  const scope = document.getElementById("summaryCategoryDetailScope");
  const summary = document.getElementById("summaryCategoryDetailSummary");
  const list = document.getElementById("summaryCategoryDetailList");
  if (!modal || !title || !scope || !summary || !list) return;

  const records = [...categoryTransactions].sort(compareTransactionsNewestFirst);
  const total = records.reduce((sum, item) => sum + getSummaryCategoryAmount(item), 0);
  const periodLabel = isHomeSummaryFilterActive()
    ? `${getHomeSummaryFilterLabel()} · seçili tarih aralığı`
    : "Tüm zamanlar";
  const typeLabel = selectedType === "all" ? "Tüm işlem türleri" : getSummaryCategoryTypeLabel(selectedType);

  title.textContent = `${category} kayıtları`;
  scope.textContent = `${periodLabel} · ${typeLabel}`;
  summary.textContent = `${records.length} kayıt · Toplam ${currency.format(total)}`;
  list.replaceChildren();

  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Bu kategoride seçili kapsam için kayıt bulunamadı.";
    list.append(empty);
  } else {
    records.forEach((item) => {
      const row = document.createElement("article");
      row.className = `category-detail-record category-detail-record-${item.type}`;
      row.setAttribute("role", "listitem");

      const content = document.createElement("div");
      content.className = "category-detail-record-content";
      const titleLine = document.createElement("div");
      titleLine.className = "category-detail-record-title-line";
      const recordTitle = document.createElement("strong");
      recordTitle.className = "category-detail-record-title";
      recordTitle.textContent = item.title || category;
      const typeBadge = document.createElement("span");
      typeBadge.className = `category-detail-type-badge category-detail-type-${item.type}`;
      typeBadge.textContent = item.type === "income" ? "Gelir" : item.type === "transfer" ? "Transfer" : "Gider";
      titleLine.append(recordTitle, typeBadge);

      const dateLine = document.createElement("p");
      dateLine.className = "category-detail-record-meta";
      dateLine.textContent = `${formatTransactionDateTime(item)} · ${item.category || category}`;
      content.append(titleLine, dateLine);

      const paymentInfo = getTransactionPaymentInfo(item);
      if (paymentInfo) {
        const accountLine = document.createElement("p");
        accountLine.className = "category-detail-record-meta";
        accountLine.textContent = paymentInfo;
        content.append(accountLine);
      }
      if (item.note) {
        const noteLine = document.createElement("p");
        noteLine.className = "category-detail-record-note";
        noteLine.textContent = item.note;
        content.append(noteLine);
      }

      const amount = document.createElement("strong");
      amount.className = `category-detail-record-amount ${item.type}`;
      const amountValue = item.type === "transfer" ? getSummaryCategoryAmount(item) : Number(item.amount || 0);
      amount.textContent = `${item.type === "income" ? "+ " : item.type === "expense" ? "− " : ""}${currency.format(amountValue)}`;
      row.append(content, amount);
      list.append(row);
    });
  }

  summaryCategoryDetailTrigger = trigger || null;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  document.getElementById("closeSummaryCategoryDetailButton")?.focus();
}

function closeSummaryCategoryDetailModal() {
  const modal = document.getElementById("summaryCategoryDetailModal");
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  if (!document.querySelector('.modal-backdrop:not([hidden])')) {
    document.body.classList.remove("modal-open");
  }
  summaryCategoryDetailTrigger?.focus();
  summaryCategoryDetailTrigger = null;
}

function applyHistorySearch() {
  currentHistorySearch = searchInput ? searchInput.value : "";
  currentHistoryPage = 1;
  renderTransactions();
}

function openHistorySearchModal() {
  if (!historySearchModal) return;
  renderHistoryCategoryFilterOptions();
  historySearchModal.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => searchInput?.focus(), 10);
}

function closeHistorySearchModal() {
  if (!historySearchModal) return;
  historySearchModal.hidden = true;
  if (!document.querySelector('.modal-backdrop:not([hidden])')) {
    document.body.classList.remove("modal-open");
  }
}

function resetHistoryFilters() {
  currentHistorySearch = "";
  currentHistoryPage = 1;
  if (searchInput) searchInput.value = "";
  if (filterType) filterType.value = "all";
  if (filterCategory) filterCategory.value = "all";
  if (filterPaymentMethod) filterPaymentMethod.value = "all";
  if (filterPaymentAccount) filterPaymentAccount.value = "all";
  if (historyStartDate) historyStartDate.value = "";
  if (historyEndDate) historyEndDate.value = "";
  renderHistoryCategoryFilterOptions();
  [filterType, filterCategory, filterPaymentMethod, filterPaymentAccount].filter(Boolean).forEach(syncHistoryCustomFilterSelect);
}

function renderTransactions() {
  transactionList.innerHTML = "";
  paginationControls.innerHTML = "";

  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    transactionList.innerHTML =
      '<div class="empty-state">Bu filtreye uygun kayıt bulunamadı.</div>';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / TRANSACTIONS_PER_PAGE));
  currentHistoryPage = Math.min(currentHistoryPage, totalPages);

  const pageStart = (currentHistoryPage - 1) * TRANSACTIONS_PER_PAGE;

  const pagedTransactions = filtered.slice(pageStart, pageStart + TRANSACTIONS_PER_PAGE);

  pagedTransactions.forEach((item) => {
    transactionList.append(createTransactionListItem(item));
  });

  renderPagination(filtered.length, totalPages);
}

function createTransactionListItem(item, options = {}) {

  const fragment = transactionTemplate.content.cloneNode(true);

  const row = fragment.querySelector(".transaction-item");

  const title = fragment.querySelector(".transaction-title");

  const meta = fragment.querySelector(".transaction-meta");

  const amount = fragment.querySelector(".transaction-amount");

  const addedAt = getTransactionAddedTimestamp(item);

  if (row && options.className) {
    row.classList.add(options.className);
  }

  title.textContent = item.title;
  const taksitSayisi = Math.max(0, Math.trunc(Number(item.installmentCount || 0)));
  const taksitSirasi = Math.max(0, Math.trunc(Number(item.installmentNumber || 0)));
  const taksitMetni = item.isInstallment
    ? taksitSayisi > 1 && taksitSirasi > 0
      ? ` · Taksit ${taksitSirasi}/${taksitSayisi}`
      : " · Taksit"
    : "";
  const taksitDurumuMetni = item.isInstallment && item.installmentCompleted ? " · Tamamlandı" : "";
  meta.textContent = `${formatTransactionDateTime(item)} · ${item.category} · ${getTransactionPaymentInfo(item)}${taksitMetni}${taksitDurumuMetni}${item.note ? ` · ${item.note}` : ""}`;
  amount.textContent = item.type === "transfer"
    ? `Transfer ${currency.format(item.amount)}${
        Number(item.transferFee || 0) > 0 ? ` + ücret ${currency.format(Number(item.transferFee || 0))}` : ""
      }`
    : `${item.type === "income" ? "+" : "-"} ${currency.format(item.amount)}`;
  amount.classList.add(item.type);

  if (options.showAddedAt && meta) {

    const addedText = addedAt ? formatAddedDateTime(addedAt) : "Eklenme saati bilinmiyor";
    meta.textContent = `${meta.textContent} · Eklenme: ${addedText}`;
  }

  const actions = [
    ["Düzenle", "SquarePen", () => { closeRecentTransactionsModal(); editTransaction(item); }],
    ["Sil", "Trash2", () => {
      if (options.closeModalBeforeDelete) closeRecentTransactionsModal();
      requestTransactionDelete(item);
    }],
  ];
  row._cardActions = actions;
  actions.forEach(([label, icon, action]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-btn desktop-card-action";
    button.textContent = label;
    button.addEventListener("click", action);
    syncLegacyCardAction(button);
    row.querySelector(".transaction-side").append(button);
  });
  row.dataset.dataCardDetails = "true";
  const menu = createActionOverflowButton(`${item.title || "İşlem"} seçenekleri`, actions, "transaction-overflow-button");
  row.append(menu);
  const content = row.querySelector(".transaction-content");
  content.setAttribute("aria-label", `${item.title || "İşlem"} detayını aç`);
  row.addEventListener("click", (event) => {
    if (window.innerWidth > 980) return;
    if (!event.target.closest("button")) openTransactionDetailModal(item);
  });
  content.addEventListener("keydown", (event) => {
    if (window.innerWidth > 980) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openTransactionDetailModal(item);
    }
  });

  return fragment;
}

function getTransactionAddedTimestamp(item) {
  return Math.max(
    getRecordTimestamp(item?.createdAt),
    getRecordTimestamp(item?.updatedAt),
    0
  );
}

function formatAddedDateTime(timestamp) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function getRecentAddedTransactions(days = RECENT_ADDED_TRANSACTION_DAYS) {

  const now = Date.now();

  const cutoff = now - Math.max(1, Number(days) || RECENT_ADDED_TRANSACTION_DAYS) * 24 * 60 * 60 * 1000;

  return [...transactions]
    .filter((item) => !isTransactionDeleted(item))
    .map((item) => ({ item, addedAt: getTransactionAddedTimestamp(item) }))
    .filter(({ addedAt }) => addedAt && addedAt >= cutoff && addedAt <= now + 5 * 60 * 1000)
    .sort((first, second) => {

      const addedDiff = second.addedAt - first.addedAt;
      if (addedDiff) {
        return addedDiff;
      }
      return compareTransactionsNewestFirst(first.item, second.item);
    })
    .map(({ item }) => item);
}

function openRecentTransactionsModal() {
  if (!recentTransactionsModal) return;
  renderRecentTransactionsModal();
  recentTransactionsModal.hidden = false;
  setTimeout(() => closeRecentTransactionsButton?.focus(), 0);
}

function closeRecentTransactionsModal() {
  closePaymentAccountOverflowMenu();
  if (recentTransactionsModal) {
    recentTransactionsModal.hidden = true;
  }
}

let recentTransactionsModalRenderKey = null;

function renderRecentTransactionsModal() {
  if (!recentTransactionsList) {
    return;
  }

  const latestTransactions = getRecentAddedTransactions(RECENT_ADDED_TRANSACTION_DAYS);
  const renderKey = JSON.stringify(latestTransactions.map((item) => [
    item.id, item.createdAt, item.updatedAt, item.title, item.amount, item.type,
    item.category, item.date, item.note, item.paymentMethod, item.paymentAccountId,
    item.transferAccountId, item.installmentNumber, item.installmentCount, item.installmentCompleted,
  ]));
  if (renderKey === recentTransactionsModalRenderKey && recentTransactionsList.childElementCount) return;

  if (paymentAccountOverflowTrigger?.closest("#recentTransactionsModal")) closePaymentAccountOverflowMenu();
  recentTransactionsModalRenderKey = renderKey;
  recentTransactionsList.innerHTML = "";

  if (!latestTransactions.length) {
    recentTransactionsList.innerHTML = '<div class="empty-state">Son 3 günde eklenen kayıt yok.</div>';
    return;
  }

  latestTransactions.forEach((item) => {
    recentTransactionsList.append(createTransactionListItem(item, {
      className: "recent-transaction-item",
      closeModalBeforeDelete: true,
      showAddedAt: true,
    }));
  });
}

function getVisibleFilteredTransactions() {

  const query = currentHistorySearch.trim().toLocaleLowerCase("tr-TR");

  const selectedType = filterType.value;
  const selectedCategory = filterCategory?.value || "all";

  const selectedPaymentMethod = filterPaymentMethod?.value || "all";

  const selectedPaymentAccount = filterPaymentAccount?.value || "all";
  const hasDateRange = hasHistoryDateRange();
  // Kayıtlar en yeniden eskiye sıralı tutulur; filtreleme sıralamayı korur.
  const sourceTransactions = hasDateRange ? transactions : getDateFilteredTransactions();

  return sourceTransactions.filter((item) => {
    if (hasDateRange && !isInHistoryDateRange(item)) return false;
    if (selectedType !== "all" && item.type !== selectedType) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedPaymentMethod !== "all" && normalizePaymentMethod(item.paymentMethod || "cash") !== selectedPaymentMethod) return false;

    if (selectedPaymentAccount !== "all") {
      const itemPaymentAccountId = String(item.paymentAccountId || "");
      const itemTransferAccountId = String(item.transferAccountId || "");
      const matchesPaymentAccount = selectedPaymentAccount === "none"
        ? !itemPaymentAccountId && !itemTransferAccountId
        : itemPaymentAccountId === selectedPaymentAccount || itemTransferAccountId === selectedPaymentAccount;
      if (!matchesPaymentAccount) return false;
    }

    if (query) {
      const haystack = `${item.title} ${item.category} ${item.note} ${getTransactionPaymentInfo(item)}`.toLocaleLowerCase("tr-TR");
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

function renderPaymentAccountFilterOptions() {
  if (!filterPaymentAccount) {
    return;
  }

  const currentValue = filterPaymentAccount.value || "all";

  const options = [
    { value: "all", label: "Tüm Kart/Hesaplar" },
    { value: "none", label: "Nakit / Hesap Yok" },
    ...paymentAccounts.map((account) => ({
      value: account.id,
      label: formatPaymentAccountName(account),
    })),
  ];

  filterPaymentAccount.innerHTML = "";
  options.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    filterPaymentAccount.append(option);
  });

  filterPaymentAccount.value = options.some((item) => item.value === currentValue) ? currentValue : "all";
  syncHistoryCustomFilterSelect(filterPaymentAccount);
}

function renderHistoryCategoryFilterOptions() {
  if (!filterCategory) return;
  const currentValue = filterCategory.value || "all";
  const selectedType = filterType?.value || "all";
  const source = selectedType === "all"
    ? Object.values(transactionCategories || {}).flat()
    : (transactionCategories?.[selectedType] || []);
  const categories = Array.from(new Set(source.map(item => String(item || "").trim()).filter(Boolean)));
  filterCategory.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Tüm Kategoriler";
  filterCategory.append(allOption);
  categories.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    filterCategory.append(option);
  });
  filterCategory.value = categories.includes(currentValue) ? currentValue : "all";
  syncHistoryCustomFilterSelect(filterCategory);
}

function initHistoryCustomFilterSelects() {
  renderHistoryCategoryFilterOptions();
  [filterType, filterCategory, filterPaymentMethod, filterPaymentAccount].filter(Boolean).forEach((select) => {
    buildHistoryCustomFilterSelect(select);
    syncHistoryCustomFilterSelect(select);
    if (!select.dataset.customSyncBound) {
      select.addEventListener("change", () => syncHistoryCustomFilterSelect(select));
      select.dataset.customSyncBound = "1";
    }
  });
  filterType?.addEventListener("change", renderHistoryCategoryFilterOptions);

  if (!document.body.dataset.historyCustomFiltersReady) {
    document.addEventListener("click", (event) => {

      const openDropdowns = document.querySelectorAll(".custom-filter-select.is-open");
      openDropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove("is-open");
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        document.querySelectorAll(".custom-filter-select.is-open").forEach((dropdown) => {
          dropdown.classList.remove("is-open");
        });
      }
    });

    document.body.dataset.historyCustomFiltersReady = "1";
  }
}

function buildHistoryCustomFilterSelect(select) {
  if (!select || select.dataset.customFilterBuilt === "1") {
    return;
  }

  select.classList.add("native-filter-source");

  const wrapper = document.createElement("div");
  wrapper.className = "custom-filter-select";
  wrapper.dataset.for = select.id || "";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-filter-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const label = document.createElement("span");
  label.className = "custom-filter-trigger-label";
  trigger.append(label);

  const panel = document.createElement("div");
  panel.className = "custom-filter-menu";
  panel.setAttribute("role", "listbox");

  trigger.addEventListener("click", () => {

    const isOpen = wrapper.classList.contains("is-open");
    document.querySelectorAll(".custom-filter-select.is-open").forEach((dropdown) => {
      if (dropdown !== wrapper) {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".custom-filter-trigger")?.setAttribute("aria-expanded", "false");
      }
    });
    wrapper.classList.toggle("is-open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });

  wrapper.append(trigger, panel);
  select.insertAdjacentElement("afterend", wrapper);
  select.dataset.customFilterBuilt = "1";
}

function syncHistoryCustomFilterSelect(select) {
  if (!select) {
    return;
  }

  const wrapper = select.parentElement?.querySelector(`.custom-filter-select[data-for="${select.id}"]`) || select.nextElementSibling;
  if (!wrapper || !wrapper.classList?.contains("custom-filter-select")) {
    return;
  }

  const triggerLabel = wrapper.querySelector(".custom-filter-trigger-label");

  const menu = wrapper.querySelector(".custom-filter-menu");

  const selectedOption = select.options[select.selectedIndex] || select.options[0];

  if (triggerLabel) {
    triggerLabel.textContent = selectedOption?.textContent?.trim() || "Seç";
  }

  if (!menu) {
    return;
  }

  menu.innerHTML = "";

  Array.from(select.options).forEach((option) => {

    const item = document.createElement("button");
    item.type = "button";
    item.className = "custom-filter-option";
    item.setAttribute("role", "option");
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    if (option.selected) {
      item.classList.add("is-active");
      item.setAttribute("aria-selected", "true");
    } else {
      item.setAttribute("aria-selected", "false");
    }

    item.addEventListener("click", () => {
      if (select.value !== option.value) {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        syncHistoryCustomFilterSelect(select);
      }
      wrapper.classList.remove("is-open");
      wrapper.querySelector(".custom-filter-trigger")?.setAttribute("aria-expanded", "false");
    });

    menu.append(item);
  });
}

function hasHistoryDateRange() {
  return Boolean(historyStartDate.value || historyEndDate.value);
}

function isInHistoryDateRange(item) {

  const startDate = historyStartDate.value;

  const endDate = historyEndDate.value;

  if (!startDate && !endDate) {
    return true;
  }

  const from = startDate && endDate && startDate > endDate ? endDate : startDate;

  const to = startDate && endDate && startDate > endDate ? startDate : endDate;

  return (!from || item.date >= from) && (!to || item.date <= to);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTransactionDateTime(item) {

  const time = getTransactionTime(item);

  return time ? `${formatDate(item.date)} ${time.slice(0, 5)}` : formatDate(item.date);
}

function compareTransactionsNewestFirst(a, b) {
  return (
    getTransactionSortTimestamp(b) - getTransactionSortTimestamp(a) ||
    getRecordTimestamp(b.createdAt) - getRecordTimestamp(a.createdAt) ||
    String(b.id || "").localeCompare(String(a.id || ""))
  );
}

function getTransactionSortTimestamp(item) {

  const transactionAt = getRecordTimestamp(item.transactionAt);

  if (transactionAt) {
    return transactionAt;
  }

  const time = getTransactionTime(item) || "00:00:00";
  return getRecordTimestamp(buildTransactionDateTime(item.date, time));
}

function getTransactionTime(item) {

  const fromTransactionAt = getTimePart(item.transactionAt);

  if (fromTransactionAt) {
    return fromTransactionAt;
  }

  return extractTimePart(`${item.title || ""} ${item.note || ""}`);
}

function getRecordTimestamp(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value > 1000000000000 ? value : value * 1000;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {

    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  }

  if (Number.isFinite(Number(value.seconds))) {
    return Number(value.seconds) * 1000;
  }

  const timestamp = Date.parse(String(value || ""));
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function buildTransactionDateTime(date, time = "") {

  const datePart = String(date || "").slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return "";
  }

  const timePart = extractTimePart(time) || "00:00:00";
  return `${datePart}T${timePart}+03:00`;
}

function getTimePart(value) {

  const isoMatch = String(value || "").match(/T(\d{2}:\d{2}(?::\d{2})?)/);

  if (isoMatch) {
    return extractTimePart(isoMatch[1]);
  }

  return extractTimePart(value);
}

function extractTimePart(value) {

  const match = String(value || "").match(/\b([01]?\d|2[0-3])[:.][0-5]\d(?::[0-5]\d)?\b/);

  if (!match) {
    return "";
  }

  const [hour = "0", minute = "00", second = "00"] = match[0].split(/[:.]/);
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
}

function getDateFilteredTransactions() {
  return transactions.filter((item) => {
    const [year, month, day] = item.date.split("-");

    const matchesYear = selectedYear === "all" || year === selectedYear;

    const matchesMonth = selectedMonth === "all" || month === selectedMonth;

    const matchesDay = selectedDay === "all" || day === selectedDay;
    return matchesYear && matchesMonth && matchesDay;
  });
}

function getMonthName(month) {
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
  }).format(new Date(2026, Number(month) - 1, 1));
}

function getDateFilterLabel() {

  const parts = [];

  if (selectedDay !== "all") {
    parts.push(Number(selectedDay));
  }

  if (selectedMonth !== "all") {
    parts.push(getMonthName(selectedMonth));
  }

  if (selectedYear !== "all") {
    parts.push(selectedYear);
  }

  return parts.length ? parts.join(" ") : "Tüm dönem";
}

function getHistoryFilterLabel() {

  const parts = [];

  if (!hasHistoryDateRange()) {
    parts.push(getDateFilterLabel());
  } else {

    const startDate = historyStartDate.value;

    const endDate = historyEndDate.value;

    if (startDate && endDate) {

      const from = startDate > endDate ? endDate : startDate;

      const to = startDate > endDate ? startDate : endDate;
      parts.push(`${formatDate(from)} - ${formatDate(to)}`);
    } else if (startDate) {
      parts.push(`${formatDate(startDate)} sonrası`);
    } else {
      parts.push(`${formatDate(endDate)} öncesi`);
    }
  }

  const selectedPaymentMethod = filterPaymentMethod?.value || "all";
  const selectedCategory = filterCategory?.value || "all";

  const selectedPaymentAccount = filterPaymentAccount?.value || "all";

  if (selectedCategory !== "all") {
    parts.push(selectedCategory);
  }

  if (selectedPaymentMethod !== "all") {
    parts.push(getPaymentMethodLabel(selectedPaymentMethod));
  }

  if (selectedPaymentAccount !== "all") {
    if (selectedPaymentAccount === "none") {
      parts.push("Nakit / hesap yok");
    } else {

      const account = paymentAccounts.find((item) => item.id === selectedPaymentAccount);
      if (account) {
        parts.push(formatPaymentAccountName(account));
      }
    }
  }

  return parts.join(" · ");
}

function syncTransactionTrackingFields() {
  const secili = Boolean(transactionTrackCheckbox?.checked);
  const listeTuru = ["debt", "installment", "receivable"].includes(transactionTrackTypeInput?.value)
    ? transactionTrackTypeInput.value
    : "debt";
  if (transactionTrackOptions) transactionTrackOptions.hidden = !secili;
  if (transactionTrackTypeInput) transactionTrackTypeInput.disabled = !secili;
  if (transactionTrackDueDateInput) {
    transactionTrackDueDateInput.disabled = !secili;
    transactionTrackDueDateInput.required = secili && listeTuru === "installment";
  }
  if (transactionTrackDueDateLabel) transactionTrackDueDateLabel.hidden = !secili;
  if (transactionTrackInstallmentCountLabel) {
    transactionTrackInstallmentCountLabel.hidden = !secili || listeTuru !== "installment";
  }
  if (transactionTrackInstallmentCountInput) {
    transactionTrackInstallmentCountInput.disabled = !secili || listeTuru !== "installment";
    transactionTrackInstallmentCountInput.required = secili && listeTuru === "installment";
  }
}

function editTransaction(item) {
  editingTransactionId = item.id;
  transactionTypeInput.value = item.type === "transfer" ? "transfer" : item.type;
  updateCategorySelect(transactionCategoryInput, transactionTypeInput.value, item.category);
  transactionTitleInput.value = item.title;
  transactionAmountInput.value = Number(item.amount) || "";
  transactionDateInput.value = item.date;
  transactionTimeInput.value = (getTransactionTime(item) || "").slice(0, 5);
  transactionNoteInput.value = item.note || "";
  if (transactionInstallmentCheckbox) transactionInstallmentCheckbox.checked = Boolean(item.isInstallment);
  transactionPaymentMethodInput.value = normalizePaymentMethod(item.paymentMethod || "cash");
  if (transactionTransferFeeInput) {
    transactionTransferFeeInput.value = item.type === "transfer" && Number(item.transferFee || 0) > 0 ? Number(item.transferFee) : "";
  }
  const takipKaydi = typeof borcAlacakIslemTakipKaydiniBul === "function"
    ? borcAlacakIslemTakipKaydiniBul(item.id)
    : null;
  if (transactionTrackCheckbox) transactionTrackCheckbox.checked = Boolean(takipKaydi);
  if (transactionTrackTypeInput) {
    transactionTrackTypeInput.value = takipKaydi?.listType || (item.type === "income" ? "receivable" : "debt");
  }
  if (transactionTrackDueDateInput) transactionTrackDueDateInput.value = takipKaydi?.dueDate || "";
  if (transactionTrackInstallmentCountInput) {
    transactionTrackInstallmentCountInput.value = String(takipKaydi?.installmentCount || 2);
  }
  syncTransactionTrackingFields();
  if (transactionTypeInput.value === "transfer") {
    updateAnyPaymentAccountSelect(transactionPaymentAccountInput, item.paymentAccountId || "", {
      excludeId: item.transferAccountId || "",
      placeholder: "Kaynak kart / hesap seç",
    });
    updateAnyPaymentAccountSelect(transactionTransferAccountInput, item.transferAccountId || "", {
      excludeId: item.paymentAccountId || "",
      placeholder: "Karşı kart / hesap seç",
    });
  } else {
    updatePaymentAccountSelect(transactionPaymentAccountInput, transactionPaymentMethodInput.value, item.paymentAccountId || "");
    updateTransactionTransferAccountSelect(item.transferAccountId || "");
  }
  syncTransactionTransferVisibility();
  transactionEditStatus.textContent = "";
  syncTransactionEditHeaderLayout();
  transactionEditModal.hidden = false;
  setTimeout(() => {
    transactionTitleInput.focus();
    transactionTitleInput.select();
  }, 0);
}

function closeTransactionEditModal() {
  editingTransactionId = "";
  transactionEditStatus.textContent = "";
  transactionEditForm.reset();
  if (transactionInstallmentCheckbox) transactionInstallmentCheckbox.checked = false;
  if (transactionTrackCheckbox) transactionTrackCheckbox.checked = false;
  if (transactionTrackTypeInput) transactionTrackTypeInput.value = "debt";
  if (transactionTrackDueDateInput) transactionTrackDueDateInput.value = "";
  if (transactionTrackInstallmentCountInput) transactionTrackInstallmentCountInput.value = "2";
  syncTransactionTrackingFields();
  updatePaymentAccountSelect(transactionPaymentAccountInput, "cash", "");
  updateTransactionTransferAccountSelect("");
  if (transactionTransferAccountLabel) {
    transactionTransferAccountLabel.hidden = true;
  }
  if (transactionTransferFeeLabel) {
    transactionTransferFeeLabel.hidden = true;
  }
  transactionEditModal.hidden = true;
}

function saveTransactionEdit(event) {
  event.preventDefault();

  if (!editingTransactionId) {
    return;
  }

  const type = transactionTypeInput.value === "transfer" ? "transfer" : transactionTypeInput.value;

  const title = transactionTitleInput.value.trim().slice(0, 40);

  const amount = Number(transactionAmountInput.value);

  const category = type === "transfer" ? (transactionCategoryInput.value || "Transfer") : transactionCategoryInput.value;

  const paymentMethod = type === "transfer" ? "transfer" : normalizePaymentMethod(transactionPaymentMethodInput.value);

  const paymentAccountId = String(transactionPaymentAccountInput.value || "");

  const transferAccountId = type === "transfer" ? String(transactionTransferAccountInput?.value || "") : "";

  const transferFee =
    type === "transfer" ? Math.max(0, roundMoney(readSignedNumber(transactionTransferFeeInput?.value, 0))) : 0;

  const date = transactionDateInput.value;

  const note = transactionNoteInput.value.trim().slice(0, 100);
  const isInstallment = Boolean(transactionInstallmentCheckbox?.checked);

  const time = transactionTimeInput.value ? `${transactionTimeInput.value}:00` : "";

  const transactionAt = buildTransactionDateTime(date, time || "00:00:00");
  const takipSecili = Boolean(transactionTrackCheckbox?.checked);
  const takipListeTuru = ["debt", "installment", "receivable"].includes(transactionTrackTypeInput?.value)
    ? transactionTrackTypeInput.value
    : "debt";
  const takipVadeTarihi = String(transactionTrackDueDateInput?.value || "");
  const takipTaksitSayisi = Math.max(
    2,
    Math.min(60, Math.trunc(Number(transactionTrackInstallmentCountInput?.value || 2)))
  );

  if (!["income", "expense", "transfer"].includes(type)) {
    transactionEditStatus.textContent = "İşlem tipi geçerli değil.";
    transactionTypeInput.focus();
    return;
  }

  if (!title) {
    transactionEditStatus.textContent = "İşlem adı boş olamaz.";
    transactionTitleInput.focus();
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    transactionEditStatus.textContent = "Tutar sıfırdan büyük olmalı.";
    transactionAmountInput.focus();
    return;
  }

  if (!category) {
    transactionEditStatus.textContent = "Kategori seçmelisin.";
    transactionCategoryInput.focus();
    return;
  }

  if (!date) {
    transactionEditStatus.textContent = "Tarih seçmelisin.";
    transactionDateInput.focus();
    return;
  }

  const previousTransaction = transactions.find((transaction) => transaction.id === editingTransactionId);

  const nextTransaction = {
    ...(previousTransaction || {}),
    id: editingTransactionId,
    type,
    title,
    amount,
    category,
    paymentMethod,
    paymentAccountId,
    transferAccountId,
    transferFee,
    date,
    note,
    isInstallment,
    installmentCompleted: isInstallment ? Boolean(previousTransaction?.installmentCompleted) : false,
    installmentCompletedAt: isInstallment && previousTransaction?.installmentCompleted
      ? String(previousTransaction.installmentCompletedAt || getTurkeyNowDateTime())
      : "",
    transactionAt,
    updatedAt: getTurkeyNowDateTime(),
  };
  if (previousTransaction?.debtPaymentId) {
    nextTransaction.debtAppliedAmount = amount;
  }

  if (!validateTransactionPayment(nextTransaction, transactionEditStatus)) {
    return;
  }

  if (typeof borcAlacakGelirGiderDuzenlemesiniDogrula === "function") {
    const odemeDuzenlemeHatasi = borcAlacakGelirGiderDuzenlemesiniDogrula(previousTransaction, nextTransaction);
    if (odemeDuzenlemeHatasi) {
      transactionEditStatus.textContent = odemeDuzenlemeHatasi;
      return;
    }
  }

  if (typeof borcAlacakIslemDuzenlemeTakibiniDogrula === "function") {
    const takipHatasi = borcAlacakIslemDuzenlemeTakibiniDogrula(nextTransaction, {
      selected: takipSecili,
      listType: takipListeTuru,
      dueDate: takipVadeTarihi,
      installmentCount: takipTaksitSayisi,
    });
    if (takipHatasi) {
      transactionEditStatus.textContent = takipHatasi;
      if (takipSecili && takipListeTuru === "installment" && !takipVadeTarihi) {
        transactionTrackDueDateInput?.focus();
      }
      return;
    }
  }

  const revertedPaymentAccount = previousTransaction ? applyTransactionPaymentEffect(previousTransaction, -1) : false;

  const appliedPaymentAccount = applyTransactionPaymentEffect(nextTransaction, 1);

  const cleanupIds = getLegacyTransferCounterpartIds(nextTransaction, previousTransaction);

  let cleanedPaymentAccount = false;

  cleanupIds.delete(editingTransactionId);
  cleanupIds.forEach((transactionId) => {

    const cleanupTransaction = transactions.find((transaction) => transaction.id === transactionId);
    if (cleanupTransaction) {
      cleanedPaymentAccount = applyTransactionPaymentEffect(cleanupTransaction, -1) || cleanedPaymentAccount;
    }
    markTransactionDeleted(transactionId);
  });

  transactions = transactions
    .filter((transaction) => !cleanupIds.has(transaction.id))
    .map((transaction) => (transaction.id === editingTransactionId ? nextTransaction : transaction))
    .sort(compareTransactionsNewestFirst);

  if (typeof borcAlacakIslemDuzenlemesiniTakibeUygula === "function") {
    borcAlacakIslemDuzenlemesiniTakibeUygula(nextTransaction, {
      selected: takipSecili,
      listType: takipListeTuru,
      dueDate: takipVadeTarihi,
      installmentCount: takipTaksitSayisi,
    });
  }
  if (typeof borcAlacakGelirGiderDuzenlemesiniUygula === "function") {
    borcAlacakGelirGiderDuzenlemesiniUygula(previousTransaction, nextTransaction);
  }

  if (revertedPaymentAccount || appliedPaymentAccount || cleanedPaymentAccount) {
    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
    persistPaymentAccounts();
  }
  persistTransactions({ cloudUpserts: [nextTransaction], cloudDeletes: [...cleanupIds] }).catch((error) => {
    if (transactionEditStatus) {
      transactionEditStatus.textContent = `Firebase'e kaydedilemedi: ${error.message}`;
    }
  });
  closeTransactionEditModal();
  render();
}

function syncCategorySelects() {
  updateCategoryOptions(typeInput.value);
  if (transactionTypeInput) {
    updateCategorySelect(transactionCategoryInput, transactionTypeInput.value, transactionCategoryInput.value);
  }
}

function openCategoryAddModal() {
  if (!categoryAddModal) {
    return;
  }

  categoryAddForm?.reset();
  if (categoryAddType) {
    categoryAddType.value = typeInput?.value || "expense";
  }
  if (categoryAddStatus) {
    categoryAddStatus.textContent = "";
  }
  categoryAddModal.hidden = false;
  setTimeout(() => categoryAddName?.focus(), 0);
}

function closeCategoryAddModal() {
  if (categoryAddModal) {
    categoryAddModal.hidden = true;
  }
  categoryAddForm?.reset();
  if (categoryAddStatus) {
    categoryAddStatus.textContent = "";
  }
}

function handleCategoryAdd(event) {
  event.preventDefault();

  const type = String(categoryAddType?.value || "expense");

  const name = String(categoryAddName?.value || "").trim();

  if (!name) {
    if (categoryAddStatus) {
      categoryAddStatus.textContent = "Kategori adı boş olamaz.";
    }
    return;
  }

  const exists = (transactionCategories[type] || []).some(
    (item) => item.toLocaleLowerCase("tr-TR") === name.toLocaleLowerCase("tr-TR")
  );

  if (exists) {
    if (categoryAddStatus) {
      categoryAddStatus.textContent = "Bu kategori zaten mevcut.";
    }
    return;
  }

  transactionCategories[type] = [name, ...(transactionCategories[type] || [])];
  transactionCategories = normalizeCategoryState(transactionCategories);
  persistTransactionCategories();
  syncCategorySelects();
  render();
  closeCategoryAddModal();
}

function openCategoryManageModal() {
  if (!categoryManageModal) {
    return;
  }

  if (categoryManageType) {
    categoryManageType.value = typeInput?.value || "expense";
  }
  if (categoryManageStatus) {
    categoryManageStatus.textContent = "";
  }
  renderCategoryManageList();
  categoryManageModal.hidden = false;
  setTimeout(() => categoryManageList?.querySelector("input")?.focus(), 0);
}

function closeCategoryManageModal() {
  if (categoryManageModal) {
    categoryManageModal.hidden = true;
  }
  if (categoryManageStatus) {
    categoryManageStatus.textContent = "";
  }
  if (categoryManageList) {
    categoryManageList.innerHTML = "";
  }
}

function renderCategoryManageList() {
  if (!categoryManageList) {
    return;
  }

  const type = String(categoryManageType?.value || "expense");

  const items = transactionCategories[type] || [];
  categoryManageList.innerHTML = "";

  if (!items.length) {
    categoryManageList.innerHTML = '<div class="empty-state">Bu işlem tipi için kategori bulunamadı.</div>';
    return;
  }

  items.forEach((name, index) => {

    const row = document.createElement("div");
    row.className = "category-manage-row";
    row.dataset.originalName = name;

    const dragHandle = document.createElement("button");
    dragHandle.type = "button";
    dragHandle.className = "category-drag-handle";
    dragHandle.innerHTML = shellIcon("grip-vertical");
    dragHandle.title = "Sürükleyerek sırala";
    dragHandle.setAttribute("aria-label", `${name} kategorisini sürükleyerek sırala`);
    bindCategoryDragHandle(dragHandle, row);

    const input = document.createElement("input");
    input.type = "text";
    input.value = name;
    input.maxLength = 32;
    input.autocomplete = "off";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "category-remove-button";
    deleteButton.innerHTML = shellIcon("x");
    deleteButton.title = "Kategoriyi kaldır";
    deleteButton.setAttribute("aria-label", `${name} kategorisini kaldır`);
    deleteButton.addEventListener("click", () => {
      if (categoryManageList.querySelectorAll(".category-manage-row").length <= 1) {
        categoryManageStatus.textContent = "Son kategori silinemez.";
        return;
      }
      row.remove();
      categoryManageStatus.textContent = "Değişiklikleri uygulamak için Kaydet'e bas.";
    });

    row.append(dragHandle, input, deleteButton);
    categoryManageList.append(row);
  });
  window.lucide?.createIcons();
}

function bindCategoryDragHandle(handle, row) {
  let pointerId = null;
  const moveDrag = (event) => {
    if (pointerId !== event.pointerId) return;
    event.preventDefault();
    const rows = Array.from(categoryManageList.querySelectorAll(".category-manage-row:not(.is-dragging)"));
    const nextRow = rows.find(candidate => event.clientY < candidate.getBoundingClientRect().top + candidate.offsetHeight / 2);
    if (nextRow) categoryManageList.insertBefore(row, nextRow);
    else categoryManageList.append(row);
    const bounds = categoryManageList.getBoundingClientRect();
    if (event.clientY < bounds.top + 36) categoryManageList.scrollTop -= 12;
    if (event.clientY > bounds.bottom - 36) categoryManageList.scrollTop += 12;
  };
  const finishDrag = (event) => {
    if (event && pointerId !== event.pointerId) return;
    if (pointerId === null) return;
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    pointerId = null;
    row.classList.remove("is-dragging");
    categoryManageList.classList.remove("is-reordering");
    categoryManageStatus.textContent = "Yeni sırayı uygulamak için Kaydet'e bas.";
  };

  handle.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerId = event.pointerId;
    row.classList.add("is-dragging");
    categoryManageList.classList.add("is-reordering");
    window.addEventListener("pointermove", moveDrag, { passive: false });
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    event.preventDefault();
  });
  handle.addEventListener("keydown", (event) => {
    if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const sibling = event.key === "ArrowUp" ? row.previousElementSibling : row.nextElementSibling;
    if (!sibling) return;
    if (event.key === "ArrowUp") categoryManageList.insertBefore(row, sibling);
    else categoryManageList.insertBefore(sibling, row);
    handle.focus();
    categoryManageStatus.textContent = "Yeni sırayı uygulamak için Kaydet'e bas.";
  });
}

function saveManagedCategories() {
  const type = String(categoryManageType?.value || "expense");
  const rows = Array.from(categoryManageList?.querySelectorAll(".category-manage-row") || []);
  const names = rows.map(row => String(row.querySelector("input")?.value || "").trim());
  if (!names.length || names.some(name => !name)) {
    categoryManageStatus.textContent = "Kategori adı boş olamaz.";
    return;
  }
  const foldedNames = names.map(name => name.toLocaleLowerCase("tr-TR"));
  if (new Set(foldedNames).size !== foldedNames.length) {
    categoryManageStatus.textContent = "Aynı isimde iki kategori olamaz.";
    return;
  }

  const renameMap = new Map(rows.map((row, index) => [row.dataset.originalName, names[index]]));
  const changedTransactions = [];
  transactions = transactions.map(item => {
    if (item.type !== type || !renameMap.has(item.category) || renameMap.get(item.category) === item.category) return item;
    const updatedTransaction = { ...item, category: renameMap.get(item.category), updatedAt: getTurkeyNowDateTime() };
    changedTransactions.push(updatedTransaction);
    return updatedTransaction;
  });
  transactionCategories[type] = names;
  transactionCategories = normalizeCategoryState(transactionCategories);
  persistTransactionCategories();
  if (changedTransactions.length) persistTransactions({ cloudUpserts: changedTransactions });
  syncCategorySelects();
  renderHistoryCategoryFilterOptions();
  render();
  renderCategoryManageList();
  categoryManageStatus.textContent = "Kategori adları ve sırası kaydedildi.";
}

function openEntryModal() {
  resetEntryForm();

  entryModal.hidden = false;
  setTimeout(() => form.querySelector("input, select, textarea")?.focus(), 0);
}

function closeEntryModal() {
  if (entryModal) {
    entryModal.hidden = true;
  }

  resetEntryForm();
}

function resetEntryForm() {
  if (!form) {
    return;
  }

  form.reset();

  if (typeInput) {
    typeInput.value = "income";
  }
  updateCategoryOptions("income");

  if (paymentMethodInput) {
    paymentMethodInput.value = "cash";
    paymentMethodInput.disabled = false;
  }
  updatePaymentAccountSelect(paymentAccountSelect, "cash");

  if (transferFeeInput) {
    transferFeeInput.value = "";
  }
  updateEntryTransferAccountSelect("");
  syncEntryTransferVisibility();
  if (entryDebtPaymentCheckbox) entryDebtPaymentCheckbox.checked = false;
  if (entryDebtPaymentTarget) entryDebtPaymentTarget.value = "";
  if (typeof tekliBorcAlacakOdemeAlanlariniGuncelle === "function") tekliBorcAlacakOdemeAlanlariniGuncelle();
  if (entryInstallmentCountInput) entryInstallmentCountInput.value = "2";
  if (typeof tekliTaksitAlanlariniGuncelle === "function") tekliTaksitAlanlariniGuncelle();

  if (entryFormStatus) {
    entryFormStatus.textContent = "";
  }

  if (dateInput) {
    dateInput.value = getTurkeyTodayISO();
  }
}

function openBesModal(item = null) {
  editingBesId = item?.id || "";
  besForm.reset();
  besModalTitle.textContent = item ? "BES sözleşmesini güncelle" : "BES sözleşmesi ekle";
  besSubmitButton.textContent = "Kaydet";

  if (item) {
    besForm.elements.besProvider.value = item.provider || "";
    besForm.elements.besPolicyNo.value = item.policyNo || "";
    besForm.elements.besContribution.value = item.contribution || "";
    besForm.elements.besStateContribution.value = item.stateContribution || "";
    besForm.elements.besStateGain.value = item.stateGain || "";
    besForm.elements.besGain.value = item.gain || "";
    besForm.elements.besNote.value = item.note || "";
  }

  besModal.hidden = false;
  setTimeout(() => besForm.elements.besProvider?.focus(), 0);
}

function closeBesModal() {
  editingBesId = "";

  if (besModal) {
    besModal.hidden = true;
  }

  if (besForm) {
    besForm.reset();
  }

  if (besModalTitle) {
    besModalTitle.textContent = "BES sözleşmesi ekle";
  }

  if (besSubmitButton) {
    besSubmitButton.textContent = "Kaydet";
  }
}

function renderPagination(totalCount, totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  paginationControls.innerHTML = "";

  const goToHistoryPage = (page) => {
    currentHistorySearch = searchInput ? searchInput.value : currentHistorySearch;
    currentHistoryPage = Math.min(totalPages, Math.max(1, page));
    renderTransactions();
  };

  const firstButton = document.createElement("button");
  firstButton.type = "button";
  firstButton.className = "ghost-btn pagination-edge-btn";
  firstButton.textContent = "İlk";
  firstButton.setAttribute("aria-label", "İlk kayıt sayfasına git");
  firstButton.disabled = currentHistoryPage === 1;
  firstButton.addEventListener("click", () => {
    goToHistoryPage(1);
  });

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "ghost-btn pagination-step-btn";
  previousButton.textContent = "Önceki";
  previousButton.disabled = currentHistoryPage === 1;
  previousButton.addEventListener("click", () => {
    goToHistoryPage(currentHistoryPage - 1);
  });

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ghost-btn pagination-step-btn";
  nextButton.textContent = "Sonraki";
  nextButton.disabled = currentHistoryPage === totalPages;
  nextButton.addEventListener("click", () => {
    goToHistoryPage(currentHistoryPage + 1);
  });

  const lastButton = document.createElement("button");
  lastButton.type = "button";
  lastButton.className = "ghost-btn pagination-edge-btn";
  lastButton.textContent = "Son";
  lastButton.setAttribute("aria-label", "Son kayıt sayfasına git");
  lastButton.disabled = currentHistoryPage === totalPages;
  lastButton.addEventListener("click", () => {
    goToHistoryPage(totalPages);
  });

  const label = document.createElement("span");
  label.className = "pagination-page-label";

  const firstItem = (currentHistoryPage - 1) * TRANSACTIONS_PER_PAGE + 1;

  const lastItem = Math.min(currentHistoryPage * TRANSACTIONS_PER_PAGE, totalCount);
  label.textContent = `${firstItem}-${lastItem} / ${totalCount} · Sayfa ${currentHistoryPage}/${totalPages}`;

  paginationControls.append(firstButton, previousButton, label, nextButton, lastButton);
}

function resetViewTransientState(viewId) {
  if (viewId === "homeView") {
    closeRecentTransactionsModal();
    return;
  }

  if (viewId === "entryView") {
    closeEntryModal();
    closeBulkEntryModal();
    closeBankImportModal();
    return;
  }

  if (viewId === "settingsView") {
    closeCategoryAddModal();
    closeCategoryManageModal();
    return;
  }

  if (viewId === "assetsView") {
    closeAssetEditModal();
    return;
  }

  if (viewId === "cardsView") {
    closePaymentAccountModal();
    closePaymentAccountDeleteModal();
    closePaymentAccountPayModal();
    closePaymentAccountRecordsModal();
    if (paymentAccountTypeFilter) {
      paymentAccountTypeFilter.value = "all";
    }
    return;
  }

  if (viewId === "besView") {
    closeBesModal();
    return;
  }

  if (viewId === "debtsView") {
    borcAlacakGeciciDurumunuSifirla();
    return;
  }

  if (viewId === "summaryView") {
    closeSummaryCategoryDetailModal();
    if (summaryCategoryTypeFilter) {
      summaryCategoryTypeFilter.value = "expense";
    }
    return;
  }

  if (viewId === "historyView") {
    closeTransactionEditModal();
    resetHistoryFilters();
  }
}

function switchView(viewId) {

  const previousView = activeView;
  activeView = viewMeta[viewId] ? viewId : "homeView";

  if (previousView !== activeView) {
    resetViewTransientState(previousView);
  }

  renderView();
  refreshUserProfileFromServer();

  if (activeView === "cardsView") {
    refreshAllPaymentAccountsFromRecords({ silent: false, syncCloud: true });
    renderPaymentAccounts();
  }

  if (activeView === "historyView") {
    renderTransactions();
  }

  if (activeView === "debtsView") {
    borcAlacaklariEkranaBas();
  }
}

function renderView() {

  viewSections.forEach((section) => section.classList.toggle("active", section.id === activeView));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.viewTarget === activeView));
  renderModernShell();

  if (activeView === "settingsView") {
    fillProfileForm();
    syncAppearanceControls();
    updateCloudBackupStatus();
  }

  updateHistoryResponsiveLayout();
}

const DESKTOP_SIDEBAR_STORAGE_KEY = "akisDesktopSidebarExpanded";

function isDesktopSidebarMode() {
  return window.matchMedia("(min-width: 981px)").matches;
}

function readDesktopSidebarPreference() {
  try {
    const stored = localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY);
    if (stored === null) return false;
    return stored === "1";
  } catch (error) {
    return false;
  }
}

function writeDesktopSidebarPreference(expanded) {
  try {
    localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, expanded ? "1" : "0");
  } catch (error) {
    // Yerel depolama kullanilamiyorsa sessizce varsayilan davranisa donulur.
  }
}

function setDesktopSidebarExpanded(expanded, { persist = false } = {}) {
  if (!appShell) return;
  appShell.classList.toggle("sidebar-expanded", expanded);
  mobileMenuButton?.setAttribute("aria-expanded", expanded ? "true" : "false");
  if (persist) writeDesktopSidebarPreference(expanded);
}

function syncSidebarResponsiveState() {
  if (!appShell) return;

  if (isDesktopSidebarMode()) {
    if (sidebar?.classList.contains("open") || appShell.classList.contains("menu-open")) {
      setMobileSidebarOpen(false);
    }
    setDesktopSidebarExpanded(readDesktopSidebarPreference());
    return;
  }

  appShell.classList.remove("sidebar-expanded");
  mobileMenuButton?.setAttribute("aria-expanded", "false");
}

function initSidebarResponsiveState() {
  if (window.__akisSidebarResponsiveStateBound) {
    syncSidebarResponsiveState();
    return;
  }

  syncSidebarResponsiveState();
  window.addEventListener("resize", syncSidebarResponsiveState);
  window.__akisSidebarResponsiveStateBound = true;
}

function toggleSidebar() {
  if (isDesktopSidebarMode()) {
    if (sidebar.classList.contains("open") || appShell.classList.contains("menu-open")) {
      setMobileSidebarOpen(false);
    }
    setDesktopSidebarExpanded(!appShell.classList.contains("sidebar-expanded"), { persist: true });
    return;
  }

  setMobileSidebarOpen(!sidebar.classList.contains("open"));
}

function setMobileSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  appShell.classList.toggle("menu-open", open);
  document.documentElement.classList.toggle("mobile-menu-open", open);
  document.body.classList.toggle("mobile-menu-open", open);
  mobileMenuButton?.setAttribute("aria-expanded", open ? "true" : "false");
  topbarMenuButton?.setAttribute("aria-expanded", open ? "true" : "false");
}
