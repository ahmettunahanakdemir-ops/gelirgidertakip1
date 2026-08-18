// ACIKLAMA: Ozet kategori dagilimi, kayit gecmisi, filtreler, kategori yonetimi, ekran gecisi ve yan menu.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

function getSummaryCategoryTypeFilterValue() {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = summaryCategoryTypeFilter?.value || "expense";
  return ["income", "expense", "transfer", "all"].includes(value) ? value : "expense";
}

// ACIKLAMA: getSummaryCategoryTypeLabel fonksiyonunun Turkce karsiligi "al ozet kategori tur etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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

// ACIKLAMA: getSummaryCategoryEmptyMessage fonksiyonunun Turkce karsiligi "al ozet kategori empty mesaj"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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

// ACIKLAMA: getSummaryCategoryAmount fonksiyonunun Turkce karsiligi "al ozet kategori tutar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getSummaryCategoryAmount(item) {
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(item.amount || 0);
  if (item.type === "transfer") {
    return amount + Math.max(0, Number(item.transferFee || 0));
  }

  return amount;
}

// ACIKLAMA: renderCategoryBreakdown fonksiyonunun Turkce karsiligi "ekrana bas kategori breakdown"; ilgili ekran, liste veya kartlari ekrana basar.
function renderCategoryBreakdown() {
  if (!categoryBreakdown) {
    return;
  }

  // ACIKLAMA: selectedType degiskeninin Turkce karsiligi "selected tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedType = getSummaryCategoryTypeFilterValue();
  // ACIKLAMA: typeLabel degiskeninin Turkce karsiligi "tur etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const typeLabel = getSummaryCategoryTypeLabel(selectedType);
  // ACIKLAMA: scopedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const scopedTransactions = getSummaryScopedTransactions();
  // ACIKLAMA: filteredTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const filteredTransactions = scopedTransactions.filter((item) =>
    selectedType === "all" ? ["income", "expense", "transfer"].includes(item.type) : item.type === selectedType
  );
  // ACIKLAMA: totalAmount degiskeninin Turkce karsiligi "toplam tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalAmount = filteredTransactions.reduce((sum, item) => sum + getSummaryCategoryAmount(item), 0);
  // ACIKLAMA: grouped degiskeninin Turkce karsiligi "grouped"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const grouped = filteredTransactions.reduce((acc, item) => {
    // ACIKLAMA: category degiskeninin Turkce karsiligi "kategori"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const category = item.category || (item.type === "transfer" ? "Transfer" : "Diğer");
    acc[category] = (acc[category] || 0) + getSummaryCategoryAmount(item);
    return acc;
  }, {});

  categoryBreakdown.innerHTML = "";

  // ACIKLAMA: scopeLabel degiskeninin Turkce karsiligi "scope etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: ratio degiskeninin Turkce karsiligi "ratio"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const ratio = totalAmount ? (amount / totalAmount) * 100 : 0;
      // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const row = document.createElement("div");
      row.className = `category-row category-row-${selectedType}`;
      row.innerHTML = `
        <div class="category-topline">
          <span>${escapeHtml(category)}</span>
          <span>${escapeHtml(currency.format(amount))} · %${ratio.toFixed(0)}</span>
        </div>
        <div class="category-bar">
          <span style="width:${Math.min(100, Math.max(0, ratio))}%"></span>
        </div>
      `;
      categoryBreakdown.append(row);
    });
}

// ACIKLAMA: applyHistorySearch fonksiyonunun Turkce karsiligi "uygula gecmis arama"; ilgili uygulama islemini calistirir.
function applyHistorySearch() {
  currentHistorySearch = searchInput ? searchInput.value : "";
  currentHistoryPage = 1;
  renderTransactions();
}

// ACIKLAMA: resetHistoryFilters fonksiyonunun Turkce karsiligi "sifirla gecmis filtreler"; ilgili uygulama islemini calistirir.
function resetHistoryFilters() {
  currentHistorySearch = "";
  currentHistoryPage = 1;
  if (searchInput) searchInput.value = "";
  if (filterType) filterType.value = "all";
  if (filterPaymentMethod) filterPaymentMethod.value = "all";
  if (filterPaymentAccount) filterPaymentAccount.value = "all";
  if (historyStartDate) historyStartDate.value = "";
  if (historyEndDate) historyEndDate.value = "";
  [filterType, filterPaymentMethod, filterPaymentAccount].filter(Boolean).forEach(syncHistoryCustomFilterSelect);
}

// ACIKLAMA: renderTransactions fonksiyonunun Turkce karsiligi "islemleri ekrana bas"; ilgili ekran, liste veya kartlari ekrana basar.
function renderTransactions() {
  transactionList.innerHTML = "";
  paginationControls.innerHTML = "";

  // ACIKLAMA: filtered degiskeninin Turkce karsiligi "filtrelenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    transactionList.innerHTML =
      '<div class="empty-state">Bu filtreye uygun kayıt bulunamadı.</div>';
    return;
  }

  // ACIKLAMA: totalPages degiskeninin Turkce karsiligi "toplam pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalPages = Math.max(1, Math.ceil(filtered.length / TRANSACTIONS_PER_PAGE));
  currentHistoryPage = Math.min(currentHistoryPage, totalPages);
  // ACIKLAMA: pageStart degiskeninin Turkce karsiligi "sayfa baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pageStart = (currentHistoryPage - 1) * TRANSACTIONS_PER_PAGE;
  // ACIKLAMA: pagedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const pagedTransactions = filtered.slice(pageStart, pageStart + TRANSACTIONS_PER_PAGE);

  pagedTransactions.forEach((item) => {
    transactionList.append(createTransactionListItem(item));
  });

  renderPagination(filtered.length, totalPages);
}

