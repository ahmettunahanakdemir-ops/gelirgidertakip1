let firebaseAuth = null;

let firebaseDb = null;

let currentUser = null;

let cloudUnsubscribe = null;

let profileUnsubscribe = null;

let cloudWriteQueue = Promise.resolve();

let cloudTransactionsSyncVersion = 0;

let cloudTransactionsSyncInFlight = false;

let cloudProfileSyncVersion = 0;

let cloudProfileRefreshPromise = null;

let lastCloudProfileRefreshAt = 0;

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

let duzenlenenBorcAlacakId = "";

let aktifBorcAlacakOdemeKayitId = "";
let aktifBorcAlacakOdemeTaksitId = "";
let aktifBorcAlacakSekmesi = "debts";

let editingPaymentAccountId = "";

let payingPaymentAccountId = "";

let deletingPaymentAccountId = "";

let viewingPaymentAccountRecordsId = "";

let viewingPaymentAccountRecordsPeriod = "";

let isPaymentAccountRecordsFilterInteracting = false;

let paymentAccountRecordsInteractionTimer = null;

let pendingDeletePassword = "";
let pendingDeleteEmailChallenge = "";
let pendingDeleteEmailVerifiedToken = "";
let deleteCodeRequestInFlight = false;

let pendingGenericConfirmAction = null;

let uiSettings = loadUiSettings();

let cardReminderSettings = loadCardReminderSettings();

let cardReminderState = loadCardReminderState();

let cardReminderTimer = null;

let homeSummaryFilter = loadHomeSummaryFilter();

let deletedTransactionIds = loadDeletedTransactionIds();

let deletedTransactionSignatures = loadDeletedTransactionSignatures();

let deletedTransferTombstones = loadDeletedTransferTombstones();

let deletedAssetTombstones = loadDeletedAssetTombstones();

let deletedBesTombstones = loadDeletedBesTombstones();

let silinenBorcAlacakIzleri = silinenBorcAlacakIzleriniYukle();

let transactions = loadTransactions();

let assets = loadAssets();

let besAccounts = loadBesAccounts();

let borcAlacakKayitlari = borcAlacakKayitlariniYukle();

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
