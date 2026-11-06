function preventAppZoomGestures() {
  // Dikey sayfa kaydırmayı bozmamak için touchend üzerinde preventDefault kullanılmıyor.
  // Yakınlaştırma davranışı viewport ayarı ve dblclick/gesture engeliyle sınırlandırılır.
  document.addEventListener(
    "dblclick",
    (event) => {
      event.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener(
    "gesturestart",
    (event) => {
      event.preventDefault();
    },
    { passive: false }
  );
}

function loadThemePreference() {
  try {

    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return ["dark", "light", "system"].includes(saved) ? saved : "light";
  } catch (error) {
    return "light";
  }
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Sessiz geç
  }
}

function normalizeUiSettings(raw = {}) {

  const normalizedTheme = ["dark", "light", "system"].includes(raw.theme) ? raw.theme : "light";

  const normalizedFontFamily = Object.prototype.hasOwnProperty.call(FONT_FAMILY_MAP, raw.fontFamily) ? raw.fontFamily : DEFAULT_UI_SETTINGS.fontFamily;

  const normalizedFontWeight = Object.prototype.hasOwnProperty.call(FONT_WEIGHT_MAP, raw.fontWeight) ? raw.fontWeight : DEFAULT_UI_SETTINGS.fontWeight;

  const fontSizeNumber = Number(raw.fontSize);

  const normalizedFontSize = Number.isFinite(fontSizeNumber) ? Math.min(20, Math.max(14, Math.round(fontSizeNumber))) : DEFAULT_UI_SETTINGS.fontSize;

  return {
    theme: normalizedTheme,
    fontFamily: normalizedFontFamily,
    fontWeight: normalizedFontWeight,
    fontSize: normalizedFontSize,
  };
}

function loadUiSettings() {
  try {

    const saved = localStorage.getItem(UI_SETTINGS_STORAGE_KEY);

    const parsed = saved ? JSON.parse(saved) : {};
    return normalizeUiSettings({
      ...DEFAULT_UI_SETTINGS,
      ...parsed,
      theme: parsed?.theme || loadThemePreference(),
    });
  } catch (error) {
    return { ...DEFAULT_UI_SETTINGS, theme: loadThemePreference() };
  }
}

function saveUiSettings() {
  try {
    localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(uiSettings));
  } catch (error) {
    // Sessiz geç
  }
  saveThemePreference(uiSettings.theme);
}

