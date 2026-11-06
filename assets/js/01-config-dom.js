const STORAGE_KEY = "akis-budget-tracker";

const ASSETS_STORAGE_KEY = "akis-budget-assets";

const BES_STORAGE_KEY = "akis-budget-bes";

const BORC_ALACAK_STORAGE_KEY = "akis-budget-debt-receivables";

const DELETED_ASSET_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-asset-tombstones";

const DELETED_BES_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-bes-tombstones";

const SILINEN_BORC_ALACAK_STORAGE_KEY = "akis-budget-deleted-debt-receivable-tombstones";

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

const TRANSACTIONS_STATE_UPDATED_STORAGE_KEY = "akis-budget-transactions-state-updated";

const TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY = "akis-budget-transactions-cloud-dirty";

const PROFILE_CLOUD_DIRTY_STORAGE_KEY = "akis-budget-profile-cloud-dirty";
const PROFILE_CONTACT_STORAGE_KEY = "akis-budget-profile-contact";

const TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY = "akis-budget-transactions-cloud-full-sync";

const RECENT_ADDED_TRANSACTION_DAYS = 3;

const MAX_DELETED_TRANSACTION_MARKERS = 5000;

const MAX_DELETED_TRANSFER_TOMBSTONES = 2000;

const MAX_DELETED_PROFILE_TOMBSTONES = 2000;

const MAX_PROFILE_TRANSACTIONS_BACKUP_BYTES = 850 * 1024;

const CLOUD_WRITE_TIMEOUT_MS = 45000;

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

const BULK_ENTRY_INITIAL_ROWS = 1;

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
  homeView: true,
  entryView: true,
  assetsView: true,
  cardsView: true,
  besView: true,
  debtsView: true,
  summaryView: true,
  historyView: true,
  settingsView: true,
};

const form = document.getElementById("entryForm");

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

const paymentAccountCurrentStatementDebt = document.getElementById("paymentAccountCurrentStatementDebt");

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

const activeStatementDebtTotal = document.getElementById("activeStatementDebtTotal");

const bankBalanceTotal = document.getElementById("bankBalanceTotal");

const besForm = document.getElementById("besForm");

const besTotal = document.getElementById("besTotal");

const besStateTotal = document.getElementById("besStateTotal");

const besStateGainTotal = document.getElementById("besStateGainTotal");

const besGainTotal = document.getElementById("besGainTotal");

const besList = document.getElementById("besList");

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

const entryInstallmentCheckbox = document.getElementById("entryInstallmentCheckbox");

const entryInstallmentCountField = document.getElementById("entryInstallmentCountField");

const entryInstallmentCountInput = document.getElementById("entryInstallmentCountInput");

const entryDebtPaymentCheckbox = document.getElementById("entryDebtPaymentCheckbox");

const entryDebtPaymentOptions = document.getElementById("entryDebtPaymentOptions");

const entryDebtPaymentTarget = document.getElementById("entryDebtPaymentTarget");

const entryDebtPaymentTargetLabel = document.getElementById("entryDebtPaymentTargetLabel");

const entryDebtPaymentHint = document.getElementById("entryDebtPaymentHint");

const entryFormStatus = document.getElementById("entryFormStatus");

const openBulkEntryModalButton = document.getElementById("openBulkEntryModalButton");

const bulkEntryModal = document.getElementById("bulkEntryModal");

const bulkEntryForm = document.getElementById("bulkEntryForm");

const bulkEntryRows = document.getElementById("bulkEntryRows");

const bulkEntryAddRowButton = document.getElementById("bulkEntryAddRowButton");

const bulkEntryClearButton = document.getElementById("bulkEntryClearButton");

const bulkEntrySubmitButton = document.getElementById("bulkEntrySubmitButton");

const closeBulkEntryModalButton = document.getElementById("closeBulkEntryModalButton");

const bulkEntryStatus = document.getElementById("bulkEntryStatus");

const dateInput = document.getElementById("date");

const homeSummaryStartDate = document.getElementById("homeSummaryStartDate");

const homeSummaryEndDate = document.getElementById("homeSummaryEndDate");

const applyHomeSummaryFilterButton = document.getElementById("applyHomeSummaryFilterButton");

const clearHomeSummaryFilterButton = document.getElementById("clearHomeSummaryFilterButton");

const homeSummaryFilterStatus = document.getElementById("homeSummaryFilterStatus");

const transactionList = document.getElementById("transactionList");

const transactionTemplate = document.getElementById("transactionTemplate");

const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");

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

const openRecentTransactionsButton = document.getElementById("openRecentTransactionsButton");

const historySearchModal = document.getElementById("historySearchModal");

const openHistorySearchModalButton = document.getElementById("openHistorySearchModalButton");

const closeHistorySearchModalButton = document.getElementById("closeHistorySearchModalButton");

const recentTransactionsModal = document.getElementById("recentTransactionsModal");

const recentTransactionsList = document.getElementById("recentTransactionsList");

