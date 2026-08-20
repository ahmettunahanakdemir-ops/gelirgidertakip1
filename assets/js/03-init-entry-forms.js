// ACIKLAMA: Uygulama baslatma fonksiyonu, olay baglantilari, gelir/gider ve coklu kayit formlari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

function init() {
  syncPwaStandaloneClass();
  hideAllStartupModals();
  hideStartupSplash();
  mountModalForms();
  standardizeModalLayouts();
  authEmail.value = loadLastUsername();
  authPassword.value = "";
  initThemePreference();
  // Açılışta şifre alanına otomatik odaklanma yapılmıyor.
  // Böylece tarayıcının "parolayı otomatik doldur" penceresi splash/login geçişinde açılmaz.
  dateInput.value = getTurkeyTodayISO();
  mountSummaryFilterPanel();
  bindHomeSummaryFilterControls();
  syncHomeSummaryFilterControls();
  updateCategoryOptions(typeInput.value);
  updatePaymentAccountFormVisibility();
  updatePaymentAccountSelect(paymentAccountSelect, paymentMethodInput?.value || "cash");
  syncEntryTransferVisibility();
  tekliBorcAlacakOdemeAlanlariniGuncelle();
  tekliTaksitAlanlariniGuncelle();
  syncBankImportAccountSelects();
  setupBulkEntryForm();
  setupBorcAlacakTakibi();
  render();
  initHistoryCustomFilterSelects();
  bindHistoryResponsiveLayout();
  bindHistorySearchFallback();
  setupMobileBoundaryScrollLock();
  registerServiceWorker();
  initCardReminderNotifications();
  updateCloudBackupStatus();
  if (!window.__akisWealthFitBound) {
    window.addEventListener("resize", fitHomeWealthTotalText);
    window.__akisWealthFitBound = true;
  }

  typeInput.addEventListener("change", () => {
    updateCategoryOptions(typeInput.value);
    syncEntryTransferVisibility();
    tekliBorcAlacakOdemeAlanlariniGuncelle();
    tekliTaksitAlanlariniGuncelle();
  });
  entryInstallmentCheckbox?.addEventListener("change", tekliTaksitAlanlariniGuncelle);
  entryDebtPaymentCheckbox?.addEventListener("change", () => {
    tekliBorcAlacakOdemeAlanlariniGuncelle();
    tekliTaksitAlanlariniGuncelle();
  });
  entryDebtPaymentTarget?.addEventListener("change", tekliBorcAlacakOdemeSecimNotunuGuncelle);
  paymentMethodInput?.addEventListener("change", () => {
    updatePaymentAccountSelect(paymentAccountSelect, paymentMethodInput.value);
  });
  paymentAccountSelect?.addEventListener("change", () => {
    updateEntryTransferAccountSelect();
  });
  transferAccountSelect?.addEventListener("change", () => {
    if (typeInput?.value === "transfer") {
      updateAnyPaymentAccountSelect(paymentAccountSelect, paymentAccountSelect?.value || "", {
        excludeId: transferAccountSelect.value,
        placeholder: "Kaynak kart / hesap seç",
      });
    }
  });
  filterType.addEventListener("change", () => {
    currentHistoryPage = 1;
    renderTransactions();
  });
  filterPaymentMethod?.addEventListener("change", () => {
    currentHistoryPage = 1;
    renderTransactions();
  });
  filterPaymentAccount?.addEventListener("change", () => {
    currentHistoryPage = 1;
    renderTransactions();
  });
  paymentAccountTypeFilter?.addEventListener("change", () => {
    renderPaymentAccounts();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyHistorySearch();
    }
  });
  historySearchButton?.addEventListener("click", () => {
    applyHistorySearch();
  });
  summaryCategoryTypeFilter?.addEventListener("change", () => {
    renderCategoryBreakdown();
  });
  historyStartDate.addEventListener("change", () => {
    currentHistoryPage = 1;
    renderTransactions();
  });
  historyEndDate.addEventListener("change", () => {
    currentHistoryPage = 1;
    renderTransactions();
  });
  clearHistoryRangeButton.addEventListener("click", () => {
    resetHistoryFilters();
    renderTransactions();
  });
  exportButton?.addEventListener("click", exportTransactions);
  exportPdfButton?.addEventListener("click", exportFilteredTransactionsPdf);
  exportExcelButton?.addEventListener("click", exportFilteredTransactionsExcel);
  openRecentTransactionsButton?.addEventListener("click", openRecentTransactionsModal);
  closeRecentTransactionsButton?.addEventListener("click", closeRecentTransactionsModal);
  cloudBackupButton?.addEventListener("click", backupCurrentDataToCloud);
  localBackupDownloadButton?.addEventListener("click", downloadLocalDataBackup);
  localBackupImportButton?.addEventListener("click", () => {
    localBackupImportInput?.click();
  });
  localBackupImportInput?.addEventListener("change", importLocalDataBackupFile);
  recentTransactionsModal?.addEventListener("click", (event) => {
    if (event.target === recentTransactionsModal) {
      closeRecentTransactionsModal();
    }
  });
  importFile?.addEventListener("change", importTransactions);
  generateSyncButton?.addEventListener("click", generateSyncCode);
  copySyncButton?.addEventListener("click", copySyncCode);
  importSyncButton?.addEventListener("click", importSyncCode);
  bankImportFile.addEventListener("change", handleBankImportFile);
  bankImportAddButton.addEventListener("click", previewBankImportWithAi);
  bankImportLocalButton?.addEventListener("click", addSelectedBankFiles);
  bankImportAccountSelect?.addEventListener("change", () => {
    syncBankImportAccountSelects(bankImportAccountSelect.value);
    applyBankImportAccountToPending(bankImportAccountSelect.value);
  });
  bankImportTransferAccountSelect?.addEventListener("change", () => {
    syncBankImportTransferAccountSelects(bankImportTransferAccountSelect.value);
    applyBankImportTransferAccountToPending(bankImportTransferAccountSelect.value);
  });
  bankImportPreviewAccount?.addEventListener("change", () => {
    syncBankImportAccountSelects(bankImportPreviewAccount.value);
    applyBankImportAccountToPending(bankImportPreviewAccount.value);
  });
  bankImportPreviewTransferAccount?.addEventListener("change", () => {
    syncBankImportTransferAccountSelects(bankImportPreviewTransferAccount.value);
    applyBankImportTransferAccountToPending(bankImportPreviewTransferAccount.value);
  });
  bankImportSelectAllButton?.addEventListener("click", () => setBankImportPreviewSelection(true));
  bankImportClearSelectionButton?.addEventListener("click", () => setBankImportPreviewSelection(false));
  bankImportPreviewConfirmButton?.addEventListener("click", () => confirmBankImport());
  bankImportPreviewCloseButton?.addEventListener("click", closeBankImportPreviewModal);
  bankImportPreviewModal?.addEventListener("click", (event) => {
    if (event.target === bankImportPreviewModal) {
      closeBankImportPreviewModal();
    }
  });
  bankImportCancelButton.addEventListener("click", clearBankImport);
  previewBankImportButton?.addEventListener("click", previewBankImport);
  confirmBankImportButton?.addEventListener("click", confirmBankImport);
  clearBankImportButton?.addEventListener("click", clearBankImport);
  openAssetAddModalButton?.addEventListener("click", openAssetAddModal);
  assetEditForm?.addEventListener("submit", saveAssetModal);
  closeAssetEditModalButton?.addEventListener("click", closeAssetEditModal);
  assetEditModal?.addEventListener("click", (event) => {
    if (event.target === assetEditModal) {
      closeAssetEditModal();
    }
  });
  openPaymentAccountModalButton?.addEventListener("click", () => openPaymentAccountModal());
  closePaymentAccountModalButton?.addEventListener("click", closePaymentAccountModal);
  paymentAccountModal?.addEventListener("click", (event) => {
    if (event.target === paymentAccountModal) {
      closePaymentAccountModal();
    }
  });
  paymentAccountForm?.addEventListener("submit", addPaymentAccount);
  paymentAccountType?.addEventListener("change", updatePaymentAccountFormVisibility);
  confirmDeletePaymentAccountButton?.addEventListener("click", deletePaymentAccountAfterConfirmation);
  cancelDeletePaymentAccountButton?.addEventListener("click", closePaymentAccountDeleteModal);
  confirmPaymentAccountDeleteModal?.addEventListener("click", (event) => {
    if (event.target === confirmPaymentAccountDeleteModal) {
      closePaymentAccountDeleteModal();
    }
  });
  genericConfirmButton?.addEventListener("click", runGenericConfirmAction);
  genericConfirmCancelButton?.addEventListener("click", closeGenericConfirmModal);
  genericConfirmModal?.addEventListener("click", (event) => {
    if (event.target === genericConfirmModal) {
      closeGenericConfirmModal();
    }
  });
  paymentAccountPayForm?.addEventListener("submit", payCreditCardDebt);
  closePaymentAccountPayButton?.addEventListener("click", closePaymentAccountPayModal);
  paymentAccountPayModal?.addEventListener("click", (event) => {
    if (event.target === paymentAccountPayModal) {
      closePaymentAccountPayModal();
    }
  });
  closePaymentAccountRecordsButton?.addEventListener("click", closePaymentAccountRecordsModal);
  refreshPaymentAccountFromRecordsButton?.addEventListener("click", () => {
    refreshPaymentAccountFromRecords(viewingPaymentAccountRecordsId);
  });
  paymentAccountRecordsModal?.addEventListener("click", (event) => {
    if (event.target === paymentAccountRecordsModal) {
      closePaymentAccountRecordsModal();
    }
  });
  refreshPricesButton.addEventListener("click", () => refreshMarketPrices());
  besForm.addEventListener("submit", addBesAccount);
  openEntryModalButton?.addEventListener("click", openEntryModal);
  closeEntryModalButton?.addEventListener("click", closeEntryModal);
  entryModal?.addEventListener("click", (event) => {
    if (event.target === entryModal) {
      closeEntryModal();
    }
  });
  openBulkEntryModalButton?.addEventListener("click", openBulkEntryModal);
  closeBulkEntryModalButton?.addEventListener("click", closeBulkEntryModal);
  bulkEntryModal?.addEventListener("click", (event) => {
    if (event.target === bulkEntryModal) {
      closeBulkEntryModal();
    }
  });
  openCategoryAddModalButton?.addEventListener("click", openCategoryAddModal);
  closeCategoryAddModalButton?.addEventListener("click", closeCategoryAddModal);
  categoryAddModal?.addEventListener("click", (event) => {
    if (event.target === categoryAddModal) {
      closeCategoryAddModal();
    }
  });
  categoryAddForm?.addEventListener("submit", handleCategoryAdd);
  openCategoryManageModalButton?.addEventListener("click", openCategoryManageModal);
  closeCategoryManageModalButton?.addEventListener("click", closeCategoryManageModal);
  categoryManageModal?.addEventListener("click", (event) => {
    if (event.target === categoryManageModal) {
      closeCategoryManageModal();
    }
  });
  categoryManageType?.addEventListener("change", renderCategoryManageList);
  openBesModalButton?.addEventListener("click", () => openBesModal());
  closeBesModalButton?.addEventListener("click", closeBesModal);
  besModal?.addEventListener("click", (event) => {
    if (event.target === besModal) {
      closeBesModal();
    }
  });
  mobileMenuButton.addEventListener("click", toggleSidebar);
  topbarMenuButton.addEventListener("click", toggleSidebar);
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      switchView(item.dataset.viewTarget);
      setMobileSidebarOpen(false);
    });
  });
  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signInWithEmail();
  });
  createAccountButton.addEventListener("click", openSignupPanel);
  forgotPasswordButton.addEventListener("click", openResetPanel);
  signupForm?.addEventListener("submit", createAccountWithEmail);
  cancelSignupButton?.addEventListener("click", () => showAuthPanel("login"));
  resetPasswordForm?.addEventListener("submit", sendPasswordReset);
  cancelResetButton?.addEventListener("click", () => showAuthPanel("login"));
  logoutButton?.addEventListener("click", signOutUser);
  footerLogoutButton?.addEventListener("click", signOutUser);
  closeProfileButton?.addEventListener("click", closeProfileModal);
  profileModal?.addEventListener("click", (event) => {
    if (event.target === profileModal) {
      closeProfileModal();
    }
  });
  profileForm?.addEventListener("submit", updateProfile);
  deleteUserButton?.addEventListener("click", openDeleteAccountModal);
  deleteAccountForm?.addEventListener("submit", requestDeleteAccountConfirmation);
  closeDeleteAccountButton?.addEventListener("click", closeDeleteAccountModal);
  deleteAccountModal?.addEventListener("click", (event) => {
    if (event.target === deleteAccountModal) {
      closeDeleteAccountModal();
    }
  });
  confirmDeleteAccountButton?.addEventListener("click", deleteCurrentUserAccount);
  cancelConfirmDeleteButton?.addEventListener("click", closeConfirmDeleteAccountModal);
  confirmDeleteAccountModal?.addEventListener("click", (event) => {
    if (event.target === confirmDeleteAccountModal) {
      closeConfirmDeleteAccountModal();
    }
  });
  closeTransactionEditButton.addEventListener("click", closeTransactionEditModal);
  transactionEditModal.addEventListener("click", (event) => {
    if (event.target === transactionEditModal) {
      closeTransactionEditModal();
    }
  });
  transactionEditForm.addEventListener("submit", saveTransactionEdit);
  transactionTrackCheckbox?.addEventListener("change", syncTransactionTrackingFields);
  transactionTrackTypeInput?.addEventListener("change", syncTransactionTrackingFields);
  transactionTypeInput?.addEventListener("change", () => {
    updateCategorySelect(transactionCategoryInput, transactionTypeInput.value);
    syncTransactionTransferVisibility();
  });
  transactionPaymentMethodInput?.addEventListener("change", () => {
    updatePaymentAccountSelect(transactionPaymentAccountInput, transactionPaymentMethodInput.value);
    syncTransactionTransferVisibility();
  });
  transactionPaymentAccountInput?.addEventListener("change", () => {
    updateTransactionTransferAccountSelect();
  });
  transactionTransferAccountInput?.addEventListener("change", () => {
    if (transactionTypeInput?.value === "transfer") {
      updateAnyPaymentAccountSelect(transactionPaymentAccountInput, transactionPaymentAccountInput?.value || "", {
        excludeId: transactionTransferAccountInput.value,
        placeholder: "Kaynak kart / hesap seç",
      });
    }
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    markPaymentAccountRecordsFilterInteraction(true);
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("mousedown", (event) => {
    event.stopPropagation();
    markPaymentAccountRecordsFilterInteraction(true);
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("touchstart", (event) => {
    event.stopPropagation();
    markPaymentAccountRecordsFilterInteraction(true);
  }, { passive: true });
  paymentAccountRecordsPeriodFilter?.addEventListener("click", (event) => {
    event.stopPropagation();
    markPaymentAccountRecordsFilterInteraction(true);
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("focus", () => {
    markPaymentAccountRecordsFilterInteraction(true);
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("blur", () => {
    markPaymentAccountRecordsFilterInteraction(false, 180);
  });
  paymentAccountRecordsPeriodFilter?.addEventListener("change", () => {
    viewingPaymentAccountRecordsPeriod = paymentAccountRecordsPeriodFilter.value || "";
    // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const account = paymentAccounts.find((item) => item.id === viewingPaymentAccountRecordsId);
    if (account) {
      renderPaymentAccountRecordsModalContent(account, { rebuildFilter: false });
    }
    markPaymentAccountRecordsFilterInteraction(false, 180);
  });
  initCloud();
  refreshMarketPrices({ silent: true });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // ACIKLAMA: formData degiskeninin Turkce karsiligi "form veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const formData = new FormData(form);
    // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const now = getTurkeyNowDateTime();
    // ACIKLAMA: entry degiskeninin Turkce karsiligi "entry"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const values = {
      type: formData.get("type"),
      title: formData.get("title"),
      amount: formData.get("amount"),
      category: formData.get("category"),
      paymentMethod: formData.get("paymentMethod"),
      paymentAccountId: formData.get("paymentAccount"),
      transferAccountId: formData.get("transferAccount"),
      transferFee: formData.get("transferFee"),
      date: formData.get("date"),
      note: formData.get("note"),
      isInstallment: formData.get("isInstallment") === "on",
      installmentCount: formData.get("installmentCount"),
      isDebtPayment: formData.get("isDebtPayment") === "on",
      debtReceivableId: formData.get("debtReceivableId"),
    };
    const taksitSayisi = Number(values.installmentCount);
    if (values.isInstallment && (!Number.isInteger(taksitSayisi) || taksitSayisi < 2 || taksitSayisi > 60)) {
      if (entryFormStatus) entryFormStatus.textContent = "Taksit sayısı 2 ile 60 arasında olmalı.";
      entryInstallmentCountInput?.focus();
      return;
    }
    const entries = gelirGiderTaksitSerisiniOlustur(values, now, getTurkeyNowTime());
    if (values.isDebtPayment && typeof borcAlacakGelirGiderOdemesiniDogrula === "function") {
      const baglantiHatasi = borcAlacakGelirGiderOdemesiniDogrula(entries[0], values.debtReceivableId);
      if (baglantiHatasi) {
        if (entryFormStatus) entryFormStatus.textContent = baglantiHatasi;
        if (!values.debtReceivableId) entryDebtPaymentTarget?.focus();
        return;
      }
      entries[0] = borcAlacakGelirGiderOdemesiniHazirla(entries[0], values.debtReceivableId);
    }
    const entry = entries[0];

    if (!entry.title || !entry.amount || !entry.date) {
      return;
    }

    if (!entries.every((item) => validateTransactionPayment(item, entryFormStatus))) {
      return;
    }

    // ACIKLAMA: changedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
    let changedPaymentAccount = false;
    entries.forEach((item) => {
      changedPaymentAccount = applyTransactionPaymentEffect(item, 1) || changedPaymentAccount;
    });
    transactions = [...entries, ...transactions].sort(compareTransactionsNewestFirst);
    if (entry.debtPaymentId && typeof borcAlacakGelirGiderOdemesiniUygula === "function") {
      borcAlacakGelirGiderOdemesiniUygula(entry);
    }
    if (changedPaymentAccount) {
      refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
      persistPaymentAccounts();
    }
    persistTransactions({ cloudUpserts: entries }).catch((error) => {
      if (entryFormStatus) {
        entryFormStatus.textContent = `Firebase'e kaydedilemedi: ${error.message}`;
      }
    });
    form.reset();
    typeInput.value = "income";
    updateCategoryOptions("income");
    paymentMethodInput.value = "cash";
    paymentMethodInput.disabled = false;
    updatePaymentAccountSelect(paymentAccountSelect, "cash");
    if (transferFeeInput) transferFeeInput.value = "";
    updateEntryTransferAccountSelect("");
    syncEntryTransferVisibility();
    tekliBorcAlacakOdemeAlanlariniGuncelle();
    tekliTaksitAlanlariniGuncelle();
    if (entryFormStatus) {
      entryFormStatus.textContent = "";
    }
    dateInput.value = getTurkeyTodayISO();
    render();
    closeEntryModal();
  });
}

// ACIKLAMA: mountModalForms fonksiyonunun Turkce karsiligi "yerlestir pencere forms"; ilgili uygulama islemini calistirir.
function mountModalForms() {
  if (entryFormMount && form) {
    entryFormMount.append(form);
    form.hidden = false;
  }

  if (besFormMount && besForm) {
    besFormMount.append(besForm);
    besForm.hidden = false;
  }
}

// ACIKLAMA: createEntryTransaction fonksiyonunun Turkce karsiligi "gelir gider kaydi olustur"; tekli ve coklu form verisini ortak islem nesnesine cevirir.
function createEntryTransaction(values = {}, now = getTurkeyNowDateTime(), time = getTurkeyNowTime()) {
  const entryType = values.type === "transfer" ? "transfer" : values.type === "income" ? "income" : "expense";
  const amount = Math.abs(roundMoney(readSignedNumber(values.amount, 0)));
  const isInstallment = entryType !== "transfer" && Boolean(values.isInstallment);
  const installmentCount = isInstallment
    ? Math.max(1, Math.min(60, Math.trunc(Number(values.installmentCount || 1))))
    : 0;
  const installmentNumber = isInstallment
    ? Math.max(1, Math.min(installmentCount || 1, Math.trunc(Number(values.installmentNumber || 1))))
    : 0;
  return {
    id: crypto.randomUUID(),
    type: entryType,
    title: String(values.title || "").trim(),
    amount,
    category: entryType === "transfer"
      ? (values.category || "Transfer")
      : (values.category || transactionCategories[entryType]?.[0] || "Diğer"),
    paymentMethod: entryType === "transfer" ? "transfer" : normalizePaymentMethod(values.paymentMethod),
    paymentAccountId: String(values.paymentAccountId || ""),
    transferAccountId: entryType === "transfer" ? String(values.transferAccountId || "") : "",
    transferFee: entryType === "transfer" ? Math.max(0, roundMoney(readSignedNumber(values.transferFee, 0))) : 0,
    date: String(values.date || ""),
    note: String(values.note || "").trim(),
    isInstallment,
    installmentGroupId: isInstallment ? String(values.installmentGroupId || "") : "",
    installmentNumber,
    installmentCount,
    installmentCompleted: isInstallment && Boolean(values.installmentCompleted),
    installmentCompletedAt: isInstallment && values.installmentCompleted
      ? String(values.installmentCompletedAt || now)
      : "",
    transactionAt: buildTransactionDateTime(values.date, time),
    createdAt: now,
    updatedAt: now,
  };
}

// ACIKLAMA: Ay sonu tasmasini onleyerek bir ISO tarihini istenen ay kadar ileri alir.
function gelirGiderTarihiniAyaEkle(value, monthOffset) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return "";
  }

  const [year, month, day] = String(value).split("-").map(Number);
  const monthStart = new Date(Date.UTC(year, month - 1 + monthOffset, 1));
  const targetYear = monthStart.getUTCFullYear();
  const targetMonth = monthStart.getUTCMonth();
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

// ACIKLAMA: Secilen aylik taksit sayisina gore ayni tutar ve baslikla bagimsiz gelir/gider kayitlari olusturur.
function gelirGiderTaksitSerisiniOlustur(values = {}, now = getTurkeyNowDateTime(), time = getTurkeyNowTime()) {
  const isInstallment = values.type !== "transfer" && Boolean(values.isInstallment);
  const installmentCount = isInstallment
    ? Math.max(2, Math.min(60, Math.trunc(Number(values.installmentCount || 2))))
    : 1;
  const installmentGroupId = isInstallment ? crypto.randomUUID() : "";

  return Array.from({ length: installmentCount }, (_, index) => createEntryTransaction(
    {
      ...values,
      date: gelirGiderTarihiniAyaEkle(values.date, index),
      isInstallment,
      installmentGroupId,
      installmentNumber: isInstallment ? index + 1 : 0,
      installmentCount: isInstallment ? installmentCount : 0,
    },
    now,
    time
  ));
}

// ACIKLAMA: Tekli formda taksit sayisi alanini kutu ve islem tipine gore gosterir.
function tekliTaksitAlanlariniGuncelle() {
  const transferMi = typeInput?.value === "transfer";
  const borcAlacakOdemesiMi = !transferMi && Boolean(entryDebtPaymentCheckbox?.checked);
  if (entryInstallmentCheckbox) {
    entryInstallmentCheckbox.disabled = transferMi || borcAlacakOdemesiMi;
    if (transferMi || borcAlacakOdemesiMi) entryInstallmentCheckbox.checked = false;
  }
  const taksitSecili = !transferMi && !borcAlacakOdemesiMi && Boolean(entryInstallmentCheckbox?.checked);
  entryInstallmentCheckbox?.closest(".entry-choice-group")?.classList.toggle("is-active", taksitSecili);
  if (entryInstallmentCountField) entryInstallmentCountField.hidden = !taksitSecili;
  if (entryInstallmentCountInput) {
    entryInstallmentCountInput.disabled = !taksitSecili;
    entryInstallmentCountInput.required = taksitSecili;
    if (taksitSecili && Number(entryInstallmentCountInput.value || 0) < 2) {
      entryInstallmentCountInput.value = "2";
    }
  }
}

// ACIKLAMA: Gelir/gider turune uygun acik borc veya alacak kayitlarini ana formdaki secime doldurur.
function tekliBorcAlacakOdemeKayitlariniDoldur(seciliKayitId = "") {
  if (!entryDebtPaymentTarget) return;
  const islemTuru = typeInput?.value || "income";
  const alacakMi = islemTuru === "income";
  const uygunKayitlar = (typeof borcAlacakKayitlari !== "undefined" ? borcAlacakKayitlari : [])
    .filter((item) => item.status === "open" && Number(item.amount || 0) > 0)
    .filter((item) => alacakMi ? item.kind === "receivable" : item.kind === "debt")
    .sort((left, right) => {
      const leftDate = left.dueDate || left.startDate || "9999-12-31";
      const rightDate = right.dueDate || right.startDate || "9999-12-31";
      return leftDate.localeCompare(rightDate) || String(left.person || "").localeCompare(String(right.person || ""), "tr");
    });

  entryDebtPaymentTarget.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = uygunKayitlar.length
    ? (alacakMi ? "Tahsil edilecek alacağı seç" : "Ödenecek borç veya taksiti seç")
    : (alacakMi ? "Kalan alacak kaydı bulunmuyor" : "Kalan borç veya taksit kaydı bulunmuyor");
  entryDebtPaymentTarget.append(placeholder);

  uygunKayitlar.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.person} · ${borcAlacakListeTuruEtiketi(item.listType)} · Kalan ${currency.format(item.amount)}`;
    entryDebtPaymentTarget.append(option);
  });
  entryDebtPaymentTarget.value = uygunKayitlar.some((item) => item.id === String(seciliKayitId || ""))
    ? String(seciliKayitId)
    : "";
}

// ACIKLAMA: Secilen borc veya alacagin kalan tutarini formun altinda gosterir.
function tekliBorcAlacakOdemeSecimNotunuGuncelle() {
  if (!entryDebtPaymentHint) return;
  const kayit = typeof borcAlacakKayitlari !== "undefined"
    ? borcAlacakKayitlari.find((item) => item.id === String(entryDebtPaymentTarget?.value || ""))
    : null;
  if (kayit) {
    entryDebtPaymentHint.textContent = `${kayit.person} kaydında kalan ${currency.format(kayit.amount)} tutardan düşülecek.`;
    return;
  }
  entryDebtPaymentHint.textContent = typeInput?.value === "income"
    ? "Yalnızca kalan alacak kayıtları gösterilir."
    : "Yalnızca kalan borç ve taksit kayıtları gösterilir.";
}

// ACIKLAMA: Ana formdaki borc/alacak odeme secimini islem turu ve taksit secenegiyle uyumlu tutar.
function tekliBorcAlacakOdemeAlanlariniGuncelle() {
  const transferMi = typeInput?.value === "transfer";
  if (entryDebtPaymentCheckbox) {
    entryDebtPaymentCheckbox.disabled = transferMi;
    if (transferMi) entryDebtPaymentCheckbox.checked = false;
  }
  const secili = !transferMi && Boolean(entryDebtPaymentCheckbox?.checked);
  entryDebtPaymentCheckbox?.closest(".entry-choice-group")?.classList.toggle("is-active", secili);
  const oncekiKayitId = entryDebtPaymentTarget?.value || "";
  if (entryDebtPaymentOptions) entryDebtPaymentOptions.hidden = !secili;
  if (entryDebtPaymentTarget) {
    entryDebtPaymentTarget.disabled = !secili;
    entryDebtPaymentTarget.required = secili;
  }
  if (entryDebtPaymentTargetLabel) {
    entryDebtPaymentTargetLabel.textContent = typeInput?.value === "income"
      ? "Tahsil edilecek alacak"
      : "Ödenecek borç / taksit";
  }
  tekliBorcAlacakOdemeKayitlariniDoldur(oncekiKayitId);
  tekliBorcAlacakOdemeSecimNotunuGuncelle();
}

// ACIKLAMA: setupBulkEntryForm fonksiyonunun Turkce karsiligi "coklu kayit formunu kur"; coklu gelir/gider panelinin olaylarini ve ilk satirlarini hazirlar.
function setupBulkEntryForm() {
  if (!bulkEntryForm || !bulkEntryRows || bulkEntryForm.dataset.bulkEntryReady === "true") {
    return;
  }

  bulkEntryForm.dataset.bulkEntryReady = "true";
  for (let index = 0; index < BULK_ENTRY_INITIAL_ROWS; index += 1) {
    addBulkEntryRow({ silent: true });
  }

  bulkEntryAddRowButton?.addEventListener("click", () => addBulkEntryRow());
  bulkEntryClearButton?.addEventListener("click", () => resetBulkEntryRows());
  bulkEntryForm.addEventListener("submit", addBulkTransactions);
}

// ACIKLAMA: openBulkEntryModal fonksiyonunun Turkce karsiligi "coklu gelir gider penceresini ac"; coklu kayit formunu modal icinde kullanima acar.
function openBulkEntryModal() {
  if (!bulkEntryModal) {
    return;
  }

  resetBulkEntryRows();
  if (bulkEntryStatus) {
    bulkEntryStatus.textContent = "";
  }
  bulkEntryModal.hidden = false;
  setTimeout(() => getBulkEntryFields(getBulkEntryRows()[0]).title?.focus(), 0);
}

// ACIKLAMA: closeBulkEntryModal fonksiyonunun Turkce karsiligi "coklu gelir gider penceresini kapat"; modal pencereyi kapatip gecici hata mesajlarini temizler.
function closeBulkEntryModal() {
  if (bulkEntryModal) {
    bulkEntryModal.hidden = true;
  }
  resetBulkEntryRows();
}

// ACIKLAMA: getBulkEntryRows fonksiyonunun Turkce karsiligi "coklu kayit satirlarini al"; ekrandaki coklu gelir/gider satirlarini liste olarak dondurur.
function getBulkEntryRows() {
  return Array.from(bulkEntryRows?.querySelectorAll("[data-bulk-entry-row]") || []);
}

// ACIKLAMA: getBulkEntryFields fonksiyonunun Turkce karsiligi "coklu kayit alanlarini al"; bir satirdaki input ve select elemanlarini toplar.
function getBulkEntryFields(row) {
  return {
    type: row?.querySelector('[data-bulk-field="type"]'),
    title: row?.querySelector('[data-bulk-field="title"]'),
    amount: row?.querySelector('[data-bulk-field="amount"]'),
    category: row?.querySelector('[data-bulk-field="category"]'),
    paymentMethod: row?.querySelector('[data-bulk-field="paymentMethod"]'),
    paymentAccount: row?.querySelector('[data-bulk-field="paymentAccount"]'),
    paymentAccountLabel: row?.querySelector("[data-bulk-payment-account-label]"),
    transferAccount: row?.querySelector('[data-bulk-field="transferAccount"]'),
    transferFee: row?.querySelector('[data-bulk-field="transferFee"]'),
    transferFields: Array.from(row?.querySelectorAll("[data-bulk-transfer-field]") || []),
    date: row?.querySelector('[data-bulk-field="date"]'),
    note: row?.querySelector('[data-bulk-field="note"]'),
    installment: row?.querySelector('[data-bulk-field="isInstallment"]'),
    installmentCount: row?.querySelector('[data-bulk-field="installmentCount"]'),
    installmentCountField: row?.querySelector("[data-bulk-installment-count-field]"),
    installmentGroup: row?.querySelector("[data-bulk-installment-group]"),
    debtPayment: row?.querySelector('[data-bulk-field="isDebtPayment"]'),
    debtPaymentTarget: row?.querySelector('[data-bulk-field="debtReceivableId"]'),
    debtPaymentOptions: row?.querySelector("[data-bulk-debt-payment-options]"),
    debtPaymentGroup: row?.querySelector("[data-bulk-debt-payment-group]"),
    debtPaymentTargetLabel: row?.querySelector("[data-bulk-debt-payment-label]"),
    debtPaymentHint: row?.querySelector("[data-bulk-debt-payment-hint]"),
    error: row?.querySelector("[data-bulk-row-error]"),
  };
}

// ACIKLAMA: createBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satiri olustur"; toplu form icin yeni gelir/gider satiri uretir.
function createBulkEntryRow() {
  const row = document.createElement("div");
  row.className = "bulk-entry-row";
  row.dataset.bulkEntryRow = "true";
  row.innerHTML = `
    <div class="bulk-entry-main-row">
      <span class="bulk-entry-row-number" data-bulk-row-number>1</span>
      <label class="bulk-entry-title-field">
        Başlık
        <input data-bulk-field="title" type="text" maxlength="40" placeholder="Maaş, market..." />
      </label>
      <label>
        Tutar
        <input data-bulk-field="amount" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0" />
      </label>
      <label>
        Tip
        <select data-bulk-field="type">
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
          <option value="transfer">Hesaplar arası transfer</option>
        </select>
      </label>
    </div>
    <div class="bulk-entry-account-row">
      <label>
        Kategori
        <select data-bulk-field="category"></select>
      </label>
      <label>
        Ödeme
        <select data-bulk-field="paymentMethod">
          <option value="cash">Nakit</option>
          <option value="credit_card">Kredi Kartı</option>
          <option value="bank_account">Banka Hesabı / Kartı</option>
          <option value="transfer">Havale / EFT</option>
          <option value="other">Diğer</option>
        </select>
      </label>
      <label>
        <span data-bulk-payment-account-label>Kart / hesap</span>
        <select data-bulk-field="paymentAccount"></select>
      </label>
      <label>
        Tarih
        <input data-bulk-field="date" type="date" />
      </label>
      <label class="bulk-entry-transfer-field" data-bulk-transfer-field hidden>
        Hedef kart / hesap
        <select data-bulk-field="transferAccount"></select>
      </label>
      <label class="bulk-entry-transfer-field" data-bulk-transfer-field hidden>
        Transfer ücreti
        <input data-bulk-field="transferFee" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0" />
      </label>
    </div>
    <div class="bulk-entry-choice-row">
      <div class="bulk-entry-choice-group bulk-entry-installment-group" data-bulk-installment-group>
        <label class="bulk-entry-installment-toggle">
          <input data-bulk-field="isInstallment" type="checkbox" />
          <span>Taksit mi?</span>
        </label>
        <label data-bulk-installment-count-field hidden>
          Toplam taksit sayısı
          <input data-bulk-field="installmentCount" type="number" min="2" max="60" step="1" inputmode="numeric" value="2" />
        </label>
      </div>
      <div class="bulk-entry-choice-group bulk-entry-debt-payment-group" data-bulk-debt-payment-group>
        <label class="bulk-entry-debt-payment-toggle">
          <input data-bulk-field="isDebtPayment" type="checkbox" />
          <span>Borç ödemesi / alacak tahsilatı mı?</span>
        </label>
        <div class="bulk-entry-debt-payment-options" data-bulk-debt-payment-options hidden>
          <label>
            <span data-bulk-debt-payment-label>Bağlı kayıt</span>
            <select data-bulk-field="debtReceivableId"></select>
          </label>
          <p data-bulk-debt-payment-hint></p>
        </div>
      </div>
    </div>
    <label class="bulk-entry-note-field">
      Not
      <input data-bulk-field="note" type="text" maxlength="100" placeholder="Kısa not" />
    </label>
    <button class="ghost-btn bulk-entry-remove" data-bulk-action="remove" type="button" aria-label="Satırı sil">Sil</button>
    <p class="bulk-entry-row-error" data-bulk-row-error></p>
  `;

  bindBulkEntryRow(row);
  resetBulkEntryRow(row);
  return row;
}

// ACIKLAMA: bindBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satirini bagla"; satirdaki degisim ve silme olaylarini baglar.
function bindBulkEntryRow(row) {
  const fields = getBulkEntryFields(row);
  fields.type?.addEventListener("change", () => {
    updateBulkEntryCategoryOptions(row, { reset: true });
    syncBulkEntryTransferFields(row);
    cokluBorcAlacakOdemeAlanlariniGuncelle(row);
    cokluTaksitAlanlariniGuncelle(row);
  });
  fields.installment?.addEventListener("change", () => cokluTaksitAlanlariniGuncelle(row));
  fields.debtPayment?.addEventListener("change", () => {
    cokluBorcAlacakOdemeAlanlariniGuncelle(row);
    cokluTaksitAlanlariniGuncelle(row);
  });
  fields.debtPaymentTarget?.addEventListener("change", () => cokluBorcAlacakOdemeSecimNotunuGuncelle(row));
  fields.paymentMethod?.addEventListener("change", () => updateBulkEntryPaymentAccountOptions(row));
  fields.paymentAccount?.addEventListener("change", () => updateBulkEntryPaymentAccountOptions(row));
  fields.transferAccount?.addEventListener("change", () => updateBulkEntryPaymentAccountOptions(row));
  row.querySelector('[data-bulk-action="remove"]')?.addEventListener("click", () => removeBulkEntryRow(row));
}

// ACIKLAMA: addBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satiri ekle"; toplu forma yeni satir ekler.
function addBulkEntryRow(options = {}) {
  if (!bulkEntryRows) {
    return null;
  }

  const row = createBulkEntryRow();
  bulkEntryRows.append(row);
  updateBulkEntryRowNumbers();

  if (!options.silent) {
    getBulkEntryFields(row).title?.focus();
  }

  return row;
}

// ACIKLAMA: removeBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satirini sil"; son satir kalirsa sadece satiri temizler.
function removeBulkEntryRow(row) {
  const rows = getBulkEntryRows();
  if (rows.length <= 1) {
    resetBulkEntryRow(row);
  } else {
    row.remove();
  }
  updateBulkEntryRowNumbers();
  if (bulkEntryStatus) {
    bulkEntryStatus.textContent = "";
  }
}

// ACIKLAMA: resetBulkEntryRows fonksiyonunun Turkce karsiligi "coklu kayit satirlarini sifirla"; toplu formu ilk bos satir durumuna dondurur.
function resetBulkEntryRows(options = {}) {
  if (!bulkEntryRows) {
    return;
  }

  bulkEntryRows.innerHTML = "";
  for (let index = 0; index < BULK_ENTRY_INITIAL_ROWS; index += 1) {
    addBulkEntryRow({ silent: true });
  }

  if (!options.keepStatus && bulkEntryStatus) {
    bulkEntryStatus.textContent = "";
  }
}

// ACIKLAMA: resetBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satirini sifirla"; tek bir toplu kayit satirini varsayilan hale getirir.
function resetBulkEntryRow(row) {
  const fields = getBulkEntryFields(row);
  if (fields.title) fields.title.value = "";
  if (fields.amount) fields.amount.value = "";
  if (fields.note) fields.note.value = "";
  if (fields.transferFee) fields.transferFee.value = "";
  if (fields.transferAccount) fields.transferAccount.value = "";
  if (fields.type) fields.type.value = "income";
  if (fields.paymentMethod) fields.paymentMethod.value = "cash";
  if (fields.date) fields.date.value = getTurkeyTodayISO();
  if (fields.installment) fields.installment.checked = false;
  if (fields.installmentCount) fields.installmentCount.value = "2";
  if (fields.debtPayment) fields.debtPayment.checked = false;
  if (fields.debtPaymentTarget) fields.debtPaymentTarget.value = "";
  setBulkEntryRowError(row, "");
  updateBulkEntryCategoryOptions(row);
  syncBulkEntryTransferFields(row);
  cokluBorcAlacakOdemeAlanlariniGuncelle(row);
  cokluTaksitAlanlariniGuncelle(row);
}

// ACIKLAMA: updateBulkEntryRowNumbers fonksiyonunun Turkce karsiligi "coklu kayit satir numaralarini guncelle"; satir numaralarini ekrana yeniden yazar.
function updateBulkEntryRowNumbers() {
  getBulkEntryRows().forEach((row, index) => {
    const number = row.querySelector("[data-bulk-row-number]");
    if (number) {
      number.textContent = String(index + 1);
    }
  });
}

// ACIKLAMA: refreshBulkEntryRows fonksiyonunun Turkce karsiligi "coklu kayit satirlarini yenile"; kategori ve hesap seceneklerini mevcut verilere gore gunceller.
function refreshBulkEntryRows() {
  getBulkEntryRows().forEach((row) => {
    updateBulkEntryCategoryOptions(row);
    syncBulkEntryTransferFields(row);
    cokluBorcAlacakOdemeAlanlariniGuncelle(row);
    cokluTaksitAlanlariniGuncelle(row);
  });
  updateBulkEntryRowNumbers();
}

// ACIKLAMA: updateBulkEntryCategoryOptions fonksiyonunun Turkce karsiligi "coklu kayit kategorilerini guncelle"; satirin tipine uygun kategori listesini basar.
function updateBulkEntryCategoryOptions(row, options = {}) {
  const fields = getBulkEntryFields(row);
  if (!fields.category) {
    return;
  }

  updateCategorySelect(
    fields.category,
    fields.type?.value || "expense",
    options.reset ? "" : fields.category.value
  );
}

// ACIKLAMA: updateBulkEntryPaymentAccountOptions fonksiyonunun Turkce karsiligi "coklu kayit hesaplarini guncelle"; satirin odeme yontemine uygun kart/hesap listesini basar.
function updateBulkEntryPaymentAccountOptions(row) {
  const fields = getBulkEntryFields(row);
  if (!fields.paymentAccount) {
    return;
  }

  if (fields.type?.value === "transfer") {
    updateAnyPaymentAccountSelect(fields.paymentAccount, fields.paymentAccount.value, {
      excludeId: fields.transferAccount?.value || "",
      placeholder: "Kaynak kart / hesap seç",
    });
    updateAnyPaymentAccountSelect(fields.transferAccount, fields.transferAccount?.value || "", {
      excludeId: fields.paymentAccount.value,
      placeholder: "Hedef kart / hesap seç",
    });
    return;
  }

  updatePaymentAccountSelect(
    fields.paymentAccount,
    fields.paymentMethod?.value || "cash",
    fields.paymentAccount.value
  );
}

// ACIKLAMA: Coklu kayit satirinda transfer alanlarini tipe gore gosterir ve hesap secimlerini hazirlar.
function syncBulkEntryTransferFields(row) {
  const fields = getBulkEntryFields(row);
  const isTransfer = fields.type?.value === "transfer";

  fields.transferFields.forEach((field) => {
    field.hidden = !isTransfer;
  });

  if (fields.paymentAccountLabel) {
    fields.paymentAccountLabel.textContent = isTransfer ? "Kaynak kart / hesap" : "Kart / hesap";
  }

  if (fields.paymentMethod) {
    fields.paymentMethod.disabled = isTransfer;
    fields.paymentMethod.value = isTransfer
      ? "transfer"
      : fields.paymentMethod.value === "transfer"
        ? "cash"
        : normalizePaymentMethod(fields.paymentMethod.value || "cash");
  }

  if (!isTransfer) {
    if (fields.transferAccount) fields.transferAccount.value = "";
    if (fields.transferFee) fields.transferFee.value = "";
  }

  updateBulkEntryPaymentAccountOptions(row);
}

// ACIKLAMA: Coklu kayit satirinda taksit kutusunu ve toplam taksit sayisi alanini birlikte yonetir.
function cokluTaksitAlanlariniGuncelle(row) {
  const fields = getBulkEntryFields(row);
  const transferMi = fields.type?.value === "transfer";
  const borcAlacakOdemesiMi = !transferMi && Boolean(fields.debtPayment?.checked);
  if (fields.installment) {
    fields.installment.disabled = transferMi || borcAlacakOdemesiMi;
    if (transferMi || borcAlacakOdemesiMi) fields.installment.checked = false;
  }
  const taksitSecili = !transferMi && !borcAlacakOdemesiMi && Boolean(fields.installment?.checked);
  fields.installmentGroup?.classList.toggle("is-active", taksitSecili);
  if (fields.installmentCountField) fields.installmentCountField.hidden = !taksitSecili;
  if (fields.installmentCount) {
    fields.installmentCount.disabled = !taksitSecili;
    fields.installmentCount.required = taksitSecili;
    if (taksitSecili && Number(fields.installmentCount.value || 0) < 2) {
      fields.installmentCount.value = "2";
    }
  }
}

// ACIKLAMA: Coklu satirin gelir/gider turune uygun acik borc veya alacak kayitlarini secime doldurur.
function cokluBorcAlacakOdemeKayitlariniDoldur(row, seciliKayitId = "") {
  const fields = getBulkEntryFields(row);
  if (!fields.debtPaymentTarget) return;
  const alacakMi = fields.type?.value === "income";
  const uygunKayitlar = (typeof borcAlacakKayitlari !== "undefined" ? borcAlacakKayitlari : [])
    .filter((item) => item.status === "open" && Number(item.amount || 0) > 0)
    .filter((item) => alacakMi ? item.kind === "receivable" : item.kind === "debt")
    .sort((left, right) => {
      const leftDate = left.dueDate || left.startDate || "9999-12-31";
      const rightDate = right.dueDate || right.startDate || "9999-12-31";
      return leftDate.localeCompare(rightDate) || String(left.person || "").localeCompare(String(right.person || ""), "tr");
    });

  fields.debtPaymentTarget.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = uygunKayitlar.length
    ? (alacakMi ? "Tahsil edilecek alacağı seç" : "Ödenecek borç veya taksiti seç")
    : (alacakMi ? "Kalan alacak kaydı bulunmuyor" : "Kalan borç veya taksit kaydı bulunmuyor");
  fields.debtPaymentTarget.append(placeholder);

  uygunKayitlar.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.person} · ${borcAlacakListeTuruEtiketi(item.listType)} · Kalan ${currency.format(item.amount)}`;
    fields.debtPaymentTarget.append(option);
  });
  fields.debtPaymentTarget.value = uygunKayitlar.some((item) => item.id === String(seciliKayitId || ""))
    ? String(seciliKayitId)
    : "";
}