function updateThemeButtons(theme) {
  themeButtons.forEach((button) => {

    const isActive = button.dataset.themeOption === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncAppearanceControls() {
  const themeSelect = document.getElementById("preferencesTheme");
  if (themeSelect) themeSelect.value = uiSettings.theme;
  if (settingsFontFamily) {
    settingsFontFamily.value = uiSettings.fontFamily;
  }
  if (settingsFontWeight) {
    settingsFontWeight.value = uiSettings.fontWeight;
  }
  if (settingsFontSize) {
    settingsFontSize.value = String(uiSettings.fontSize);
  }
  if (settingsFontSizeValue) {
    settingsFontSizeValue.textContent = `${uiSettings.fontSize} px`;
  }
  updateThemeButtons(uiSettings.theme);
}

function applyTheme(theme, options = {}) {
  const { persist = true, syncControls = true } = options;

  const preference = ["dark", "light", "system"].includes(theme) ? theme : "light";
  const normalizedTheme = preference === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
  uiSettings = normalizeUiSettings({ ...uiSettings, theme: preference });
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  document.body?.setAttribute("data-theme", normalizedTheme);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", normalizedTheme === "dark" ? "#0f1720" : "#dff2ec");
  }
  if (syncControls) {
    syncAppearanceControls();
  } else {
    updateThemeButtons(normalizedTheme);
  }
  if (persist) {
    saveUiSettings();
  }
}

function applyTypographySettings(settings = uiSettings, options = {}) {
  const { persist = true, syncControls = true } = options;
  uiSettings = normalizeUiSettings({ ...uiSettings, ...settings });

  const fontWeight = FONT_WEIGHT_MAP[uiSettings.fontWeight] || FONT_WEIGHT_MAP[DEFAULT_UI_SETTINGS.fontWeight];
  document.documentElement.style.setProperty("--app-font-size", `${uiSettings.fontSize}px`);
  document.documentElement.style.setProperty("--app-font-family", FONT_FAMILY_MAP[uiSettings.fontFamily] || FONT_FAMILY_MAP.manrope);
  document.documentElement.style.setProperty("--app-font-weight", String(fontWeight.base));
  document.documentElement.style.setProperty("--app-font-weight-strong", String(fontWeight.strong));
  applyTheme(uiSettings.theme, { persist: false, syncControls: false });
  if (syncControls) {
    syncAppearanceControls();
  }
  if (persist) {
    saveUiSettings();
  }
}

function changeFontSize(delta) {
  applyTypographySettings({ fontSize: uiSettings.fontSize + delta });
}

function resetAppearanceSettings() {
  openGenericConfirmModal(
    "Varsayılana dönülsün mü?",
    "Yazı tipi, yazı kalınlığı ve yazı boyutu varsayılan ayarlara dönecek.",
    () => {
      uiSettings = { ...DEFAULT_UI_SETTINGS };
      applyTypographySettings(uiSettings);
    },
    { confirmLabel: "Varsayılana dön", cancelLabel: "Vazgeç" }
  );
}

function initThemePreference() {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const updateSystemTheme = () => { if (uiSettings.theme === "system") applyTheme("system", { persist: false }); };
  if (systemTheme.addEventListener) systemTheme.addEventListener("change", updateSystemTheme);
  else systemTheme.addListener(updateSystemTheme);
  uiSettings = loadUiSettings();
  applyTypographySettings(uiSettings, { persist: false, syncControls: true });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption);
    });
  });

  settingsFontFamily?.addEventListener("change", () => {
    applyTypographySettings({ fontFamily: settingsFontFamily.value });
  });

  settingsFontWeight?.addEventListener("change", () => {
    applyTypographySettings({ fontWeight: settingsFontWeight.value });
  });

  settingsFontSize?.addEventListener("input", () => {
    applyTypographySettings({ fontSize: Number(settingsFontSize.value) });
  });

  decreaseFontButton?.addEventListener("click", () => changeFontSize(-1));
  increaseFontButton?.addEventListener("click", () => changeFontSize(1));
  resetAppearanceButton?.addEventListener("click", resetAppearanceSettings);
}

function normalizeCardReminderSettings(raw = {}) {
  return {
    enabled: Boolean(raw.enabled),
  };
}

function loadCardReminderSettings() {
  try {

    const saved = localStorage.getItem(getStorageKey(CARD_REMINDER_SETTINGS_STORAGE_KEY));
    return normalizeCardReminderSettings(saved ? JSON.parse(saved) : DEFAULT_CARD_REMINDER_SETTINGS);
  } catch {
    return { ...DEFAULT_CARD_REMINDER_SETTINGS };
  }
}

function saveCardReminderSettings() {
  try {
    localStorage.setItem(
      getStorageKey(CARD_REMINDER_SETTINGS_STORAGE_KEY),
      JSON.stringify(normalizeCardReminderSettings(cardReminderSettings))
    );
  } catch {
    // Bildirim tercihi sadece bu cihazda tutulur.
  }
}

function loadCardReminderState() {
  try {

    const saved = localStorage.getItem(getStorageKey(CARD_REMINDER_STATE_STORAGE_KEY));

    const parsed = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCardReminderState() {
  try {
    localStorage.setItem(getStorageKey(CARD_REMINDER_STATE_STORAGE_KEY), JSON.stringify(cardReminderState || {}));
  } catch {
    // Hatırlatma geçmişi kritik değil.
  }
}

function refreshCardReminderSettingsForCurrentUser() {
  cardReminderSettings = loadCardReminderSettings();
  cardReminderState = loadCardReminderState();
  updateCardReminderControls();
}

function initCardReminderNotifications() {
  updateCardReminderControls();
  cardReminderPermissionButton?.addEventListener("click", toggleCardReminderNotifications);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkCardPaymentReminders();
    }
  });
  window.addEventListener("focus", () => checkCardPaymentReminders());
  window.setTimeout(() => checkCardPaymentReminders(), 1500);
  cardReminderTimer = window.setInterval(checkCardPaymentReminders, CARD_REMINDER_CHECK_INTERVAL_MS);
}