// ACIKLAMA: createTransactionListItem fonksiyonunun Turkce karsiligi "olustur islem liste oge"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createTransactionListItem(item, options = {}) {
  // ACIKLAMA: fragment degiskeninin Turkce karsiligi "fragment"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fragment = transactionTemplate.content.cloneNode(true);
  // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const row = fragment.querySelector(".transaction-item");
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = fragment.querySelector(".transaction-title");
  // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const meta = fragment.querySelector(".transaction-meta");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = fragment.querySelector(".transaction-amount");
  // ACIKLAMA: editButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const editButton = fragment.querySelector(".edit-transaction-btn");
  // ACIKLAMA: removeButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const removeButton = fragment.querySelector(".delete-transaction-btn");
  // ACIKLAMA: addedAt degiskeninin Turkce karsiligi "eklenen at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: addedText degiskeninin Turkce karsiligi "eklenen metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const addedText = addedAt ? formatAddedDateTime(addedAt) : "Eklenme saati bilinmiyor";
    meta.textContent = `${meta.textContent} · Eklenme: ${addedText}`;
  }

  editButton.addEventListener("click", () => {
    closeRecentTransactionsModal();
    editTransaction(item);
  });

  removeButton.addEventListener("click", () => {
    if (options.closeModalBeforeDelete) {
      closeRecentTransactionsModal();
    }
    requestTransactionDelete(item);
  });

  return fragment;
}

// ACIKLAMA: getTransactionAddedTimestamp fonksiyonunun Turkce karsiligi "al islem eklenen zaman damgasi"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function getTransactionAddedTimestamp(item) {
  return Math.max(
    getRecordTimestamp(item?.createdAt),
    getRecordTimestamp(item?.updatedAt),
    0
  );
}

// ACIKLAMA: formatAddedDateTime fonksiyonunun Turkce karsiligi "bicimlendir eklenen tarih saat"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function formatAddedDateTime(timestamp) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

// ACIKLAMA: getRecentAddedTransactions fonksiyonunun Turkce karsiligi "al son eklenen islemler"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function getRecentAddedTransactions(days = RECENT_ADDED_TRANSACTION_DAYS) {
  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = Date.now();
  // ACIKLAMA: cutoff degiskeninin Turkce karsiligi "cutoff"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cutoff = now - Math.max(1, Number(days) || RECENT_ADDED_TRANSACTION_DAYS) * 24 * 60 * 60 * 1000;

  return [...transactions]
    .filter((item) => !isTransactionDeleted(item))
    .map((item) => ({ item, addedAt: getTransactionAddedTimestamp(item) }))
    .filter(({ addedAt }) => addedAt && addedAt >= cutoff && addedAt <= now + 5 * 60 * 1000)
    .sort((first, second) => {
      // ACIKLAMA: addedDiff degiskeninin Turkce karsiligi "eklenen diff"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const addedDiff = second.addedAt - first.addedAt;
      if (addedDiff) {
        return addedDiff;
      }
      return compareTransactionsNewestFirst(first.item, second.item);
    })
    .map(({ item }) => item);
}

// ACIKLAMA: openRecentTransactionsModal fonksiyonunun Turkce karsiligi "ac son islemler pencere"; ilgili pencereyi veya ekrani acar.
function openRecentTransactionsModal() {
  if (currentUser && firebaseDb) {
    Promise.all([
      fetchCloudProfile(currentUser.uid).catch(() => ({})),
      fetchCloudTransactions(currentUser.uid, { source: "server" }).catch(() => []),
    ])
      .then(([profile, cloudTransactions]) => {
        // ACIKLAMA: backupTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
        const backupTransactions = readCloudTransactionBackupArray(profile.transactionsBackup);
        transactions = mergeTransactions(transactions, backupTransactions, cloudTransactions);
        persistTransactions({ syncCloud: false });
        renderRecentTransactionsModal();
      })
      .catch(() => renderRecentTransactionsModal());
  } else {
    renderRecentTransactionsModal();
  }

  if (recentTransactionsModal) {
    recentTransactionsModal.hidden = false;
    setTimeout(() => closeRecentTransactionsButton?.focus(), 0);
  }
}

// ACIKLAMA: closeRecentTransactionsModal fonksiyonunun Turkce karsiligi "kapat son islemler pencere"; ilgili pencereyi veya ekrani kapatir.
function closeRecentTransactionsModal() {
  if (recentTransactionsModal) {
    recentTransactionsModal.hidden = true;
  }
}