// ACIKLAMA: Coklu satirda secilen borc veya alacagin kalan tutarini gosterir.
function cokluBorcAlacakOdemeSecimNotunuGuncelle(row) {
  const fields = getBulkEntryFields(row);
  if (!fields.debtPaymentHint) return;
  const kayit = typeof borcAlacakKayitlari !== "undefined"
    ? borcAlacakKayitlari.find((item) => item.id === String(fields.debtPaymentTarget?.value || ""))
    : null;
  if (kayit) {
    fields.debtPaymentHint.textContent = `${kayit.person} kaydında kalan ${currency.format(kayit.amount)} tutardan düşülecek.`;
    return;
  }
  fields.debtPaymentHint.textContent = fields.type?.value === "income"
    ? "Yalnızca kalan alacak kayıtları gösterilir."
    : "Yalnızca kalan borç ve taksit kayıtları gösterilir.";
}

// ACIKLAMA: Coklu satirdaki borc/alacak secimini transfer ve taksit secenekleriyle uyumlu tutar.
function cokluBorcAlacakOdemeAlanlariniGuncelle(row) {
  const fields = getBulkEntryFields(row);
  const transferMi = fields.type?.value === "transfer";
  if (fields.debtPayment) {
    fields.debtPayment.disabled = transferMi;
    if (transferMi) fields.debtPayment.checked = false;
  }
  const secili = !transferMi && Boolean(fields.debtPayment?.checked);
  fields.debtPaymentGroup?.classList.toggle("is-active", secili);
  const oncekiKayitId = fields.debtPaymentTarget?.value || "";
  if (fields.debtPaymentOptions) fields.debtPaymentOptions.hidden = !secili;
  if (fields.debtPaymentTarget) {
    fields.debtPaymentTarget.disabled = !secili;
    fields.debtPaymentTarget.required = secili;
  }
  if (fields.debtPaymentTargetLabel) {
    fields.debtPaymentTargetLabel.textContent = fields.type?.value === "income"
      ? "Tahsil edilecek alacak"
      : "Ödenecek borç / taksit";
  }
  cokluBorcAlacakOdemeKayitlariniDoldur(row, oncekiKayitId);
  cokluBorcAlacakOdemeSecimNotunuGuncelle(row);
}