function updateCardReminderControls() {

  const supported = isCardReminderSupported();

  const permission = supported ? Notification.permission : "unsupported";

  const enabled = Boolean(cardReminderSettings.enabled && permission === "granted");

  if (cardReminderPermissionButton) {
    cardReminderPermissionButton.disabled = !supported || permission === "denied";
    cardReminderPermissionButton.classList.toggle("is-on", enabled);
    cardReminderPermissionButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    cardReminderPermissionButton.setAttribute("aria-checked", enabled ? "true" : "false");

    const switchText = cardReminderPermissionButton.querySelector(".ios-switch-text");
    if (switchText) {
      switchText.textContent = enabled ? "Açık" : permission === "denied" ? "İzin kapalı" : "Kapalı";
    }
  }

  if (!cardReminderStatus) {
    return;
  }

  if (!supported) {
    cardReminderStatus.textContent = "Bu tarayıcı kart bildirimi desteklemiyor.";
  } else if (permission === "denied") {
    cardReminderStatus.textContent = "Bildirim izni kapalı. Tarayıcı/telefon ayarlarından izin vermen gerekir.";
  } else if (enabled) {

    const dueCards = getDueCardReminderItems();
    cardReminderStatus.textContent = dueCards.length
      ? `${dueCards.length} kart için son ödeme hatırlatması aktif.`
      : "Bildirimler açık. Son ödeme tarihi yaklaşan kart olunca hatırlatacağım.";
  } else {
    cardReminderStatus.textContent = "Bildirimler kapalı. Açınca son ödeme tarihine 5 gün kala hatırlatırım.";
  }
}

function isCardReminderSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

async function toggleCardReminderNotifications() {
  if (!isCardReminderSupported()) {
    updateCardReminderControls();
    return;
  }

  const enabled = Boolean(cardReminderSettings.enabled && Notification.permission === "granted");

  if (enabled) {
    cardReminderSettings.enabled = false;
    saveCardReminderSettings();
    updateCardReminderControls();
    if (cardReminderStatus) {
      cardReminderStatus.textContent = "Kart bildirimleri kapatıldı. İstediğin zaman ayarlardan tekrar açabilirsin.";
    }
    return;
  }

  await requestCardReminderPermission();
}

async function requestCardReminderPermission() {
  if (!isCardReminderSupported()) {
    updateCardReminderControls();
    return;
  }

  try {

    const permission = await Notification.requestPermission();
    cardReminderSettings.enabled = permission === "granted";
    saveCardReminderSettings();
    updateCardReminderControls();

    if (permission === "granted") {
      checkCardPaymentReminders({ force: true });
    }
  } catch (error) {
    if (cardReminderStatus) {
      cardReminderStatus.textContent = "Bildirim izni alınamadı. Telefon/tarayıcı ayarlarını kontrol et.";
    }
  }
}

async function checkCardPaymentReminders(options = {}) {
  const { force = false } = options;

  if (!cardReminderSettings.enabled || !isCardReminderSupported() || Notification.permission !== "granted") {
    updateCardReminderControls();
    return;
  }

  const slot = force ? getCurrentOrNextCardReminderSlot() : getCurrentCardReminderSlot();

  if (!slot) {
    updateCardReminderControls();
    return;
  }

  const dueCards = getDueCardReminderItems();

  for (const item of dueCards) {

    const key = `${item.account.id}|${item.dueDate}|${getTurkeyTodayISO()}|${slot}`;

    if (cardReminderState[key]) {
      continue;
    }

    if (await sendCardPaymentReminder(item, slot)) {
      cardReminderState[key] = getTurkeyNowDateTime();
    }
  }

  saveCardReminderState();
  updateCardReminderControls();
}

function getCurrentCardReminderSlot(date = new Date()) {

  const time = getTurkeyNowTime(date).slice(0, 5);
  return CARD_REMINDER_SLOTS.filter((slot) => slot <= time).pop() || "";
}

function getCurrentOrNextCardReminderSlot(date = new Date()) {
  return getCurrentCardReminderSlot(date) || CARD_REMINDER_SLOTS[0];
}