// ACIKLAMA: renderRecentTransactionsModal fonksiyonunun Turkce karsiligi "ekrana bas son islemler pencere"; ilgili ekran, liste veya kartlari ekrana basar.
function renderRecentTransactionsModal() {
  if (!recentTransactionsList) {
    return;
  }

  // ACIKLAMA: latestTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const latestTransactions = getRecentAddedTransactions(RECENT_ADDED_TRANSACTION_DAYS);
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

// ACIKLAMA: getVisibleFilteredTransactions fonksiyonunun Turkce karsiligi "al gorunur filtrelenmis islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getVisibleFilteredTransactions() {
  // ACIKLAMA: queryText degiskeninin Turkce karsiligi "query metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const queryText = currentHistorySearch;
  // ACIKLAMA: query degiskeninin Turkce karsiligi "query"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const query = queryText.trim().toLocaleLowerCase("tr-TR");
  // ACIKLAMA: selectedType degiskeninin Turkce karsiligi "selected tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedType = filterType.value;
  // ACIKLAMA: selectedPaymentMethod degiskeninin Turkce karsiligi "selected odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedPaymentMethod = filterPaymentMethod?.value || "all";
  // ACIKLAMA: selectedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const selectedPaymentAccount = filterPaymentAccount?.value || "all";
  // ACIKLAMA: sourceTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const sourceTransactions = hasHistoryDateRange() ? transactions : getDateFilteredTransactions();

  return sourceTransactions
    .filter((item) => {
      // ACIKLAMA: itemPaymentMethod degiskeninin Turkce karsiligi "oge odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const itemPaymentMethod = normalizePaymentMethod(item.paymentMethod || "cash");
      // ACIKLAMA: itemPaymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
      const itemPaymentAccountId = String(item.paymentAccountId || "");
      // ACIKLAMA: itemTransferAccountId degiskeninin Turkce karsiligi "oge aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const itemTransferAccountId = String(item.transferAccountId || "");
      // ACIKLAMA: matchesType degiskeninin Turkce karsiligi "eslesmeler tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const matchesType = selectedType === "all" || item.type === selectedType;
      // ACIKLAMA: matchesPaymentMethod degiskeninin Turkce karsiligi "eslesmeler odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const matchesPaymentMethod = selectedPaymentMethod === "all" || itemPaymentMethod === selectedPaymentMethod;
      // ACIKLAMA: matchesPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
      const matchesPaymentAccount =
        selectedPaymentAccount === "all" ||
        (selectedPaymentAccount === "none"
          ? !itemPaymentAccountId && !itemTransferAccountId
          : itemPaymentAccountId === selectedPaymentAccount || itemTransferAccountId === selectedPaymentAccount);
      // ACIKLAMA: haystack degiskeninin Turkce karsiligi "haystack"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const haystack = `${item.title} ${item.category} ${item.note} ${getTransactionPaymentInfo(item)}`.toLocaleLowerCase("tr-TR");
      // ACIKLAMA: matchesQuery degiskeninin Turkce karsiligi "eslesmeler query"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const matchesQuery = !query || haystack.includes(query);
      return matchesType && matchesPaymentMethod && matchesPaymentAccount && matchesQuery && isInHistoryDateRange(item);
    })
    .sort(compareTransactionsNewestFirst);
}

// ACIKLAMA: renderPaymentAccountFilterOptions fonksiyonunun Turkce karsiligi "ekrana bas odeme hesap filtre options"; ilgili ekran, liste veya kartlari ekrana basar.
function renderPaymentAccountFilterOptions() {
  if (!filterPaymentAccount) {
    return;
  }

  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = filterPaymentAccount.value || "all";
  // ACIKLAMA: options degiskeninin Turkce karsiligi "options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    filterPaymentAccount.append(option);
  });

  filterPaymentAccount.value = options.some((item) => item.value === currentValue) ? currentValue : "all";
  syncHistoryCustomFilterSelect(filterPaymentAccount);
}