// ACIKLAMA: setBulkEntryRowError fonksiyonunun Turkce karsiligi "coklu kayit satir hatasini yaz"; satira ait hata mesajini gosterir veya temizler.
function setBulkEntryRowError(row, message = "") {
  const error = getBulkEntryFields(row).error;
  if (error) {
    error.textContent = message;
  }
}

// ACIKLAMA: isBulkEntryRowEmpty fonksiyonunun Turkce karsiligi "coklu kayit satiri bos mu"; varsayilan tarih ve secimleri saymadan satirin dolu olup olmadigini kontrol eder.
function isBulkEntryRowEmpty(row) {
  const fields = getBulkEntryFields(row);
  if (fields.installment?.checked || fields.debtPayment?.checked) {
    return false;
  }
  return ![
    fields.title?.value,
    fields.amount?.value,
    fields.note?.value,
    fields.paymentAccount?.value,
    fields.transferAccount?.value,
    fields.transferFee?.value,
  ].some((value) => String(value || "").trim());
}

// ACIKLAMA: readBulkEntryTransaction fonksiyonunun Turkce karsiligi "coklu kayit satirini oku"; satirdaki veriyi dogrulanmis gelir/gider kaydina cevirir.
function readBulkEntryTransaction(row, index, now, ayrilanTutarlar = new Map()) {
  const fields = getBulkEntryFields(row);
  setBulkEntryRowError(row, "");

  if (isBulkEntryRowEmpty(row)) {
    return { status: "empty" };
  }

  const values = {
    type: fields.type?.value || "expense",
    title: fields.title?.value || "",
    amount: fields.amount?.value || "",
    category: fields.category?.value || "",
    paymentMethod: fields.paymentMethod?.value || "cash",
    paymentAccountId: fields.paymentAccount?.value || "",
    transferAccountId: fields.transferAccount?.value || "",
    transferFee: fields.transferFee?.value || "",
    date: fields.date?.value || "",
    note: fields.note?.value || "",
    isInstallment: Boolean(fields.installment?.checked),
    installmentCount: fields.installmentCount?.value || "",
    isDebtPayment: Boolean(fields.debtPayment?.checked),
    debtReceivableId: fields.debtPaymentTarget?.value || "",
  };
  const taksitSayisi = Number(values.installmentCount);
  if (values.isInstallment && (!Number.isInteger(taksitSayisi) || taksitSayisi < 2 || taksitSayisi > 60)) {
    setBulkEntryRowError(row, `${index + 1}. satırda taksit sayısı 2 ile 60 arasında olmalı.`);
    return { status: "invalid" };
  }
  const entries = gelirGiderTaksitSerisiniOlustur(values, now, getTurkeyNowTime());
  const entry = entries[0];

  if (!entry.title || !entry.amount || !entry.date) {
    setBulkEntryRowError(row, `${index + 1}. satırda başlık, tutar ve tarih zorunlu.`);
    return { status: "invalid" };
  }

  if (!entries.every((item) => validateTransactionPayment(item, fields.error))) {
    return { status: "invalid" };
  }

  if (values.isDebtPayment) {
    if (typeof borcAlacakGelirGiderOdemesiniDogrula !== "function" || typeof borcAlacakGelirGiderOdemesiniHazirla !== "function") {
      setBulkEntryRowError(row, `${index + 1}. satırda borç/alacak bağlantısı hazırlanamadı.`);
      return { status: "invalid" };
    }
    const ayrilanTutar = Number(ayrilanTutarlar.get(values.debtReceivableId) || 0);
    const baglantiHatasi = borcAlacakGelirGiderOdemesiniDogrula(entry, values.debtReceivableId, {
      reservedAmount: ayrilanTutar,
    });
    if (baglantiHatasi) {
      setBulkEntryRowError(row, `${index + 1}. satır: ${baglantiHatasi}`);
      return { status: "invalid" };
    }
    entries[0] = borcAlacakGelirGiderOdemesiniHazirla(entry, values.debtReceivableId);
    ayrilanTutarlar.set(
      values.debtReceivableId,
      roundMoney(ayrilanTutar + Number(entries[0].amount || 0))
    );
  }

  return { status: "ready", entries };
}