function getDueCardReminderItems(referenceDate = getTurkeyTodayISO()) {
  return paymentAccounts
    .filter((account) => account.type === "credit_card" && Number(account.debt || 0) > 0 && Number(account.dueDay || 0) > 0)
    .map((account) => {

      const dueDate = getCreditCardDueDate(account, referenceDate);

      const daysUntil = getDateDiffInDays(referenceDate, dueDate);
      return { account, dueDate, daysUntil };
    })
    .filter((item) => item.dueDate && item.daysUntil <= CARD_REMINDER_START_DAYS);
}

function getCreditCardDueDate(account, referenceDate = getTurkeyTodayISO()) {

  const dueDay = Number(account?.dueDay || 0);

  if (!dueDay) {
    return "";
  }

  const today = parseIsoDate(referenceDate);

  if (!today) {
    return "";
  }

  const statementDay = Number(account?.statementDay || 0);

  if (!statementDay) {
    return toDateInputValue(new Date(today.getFullYear(), today.getMonth(), clampMonthDay(today.getFullYear(), today.getMonth(), dueDay)));
  }

  const statementCandidates = [];

  for (let offset = -2; offset <= 2; offset += 1) {

    const statementYear = today.getFullYear();

    const statementMonth = today.getMonth() + offset;

    const statementDate = new Date(
      statementYear,
      statementMonth,
      clampMonthDay(statementYear, statementMonth, statementDay)
    );

    const dueMonth = dueDay <= statementDay ? statementDate.getMonth() + 1 : statementDate.getMonth();

    const dueYear = statementDate.getFullYear();

    const dueDate = new Date(dueYear, dueMonth, clampMonthDay(dueYear, dueMonth, dueDay));

    if (statementDate.getTime() <= today.getTime()) {
      statementCandidates.push({ statementDate, dueDate });
    }
  }

  const latestStatement = statementCandidates.sort((a, b) => b.statementDate.getTime() - a.statementDate.getTime())[0];
  return latestStatement ? toDateInputValue(latestStatement.dueDate) : "";
}