const closeRecentTransactionsButton = document.getElementById("closeRecentTransactionsButton");

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

const profileModal = document.getElementById("profileModal");

const profileForm = document.getElementById("profileForm");

const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileHomeAddress = document.getElementById("profileHomeAddress");
const profileWorkAddress = document.getElementById("profileWorkAddress");
const profilePasswordSettingsButton = document.getElementById("profilePasswordSettingsButton");
const profilePasswordFields = document.getElementById("profilePasswordFields");

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

const cloudBackupButton = document.getElementById("cloudBackupButton");

const localBackupDownloadButton = document.getElementById("localBackupDownloadButton");

const localBackupImportButton = document.getElementById("localBackupImportButton");

const localBackupImportInput = document.getElementById("localBackupImportInput");

const cloudBackupStatus = document.getElementById("cloudBackupStatus");

const genericConfirmModal = document.getElementById("genericConfirmModal");

const genericConfirmTitle = document.getElementById("genericConfirmTitle");

const genericConfirmText = document.getElementById("genericConfirmText");

const genericConfirmButton = document.getElementById("genericConfirmButton");

const genericConfirmCancelButton = document.getElementById("genericConfirmCancelButton");

const closeProfileButton = document.getElementById("closeProfileButton");

const deleteUserButton = document.getElementById("deleteUserButton");

const deleteUserStatus = document.getElementById("deleteUserStatus");
const deleteAccountCodeModal = document.getElementById("deleteAccountCodeModal");
const deleteAccountCodeForm = document.getElementById("deleteAccountCodeForm");
const deleteAccountCodeInput = document.getElementById("deleteAccountCodeInput");
const deleteAccountCodeStatus = document.getElementById("deleteAccountCodeStatus");
const deleteAccountCodeEmail = document.getElementById("deleteAccountCodeEmail");
const closeDeleteAccountCodeButton = document.getElementById("closeDeleteAccountCodeButton");
const resendDeleteAccountCodeButton = document.getElementById("resendDeleteAccountCodeButton");

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
const transactionInstallmentCheckbox = document.getElementById("transactionInstallmentCheckbox");

const transactionTrackCheckbox = document.getElementById("transactionTrackCheckbox");
const transactionTrackOptions = document.getElementById("transactionTrackOptions");
const transactionTrackTypeInput = document.getElementById("transactionTrackTypeInput");
const transactionTrackDueDateLabel = document.getElementById("transactionTrackDueDateLabel");
const transactionTrackDueDateInput = document.getElementById("transactionTrackDueDateInput");
const transactionTrackInstallmentCountLabel = document.getElementById("transactionTrackInstallmentCountLabel");
const transactionTrackInstallmentCountInput = document.getElementById("transactionTrackInstallmentCountInput");

const transactionEditStatus = document.getElementById("transactionEditStatus");

const closeTransactionEditButton = document.getElementById("closeTransactionEditButton");

const openEntryModalButton = document.getElementById("openEntryModalButton");
const openBankImportModalButton = document.getElementById("openBankImportModalButton");
const bankImportModal = document.getElementById("bankImportModal");
const closeBankImportModalButton = document.getElementById("closeBankImportModalButton");

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
const saveCategoryManageButton = document.getElementById("saveCategoryManageButton");

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

const closePaymentAccountRecordsButton = document.getElementById("closePaymentAccountRecordsButton");

const cloudStatus = document.getElementById("cloudStatus");

const loginScreen = document.getElementById("loginScreen");

const appShell = document.getElementById("appShell");

const sidebar = document.getElementById("sidebar");

const mobileMenuButton = document.getElementById("mobileMenuButton");

const topbarMenuButton = document.getElementById("topbarMenuButton");

const navItems = Array.from(document.querySelectorAll("[data-view-target]"));

const viewSections = Array.from(document.querySelectorAll("[data-view]"));

const overviewMonthLabel = document.getElementById("overviewMonthLabel");

const paginationControls = document.getElementById("paginationControls");

const homeBalance = document.getElementById("homeBalance");

const homeInsight = document.getElementById("homeInsight");

const homeAssetsTotal = document.getElementById("homeAssetsTotal");

const homeBesTotal = document.getElementById("homeBesTotal");

const homeSavingsTotal = document.getElementById("homeSavingsTotal");

const homeWealthChart = document.getElementById("homeWealthChart");

const homeWealthTotal = document.getElementById("homeWealthTotal");

const homeWealthLegend = document.getElementById("homeWealthLegend");

const heroBalance = document.getElementById("heroBalance");

const heroInsight = document.getElementById("heroInsight");

const incomeTotal = document.getElementById("incomeTotal");

const expenseTotal = document.getElementById("expenseTotal");

const monthlySavings = document.getElementById("monthlySavings");

const categoryBreakdown = document.getElementById("categoryBreakdown");

const summaryCategoryTypeFilter = document.getElementById("summaryCategoryTypeFilter");