// ACIKLAMA: initHistoryCustomFilterSelects fonksiyonunun Turkce karsiligi "baslat gecmis custom filtre selects"; ilgili uygulama islemini calistirir.
function initHistoryCustomFilterSelects() {
  [filterType, filterPaymentMethod, filterPaymentAccount].filter(Boolean).forEach((select) => {
    buildHistoryCustomFilterSelect(select);
    syncHistoryCustomFilterSelect(select);
    if (!select.dataset.customSyncBound) {
      select.addEventListener("change", () => syncHistoryCustomFilterSelect(select));
      select.dataset.customSyncBound = "1";
    }
  });

  if (!document.body.dataset.historyCustomFiltersReady) {
    document.addEventListener("click", (event) => {
      // ACIKLAMA: openDropdowns degiskeninin Turkce karsiligi "ac dropdowns"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: buildHistoryCustomFilterSelect fonksiyonunun Turkce karsiligi "olustur gecmis custom filtre secim alani"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildHistoryCustomFilterSelect(select) {
  if (!select || select.dataset.customFilterBuilt === "1") {
    return;
  }

  select.classList.add("native-filter-source");

  // ACIKLAMA: wrapper degiskeninin Turkce karsiligi "wrapper"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const wrapper = document.createElement("div");
  wrapper.className = "custom-filter-select";
  wrapper.dataset.for = select.id || "";

  // ACIKLAMA: trigger degiskeninin Turkce karsiligi "trigger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-filter-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const label = document.createElement("span");
  label.className = "custom-filter-trigger-label";
  trigger.append(label);

  // ACIKLAMA: panel degiskeninin Turkce karsiligi "panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const panel = document.createElement("div");
  panel.className = "custom-filter-menu";
  panel.setAttribute("role", "listbox");

  trigger.addEventListener("click", () => {
    // ACIKLAMA: isOpen degiskeninin Turkce karsiligi "mi ac"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: syncHistoryCustomFilterSelect fonksiyonunun Turkce karsiligi "esitle gecmis custom filtre secim alani"; bulut ve yerel veri esitleme akisini yonetir.
function syncHistoryCustomFilterSelect(select) {
  if (!select) {
    return;
  }

  // ACIKLAMA: wrapper degiskeninin Turkce karsiligi "wrapper"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const wrapper = select.parentElement?.querySelector(`.custom-filter-select[data-for="${select.id}"]`) || select.nextElementSibling;
  if (!wrapper || !wrapper.classList?.contains("custom-filter-select")) {
    return;
  }

  // ACIKLAMA: triggerLabel degiskeninin Turkce karsiligi "trigger etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const triggerLabel = wrapper.querySelector(".custom-filter-trigger-label");
  // ACIKLAMA: menu degiskeninin Turkce karsiligi "menu"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const menu = wrapper.querySelector(".custom-filter-menu");
  // ACIKLAMA: selectedOption degiskeninin Turkce karsiligi "selected option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedOption = select.options[select.selectedIndex] || select.options[0];

  if (triggerLabel) {
    triggerLabel.textContent = selectedOption?.textContent?.trim() || "Seç";
  }

  if (!menu) {
    return;
  }

  menu.innerHTML = "";

  Array.from(select.options).forEach((option) => {
    // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: hasHistoryDateRange fonksiyonunun Turkce karsiligi "var mi gecmis tarih range"; ilgili uygulama islemini calistirir.
function hasHistoryDateRange() {
  return Boolean(historyStartDate.value || historyEndDate.value);
}

// ACIKLAMA: isInHistoryDateRange fonksiyonunun Turkce karsiligi "mi in gecmis tarih range"; ilgili uygulama islemini calistirir.
function isInHistoryDateRange(item) {
  // ACIKLAMA: startDate degiskeninin Turkce karsiligi "baslangic tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const startDate = historyStartDate.value;
  // ACIKLAMA: endDate degiskeninin Turkce karsiligi "bitis tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const endDate = historyEndDate.value;

  if (!startDate && !endDate) {
    return true;
  }

  // ACIKLAMA: from degiskeninin Turkce karsiligi "kaynakli"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const from = startDate && endDate && startDate > endDate ? endDate : startDate;
  // ACIKLAMA: to degiskeninin Turkce karsiligi "ile"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const to = startDate && endDate && startDate > endDate ? startDate : endDate;

  return (!from || item.date >= from) && (!to || item.date <= to);
}

// ACIKLAMA: formatDate fonksiyonunun Turkce karsiligi "bicimlendir tarih"; degeri ekranda okunur bicime cevirir.
function formatDate(dateString) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

// ACIKLAMA: formatTransactionDateTime fonksiyonunun Turkce karsiligi "bicimlendir islem tarih saat"; degeri ekranda okunur bicime cevirir.
function formatTransactionDateTime(item) {
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTransactionTime(item);

  return time ? `${formatDate(item.date)} ${time.slice(0, 5)}` : formatDate(item.date);
}

// ACIKLAMA: compareTransactionsNewestFirst fonksiyonunun Turkce karsiligi "karsilastir islemler en yeni ilk"; ilgili uygulama islemini calistirir.
function compareTransactionsNewestFirst(a, b) {
  return (
    getTransactionSortTimestamp(b) - getTransactionSortTimestamp(a) ||
    getRecordTimestamp(b.createdAt) - getRecordTimestamp(a.createdAt) ||
    String(b.id || "").localeCompare(String(a.id || ""))
  );
}

// ACIKLAMA: getTransactionSortTimestamp fonksiyonunun Turkce karsiligi "al islem sirala zaman damgasi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionSortTimestamp(item) {
  // ACIKLAMA: transactionAt degiskeninin Turkce karsiligi "islem at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionAt = getRecordTimestamp(item.transactionAt);

  if (transactionAt) {
    return transactionAt;
  }

  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTransactionTime(item) || "00:00:00";
  return getRecordTimestamp(buildTransactionDateTime(item.date, time));
}

// ACIKLAMA: getTransactionTime fonksiyonunun Turkce karsiligi "al islem saat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionTime(item) {
  // ACIKLAMA: fromTransactionAt degiskeninin Turkce karsiligi "kaynakli islem at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fromTransactionAt = getTimePart(item.transactionAt);

  if (fromTransactionAt) {
    return fromTransactionAt;
  }

  return extractTimePart(`${item.title || ""} ${item.note || ""}`);
}

// ACIKLAMA: getRecordTimestamp fonksiyonunun Turkce karsiligi "al kayit zaman damgasi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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
    // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  }

  if (Number.isFinite(Number(value.seconds))) {
    return Number(value.seconds) * 1000;
  }

  // ACIKLAMA: timestamp degiskeninin Turkce karsiligi "zaman damgasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const timestamp = Date.parse(String(value || ""));
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

// ACIKLAMA: buildTransactionDateTime fonksiyonunun Turkce karsiligi "olustur islem tarih saat"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildTransactionDateTime(date, time = "") {
  // ACIKLAMA: datePart degiskeninin Turkce karsiligi "tarih part"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const datePart = String(date || "").slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return "";
  }

  // ACIKLAMA: timePart degiskeninin Turkce karsiligi "saat part"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const timePart = extractTimePart(time) || "00:00:00";
  return `${datePart}T${timePart}+03:00`;
}

// ACIKLAMA: getTimePart fonksiyonunun Turkce karsiligi "al saat part"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTimePart(value) {
  // ACIKLAMA: isoMatch degiskeninin Turkce karsiligi "iso eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isoMatch = String(value || "").match(/T(\d{2}:\d{2}(?::\d{2})?)/);

  if (isoMatch) {
    return extractTimePart(isoMatch[1]);
  }

  return extractTimePart(value);
}

// ACIKLAMA: extractTimePart fonksiyonunun Turkce karsiligi "ayikla saat part"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractTimePart(value) {
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = String(value || "").match(/\b([01]?\d|2[0-3])[:.][0-5]\d(?::[0-5]\d)?\b/);

  if (!match) {
    return "";
  }

  const [hour = "0", minute = "00", second = "00"] = match[0].split(/[:.]/);
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
}

// ACIKLAMA: getDateFilteredTransactions fonksiyonunun Turkce karsiligi "al tarih filtrelenmis islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDateFilteredTransactions() {
  return transactions.filter((item) => {
    const [year, month, day] = item.date.split("-");
    // ACIKLAMA: matchesYear degiskeninin Turkce karsiligi "eslesmeler yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matchesYear = selectedYear === "all" || year === selectedYear;
    // ACIKLAMA: matchesMonth degiskeninin Turkce karsiligi "eslesmeler ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matchesMonth = selectedMonth === "all" || month === selectedMonth;
    // ACIKLAMA: matchesDay degiskeninin Turkce karsiligi "eslesmeler gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matchesDay = selectedDay === "all" || day === selectedDay;
    return matchesYear && matchesMonth && matchesDay;
  });
}

// ACIKLAMA: updateDateFilterOptions fonksiyonunun Turkce karsiligi "guncelle tarih filtre options"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateDateFilterOptions() {
  return;
}

// ACIKLAMA: updateDayOptions fonksiyonunun Turkce karsiligi "guncelle gun options"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateDayOptions() {
  return;
}

