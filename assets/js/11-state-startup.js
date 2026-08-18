// ACIKLAMA: Uygulama durum degiskenlerini yukler ve tum dosyalar hazir olduktan sonra uygulamayi baslatir. En son yuklenmelidir.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

// ACIKLAMA: firebaseAuth Firebase baglantisi veya ayarlari icin kullanilir.
let firebaseAuth = null;
// ACIKLAMA: firebaseDb Firebase baglantisi veya ayarlari icin kullanilir.
let firebaseDb = null;
// ACIKLAMA: currentUser degiskeninin Turkce karsiligi "mevcut kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let currentUser = null;
// ACIKLAMA: cloudUnsubscribe degiskeninin Turkce karsiligi "bulut unsubscribe"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cloudUnsubscribe = null;
// ACIKLAMA: profileUnsubscribe degiskeninin Turkce karsiligi "profil unsubscribe"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let profileUnsubscribe = null;
// ACIKLAMA: cloudWriteQueue degiskeninin Turkce karsiligi "bulut yaz queue"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cloudWriteQueue = Promise.resolve();
// ACIKLAMA: cloudTransactionsSyncVersion gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let cloudTransactionsSyncVersion = 0;
// ACIKLAMA: cloudTransactionsSyncInFlight gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let cloudTransactionsSyncInFlight = false;
// ACIKLAMA: cloudProfileSyncVersion degiskeninin Turkce karsiligi "bulut profil esitle version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cloudProfileSyncVersion = 0;
// ACIKLAMA: Sunucudan profil yenileme isteklerinin ust uste binmesini engeller.
let cloudProfileRefreshPromise = null;
// ACIKLAMA: Cok hizli menu gecislerinde gereksiz Firestore okumalarini sinirlar.
let lastCloudProfileRefreshAt = 0;
// ACIKLAMA: firestorePersistenceEnabled degiskeninin Turkce karsiligi "Firestore persistence enabled"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let firestorePersistenceEnabled = false;
// ACIKLAMA: activeView uygulamadaki ilgili ekran/gorunum alanini temsil eder.
let activeView = "homeView";
// ACIKLAMA: selectedYear degiskeninin Turkce karsiligi "selected yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let selectedYear = "all";
// ACIKLAMA: selectedMonth degiskeninin Turkce karsiligi "selected ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let selectedMonth = "all";
// ACIKLAMA: selectedDay degiskeninin Turkce karsiligi "selected gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let selectedDay = "all";
// ACIKLAMA: currentHistoryPage degiskeninin Turkce karsiligi "mevcut gecmis sayfa"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let currentHistoryPage = 1;
// ACIKLAMA: currentHistorySearch degiskeninin Turkce karsiligi "mevcut gecmis arama"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let currentHistorySearch = "";
// ACIKLAMA: editingAssetId varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
let editingAssetId = null;
// ACIKLAMA: editingTransactionId degiskeninin Turkce karsiligi "editing islem kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let editingTransactionId = "";
// ACIKLAMA: editingBesId degiskeninin Turkce karsiligi "editing BES kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let editingBesId = "";
// ACIKLAMA: Borc/alacak penceresinde duzenlenen kaydin kimligini tutar.
let duzenlenenBorcAlacakId = "";
// ACIKLAMA: editingPaymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let editingPaymentAccountId = "";
// ACIKLAMA: payingPaymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let payingPaymentAccountId = "";
// ACIKLAMA: deletingPaymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let deletingPaymentAccountId = "";
// ACIKLAMA: viewingPaymentAccountRecordsId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let viewingPaymentAccountRecordsId = "";
// ACIKLAMA: viewingPaymentAccountRecordsPeriod kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let viewingPaymentAccountRecordsPeriod = "";
// ACIKLAMA: isPaymentAccountRecordsFilterInteracting kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let isPaymentAccountRecordsFilterInteracting = false;
// ACIKLAMA: paymentAccountRecordsInteractionTimer kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let paymentAccountRecordsInteractionTimer = null;
// ACIKLAMA: pendingDeletePassword degiskeninin Turkce karsiligi "bekleyen sil sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let pendingDeletePassword = "";
// ACIKLAMA: pendingGenericConfirmAction degiskeninin Turkce karsiligi "bekleyen genel onay action"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let pendingGenericConfirmAction = null;
// ACIKLAMA: uiSettings degiskeninin Turkce karsiligi "ui ayarlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let uiSettings = loadUiSettings();
// ACIKLAMA: cardReminderSettings degiskeninin Turkce karsiligi "kart hatirlatici ayarlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cardReminderSettings = loadCardReminderSettings();
// ACIKLAMA: cardReminderState degiskeninin Turkce karsiligi "kart hatirlatici durum"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cardReminderState = loadCardReminderState();
// ACIKLAMA: cardReminderTimer degiskeninin Turkce karsiligi "kart hatirlatici timer"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let cardReminderTimer = null;
// ACIKLAMA: homeSummaryFilter degiskeninin Turkce karsiligi "ana sayfa ozet filtre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let homeSummaryFilter = loadHomeSummaryFilter();
// ACIKLAMA: deletedTransactionIds degiskeninin Turkce karsiligi "silinmis islem kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let deletedTransactionIds = loadDeletedTransactionIds();
// ACIKLAMA: deletedTransactionSignatures gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let deletedTransactionSignatures = loadDeletedTransactionSignatures();
// ACIKLAMA: deletedTransferTombstones degiskeninin Turkce karsiligi "silinmis aktarim silme izleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let deletedTransferTombstones = loadDeletedTransferTombstones();
// ACIKLAMA: Cihazlar arasinda silinen varlik kayitlarini kalici olarak takip eder.
let deletedAssetTombstones = loadDeletedAssetTombstones();
// ACIKLAMA: Cihazlar arasinda silinen BES kayitlarini kalici olarak takip eder.
let deletedBesTombstones = loadDeletedBesTombstones();
// ACIKLAMA: Cihazlar arasinda silinen borc/alacak kayitlarini kalici olarak takip eder.
let silinenBorcAlacakIzleri = silinenBorcAlacakIzleriniYukle();
// ACIKLAMA: transactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let transactions = loadTransactions();
// ACIKLAMA: assets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
let assets = loadAssets();
// ACIKLAMA: besAccounts degiskeninin Turkce karsiligi "BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let besAccounts = loadBesAccounts();
// ACIKLAMA: Kullaniciya ait borc ve alacak kayitlarini tutar.
let borcAlacakKayitlari = borcAlacakKayitlariniYukle();
// ACIKLAMA: homeAssetPage varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
let homeAssetPage = 1;
// ACIKLAMA: homeBesPage degiskeninin Turkce karsiligi "ana sayfa BES sayfa"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let homeBesPage = 1;
// ACIKLAMA: HOME_LIST_PAGE_SIZE degiskeninin Turkce karsiligi "ana sayfa liste sayfa boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const HOME_LIST_PAGE_SIZE = 5;
// ACIKLAMA: paymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
let paymentAccounts = loadPaymentAccounts();
// ACIKLAMA: transactionCategories degiskeninin Turkce karsiligi "islem kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let transactionCategories = loadTransactionCategories();
// ACIKLAMA: marketData degiskeninin Turkce karsiligi "piyasa veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let marketData = loadMarketData();
// ACIKLAMA: pendingBankImports banka hareketi ice aktarma akisi icin kullanilir.
let pendingBankImports = [];
// ACIKLAMA: pendingBankFiles degiskeninin Turkce karsiligi "bekleyen banka dosyalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let pendingBankFiles = [];
// ACIKLAMA: pdfJsModule degiskeninin Turkce karsiligi "PDF js module"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let pdfJsModule = null;
// ACIKLAMA: tesseractLoadPromise degiskeninin Turkce karsiligi "Tesseract yukle promise"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let tesseractLoadPromise = null;
// ACIKLAMA: startupSplashFinished degiskeninin Turkce karsiligi "baslangic acilis ekrani finished"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let startupSplashFinished = false;

preventAppZoomGestures();
init();
