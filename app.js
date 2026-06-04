const STORAGE_KEY = "akis-budget-tracker";
const ASSETS_STORAGE_KEY = "akis-budget-assets";
const BES_STORAGE_KEY = "akis-budget-bes";
const MARKET_STORAGE_KEY = "akis-budget-market-prices";
const PAYMENT_ACCOUNTS_STORAGE_KEY = "akis-budget-payment-accounts";
const CATEGORY_STORAGE_KEY = "akis-budget-categories";
const LAST_USERNAME_KEY = "akis-budget-last-username";
const THEME_STORAGE_KEY = "akis-budget-theme";
const UI_SETTINGS_STORAGE_KEY = "akis-budget-ui-settings";
const HOME_SUMMARY_FILTER_STORAGE_KEY = "akis-budget-home-summary-filter";
const CARD_REMINDER_SETTINGS_STORAGE_KEY = "akis-budget-card-reminder-settings";
const CARD_REMINDER_STATE_STORAGE_KEY = "akis-budget-card-reminder-state";
const DELETED_TRANSACTIONS_STORAGE_KEY = "akis-budget-deleted-transactions";
const DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY = "akis-budget-deleted-transaction-signatures";
const DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-transfer-tombstones";

const DEFAULT_CATEGORIES = {
  income: ["Maaş", "Serbest İş", "Yatırım", "Hediye", "Promosyon", "Harçlık", "Borç Ödeme", "Diğer"],
  expense: [
    "Ev",
    "Market",
    "Mutfak",
    "Kıyafet",
    "Online Alışveriş",
    "Borç Alımı",
    "Eşya",
    "Akaryakıt",
    "Ulaşım",
    "Fatura",
    "Sosyal",
    "Sağlık",
    "Yatırım",
    "Diğer",
  ],
  transfer: ["Transfer", "Kart Ödemesi", "Hesap Aktarımı", "Diğer"],
};

const DEFAULT_UI_SETTINGS = {
  theme: "light",
  fontFamily: "manrope",
  fontWeight: "regular",
  fontSize: 16,
};
const DEFAULT_CARD_REMINDER_SETTINGS = {
  enabled: false,
};
const CARD_REMINDER_START_DAYS = 5;
const CARD_REMINDER_CHECK_INTERVAL_MS = 10 * 60 * 1000;
const CARD_REMINDER_SLOTS = ["09:30", "14:30", "19:30"];

const FONT_FAMILY_MAP = {
  manrope: "\"Manrope\", sans-serif",
  grotesk: "\"Space Grotesk\", \"Manrope\", sans-serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  arial: "Arial, Helvetica, sans-serif",
  calibri: "Calibri, Candara, \"Segoe UI\", sans-serif",
  times: "\"Times New Roman\", Times, serif",
};

const FONT_WEIGHT_MAP = {
  regular: { base: 400, strong: 700 },
  medium: { base: 500, strong: 700 },
  semibold: { base: 600, strong: 800 },
  bold: { base: 700, strong: 900 },
};

const USERNAME_EMAIL_DOMAIN = "gelirgidertakip.local";
const PDFJS_VERSION = "5.4.624";
const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
const BANK_OCR_TIMEOUT_MS = 30000;
const TRANSACTIONS_PER_PAGE = 20;
const TROY_OUNCE_GRAMS = 31.1034768;
const BANK_OCR_BALANCE_KEYWORDS = [
  "bakiye",
  "kalan bakiye",
  "islem sonu bakiye",
  "kullanilabilir bakiye",
  "donem ici",
  "donem borcu",
  "kart limiti",
  "hesap sayisi",
  "limit",
  "balance",
];
const BANK_OCR_IGNORE_KEYWORDS = [
  "hesap hareketleri",
  "kart hareketleri",
  "gecmis",
  "gelecek",
  "hepsi",
  "son 1 ay",
  "son 7 gun",
  "filtre",
  "indir",
  "ana sayfa",
  "hesap ve kart",
  "basvurular",
  "islemler",
  "durumum",
  "kullanilabilir",
  "toplam",
];
const BANK_OCR_ROW_KEYWORDS = [
  "alisveris",
  "aidat",
  "apartman",
  "atm",
  "bsmv",
  "cekme",
  "dekont",
  "diger",
  "eft",
  "fast",
  "faiz",
  "gelen",
  "giden",
  "gond",
  "gonderen",
  "harcama",
  "havale",
  "iade",
  "kart",
  "kkdf",
  "komisyon",
  "kazandiran",
  "kurum",
  "maas",
  "mesaj",
  "mevduat",
  "nakit",
  "odeme",
  "para",
  "pos",
  "referans",
  "stopaj",
  "tahsilat",
  "transfer",
  "ucret",
  "vadeli",
  "virman",
];
const BANK_OCR_AMOUNT_KEYWORDS = [
  "tutar",
  "islem tutari",
  "harcama tutari",
  "cekilen",
  "yatirilan",
  "borc",
  "alacak",
  "odeme",
  "tahsilat",
];

const assetDefinitions = {
  TRY: { label: "Türk Lirası", unit: "TL" },
  USD: { label: "Dolar", unit: "USD" },
  EUR: { label: "Euro", unit: "EUR" },
  GBP: { label: "Sterlin", unit: "GBP" },
  TR_GA: { label: "Gram Altın (Türkiye)", unit: "gr" },
  TR_HAS: { label: "Has Altın", unit: "gr", priceFrom: "TR_GA", multiplier: 0.995 },
  TR_GA_995: { label: "995 Gram Altın", unit: "gr", priceFrom: "TR_HAS" },
  TR_GA_025: { label: "0.25 Gram Altın", unit: "adet", priceFrom: "TR_GA", multiplier: 0.25 },
  TR_GA_050: { label: "0.50 Gram Altın", unit: "adet", priceFrom: "TR_GA", multiplier: 0.5 },
  TR_KG: { label: "Külçe Altın (1 kg)", unit: "kg", priceFrom: "TR_GA", multiplier: 1000 },
  TR_GAG: { label: "Gram Gümüş (Türkiye)", unit: "gr" },
  TR_C: { label: "Çeyrek Altın", unit: "adet" },
  TR_C_NEW: { label: "Yeni Çeyrek Altın", unit: "adet", priceFrom: "TR_C" },
  TR_C_OLD: { label: "Eski Çeyrek Altın", unit: "adet", priceFrom: "TR_C", multiplier: 0.992 },
  TR_Y: { label: "Yarım Altın", unit: "adet" },
  TR_Y_NEW: { label: "Yeni Yarım Altın", unit: "adet", priceFrom: "TR_Y" },
  TR_Y_OLD: { label: "Eski Yarım Altın", unit: "adet", priceFrom: "TR_Y", multiplier: 0.985 },
  TR_T: { label: "Tam Altın", unit: "adet" },
  TR_T_NEW: { label: "Yeni Tam Altın", unit: "adet", priceFrom: "TR_T" },
  TR_T_OLD: { label: "Eski Tam Altın", unit: "adet", priceFrom: "TR_T", multiplier: 0.986 },
  TR_CMR: { label: "Cumhuriyet Altını", unit: "adet" },
  TR_CMR_OLD: { label: "Eski Cumhuriyet Altını", unit: "adet", priceFrom: "TR_CMR", multiplier: 0.99 },
  TR_ATA: { label: "Ata Altın", unit: "adet" },
  TR_ATA_NEW: { label: "Yeni Ata Altın", unit: "adet", priceFrom: "TR_ATA" },
  TR_ATA_OLD: { label: "Eski Ata Altın", unit: "adet", priceFrom: "TR_ATA", multiplier: 0.993 },
  TR_IKB: { label: "İkibuçuk Altın", unit: "adet" },
  TR_BSL: { label: "Beşli Altın", unit: "adet" },
  TR_GR: { label: "Gremse Altın (Gramese)", unit: "adet" },
  TR_GR_NEW: { label: "Yeni Gremse Altın (Gramese)", unit: "adet", priceFrom: "TR_GR" },
  TR_GR_OLD: { label: "Eski Gremse Altın (Gramese)", unit: "adet", priceFrom: "TR_GR", multiplier: 0.985 },
  TR_RA: { label: "Reşat Altın", unit: "adet" },
  TR_RA_NEW: { label: "Yeni Reşat Altın", unit: "adet", priceFrom: "TR_RA" },
  TR_RA_OLD: { label: "Eski Reşat Altın", unit: "adet", priceFrom: "TR_RA", multiplier: 0.99 },
  TR_HA: { label: "Hamit Altın", unit: "adet" },
  TR_HA_NEW: { label: "Yeni Hamit Altın", unit: "adet", priceFrom: "TR_HA" },
  TR_HA_OLD: { label: "Eski Hamit Altın", unit: "adet", priceFrom: "TR_HA", multiplier: 0.99 },
  TR_22: { label: "22 Ayar Bilezik", unit: "gr" },
  TR_18: { label: "18 Ayar Altın", unit: "gr" },
  TR_14: { label: "14 Ayar Altın", unit: "gr" },
  XAU_GRAM: { label: "Gram Altın", unit: "gr" },
  XAG_GRAM: { label: "Gram Gümüş", unit: "gr" },
  XPT_GRAM: { label: "Gram Platin", unit: "gr" },
  BTC: { label: "Bitcoin", unit: "BTC" },
  ETH: { label: "Ethereum", unit: "ETH" },
};

const HOME_WEALTH_ASSET_COLORS = [
  "#17805f",
  "#1d9bf0",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#10b981",
  "#f97316",
  "#06b6d4",
  "#84cc16",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

const TURKEY_TIME_ZONE = "Europe/Istanbul";

function getTurkeyDateTimeParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("tr-TR", {
    timeZone: TURKEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const mapped = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const hour = mapped.hour === "24" ? "00" : mapped.hour;

  return {
    year: mapped.year,
    month: mapped.month,
    day: mapped.day,
    hour,
    minute: mapped.minute,
    second: mapped.second,
  };
}

function getTurkeyTodayISO(date = new Date()) {
  const parts = getTurkeyDateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getTurkeyNowTime(date = new Date()) {
  const parts = getTurkeyDateTimeParts(date);
  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

function getTurkeyNowDateTime(date = new Date()) {
  return `${getTurkeyTodayISO(date)}T${getTurkeyNowTime(date)}+03:00`;
}

const paymentMethodLabels = {
  cash: "Nakit",
  credit_card: "Kredi Kartı",
  bank_account: "Banka Hesabı / Kartı",
  transfer: "Havale / EFT",
  other: "Diğer",
};

const paymentAccountTypeLabels = {
  cash: "Nakit Cüzdan",
  bank_account: "Banka Hesabı / Banka Kartı",
  credit_card: "Kredi Kartı",
};

const defaultPaymentCardColors = {
  cash: "#17805f",
  bank_account: "#0f4c81",
  credit_card: "#173f5f",
};

const paymentMethodAccountTypes = {
  cash: ["cash"],
  credit_card: ["credit_card"],
  bank_account: ["bank_account"],
  transfer: ["bank_account"],
  other: ["cash", "bank_account", "credit_card"],
};

const viewMeta = {
  homeView: {
    kicker: "Ana Sayfa",
    title: "Finans durumun",
    subtitle: "Güncel bakiye, varlıklar ve BES birikimini tek ekranda izle.",
  },
  entryView: {
    kicker: "Yeni Kayıt",
    title: "Gelir veya gider ekle",
    subtitle: "Tek işlem ekleyebilir veya banka hareketlerini içe aktarabilirsin.",
  },
  assetsView: {
    kicker: "Varlıklarım",
    title: "Varlıklarım",
    subtitle: "Döviz, altın, kripto ve nakit varlıklarının güncel TL değerini izle.",
  },
  cardsView: {
    kicker: "Kartlar / Hesaplar",
    title: "Kart ve hesap yönetimi",
    subtitle: "Nakit, banka hesabı ve kredi kartlarını tanımla; kart borçlarını takip et.",
  },
  besView: {
    kicker: "BES",
    title: "BES bilgileri",
    subtitle: "BES birikimi, devlet katkısı, fon getirisi ve sözleşme bilgilerini takip et.",
  },
  summaryView: {
    kicker: "Özet",
    title: "Gelir, gider ve tasarruf",
    subtitle: "Seçili aya göre toplamları ve kategori dağılımını izle.",
  },
  historyView: {
    kicker: "Hareketler",
    title: "Kayıtlar",
    subtitle: "Kayıtlarını yıl, ay, gün, işlem tipi ve arama ile filtrele.",
  },
  settingsView: {
    kicker: "Ayarlar",
    title: "Görünüm ve yazı ayarları",
    subtitle: "Tema, yazı tipi, kalınlık ve boyut ayarlarını kişiselleştir.",
  },
  userView: {
    kicker: "Kullanıcı İşlemleri",
    title: "Profil bilgileri",
    subtitle: "Kullanıcı adını ve parolanı güvenli şekilde güncelle.",
  },
};

const form = document.getElementById("entryForm");
const assetForm = document.getElementById("assetForm");
const assetType = document.getElementById("assetType");
const assetLabel = document.getElementById("assetLabel");
const assetAmount = document.getElementById("assetAmount");
const refreshPricesButton = document.getElementById("refreshPricesButton");
const marketStatus = document.getElementById("marketStatus");
const assetsTotal = document.getElementById("assetsTotal");
const marketUpdatedAt = document.getElementById("marketUpdatedAt");
const assetCount = document.getElementById("assetCount");
const assetList = document.getElementById("assetList");
const openPaymentAccountModalButton = document.getElementById("openPaymentAccountModalButton");
const paymentAccountModal = document.getElementById("paymentAccountModal");
const paymentAccountModalTitle = document.getElementById("paymentAccountModalTitle");
const paymentAccountModalSubtitle = document.getElementById("paymentAccountModalSubtitle");
const closePaymentAccountModalButton = document.getElementById("closePaymentAccountModalButton");
const paymentAccountForm = document.getElementById("paymentAccountForm");
const paymentAccountType = document.getElementById("paymentAccountType");
const paymentAccountName = document.getElementById("paymentAccountName");
const paymentAccountBank = document.getElementById("paymentAccountBank");
const paymentAccountColor = document.getElementById("paymentAccountColor");
const paymentAccountLast4 = document.getElementById("paymentAccountLast4");
const paymentAccountExpiry = document.getElementById("paymentAccountExpiry");
const paymentAccountStatementDay = document.getElementById("paymentAccountStatementDay");
const paymentAccountDueDay = document.getElementById("paymentAccountDueDay");
const paymentAccountLimit = document.getElementById("paymentAccountLimit");
const paymentAccountBalance = document.getElementById("paymentAccountBalance");
const paymentAccountNote = document.getElementById("paymentAccountNote");
const paymentAccountSubmitButton = document.getElementById("paymentAccountSubmitButton");
const paymentAccountStatus = document.getElementById("paymentAccountStatus");
const paymentAccountModalStatus = document.getElementById("paymentAccountModalStatus");
const paymentAccountList = document.getElementById("paymentAccountList");
const confirmPaymentAccountDeleteModal = document.getElementById("confirmPaymentAccountDeleteModal");
const confirmPaymentAccountDeleteTitle = document.getElementById("confirmPaymentAccountDeleteTitle");
const confirmPaymentAccountDeleteText = document.getElementById("confirmPaymentAccountDeleteText");
const confirmDeletePaymentAccountButton = document.getElementById("confirmDeletePaymentAccountButton");
const cancelDeletePaymentAccountButton = document.getElementById("cancelDeletePaymentAccountButton");
const confirmPaymentAccountDeleteStatus = document.getElementById("confirmPaymentAccountDeleteStatus");
const cardDebtTotal = document.getElementById("cardDebtTotal");
const bankBalanceTotal = document.getElementById("bankBalanceTotal");
const paymentAccountCount = document.getElementById("paymentAccountCount");
const besForm = document.getElementById("besForm");
const besTotal = document.getElementById("besTotal");
const besStateTotal = document.getElementById("besStateTotal");
const besStateGainTotal = document.getElementById("besStateGainTotal");
const besGainTotal = document.getElementById("besGainTotal");
const besList = document.getElementById("besList");
const besStateGainInput = document.getElementById("besStateGain");
const besSubmitButton = document.getElementById("besSubmitButton");
const openBesModalButton = document.getElementById("openBesModalButton");
const besModal = document.getElementById("besModal");
const besModalTitle = document.getElementById("besModalTitle");
const besFormMount = document.getElementById("besFormMount");
const closeBesModalButton = document.getElementById("closeBesModalButton");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const paymentMethodInput = document.getElementById("paymentMethod");
const paymentAccountSelect = document.getElementById("paymentAccount");
const transferAccountLabel = document.getElementById("transferAccountLabel");
const transferAccountSelect = document.getElementById("transferAccount");
const transferFeeLabel = document.getElementById("transferFeeLabel");
const transferFeeInput = document.getElementById("transferFee");
const entryFormStatus = document.getElementById("entryFormStatus");
const dateInput = document.getElementById("date");
const homeSummaryStartDate = document.getElementById("homeSummaryStartDate");
const homeSummaryEndDate = document.getElementById("homeSummaryEndDate");
const applyHomeSummaryFilterButton = document.getElementById("applyHomeSummaryFilterButton");
const clearHomeSummaryFilterButton = document.getElementById("clearHomeSummaryFilterButton");
const homeSummaryFilterStatus = document.getElementById("homeSummaryFilterStatus");
const transactionList = document.getElementById("transactionList");
const transactionTemplate = document.getElementById("transactionTemplate");
const filterType = document.getElementById("filterType");
const filterPaymentMethod = document.getElementById("filterPaymentMethod");
const filterPaymentAccount = document.getElementById("filterPaymentAccount");
const paymentAccountTypeFilter = document.getElementById("paymentAccountTypeFilter");
const searchInput = document.getElementById("searchInput");
const historySearchButton = document.getElementById("historySearchButton");
const historyStartDate = document.getElementById("historyStartDate");
const historyEndDate = document.getElementById("historyEndDate");
const clearHistoryRangeButton = document.getElementById("clearHistoryRangeButton");
const exportPdfButton = document.getElementById("exportPdfButton");
const exportExcelButton = document.getElementById("exportExcelButton");
const exportButton = document.getElementById("exportButton");
const importFile = document.getElementById("importFile");
const storageStatus = document.getElementById("storageStatus");
const syncPayload = document.getElementById("syncPayload");
const appSplashScreen = document.getElementById("appSplashScreen");
const generateSyncButton = document.getElementById("generateSyncButton");
const copySyncButton = document.getElementById("copySyncButton");
const importSyncButton = document.getElementById("importSyncButton");
const syncStatus = document.getElementById("syncStatus");
const bankImportText = document.getElementById("bankImportText");
const bankImportFile = document.getElementById("bankImportFile");
const bankImportAddButton = document.getElementById("bankImportAddButton");
const bankImportLocalButton = document.getElementById("bankImportLocalButton");
const bankImportCancelButton = document.getElementById("bankImportCancelButton");
const bankImportAccountSelect = document.getElementById("bankImportAccount");
const bankImportTransferAccountSelect = document.getElementById("bankImportTransferAccount");
const previewBankImportButton = document.getElementById("previewBankImportButton");
const confirmBankImportButton = document.getElementById("confirmBankImportButton");
const clearBankImportButton = document.getElementById("clearBankImportButton");
const bankImportStatus = document.getElementById("bankImportStatus");
const bankImportPreview = document.getElementById("bankImportPreview");
const bankImportPreviewModal = document.getElementById("bankImportPreviewModal");
const bankImportPreviewModalSummary = document.getElementById("bankImportPreviewModalSummary");
const bankImportPreviewAccount = document.getElementById("bankImportPreviewAccount");
const bankImportPreviewTransferAccount = document.getElementById("bankImportPreviewTransferAccount");
const bankImportPreviewList = document.getElementById("bankImportPreviewList");
const bankImportPreviewStatus = document.getElementById("bankImportPreviewStatus");
const bankImportSelectAllButton = document.getElementById("bankImportSelectAllButton");
const bankImportClearSelectionButton = document.getElementById("bankImportClearSelectionButton");
const bankImportPreviewConfirmButton = document.getElementById("bankImportPreviewConfirmButton");
const bankImportPreviewCloseButton = document.getElementById("bankImportPreviewCloseButton");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const createAccountButton = document.getElementById("createAccountButton");
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const signupForm = document.getElementById("signupForm");
const signupEmail = document.getElementById("signupEmail");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
const cancelSignupButton = document.getElementById("cancelSignupButton");
const signupStatus = document.getElementById("signupStatus");
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetEmail = document.getElementById("resetEmail");
const cancelResetButton = document.getElementById("cancelResetButton");
const resetStatus = document.getElementById("resetStatus");
const logoutButton = document.getElementById("logoutButton");
const footerLogoutButton = document.getElementById("footerLogoutButton");
const authUserBadge = document.getElementById("authUserBadge");
const profileButton = document.getElementById("profileButton");
const profileModal = document.getElementById("profileModal");
const profileForm = document.getElementById("profileForm");
const profileUsername = document.getElementById("profileUsername");
const profileCurrentPassword = document.getElementById("profileCurrentPassword");
const profilePassword = document.getElementById("profilePassword");
const profileStatus = document.getElementById("profileStatus");
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const settingsFontFamily = document.getElementById("settingsFontFamily");
const settingsFontWeight = document.getElementById("settingsFontWeight");
const settingsFontSize = document.getElementById("settingsFontSize");
const settingsFontSizeValue = document.getElementById("settingsFontSizeValue");
const increaseFontButton = document.getElementById("increaseFontButton");
const decreaseFontButton = document.getElementById("decreaseFontButton");
const resetAppearanceButton = document.getElementById("resetAppearanceButton");
const cardReminderPermissionButton = document.getElementById("cardReminderPermissionButton");
const cardReminderStatus = document.getElementById("cardReminderStatus");
const genericConfirmModal = document.getElementById("genericConfirmModal");
const genericConfirmTitle = document.getElementById("genericConfirmTitle");
const genericConfirmText = document.getElementById("genericConfirmText");
const genericConfirmButton = document.getElementById("genericConfirmButton");
const genericConfirmCancelButton = document.getElementById("genericConfirmCancelButton");
const closeProfileButton = document.getElementById("closeProfileButton");
const deleteUserButton = document.getElementById("deleteUserButton");
const deleteUserStatus = document.getElementById("deleteUserStatus");
const deleteAccountModal = document.getElementById("deleteAccountModal");
const deleteAccountForm = document.getElementById("deleteAccountForm");
const deleteUserPassword = document.getElementById("deleteUserPassword");
const deleteUserPasswordConfirm = document.getElementById("deleteUserPasswordConfirm");
const closeDeleteAccountButton = document.getElementById("closeDeleteAccountButton");
const deleteAccountStatus = document.getElementById("deleteAccountStatus");
const confirmDeleteAccountModal = document.getElementById("confirmDeleteAccountModal");
const confirmDeleteAccountButton = document.getElementById("confirmDeleteAccountButton");
const cancelConfirmDeleteButton = document.getElementById("cancelConfirmDeleteButton");
const confirmDeleteAccountStatus = document.getElementById("confirmDeleteAccountStatus");
const transactionEditModal = document.getElementById("transactionEditModal");
const transactionEditForm = document.getElementById("transactionEditForm");
const transactionTypeInput = document.getElementById("transactionTypeInput");
const transactionTitleInput = document.getElementById("transactionTitleInput");
const transactionAmountInput = document.getElementById("transactionAmountInput");
const transactionCategoryInput = document.getElementById("transactionCategoryInput");
const transactionDateInput = document.getElementById("transactionDateInput");
const transactionTimeInput = document.getElementById("transactionTimeInput");
const transactionNoteInput = document.getElementById("transactionNoteInput");
const transactionPaymentMethodInput = document.getElementById("transactionPaymentMethodInput");
const transactionPaymentAccountInput = document.getElementById("transactionPaymentAccountInput");
const transactionTransferAccountLabel = document.getElementById("transactionTransferAccountLabel");
const transactionTransferAccountInput = document.getElementById("transactionTransferAccountInput");
const transactionTransferFeeLabel = document.getElementById("transactionTransferFeeLabel");
const transactionTransferFeeInput = document.getElementById("transactionTransferFeeInput");
const transactionEditStatus = document.getElementById("transactionEditStatus");
const closeTransactionEditButton = document.getElementById("closeTransactionEditButton");
const openEntryModalButton = document.getElementById("openEntryModalButton");
const entryModal = document.getElementById("entryModal");
const entryFormMount = document.getElementById("entryFormMount");
const closeEntryModalButton = document.getElementById("closeEntryModalButton");
const openCategoryAddModalButton = document.getElementById("openCategoryAddModalButton");
const openCategoryManageModalButton = document.getElementById("openCategoryManageModalButton");
const categoryAddModal = document.getElementById("categoryAddModal");
const categoryAddForm = document.getElementById("categoryAddForm");
const categoryAddType = document.getElementById("categoryAddType");
const categoryAddName = document.getElementById("categoryAddName");
const categoryAddStatus = document.getElementById("categoryAddStatus");
const closeCategoryAddModalButton = document.getElementById("closeCategoryAddModalButton");
const categoryManageModal = document.getElementById("categoryManageModal");
const categoryManageType = document.getElementById("categoryManageType");
const categoryManageList = document.getElementById("categoryManageList");
const categoryManageStatus = document.getElementById("categoryManageStatus");
const closeCategoryManageModalButton = document.getElementById("closeCategoryManageModalButton");
const paymentAccountPayModal = document.getElementById("paymentAccountPayModal");
const paymentAccountPayForm = document.getElementById("paymentAccountPayForm");
const paymentAccountPayTitle = document.getElementById("paymentAccountPayTitle");
const paymentAccountPaySource = document.getElementById("paymentAccountPaySource");
const paymentAccountPayAmount = document.getElementById("paymentAccountPayAmount");
const paymentAccountPayStatus = document.getElementById("paymentAccountPayStatus");
const closePaymentAccountPayButton = document.getElementById("closePaymentAccountPayButton");
const paymentAccountRecordsModal = document.getElementById("paymentAccountRecordsModal");
const paymentAccountRecordsTitle = document.getElementById("paymentAccountRecordsTitle");
const paymentAccountRecordsSummary = document.getElementById("paymentAccountRecordsSummary");
const paymentAccountRecordsList = document.getElementById("paymentAccountRecordsList");
const paymentAccountRecordsPeriodFilter = document.getElementById("paymentAccountRecordsPeriodFilter");
const refreshPaymentAccountFromRecordsButton = document.getElementById("refreshPaymentAccountFromRecordsButton");
const closePaymentAccountRecordsButton = document.getElementById("closePaymentAccountRecordsButton");
const cloudStatus = document.getElementById("cloudStatus");
const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const sidebar = document.getElementById("sidebar");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const topbarMenuButton = document.getElementById("topbarMenuButton");
const navItems = Array.from(document.querySelectorAll("[data-view-target]"));
const viewSections = Array.from(document.querySelectorAll("[data-view]"));
const pageKicker = document.getElementById("pageKicker");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const appUserEmail = document.getElementById("appUserEmail");
const overviewMonthLabel = document.getElementById("overviewMonthLabel");
const paginationControls = document.getElementById("paginationControls");

const homeBalance = document.getElementById("homeBalance");
const homeInsight = document.getElementById("homeInsight");
const homeAssetsTotal = document.getElementById("homeAssetsTotal");
const homeBesTotal = document.getElementById("homeBesTotal");
const homeSavingsTotal = document.getElementById("homeSavingsTotal");
const homeAssetList = document.getElementById("homeAssetList");
const homeBesList = document.getElementById("homeBesList");
const homeWealthChart = document.getElementById("homeWealthChart");
const homeWealthTotal = document.getElementById("homeWealthTotal");
const homeWealthLegend = document.getElementById("homeWealthLegend");
const heroBalance = document.getElementById("heroBalance");
const heroInsight = document.getElementById("heroInsight");
const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const monthlySavings = document.getElementById("monthlySavings");
const categoryBreakdown = document.getElementById("categoryBreakdown");

const sampleTransactions = [
  {
    id: crypto.randomUUID(),
    type: "income",
    title: "Nisan Maaşı",
    amount: 42000,
    category: "Maaş",
    date: getTurkeyTodayISO(),
    note: "Düzenli gelir",
  },
  {
    id: crypto.randomUUID(),
    type: "expense",
    title: "Haftalık Market",
    amount: 2350,
    category: "Market",
    date: getTurkeyTodayISO(),
    note: "Mutfak alışverişi",
  },
  {
    id: crypto.randomUUID(),
    type: "expense",
    title: "Elektrik Faturası",
    amount: 870,
    category: "Fatura",
    date: getTurkeyTodayISO(),
    note: "",
  },
];

let firebaseAuth = null;
let firebaseDb = null;
let currentUser = null;
let cloudUnsubscribe = null;
let profileUnsubscribe = null;
let cloudWriteQueue = Promise.resolve();
let cloudTransactionsSyncVersion = 0;
let cloudProfileSyncVersion = 0;
let firestorePersistenceEnabled = false;
let activeView = "homeView";
let selectedYear = "all";
let selectedMonth = "all";
let selectedDay = "all";
let currentHistoryPage = 1;
let currentHistorySearch = "";
let editingAssetId = null;
let editingTransactionId = "";
let editingBesId = "";
let editingPaymentAccountId = "";
let payingPaymentAccountId = "";
let deletingPaymentAccountId = "";
let viewingPaymentAccountRecordsId = "";
let viewingPaymentAccountRecordsPeriod = "";
let pendingDeletePassword = "";
let pendingGenericConfirmAction = null;
let uiSettings = loadUiSettings();
let cardReminderSettings = loadCardReminderSettings();
let cardReminderState = loadCardReminderState();
let cardReminderTimer = null;
let homeSummaryFilter = loadHomeSummaryFilter();
let deletedTransactionIds = loadDeletedTransactionIds();
let deletedTransactionSignatures = loadDeletedTransactionSignatures();
let deletedTransferTombstones = loadDeletedTransferTombstones();
let transactions = loadTransactions();
let assets = loadAssets();
let besAccounts = loadBesAccounts();
let homeAssetPage = 1;
let homeBesPage = 1;
const HOME_LIST_PAGE_SIZE = 5;
let paymentAccounts = loadPaymentAccounts();
let transactionCategories = loadTransactionCategories();
let marketData = loadMarketData();
let pendingBankImports = [];
let pendingBankFiles = [];
let pdfJsModule = null;
let tesseractLoadPromise = null;
let startupSplashFinished = false;

preventAppZoomGestures();
init();


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
    return saved === "dark" ? "dark" : "light";
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
  const normalizedTheme = raw.theme === "dark" ? "dark" : "light";
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
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  uiSettings = normalizeUiSettings({ ...uiSettings, theme: normalizedTheme });
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
  uiSettings = { ...DEFAULT_UI_SETTINGS };
  applyTypographySettings(uiSettings);
}

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
          markTransactionDeleted(transactionId, transaction);
        } else {
          markTransactionDeleted(transactionId);
        }
      });

      transactions = transactions.filter((transaction) => !idsToDelete.has(transaction.id) && !isTransactionDeleted(transaction));
      if (changedPaymentAccount) {
        persistPaymentAccounts();
      }
      persistTransactions({ replaceCloud: true });
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
  const filterPanel = document.querySelector("#entryView .home-summary-filter-standalone");
  const summaryStack = document.querySelector("#summaryView .summary-stack");
  const statsGrid = document.querySelector("#summaryView .stats-grid");

  if (!filterPanel || !summaryStack || !statsGrid) {
    return;
  }

  filterPanel.setAttribute("aria-label", "Gelir gider ekle tarih filtresi");
  filterPanel.classList.add("entry-filter-panel");

  let summaryPanel = document.getElementById("summaryHomeSummaryFilterPanel");
  if (!summaryPanel) {
    summaryPanel = filterPanel.cloneNode(true);
    summaryPanel.id = "summaryHomeSummaryFilterPanel";
    summaryPanel.setAttribute("aria-label", "Özet ve tasarruf tarih filtresi");
    summaryPanel.classList.remove("entry-filter-panel");
    summaryPanel.classList.add("summary-filter-panel");

    const status = summaryPanel.querySelector("#homeSummaryFilterStatus");
    const start = summaryPanel.querySelector("#homeSummaryStartDate");
    const end = summaryPanel.querySelector("#homeSummaryEndDate");
    const apply = summaryPanel.querySelector("#applyHomeSummaryFilterButton");
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

  const entryKicker = filterPanel.querySelector(".panel-kicker");
  const entryNote = filterPanel.querySelector(".panel-note");
  const entryApply = filterPanel.querySelector("#applyHomeSummaryFilterButton");
  if (entryKicker) entryKicker.textContent = "Filtre";
  if (entryNote) entryNote.textContent = "Gelir / gider eklerken de aynı tarih aralığı kullanılır.";
  if (entryApply) entryApply.textContent = "Filtreyi Uygula";

  const summaryKicker = summaryPanel.querySelector(".panel-kicker");
  const summaryTitle = summaryPanel.querySelector("h2");
  const summaryNote = summaryPanel.querySelector(".panel-note");
  if (summaryKicker) summaryKicker.textContent = "Filtre";
  if (summaryTitle) summaryTitle.textContent = "Gelir / gider tarih filtresi";
  if (summaryNote) summaryNote.textContent = "Özet ve tasarruf için tarih aralığı seç.";
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

function init() {
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
  syncBankImportAccountSelects();
  render();
  initHistoryCustomFilterSelects();
  registerServiceWorker();
  initCardReminderNotifications();
  if (!window.__akisWealthFitBound) {
    window.addEventListener("resize", fitHomeWealthTotalText);
    window.__akisWealthFitBound = true;
  }

  typeInput.addEventListener("change", () => {
    updateCategoryOptions(typeInput.value);
    syncEntryTransferVisibility();
  });
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
  paymentAccountRecordsPeriodFilter?.addEventListener("change", () => {
    viewingPaymentAccountRecordsPeriod = paymentAccountRecordsPeriodFilter.value || "";
    const account = paymentAccounts.find((item) => item.id === viewingPaymentAccountRecordsId);
    if (account) {
      openPaymentAccountRecordsModal(account, { preservePeriod: true });
    }
  });
  initCloud();
  refreshMarketPrices({ silent: true });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const now = getTurkeyNowDateTime();
    const entryType = formData.get("type") === "transfer" ? "transfer" : formData.get("type");
    const entry = {
      id: crypto.randomUUID(),
      type: entryType,
      title: String(formData.get("title")).trim(),
      amount: Number(formData.get("amount")),
      category: entryType === "transfer" ? (formData.get("category") || "Transfer") : formData.get("category"),
      paymentMethod: entryType === "transfer" ? "transfer" : normalizePaymentMethod(formData.get("paymentMethod")),
      paymentAccountId: String(formData.get("paymentAccount") || ""),
      transferAccountId: entryType === "transfer" ? String(formData.get("transferAccount") || "") : "",
      transferFee:
        entryType === "transfer" ? Math.max(0, roundMoney(readSignedNumber(formData.get("transferFee"), 0))) : 0,
      date: formData.get("date"),
      note: String(formData.get("note")).trim(),
      transactionAt: buildTransactionDateTime(formData.get("date"), getTurkeyNowTime()),
      createdAt: now,
    };

    if (!entry.title || !entry.amount || !entry.date) {
      return;
    }

    if (!validateTransactionPayment(entry, entryFormStatus)) {
      return;
    }

    const changedPaymentAccount = applyTransactionPaymentEffect(entry, 1);
    if (changedPaymentAccount) {
      persistPaymentAccounts();
    }

    transactions = [entry, ...transactions].sort(compareTransactionsNewestFirst);
    persistTransactions();
    form.reset();
    typeInput.value = "income";
    updateCategoryOptions("income");
    paymentMethodInput.value = "cash";
    paymentMethodInput.disabled = false;
    updatePaymentAccountSelect(paymentAccountSelect, "cash");
    if (transferFeeInput) transferFeeInput.value = "";
    updateEntryTransferAccountSelect("");
    syncEntryTransferVisibility();
    if (entryFormStatus) {
      entryFormStatus.textContent = "";
    }
    dateInput.value = getTurkeyTodayISO();
    render();
    closeEntryModal();
  });
}

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