function parseIsoDate(value) {

  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDateDiffInDays(fromIso, toIso) {

  const from = parseIsoDate(fromIso);

  const to = parseIsoDate(toIso);

  if (!from || !to) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function getCardReminderMessage(item) {

  const account = item.account;

  const dayText = item.daysUntil > 0
    ? `${item.daysUntil} gün kaldı`
    : item.daysUntil === 0
      ? "son gün bugün"
      : `${Math.abs(item.daysUntil)} gün geçti`;

  return {
    title: "Kredi kartı son ödeme hatırlatması",
    body: `${formatPaymentAccountName(account)}: ${formatDate(item.dueDate)} (${dayText}). Borç: ${currency.format(account.debt || 0)}.`,
  };
}

async function sendCardPaymentReminder(item, slot) {

  const message = getCardReminderMessage(item);

  const options = {
    body: message.body,
    tag: `card-payment-${item.account.id}-${item.dueDate}-${slot}`,
    renotify: false,
    requireInteraction: false,
    icon: "./icon-180.png",
    badge: "./icon-180.png",
    data: {
      url: "./",
      accountId: item.account.id,
      dueDate: item.dueDate,
    },
  };

  try {
    if ("serviceWorker" in navigator) {

      const registration = await navigator.serviceWorker.ready;

      if (registration?.showNotification) {
        await registration.showNotification(message.title, options);
        return true;
      }
    }

    new Notification(message.title, options);
    return true;
  } catch {
    return false;
  }
}

function openGenericConfirmModal(title, text, onConfirm, options = {}) {
  if (!genericConfirmModal) {
    if (typeof onConfirm === "function") {
      onConfirm();
    }
    return;
  }

  pendingGenericConfirmAction = typeof onConfirm === "function" ? onConfirm : null;
  if (genericConfirmTitle) {
    genericConfirmTitle.textContent = title || "Silmek istediğine emin misin?";
  }
  if (genericConfirmText) {
    genericConfirmText.textContent = text || "Bu işlem geri alınamaz.";
  }
  if (genericConfirmButton) {
    genericConfirmButton.textContent = options.confirmLabel || "Evet, sil";
  }
  if (genericConfirmCancelButton) {
    genericConfirmCancelButton.textContent = options.cancelLabel || "Vazgeç";
  }
  genericConfirmModal.hidden = false;
}

function closeGenericConfirmModal() {
  pendingGenericConfirmAction = null;
  if (genericConfirmModal) {
    genericConfirmModal.hidden = true;
  }
}

function runGenericConfirmAction() {

  const action = pendingGenericConfirmAction;
  closeGenericConfirmModal();
  if (typeof action === "function") {
    action();
  }
}

function requestAssetDelete(item) {

  const definition = getAssetDefinition(item.type);

  const title = item.label || definition.label;
  openGenericConfirmModal(
    `${title} silinsin mi?`,
    "Bu varlık listeden kaldırılacak. İşlem geri alınamaz.",
    () => {
      markAssetDeleted(item.id);
      assets = assets.filter((asset) => asset.id !== item.id);
      if (editingAssetId === item.id) {
        closeAssetEditModal();
      }
      persistAssets();
      renderAssets();
      renderHome();
    }
  );
}

function requestBesDelete(item) {
  openGenericConfirmModal(
    `${item.provider} silinsin mi?`,
    "Bu BES kaydı listeden kaldırılacak. İşlem geri alınamaz.",
    () => {
      markBesAccountDeleted(item.id);
      besAccounts = besAccounts.filter((account) => account.id !== item.id);
      persistBesAccounts();
      renderBesAccounts();
      renderHome();
    }
  );
}

function getTransactionDeletionCascadeIds(item) {

  const ids = new Set();

  if (!item?.id) {
    return ids;
  }

  ids.add(item.id);

  if (item.type === "transfer") {
    getLegacyTransferCounterpartIds(item).forEach((id) => ids.add(id));
    return ids;
  }

  transactions.forEach((candidate) => {
    if (candidate.id !== item.id && isLikelySplitTransferPair(item, candidate)) {
      ids.add(candidate.id);
    }
  });

  return ids;
}

function requestTransactionDelete(item) {
  openGenericConfirmModal(
    `${item.title} silinsin mi?`,
    "Bu kayıt silinecek. Bağlı kart/hesap bakiyesi de buna göre güncellenecek ve yenilemede geri gelmeyecek.",
    () => {

      const idsToDelete = getTransactionDeletionCascadeIds(item);

      let changedPaymentAccount = false;

      idsToDelete.forEach((transactionId) => {

        const transaction = transactions.find((record) => record.id === transactionId) || (transactionId === item.id ? item : null);
        if (transaction) {
          changedPaymentAccount = applyTransactionPaymentEffect(transaction, -1) || changedPaymentAccount;
          if (typeof borcAlacakGelirGiderOdemesiniGeriAl === "function") {
            borcAlacakGelirGiderOdemesiniGeriAl(transaction);
          }
          markTransactionDeleted(transactionId, transaction);
        } else {
          markTransactionDeleted(transactionId);
        }
      });

      transactions = transactions.filter((transaction) => !idsToDelete.has(transaction.id) && !isTransactionDeleted(transaction));
      if (changedPaymentAccount) {
        refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
        persistPaymentAccounts();
      }
      persistTransactions({ cloudDeletes: [...idsToDelete] });
      render();
    }
  );
}

function hideAllStartupModals() {
  document.querySelectorAll('.modal-backdrop').forEach((modal) => {
    modal.hidden = true;
  });
}

function mountSummaryFilterPanel() {
  const filterPanel = document.querySelector("#settingsView .home-summary-filter-standalone");
  if (!filterPanel) return;

  filterPanel.setAttribute("aria-label", "Tarih işlemleri");
  filterPanel.classList.add("settings-filter-panel");

  // Eski sürümlerde özet sayfasına doğrudan eklenen filtre kartını kaldır.
  document.getElementById("summaryHomeSummaryFilterPanel")?.remove();

  const entryKicker = filterPanel.querySelector(".panel-kicker");
  const entryTitle = filterPanel.querySelector("h2");
  const entryNote = filterPanel.querySelector(".panel-note");
  const entryApply = filterPanel.querySelector("#applyHomeSummaryFilterButton");
  if (entryKicker) entryKicker.textContent = "Filtre";
  if (entryTitle) entryTitle.textContent = "Tarih işlemleri";
  if (entryNote) entryNote.textContent = "Özet ve Tasarruf ile aynı tarih aralığı kullanılır.";
  if (entryApply) entryApply.textContent = "Filtreyi Uygula";
}

function openSummaryDateFilterModal() {
  const modal = document.getElementById("summaryDateFilterModal");
  if (!modal) return;
  syncHomeSummaryFilterControls();
  modal.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("summaryHomeSummaryStartDate")?.focus(), 20);
}

function closeSummaryDateFilterModal() {
  const modal = document.getElementById("summaryDateFilterModal");
  if (!modal) return;
  modal.hidden = true;
  if (!document.querySelector('.modal-backdrop:not([hidden])')) {
    document.body.classList.remove("modal-open");
  }
}

function getHomeSummaryStartInputs() {
  return [homeSummaryStartDate, document.getElementById("summaryHomeSummaryStartDate")].filter(Boolean);
}

function getHomeSummaryEndInputs() {
  return [homeSummaryEndDate, document.getElementById("summaryHomeSummaryEndDate")].filter(Boolean);
}

function getHomeSummaryStatusNodes() {
  return [homeSummaryFilterStatus, document.getElementById("summaryHomeSummaryFilterStatus")].filter(Boolean);
}

function getHomeSummaryApplyButtons() {
  return [applyHomeSummaryFilterButton, document.getElementById("summaryApplyHomeSummaryFilterButton")].filter(Boolean);
}

function getHomeSummaryClearButtons() {
  return [clearHomeSummaryFilterButton, document.getElementById("summaryClearHomeSummaryFilterButton")].filter(Boolean);
}

function syncHomeSummaryFilterDraft(source, inputs) {

  const value = source?.value || "";
  inputs.forEach((input) => {
    if (input !== source) {
      input.value = value;
    }
  });
}

function bindHomeSummaryFilterControls() {
  const closeButton = document.getElementById("closeSummaryDateFilterModalButton");
  const modal = document.getElementById("summaryDateFilterModal");
  if (closeButton && closeButton.dataset.summaryFilterBound !== "true") {
    closeButton.dataset.summaryFilterBound = "true";
    closeButton.addEventListener("click", closeSummaryDateFilterModal);
  }
  if (modal && modal.dataset.summaryFilterBackdropBound !== "true") {
    modal.dataset.summaryFilterBackdropBound = "true";
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeSummaryDateFilterModal();
    });
  }
  getHomeSummaryStartInputs().forEach((input) => {
    if (input.dataset.homeSummaryBound === "true") return;
    input.dataset.homeSummaryBound = "true";
    input.addEventListener("input", () => syncHomeSummaryFilterDraft(input, getHomeSummaryStartInputs()));
    input.addEventListener("change", () => syncHomeSummaryFilterDraft(input, getHomeSummaryStartInputs()));
  });

  getHomeSummaryEndInputs().forEach((input) => {
    if (input.dataset.homeSummaryBound === "true") return;
    input.dataset.homeSummaryBound = "true";
    input.addEventListener("input", () => syncHomeSummaryFilterDraft(input, getHomeSummaryEndInputs()));
    input.addEventListener("change", () => syncHomeSummaryFilterDraft(input, getHomeSummaryEndInputs()));
  });

  getHomeSummaryApplyButtons().forEach((button) => {
    if (button.dataset.homeSummaryBound === "true") return;
    button.dataset.homeSummaryBound = "true";
    button.addEventListener("click", applyHomeSummaryFilter);
  });

  getHomeSummaryClearButtons().forEach((button) => {
    if (button.dataset.homeSummaryBound === "true") return;
    button.dataset.homeSummaryBound = "true";
    button.addEventListener("click", clearHomeSummaryFilter);
  });
}