// ACIKLAMA: addBulkTransactions fonksiyonunun Turkce karsiligi "coklu gelir gider kaydet"; dolu satirlarin tamamini tek seferde kayitlara ekler.
function addBulkTransactions(event) {
  event.preventDefault();

  const rows = getBulkEntryRows();
  const now = getTurkeyNowDateTime();
  const readyEntries = [];
  const ayrilanBorcAlacakTutarlari = new Map();

  for (let index = 0; index < rows.length; index += 1) {
    const result = readBulkEntryTransaction(rows[index], index, now, ayrilanBorcAlacakTutarlari);
    if (result.status === "invalid") {
      if (bulkEntryStatus) {
        bulkEntryStatus.textContent = `${index + 1}. satırı kontrol et.`;
      }
      rows[index].querySelector("input, select")?.focus();
      return;
    }
    if (result.status === "ready") {
      readyEntries.push(...result.entries);
    }
  }

  if (!readyEntries.length) {
    if (bulkEntryStatus) {
      bulkEntryStatus.textContent = "Kaydedilecek dolu satır yok.";
    }
    return;
  }

  if (bulkEntrySubmitButton) {
    bulkEntrySubmitButton.disabled = true;
  }

  let changedPaymentAccount = false;
  readyEntries.forEach((entry) => {
    changedPaymentAccount = applyTransactionPaymentEffect(entry, 1) || changedPaymentAccount;
  });

  transactions = [...readyEntries, ...transactions].sort(compareTransactionsNewestFirst);
  currentHistoryPage = 1;

  let borcAlacakOdemesiUygulandi = false;
  readyEntries.forEach((entry) => {
    if (entry.debtPaymentId && typeof borcAlacakGelirGiderOdemesiniUygula === "function") {
      borcAlacakOdemesiUygulandi = borcAlacakGelirGiderOdemesiniUygula(entry, {
        persist: false,
        renderLists: false,
      }) || borcAlacakOdemesiUygulandi;
    }
  });
  if (borcAlacakOdemesiUygulandi) {
    borcAlacakKayitlariniKaliciKaydet();
    borcAlacaklariEkranaBas();
  }

  if (changedPaymentAccount) {
    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
    persistPaymentAccounts();
  }

  persistTransactions({ cloudUpserts: readyEntries }).catch((error) => {
    if (bulkEntryStatus) {
      bulkEntryStatus.textContent = `Kayıtlar eklendi, Firebase'e yazılamadı: ${error.message}`;
    }
  });

  render();
  resetBulkEntryRows({ keepStatus: true });
  if (bulkEntryStatus) {
    bulkEntryStatus.textContent = `${readyEntries.length} kayıt eklendi.`;
  }
  if (bulkEntrySubmitButton) {
    bulkEntrySubmitButton.disabled = false;
  }
}