function standardizeModalLayouts() {
  document.querySelectorAll(".modal-backdrop > .modal-card").forEach((card) => {
    if (!card || card.dataset.modalLayoutStandardized === "true") {
      return;
    }

    const footer =
      card.querySelector(":scope > .auth-actions, :scope > .modal-actions") ||
      card.querySelector(":scope > form > .auth-actions, :scope > form > .modal-actions") ||
      card.querySelector(":scope > .profile-form > .auth-actions, :scope > .profile-form > .modal-actions");

    if (!footer) {
      return;
    }

    const sourceForm = footer.closest("form");

    if (sourceForm?.id) {
      footer.querySelectorAll("button").forEach((button) => {
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

function loadTransactions() {
  return mergeTransactions(loadJsonState(STORAGE_KEY, []));
}

function loadDeletedTransactionIds() {
  const values = loadJsonState(DELETED_TRANSACTIONS_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map((item) => String(item || "")).filter(Boolean));
}

function loadDeletedTransactionSignatures() {
  const values = loadJsonState(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map((item) => String(item || "")).filter(Boolean));
}

function normalizeDeletedTransferTombstone(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const date = String(item.date || "");
  const amount = Number(item.amount || 0).toFixed(2);
  const sourceAccountId = String(item.sourceAccountId || "");
  const targetAccountId = String(item.targetAccountId || "");

  if (!date || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !sourceAccountId || !targetAccountId) {
    return null;
  }

  return {
    date,
    minute: String(item.minute || "").slice(0, 5),
    amount,
    sourceAccountId,
    targetAccountId,
  };
}

function loadDeletedTransferTombstones() {
  const values = loadJsonState(DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeDeletedTransferTombstone).filter(Boolean);
}

function persistDeletedTransactionIds() {
  localStorage.setItem(getStorageKey(DELETED_TRANSACTIONS_STORAGE_KEY), JSON.stringify([...deletedTransactionIds]));
}

function persistDeletedTransactionSignatures() {
  localStorage.setItem(getStorageKey(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY), JSON.stringify([...deletedTransactionSignatures]));
}

function persistDeletedTransferTombstones() {
  const limited = deletedTransferTombstones.slice(-1000);
  deletedTransferTombstones = limited;
  localStorage.setItem(getStorageKey(DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY), JSON.stringify(limited));
}

function getTransferDeletionTombstone(transaction) {
  if (!transaction || transaction.type !== "transfer") {
    return null;
  }

  const date = String(transaction.date || "");
  const amount = Number(transaction.amount || 0).toFixed(2);
  const sourceAccountId = String(transaction.paymentAccountId || "");
  const targetAccountId = String(transaction.transferAccountId || "");

  if (!date || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !sourceAccountId || !targetAccountId) {
    return null;
  }

  return {
    date,
    minute: getComparableTransactionMinute(transaction),
    amount,
    sourceAccountId,
    targetAccountId,
  };
}

function addDeletedTransactionSignature(transaction) {
  if (!transaction || !isValidTransaction(transaction)) {
    return;
  }

  const signature = getTransactionSignature(transaction);
  if (signature) {
    deletedTransactionSignatures.add(signature);
    persistDeletedTransactionSignatures();
  }
}

function addDeletedTransferTombstone(transaction) {
  const tombstone = getTransferDeletionTombstone(transaction);
  if (!tombstone) {
    return;
  }

  const key = JSON.stringify(tombstone);
  const exists = deletedTransferTombstones.some((item) => JSON.stringify(item) === key);
  if (!exists) {
    deletedTransferTombstones.push(tombstone);
    persistDeletedTransferTombstones();
  }
}

function markTransactionDeleted(transactionId, transaction = null) {
  const id = String(transactionId || transaction?.id || "");
  if (id) {
    deletedTransactionIds.add(id);
    persistDeletedTransactionIds();
  }

  if (transaction) {
    addDeletedTransactionSignature(transaction);
    addDeletedTransferTombstone(transaction);
  }
}

function haveCompatibleTombstoneTimes(tombstoneMinute, transactionMinute) {
  return !tombstoneMinute || !transactionMinute || tombstoneMinute === transactionMinute;
}

function isTransactionCoveredByDeletedTransferTombstone(transaction) {
  if (!transaction || !deletedTransferTombstones.length) {
    return false;
  }

  const transactionAmount = Number(transaction.amount || 0).toFixed(2);
  const transactionDate = String(transaction.date || "");
  const transactionMinute = getComparableTransactionMinute(transaction);
  const transactionPaymentAccountId = String(transaction.paymentAccountId || "");
  const transactionTransferAccountId = String(transaction.transferAccountId || "");

  return deletedTransferTombstones.some((tombstone) => {
    if (
      tombstone.date !== transactionDate ||
      tombstone.amount !== transactionAmount ||
      !haveCompatibleTombstoneTimes(tombstone.minute, transactionMinute)
    ) {
      return false;
    }

    if (transaction.type === "transfer") {
      return (
        transactionPaymentAccountId === tombstone.sourceAccountId &&
        transactionTransferAccountId === tombstone.targetAccountId
      );
    }

    if (!isTransferLikeRecord(transaction)) {
      return false;
    }

    if (transaction.type === "expense") {
      return transactionPaymentAccountId === tombstone.sourceAccountId;
    }

    if (transaction.type === "income") {
      return transactionPaymentAccountId === tombstone.targetAccountId;
    }

    return false;
  });
}

function isTransactionDeleted(transactionOrId) {
  if (!transactionOrId || typeof transactionOrId !== "object") {
    return deletedTransactionIds.has(String(transactionOrId || ""));
  }

  const transaction = transactionOrId;
  const id = String(transaction.id || "");
  if (id && deletedTransactionIds.has(id)) {
    return true;
  }

  if (isValidTransaction(transaction) && deletedTransactionSignatures.has(getTransactionSignature(transaction))) {
    return true;
  }

  return isTransactionCoveredByDeletedTransferTombstone(transaction);
}

function loadAssets() {
  return loadJsonState(ASSETS_STORAGE_KEY, []);
}

function loadBesAccounts() {
  return loadJsonState(BES_STORAGE_KEY, []);
}

function loadPaymentAccounts() {
  return loadJsonState(PAYMENT_ACCOUNTS_STORAGE_KEY, []);
}

function cloneDefaultCategories() {
  return {
    income: [...DEFAULT_CATEGORIES.income],
    expense: [...DEFAULT_CATEGORIES.expense],
    transfer: [...DEFAULT_CATEGORIES.transfer],
  };
}

function normalizeCategoryState(state) {
  const fallback = cloneDefaultCategories();
  const source = state && typeof state === "object" ? state : fallback;
  const normalizeList = (list, fallbackList) => {
    const items = Array.isArray(list) ? list : fallbackList;
    const cleaned = items
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    const unique = [];
    const seen = new Set();
    cleaned.forEach((item) => {
      const key = item.toLocaleLowerCase("tr-TR");
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });
    return unique.length ? unique : [...fallbackList];
  };

  return {
    income: normalizeList(source.income, fallback.income),
    expense: normalizeList(source.expense, fallback.expense),
    transfer: normalizeList(source.transfer, fallback.transfer),
  };
}


function hasCategoryState(source) {
  return (
    source &&
    typeof source === "object" &&
    (Array.isArray(source.income) || Array.isArray(source.expense) || Array.isArray(source.transfer))
  );
}

function mergeCategoryStates(...states) {
  const candidates = states.filter(hasCategoryState);

  if (!candidates.length) {
    return cloneDefaultCategories();
  }

  const merged = { income: [], expense: [], transfer: [] };
  const seen = { income: new Set(), expense: new Set(), transfer: new Set() };
  const addCategory = (type, name) => {
    const value = String(name || "").trim();

    if (!value) {
      return;
    }

    const key = value.toLocaleLowerCase("tr-TR");
    if (seen[type].has(key)) {
      return;
    }

    seen[type].add(key);
    merged[type].push(value);
  };

  candidates.forEach((state) => {
    const normalized = normalizeCategoryState(state);
    ["income", "expense", "transfer"].forEach((type) => {
      (normalized[type] || []).forEach((category) => addCategory(type, category));
    });
  });

  return normalizeCategoryState(merged);
}

function getTransactionCategoriesFromRecords(source = transactions) {
  const recordCategories = { income: [], expense: [], transfer: [] };

  (Array.isArray(source) ? source : []).forEach((item) => {
    if (!item || !["income", "expense", "transfer"].includes(item.type)) {
      return;
    }

    const category = String(item.category || "").trim();
    if (category) {
      recordCategories[item.type].push(category);
    }
  });

  return recordCategories;
}

function readCloudTransactionCategories(source) {
  return hasCategoryState(source) ? normalizeCategoryState(source) : null;
}

function loadTransactionCategories() {
  return normalizeCategoryState(loadJsonState(CATEGORY_STORAGE_KEY, cloneDefaultCategories()));
}

function persistTransactionCategories(options = {}) {
  const { syncCloud = true } = options;
  localStorage.setItem(getStorageKey(CATEGORY_STORAGE_KEY), JSON.stringify(transactionCategories));
  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

function loadMarketData() {
  const fallback = { prices: { TRY: 1 }, updatedAt: "" };
  const stored = localStorage.getItem(MARKET_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed && parsed.prices ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function loadJsonState(baseKey, fallback) {
  const stored = localStorage.getItem(getStorageKey(baseKey));

  if (!stored) {
    localStorage.setItem(getStorageKey(baseKey), JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function getStorageKey(baseKey = STORAGE_KEY) {
  return currentUser ? `${baseKey}-${currentUser.uid}` : baseKey;
}

function persistTransactions(options = {}) {
  const { syncCloud = true, replaceCloud = false } = options;

  transactions = mergeTransactions(transactions);
  localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
  updateStorageStatus();

  if (syncCloud) {
    return syncTransactionsToCloud({ replace: replaceCloud });
  }

  return Promise.resolve();
}

function persistAssets(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(ASSETS_STORAGE_KEY), JSON.stringify(assets));

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

function persistBesAccounts(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(BES_STORAGE_KEY), JSON.stringify(besAccounts));

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

function persistPaymentAccounts(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(PAYMENT_ACCOUNTS_STORAGE_KEY), JSON.stringify(paymentAccounts));
  window.setTimeout(() => checkCardPaymentReminders(), 0);

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

function persistMarketData() {
  localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(marketData));
}

function updateCategoryOptions(type) {
  updateCategorySelect(categoryInput, type);
}

function updateCategorySelect(selectElement, type, selectedValue = "") {
  if (!selectElement) {
    return;
  }

  const options = transactionCategories[type] || transactionCategories.expense;
  const normalizedSelected = String(selectedValue || "");
  selectElement.innerHTML = "";

  options.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectElement.append(option);
  });

  if (normalizedSelected && !options.includes(normalizedSelected)) {
    const option = document.createElement("option");
    option.value = normalizedSelected;
    option.textContent = normalizedSelected;
    selectElement.prepend(option);
  }

  const hasSelectedOption = Array.from(selectElement.options).some(
    (option) => option.value === normalizedSelected
  );
  selectElement.value = hasSelectedOption ? normalizedSelected : options[0] || "";
}

function render() {
  renderView();
  renderStats();
  renderAssets();
  renderPaymentAccountFilterOptions();
  renderPaymentAccounts();
  renderBesAccounts();
  renderHome();
  renderCategoryBreakdown();
  renderTransactions();
  updateStorageStatus();
  updateCardReminderControls();
}

function renderStats() {
  const scopedTransactions = getSummaryScopedTransactions();
  const { income, expense, balance } = getTransactionTotals(scopedTransactions);

  heroBalance.textContent = currency.format(balance);
  heroInsight.textContent =
    balance >= 0
      ? "Seçili dönemde gelirlerin giderlerini karşılıyor."
      : "Seçili dönemde giderlerin gelirlerini aşıyor.";
  incomeTotal.textContent = currency.format(income);
  expenseTotal.textContent = currency.format(expense);
  monthlySavings.textContent = currency.format(balance);
  overviewMonthLabel.textContent = `${getSummaryScopeLabel()} gider dağılımı`;
}

function normalizeHomeSummaryFilter(raw = {}) {
  const start = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.start || "")) ? String(raw.start) : "";
  const end = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.end || "")) ? String(raw.end) : "";
  return { start, end };
}

function loadHomeSummaryFilter() {
  try {
    return normalizeHomeSummaryFilter(JSON.parse(localStorage.getItem(HOME_SUMMARY_FILTER_STORAGE_KEY) || "{}"));
  } catch {
    return { start: "", end: "" };
  }
}

function saveHomeSummaryFilter() {
  try {
    localStorage.setItem(HOME_SUMMARY_FILTER_STORAGE_KEY, JSON.stringify(normalizeHomeSummaryFilter(homeSummaryFilter)));
  } catch {
    // Filtre sadece bu cihazda tutulur.
  }
}

function isHomeSummaryFilterActive() {
  return Boolean(homeSummaryFilter.start || homeSummaryFilter.end);
}

function getHomeSummaryRange() {
  const start = homeSummaryFilter.start || "";
  const end = homeSummaryFilter.end || "";

  if (start && end && start > end) {
    return { from: end, to: start };
  }

  return { from: start, to: end };
}

function getHomeSummaryTransactions() {
  if (!isHomeSummaryFilterActive()) {
    return transactions;
  }

  const { from, to } = getHomeSummaryRange();

  return transactions.filter((item) => {
    const date = String(item.date || "").slice(0, 10);
    return (!from || date >= from) && (!to || date <= to);
  });
}

function getSummaryScopedTransactions() {
  return isHomeSummaryFilterActive() ? getHomeSummaryTransactions() : getDateFilteredTransactions();
}

function getSummaryScopeLabel() {
  return isHomeSummaryFilterActive() ? getHomeSummaryFilterLabel() : getDateFilterLabel();
}

function getHomeSummaryFilterLabel() {
  if (!isHomeSummaryFilterActive()) {
    return "Tüm kayıtlar";
  }

  const { from, to } = getHomeSummaryRange();
  const fromLabel = from ? formatDate(from) : "İlk kayıt";
  const toLabel = to ? formatDate(to) : "Bugün";
  return `${fromLabel} - ${toLabel}`;
}

function syncHomeSummaryFilterControls() {
  getHomeSummaryStartInputs().forEach((input) => {
    input.value = homeSummaryFilter.start || "";
  });

  getHomeSummaryEndInputs().forEach((input) => {
    input.value = homeSummaryFilter.end || "";
  });

  updateHomeSummaryFilterStatus();
}

function updateHomeSummaryFilterStatus(totals = null, count = null) {
  const statusNodes = getHomeSummaryStatusNodes();
  if (!statusNodes.length) {
    return;
  }

  if (!isHomeSummaryFilterActive()) {
    statusNodes.forEach((node) => {
      node.textContent = "Şu anda tüm kayıtların gelir gider hesabı gösterilmektedir.";
    });
    return;
  }

  const label = getHomeSummaryFilterLabel();
  const detail = totals ? ` ${count ?? 0} kayıt · Net ${currency.format(totals.balance)}.` : "";
  statusNodes.forEach((node) => {
    node.textContent = `Şu anda ${label} arası gelir gider hesabınız gösterilmektedir.${detail}`;
  });
}

function applyHomeSummaryFilter() {
  homeSummaryFilter = normalizeHomeSummaryFilter({
    start: getFirstHomeSummaryInputValue(getHomeSummaryStartInputs()),
    end: getFirstHomeSummaryInputValue(getHomeSummaryEndInputs()),
  });
  saveHomeSummaryFilter();
  syncHomeSummaryFilterControls();
  renderHome();
  renderStats();
  renderCategoryBreakdown();
}

function clearHomeSummaryFilter() {
  homeSummaryFilter = { start: "", end: "" };
  saveHomeSummaryFilter();
  syncHomeSummaryFilterControls();
  renderHome();
  renderStats();
  renderCategoryBreakdown();
}

function renderHome() {
  if (!homeBalance) {
    return;
  }

  const homeTransactions = getHomeSummaryTransactions();
  const totals = getTransactionTotals(homeTransactions);
  const assetTotal = assets.reduce((sum, item) => sum + getAssetValue(item), 0);
  const besTotalValue = getBesTotal();

  homeBalance.textContent = currency.format(totals.balance);
  homeInsight.textContent = isHomeSummaryFilterActive()
    ? `Şu anda ${getHomeSummaryFilterLabel()} arası gelir gider hesabınız gösterilmektedir. ${
        totals.balance >= 0 ? "Gelirlerin giderlerinin üzerinde." : "Giderlerin gelirlerini aşıyor."
      }`
    : `Şu anda tüm kayıtların gelir gider hesabı gösterilmektedir. ${
        totals.balance >= 0 ? "Gelirlerin giderlerinin üzerinde." : "Giderlerin gelirlerini aşıyor."
      }`;
  homeAssetsTotal.textContent = currency.format(assetTotal);
  homeBesTotal.textContent = currency.format(besTotalValue);
  homeSavingsTotal.textContent = currency.format(totals.balance);
  updateHomeSummaryFilterStatus(totals, homeTransactions.length);
  renderHomeWealthChart({
    cashBalance: Math.max(totals.balance, 0),
    assetTotal,
    besTotalValue,
  });
  renderHomeAssetList();
  renderHomeBesList();
}

function fitHomeWealthTotalText() {
  if (!homeWealthTotal || !homeWealthChart) {
    return;
  }

  const innerCircle = homeWealthTotal.closest("div");
  if (!innerCircle) {
    return;
  }

  const maxSize = window.innerWidth <= 720 ? 22 : 30;
  const minSize = window.innerWidth <= 720 ? 12 : 14;
  homeWealthTotal.style.fontSize = `${maxSize}px`;
  homeWealthTotal.style.whiteSpace = "nowrap";

  const availableWidth = Math.max(80, innerCircle.clientWidth - 22);
  let current = maxSize;

  while (homeWealthTotal.scrollWidth > availableWidth && current > minSize) {
    current -= 1;
    homeWealthTotal.style.fontSize = `${current}px`;
  }
}

function renderHomeWealthChart({ cashBalance, assetTotal, besTotalValue }) {
  if (!homeWealthChart || !homeWealthTotal || !homeWealthLegend) {
    return;
  }

  const groupedAssetSegments = Object.values(
    assets.reduce((acc, item) => {
      const value = Math.max(getAssetValue(item), 0);
      if (!value) {
        return acc;
      }

      const key = item.type;
      const definition = getAssetDefinition(item.type);
      if (!acc[key]) {
        acc[key] = {
          key,
          label: definition.label,
          value: 0,
        };
      }
      acc[key].value += value;
      return acc;
    }, {})
  )
    .sort((a, b) => b.value - a.value)
    .map((segment, index) => ({
      ...segment,
      color: HOME_WEALTH_ASSET_COLORS[index % HOME_WEALTH_ASSET_COLORS.length],
    }));

  const segments = [
    { label: "Güncel bakiye", value: Math.max(cashBalance, 0), color: "#14b8a6" },
    ...groupedAssetSegments,
    { label: "BES", value: Math.max(besTotalValue, 0), color: "#173f5f" },
  ].filter((segment) => segment.value > 0);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  homeWealthTotal.textContent = currency.format(total);
  fitHomeWealthTotalText();
  homeWealthLegend.innerHTML = "";

  if (!total) {
    const activeTheme = document.documentElement.getAttribute("data-theme") || document.body?.getAttribute("data-theme") || "light";
    homeWealthChart.style.background = activeTheme === "dark"
      ? "linear-gradient(180deg, rgba(24,35,46,0.96), rgba(17,26,35,0.92))"
      : "#edf3f0";
    homeWealthLegend.innerHTML = '<div class="empty-state">Birikim verisi ekledikçe dağılım burada görünür.</div>';
    return;
  }

  let cursor = 0;
  const gradientParts = segments.map((segment) => {
    const start = cursor;
    const end = cursor + (segment.value / total) * 100;
    cursor = end;
    return `${segment.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });

  homeWealthChart.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  segments.forEach((segment) => {
    const ratio = (segment.value / total) * 100;
    const row = document.createElement("article");
    row.className = "wealth-legend-row";
    row.innerHTML = `
      <span><i style="background:${segment.color}"></i>${escapeHtml(segment.label)}</span>
      <strong>${escapeHtml(currency.format(segment.value))} · %${ratio.toFixed(0)}</strong>
    `;
    homeWealthLegend.append(row);
  });
}

function renderHomeAssetList() {
  if (!homeAssetList) {
    return;
  }

  homeAssetList.innerHTML = "";

  if (!assets.length) {
    homeAssetPage = 1;
    homeAssetList.innerHTML = '<div class="empty-state">Henüz varlık eklenmedi.</div>';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(assets.length / HOME_LIST_PAGE_SIZE));
  homeAssetPage = Math.min(Math.max(1, homeAssetPage), totalPages);
  const start = (homeAssetPage - 1) * HOME_LIST_PAGE_SIZE;
  const visibleAssets = assets.slice(start, start + HOME_LIST_PAGE_SIZE);

  visibleAssets.forEach((item) => {
    const row = document.createElement("article");
    row.className = "mini-row";
    const definition = getAssetDefinition(item.type);
    row.innerHTML = `
      <span>${escapeHtml(item.label || definition.label)}</span>
      <strong>${escapeHtml(currency.format(getAssetValue(item)))}</strong>
    `;
    homeAssetList.append(row);
  });

  renderHomeMiniPagination(homeAssetList, homeAssetPage, totalPages, (nextPage) => {
    homeAssetPage = nextPage;
    renderHomeAssetList();
  });
}

function renderHomeBesList() {
  if (!homeBesList) {
    return;
  }

  homeBesList.innerHTML = "";

  if (!besAccounts.length) {
    homeBesPage = 1;
    homeBesList.innerHTML = '<div class="empty-state">Henüz BES sözleşmesi eklenmedi.</div>';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(besAccounts.length / HOME_LIST_PAGE_SIZE));
  homeBesPage = Math.min(Math.max(1, homeBesPage), totalPages);
  const start = (homeBesPage - 1) * HOME_LIST_PAGE_SIZE;
  const visibleBesAccounts = besAccounts.slice(start, start + HOME_LIST_PAGE_SIZE);

  visibleBesAccounts.forEach((item) => {
    const row = document.createElement("article");
    row.className = "mini-row";
    row.innerHTML = `
      <span>${escapeHtml(item.provider)}</span>
      <strong>${escapeHtml(currency.format(getBesAccountTotal(item)))}</strong>
    `;
    homeBesList.append(row);
  });

  renderHomeMiniPagination(homeBesList, homeBesPage, totalPages, (nextPage) => {
    homeBesPage = nextPage;
    renderHomeBesList();
  });
}

function renderHomeMiniPagination(container, currentPage, totalPages, onPageChange) {
  if (!container || totalPages <= 1) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "home-mini-pagination";

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "ghost-btn";
  previousButton.textContent = "Önceki";
  previousButton.disabled = currentPage <= 1;
  previousButton.addEventListener("click", () => onPageChange(currentPage - 1));

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `${currentPage}/${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ghost-btn";
  nextButton.textContent = "Sonraki";
  nextButton.disabled = currentPage >= totalPages;
  nextButton.addEventListener("click", () => onPageChange(currentPage + 1));

  wrapper.append(previousButton, pageInfo, nextButton);
  container.append(wrapper);
}

function getTransactionTotals(source) {
  const safeSource = Array.isArray(source) ? source : [];
  const income = safeSource
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expense = safeSource
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return { income: roundMoney(income), expense: roundMoney(expense), balance: roundMoney(income - expense) };
}

function renderAssets() {
  if (!assetList) {
    return;
  }

  const total = assets.reduce((sum, item) => sum + getAssetValue(item), 0);
  assetsTotal.textContent = currency.format(total);
  marketUpdatedAt.textContent = marketData.updatedAt ? formatMarketTime(marketData.updatedAt) : "Bekleniyor";
  assetCount.textContent = String(assets.length);
  assetList.innerHTML = "";

  if (!assets.length) {
    assetList.innerHTML =
      '<div class="empty-state">Döviz, altın, kripto veya nakit ekledikçe toplam varlık değerin burada görünecek.</div>';
    return;
  }

  assets.forEach((item) => {
    const definition = getAssetDefinition(item.type);
    const unitPrice = getAssetUnitPrice(item.type);
    const totalValue = getAssetValue(item);
    const row = document.createElement("article");
    row.className = "transaction-item";

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.label || definition.label;

    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = `${definition.label} · ${formatQuantity(item.amount)} ${definition.unit} · Birim ${currency.format(
      unitPrice
    )}`;

    content.append(title, meta);

    const side = document.createElement("div");
    side.className = "transaction-side";

    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(totalValue);

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openAssetEditModal(item.id));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => requestAssetDelete(item));

    side.append(amount, editButton, removeButton);
    row.append(content, side);
    assetList.append(row);
  });
}


function renderPaymentAccounts() {
  if (!paymentAccountList) {
    return;
  }

  const creditDebt = paymentAccounts
    .filter((item) => item.type === "credit_card")
    .reduce((sum, item) => sum + Number(item.debt || 0), 0);
  const liquidBalance = paymentAccounts
    .filter((item) => item.type !== "credit_card")
    .reduce((sum, item) => sum + Number(item.balance || 0), 0);

  if (cardDebtTotal) {
    cardDebtTotal.textContent = currency.format(creditDebt);
  }

  if (bankBalanceTotal) {
    bankBalanceTotal.textContent = currency.format(liquidBalance);
  }

  if (paymentAccountCount) {
    paymentAccountCount.textContent = String(paymentAccounts.length);
  }

  paymentAccountList.innerHTML = "";
  updatePaymentAccountSelects();

  const selectedType = paymentAccountTypeFilter?.value || "all";

  if (!paymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Kredi kartı, banka hesabı veya nakit cüzdan eklediğinde burada gerçek kart görünümünde şablon olarak görünecek.</div>';
    return;
  }

  const filteredPaymentAccounts = selectedType === "all"
    ? paymentAccounts
    : paymentAccounts.filter((item) => item.type === selectedType);

  if (!filteredPaymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Bu filtreye uygun kart veya hesap bulunamadı.</div>';
    return;
  }

  filteredPaymentAccounts.forEach((item) => {
    const card = document.createElement("article");
    card.className = `payment-card real-payment-card ${item.type}`;
    card.style.setProperty("--card-color", normalizePaymentCardColor(item.color, item.type));

    const shine = document.createElement("span");
    shine.className = "payment-card-shine";

    const top = document.createElement("div");
    top.className = "payment-card-top";

    const brandBlock = document.createElement("div");
    const bank = document.createElement("span");
    bank.className = "payment-card-bank";
    bank.textContent = item.bank || getPaymentAccountTypeLabel(item.type);

    const title = document.createElement("h3");
    title.textContent = item.name || getPaymentAccountTypeLabel(item.type);
    brandBlock.append(bank, title);

    const logo = document.createElement("span");
    logo.className = "payment-card-logo";
    logo.setAttribute("aria-hidden", "true");

    top.append(brandBlock, logo);

    const chipLine = document.createElement("div");
    chipLine.className = "payment-card-chip-line";

    const chip = document.createElement("span");
    chip.className = "payment-card-chip";
    chip.setAttribute("aria-hidden", "true");

    const contactless = document.createElement("span");
    contactless.className = "payment-card-contactless";
    contactless.setAttribute("aria-hidden", "true");
    contactless.innerHTML = "<i></i><i></i><i></i>";

    const badge = document.createElement("span");
    badge.className = "payment-card-badge";
    badge.textContent = getPaymentAccountTypeLabel(item.type);

    chipLine.append(chip, contactless, badge);

    const number = document.createElement("p");
    number.className = "payment-card-number";
    number.textContent = item.last4 ? `••••  ••••  ••••  ${item.last4}` : getPaymentAccountCardNumberPlaceholder(item.type);

    const details = document.createElement("div");
    details.className = "payment-card-details";

    if (item.type === "credit_card") {
      const cardTotals = getCreditCardRecordTotals(item);
      details.classList.add("credit-card-details");
      details.append(
        createPaymentCardDetail("SKT", item.expiry ? formatExpiry(item.expiry) : "--/----"),
        createPaymentCardDetail("Kesim", item.statementDay ? `${item.statementDay}. gün` : "-"),
        createPaymentCardDetail("Dönem", currency.format(item.currentStatementDebt ?? cardTotals.currentStatementDebt ?? 0))
      );
    } else {
      details.append(
        createPaymentCardDetail("Kart / Hesap", item.name || "Tanımlı hesap"),
        createPaymentCardDetail("Tip", getPaymentAccountTypeLabel(item.type)),
        createPaymentCardDetail("Durum", "Aktif")
      );
    }

    const bottom = document.createElement("div");
    bottom.className = "payment-card-bottom";

    const balanceBox = document.createElement("div");
    const amountLabel = document.createElement("span");
    amountLabel.className = "payment-card-small";
    amountLabel.textContent = item.type === "credit_card" ? "Toplam borç" : "Güncel bakiye";

    const amount = document.createElement("strong");
    amount.className = item.type === "credit_card" ? "payment-card-amount expense" : "payment-card-amount income";
    amount.textContent = item.type === "credit_card" ? currency.format(item.debt || 0) : currency.format(item.balance || 0);
    balanceBox.append(amountLabel, amount);

    const limitText = document.createElement("p");
    limitText.className = "payment-card-note";
    limitText.textContent = getPaymentAccountCardNote(item);
    limitText.hidden = !limitText.textContent;

    bottom.append(balanceBox, limitText);

    const actions = document.createElement("div");
    actions.className = "auth-actions payment-card-actions";

    if (item.type === "credit_card") {
      const payButton = document.createElement("button");
      payButton.className = "success-btn";
      payButton.type = "button";
      payButton.textContent = "Öde";
      payButton.disabled = Number(item.debt || 0) <= 0;
      payButton.addEventListener("click", () => openPaymentAccountPayModal(item));
      actions.append(payButton);
    }

    const recordsButton = document.createElement("button");
    recordsButton.className = "ghost-btn";
    recordsButton.type = "button";
    recordsButton.textContent = "Kayıtlar";
    recordsButton.addEventListener("click", () => openPaymentAccountRecordsModal(item));

    const refreshButton = document.createElement("button");
    refreshButton.className = "ghost-btn payment-card-refresh-btn";
    refreshButton.type = "button";
    refreshButton.textContent = "Güncelle";
    refreshButton.addEventListener("click", () => refreshPaymentAccountFromRecords(item.id));

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openPaymentAccountModal(item));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn danger-lite-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => openPaymentAccountDeleteModal(item));

    actions.append(recordsButton, refreshButton, editButton, removeButton);
    card.append(shine, top, chipLine, number, details, bottom, actions);
    paymentAccountList.append(card);
  });
}

function createPaymentCardDetail(label, value) {
  const wrapper = document.createElement("div");
  const small = document.createElement("span");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  wrapper.append(small, strong);
  return wrapper;
}

function getPaymentAccountCardNumberPlaceholder(type) {
  if (type === "cash") {
    return "NAKİT  CÜZDAN";
  }

  if (type === "bank_account") {
    return "BANKA  HESABI";
  }

  return "••••  ••••  ••••  ----";
}

function getPaymentAccountCardNote(item) {
  if (item.type === "credit_card") {
    const available = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));
    const totals = getCreditCardRecordTotals(item);
    const parts = [
      `Dönem ${currency.format(item.currentStatementDebt ?? totals.currentStatementDebt ?? 0)}`,
      `Toplam ${currency.format(item.debt || 0)}`,
    ];

    if (Number(item.limit || 0) > 0) {
      parts.push(`Kullanılabilir ${currency.format(available)}`);
    }

    return parts.join(" · ");
  }

  return item.note || "";
}

function updatePaymentAccountSelects() {
  if (paymentAccountSelect) {
    if (typeInput?.value === "transfer") {
      updateAnyPaymentAccountSelect(paymentAccountSelect, paymentAccountSelect.value, {
        excludeId: transferAccountSelect?.value || "",
        placeholder: "Kaynak kart / hesap seç",
      });
    } else {
      updatePaymentAccountSelect(paymentAccountSelect, paymentMethodInput?.value || "cash", paymentAccountSelect.value);
    }
  }

  updateEntryTransferAccountSelect();

  if (transactionPaymentAccountInput) {
    updatePaymentAccountSelect(
      transactionPaymentAccountInput,
      transactionPaymentMethodInput?.value || "cash",
      transactionPaymentAccountInput.value
    );
  }

  updateTransactionTransferAccountSelect();

  if (paymentAccountPaySource) {
    fillPaymentSourceSelect(paymentAccountPaySource);
  }

  syncBankImportAccountSelects();
}

function updateAnyPaymentAccountSelect(selectElement, selectedValue = "", options = {}) {
  if (!selectElement) {
    return;
  }

  const { excludeId = "", placeholder = "Kart / hesap seç" } = options;
  const currentValue = String(selectedValue || selectElement.value || "");
  const normalizedExcludeId = String(excludeId || "");
  const availableAccounts = paymentAccounts.filter((item) => String(item.id || "") !== normalizedExcludeId);
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = availableAccounts.length ? placeholder : "Kart / hesap ekle";
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = availableAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function updateTransactionTransferAccountSelect(selectedValue = "") {
  if (!transactionTransferAccountInput) {
    return;
  }

  updateAnyPaymentAccountSelect(transactionTransferAccountInput, selectedValue || transactionTransferAccountInput.value, {
    excludeId: transactionPaymentAccountInput?.value || "",
    placeholder: "Karşı kart / hesap seç",
  });
}

function updateEntryTransferAccountSelect(selectedValue = "") {
  if (!transferAccountSelect) {
    return;
  }

  updateAnyPaymentAccountSelect(transferAccountSelect, selectedValue || transferAccountSelect.value, {
    excludeId: paymentAccountSelect?.value || "",
    placeholder: "Alıcı kart / hesap seç",
  });
}

function syncEntryTransferVisibility() {
  const isTransfer = typeInput?.value === "transfer";

  if (transferAccountLabel) {
    transferAccountLabel.hidden = !isTransfer;
  }

  if (transferFeeLabel) {
    transferFeeLabel.hidden = !isTransfer;
  }

  if (paymentMethodInput) {
    paymentMethodInput.disabled = isTransfer;
    paymentMethodInput.value = isTransfer ? "transfer" : normalizePaymentMethod(paymentMethodInput.value || "cash");
  }

  if (paymentAccountSelect) {
    if (isTransfer) {
      updateAnyPaymentAccountSelect(paymentAccountSelect, paymentAccountSelect.value, {
        excludeId: transferAccountSelect?.value || "",
        placeholder: "Kaynak kart / hesap seç",
      });
    } else {
      updatePaymentAccountSelect(paymentAccountSelect, paymentMethodInput?.value || "cash", paymentAccountSelect.value);
    }
  }

  updateEntryTransferAccountSelect();
}

function syncTransactionTransferVisibility() {
  const isTransfer = transactionTypeInput?.value === "transfer";

  if (transactionTransferAccountLabel) {
    transactionTransferAccountLabel.hidden = !isTransfer;
  }

  if (transactionTransferFeeLabel) {
    transactionTransferFeeLabel.hidden = !isTransfer;
  }

  if (transactionPaymentMethodInput) {
    transactionPaymentMethodInput.value = isTransfer ? "transfer" : normalizePaymentMethod(transactionPaymentMethodInput.value || "cash");
  }

  if (transactionPaymentAccountInput) {
    if (isTransfer) {
      updateAnyPaymentAccountSelect(transactionPaymentAccountInput, transactionPaymentAccountInput.value, {
        excludeId: transactionTransferAccountInput?.value || "",
        placeholder: "Kaynak kart / hesap seç",
      });
    } else {
      updatePaymentAccountSelect(transactionPaymentAccountInput, transactionPaymentMethodInput?.value || "cash", transactionPaymentAccountInput.value);
    }
  }

  updateTransactionTransferAccountSelect();
}

function updatePaymentAccountSelect(selectElement, method = "cash", selectedValue = "") {
  if (!selectElement) {
    return;
  }

  const normalizedMethod = normalizePaymentMethod(method);
  const allowedTypes = paymentMethodAccountTypes[normalizedMethod] || [];
  const availableAccounts = paymentAccounts.filter((item) => allowedTypes.includes(item.type));
  const currentValue = String(selectedValue || selectElement.value || "");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = getPaymentSelectPlaceholder(normalizedMethod, availableAccounts.length);
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  if (currentValue && !availableAccounts.some((item) => item.id === currentValue)) {
    const existing = paymentAccounts.find((item) => item.id === currentValue);
    if (existing) {
      const option = document.createElement("option");
      option.value = existing.id;
      option.textContent = formatPaymentAccountName(existing);
      selectElement.append(option);
    }
  }

  selectElement.value = Array.from(selectElement.options).some((option) => option.value === currentValue)
    ? currentValue
    : "";
}

function syncBankImportAccountSelects(selectedValue = "") {
  const currentValue = String(
    selectedValue ||
    bankImportPreviewAccount?.value ||
    bankImportAccountSelect?.value ||
    ""
  );

  updateBankImportAccountSelect(bankImportAccountSelect, currentValue);
  updateBankImportAccountSelect(bankImportPreviewAccount, currentValue);
  syncBankImportTransferAccountSelects();
}

function updateBankImportAccountSelect(selectElement, selectedValue = "") {
  if (!selectElement) {
    return;
  }

  const currentValue = String(selectedValue || selectElement.value || "");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Kart / hesap seçilmedi";
  selectElement.append(emptyOption);

  paymentAccounts.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = paymentAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function syncBankImportTransferAccountSelects(selectedValue = "") {
  const currentValue = String(
    selectedValue ||
    bankImportPreviewTransferAccount?.value ||
    bankImportTransferAccountSelect?.value ||
    ""
  );
  const sourceAccountId = String(bankImportPreviewAccount?.value || bankImportAccountSelect?.value || "");

  updateBankImportTransferAccountSelect(bankImportTransferAccountSelect, currentValue, sourceAccountId);
  updateBankImportTransferAccountSelect(bankImportPreviewTransferAccount, currentValue, sourceAccountId);
}

function updateBankImportTransferAccountSelect(selectElement, selectedValue = "", sourceAccountId = "") {
  if (!selectElement) {
    return;
  }

  const sourceId = String(sourceAccountId || "");
  const currentValue = String(selectedValue || selectElement.value || "");
  const eligibleAccounts = paymentAccounts.filter((item) => item.id !== sourceId);
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Aktarım yok / karşı hesap seçilmedi";
  selectElement.append(emptyOption);

  eligibleAccounts.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = eligibleAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function getBankImportSelectedAccount() {
  const accountId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  return accountId ? paymentAccounts.find((item) => item.id === accountId) || null : null;
}

function getBankImportSelectedTransferAccount() {
  const accountId = String(bankImportTransferAccountSelect?.value || bankImportPreviewTransferAccount?.value || "");
  const sourceId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  if (!accountId || accountId === sourceId) {
    return null;
  }
  return paymentAccounts.find((item) => item.id === accountId) || null;
}

function getPaymentMethodForImportAccount(account) {
  if (!account) {
    return "bank_account";
  }

  if (account.type === "credit_card") {
    return "credit_card";
  }

  if (account.type === "cash") {
    return "cash";
  }

  return "bank_account";
}

function getPaymentSelectPlaceholder(method, accountCount) {
  if (accountCount) {
    return method === "credit_card" ? "Kredi kartı seç" : "Kart / hesap seç";
  }

  if (method === "cash") {
    return "Nakit seçildi";
  }

  if (method === "credit_card") {
    return "Önce kredi kartı ekle";
  }

  if (method === "bank_account" || method === "transfer") {
    return "Önce banka hesabı ekle";
  }

  return "Tanımlı kart / hesap yok";
}

function addPaymentAccount(event) {
  event.preventDefault();

  const formData = new FormData(paymentAccountForm);
  const type = normalizePaymentAccountType(formData.get("paymentAccountType"));
  const name = String(formData.get("paymentAccountName") || "").trim();
  const bank = String(formData.get("paymentAccountBank") || "").trim();
  const color = normalizePaymentCardColor(formData.get("paymentAccountColor"), type);
  const last4 = String(formData.get("paymentAccountLast4") || "").replace(/\D/g, "").slice(-4);
  const balanceOrDebt = readSignedNumber(formData.get("paymentAccountBalance"), 0);
  const limit = readSignedNumber(formData.get("paymentAccountLimit"), 0);
  const statementDay = clampDay(formData.get("paymentAccountStatementDay"));
  const dueDay = clampDay(formData.get("paymentAccountDueDay"));
  const wasEditing = Boolean(editingPaymentAccountId);
  const existing = editingPaymentAccountId
    ? paymentAccounts.find((item) => item.id === editingPaymentAccountId)
    : null;

  if (!name) {
    const statusTarget = paymentAccountModalStatus || paymentAccountStatus;
    if (statusTarget) {
      statusTarget.textContent = "Kart veya hesap adı boş olamaz.";
    }
    paymentAccountName.focus();
    return;
  }

  const now = getTurkeyNowDateTime();
  const nextAccountId = editingPaymentAccountId || crypto.randomUUID();
  const draftCreditAccount = {
    ...(existing || {}),
    id: nextAccountId,
    type: "credit_card",
    statementDay: type === "credit_card" ? statementDay : existing?.statementDay,
  };
  const accountRecordTotals = wasEditing ? getPaymentAccountRecordTotals(nextAccountId) : { net: 0 };
  const cardRecordTotals = wasEditing ? getCreditCardRecordTotals(draftCreditAccount) : { totalDebt: 0, currentStatementDebt: 0 };
  const requestedBalanceOrDebt = Number.isFinite(balanceOrDebt) ? roundMoney(balanceOrDebt) : 0;
  const openingBalance = type !== "credit_card" ? roundMoney(requestedBalanceOrDebt - Number(accountRecordTotals.net || 0)) : 0;
  const openingDebt = type === "credit_card"
    ? Math.max(0, roundMoney(requestedBalanceOrDebt - Number(cardRecordTotals.totalDebt || 0)))
    : 0;
  const openingCurrentStatementDebt = type === "credit_card"
    ? Math.max(0, roundMoney(requestedBalanceOrDebt - Number(cardRecordTotals.currentStatementDebt || 0)))
    : 0;
  const nextAccount = {
    id: nextAccountId,
    type,
    name,
    bank,
    color,
    last4,
    expiry: type === "credit_card" ? String(formData.get("paymentAccountExpiry") || "") : "",
    statementDay: type === "credit_card" ? statementDay : 0,
    dueDay: type === "credit_card" ? dueDay : 0,
    limit: type === "credit_card" && Number.isFinite(limit) ? Math.max(0, limit) : 0,
    debt: type === "credit_card" ? Math.max(0, requestedBalanceOrDebt) : 0,
    currentStatementDebt: type === "credit_card" ? Math.max(0, requestedBalanceOrDebt) : 0,
    openingDebt,
    openingCurrentStatementDebt,
    creditPaidTotal: existing?.creditPaidTotal || 0,
    currentStatementPaidTotal: existing?.currentStatementPaidTotal || 0,
    creditPaidPeriodKey: existing?.creditPaidPeriodKey || "",
    balance: type !== "credit_card" ? requestedBalanceOrDebt : 0,
    openingBalance,
    note: String(formData.get("paymentAccountNote") || "").trim(),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  paymentAccounts = editingPaymentAccountId
    ? paymentAccounts.map((item) => (item.id === editingPaymentAccountId ? nextAccount : item))
    : [nextAccount, ...paymentAccounts];
  persistPaymentAccounts();
  closePaymentAccountModal({ keepStatus: true });
  paymentAccountStatus.textContent = wasEditing ? "Kart / hesap güncellendi." : "Kart / hesap eklendi.";
  render();
}

function openPaymentAccountModal(item = null) {
  if (!paymentAccountModal || !paymentAccountForm) {
    return;
  }

  editingPaymentAccountId = item?.id || "";
  paymentAccountForm.reset();
  paymentAccountType.value = item?.type || "cash";
  paymentAccountName.value = item?.name || "";
  paymentAccountBank.value = item?.bank || "";
  if (paymentAccountColor) {
    paymentAccountColor.value = normalizePaymentCardColor(item?.color, item?.type || paymentAccountType.value);
  }
  paymentAccountLast4.value = item?.last4 || "";
  paymentAccountExpiry.value = item?.expiry || "";
  paymentAccountStatementDay.value = item?.statementDay || "";
  paymentAccountDueDay.value = item?.dueDay || "";
  paymentAccountLimit.value = item?.limit || "";
  paymentAccountBalance.value = item
    ? item.type === "credit_card"
      ? item.debt || ""
      : item.balance || ""
    : "";
  paymentAccountNote.value = item?.note || "";

  if (paymentAccountModalTitle) {
    paymentAccountModalTitle.textContent = item ? "Kart / hesabı düzenle" : "Kart / hesap ekle";
  }

  if (paymentAccountModalSubtitle) {
    paymentAccountModalSubtitle.textContent = item
      ? `${formatPaymentAccountName(item)} bilgilerini bu pencereden güncelle.`
      : "Bilgileri bu pencereden gir; kaydedince kart şablonu listede görünecek.";
  }

  if (paymentAccountSubmitButton) {
    paymentAccountSubmitButton.textContent = item ? "Kart / Hesap Güncelle" : "Kart / Hesap Ekle";
  }

  if (paymentAccountStatus) {
    paymentAccountStatus.textContent = item ? `${formatPaymentAccountName(item)} düzenleniyor.` : "";
  }

  if (paymentAccountModalStatus) {
    paymentAccountModalStatus.textContent = "";
  }

  updatePaymentAccountFormVisibility();
  paymentAccountModal.hidden = false;
  setTimeout(() => paymentAccountName.focus(), 0);
}

function closePaymentAccountModal(options = {}) {
  editingPaymentAccountId = "";

  if (paymentAccountModal) {
    paymentAccountModal.hidden = true;
  }

  resetPaymentAccountForm();

  if (paymentAccountModalStatus) {
    paymentAccountModalStatus.textContent = "";
  }

  if (!options.keepStatus && paymentAccountStatus) {
    paymentAccountStatus.textContent = "";
  }
}

function resetPaymentAccountForm() {
  editingPaymentAccountId = "";
  paymentAccountForm?.reset();

  if (paymentAccountType) {
    paymentAccountType.value = "cash";
  }

  if (paymentAccountSubmitButton) {
    paymentAccountSubmitButton.textContent = "Kart / Hesap Ekle";
  }

  if (paymentAccountModalTitle) {
    paymentAccountModalTitle.textContent = "Kart / hesap ekle";
  }

  if (paymentAccountModalSubtitle) {
    paymentAccountModalSubtitle.textContent = "Bilgileri bu pencereden gir; kaydedince kart şablonu listede görünecek.";
  }

  updatePaymentAccountFormVisibility();
}

function openPaymentAccountDeleteModal(item) {
  if (!confirmPaymentAccountDeleteModal || !item) {
    return;
  }

  deletingPaymentAccountId = item.id;

  if (confirmPaymentAccountDeleteTitle) {
    confirmPaymentAccountDeleteTitle.textContent = `${formatPaymentAccountName(item)} silinsin mi?`;
  }

  if (confirmPaymentAccountDeleteText) {
    confirmPaymentAccountDeleteText.textContent = "Bu kart/hesap listeden kaldırılır. Bu kartla bağlı eski kayıtların kart/hesap bağlantısı temizlenir; kayıtların kendisi silinmez.";
  }

  if (confirmPaymentAccountDeleteStatus) {
    confirmPaymentAccountDeleteStatus.textContent = "";
  }

  confirmPaymentAccountDeleteModal.hidden = false;
  setTimeout(() => cancelDeletePaymentAccountButton?.focus(), 0);
}

function closePaymentAccountDeleteModal() {
  deletingPaymentAccountId = "";

  if (confirmPaymentAccountDeleteStatus) {
    confirmPaymentAccountDeleteStatus.textContent = "";
  }

  if (confirmPaymentAccountDeleteModal) {
    confirmPaymentAccountDeleteModal.hidden = true;
  }
}

function deletePaymentAccountAfterConfirmation() {
  const item = paymentAccounts.find((account) => account.id === deletingPaymentAccountId);

  if (!item) {
    if (confirmPaymentAccountDeleteStatus) {
      confirmPaymentAccountDeleteStatus.textContent = "Silinecek kart / hesap bulunamadı.";
    }
    return;
  }

  paymentAccounts = paymentAccounts.filter((account) => account.id !== item.id);
  transactions = transactions.map((transaction) =>
    transaction.paymentAccountId === item.id || transaction.transferAccountId === item.id
      ? {
          ...transaction,
          paymentAccountId: transaction.paymentAccountId === item.id ? "" : transaction.paymentAccountId,
          transferAccountId: transaction.transferAccountId === item.id ? "" : transaction.transferAccountId,
        }
      : transaction
  );
  persistPaymentAccounts();
  persistTransactions({ replaceCloud: true });
  closePaymentAccountDeleteModal();
  paymentAccountStatus.textContent = `${formatPaymentAccountName(item)} silindi.`;
  render();
}

function updatePaymentAccountFormVisibility() {
  if (!paymentAccountForm || !paymentAccountType) {
    return;
  }

  const isCreditCard = paymentAccountType.value === "credit_card";
  paymentAccountForm.querySelectorAll(".credit-only").forEach((element) => {
    element.hidden = !isCreditCard;
  });

  if (paymentAccountBalance) {
    paymentAccountBalance.placeholder = isCreditCard
      ? "Mevcut kredi kartı borcu"
      : "Mevcut nakit / banka bakiyesi";
  }

  if (paymentAccountColor && !editingPaymentAccountId && !paymentAccountColor.value) {
    paymentAccountColor.value = normalizePaymentCardColor("", paymentAccountType.value);
  }
}


function getPaymentAccountRelatedTransactions(accountId, sourceTransactions = transactions) {
  const normalizedAccountId = String(accountId || "");

  if (!normalizedAccountId) {
    return [];
  }

  return (Array.isArray(sourceTransactions) ? sourceTransactions : [])
    .filter(
      (transaction) =>
        String(transaction.paymentAccountId || "") === normalizedAccountId ||
        String(transaction.transferAccountId || "") === normalizedAccountId
    )
    .sort(compareTransactionsNewestFirst);
}

function openPaymentAccountRecordsModal(account, options = {}) {
  if (!paymentAccountRecordsModal || !account) {
    return;
  }

  const accountId = String(account.id || "");
  const accountChanged = viewingPaymentAccountRecordsId !== accountId;
  viewingPaymentAccountRecordsId = accountId;
  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId);
  const periodOptions = buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions);
  const defaultPeriod = periodOptions[0]?.value || "all";
  const currentPeriod = !options.preservePeriod || accountChanged ? defaultPeriod : viewingPaymentAccountRecordsPeriod || defaultPeriod;
  viewingPaymentAccountRecordsPeriod = periodOptions.some((item) => item.value === currentPeriod) ? currentPeriod : defaultPeriod;
  const visibleTransactions = filterPaymentAccountRecordsByPeriod(account, relatedTransactions, viewingPaymentAccountRecordsPeriod);
  const visibleTotals = getPaymentAccountRecordTotals(account.id, visibleTransactions);

  if (paymentAccountRecordsTitle) {
    paymentAccountRecordsTitle.textContent = `${formatPaymentAccountName(account)} kayıtları`;
  }

  if (paymentAccountRecordsPeriodFilter) {
    paymentAccountRecordsPeriodFilter.innerHTML = "";
    periodOptions.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      paymentAccountRecordsPeriodFilter.append(option);
    });
    paymentAccountRecordsPeriodFilter.value = viewingPaymentAccountRecordsPeriod;
  }

  if (paymentAccountRecordsSummary) {
    if (account.type === "credit_card") {
      const cardTotals = getCreditCardRecordTotals(account);
      const periodLabel = periodOptions.find((item) => item.value === viewingPaymentAccountRecordsPeriod)?.label || "Seçili dönem";
      paymentAccountRecordsSummary.textContent =
        `${periodLabel}: ${visibleTransactions.length} kayıt · Dönem borcu ${currency.format(cardTotals.currentStatementDebt)} · Toplam borç ${currency.format(cardTotals.totalDebt)} · Ödenen ${currency.format(cardTotals.totalPaid)}`;
    } else {
      paymentAccountRecordsSummary.textContent = visibleTransactions.length
        ? `${visibleTransactions.length} kayıt · Gelen ${currency.format(visibleTotals.income)} · Giden ${currency.format(visibleTotals.expense)} · Net ${currency.format(visibleTotals.net)}`
        : "Bu karta veya hesaba bağlı henüz kayıt yok.";
    }
  }

  if (paymentAccountRecordsList) {
    paymentAccountRecordsList.innerHTML = "";

    if (!visibleTransactions.length) {
      paymentAccountRecordsList.innerHTML = '<div class="empty-state">Bu kart / hesap için kayıt bulunamadı.</div>';
    } else {
      visibleTransactions.forEach((transaction) => {
        const row = document.createElement("article");
        row.className = "transaction-item account-record-item";

        const info = document.createElement("div");
        const title = document.createElement("p");
        title.className = "transaction-title";
        title.textContent = transaction.title;

        const meta = document.createElement("p");
        meta.className = "transaction-meta";
        meta.textContent = `${formatTransactionDateTime(transaction)} · ${transaction.category} · ${getTransactionPaymentInfo(transaction)}${transaction.note ? ` · ${transaction.note}` : ""}`;
        info.append(title, meta);

        const side = document.createElement("div");
        side.className = "transaction-side";
        const amount = document.createElement("strong");
        const effect = getTransactionPaymentAccountEffect(transaction, accountId);
        const displayType = effect >= 0 ? "income" : "expense";
        amount.className = `transaction-amount ${displayType}`;
        amount.textContent = formatPaymentAccountRecordEffectText(transaction, accountId, effect);
        side.append(amount);

        row.append(info, side);
        paymentAccountRecordsList.append(row);
      });
    }
  }

  if (refreshPaymentAccountFromRecordsButton) {
    refreshPaymentAccountFromRecordsButton.disabled = false;
  }

  paymentAccountRecordsModal.hidden = false;
  setTimeout(() => closePaymentAccountRecordsButton?.focus(), 0);
}

function buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions = []) {
  if (account.type === "credit_card") {
    const activePeriod = getCreditCardStatementPeriod(account);
    const periodMap = new Map();

    if (activePeriod.key !== "all") {
      periodMap.set(`statement:${activePeriod.key}`, {
        value: `statement:${activePeriod.key}`,
        label: `Aktif dönem: ${formatDate(activePeriod.start)} - ${formatDate(activePeriod.end)}`,
        start: activePeriod.start,
        end: activePeriod.end,
        time: Date.parse(`${activePeriod.start}T00:00:00`) || 0,
      });
    }

    relatedTransactions.forEach((transaction) => {
      const period = getCreditCardStatementPeriod(account, transaction.date);
      const value = period.key === "all" ? "all" : `statement:${period.key}`;
      if (value !== "all" && !periodMap.has(value)) {
        periodMap.set(value, {
          value,
          label: `${formatDate(period.start)} - ${formatDate(period.end)}`,
          start: period.start,
          end: period.end,
          time: Date.parse(`${period.start}T00:00:00`) || 0,
        });
      }
    });

    const options = Array.from(periodMap.values()).sort((first, second) => second.time - first.time);
    return options.length ? options : [{ value: "all", label: "Tüm dönemler" }];
  }

  const currentMonth = getTurkeyTodayISO().slice(0, 7);
  const months = new Set([currentMonth]);
  relatedTransactions.forEach((transaction) => {
    const month = String(transaction.date || "").slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(month)) {
      months.add(month);
    }
  });

  const monthOptions = Array.from(months)
    .sort((first, second) => second.localeCompare(first))
    .map((month) => ({
      value: `month:${month}`,
      label: formatMonthLabel(month),
      month,
    }));

  return [{ value: "all", label: "Tüm zamanlar" }, ...monthOptions];
}