function getFirstHomeSummaryInputValue(inputs) {

  const filled = inputs.find((input) => input.value);
  if (filled) {
    return filled.value;
  }
  return inputs[0]?.value || "";
}

function updateHistoryResponsiveLayout() {

  const panel = document.querySelector("#historyView .history-panel");

  const panelWidth = panel ? panel.getBoundingClientRect().width : window.innerWidth;

  const compact = window.matchMedia("(max-width: 980px)").matches || panelWidth <= 980;
  document.documentElement.classList.toggle("history-compact-layout", compact);
}

function bindHistoryResponsiveLayout() {
  updateHistoryResponsiveLayout();
  window.addEventListener("resize", updateHistoryResponsiveLayout);

  const panel = document.querySelector("#historyView .history-panel");
  if (panel && "ResizeObserver" in window) {

    const observer = new ResizeObserver(() => updateHistoryResponsiveLayout());
    observer.observe(panel);
  }
}

function bindHistorySearchFallback() {

  const searchButton = document.getElementById("historySearchButton");

  const input = document.getElementById("searchInput");

  if (searchButton && searchButton.dataset.searchFallbackBound !== "true") {
    searchButton.dataset.searchFallbackBound = "true";
    searchButton.addEventListener("click", () => applyHistorySearch());
  }

  if (input && input.dataset.enterSearchBound !== "true") {
    input.dataset.enterSearchBound = "true";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyHistorySearch();
      }
    });
  }
}