// ACIKLAMA: createFilterOption fonksiyonunun Turkce karsiligi "olustur filtre option"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createFilterOption(value, label) {
  // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

// ACIKLAMA: getMonthNumbers fonksiyonunun Turkce karsiligi "al ay numbers"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getMonthNumbers() {
  return Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
}

// ACIKLAMA: getMonthName fonksiyonunun Turkce karsiligi "al ay adi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getMonthName(month) {
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
  }).format(new Date(2026, Number(month) - 1, 1));
}

// ACIKLAMA: getDayNumbersForSelection fonksiyonunun Turkce karsiligi "al gun numbers icin secim"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDayNumbersForSelection() {
  if (selectedYear !== "all" && selectedMonth !== "all") {
    // ACIKLAMA: lastDay degiskeninin Turkce karsiligi "son gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const lastDay = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate();
    return Array.from({ length: lastDay }, (_, index) => String(index + 1).padStart(2, "0"));
  }

  return Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
}

// ACIKLAMA: getDateFilterLabel fonksiyonunun Turkce karsiligi "al tarih filtre etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDateFilterLabel() {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getHistoryFilterLabel fonksiyonunun Turkce karsiligi "al gecmis filtre etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHistoryFilterLabel() {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = [];

  if (!hasHistoryDateRange()) {
    parts.push(getDateFilterLabel());
  } else {
    // ACIKLAMA: startDate degiskeninin Turkce karsiligi "baslangic tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const startDate = historyStartDate.value;
    // ACIKLAMA: endDate degiskeninin Turkce karsiligi "bitis tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const endDate = historyEndDate.value;

    if (startDate && endDate) {
      // ACIKLAMA: from degiskeninin Turkce karsiligi "kaynakli"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const from = startDate > endDate ? endDate : startDate;
      // ACIKLAMA: to degiskeninin Turkce karsiligi "ile"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const to = startDate > endDate ? startDate : endDate;
      parts.push(`${formatDate(from)} - ${formatDate(to)}`);
    } else if (startDate) {
      parts.push(`${formatDate(startDate)} sonrası`);
    } else {
      parts.push(`${formatDate(endDate)} öncesi`);
    }
  }

  // ACIKLAMA: selectedPaymentMethod degiskeninin Turkce karsiligi "selected odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedPaymentMethod = filterPaymentMethod?.value || "all";
  // ACIKLAMA: selectedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const selectedPaymentAccount = filterPaymentAccount?.value || "all";

  if (selectedPaymentMethod !== "all") {
    parts.push(getPaymentMethodLabel(selectedPaymentMethod));
  }

  if (selectedPaymentAccount !== "all") {
    if (selectedPaymentAccount === "none") {
      parts.push("Nakit / hesap yok");
    } else {
      // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const account = paymentAccounts.find((item) => item.id === selectedPaymentAccount);
      if (account) {
        parts.push(formatPaymentAccountName(account));
      }
    }
  }

  return parts.join(" · ");
}

// ACIKLAMA: Islem duzenleme penceresindeki takip kutusu, tur ve taksit alanlarini birlikte yonetir.
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

// ACIKLAMA: editTransaction fonksiyonunun Turkce karsiligi "duzenle islem"; ilgili uygulama islemini calistirir.
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
  transactionEditModal.hidden = false;
  setTimeout(() => {
    transactionTitleInput.focus();
    transactionTitleInput.select();
  }, 0);
}