function filterPaymentAccountRecordsByPeriod(account, relatedTransactions = [], periodValue = "all") {
  if (periodValue === "all") {
    return relatedTransactions;
  }

  if (account.type === "credit_card" && periodValue.startsWith("statement:")) {
    const [, key] = periodValue.split(":");
    const [start, end] = String(key || "").split("_");
    return relatedTransactions.filter((transaction) => {
      const transactionDate = String(transaction.date || "");
      return transactionDate && (!start || transactionDate >= start) && (!end || transactionDate <= end);
    });
  }

  if (periodValue.startsWith("month:")) {
    const month = periodValue.slice("month:".length);
    return relatedTransactions.filter((transaction) => String(transaction.date || "").startsWith(month));
  }

  return relatedTransactions;
}

function formatMonthLabel(monthKey = "") {
  const date = new Date(`${monthKey}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Seçili ay";
  }

  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(date);
}

function closePaymentAccountRecordsModal() {
  viewingPaymentAccountRecordsId = "";
  viewingPaymentAccountRecordsPeriod = "";

  if (paymentAccountRecordsModal) {
    paymentAccountRecordsModal.hidden = true;
  }

  if (paymentAccountRecordsList) {
    paymentAccountRecordsList.innerHTML = "";
  }
}

function getPaymentAccountRecordTotals(accountId, sourceTransactions = transactions) {
  const relatedEffects = sourceTransactions
    .map((transaction) => ({
      transaction,
      effect: getTransactionPaymentAccountEffect(transaction, accountId),
    }))
    .filter((item) => item.effect !== 0);
  const income = relatedEffects
    .filter((item) => item.effect > 0)
    .reduce((sum, item) => sum + item.effect, 0);
  const expense = relatedEffects
    .filter((item) => item.effect < 0)
    .reduce((sum, item) => sum + Math.abs(item.effect), 0);

  return {
    count: relatedEffects.length,
    income: roundMoney(income),
    expense: roundMoney(expense),
    net: roundMoney(income - expense),
  };
}

function formatPaymentAccountRecordEffectText(transaction, accountId, effect) {
  const signedEffect = Number(effect || 0);
  const sign = signedEffect >= 0 ? "+" : "-";
  const amountText = currency.format(Math.abs(signedEffect || Number(transaction?.amount || 0)));

  if (transaction?.type !== "transfer") {
    return `${sign} ${amountText}`;
  }

  const targetId = String(accountId || "");
  const sourceId = String(transaction.paymentAccountId || "");
  const receiverId = String(transaction.transferAccountId || "");
  const isSender = sourceId && sourceId === targetId;
  const isReceiver = receiverId && receiverId === targetId && receiverId !== sourceId;
  const directionText = isSender ? "Transfer çıkışı" : isReceiver ? "Transfer girişi" : "Transfer";

  return `${sign} ${amountText} · ${directionText}`;
}

function getPaymentAccountOpeningBalanceForRefresh(account) {
  return hasStoredMoneyValue(account?.openingBalance) ? Number(account.openingBalance) : 0;
}

function getPaymentAccountOpeningDebtForRefresh(account) {
  return hasStoredMoneyValue(account?.openingDebt) ? Number(account.openingDebt) : 0;
}

function getPaymentAccountOpeningStatementDebtForRefresh(account) {
  return hasStoredMoneyValue(account?.openingCurrentStatementDebt) ? Number(account.openingCurrentStatementDebt) : 0;
}

function getTransactionPaymentAccountEffect(transaction, accountId) {
  const targetId = String(accountId || "");
  const primaryId = String(transaction?.paymentAccountId || "");
  const transferId = String(transaction?.transferAccountId || "");
  const amount = Number(transaction?.amount || 0);
  const transferFee = Math.max(0, Number(transaction?.transferFee || 0));

  if (!targetId || !Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  let effect = 0;
  if (transaction.type === "transfer") {
    if (primaryId === targetId) {
      effect -= amount + transferFee;
    }

    if (transferId === targetId && transferId !== primaryId) {
      effect += amount;
    }

    return roundMoney(effect);
  }

  if (primaryId === targetId) {
    effect += transaction.type === "income" ? amount : -amount;
  }

  if (transferId === targetId && transferId !== primaryId) {
    effect += transaction.type === "income" ? -amount : amount;
  }

  return roundMoney(effect);
}

function getCreditCardStatementPeriod(account, referenceDate = getTurkeyTodayISO()) {
  const statementDay = Number(account?.statementDay || 0);
  const ref = new Date(`${referenceDate || getTurkeyTodayISO()}T00:00:00`);

  if (!statementDay || Number.isNaN(ref.getTime())) {
    return { start: "", end: "", key: "all" };
  }

  const year = ref.getFullYear();
  const month = ref.getMonth();
  const day = ref.getDate();
  const startMonth = day > statementDay ? month : month - 1;
  const endMonth = day > statementDay ? month + 1 : month;
  const start = new Date(year, startMonth, clampMonthDay(year, startMonth, statementDay) + 1);
  const end = new Date(year, endMonth, clampMonthDay(year, endMonth, statementDay));

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
    key: `${toDateInputValue(start)}_${toDateInputValue(end)}`,
  };
}

function clampMonthDay(year, monthIndex, day) {
  return Math.min(Math.max(1, Number(day || 1)), new Date(year, monthIndex + 1, 0).getDate());
}

function toDateInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCreditCardRecordTotals(account, sourceTransactions = transactions) {
  const period = getCreditCardStatementPeriod(account);
  const accountId = String(account.id || "");
  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId, sourceTransactions);
  const all = getPaymentAccountRecordTotals(account.id, relatedTransactions);
  const periodTransactions = relatedTransactions.filter((transaction) => isTransactionInStatementPeriod(transaction, period));
  const allDebtEffect = relatedTransactions.reduce(
    (sum, transaction) => sum + getCreditCardTransactionDebtEffect(transaction, accountId),
    0
  );
  const periodDebtEffect = periodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardTransactionDebtEffect(transaction, accountId),
    0
  );
  const periodIncome = periodTransactions
    .filter((transaction) => getCreditCardTransactionDebtEffect(transaction, accountId) < 0)
    .reduce((sum, transaction) => sum + Math.abs(getCreditCardTransactionDebtEffect(transaction, accountId)), 0);
  const periodExpense = periodTransactions
    .filter((transaction) => getCreditCardTransactionDebtEffect(transaction, accountId) > 0)
    .reduce((sum, transaction) => sum + getCreditCardTransactionDebtEffect(transaction, accountId), 0);
  const totalPaid = Math.max(0, Number(account.creditPaidTotal || 0));
  const periodPaid = account.creditPaidPeriodKey === period.key ? Math.max(0, Number(account.currentStatementPaidTotal || 0)) : 0;
  const totalDebt = Math.max(0, roundMoney(allDebtEffect - totalPaid));
  const currentStatementDebt = Math.max(0, roundMoney(periodDebtEffect - periodPaid));

  return {
    all,
    period,
    periodIncome: roundMoney(periodIncome),
    periodExpense: roundMoney(periodExpense),
    totalPaid: roundMoney(totalPaid),
    periodPaid: roundMoney(periodPaid),
    totalDebt,
    currentStatementDebt,
  };
}

function getCreditCardTransactionDebtEffect(transaction, accountId) {
  const targetId = String(accountId || "");
  const primaryId = String(transaction?.paymentAccountId || "");
  const transferId = String(transaction?.transferAccountId || "");
  const amount = Number(transaction?.amount || 0);
  const transferFee = Math.max(0, Number(transaction?.transferFee || 0));

  if (!targetId || !Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  if (transaction.type === "transfer") {
    if (primaryId === targetId) return amount + transferFee;
    if (transferId === targetId && transferId !== primaryId) return -amount;
    return 0;
  }

  if (primaryId !== targetId) {
    return 0;
  }

  if (transaction.type === "expense") return amount;
  if (transaction.type === "income") return -amount;
  return 0;
}

function isTransactionInStatementPeriod(transaction, period) {
  const transactionDate = String(transaction?.date || "");
  return Boolean(
    transactionDate &&
    (!period?.start || transactionDate >= period.start) &&
    (!period?.end || transactionDate <= period.end)
  );
}

function hasStoredMoneyValue(value) {
  return value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value));
}

function refreshPaymentAccountFromRecords(accountId) {
  const account = paymentAccounts.find((item) => String(item.id || "") === String(accountId || ""));

  if (!account) {
    paymentAccountStatus.textContent = "Güncellenecek kart veya hesap bulunamadı.";
    return;
  }

  const allRelatedTransactions = getPaymentAccountRelatedTransactions(account.id, transactions);
  const totals = account.type === "credit_card"
    ? getCreditCardRecordTotals(account, allRelatedTransactions)
    : getPaymentAccountRecordTotals(account.id, allRelatedTransactions);
  const now = getTurkeyNowDateTime();

  paymentAccounts = paymentAccounts.map((item) => {
    if (item.id !== account.id) {
      return item;
    }

    if (item.type === "credit_card") {
      const openingDebt = getPaymentAccountOpeningDebtForRefresh(item);
      const openingCurrentStatementDebt = getPaymentAccountOpeningStatementDebtForRefresh(item);

      return {
        ...item,
        openingDebt: roundMoney(openingDebt),
        openingCurrentStatementDebt: roundMoney(openingCurrentStatementDebt),
        debt: Math.max(0, roundMoney(openingDebt + Number(totals.totalDebt || 0))),
        currentStatementDebt: Math.max(0, roundMoney(openingCurrentStatementDebt + Number(totals.currentStatementDebt || 0))),
        creditPaidPeriodKey: totals.period.key,
        updatedAt: now,
      };
    }

    const openingBalance = getPaymentAccountOpeningBalanceForRefresh(item);

    return {
      ...item,
      openingBalance: roundMoney(openingBalance),
      balance: roundMoney(openingBalance + Number(totals.net || 0)),
      updatedAt: now,
    };
  });

  persistPaymentAccounts();
  render();

  const refreshedAccount = paymentAccounts.find((item) => item.id === account.id);
  const valueText = refreshedAccount?.type === "credit_card"
    ? `dönem borcu ${currency.format(refreshedAccount.currentStatementDebt || 0)} · toplam borç ${currency.format(refreshedAccount.debt || 0)}`
    : `bakiye ${currency.format(refreshedAccount?.balance || 0)}`;
  paymentAccountStatus.textContent =
    `${formatPaymentAccountName(refreshedAccount || account)} tüm zamanlardaki kayıtlarından yeniden hesaplandı: ${valueText}.`;

  if (!paymentAccountRecordsModal?.hidden && viewingPaymentAccountRecordsId === account.id) {
    openPaymentAccountRecordsModal(refreshedAccount || account, { preservePeriod: true });
  }
}

function openPaymentAccountPayModal(account) {
  payingPaymentAccountId = account.id;
  paymentAccountPayTitle.textContent = `${formatPaymentAccountName(account)} borcunu öde`;
  paymentAccountPayAmount.value = Number(account.debt || 0) > 0 ? Number(account.debt || 0).toFixed(2) : "";
  paymentAccountPayAmount.max = Number(account.debt || 0).toFixed(2);
  paymentAccountPayStatus.textContent = "";
  fillPaymentSourceSelect(paymentAccountPaySource);
  paymentAccountPayModal.hidden = false;
  setTimeout(() => paymentAccountPayAmount.focus(), 0);
}

function closePaymentAccountPayModal() {
  payingPaymentAccountId = "";
  paymentAccountPayForm?.reset();
  paymentAccountPayStatus.textContent = "";

  if (paymentAccountPayModal) {
    paymentAccountPayModal.hidden = true;
  }
}

function fillPaymentSourceSelect(selectElement) {
  if (!selectElement) {
    return;
  }

  const previousValue = selectElement.value;
  const sources = paymentAccounts.filter((item) => item.type !== "credit_card");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = sources.length ? "Ödeme kaynağı seç" : "Ödeme için nakit/banka hesabı ekle";
  selectElement.append(emptyOption);

  sources.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${formatPaymentAccountName(item)} · ${currency.format(item.balance || 0)}`;
    selectElement.append(option);
  });

  selectElement.value = sources.some((item) => item.id === previousValue) ? previousValue : "";
}

function payCreditCardDebt(event) {
  event.preventDefault();

  const creditAccount = paymentAccounts.find((item) => item.id === payingPaymentAccountId && item.type === "credit_card");
  const sourceAccount = paymentAccounts.find((item) => item.id === paymentAccountPaySource.value && item.type !== "credit_card");
  const requestedAmount = readSignedNumber(paymentAccountPayAmount.value);

  if (!creditAccount) {
    paymentAccountPayStatus.textContent = "Ödenecek kredi kartı bulunamadı.";
    return;
  }

  if (!sourceAccount) {
    paymentAccountPayStatus.textContent = "Ödeme için nakit veya banka hesabı seç.";
    paymentAccountPaySource.focus();
    return;
  }

  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    paymentAccountPayStatus.textContent = "Ödeme tutarı sıfırdan büyük olmalı.";
    paymentAccountPayAmount.focus();
    return;
  }

  const amount = Math.min(roundMoney(requestedAmount), roundMoney(creditAccount.debt || 0));
  const now = getTurkeyNowDateTime();
  const period = getCreditCardStatementPeriod(creditAccount);

  paymentAccounts = paymentAccounts.map((item) => {
    if (item.id === creditAccount.id) {
      const periodPaidBase = item.creditPaidPeriodKey === period.key ? Number(item.currentStatementPaidTotal || 0) : 0;
      return {
        ...item,
        debt: Math.max(0, roundMoney(Number(item.debt || 0) - amount)),
        currentStatementDebt: Math.max(0, roundMoney(Number(item.currentStatementDebt || 0) - amount)),
        creditPaidTotal: roundMoney(Number(item.creditPaidTotal || 0) + amount),
        currentStatementPaidTotal: roundMoney(periodPaidBase + amount),
        creditPaidPeriodKey: period.key,
        updatedAt: now,
      };
    }

    if (item.id === sourceAccount.id) {
      return { ...item, balance: roundMoney(Number(item.balance || 0) - amount), updatedAt: now };
    }

    return item;
  });

  persistPaymentAccounts();
  closePaymentAccountPayModal();
  paymentAccountStatus.textContent = `${formatPaymentAccountName(creditAccount)} için ${currency.format(amount)} ödeme işlendi.`;
  render();
}

function validateTransactionPayment(transaction, statusElement = null) {
  const method = normalizePaymentMethod(transaction.paymentMethod);
  const accountId = String(transaction.paymentAccountId || "");
  const transferAccountId = String(transaction.transferAccountId || "");
  const account = accountId ? paymentAccounts.find((item) => item.id === accountId) : null;
  const transferAccount = transferAccountId ? paymentAccounts.find((item) => item.id === transferAccountId) : null;

  if (transaction.type === "transfer") {
    if (!account || !transferAccount || account.id === transferAccount.id) {
      if (statusElement) {
        statusElement.textContent = "Transfer için kaynak ve farklı bir karşı kart / hesap seçmelisin.";
      }
      return false;
    }

    if (statusElement) {
      statusElement.textContent = "";
    }
    return true;
  }

  if (method === "credit_card" && transaction.type === "expense" && !account) {
    if (statusElement) {
      statusElement.textContent = "Kredi kartı gideri için Kartlar / Hesaplar menüsünden tanımladığın kartı seçmelisin.";
    }
    return false;
  }

  if (account && !isPaymentAccountAllowedForMethod(account, method)) {
    if (statusElement) {
      statusElement.textContent = "Seçilen kart / hesap ödeme şekliyle uyumlu değil.";
    }
    return false;
  }

  if (statusElement) {
    statusElement.textContent = "";
  }
  return true;
}

function applyTransactionPaymentEffect(transaction, direction = 1) {
  const accountId = String(transaction.paymentAccountId || "");
  const transferAccountId = String(transaction.transferAccountId || "");
  const amount = Number(transaction.amount || 0);

  if (!accountId || !Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  const account = paymentAccounts.find((item) => item.id === accountId);

  if (!account) {
    return false;
  }

  const factor = direction < 0 ? -1 : 1;
  const now = getTurkeyNowDateTime();

  if (transaction.type === "transfer") {
    const targetAccount = transferAccountId
      ? paymentAccounts.find((item) => item.id === transferAccountId && item.id !== account.id)
      : null;

    if (!targetAccount) {
      return false;
    }

    const transferFee = Math.max(0, Number(transaction.transferFee || 0));
    const sourceDebit = amount + transferFee;

    paymentAccounts = paymentAccounts.map((item) => {
      if (item.id === account.id) {
        return applyTransferEffectToAccount(item, transaction, -sourceDebit * factor, now);
      }

      if (item.id === targetAccount.id) {
        return applyTransferEffectToAccount(item, transaction, amount * factor, now);
      }

      return item;
    });

    return true;
  }

  paymentAccounts = paymentAccounts.map((item) => {
    if (item.id !== account.id) {
      return item;
    }

    if (item.type === "credit_card" && transaction.type === "expense") {
      const period = getCreditCardStatementPeriod(item);
      const inPeriod = isTransactionInStatementPeriod(transaction, period);
      return {
        ...item,
        debt: Math.max(0, roundMoney(Number(item.debt || 0) + amount * factor)),
        currentStatementDebt: inPeriod
          ? Math.max(0, roundMoney(Number(item.currentStatementDebt || 0) + amount * factor))
          : Number(item.currentStatementDebt || 0),
        creditPaidPeriodKey: item.creditPaidPeriodKey || period.key,
        updatedAt: now,
      };
    }

    if (item.type === "credit_card" && transaction.type === "income") {
      const period = getCreditCardStatementPeriod(item);
      const inPeriod = isTransactionInStatementPeriod(transaction, period);
      return {
        ...item,
        debt: Math.max(0, roundMoney(Number(item.debt || 0) - amount * factor)),
        currentStatementDebt: inPeriod
          ? Math.max(0, roundMoney(Number(item.currentStatementDebt || 0) - amount * factor))
          : Number(item.currentStatementDebt || 0),
        creditPaidPeriodKey: item.creditPaidPeriodKey || period.key,
        updatedAt: now,
      };
    }

    if (item.type !== "credit_card" && transaction.type === "expense") {
      return { ...item, balance: roundMoney(Number(item.balance || 0) - amount * factor), updatedAt: now };
    }

    if (item.type !== "credit_card" && transaction.type === "income") {
      return { ...item, balance: roundMoney(Number(item.balance || 0) + amount * factor), updatedAt: now };
    }

    return item;
  });

  if (transferAccountId && transferAccountId !== account.id) {
    const transferAccount = paymentAccounts.find((item) => item.id === transferAccountId && item.type !== "credit_card");
    if (transferAccount) {
      paymentAccounts = paymentAccounts.map((item) => {
        if (item.id !== transferAccount.id) {
          return item;
        }

        const transferFactor = transaction.type === "expense" ? 1 : -1;
        return {
          ...item,
          balance: roundMoney(Number(item.balance || 0) + amount * transferFactor * factor),
          updatedAt: now,
        };
      });
    }
  }

  return true;
}

function applyTransferEffectToAccount(account, transaction, signedAmount, now = getTurkeyNowDateTime()) {
  const amount = Number(signedAmount || 0);

  if (account.type === "credit_card") {
    const period = getCreditCardStatementPeriod(account, transaction.date || getTurkeyTodayISO());
    const inPeriod = isTransactionInStatementPeriod(transaction, period);
    const debtDelta = -amount;
    return {
      ...account,
      debt: Math.max(0, roundMoney(Number(account.debt || 0) + debtDelta)),
      currentStatementDebt: inPeriod
        ? Math.max(0, roundMoney(Number(account.currentStatementDebt || 0) + debtDelta))
        : Number(account.currentStatementDebt || 0),
      creditPaidPeriodKey: account.creditPaidPeriodKey || period.key,
      updatedAt: now,
    };
  }

  return {
    ...account,
    balance: roundMoney(Number(account.balance || 0) + amount),
    updatedAt: now,
  };
}

function getPaymentAccountMeta(item) {
  const parts = [getPaymentAccountTypeLabel(item.type)];

  if (item.bank) {
    parts.push(item.bank);
  }

  if (item.last4) {
    parts.push(`**** ${item.last4}`);
  }

  if (item.type === "credit_card") {
    if (item.expiry) {
      parts.push(`SKT ${formatExpiry(item.expiry)}`);
    }

    if (item.statementDay) {
      parts.push(`Kesim ayın ${item.statementDay}. günü`);
    }

    if (item.dueDay) {
      parts.push(getCreditCardDueNote(item));
    }

    if (Number(item.limit || 0) > 0) {
      const available = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));
      parts.push(`Limit ${currency.format(item.limit)} · Kullanılabilir ${currency.format(available)}`);
    }
  }

  return parts.join(" · ");
}

function getTransactionPaymentInfo(item) {
  if (item?.type === "transfer") {
    const sourceAccount = item.paymentAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId)
      : null;
    const targetAccount = item.transferAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.transferAccountId)
      : null;
    const sourceText = sourceAccount ? formatPaymentAccountName(sourceAccount) : "Kaynak seçilmedi";
    const targetText = targetAccount ? formatPaymentAccountName(targetAccount) : "Karşı hesap seçilmedi";
    const fee = Math.max(0, Number(item.transferFee || 0));
    return `Hesaplar arası transfer · ${sourceText} -> ${targetText}${fee ? ` · Ücret ${currency.format(fee)}` : ""}`;
  }

  const method = normalizePaymentMethod(item.paymentMethod || "cash");
  const account = item.paymentAccountId ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId) : null;

  return account
    ? `${getPaymentMethodLabel(method)} · ${formatPaymentAccountName(account)}`
    : getPaymentMethodLabel(method);
}

function getPaymentMethodLabel(method) {
  return paymentMethodLabels[normalizePaymentMethod(method)] || paymentMethodLabels.cash;
}

function getPaymentAccountTypeLabel(type) {
  return paymentAccountTypeLabels[normalizePaymentAccountType(type)] || paymentAccountTypeLabels.cash;
}

function formatPaymentAccountName(item) {
  const base = item.name || getPaymentAccountTypeLabel(item.type);
  return item.last4 ? `${base} **** ${item.last4}` : base;
}

function formatExpiry(value) {
  const [year, month] = String(value || "").split("-");
  return year && month ? `${month}/${year}` : "";
}

function getCreditCardDueDisplay(item) {
  const dueDay = Number(item?.dueDay || 0);
  const statementDay = Number(item?.statementDay || 0);

  if (!dueDay) {
    return "-";
  }

  if (statementDay && dueDay <= statementDay) {
    return `Sonraki ay\n${dueDay}. gün`;
  }

  return `${dueDay}. gün`;
}

function getCreditCardDueNote(item) {
  const dueDay = Number(item?.dueDay || 0);
  const statementDay = Number(item?.statementDay || 0);

  if (!dueDay) {
    return "Son ödeme günü belirtilmedi";
  }

  if (statementDay && dueDay <= statementDay) {
    return `Son ödeme kesimden sonraki ayın ${dueDay}. günü`;
  }

  return `Son ödeme ayın ${dueDay}. günü`;
}

function normalizePaymentMethod(value) {
  const method = String(value || "cash");
  return paymentMethodLabels[method] ? method : "cash";
}

function normalizePaymentAccountType(value) {
  const type = String(value || "cash");
  return paymentAccountTypeLabels[type] ? type : "cash";
}

function normalizePaymentCardColor(value, type = "cash") {
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }

  return defaultPaymentCardColors[normalizePaymentAccountType(type)] || defaultPaymentCardColors.cash;
}

function isPaymentAccountAllowedForMethod(account, method) {
  const allowedTypes = paymentMethodAccountTypes[normalizePaymentMethod(method)] || [];
  return allowedTypes.includes(account.type);
}

function clampDay(value) {
  const day = Number(value);
  return Number.isFinite(day) && day >= 1 && day <= 31 ? Math.round(day) : 0;
}

function roundMoney(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function renderBesAccounts() {
  if (!besList) {
    return;
  }

  const totals = besAccounts.reduce(
    (acc, item) => {
      acc.contribution += Number(item.contribution || 0);
      acc.stateContribution += Number(item.stateContribution || 0);
      acc.stateGain += Number(item.stateGain || 0);
      acc.gain += Number(item.gain || 0);
      return acc;
    },
    { contribution: 0, stateContribution: 0, stateGain: 0, gain: 0 }
  );
  const grandTotal = totals.contribution + totals.stateContribution + totals.stateGain + totals.gain;

  besTotal.textContent = currency.format(grandTotal);
  besStateTotal.textContent = currency.format(totals.stateContribution);
  besStateGainTotal.textContent = currency.format(totals.stateGain);
  besGainTotal.textContent = currency.format(totals.gain);
  besList.innerHTML = "";

  if (!besAccounts.length) {
    besList.innerHTML =
      '<div class="empty-state">BES sözleşmesi eklediğinde birikim, devlet katkısı ve fon getirisi burada listelenecek.</div>';
    return;
  }

  besAccounts.forEach((item) => {
    const total = getBesAccountTotal(item);
    const row = document.createElement("article");
    row.className = "transaction-item";

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.provider;

    const details = [
      item.policyNo ? `Sözleşme: ${item.policyNo}` : "",
      `Kendi birikimin ${currency.format(item.contribution || 0)}`,
      `Devlet katkısı ${currency.format(item.stateContribution || 0)}`,
      `Devlet katkısı getirisi ${currency.format(item.stateGain || 0)}`,
      `Fon getirisi ${currency.format(item.gain || 0)}`,
      item.note || "",
    ].filter(Boolean);

    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = details.join(" · ");

    content.append(title, meta);

    const side = document.createElement("div");
    side.className = "transaction-side";

    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(total);

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openBesModal(item));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => requestBesDelete(item));

    side.append(amount, editButton, removeButton);
    row.append(content, side);
    besList.append(row);
  });
}

function getBesAccountTotal(item) {
  return (
    Number(item.contribution || 0) +
    Number(item.stateContribution || 0) +
    Number(item.stateGain || 0) +
    Number(item.gain || 0)
  );
}

function getBesTotal() {
  return besAccounts.reduce((sum, item) => sum + getBesAccountTotal(item), 0);
}

