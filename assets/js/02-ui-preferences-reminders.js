// ACIKLAMA: Tema, yazi tipi, kart odeme hatirlaticilari, genel onay penceresi ve mobil kaydirma yardimcilari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

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

// ACIKLAMA: loadThemePreference fonksiyonunun Turkce karsiligi "yukle tema tercih"; ilgili uygulama islemini calistirir.
function loadThemePreference() {
  try {
    // ACIKLAMA: saved degiskeninin Turkce karsiligi "saved"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

// ACIKLAMA: saveThemePreference fonksiyonunun Turkce karsiligi "kaydet tema tercih"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveThemePreference(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Sessiz geç
  }
}

// ACIKLAMA: normalizeUiSettings fonksiyonunun Turkce karsiligi "standartlastir ui ayarlar"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeUiSettings(raw = {}) {
  // ACIKLAMA: normalizedTheme degiskeninin Turkce karsiligi "normalized tema"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedTheme = raw.theme === "dark" ? "dark" : "light";
  // ACIKLAMA: normalizedFontFamily degiskeninin Turkce karsiligi "normalized yazi tipi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedFontFamily = Object.prototype.hasOwnProperty.call(FONT_FAMILY_MAP, raw.fontFamily) ? raw.fontFamily : DEFAULT_UI_SETTINGS.fontFamily;
  // ACIKLAMA: normalizedFontWeight degiskeninin Turkce karsiligi "normalized yazi kalinlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedFontWeight = Object.prototype.hasOwnProperty.call(FONT_WEIGHT_MAP, raw.fontWeight) ? raw.fontWeight : DEFAULT_UI_SETTINGS.fontWeight;
  // ACIKLAMA: fontSizeNumber degiskeninin Turkce karsiligi "yazi boyut sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fontSizeNumber = Number(raw.fontSize);
  // ACIKLAMA: normalizedFontSize degiskeninin Turkce karsiligi "normalized yazi boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedFontSize = Number.isFinite(fontSizeNumber) ? Math.min(20, Math.max(14, Math.round(fontSizeNumber))) : DEFAULT_UI_SETTINGS.fontSize;

  return {
    theme: normalizedTheme,
    fontFamily: normalizedFontFamily,
    fontWeight: normalizedFontWeight,
    fontSize: normalizedFontSize,
  };
}