function isStandalonePwaMode() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

function syncPwaStandaloneClass() {
  document.documentElement.classList.toggle("akis-pwa-standalone", isStandalonePwaMode());
}

syncPwaStandaloneClass();

function isMobileBoundaryScrollLockNeeded() {

  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;

  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const appleTouchDevice =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const standalonePwa = isStandalonePwaMode();
  return narrowScreen && touchDevice && appleTouchDevice && standalonePwa;
}

function isAppShellVisibleForScrollLock() {

  const appShell = document.getElementById("appShell");
  return Boolean(appShell && !appShell.hidden);
}

function getWorkspaceScrollElement() {
  return (
    document.querySelector("#appShell.app-shell:not([hidden]) > .workspace") ||
    document.querySelector(".app-shell:not([hidden]) > .workspace") ||
    document.querySelector(".workspace")
  );
}

function isScrollableYElement(element) {
  if (!element || element === document.body || element === document.documentElement) {
    return false;
  }

  const style = window.getComputedStyle(element);

  const overflowY = style.overflowY || style.overflow;

  const canScrollStyle = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canScrollStyle && element.scrollHeight > element.clientHeight + 1;
}

function canScrollElementInTouchDirection(element, deltaY) {

  const maxScrollTop = element.scrollHeight - element.clientHeight;

  if (maxScrollTop <= 1) {
    return false;
  }

  if (deltaY > 0) {
    return element.scrollTop > 0;
  }

  if (deltaY < 0) {
    return element.scrollTop < maxScrollTop - 1;
  }

  return true;
}

function getRootScrollElement() {
  return document.scrollingElement || document.documentElement;
}

function canRootDocumentScrollInTouchDirection(deltaY) {

  const rootScrollElement = getRootScrollElement();

  if (!rootScrollElement) {
    return false;
  }

  return canScrollElementInTouchDirection(rootScrollElement, deltaY);
}

function hasScrollableAncestorInTouchDirection(target, deltaY) {

  const workspace = getWorkspaceScrollElement();

  let node = target instanceof Element ? target : target?.parentElement;

  while (node && node !== document.body && node !== document.documentElement) {
    if (isScrollableYElement(node) && canScrollElementInTouchDirection(node, deltaY)) {
      return true;
    }

    if (node === workspace) {
      return false;
    }

    node = node.parentElement;
  }

  return Boolean((workspace && isScrollableYElement(workspace) && canScrollElementInTouchDirection(workspace, deltaY)) || canRootDocumentScrollInTouchDirection(deltaY));
}

function setupMobileBoundaryScrollLock() {
  if (window.__akisMobileBoundaryScrollLockBound) {
    return;
  }

  let lastTouchY = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (!isMobileBoundaryScrollLockNeeded() || !isAppShellVisibleForScrollLock() || event.touches.length !== 1) {
        return;
      }

      lastTouchY = event.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!isMobileBoundaryScrollLockNeeded() || !isAppShellVisibleForScrollLock() || event.touches.length !== 1) {
        return;
      }

      const currentTouchY = event.touches[0].clientY;

      const deltaY = currentTouchY - lastTouchY;
      lastTouchY = currentTouchY;

      if (Math.abs(deltaY) < 0.5) {
        return;
      }

      if (!hasScrollableAncestorInTouchDirection(event.target, deltaY)) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  window.__akisMobileBoundaryScrollLockBound = true;
}