function readSignedNumber(value, fallback = Number.NaN) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return fallback;
  }

  const negative = raw.includes("-") || raw.includes("−");
  let cleaned = raw
    .replace(/\s/g, "")
    .replace(/[−]/g, "-")
    .replace(/[^0-9,.\-+]/g, "")
    .replace(/[+-]/g, "");

  if (!/\d/.test(cleaned)) {
    return fallback;
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    cleaned =
      lastComma > lastDot ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    cleaned = cleaned.replace(",", ".");
  } else if ((cleaned.match(/\./g) || []).length > 1) {
    cleaned = cleaned.replace(/\./g, "");
  }

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? (negative ? -Math.abs(parsed) : parsed) : fallback;
}

function resetAssetForm() {
  if (assetEditForm) {
    assetEditForm.reset();
  }
  if (assetEditType) {
    assetEditType.value = "TRY";
  }
  if (assetEditLabel) {
    assetEditLabel.value = "";
  }
  if (assetEditAmount) {
    assetEditAmount.value = "";
  }
}

function openAssetAddModal() {
  editingAssetId = null;
  resetAssetForm();
  if (assetEditModalTitle) {
    assetEditModalTitle.textContent = "Varlık ekle";
  }
  if (assetEditModalNote) {
    assetEditModalNote.textContent = "Varlık bilgilerini bu pencereden girebilirsin.";
  }
  if (assetEditSubmitButton) {
    assetEditSubmitButton.textContent = "Varlık Ekle";
  }
  if (assetEditStatus) {
    assetEditStatus.textContent = "";
  }
  if (assetEditModal) {
    assetEditModal.hidden = false;
  }
  setTimeout(() => assetEditLabel?.focus(), 0);
}

function openAssetEditModal(assetId) {
  const item = assets.find((asset) => asset.id === assetId);
  if (!item || !assetEditModal) {
    return;
  }

  editingAssetId = item.id;
  assetEditType.value = item.type;
  assetEditLabel.value = item.label || "";
  assetEditAmount.value = String(item.amount ?? "");
  if (assetEditModalTitle) {
    assetEditModalTitle.textContent = "Varlık düzenle";
  }
  if (assetEditModalNote) {
    assetEditModalNote.textContent = "Varlık bilgilerini bu pencereden güncelleyebilirsin.";
  }
  if (assetEditSubmitButton) {
    assetEditSubmitButton.textContent = "Kaydet";
  }
  assetEditStatus.textContent = "";
  assetEditModal.hidden = false;
  setTimeout(() => assetEditLabel?.focus(), 0);
}

function closeAssetEditModal() {
  if (assetEditModal) {
    assetEditModal.hidden = true;
  }
  resetAssetForm();
  editingAssetId = null;
  if (assetEditStatus) {
    assetEditStatus.textContent = "";
  }
}

function saveAssetModal(event) {
  event.preventDefault();

  const type = String(assetEditType?.value || "TRY");
  const definition = getAssetDefinition(type);
  const amount = Number(assetEditAmount?.value);
  const label = String(assetEditLabel?.value || definition.label).trim();

  if (!assetDefinitions[type] || !Number.isFinite(amount) || amount <= 0) {
    assetEditStatus.textContent = "Varlık tipi ve miktarı kontrol et.";
    return;
  }

  const now = getTurkeyNowDateTime();

  if (editingAssetId) {
    assets = assets.map((item) =>
      item.id === editingAssetId
        ? {
            ...item,
            type,
            label: label || definition.label,
            amount,
            updatedAt: now,
          }
        : item
    );
    persistAssets();
    closeAssetEditModal();
    marketStatus.textContent = "Varlık güncellendi.";
  } else {
    assets = [
      {
        id: crypto.randomUUID(),
        type,
        label: label || definition.label,
        amount,
        createdAt: now,
        updatedAt: now,
      },
      ...assets,
    ];
    persistAssets();
    closeAssetEditModal();
    marketStatus.textContent = "Varlık eklendi.";
  }

  renderAssets();
  renderHome();
}


function addBesAccount(event) {
  event.preventDefault();

  const formData = new FormData(besForm);
  const provider = String(formData.get("besProvider") || "").trim();
  const contribution = readSignedNumber(formData.get("besContribution"));
  const stateContribution = readSignedNumber(formData.get("besStateContribution"), 0);
  const stateGain = readSignedNumber(formData.get("besStateGain"), 0);
  const gain = readSignedNumber(formData.get("besGain"), 0);

  if (!provider || !Number.isFinite(contribution) || contribution < 0) {
    return;
  }

  const now = getTurkeyNowDateTime();
  const nextAccount = {
    id: editingBesId || crypto.randomUUID(),
    provider,
    policyNo: String(formData.get("besPolicyNo") || "").trim(),
    contribution,
    stateContribution: Number.isFinite(stateContribution) ? stateContribution : 0,
    stateGain: Number.isFinite(stateGain) ? stateGain : 0,
    gain: Number.isFinite(gain) ? gain : 0,
    note: String(formData.get("besNote") || "").trim(),
    createdAt: editingBesId ? besAccounts.find((item) => item.id === editingBesId)?.createdAt || now : now,
    updatedAt: now,
  };

  besAccounts = editingBesId
    ? besAccounts.map((item) => (item.id === editingBesId ? nextAccount : item))
    : [nextAccount, ...besAccounts];
  persistBesAccounts();
  closeBesModal();
  render();
}

async function refreshMarketPrices(options = {}) {
  const { silent = false } = options;

  if (!silent) {
    marketStatus.textContent = "Canlı fiyatlar yükleniyor...";
  }

  const currentPrices = { TRY: 1, ...(marketData.prices || {}) };
  const nextPrices = { ...currentPrices, TRY: 1 };
  const status = {
    updated: [],
    failed: [],
    timestamp: "",
  };

  const currencyResult = await getCurrencyPrices();
  if (currencyResult) {
    Object.assign(nextPrices, currencyResult.prices);
    status.updated.push(currencyResult.source);
    status.timestamp = currencyResult.timestamp || status.timestamp;
  } else {
    status.failed.push("döviz");
  }

  const usdToTry = readMarketNumber(nextPrices.USD);

  if (usdToTry) {
    const [metalsResult, cryptoResult] = await Promise.all([getMetalPrices(usdToTry), getCryptoPrices(usdToTry)]);

    if (metalsResult) {
      Object.assign(nextPrices, metalsResult.prices);
      status.updated.push(metalsResult.source);
      status.timestamp = metalsResult.timestamp || status.timestamp;
    } else {
      status.failed.push("metal");
    }

    if (cryptoResult) {
      Object.assign(nextPrices, cryptoResult.prices);
      status.updated.push(cryptoResult.source);
      status.timestamp = cryptoResult.timestamp || status.timestamp;
    } else {
      status.failed.push("kripto");
    }
  } else {
    status.failed.push("TRY kuru");
  }

  Object.assign(nextPrices, getDerivedAssetPrices(nextPrices));

  const hasAnyPrice = Object.entries(nextPrices).some(([key, value]) => key !== "TRY" && readMarketNumber(value) > 0);

  if (hasAnyPrice) {
    marketData = {
      prices: nextPrices,
      updatedAt: status.timestamp || new Date().toISOString(),
    };
    persistMarketData();
    marketStatus.textContent = status.failed.length
      ? `Fiyatlar kısmen güncellendi. Alınamayan: ${status.failed.join(", ")}.`
      : "Canlı fiyatlar güncellendi.";
    renderAssets();
    return;
  }

  if (!silent || !marketData.updatedAt) {
    marketStatus.textContent = "Canlı fiyatlar alınamadı. İnternet bağlantısını kontrol edip Fiyatları Yenile'ye bas.";
  }
}

async function getCurrencyPrices() {
  const sources = [
    async () => {
      const data = await fetchJson("https://api.genelpara.com/json/?list=doviz&sembol=USD,EUR,GBP");
      const usdToTry = getGenelParaPrice(data, "USD");
      const eurToTry = getGenelParaPrice(data, "EUR");
      const gbpToTry = getGenelParaPrice(data, "GBP");

      if (!usdToTry) {
        return null;
      }

      return {
        source: "GenelPara",
        timestamp: new Date().toISOString(),
        prices: {
          TRY: 1,
          USD: usdToTry,
          EUR: eurToTry || getAssetUnitPrice("EUR"),
          GBP: gbpToTry || getAssetUnitPrice("GBP"),
        },
      };
    },
    async () => buildCurrencyPrices(await fetchJson("https://convertz.app/api/currency"), "Convertz"),
    async () =>
      buildCurrencyPrices(
        await fetchJson("https://api.frankfurter.dev/v1/latest?base=USD&symbols=TRY,EUR,GBP"),
        "Frankfurter"
      ),
    async () => buildCurrencyPrices(await fetchJson("https://open.er-api.com/v6/latest/USD"), "ExchangeRate"),
  ];

  return tryMarketSources(sources);
}

function buildCurrencyPrices(data, source) {
  const rates = data?.rates || {};
  const usdToTry = readMarketNumber(rates.TRY);

  if (!usdToTry) {
    return null;
  }

  return {
    source,
    timestamp: normalizeMarketTimestamp(data.timestamp || data.time_last_update_unix || data.date),
    prices: {
      TRY: 1,
      USD: usdToTry,
      EUR: getFiatTryPrice("EUR", rates, usdToTry),
      GBP: getFiatTryPrice("GBP", rates, usdToTry),
    },
  };
}

async function getMetalPrices(usdToTry) {
  const sources = [
    async () => {
      const data = await fetchJson(
        "https://api.genelpara.com/json/?list=altin&sembol=GA,GAG,XHGLD,C,Y,T,CMR,ATA,IKB,BSL,GR,RA,HA,22,18,14"
      );
      const prices = {
        TR_GA: getGenelParaPrice(data, "GA"),
        TR_HAS: getGenelParaPrice(data, "XHGLD"),
        TR_GAG: getGenelParaPrice(data, "GAG"),
        TR_C: getGenelParaPrice(data, "C"),
        TR_Y: getGenelParaPrice(data, "Y"),
        TR_T: getGenelParaPrice(data, "T"),
        TR_CMR: getGenelParaPrice(data, "CMR"),
        TR_ATA: getGenelParaPrice(data, "ATA"),
        TR_IKB: getGenelParaPrice(data, "IKB"),
        TR_BSL: getGenelParaPrice(data, "BSL"),
        TR_GR: getGenelParaPrice(data, "GR"),
        TR_RA: getGenelParaPrice(data, "RA"),
        TR_HA: getGenelParaPrice(data, "HA"),
        TR_22: getGenelParaPrice(data, "22"),
        TR_18: getGenelParaPrice(data, "18"),
        TR_14: getGenelParaPrice(data, "14"),
      };

      return hasPositivePrice(prices)
        ? { source: "GenelPara altın", timestamp: new Date().toISOString(), prices: getDerivedAssetPrices(prices) }
        : null;
    },
    async () => {
      const data = await fetchJson("https://convertz.app/api/metals");
      const prices = {
        XAU_GRAM: getMetalGramTryPrice("XAU", data, usdToTry),
        XAG_GRAM: getMetalGramTryPrice("XAG", data, usdToTry),
        XPT_GRAM: getMetalGramTryPrice("XPT", data, usdToTry),
      };

      return hasPositivePrice(prices) ? { source: "Convertz metal", timestamp: data?.timestamp, prices } : null;
    },
    async () => {
      const [gold, silver, platinum] = await Promise.all([
        fetchJson("https://api.gold-api.com/price/XAU").catch(() => null),
        fetchJson("https://api.gold-api.com/price/XAG").catch(() => null),
        fetchJson("https://api.gold-api.com/price/XPT").catch(() => null),
      ]);
      const prices = {
        XAU_GRAM: getGoldApiGramTryPrice(gold, usdToTry, "XAU_GRAM"),
        XAG_GRAM: getGoldApiGramTryPrice(silver, usdToTry, "XAG_GRAM"),
        XPT_GRAM: getGoldApiGramTryPrice(platinum, usdToTry, "XPT_GRAM"),
      };

      return hasPositivePrice(prices) ? { source: "Gold API", timestamp: gold?.updatedAt || gold?.updated_at, prices } : null;
    },
  ];

  return tryMarketSources(sources);
}

async function getCryptoPrices(usdToTry) {
  const sources = [
    async () => {
      const data = await fetchJson("https://api.genelpara.com/json/?list=kripto&sembol=BTC,ETH");
      const prices = {
        BTC: getGenelParaPrice(data, "BTC"),
        ETH: getGenelParaPrice(data, "ETH"),
      };

      return hasPositivePrice(prices) ? { source: "GenelPara kripto", timestamp: new Date().toISOString(), prices } : null;
    },
    async () => {
      const data = await fetchJson("https://convertz.app/api/crypto");
      const prices = {
        BTC: getCryptoTryPrice("bitcoin", data, usdToTry),
        ETH: getCryptoTryPrice("ethereum", data, usdToTry),
      };

      return hasPositivePrice(prices) ? { source: "Convertz kripto", timestamp: data?.timestamp, prices } : null;
    },
    async () => {
      const data = await fetchJson(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_last_updated_at=true"
      );
      const prices = {
        BTC: readMarketNumber(data?.bitcoin?.usd) * usdToTry,
        ETH: readMarketNumber(data?.ethereum?.usd) * usdToTry,
      };
      const updatedAt = data?.bitcoin?.last_updated_at || data?.ethereum?.last_updated_at;

      return hasPositivePrice(prices)
        ? { source: "CoinGecko", timestamp: normalizeMarketTimestamp(updatedAt), prices }
        : null;
    },
  ];

  return tryMarketSources(sources);
}

async function tryMarketSources(sources) {
  for (const source of sources) {
    try {
      const result = await source();

      if (result && hasPositivePrice(result.prices)) {
        return result;
      }
    } catch {
      // Try the next free source.
    }
  }

  return null;
}

function hasPositivePrice(prices) {
  return Object.values(prices || {}).some((value) => readMarketNumber(value) > 0);
}

function getDerivedAssetPrices(sourcePrices = {}) {
  const prices = { ...sourcePrices };
  let changed = true;

  while (changed) {
    changed = false;
    Object.entries(assetDefinitions).forEach(([code, definition]) => {
      if (!definition.priceFrom || readMarketNumber(prices[code]) > 0) {
        return;
      }

      const sourcePrice = readMarketNumber(prices[definition.priceFrom]);

      if (!sourcePrice) {
        return;
      }

      prices[code] = sourcePrice * readMarketNumber(definition.multiplier || 1);
      changed = true;
    });
  }

  return prices;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

function getFiatTryPrice(code, rates, usdToTry) {
  const usdToTarget = readMarketNumber(rates[code]);

  if (!usdToTarget) {
    return getAssetUnitPrice(code);
  }

  return usdToTry / usdToTarget;
}

function getGenelParaPrice(data, symbol) {
  const item = data?.data?.[symbol];

  if (!item) {
    return 0;
  }

  return readMarketNumber(item.satis ?? item.satış ?? item.alis ?? item.alış);
}

function getMetalGramTryPrice(symbol, metalsData, usdToTry) {
  const metal = metalsData?.[symbol];
  const usdPerTroyOunce = readMarketNumber(metal?.price ?? metal);

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(`${symbol}_GRAM`);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

function getGoldApiGramTryPrice(data, usdToTry, fallbackType) {
  const usdPerTroyOunce = readMarketNumber(
    data?.price ?? data?.priceTroyOz ?? data?.price_troy_oz ?? data?.ask ?? data?.bid
  );

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(fallbackType);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

function getCryptoTryPrice(id, cryptoData, usdToTry) {
  const cryptoItem = cryptoData?.[id];
  const usdPrice = readMarketNumber(cryptoItem?.current_price ?? cryptoItem?.price ?? cryptoItem);

  if (!usdPrice) {
    return getAssetUnitPrice(id === "bitcoin" ? "BTC" : "ETH");
  }

  return usdPrice * usdToTry;
}

function normalizeMarketTimestamp(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "number") {
    const milliseconds = value > 1000000000000 ? value : value * 1000;
    return new Date(milliseconds).toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function readMarketNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  return 0;
}

function getAssetDefinition(type) {
  return assetDefinitions[type] || { label: type, unit: "" };
}

function getAssetUnitPrice(type) {
  if (type === "TRY") {
    return 1;
  }

  const directPrice = readMarketNumber(marketData.prices?.[type]);

  if (directPrice) {
    return directPrice;
  }

  const definition = assetDefinitions[type];

  if (definition?.priceFrom) {
    return getAssetUnitPrice(definition.priceFrom) * readMarketNumber(definition.multiplier || 1);
  }

  return 0;
}

function getAssetValue(item) {
  return Number(item.amount || 0) * getAssetUnitPrice(item.type);
}

function formatQuantity(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 6,
  }).format(Number(value || 0));
}

function formatMarketTime(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderCategoryBreakdown() {
  const scopedTransactions = getSummaryScopedTransactions();
  const expenses = scopedTransactions.filter((item) => item.type === "expense");
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const grouped = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  categoryBreakdown.innerHTML = "";

  if (!expenses.length) {
    categoryBreakdown.innerHTML =
      '<div class="empty-state">Gider ekledikçe kategori dağılımı burada görünecek.</div>';
    return;
  }

  Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, amount]) => {
      const ratio = totalExpense ? (amount / totalExpense) * 100 : 0;
      const row = document.createElement("div");
      row.className = "category-row";
      row.innerHTML = `
        <div class="category-topline">
          <span>${category}</span>
          <span>${currency.format(amount)} · %${ratio.toFixed(0)}</span>
        </div>
        <div class="category-bar">
          <span style="width:${ratio}%"></span>
        </div>
      `;
      categoryBreakdown.append(row);
    });
}

function applyHistorySearch() {
  currentHistorySearch = searchInput ? searchInput.value : "";
  currentHistoryPage = 1;
  renderTransactions();
}

function resetHistoryFilters() {
  currentHistorySearch = "";
  currentHistoryPage = 1;
  if (searchInput) searchInput.value = "";
  if (filterType) filterType.value = "all";
  if (filterPaymentMethod) filterPaymentMethod.value = "all";
  if (filterPaymentAccount) filterPaymentAccount.value = "all";
  if (historyStartDate) historyStartDate.value = "";
  if (historyEndDate) historyEndDate.value = "";
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

  pagedTransactions
    .forEach((item) => {
      const fragment = transactionTemplate.content.cloneNode(true);
      const title = fragment.querySelector(".transaction-title");
      const meta = fragment.querySelector(".transaction-meta");
      const amount = fragment.querySelector(".transaction-amount");
      const editButton = fragment.querySelector(".edit-transaction-btn");
      const removeButton = fragment.querySelector(".delete-transaction-btn");

      title.textContent = item.title;
      meta.textContent = `${formatTransactionDateTime(item)} · ${item.category} · ${getTransactionPaymentInfo(item)}${item.note ? ` · ${item.note}` : ""}`;
      amount.textContent = item.type === "transfer"
        ? `Transfer ${currency.format(item.amount)}${
            Number(item.transferFee || 0) > 0 ? ` + ücret ${currency.format(Number(item.transferFee || 0))}` : ""
          }`
        : `${item.type === "income" ? "+" : "-"} ${currency.format(item.amount)}`;
      amount.classList.add(item.type);

      editButton.addEventListener("click", () => editTransaction(item));

      removeButton.addEventListener("click", () => requestTransactionDelete(item));

      transactionList.append(fragment);
    });

  renderPagination(filtered.length, totalPages);
}

function getVisibleFilteredTransactions() {
  const queryText = currentHistorySearch;
  const query = queryText.trim().toLocaleLowerCase("tr-TR");
  const selectedType = filterType.value;
  const selectedPaymentMethod = filterPaymentMethod?.value || "all";
  const selectedPaymentAccount = filterPaymentAccount?.value || "all";
  const sourceTransactions = hasHistoryDateRange() ? transactions : getDateFilteredTransactions();

  return sourceTransactions
    .filter((item) => {
      const itemPaymentMethod = normalizePaymentMethod(item.paymentMethod || "cash");
      const itemPaymentAccountId = String(item.paymentAccountId || "");
      const itemTransferAccountId = String(item.transferAccountId || "");
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesPaymentMethod = selectedPaymentMethod === "all" || itemPaymentMethod === selectedPaymentMethod;
      const matchesPaymentAccount =
        selectedPaymentAccount === "all" ||
        (selectedPaymentAccount === "none"
          ? !itemPaymentAccountId && !itemTransferAccountId
          : itemPaymentAccountId === selectedPaymentAccount || itemTransferAccountId === selectedPaymentAccount);
      const haystack = `${item.title} ${item.category} ${item.note} ${getTransactionPaymentInfo(item)}`.toLocaleLowerCase("tr-TR");
      const matchesQuery = !query || haystack.includes(query);
      return matchesType && matchesPaymentMethod && matchesPaymentAccount && matchesQuery && isInHistoryDateRange(item);
    })
    .sort(compareTransactionsNewestFirst);
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

function updateDateFilterOptions() {
  return;
}

function updateDayOptions() {
  return;
}

function createFilterOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function getMonthNumbers() {
  return Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
}

function getMonthName(month) {
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
  }).format(new Date(2026, Number(month) - 1, 1));
}

function getDayNumbersForSelection() {
  if (selectedYear !== "all" && selectedMonth !== "all") {
    const lastDay = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate();
    return Array.from({ length: lastDay }, (_, index) => String(index + 1).padStart(2, "0"));
  }

  return Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
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
  const selectedPaymentAccount = filterPaymentAccount?.value || "all";

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

function editTransaction(item) {
  editingTransactionId = item.id;
  transactionTypeInput.value = item.type === "transfer" ? "transfer" : item.type;
  updateCategorySelect(transactionCategoryInput, transactionTypeInput.value, item.category);
  transactionTitleInput.value = item.title;
  transactionAmountInput.value = Number(item.amount) || "";
  transactionDateInput.value = item.date;
  transactionTimeInput.value = (getTransactionTime(item) || "").slice(0, 5);
  transactionNoteInput.value = item.note || "";
  transactionPaymentMethodInput.value = normalizePaymentMethod(item.paymentMethod || "cash");
  if (transactionTransferFeeInput) {
    transactionTransferFeeInput.value = item.type === "transfer" && Number(item.transferFee || 0) > 0 ? Number(item.transferFee) : "";
  }
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

function closeTransactionEditModal() {
  editingTransactionId = "";
  transactionEditStatus.textContent = "";
  transactionEditForm.reset();
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
  const time = transactionTimeInput.value ? `${transactionTimeInput.value}:00` : "";
  const transactionAt = buildTransactionDateTime(date, time || "00:00:00");

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
    transactionAt,
    updatedAt: getTurkeyNowDateTime(),
  };

  if (!validateTransactionPayment(nextTransaction, transactionEditStatus)) {
    return;
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

  if (revertedPaymentAccount || appliedPaymentAccount || cleanedPaymentAccount) {
    persistPaymentAccounts();
  }
  persistTransactions({ replaceCloud: true });
  closeTransactionEditModal();
  render();
}

function getCategoryTypeLabel(type) {
  if (type === "income") return "Gelir";
  if (type === "transfer") return "Transfer";
  return "Gider";
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

  transactionCategories[type] = [...(transactionCategories[type] || []), name];
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

  items.forEach((name) => {
    const row = document.createElement("div");
    row.className = "category-manage-row";

    const input = document.createElement("input");
    input.type = "text";
    input.value = name;
    input.maxLength = 32;
    input.autocomplete = "off";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "primary-btn";
    saveButton.textContent = "Kaydet";
    saveButton.addEventListener("click", () => renameManagedCategory(type, name, input.value));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-btn";
    deleteButton.textContent = "Sil";
    deleteButton.addEventListener("click", () => deleteManagedCategory(type, name));

    row.append(input, saveButton, deleteButton);
    categoryManageList.append(row);
  });
}

function renameManagedCategory(type, previousName, nextName) {
  const newName = String(nextName || "").trim();
  if (!newName) {
    if (categoryManageStatus) {
      categoryManageStatus.textContent = "Kategori adı boş olamaz.";
    }
    return;
  }

  const categoryList = [...(transactionCategories[type] || [])];
  const duplicate = categoryList.some(
    (item) => item !== previousName && item.toLocaleLowerCase("tr-TR") === newName.toLocaleLowerCase("tr-TR")
  );
  if (duplicate) {
    if (categoryManageStatus) {
      categoryManageStatus.textContent = "Bu isimde başka bir kategori zaten var.";
    }
    return;
  }

  const index = categoryList.findIndex((item) => item === previousName);
  if (index === -1) {
    return;
  }

  categoryList[index] = newName;
  transactionCategories[type] = categoryList;
  transactionCategories = normalizeCategoryState(transactionCategories);

  let changedTransaction = false;
  transactions = transactions.map((item) => {
    if (item.type === type && item.category === previousName) {
      changedTransaction = true;
      return { ...item, category: newName };
    }
    return item;
  });

  persistTransactionCategories();
  if (changedTransaction) {
    persistTransactions();
  }
  syncCategorySelects();
  renderCategoryManageList();
  render();
  if (categoryManageStatus) {
    categoryManageStatus.textContent = `${getCategoryTypeLabel(type)} kategorisi güncellendi.`;
  }
}

function deleteManagedCategory(type, name) {
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

function openEntryModal() {
  if (dateInput && !dateInput.value) {
    dateInput.value = getTurkeyTodayISO();
  }

  entryModal.hidden = false;
  setTimeout(() => form.querySelector("input, select, textarea")?.focus(), 0);
}

function closeEntryModal() {
  if (entryModal) {
    entryModal.hidden = true;
  }
}

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

function renderPagination(totalCount, totalPages) {
  if (totalPages <= 1) {
    paginationControls.innerHTML = "";
    return;
  }

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "ghost-btn";
  previousButton.textContent = "Önceki";
  previousButton.disabled = currentHistoryPage === 1;
  previousButton.addEventListener("click", () => {
    currentHistorySearch = searchInput ? searchInput.value : currentHistorySearch;
    currentHistoryPage = Math.max(1, currentHistoryPage - 1);
    renderTransactions();
  });

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ghost-btn";
  nextButton.textContent = "Sonraki";
  nextButton.disabled = currentHistoryPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentHistorySearch = searchInput ? searchInput.value : currentHistorySearch;
    currentHistoryPage = Math.min(totalPages, currentHistoryPage + 1);
    renderTransactions();
  });

  const label = document.createElement("span");
  const firstItem = (currentHistoryPage - 1) * TRANSACTIONS_PER_PAGE + 1;
  const lastItem = Math.min(currentHistoryPage * TRANSACTIONS_PER_PAGE, totalCount);
  label.textContent = `${firstItem}-${lastItem} / ${totalCount} · Sayfa ${currentHistoryPage}/${totalPages}`;

  paginationControls.append(previousButton, label, nextButton);
}

function clearHistorySearch() {
  currentHistorySearch = "";
  if (searchInput.value) {
    searchInput.value = "";
  }
}

function switchView(viewId) {
  const previousView = activeView;
  activeView = viewMeta[viewId] ? viewId : "homeView";

  if (previousView === "historyView" && activeView !== "historyView") {
    clearHistorySearch();
    currentHistoryPage = 1;
  }

  renderView();

  if (activeView === "historyView") {
    renderTransactions();
  }
}

function renderView() {
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
  }
}

function toggleSidebar() {
  if (window.matchMedia("(min-width: 981px)").matches) {
    appShell.classList.toggle("sidebar-expanded");
    return;
  }

  setMobileSidebarOpen(!sidebar.classList.contains("open"));
}

function setMobileSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  appShell.classList.toggle("menu-open", open);
}

function updateStorageStatus() {
  if (!storageStatus) {
    return;
  }

  const size = new Blob([JSON.stringify(transactions)]).size;
  const savedAt = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const storageMode = currentUser ? "bulut hesabın ve bu cihazda" : "bu cihazda";
  storageStatus.textContent = `${transactions.length} kayıt ${storageMode} saklanıyor · Son güncelleme ${savedAt} · ${size} bayt`;
}

function exportTransactions() {
  const payload = JSON.stringify(
    {
      version: 3,
      createdAt: getTurkeyNowDateTime(),
      transactions,
      assets,
      besAccounts,
      paymentAccounts,
      transactionCategories,
    },
    null,
    2
  );
  const stamp = getExportStamp();
  downloadBlob(new Blob([payload], { type: "application/json;charset=utf-8" }), `akış-veri-yedeği-${stamp}.json`);
}

function exportFilteredTransactionsPdf() {
  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    alert("PDF almak için filtreye uygun kayıt bulunamadı.");
    return;
  }

  openPdfPreviewReport(buildFilteredTransactionsReportHtml(filtered));
}

function buildFilteredTransactionsReportHtml(filtered) {
  const income = filtered
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = filtered
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;
  const rows = filtered
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(formatTransactionDateTime(item))}</td>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(getTransactionTypeLabel(item.type))}</td>
          <td>${escapeHtml(getTransactionPaymentInfo(item))}</td>
          <td class="${item.type}">${escapeHtml(formatTransactionAmountForExport(item))}</td>
        </tr>
      `
    )
    .join("");

  return `
    <h1>Akış Bütçe Kayıtları</h1>
    <p>${escapeHtml(getHistoryFilterLabel())} · ${filtered.length} kayıt</p>
    <section class="print-summary">
      <div class="print-box"><span>Gelir</span><strong>${escapeHtml(currency.format(income))}</strong></div>
      <div class="print-box"><span>Gider</span><strong>${escapeHtml(currency.format(expense))}</strong></div>
      <div class="print-box"><span>Tasarruf</span><strong>${escapeHtml(currency.format(balance))}</strong></div>
    </section>
    <table>
      <thead>
        <tr>
          <th>Tarih</th>
          <th>İşlem</th>
          <th>Kategori</th>
          <th>Tip</th>
          <th>Ödeme</th>
          <th>Tutar</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function isMobilePdfContext() {
  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
  const mobileWidth = window.matchMedia?.("(max-width: 720px)")?.matches;
  const mobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  return Boolean(mobileWidth || mobileAgent || standalone);
}

function openPdfPreviewReport(reportHtml) {
  closePdfPreviewReport();
  document.getElementById("printReport")?.remove();

  const mobilePdf = isMobilePdfContext();
  const overlay = document.createElement("section");
  overlay.id = "pdfPreviewOverlay";
  overlay.className = "pdf-preview-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "pdfPreviewTitle");
  overlay.innerHTML = `
    <div class="pdf-preview-shell">
      <header class="pdf-preview-toolbar">
        <div>
          <p class="panel-kicker">PDF Önizleme</p>
          <h2 id="pdfPreviewTitle">Kayıtlar PDF ekranı</h2>
          <span>${mobilePdf ? "Mobilde yazdırma ekranına çıkmadan raporu uygulama içinde görüntüleyebilir veya PDF olarak indirebilirsin." : "Çıktıyı uygulama içinde kontrol edip yazdırabilirsin."}</span>
        </div>
        <div class="pdf-preview-actions">
          <button id="pdfPrintButton" class="success-btn" type="button">${mobilePdf ? "PDF İndir" : "PDF Yazdır"}</button>
          <button id="pdfCloseButton" class="ghost-btn" type="button">Kapat</button>
        </div>
      </header>
      <div class="pdf-preview-body">
        <section class="print-report pdf-preview-report">${reportHtml}</section>
      </div>
    </div>
  `;

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closePdfPreviewReport();
    }
  });
  document.body.append(overlay);
  document.body.classList.add("pdf-preview-open");
  overlay.querySelector("#pdfPrintButton")?.addEventListener("click", () => {
    if (isMobilePdfContext()) {
      downloadPdfPreviewReport();
    } else {
      printPdfPreviewReport();
    }
  });
  overlay.querySelector("#pdfCloseButton")?.addEventListener("click", closePdfPreviewReport);
}

function closePdfPreviewReport() {
  document.getElementById("pdfPreviewOverlay")?.remove();
  document.body.classList.remove("pdf-preview-open");
}

function printPdfPreviewReport() {
  const previewReport = document.querySelector("#pdfPreviewOverlay .pdf-preview-report");
  if (!previewReport) {
    return;
  }

  if (isMobilePdfContext()) {
    downloadPdfPreviewReport();
    return;
  }

  document.getElementById("printReport")?.remove();
  const report = document.createElement("section");
  report.id = "printReport";
  report.className = "print-report";
  report.innerHTML = previewReport.innerHTML;

  const cleanup = () => {
    document.body.classList.remove("printing-report");
    report.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  document.body.append(report);
  document.body.classList.add("printing-report");
  window.addEventListener("afterprint", cleanup);
  window.print();
  setTimeout(() => {
    if (document.body.classList.contains("printing-report")) {
      cleanup();
    }
  }, 60000);
}

function normalizePdfText(text = "") {
  return String(text)
    .replace(/₺/g, "TL")
    .replace(/İ/g, "I")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .replace(/Ş/g, "S")
    .replace(/ş/g, "s")
    .replace(/Ğ/g, "G")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "U")
    .replace(/ü/g, "u")
    .replace(/Ö/g, "O")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfString(text = "") {
  return normalizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function splitPdfLine(text, maxLength = 92) {
  const words = normalizePdfText(text).split(" ").filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }
  return lines.length ? lines : [""];
}

function collectPdfPreviewLines(report) {
  const lines = [];
  const title = report.querySelector("h1")?.textContent || "Akis Butce Kayitlari";
  const subtitle = report.querySelector("p")?.textContent || "";
  lines.push({ text: title, size: 18, gap: 18 });
  if (subtitle) {
    lines.push({ text: subtitle, size: 10, gap: 18 });
  }

  report.querySelectorAll(".print-box").forEach((box) => {
    const label = box.querySelector("span")?.textContent || "";
    const value = box.querySelector("strong")?.textContent || "";
    lines.push({ text: `${label}: ${value}`, size: 11, gap: 14 });
  });

  lines.push({ text: " ", size: 8, gap: 10 });
  const headers = Array.from(report.querySelectorAll("thead th")).map((cell) => cell.textContent.trim());
  if (headers.length) {
    lines.push({ text: headers.join(" | "), size: 10, gap: 14 });
    lines.push({ text: "-".repeat(96), size: 9, gap: 12 });
  }

  report.querySelectorAll("tbody tr").forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim());
    splitPdfLine(cells.join(" | "), 96).forEach((line) => lines.push({ text: line, size: 9, gap: 12 }));
  });

  return lines;
}