// ACIKLAMA: closeTransactionEditModal fonksiyonunun Turkce karsiligi "kapat islem duzenle pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: saveTransactionEdit fonksiyonunun Turkce karsiligi "kaydet islem duzenle"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveTransactionEdit(event) {
  event.preventDefault();

  if (!editingTransactionId) {
    return;
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = transactionTypeInput.value === "transfer" ? "transfer" : transactionTypeInput.value;
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = transactionTitleInput.value.trim().slice(0, 40);
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transactionAmountInput.value);
  // ACIKLAMA: category degiskeninin Turkce karsiligi "kategori"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const category = type === "transfer" ? (transactionCategoryInput.value || "Transfer") : transactionCategoryInput.value;
  // ACIKLAMA: paymentMethod degiskeninin Turkce karsiligi "odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const paymentMethod = type === "transfer" ? "transfer" : normalizePaymentMethod(transactionPaymentMethodInput.value);
  // ACIKLAMA: paymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const paymentAccountId = String(transactionPaymentAccountInput.value || "");
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccountId = type === "transfer" ? String(transactionTransferAccountInput?.value || "") : "";
  // ACIKLAMA: transferFee degiskeninin Turkce karsiligi "aktarim ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferFee =
    type === "transfer" ? Math.max(0, roundMoney(readSignedNumber(transactionTransferFeeInput?.value, 0))) : 0;
  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = transactionDateInput.value;
  // ACIKLAMA: note degiskeninin Turkce karsiligi "note"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const note = transactionNoteInput.value.trim().slice(0, 100);
  const isInstallment = Boolean(transactionInstallmentCheckbox?.checked);
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = transactionTimeInput.value ? `${transactionTimeInput.value}:00` : "";
  // ACIKLAMA: transactionAt degiskeninin Turkce karsiligi "islem at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: previousTransaction degiskeninin Turkce karsiligi "previous islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousTransaction = transactions.find((transaction) => transaction.id === editingTransactionId);
  // ACIKLAMA: nextTransaction degiskeninin Turkce karsiligi "sonraki islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  if (!validateTransactionPayment(nextTransaction, transactionEditStatus)) {
    return;
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

  // ACIKLAMA: revertedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const revertedPaymentAccount = previousTransaction ? applyTransactionPaymentEffect(previousTransaction, -1) : false;
  // ACIKLAMA: appliedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const appliedPaymentAccount = applyTransactionPaymentEffect(nextTransaction, 1);
  // ACIKLAMA: cleanupIds degiskeninin Turkce karsiligi "cleanup kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cleanupIds = getLegacyTransferCounterpartIds(nextTransaction, previousTransaction);
  // ACIKLAMA: cleanedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  let cleanedPaymentAccount = false;

  cleanupIds.delete(editingTransactionId);
  cleanupIds.forEach((transactionId) => {
    // ACIKLAMA: cleanupTransaction degiskeninin Turkce karsiligi "cleanup islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getCategoryTypeLabel fonksiyonunun Turkce karsiligi "al kategori tur etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCategoryTypeLabel(type) {
  if (type === "income") return "Gelir";
  if (type === "transfer") return "Transfer";
  return "Gider";
}

// ACIKLAMA: syncCategorySelects fonksiyonunun Turkce karsiligi "esitle kategori selects"; bulut ve yerel veri esitleme akisini yonetir.
function syncCategorySelects() {
  updateCategoryOptions(typeInput.value);
  if (transactionTypeInput) {
    updateCategorySelect(transactionCategoryInput, transactionTypeInput.value, transactionCategoryInput.value);
  }
}

// ACIKLAMA: openCategoryAddModal fonksiyonunun Turkce karsiligi "ac kategori add pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closeCategoryAddModal fonksiyonunun Turkce karsiligi "kapat kategori add pencere"; ilgili pencereyi veya ekrani kapatir.
function closeCategoryAddModal() {
  if (categoryAddModal) {
    categoryAddModal.hidden = true;
  }
  categoryAddForm?.reset();
  if (categoryAddStatus) {
    categoryAddStatus.textContent = "";
  }
}

// ACIKLAMA: handleCategoryAdd fonksiyonunun Turkce karsiligi "handle kategori add"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function handleCategoryAdd(event) {
  event.preventDefault();
  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = String(categoryAddType?.value || "expense");
  // ACIKLAMA: name degiskeninin Turkce karsiligi "adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const name = String(categoryAddName?.value || "").trim();

  if (!name) {
    if (categoryAddStatus) {
      categoryAddStatus.textContent = "Kategori adı boş olamaz.";
    }
    return;
  }

  // ACIKLAMA: exists degiskeninin Turkce karsiligi "exists"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openCategoryManageModal fonksiyonunun Turkce karsiligi "ac kategori manage pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closeCategoryManageModal fonksiyonunun Turkce karsiligi "kapat kategori manage pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: renderCategoryManageList fonksiyonunun Turkce karsiligi "ekrana bas kategori manage liste"; ilgili ekran, liste veya kartlari ekrana basar.
function renderCategoryManageList() {
  if (!categoryManageList) {
    return;
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = String(categoryManageType?.value || "expense");
  // ACIKLAMA: items degiskeninin Turkce karsiligi "ogeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const items = transactionCategories[type] || [];
  categoryManageList.innerHTML = "";

  if (!items.length) {
    categoryManageList.innerHTML = '<div class="empty-state">Bu işlem tipi için kategori bulunamadı.</div>';
    return;
  }

  items.forEach((name, index) => {
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("div");
    row.className = "category-manage-row";

    // ACIKLAMA: input kullanicidan veri alan input elemaninin DOM referansidir.
    const input = document.createElement("input");
    input.type = "text";
    input.value = name;
    input.maxLength = 32;
    input.autocomplete = "off";

    const orderActions = document.createElement("div");
    orderActions.className = "category-order-actions";
    const moveUpButton = document.createElement("button");
    moveUpButton.type = "button";
    moveUpButton.className = "ghost-btn category-order-button";
    moveUpButton.textContent = "↑";
    moveUpButton.title = "Yukarı taşı";
    moveUpButton.setAttribute("aria-label", `${name} kategorisini yukarı taşı`);
    moveUpButton.disabled = index === 0;
    moveUpButton.addEventListener("click", () => moveManagedCategory(type, name, -1));

    const moveDownButton = document.createElement("button");
    moveDownButton.type = "button";
    moveDownButton.className = "ghost-btn category-order-button";
    moveDownButton.textContent = "↓";
    moveDownButton.title = "Aşağı taşı";
    moveDownButton.setAttribute("aria-label", `${name} kategorisini aşağı taşı`);
    moveDownButton.disabled = index === items.length - 1;
    moveDownButton.addEventListener("click", () => moveManagedCategory(type, name, 1));
    orderActions.append(moveUpButton, moveDownButton);

    // ACIKLAMA: saveButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "primary-btn";
    saveButton.textContent = "Kaydet";
    saveButton.addEventListener("click", () => renameManagedCategory(type, name, input.value));

    // ACIKLAMA: deleteButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-btn";
    deleteButton.textContent = "Sil";
    deleteButton.addEventListener("click", () => deleteManagedCategory(type, name));

    row.append(input, orderActions, saveButton, deleteButton);
    categoryManageList.append(row);
  });
}

// ACIKLAMA: Kategoriyi secilen yonde bir sira tasir ve yeni sirayi yerel/bulut profile kaydeder.
function moveManagedCategory(type, name, direction) {
  const categoryList = [...(transactionCategories[type] || [])];
  const currentIndex = categoryList.findIndex((item) => item === name);
  const nextIndex = currentIndex + (direction < 0 ? -1 : 1);
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= categoryList.length) {
    return;
  }

  [categoryList[currentIndex], categoryList[nextIndex]] = [categoryList[nextIndex], categoryList[currentIndex]];
  transactionCategories[type] = categoryList;
  transactionCategories = normalizeCategoryState(transactionCategories);
  persistTransactionCategories();
  syncCategorySelects();
  renderCategoryManageList();
  render();
  if (categoryManageStatus) {
    categoryManageStatus.textContent = `${name} kategorisinin sırası güncellendi.`;
  }
}

// ACIKLAMA: renameManagedCategory fonksiyonunun Turkce karsiligi "rename managed kategori"; ilgili uygulama islemini calistirir.
function renameManagedCategory(type, previousName, nextName) {
  // ACIKLAMA: newName degiskeninin Turkce karsiligi "new adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const newName = String(nextName || "").trim();
  if (!newName) {
    if (categoryManageStatus) {
      categoryManageStatus.textContent = "Kategori adı boş olamaz.";
    }
    return;
  }

  // ACIKLAMA: categoryList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
  const categoryList = [...(transactionCategories[type] || [])];
  // ACIKLAMA: duplicate degiskeninin Turkce karsiligi "duplicate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const duplicate = categoryList.some(
    (item) => item !== previousName && item.toLocaleLowerCase("tr-TR") === newName.toLocaleLowerCase("tr-TR")
  );
  if (duplicate) {
    if (categoryManageStatus) {
      categoryManageStatus.textContent = "Bu isimde başka bir kategori zaten var.";
    }
    return;
  }

  // ACIKLAMA: index degiskeninin Turkce karsiligi "dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const index = categoryList.findIndex((item) => item === previousName);
  if (index === -1) {
    return;
  }

  categoryList[index] = newName;
  transactionCategories[type] = categoryList;
  transactionCategories = normalizeCategoryState(transactionCategories);

  // ACIKLAMA: changedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const changedTransactions = [];
  transactions = transactions.map((item) => {
    if (item.type === type && item.category === previousName) {
      // ACIKLAMA: updatedTransaction degiskeninin Turkce karsiligi "updated islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const updatedTransaction = { ...item, category: newName, updatedAt: getTurkeyNowDateTime() };
      changedTransactions.push(updatedTransaction);
      return updatedTransaction;
    }
    return item;
  });

  persistTransactionCategories();
  if (changedTransactions.length) {
    persistTransactions({ cloudUpserts: changedTransactions });
  }
  syncCategorySelects();
  renderCategoryManageList();
  render();
  if (categoryManageStatus) {
    categoryManageStatus.textContent = `${getCategoryTypeLabel(type)} kategorisi güncellendi.`;
  }
}