// ACIKLAMA: standardizeModalLayouts fonksiyonunun Turkce karsiligi "standardize pencere yerlesimler"; ilgili uygulama islemini calistirir.
function standardizeModalLayouts() {
  document.querySelectorAll(".modal-backdrop > .modal-card").forEach((card) => {
    if (!card || card.dataset.modalLayoutStandardized === "true") {
      return;
    }

    // ACIKLAMA: footer degiskeninin Turkce karsiligi "footer"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const footer =
      card.querySelector(":scope > .auth-actions, :scope > .modal-actions") ||
      card.querySelector(":scope > form > .auth-actions, :scope > form > .modal-actions") ||
      card.querySelector(":scope > .profile-form > .auth-actions, :scope > .profile-form > .modal-actions");

    if (!footer) {
      return;
    }

    // ACIKLAMA: sourceForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
    const sourceForm = footer.closest("form");

    if (sourceForm?.id) {
      footer.querySelectorAll("button").forEach((button) => {
        // ACIKLAMA: buttonType degiskeninin Turkce karsiligi "buton tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const buttonType = (button.getAttribute("type") || "submit").toLowerCase();
        if (buttonType === "submit" && !button.hasAttribute("form")) {
          button.setAttribute("form", sourceForm.id);
        }
      });
    }

    footer.classList.add("modal-footer-actions");

    if (footer.parentElement !== card) {
      card.appendChild(footer);
    }

    if (!card.querySelector(":scope > .modal-body-scroll")) {
      // ACIKLAMA: body degiskeninin Turkce karsiligi "govde"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const body = document.createElement("div");
      body.className = "modal-body-scroll";

      Array.from(card.children).forEach((child) => {
        if (child === footer || child === body) {
          return;
        }

        if (child.classList.contains("panel-heading")) {
          child.classList.add("modal-fixed-heading");
          return;
        }

        body.appendChild(child);
      });

      card.insertBefore(body, footer);
    }

    card.classList.add("modal-layout-standard");
    card.dataset.modalLayoutStandardized = "true";
  });
}

// ACIKLAMA: loadTransactions fonksiyonunun Turkce karsiligi "yukle islemler"; ilgili uygulama islemini calistirir.