function createSimplePdfBlob(lines) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 38;
  const topY = 800;
  const bottomY = 40;
  const pages = [];
  let current = [];
  let y = topY;

  lines.forEach((line) => {
    const gap = line.gap || 12;
    if (y - gap < bottomY && current.length) {
      pages.push(current);
      current = [];
      y = topY;
    }
    current.push({ ...line, x: marginX, y });
    y -= gap;
  });
  if (current.length) pages.push(current);

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("PAGES_PLACEHOLDER");
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const pageObjectIds = [];
  pages.forEach((pageLines) => {
    const stream = pageLines
      .map((line) => `BT /F1 ${line.size || 10} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm (${escapePdfString(line.text)}) Tj ET`)
      .join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageObjectIds.push(pageId);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((content, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function downloadPdfPreviewReport() {
  const previewReport = document.querySelector("#pdfPreviewOverlay .pdf-preview-report");
  if (!previewReport) {
    return;
  }
  const lines = collectPdfPreviewLines(previewReport);
  const blob = createSimplePdfBlob(lines);
  downloadBlob(blob, `akis-butce-kayitlari-${getExportStamp()}.pdf`);
}

function exportFilteredTransactionsExcel() {
  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    alert("Excel almak için filtreye uygun kayıt bulunamadı.");
    return;
  }

  const rows = filtered
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(formatTransactionDateTime(item))}</td>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(getTransactionTypeLabel(item.type))}</td>
          <td>${escapeHtml(getTransactionPaymentInfo(item))}</td>
          <td style="text-align:right;">${escapeHtml(formatTransactionAmountForExport(item))}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; }
    th, td { border: 1px solid #d9e2dd; padding: 8px 10px; mso-number-format:"\\@"; }
    th { background: #173f5f; color: #fff; font-weight: 700; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th>Tarih</th>
        <th>İşlem</th>
        <th>Kategori</th>
        <th>Tip</th>
        <th>Ödeme</th>
        <th>Tutar</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  downloadBlob(new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" }), `akis-butce-kayitlari-${getExportStamp()}.xls`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getExportStamp() {
  return getTurkeyTodayISO();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value || "");
  return div.innerHTML;
}

function formatTransactionAmountForExport(item) {
  if (item?.type === "transfer") {
    const fee = Math.max(0, Number(item.transferFee || 0));
    return `Transfer ${currency.format(Number(item.amount || 0))}${fee ? ` + ücret ${currency.format(fee)}` : ""}`;
  }

  return `${item?.type === "income" ? "+" : "-"} ${currency.format(Number(item?.amount || 0))}`;
}

function getTransactionTypeLabel(type) {
  if (type === "income") return "Gelir";
  if (type === "transfer") return "Transfer";
  return "Gider";
}

function importTransactions(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const sourceTransactions = Array.isArray(parsed) ? parsed : parsed.transactions;

      if (!Array.isArray(sourceTransactions)) {
        throw new Error("Geçersiz veri");
      }

      transactions = mergeTransactions(sourceTransactions.filter(isValidTransaction));

      if (Array.isArray(parsed.assets)) {
        assets = mergeRecordsById(readCloudAssets(parsed.assets), assets);
        persistAssets();
      }

      if (Array.isArray(parsed.besAccounts)) {
        besAccounts = mergeRecordsById(readCloudBesAccounts(parsed.besAccounts), besAccounts);
        persistBesAccounts();
      }

      if (Array.isArray(parsed.paymentAccounts)) {
        paymentAccounts = mergeRecordsById(readCloudPaymentAccounts(parsed.paymentAccounts), paymentAccounts);
        persistPaymentAccounts();
      }

      if (hasCategoryState(parsed.transactionCategories || parsed.categories)) {
        transactionCategories = mergeCategoryStates(parsed.transactionCategories || parsed.categories, transactionCategories);
        persistTransactionCategories();
        syncCategorySelects();
      }

      transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
      persistTransactionCategories();
      syncCategorySelects();
      persistTransactions({ replaceCloud: true });
      render();
    } catch {
      storageStatus.textContent = "İçe aktarma başarısız oldu. Geçerli bir JSON dosyası seç.";
    } finally {
      importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function generateSyncCode() {
  const payload = {
    version: 3,
    createdAt: getTurkeyNowDateTime(),
    transactions,
    assets,
    besAccounts,
    paymentAccounts,
    transactionCategories,
  };
  syncPayload.value = JSON.stringify(payload);
  syncStatus.textContent = "Paylaşım kodu hazır. Diğer telefonda bu kodu yapıştırabilirsin.";
}

async function copySyncCode() {
  if (!syncPayload.value.trim()) {
    generateSyncCode();
  }

  try {
    await navigator.clipboard.writeText(syncPayload.value);
    syncStatus.textContent = "Paylaşım kodu panoya kopyalandı.";
  } catch {
    syncPayload.focus();
    syncPayload.select();
    syncStatus.textContent = "Otomatik kopyalama açılamadı. Kod seçildi, elle kopyalayabilirsin.";
  }
}

function importSyncCode() {
  const raw = syncPayload.value.trim();

  if (!raw) {
    syncStatus.textContent = "Önce bir paylaşım kodu yapıştır.";
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const sourceTransactions = Array.isArray(parsed) ? parsed : parsed.transactions;

    if (!Array.isArray(sourceTransactions)) {
      throw new Error("Geçersiz paylaşım kodu");
    }

    const validTransactions = sourceTransactions.filter(isValidTransaction);
    if (!validTransactions.length && sourceTransactions.length) {
      throw new Error("Geçersiz paylaşım kodu");
    }

    transactions = mergeTransactions(validTransactions);

    if (Array.isArray(parsed.assets)) {
      assets = mergeRecordsById(readCloudAssets(parsed.assets), assets);
      persistAssets();
    }

    if (Array.isArray(parsed.besAccounts)) {
      besAccounts = mergeRecordsById(readCloudBesAccounts(parsed.besAccounts), besAccounts);
      persistBesAccounts();
    }

    if (Array.isArray(parsed.paymentAccounts)) {
      paymentAccounts = mergeRecordsById(readCloudPaymentAccounts(parsed.paymentAccounts), paymentAccounts);
      persistPaymentAccounts();
    }

    if (hasCategoryState(parsed.transactionCategories || parsed.categories)) {
      transactionCategories = mergeCategoryStates(parsed.transactionCategories || parsed.categories, transactionCategories);
    }

    transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
    persistTransactionCategories();
    syncCategorySelects();
    persistTransactions({ replaceCloud: true });
    render();
    syncStatus.textContent = `${transactions.length} kayıt, tanımlı kart/hesap ve kategori bilgileri bu telefona aktarıldı.`;
  } catch {
    syncStatus.textContent = "Paylaşım kodu okunamadı. Geçerli bir kod yapıştır.";
  }
}

function initCloud() {
  renderAuthState();

  if (!window.firebase) {
    cloudStatus.textContent = "Firebase dosyaları yüklenemedi. Bağlantıyı kontrol et veya uygulamayı yayınlı adresten aç.";
    return;
  }

  const config = window.AKIS_FIREBASE_CONFIG;

  if (!hasUsableFirebaseConfig(config)) {
    cloudStatus.textContent = "firebase-config.js içindeki Firebase bilgilerini doldurunca bulut girişi aktif olur.";
    return;
  }

  try {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }

    firebaseAuth = window.firebase.auth();
    firebaseDb = window.firebase.firestore();
    enableFirestoreOfflineCache();
    firebaseAuth.onAuthStateChanged(handleAuthStateChanged);
    cloudStatus.textContent = "Bulut bağlantısı hazır. Hesabınla giriş yapabilirsin.";
  } catch (error) {
    cloudStatus.textContent = `Firebase başlatılamadı: ${error.message}`;
  }
}

function enableFirestoreOfflineCache() {
  if (!firebaseDb || firestorePersistenceEnabled || typeof firebaseDb.enablePersistence !== "function") {
    return;
  }

  firestorePersistenceEnabled = true;
  firebaseDb.enablePersistence({ synchronizeTabs: true }).catch((error) => {
    if (error?.code === "failed-precondition") {
      cloudStatus.textContent = "Bulut onbellegi acik sekmeler nedeniyle sinirli. Veriler yine de esitlenecek.";
      return;
    }

    if (error?.code === "unimplemented") {
      cloudStatus.textContent = "Bu tarayici Firebase yerel onbellegini desteklemiyor. Veriler agdan yuklenecek.";
    }
  });
}

function ensureCloudReady(statusElement = cloudStatus) {
  if (firebaseAuth && firebaseDb) {
    return true;
  }

  initCloud();
  const ready = Boolean(firebaseAuth && firebaseDb);

  if (!ready && statusElement && statusElement !== cloudStatus) {
    statusElement.textContent = cloudStatus.textContent;
  }

  return ready;
}

function hasUsableFirebaseConfig(config) {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  return (
    config &&
    requiredKeys.every((key) => {
      const value = String(config[key] || "");
      return value && !value.includes("BURAYA_") && !value.includes("PROJECT_ID");
    })
  );
}

function showAuthPanel(panelName) {
  const panels = [authForm, signupForm, resetPasswordForm];

  panels.forEach((panel) => {
    if (panel) {
      panel.hidden = panel.dataset.authPanel !== panelName;
    }
  });

  if (panelName === "login") {
    authPassword.value = "";
    setTimeout(() => authEmail?.focus(), 0);
  }
}

function openSignupPanel() {
  const loginValue = authEmail.value.trim();

  if (loginValue.includes("@")) {
    signupEmail.value = loginValue.toLowerCase();
    signupUsername.value = "";
  } else {
    signupUsername.value = loginValue;
    signupEmail.value = "";
  }

  signupPassword.value = "";
  signupPasswordConfirm.value = "";
  signupStatus.textContent = "";
  showAuthPanel("signup");
  setTimeout(() => (signupEmail.value ? signupUsername.focus() : signupEmail.focus()), 0);
}

function openResetPanel() {
  const loginValue = authEmail.value.trim();

  resetEmail.value = loginValue.includes("@") ? loginValue.toLowerCase() : "";
  resetStatus.textContent = "";
  showAuthPanel("reset");
  setTimeout(() => resetEmail.focus(), 0);
}

async function signInWithEmail() {
  const credentials = getAuthCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(signupStatus)) {
    return;
  }

  try {
    cloudStatus.textContent = "Giriş yapılıyor...";
    await firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
    saveLastUsername(credentials.username);
  } catch (error) {
    cloudStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function createAccountWithEmail(event) {
  event.preventDefault();
  const credentials = getSignupCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(resetStatus)) {
    return;
  }

  try {
    signupStatus.textContent = "Hesap oluşturuluyor...";
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName: credentials.username });
      await userCredential.user.reload();
      currentUser = firebaseAuth.currentUser || userCredential.user;
    }

    saveLastUsername(credentials.username);
    renderAuthState();
    await syncUserProfileToCloud();
    signupStatus.textContent = "Hesap oluşturuldu. Bulut kayıtların hazırlanıyor...";
  } catch (error) {
    signupStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function sendPasswordReset(event) {
  event.preventDefault();
  const email = resetEmail.value.trim().toLowerCase();

  if (!ensureCloudReady()) {
    return;
  }

  if (!email || !email.includes("@")) {
    resetStatus.textContent = "Parola sıfırlamak için mail adresini yaz.";
    resetEmail.focus();
    return;
  }

  try {
    resetStatus.textContent = "Parola sıfırlama bağlantısı gönderiliyor...";
    await firebaseAuth.sendPasswordResetEmail(email);
    resetStatus.textContent = "Yenileme şifreniz mail adresinize gönderildi.";
  } catch (error) {
    resetStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function signOutUser() {
  if (!firebaseAuth) {
    return;
  }

  closeProfileModal();
  await firebaseAuth.signOut();
}

function openProfileModal() {
  if (!currentUser) {
    return;
  }

  switchView("userView");
  fillProfileForm();
  setTimeout(() => profileUsername?.focus(), 0);
}

function fillProfileForm() {
  if (!currentUser || !profileForm) {
    return;
  }

  profileUsername.value = getUserDisplayName(currentUser);
  profileCurrentPassword.value = "";
  profilePassword.value = "";
  profileStatus.textContent = "";
  closeDeleteAccountModal();
  closeConfirmDeleteAccountModal();
  if (deleteUserStatus) {
    deleteUserStatus.textContent = "";
  }
}

function closeProfileModal() {
  if (!profileModal) {
    return;
  }

  profileModal.hidden = true;
}

async function updateProfile(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth) {
    profileStatus.textContent = "Profil güncellemek için giriş yapmalısın.";
    return;
  }

  const username = profileUsername.value.trim();
  const currentPassword = profileCurrentPassword.value;
  const nextPassword = profilePassword.value;

  if (!username) {
    profileStatus.textContent = "Kullanıcı adı boş olamaz.";
    return;
  }

  if (nextPassword && nextPassword.length < 6) {
    profileStatus.textContent = "Yeni şifre en az 6 karakter olmalı.";
    return;
  }

  const usernameChanged = username !== getUserDisplayName(currentUser);
  const passwordChanged = Boolean(nextPassword);

  if (!usernameChanged && !passwordChanged) {
    profileStatus.textContent = "Güncellenecek bir değişiklik yok.";
    return;
  }

  if (passwordChanged && !currentPassword) {
    profileStatus.textContent = "Şifre değiştirmek için mevcut şifreni gir.";
    profileCurrentPassword.focus();
    return;
  }

  try {
    profileStatus.textContent = "Profil güncelleniyor...";

    if (passwordChanged) {
      await reauthenticateCurrentUser(currentPassword);
    }

    if (usernameChanged) {
      await currentUser.updateProfile({ displayName: username });
    }

    if (passwordChanged) {
      await currentUser.updatePassword(nextPassword);
    }

    await currentUser.reload();
    currentUser = firebaseAuth.currentUser || currentUser;
    saveLastUsername(getUserDisplayName(currentUser));
    renderAuthState();
    await syncTransactionsToCloud({ replace: true });
    profileCurrentPassword.value = "";
    profilePassword.value = "";
    profileStatus.textContent = "Profil güncellendi.";
  } catch (error) {
    profileStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function reauthenticateCurrentUser(password) {
  const credential = window.firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
  await currentUser.reauthenticateWithCredential(credential);
}

function openDeleteAccountModal() {
  if (!currentUser) {
    deleteUserStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  pendingDeletePassword = "";
  deleteUserStatus.textContent = "";
  deleteAccountStatus.textContent = "";
  deleteAccountForm.reset();
  deleteAccountModal.hidden = false;
  setTimeout(() => deleteUserPassword.focus(), 0);
}

function closeDeleteAccountModal() {
  if (!deleteAccountModal) {
    return;
  }

  pendingDeletePassword = "";
  deleteAccountForm?.reset();
  if (deleteAccountStatus) {
    deleteAccountStatus.textContent = "";
  }
  deleteAccountModal.hidden = true;
}

function requestDeleteAccountConfirmation(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth || !firebaseDb) {
    deleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  const password = deleteUserPassword.value;
  const passwordConfirm = deleteUserPasswordConfirm.value;

  if (!password) {
    deleteAccountStatus.textContent = "Hesabı silmek için şifreni yaz.";
    deleteUserPassword.focus();
    return;
  }

  if (password !== passwordConfirm) {
    deleteAccountStatus.textContent = "Şifre ve şifre onayı aynı olmalı.";
    deleteUserPasswordConfirm.focus();
    return;
  }

  pendingDeletePassword = password;
  deleteAccountModal.hidden = true;
  confirmDeleteAccountStatus.textContent = "";
  confirmDeleteAccountModal.hidden = false;
  setTimeout(() => cancelConfirmDeleteButton.focus(), 0);
}

function closeConfirmDeleteAccountModal() {
  if (!confirmDeleteAccountModal) {
    return;
  }

  pendingDeletePassword = "";
  if (confirmDeleteAccountStatus) {
    confirmDeleteAccountStatus.textContent = "";
  }
  confirmDeleteAccountModal.hidden = true;
}

async function deleteCurrentUserAccount() {
  if (!currentUser || !firebaseAuth || !firebaseDb) {
    confirmDeleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  if (!pendingDeletePassword) {
    confirmDeleteAccountStatus.textContent = "Devam etmek için şifreni yeniden yazmalısın.";
    confirmDeleteAccountModal.hidden = true;
    openDeleteAccountModal();
    return;
  }

  const user = currentUser;

  try {
    confirmDeleteAccountStatus.textContent = "Kullanıcı ve bulut kayıtları siliniyor...";
    await reauthenticateCurrentUser(pendingDeletePassword);
    await deleteUserCloudData(user.uid);
    clearUserLocalData(user.uid);
    await user.delete();
    transactions = [];
    assets = [];
    besAccounts = [];
    paymentAccounts = [];
    render();
    closeDeleteAccountModal();
    closeConfirmDeleteAccountModal();
    deleteUserStatus.textContent = "";
    cloudStatus.textContent = "Kullanıcı hesabı silindi.";
  } catch (error) {
    confirmDeleteAccountStatus.textContent = getFirebaseErrorMessage(error);
  }
}

async function deleteUserCloudData(userId) {
  const collection = getUserTransactionsCollection(userId);
  const snapshot = await collection.get();
  let batch = firebaseDb.batch();
  let operationCount = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    operationCount += 1;

    if (operationCount === 450) {
      await batch.commit();
      batch = firebaseDb.batch();
      operationCount = 0;
    }
  }

  batch.delete(firebaseDb.collection("users").doc(userId));

  await batch.commit();
}

function clearUserLocalData(userId) {
  [STORAGE_KEY, ASSETS_STORAGE_KEY, BES_STORAGE_KEY, PAYMENT_ACCOUNTS_STORAGE_KEY].forEach((baseKey) => {
    localStorage.removeItem(`${baseKey}-${userId}`);
  });
}

function getAuthCredentials() {
  const username = authEmail.value.trim();
  const password = authPassword.value;

  if (!username || password.length < 6) {
    cloudStatus.textContent = "Kullanıcı adı/e-posta ve en az 6 karakterli şifre gir.";
    return null;
  }

  return { email: usernameToEmail(username), password, username };
}

function getSignupCredentials() {
  const email = signupEmail.value.trim().toLowerCase();
  const username = signupUsername.value.trim();
  const password = signupPassword.value;
  const confirmPassword = signupPasswordConfirm.value;

  if (!email || !email.includes("@")) {
    signupStatus.textContent = "Geçerli bir mail adresi yaz.";
    signupEmail.focus();
    return null;
  }

  if (!username) {
    signupStatus.textContent = "Kullanıcı adı boş olamaz.";
    signupUsername.focus();
    return null;
  }

  if (password.length < 6) {
    signupStatus.textContent = "Şifre en az 6 karakter olmalı.";
    signupPassword.focus();
    return null;
  }

  if (password !== confirmPassword) {
    signupStatus.textContent = "Şifre ve şifre onay aynı olmalı.";
    signupPasswordConfirm.focus();
    return null;
  }

  return { email, username, password };
}

function loadLastUsername() {
  try {
    return localStorage.getItem(LAST_USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

function saveLastUsername(emailOrUsername) {
  const username = emailToUsername(emailOrUsername).trim();

  if (!username) {
    return;
  }

  try {
    localStorage.setItem(LAST_USERNAME_KEY, username);
  } catch {
    // Username memory is only a convenience.
  }
}

function usernameToEmail(username) {
  const value = String(username || "").trim();

  if (value.includes("@")) {
    return value.toLowerCase();
  }

  const safeUsername = normalizeBankText(value).replace(/\s+/g, "");
  return `${safeUsername}@${USERNAME_EMAIL_DOMAIN}`;
}

function emailToUsername(email) {
  const value = String(email || "");
  const suffix = `@${USERNAME_EMAIL_DOMAIN}`;

  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

function getUserDisplayName(user = currentUser) {
  if (!user) {
    return "";
  }

  return (user.displayName || emailToUsername(user.email) || "").trim();
}

async function handleAuthStateChanged(user) {
  if (cloudUnsubscribe) {
    cloudUnsubscribe();
    cloudUnsubscribe = null;
  }

  if (profileUnsubscribe) {
    profileUnsubscribe();
    profileUnsubscribe = null;
  }

  if (!user) {
    currentUser = null;
    deletedTransactionIds = loadDeletedTransactionIds();
    deletedTransactionSignatures = loadDeletedTransactionSignatures();
    deletedTransferTombstones = loadDeletedTransferTombstones();
    refreshCardReminderSettingsForCurrentUser();
    transactions = loadTransactions();
    assets = loadAssets();
    besAccounts = loadBesAccounts();
    paymentAccounts = loadPaymentAccounts();
    transactionCategories = loadTransactionCategories();
    syncCategorySelects();
    renderAuthState();
    render();
    cloudStatus.textContent = firebaseDb
      ? "Çıkış yapıldı. Bu cihazdaki yerel kayıtları görüyorsun."
      : cloudStatus.textContent;
    return;
  }

  const anonymousLocalTransactions = getCloudReadyTransactions(transactions);
  const anonymousLocalAssets = getCloudReadyAssets(assets);
  const anonymousLocalBesAccounts = getCloudReadyBesAccounts(besAccounts);
  const anonymousLocalPaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  const anonymousLocalCategories = normalizeCategoryState(transactionCategories);
  currentUser = user;
  deletedTransactionIds = loadDeletedTransactionIds();
  deletedTransactionSignatures = loadDeletedTransactionSignatures();
  deletedTransferTombstones = loadDeletedTransferTombstones();
  refreshCardReminderSettingsForCurrentUser();
  const userLocalTransactions = getCloudReadyTransactions(loadTransactions());
  const userLocalAssets = getCloudReadyAssets(loadAssets());
  const userLocalBesAccounts = getCloudReadyBesAccounts(loadBesAccounts());
  const userLocalPaymentAccounts = getCloudReadyPaymentAccounts(loadPaymentAccounts());
  const userLocalCategories = loadTransactionCategories();
  transactions = mergeTransactions(userLocalTransactions, anonymousLocalTransactions);
  assets = mergeRecordsById(userLocalAssets, anonymousLocalAssets);
  besAccounts = mergeRecordsById(userLocalBesAccounts, anonymousLocalBesAccounts);
  paymentAccounts = mergeRecordsById(userLocalPaymentAccounts, anonymousLocalPaymentAccounts);
  transactionCategories = mergeCategoryStates(
    userLocalCategories,
    anonymousLocalCategories,
    getTransactionCategoriesFromRecords(transactions)
  );
  persistTransactionCategories({ syncCloud: false });
  syncCategorySelects();
  renderAuthState();
  render();
  cloudStatus.textContent = "Bulut kayıtları yükleniyor...";

  try {
    const cloudProfile = await fetchCloudProfile(user.uid);
    const cloudTransactions = await fetchCloudTransactions(user.uid);
    transactions = mergeTransactions(cloudTransactions, userLocalTransactions, anonymousLocalTransactions);
    assets = mergeRecordsById(readCloudAssets(cloudProfile.assets), userLocalAssets, anonymousLocalAssets);
    besAccounts = mergeRecordsById(
      readCloudBesAccounts(cloudProfile.besAccounts),
      userLocalBesAccounts,
      anonymousLocalBesAccounts
    );
    paymentAccounts = mergeRecordsById(
      readCloudPaymentAccounts(cloudProfile.paymentAccounts),
      userLocalPaymentAccounts,
      anonymousLocalPaymentAccounts
    );
    transactionCategories = mergeCategoryStates(
      readCloudTransactionCategories(cloudProfile.transactionCategories),
      userLocalCategories,
      anonymousLocalCategories,
      getTransactionCategoriesFromRecords(transactions)
    );
    persistTransactions({ syncCloud: false });
    persistAssets({ syncCloud: false });
    persistBesAccounts({ syncCloud: false });
    persistPaymentAccounts({ syncCloud: false });
    persistTransactionCategories({ syncCloud: false });
    syncCategorySelects();
    render();
    await Promise.all([syncTransactionsToCloud({ replace: true }), syncUserProfileToCloud()]);
    subscribeCloudTransactions(user.uid);
    subscribeCloudProfile(user.uid);
    cloudStatus.textContent = `${transactions.length} kayıt bulutla eşitlendi.`;
  } catch (error) {
    cloudStatus.textContent = `Bulut kayıtları yüklenemedi: ${error.message}`;
  }
}

function renderAuthState() {
  const signedIn = Boolean(currentUser);
  const hasOpenAuthSubPanel =
    !signedIn && ((signupForm && !signupForm.hidden) || (resetPasswordForm && !resetPasswordForm.hidden));

  loginScreen.hidden = signedIn || !startupSplashFinished;
  appShell.hidden = !signedIn || !startupSplashFinished;
  loginScreen.setAttribute("aria-hidden", loginScreen.hidden ? "true" : "false");
  appShell.setAttribute("aria-hidden", appShell.hidden ? "true" : "false");
  if (!hasOpenAuthSubPanel) {
    showAuthPanel("login");
  }
  if (logoutButton) {
    logoutButton.hidden = !signedIn;
  }
  if (footerLogoutButton) {
    footerLogoutButton.hidden = !signedIn;
  }
  authUserBadge.textContent = signedIn ? getUserDisplayName(currentUser) || "Giriş yapıldı" : "Giriş yapılmadı";
  appUserEmail.textContent = signedIn ? getUserDisplayName(currentUser) || "Bulut hesabı" : "";
  setMobileSidebarOpen(false);

  if (signedIn) {
    saveLastUsername(getUserDisplayName(currentUser));
    authPassword.value = "";
    fillProfileForm();
  } else {
    authEmail.value = loadLastUsername();
    authPassword.value = "";
  }
}

function fetchCloudProfile(userId) {
  return firebaseDb
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => (doc.exists ? doc.data() || {} : {}));
}

function subscribeCloudProfile(userId) {
  profileUnsubscribe = firebaseDb
    .collection("users")
    .doc(userId)
    .onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        const data = doc.data() || {};

        if (Array.isArray(data.assets)) {
          assets = readCloudAssets(data.assets);
          persistAssets({ syncCloud: false });
        }

        if (Array.isArray(data.besAccounts)) {
          besAccounts = readCloudBesAccounts(data.besAccounts);
          persistBesAccounts({ syncCloud: false });
        }

        if (Array.isArray(data.paymentAccounts)) {
          paymentAccounts = readCloudPaymentAccounts(data.paymentAccounts);
          persistPaymentAccounts({ syncCloud: false });
        }

        if (hasCategoryState(data.transactionCategories)) {
          transactionCategories = mergeCategoryStates(
            data.transactionCategories,
            transactionCategories,
            getTransactionCategoriesFromRecords(transactions)
          );
          persistTransactionCategories({ syncCloud: false });
          syncCategorySelects();
        }

        renderAssets();
        renderPaymentAccounts();
        renderBesAccounts();
        renderHome();
      },
      (error) => {
        cloudStatus.textContent = `Profil dinleme hatası: ${error.message}`;
      }
    );
}

function fetchCloudTransactions(userId) {
  return getUserTransactionsCollection(userId)
    .get()
    .then((snapshot) => snapshot.docs.map(readCloudTransaction).filter(Boolean).filter((item) => !isTransactionDeleted(item)));
}

function subscribeCloudTransactions(userId) {
  cloudUnsubscribe = getUserTransactionsCollection(userId).onSnapshot(
    { includeMetadataChanges: true },
    (snapshot) => {
      const cloudTransactions = snapshot.docs
        .map(readCloudTransaction)
        .filter(Boolean)
        .filter((item) => !isTransactionDeleted(item));
      transactions = mergeTransactions(transactions, cloudTransactions);
      transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
      persistTransactionCategories({ syncCloud: false });
      syncCategorySelects();
      persistTransactions({ syncCloud: false });
      render();
      const sourceLabel = snapshot.metadata?.fromCache ? "yerel önbellekten" : "buluttan";
      cloudStatus.textContent = `${transactions.length} kayıt ${sourceLabel} güncel.`;
    },
    (error) => {
      cloudStatus.textContent = `Bulut dinleme hatası: ${error.message}`;
    }
  );
}

function syncTransactionsToCloud(options = {}) {
  const { replace = false } = options;

  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  const user = currentUser;
  const safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));
  const syncVersion = ++cloudTransactionsSyncVersion;
  const writeTransactions = async () => {
    if (syncVersion !== cloudTransactionsSyncVersion) {
      return;
    }

    const collection = getUserTransactionsCollection(user.uid);
    const batch = firebaseDb.batch();

    if (replace) {
      const snapshot = await collection.get();
      if (syncVersion !== cloudTransactionsSyncVersion) {
        return;
      }

      const currentIds = new Set(safeTransactions.map((item) => item.id));
      snapshot.docs.forEach((doc) => {
        if (!currentIds.has(doc.id)) {
          batch.delete(doc.ref);
        }
      });
    }

    safeTransactions.forEach((transaction) => {
      batch.set(collection.doc(transaction.id), toCloudTransaction(transaction), { merge: true });
    });

    batch.set(
      firebaseDb.collection("users").doc(user.uid),
      {
        email: user.email || "",
        username: getUserDisplayName(user),
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    cloudStatus.textContent = "Buluta kaydediliyor...";
    await batch.commit();

    if (syncVersion === cloudTransactionsSyncVersion) {
      cloudStatus.textContent = `${safeTransactions.length} kayıt buluta kaydedildi.`;
    }
  };

  const syncPromise = writeTransactions().catch((error) => {
    if (syncVersion === cloudTransactionsSyncVersion) {
      cloudStatus.textContent = `Buluta kaydedilemedi: ${error.message}`;
    }
  });

  if (replace) {
    cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(() => syncPromise);
    return cloudWriteQueue;
  }

  return syncPromise;
}


function syncUserProfileToCloud() {
  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  const user = currentUser;
  const syncVersion = ++cloudProfileSyncVersion;
  const safeAssets = getCloudReadyAssets(assets);
  const safeBesAccounts = getCloudReadyBesAccounts(besAccounts);
  const safePaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  const safeTransactionCategories = normalizeCategoryState(transactionCategories);

  const syncPromise = firebaseDb
    .collection("users")
    .doc(user.uid)
    .set(
      {
        email: user.email || "",
        username: getUserDisplayName(user),
        assets: safeAssets,
        besAccounts: safeBesAccounts,
        paymentAccounts: safePaymentAccounts,
        transactionCategories: safeTransactionCategories,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
    .then(() => {
      if (syncVersion === cloudProfileSyncVersion) {
        cloudStatus.textContent = "Kart, hesap, varlık, BES ve kategori bilgileri buluta kaydedildi.";
      }
    })
    .catch((error) => {
      if (syncVersion === cloudProfileSyncVersion) {
        cloudStatus.textContent = `Profil buluta kaydedilemedi: ${error.message}`;
      }
    });

  return syncPromise;
}


function getUserTransactionsCollection(userId) {
  return firebaseDb.collection("users").doc(userId).collection("transactions");
}

function toCloudTransaction(transaction) {
  return {
    id: transaction.id,
    type: transaction.type,
    title: transaction.title,
    amount: Number(transaction.amount),
    category: transaction.category,
    paymentMethod: normalizePaymentMethod(transaction.paymentMethod || "cash"),
    paymentAccountId: String(transaction.paymentAccountId || ""),
    transferAccountId: String(transaction.transferAccountId || ""),
    transferFee: Math.max(0, Number(transaction.transferFee || 0)),
    date: transaction.date,
    note: transaction.note || "",
    transactionAt: transaction.transactionAt || "",
    createdAt: transaction.createdAt || "",
    updatedAt: transaction.updatedAt || window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

function readCloudTransaction(doc) {
  const data = doc.data() || {};
  const transaction = {
    id: doc.id,
    type: data.type,
    title: String(data.title || ""),
    amount: Number(data.amount),
    category: String(data.category || ""),
    paymentMethod: normalizePaymentMethod(data.paymentMethod || "cash"),
    paymentAccountId: String(data.paymentAccountId || ""),
    transferAccountId: String(data.transferAccountId || ""),
    transferFee: Math.max(0, Number(data.transferFee || 0)),
    date: String(data.date || ""),
    note: String(data.note || ""),
    transactionAt: String(data.transactionAt || ""),
    createdAt: String(data.createdAt || ""),
    updatedAt: normalizeCloudTimestamp(data.updatedAt),
  };

  return isValidTransaction(transaction) ? transaction : null;
}

function getCloudReadyTransactions(source) {
  return source.filter((item) => isValidTransaction(item) && !isSampleTransaction(item));
}

function getCloudReadyAssets(source) {
  return readCloudAssets(source);
}

function getCloudReadyBesAccounts(source) {
  return readCloudBesAccounts(source);
}

function getCloudReadyPaymentAccounts(source) {
  return readCloudPaymentAccounts(source);
}

function readCloudAssets(source) {
  return Array.isArray(source) ? source.map(normalizeAsset).filter(Boolean) : [];
}

function readCloudBesAccounts(source) {
  return Array.isArray(source) ? source.map(normalizeBesAccount).filter(Boolean) : [];
}

function readCloudPaymentAccounts(source) {
  return Array.isArray(source) ? source.map(normalizePaymentAccount).filter(Boolean) : [];
}

function normalizeAsset(item) {
  if (!item || typeof item.id !== "string" || !assetDefinitions[item.type]) {
    return null;
  }

  const amount = Number(item.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  const definition = getAssetDefinition(item.type);
  return {
    id: item.id,
    type: item.type,
    label: String(item.label || definition.label),
    amount,
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function normalizeBesAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  const provider = String(item.provider || "").trim();
  const contribution = Number(item.contribution || 0);
  const stateContribution = Number(item.stateContribution || 0);
  const stateGain = Number(item.stateGain || 0);
  const gain = Number(item.gain || 0);

  if (
    !provider ||
    !Number.isFinite(contribution) ||
    !Number.isFinite(stateContribution) ||
    !Number.isFinite(stateGain) ||
    !Number.isFinite(gain)
  ) {
    return null;
  }

  return {
    id: item.id,
    provider,
    policyNo: String(item.policyNo || ""),
    contribution,
    stateContribution,
    stateGain,
    gain,
    note: String(item.note || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function normalizePaymentAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  const type = normalizePaymentAccountType(item.type);
  const name = String(item.name || "").trim();
  const balance = Number(item.balance || 0);
  const debt = Number(item.debt || 0);
  const currentStatementDebt = Number(item.currentStatementDebt ?? debt);
  const creditPaidTotal = Number(item.creditPaidTotal || 0);
  const currentStatementPaidTotal = Number(item.currentStatementPaidTotal || 0);
  const limit = Number(item.limit || 0);
  const openingBalance = hasStoredMoneyValue(item.openingBalance) ? Number(item.openingBalance) : null;
  const openingDebt = hasStoredMoneyValue(item.openingDebt) ? Number(item.openingDebt) : null;
  const openingCurrentStatementDebt = hasStoredMoneyValue(item.openingCurrentStatementDebt)
    ? Number(item.openingCurrentStatementDebt)
    : null;

  if (
    !name ||
    !Number.isFinite(balance) ||
    !Number.isFinite(debt) ||
    !Number.isFinite(currentStatementDebt) ||
    !Number.isFinite(creditPaidTotal) ||
    !Number.isFinite(currentStatementPaidTotal) ||
    !Number.isFinite(limit)
  ) {
    return null;
  }

  return {
    id: item.id,
    type,
    name,
    bank: String(item.bank || ""),
    color: normalizePaymentCardColor(item.color, type),
    last4: String(item.last4 || "").replace(/\D/g, "").slice(-4),
    expiry: type === "credit_card" ? String(item.expiry || "") : "",
    statementDay: type === "credit_card" ? clampDay(item.statementDay) : 0,
    dueDay: type === "credit_card" ? clampDay(item.dueDay) : 0,
    limit: type === "credit_card" ? Math.max(0, roundMoney(limit)) : 0,
    debt: type === "credit_card" ? Math.max(0, roundMoney(debt)) : 0,
    currentStatementDebt: type === "credit_card" ? Math.max(0, roundMoney(currentStatementDebt)) : 0,
    openingDebt: type === "credit_card" && openingDebt !== null ? Math.max(0, roundMoney(openingDebt)) : null,
    openingCurrentStatementDebt: type === "credit_card" && openingCurrentStatementDebt !== null ? Math.max(0, roundMoney(openingCurrentStatementDebt)) : null,
    creditPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(creditPaidTotal)) : 0,
    currentStatementPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(currentStatementPaidTotal)) : 0,
    creditPaidPeriodKey: type === "credit_card" ? String(item.creditPaidPeriodKey || "") : "",
    balance: type !== "credit_card" ? roundMoney(balance) : 0,
    openingBalance: type !== "credit_card" && openingBalance !== null ? roundMoney(openingBalance) : null,
    note: String(item.note || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function mergeRecordsById(...sources) {
  const merged = new Map();

  sources
    .flat()
    .filter((item) => item && typeof item.id === "string")
    .forEach((item) => {
      merged.set(item.id, item);
    });

  return Array.from(merged.values());
}

function normalizeCloudTimestamp(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Number.isFinite(Number(value.seconds))) {
    return new Date(Number(value.seconds) * 1000).toISOString();
  }

  return "";
}

function normalizeTransactionRecord(item) {
  if (!isValidTransaction(item)) {
    return null;
  }

  return {
    ...item,
    amount: Number(item.amount),
    transferFee: Math.max(0, Number(item.transferFee || 0)),
    paymentMethod: item.type === "transfer" ? "transfer" : normalizePaymentMethod(item.paymentMethod || "cash"),
    paymentAccountId: String(item.paymentAccountId || ""),
    transferAccountId: item.type === "transfer" ? String(item.transferAccountId || "") : "",
    note: String(item.note || ""),
    transactionAt: String(item.transactionAt || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

function getTransactionMergeTimestamp(item) {
  return (
    getRecordTimestamp(item?.updatedAt) ||
    getRecordTimestamp(item?.createdAt) ||
    getTransactionSortTimestamp(item) ||
    0
  );
}

function shouldReplaceMergedTransaction(existing, next) {
  if (!existing) {
    return true;
  }

  if (existing.id === next.id) {
    if (next.type === "transfer" && existing.type !== "transfer") {
      return true;
    }

    if (existing.type === "transfer" && next.type !== "transfer" && isLegacySplitRowForTransfer(existing, next)) {
      return false;
    }
  }

  const existingTime = getTransactionMergeTimestamp(existing);
  const nextTime = getTransactionMergeTimestamp(next);

  if (nextTime !== existingTime) {
    return nextTime > existingTime;
  }

  return String(next.id || "") > String(existing.id || "");
}

function mergeTransactions(...sources) {
  const byId = new Map();

  sources
    .flat()
    .map(normalizeTransactionRecord)
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item))
    .forEach((transaction) => {
      const existing = byId.get(transaction.id);
      if (shouldReplaceMergedTransaction(existing, transaction)) {
        byId.set(transaction.id, transaction);
      }
    });

  const bySignature = new Map();
  Array.from(byId.values()).forEach((transaction) => {
    const signature = getTransactionSignature(transaction);
    const existing = bySignature.get(signature);

    if (shouldReplaceMergedTransaction(existing, transaction)) {
      bySignature.set(signature, transaction);
    }
  });

  const records = Array.from(bySignature.values());
  return coalesceLegacyTransferPairs(removeLegacyRowsCoveredByTransfers(records)).sort(compareTransactionsNewestFirst);
}

function isTransferLikeRecord(item) {
  const text = normalizeBankText([item?.title, item?.category, item?.note].filter(Boolean).join(" "));

  if (!text) {
    return false;
  }

  return [
    "transfer",
    "para transferi",
    "hesap transferi",
    "hesap aktarimi",
    "aktarim",
    "aktarma",
    "virman",
    "havale",
    "eft",
    "fast",
    "hesaba",
    "hesabima",
    "hesabindan",
    "diger hesap",
    "maas hesab",
    "kart odemesi",
  ].some((keyword) => text.includes(keyword));
}

function areSameTransactionAmount(first, second) {
  return Math.abs(Number(first?.amount || 0) - Number(second?.amount || 0)) < 0.01;
}

function getComparableTransactionMinute(item) {
  const time = getTransactionTime(item);
  return time ? time.slice(0, 5) : "";
}

function haveCompatibleTransferTimes(first, second) {
  const firstMinute = getComparableTransactionMinute(first);
  const secondMinute = getComparableTransactionMinute(second);
  return !firstMinute || !secondMinute || firstMinute === secondMinute;
}

function hasSameTransferDayAndAmount(first, second) {
  return (
    String(first?.date || "") === String(second?.date || "") &&
    areSameTransactionAmount(first, second) &&
    haveCompatibleTransferTimes(first, second)
  );
}

function isLegacySplitRowForTransfer(transfer, candidate) {
  if (!transfer || !candidate || transfer.type !== "transfer" || candidate.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(transfer, candidate)) {
    return false;
  }

  const sourceId = String(transfer.paymentAccountId || "");
  const targetId = String(transfer.transferAccountId || "");
  const candidateAccountId = String(candidate.paymentAccountId || "");

  if (!sourceId || !targetId || !candidateAccountId) {
    return false;
  }

  const isSourceExpense = candidate.type === "expense" && candidateAccountId === sourceId;
  const isTargetIncome = candidate.type === "income" && candidateAccountId === targetId;

  return (isSourceExpense || isTargetIncome) && isTransferLikeRecord(candidate);
}

function removeLegacyRowsCoveredByTransfers(source = []) {
  const transfers = source.filter((item) => item.type === "transfer");

  if (!transfers.length) {
    return source;
  }

  return source.filter((item) => {
    if (item.type === "transfer") {
      return true;
    }

    return !transfers.some((transfer) => transfer.id !== item.id && isLegacySplitRowForTransfer(transfer, item));
  });
}

function isLikelySplitTransferPair(first, second) {
  if (!first || !second || first.type === second.type || first.type === "transfer" || second.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(first, second)) {
    return false;
  }

  const firstAccountId = String(first.paymentAccountId || "");
  const secondAccountId = String(second.paymentAccountId || "");

  if (!firstAccountId || !secondAccountId || firstAccountId === secondAccountId) {
    return false;
  }

  return isTransferLikeRecord(first) || isTransferLikeRecord(second);
}

function getTransactionPairScore(first, second) {
  let score = 0;

  if (getComparableTransactionMinute(first) && getComparableTransactionMinute(first) === getComparableTransactionMinute(second)) {
    score += 4;
  }

  if (normalizeBankText(first.note) && normalizeBankText(first.note) === normalizeBankText(second.note)) {
    score += 2;
  }

  if (isTransferLikeRecord(first)) score += 1;
  if (isTransferLikeRecord(second)) score += 1;

  return score;
}

function buildTransferFromSplitPair(first, second) {
  const expense = first.type === "expense" ? first : second;
  const income = first.type === "income" ? first : second;
  const updatedAt = [expense.updatedAt, income.updatedAt]
    .filter(Boolean)
    .sort((left, right) => getRecordTimestamp(right) - getRecordTimestamp(left))[0] || getTurkeyNowDateTime();
  const createdAt = [expense.createdAt, income.createdAt].filter(Boolean).sort()[0] || expense.createdAt || income.createdAt || updatedAt;
  const notes = [expense.note, income.note].map((value) => String(value || "").trim()).filter(Boolean);
  const uniqueNotes = [...new Set(notes)];

  return {
    ...expense,
    id: expense.id,
    type: "transfer",
    title: (expense.title || income.title || "Hesaplar Arası Transfer").slice(0, 40),
    amount: roundMoney(Number(expense.amount || income.amount || 0)),
    category: "Transfer",
    paymentMethod: "transfer",
    paymentAccountId: String(expense.paymentAccountId || ""),
    transferAccountId: String(income.paymentAccountId || ""),
    transferFee: 0,
    date: expense.date || income.date,
    note: uniqueNotes.join(" · ").slice(0, 100),
    transactionAt: expense.transactionAt || income.transactionAt || "",
    createdAt,
    updatedAt,
  };
}

function coalesceLegacyTransferPairs(source = []) {
  const records = [...source];
  const usedIds = new Set();
  const result = [];

  records.forEach((item) => {
    if (usedIds.has(item.id)) {
      return;
    }

    if (item.type !== "expense") {
      return;
    }

    const candidates = records
      .filter((candidate) => !usedIds.has(candidate.id) && candidate.id !== item.id && candidate.type === "income")
      .filter((candidate) => isLikelySplitTransferPair(item, candidate))
      .sort((first, second) => getTransactionPairScore(item, second) - getTransactionPairScore(item, first));

    if (!candidates.length) {
      return;
    }

    const income = candidates[0];
    usedIds.add(item.id);
    usedIds.add(income.id);
    result.push(buildTransferFromSplitPair(item, income));
  });

  records.forEach((item) => {
    if (!usedIds.has(item.id)) {
      result.push(item);
    }
  });

  return result;
}

function getLegacyTransferCounterpartIds(transfer, previousTransaction = null) {
  const ids = new Set();

  if (!transfer || transfer.type !== "transfer") {
    return ids;
  }

  transactions.forEach((candidate) => {
    if (candidate.id === transfer.id || isTransactionDeleted(candidate.id)) {
      return;
    }

    if (isLegacySplitRowForTransfer(transfer, candidate)) {
      ids.add(candidate.id);
      return;
    }

    if (previousTransaction && isLikelySplitTransferPair(previousTransaction, candidate)) {
      const previousWasSourceExpense = previousTransaction.type === "expense";
      const candidateIsTargetIncome = candidate.type === "income" && String(candidate.paymentAccountId || "") === String(transfer.transferAccountId || "");
      const previousWasTargetIncome = previousTransaction.type === "income";
      const candidateIsSourceExpense = candidate.type === "expense" && String(candidate.paymentAccountId || "") === String(transfer.paymentAccountId || "");

      if ((previousWasSourceExpense && candidateIsTargetIncome) || (previousWasTargetIncome && candidateIsSourceExpense)) {
        ids.add(candidate.id);
      }
    }
  });

  return ids;
}

function isSampleTransaction(item) {
  return ["Nisan Maaşı", "Haftalık Market", "Elektrik Faturası"].includes(item.title);
}

function getFirebaseErrorMessage(error) {
  const code = error && error.code;

  if (code === "auth/email-already-in-use") {
    return "Bu e-posta ile hesap zaten var. Giriş yapmayı dene.";
  }

  if (code === "auth/requires-recent-login") {
    return "Güvenlik için yeniden giriş yapıp profil güncellemeyi tekrar dene.";
  }

  if (code === "auth/invalid-email") {
    return "E-posta adresi geçerli değil.";
  }

  if (code === "auth/weak-password") {
    return "Şifre en az 6 karakter olmalı.";
  }

  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "E-posta veya şifre hatalı.";
  }

  if (code === "auth/missing-email") {
    return "Parola sıfırlama için e-posta adresi gerekli.";
  }

  return error && error.message ? error.message : "İşlem tamamlanamadı.";
}

function setBankImportLoading(isLoading) {
  bankImportStatus?.classList.toggle("is-loading", Boolean(isLoading));
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId = null;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  });
}

function handleBankImportFile(event) {
  pendingBankFiles = Array.from(event.target.files || []);
  pendingBankImports = [];
  renderBankImportPreview();

  if (bankImportAddButton) {
    bankImportAddButton.textContent = "Yapay Zeka ile Kayıtlara Ekle";
  }
  if (bankImportLocalButton) {
    bankImportLocalButton.textContent = "Kayıtlara Ekle";
  }

  if (!pendingBankFiles.length) {
    bankImportStatus.textContent = "Henüz banka hareketi okunmadı.";
    return;
  }

  const names = pendingBankFiles.map((file) => file.name).join(", ");
  bankImportStatus.textContent =
    `${pendingBankFiles.length} dosya seçildi: ${names}. Yapay zeka ile ya da normal önizleme ile kontrol edebilirsin.`;
}

function isPdfFile(file) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function isImageFile(file) {
  return file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name);
}

function getImportedMovementSortTime(item) {
  if (!item) {
    return 0;
  }

  const transactionAt = item.transactionAt || "";
  if (transactionAt) {
    const timestamp = Date.parse(transactionAt);
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  const date = item.date || "";
  const time = getTimePart(item.raw || item.title || item.note || transactionAt || "") || getTimePart(transactionAt) || "00:00";
  const timestamp = Date.parse(buildTransactionDateTime(date, time));

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function compareImportedMovementsNewestFirst(first, second) {
  return getImportedMovementSortTime(second) - getImportedMovementSortTime(first);
}

function buildPendingBankImportItems(parsedMovements, sourceName = "", existingSignatures = null, seenSignatures = null, options = {}) {
  const existing = existingSignatures || new Set(transactions.map(getTransactionSignature));
  const seen = seenSignatures || new Set();
  const selectedAccount = options.paymentAccountId
    ? paymentAccounts.find((item) => item.id === options.paymentAccountId)
    : getBankImportSelectedAccount();
  const selectedTransferAccount = options.transferAccountId
    ? paymentAccounts.find((item) => item.id === options.transferAccountId)
    : getBankImportSelectedTransferAccount();
  const paymentAccountId = selectedAccount ? selectedAccount.id : "";
  const transferAccountId =
    selectedTransferAccount && selectedTransferAccount.id !== paymentAccountId ? selectedTransferAccount.id : "";
  const paymentMethod = getPaymentMethodForImportAccount(selectedAccount);
  const importLabel = String(options.importLabel || "Yapay zeka banka önizleme");

  return parsedMovements.map((movement) => {
    const title = cleanBankTitle(movement.title) || "Banka Hareketi";
    const amount = Number(movement.amount);
    const date = movement.date;
    const type = movement.type || inferTransactionType(title, movement.sign, movement.hasExplicitSign);
    const createdAt = getTurkeyNowDateTime();
    const movementTime = getTimePart(movement.raw || title);

    if (!date || !Number.isFinite(amount) || amount <= 0) {
      return {
        valid: false,
        duplicate: false,
        raw: movement.raw || "",
        sourceName,
        reason: "Tarih, açıklama veya tutar okunamadı.",
      };
    }

    const transaction = {
      id: crypto.randomUUID(),
      type,
      title: title.slice(0, 40),
      amount: Number(amount.toFixed(2)),
      category: categorizeBankTransaction(title, type),
      paymentMethod,
      paymentAccountId,
      transferAccountId,
      date,
      note: sourceName ? `${importLabel} · ${sourceName}` : importLabel,
      transactionAt: movementTime ? buildTransactionDateTime(date, movementTime) : "",
      createdAt,
    };
    const signature = getTransactionSignature(transaction);
    const duplicate = existing.has(signature) || seen.has(signature);

    if (!duplicate) {
      seen.add(signature);
    }

    return {
      valid: true,
      duplicate,
      transaction,
      raw: movement.raw || "",
      sourceName,
      reason: duplicate ? "Bu hareket zaten kayıtlı görünüyor." : "",
    };
  });
}

async function addSelectedBankFiles() {
  if (pendingBankImports.length) {
    confirmBankImport();
    return;
  }

  if (!pendingBankFiles.length && !bankImportText.value.trim()) {
    bankImportStatus.textContent = "Önce PDF, CSV, TXT ya da ekran görüntüsü seç.";
    return;
  }

  const allPendingImports = [];
  const failedFiles = [];
  const existingSignatures = new Set(transactions.map(getTransactionSignature));
  const seenSignatures = new Set();

  if (bankImportAddButton) {
    bankImportAddButton.disabled = true;
  }
  if (bankImportLocalButton) {
    bankImportLocalButton.disabled = true;
    bankImportLocalButton.textContent = "Okunuyor...";
  }
  bankImportCancelButton.disabled = true;
  setBankImportLoading(true);
  bankImportStatus.textContent = pendingBankFiles.length
    ? `${pendingBankFiles.length} dosya okunuyor...`
    : "Yapıştırılan banka metni okunuyor...";

  try {
    for (let index = 0; index < pendingBankFiles.length; index += 1) {
      const file = pendingBankFiles[index];
      bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} okunuyor: ${file.name}`;

      try {
        const text = await readBankImportFile(file);
        const parsedMovements = parseBankMovements(text);
        const pendingItems = buildPendingBankImportItems(parsedMovements, file.name, existingSignatures, seenSignatures, {
          importLabel: "Banka içe aktarımı",
        });
        allPendingImports.push(...pendingItems);
      } catch (error) {
        failedFiles.push(`${file.name}${error?.message ? ` (${error.message})` : ""}`);
      }
    }

    const pastedText = bankImportText.value.trim();

    if (pastedText) {
      allPendingImports.push(
        ...buildPendingBankImportItems(parseBankMovements(pastedText), "Yapıştırılan metin", existingSignatures, seenSignatures, {
          importLabel: "Banka içe aktarımı",
        })
      );
    }

    pendingBankImports = allPendingImports
      .slice()
      .sort((first, second) => compareImportedMovementsNewestFirst(first.transaction, second.transaction));
    applyBankImportAccountToPending(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
    renderBankImportPreview();

    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

    if (!pendingBankImports.length) {
      bankImportStatus.textContent =
        "Seçilen dosyalardan hareket okunamadı. Görseldeki satırları daha net okumak için banka hareketleri ekranını tam ve parlak şekilde yükle." +
        (failedFiles.length ? ` Okunamayan dosya: ${failedFiles.join(", ")}.` : "");
      if (bankImportLocalButton) {
        bankImportLocalButton.textContent = "Kayıtlara Ekle";
      }
      return;
    }

    bankImportStatus.textContent =
      `${readyCount} hareket onay bekliyor. Eklemek istediklerinin kutusu işaretli kalsın, sonra yeşil butona tekrar bas.` +
      (duplicateCount ? ` ${duplicateCount} tekrar işaretlenmedi.` : "") +
      (invalidCount ? ` ${invalidCount} satır okunamadı.` : "") +
      (failedFiles.length ? ` Okunamayan dosya: ${failedFiles.join(", ")}.` : "");
    if (bankImportLocalButton) {
      bankImportLocalButton.textContent = "Seçilenleri Onayla ve Ekle";
    }
    openBankImportPreviewModal();
  } catch (error) {
    pendingBankImports = [];
    renderBankImportPreview();
    closeBankImportPreviewModal();
    bankImportStatus.textContent = error?.message
      ? `Kayıtlara ekleme hazırlanamadı: ${error.message}`
      : "Kayıtlara ekleme hazırlanamadı. Dosyayı tekrar seç.";
    if (bankImportLocalButton) {
      bankImportLocalButton.textContent = "Kayıtlara Ekle";
    }
  } finally {
    setBankImportLoading(false);
    if (bankImportAddButton) {
      bankImportAddButton.disabled = false;
    }
    if (bankImportLocalButton) {
      bankImportLocalButton.disabled = false;
      if (!pendingBankImports.length) {
        bankImportLocalButton.textContent = "Kayıtlara Ekle";
      }
    }
    bankImportCancelButton.disabled = false;
  }
}


async function previewBankImportLocally(options = {}) {
  const { fallbackReason = "", updateStatus = true } = options;
  const allPendingImports = [];
  const failedFiles = [];
  const existingSignatures = new Set(transactions.map(getTransactionSignature));
  const seenSignatures = new Set();

  bankImportAddButton.disabled = true;
  if (bankImportLocalButton) {
    bankImportLocalButton.disabled = true;
  }
  bankImportCancelButton.disabled = true;
  setBankImportLoading(true);
  bankImportStatus.textContent = fallbackReason
    ? "Yapay zeka tamamlanamadı; normal önizleme hazırlanıyor..."
    : "Dosya ve metinler normal önizleme için okunuyor...";

  try {
    for (let index = 0; index < pendingBankFiles.length; index += 1) {
      const file = pendingBankFiles[index];
      bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} okunuyor: ${file.name}`;

      try {
        const text = await readBankImportFile(file);
        const parsedMovements = parseBankMovements(text);
        allPendingImports.push(
          ...buildPendingBankImportItems(parsedMovements, file.name, existingSignatures, seenSignatures, {
            importLabel: "Normal banka önizleme",
          })
        );
      } catch (error) {
        failedFiles.push(`${file.name}${error?.message ? ` (${error.message})` : ""}`);
      }
    }

    const pastedText = bankImportText.value.trim();

    if (pastedText) {
      allPendingImports.push(
        ...buildPendingBankImportItems(parseBankMovements(pastedText), "Yapıştırılan metin", existingSignatures, seenSignatures, {
          importLabel: "Normal banka önizleme",
        })
      );
    }

    pendingBankImports = allPendingImports;
    renderBankImportPreview();

    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

    if (!pendingBankImports.length) {
      bankImportStatus.textContent =
        "Önizleme ile hareket bulunamadı. Görsel/PDF sayfasında tarih, açıklama ve tutar tam görünmeli; mümkünse ekranı kırpmadan yükle." +
        (fallbackReason ? ` Yapay zeka mesajı: ${fallbackReason}` : "") +
        (failedFiles.length ? ` Okunamayan dosya: ${failedFiles.join(", ")}.` : "");
      if (bankImportAddButton) {
        bankImportAddButton.textContent = "Yapay Zeka ile Kayıtlara Ekle";
      }
      return false;
    }

    if (updateStatus) {
      bankImportStatus.textContent =
        `Önizleme ${readyCount} hareketi hazırladı.` +
        (fallbackReason ? " Yapay zeka kotası/token bittiğinde bu normal önizleme kullanıldı." : "") +
        (duplicateCount ? ` ${duplicateCount} tekrar işaretlenmedi.` : "") +
        (invalidCount ? ` ${invalidCount} satır okunamadı.` : "") +
        (failedFiles.length ? ` Okunamayan dosya: ${failedFiles.join(", ")}.` : "");
    }

    if (bankImportAddButton) {
      bankImportAddButton.textContent = "Önizlemeyi Aç";
    }

    openBankImportPreviewModal();
    return true;
  } finally {
    setBankImportLoading(false);
    bankImportAddButton.disabled = false;
    if (bankImportLocalButton) {
      bankImportLocalButton.disabled = false;
    }
    bankImportCancelButton.disabled = false;
  }
}

async function readBankImportFile(file) {
  if (isPdfFile(file)) {
    const buffer = await readFileAsArrayBuffer(file);
    let text = await extractPdfText(buffer);

    if (!text.trim()) {
      text = await extractPdfOcrText(buffer, file.name);
    }

    if (!text.trim()) {
      throw new Error("PDF içinde okunabilir metin veya OCR ile okunabilir sayfa bulunamadı.");
    }

    return text;
  }

  if (isImageFile(file)) {
    const text = await extractImageText(file);

    if (!text.trim()) {
      throw new Error("Görselde okunabilir metin bulunamadı.");
    }

    return text;
  }

  return readFileAsText(file);
}

async function previewBankImportWithAi() {
  if (!pendingBankFiles.length && !bankImportText.value.trim()) {
    bankImportStatus.textContent = "Yapay zeka ile önizleme için önce ekran görüntüsü, PDF, CSV/TXT seç veya metin yapıştır.";
    return;
  }

  const previousAddText = bankImportAddButton?.textContent || "Yapay Zeka ile Kayıtlara Ekle";

  bankImportAddButton.disabled = true;
  bankImportCancelButton.disabled = true;
  setBankImportLoading(true);
  if (bankImportAddButton) {
    bankImportAddButton.textContent = "Yapay Zeka Okuyor...";
  }
  bankImportStatus.textContent = "Yapay zeka banka ekranını ve sayfadaki gerçek hareket satırlarını algılıyor...";

  try {
    const payload = await buildBankAiImportPayload();
    const response = await fetch("/.netlify/functions/bank-ai-import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "AI servisi yanıt vermedi.");
    }

    const movements = normalizeAiBankMovements(data.movements || data.transactions || []);

    if (!movements.length) {
      throw new Error("AI hareket bulamadı.");
    }

    const existingSignatures = new Set(transactions.map(getTransactionSignature));
    const seenSignatures = new Set();
    pendingBankImports = movements.flatMap((movement) =>
      buildPendingBankImportItems(
        [movement],
        movement.sourceName || data.sourceName || "AI",
        existingSignatures,
        seenSignatures
      )
    );
    renderBankImportPreview();

    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

    if (bankImportAddButton) {
      bankImportAddButton.textContent = pendingBankImports.length ? "Önizlemeyi Aç" : previousAddText;
    }

    bankImportStatus.textContent =
      `Yapay zeka ${movements.length} hareket algıladı; ${readyCount} hareket onay bekliyor.` +
      (duplicateCount ? ` ${duplicateCount} tekrar işaretlenmedi.` : "") +
      (invalidCount ? ` ${invalidCount} satır kontrol istiyor.` : "") +
      " Düzenlemek ve eklemek için önizleme penceresini kontrol et.";
    openBankImportPreviewModal();
  } catch (error) {
    const message = getBankAiImportErrorMessage(error);

    bankImportStatus.textContent = `${message} Normal okuma için "Kayıtlara Ekle" butonunu kullanabilirsin.`;
  } finally {
    setBankImportLoading(false);
    bankImportAddButton.disabled = false;
    if (bankImportLocalButton) {
      bankImportLocalButton.disabled = false;
    }
    bankImportCancelButton.disabled = false;
    bankImportAddButton.textContent = pendingBankImports.length ? "Önizlemeyi Aç" : previousAddText;
  }
}

function getBankAiImportErrorMessage(error) {
  const message = String(error?.message || "");

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return (
      "Yapay zeka fonksiyonuna ulaşılamadı. Site Netlify üzerinde deploy edilmiş olmalı, " +
      "netlify/functions/bank-ai-import.js pakette kalmalı ve Netlify ayarlarında AI anahtarı tanımlı olmalı."
    );
  }

  return message || "Yapay zeka okuma tamamlanamadı.";
}

async function buildBankAiImportPayload() {
  const files = [];

  for (let index = 0; index < pendingBankFiles.length; index += 1) {
    const file = pendingBankFiles[index];
    bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} yapay zeka için hazırlanıyor: ${file.name}`;
    files.push(await readBankAiFilePayload(file));
  }

  const pastedText = bankImportText.value.trim();

  if (!files.length && pastedText) {
    files.push({
      name: "Yapıştırılan metin",
      kind: "text",
      mimeType: "text/plain",
      text: pastedText.slice(0, 70000),
    });
  }

  return {
    locale: "tr-TR",
    today: getTurkeyTodayISO(),
    timezone: "Europe/Istanbul",
    files,
  };
}

async function readBankAiFilePayload(file) {
  const mimeType = file.type || guessBankAiMimeType(file.name);
  const base = {
    name: file.name,
    size: file.size,
    mimeType,
  };

  if (isImageFile(file)) {
    const image = await imageFileToBankAiData(file);
    return {
      ...base,
      kind: "image",
      mimeType: image.mimeType,
      data: image.data,
    };
  }

  if (isPdfFile(file) && file.size <= 4 * 1024 * 1024) {
    const payload = splitDataUrl(await readFileAsDataUrl(file), mimeType || "application/pdf");
    return {
      ...base,
      kind: "document",
      mimeType: payload.mimeType,
      data: payload.data,
    };
  }

  if (/\.csv$/i.test(file.name) || mimeType.includes("csv") || /\.txt$/i.test(file.name) || mimeType.startsWith("text/")) {
    return {
      ...base,
      kind: "text",
      text: (await readFileAsText(file)).slice(0, 70000),
    };
  }

  const text = await readBankImportFile(file);
  return {
    ...base,
    kind: "text",
    text: text.slice(0, 70000),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya AI için okunamadı."));
    reader.readAsDataURL(file);
  });
}

async function imageFileToBankAiData(file) {
  const url = URL.createObjectURL(file);

  try {
    const image = await loadImageFromUrl(url);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return splitDataUrl(canvas.toDataURL("image/jpeg", 0.86), "image/jpeg");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Görsel AI için hazırlanamadı."));
    image.src = url;
  });
}

function splitDataUrl(dataUrl, fallbackMimeType = "application/octet-stream") {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.*)$/);

  if (!match) {
    return {
      mimeType: fallbackMimeType,
      data: String(dataUrl || ""),
    };
  }

  return {
    mimeType: match[1] || fallbackMimeType,
    data: match[2] || "",
  };
}

function guessBankAiMimeType(name = "") {
  if (/\.pdf$/i.test(name)) {
    return "application/pdf";
  }

  if (/\.csv$/i.test(name)) {
    return "text/csv";
  }

  if (/\.txt$/i.test(name)) {
    return "text/plain";
  }

  if (/\.png$/i.test(name)) {
    return "image/png";
  }

  if (/\.webp$/i.test(name)) {
    return "image/webp";
  }

  return /\.jpe?g$/i.test(name) ? "image/jpeg" : "application/octet-stream";
}

function normalizeAiBankMovements(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const amountDetails = parseBankAmount(item.amountText ?? item.amount ?? item.tutar ?? item.value);

      if (!amountDetails) {
        return null;
      }

      const rawType = normalizeBankText(item.type || item.kind || item.direction || "");
      const title = cleanBankTitle(item.title || item.description || item.aciklama || item.rawText || "") || "Banka Hareketi";
      const explicitType = rawType.includes("income") || rawType.includes("gelir") || rawType.includes("alacak")
        ? "income"
        : rawType.includes("expense") || rawType.includes("gider") || rawType.includes("borc")
          ? "expense"
          : "";
      const type = explicitType || inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);
      const date = normalizeAiBankDate(item.date || item.tarih || item.transactionDate);
      const time = normalizeAiBankTime(item.time || item.saat || item.transactionTime || item.rawText || "");

      if (!date) {
        return null;
      }

      return {
        title,
        date,
        time,
        amount: amountDetails.amount,
        type,
        sign: type === "expense" ? -1 : 1,
        hasExplicitSign: true,
        sourceName: item.sourceName || item.source || item.fileName || "AI",
        raw: [time, title, item.amountText ?? item.amount ?? ""].filter(Boolean).join(" "),
      };
    })
    .filter(Boolean);
}

function normalizeAiBankDate(value) {
  const text = String(value || "").trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  return parseBankDate(text) || findDayMonthDateInText(text) || "";
}

function normalizeAiBankTime(value) {
  const match = String(value || "").match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)(?::[0-5]\d)?\b/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

async function importBankPdf(file) {
  bankImportStatus.textContent = `${file.name} okunuyor ve hareketlere ekleniyor...`;

  try {
    const buffer = await readFileAsArrayBuffer(file);
    const text = await extractPdfText(buffer);

    if (!text.trim()) {
      throw new Error("PDF içinde okunabilir metin bulunamadı.");
    }

    addBankImportText(text, file.name);
  } catch (error) {
    bankImportStatus.textContent =
      `${file.name} okunamadı. PDF taranmış görüntü olabilir veya ekstre metni seçilebilir değil. ` +
      (error.message || "");
  } finally {
    bankImportFile.value = "";
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsText(file, "UTF-8");
  });
}

async function loadPdfJs() {
  if (pdfJsModule) {
    return pdfJsModule;
  }

  pdfJsModule = await import(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.mjs`);
  pdfJsModule.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;
  return pdfJsModule;
}

async function extractPdfText(buffer) {
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(textContentToLines(content.items).join("\n"));
  }

  return pages.join("\n");
}

async function extractPdfOcrText(buffer, sourceName = "PDF") {
  bankImportStatus.textContent = `${sourceName} metin içermiyor; sayfalar görsel olarak okunuyor...`;
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    bankImportStatus.textContent = `${sourceName} ${pageNumber}/${pdf.numPages} sayfa OCR ile okunuyor...`;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await canvasToPngBlob(canvas);
    const pageUrl = URL.createObjectURL(blob);

    try {
      pages.push(await recognizeBankImageUrl(pageUrl, `${sourceName} sayfa ${pageNumber}`));
    } finally {
      URL.revokeObjectURL(pageUrl);
    }
  }

  return pages.join("\n");
}

async function loadTesseract() {
  if (window.Tesseract) {
    return window.Tesseract;
  }

  if (!tesseractLoadPromise) {
    tesseractLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TESSERACT_URL;
      script.async = true;
      script.onload = () => {
        if (window.Tesseract) {
          resolve(window.Tesseract);
          return;
        }

        reject(new Error("Görsel okuma motoru başlatılamadı."));
      };
      script.onerror = () => reject(new Error("Görsel okuma motoru yüklenemedi."));
      document.head.append(script);
    });
  }

  return tesseractLoadPromise;
}

async function recognizeBankImageUrl(url, statusLabel = "Görsel") {
  if (statusLabel) {
    bankImportStatus.textContent = `${statusLabel} OCR ile okunuyor...`;
  }

  const tesseract = await withTimeout(
    loadTesseract(),
    BANK_OCR_TIMEOUT_MS,
    "Görsel okuma motoru çok uzun sürede açıldı. Lütfen görseli tekrar seç."
  );
  const result = await withTimeout(
    tesseract.recognize(url, "tur+eng", {
      tessedit_pageseg_mode: "6",
      preserve_interword_spaces: "1",
    }),
    BANK_OCR_TIMEOUT_MS,
    "OCR okuma çok uzun sürdü. Görseli kırpmadan, daha net ya da daha küçük boyutta tekrar yükle."
  );

  return extractOcrTextFromResult(result);
}

function extractOcrTextFromResult(result) {
  const data = result?.data || {};
  const parts = [
    buildOcrTextFromLines(data.lines),
    data.text || "",
    buildOcrTextFromWords(data.words),
  ];
  const seen = new Set();
  const uniqueParts = [];

  parts.forEach((part) => {
    const text = String(part || "").trim();
    const signature = normalizeBankText(text);

    if (!text || !signature || seen.has(signature)) {
      return;
    }

    seen.add(signature);
    uniqueParts.push(text);
  });

  return chooseBestBankOcrText(uniqueParts);
}

function chooseBestBankOcrText(candidates) {
  const uniqueCandidates = (candidates || []).filter(Boolean);
  const combinedCandidate = uniqueCandidates.length > 1 ? uniqueCandidates.join("\n") : "";
  const scoreCandidate = (text, index) => {
    const movements = safeParseBankMovementsForOcrScore(text);
    const lines = getBankOcrLines(text);
    const rowStartCount = Math.max(countMobileBankOcrStarts(lines), countBankAppTemplateRowStarts(text));
    const signedCount = movements.filter((movement) => movement.hasExplicitSign).length;
    const balanceTitleCount = movements.filter((movement) =>
      hasAnyBankKeyword(movement.title || movement.raw || "", BANK_OCR_BALANCE_KEYWORDS)
    ).length;
    const suspiciousRateCount = movements.filter(isSuspiciousBankRateMovement).length;
    const overRowPenaltyWeight = isStrictBankCardScreen(text) ? 145 : 85;
    const overRowPenalty = rowStartCount ? Math.max(0, movements.length - rowStartCount) * overRowPenaltyWeight : 0;
    const score =
      movements.length * 100 +
      signedCount * 8 +
      Math.min(rowStartCount, movements.length || rowStartCount) * 10 -
      balanceTitleCount * 45 -
      suspiciousRateCount * 80 -
      overRowPenalty -
      index * 3;

    return { text, movements, rowStartCount, score, index };
  };
  const scored = uniqueCandidates.map(scoreCandidate).filter((item) => item.text);

  if (
    combinedCandidate &&
    !isStrictBankCardScreen(combinedCandidate) &&
    !uniqueCandidates.some((text) => normalizeBankText(text) === normalizeBankText(combinedCandidate))
  ) {
    const combinedScore = scoreCandidate(combinedCandidate, uniqueCandidates.length);
    const bestSingleCount = scored.reduce((best, item) => Math.max(best, item.movements.length), 0);

    if (combinedScore.movements.length > bestSingleCount) {
      scored.push(combinedScore);
    }
  }

  if (!scored.length) {
    return "";
  }

  const withMovements = scored.filter((item) => item.movements.length);

  if (!withMovements.length) {
    return scored.sort((a, b) => b.text.length - a.text.length)[0].text;
  }

  return withMovements.sort((a, b) => b.score - a.score || a.index - b.index)[0].text;
}

function safeParseBankMovementsForOcrScore(text) {
  try {
    return parseBankMovements(text);
  } catch {
    return [];
  }
}

function isSuspiciousBankRateMovement(movement) {
  const amount = Number(movement?.amount || 0);
  const text = normalizeBankText(`${movement?.title || ""} ${movement?.raw || ""}`);

  return (
    amount > 0 &&
    amount < 100 &&
    !movement?.hasExplicitSign &&
    /\b(orani|oran|stopaj|faiz tutari|n faiz|f orani)\b/.test(text)
  );
}

function buildOcrTextFromLines(lines) {
  if (!Array.isArray(lines)) {
    return "";
  }

  return lines
    .map((line) => String(line?.text || "").trim())
    .filter(Boolean)
    .join("\n");
}

function buildOcrTextFromWords(words) {
  if (!Array.isArray(words) || !words.length) {
    return "";
  }

  const rows = [];

  words
    .map((word) => {
      const text = String(word?.text || "").trim();
      const bbox = word?.bbox || {};
      const x0 = Number(bbox.x0 ?? word?.x0 ?? 0);
      const y0 = Number(bbox.y0 ?? word?.y0 ?? 0);
      const y1 = Number(bbox.y1 ?? word?.y1 ?? y0);

      return text ? { text, x0, y: (y0 + y1) / 2 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.y - b.y || a.x0 - b.x0)
    .forEach((word) => {
      let row = rows.find((candidate) => Math.abs(candidate.y - word.y) <= 8);

      if (!row) {
        row = { y: word.y, words: [] };
        rows.push(row);
      }

      row.words.push(word);
    });

  return rows
    .map((row) =>
      row.words
        .sort((a, b) => a.x0 - b.x0)
        .map((word) => word.text)
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(Boolean)
    .join("\n");
}

async function extractImageText(file) {
  bankImportStatus.textContent = `${file.name} ekran görüntüsü okunuyor...`;
  let imageUrl = URL.createObjectURL(file);
  let processedUrl = "";

  try {
    processedUrl = await preprocessImageForBankOcr(file);
    const targetUrl = processedUrl || imageUrl;
    const processedText = await recognizeBankImageUrl(targetUrl, file.name);

    if (!processedUrl) {
      return processedText;
    }

    bankImportStatus.textContent = `${file.name} için orijinal görüntü de kontrol ediliyor...`;
    const originalText = await recognizeBankImageUrl(imageUrl, file.name);
    const combinedText = [processedText, originalText].filter(Boolean).join("\n");
    return chooseBestBankOcrText([processedText, originalText, combinedText]);
  } finally {
    URL.revokeObjectURL(imageUrl);
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }
  }
}

async function preprocessImageForBankOcr(file) {
  if (!window.createImageBitmap) {
    return "";
  }

  try {
    const bitmap = await createImageBitmap(file);
    const maxWidth = 2800;
    const minScale = bitmap.width < 1200 ? 2 : 1.25;
    const scale = Math.min(2.6, Math.max(minScale, maxWidth / Math.max(bitmap.width, 1)));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      const gray = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
      const contrasted = Math.max(0, Math.min(255, (gray - 126) * 1.72 + 126));
      const sharpened = contrasted > 238 ? 255 : contrasted < 44 ? 0 : contrasted;
      data[index] = sharpened;
      data[index + 1] = sharpened;
      data[index + 2] = sharpened;
      data[index + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
    bitmap.close?.();

    const blob = await canvasToPngBlob(canvas);
    return URL.createObjectURL(blob);
  } catch {
    return "";
  }
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Görsel OCR için hazırlanamadı."));
    }, "image/png");
  });
}

function textContentToLines(items) {
  const rows = [];

  items.forEach((item) => {
    const text = String(item.str || "").trim();

    if (!text) {
      return;
    }

    const x = item.transform?.[4] || 0;
    const y = item.transform?.[5] || 0;
    let row = rows.find((candidate) => Math.abs(candidate.y - y) <= 3);

    if (!row) {
      row = { y, items: [] };
      rows.push(row);
    }

    row.items.push({ x, text });
  });

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) =>
      row.items
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(Boolean);
}

function addBankImportText(raw, sourceName = "Dosya", options = {}) {
  const { updateStatus = true } = options;
  bankImportText.value = String(raw || "");
  previewBankImport({ sourceName, updateStatus });

  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

  return { added: 0, ready: readyCount, duplicates: duplicateCount, invalid: invalidCount };
}

function previewBankImport(options = {}) {
  const { sourceName = "Metin", updateStatus = true } = options;
  const raw = bankImportText.value.trim();

  if (!raw) {
    pendingBankImports = [];
    renderBankImportPreview();
    if (updateStatus) {
      bankImportStatus.textContent = "Önce banka hareketlerini yapıştır veya dosya seç.";
    }
    return;
  }

  const parsedMovements = parseBankMovements(raw);
  pendingBankImports = buildPendingBankImportItems(parsedMovements, sourceName);
  renderBankImportPreview();

  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

  if (bankImportAddButton) {
    bankImportAddButton.textContent = pendingBankImports.length ? "Seçilenleri Onayla ve Ekle" : "Yapay Zeka ile Kayıtlara Ekle";
  }

  if (!updateStatus) {
    return;
  }

  if (!pendingBankImports.length) {
    bankImportStatus.textContent =
      "Hareket okunamadı. Görselde tarih, açıklama ve tutar görünür olmalı; mümkünse Hesap Hareketleri ekranını kırpmadan yükle.";
    return;
  }

  bankImportStatus.textContent =
    `${readyCount} hareket onay bekliyor` +
    (duplicateCount ? `, ${duplicateCount} tekrar işaretlenmedi` : "") +
    (invalidCount ? `, ${invalidCount} satır okunamadı` : "") +
    ". Eklemek istediklerini kontrol edip yeşil butona tekrar bas.";
}


function confirmBankImport(options = {}) {
  const { updateStatus = true } = options;

  if (!pendingBankImports.length) {
    if (updateStatus) {
      bankImportStatus.textContent = "Önce banka hareketlerini önizle.";
    }
    return;
  }

  const selectionRoot = bankImportPreviewList || bankImportPreview;
  const selectedIndexes = Array.from(selectionRoot.querySelectorAll(".bank-import-check:checked")).map(
    (input) => Number(input.value)
  );
  const selectedTransactions = pendingBankImports
    .filter(
      (item, index) =>
        selectedIndexes.includes(index) &&
        item.valid &&
        !item.duplicate &&
        item.transaction?.title &&
        item.transaction?.date &&
        Number(item.transaction?.amount || 0) > 0
    )
    .map((item) => item.transaction);

  if (!selectedTransactions.length) {
    if (updateStatus) {
      bankImportStatus.textContent = "Eklenecek yeni hareket seçilmedi.";
    }
    return;
  }

  const invalidTransfer = selectedTransactions.find(
    (transaction) =>
      transaction.type === "transfer" &&
      (!transaction.paymentAccountId ||
        !transaction.transferAccountId ||
        transaction.paymentAccountId === transaction.transferAccountId)
  );

  if (invalidTransfer) {
    if (updateStatus) {
      bankImportStatus.textContent = "Transfer kayıtları için her satırda kaynak ve farklı bir karşı kart / hesap seçmelisin.";
    }
    openBankImportPreviewModal();
    return;
  }

  let changedPaymentAccount = false;
  selectedTransactions.forEach((transaction) => {
    if (applyTransactionPaymentEffect(transaction, 1)) {
      changedPaymentAccount = true;
    }
  });

  if (changedPaymentAccount) {
    persistPaymentAccounts();
  }

  transactions = [...selectedTransactions, ...transactions].sort(compareTransactionsNewestFirst);
  persistTransactions();
  render();

  pendingBankImports = [];
  pendingBankFiles = [];
  bankImportText.value = "";
  bankImportFile.value = "";
  if (bankImportTransferAccountSelect) bankImportTransferAccountSelect.value = "";
  if (bankImportPreviewTransferAccount) bankImportPreviewTransferAccount.value = "";
  renderBankImportPreview();
  closeBankImportPreviewModal();
  if (bankImportAddButton) {
    bankImportAddButton.textContent = "Yapay Zeka ile Kayıtlara Ekle";
  }
  if (bankImportLocalButton) {
    bankImportLocalButton.textContent = "Kayıtlara Ekle";
  }
  if (updateStatus) {
    bankImportStatus.textContent = `${selectedTransactions.length} banka hareketi kayıtlara eklendi. Seçilen dosya/görsel alanı temizlendi.`;
  }
}

function clearBankImport() {
  pendingBankImports = [];
  pendingBankFiles = [];
  bankImportText.value = "";
  bankImportFile.value = "";
  if (bankImportTransferAccountSelect) bankImportTransferAccountSelect.value = "";
  if (bankImportPreviewTransferAccount) bankImportPreviewTransferAccount.value = "";
  renderBankImportPreview();
  closeBankImportPreviewModal();
  if (bankImportAddButton) {
    bankImportAddButton.textContent = "Yapay Zeka ile Kayıtlara Ekle";
  }
  if (bankImportLocalButton) {
    bankImportLocalButton.textContent = "Kayıtlara Ekle";
  }
  bankImportStatus.textContent = "Banka içe aktarma alanı temizlendi.";
}

function renderBankImportPreview() {
  bankImportPreview.innerHTML = "";
  bankImportPreview.hidden = true;
  renderBankImportPreviewModal();
  return;

  if (!pendingBankImports.length) {
    bankImportPreview.hidden = true;
    return;
  }

  bankImportPreview.hidden = false;

  const summary = document.createElement("div");
  summary.className = "bank-import-preview-summary";
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;
  const sourceCount = new Set(pendingBankImports.map((item) => item.sourceName).filter(Boolean)).size;
  const summaryText = document.createElement("span");
  summaryText.textContent =
    `${readyCount} hareket eklenecek` +
    (duplicateCount ? ` · ${duplicateCount} tekrar` : "") +
    (invalidCount ? ` · ${invalidCount} okunamadı` : "") +
    (sourceCount ? ` · ${sourceCount} kaynak` : "") +
    ".";
  const summaryActions = document.createElement("div");
  summaryActions.className = "bank-import-preview-actions";
  const selectAllButton = document.createElement("button");
  selectAllButton.className = "ghost-btn bank-import-mini-btn";
  selectAllButton.type = "button";
  selectAllButton.textContent = "Tümünü Seç";
  selectAllButton.disabled = readyCount === 0;
  selectAllButton.addEventListener("click", () => setBankImportPreviewSelection(true));
  const clearSelectionButton = document.createElement("button");
  clearSelectionButton.className = "ghost-btn bank-import-mini-btn";
  clearSelectionButton.type = "button";
  clearSelectionButton.textContent = "Seçimi Kaldır";
  clearSelectionButton.disabled = readyCount === 0;
  clearSelectionButton.addEventListener("click", () => setBankImportPreviewSelection(false));
  summaryActions.append(selectAllButton, clearSelectionButton);
  summary.append(summaryText, summaryActions);
  bankImportPreview.append(summary);

  pendingBankImports.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "bank-import-item";

    if (item.duplicate) {
      row.classList.add("duplicate");
    }

    if (!item.valid) {
      row.classList.add("invalid");
    }

    if (item.valid) {
      row.classList.add(item.transaction.type);
    }

    const checkbox = document.createElement("input");
    checkbox.className = "bank-import-check";
    checkbox.type = "checkbox";
    checkbox.value = String(index);
    checkbox.checked = item.valid && !item.duplicate;
    checkbox.disabled = !item.valid || item.duplicate;
    row.classList.toggle("selected", checkbox.checked);
    checkbox.addEventListener("change", () => {
      row.classList.toggle("selected", checkbox.checked);
    });

    const content = document.createElement("div");
    const title = document.createElement("p");
    title.className = "transaction-title";
    const meta = document.createElement("p");
    meta.className = "transaction-meta";

    if (item.valid) {
      title.textContent = item.transaction.title;
      const time = getTimePart(item.raw || "") || getTimePart(item.transaction.transactionAt || "");
      meta.textContent = [
        formatDate(item.transaction.date),
        time,
        item.transaction.category,
        item.sourceName,
        item.duplicate ? "Tekrar" : "",
      ].filter(Boolean).join(" · ");

      if (item.raw && normalizeBankText(item.raw) !== normalizeBankText(item.transaction.title)) {
        const raw = document.createElement("small");
        raw.className = "bank-import-raw";
        raw.textContent = item.raw;
        content.append(title, meta, raw);
      } else {
        content.append(title, meta);
      }
    } else {
      title.textContent = item.raw || "Okunamadı";
      meta.textContent = `${item.reason}${item.sourceName ? ` · ${item.sourceName}` : ""}`;
      content.append(title, meta);
    }

    const side = document.createElement("div");
    side.className = "transaction-side";

    if (item.valid) {
      const amount = document.createElement("strong");
      amount.className = `transaction-amount ${item.transaction.type}`;
      amount.textContent = `${item.transaction.type === "income" ? "+" : "-"} ${currency.format(
        item.transaction.amount
      )}`;
      const kind = document.createElement("span");
      kind.className = `bank-import-kind ${item.transaction.type}`;
      kind.textContent = item.transaction.type === "income" ? "Gelir" : "Gider";
      side.append(amount, kind);
    }

    row.append(checkbox, content, side);
    bankImportPreview.append(row);
  });
}

function setBankImportPreviewSelection(checked) {
  const root = bankImportPreviewList || bankImportPreview;
  root.querySelectorAll(".bank-import-check:not(:disabled)").forEach((input) => {
    input.checked = checked;
    input.closest(".bank-import-item")?.classList.toggle("selected", checked);
  });
  updateBankImportPreviewSummary();
}

function renderBankImportPreviewModal() {
  if (!bankImportPreviewList) {
    return;
  }

  bankImportPreviewList.innerHTML = "";
  syncBankImportAccountSelects();
  updateBankImportPreviewSummary();

  if (!pendingBankImports.length) {
    return;
  }

  pendingBankImports.forEach((item, index) => {
    bankImportPreviewList.append(createBankImportPreviewEditRow(item, index));
  });
  updateBankImportPreviewSummary();
}

function createBankImportPreviewEditRow(item, index) {
  const row = document.createElement("article");
  row.className = "bank-import-item bank-import-edit-item";

  if (item.duplicate) {
    row.classList.add("duplicate");
  }

  if (!item.valid) {
    row.classList.add("invalid");
  }

  if (item.valid) {
    row.classList.add(item.transaction.type);
  }

  const checkbox = document.createElement("input");
  checkbox.className = "bank-import-check";
  checkbox.type = "checkbox";
  checkbox.value = String(index);
  checkbox.checked = item.valid && !item.duplicate;
  checkbox.disabled = !item.valid || item.duplicate;
  row.classList.toggle("selected", checkbox.checked);
  checkbox.addEventListener("change", () => {
    row.classList.toggle("selected", checkbox.checked);
    updateBankImportPreviewSummary();
  });

  const body = document.createElement("div");
  body.className = "bank-import-edit-body";

  if (!item.valid) {
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.raw || "Okunamadı";
    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = `${item.reason}${item.sourceName ? ` · ${item.sourceName}` : ""}`;
    body.append(title, meta);
    row.append(checkbox, body);
    return row;
  }

  const grid = document.createElement("div");
  grid.className = "bank-import-edit-grid";
  grid.append(
    createBankImportEditField("Başlık", createBankImportEditInput(index, "title", item.transaction.title, "text")),
    createBankImportEditField("Tip", createBankImportTypeSelect(index, item.transaction.type)),
    createBankImportEditField("Tutar", createBankImportEditInput(index, "amount", item.transaction.amount, "number")),
    createBankImportEditField("Kategori", createBankImportCategorySelect(index, item.transaction.type, item.transaction.category)),
    createBankImportEditField("Tarih", createBankImportEditInput(index, "date", item.transaction.date, "date")),
    createBankImportEditField("Kaynak", createBankImportPaymentAccountSelect(index, "paymentAccountId", item.transaction.paymentAccountId, item.transaction.transferAccountId)),
    createBankImportEditField("Karşı", createBankImportPaymentAccountSelect(index, "transferAccountId", item.transaction.transferAccountId, item.transaction.paymentAccountId))
  );

  const meta = document.createElement("p");
  meta.className = "transaction-meta";
  const rowAccount = item.transaction.paymentAccountId
    ? paymentAccounts.find((account) => account.id === item.transaction.paymentAccountId)
    : null;
  const rowTransferAccount = item.transaction.transferAccountId
    ? paymentAccounts.find((account) => account.id === item.transaction.transferAccountId)
    : null;
  meta.textContent = [
    item.sourceName,
    item.duplicate ? "Tekrar" : "",
    rowAccount ? formatPaymentAccountName(rowAccount) : "Kart / hesap seçilmedi",
    rowTransferAccount ? `Karşı hesap: ${formatPaymentAccountName(rowTransferAccount)}` : "",
  ].filter(Boolean).join(" · ");

  if (item.raw && normalizeBankText(item.raw) !== normalizeBankText(item.transaction.title)) {
    const raw = document.createElement("small");
    raw.className = "bank-import-raw";
    raw.textContent = item.raw;
    body.append(grid, meta, raw);
  } else {
    body.append(grid, meta);
  }

  row.append(checkbox, body);
  return row;
}

function createBankImportEditField(labelText, control) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.append(control);
  return label;
}

function createBankImportEditInput(index, field, value, type) {
  const input = document.createElement("input");
  input.type = type;
  input.value = String(value ?? "");

  if (field === "amount") {
    input.min = "0";
    input.step = "0.01";
    input.inputMode = "decimal";
  }

  input.addEventListener("input", () => updateBankImportTransactionField(index, field, input.value));
  input.addEventListener("change", () => updateBankImportTransactionField(index, field, input.value));
  return input;
}

function createBankImportTypeSelect(index, value) {
  const select = document.createElement("select");
  [
    ["income", "Gelir"],
    ["expense", "Gider"],
    ["transfer", "Transfer"],
  ].forEach(([optionValue, label]) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = label;
    select.append(option);
  });
  select.value = ["income", "expense", "transfer"].includes(value) ? value : "expense";
  select.addEventListener("change", () => {
    updateBankImportTransactionField(index, "type", select.value);
    const item = pendingBankImports[index];
    if (item?.valid) {
      item.transaction.category = transactionCategories[select.value]?.[0] || "Diğer";
      item.transaction.paymentMethod = select.value === "transfer"
        ? "transfer"
        : getPaymentMethodForImportAccount(paymentAccounts.find((account) => account.id === item.transaction.paymentAccountId));
    }
    renderBankImportPreviewModal();
  });
  return select;
}