// ACIKLAMA: deleteManagedCategory fonksiyonunun Turkce karsiligi "sil managed kategori"; secilen kaydi siler veya listeden kaldirir.
function deleteManagedCategory(type, name) {
  // ACIKLAMA: categoryList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
  const categoryList = [...(transactionCategories[type] || [])];
  if (categoryList.length <= 1) {
    if (categoryManageStatus) {
      categoryManageStatus.textContent = "Son kategori silinemez.";
    }
    return;
  }

  transactionCategories[type] = categoryList.filter((item) => item !== name);
  transactionCategories = normalizeCategoryState(transactionCategories);
  persistTransactionCategories();
  syncCategorySelects();
  renderCategoryManageList();
  render();
  if (categoryManageStatus) {
    categoryManageStatus.textContent = `${name} kategorisi kaldırıldı.`;
  }
}

// ACIKLAMA: openEntryModal fonksiyonunun Turkce karsiligi "ac entry pencere"; ilgili pencereyi veya ekrani acar.
function openEntryModal() {
  resetEntryForm();

  entryModal.hidden = false;
  setTimeout(() => form.querySelector("input, select, textarea")?.focus(), 0);
}

// ACIKLAMA: closeEntryModal fonksiyonunun Turkce karsiligi "kapat entry pencere"; ilgili pencereyi veya ekrani kapatir.
function closeEntryModal() {
  if (entryModal) {
    entryModal.hidden = true;
  }

  resetEntryForm();
}

// ACIKLAMA: Tekli gelir/gider formunu her acilis ve kapanista varsayilan bos durumuna getirir.
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
  if (entryInstallmentCountInput) entryInstallmentCountInput.value = "2";
  if (typeof tekliTaksitAlanlariniGuncelle === "function") tekliTaksitAlanlariniGuncelle();

  if (entryFormStatus) {
    entryFormStatus.textContent = "";
  }

  if (dateInput) {
    dateInput.value = getTurkeyTodayISO();
  }
}

// ACIKLAMA: openBesModal fonksiyonunun Turkce karsiligi "ac BES pencere"; ilgili pencereyi veya ekrani acar.
function openBesModal(item = null) {
  editingBesId = item?.id || "";
  besForm.reset();
  besModalTitle.textContent = item ? "BES sözleşmesini güncelle" : "BES sözleşmesi ekle";
  besSubmitButton.textContent = item ? "BES Güncelle" : "BES Ekle";

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

// ACIKLAMA: closeBesModal fonksiyonunun Turkce karsiligi "kapat BES pencere"; ilgili pencereyi veya ekrani kapatir.
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
    besSubmitButton.textContent = "BES Ekle";
  }
}