// ACIKLAMA: loadUiSettings fonksiyonunun Turkce karsiligi "yukle ui ayarlar"; ilgili uygulama islemini calistirir.
function loadUiSettings() {
  try {
    // ACIKLAMA: saved degiskeninin Turkce karsiligi "saved"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const saved = localStorage.getItem(UI_SETTINGS_STORAGE_KEY);
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: saveUiSettings fonksiyonunun Turkce karsiligi "kaydet ui ayarlar"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveUiSettings() {
  try {
    localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(uiSettings));
  } catch (error) {
    // Sessiz geç
  }
  saveThemePreference(uiSettings.theme);
}

// ACIKLAMA: updateThemeButtons fonksiyonunun Turkce karsiligi "guncelle tema butonlar"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateThemeButtons(theme) {
  themeButtons.forEach((button) => {
    // ACIKLAMA: isActive degiskeninin Turkce karsiligi "mi aktif"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const isActive = button.dataset.themeOption === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

// ACIKLAMA: syncAppearanceControls fonksiyonunun Turkce karsiligi "esitle gorunum kontroller"; bulut ve yerel veri esitleme akisini yonetir.
function syncAppearanceControls() {
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

// ACIKLAMA: applyTheme fonksiyonunun Turkce karsiligi "uygula tema"; ilgili uygulama islemini calistirir.
function applyTheme(theme, options = {}) {
  const { persist = true, syncControls = true } = options;
  // ACIKLAMA: normalizedTheme degiskeninin Turkce karsiligi "normalized tema"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  uiSettings = normalizeUiSettings({ ...uiSettings, theme: normalizedTheme });
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  document.body?.setAttribute("data-theme", normalizedTheme);
  // ACIKLAMA: metaTheme degiskeninin Turkce karsiligi "meta tema"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: applyTypographySettings fonksiyonunun Turkce karsiligi "uygula typography ayarlar"; ilgili uygulama islemini calistirir.
function applyTypographySettings(settings = uiSettings, options = {}) {
  const { persist = true, syncControls = true } = options;
  uiSettings = normalizeUiSettings({ ...uiSettings, ...settings });
  // ACIKLAMA: fontWeight degiskeninin Turkce karsiligi "yazi kalinlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: changeFontSize fonksiyonunun Turkce karsiligi "change yazi boyut"; ilgili uygulama islemini calistirir.
function changeFontSize(delta) {
  applyTypographySettings({ fontSize: uiSettings.fontSize + delta });
}

// ACIKLAMA: resetAppearanceSettings fonksiyonunun Turkce karsiligi "sifirla gorunum ayarlar"; ilgili uygulama islemini calistirir.
function resetAppearanceSettings() {
  uiSettings = { ...DEFAULT_UI_SETTINGS };
  applyTypographySettings(uiSettings);
}

// ACIKLAMA: initThemePreference fonksiyonunun Turkce karsiligi "baslat tema tercih"; ilgili uygulama islemini calistirir.
function initThemePreference() {
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

// ACIKLAMA: normalizeCardReminderSettings fonksiyonunun Turkce karsiligi "standartlastir kart hatirlatici ayarlar"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeCardReminderSettings(raw = {}) {
  return {
    enabled: Boolean(raw.enabled),
  };
}

// ACIKLAMA: loadCardReminderSettings fonksiyonunun Turkce karsiligi "yukle kart hatirlatici ayarlar"; ilgili uygulama islemini calistirir.
function loadCardReminderSettings() {
  try {
    // ACIKLAMA: saved degiskeninin Turkce karsiligi "saved"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const saved = localStorage.getItem(getStorageKey(CARD_REMINDER_SETTINGS_STORAGE_KEY));
    return normalizeCardReminderSettings(saved ? JSON.parse(saved) : DEFAULT_CARD_REMINDER_SETTINGS);
  } catch {
    return { ...DEFAULT_CARD_REMINDER_SETTINGS };
  }
}

// ACIKLAMA: saveCardReminderSettings fonksiyonunun Turkce karsiligi "kaydet kart hatirlatici ayarlar"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
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

// ACIKLAMA: loadCardReminderState fonksiyonunun Turkce karsiligi "yukle kart hatirlatici durum"; ilgili uygulama islemini calistirir.
function loadCardReminderState() {
  try {
    // ACIKLAMA: saved degiskeninin Turkce karsiligi "saved"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const saved = localStorage.getItem(getStorageKey(CARD_REMINDER_STATE_STORAGE_KEY));
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// ACIKLAMA: saveCardReminderState fonksiyonunun Turkce karsiligi "kaydet kart hatirlatici durum"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveCardReminderState() {
  try {
    localStorage.setItem(getStorageKey(CARD_REMINDER_STATE_STORAGE_KEY), JSON.stringify(cardReminderState || {}));
  } catch {
    // Hatırlatma geçmişi kritik değil.
  }
}

// ACIKLAMA: refreshCardReminderSettingsForCurrentUser fonksiyonunun Turkce karsiligi "yenile kart hatirlatici ayarlar icin mevcut kullanici"; ilgili uygulama islemini calistirir.
function refreshCardReminderSettingsForCurrentUser() {
  cardReminderSettings = loadCardReminderSettings();
  cardReminderState = loadCardReminderState();
  updateCardReminderControls();
}

// ACIKLAMA: initCardReminderNotifications fonksiyonunun Turkce karsiligi "baslat kart hatirlatici notifications"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: updateCardReminderControls fonksiyonunun Turkce karsiligi "guncelle kart hatirlatici kontroller"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateCardReminderControls() {
  // ACIKLAMA: supported degiskeninin Turkce karsiligi "supported"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const supported = isCardReminderSupported();
  // ACIKLAMA: permission degiskeninin Turkce karsiligi "permission"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const permission = supported ? Notification.permission : "unsupported";
  // ACIKLAMA: enabled degiskeninin Turkce karsiligi "enabled"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const enabled = Boolean(cardReminderSettings.enabled && permission === "granted");

  if (cardReminderPermissionButton) {
    cardReminderPermissionButton.disabled = !supported || permission === "denied";
    cardReminderPermissionButton.classList.toggle("is-on", enabled);
    cardReminderPermissionButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    cardReminderPermissionButton.setAttribute("aria-checked", enabled ? "true" : "false");
    // ACIKLAMA: switchText degiskeninin Turkce karsiligi "ekran degistir metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: dueCards degiskeninin Turkce karsiligi "due kartlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dueCards = getDueCardReminderItems();
    cardReminderStatus.textContent = dueCards.length
      ? `${dueCards.length} kart için son ödeme hatırlatması aktif.`
      : "Bildirimler açık. Son ödeme tarihi yaklaşan kart olunca hatırlatacağım.";
  } else {
    cardReminderStatus.textContent = "Bildirimler kapalı. Açınca son ödeme tarihine 5 gün kala hatırlatırım.";
  }
}

// ACIKLAMA: isCardReminderSupported fonksiyonunun Turkce karsiligi "mi kart hatirlatici supported"; ilgili uygulama islemini calistirir.
function isCardReminderSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

// ACIKLAMA: toggleCardReminderNotifications fonksiyonunun Turkce karsiligi "ac kapat kart hatirlatici notifications"; ilgili uygulama islemini calistirir.
async function toggleCardReminderNotifications() {
  if (!isCardReminderSupported()) {
    updateCardReminderControls();
    return;
  }

  // ACIKLAMA: enabled degiskeninin Turkce karsiligi "enabled"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: requestCardReminderPermission fonksiyonunun Turkce karsiligi "istek kart hatirlatici permission"; ilgili uygulama islemini calistirir.
async function requestCardReminderPermission() {
  if (!isCardReminderSupported()) {
    updateCardReminderControls();
    return;
  }

  try {
    // ACIKLAMA: permission degiskeninin Turkce karsiligi "permission"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: checkCardPaymentReminders fonksiyonunun Turkce karsiligi "check kart odeme reminders"; ilgili uygulama islemini calistirir.
async function checkCardPaymentReminders(options = {}) {
  const { force = false } = options;

  if (!cardReminderSettings.enabled || !isCardReminderSupported() || Notification.permission !== "granted") {
    updateCardReminderControls();
    return;
  }

  // ACIKLAMA: slot degiskeninin Turkce karsiligi "slot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const slot = force ? getCurrentOrNextCardReminderSlot() : getCurrentCardReminderSlot();

  if (!slot) {
    updateCardReminderControls();
    return;
  }

  // ACIKLAMA: dueCards degiskeninin Turkce karsiligi "due kartlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dueCards = getDueCardReminderItems();

  for (const item of dueCards) {
    // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
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

// ACIKLAMA: getCurrentCardReminderSlot fonksiyonunun Turkce karsiligi "al mevcut kart hatirlatici slot"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCurrentCardReminderSlot(date = new Date()) {
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTurkeyNowTime(date).slice(0, 5);
  return CARD_REMINDER_SLOTS.filter((slot) => slot <= time).pop() || "";
}

// ACIKLAMA: getCurrentOrNextCardReminderSlot fonksiyonunun Turkce karsiligi "al mevcut or sonraki kart hatirlatici slot"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCurrentOrNextCardReminderSlot(date = new Date()) {
  return getCurrentCardReminderSlot(date) || CARD_REMINDER_SLOTS[0];
}

// ACIKLAMA: getDueCardReminderItems fonksiyonunun Turkce karsiligi "al due kart hatirlatici ogeler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDueCardReminderItems(referenceDate = getTurkeyTodayISO()) {
  return paymentAccounts
    .filter((account) => account.type === "credit_card" && Number(account.debt || 0) > 0 && Number(account.dueDay || 0) > 0)
    .map((account) => {
      // ACIKLAMA: dueDate degiskeninin Turkce karsiligi "due tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const dueDate = getCreditCardDueDate(account, referenceDate);
      // ACIKLAMA: daysUntil degiskeninin Turkce karsiligi "days until"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const daysUntil = getDateDiffInDays(referenceDate, dueDate);
      return { account, dueDate, daysUntil };
    })
    .filter((item) => item.dueDate && item.daysUntil <= CARD_REMINDER_START_DAYS);
}

// ACIKLAMA: getCreditCardDueDate fonksiyonunun Turkce karsiligi "al alacak kart due tarih"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardDueDate(account, referenceDate = getTurkeyTodayISO()) {
  // ACIKLAMA: dueDay degiskeninin Turkce karsiligi "due gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dueDay = Number(account?.dueDay || 0);

  if (!dueDay) {
    return "";
  }

  // ACIKLAMA: today degiskeninin Turkce karsiligi "bugun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const today = parseIsoDate(referenceDate);

  if (!today) {
    return "";
  }

  // ACIKLAMA: statementDay degiskeninin Turkce karsiligi "statement gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDay = Number(account?.statementDay || 0);

  if (!statementDay) {
    return toDateInputValue(new Date(today.getFullYear(), today.getMonth(), clampMonthDay(today.getFullYear(), today.getMonth(), dueDay)));
  }

  // ACIKLAMA: statementCandidates degiskeninin Turkce karsiligi "statement candidates"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementCandidates = [];

  for (let offset = -2; offset <= 2; offset += 1) {
    // ACIKLAMA: statementYear degiskeninin Turkce karsiligi "statement yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const statementYear = today.getFullYear();
    // ACIKLAMA: statementMonth degiskeninin Turkce karsiligi "statement ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const statementMonth = today.getMonth() + offset;
    // ACIKLAMA: statementDate degiskeninin Turkce karsiligi "statement tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const statementDate = new Date(
      statementYear,
      statementMonth,
      clampMonthDay(statementYear, statementMonth, statementDay)
    );
    // ACIKLAMA: dueMonth degiskeninin Turkce karsiligi "due ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dueMonth = dueDay <= statementDay ? statementDate.getMonth() + 1 : statementDate.getMonth();
    // ACIKLAMA: dueYear degiskeninin Turkce karsiligi "due yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dueYear = statementDate.getFullYear();
    // ACIKLAMA: dueDate degiskeninin Turkce karsiligi "due tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dueDate = new Date(dueYear, dueMonth, clampMonthDay(dueYear, dueMonth, dueDay));

    if (statementDate.getTime() <= today.getTime()) {
      statementCandidates.push({ statementDate, dueDate });
    }
  }

  // ACIKLAMA: latestStatement degiskeninin Turkce karsiligi "latest statement"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const latestStatement = statementCandidates.sort((a, b) => b.statementDate.getTime() - a.statementDate.getTime())[0];
  return latestStatement ? toDateInputValue(latestStatement.dueDate) : "";
}

// ACIKLAMA: parseIsoDate fonksiyonunun Turkce karsiligi "cozumle iso tarih"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseIsoDate(value) {
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

// ACIKLAMA: getDateDiffInDays fonksiyonunun Turkce karsiligi "al tarih diff in days"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDateDiffInDays(fromIso, toIso) {
  // ACIKLAMA: from degiskeninin Turkce karsiligi "kaynakli"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const from = parseIsoDate(fromIso);
  // ACIKLAMA: to degiskeninin Turkce karsiligi "ile"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const to = parseIsoDate(toIso);

  if (!from || !to) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

// ACIKLAMA: getCardReminderMessage fonksiyonunun Turkce karsiligi "al kart hatirlatici mesaj"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCardReminderMessage(item) {
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = item.account;
  // ACIKLAMA: dayText degiskeninin Turkce karsiligi "gun metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: sendCardPaymentReminder fonksiyonunun Turkce karsiligi "send kart odeme hatirlatici"; ilgili uygulama islemini calistirir.
async function sendCardPaymentReminder(item, slot) {
  // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const message = getCardReminderMessage(item);
  // ACIKLAMA: options degiskeninin Turkce karsiligi "options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: registration degiskeninin Turkce karsiligi "registration"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openGenericConfirmModal fonksiyonunun Turkce karsiligi "ac genel onay pencere"; ilgili pencereyi veya ekrani acar.
function openGenericConfirmModal(title, text, onConfirm) {
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
  genericConfirmModal.hidden = false;
}

// ACIKLAMA: closeGenericConfirmModal fonksiyonunun Turkce karsiligi "kapat genel onay pencere"; ilgili pencereyi veya ekrani kapatir.
function closeGenericConfirmModal() {
  pendingGenericConfirmAction = null;
  if (genericConfirmModal) {
    genericConfirmModal.hidden = true;
  }
}

// ACIKLAMA: runGenericConfirmAction fonksiyonunun Turkce karsiligi "calistir genel onay action"; ilgili uygulama islemini calistirir.
function runGenericConfirmAction() {
  // ACIKLAMA: action degiskeninin Turkce karsiligi "action"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const action = pendingGenericConfirmAction;
  closeGenericConfirmModal();
  if (typeof action === "function") {
    action();
  }
}

// ACIKLAMA: requestAssetDelete fonksiyonunun Turkce karsiligi "istek varlik sil"; secilen kaydi siler veya listeden kaldirir.
function requestAssetDelete(item) {
  // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const definition = getAssetDefinition(item.type);
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: requestBesDelete fonksiyonunun Turkce karsiligi "istek BES sil"; secilen kaydi siler veya listeden kaldirir.
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

// ACIKLAMA: getTransactionDeletionCascadeIds fonksiyonunun Turkce karsiligi "al islem deletion cascade kimlikler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionDeletionCascadeIds(item) {
  // ACIKLAMA: ids degiskeninin Turkce karsiligi "kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: requestTransactionDelete fonksiyonunun Turkce karsiligi "istek islem sil"; secilen kaydi siler veya listeden kaldirir.
function requestTransactionDelete(item) {
  openGenericConfirmModal(
    `${item.title} silinsin mi?`,
    "Bu kayıt silinecek. Bağlı kart/hesap bakiyesi de buna göre güncellenecek ve yenilemede geri gelmeyecek.",
    () => {
      // ACIKLAMA: idsToDelete degiskeninin Turkce karsiligi "kimlikler ile sil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const idsToDelete = getTransactionDeletionCascadeIds(item);
      // ACIKLAMA: changedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
      let changedPaymentAccount = false;

      idsToDelete.forEach((transactionId) => {
        // ACIKLAMA: transaction degiskeninin Turkce karsiligi "islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const transaction = transactions.find((record) => record.id === transactionId) || (transactionId === item.id ? item : null);
        if (transaction) {
          changedPaymentAccount = applyTransactionPaymentEffect(transaction, -1) || changedPaymentAccount;
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

// ACIKLAMA: hideAllStartupModals fonksiyonunun Turkce karsiligi "gizle tum baslangic modals"; ilgili uygulama islemini calistirir.
function hideAllStartupModals() {
  document.querySelectorAll('.modal-backdrop').forEach((modal) => {
    modal.hidden = true;
  });
}

// ACIKLAMA: mountSummaryFilterPanel fonksiyonunun Turkce karsiligi "yerlestir ozet filtre panel"; ilgili uygulama islemini calistirir.
function mountSummaryFilterPanel() {
  // ACIKLAMA: filterPanel degiskeninin Turkce karsiligi "filtre panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const filterPanel = document.querySelector("#entryView .home-summary-filter-standalone");
  // ACIKLAMA: summaryStack degiskeninin Turkce karsiligi "ozet stack"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryStack = document.querySelector("#summaryView .summary-stack");
  // ACIKLAMA: statsGrid degiskeninin Turkce karsiligi "istatistikler grid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statsGrid = document.querySelector("#summaryView .stats-grid");

  if (!filterPanel || !summaryStack || !statsGrid) {
    return;
  }

  filterPanel.setAttribute("aria-label", "Gelir gider ekle tarih filtresi");
  filterPanel.classList.add("entry-filter-panel");

  // ACIKLAMA: summaryPanel degiskeninin Turkce karsiligi "ozet panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let summaryPanel = document.getElementById("summaryHomeSummaryFilterPanel");
  if (!summaryPanel) {
    summaryPanel = filterPanel.cloneNode(true);
    summaryPanel.id = "summaryHomeSummaryFilterPanel";
    summaryPanel.setAttribute("aria-label", "Özet ve tasarruf tarih filtresi");
    summaryPanel.classList.remove("entry-filter-panel");
    summaryPanel.classList.add("summary-filter-panel");

    // ACIKLAMA: status kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
    const status = summaryPanel.querySelector("#homeSummaryFilterStatus");
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = summaryPanel.querySelector("#homeSummaryStartDate");
    // ACIKLAMA: end degiskeninin Turkce karsiligi "bitis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const end = summaryPanel.querySelector("#homeSummaryEndDate");
    // ACIKLAMA: apply degiskeninin Turkce karsiligi "uygula"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const apply = summaryPanel.querySelector("#applyHomeSummaryFilterButton");
    // ACIKLAMA: clear degiskeninin Turkce karsiligi "temizle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const clear = summaryPanel.querySelector("#clearHomeSummaryFilterButton");
    if (status) status.id = "summaryHomeSummaryFilterStatus";
    if (start) start.id = "summaryHomeSummaryStartDate";
    if (end) end.id = "summaryHomeSummaryEndDate";
    if (apply) {
      apply.id = "summaryApplyHomeSummaryFilterButton";
      apply.textContent = "Özete Uygula";
    }
    if (clear) clear.id = "summaryClearHomeSummaryFilterButton";
    summaryStack.insertBefore(summaryPanel, statsGrid);
  }

  // ACIKLAMA: entryKicker degiskeninin Turkce karsiligi "entry kicker"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const entryKicker = filterPanel.querySelector(".panel-kicker");
  // ACIKLAMA: entryNote degiskeninin Turkce karsiligi "entry note"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const entryNote = filterPanel.querySelector(".panel-note");
  // ACIKLAMA: entryApply degiskeninin Turkce karsiligi "entry uygula"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const entryApply = filterPanel.querySelector("#applyHomeSummaryFilterButton");
  if (entryKicker) entryKicker.textContent = "Filtre";
  if (entryNote) entryNote.textContent = "Gelir / gider eklerken de aynı tarih aralığı kullanılır.";
  if (entryApply) entryApply.textContent = "Filtreyi Uygula";

  // ACIKLAMA: summaryKicker degiskeninin Turkce karsiligi "ozet kicker"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryKicker = summaryPanel.querySelector(".panel-kicker");
  // ACIKLAMA: summaryTitle degiskeninin Turkce karsiligi "ozet baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryTitle = summaryPanel.querySelector("h2");
  // ACIKLAMA: summaryNote degiskeninin Turkce karsiligi "ozet note"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryNote = summaryPanel.querySelector(".panel-note");
  if (summaryKicker) summaryKicker.textContent = "Filtre";
  if (summaryTitle) summaryTitle.textContent = "Gelir / gider tarih filtresi";
  if (summaryNote) summaryNote.textContent = "Özet ve tasarruf için tarih aralığı seç.";
}

// ACIKLAMA: getHomeSummaryStartInputs fonksiyonunun Turkce karsiligi "al ana sayfa ozet baslangic inputs"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryStartInputs() {
  return [homeSummaryStartDate, document.getElementById("summaryHomeSummaryStartDate")].filter(Boolean);
}

// ACIKLAMA: getHomeSummaryEndInputs fonksiyonunun Turkce karsiligi "al ana sayfa ozet bitis inputs"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryEndInputs() {
  return [homeSummaryEndDate, document.getElementById("summaryHomeSummaryEndDate")].filter(Boolean);
}

// ACIKLAMA: getHomeSummaryStatusNodes fonksiyonunun Turkce karsiligi "al ana sayfa ozet durum nodes"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryStatusNodes() {
  return [homeSummaryFilterStatus, document.getElementById("summaryHomeSummaryFilterStatus")].filter(Boolean);
}

// ACIKLAMA: getHomeSummaryApplyButtons fonksiyonunun Turkce karsiligi "al ana sayfa ozet uygula butonlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryApplyButtons() {
  return [applyHomeSummaryFilterButton, document.getElementById("summaryApplyHomeSummaryFilterButton")].filter(Boolean);
}

// ACIKLAMA: getHomeSummaryClearButtons fonksiyonunun Turkce karsiligi "al ana sayfa ozet temizle butonlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryClearButtons() {
  return [clearHomeSummaryFilterButton, document.getElementById("summaryClearHomeSummaryFilterButton")].filter(Boolean);
}

// ACIKLAMA: syncHomeSummaryFilterDraft fonksiyonunun Turkce karsiligi "esitle ana sayfa ozet filtre taslak"; bulut ve yerel veri esitleme akisini yonetir.
function syncHomeSummaryFilterDraft(source, inputs) {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = source?.value || "";
  inputs.forEach((input) => {
    if (input !== source) {
      input.value = value;
    }
  });
}

// ACIKLAMA: bindHomeSummaryFilterControls fonksiyonunun Turkce karsiligi "bagla ana sayfa ozet filtre kontroller"; ilgili uygulama islemini calistirir.
function bindHomeSummaryFilterControls() {
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

// ACIKLAMA: getFirstHomeSummaryInputValue fonksiyonunun Turkce karsiligi "al ilk ana sayfa ozet giris alani deger"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getFirstHomeSummaryInputValue(inputs) {
  // ACIKLAMA: filled degiskeninin Turkce karsiligi "filled"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const filled = inputs.find((input) => input.value);
  if (filled) {
    return filled.value;
  }
  return inputs[0]?.value || "";
}


// ACIKLAMA: updateHistoryResponsiveLayout fonksiyonunun Turkce karsiligi "guncelle gecmis responsive yerlesim"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateHistoryResponsiveLayout() {
  // ACIKLAMA: panel degiskeninin Turkce karsiligi "panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const panel = document.querySelector("#historyView .history-panel");
  // ACIKLAMA: panelWidth degiskeninin Turkce karsiligi "panel width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const panelWidth = panel ? panel.getBoundingClientRect().width : window.innerWidth;
  // ACIKLAMA: compact degiskeninin Turkce karsiligi "compact"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const compact = window.matchMedia("(max-width: 980px)").matches || panelWidth <= 980;
  document.documentElement.classList.toggle("history-compact-layout", compact);
}

// ACIKLAMA: bindHistoryResponsiveLayout fonksiyonunun Turkce karsiligi "bagla gecmis responsive yerlesim"; ilgili uygulama islemini calistirir.
function bindHistoryResponsiveLayout() {
  updateHistoryResponsiveLayout();
  window.addEventListener("resize", updateHistoryResponsiveLayout);

  // ACIKLAMA: panel degiskeninin Turkce karsiligi "panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const panel = document.querySelector("#historyView .history-panel");
  if (panel && "ResizeObserver" in window) {
    // ACIKLAMA: observer degiskeninin Turkce karsiligi "observer"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const observer = new ResizeObserver(() => updateHistoryResponsiveLayout());
    observer.observe(panel);
  }
}


// ACIKLAMA: bindHistorySearchFallback fonksiyonunun Turkce karsiligi "bagla gecmis arama fallback"; ilgili uygulama islemini calistirir.
function bindHistorySearchFallback() {
  // ACIKLAMA: searchButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const searchButton = document.getElementById("historySearchButton");
  // ACIKLAMA: input kullanicidan veri alan input elemaninin DOM referansidir.
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


// ACIKLAMA: isStandalonePwaMode fonksiyonunun Turkce karsiligi "bagimsiz PWA modu mu"; uygulamanin Safari sekmesinde mi yoksa ana ekran PWA modunda mi acildigini belirler.
function isStandalonePwaMode() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

// ACIKLAMA: syncPwaStandaloneClass fonksiyonunun Turkce karsiligi "PWA bagimsiz sinifini esitle"; CSS'in Safari ile PWA davranisini ayri yonetmesi icin html sinifini gunceller.
function syncPwaStandaloneClass() {
  document.documentElement.classList.toggle("akis-pwa-standalone", isStandalonePwaMode());
}

syncPwaStandaloneClass();


// ACIKLAMA: isMobileBoundaryScrollLockNeeded fonksiyonunun Turkce karsiligi "mobil sinir kaydirma kilidi gerekli mi"; iOS/PWA ve dar dokunmatik ekranlarda esneme engelinin calisip calismayacagini belirler.
function isMobileBoundaryScrollLockNeeded() {
  // ACIKLAMA: narrowScreen degiskeninin Turkce karsiligi "dar ekran"; telefon/tablet genisligini kontrol etmek icin kullanilir.
  const narrowScreen = window.matchMedia("(max-width: 768px)").matches;
  // ACIKLAMA: touchDevice degiskeninin Turkce karsiligi "dokunmatik cihaz"; dokunma olayi olmayan masaustu tarayicilarda bu kilidi kapali tutar.
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  // ACIKLAMA: appleTouchDevice degiskeninin Turkce karsiligi "Apple dokunmatik cihaz"; iPhone, iPad ve iPadOS masaustu modu tarayicilarini yakalar.
  const appleTouchDevice =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // ACIKLAMA: standalonePwa degiskeninin Turkce karsiligi "bagimsiz PWA"; ana ekrana eklenmis uygulama modunu kontrol eder.
  const standalonePwa = isStandalonePwaMode();
  return narrowScreen && touchDevice && appleTouchDevice && standalonePwa;
}

// ACIKLAMA: isAppShellVisibleForScrollLock fonksiyonunun Turkce karsiligi "uygulama kabugu kaydirma kilidi icin gorunur mu"; kilidin sadece giris sonrasi ana uygulamada calismasini saglar.
function isAppShellVisibleForScrollLock() {
  // ACIKLAMA: appShell degiskeninin Turkce karsiligi "uygulama kabugu"; ana PWA arayuzunun DOM elemanidir.
  const appShell = document.getElementById("appShell");
  return Boolean(appShell && !appShell.hidden);
}

// ACIKLAMA: getWorkspaceScrollElement fonksiyonunun Turkce karsiligi "calisma alani kaydirma elemani al"; uygulamanin ana dikey kaydirma alanini bulur.
function getWorkspaceScrollElement() {
  return (
    document.querySelector("#appShell.app-shell:not([hidden]) > .workspace") ||
    document.querySelector(".app-shell:not([hidden]) > .workspace") ||
    document.querySelector(".workspace")
  );
}

// ACIKLAMA: isScrollableYElement fonksiyonunun Turkce karsiligi "dikey kaydirilabilir eleman mi"; verilen elemanin dikeyde gercekten kaydirilabilir olup olmadigini kontrol eder.
function isScrollableYElement(element) {
  if (!element || element === document.body || element === document.documentElement) {
    return false;
  }

  // ACIKLAMA: style degiskeninin Turkce karsiligi "stil"; elemanin CSS overflow degerlerini okumak icin kullanilir.
  const style = window.getComputedStyle(element);
  // ACIKLAMA: overflowY degiskeninin Turkce karsiligi "dikey tasma"; elemanin dikey kaydirma iznini saklar.
  const overflowY = style.overflowY || style.overflow;
  // ACIKLAMA: canScrollStyle degiskeninin Turkce karsiligi "stil kaydirabilir"; overflow degeri kaydirmaya izin veriyor mu kontrol eder.
  const canScrollStyle = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canScrollStyle && element.scrollHeight > element.clientHeight + 1;
}

// ACIKLAMA: canScrollElementInTouchDirection fonksiyonunun Turkce karsiligi "eleman dokunma yonunde kayabilir mi"; parmak hareketinin sayfayi gercek icerikte kaydirip kaydiramayacagini belirler.
function canScrollElementInTouchDirection(element, deltaY) {
  // ACIKLAMA: maxScrollTop degiskeninin Turkce karsiligi "en buyuk kaydirma ust degeri"; elemanin ulasabilecegi son dikey kaydirma konumudur.
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

// ACIKLAMA: hasScrollableAncestorInTouchDirection fonksiyonunun Turkce karsiligi "dokunma yonunde kaydirilabilir ust eleman var mi"; en ust/en alt sinirda bosluga dogru esnemeyi ayirt eder.
function hasScrollableAncestorInTouchDirection(target, deltaY) {
  // ACIKLAMA: workspace degiskeninin Turkce karsiligi "calisma alani"; sayfanin ana kaydirma kabidir.
  const workspace = getWorkspaceScrollElement();
  // ACIKLAMA: node degiskeninin Turkce karsiligi "dugum"; dokunulan elemandan baslayip ust elemanlara cikmak icin kullanilir.
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

  return Boolean(workspace && isScrollableYElement(workspace) && canScrollElementInTouchDirection(workspace, deltaY));
}

// ACIKLAMA: setupMobileBoundaryScrollLock fonksiyonunun Turkce karsiligi "mobil sinir kaydirma kilidi kur"; iOS/PWA'da en ust ve en altta arka planin gorunmesine neden olan esnemeyi engeller.
function setupMobileBoundaryScrollLock() {
  if (window.__akisMobileBoundaryScrollLockBound) {
    return;
  }

  // ACIKLAMA: lastTouchY degiskeninin Turkce karsiligi "son dokunma Y konumu"; parmagin yukari mi asagi mi hareket ettigini hesaplamak icin saklanir.
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

      // ACIKLAMA: currentTouchY degiskeninin Turkce karsiligi "gecerli dokunma Y konumu"; anlik parmak konumudur.
      const currentTouchY = event.touches[0].clientY;
      // ACIKLAMA: deltaY degiskeninin Turkce karsiligi "Y farki"; parmagin son hareket yonunu hesaplar.
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



// ACIKLAMA: init fonksiyonunun Turkce karsiligi "baslat"; ilgili uygulama islemini calistirir.