function createBankImportCategorySelect(index, type, value) {
  const select = document.createElement("select");
  (transactionCategories[type] || transactionCategories.expense).forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.append(option);
  });
  select.value = Array.from(select.options).some((option) => option.value === value)
    ? value
    : select.options[0]?.value || "";
  select.addEventListener("change", () => updateBankImportTransactionField(index, "category", select.value));
  return select;
}

function createBankImportPaymentAccountSelect(index, field, value, excludeValue = "") {
  const select = document.createElement("select");
  const currentValue = String(value || "");
  const excludedId = String(excludeValue || "");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = field === "paymentAccountId" ? "Kaynak seçilmedi" : "Karşı hesap yok";
  select.append(emptyOption);

  paymentAccounts
    .filter((account) => String(account.id || "") !== excludedId)
    .forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = formatPaymentAccountName(account);
      select.append(option);
    });

  select.value = Array.from(select.options).some((option) => option.value === currentValue) ? currentValue : "";
  select.addEventListener("change", () => {
    updateBankImportTransactionField(index, field, select.value);
    renderBankImportPreviewModal();
  });
  return select;
}

function updateBankImportTransactionField(index, field, value) {
  const item = pendingBankImports[index];

  if (!item?.valid || !item.transaction) {
    return;
  }

  if (field === "amount") {
    const amount = Number(value);
    item.transaction.amount = Number.isFinite(amount) && amount > 0 ? Number(amount.toFixed(2)) : 0;
  } else if (field === "type") {
    item.transaction.type = ["income", "expense", "transfer"].includes(value) ? value : "expense";
    if (item.transaction.type === "transfer") {
      item.transaction.category = transactionCategories.transfer?.[0] || "Transfer";
      item.transaction.paymentMethod = "transfer";
    } else {
      item.transaction.transferAccountId = "";
      item.transaction.paymentMethod = getPaymentMethodForImportAccount(
        paymentAccounts.find((account) => account.id === item.transaction.paymentAccountId)
      );
    }
  } else if (field === "date") {
    item.transaction.date = String(value || "");
    item.transaction.transactionAt = buildTransactionDateTime(item.transaction.date, getTimePart(item.transaction.transactionAt || item.raw || ""));
  } else {
    item.transaction[field] = String(value || "").trim();
  }

  if (field === "title") {
    item.transaction.title = item.transaction.title.slice(0, 40) || "Banka Hareketi";
  }

  if (field === "paymentAccountId") {
    const account = paymentAccounts.find((candidate) => candidate.id === item.transaction.paymentAccountId);
    item.transaction.paymentMethod = item.transaction.type === "transfer" ? "transfer" : getPaymentMethodForImportAccount(account);
    if (item.transaction.transferAccountId === item.transaction.paymentAccountId) {
      item.transaction.transferAccountId = "";
    }
  }

  if (field === "transferAccountId" && item.transaction.transferAccountId === item.transaction.paymentAccountId) {
    item.transaction.transferAccountId = "";
  }

  updateBankImportPreviewSummary();
}