// ACIKLAMA: renderPagination fonksiyonunun Turkce karsiligi "ekrana bas sayfalama"; ilgili ekran, liste veya kartlari ekrana basar.
function renderPagination(totalCount, totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  paginationControls.innerHTML = "";

  // ACIKLAMA: goToHistoryPage fonksiyonunun Turkce karsiligi "gecmis sayfasina git"; kayit listesini istenen sayfaya tasir.
  const goToHistoryPage = (page) => {
    currentHistorySearch = searchInput ? searchInput.value : currentHistorySearch;
    currentHistoryPage = Math.min(totalPages, Math.max(1, page));
    renderTransactions();
  };

  // ACIKLAMA: firstButton kayit listesini ilk sayfaya goturen butondur.
  const firstButton = document.createElement("button");
  firstButton.type = "button";
  firstButton.className = "ghost-btn pagination-edge-btn";
  firstButton.textContent = "İlk";
  firstButton.setAttribute("aria-label", "İlk kayıt sayfasına git");
  firstButton.disabled = currentHistoryPage === 1;
  firstButton.addEventListener("click", () => {
    goToHistoryPage(1);
  });

  // ACIKLAMA: previousButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "ghost-btn pagination-step-btn";
  previousButton.textContent = "Önceki";
  previousButton.disabled = currentHistoryPage === 1;
  previousButton.addEventListener("click", () => {
    goToHistoryPage(currentHistoryPage - 1);
  });

  // ACIKLAMA: nextButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ghost-btn pagination-step-btn";
  nextButton.textContent = "Sonraki";
  nextButton.disabled = currentHistoryPage === totalPages;
  nextButton.addEventListener("click", () => {
    goToHistoryPage(currentHistoryPage + 1);
  });

  // ACIKLAMA: lastButton kayit listesini son sayfaya goturen butondur.
  const lastButton = document.createElement("button");
  lastButton.type = "button";
  lastButton.className = "ghost-btn pagination-edge-btn";
  lastButton.textContent = "Son";
  lastButton.setAttribute("aria-label", "Son kayıt sayfasına git");
  lastButton.disabled = currentHistoryPage === totalPages;
  lastButton.addEventListener("click", () => {
    goToHistoryPage(totalPages);
  });

  // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const label = document.createElement("span");
  label.className = "pagination-page-label";
  // ACIKLAMA: firstItem degiskeninin Turkce karsiligi "ilk oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const firstItem = (currentHistoryPage - 1) * TRANSACTIONS_PER_PAGE + 1;
  // ACIKLAMA: lastItem degiskeninin Turkce karsiligi "son oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastItem = Math.min(currentHistoryPage * TRANSACTIONS_PER_PAGE, totalCount);
  label.textContent = `${firstItem}-${lastItem} / ${totalCount} · Sayfa ${currentHistoryPage}/${totalPages}`;

  paginationControls.append(firstButton, previousButton, label, nextButton, lastButton);
}

// ACIKLAMA: clearHistorySearch fonksiyonunun Turkce karsiligi "temizle gecmis arama"; ilgili uygulama islemini calistirir.
function clearHistorySearch() {
  currentHistorySearch = "";
  if (searchInput.value) {
    searchInput.value = "";
  }
}

// ACIKLAMA: Bir ekrandan ayrilirken o ekrana ait gecici filtreleri, formlari ve acik pencereleri temizler.
function resetViewTransientState(viewId) {
  if (viewId === "homeView") {
    closeRecentTransactionsModal();
    return;
  }

  if (viewId === "entryView") {
    closeEntryModal();
    closeBulkEntryModal();
    closeCategoryAddModal();
    closeCategoryManageModal();
    clearHomeSummaryFilter();
    resetBankImportInputState(null);
    if (bankImportStatus) {
      bankImportStatus.textContent = "";
    }
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
    clearHomeSummaryFilter();
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

// ACIKLAMA: switchView fonksiyonunun Turkce karsiligi "ekran degistir ekran"; ilgili uygulama islemini calistirir.
function switchView(viewId) {
  // ACIKLAMA: previousView uygulamadaki ilgili ekran/gorunum alanini temsil eder.
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

// ACIKLAMA: renderView fonksiyonunun Turkce karsiligi "ekrana bas ekran"; ilgili ekran, liste veya kartlari ekrana basar.
function renderView() {
  // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const meta = viewMeta[activeView];

  viewSections.forEach((section) => section.classList.toggle("active", section.id === activeView));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.viewTarget === activeView));
  pageKicker.textContent = meta.kicker;
  pageTitle.textContent = meta.title;
  pageSubtitle.textContent = meta.subtitle;

  if (activeView === "userView") {
    fillProfileForm();
  }

  if (activeView === "settingsView") {
    syncAppearanceControls();
    updateCloudBackupStatus();
  }

  updateHistoryResponsiveLayout();
}

// ACIKLAMA: toggleSidebar fonksiyonunun Turkce karsiligi "ac kapat sidebar"; ilgili uygulama islemini calistirir.
function toggleSidebar() {
  if (window.matchMedia("(min-width: 981px)").matches) {
    appShell.classList.toggle("sidebar-expanded");
    return;
  }

  setMobileSidebarOpen(!sidebar.classList.contains("open"));
}

// ACIKLAMA: setMobileSidebarOpen fonksiyonunun Turkce karsiligi "ayarla mobil sidebar ac"; ilgili pencereyi veya ekrani acar.
function setMobileSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  appShell.classList.toggle("menu-open", open);
}