function applyBankImportAccountToPending(accountId = "") {
  const account = accountId ? paymentAccounts.find((item) => item.id === accountId) : null;
  const paymentMethod = getPaymentMethodForImportAccount(account);
  const transferAccount = getBankImportSelectedTransferAccount();
  const transferAccountId = transferAccount && transferAccount.id !== account?.id ? transferAccount.id : "";

  pendingBankImports = pendingBankImports.map((item) => {
    if (!item.valid || !item.transaction) {
      return item;
    }

    return {
      ...item,
      transaction: {
        ...item.transaction,
        paymentMethod: item.transaction.type === "transfer" ? "transfer" : paymentMethod,
        paymentAccountId: account ? account.id : "",
        transferAccountId,
      },
    };
  });

  renderBankImportPreview();
}

function applyBankImportTransferAccountToPending(accountId = "") {
  const sourceAccount = getBankImportSelectedAccount();
  const transferAccount =
    accountId && accountId !== sourceAccount?.id
      ? paymentAccounts.find((item) => item.id === accountId)
      : null;
  const transferAccountId = transferAccount ? transferAccount.id : "";

  pendingBankImports = pendingBankImports.map((item) => {
    if (!item.valid || !item.transaction) {
      return item;
    }

    return {
      ...item,
      transaction: {
        ...item.transaction,
        transferAccountId,
      },
    };
  });

  renderBankImportPreview();
}

function updateBankImportPreviewSummary() {
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  const selectedCount = bankImportPreviewList
    ? bankImportPreviewList.querySelectorAll(".bank-import-check:checked").length
    : readyCount;
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;
  const account = getBankImportSelectedAccount();
  const transferAccount = getBankImportSelectedTransferAccount();
  const accountText = account ? formatPaymentAccountName(account) : "Kart / hesap seçilmedi";
  const transferText = transferAccount ? ` Aktarım karşı hesabı: ${formatPaymentAccountName(transferAccount)}.` : "";

  if (bankImportPreviewModalSummary) {
    bankImportPreviewModalSummary.textContent =
      `${readyCount} hareket bulundu, ${selectedCount} hareket seçili. ${accountText}.${transferText}` +
      (duplicateCount ? ` ${duplicateCount} tekrar.` : "") +
      (invalidCount ? ` ${invalidCount} satır kontrol istiyor.` : "");
  }

  if (bankImportPreviewStatus) {
    bankImportPreviewStatus.textContent = account
      ? transferAccount
        ? `Seçilen hareketler ${formatPaymentAccountName(account)} ve ${formatPaymentAccountName(transferAccount)} arasında aktarım etkisiyle işlenecek.`
        : `Seçilen hareketler ${formatPaymentAccountName(account)} bakiyesine işlenecek.`
      : "Kart / hesap seçmezsen hareketler sadece kayıt listesine eklenir.";
  }

  if (bankImportPreviewConfirmButton) {
    bankImportPreviewConfirmButton.disabled = selectedCount === 0;
  }
}

function openBankImportPreviewModal() {
  renderBankImportPreview();

  if (!pendingBankImports.length) {
    bankImportStatus.textContent = "Önce yapay zeka ile ya da normal önizleme ile hareketleri hazırla.";
    return;
  }

  if (bankImportPreviewModal) {
    bankImportPreviewModal.hidden = false;
  }
}

function closeBankImportPreviewModal() {
  if (bankImportPreviewModal) {
    bankImportPreviewModal.hidden = true;
  }
}

function parseBankMovements(raw) {
  const normalizedRaw = normalizeBankOcrRawText(raw);
  const receiptMovements = dedupeBankMovements(parseBankReceipts(normalizedRaw));

  if (receiptMovements.length) {
    return receiptMovements;
  }

  const csvMovements = dedupeBankMovements(parseBankCsv(raw));

  if (csvMovements.length) {
    return csvMovements;
  }

  const templateMovements = dedupeBankMovements(parseBankAppTemplateRows(normalizedRaw));
  const templateRowStartCount = countBankAppTemplateRowStarts(normalizedRaw);

  if (shouldTrustBankAppTemplateRows(normalizedRaw, templateMovements) && templateMovements.length >= templateRowStartCount) {
    return templateMovements;
  }

  const mobileMovements = dedupeBankMovements(parseMobileBankOcrRows(normalizedRaw));
  const screenshotMovements = dedupeBankMovements(parseBankScreenshotMovements(normalizedRaw));
  const mobileRowStartCount = countMobileBankOcrStarts(getBankOcrLines(normalizedRaw));

  if (isStrictBankCardScreen(normalizedRaw) && mobileMovements.length >= mobileRowStartCount) {
    return mobileMovements;
  }

  const structuredMovements = dedupeBankMovements([...mobileMovements, ...screenshotMovements]);
  const structuredRowStartCount = Math.max(templateRowStartCount, mobileRowStartCount);

  if (shouldTrustStructuredBankRows(normalizedRaw, structuredMovements) && structuredMovements.length >= structuredRowStartCount) {
    return structuredMovements;
  }

  const parsers = [
    () => templateMovements,
    () => structuredMovements,
    () => parseSignedBankOcrAmounts(normalizedRaw),
    () => parseBankText(normalizedRaw),
    () => parseLooseBankMovementRows(normalizedRaw),
  ];
  const allMovements = [];

  for (const parser of parsers) {
    const movements = parser();

    if (movements.length) {
      allMovements.push(...movements);
    }
  }

  return dedupeBankMovements(allMovements);
}

function isStrictBankCardScreen(raw) {
  const text = normalizeBankText(raw);
  return (
    text.includes("islem sonu bakiye") ||
    text.includes("lem sonu bakiye") ||
    text.includes("sonu bakiye") ||
    text.includes("tekrarla")
  );
}

function shouldTrustStructuredBankRows(raw, movements) {
  if (!movements.length) {
    return false;
  }

  const text = normalizeBankText(raw);

  if (isStrictBankCardScreen(raw)) {
    return true;
  }

  if (!text.includes("kalan bakiye") && movements.length >= 2) {
    return true;
  }

  return false;
}

function shouldTrustBankAppTemplateRows(raw, movements) {
  if (!movements.length) {
    return false;
  }

  const text = normalizeBankText(raw);
  const indicators = [
    "hesap hareketleri",
    "kart hareketleri",
    "son 10 hareket",
    "son 1 ay",
    "son 7 gun",
    "kazandiran gunluk hesap",
    "islem sonu bakiye",
    "kalan bakiye",
    "mevduat islemleri",
    "transfer islemleri",
  ];

  return indicators.some((indicator) => text.includes(indicator));
}

function parseBankAppTemplateRows(raw) {
  const sourceLines = getBankOcrLines(raw);
  const lines = [];

  for (const line of sourceLines) {
    if (isBankTemplateHardStopLine(line)) {
      break;
    }

    lines.push(line);
  }

  const starts = [];

  lines.forEach((line, index) => {
    const start = parseBankTemplateRowStart(lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts
    .map((start, order) => {
      const nextStart = starts[order + 1]?.index ?? lines.length;
      const block = lines.slice(start.index, nextStart).filter((line) => !isBankTemplateSoftNoiseLine(line));
      return parseBankTemplateBlock(block, start);
    })
    .filter(Boolean);
}

function countBankAppTemplateRowStarts(raw) {
  const sourceLines = getBankOcrLines(raw);
  const lines = [];
  const starts = [];

  for (const line of sourceLines) {
    if (isBankTemplateHardStopLine(line)) {
      break;
    }

    lines.push(line);
  }

  lines.forEach((line, index) => {
    const start = parseBankTemplateRowStart(lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts.length;
}

function parseBankTemplateRowStart(lines, index) {
  const line = String(lines[index] || "").trim();

  if (!line || isBankTemplateSoftNoiseLine(line)) {
    return null;
  }

  const sameLineDate = parseBankTemplateDateFromLine(line) || parseBankScreenshotDateFromLine(line);
  const context = lines.slice(index, Math.min(lines.length, index + 10));
  const normalizedContext = normalizeBankText(context.join(" "));

  if (sameLineDate) {
    if (!hasBankTemplateRowEvidence(context, normalizedContext) && !hasBankTemplateLooseRowEvidence(context, normalizedContext)) {
      return null;
    }

    return {
      index,
      date: sameLineDate.date,
      day: Number(sameLineDate.day || sameLineDate.date.slice(-2)),
      time: sameLineDate.time || getTimePart(context.join(" ")),
    };
  }

  const dayMatch = line.match(/^(\d{1,2})(?:\s+|$)/);

  if (!dayMatch) {
    return null;
  }

  const day = Number(dayMatch[1]);

  if (day < 1 || day > 31) {
    return null;
  }

  const monthLineIndex = context.findIndex((candidate) => getBankMonthNumber(candidate));
  const hasMonthNearby = monthLineIndex >= 0 && monthLineIndex <= 6;

  if (
    !hasMonthNearby ||
    (!hasBankTemplateRowEvidence(context, normalizedContext) && !hasBankTemplateLooseRowEvidence(context, normalizedContext))
  ) {
    return null;
  }

  const monthLine = context[monthLineIndex] || "";
  const month = getBankMonthNumber(monthLine);
  const yearMatch = context.join(" ").match(/\b20\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : Number(getTurkeyTodayISO().slice(0, 4));

  return {
    index,
    date: buildIsoDate(year, month, day),
    day,
    time: getTimePart(context.join(" ")),
  };
}

function parseBankTemplateDateFromLine(line) {
  const text = String(line || "");
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";
  const match = text.match(new RegExp(String.raw`^\s*(\d{1,2})\s+${monthRegex}(?:\s+(20\d{2}))?(?:\s+([01]?\d|2[0-3])[:.]([0-5]\d))?`, "i"));

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = getBankMonthNumber(match[2]);
  const year = Number(match[3] || getTurkeyTodayISO().slice(0, 4));
  const date = buildIsoDate(year, month, day);

  if (!date) {
    return null;
  }

  return {
    date,
    day,
    time: match[4] ? `${match[4].padStart(2, "0")}:${match[5]}` : "",
  };
}

function hasBankTemplateRowEvidence(contextLines, normalizedContext) {
  const lines = contextLines || [];
  const hasAmount = lines.some((line) => findUsableMoneyMatchesInLine(line).length);
  const hasTitle = lines.some((line) => isBankTemplateTitleLine(line));
  const rowKeywordCount = BANK_OCR_ROW_KEYWORDS.filter((keyword) => normalizedContext.includes(keyword)).length;

  return hasAmount && (hasTitle || rowKeywordCount > 0);
}

function hasBankTemplateLooseRowEvidence(contextLines, normalizedContext) {
  const lines = contextLines || [];
  const hasTitle = lines.some((line) => isBankTemplateTitleLine(line));
  const rowKeywordCount = BANK_OCR_ROW_KEYWORDS.filter((keyword) => normalizedContext.includes(keyword)).length;

  return hasTitle || rowKeywordCount > 0;
}

function parseBankTemplateBlock(block, start) {
  if (!block.length || isBankTemplateNoiseBlock(block)) {
    return null;
  }

  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  const date = start.date || findDayMonthDateInText(block.join(" ")) || findDayAndMonthAnywhereInText(block.join(" "));
  const title = extractBankTemplateTitle(block, amountDetails, start) ||
    extractBankMovementTitle(block, amountDetails) ||
    "Banka Hareketi";

  if (!date || !title || hasAnyBankKeyword(title, BANK_OCR_BALANCE_KEYWORDS)) {
    return null;
  }

  const type = inferBankTemplateTransactionType(title, amountDetails, block);

  return {
    title,
    date,
    amount: amountDetails.amount,
    type,
    sign: type === "income" ? 1 : -1,
    hasExplicitSign: amountDetails.hasExplicitSign,
    raw: block.join(" "),
  };
}

function extractBankTemplateTitle(block, amountDetails, start) {
  const selected = [];

  block.forEach((line) => {
    let cleaned = String(line || "");
    cleaned = cleaned.replace(amountDetails.match || "", " ");
    cleaned = cleaned.replace(new RegExp(String.raw`^\s*${start.day}\b`), " ");
    cleaned = cleaned.replace(/\b([01]?\d|2[0-3])[:.][0-5]\d(?::[0-5]\d)?\b/g, " ");
    cleaned = cleaned.replace(/\b20\d{2}\b/g, " ");
    cleaned = cleaned.replace(/\b(?:TL|TRY|₺)\b/gi, " ");
    cleaned = cleanBankTitle(cleaned);

    if (!isBankTemplateTitleLine(cleaned)) {
      return;
    }

    selected.push(cleaned);
  });

  return cleanBankTitle(selected.slice(0, 2).join(" - ")).slice(0, 90);
}

function inferBankTemplateTransactionType(title, amountDetails, block) {
  const text = normalizeBankText(`${title} ${block.join(" ")}`);

  if (amountDetails.sign < 0) {
    return "expense";
  }

  if (amountDetails.hasExplicitSign && amountDetails.sign > 0) {
    return "income";
  }

  if (hasBankIncomeContext(text) && !hasBankExpenseContext(text)) {
    return "income";
  }

  if (/\b(gelen|mevduat|faiz|hesaptan gelen|gond|gonderen)\b/.test(text)) {
    return "income";
  }

  if (/\b(giden|para cekme|komisyon|bsmv|kesinti|ucret|tahsilat|aidat|odeme|transfer)\b/.test(text)) {
    return "expense";
  }

  return inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);
}

function isBankTemplateTitleLine(value) {
  const normalized = normalizeBankText(value);

  if (!normalized || normalized.length < 3 || !/[a-z]/.test(normalized)) {
    return false;
  }

  if (isBankTemplateSoftNoiseLine(normalized) || hasAnyBankKeyword(normalized, BANK_OCR_BALANCE_KEYWORDS)) {
    return false;
  }

  if (getBankMonthNumber(normalized) && normalized.split(" ").length <= 3) {
    return false;
  }

  if (findMoneyMatchesInLine(value).length && normalized.split(" ").length <= 3) {
    return false;
  }

  return !/^\d+(?:\s+\d{1,2})?$/.test(normalized);
}

function isBankTemplateNoiseBlock(block) {
  const text = normalizeBankText((block || []).join(" "));
  const noiseOnlyKeywords = [
    "hesap hareketleri",
    "kart hareketleri",
    "kullanilabilir bakiye",
    "diger bekleyen islemler",
    "son 10 hareket",
    "son 1 ay",
    "son 7 gun",
    "gecmis",
    "gelecek",
  ];

  return noiseOnlyKeywords.some((keyword) => text === keyword || text.startsWith(`${keyword} `)) &&
    !BANK_OCR_ROW_KEYWORDS.some((keyword) => text.includes(keyword));
}

function isBankTemplateHardStopLine(value) {
  const text = normalizeBankText(value);
  const hardStops = [
    "tum hareketler",
    "ana sayfa",
    "para gonder",
    "odeme yap",
    "kampanyalar",
    "menu",
    "basvurular",
    "hesap ve kart",
    "durumum",
    "gelirgidertakip",
  ];

  return hardStops.some((keyword) => text === keyword || text.includes(keyword));
}

function isBankTemplateSoftNoiseLine(value) {
  const text = normalizeBankText(value);
  const softNoise = [
    "hesap hareketleri",
    "kart hareketleri",
    "kullanilabilir bakiye",
    "vadesiz tl hesabi",
    "vadesiz",
    "son 10 hareket",
    "diger bekleyen islemler",
    "son 1 ay",
    "son 7 gun",
    "filtre",
    "sessiz",
    "okunabilir hale getir",
  ];

  return softNoise.some((keyword) => text === keyword || text.includes(keyword));
}

function dedupeBankMovements(movements) {
  const accepted = [];

  (movements || []).forEach((movement) => {
    if (!movement) {
      return;
    }

    if (accepted.some((item) => areSameBankMovement(item, movement))) {
      return;
    }

    accepted.push(movement);
  });

  return accepted;
}

function areSameBankMovement(left, right) {
  if (!left || !right) {
    return false;
  }

  if ((left.date || "") !== (right.date || "")) {
    return false;
  }

  if (Number(left.amount || 0).toFixed(2) !== Number(right.amount || 0).toFixed(2)) {
    return false;
  }

  if ((left.sign || 0) !== (right.sign || 0)) {
    return false;
  }

  const leftTime = getBankMovementTimeKey(left);
  const rightTime = getBankMovementTimeKey(right);

  if (leftTime && rightTime && leftTime === rightTime) {
    return true;
  }

  const leftTitle = getBankMovementDedupeTitle(left);
  const rightTitle = getBankMovementDedupeTitle(right);

  if (!leftTitle || !rightTitle) {
    return false;
  }

  if (leftTitle === rightTitle || leftTitle.includes(rightTitle) || rightTitle.includes(leftTitle)) {
    return true;
  }

  const leftTokens = new Set(leftTitle.split(" ").filter((token) => token.length > 2));
  const rightTokens = new Set(rightTitle.split(" ").filter((token) => token.length > 2));
  const smallerSize = Math.min(leftTokens.size, rightTokens.size);

  if (!smallerSize) {
    return false;
  }

  let overlap = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  });

  return overlap / smallerSize >= 0.55;
}

function getBankMovementTimeKey(movement) {
  const raw = `${movement?.raw || ""} ${movement?.transactionAt || ""}`;
  const explicit = getTimePart(raw);

  if (explicit) {
    return explicit.slice(0, 5);
  }

  const compactMatch = normalizeBankText(raw).match(/\b([01]?\d|2[0-3])\s*([0-5]\d)\b/);
  return compactMatch ? `${compactMatch[1].padStart(2, "0")}:${compactMatch[2]}` : "";
}

function getBankMovementDedupeTitle(movement) {
  const rawTitle = `${movement?.title || ""} ${movement?.raw || ""}`;
  const withoutMoney = rawTitle
    .replace(/[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi, " ")
    .replace(/\b20\d{2}\b/g, " ");
  const noise = new Set([
    "may",
    "mayis",
    "ocak",
    "subat",
    "mart",
    "nisan",
    "haziran",
    "temmuz",
    "agustos",
    "eylul",
    "ekim",
    "kasim",
    "aralik",
    "islem",
    "sonu",
    "bakiye",
    "kalan",
    "kullanilabilir",
    "way",
    "wavy",
    "tl",
    "try",
  ]);

  return normalizeBankText(withoutMoney)
    .split(" ")
    .filter((token) => token.length > 1 && !noise.has(token) && !/^\d+$/.test(token))
    .join(" ");
}

function normalizeBankOcrRawText(raw) {
  return String(raw || "")
    .replace(/[−–—]/g, "-")
    .replace(/[|¦]/g, " ")
    .replace(/[₺]/g, " ₺ ")
    .replace(/\bT\s*[LIİ1]\b/gi, "TL")
    .replace(/\bT\s*R\s*Y\b/gi, "TRY")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => fixCommonBankOcrTokens(normalizeOcrMoneyCharacters(line)).replace(/\s{2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function fixCommonBankOcrTokens(value) {
  return String(value || "")
    .replace(/\bBSM[WV]\b/gi, "BSMV")
    .replace(/\bFAST[.-]?CEP\b/gi, "FAST CEP")
    .replace(/\bHOHH\b/gi, "HOHH")
    .replace(/\bKA[1IİL]AN\b/gi, "KALAN")
    .replace(/\bBAK[1IİL]YE\b/gi, "BAKIYE")
    .replace(/\b[İI]SLEM\b/g, "İŞLEM")
    .replace(/\b[0O]DEME\b/gi, "ÖDEME");
}

function normalizeOcrMoneyCharacters(value) {
  const text = String(value || "");
  return text.replace(/[oO]/g, (char, index, source) => {
    const before = source[index - 1] || "";
    const after = source[index + 1] || "";
    const beforeLooksNumeric = !before || /[\d.,+\-₺]/.test(before) || (/\s/.test(before) && /[\d.,]/.test(after));
    const afterLooksNumeric = !after || /[\d.,\s₺TLTRY+\-]/i.test(after);
    return beforeLooksNumeric && afterLooksNumeric ? "0" : char;
  });
}

function getBankOcrLines(raw) {
  return String(raw || "")
    .split(/\r?\n/)
    .map((line) => normalizeOcrMoneyCharacters(line).replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}

function hasAnyBankKeyword(normalizedText, keywords) {
  const text = normalizeBankText(normalizedText);
  return keywords.some((keyword) => text.includes(keyword));
}

function isIgnoredBankOcrLine(value) {
  return hasAnyBankKeyword(value, BANK_OCR_IGNORE_KEYWORDS);
}

function hasBankRowContext(value) {
  return hasAnyBankKeyword(value, BANK_OCR_ROW_KEYWORDS) || hasAnyBankKeyword(value, BANK_OCR_AMOUNT_KEYWORDS);
}

function parseMobileBankOcrRows(raw) {
  const lines = getBankOcrLines(raw);
  const starts = [];

  lines.forEach((line, index) => {
    const start = getMobileBankRowStart(line, lines, index);

    if (start) {
      starts.push(start);
    }
  });

  const uniqueStarts = starts.filter((item, index, all) => index === 0 || item.index !== all[index - 1].index);

  return uniqueStarts
    .map((start, order) => {
      const nextStart = uniqueStarts[order + 1]?.index ?? lines.length;
      const block = lines.slice(start.index, nextStart);
      return parseMobileBankOcrBlock(block, start);
    })
    .filter(Boolean);
}

function countMobileBankOcrStarts(lines) {
  const starts = [];

  (lines || []).forEach((line, index) => {
    const start = getMobileBankRowStart(line, lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts.length;
}

function parseSignedBankOcrAmounts(raw) {
  const lines = getBankOcrLines(raw);
  const movements = [];

  lines.forEach((line, index) => {
    const matches = findMoneyMatchesInLine(line).filter((match) => /[+\-]/.test(match.text));

    matches.forEach((match) => {
      const amountDetails = parseBankAmount(match.text);

      if (!amountDetails || isBankBalanceAmountMatch(line, match) || isLikelyBankNoiseAmount(line, match, amountDetails)) {
        return;
      }

      const dateContextLines = lines.slice(Math.max(0, index - 8), index + 1);
      const titleContextLines = lines.slice(Math.max(0, index - 4), Math.min(lines.length, index + 5));
      const date = findSignedBankAmountDate(line, dateContextLines);

      if (!date) {
        return;
      }

      const title =
        extractSignedBankAmountTitle(line, match) ||
        extractSignedBankAmountTitle(titleContextLines.join(" "), match) ||
        "Banka Hareketi";
      const type = inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);

      movements.push({
        title,
        date,
        amount: amountDetails.amount,
        type,
        sign: amountDetails.sign,
        hasExplicitSign: true,
        raw: line,
      });
    });
  });

  return dedupeBankMovements(movements);
}

function findSignedBankAmountDate(line, contextLines) {
  const lineDate = findDateMatch(line);

  if (lineDate) {
    return parseBankDate(lineDate.text);
  }

  const context = contextLines.join(" ");
  const contextDate = findDateMatch(context);

  if (contextDate) {
    return parseBankDate(contextDate.text);
  }

  const sameLineDate = findDayMonthDateInText(line);

  if (sameLineDate) {
    return sameLineDate;
  }

  const scatteredLineDate = findDayAndMonthAnywhereInText(line);

  if (scatteredLineDate) {
    return scatteredLineDate;
  }

  for (const candidate of contextLines) {
    const parsed = findDayMonthDateInText(candidate);

    if (parsed) {
      return parsed;
    }

    const scattered = findDayAndMonthAnywhereInText(candidate);

    if (scattered) {
      return scattered;
    }
  }

  return "";
}

function findDayMonthDateInText(value) {
  const currentYear = Number(getTurkeyTodayISO().slice(0, 4));
  const text = String(value || "");
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";
  const match = text.match(new RegExp(String.raw`\b(\d{1,2})\s+${monthRegex}(?:\s+(20\d{2}))?`, "i"));

  if (!match) {
    return "";
  }

  const day = Number(match[1]);
  const month = getBankMonthNumber(match[2]);
  const year = Number(match[3] || currentYear);

  return buildIsoDate(year, month, day);
}

function findDayAndMonthAnywhereInText(value) {
  const text = String(value || "");
  const dayMatch = text.match(/^\s*(\d{1,2})\b/);

  if (!dayMatch) {
    return "";
  }

  const day = Number(dayMatch[1]);
  const month = getBankMonthNumber(text);

  if (!day || !month) {
    return "";
  }

  const yearMatch = text.match(/\b20\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : Number(getTurkeyTodayISO().slice(0, 4));
  return buildIsoDate(year, month, day);
}

function extractSignedBankAmountTitle(line, match) {
  const source = String(line || "");
  const amountStart = Number(match?.index || source.indexOf(match?.text || ""));
  const amountText = String(match?.text || "");
  let before = amountStart >= 0 ? source.slice(0, amountStart) : source;
  const after = amountStart >= 0 ? source.slice(amountStart + amountText.length) : "";
  const afterUntilNextAmount = after.split(/[+\-]\s*(?:₺\s*)?\d/)[0] || "";
  const balancePattern =
    /(?:kalan|islem\s+sonu|işlem\s+sonu|kullanilabilir|kullanılabilir)\s+bakiye\s*:?\s*[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi;

  before = before.replace(balancePattern, " ");
  before = before.split(balancePattern).pop() || before;
  const balanceIndex = Math.max(
    before.toLocaleLowerCase("tr-TR").lastIndexOf("kalan bakiye"),
    before.toLocaleLowerCase("tr-TR").lastIndexOf("islem sonu bakiye"),
    before.toLocaleLowerCase("tr-TR").lastIndexOf("işlem sonu bakiye")
  );

  if (balanceIndex >= 0) {
    before = before.slice(balanceIndex).replace(balancePattern, " ");
  }

  let title = cleanBankTitle(before);

  if ((!title || normalizeBankText(title).split(" ").length <= 1) && afterUntilNextAmount) {
    title = cleanBankTitle(afterUntilNextAmount);
  }

  title = title
    .replace(/^\d{1,2}\s+/g, "")
    .replace(/\b([01]?\d|2[0-3])[:.][0-5]\d(?::[0-5]\d)?\b/g, " ")
    .replace(/\b(?:el|bi|ge|gi)\b/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return title.slice(0, 90);
}

function getMobileBankRowStart(line, lines, index) {
  const text = String(line || "").trim();
  const match = text.match(/^(\d{1,2})(?:\s+|$)(.*)$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);

  if (day < 1 || day > 31) {
    return null;
  }

  const normalized = normalizeBankText(text);
  const trailing = normalizeBankText(match[2] || "");
  const nextLines = lines.slice(index + 1, index + 7);
  const context = normalizeBankText([text, ...nextLines].join(" "));

  if (
    isIgnoredBankOcrLine(normalized) ||
    /^\d{1,2}$/.test(text) && !nextLines.some((item) => getBankMonthNumber(item))
  ) {
    return null;
  }

  const hasMonthNearby = nextLines.some((item) => getBankMonthNumber(item));
  const currentAmounts = findUsableMoneyMatchesInLine(text);
  const nearbyAmounts = nextLines.slice(0, 4).some((item) => findUsableMoneyMatchesInLine(item).length);
  const hasSignedAmountNearby = currentAmounts.some((item) => item.details.hasExplicitSign) ||
    nextLines.slice(0, 4).some((item) => findUsableMoneyMatchesInLine(item).some((money) => money.details.hasExplicitSign));
  const hasAmountNearby = hasSignedAmountNearby || hasBankRowContext(context) && (currentAmounts.length > 0 || nearbyAmounts);
  const hasTitle = trailing.length >= 2 && !getBankMonthNumber(trailing);

  if (!hasAmountNearby && !hasMonthNearby && !hasTitle) {
    return null;
  }

  if (!hasBankRowContext(context) && !hasAmountNearby) {
    return null;
  }

  return {
    index,
    day,
  };
}

function parseMobileBankOcrBlock(block, start) {
  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  const date = buildMobileBankOcrDate(block, start.day);
  const title = extractMobileBankOcrTitle(block, amountDetails, start.day) || extractBankMovementTitle(block, amountDetails) || "Banka Hareketi";
  const type = inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);

  if (!date || !title) {
    return null;
  }

  return {
    title,
    date,
    amount: amountDetails.amount,
    type,
    sign: amountDetails.sign,
    hasExplicitSign: amountDetails.hasExplicitSign,
    raw: block.join(" "),
  };
}

function buildMobileBankOcrDate(block, day) {
  const currentDate = getTurkeyTodayISO();
  const currentYear = Number(currentDate.slice(0, 4));
  const currentMonth = Number(currentDate.slice(5, 7));
  const context = block.join(" ");

  let month = 0;
  let year = 0;

  for (const line of block) {
    if (!month) {
      month = getBankMonthNumber(line);
    }

    if (!year) {
      const yearMatch = String(line || "").match(/\b20\d{2}\b/);
      if (yearMatch) {
        year = Number(yearMatch[0]);
      }
    }
  }

  if (!month) {
    const dateMatch = findDateMatch(context);
    if (dateMatch) {
      const parsed = parseBankDate(dateMatch.text);
      if (parsed) {
        return parsed;
      }
    }
  }

  month = month || currentMonth;
  year = year || currentYear;

  return buildIsoDate(year, month, day);
}

function extractMobileBankOcrTitle(block, amountDetails, day) {
  const titleLines = [];

  block.forEach((line, index) => {
    let cleaned = String(line || "");
    cleaned = cleaned.replace(amountDetails.match || "", " ");
    cleaned = cleaned.replace(new RegExp(String.raw`^\s*${day}\b`), " ");
    cleaned = cleaned.replace(/\b([01]?\d|2[0-3])[:.][0-5]\d\b/g, " ");
    cleaned = cleaned.replace(/\b20\d{2}\b/g, " ");
    cleaned = cleaned.replace(/\b(?:TL|TRY|₺)\b/gi, " ");
    cleaned = cleanBankTitle(cleaned);

    const normalized = normalizeBankText(cleaned);

    if (!normalized) {
      return;
    }

    if (getBankMonthNumber(normalized) && normalized.split(" ").length <= 2) {
      return;
    }

    if (isIgnoredBankOcrLine(normalized) || hasAnyBankKeyword(normalized, BANK_OCR_BALANCE_KEYWORDS)) {
      return;
    }

    if (/^\d{1,2}$/.test(cleaned) || /^\d{3,}$/.test(cleaned)) {
      return;
    }

    if (/^\d+(?:\s+\d{1,2})?$/.test(normalized)) {
      return;
    }

    if (findMoneyMatchesInLine(cleaned).length && normalized.split(" ").length <= 3) {
      return;
    }

    titleLines.push(cleaned);
  });

  return cleanBankTitle(titleLines
    .join(" - ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s*-\s*|\s*-\s*$/g, ""))
    .slice(0, 90);
}


function parseBankScreenshotMovements(raw) {
  const lines = getBankOcrLines(raw);
  const rowStarts = [];

  for (let index = 0; index < lines.length; index += 1) {
    const parsed = parseBankScreenshotDateAt(lines, index);

    if (parsed) {
      rowStarts.push({ index, ...parsed });
    }
  }

  const uniqueStarts = rowStarts.filter((row, index, all) => index === 0 || row.index !== all[index - 1].index);

  return uniqueStarts
    .map((row, rowIndex) => {
      const nextStart = uniqueStarts[rowIndex + 1]?.index ?? lines.length;
      const block = lines.slice(row.index, nextStart);
      return parseBankScreenshotBlock(block, row);
    })
    .filter(Boolean);
}

function parseBankScreenshotDateAt(lines, index) {
  const line = lines[index] || "";
  const sameLine = parseBankScreenshotDateFromLine(line);

  if (sameLine) {
    return sameLine;
  }

  if (!/^\d{1,2}$/.test(line.trim())) {
    return null;
  }

  const day = Number(line.trim());

  if (day < 1 || day > 31) {
    return null;
  }

  let month = 0;
  let year = 0;
  let time = "";

  for (let offset = 1; offset <= 5 && index + offset < lines.length; offset += 1) {
    const candidate = lines[index + offset];
    const normalized = normalizeBankText(candidate);
    const monthValue = getBankMonthNumber(normalized);

    if (!month && monthValue) {
      month = monthValue;
      continue;
    }

    if (!year) {
      const yearMatch = candidate.match(/\b20\d{2}\b/);
      if (yearMatch) {
        year = Number(yearMatch[0]);
        continue;
      }
    }

    if (!time) {
      const timeMatch = candidate.match(/\b([01]?\d|2[0-3])[:.][0-5]\d\b/);
      if (timeMatch) {
        time = timeMatch[0].replace(".", ":");
      }
    }
  }

  if (!month || !year) {
    return null;
  }

  return {
    date: buildIsoDate(year, month, day),
    time,
    consumed: 4,
  };
}

function parseBankScreenshotDateFromLine(line) {
  const text = String(line || "");
  const normalized = normalizeBankText(text);
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|june|jun|temmuz|tem|july|jul|agustos|ağustos|agu|august|aug|eylul|eylül|eyl|september|sep|ekim|eki|october|oct|kasim|kasım|kas|november|nov|aralik|aralık|ara|december|dec)";
  const match = text.match(new RegExp(String.raw`\b(\d{1,2})\s+${monthRegex}\s+(20\d{2})(?:\s+([01]?\d|2[0-3])[:.]([0-5]\d))?`, "i"));

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = getBankMonthNumber(normalizeBankText(match[2]));
  const year = Number(match[3]);
  const time = match[4] ? `${match[4].padStart(2, "0")}:${match[5]}` : "";

  if (!day || !month || !year) {
    return null;
  }

  return {
    date: buildIsoDate(year, month, day),
    time,
    consumed: 1,
  };
}

function getBankMonthNumber(value) {
  const text = normalizeBankText(value);
  const tokens = text.split(" ").filter(Boolean);
  const months = [
    ["ocak", "jan", "january"],
    ["subat", "feb", "february"],
    ["mart", "mar", "march"],
    ["nisan", "apr", "april"],
    ["mayis", "may", "way", "mav"],
    ["haziran", "haz", "jun", "june"],
    ["temmuz", "tem", "jul", "july"],
    ["agustos", "agu", "aug", "august"],
    ["eylul", "eyl", "sep", "september"],
    ["ekim", "eki", "oct", "october"],
    ["kasim", "kas", "nov", "november"],
    ["aralik", "ara", "dec", "december"],
  ];

  const foundIndex = months.findIndex((aliases) =>
    aliases.some((alias) => text === alias || tokens.includes(alias))
  );
  return foundIndex >= 0 ? foundIndex + 1 : 0;
}

function parseBankScreenshotBlock(block, dateInfo) {
  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  const title = extractBankMovementTitle(block, amountDetails) || "Banka Hareketi";
  const type = inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);

  return {
    title,
    date: dateInfo.date,
    amount: amountDetails.amount,
    type,
    sign: amountDetails.sign,
    hasExplicitSign: amountDetails.hasExplicitSign,
    raw: block.join(" "),
  };
}

function findBankMovementAmount(block) {
  const candidates = [];

  block.forEach((line, lineIndex) => {
    const normalized = normalizeBankText(line);
    const moneyMatches = findMoneyMatchesInLine(line);

    moneyMatches.forEach((match) => {
      const parsedDetails = parseBankAmount(match.text);
      const details = adjustBankAmountDetailsForContext(parsedDetails, line, match);

      if (!details) {
        return;
      }

      const explicit = details.hasExplicitSign;
      const hasMoneySignal =
        explicit ||
        isMoneyLikeAmount(match.text) ||
        hasAnyBankKeyword(normalized, BANK_OCR_AMOUNT_KEYWORDS);

      if (!hasMoneySignal || isLikelyBankNoiseAmount(line, match, details)) {
        return;
      }

      const looksBalance = isBankBalanceAmountMatch(line, match);

      const score =
        (explicit ? 120 : 0) +
        (hasAnyBankKeyword(normalized, BANK_OCR_AMOUNT_KEYWORDS) ? 18 : 0) -
        (looksBalance ? 90 : 0) +
        lineIndex / 100;

      candidates.push({
        ...details,
        match: match.text,
        lineIndex,
        score,
        looksBalance,
        explicit,
      });
    });
  });

  const explicitCandidates = candidates.filter((item) => item.explicit && !item.looksBalance);

  if (explicitCandidates.length) {
    return explicitCandidates.sort((a, b) => b.score - a.score)[0];
  }

  const nonBalanceCandidates = candidates.filter((item) => !item.looksBalance);

  if (nonBalanceCandidates.length) {
    return nonBalanceCandidates.sort((a, b) => b.score - a.score)[0];
  }

  return null;
}

function findUsableMoneyMatchesInLine(line) {
  const normalized = normalizeBankText(line);

  return findMoneyMatchesInLine(line)
    .map((match) => {
      const parsedDetails = parseBankAmount(match.text);
      const details = adjustBankAmountDetailsForContext(parsedDetails, line, match);

      if (
        !details ||
        isBankBalanceAmountMatch(line, match) ||
        isLikelyBankNoiseAmount(line, match, details)
      ) {
        return null;
      }

      const hasMoneySignal =
        details.hasExplicitSign ||
        isMoneyLikeAmount(match.text) ||
        hasAnyBankKeyword(normalized, BANK_OCR_AMOUNT_KEYWORDS);

      return hasMoneySignal ? { match, details } : null;
    })
    .filter(Boolean);
}

function adjustBankAmountDetailsForContext(details, line, match) {
  if (!details) {
    return null;
  }

  const amountText = String(match?.text || "").trim();

  if (!/^-\s+/.test(amountText)) {
    return details;
  }

  const amountIndex = Number(match?.index || 0);
  const before = String(line || "").slice(Math.max(0, amountIndex - 120), amountIndex);

  if (hasBankIncomeContext(before) && !hasBankExpenseContext(before)) {
    return {
      ...details,
      sign: 1,
      hasExplicitSign: false,
    };
  }

  return details;
}

function hasBankIncomeContext(value) {
  const text = normalizeBankText(value);
  const incomeKeywords = ["gelen", "alacak", "gelir", "maas", "iade", "refund", "faiz", "mevduat", "hesaptan gelen"];
  return incomeKeywords.some((keyword) => text.includes(keyword));
}

function hasBankExpenseContext(value) {
  const text = normalizeBankText(value);
  const expenseKeywords = [
    "giden",
    "gider",
    "borc",
    "para cekme",
    "odeme",
    "komisyon",
    "bsmv",
    "kesinti",
    "ucret",
    "tahsilat",
  ];
  return expenseKeywords.some((keyword) => text.includes(keyword));
}

function isBankBalanceAmountMatch(line, match) {
  const text = String(line || "");
  const amountIndex = Number(match?.index || 0);
  const before = text.slice(Math.max(0, amountIndex - 34), amountIndex);
  const localContext = normalizeBankText(before);

  if (hasAnyBankKeyword(localContext, BANK_OCR_BALANCE_KEYWORDS)) {
    return true;
  }

  return false;
}

function isLikelyBankNoiseAmount(line, match, details) {
  const amountText = String(match?.text || "").trim();
  const source = String(line || "");
  const amountIndex = Number(match?.index || 0);
  const before = source.slice(Math.max(0, amountIndex - 18), amountIndex);
  const after = source.slice(amountIndex + amountText.length, amountIndex + amountText.length + 6);
  const normalizedLine = normalizeBankText(line);
  const digitsOnly = amountText.replace(/\D/g, "");

  if (!details.hasExplicitSign && /^\s*\d/.test(after)) {
    return true;
  }

  if (!details.hasExplicitSign && /%\s*$/.test(before)) {
    return true;
  }

  if (
    !details.hasExplicitSign &&
    !/TL|TRY|₺/i.test(amountText) &&
    details.amount < 1000 &&
    /\b(orani|oran|stopaj|faiz tutari|n faiz|f orani)\b/.test(normalizedLine)
  ) {
    return true;
  }

  if (details.hasExplicitSign || isMoneyLikeAmount(amountText) || hasAnyBankKeyword(normalizedLine, BANK_OCR_AMOUNT_KEYWORDS)) {
    return false;
  }

  if (/^\d{4}$/.test(digitsOnly) && details.amount >= 1900 && details.amount <= 2099) {
    return true;
  }

  if (/^\d{1,2}$/.test(digitsOnly) && (normalizedLine === digitsOnly || getBankMonthNumber(normalizedLine))) {
    return true;
  }

  if (
    /\b(iban|kart|hesap|referans|ref|kod|no|numara|sube|musteri)\b/.test(normalizedLine) &&
    !hasAnyBankKeyword(normalizedLine, BANK_OCR_AMOUNT_KEYWORDS)
  ) {
    return true;
  }

  return false;
}

function findMoneyMatchesInLine(line) {
  const text = normalizeOcrMoneyCharacters(line);
  const moneyPattern = /[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})\s*(?:TL|TRY|₺)?/gi;
  const matches = [];
  let match;

  while ((match = moneyPattern.exec(text))) {
    const candidate = match[0].trim();

    if (!candidate || /^\d{1,2}[,.]\d{2}$/.test(candidate) && !/[+\-₺]|TL|TRY/i.test(candidate)) {
      matches.push({ text: candidate, index: match.index });
      continue;
    }

    matches.push({ text: candidate, index: match.index });
  }

  return matches;
}

function extractBankMovementTitle(block, amountDetails) {
  const ignoredWords = [...BANK_OCR_IGNORE_KEYWORDS, ...BANK_OCR_BALANCE_KEYWORDS, "tekrarla"];

  const cleanedLines = block
    .map((line) => line.replace(amountDetails.match || "", " "))
    .map((line) => line.replace(/\b([01]?\d|2[0-3])[:.][0-5]\d\b/g, " "))
    .map((line) => line.replace(/\b20\d{2}\b/g, " "))
    .map((line) => line.replace(/^\s*\d{1,2}\s*$/g, " "))
    .map((line) => line.replace(/\b(?:TL|TRY|₺)\b/gi, " "))
    .map((line) => cleanBankTitle(line))
    .filter((line) => {
      const normalized = normalizeBankText(line);

      if (!normalized || normalized.length < 2) {
        return false;
      }

      if (getBankMonthNumber(normalized) && normalized.length <= 10) {
        return false;
      }

      if (ignoredWords.some((word) => normalized.includes(word))) {
        return false;
      }

      if (findMoneyMatchesInLine(line).length && normalizeBankText(line).split(" ").length <= 3) {
        return false;
      }

      if (/^\d+(?:\s+\d{1,2})?$/.test(normalized)) {
        return false;
      }

      return true;
    });

  return cleanBankTitle(cleanedLines.slice(0, 3).join(" - ").replace(/\s+-\s+$/g, "")).slice(0, 90);
}

function parseLooseBankMovementRows(raw) {
  const lines = getBankOcrLines(raw);
  const joinedRows = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const dateMatch = findDateMatch(line);

    if (!dateMatch) {
      continue;
    }

    const row = [line];
    for (let offset = 1; offset <= 5 && index + offset < lines.length; offset += 1) {
      row.push(lines[index + offset]);
      if (findBankMovementAmount(row)) {
        break;
      }
    }
    joinedRows.push(row.join(" "));
  }

  return joinedRows.map((row) => {
    const dateMatch = findDateMatch(row);
    const amountDetails = findBankMovementAmount([row]);

    if (!dateMatch || !amountDetails) {
      return null;
    }

    const date = parseBankDate(dateMatch.text);
    const title = extractBankMovementTitle([row.replace(dateMatch.text, " ")], amountDetails) || "Banka Hareketi";

    return {
      title,
      date,
      amount: amountDetails.amount,
      type: inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign),
      sign: amountDetails.sign,
      hasExplicitSign: amountDetails.hasExplicitSign,
      raw: row,
    };
  }).filter(Boolean);
}


function parseBankReceipts(raw) {
  const text = String(raw || "");
  const normalized = normalizeBankText(text);
  const receiptKeywords = [
    "dekont",
    "e dekont",
    "islem tarihi",
    "valor",
    "kredi karti odemesi",
    "giden fast",
    "hesabinizdan",
    "eft tutari",
    "havale tutari",
  ];
  const looksLikeReceipt = receiptKeywords.filter((keyword) => normalized.includes(keyword)).length >= 2;

  if (!looksLikeReceipt) {
    return [];
  }

  const amountDetails = findReceiptAmountDetails(text);

  if (!amountDetails) {
    return [];
  }

  const type = inferReceiptType(text, amountDetails.line || "", amountDetails);
  const date = findReceiptDate(text);
  const title = findReceiptTitle(text);

  if (!date || !title) {
    return [];
  }

  return [
    {
      title,
      date,
      amount: amountDetails.amount,
      type,
      sign: type === "expense" ? -1 : 1,
      hasExplicitSign: true,
      raw: text,
    },
  ];
}

function findReceiptAmountDetails(raw) {
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const descriptors = [
    { keywords: ["hesabinizdan", "cekilmistir"], type: "expense" },
    { keywords: ["toplam tahsilat tutari"], type: "expense" },
    { keywords: ["giden fast tutari"], type: "expense" },
    { keywords: ["tutar"], type: "expense" },
    { keywords: ["eft tutari"], type: "expense" },
    { keywords: ["havale tutari"], type: "expense" },
    { keywords: ["hesabiniza", "yatirilmistir"], type: "income" },
  ];

  for (const descriptor of descriptors) {
    for (const line of lines) {
      const normalizedLine = normalizeBankText(line);
      const matchesDescriptor = descriptor.keywords.some((keyword) => normalizedLine.includes(keyword));

      if (!matchesDescriptor) {
        continue;
      }

      const parsed = extractReceiptAmountFromLine(line);

      if (parsed) {
        return { ...parsed, line, typeHint: descriptor.type };
      }
    }
  }

  return extractLabeledAmountFromText(raw) || extractAmountFromText(raw);
}

function extractReceiptAmountFromLine(line) {
  const moneySource = String.raw`([+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?)`;
  const patterns = [
    new RegExp(String.raw`(?:Hesabınızdan|Hesabinizdan|Hesabınıza|Hesabiniza)\s+${moneySource}`, "i"),
    new RegExp(
      String.raw`(?:TOPLAM\s+TAHS[İI]LAT\s+TUTARI|G[İI]DEN\s+FAST\s+TUTARI|EFT\s+TUTARI|HAVALE\s+TUTARI|TUTAR(?:I)?)\s*:?\s*${moneySource}`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = String(line || "").match(pattern);

    if (match) {
      const parsed = parseBankAmount(match[1]);
      if (parsed) {
        return { ...parsed, match: match[1], index: match.index || 0 };
      }
    }
  }

  return extractAmountFromText(line);
}

function inferReceiptType(raw, amountLine = "", amountDetails = null) {
  if (amountDetails?.sign < 0) {
    return "expense";
  }

  if (amountDetails?.sign > 0 && amountDetails?.hasExplicitSign) {
    return "income";
  }

  if (amountDetails?.typeHint === "expense" || amountDetails?.typeHint === "income") {
    return amountDetails.typeHint;
  }

  const text = normalizeBankText(`${raw} ${amountLine}`);

  if (
    text.includes("giden") ||
    text.includes("hesabinizdan") ||
    text.includes("cekilmistir") ||
    text.includes("tahsilati") ||
    text.includes("kredi karti borcu odeme") ||
    text.includes("kredi karti odemesi") ||
    text.includes("odeme")
  ) {
    return "expense";
  }

  if (
    text.includes("gelen") ||
    text.includes("hesabiniza") ||
    text.includes("yatirilmistir") ||
    text.includes("iade")
  ) {
    return "income";
  }

  return "expense";
}

function findReceiptDate(raw) {
  const text = String(raw || "");
  const labeledDatePatterns = [
    /İŞLEM TARİHİ\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /ISLEM TARIHI\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /İşlem Tarihi\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /VAL[ÖO]R\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /BELGE TARİHİ\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /BELGE TARIHI\s*:?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
    /İŞLEM TARİHİ\s*:?\s*(\d{4}[./-]\d{1,2}[./-]\d{1,2})/i,
    /ISLEM TARIHI\s*:?\s*(\d{4}[./-]\d{1,2}[./-]\d{1,2})/i,
  ];

  for (const pattern of labeledDatePatterns) {
    const match = text.match(pattern);

    if (match) {
      return parseBankDate(match[1]);
    }
  }

  const dateMatch = findDateMatch(text);
  return dateMatch ? parseBankDate(dateMatch.text) : "";
}

function findReceiptTitle(raw) {
  const text = String(raw || "");
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const normalized = normalizeBankText(text);

  if (normalized.includes("kredi karti borcu odeme") || normalized.includes("kredi karti odemesi")) {
    const cardLine = lines.find((line) => normalizeBankText(line).includes("kart numarasi"));
    const last4 = cardLine ? (cardLine.match(/(\d{4})\s*$/) || [])[1] : "";
    return last4 ? `Kredi Kartı Borcu Ödeme **** ${last4}` : "Kredi Kartı Borcu Ödeme";
  }

  if (normalized.includes("hesaptan hesaba havale")) {
    const receiver = extractReceiptField(lines, ["Alacaklı Adı Soyadı", "Alicakli Adi Soyadi", "Alacaklı Adı", "Alicakli Adi"]);
    return cleanBankTitle(["Hesaptan Hesaba Havale", receiver].filter(Boolean).join(" - "));
  }

  if (normalized.includes("giden fast eft")) {
    const receiver = extractReceiptField(lines, ["ALICI ÜNVANI", "ALICI UNVANI", "Alıcı", "Alici"]);
    const description = extractReceiptField(lines, ["AÇIKLAMA", "ACIKLAMA"]);
    return cleanBankTitle(["Giden FAST/EFT", receiver, description].filter(Boolean).join(" - "));
  }

  if (normalized.includes("fast gonderimi") || normalized.includes("fast gönderimi")) {
    const receiver = extractReceiptField(lines, ["ALICI ADI", "ALICI UNVANI"]);
    const description = extractReceiptField(lines, ["AÇIKLAMA", "ACIKLAMA"]);
    return cleanBankTitle(["FAST Gönderimi", receiver, description].filter(Boolean).join(" - "));
  }

  const labeledTitlePatterns = [
    /Ödeme Açıklama\s*:\s*(.+)$/i,
    /Odeme Aciklama\s*:\s*(.+)$/i,
    /Açıklama\s*:\s*(.+)$/i,
    /Aciklama\s*:\s*(.+)$/i,
    /İşlem Açıklaması\s*:\s*(.+)$/i,
    /Islem Aciklamasi\s*:\s*(.+)$/i,
  ];

  for (const line of lines) {
    for (const pattern of labeledTitlePatterns) {
      const match = line.match(pattern);

      if (match && cleanBankTitle(match[1])) {
        return cleanBankTitle(match[1]);
      }
    }
  }

  const merchantLine = lines.find((line) => {
    const normalizedLine = normalizeBankText(line);
    return (
      normalizedLine.includes("kurum tahsilati") ||
      normalizedLine.includes("emeklilik") ||
      normalizedLine.includes("sigorta") ||
      normalizedLine.includes("internet") ||
      normalizedLine.includes("aidat")
    );
  });

  return cleanBankTitle(merchantLine || "Banka Dekontu");
}

function extractReceiptField(lines, labels) {
  const normalizedLabels = labels.map(normalizeBankText);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const label of labels) {
      const pattern = new RegExp(
        `${escapeRegExp(label)}\\s*:\\s*([^:]+?)(?=\\s+[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ\\s/.-]{1,40}\\s*:|$)`,
        "i"
      );
      const match = String(line || "").match(pattern);
      const value = match ? cleanBankTitle(match[1]) : "";

      if (value) {
        const continuation = shouldReadReceiptFieldContinuation(label) ? getReceiptFieldContinuation(lines, index) : "";
        return cleanBankTitle([value, continuation].filter(Boolean).join(" "));
      }
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = normalizeBankText(line);
    const matchedLabel = normalizedLabels.find((label) => normalizedLine.startsWith(label));

    if (!matchedLabel || !line.includes(":")) {
      continue;
    }

    const afterColon = line.split(":").slice(1).join(":").trim();
    const value = cleanBankTitle(afterColon);

    if (value) {
      return value;
    }
  }

  return "";
}


function shouldReadReceiptFieldContinuation(label) {
  const normalized = normalizeBankText(label);
  return normalized.includes("alacakli adi") || normalized.includes("alici adi") || normalized.includes("alici unvani");
}

function getReceiptFieldContinuation(lines, index) {
  const nextLine = cleanBankTitle(lines[index + 1] || "");
  const normalizedNext = normalizeBankText(nextLine);

  if (
    !nextLine ||
    nextLine.includes(":") ||
    normalizedNext.includes("iban") ||
    normalizedNext.includes("hesap") ||
    normalizedNext.includes("komisyon") ||
    normalizedNext.includes("tutar") ||
    normalizedNext.includes("vergi") ||
    normalizedNext.includes("tckn") ||
    normalizedNext.includes("vkn") ||
    normalizedNext.includes("sorgu") ||
    normalizedNext.includes("fis no") ||
    /^\d/.test(nextLine)
  ) {
    return "";
  }

  return nextLine;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function parseBankCsv(raw) {
  const delimiter = detectCsvDelimiter(raw);

  if (!delimiter) {
    return [];
  }

  const rows = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseDelimitedLine(line, delimiter))
    .filter((row) => row.some((cell) => cell.trim()));

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeBankText);
  const hasHeader =
    headers.some((header) => header.includes("tarih") || header.includes("date")) &&
    headers.some(
      (header) =>
        header.includes("tutar") ||
        header.includes("amount") ||
        header.includes("borc") ||
        header.includes("alacak")
    );

  if (!hasHeader) {
    return [];
  }

  const dateIndex = findHeaderIndex(headers, ["tarih", "date", "valor"]);
  let descriptionIndex = findHeaderIndex(headers, [
    "aciklama",
    "description",
    "detay",
    "merchant",
    "isyeri",
    "unvan",
    "firma",
  ]);
  const debitIndex = findHeaderIndex(headers, ["borc", "debit", "harcama", "cekilen", "odeme"], [
    "bakiye",
    "balance",
  ]);
  const creditIndex = findHeaderIndex(headers, ["alacak", "credit", "gelir", "gelen", "yatirilan", "iade"], [
    "bakiye",
    "balance",
  ]);
  const amountIndex = findHeaderIndex(headers, ["tutar", "amount", "miktar"], ["bakiye", "balance"]);

  if (descriptionIndex === -1) {
    descriptionIndex = headers.findIndex(
      (header) => header.includes("islem") && !header.includes("tarih") && !header.includes("tutar")
    );
  }

  if (dateIndex === -1 || (amountIndex === -1 && debitIndex === -1 && creditIndex === -1)) {
    return [];
  }

  return rows
    .slice(1)
    .map((row) => {
      const date = parseBankDate(row[dateIndex]);
      const amountDetails = getCsvAmountDetails(row, amountIndex, debitIndex, creditIndex);

      if (!date || !amountDetails) {
        return null;
      }

      const title =
        descriptionIndex >= 0
          ? row[descriptionIndex]
          : buildBankTitleFromRow(row, [dateIndex, amountIndex, debitIndex, creditIndex]);

      return {
        title,
        date,
        amount: amountDetails.amount,
        type: amountDetails.type || inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign),
        sign: amountDetails.sign,
        hasExplicitSign: amountDetails.hasExplicitSign,
        raw: row.join(" "),
      };
    })
    .filter(Boolean);
}

function parseBankText(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lineMovements = parseBankTextChunks(lines);

  if (lineMovements.length) {
    return lineMovements;
  }

  const blocks = raw
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

  return parseBankTextChunks(blocks);
}

function parseBankTextChunks(chunks) {
  return chunks
    .map((chunk) => {
      const normalized = normalizeBankText(chunk);

      if (normalized.includes("tarih") && normalized.includes("tutar")) {
        return null;
      }

      const dateMatch = findDateMatch(chunk);

      if (!dateMatch) {
        return null;
      }

      const date = parseBankDate(dateMatch.text);
      const chunkWithoutDate = chunk.replace(dateMatch.text, " ");
      const amountDetails = extractLabeledAmountFromText(chunkWithoutDate) || extractAmountFromText(chunkWithoutDate);

      if (!date || !amountDetails) {
        return null;
      }

      const title = cleanBankTitle(chunkWithoutDate.replace(amountDetails.match, " "));

      return {
        title,
        date,
        amount: amountDetails.amount,
        type: inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign),
        sign: amountDetails.sign,
        hasExplicitSign: amountDetails.hasExplicitSign,
        raw: chunk,
      };
    })
    .filter(Boolean);
}

function detectCsvDelimiter(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
  const candidates = [";", "\t", ","];
  let bestDelimiter = "";
  let bestScore = 0;

  candidates.forEach((delimiter) => {
    const counts = lines.map((line) => parseDelimitedLine(line, delimiter).length).filter((count) => count > 1);

    if (counts.length < 2) {
      return;
    }

    const average = counts.reduce((sum, count) => sum + count, 0) / counts.length;
    const score = counts.length * 100 + average * 10;

    if (average >= 3 && score > bestScore) {
      bestDelimiter = delimiter;
      bestScore = score;
    }
  });

  return bestDelimiter;
}

function parseDelimitedLine(line, delimiter) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function findHeaderIndex(headers, includes, excludes = []) {
  return headers.findIndex(
    (header) =>
      includes.some((keyword) => header.includes(keyword)) &&
      !excludes.some((keyword) => header.includes(keyword))
  );
}

function getCsvAmountDetails(row, amountIndex, debitIndex, creditIndex) {
  const credit = creditIndex >= 0 ? parseBankAmount(row[creditIndex]) : null;
  const debit = debitIndex >= 0 ? parseBankAmount(row[debitIndex]) : null;

  if (credit && credit.amount > 0) {
    return { ...credit, type: "income" };
  }

  if (debit && debit.amount > 0) {
    return { ...debit, type: "expense" };
  }

  const amount = amountIndex >= 0 ? parseBankAmount(row[amountIndex]) : null;

  if (!amount) {
    return null;
  }

  if (amount.sign < 0) {
    return { ...amount, type: "expense" };
  }

  if (amount.hasExplicitSign && amount.sign > 0) {
    return { ...amount, type: "income" };
  }

  return amount;
}

function extractLabeledAmountFromText(text) {
  const amountSource = String.raw`([+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?)`;
  const patterns = [
    new RegExp(String.raw`(?:İŞLEM|ISLEM|ALIŞVERİŞ|ALISVERIS|ÖDEME|ODEME|ÇEKİLEN|CEKILEN|YATAN|GELEN)?\s*TUTAR(?:I)?\s*:?\s*${amountSource}`, "gi"),
    new RegExp(String.raw`(?:HESABINIZDAN|HESABINIZA|HESABINIZA|HESABINIZDAN)[^\d+-]{0,60}${amountSource}`, "gi"),
  ];

  for (const pattern of patterns) {
    const matches = Array.from(String(text || "").matchAll(pattern));

    for (const match of matches) {
      const amountText = match[1] || match[0];
      const parsed = parseBankAmount(amountText);

      if (parsed && parsed.amount > 0 && isMoneyLikeAmount(amountText)) {
        return parsed;
      }
    }
  }

  return null;
}

function extractAmountFromText(text) {
  const amountPattern =
    /[+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi;
  const candidates = Array.from(text.matchAll(amountPattern))
    .map((match) => {
      const parsed = parseBankAmount(match[0]);
      return parsed ? { ...parsed, match: match[0], index: match.index || 0 } : null;
    })
    .filter((candidate) => {
      if (!candidate) {
        return false;
      }

      if (isLikelySequenceOrTimeAmount(text, candidate)) {
        return false;
      }

      const hasMoneySignal = isMoneyLikeAmount(candidate.match);
      return hasMoneySignal || candidate.amount >= 1000;
    });

  if (!candidates.length) {
    return null;
  }

  const signed = candidates.find((candidate) => candidate.hasExplicitSign);

  if (signed) {
    return signed;
  }

  if (normalizeBankText(text).includes("bakiye") && candidates.length > 1) {
    return candidates[0];
  }

  return candidates[candidates.length - 1];
}

function isMoneyLikeAmount(value) {
  return /[+-]|₺|TL|TRY|[.,]\d{1,2}\b|\d{1,3}(?:[.\s]\d{3})+/i.test(String(value || ""));
}

function isLikelySequenceOrTimeAmount(source, candidate) {
  const text = String(source || "");
  const index = candidate.index || 0;
  const before = text.slice(Math.max(0, index - 28), index);
  const after = text.slice(index + candidate.match.length, index + candidate.match.length + 8);
  const normalizedBefore = normalizeBankText(before);

  if ((normalizedBefore.includes("sira no") || normalizedBefore.includes("referans")) && !/TL|TRY|₺/i.test(candidate.match)) {
    return true;
  }

  if (/\d{4}[./-]\d{1,2}[./-]\d{1,2}\s*$/.test(before) && /^[.\-:]\d/.test(after)) {
    return true;
  }

  if (/^[.\-:]\d/.test(after) && /^[-+]?\s*\d{1,2}[,.]\d{2}$/.test(candidate.match.trim())) {
    return true;
  }

  return false;
}

function parseBankAmount(input) {
  const original = String(input || "").trim();

  if (!/\d/.test(original)) {
    return null;
  }

  let sign = 1;
  let hasExplicitSign = false;
  const normalized = normalizeBankText(original);

  if (/\(.*\)/.test(original) || original.includes("-") || original.includes("−")) {
    sign = -1;
    hasExplicitSign = true;
  }

  if (original.includes("+")) {
    sign = 1;
    hasExplicitSign = true;
  }

  if (normalized.includes("borc") || normalized.includes("debit") || normalized.includes("gider")) {
    sign = -1;
    hasExplicitSign = true;
  }

  if (normalized.includes("alacak") || normalized.includes("credit") || normalized.includes("gelir")) {
    sign = 1;
    hasExplicitSign = true;
  }

  let cleaned = original
    .replace(/TRY|TL|₺/gi, "")
    .replace(/\s/g, "")
    .replace(/[−]/g, "-")
    .replace(/[^0-9,.\-+]/g, "")
    .replace(/[+-]/g, "");

  if (!cleaned) {
    return null;
  }

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    cleaned =
      lastComma > lastDot ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    cleaned = /,\d{1,2}$/.test(cleaned) ? cleaned.replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastDot > -1 && !/\.\d{1,2}$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "");
  }

  const amount = Number.parseFloat(cleaned);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return { amount: Math.abs(amount), sign, hasExplicitSign };
}

function findDateMatch(input) {
  const text = String(input || "");
  const patterns = [
    /\b\d{4}[./-]\d{1,2}[./-]\d{1,2}\b/,
    /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/,
    /\b\d{1,2}\s+(?:ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)\s+\d{2,4}\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return { text: match[0], index: match.index };
    }
  }

  return null;
}

function parseBankDate(input) {
  const dateMatch = findDateMatch(input);

  if (!dateMatch) {
    return "";
  }

  const text = dateMatch.text.trim();
  const namedMonthParts = normalizeBankText(text).split(" ");
  const months = {
    ocak: 1,
    subat: 2,
    mart: 3,
    nisan: 4,
    mayis: 5,
    haziran: 6,
    temmuz: 7,
    agustos: 8,
    eylul: 9,
    ekim: 10,
    kasim: 11,
    aralik: 12,
  };

  if (namedMonthParts.length === 3 && months[namedMonthParts[1]]) {
    return buildIsoDate(namedMonthParts[2], months[namedMonthParts[1]], namedMonthParts[0]);
  }

  const parts = text.split(/[./-]/).map((part) => part.trim());

  if (parts[0].length === 4) {
    return buildIsoDate(parts[0], parts[1], parts[2]);
  }

  return buildIsoDate(parts[2], parts[1], parts[0]);
}

function buildIsoDate(yearValue, monthValue, dayValue) {
  let year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (year < 100) {
    year += 2000;
  }

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function cleanBankTitle(title) {
  return String(title || "")
    .replace(/^\s*\d{1,2}\s+(?=[A-ZÇĞİÖŞÜa-zçğıöşü])/u, " ")
    .replace(/(\bGIDEN\s+FAST\b.+?)\s+-\s+GELEN\s+FAST\b.*$/i, "$1")
    .replace(/(\bGELEN\s+FAST\b.+?)\s+-\s+GIDEN\s+FAST\b.*$/i, "$1")
    .replace(/\b(?:TL|TRY)\b/gi, " ")
    .replace(/(?:İşlem|Islem)\s+Sonu\s+Bakiye\s*:?\s*[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?/gi, " ")
    .replace(/Kullanılabilir\s+Bakiye\s*:?\s*[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?/gi, " ")
    .replace(/Kalan\s+Bakiye\s*:?\s*[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?/gi, " ")
    .replace(/(?:İşlem|Islem)\s+Sonu\s+Bakiye/gi, " ")
    .replace(/Kullanılabilir\s+Bakiye/gi, " ")
    .replace(/Kalan\s+Bakiye/gi, " ")
    .replace(/(?:Kart\s+Limiti|Dönem\s+İçi|Donem\s+Ici)\s*:?\s*/gi, " ")
    .replace(/\b(?:may|mayıs|mayis|way|mav)\s+(?=(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?)/gi, " ")
    .replace(/\b(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})\b/g, " ")
    .replace(/\b(?:may|mayıs|mayis|way|mav)\b/gi, " ")
    .replace(/\b(?:el|bi|ge|gi)\b/gi, " ")
    .replace(/\b([01]?\d|2[0-3])([0-5]\d)\b/g, " ")
    .replace(/[;,\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[-:+*/\s]+|[-:+*/\s]+$/g, "")
    .trim();
}

function buildBankTitleFromRow(row, usedIndexes) {
  return row
    .filter((cell, index) => cell && !usedIndexes.includes(index))
    .join(" ")
    .trim();
}

function inferTransactionType(title, sign = 1, hasExplicitSign = false) {
  if (sign < 0) {
    return "expense";
  }

  if (hasExplicitSign && sign > 0) {
    return "income";
  }

  const text = normalizeBankText(title);
  const incomeKeywords = ["maas", "ucret", "gelir", "alacak", "gelen", "iade", "refund", "iptal", "temettu", "faiz"];

  return incomeKeywords.some((keyword) => text.includes(keyword)) ? "income" : "expense";
}

function categorizeBankTransaction(title, type) {
  const text = normalizeBankText(title);

  if (type === "transfer") {
    return "Transfer";
  }

  if (type === "income") {
    if (["maas", "ucret"].some((keyword) => text.includes(keyword))) {
      return "Maaş";
    }

    if (["freelance", "serbest", "proje"].some((keyword) => text.includes(keyword))) {
      return "Serbest İş";
    }

    if (["faiz", "temettu", "borsa", "fon", "yatirim", "kripto"].some((keyword) => text.includes(keyword))) {
      return "Yatırım";
    }

    if (["hediye", "iade", "refund", "bonus"].some((keyword) => text.includes(keyword))) {
      return "Hediye";
    }

    return "Diğer";
  }

  if (["market", "migros", "bim", "a101", "sok", "carrefour", "macrocenter"].some((keyword) => text.includes(keyword))) {
    return "Market";
  }

  if (["elektrik", "dogalgaz", "su faturasi", "internet", "gsm", "telefon", "fatura"].some((keyword) => text.includes(keyword))) {
    return "Fatura";
  }

  if (["akaryakit", "benzin", "motorin", "metro", "otobus", "taksi", "ulasim", "istanbulkart"].some((keyword) => text.includes(keyword))) {
    return "Ulaşım";
  }

  if (["eczane", "hastane", "saglik", "doktor", "klinik"].some((keyword) => text.includes(keyword))) {
    return "Sağlık";
  }

  if (["emeklilik", "bes", "fon", "yatirim", "hayat"].some((keyword) => text.includes(keyword))) {
    return "Yatırım";
  }

  if (["kira", "aidat", "mobilya", "yapi market", "ev"].some((keyword) => text.includes(keyword))) {
    return "Ev";
  }

  if (["restoran", "cafe", "kahve", "yemek", "sinema", "otel", "netflix", "spotify", "steam"].some((keyword) => text.includes(keyword))) {
    return "Sosyal";
  }

  return "Diğer";
}

function getTransactionSignature(item) {
  const time = getTransactionTime(item) || "";
  return [
    item.date,
    time.slice(0, 5),
    item.type,
    Number(item.amount || 0).toFixed(2),
    normalizeBankText(item.title),
    String(item.paymentAccountId || ""),
    String(item.transferAccountId || ""),
  ].join("|");
}

function normalizeBankText(value) {
  const map = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (char) => map[char] || char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isValidTransaction(item) {
  return (
    item &&
    typeof item.id === "string" &&
    (item.type === "income" || item.type === "expense" || item.type === "transfer") &&
    typeof item.title === "string" &&
    typeof item.amount === "number" &&
    typeof item.category === "string" &&
    typeof item.date === "string" &&
    typeof item.note === "string"
  );
}

function hideStartupSplash() {
  const finishStartup = () => {
    startupSplashFinished = true;
    renderAuthState();

    if (loginScreen && !currentUser) {
      loginScreen.removeAttribute("aria-hidden");
    }

    if (appShell && currentUser) {
      appShell.removeAttribute("aria-hidden");
    }
  };

  if (!appSplashScreen) {
    finishStartup();
    return;
  }

  loginScreen.hidden = true;
  loginScreen.setAttribute("aria-hidden", "true");
  appShell.hidden = true;
  appShell.setAttribute("aria-hidden", "true");

  window.setTimeout(() => {
    appSplashScreen.classList.add("is-hidden");
    finishStartup();
  }, 1400);

  window.setTimeout(() => {
    appSplashScreen.remove();
  }, 2100);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

