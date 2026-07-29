// ACIKLAMA NOTU: Bu dosyada kod bloklarinin yaninda ne ise yaradiklarini anlatan yorumlar vardir.
// ACIKLAMA: STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const STORAGE_KEY = "akis-budget-tracker";
// ACIKLAMA: ASSETS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const ASSETS_STORAGE_KEY = "akis-budget-assets";
// ACIKLAMA: BES_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const BES_STORAGE_KEY = "akis-budget-bes";
// ACIKLAMA: MARKET_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const MARKET_STORAGE_KEY = "akis-budget-market-prices";
// ACIKLAMA: PAYMENT_ACCOUNTS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const PAYMENT_ACCOUNTS_STORAGE_KEY = "akis-budget-payment-accounts";
// ACIKLAMA: CATEGORY_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const CATEGORY_STORAGE_KEY = "akis-budget-categories";
// ACIKLAMA: LAST_USERNAME_KEY degiskeninin Turkce karsiligi "son kullanici adi anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
const LAST_USERNAME_KEY = "akis-budget-last-username";
// ACIKLAMA: THEME_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const THEME_STORAGE_KEY = "akis-budget-theme";
// ACIKLAMA: UI_SETTINGS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const UI_SETTINGS_STORAGE_KEY = "akis-budget-ui-settings";
// ACIKLAMA: HOME_SUMMARY_FILTER_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const HOME_SUMMARY_FILTER_STORAGE_KEY = "akis-budget-home-summary-filter";
// ACIKLAMA: CARD_REMINDER_SETTINGS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const CARD_REMINDER_SETTINGS_STORAGE_KEY = "akis-budget-card-reminder-settings";
// ACIKLAMA: CARD_REMINDER_STATE_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const CARD_REMINDER_STATE_STORAGE_KEY = "akis-budget-card-reminder-state";
// ACIKLAMA: DELETED_TRANSACTIONS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const DELETED_TRANSACTIONS_STORAGE_KEY = "akis-budget-deleted-transactions";
// ACIKLAMA: DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY = "akis-budget-deleted-transaction-signatures";
// ACIKLAMA: DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-transfer-tombstones";
// ACIKLAMA: TRANSACTIONS_STATE_UPDATED_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const TRANSACTIONS_STATE_UPDATED_STORAGE_KEY = "akis-budget-transactions-state-updated";
// ACIKLAMA: TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY = "akis-budget-transactions-cloud-dirty";
// ACIKLAMA: TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY = "akis-budget-transactions-cloud-full-sync";
// ACIKLAMA: RECENT_ADDED_TRANSACTION_DAYS degiskeninin Turkce karsiligi "son eklenen islem days"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const RECENT_ADDED_TRANSACTION_DAYS = 3;
// ACIKLAMA: MAX_DELETED_TRANSACTION_MARKERS degiskeninin Turkce karsiligi "max silinmis islem isaretler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const MAX_DELETED_TRANSACTION_MARKERS = 5000;
// ACIKLAMA: MAX_DELETED_TRANSFER_TOMBSTONES degiskeninin Turkce karsiligi "max silinmis aktarim silme izleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const MAX_DELETED_TRANSFER_TOMBSTONES = 2000;
// ACIKLAMA: MAX_PROFILE_TRANSACTIONS_BACKUP_BYTES gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
const MAX_PROFILE_TRANSACTIONS_BACKUP_BYTES = 850 * 1024;
// ACIKLAMA: CLOUD_WRITE_TIMEOUT_MS asenkron islemlerin bekleme suresini sinirlar.
const CLOUD_WRITE_TIMEOUT_MS = 45000;

// ACIKLAMA: DEFAULT_CATEGORIES uygulama ilk acilisinda kullanilan varsayilan ayarlari/verileri tutar.
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

// ACIKLAMA: DEFAULT_UI_SETTINGS uygulama ilk acilisinda kullanilan varsayilan ayarlari/verileri tutar.
const DEFAULT_UI_SETTINGS = {
  theme: "light",
  fontFamily: "manrope",
  fontWeight: "regular",
  fontSize: 16,
};
// ACIKLAMA: DEFAULT_CARD_REMINDER_SETTINGS uygulama ilk acilisinda kullanilan varsayilan ayarlari/verileri tutar.
const DEFAULT_CARD_REMINDER_SETTINGS = {
  enabled: false,
};
// ACIKLAMA: CARD_REMINDER_START_DAYS degiskeninin Turkce karsiligi "kart hatirlatici baslangic days"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const CARD_REMINDER_START_DAYS = 5;
// ACIKLAMA: CARD_REMINDER_CHECK_INTERVAL_MS tekrar eden kontrol/islem araligini belirler.
const CARD_REMINDER_CHECK_INTERVAL_MS = 10 * 60 * 1000;
// ACIKLAMA: CARD_REMINDER_SLOTS degiskeninin Turkce karsiligi "kart hatirlatici slots"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const CARD_REMINDER_SLOTS = ["09:30", "14:30", "19:30"];

// ACIKLAMA: FONT_FAMILY_MAP degiskeninin Turkce karsiligi "yazi tipi esleme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const FONT_FAMILY_MAP = {
  manrope: "\"Manrope\", sans-serif",
  grotesk: "\"Space Grotesk\", \"Manrope\", sans-serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  arial: "Arial, Helvetica, sans-serif",
  calibri: "Calibri, Candara, \"Segoe UI\", sans-serif",
  times: "\"Times New Roman\", Times, serif",
};

// ACIKLAMA: FONT_WEIGHT_MAP degiskeninin Turkce karsiligi "yazi kalinlik esleme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const FONT_WEIGHT_MAP = {
  regular: { base: 400, strong: 700 },
  medium: { base: 500, strong: 700 },
  semibold: { base: 600, strong: 800 },
  bold: { base: 700, strong: 900 },
};

// ACIKLAMA: USERNAME_EMAIL_DOMAIN degiskeninin Turkce karsiligi "kullanici adi e-posta domain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const USERNAME_EMAIL_DOMAIN = "gelirgidertakip.local";
// ACIKLAMA: PDFJS_VERSION kullanilan kutuphane/servis surumunu belirtir.
const PDFJS_VERSION = "5.4.624";
// ACIKLAMA: TESSERACT_URL dis kaynak veya kutuphane adresini tutar.
const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
// ACIKLAMA: BANK_OCR_TIMEOUT_MS asenkron islemlerin bekleme suresini sinirlar.
const BANK_OCR_TIMEOUT_MS = 30000;
// ACIKLAMA: TRANSACTIONS_PER_PAGE gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
const TRANSACTIONS_PER_PAGE = 20;
// ACIKLAMA: BULK_ENTRY_INITIAL_ROWS coklu gelir/gider formunda baslangicta kac satir gosterilecegini belirler.
const BULK_ENTRY_INITIAL_ROWS = 3;
// ACIKLAMA: TROY_OUNCE_GRAMS degiskeninin Turkce karsiligi "troy ons grams"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const TROY_OUNCE_GRAMS = 31.1034768;
// ACIKLAMA: BANK_OCR_BALANCE_KEYWORDS metin/OCR ayiklama sirasinda aranacak kelimeleri listeler.
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
// ACIKLAMA: BANK_OCR_IGNORE_KEYWORDS metin/OCR ayiklama sirasinda aranacak kelimeleri listeler.
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
// ACIKLAMA: BANK_OCR_ROW_KEYWORDS metin/OCR ayiklama sirasinda aranacak kelimeleri listeler.
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
// ACIKLAMA: BANK_OCR_AMOUNT_KEYWORDS metin/OCR ayiklama sirasinda aranacak kelimeleri listeler.
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

// ACIKLAMA: assetDefinitions varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
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

// ACIKLAMA: HOME_WEALTH_ASSET_COLORS grafik, kart veya tema renklerini tutar.
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

// ACIKLAMA: currency degiskeninin Turkce karsiligi "para birimi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

// ACIKLAMA: TURKEY_TIME_ZONE degiskeninin Turkce karsiligi "Turkiye saat dilimi"; ilgili veri veya servis icin anahtar bilgisini tutar.
const TURKEY_TIME_ZONE = "Europe/Istanbul";

// ACIKLAMA: getTurkeyDateTimeParts fonksiyonunun Turkce karsiligi "Turkiye tarih ve saat parcalari"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTurkeyDateTimeParts(date = new Date()) {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: mapped degiskeninin Turkce karsiligi "eslenmis veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mapped = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  // ACIKLAMA: hour degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getTurkeyTodayISO fonksiyonunun Turkce karsiligi "Turkiye bugunun ISO tarihi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTurkeyTodayISO(date = new Date()) {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = getTurkeyDateTimeParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// ACIKLAMA: getTurkeyNowTime fonksiyonunun Turkce karsiligi "Turkiye su anki saati"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTurkeyNowTime(date = new Date()) {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = getTurkeyDateTimeParts(date);
  return `${parts.hour}:${parts.minute}:${parts.second}`;
}

// ACIKLAMA: getTurkeyNowDateTime fonksiyonunun Turkce karsiligi "Turkiye su anki tarih saati"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTurkeyNowDateTime(date = new Date()) {
  return `${getTurkeyTodayISO(date)}T${getTurkeyNowTime(date)}+03:00`;
}

// ACIKLAMA: paymentMethodLabels degiskeninin Turkce karsiligi "odeme yontemi etiketleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const paymentMethodLabels = {
  cash: "Nakit",
  credit_card: "Kredi Kartı",
  bank_account: "Banka Hesabı / Kartı",
  transfer: "Havale / EFT",
  other: "Diğer",
};

// ACIKLAMA: paymentAccountTypeLabels kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountTypeLabels = {
  cash: "Nakit Cüzdan",
  bank_account: "Banka Hesabı / Banka Kartı",
  credit_card: "Kredi Kartı",
};

// ACIKLAMA: defaultPaymentCardColors grafik, kart veya tema renklerini tutar.
const defaultPaymentCardColors = {
  cash: "#17805f",
  bank_account: "#0f4c81",
  credit_card: "#173f5f",
};

// ACIKLAMA: paymentMethodAccountTypes degiskeninin Turkce karsiligi "odeme yontemi hesap turleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const paymentMethodAccountTypes = {
  cash: ["cash"],
  credit_card: ["credit_card"],
  bank_account: ["bank_account"],
  transfer: ["bank_account"],
  other: ["cash", "bank_account", "credit_card"],
};

// ACIKLAMA: viewMeta degiskeninin Turkce karsiligi "ekran meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: form ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const form = document.getElementById("entryForm");
// ACIKLAMA: assetForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const assetForm = document.getElementById("assetForm");
// ACIKLAMA: assetType varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
const assetType = document.getElementById("assetType");
// ACIKLAMA: assetLabel varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
const assetLabel = document.getElementById("assetLabel");
// ACIKLAMA: assetAmount varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
const assetAmount = document.getElementById("assetAmount");
// ACIKLAMA: refreshPricesButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const refreshPricesButton = document.getElementById("refreshPricesButton");
// ACIKLAMA: marketStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const marketStatus = document.getElementById("marketStatus");
// ACIKLAMA: assetsTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const assetsTotal = document.getElementById("assetsTotal");
// ACIKLAMA: marketUpdatedAt degiskeninin Turkce karsiligi "piyasa updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const marketUpdatedAt = document.getElementById("marketUpdatedAt");
// ACIKLAMA: assetCount varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
const assetCount = document.getElementById("assetCount");
// ACIKLAMA: assetList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const assetList = document.getElementById("assetList");
// ACIKLAMA: openPaymentAccountModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openPaymentAccountModalButton = document.getElementById("openPaymentAccountModalButton");
// ACIKLAMA: paymentAccountModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const paymentAccountModal = document.getElementById("paymentAccountModal");
// ACIKLAMA: paymentAccountModalTitle kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountModalTitle = document.getElementById("paymentAccountModalTitle");
// ACIKLAMA: paymentAccountModalSubtitle kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountModalSubtitle = document.getElementById("paymentAccountModalSubtitle");
// ACIKLAMA: closePaymentAccountModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closePaymentAccountModalButton = document.getElementById("closePaymentAccountModalButton");
// ACIKLAMA: paymentAccountForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const paymentAccountForm = document.getElementById("paymentAccountForm");
// ACIKLAMA: paymentAccountType kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountType = document.getElementById("paymentAccountType");
// ACIKLAMA: paymentAccountName kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountName = document.getElementById("paymentAccountName");
// ACIKLAMA: paymentAccountBank kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountBank = document.getElementById("paymentAccountBank");
// ACIKLAMA: paymentAccountColor grafik, kart veya tema renklerini tutar.
const paymentAccountColor = document.getElementById("paymentAccountColor");
// ACIKLAMA: paymentAccountLast4 kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountLast4 = document.getElementById("paymentAccountLast4");
// ACIKLAMA: paymentAccountExpiry kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountExpiry = document.getElementById("paymentAccountExpiry");
// ACIKLAMA: paymentAccountStatementDay kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountStatementDay = document.getElementById("paymentAccountStatementDay");
// ACIKLAMA: paymentAccountDueDay kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountDueDay = document.getElementById("paymentAccountDueDay");
// ACIKLAMA: paymentAccountLimit kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountLimit = document.getElementById("paymentAccountLimit");
// ACIKLAMA: paymentAccountBalance kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountBalance = document.getElementById("paymentAccountBalance");
// ACIKLAMA: paymentAccountCurrentStatementDebt kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountCurrentStatementDebt = document.getElementById("paymentAccountCurrentStatementDebt");
// ACIKLAMA: paymentAccountNote kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountNote = document.getElementById("paymentAccountNote");
// ACIKLAMA: paymentAccountSubmitButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const paymentAccountSubmitButton = document.getElementById("paymentAccountSubmitButton");
// ACIKLAMA: paymentAccountStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const paymentAccountStatus = document.getElementById("paymentAccountStatus");
// ACIKLAMA: paymentAccountModalStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const paymentAccountModalStatus = document.getElementById("paymentAccountModalStatus");
// ACIKLAMA: paymentAccountList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const paymentAccountList = document.getElementById("paymentAccountList");
// ACIKLAMA: confirmPaymentAccountDeleteModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const confirmPaymentAccountDeleteModal = document.getElementById("confirmPaymentAccountDeleteModal");
// ACIKLAMA: confirmPaymentAccountDeleteTitle kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const confirmPaymentAccountDeleteTitle = document.getElementById("confirmPaymentAccountDeleteTitle");
// ACIKLAMA: confirmPaymentAccountDeleteText kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const confirmPaymentAccountDeleteText = document.getElementById("confirmPaymentAccountDeleteText");
// ACIKLAMA: confirmDeletePaymentAccountButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const confirmDeletePaymentAccountButton = document.getElementById("confirmDeletePaymentAccountButton");
// ACIKLAMA: cancelDeletePaymentAccountButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cancelDeletePaymentAccountButton = document.getElementById("cancelDeletePaymentAccountButton");
// ACIKLAMA: confirmPaymentAccountDeleteStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const confirmPaymentAccountDeleteStatus = document.getElementById("confirmPaymentAccountDeleteStatus");
// ACIKLAMA: cardDebtTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const cardDebtTotal = document.getElementById("cardDebtTotal");
// ACIKLAMA: activeStatementDebtTotal aktif donemdeki kredi karti borcu toplaminin ekranda gosterilecegi alandir.
const activeStatementDebtTotal = document.getElementById("activeStatementDebtTotal");
// ACIKLAMA: bankBalanceTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const bankBalanceTotal = document.getElementById("bankBalanceTotal");
// ACIKLAMA: besForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const besForm = document.getElementById("besForm");
// ACIKLAMA: besTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const besTotal = document.getElementById("besTotal");
// ACIKLAMA: besStateTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const besStateTotal = document.getElementById("besStateTotal");
// ACIKLAMA: besStateGainTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const besStateGainTotal = document.getElementById("besStateGainTotal");
// ACIKLAMA: besGainTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const besGainTotal = document.getElementById("besGainTotal");
// ACIKLAMA: besList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const besList = document.getElementById("besList");
// ACIKLAMA: besStateGainInput kullanicidan veri alan input elemaninin DOM referansidir.
const besStateGainInput = document.getElementById("besStateGain");
// ACIKLAMA: besSubmitButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const besSubmitButton = document.getElementById("besSubmitButton");
// ACIKLAMA: openBesModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openBesModalButton = document.getElementById("openBesModalButton");
// ACIKLAMA: besModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const besModal = document.getElementById("besModal");
// ACIKLAMA: besModalTitle degiskeninin Turkce karsiligi "BES pencere baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const besModalTitle = document.getElementById("besModalTitle");
// ACIKLAMA: besFormMount degiskeninin Turkce karsiligi "BES form yerlestir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const besFormMount = document.getElementById("besFormMount");
// ACIKLAMA: closeBesModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeBesModalButton = document.getElementById("closeBesModalButton");
// ACIKLAMA: typeInput kullanicidan veri alan input elemaninin DOM referansidir.
const typeInput = document.getElementById("type");
// ACIKLAMA: categoryInput kullanicidan veri alan input elemaninin DOM referansidir.
const categoryInput = document.getElementById("category");
// ACIKLAMA: paymentMethodInput kullanicidan veri alan input elemaninin DOM referansidir.
const paymentMethodInput = document.getElementById("paymentMethod");
// ACIKLAMA: paymentAccountSelect secim kutusunun DOM referansidir; secilen deger buradan okunur.
const paymentAccountSelect = document.getElementById("paymentAccount");
// ACIKLAMA: transferAccountLabel degiskeninin Turkce karsiligi "aktarim hesap etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const transferAccountLabel = document.getElementById("transferAccountLabel");
// ACIKLAMA: transferAccountSelect secim kutusunun DOM referansidir; secilen deger buradan okunur.
const transferAccountSelect = document.getElementById("transferAccount");
// ACIKLAMA: transferFeeLabel degiskeninin Turkce karsiligi "aktarim ucret etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const transferFeeLabel = document.getElementById("transferFeeLabel");
// ACIKLAMA: transferFeeInput kullanicidan veri alan input elemaninin DOM referansidir.
const transferFeeInput = document.getElementById("transferFee");
// ACIKLAMA: entryFormStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const entryFormStatus = document.getElementById("entryFormStatus");
// ACIKLAMA: openBulkEntryModalButton coklu gelir/gider penceresini acan butondur.
const openBulkEntryModalButton = document.getElementById("openBulkEntryModalButton");
// ACIKLAMA: bulkEntryModal coklu gelir/gider ekleme penceresinin DOM elemanidir.
const bulkEntryModal = document.getElementById("bulkEntryModal");
// ACIKLAMA: bulkEntryForm coklu gelir/gider satirlarini tek submit olayinda kaydetmek icin kullanilir.
const bulkEntryForm = document.getElementById("bulkEntryForm");
// ACIKLAMA: bulkEntryRows coklu gelir/gider satirlarinin yerlestigi DOM alanidir.
const bulkEntryRows = document.getElementById("bulkEntryRows");
// ACIKLAMA: bulkEntryAddRowButton coklu gelir/gider formuna yeni satir ekleyen butondur.
const bulkEntryAddRowButton = document.getElementById("bulkEntryAddRowButton");
// ACIKLAMA: bulkEntryClearButton coklu gelir/gider formundaki satirlari temizleyen butondur.
const bulkEntryClearButton = document.getElementById("bulkEntryClearButton");
// ACIKLAMA: bulkEntrySubmitButton dolu coklu gelir/gider satirlarini kaydeden butondur.
const bulkEntrySubmitButton = document.getElementById("bulkEntrySubmitButton");
// ACIKLAMA: closeBulkEntryModalButton coklu gelir/gider penceresini kapatan butondur.
const closeBulkEntryModalButton = document.getElementById("closeBulkEntryModalButton");
// ACIKLAMA: bulkEntryStatus coklu gelir/gider ekleme sonucunu veya hatasini gosterir.
const bulkEntryStatus = document.getElementById("bulkEntryStatus");
// ACIKLAMA: dateInput kullanicidan veri alan input elemaninin DOM referansidir.
const dateInput = document.getElementById("date");
// ACIKLAMA: homeSummaryStartDate degiskeninin Turkce karsiligi "ana sayfa ozet baslangic tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeSummaryStartDate = document.getElementById("homeSummaryStartDate");
// ACIKLAMA: homeSummaryEndDate degiskeninin Turkce karsiligi "ana sayfa ozet bitis tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeSummaryEndDate = document.getElementById("homeSummaryEndDate");
// ACIKLAMA: applyHomeSummaryFilterButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const applyHomeSummaryFilterButton = document.getElementById("applyHomeSummaryFilterButton");
// ACIKLAMA: clearHomeSummaryFilterButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const clearHomeSummaryFilterButton = document.getElementById("clearHomeSummaryFilterButton");
// ACIKLAMA: homeSummaryFilterStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const homeSummaryFilterStatus = document.getElementById("homeSummaryFilterStatus");
// ACIKLAMA: transactionList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const transactionList = document.getElementById("transactionList");
// ACIKLAMA: transactionTemplate tekrar kullanilan HTML sablonunu temsil eder.
const transactionTemplate = document.getElementById("transactionTemplate");
// ACIKLAMA: filterType degiskeninin Turkce karsiligi "filtre tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const filterType = document.getElementById("filterType");
// ACIKLAMA: filterPaymentMethod degiskeninin Turkce karsiligi "filtre odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const filterPaymentMethod = document.getElementById("filterPaymentMethod");
// ACIKLAMA: filterPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const filterPaymentAccount = document.getElementById("filterPaymentAccount");
// ACIKLAMA: paymentAccountTypeFilter kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountTypeFilter = document.getElementById("paymentAccountTypeFilter");
// ACIKLAMA: searchInput kullanicidan veri alan input elemaninin DOM referansidir.
const searchInput = document.getElementById("searchInput");
// ACIKLAMA: historySearchButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const historySearchButton = document.getElementById("historySearchButton");
// ACIKLAMA: historyStartDate degiskeninin Turkce karsiligi "gecmis baslangic tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const historyStartDate = document.getElementById("historyStartDate");
// ACIKLAMA: historyEndDate degiskeninin Turkce karsiligi "gecmis bitis tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const historyEndDate = document.getElementById("historyEndDate");
// ACIKLAMA: clearHistoryRangeButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const clearHistoryRangeButton = document.getElementById("clearHistoryRangeButton");
// ACIKLAMA: exportPdfButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const exportPdfButton = document.getElementById("exportPdfButton");
// ACIKLAMA: exportExcelButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const exportExcelButton = document.getElementById("exportExcelButton");
// ACIKLAMA: openRecentTransactionsButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openRecentTransactionsButton = document.getElementById("openRecentTransactionsButton");
// ACIKLAMA: recentTransactionsModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const recentTransactionsModal = document.getElementById("recentTransactionsModal");
// ACIKLAMA: recentTransactionsList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const recentTransactionsList = document.getElementById("recentTransactionsList");
// ACIKLAMA: closeRecentTransactionsButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeRecentTransactionsButton = document.getElementById("closeRecentTransactionsButton");
// ACIKLAMA: exportButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const exportButton = document.getElementById("exportButton");
// ACIKLAMA: importFile degiskeninin Turkce karsiligi "ice aktar dosya"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const importFile = document.getElementById("importFile");
// ACIKLAMA: storageStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const storageStatus = document.getElementById("storageStatus");
// ACIKLAMA: syncPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
const syncPayload = document.getElementById("syncPayload");
// ACIKLAMA: appSplashScreen degiskeninin Turkce karsiligi "uygulama acilis ekrani ekran"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const appSplashScreen = document.getElementById("appSplashScreen");
// ACIKLAMA: generateSyncButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const generateSyncButton = document.getElementById("generateSyncButton");
// ACIKLAMA: copySyncButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const copySyncButton = document.getElementById("copySyncButton");
// ACIKLAMA: importSyncButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const importSyncButton = document.getElementById("importSyncButton");
// ACIKLAMA: syncStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const syncStatus = document.getElementById("syncStatus");
// ACIKLAMA: bankImportText banka hareketi ice aktarma akisi icin kullanilir.
const bankImportText = document.getElementById("bankImportText");
// ACIKLAMA: bankImportFile banka hareketi ice aktarma akisi icin kullanilir.
const bankImportFile = document.getElementById("bankImportFile");
// ACIKLAMA: bankImportAddButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportAddButton = document.getElementById("bankImportAddButton");
// ACIKLAMA: bankImportLocalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportLocalButton = document.getElementById("bankImportLocalButton");
// ACIKLAMA: bankImportCancelButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportCancelButton = document.getElementById("bankImportCancelButton");
// ACIKLAMA: bankImportAccountSelect secim kutusunun DOM referansidir; secilen deger buradan okunur.
const bankImportAccountSelect = document.getElementById("bankImportAccount");
// ACIKLAMA: bankImportTransferAccountSelect secim kutusunun DOM referansidir; secilen deger buradan okunur.
const bankImportTransferAccountSelect = document.getElementById("bankImportTransferAccount");
// ACIKLAMA: previewBankImportButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const previewBankImportButton = document.getElementById("previewBankImportButton");
// ACIKLAMA: confirmBankImportButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const confirmBankImportButton = document.getElementById("confirmBankImportButton");
// ACIKLAMA: clearBankImportButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const clearBankImportButton = document.getElementById("clearBankImportButton");
// ACIKLAMA: bankImportStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const bankImportStatus = document.getElementById("bankImportStatus");
// ACIKLAMA: bankImportPreview uygulamadaki ilgili ekran/gorunum alanini temsil eder.
const bankImportPreview = document.getElementById("bankImportPreview");
// ACIKLAMA: bankImportPreviewModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const bankImportPreviewModal = document.getElementById("bankImportPreviewModal");
// ACIKLAMA: bankImportPreviewModalSummary banka hareketi ice aktarma akisi icin kullanilir.
const bankImportPreviewModalSummary = document.getElementById("bankImportPreviewModalSummary");
// ACIKLAMA: bankImportPreviewAccount banka hareketi ice aktarma akisi icin kullanilir.
const bankImportPreviewAccount = document.getElementById("bankImportPreviewAccount");
// ACIKLAMA: bankImportPreviewTransferAccount banka hareketi ice aktarma akisi icin kullanilir.
const bankImportPreviewTransferAccount = document.getElementById("bankImportPreviewTransferAccount");
// ACIKLAMA: bankImportPreviewList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const bankImportPreviewList = document.getElementById("bankImportPreviewList");
// ACIKLAMA: bankImportPreviewStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const bankImportPreviewStatus = document.getElementById("bankImportPreviewStatus");
// ACIKLAMA: bankImportSelectAllButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportSelectAllButton = document.getElementById("bankImportSelectAllButton");
// ACIKLAMA: bankImportClearSelectionButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportClearSelectionButton = document.getElementById("bankImportClearSelectionButton");
// ACIKLAMA: bankImportPreviewConfirmButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportPreviewConfirmButton = document.getElementById("bankImportPreviewConfirmButton");
// ACIKLAMA: bankImportPreviewCloseButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const bankImportPreviewCloseButton = document.getElementById("bankImportPreviewCloseButton");
// ACIKLAMA: authForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const authForm = document.getElementById("authForm");
// ACIKLAMA: authEmail degiskeninin Turkce karsiligi "kimlik dogrulama e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const authEmail = document.getElementById("authEmail");
// ACIKLAMA: authPassword degiskeninin Turkce karsiligi "kimlik dogrulama sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const authPassword = document.getElementById("authPassword");
// ACIKLAMA: createAccountButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const createAccountButton = document.getElementById("createAccountButton");
// ACIKLAMA: forgotPasswordButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
// ACIKLAMA: signupForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const signupForm = document.getElementById("signupForm");
// ACIKLAMA: signupEmail degiskeninin Turkce karsiligi "signup e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const signupEmail = document.getElementById("signupEmail");
// ACIKLAMA: signupUsername degiskeninin Turkce karsiligi "signup kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const signupUsername = document.getElementById("signupUsername");
// ACIKLAMA: signupPassword degiskeninin Turkce karsiligi "signup sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const signupPassword = document.getElementById("signupPassword");
// ACIKLAMA: signupPasswordConfirm degiskeninin Turkce karsiligi "signup sifre onay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
// ACIKLAMA: cancelSignupButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cancelSignupButton = document.getElementById("cancelSignupButton");
// ACIKLAMA: signupStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const signupStatus = document.getElementById("signupStatus");
// ACIKLAMA: resetPasswordForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const resetPasswordForm = document.getElementById("resetPasswordForm");
// ACIKLAMA: resetEmail degiskeninin Turkce karsiligi "sifirla e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const resetEmail = document.getElementById("resetEmail");
// ACIKLAMA: cancelResetButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cancelResetButton = document.getElementById("cancelResetButton");
// ACIKLAMA: resetStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const resetStatus = document.getElementById("resetStatus");
// ACIKLAMA: logoutButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const logoutButton = document.getElementById("logoutButton");
// ACIKLAMA: footerLogoutButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const footerLogoutButton = document.getElementById("footerLogoutButton");
// ACIKLAMA: authUserBadge degiskeninin Turkce karsiligi "kimlik dogrulama kullanici badge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const authUserBadge = document.getElementById("authUserBadge");
// ACIKLAMA: profileButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const profileButton = document.getElementById("profileButton");
// ACIKLAMA: profileModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const profileModal = document.getElementById("profileModal");
// ACIKLAMA: profileForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const profileForm = document.getElementById("profileForm");
// ACIKLAMA: profileUsername degiskeninin Turkce karsiligi "profil kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const profileUsername = document.getElementById("profileUsername");
// ACIKLAMA: profileCurrentPassword degiskeninin Turkce karsiligi "profil mevcut sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const profileCurrentPassword = document.getElementById("profileCurrentPassword");
// ACIKLAMA: profilePassword degiskeninin Turkce karsiligi "profil sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const profilePassword = document.getElementById("profilePassword");
// ACIKLAMA: profileStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const profileStatus = document.getElementById("profileStatus");
// ACIKLAMA: themeButtons degiskeninin Turkce karsiligi "tema butonlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
// ACIKLAMA: settingsFontFamily degiskeninin Turkce karsiligi "ayarlar yazi tipi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const settingsFontFamily = document.getElementById("settingsFontFamily");
// ACIKLAMA: settingsFontWeight degiskeninin Turkce karsiligi "ayarlar yazi kalinlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const settingsFontWeight = document.getElementById("settingsFontWeight");
// ACIKLAMA: settingsFontSize degiskeninin Turkce karsiligi "ayarlar yazi boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const settingsFontSize = document.getElementById("settingsFontSize");
// ACIKLAMA: settingsFontSizeValue degiskeninin Turkce karsiligi "ayarlar yazi boyut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const settingsFontSizeValue = document.getElementById("settingsFontSizeValue");
// ACIKLAMA: increaseFontButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const increaseFontButton = document.getElementById("increaseFontButton");
// ACIKLAMA: decreaseFontButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const decreaseFontButton = document.getElementById("decreaseFontButton");
// ACIKLAMA: resetAppearanceButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const resetAppearanceButton = document.getElementById("resetAppearanceButton");
// ACIKLAMA: cardReminderPermissionButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cardReminderPermissionButton = document.getElementById("cardReminderPermissionButton");
// ACIKLAMA: cardReminderStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const cardReminderStatus = document.getElementById("cardReminderStatus");
// ACIKLAMA: cloudBackupButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cloudBackupButton = document.getElementById("cloudBackupButton");
// ACIKLAMA: localBackupDownloadButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const localBackupDownloadButton = document.getElementById("localBackupDownloadButton");
// ACIKLAMA: localBackupImportButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const localBackupImportButton = document.getElementById("localBackupImportButton");
// ACIKLAMA: localBackupImportInput kullanicidan veri alan input elemaninin DOM referansidir.
const localBackupImportInput = document.getElementById("localBackupImportInput");
// ACIKLAMA: cloudBackupStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const cloudBackupStatus = document.getElementById("cloudBackupStatus");
// ACIKLAMA: genericConfirmModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const genericConfirmModal = document.getElementById("genericConfirmModal");
// ACIKLAMA: genericConfirmTitle degiskeninin Turkce karsiligi "genel onay baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const genericConfirmTitle = document.getElementById("genericConfirmTitle");
// ACIKLAMA: genericConfirmText degiskeninin Turkce karsiligi "genel onay metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const genericConfirmText = document.getElementById("genericConfirmText");
// ACIKLAMA: genericConfirmButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const genericConfirmButton = document.getElementById("genericConfirmButton");
// ACIKLAMA: genericConfirmCancelButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const genericConfirmCancelButton = document.getElementById("genericConfirmCancelButton");
// ACIKLAMA: closeProfileButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeProfileButton = document.getElementById("closeProfileButton");
// ACIKLAMA: deleteUserButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const deleteUserButton = document.getElementById("deleteUserButton");
// ACIKLAMA: deleteUserStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const deleteUserStatus = document.getElementById("deleteUserStatus");
// ACIKLAMA: deleteAccountModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const deleteAccountModal = document.getElementById("deleteAccountModal");
// ACIKLAMA: deleteAccountForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const deleteAccountForm = document.getElementById("deleteAccountForm");
// ACIKLAMA: deleteUserPassword degiskeninin Turkce karsiligi "sil kullanici sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const deleteUserPassword = document.getElementById("deleteUserPassword");
// ACIKLAMA: deleteUserPasswordConfirm degiskeninin Turkce karsiligi "sil kullanici sifre onay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const deleteUserPasswordConfirm = document.getElementById("deleteUserPasswordConfirm");
// ACIKLAMA: closeDeleteAccountButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeDeleteAccountButton = document.getElementById("closeDeleteAccountButton");
// ACIKLAMA: deleteAccountStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const deleteAccountStatus = document.getElementById("deleteAccountStatus");
// ACIKLAMA: confirmDeleteAccountModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const confirmDeleteAccountModal = document.getElementById("confirmDeleteAccountModal");
// ACIKLAMA: confirmDeleteAccountButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const confirmDeleteAccountButton = document.getElementById("confirmDeleteAccountButton");
// ACIKLAMA: cancelConfirmDeleteButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const cancelConfirmDeleteButton = document.getElementById("cancelConfirmDeleteButton");
// ACIKLAMA: confirmDeleteAccountStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const confirmDeleteAccountStatus = document.getElementById("confirmDeleteAccountStatus");
// ACIKLAMA: transactionEditModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const transactionEditModal = document.getElementById("transactionEditModal");
// ACIKLAMA: transactionEditForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const transactionEditForm = document.getElementById("transactionEditForm");
// ACIKLAMA: transactionTypeInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionTypeInput = document.getElementById("transactionTypeInput");
// ACIKLAMA: transactionTitleInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionTitleInput = document.getElementById("transactionTitleInput");
// ACIKLAMA: transactionAmountInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionAmountInput = document.getElementById("transactionAmountInput");
// ACIKLAMA: transactionCategoryInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionCategoryInput = document.getElementById("transactionCategoryInput");
// ACIKLAMA: transactionDateInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionDateInput = document.getElementById("transactionDateInput");
// ACIKLAMA: transactionTimeInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionTimeInput = document.getElementById("transactionTimeInput");
// ACIKLAMA: transactionNoteInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionNoteInput = document.getElementById("transactionNoteInput");
// ACIKLAMA: transactionPaymentMethodInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionPaymentMethodInput = document.getElementById("transactionPaymentMethodInput");
// ACIKLAMA: transactionPaymentAccountInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionPaymentAccountInput = document.getElementById("transactionPaymentAccountInput");
// ACIKLAMA: transactionTransferAccountLabel degiskeninin Turkce karsiligi "islem aktarim hesap etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const transactionTransferAccountLabel = document.getElementById("transactionTransferAccountLabel");
// ACIKLAMA: transactionTransferAccountInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionTransferAccountInput = document.getElementById("transactionTransferAccountInput");
// ACIKLAMA: transactionTransferFeeLabel degiskeninin Turkce karsiligi "islem aktarim ucret etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const transactionTransferFeeLabel = document.getElementById("transactionTransferFeeLabel");
// ACIKLAMA: transactionTransferFeeInput kullanicidan veri alan input elemaninin DOM referansidir.
const transactionTransferFeeInput = document.getElementById("transactionTransferFeeInput");
// ACIKLAMA: transactionEditStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const transactionEditStatus = document.getElementById("transactionEditStatus");
// ACIKLAMA: closeTransactionEditButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeTransactionEditButton = document.getElementById("closeTransactionEditButton");
// ACIKLAMA: openEntryModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openEntryModalButton = document.getElementById("openEntryModalButton");
// ACIKLAMA: entryModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const entryModal = document.getElementById("entryModal");
// ACIKLAMA: entryFormMount degiskeninin Turkce karsiligi "entry form yerlestir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const entryFormMount = document.getElementById("entryFormMount");
// ACIKLAMA: closeEntryModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeEntryModalButton = document.getElementById("closeEntryModalButton");
// ACIKLAMA: openCategoryAddModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openCategoryAddModalButton = document.getElementById("openCategoryAddModalButton");
// ACIKLAMA: openCategoryManageModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const openCategoryManageModalButton = document.getElementById("openCategoryManageModalButton");
// ACIKLAMA: categoryAddModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const categoryAddModal = document.getElementById("categoryAddModal");
// ACIKLAMA: categoryAddForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const categoryAddForm = document.getElementById("categoryAddForm");
// ACIKLAMA: categoryAddType degiskeninin Turkce karsiligi "kategori add tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const categoryAddType = document.getElementById("categoryAddType");
// ACIKLAMA: categoryAddName degiskeninin Turkce karsiligi "kategori add adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const categoryAddName = document.getElementById("categoryAddName");
// ACIKLAMA: categoryAddStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const categoryAddStatus = document.getElementById("categoryAddStatus");
// ACIKLAMA: closeCategoryAddModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeCategoryAddModalButton = document.getElementById("closeCategoryAddModalButton");
// ACIKLAMA: categoryManageModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const categoryManageModal = document.getElementById("categoryManageModal");
// ACIKLAMA: categoryManageType degiskeninin Turkce karsiligi "kategori manage tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const categoryManageType = document.getElementById("categoryManageType");
// ACIKLAMA: categoryManageList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const categoryManageList = document.getElementById("categoryManageList");
// ACIKLAMA: categoryManageStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const categoryManageStatus = document.getElementById("categoryManageStatus");
// ACIKLAMA: closeCategoryManageModalButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closeCategoryManageModalButton = document.getElementById("closeCategoryManageModalButton");
// ACIKLAMA: paymentAccountPayModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const paymentAccountPayModal = document.getElementById("paymentAccountPayModal");
// ACIKLAMA: paymentAccountPayForm ilgili formun DOM referansidir; submit ve veri okuma islemlerinde kullanilir.
const paymentAccountPayForm = document.getElementById("paymentAccountPayForm");
// ACIKLAMA: paymentAccountPayTitle kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountPayTitle = document.getElementById("paymentAccountPayTitle");
// ACIKLAMA: paymentAccountPaySource kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountPaySource = document.getElementById("paymentAccountPaySource");
// ACIKLAMA: paymentAccountPayAmount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountPayAmount = document.getElementById("paymentAccountPayAmount");
// ACIKLAMA: paymentAccountPayStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const paymentAccountPayStatus = document.getElementById("paymentAccountPayStatus");
// ACIKLAMA: closePaymentAccountPayButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closePaymentAccountPayButton = document.getElementById("closePaymentAccountPayButton");
// ACIKLAMA: paymentAccountRecordsModal acilip kapanan modal/pencere elemaninin DOM referansidir.
const paymentAccountRecordsModal = document.getElementById("paymentAccountRecordsModal");
// ACIKLAMA: paymentAccountRecordsTitle kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountRecordsTitle = document.getElementById("paymentAccountRecordsTitle");
// ACIKLAMA: paymentAccountRecordsSummary kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountRecordsSummary = document.getElementById("paymentAccountRecordsSummary");
// ACIKLAMA: paymentAccountRecordsList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const paymentAccountRecordsList = document.getElementById("paymentAccountRecordsList");
// ACIKLAMA: paymentAccountRecordsPeriodFilter kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
const paymentAccountRecordsPeriodFilter = document.getElementById("paymentAccountRecordsPeriodFilter");
// ACIKLAMA: refreshPaymentAccountFromRecordsButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const refreshPaymentAccountFromRecordsButton = document.getElementById("refreshPaymentAccountFromRecordsButton");
// ACIKLAMA: closePaymentAccountRecordsButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const closePaymentAccountRecordsButton = document.getElementById("closePaymentAccountRecordsButton");
// ACIKLAMA: cloudStatus kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
const cloudStatus = document.getElementById("cloudStatus");
// ACIKLAMA: loginScreen degiskeninin Turkce karsiligi "login ekran"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const loginScreen = document.getElementById("loginScreen");
// ACIKLAMA: appShell degiskeninin Turkce karsiligi "uygulama shell"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const appShell = document.getElementById("appShell");
// ACIKLAMA: sidebar degiskeninin Turkce karsiligi "sidebar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const sidebar = document.getElementById("sidebar");
// ACIKLAMA: mobileMenuButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const mobileMenuButton = document.getElementById("mobileMenuButton");
// ACIKLAMA: topbarMenuButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
const topbarMenuButton = document.getElementById("topbarMenuButton");
// ACIKLAMA: navItems degiskeninin Turkce karsiligi "nav ogeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const navItems = Array.from(document.querySelectorAll("[data-view-target]"));
// ACIKLAMA: viewSections degiskeninin Turkce karsiligi "ekran sections"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const viewSections = Array.from(document.querySelectorAll("[data-view]"));
// ACIKLAMA: pageKicker degiskeninin Turkce karsiligi "sayfa kicker"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const pageKicker = document.getElementById("pageKicker");
// ACIKLAMA: pageTitle degiskeninin Turkce karsiligi "sayfa baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const pageTitle = document.getElementById("pageTitle");
// ACIKLAMA: pageSubtitle degiskeninin Turkce karsiligi "sayfa alt baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const pageSubtitle = document.getElementById("pageSubtitle");
// ACIKLAMA: appUserEmail degiskeninin Turkce karsiligi "uygulama kullanici e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const appUserEmail = document.getElementById("appUserEmail");
// ACIKLAMA: overviewMonthLabel degiskeninin Turkce karsiligi "overview ay etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const overviewMonthLabel = document.getElementById("overviewMonthLabel");
// ACIKLAMA: paginationControls degiskeninin Turkce karsiligi "sayfalama kontroller"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const paginationControls = document.getElementById("paginationControls");

// ACIKLAMA: homeBalance degiskeninin Turkce karsiligi "ana sayfa bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeBalance = document.getElementById("homeBalance");
// ACIKLAMA: homeInsight degiskeninin Turkce karsiligi "ana sayfa insight"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeInsight = document.getElementById("homeInsight");
// ACIKLAMA: homeAssetsTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const homeAssetsTotal = document.getElementById("homeAssetsTotal");
// ACIKLAMA: homeBesTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const homeBesTotal = document.getElementById("homeBesTotal");
// ACIKLAMA: homeSavingsTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const homeSavingsTotal = document.getElementById("homeSavingsTotal");
// ACIKLAMA: homeAssetList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const homeAssetList = document.getElementById("homeAssetList");
// ACIKLAMA: homeBesList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
const homeBesList = document.getElementById("homeBesList");
// ACIKLAMA: homeWealthChart degiskeninin Turkce karsiligi "ana sayfa birikim grafik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeWealthChart = document.getElementById("homeWealthChart");
// ACIKLAMA: homeWealthTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const homeWealthTotal = document.getElementById("homeWealthTotal");
// ACIKLAMA: homeWealthLegend degiskeninin Turkce karsiligi "ana sayfa birikim aciklama"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const homeWealthLegend = document.getElementById("homeWealthLegend");
// ACIKLAMA: heroBalance degiskeninin Turkce karsiligi "hero bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const heroBalance = document.getElementById("heroBalance");
// ACIKLAMA: heroInsight degiskeninin Turkce karsiligi "hero insight"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const heroInsight = document.getElementById("heroInsight");
// ACIKLAMA: incomeTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const incomeTotal = document.getElementById("incomeTotal");
// ACIKLAMA: expenseTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
const expenseTotal = document.getElementById("expenseTotal");
// ACIKLAMA: monthlySavings degiskeninin Turkce karsiligi "monthly savings"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const monthlySavings = document.getElementById("monthlySavings");
// ACIKLAMA: categoryBreakdown degiskeninin Turkce karsiligi "kategori breakdown"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const categoryBreakdown = document.getElementById("categoryBreakdown");
// ACIKLAMA: summaryCategoryTypeFilter degiskeninin Turkce karsiligi "ozet kategori tur filtre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const summaryCategoryTypeFilter = document.getElementById("summaryCategoryTypeFilter");

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
// ACIKLAMA: transactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let transactions = loadTransactions();
// ACIKLAMA: assets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
let assets = loadAssets();
// ACIKLAMA: besAccounts degiskeninin Turkce karsiligi "BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
let besAccounts = loadBesAccounts();
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


// ACIKLAMA: preventAppZoomGestures fonksiyonunun Turkce karsiligi "prevent uygulama zoom gestures"; ilgili uygulama islemini calistirir.
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
  syncBankImportAccountSelects();
  setupBulkEntryForm();
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
    const entry = createEntryTransaction(
      {
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
      },
      now,
      getTurkeyNowTime()
    );

    if (!entry.title || !entry.amount || !entry.date) {
      return;
    }

    if (!validateTransactionPayment(entry, entryFormStatus)) {
      return;
    }

    // ACIKLAMA: changedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
    const changedPaymentAccount = applyTransactionPaymentEffect(entry, 1);
    transactions = [entry, ...transactions].sort(compareTransactionsNewestFirst);
    if (changedPaymentAccount) {
      refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
      persistPaymentAccounts();
    }
    persistTransactions({ cloudUpserts: [entry] }).catch((error) => {
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
    transactionAt: buildTransactionDateTime(values.date, time),
    createdAt: now,
    updatedAt: now,
  };
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

  refreshBulkEntryRows();
  if (!getBulkEntryRows().length) {
    resetBulkEntryRows();
  }
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
  getBulkEntryRows().forEach((row) => setBulkEntryRowError(row, ""));
  if (bulkEntryStatus) {
    bulkEntryStatus.textContent = "";
  }
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
    date: row?.querySelector('[data-bulk-field="date"]'),
    note: row?.querySelector('[data-bulk-field="note"]'),
    error: row?.querySelector("[data-bulk-row-error]"),
  };
}

// ACIKLAMA: createBulkEntryRow fonksiyonunun Turkce karsiligi "coklu kayit satiri olustur"; toplu form icin yeni gelir/gider satiri uretir.
function createBulkEntryRow() {
  const row = document.createElement("div");
  row.className = "bulk-entry-row";
  row.dataset.bulkEntryRow = "true";
  row.innerHTML = `
    <span class="bulk-entry-row-number" data-bulk-row-number>1</span>
    <label class="bulk-entry-title-field">
      Başlık
      <input data-bulk-field="title" type="text" maxlength="40" placeholder="Maaş, market..." />
    </label>
    <label>
      Tip
      <select data-bulk-field="type">
        <option value="income">Gelir</option>
        <option value="expense">Gider</option>
      </select>
    </label>
    <label>
      Tutar
      <input data-bulk-field="amount" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0" />
    </label>
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
      Kart / hesap
      <select data-bulk-field="paymentAccount"></select>
    </label>
    <label>
      Tarih
      <input data-bulk-field="date" type="date" />
    </label>
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
  fields.type?.addEventListener("change", () => updateBulkEntryCategoryOptions(row, { reset: true }));
  fields.paymentMethod?.addEventListener("change", () => updateBulkEntryPaymentAccountOptions(row));
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
  if (fields.type) fields.type.value = "income";
  if (fields.paymentMethod) fields.paymentMethod.value = "cash";
  if (fields.date) fields.date.value = getTurkeyTodayISO();
  setBulkEntryRowError(row, "");
  updateBulkEntryCategoryOptions(row);
  updateBulkEntryPaymentAccountOptions(row);
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
    updateBulkEntryPaymentAccountOptions(row);
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

  updatePaymentAccountSelect(
    fields.paymentAccount,
    fields.paymentMethod?.value || "cash",
    fields.paymentAccount.value
  );
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
  return ![
    fields.title?.value,
    fields.amount?.value,
    fields.note?.value,
    fields.paymentAccount?.value,
  ].some((value) => String(value || "").trim());
}

// ACIKLAMA: readBulkEntryTransaction fonksiyonunun Turkce karsiligi "coklu kayit satirini oku"; satirdaki veriyi dogrulanmis gelir/gider kaydina cevirir.
function readBulkEntryTransaction(row, index, now) {
  const fields = getBulkEntryFields(row);
  setBulkEntryRowError(row, "");

  if (isBulkEntryRowEmpty(row)) {
    return { status: "empty" };
  }

  const entry = createEntryTransaction(
    {
      type: fields.type?.value || "expense",
      title: fields.title?.value || "",
      amount: fields.amount?.value || "",
      category: fields.category?.value || "",
      paymentMethod: fields.paymentMethod?.value || "cash",
      paymentAccountId: fields.paymentAccount?.value || "",
      date: fields.date?.value || "",
      note: fields.note?.value || "",
    },
    now,
    getTurkeyNowTime()
  );

  if (!entry.title || !entry.amount || !entry.date) {
    setBulkEntryRowError(row, `${index + 1}. satırda başlık, tutar ve tarih zorunlu.`);
    return { status: "invalid" };
  }

  if (!validateTransactionPayment(entry, fields.error)) {
    return { status: "invalid" };
  }

  return { status: "ready", entry };
}

// ACIKLAMA: addBulkTransactions fonksiyonunun Turkce karsiligi "coklu gelir gider kaydet"; dolu satirlarin tamamini tek seferde kayitlara ekler.
function addBulkTransactions(event) {
  event.preventDefault();

  const rows = getBulkEntryRows();
  const now = getTurkeyNowDateTime();
  const readyEntries = [];

  for (let index = 0; index < rows.length; index += 1) {
    const result = readBulkEntryTransaction(rows[index], index, now);
    if (result.status === "invalid") {
      if (bulkEntryStatus) {
        bulkEntryStatus.textContent = `${index + 1}. satırı kontrol et.`;
      }
      rows[index].querySelector("input, select")?.focus();
      return;
    }
    if (result.status === "ready") {
      readyEntries.push(result.entry);
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
function loadTransactions() {
  return mergeTransactions(loadJsonState(STORAGE_KEY, []));
}

// ACIKLAMA: loadDeletedTransactionIds fonksiyonunun Turkce karsiligi "yukle silinmis islem kimlikler"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function loadDeletedTransactionIds() {
  // ACIKLAMA: values degiskeninin Turkce karsiligi "degerler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const values = loadJsonState(DELETED_TRANSACTIONS_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map(normalizeDeletedMarkerValue).filter(Boolean));
}

// ACIKLAMA: loadDeletedTransactionSignatures fonksiyonunun Turkce karsiligi "yukle silinmis islem imzalar"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function loadDeletedTransactionSignatures() {
  // ACIKLAMA: values degiskeninin Turkce karsiligi "degerler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const values = loadJsonState(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map(normalizeDeletedMarkerValue).filter(Boolean));
}

// ACIKLAMA: normalizeDeletedTransferTombstone fonksiyonunun Turkce karsiligi "standartlastir silinmis aktarim silme izi"; secilen kaydi siler veya listeden kaldirir.
function normalizeDeletedTransferTombstone(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = String(item.date || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(item.amount || 0).toFixed(2);
  // ACIKLAMA: sourceAccountId degiskeninin Turkce karsiligi "kaynak hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceAccountId = String(item.sourceAccountId || "");
  // ACIKLAMA: targetAccountId degiskeninin Turkce karsiligi "hedef hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: loadDeletedTransferTombstones fonksiyonunun Turkce karsiligi "yukle silinmis aktarim silme izleri"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function loadDeletedTransferTombstones() {
  // ACIKLAMA: values degiskeninin Turkce karsiligi "degerler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const values = loadJsonState(DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeDeletedTransferTombstone).filter(Boolean);
}

// ACIKLAMA: limitMarkerArray fonksiyonunun Turkce karsiligi "limit isaret dizi"; ilgili uygulama islemini calistirir.
function limitMarkerArray(values, max = MAX_DELETED_TRANSACTION_MARKERS) {
  return Array.from(values || [])
    .map(normalizeDeletedMarkerValue)
    .filter(Boolean)
    .slice(-max);
}

// ACIKLAMA: normalizeDeletedMarkerValue fonksiyonunun Turkce karsiligi "standartlastir silinmis isaret deger"; secilen kaydi siler veya listeden kaldirir.
function normalizeDeletedMarkerValue(item) {
  if (!item) {
    return "";
  }

  if (typeof item === "object") {
    return String(item.id || item.transactionId || item.transaction?.id || "");
  }

  return String(item || "");
}

// ACIKLAMA: mergeMarkerSet fonksiyonunun Turkce karsiligi "birlestir isaret ayarla"; ilgili uygulama islemini calistirir.
function mergeMarkerSet(...sources) {
  // ACIKLAMA: markers degiskeninin Turkce karsiligi "isaretler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const markers = [];
  sources.forEach((source) => {
    if (!source) {
      return;
    }

    // ACIKLAMA: values degiskeninin Turkce karsiligi "degerler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const values =
      source instanceof Set || Array.isArray(source)
        ? Array.from(source)
        : [source];

    values.forEach((item) => {
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const value = normalizeDeletedMarkerValue(item);
      if (value) {
        markers.push(value);
      }
    });
  });

  return new Set(limitMarkerArray(new Set(markers)));
}

// ACIKLAMA: getDeletedTransactionStateSnapshot fonksiyonunun Turkce karsiligi "al silinmis islem durum snapshot"; secilen kaydi siler veya listeden kaldirir.
function getDeletedTransactionStateSnapshot() {
  return {
    ids: limitMarkerArray(deletedTransactionIds),
    signatures: limitMarkerArray(deletedTransactionSignatures),
    transferTombstones: deletedTransferTombstones
      .map(normalizeDeletedTransferTombstone)
      .filter(Boolean)
      .slice(-MAX_DELETED_TRANSFER_TOMBSTONES),
  };
}

// ACIKLAMA: readCloudDeletedTransactionState fonksiyonunun Turkce karsiligi "oku bulut silinmis islem durum"; secilen kaydi siler veya listeden kaldirir.
function readCloudDeletedTransactionState(data = {}) {
  return {
    ids: Array.isArray(data.deletedTransactionIds)
      ? data.deletedTransactionIds
      : Array.isArray(data.deletedTransactions)
        ? data.deletedTransactions
        : [],
    signatures: Array.isArray(data.deletedTransactionSignatures) ? data.deletedTransactionSignatures : [],
    transferTombstones: Array.isArray(data.deletedTransferTombstones) ? data.deletedTransferTombstones : [],
  };
}

// ACIKLAMA: mergeDeletedTransferTombstones fonksiyonunun Turkce karsiligi "birlestir silinmis aktarim silme izleri"; secilen kaydi siler veya listeden kaldirir.
function mergeDeletedTransferTombstones(...sources) {
  // ACIKLAMA: byKey degiskeninin Turkce karsiligi "tarafindan anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const byKey = new Map();

  sources
    .flat()
    .map(normalizeDeletedTransferTombstone)
    .filter(Boolean)
    .forEach((item) => {
      // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
      const key = JSON.stringify(item);
      byKey.set(key, item);
    });

  return Array.from(byKey.values()).slice(-MAX_DELETED_TRANSFER_TOMBSTONES);
}

// ACIKLAMA: applyDeletedTransactionState fonksiyonunun Turkce karsiligi "uygula silinmis islem durum"; secilen kaydi siler veya listeden kaldirir.
function applyDeletedTransactionState(...states) {
  // ACIKLAMA: beforeIds degiskeninin Turkce karsiligi "oncesi kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const beforeIds = deletedTransactionIds.size;
  // ACIKLAMA: beforeSignatures degiskeninin Turkce karsiligi "oncesi imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const beforeSignatures = deletedTransactionSignatures.size;
  // ACIKLAMA: beforeTombstones degiskeninin Turkce karsiligi "oncesi silme izleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const beforeTombstones = deletedTransferTombstones.length;

  deletedTransactionIds = mergeMarkerSet(
    deletedTransactionIds,
    ...states.map((state) => state?.ids || state?.deletedTransactionIds || state?.deletedTransactions || [])
  );
  deletedTransactionSignatures = mergeMarkerSet(
    deletedTransactionSignatures,
    ...states.map((state) => state?.signatures || state?.deletedTransactionSignatures || [])
  );
  deletedTransferTombstones = mergeDeletedTransferTombstones(
    deletedTransferTombstones,
    ...states.map((state) => state?.transferTombstones || state?.deletedTransferTombstones || [])
  );

  persistDeletedTransactionIds();
  persistDeletedTransactionSignatures();
  persistDeletedTransferTombstones();

  return (
    beforeIds !== deletedTransactionIds.size ||
    beforeSignatures !== deletedTransactionSignatures.size ||
    beforeTombstones !== deletedTransferTombstones.length
  );
}

// ACIKLAMA: getCloudDeletedTransactionPayload fonksiyonunun Turkce karsiligi "al bulut silinmis islem veri paketi"; secilen kaydi siler veya listeden kaldirir.
function getCloudDeletedTransactionPayload() {
  // ACIKLAMA: snapshot degiskeninin Turkce karsiligi "snapshot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const snapshot = getDeletedTransactionStateSnapshot();
  return {
    deletedTransactionIds: snapshot.ids,
    deletedTransactionSignatures: snapshot.signatures,
    deletedTransferTombstones: snapshot.transferTombstones,
  };
}

// ACIKLAMA: persistDeletedTransactionIds fonksiyonunun Turkce karsiligi "kalici kaydet silinmis islem kimlikler"; secilen kaydi siler veya listeden kaldirir.
function persistDeletedTransactionIds() {
  deletedTransactionIds = new Set(limitMarkerArray(deletedTransactionIds));
  localStorage.setItem(getStorageKey(DELETED_TRANSACTIONS_STORAGE_KEY), JSON.stringify([...deletedTransactionIds]));
}

// ACIKLAMA: persistDeletedTransactionSignatures fonksiyonunun Turkce karsiligi "kalici kaydet silinmis islem imzalar"; secilen kaydi siler veya listeden kaldirir.
function persistDeletedTransactionSignatures() {
  deletedTransactionSignatures = new Set(limitMarkerArray(deletedTransactionSignatures));
  localStorage.setItem(getStorageKey(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY), JSON.stringify([...deletedTransactionSignatures]));
}

// ACIKLAMA: persistDeletedTransferTombstones fonksiyonunun Turkce karsiligi "kalici kaydet silinmis aktarim silme izleri"; secilen kaydi siler veya listeden kaldirir.
function persistDeletedTransferTombstones() {
  // ACIKLAMA: limited degiskeninin Turkce karsiligi "limited"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limited = deletedTransferTombstones.slice(-MAX_DELETED_TRANSFER_TOMBSTONES);
  deletedTransferTombstones = limited;
  localStorage.setItem(getStorageKey(DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY), JSON.stringify(limited));
}

// ACIKLAMA: getTransferDeletionTombstone fonksiyonunun Turkce karsiligi "al aktarim deletion silme izi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransferDeletionTombstone(transaction) {
  if (!transaction || transaction.type !== "transfer") {
    return null;
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = String(transaction.date || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transaction.amount || 0).toFixed(2);
  // ACIKLAMA: sourceAccountId degiskeninin Turkce karsiligi "kaynak hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceAccountId = String(transaction.paymentAccountId || "");
  // ACIKLAMA: targetAccountId degiskeninin Turkce karsiligi "hedef hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: addDeletedTransactionSignature fonksiyonunun Turkce karsiligi "add silinmis islem imza"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function addDeletedTransactionSignature(transaction) {
  if (!transaction || !isValidTransaction(transaction)) {
    return;
  }

  // ACIKLAMA: signature degiskeninin Turkce karsiligi "imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const signature = getTransactionSignature(transaction);
  if (signature) {
    deletedTransactionSignatures.add(signature);
    persistDeletedTransactionSignatures();
  }
}

// ACIKLAMA: addDeletedTransferTombstone fonksiyonunun Turkce karsiligi "add silinmis aktarim silme izi"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function addDeletedTransferTombstone(transaction) {
  // ACIKLAMA: tombstone degiskeninin Turkce karsiligi "silme izi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const tombstone = getTransferDeletionTombstone(transaction);
  if (!tombstone) {
    return;
  }

  // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const key = JSON.stringify(tombstone);
  // ACIKLAMA: exists degiskeninin Turkce karsiligi "exists"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const exists = deletedTransferTombstones.some((item) => JSON.stringify(item) === key);
  if (!exists) {
    deletedTransferTombstones.push(tombstone);
    persistDeletedTransferTombstones();
  }
}

// ACIKLAMA: markTransactionDeleted fonksiyonunun Turkce karsiligi "mark islem silinmis"; secilen kaydi siler veya listeden kaldirir.
function markTransactionDeleted(transactionId, transaction = null) {
  // ACIKLAMA: id degiskeninin Turkce karsiligi "kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: haveCompatibleTombstoneTimes fonksiyonunun Turkce karsiligi "have compatible silme izi times"; ilgili uygulama islemini calistirir.
function haveCompatibleTombstoneTimes(tombstoneMinute, transactionMinute) {
  return !tombstoneMinute || !transactionMinute || tombstoneMinute === transactionMinute;
}

// ACIKLAMA: isTransactionCoveredByDeletedTransferTombstone fonksiyonunun Turkce karsiligi "mi islem kapsanmis tarafindan silinmis aktarim silme izi"; secilen kaydi siler veya listeden kaldirir.
function isTransactionCoveredByDeletedTransferTombstone(transaction) {
  if (!transaction || !deletedTransferTombstones.length) {
    return false;
  }

  // ACIKLAMA: transactionAmount degiskeninin Turkce karsiligi "islem tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionAmount = Number(transaction.amount || 0).toFixed(2);
  // ACIKLAMA: transactionDate degiskeninin Turkce karsiligi "islem tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionDate = String(transaction.date || "");
  // ACIKLAMA: transactionMinute degiskeninin Turkce karsiligi "islem minute"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionMinute = getComparableTransactionMinute(transaction);
  // ACIKLAMA: transactionPaymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const transactionPaymentAccountId = String(transaction.paymentAccountId || "");
  // ACIKLAMA: transactionTransferAccountId degiskeninin Turkce karsiligi "islem aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isTransactionDeleted fonksiyonunun Turkce karsiligi "mi islem silinmis"; secilen kaydi siler veya listeden kaldirir.
function isTransactionDeleted(transactionOrId) {
  if (!transactionOrId || typeof transactionOrId !== "object") {
    return deletedTransactionIds.has(String(transactionOrId || ""));
  }

  // ACIKLAMA: transaction degiskeninin Turkce karsiligi "islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transaction = transactionOrId;
  // ACIKLAMA: id degiskeninin Turkce karsiligi "kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const id = String(transaction.id || "");

  // ACIKLAMA: v206 fonksiyonunun Turkce karsiligi "v206"; ilgili uygulama islemini calistirir.
  // Benzer başlık/tutar/tarih yüzünden yeni kayıtların kaybolmasını engeller.
  if (id) {
    return deletedTransactionIds.has(id);
  }

  if (isValidTransaction(transaction) && deletedTransactionSignatures.has(getTransactionSignature(transaction))) {
    return true;
  }

  return isTransactionCoveredByDeletedTransferTombstone(transaction);
}

// ACIKLAMA: loadAssets fonksiyonunun Turkce karsiligi "yukle varliklar"; ilgili uygulama islemini calistirir.
function loadAssets() {
  return loadJsonState(ASSETS_STORAGE_KEY, []);
}

// ACIKLAMA: loadBesAccounts fonksiyonunun Turkce karsiligi "yukle BES hesaplar"; ilgili uygulama islemini calistirir.
function loadBesAccounts() {
  return loadJsonState(BES_STORAGE_KEY, []);
}

// ACIKLAMA: loadPaymentAccounts fonksiyonunun Turkce karsiligi "yukle odeme hesaplar"; ilgili uygulama islemini calistirir.
function loadPaymentAccounts() {
  return loadJsonState(PAYMENT_ACCOUNTS_STORAGE_KEY, []);
}

// ACIKLAMA: cloneDefaultCategories fonksiyonunun Turkce karsiligi "clone default kategoriler"; ilgili uygulama islemini calistirir.
function cloneDefaultCategories() {
  return {
    income: [...DEFAULT_CATEGORIES.income],
    expense: [...DEFAULT_CATEGORIES.expense],
    transfer: [...DEFAULT_CATEGORIES.transfer],
  };
}

// ACIKLAMA: normalizeCategoryState fonksiyonunun Turkce karsiligi "standartlastir kategori durum"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeCategoryState(state) {
  // ACIKLAMA: fallback degiskeninin Turkce karsiligi "fallback"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fallback = cloneDefaultCategories();
  // ACIKLAMA: source degiskeninin Turkce karsiligi "kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const source = state && typeof state === "object" ? state : fallback;
  // ACIKLAMA: normalizeList ekrana basilan liste/kart satirlarinin yerlesecegi DOM alanidir.
  const normalizeList = (list, fallbackList) => {
    // ACIKLAMA: items degiskeninin Turkce karsiligi "ogeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const items = Array.isArray(list) ? list : fallbackList;
    // ACIKLAMA: cleaned degiskeninin Turkce karsiligi "temizlenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const cleaned = items
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    // ACIKLAMA: unique degiskeninin Turkce karsiligi "unique"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const unique = [];
    // ACIKLAMA: seen degiskeninin Turkce karsiligi "seen"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const seen = new Set();
    cleaned.forEach((item) => {
      // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
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


// ACIKLAMA: hasCategoryState fonksiyonunun Turkce karsiligi "var mi kategori durum"; ilgili uygulama islemini calistirir.
function hasCategoryState(source) {
  return (
    source &&
    typeof source === "object" &&
    (Array.isArray(source.income) || Array.isArray(source.expense) || Array.isArray(source.transfer))
  );
}

// ACIKLAMA: mergeCategoryStates fonksiyonunun Turkce karsiligi "birlestir kategori states"; ilgili uygulama islemini calistirir.
function mergeCategoryStates(...states) {
  // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidates = states.filter(hasCategoryState);

  if (!candidates.length) {
    return cloneDefaultCategories();
  }

  // ACIKLAMA: merged degiskeninin Turkce karsiligi "merged"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const merged = { income: [], expense: [], transfer: [] };
  // ACIKLAMA: seen degiskeninin Turkce karsiligi "seen"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const seen = { income: new Set(), expense: new Set(), transfer: new Set() };
  // ACIKLAMA: addCategory degiskeninin Turkce karsiligi "add kategori"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const addCategory = (type, name) => {
    // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const value = String(name || "").trim();

    if (!value) {
      return;
    }

    // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
    const key = value.toLocaleLowerCase("tr-TR");
    if (seen[type].has(key)) {
      return;
    }

    seen[type].add(key);
    merged[type].push(value);
  };

  candidates.forEach((state) => {
    // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const normalized = normalizeCategoryState(state);
    ["income", "expense", "transfer"].forEach((type) => {
      (normalized[type] || []).forEach((category) => addCategory(type, category));
    });
  });

  return normalizeCategoryState(merged);
}

// ACIKLAMA: getTransactionCategoriesFromRecords fonksiyonunun Turkce karsiligi "al islem kategoriler kaynakli kayitlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionCategoriesFromRecords(source = transactions) {
  // ACIKLAMA: recordCategories degiskeninin Turkce karsiligi "kayit kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const recordCategories = { income: [], expense: [], transfer: [] };

  (Array.isArray(source) ? source : []).forEach((item) => {
    if (!item || !["income", "expense", "transfer"].includes(item.type)) {
      return;
    }

    // ACIKLAMA: category degiskeninin Turkce karsiligi "kategori"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const category = String(item.category || "").trim();
    if (category) {
      recordCategories[item.type].push(category);
    }
  });

  return recordCategories;
}

// ACIKLAMA: readCloudTransactionCategories fonksiyonunun Turkce karsiligi "oku bulut islem kategoriler"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudTransactionCategories(source) {
  return hasCategoryState(source) ? normalizeCategoryState(source) : null;
}

// ACIKLAMA: loadTransactionCategories fonksiyonunun Turkce karsiligi "yukle islem kategoriler"; ilgili uygulama islemini calistirir.
function loadTransactionCategories() {
  return normalizeCategoryState(loadJsonState(CATEGORY_STORAGE_KEY, cloneDefaultCategories()));
}

// ACIKLAMA: persistTransactionCategories fonksiyonunun Turkce karsiligi "kalici kaydet islem kategoriler"; ilgili uygulama islemini calistirir.
function persistTransactionCategories(options = {}) {
  const { syncCloud = true } = options;
  localStorage.setItem(getStorageKey(CATEGORY_STORAGE_KEY), JSON.stringify(transactionCategories));
  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

// ACIKLAMA: loadMarketData fonksiyonunun Turkce karsiligi "yukle piyasa veri"; ilgili uygulama islemini calistirir.
function loadMarketData() {
  // ACIKLAMA: fallback degiskeninin Turkce karsiligi "fallback"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fallback = { prices: { TRY: 1 }, updatedAt: "" };
  // ACIKLAMA: stored degiskeninin Turkce karsiligi "stored"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stored = localStorage.getItem(MARKET_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = JSON.parse(stored);
    return parsed && parsed.prices ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// ACIKLAMA: loadJsonState fonksiyonunun Turkce karsiligi "yukle JSON durum"; ilgili uygulama islemini calistirir.
function loadJsonState(baseKey, fallback) {
  // ACIKLAMA: stored degiskeninin Turkce karsiligi "stored"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getStorageKey fonksiyonunun Turkce karsiligi "al depolama anahtar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getStorageKey(baseKey = STORAGE_KEY) {
  return currentUser ? `${baseKey}-${currentUser.uid}` : baseKey;
}

// ACIKLAMA: loadTransactionsStateUpdatedAt fonksiyonunun Turkce karsiligi "yukle islemler durum updated at"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function loadTransactionsStateUpdatedAt() {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = Number(localStorage.getItem(getStorageKey(TRANSACTIONS_STATE_UPDATED_STORAGE_KEY)));
  return Number.isFinite(value) ? value : 0;
}

// ACIKLAMA: saveTransactionsStateUpdatedAt fonksiyonunun Turkce karsiligi "kaydet islemler durum updated at"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveTransactionsStateUpdatedAt(timestamp = Date.now()) {
  localStorage.setItem(getStorageKey(TRANSACTIONS_STATE_UPDATED_STORAGE_KEY), String(timestamp));
  return timestamp;
}

// ACIKLAMA: markTransactionsCloudDirty fonksiyonunun Turkce karsiligi "mark islemler bulut bekleyen degisiklik"; bulut ve yerel veri esitleme akisini yonetir.
function markTransactionsCloudDirty(timestamp = Date.now()) {
  localStorage.setItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY), String(timestamp));
  return timestamp;
}

// ACIKLAMA: clearTransactionsCloudDirty fonksiyonunun Turkce karsiligi "temizle islemler bulut bekleyen degisiklik"; bulut ve yerel veri esitleme akisini yonetir.
function clearTransactionsCloudDirty(syncedThrough = Number.POSITIVE_INFINITY) {
  // ACIKLAMA: dirtyAt degiskeninin Turkce karsiligi "bekleyen degisiklik at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dirtyAt = loadTransactionsCloudDirtyAt();
  if (dirtyAt && Number.isFinite(syncedThrough) && dirtyAt > syncedThrough) {
    return false;
  }

  localStorage.removeItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY));
  return true;
}

// ACIKLAMA: loadTransactionsCloudDirtyAt fonksiyonunun Turkce karsiligi "yukle islemler bulut bekleyen degisiklik at"; bulut ve yerel veri esitleme akisini yonetir.
function loadTransactionsCloudDirtyAt() {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = Number(localStorage.getItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY)));
  return Number.isFinite(value) ? value : 0;
}

// ACIKLAMA: markTransactionsCloudFullSyncRequired fonksiyonunun Turkce karsiligi "mark islemler bulut tam esitle gerekli"; bulut ve yerel veri esitleme akisini yonetir.
function markTransactionsCloudFullSyncRequired() {
  localStorage.setItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY), "1");
}

// ACIKLAMA: clearTransactionsCloudFullSyncRequired fonksiyonunun Turkce karsiligi "temizle islemler bulut tam esitle gerekli"; bulut ve yerel veri esitleme akisini yonetir.
function clearTransactionsCloudFullSyncRequired() {
  localStorage.removeItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY));
}

// ACIKLAMA: isTransactionsCloudFullSyncRequired fonksiyonunun Turkce karsiligi "mi islemler bulut tam esitle gerekli"; bulut ve yerel veri esitleme akisini yonetir.
function isTransactionsCloudFullSyncRequired() {
  return localStorage.getItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY)) === "1";
}

// ACIKLAMA: getTransactionsNewestMutationTimestamp fonksiyonunun Turkce karsiligi "al islemler en yeni mutation zaman damgasi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionsNewestMutationTimestamp(records = []) {
  return records.reduce((latest, item) => {
    // ACIKLAMA: timestamp degiskeninin Turkce karsiligi "zaman damgasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const timestamp =
      getRecordTimestamp(item?.updatedAt) ||
      getRecordTimestamp(item?.createdAt) ||
      getRecordTimestamp(item?.transactionAt) ||
      getTransactionSortTimestamp(item) ||
      0;
    return Math.max(latest, timestamp);
  }, 0);
}

// ACIKLAMA: getPendingLocalTransactionUpserts fonksiyonunun Turkce karsiligi "al bekleyen yerel islem upserts"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPendingLocalTransactionUpserts(localRecords = [], cloudRecords = []) {
  // ACIKLAMA: cloudById degiskeninin Turkce karsiligi "bulut tarafindan kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cloudById = new Map(
    getCloudReadyTransactions(cloudRecords)
      .filter((item) => !isTransactionDeleted(item))
      .map((item) => [String(item.id || ""), item])
      .filter(([id]) => id)
  );

  return getCloudReadyTransactions(localRecords)
    .filter((item) => !isTransactionDeleted(item))
    .filter((item) => {
      // ACIKLAMA: id degiskeninin Turkce karsiligi "kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const id = String(item.id || "");
      if (!id) {
        return false;
      }

      // ACIKLAMA: cloudItem degiskeninin Turkce karsiligi "bulut oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cloudItem = cloudById.get(id);
      if (!cloudItem) {
        return true;
      }

      // ACIKLAMA: localTime degiskeninin Turkce karsiligi "yerel saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const localTime = getTransactionMergeTimestamp(item);
      // ACIKLAMA: cloudTime degiskeninin Turkce karsiligi "bulut saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cloudTime = getTransactionMergeTimestamp(cloudItem);
      if (localTime && cloudTime && localTime !== cloudTime) {
        return localTime > cloudTime;
      }

      return JSON.stringify(toCloudTransactionBackup(item)) !== JSON.stringify(toCloudTransactionBackup(cloudItem));
    });
}

// ACIKLAMA: getPendingLocalTransactionDeletes fonksiyonunun Turkce karsiligi "al bekleyen yerel islem deletes"; secilen kaydi siler veya listeden kaldirir.
function getPendingLocalTransactionDeletes(cloudRecords = []) {
  // ACIKLAMA: deletedIds degiskeninin Turkce karsiligi "silinmis kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const deletedIds = new Set(Array.from(deletedTransactionIds || []).map((id) => String(id || "")).filter(Boolean));
  if (!deletedIds.size) {
    return [];
  }

  return getCloudReadyTransactions(cloudRecords)
    .map((item) => String(item.id || ""))
    .filter((id) => id && deletedIds.has(id));
}

// ACIKLAMA: persistTransactions fonksiyonunun Turkce karsiligi "kalici kaydet islemler"; ilgili uygulama islemini calistirir.
function persistTransactions(options = {}) {
  const { syncCloud = true, replaceCloud = false, cloudUpserts = null, cloudDeletes = null } = options;

  transactions = mergeTransactions(transactions);
  localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
  if (syncCloud) {
    // ACIKLAMA: mutationTime degiskeninin Turkce karsiligi "mutation saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const mutationTime = saveTransactionsStateUpdatedAt();
    markTransactionsCloudDirty(mutationTime);
  }
  updateStorageStatus();

  if (syncCloud) {
    return syncTransactionsToCloud({ replace: replaceCloud, upserts: cloudUpserts, deletes: cloudDeletes });
  }

  return Promise.resolve();
}

// ACIKLAMA: persistAssets fonksiyonunun Turkce karsiligi "kalici kaydet varliklar"; ilgili uygulama islemini calistirir.
function persistAssets(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(ASSETS_STORAGE_KEY), JSON.stringify(assets));

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

// ACIKLAMA: persistBesAccounts fonksiyonunun Turkce karsiligi "kalici kaydet BES hesaplar"; ilgili uygulama islemini calistirir.
function persistBesAccounts(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(BES_STORAGE_KEY), JSON.stringify(besAccounts));

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

// ACIKLAMA: persistPaymentAccounts fonksiyonunun Turkce karsiligi "kalici kaydet odeme hesaplar"; ilgili uygulama islemini calistirir.
function persistPaymentAccounts(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(PAYMENT_ACCOUNTS_STORAGE_KEY), JSON.stringify(paymentAccounts));
  window.setTimeout(() => checkCardPaymentReminders(), 0);

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

// ACIKLAMA: persistMarketData fonksiyonunun Turkce karsiligi "kalici kaydet piyasa veri"; ilgili uygulama islemini calistirir.
function persistMarketData() {
  localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(marketData));
}

// ACIKLAMA: updateCategoryOptions fonksiyonunun Turkce karsiligi "guncelle kategori options"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateCategoryOptions(type) {
  updateCategorySelect(categoryInput, type);
}

// ACIKLAMA: updateCategorySelect fonksiyonunun Turkce karsiligi "guncelle kategori secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateCategorySelect(selectElement, type, selectedValue = "") {
  if (!selectElement) {
    return;
  }

  // ACIKLAMA: options degiskeninin Turkce karsiligi "options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const options = transactionCategories[type] || transactionCategories.expense;
  // ACIKLAMA: normalizedSelected degiskeninin Turkce karsiligi "normalized selected"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedSelected = String(selectedValue || "");
  selectElement.innerHTML = "";

  options.forEach((category) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectElement.append(option);
  });

  if (normalizedSelected && !options.includes(normalizedSelected)) {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = normalizedSelected;
    option.textContent = normalizedSelected;
    selectElement.prepend(option);
  }

  // ACIKLAMA: hasSelectedOption degiskeninin Turkce karsiligi "var mi selected option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasSelectedOption = Array.from(selectElement.options).some(
    (option) => option.value === normalizedSelected
  );
  selectElement.value = hasSelectedOption ? normalizedSelected : options[0] || "";
}

// ACIKLAMA: render fonksiyonunun Turkce karsiligi "ekrana bas"; ilgili ekran, liste veya kartlari ekrana basar.
function render() {
  renderView();
  renderStats();
  renderAssets();
  renderPaymentAccountFilterOptions();
  if (activeView === "cardsView") {
    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
  }
  renderPaymentAccounts();
  renderBesAccounts();
  renderHome();
  renderCategoryBreakdown();
  renderTransactions();
  if (recentTransactionsModal && !recentTransactionsModal.hidden) {
    renderRecentTransactionsModal();
  }
  updateStorageStatus();
  updateCardReminderControls();
}

// ACIKLAMA: renderStats fonksiyonunun Turkce karsiligi "ekrana bas istatistikler"; ilgili ekran, liste veya kartlari ekrana basar.
function renderStats() {
  // ACIKLAMA: scopedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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

// ACIKLAMA: normalizeHomeSummaryFilter fonksiyonunun Turkce karsiligi "standartlastir ana sayfa ozet filtre"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeHomeSummaryFilter(raw = {}) {
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.start || "")) ? String(raw.start) : "";
  // ACIKLAMA: end degiskeninin Turkce karsiligi "bitis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const end = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.end || "")) ? String(raw.end) : "";
  return { start, end };
}

// ACIKLAMA: loadHomeSummaryFilter fonksiyonunun Turkce karsiligi "yukle ana sayfa ozet filtre"; ilgili uygulama islemini calistirir.
function loadHomeSummaryFilter() {
  try {
    return normalizeHomeSummaryFilter(JSON.parse(localStorage.getItem(HOME_SUMMARY_FILTER_STORAGE_KEY) || "{}"));
  } catch {
    return { start: "", end: "" };
  }
}

// ACIKLAMA: saveHomeSummaryFilter fonksiyonunun Turkce karsiligi "kaydet ana sayfa ozet filtre"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveHomeSummaryFilter() {
  try {
    localStorage.setItem(HOME_SUMMARY_FILTER_STORAGE_KEY, JSON.stringify(normalizeHomeSummaryFilter(homeSummaryFilter)));
  } catch {
    // Filtre sadece bu cihazda tutulur.
  }
}

// ACIKLAMA: isHomeSummaryFilterActive fonksiyonunun Turkce karsiligi "mi ana sayfa ozet filtre aktif"; ilgili uygulama islemini calistirir.
function isHomeSummaryFilterActive() {
  return Boolean(homeSummaryFilter.start || homeSummaryFilter.end);
}

// ACIKLAMA: getHomeSummaryRange fonksiyonunun Turkce karsiligi "al ana sayfa ozet range"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryRange() {
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = homeSummaryFilter.start || "";
  // ACIKLAMA: end degiskeninin Turkce karsiligi "bitis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const end = homeSummaryFilter.end || "";

  if (start && end && start > end) {
    return { from: end, to: start };
  }

  return { from: start, to: end };
}

// ACIKLAMA: getHomeSummaryTransactions fonksiyonunun Turkce karsiligi "al ana sayfa ozet islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryTransactions() {
  if (!isHomeSummaryFilterActive()) {
    return transactions;
  }

  const { from, to } = getHomeSummaryRange();

  return transactions.filter((item) => {
    // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const date = String(item.date || "").slice(0, 10);
    return (!from || date >= from) && (!to || date <= to);
  });
}

// ACIKLAMA: getSummaryScopedTransactions fonksiyonunun Turkce karsiligi "al ozet scoped islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getSummaryScopedTransactions() {
  return isHomeSummaryFilterActive() ? getHomeSummaryTransactions() : getDateFilteredTransactions();
}

// ACIKLAMA: getSummaryScopeLabel fonksiyonunun Turkce karsiligi "al ozet scope etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getSummaryScopeLabel() {
  return isHomeSummaryFilterActive() ? getHomeSummaryFilterLabel() : getDateFilterLabel();
}

// ACIKLAMA: getHomeSummaryFilterLabel fonksiyonunun Turkce karsiligi "al ana sayfa ozet filtre etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getHomeSummaryFilterLabel() {
  if (!isHomeSummaryFilterActive()) {
    return "Tüm kayıtlar";
  }

  const { from, to } = getHomeSummaryRange();
  // ACIKLAMA: fromLabel degiskeninin Turkce karsiligi "kaynakli etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fromLabel = from ? formatDate(from) : "İlk kayıt";
  // ACIKLAMA: toLabel degiskeninin Turkce karsiligi "ile etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const toLabel = to ? formatDate(to) : "Bugün";
  return `${fromLabel} - ${toLabel}`;
}

// ACIKLAMA: syncHomeSummaryFilterControls fonksiyonunun Turkce karsiligi "esitle ana sayfa ozet filtre kontroller"; bulut ve yerel veri esitleme akisini yonetir.
function syncHomeSummaryFilterControls() {
  getHomeSummaryStartInputs().forEach((input) => {
    input.value = homeSummaryFilter.start || "";
  });

  getHomeSummaryEndInputs().forEach((input) => {
    input.value = homeSummaryFilter.end || "";
  });

  updateHomeSummaryFilterStatus();
}

// ACIKLAMA: updateHomeSummaryFilterStatus fonksiyonunun Turkce karsiligi "guncelle ana sayfa ozet filtre durum"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateHomeSummaryFilterStatus(totals = null, count = null) {
  // ACIKLAMA: statusNodes degiskeninin Turkce karsiligi "durum nodes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const label = getHomeSummaryFilterLabel();
  // ACIKLAMA: detail degiskeninin Turkce karsiligi "ayrinti"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const detail = totals ? ` ${count ?? 0} kayıt · Net ${currency.format(totals.balance)}.` : "";
  statusNodes.forEach((node) => {
    node.textContent = `Şu anda ${label} arası gelir gider hesabınız gösterilmektedir.${detail}`;
  });
}

// ACIKLAMA: applyHomeSummaryFilter fonksiyonunun Turkce karsiligi "uygula ana sayfa ozet filtre"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: clearHomeSummaryFilter fonksiyonunun Turkce karsiligi "temizle ana sayfa ozet filtre"; ilgili uygulama islemini calistirir.
function clearHomeSummaryFilter() {
  homeSummaryFilter = { start: "", end: "" };
  saveHomeSummaryFilter();
  syncHomeSummaryFilterControls();
  renderHome();
  renderStats();
  renderCategoryBreakdown();
}

// ACIKLAMA: renderHome fonksiyonunun Turkce karsiligi "ekrana bas ana sayfa"; ilgili ekran, liste veya kartlari ekrana basar.
function renderHome() {
  if (!homeBalance) {
    return;
  }

  // ACIKLAMA: homeTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const homeTransactions = getHomeSummaryTransactions();
  // ACIKLAMA: totals degiskeninin Turkce karsiligi "totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totals = getTransactionTotals(homeTransactions);
  // ACIKLAMA: assetTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const assetTotal = assets.reduce((sum, item) => sum + getAssetValue(item), 0);
  // ACIKLAMA: besTotalValue degiskeninin Turkce karsiligi "BES toplam deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: fitHomeWealthTotalText fonksiyonunun Turkce karsiligi "sigdir ana sayfa birikim toplam metin"; ilgili uygulama islemini calistirir.
function fitHomeWealthTotalText() {
  if (!homeWealthTotal || !homeWealthChart) {
    return;
  }

  // ACIKLAMA: innerCircle degiskeninin Turkce karsiligi "inner circle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const innerCircle = homeWealthTotal.closest("div");
  if (!innerCircle) {
    return;
  }

  // ACIKLAMA: maxSize degiskeninin Turkce karsiligi "max boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const maxSize = window.innerWidth <= 720 ? 16 : 28;
  // ACIKLAMA: minSize degiskeninin Turkce karsiligi "min boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const minSize = window.innerWidth <= 720 ? 10 : 12;
  homeWealthTotal.style.fontSize = `${maxSize}px`;
  homeWealthTotal.style.whiteSpace = "nowrap";

  // ACIKLAMA: availableWidth degiskeninin Turkce karsiligi "available width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const availableWidth = Math.max(92, innerCircle.clientWidth - 10);
  // ACIKLAMA: current degiskeninin Turkce karsiligi "mevcut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let current = maxSize;

  while (homeWealthTotal.scrollWidth > availableWidth && current > minSize) {
    current -= 1;
    homeWealthTotal.style.fontSize = `${current}px`;
  }
}

// ACIKLAMA: renderHomeWealthChart fonksiyonunun Turkce karsiligi "ekrana bas ana sayfa birikim grafik"; ilgili ekran, liste veya kartlari ekrana basar.
function renderHomeWealthChart({ cashBalance, assetTotal, besTotalValue }) {
  if (!homeWealthChart || !homeWealthTotal || !homeWealthLegend) {
    return;
  }

  // ACIKLAMA: groupedAssetSegments varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const groupedAssetSegments = Object.values(
    assets.reduce((acc, item) => {
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const value = Math.max(getAssetValue(item), 0);
      if (!value) {
        return acc;
      }

      // ACIKLAMA: key degiskeninin Turkce karsiligi "anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
      const key = item.type;
      // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: segments degiskeninin Turkce karsiligi "segments"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const segments = [
    { label: "Güncel bakiye", value: Math.max(cashBalance, 0), color: "#14b8a6" },
    ...groupedAssetSegments,
    { label: "BES", value: Math.max(besTotalValue, 0), color: "#173f5f" },
  ].filter((segment) => segment.value > 0);
  // ACIKLAMA: total hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  homeWealthTotal.textContent = currency.format(total);
  fitHomeWealthTotalText();
  homeWealthLegend.innerHTML = "";

  if (!total) {
    // ACIKLAMA: activeTheme degiskeninin Turkce karsiligi "aktif tema"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const activeTheme = document.documentElement.getAttribute("data-theme") || document.body?.getAttribute("data-theme") || "light";
    homeWealthChart.style.background = activeTheme === "dark"
      ? "linear-gradient(180deg, rgba(24,35,46,0.96), rgba(17,26,35,0.92))"
      : "#edf3f0";
    homeWealthLegend.innerHTML = '<div class="empty-state">Birikim verisi ekledikçe dağılım burada görünür.</div>';
    return;
  }

  // ACIKLAMA: cursor degiskeninin Turkce karsiligi "cursor"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let cursor = 0;
  // ACIKLAMA: gradientParts degiskeninin Turkce karsiligi "gradient parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const gradientParts = segments.map((segment) => {
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = cursor;
    // ACIKLAMA: end degiskeninin Turkce karsiligi "bitis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const end = cursor + (segment.value / total) * 100;
    cursor = end;
    return `${segment.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });

  homeWealthChart.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  segments.forEach((segment) => {
    // ACIKLAMA: ratio degiskeninin Turkce karsiligi "ratio"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const ratio = (segment.value / total) * 100;
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("article");
    row.className = "wealth-legend-row";
    row.innerHTML = `
      <span><i style="background:${segment.color}"></i>${escapeHtml(segment.label)}</span>
      <strong>${escapeHtml(currency.format(segment.value))} · %${ratio.toFixed(0)}</strong>
    `;
    homeWealthLegend.append(row);
  });
}

// ACIKLAMA: renderHomeAssetList fonksiyonunun Turkce karsiligi "ekrana bas ana sayfa varlik liste"; ilgili ekran, liste veya kartlari ekrana basar.
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

  // ACIKLAMA: totalPages degiskeninin Turkce karsiligi "toplam pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalPages = Math.max(1, Math.ceil(assets.length / HOME_LIST_PAGE_SIZE));
  homeAssetPage = Math.min(Math.max(1, homeAssetPage), totalPages);
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = (homeAssetPage - 1) * HOME_LIST_PAGE_SIZE;
  // ACIKLAMA: visibleAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const visibleAssets = assets.slice(start, start + HOME_LIST_PAGE_SIZE);

  visibleAssets.forEach((item) => {
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("article");
    row.className = "mini-row";
    // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: renderHomeBesList fonksiyonunun Turkce karsiligi "ekrana bas ana sayfa BES liste"; ilgili ekran, liste veya kartlari ekrana basar.
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

  // ACIKLAMA: totalPages degiskeninin Turkce karsiligi "toplam pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalPages = Math.max(1, Math.ceil(besAccounts.length / HOME_LIST_PAGE_SIZE));
  homeBesPage = Math.min(Math.max(1, homeBesPage), totalPages);
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = (homeBesPage - 1) * HOME_LIST_PAGE_SIZE;
  // ACIKLAMA: visibleBesAccounts degiskeninin Turkce karsiligi "gorunur BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const visibleBesAccounts = besAccounts.slice(start, start + HOME_LIST_PAGE_SIZE);

  visibleBesAccounts.forEach((item) => {
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: renderHomeMiniPagination fonksiyonunun Turkce karsiligi "ekrana bas ana sayfa kucuk sayfalama"; ilgili ekran, liste veya kartlari ekrana basar.
function renderHomeMiniPagination(container, currentPage, totalPages, onPageChange) {
  if (!container || totalPages <= 1) {
    return;
  }

  // ACIKLAMA: wrapper degiskeninin Turkce karsiligi "wrapper"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const wrapper = document.createElement("div");
  wrapper.className = "home-mini-pagination";

  // ACIKLAMA: previousButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "ghost-btn pagination-step-btn";
  previousButton.textContent = "Önceki";
  previousButton.disabled = currentPage <= 1;
  previousButton.addEventListener("click", () => onPageChange(currentPage - 1));

  // ACIKLAMA: pageInfo degiskeninin Turkce karsiligi "sayfa info"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pageInfo = document.createElement("span");
  pageInfo.textContent = `${currentPage}/${totalPages}`;

  // ACIKLAMA: nextButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "ghost-btn";
  nextButton.textContent = "Sonraki";
  nextButton.disabled = currentPage >= totalPages;
  nextButton.addEventListener("click", () => onPageChange(currentPage + 1));

  wrapper.append(previousButton, pageInfo, nextButton);
  container.append(wrapper);
}

// ACIKLAMA: getTransactionTotals fonksiyonunun Turkce karsiligi "al islem totals"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionTotals(source) {
  // ACIKLAMA: safeSource degiskeninin Turkce karsiligi "guvenli kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeSource = Array.isArray(source) ? source : [];
  // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const income = safeSource
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  // ACIKLAMA: expense degiskeninin Turkce karsiligi "gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const expense = safeSource
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return { income: roundMoney(income), expense: roundMoney(expense), balance: roundMoney(income - expense) };
}

// ACIKLAMA: renderAssets fonksiyonunun Turkce karsiligi "ekrana bas varliklar"; ilgili ekran, liste veya kartlari ekrana basar.
function renderAssets() {
  if (!assetList) {
    return;
  }

  // ACIKLAMA: total hesaplanan toplam degerin ekranda gosterilecegi alandir.
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
    // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const definition = getAssetDefinition(item.type);
    // ACIKLAMA: unitPrice degiskeninin Turkce karsiligi "unit fiyat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const unitPrice = getAssetUnitPrice(item.type);
    // ACIKLAMA: totalValue degiskeninin Turkce karsiligi "toplam deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const totalValue = getAssetValue(item);
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("article");
    row.className = "transaction-item";

    // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const content = document.createElement("div");
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.label || definition.label;

    // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = `${definition.label} · ${formatQuantity(item.amount)} ${definition.unit} · Birim ${currency.format(
      unitPrice
    )}`;

    content.append(title, meta);

    // ACIKLAMA: side degiskeninin Turkce karsiligi "side"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const side = document.createElement("div");
    side.className = "transaction-side";

    // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(totalValue);

    // ACIKLAMA: editButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openAssetEditModal(item.id));

    // ACIKLAMA: removeButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
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


// ACIKLAMA: renderPaymentAccounts fonksiyonunun Turkce karsiligi "ekrana bas odeme hesaplar"; ilgili ekran, liste veya kartlari ekrana basar.
function renderPaymentAccounts() {
  if (!paymentAccountList) {
    return;
  }

  // ACIKLAMA: creditDebt degiskeninin Turkce karsiligi "alacak debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const creditDebt = paymentAccounts
    .filter((item) => item.type === "credit_card")
    .reduce((sum, item) => sum + Number(item.debt || 0), 0);
  // ACIKLAMA: activeStatementDebt degiskeninin Turkce karsiligi "aktif donem borcu"; kredi kartlarinin aktif donem borclarini toplamak icin kullanilir.
  const activeStatementDebt = paymentAccounts
    .filter((item) => item.type === "credit_card")
    .reduce((sum, item) => sum + getActiveCreditCardStatementDebt(item), 0);
  // ACIKLAMA: liquidBalance degiskeninin Turkce karsiligi "liquid bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const liquidBalance = paymentAccounts
    .filter((item) => item.type !== "credit_card")
    .reduce((sum, item) => sum + Number(item.balance || 0), 0);

  if (cardDebtTotal) {
    cardDebtTotal.textContent = currency.format(creditDebt);
  }

  if (activeStatementDebtTotal) {
    activeStatementDebtTotal.textContent = currency.format(activeStatementDebt);
  }

  if (bankBalanceTotal) {
    bankBalanceTotal.textContent = currency.format(liquidBalance);
  }

  paymentAccountList.innerHTML = "";
  updatePaymentAccountSelects();

  // ACIKLAMA: selectedType degiskeninin Turkce karsiligi "selected tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedType = paymentAccountTypeFilter?.value || "all";

  if (!paymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Kredi kartı, banka hesabı veya nakit cüzdan eklediğinde burada gerçek kart görünümünde şablon olarak görünecek.</div>';
    return;
  }

  // ACIKLAMA: filteredPaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const filteredPaymentAccounts = selectedType === "all"
    ? paymentAccounts
    : paymentAccounts.filter((item) => item.type === selectedType);

  if (!filteredPaymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Bu filtreye uygun kart veya hesap bulunamadı.</div>';
    return;
  }

  filteredPaymentAccounts.forEach((item) => {
    // ACIKLAMA: card degiskeninin Turkce karsiligi "kart"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const card = document.createElement("article");
    card.className = `payment-card real-payment-card ${item.type}`;
    card.style.setProperty("--card-color", normalizePaymentCardColor(item.color, item.type));

    // ACIKLAMA: shine degiskeninin Turkce karsiligi "shine"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const shine = document.createElement("span");
    shine.className = "payment-card-shine";

    // ACIKLAMA: top degiskeninin Turkce karsiligi "top"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const top = document.createElement("div");
    top.className = "payment-card-top";

    // ACIKLAMA: brandBlock degiskeninin Turkce karsiligi "brand blok"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const brandBlock = document.createElement("div");
    // ACIKLAMA: bank degiskeninin Turkce karsiligi "banka"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const bank = document.createElement("span");
    bank.className = "payment-card-bank";
    bank.textContent = item.bank || getPaymentAccountTypeLabel(item.type);

    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = document.createElement("h3");
    title.textContent = item.name || getPaymentAccountTypeLabel(item.type);
    brandBlock.append(bank, title);

    // ACIKLAMA: logo degiskeninin Turkce karsiligi "logo"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const logo = document.createElement("span");
    logo.className = "payment-card-logo";
    logo.setAttribute("aria-hidden", "true");

    top.append(brandBlock, logo);

    // ACIKLAMA: chipLine degiskeninin Turkce karsiligi "chip satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const chipLine = document.createElement("div");
    chipLine.className = "payment-card-chip-line";

    // ACIKLAMA: chip degiskeninin Turkce karsiligi "chip"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const chip = document.createElement("span");
    chip.className = "payment-card-chip";
    chip.setAttribute("aria-hidden", "true");

    // ACIKLAMA: contactless degiskeninin Turkce karsiligi "contactless"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const contactless = document.createElement("span");
    contactless.className = "payment-card-contactless";
    contactless.setAttribute("aria-hidden", "true");
    contactless.innerHTML = "<i></i><i></i><i></i>";

    // ACIKLAMA: badge degiskeninin Turkce karsiligi "badge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const badge = document.createElement("span");
    badge.className = "payment-card-badge";
    badge.textContent = getPaymentAccountTypeLabel(item.type);

    chipLine.append(chip, contactless, badge);

    // ACIKLAMA: number degiskeninin Turkce karsiligi "sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const number = document.createElement("p");
    number.className = "payment-card-number";
    number.textContent = item.last4 ? `••••  ••••  ••••  ${item.last4}` : getPaymentAccountCardNumberPlaceholder(item.type);

    // ACIKLAMA: details degiskeninin Turkce karsiligi "ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const details = document.createElement("div");
    details.className = "payment-card-details";

    if (item.type === "credit_card") {
      // ACIKLAMA: cardTotals degiskeninin Turkce karsiligi "kart totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cardTotals = getCreditCardRecordTotals(item);
      // ACIKLAMA: activeStatementDebt degiskeninin Turkce karsiligi "aktif statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const activeStatementDebt = getActiveCreditCardStatementDebt(item);
      details.classList.add("credit-card-details");
      // ACIKLAMA: availableLimit degiskeninin Turkce karsiligi "available limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const availableLimit = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));
      details.append(
        createPaymentCardDetail("SKT", item.expiry ? formatExpiry(item.expiry) : "--/----"),
        createPaymentCardDetail("Kesim", item.statementDay ? `${item.statementDay}. gün` : "-"),
        createPaymentCardDetail("Dönem", currency.format(activeStatementDebt)),
        createPaymentCardDetail("KULLANILABİLİR\nLİMİT", currency.format(availableLimit))
      );
    } else {
      details.append(
        createPaymentCardDetail("Kart / Hesap", item.name || "Tanımlı hesap"),
        createPaymentCardDetail("Tip", getPaymentAccountTypeLabel(item.type)),
        createPaymentCardDetail("Durum", "Aktif")
      );
    }

    // ACIKLAMA: bottom degiskeninin Turkce karsiligi "bottom"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const bottom = document.createElement("div");
    bottom.className = "payment-card-bottom";

    // ACIKLAMA: balanceBox degiskeninin Turkce karsiligi "bakiye box"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const balanceBox = document.createElement("div");
    // ACIKLAMA: amountLabel degiskeninin Turkce karsiligi "tutar etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amountLabel = document.createElement("span");
    amountLabel.className = "payment-card-small";
    amountLabel.textContent = item.type === "credit_card" ? "Toplam borç" : "Güncel bakiye";

    // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amount = document.createElement("strong");
    amount.className = item.type === "credit_card" ? "payment-card-amount expense" : "payment-card-amount income";
    amount.textContent = item.type === "credit_card" ? currency.format(item.debt || 0) : currency.format(item.balance || 0);
    balanceBox.append(amountLabel, amount);

    // ACIKLAMA: limitText degiskeninin Turkce karsiligi "limit metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const limitText = document.createElement("p");
    limitText.className = "payment-card-note";
    limitText.textContent = getPaymentAccountCardNote(item);
    limitText.hidden = !limitText.textContent;

    bottom.append(balanceBox, limitText);

    // ACIKLAMA: actions degiskeninin Turkce karsiligi "actions"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const actions = document.createElement("div");
    actions.className = "auth-actions payment-card-actions";

    if (item.type === "credit_card") {
      // ACIKLAMA: payButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
      const payButton = document.createElement("button");
      payButton.className = "success-btn";
      payButton.type = "button";
      payButton.textContent = "Öde";
      payButton.disabled = Number(item.debt || 0) <= 0;
      payButton.addEventListener("click", () => openPaymentAccountPayModal(item));
      actions.append(payButton);
    }

    // ACIKLAMA: recordsButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const recordsButton = document.createElement("button");
    recordsButton.className = "ghost-btn";
    recordsButton.type = "button";
    recordsButton.textContent = "Kayıtlar";
    recordsButton.addEventListener("click", () => openPaymentAccountRecordsModal(item));

    // ACIKLAMA: refreshButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const refreshButton = document.createElement("button");
    refreshButton.className = "ghost-btn payment-card-refresh-btn";
    refreshButton.type = "button";
    refreshButton.textContent = "Güncelle";
    refreshButton.addEventListener("click", () => refreshPaymentAccountFromRecords(item.id));

    // ACIKLAMA: editButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openPaymentAccountModal(item));

    // ACIKLAMA: removeButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
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

// ACIKLAMA: createPaymentCardDetail fonksiyonunun Turkce karsiligi "olustur odeme kart ayrinti"; AI destekli okuma veya API istegi akisini calistirir.
function createPaymentCardDetail(label, value) {
  // ACIKLAMA: wrapper degiskeninin Turkce karsiligi "wrapper"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const wrapper = document.createElement("div");
  // ACIKLAMA: strong degiskeninin Turkce karsiligi "strong"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const strong = document.createElement("strong");
  // ACIKLAMA: labelLines degiskeninin Turkce karsiligi "etiket satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const labelLines = String(label ?? "").split(/\n+/).map((line) => line.trim()).filter(Boolean);

  if (labelLines.length > 1) {
    wrapper.classList.add("stacked-label");
    labelLines.forEach((line) => {
      // ACIKLAMA: small degiskeninin Turkce karsiligi "small"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const small = document.createElement("span");
      small.textContent = line;
      wrapper.append(small);
    });
  } else {
    // ACIKLAMA: small degiskeninin Turkce karsiligi "small"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const small = document.createElement("span");
    small.textContent = labelLines[0] || String(label ?? "");
    wrapper.append(small);
  }

  strong.textContent = value;
  wrapper.append(strong);
  return wrapper;
}

// ACIKLAMA: getPaymentAccountCardNumberPlaceholder fonksiyonunun Turkce karsiligi "al odeme hesap kart sayi placeholder"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountCardNumberPlaceholder(type) {
  if (type === "cash") {
    return "NAKİT  CÜZDAN";
  }

  if (type === "bank_account") {
    return "BANKA  HESABI";
  }

  return "••••  ••••  ••••  ----";
}

// ACIKLAMA: getPaymentAccountCardNote fonksiyonunun Turkce karsiligi "al odeme hesap kart note"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountCardNote(item) {
  if (item.type === "credit_card") {
    // ACIKLAMA: available degiskeninin Turkce karsiligi "available"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const available = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));
    // ACIKLAMA: activeStatementDebt degiskeninin Turkce karsiligi "aktif statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const activeStatementDebt = getActiveCreditCardStatementDebt(item);
    // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parts = [
      `Dönem ${currency.format(activeStatementDebt)}`,
      `Toplam ${currency.format(item.debt || 0)}`,
    ];

    if (Number(item.limit || 0) > 0) {
      parts.push(`Kullanılabilir ${currency.format(available)}`);
    }

    return parts.join(" · ");
  }

  return item.note || "";
}

// ACIKLAMA: updatePaymentAccountSelects fonksiyonunun Turkce karsiligi "guncelle odeme hesap selects"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
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
  refreshBulkEntryRows();
}

// ACIKLAMA: updateAnyPaymentAccountSelect fonksiyonunun Turkce karsiligi "guncelle herhangi odeme hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateAnyPaymentAccountSelect(selectElement, selectedValue = "", options = {}) {
  if (!selectElement) {
    return;
  }

  const { excludeId = "", placeholder = "Kart / hesap seç" } = options;
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(selectedValue || selectElement.value || "");
  // ACIKLAMA: normalizedExcludeId degiskeninin Turkce karsiligi "normalized exclude kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedExcludeId = String(excludeId || "");
  // ACIKLAMA: availableAccounts degiskeninin Turkce karsiligi "available hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const availableAccounts = paymentAccounts.filter((item) => String(item.id || "") !== normalizedExcludeId);
  selectElement.innerHTML = "";

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = availableAccounts.length ? placeholder : "Kart / hesap ekle";
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = availableAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

// ACIKLAMA: updateTransactionTransferAccountSelect fonksiyonunun Turkce karsiligi "guncelle islem aktarim hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateTransactionTransferAccountSelect(selectedValue = "") {
  if (!transactionTransferAccountInput) {
    return;
  }

  updateAnyPaymentAccountSelect(transactionTransferAccountInput, selectedValue || transactionTransferAccountInput.value, {
    excludeId: transactionPaymentAccountInput?.value || "",
    placeholder: "Karşı kart / hesap seç",
  });
}

// ACIKLAMA: updateEntryTransferAccountSelect fonksiyonunun Turkce karsiligi "guncelle entry aktarim hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateEntryTransferAccountSelect(selectedValue = "") {
  if (!transferAccountSelect) {
    return;
  }

  updateAnyPaymentAccountSelect(transferAccountSelect, selectedValue || transferAccountSelect.value, {
    excludeId: paymentAccountSelect?.value || "",
    placeholder: "Alıcı kart / hesap seç",
  });
}

// ACIKLAMA: syncEntryTransferVisibility fonksiyonunun Turkce karsiligi "esitle entry aktarim gorunurluk"; bulut ve yerel veri esitleme akisini yonetir.
function syncEntryTransferVisibility() {
  // ACIKLAMA: isTransfer degiskeninin Turkce karsiligi "mi aktarim"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: syncTransactionTransferVisibility fonksiyonunun Turkce karsiligi "esitle islem aktarim gorunurluk"; bulut ve yerel veri esitleme akisini yonetir.
function syncTransactionTransferVisibility() {
  // ACIKLAMA: isTransfer degiskeninin Turkce karsiligi "mi aktarim"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: updatePaymentAccountSelect fonksiyonunun Turkce karsiligi "guncelle odeme hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updatePaymentAccountSelect(selectElement, method = "cash", selectedValue = "") {
  if (!selectElement) {
    return;
  }

  // ACIKLAMA: normalizedMethod degiskeninin Turkce karsiligi "normalized yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedMethod = normalizePaymentMethod(method);
  // ACIKLAMA: allowedTypes degiskeninin Turkce karsiligi "allowed turler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allowedTypes = paymentMethodAccountTypes[normalizedMethod] || [];
  // ACIKLAMA: availableAccounts degiskeninin Turkce karsiligi "available hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const availableAccounts = paymentAccounts.filter((item) => allowedTypes.includes(item.type));
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(selectedValue || selectElement.value || "");
  selectElement.innerHTML = "";

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = getPaymentSelectPlaceholder(normalizedMethod, availableAccounts.length);
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  if (currentValue && !availableAccounts.some((item) => item.id === currentValue)) {
    // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const existing = paymentAccounts.find((item) => item.id === currentValue);
    if (existing) {
      // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: syncBankImportAccountSelects fonksiyonunun Turkce karsiligi "banka ice aktar hesap secimlerini esitle"; ana panel ve onizleme penceresindeki hesap secimini ayni tutar.
function syncBankImportAccountSelects(selectedValue) {
  // ACIKLAMA: hasExplicitValue degiskeni kullanicinin bilerek bos secim yapip yapmadigini ayirt eder.
  const hasExplicitValue = arguments.length > 0;
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(
    hasExplicitValue
      ? selectedValue || ""
      : bankImportPreviewAccount?.value || bankImportAccountSelect?.value || ""
  );

  updateBankImportAccountSelect(bankImportAccountSelect, currentValue);
  updateBankImportAccountSelect(bankImportPreviewAccount, currentValue);
  if (hasExplicitValue && !currentValue) {
    syncBankImportTransferAccountSelects("");
  } else {
    syncBankImportTransferAccountSelects();
  }
}

// ACIKLAMA: updateBankImportAccountSelect fonksiyonunun Turkce karsiligi "guncelle banka ice aktar hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateBankImportAccountSelect(selectElement, selectedValue) {
  if (!selectElement) {
    return;
  }

  // ACIKLAMA: hasExplicitValue degiskeni bos secimin eski hesaba geri donmesini engeller.
  const hasExplicitValue = arguments.length > 1;
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(hasExplicitValue ? selectedValue || "" : selectElement.value || "");
  selectElement.innerHTML = "";

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Kart / hesap seçilmedi";
  selectElement.append(emptyOption);

  paymentAccounts.forEach((item) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = paymentAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

// ACIKLAMA: syncBankImportTransferAccountSelects fonksiyonunun Turkce karsiligi "banka ice aktar karsi hesap secimlerini esitle"; aktarim karsi hesabini ana panel ve onizleme arasinda ayni tutar.
function syncBankImportTransferAccountSelects(selectedValue) {
  // ACIKLAMA: hasExplicitValue degiskeni kullanicinin aktarim yok secimini korur.
  const hasExplicitValue = arguments.length > 0;
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(
    hasExplicitValue
      ? selectedValue || ""
      : bankImportPreviewTransferAccount?.value || bankImportTransferAccountSelect?.value || ""
  );
  // ACIKLAMA: sourceAccountId degiskeninin Turkce karsiligi "kaynak hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceAccountId = String(bankImportPreviewAccount?.value || bankImportAccountSelect?.value || "");

  updateBankImportTransferAccountSelect(bankImportTransferAccountSelect, currentValue, sourceAccountId);
  updateBankImportTransferAccountSelect(bankImportPreviewTransferAccount, currentValue, sourceAccountId);
}

// ACIKLAMA: updateBankImportTransferAccountSelect fonksiyonunun Turkce karsiligi "guncelle banka ice aktar aktarim hesap secim alani"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateBankImportTransferAccountSelect(selectElement, selectedValue, sourceAccountId = "") {
  if (!selectElement) {
    return;
  }

  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(sourceAccountId || "");
  // ACIKLAMA: hasExplicitValue degiskeni bos karsi hesap seciminin korunmasini saglar.
  const hasExplicitValue = arguments.length > 1;
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(hasExplicitValue ? selectedValue || "" : selectElement.value || "");
  // ACIKLAMA: eligibleAccounts degiskeninin Turkce karsiligi "eligible hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const eligibleAccounts = paymentAccounts.filter((item) => item.id !== sourceId);
  selectElement.innerHTML = "";

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Aktarım yok / karşı hesap seçilmedi";
  selectElement.append(emptyOption);

  eligibleAccounts.forEach((item) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = eligibleAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

// ACIKLAMA: getBankImportSelectedAccount fonksiyonunun Turkce karsiligi "al banka ice aktar selected hesap"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankImportSelectedAccount() {
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  return accountId ? paymentAccounts.find((item) => item.id === accountId) || null : null;
}

// ACIKLAMA: getBankImportSelectedTransferAccount fonksiyonunun Turkce karsiligi "al banka ice aktar selected aktarim hesap"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankImportSelectedTransferAccount() {
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(bankImportTransferAccountSelect?.value || bankImportPreviewTransferAccount?.value || "");
  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  if (!accountId || accountId === sourceId) {
    return null;
  }
  return paymentAccounts.find((item) => item.id === accountId) || null;
}

// ACIKLAMA: getPaymentMethodForImportAccount fonksiyonunun Turkce karsiligi "al odeme yontem icin ice aktar hesap"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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

// ACIKLAMA: getPaymentSelectPlaceholder fonksiyonunun Turkce karsiligi "al odeme secim alani placeholder"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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

// ACIKLAMA: shiftIsoDate fonksiyonunun Turkce karsiligi "kaydir iso tarih"; ilgili uygulama islemini calistirir.
function shiftIsoDate(dateValue, dayOffset) {
  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = parseIsoDate(dateValue);
  if (!date) {
    return getTurkeyTodayISO();
  }

  date.setDate(date.getDate() + Number(dayOffset || 0));
  return toDateInputValue(date);
}

// ACIKLAMA: createCreditCardDebtAdjustment fonksiyonunun Turkce karsiligi "olustur alacak kart debt adjustment"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createCreditCardDebtAdjustment(account, signedDebtAmount, date, label, now) {
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = roundMoney(Math.abs(Number(signedDebtAmount || 0)));
  if (!amount) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    type: signedDebtAmount > 0 ? "expense" : "income",
    title: `${formatPaymentAccountName(account)} ${label}`.slice(0, 60),
    amount,
    category: "Kart borcu düzeltmesi",
    paymentMethod: "credit_card",
    paymentAccountId: account.id,
    transferAccountId: "",
    transferFee: 0,
    date,
    note: "Kart formundaki borç tutarını görünür hareketlerle eşitlemek için oluşturuldu.",
    transactionAt: buildTransactionDateTime(date, getTurkeyNowTime()),
    createdAt: now,
    updatedAt: now,
  };
}

// ACIKLAMA: buildCreditCardDebtAdjustments fonksiyonunun Turkce karsiligi "olustur alacak kart debt adjustments"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildCreditCardDebtAdjustments(account, requestedTotalDebt, requestedStatementDebt, totals, now) {
  // ACIKLAMA: targetTotalDebt degiskeninin Turkce karsiligi "hedef toplam debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetTotalDebt = Math.max(0, roundMoney(Number(requestedTotalDebt || 0)));
  // ACIKLAMA: targetStatementDebt degiskeninin Turkce karsiligi "hedef statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetStatementDebt = clampCreditCardStatementDebt(targetTotalDebt, requestedStatementDebt);
  // ACIKLAMA: existingTotalEffect degiskeninin Turkce karsiligi "existing toplam effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingTotalEffect = roundMoney(Number(totals?.totalDebtEffect || 0));
  // ACIKLAMA: existingStatementEffect degiskeninin Turkce karsiligi "existing statement effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingStatementEffect = roundMoney(Number(totals?.statementDebtEffect || 0));
  // ACIKLAMA: statementAdjustment degiskeninin Turkce karsiligi "statement adjustment"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementAdjustment = roundMoney(targetStatementDebt - existingStatementEffect);
  // ACIKLAMA: previousAdjustment degiskeninin Turkce karsiligi "previous adjustment"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousAdjustment = roundMoney(
    targetTotalDebt - (existingTotalEffect + statementAdjustment)
  );
  // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const period = getCreditCardStatementPeriod(account);
  // ACIKLAMA: currentDate degiskeninin Turkce karsiligi "mevcut tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentDate = getTurkeyTodayISO();
  // ACIKLAMA: previousDate degiskeninin Turkce karsiligi "previous tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousDate = period.start ? shiftIsoDate(period.start, -1) : currentDate;

  return [
    createCreditCardDebtAdjustment(account, previousAdjustment, previousDate, "önceki dönem borç düzeltmesi", now),
    createCreditCardDebtAdjustment(account, statementAdjustment, currentDate, "aktif dönem borç düzeltmesi", now),
  ].filter(Boolean);
}

// ACIKLAMA: addPaymentAccount fonksiyonunun Turkce karsiligi "add odeme hesap"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function addPaymentAccount(event) {
  event.preventDefault();

  // ACIKLAMA: formData degiskeninin Turkce karsiligi "form veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const formData = new FormData(paymentAccountForm);
  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = normalizePaymentAccountType(formData.get("paymentAccountType"));
  // ACIKLAMA: name degiskeninin Turkce karsiligi "adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const name = String(formData.get("paymentAccountName") || "").trim();
  // ACIKLAMA: bank degiskeninin Turkce karsiligi "banka"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const bank = String(formData.get("paymentAccountBank") || "").trim();
  // ACIKLAMA: color degiskeninin Turkce karsiligi "color"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const color = normalizePaymentCardColor(formData.get("paymentAccountColor"), type);
  // ACIKLAMA: last4 degiskeninin Turkce karsiligi "last4"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const last4 = String(formData.get("paymentAccountLast4") || "").replace(/\D/g, "").slice(-4);
  // ACIKLAMA: balanceOrDebt degiskeninin Turkce karsiligi "bakiye or debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balanceOrDebt = readSignedNumber(formData.get("paymentAccountBalance"), 0);
  // ACIKLAMA: statementDebtRaw degiskeninin Turkce karsiligi "statement debt ham"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDebtRaw = String(formData.get("paymentAccountCurrentStatementDebt") || "").trim();
  // ACIKLAMA: limit degiskeninin Turkce karsiligi "limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limit = readSignedNumber(formData.get("paymentAccountLimit"), 0);
  // ACIKLAMA: statementDay degiskeninin Turkce karsiligi "statement gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDay = clampDay(formData.get("paymentAccountStatementDay"));
  // ACIKLAMA: dueDay degiskeninin Turkce karsiligi "due gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dueDay = clampDay(formData.get("paymentAccountDueDay"));
  // ACIKLAMA: wasEditing degiskeninin Turkce karsiligi "was editing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const wasEditing = Boolean(editingPaymentAccountId);
  // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existing = editingPaymentAccountId
    ? paymentAccounts.find((item) => item.id === editingPaymentAccountId)
    : null;

  if (!name) {
    // ACIKLAMA: statusTarget degiskeninin Turkce karsiligi "durum hedef"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const statusTarget = paymentAccountModalStatus || paymentAccountStatus;
    if (statusTarget) {
      statusTarget.textContent = "Kart veya hesap adı boş olamaz.";
    }
    paymentAccountName.focus();
    return;
  }

  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();
  // ACIKLAMA: nextAccountId degiskeninin Turkce karsiligi "sonraki hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextAccountId = editingPaymentAccountId || crypto.randomUUID();
  // ACIKLAMA: draftCreditAccount degiskeninin Turkce karsiligi "taslak alacak hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const draftCreditAccount = {
    ...(existing || {}),
    id: nextAccountId,
    type: "credit_card",
    statementDay: type === "credit_card" ? statementDay : existing?.statementDay,
  };
  // ACIKLAMA: accountRecordTotals degiskeninin Turkce karsiligi "hesap kayit totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountRecordTotals = wasEditing ? getPaymentAccountRecordTotals(nextAccountId) : { net: 0 };
  // ACIKLAMA: cardRecordTotals degiskeninin Turkce karsiligi "kart kayit totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cardRecordTotals = wasEditing
    ? getCreditCardRecordTotals(draftCreditAccount)
    : { totalDebt: 0, currentStatementDebt: 0, totalDebtEffect: 0, statementDebtEffect: 0 };
  // ACIKLAMA: requestedBalanceOrDebt degiskeninin Turkce karsiligi "requested bakiye or debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const requestedBalanceOrDebt = Number.isFinite(balanceOrDebt) ? roundMoney(balanceOrDebt) : 0;
  // ACIKLAMA: requestedCurrentStatementDebt degiskeninin Turkce karsiligi "requested mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const requestedCurrentStatementDebt = type === "credit_card"
    ? Math.min(
        Math.max(
          0,
          roundMoney(
            statementDebtRaw
              ? readSignedNumber(statementDebtRaw, 0)
              : Number(existing?.currentStatementDebt || 0)
          )
        ),
        Math.max(0, requestedBalanceOrDebt)
      )
    : 0;
  // ACIKLAMA: openingBalance degiskeninin Turkce karsiligi "opening bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingBalance = type !== "credit_card" ? roundMoney(requestedBalanceOrDebt - Number(accountRecordTotals.net || 0)) : 0;
  // ACIKLAMA: nextAccount degiskeninin Turkce karsiligi "sonraki hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    currentStatementDebt: requestedCurrentStatementDebt,
    openingDebt: 0,
    openingCurrentStatementDebt: 0,
    debtBaselineVersion: type === "credit_card" ? 3 : 0,
    creditPaidTotal: 0,
    currentStatementPaidTotal: 0,
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

  // ACIKLAMA: debtAdjustments degiskeninin Turkce karsiligi "debt adjustments"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debtAdjustments = type === "credit_card"
    ? buildCreditCardDebtAdjustments(
        nextAccount,
        requestedBalanceOrDebt,
        requestedCurrentStatementDebt,
        cardRecordTotals,
        now
      )
    : [];

  if (debtAdjustments.length) {
    transactions = [...debtAdjustments, ...transactions].sort(compareTransactionsNewestFirst);
    persistTransactions({ cloudUpserts: debtAdjustments }).catch((error) => {
      if (paymentAccountStatus) {
        paymentAccountStatus.textContent = `Kart borcu düzeltme kayıtları Firebase'e yazılamadı: ${error.message}`;
      }
    });
  }

  if (type === "credit_card") {
    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
  }
  persistPaymentAccounts();
  closePaymentAccountModal({ keepStatus: true });
  paymentAccountStatus.textContent = wasEditing ? "Kart / hesap güncellendi." : "Kart / hesap eklendi.";
  render();
}

// ACIKLAMA: openPaymentAccountModal fonksiyonunun Turkce karsiligi "ac odeme hesap pencere"; ilgili pencereyi veya ekrani acar.
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
  if (paymentAccountCurrentStatementDebt) {
    paymentAccountCurrentStatementDebt.value =
      item?.type === "credit_card" && Number(item.currentStatementDebt || 0) > 0
        ? Number(item.currentStatementDebt)
        : "";
  }
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

// ACIKLAMA: closePaymentAccountModal fonksiyonunun Turkce karsiligi "kapat odeme hesap pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: resetPaymentAccountForm fonksiyonunun Turkce karsiligi "sifirla odeme hesap form"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: openPaymentAccountDeleteModal fonksiyonunun Turkce karsiligi "ac odeme hesap sil pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closePaymentAccountDeleteModal fonksiyonunun Turkce karsiligi "kapat odeme hesap sil pencere"; ilgili pencereyi veya ekrani kapatir.
function closePaymentAccountDeleteModal() {
  deletingPaymentAccountId = "";

  if (confirmPaymentAccountDeleteStatus) {
    confirmPaymentAccountDeleteStatus.textContent = "";
  }

  if (confirmPaymentAccountDeleteModal) {
    confirmPaymentAccountDeleteModal.hidden = true;
  }
}

// ACIKLAMA: deletePaymentAccountAfterConfirmation fonksiyonunun Turkce karsiligi "sil odeme hesap sonrasi confirmation"; secilen kaydi siler veya listeden kaldirir.
function deletePaymentAccountAfterConfirmation() {
  // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const item = paymentAccounts.find((account) => account.id === deletingPaymentAccountId);

  if (!item) {
    if (confirmPaymentAccountDeleteStatus) {
      confirmPaymentAccountDeleteStatus.textContent = "Silinecek kart / hesap bulunamadı.";
    }
    return;
  }

  paymentAccounts = paymentAccounts.filter((account) => account.id !== item.id);
  // ACIKLAMA: updatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const updatedTransactions = [];
  transactions = transactions.map((transaction) =>
    transaction.paymentAccountId === item.id || transaction.transferAccountId === item.id
      ? (() => {
          // ACIKLAMA: updatedTransaction degiskeninin Turkce karsiligi "updated islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
          const updatedTransaction = {
          ...transaction,
          paymentAccountId: transaction.paymentAccountId === item.id ? "" : transaction.paymentAccountId,
          transferAccountId: transaction.transferAccountId === item.id ? "" : transaction.transferAccountId,
          updatedAt: getTurkeyNowDateTime(),
        };
          updatedTransactions.push(updatedTransaction);
          return updatedTransaction;
        })()
      : transaction
  );
  persistPaymentAccounts();
  persistTransactions({ cloudUpserts: updatedTransactions });
  closePaymentAccountDeleteModal();
  paymentAccountStatus.textContent = `${formatPaymentAccountName(item)} silindi.`;
  render();
}

// ACIKLAMA: updatePaymentAccountFormVisibility fonksiyonunun Turkce karsiligi "guncelle odeme hesap form gorunurluk"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updatePaymentAccountFormVisibility() {
  if (!paymentAccountForm || !paymentAccountType) {
    return;
  }

  // ACIKLAMA: isCreditCard degiskeninin Turkce karsiligi "mi alacak kart"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isCreditCard = paymentAccountType.value === "credit_card";
  paymentAccountForm.querySelectorAll(".credit-only").forEach((element) => {
    element.hidden = !isCreditCard;
  });

  if (paymentAccountBalance) {
    paymentAccountBalance.placeholder = isCreditCard
      ? "Mevcut toplam kredi kartı borcu"
      : "Mevcut nakit / banka bakiyesi";
  }

  if (paymentAccountCurrentStatementDebt) {
    paymentAccountCurrentStatementDebt.disabled = !isCreditCard;
  }

  if (paymentAccountColor && !editingPaymentAccountId && !paymentAccountColor.value) {
    paymentAccountColor.value = normalizePaymentCardColor("", paymentAccountType.value);
  }
}


// ACIKLAMA: getPaymentAccountRelatedTransactions fonksiyonunun Turkce karsiligi "al odeme hesap related islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountRelatedTransactions(accountId, sourceTransactions = transactions) {
  // ACIKLAMA: normalizedAccountId degiskeninin Turkce karsiligi "normalized hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: markPaymentAccountRecordsFilterInteraction fonksiyonunun Turkce karsiligi "mark odeme hesap kayitlar filtre interaction"; ilgili uygulama islemini calistirir.
function markPaymentAccountRecordsFilterInteraction(active, delay = 0) {
  if (paymentAccountRecordsInteractionTimer) {
    clearTimeout(paymentAccountRecordsInteractionTimer);
    paymentAccountRecordsInteractionTimer = null;
  }

  if (active) {
    isPaymentAccountRecordsFilterInteracting = true;
    return;
  }

  if (delay > 0) {
    paymentAccountRecordsInteractionTimer = setTimeout(() => {
      isPaymentAccountRecordsFilterInteracting = false;
      paymentAccountRecordsInteractionTimer = null;
    }, delay);
    return;
  }

  isPaymentAccountRecordsFilterInteracting = false;
}

// ACIKLAMA: renderPaymentAccountRecordsModalContent fonksiyonunun Turkce karsiligi "ekrana bas odeme hesap kayitlar pencere icerik"; ilgili ekran, liste veya kartlari ekrana basar.
function renderPaymentAccountRecordsModalContent(account, options = {}) {
  if (!account) {
    return;
  }

  const { rebuildFilter = true } = options;
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(account.id || "");
  // ACIKLAMA: relatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId);
  // ACIKLAMA: periodOptions degiskeninin Turkce karsiligi "period options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodOptions = buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions);
  // ACIKLAMA: defaultPeriod degiskeninin Turkce karsiligi "default period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const defaultPeriod = periodOptions[0]?.value || "all";
  viewingPaymentAccountRecordsPeriod = periodOptions.some((item) => item.value === viewingPaymentAccountRecordsPeriod)
    ? viewingPaymentAccountRecordsPeriod
    : defaultPeriod;
  // ACIKLAMA: visibleTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const visibleTransactions = filterPaymentAccountRecordsByPeriod(account, relatedTransactions, viewingPaymentAccountRecordsPeriod);
  // ACIKLAMA: visibleTotals degiskeninin Turkce karsiligi "gorunur totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const visibleTotals = getPaymentAccountRecordTotals(account.id, visibleTransactions);

  if (paymentAccountRecordsTitle) {
    paymentAccountRecordsTitle.textContent = `${formatPaymentAccountName(account)} kayıtları`;
  }

  if (paymentAccountRecordsPeriodFilter && rebuildFilter) {
    // ACIKLAMA: existingValue degiskeninin Turkce karsiligi "existing deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const existingValue = paymentAccountRecordsPeriodFilter.value || viewingPaymentAccountRecordsPeriod;
    paymentAccountRecordsPeriodFilter.innerHTML = "";
    periodOptions.forEach((item) => {
      // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      paymentAccountRecordsPeriodFilter.append(option);
    });
    // ACIKLAMA: nextValue degiskeninin Turkce karsiligi "sonraki deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const nextValue = periodOptions.some((item) => item.value === existingValue) ? existingValue : viewingPaymentAccountRecordsPeriod;
    paymentAccountRecordsPeriodFilter.value = nextValue;
    viewingPaymentAccountRecordsPeriod = paymentAccountRecordsPeriodFilter.value || defaultPeriod;
  }

  if (paymentAccountRecordsSummary) {
    if (account.type === "credit_card") {
      // ACIKLAMA: cardTotals degiskeninin Turkce karsiligi "kart totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cardTotals = getCreditCardRecordTotals(account);
      // ACIKLAMA: periodLabel degiskeninin Turkce karsiligi "period etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const periodLabel = periodOptions.find((item) => item.value === viewingPaymentAccountRecordsPeriod)?.label || "Seçili dönem";
      // ACIKLAMA: activePeriodValue degiskeninin Turkce karsiligi "aktif period deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const activePeriodValue = `statement:${cardTotals.period.key}`;
      // ACIKLAMA: selectedPeriodDebtEffect degiskeninin Turkce karsiligi "selected period debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const selectedPeriodDebtEffect = visibleTransactions.reduce(
        (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
        0
      );
      // ACIKLAMA: selectedPeriodPaid degiskeninin Turkce karsiligi "selected period paid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const selectedPeriodPaid = visibleTransactions.reduce(
        (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
        0
      );
      // ACIKLAMA: displayedTotalDebt degiskeninin Turkce karsiligi "displayed toplam debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const displayedTotalDebt = Number.isFinite(Number(account.debt))
        ? Math.max(0, roundMoney(Number(account.debt)))
        : Math.max(0, roundMoney(cardTotals.totalDebt));
      // ACIKLAMA: showingActiveDebt degiskeninin Turkce karsiligi "showing aktif debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const showingActiveDebt =
        viewingPaymentAccountRecordsPeriod === "all" ||
        viewingPaymentAccountRecordsPeriod === activePeriodValue;
      // ACIKLAMA: activeStatementDebt degiskeninin Turkce karsiligi "aktif statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const activeStatementDebt = getActiveCreditCardStatementDebt(account);
      // ACIKLAMA: selectedPeriodDebt degiskeninin Turkce karsiligi "selected period debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const selectedPeriodDebt = showingActiveDebt
        ? clampCreditCardStatementDebt(displayedTotalDebt, activeStatementDebt)
        : Math.max(0, roundMoney(selectedPeriodDebtEffect - selectedPeriodPaid));
      // ACIKLAMA: periodDebtLabel degiskeninin Turkce karsiligi "period debt etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const periodDebtLabel = showingActiveDebt ? "Aktif dönem borcu" : "Seçili dönem net borcu";
      paymentAccountRecordsSummary.textContent =
        `${periodLabel}: ${visibleTransactions.length} kayıt · ${periodDebtLabel} ${currency.format(selectedPeriodDebt)} · Toplam borç ${currency.format(displayedTotalDebt)} · Karta gelen transferler ${currency.format(selectedPeriodPaid)}`;
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
        // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const row = document.createElement("article");
        row.className = "transaction-item account-record-item";

        // ACIKLAMA: info degiskeninin Turkce karsiligi "info"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const info = document.createElement("div");
        // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const title = document.createElement("p");
        title.className = "transaction-title";
        title.textContent = transaction.title;

        // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const meta = document.createElement("p");
        meta.className = "transaction-meta";
        meta.textContent = `${formatTransactionDateTime(transaction)} · ${transaction.category} · ${getTransactionPaymentInfo(transaction)}${transaction.note ? ` · ${transaction.note}` : ""}`;
        info.append(title, meta);

        // ACIKLAMA: side degiskeninin Turkce karsiligi "side"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const side = document.createElement("div");
        side.className = "transaction-side";
        // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const amount = document.createElement("strong");
        // ACIKLAMA: effect degiskeninin Turkce karsiligi "effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const effect = getTransactionPaymentAccountEffect(transaction, accountId);
        // ACIKLAMA: displayType degiskeninin Turkce karsiligi "display tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
}

// ACIKLAMA: openPaymentAccountRecordsModal fonksiyonunun Turkce karsiligi "ac odeme hesap kayitlar pencere"; ilgili pencereyi veya ekrani acar.
function openPaymentAccountRecordsModal(account, options = {}) {
  if (!paymentAccountRecordsModal || !account) {
    return;
  }

  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(account.id || "");
  // ACIKLAMA: accountChanged degiskeninin Turkce karsiligi "hesap changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountChanged = viewingPaymentAccountRecordsId !== accountId;
  viewingPaymentAccountRecordsId = accountId;

  // ACIKLAMA: relatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId);
  // ACIKLAMA: periodOptions degiskeninin Turkce karsiligi "period options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodOptions = buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions);
  // ACIKLAMA: defaultPeriod degiskeninin Turkce karsiligi "default period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const defaultPeriod = periodOptions[0]?.value || "all";
  // ACIKLAMA: currentPeriod degiskeninin Turkce karsiligi "mevcut period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentPeriod = !options.preservePeriod || accountChanged
    ? defaultPeriod
    : viewingPaymentAccountRecordsPeriod || defaultPeriod;
  viewingPaymentAccountRecordsPeriod = periodOptions.some((item) => item.value === currentPeriod)
    ? currentPeriod
    : defaultPeriod;

  renderPaymentAccountRecordsModalContent(account, { rebuildFilter: true });
  paymentAccountRecordsModal.hidden = false;
}

// ACIKLAMA: buildPaymentAccountRecordsPeriodOptions fonksiyonunun Turkce karsiligi "olustur odeme hesap kayitlar period options"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions = []) {
  if (account.type === "credit_card") {
    // ACIKLAMA: activePeriod degiskeninin Turkce karsiligi "aktif period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const activePeriod = getCreditCardStatementPeriod(account);
    // ACIKLAMA: periodMap degiskeninin Turkce karsiligi "period esleme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const period = getCreditCardStatementPeriod(account, transaction.date);
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: options degiskeninin Turkce karsiligi "options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const options = Array.from(periodMap.values()).sort((first, second) => second.time - first.time);
    return [{ value: "all", label: "Tüm dönemler" }, ...options];
  }

  // ACIKLAMA: currentMonth degiskeninin Turkce karsiligi "mevcut ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentMonth = getTurkeyTodayISO().slice(0, 7);
  // ACIKLAMA: months degiskeninin Turkce karsiligi "months"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const months = new Set([currentMonth]);
  relatedTransactions.forEach((transaction) => {
    // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const month = String(transaction.date || "").slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(month)) {
      months.add(month);
    }
  });

  // ACIKLAMA: monthOptions degiskeninin Turkce karsiligi "ay options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthOptions = Array.from(months)
    .sort((first, second) => second.localeCompare(first))
    .map((month) => ({
      value: `month:${month}`,
      label: formatMonthLabel(month),
      month,
    }));

  return [{ value: "all", label: "Tüm zamanlar" }, ...monthOptions];
}

// ACIKLAMA: filterPaymentAccountRecordsByPeriod fonksiyonunun Turkce karsiligi "filtre odeme hesap kayitlar tarafindan period"; ilgili uygulama islemini calistirir.
function filterPaymentAccountRecordsByPeriod(account, relatedTransactions = [], periodValue = "all") {
  if (periodValue === "all") {
    return relatedTransactions;
  }

  if (account.type === "credit_card" && periodValue.startsWith("statement:")) {
    const [, key] = periodValue.split(":");
    const [start, end] = String(key || "").split("_");
    return relatedTransactions.filter((transaction) => {
      // ACIKLAMA: transactionDate degiskeninin Turkce karsiligi "islem tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const transactionDate = String(transaction.date || "");
      return transactionDate && (!start || transactionDate >= start) && (!end || transactionDate <= end);
    });
  }

  if (periodValue.startsWith("month:")) {
    // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const month = periodValue.slice("month:".length);
    return relatedTransactions.filter((transaction) => String(transaction.date || "").startsWith(month));
  }

  return relatedTransactions;
}

// ACIKLAMA: formatMonthLabel fonksiyonunun Turkce karsiligi "bicimlendir ay etiket"; degeri ekranda okunur bicime cevirir.
function formatMonthLabel(monthKey = "") {
  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = new Date(`${monthKey}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Seçili ay";
  }

  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(date);
}

// ACIKLAMA: closePaymentAccountRecordsModal fonksiyonunun Turkce karsiligi "kapat odeme hesap kayitlar pencere"; ilgili pencereyi veya ekrani kapatir.
function closePaymentAccountRecordsModal() {
  viewingPaymentAccountRecordsId = "";
  viewingPaymentAccountRecordsPeriod = "";
  markPaymentAccountRecordsFilterInteraction(false);

  if (paymentAccountRecordsModal) {
    paymentAccountRecordsModal.hidden = true;
  }

  if (paymentAccountRecordsList) {
    paymentAccountRecordsList.innerHTML = "";
  }
}

// ACIKLAMA: getPaymentAccountRecordTotals fonksiyonunun Turkce karsiligi "al odeme hesap kayit totals"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountRecordTotals(accountId, sourceTransactions = transactions) {
  // ACIKLAMA: relatedEffects degiskeninin Turkce karsiligi "related effects"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const relatedEffects = sourceTransactions
    .map((transaction) => ({
      transaction,
      effect: getTransactionPaymentAccountEffect(transaction, accountId),
    }))
    .filter((item) => item.effect !== 0);
  // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const income = relatedEffects
    .filter((item) => item.effect > 0)
    .reduce((sum, item) => sum + item.effect, 0);
  // ACIKLAMA: expense degiskeninin Turkce karsiligi "gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: formatPaymentAccountRecordEffectText fonksiyonunun Turkce karsiligi "bicimlendir odeme hesap kayit effect metin"; degeri ekranda okunur bicime cevirir.
function formatPaymentAccountRecordEffectText(transaction, accountId, effect) {
  // ACIKLAMA: signedEffect degiskeninin Turkce karsiligi "isaretli effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const signedEffect = Number(effect || 0);
  // ACIKLAMA: sign degiskeninin Turkce karsiligi "isaret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sign = signedEffect >= 0 ? "+" : "-";
  // ACIKLAMA: amountText degiskeninin Turkce karsiligi "tutar metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountText = currency.format(Math.abs(signedEffect || Number(transaction?.amount || 0)));

  if (transaction?.type !== "transfer") {
    return `${sign} ${amountText}`;
  }

  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(accountId || "");
  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(transaction.paymentAccountId || "");
  // ACIKLAMA: receiverId degiskeninin Turkce karsiligi "receiver kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const receiverId = String(transaction.transferAccountId || "");
  // ACIKLAMA: isSender degiskeninin Turkce karsiligi "mi sender"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isSender = sourceId && sourceId === targetId;
  // ACIKLAMA: isReceiver degiskeninin Turkce karsiligi "mi receiver"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isReceiver = receiverId && receiverId === targetId && receiverId !== sourceId;
  // ACIKLAMA: directionText degiskeninin Turkce karsiligi "direction metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const directionText = isSender ? "Transfer çıkışı" : isReceiver ? "Transfer girişi" : "Transfer";

  return `${sign} ${amountText} · ${directionText}`;
}

// ACIKLAMA: getPaymentAccountOpeningBalanceForRefresh fonksiyonunun Turkce karsiligi "al odeme hesap opening bakiye icin yenile"; ilgili pencereyi veya ekrani acar.
function getPaymentAccountOpeningBalanceForRefresh(account) {
  return hasStoredMoneyValue(account?.openingBalance) ? Number(account.openingBalance) : 0;
}

// ACIKLAMA: getPaymentAccountOpeningDebtForRefresh fonksiyonunun Turkce karsiligi "al odeme hesap opening debt icin yenile"; ilgili pencereyi veya ekrani acar.
function getPaymentAccountOpeningDebtForRefresh(account) {
  return hasStoredMoneyValue(account?.openingDebt) ? Number(account.openingDebt) : 0;
}

// ACIKLAMA: getPaymentAccountOpeningStatementDebtForRefresh fonksiyonunun Turkce karsiligi "al odeme hesap opening statement debt icin yenile"; ilgili pencereyi veya ekrani acar.
function getPaymentAccountOpeningStatementDebtForRefresh(account) {
  return hasStoredMoneyValue(account?.openingCurrentStatementDebt) ? Number(account.openingCurrentStatementDebt) : 0;
}

// ACIKLAMA: getTransactionPaymentAccountEffect fonksiyonunun Turkce karsiligi "al islem odeme hesap effect"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionPaymentAccountEffect(transaction, accountId) {
  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(accountId || "");
  // ACIKLAMA: primaryId degiskeninin Turkce karsiligi "primary kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const primaryId = String(transaction?.paymentAccountId || "");
  // ACIKLAMA: transferId degiskeninin Turkce karsiligi "aktarim kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferId = String(transaction?.transferAccountId || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transaction?.amount || 0);
  // ACIKLAMA: transferFee degiskeninin Turkce karsiligi "aktarim ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferFee = Math.max(0, Number(transaction?.transferFee || 0));

  if (!targetId || !Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  // ACIKLAMA: effect degiskeninin Turkce karsiligi "effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getCreditCardStatementPeriod fonksiyonunun Turkce karsiligi "al alacak kart statement period"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardStatementPeriod(account, referenceDate = getTurkeyTodayISO()) {
  // ACIKLAMA: statementDay degiskeninin Turkce karsiligi "statement gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDay = Number(account?.statementDay || 0);
  // ACIKLAMA: ref degiskeninin Turkce karsiligi "ref"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const ref = new Date(`${referenceDate || getTurkeyTodayISO()}T00:00:00`);

  if (!statementDay || Number.isNaN(ref.getTime())) {
    return { start: "", end: "", key: "all" };
  }

  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = ref.getFullYear();
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = ref.getMonth();
  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = ref.getDate();
  // ACIKLAMA: startMonth degiskeninin Turkce karsiligi "baslangic ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const startMonth = day > statementDay ? month : month - 1;
  // ACIKLAMA: endMonth degiskeninin Turkce karsiligi "bitis ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const endMonth = day > statementDay ? month + 1 : month;
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = new Date(year, startMonth, clampMonthDay(year, startMonth, statementDay) + 1);
  // ACIKLAMA: end degiskeninin Turkce karsiligi "bitis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const end = new Date(year, endMonth, clampMonthDay(year, endMonth, statementDay));

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
    key: `${toDateInputValue(start)}_${toDateInputValue(end)}`,
  };
}

// ACIKLAMA: clampMonthDay fonksiyonunun Turkce karsiligi "clamp ay gun"; ilgili uygulama islemini calistirir.
function clampMonthDay(year, monthIndex, day) {
  return Math.min(Math.max(1, Number(day || 1)), new Date(year, monthIndex + 1, 0).getDate());
}

// ACIKLAMA: toDateInputValue fonksiyonunun Turkce karsiligi "ile tarih giris alani deger"; ilgili uygulama islemini calistirir.
function toDateInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = date.getFullYear();
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = String(date.getMonth() + 1).padStart(2, "0");
  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ACIKLAMA: getActiveCreditCardStatementDebt fonksiyonunun Turkce karsiligi "al aktif alacak kart statement debt"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getActiveCreditCardStatementDebt(account, sourceTransactions = transactions) {
  if (!account || account.type !== "credit_card") {
    return 0;
  }

  // ACIKLAMA: totals degiskeninin Turkce karsiligi "totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totals = getCreditCardRecordTotals(account, sourceTransactions);
  return clampCreditCardStatementDebt(totals.totalDebt, totals.currentStatementDebt);
}

// ACIKLAMA: getCreditCardRecordTotals fonksiyonunun Turkce karsiligi "al alacak kart kayit totals"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardRecordTotals(account, sourceTransactions = transactions) {
  // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const period = getCreditCardStatementPeriod(account);
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(account.id || "");
  // ACIKLAMA: relatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId, sourceTransactions);
  // ACIKLAMA: all degiskeninin Turkce karsiligi "tum"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const all = getPaymentAccountRecordTotals(account.id, relatedTransactions);
  // ACIKLAMA: periodTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const periodTransactions = relatedTransactions.filter((transaction) => isTransactionInStatementPeriod(transaction, period));
  // ACIKLAMA: previousPeriodTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const previousPeriodTransactions = relatedTransactions.filter((transaction) => {
    // ACIKLAMA: transactionDate degiskeninin Turkce karsiligi "islem tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const transactionDate = String(transaction?.date || "");
    return Boolean(transactionDate && period?.start && transactionDate < period.start);
  });

  // ACIKLAMA: allDebtEffect degiskeninin Turkce karsiligi "tum debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allDebtEffect = relatedTransactions.reduce(
    (sum, transaction) => sum + getCreditCardTransactionDebtEffect(transaction, accountId),
    0
  );
  // ACIKLAMA: periodDebtEffect degiskeninin Turkce karsiligi "period debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodDebtEffect = periodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
    0
  );
  // ACIKLAMA: previousPeriodDebtEffect degiskeninin Turkce karsiligi "previous period debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousPeriodDebtEffect = previousPeriodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
    0
  );
  // ACIKLAMA: periodIncome degiskeninin Turkce karsiligi "period gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodIncome = periodTransactions
    .filter((transaction) => getCreditCardStatementDebtEffect(transaction, accountId) < 0)
    .reduce((sum, transaction) => sum + Math.abs(getCreditCardStatementDebtEffect(transaction, accountId)), 0);
  // ACIKLAMA: periodExpense degiskeninin Turkce karsiligi "period gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodExpense = periodTransactions
    .filter((transaction) => getCreditCardStatementDebtEffect(transaction, accountId) > 0)
    .reduce((sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId), 0);
  // ACIKLAMA: recordedTotalPaid degiskeninin Turkce karsiligi "recorded toplam paid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const recordedTotalPaid = relatedTransactions.reduce(
    (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
    0
  );
  // ACIKLAMA: recordedPeriodPaid degiskeninin Turkce karsiligi "recorded period paid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const recordedPeriodPaid = periodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
    0
  );

  // ACIKLAMA: totalDebtEffect degiskeninin Turkce karsiligi "toplam debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalDebtEffect = roundMoney(allDebtEffect);
  // ACIKLAMA: statementDebtEffect degiskeninin Turkce karsiligi "statement debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDebtEffect = roundMoney(periodDebtEffect);
  // ACIKLAMA: previousStatementDebtEffect degiskeninin Turkce karsiligi "previous statement debt effect"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousStatementDebtEffect = Math.max(0, roundMoney(previousPeriodDebtEffect));
  // ACIKLAMA: totalPaid degiskeninin Turkce karsiligi "toplam paid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalPaid = roundMoney(recordedTotalPaid);
  // ACIKLAMA: periodPaid degiskeninin Turkce karsiligi "period paid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const periodPaid = roundMoney(recordedPeriodPaid);

  // ACIKLAMA: v227 fonksiyonunun Turkce karsiligi "v227"; ilgili uygulama islemini calistirir.
  // Toplam ödeme önceki dönem borcunu aşarsa aşan kısım aktif dönem borcundan düşer.
  // Gelecek dönem kayıtları toplam borçta kalır ama aktif dönem borcuna girmez.
  // ACIKLAMA: excessPaymentForActivePeriod degiskeninin Turkce karsiligi "excess odeme icin aktif period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const excessPaymentForActivePeriod = Math.max(0, roundMoney(totalPaid - previousStatementDebtEffect));
  // ACIKLAMA: statementDebtAfterPayments degiskeninin Turkce karsiligi "statement debt sonrasi payments"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDebtAfterPayments = Math.max(0, roundMoney(statementDebtEffect - excessPaymentForActivePeriod));

  // ACIKLAMA: totalDebt degiskeninin Turkce karsiligi "toplam debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totalDebt = Math.max(0, totalDebtEffect);
  // ACIKLAMA: currentStatementDebt degiskeninin Turkce karsiligi "mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentStatementDebt = clampCreditCardStatementDebt(totalDebt, statementDebtAfterPayments);

  return {
    all,
    period,
    periodIncome: roundMoney(periodIncome),
    periodExpense: roundMoney(periodExpense),
    totalPaid: roundMoney(totalPaid),
    periodPaid: roundMoney(periodPaid),
    previousStatementDebtEffect,
    excessPaymentForActivePeriod,
    totalDebtEffect,
    statementDebtEffect,
    statementDebtAfterPayments,
    totalDebt,
    currentStatementDebt,
  };
}

// ACIKLAMA: getCreditCardPaymentRecordAmount fonksiyonunun Turkce karsiligi "al alacak kart odeme kayit tutar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardPaymentRecordAmount(transaction, accountId) {
  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(accountId || "");
  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(transaction?.paymentAccountId || "");
  // ACIKLAMA: transferId degiskeninin Turkce karsiligi "aktarim kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferId = String(transaction?.transferAccountId || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transaction?.amount || 0);

  if (
    !targetId ||
    transaction?.type !== "transfer" ||
    transferId !== targetId ||
    sourceId === transferId ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return 0;
  }

  return roundMoney(amount);
}

// ACIKLAMA: getCreditCardStatementDebtEffect fonksiyonunun Turkce karsiligi "al alacak kart statement debt effect"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardStatementDebtEffect(transaction, accountId) {
  if (getCreditCardPaymentRecordAmount(transaction, accountId) > 0) {
    return 0;
  }

  return getCreditCardTransactionDebtEffect(transaction, accountId);
}

// ACIKLAMA: clampCreditCardStatementDebt fonksiyonunun Turkce karsiligi "clamp alacak kart statement debt"; ilgili uygulama islemini calistirir.
function clampCreditCardStatementDebt(totalDebt, currentStatementDebt) {
  // ACIKLAMA: normalizedTotalDebt degiskeninin Turkce karsiligi "normalized toplam debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedTotalDebt = Math.max(0, roundMoney(Number(totalDebt || 0)));
  // ACIKLAMA: normalizedStatementDebt degiskeninin Turkce karsiligi "normalized statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedStatementDebt = Math.max(0, roundMoney(Number(currentStatementDebt || 0)));
  return Math.min(normalizedStatementDebt, normalizedTotalDebt);
}

// ACIKLAMA: getCreditCardTransactionDebtEffect fonksiyonunun Turkce karsiligi "al alacak kart islem debt effect"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardTransactionDebtEffect(transaction, accountId) {
  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(accountId || "");
  // ACIKLAMA: primaryId degiskeninin Turkce karsiligi "primary kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const primaryId = String(transaction?.paymentAccountId || "");
  // ACIKLAMA: transferId degiskeninin Turkce karsiligi "aktarim kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferId = String(transaction?.transferAccountId || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transaction?.amount || 0);
  // ACIKLAMA: transferFee degiskeninin Turkce karsiligi "aktarim ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isTransactionInStatementPeriod fonksiyonunun Turkce karsiligi "mi islem in statement period"; ilgili uygulama islemini calistirir.
function isTransactionInStatementPeriod(transaction, period) {
  // ACIKLAMA: transactionDate degiskeninin Turkce karsiligi "islem tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionDate = String(transaction?.date || "");
  return Boolean(
    transactionDate &&
    (!period?.start || transactionDate >= period.start) &&
    (!period?.end || transactionDate <= period.end)
  );
}

// ACIKLAMA: hasStoredMoneyValue fonksiyonunun Turkce karsiligi "var mi stored para deger"; ilgili uygulama islemini calistirir.
function hasStoredMoneyValue(value) {
  return value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value));
}

// ACIKLAMA: refreshPaymentAccountFromRecords fonksiyonunun Turkce karsiligi "yenile odeme hesap kaynakli kayitlar"; ilgili uygulama islemini calistirir.
function refreshPaymentAccountFromRecords(accountId) {
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = paymentAccounts.find((item) => String(item.id || "") === String(accountId || ""));

  if (!account) {
    paymentAccountStatus.textContent = "Güncellenecek kart veya hesap bulunamadı.";
    return;
  }

  // ACIKLAMA: allRelatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const allRelatedTransactions = getPaymentAccountRelatedTransactions(account.id, transactions);
  // ACIKLAMA: totals degiskeninin Turkce karsiligi "totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totals = account.type === "credit_card"
    ? getCreditCardRecordTotals(account, allRelatedTransactions)
    : getPaymentAccountRecordTotals(account.id, allRelatedTransactions);
  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();

  paymentAccounts = paymentAccounts.map((item) => {
    if (item.id !== account.id) {
      return item;
    }

    if (item.type === "credit_card") {
      // ACIKLAMA: nextDebt degiskeninin Turkce karsiligi "sonraki debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const nextDebt = Math.max(0, roundMoney(Number(totals.totalDebt || 0)));
      // ACIKLAMA: nextCurrentStatementDebt degiskeninin Turkce karsiligi "sonraki mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const nextCurrentStatementDebt = clampCreditCardStatementDebt(
        nextDebt,
        Number(totals.currentStatementDebt || 0)
      );

      return {
        ...item,
        openingDebt: 0,
        openingCurrentStatementDebt: 0,
        debtBaselineVersion: 3,
        debt: nextDebt,
        currentStatementDebt: nextCurrentStatementDebt,
        creditPaidTotal: 0,
        currentStatementPaidTotal: 0,
        creditPaidPeriodKey: totals.period.key,
        updatedAt: now,
      };
    }

    // ACIKLAMA: openingBalance degiskeninin Turkce karsiligi "opening bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: refreshedAccount degiskeninin Turkce karsiligi "refreshed hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const refreshedAccount = paymentAccounts.find((item) => item.id === account.id);
  // ACIKLAMA: valueText degiskeninin Turkce karsiligi "deger metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const valueText = refreshedAccount?.type === "credit_card"
    ? `dönem borcu ${currency.format(refreshedAccount.currentStatementDebt || 0)} · toplam borç ${currency.format(refreshedAccount.debt || 0)}`
    : `bakiye ${currency.format(refreshedAccount?.balance || 0)}`;
  paymentAccountStatus.textContent =
    `${formatPaymentAccountName(refreshedAccount || account)} tüm zamanlardaki kayıtlarından yeniden hesaplandı: ${valueText}.`;

  if (!paymentAccountRecordsModal?.hidden && viewingPaymentAccountRecordsId === account.id) {
    if (!isPaymentAccountRecordsFilterInteracting) {
      renderPaymentAccountRecordsModalContent(refreshedAccount || account, { rebuildFilter: true });
    }
  }
}


// ACIKLAMA: buildRefreshedPaymentAccountFromRecords fonksiyonunun Turkce karsiligi "olustur refreshed odeme hesap kaynakli kayitlar"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildRefreshedPaymentAccountFromRecords(item, now = getTurkeyNowDateTime()) {
  if (!item?.id) {
    return item;
  }

  // ACIKLAMA: allRelatedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const allRelatedTransactions = getPaymentAccountRelatedTransactions(item.id, transactions);
  // ACIKLAMA: totals degiskeninin Turkce karsiligi "totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const totals = item.type === "credit_card"
    ? getCreditCardRecordTotals(item, allRelatedTransactions)
    : getPaymentAccountRecordTotals(item.id, allRelatedTransactions);

  if (item.type === "credit_card") {
    // ACIKLAMA: openingDebt degiskeninin Turkce karsiligi "opening debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const openingDebt = 0;
    // ACIKLAMA: openingCurrentStatementDebt degiskeninin Turkce karsiligi "opening mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const openingCurrentStatementDebt = 0;
    // ACIKLAMA: nextDebt degiskeninin Turkce karsiligi "sonraki debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const nextDebt = Math.max(0, roundMoney(Number(totals.totalDebt || 0)));
    // ACIKLAMA: nextCurrentStatementDebt degiskeninin Turkce karsiligi "sonraki mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const nextCurrentStatementDebt = clampCreditCardStatementDebt(
      nextDebt,
      Number(totals.currentStatementDebt || 0)
    );
    // ACIKLAMA: nextPeriodKey degiskeninin Turkce karsiligi "sonraki period anahtar"; ilgili veri veya servis icin anahtar bilgisini tutar.
    const nextPeriodKey = totals.period.key;

    if (
      roundMoney(Number(item.openingDebt || 0)) === openingDebt &&
      roundMoney(Number(item.openingCurrentStatementDebt || 0)) === openingCurrentStatementDebt &&
      Number(item.debtBaselineVersion || 0) >= 3 &&
      roundMoney(Number(item.debt || 0)) === nextDebt &&
      roundMoney(Number(item.currentStatementDebt || 0)) === nextCurrentStatementDebt &&
      roundMoney(Number(item.creditPaidTotal || 0)) === 0 &&
      roundMoney(Number(item.currentStatementPaidTotal || 0)) === 0 &&
      String(item.creditPaidPeriodKey || "") === String(nextPeriodKey || "")
    ) {
      return item;
    }

    return {
      ...item,
      openingDebt,
      openingCurrentStatementDebt,
      debtBaselineVersion: 3,
      debt: nextDebt,
      currentStatementDebt: nextCurrentStatementDebt,
      creditPaidTotal: 0,
      currentStatementPaidTotal: 0,
      creditPaidPeriodKey: nextPeriodKey,
      updatedAt: now,
    };
  }

  // ACIKLAMA: openingBalance degiskeninin Turkce karsiligi "opening bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingBalance = roundMoney(getPaymentAccountOpeningBalanceForRefresh(item));
  // ACIKLAMA: nextBalance degiskeninin Turkce karsiligi "sonraki bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextBalance = roundMoney(openingBalance + Number(totals.net || 0));

  if (
    roundMoney(Number(item.openingBalance || 0)) === openingBalance &&
    roundMoney(Number(item.balance || 0)) === nextBalance
  ) {
    return item;
  }

  return {
    ...item,
    openingBalance,
    balance: nextBalance,
    updatedAt: now,
  };
}

// ACIKLAMA: refreshAllPaymentAccountsFromRecords fonksiyonunun Turkce karsiligi "yenile tum odeme hesaplar kaynakli kayitlar"; ilgili uygulama islemini calistirir.
function refreshAllPaymentAccountsFromRecords(options = {}) {
  const { silent = true, syncCloud = true } = options;

  if (!Array.isArray(paymentAccounts) || !paymentAccounts.length) {
    return false;
  }

  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();
  // ACIKLAMA: changed degiskeninin Turkce karsiligi "changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let changed = false;
  paymentAccounts = paymentAccounts.map((item) => {
    // ACIKLAMA: refreshed degiskeninin Turkce karsiligi "refreshed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const refreshed = buildRefreshedPaymentAccountFromRecords(item, now);
    if (refreshed !== item) {
      changed = true;
    }
    return refreshed;
  });

  if (changed) {
    persistPaymentAccounts({ syncCloud });
  }

  if (!silent && paymentAccountStatus) {
    paymentAccountStatus.textContent = changed
      ? "Kartlar ve hesaplar tüm zamanlardaki kayıtlarına göre otomatik güncellendi."
      : "Kartlar ve hesaplar zaten güncel.";
  }

  if (!paymentAccountRecordsModal?.hidden && viewingPaymentAccountRecordsId && !isPaymentAccountRecordsFilterInteracting) {
    // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const account = paymentAccounts.find((item) => item.id === viewingPaymentAccountRecordsId);
    if (account) {
      renderPaymentAccountRecordsModalContent(account, { rebuildFilter: true });
    }
  }

  return changed;
}

// ACIKLAMA: openPaymentAccountPayModal fonksiyonunun Turkce karsiligi "ac odeme hesap pay pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closePaymentAccountPayModal fonksiyonunun Turkce karsiligi "kapat odeme hesap pay pencere"; ilgili pencereyi veya ekrani kapatir.
function closePaymentAccountPayModal() {
  payingPaymentAccountId = "";
  paymentAccountPayForm?.reset();
  paymentAccountPayStatus.textContent = "";

  if (paymentAccountPayModal) {
    paymentAccountPayModal.hidden = true;
  }
}

// ACIKLAMA: fillPaymentSourceSelect fonksiyonunun Turkce karsiligi "fill odeme kaynak secim alani"; ilgili uygulama islemini calistirir.
function fillPaymentSourceSelect(selectElement) {
  if (!selectElement) {
    return;
  }

  // ACIKLAMA: previousValue degiskeninin Turkce karsiligi "previous deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousValue = selectElement.value;
  // ACIKLAMA: sources degiskeninin Turkce karsiligi "sources"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sources = paymentAccounts.filter((item) => item.type !== "credit_card");
  selectElement.innerHTML = "";

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = sources.length ? "Ödeme kaynağı seç" : "Ödeme için nakit/banka hesabı ekle";
  selectElement.append(emptyOption);

  sources.forEach((item) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${formatPaymentAccountName(item)} · ${currency.format(item.balance || 0)}`;
    selectElement.append(option);
  });

  selectElement.value = sources.some((item) => item.id === previousValue) ? previousValue : "";
}

// ACIKLAMA: payCreditCardDebt fonksiyonunun Turkce karsiligi "pay alacak kart debt"; ilgili uygulama islemini calistirir.
function payCreditCardDebt(event) {
  event.preventDefault();

  // ACIKLAMA: creditAccount degiskeninin Turkce karsiligi "alacak hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const creditAccount = paymentAccounts.find((item) => item.id === payingPaymentAccountId && item.type === "credit_card");
  // ACIKLAMA: sourceAccount degiskeninin Turkce karsiligi "kaynak hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceAccount = paymentAccounts.find((item) => item.id === paymentAccountPaySource.value && item.type !== "credit_card");
  // ACIKLAMA: requestedAmount degiskeninin Turkce karsiligi "requested tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: availableDebt degiskeninin Turkce karsiligi "available debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const availableDebt = Math.max(
    roundMoney(Number(creditAccount.debt || 0)),
    roundMoney(Number(creditAccount.currentStatementDebt || 0))
  );
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Math.min(roundMoney(requestedAmount), availableDebt);
  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();

  if (!amount) {
    paymentAccountPayStatus.textContent = "Bu kredi kartı için ödenecek borç bulunamadı.";
    return;
  }

  // ACIKLAMA: paymentTransaction degiskeninin Turkce karsiligi "odeme islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const paymentTransaction = {
    id: crypto.randomUUID(),
    type: "transfer",
    title: `${formatPaymentAccountName(creditAccount)} Borç Ödemesi`.slice(0, 60),
    amount,
    category: "Kart Ödemesi",
    paymentMethod: "transfer",
    paymentAccountId: sourceAccount.id,
    transferAccountId: creditAccount.id,
    transferFee: 0,
    date: getTurkeyTodayISO(),
    note: `${formatPaymentAccountName(sourceAccount)} → ${formatPaymentAccountName(creditAccount)}`,
    transactionAt: now,
    createdAt: now,
    updatedAt: now,
  };

  if (!validateTransactionPayment(paymentTransaction, paymentAccountPayStatus)) {
    return;
  }

  if (!applyTransactionPaymentEffect(paymentTransaction, 1)) {
    paymentAccountPayStatus.textContent = "Ödeme hesap bakiyelerine işlenemedi.";
    return;
  }

  transactions = [paymentTransaction, ...transactions].sort(compareTransactionsNewestFirst);
  refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
  persistPaymentAccounts();
  persistTransactions({ cloudUpserts: [paymentTransaction] }).catch((error) => {
    paymentAccountPayStatus.textContent = `Ödeme kaydı buluta yazılamadı: ${error.message}`;
  });
  closePaymentAccountPayModal();
  paymentAccountStatus.textContent = `${formatPaymentAccountName(creditAccount)} için ${currency.format(amount)} ödeme kayıtlara eklendi.`;
  render();
}

// ACIKLAMA: validateTransactionPayment fonksiyonunun Turkce karsiligi "validate islem odeme"; ilgili uygulama islemini calistirir.
function validateTransactionPayment(transaction, statusElement = null) {
  // ACIKLAMA: method degiskeninin Turkce karsiligi "yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const method = normalizePaymentMethod(transaction.paymentMethod);
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(transaction.paymentAccountId || "");
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccountId = String(transaction.transferAccountId || "");
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = accountId ? paymentAccounts.find((item) => item.id === accountId) : null;
  // ACIKLAMA: transferAccount degiskeninin Turkce karsiligi "aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: applyTransactionPaymentEffect fonksiyonunun Turkce karsiligi "uygula islem odeme effect"; ilgili uygulama islemini calistirir.
function applyTransactionPaymentEffect(transaction, direction = 1) {
  // ACIKLAMA: accountId degiskeninin Turkce karsiligi "hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountId = String(transaction.paymentAccountId || "");
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccountId = String(transaction.transferAccountId || "");
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(transaction.amount || 0);

  if (!accountId || !Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = paymentAccounts.find((item) => item.id === accountId);

  if (!account) {
    return false;
  }

  // ACIKLAMA: factor degiskeninin Turkce karsiligi "factor"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const factor = direction < 0 ? -1 : 1;
  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();

  if (transaction.type === "transfer") {
    // ACIKLAMA: targetAccount degiskeninin Turkce karsiligi "hedef hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const targetAccount = transferAccountId
      ? paymentAccounts.find((item) => item.id === transferAccountId && item.id !== account.id)
      : null;

    if (!targetAccount) {
      return false;
    }

    // ACIKLAMA: transferFee degiskeninin Turkce karsiligi "aktarim ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const transferFee = Math.max(0, Number(transaction.transferFee || 0));
    // ACIKLAMA: sourceDebit degiskeninin Turkce karsiligi "kaynak borc"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const period = getCreditCardStatementPeriod(item);
      // ACIKLAMA: inPeriod degiskeninin Turkce karsiligi "in period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const period = getCreditCardStatementPeriod(item);
      // ACIKLAMA: inPeriod degiskeninin Turkce karsiligi "in period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: transferAccount degiskeninin Turkce karsiligi "aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const transferAccount = paymentAccounts.find((item) => item.id === transferAccountId && item.type !== "credit_card");
    if (transferAccount) {
      paymentAccounts = paymentAccounts.map((item) => {
        if (item.id !== transferAccount.id) {
          return item;
        }

        // ACIKLAMA: transferFactor degiskeninin Turkce karsiligi "aktarim factor"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: applyTransferEffectToAccount fonksiyonunun Turkce karsiligi "uygula aktarim effect ile hesap"; ilgili uygulama islemini calistirir.
function applyTransferEffectToAccount(account, transaction, signedAmount, now = getTurkeyNowDateTime()) {
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(signedAmount || 0);

  if (account.type === "credit_card") {
    // ACIKLAMA: period degiskeninin Turkce karsiligi "period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const period = getCreditCardStatementPeriod(account, transaction.date || getTurkeyTodayISO());
    // ACIKLAMA: inPeriod degiskeninin Turkce karsiligi "in period"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const inPeriod = isTransactionInStatementPeriod(transaction, period);
    // ACIKLAMA: debtDelta degiskeninin Turkce karsiligi "debt delta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const debtDelta = -amount;
    // ACIKLAMA: isCardPayment degiskeninin Turkce karsiligi "mi kart odeme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const isCardPayment =
      transaction.type === "transfer" &&
      String(transaction.transferAccountId || "") === String(account.id || "") &&
      String(transaction.paymentAccountId || "") !== String(account.id || "");
    // ACIKLAMA: nextDebt degiskeninin Turkce karsiligi "sonraki debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const nextDebt = Math.max(0, roundMoney(Number(account.debt || 0) + debtDelta));
    // ACIKLAMA: nextStatementDebt degiskeninin Turkce karsiligi "sonraki statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const nextStatementDebt = isCardPayment
      ? clampCreditCardStatementDebt(nextDebt, account.currentStatementDebt)
      : inPeriod
        ? clampCreditCardStatementDebt(
            nextDebt,
            roundMoney(Number(account.currentStatementDebt || 0) + debtDelta)
          )
        : clampCreditCardStatementDebt(nextDebt, account.currentStatementDebt);

    return {
      ...account,
      debt: nextDebt,
      currentStatementDebt: nextStatementDebt,
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

// ACIKLAMA: getPaymentAccountMeta fonksiyonunun Turkce karsiligi "al odeme hesap meta"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountMeta(item) {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: available degiskeninin Turkce karsiligi "available"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const available = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));
      parts.push(`Limit ${currency.format(item.limit)} · Kullanılabilir ${currency.format(available)}`);
    }
  }

  return parts.join(" · ");
}

// ACIKLAMA: getTransactionPaymentInfo fonksiyonunun Turkce karsiligi "al islem odeme info"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionPaymentInfo(item) {
  if (item?.type === "transfer") {
    // ACIKLAMA: sourceAccount degiskeninin Turkce karsiligi "kaynak hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const sourceAccount = item.paymentAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId)
      : null;
    // ACIKLAMA: targetAccount degiskeninin Turkce karsiligi "hedef hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const targetAccount = item.transferAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.transferAccountId)
      : null;
    // ACIKLAMA: sourceText degiskeninin Turkce karsiligi "kaynak metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const sourceText = sourceAccount ? formatPaymentAccountName(sourceAccount) : "Kaynak seçilmedi";
    // ACIKLAMA: targetText degiskeninin Turkce karsiligi "hedef metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const targetText = targetAccount ? formatPaymentAccountName(targetAccount) : "Karşı hesap seçilmedi";
    // ACIKLAMA: fee degiskeninin Turkce karsiligi "ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const fee = Math.max(0, Number(item.transferFee || 0));
    return `Hesaplar arası transfer · ${sourceText} -> ${targetText}${fee ? ` · Ücret ${currency.format(fee)}` : ""}`;
  }

  // ACIKLAMA: method degiskeninin Turkce karsiligi "yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const method = normalizePaymentMethod(item.paymentMethod || "cash");
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = item.paymentAccountId ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId) : null;

  return account
    ? `${getPaymentMethodLabel(method)} · ${formatPaymentAccountName(account)}`
    : getPaymentMethodLabel(method);
}

// ACIKLAMA: getPaymentMethodLabel fonksiyonunun Turkce karsiligi "al odeme yontem etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentMethodLabel(method) {
  return paymentMethodLabels[normalizePaymentMethod(method)] || paymentMethodLabels.cash;
}

// ACIKLAMA: getPaymentAccountTypeLabel fonksiyonunun Turkce karsiligi "al odeme hesap tur etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getPaymentAccountTypeLabel(type) {
  return paymentAccountTypeLabels[normalizePaymentAccountType(type)] || paymentAccountTypeLabels.cash;
}

// ACIKLAMA: formatPaymentAccountName fonksiyonunun Turkce karsiligi "bicimlendir odeme hesap adi"; degeri ekranda okunur bicime cevirir.
function formatPaymentAccountName(item) {
  // ACIKLAMA: base degiskeninin Turkce karsiligi "base"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const base = item.name || getPaymentAccountTypeLabel(item.type);
  return item.last4 ? `${base} **** ${item.last4}` : base;
}

// ACIKLAMA: formatExpiry fonksiyonunun Turkce karsiligi "bicimlendir expiry"; degeri ekranda okunur bicime cevirir.
function formatExpiry(value) {
  const [year, month] = String(value || "").split("-");
  return year && month ? `${month}/${year}` : "";
}

// ACIKLAMA: getCreditCardDueDisplay fonksiyonunun Turkce karsiligi "al alacak kart due display"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardDueDisplay(item) {
  // ACIKLAMA: dueDay degiskeninin Turkce karsiligi "due gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dueDay = Number(item?.dueDay || 0);
  // ACIKLAMA: statementDay degiskeninin Turkce karsiligi "statement gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDay = Number(item?.statementDay || 0);

  if (!dueDay) {
    return "-";
  }

  if (statementDay && dueDay <= statementDay) {
    return `Sonraki ay\n${dueDay}. gün`;
  }

  return `${dueDay}. gün`;
}

// ACIKLAMA: getCreditCardDueNote fonksiyonunun Turkce karsiligi "al alacak kart due note"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCreditCardDueNote(item) {
  // ACIKLAMA: dueDay degiskeninin Turkce karsiligi "due gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dueDay = Number(item?.dueDay || 0);
  // ACIKLAMA: statementDay degiskeninin Turkce karsiligi "statement gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const statementDay = Number(item?.statementDay || 0);

  if (!dueDay) {
    return "Son ödeme günü belirtilmedi";
  }

  if (statementDay && dueDay <= statementDay) {
    return `Son ödeme kesimden sonraki ayın ${dueDay}. günü`;
  }

  return `Son ödeme ayın ${dueDay}. günü`;
}

// ACIKLAMA: normalizePaymentMethod fonksiyonunun Turkce karsiligi "standartlastir odeme yontem"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizePaymentMethod(value) {
  // ACIKLAMA: method degiskeninin Turkce karsiligi "yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const method = String(value || "cash");
  return paymentMethodLabels[method] ? method : "cash";
}

// ACIKLAMA: normalizePaymentAccountType fonksiyonunun Turkce karsiligi "standartlastir odeme hesap tur"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizePaymentAccountType(value) {
  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = String(value || "cash");
  return paymentAccountTypeLabels[type] ? type : "cash";
}

// ACIKLAMA: normalizePaymentCardColor fonksiyonunun Turkce karsiligi "standartlastir odeme kart color"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizePaymentCardColor(value, type = "cash") {
  // ACIKLAMA: color degiskeninin Turkce karsiligi "color"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }

  return defaultPaymentCardColors[normalizePaymentAccountType(type)] || defaultPaymentCardColors.cash;
}

// ACIKLAMA: isPaymentAccountAllowedForMethod fonksiyonunun Turkce karsiligi "mi odeme hesap allowed icin yontem"; ilgili uygulama islemini calistirir.
function isPaymentAccountAllowedForMethod(account, method) {
  // ACIKLAMA: allowedTypes degiskeninin Turkce karsiligi "allowed turler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allowedTypes = paymentMethodAccountTypes[normalizePaymentMethod(method)] || [];
  return allowedTypes.includes(account.type);
}

// ACIKLAMA: clampDay fonksiyonunun Turkce karsiligi "clamp gun"; ilgili uygulama islemini calistirir.
function clampDay(value) {
  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(value);
  return Number.isFinite(day) && day >= 1 && day <= 31 ? Math.round(day) : 0;
}

// ACIKLAMA: roundMoney fonksiyonunun Turkce karsiligi "round para"; ilgili uygulama islemini calistirir.
function roundMoney(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

// ACIKLAMA: renderBesAccounts fonksiyonunun Turkce karsiligi "ekrana bas BES hesaplar"; ilgili ekran, liste veya kartlari ekrana basar.
function renderBesAccounts() {
  if (!besList) {
    return;
  }

  // ACIKLAMA: totals degiskeninin Turkce karsiligi "totals"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
  // ACIKLAMA: grandTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
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
    // ACIKLAMA: total hesaplanan toplam degerin ekranda gosterilecegi alandir.
    const total = getBesAccountTotal(item);
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("article");
    row.className = "transaction-item";

    // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const content = document.createElement("div");
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.provider;

    // ACIKLAMA: details degiskeninin Turkce karsiligi "ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const details = [
      item.policyNo ? `Sözleşme: ${item.policyNo}` : "",
      `Kendi birikimin ${currency.format(item.contribution || 0)}`,
      `Devlet katkısı ${currency.format(item.stateContribution || 0)}`,
      `Devlet katkısı getirisi ${currency.format(item.stateGain || 0)}`,
      `Fon getirisi ${currency.format(item.gain || 0)}`,
      item.note || "",
    ].filter(Boolean);

    // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = details.join(" · ");

    content.append(title, meta);

    // ACIKLAMA: side degiskeninin Turkce karsiligi "side"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const side = document.createElement("div");
    side.className = "transaction-side";

    // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(total);

    // ACIKLAMA: editButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openBesModal(item));

    // ACIKLAMA: removeButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
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

// ACIKLAMA: getBesAccountTotal fonksiyonunun Turkce karsiligi "al BES hesap toplam"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBesAccountTotal(item) {
  return (
    Number(item.contribution || 0) +
    Number(item.stateContribution || 0) +
    Number(item.stateGain || 0) +
    Number(item.gain || 0)
  );
}

// ACIKLAMA: getBesTotal fonksiyonunun Turkce karsiligi "al BES toplam"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBesTotal() {
  return besAccounts.reduce((sum, item) => sum + getBesAccountTotal(item), 0);
}

// ACIKLAMA: readSignedNumber fonksiyonunun Turkce karsiligi "oku isaretli sayi"; ilgili uygulama islemini calistirir.
function readSignedNumber(value, fallback = Number.NaN) {
  // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const raw = String(value ?? "").trim();

  if (!raw) {
    return fallback;
  }

  // ACIKLAMA: negative degiskeninin Turkce karsiligi "negative"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const negative = raw.includes("-") || raw.includes("−");
  // ACIKLAMA: cleaned degiskeninin Turkce karsiligi "temizlenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let cleaned = raw
    .replace(/\s/g, "")
    .replace(/[−]/g, "-")
    .replace(/[^0-9,.\-+]/g, "")
    .replace(/[+-]/g, "");

  if (!/\d/.test(cleaned)) {
    return fallback;
  }

  // ACIKLAMA: lastComma degiskeninin Turkce karsiligi "son virgul"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastComma = cleaned.lastIndexOf(",");
  // ACIKLAMA: lastDot degiskeninin Turkce karsiligi "son nokta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    cleaned =
      lastComma > lastDot ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    cleaned = cleaned.replace(",", ".");
  } else if ((cleaned.match(/\./g) || []).length > 1) {
    cleaned = cleaned.replace(/\./g, "");
  }

  // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? (negative ? -Math.abs(parsed) : parsed) : fallback;
}

// ACIKLAMA: resetAssetForm fonksiyonunun Turkce karsiligi "sifirla varlik form"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: openAssetAddModal fonksiyonunun Turkce karsiligi "ac varlik add pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: openAssetEditModal fonksiyonunun Turkce karsiligi "ac varlik duzenle pencere"; ilgili pencereyi veya ekrani acar.
function openAssetEditModal(assetId) {
  // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: closeAssetEditModal fonksiyonunun Turkce karsiligi "kapat varlik duzenle pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: saveAssetModal fonksiyonunun Turkce karsiligi "kaydet varlik pencere"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveAssetModal(event) {
  event.preventDefault();

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = String(assetEditType?.value || "TRY");
  // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const definition = getAssetDefinition(type);
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(assetEditAmount?.value);
  // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const label = String(assetEditLabel?.value || definition.label).trim();

  if (!assetDefinitions[type] || !Number.isFinite(amount) || amount <= 0) {
    assetEditStatus.textContent = "Varlık tipi ve miktarı kontrol et.";
    return;
  }

  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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


// ACIKLAMA: addBesAccount fonksiyonunun Turkce karsiligi "add BES hesap"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function addBesAccount(event) {
  event.preventDefault();

  // ACIKLAMA: formData degiskeninin Turkce karsiligi "form veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const formData = new FormData(besForm);
  // ACIKLAMA: provider degiskeninin Turkce karsiligi "saglayici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const provider = String(formData.get("besProvider") || "").trim();
  // ACIKLAMA: contribution degiskeninin Turkce karsiligi "contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const contribution = readSignedNumber(formData.get("besContribution"));
  // ACIKLAMA: stateContribution degiskeninin Turkce karsiligi "durum contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateContribution = readSignedNumber(formData.get("besStateContribution"), 0);
  // ACIKLAMA: stateGain degiskeninin Turkce karsiligi "durum gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateGain = readSignedNumber(formData.get("besStateGain"), 0);
  // ACIKLAMA: gain degiskeninin Turkce karsiligi "gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const gain = readSignedNumber(formData.get("besGain"), 0);

  if (!provider || !Number.isFinite(contribution) || contribution < 0) {
    return;
  }

  // ACIKLAMA: now degiskeninin Turkce karsiligi "su anki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const now = getTurkeyNowDateTime();
  // ACIKLAMA: nextAccount degiskeninin Turkce karsiligi "sonraki hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: refreshMarketPrices fonksiyonunun Turkce karsiligi "yenile piyasa fiyatlar"; ilgili uygulama islemini calistirir.
async function refreshMarketPrices(options = {}) {
  const { silent = false } = options;

  if (!silent) {
    marketStatus.textContent = "Canlı fiyatlar yükleniyor...";
  }

  // ACIKLAMA: currentPrices degiskeninin Turkce karsiligi "mevcut fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentPrices = { TRY: 1, ...(marketData.prices || {}) };
  // ACIKLAMA: nextPrices degiskeninin Turkce karsiligi "sonraki fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextPrices = { ...currentPrices, TRY: 1 };
  // ACIKLAMA: status kullaniciya durum, hata veya basari mesaji gostermek icin kullanilir.
  const status = {
    updated: [],
    failed: [],
    timestamp: "",
  };

  // ACIKLAMA: currencyResult degiskeninin Turkce karsiligi "para birimi result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currencyResult = await getCurrencyPrices();
  if (currencyResult) {
    Object.assign(nextPrices, currencyResult.prices);
    status.updated.push(currencyResult.source);
    status.timestamp = currencyResult.timestamp || status.timestamp;
  } else {
    status.failed.push("döviz");
  }

  // ACIKLAMA: usdToTry degiskeninin Turkce karsiligi "usd ile dene"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: hasAnyPrice degiskeninin Turkce karsiligi "var mi herhangi fiyat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getCurrencyPrices fonksiyonunun Turkce karsiligi "al para birimi fiyatlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
async function getCurrencyPrices() {
  // ACIKLAMA: sources degiskeninin Turkce karsiligi "sources"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sources = [
    async () => {
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson("https://api.genelpara.com/json/?list=doviz&sembol=USD,EUR,GBP");
      // ACIKLAMA: usdToTry degiskeninin Turkce karsiligi "usd ile dene"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const usdToTry = getGenelParaPrice(data, "USD");
      // ACIKLAMA: eurToTry degiskeninin Turkce karsiligi "eur ile dene"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const eurToTry = getGenelParaPrice(data, "EUR");
      // ACIKLAMA: gbpToTry degiskeninin Turkce karsiligi "gbp ile dene"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: buildCurrencyPrices fonksiyonunun Turkce karsiligi "olustur para birimi fiyatlar"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildCurrencyPrices(data, source) {
  // ACIKLAMA: rates degiskeninin Turkce karsiligi "rates"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rates = data?.rates || {};
  // ACIKLAMA: usdToTry degiskeninin Turkce karsiligi "usd ile dene"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getMetalPrices fonksiyonunun Turkce karsiligi "al maden fiyatlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
async function getMetalPrices(usdToTry) {
  // ACIKLAMA: sources degiskeninin Turkce karsiligi "sources"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sources = [
    async () => {
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson(
        "https://api.genelpara.com/json/?list=altin&sembol=GA,GAG,XHGLD,C,Y,T,CMR,ATA,IKB,BSL,GR,RA,HA,22,18,14"
      );
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson("https://convertz.app/api/metals");
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getCryptoPrices fonksiyonunun Turkce karsiligi "al kripto fiyatlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
async function getCryptoPrices(usdToTry) {
  // ACIKLAMA: sources degiskeninin Turkce karsiligi "sources"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sources = [
    async () => {
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson("https://api.genelpara.com/json/?list=kripto&sembol=BTC,ETH");
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const prices = {
        BTC: getGenelParaPrice(data, "BTC"),
        ETH: getGenelParaPrice(data, "ETH"),
      };

      return hasPositivePrice(prices) ? { source: "GenelPara kripto", timestamp: new Date().toISOString(), prices } : null;
    },
    async () => {
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson("https://convertz.app/api/crypto");
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const prices = {
        BTC: getCryptoTryPrice("bitcoin", data, usdToTry),
        ETH: getCryptoTryPrice("ethereum", data, usdToTry),
      };

      return hasPositivePrice(prices) ? { source: "Convertz kripto", timestamp: data?.timestamp, prices } : null;
    },
    async () => {
      // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const data = await fetchJson(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_last_updated_at=true"
      );
      // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const prices = {
        BTC: readMarketNumber(data?.bitcoin?.usd) * usdToTry,
        ETH: readMarketNumber(data?.ethereum?.usd) * usdToTry,
      };
      // ACIKLAMA: updatedAt degiskeninin Turkce karsiligi "updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const updatedAt = data?.bitcoin?.last_updated_at || data?.ethereum?.last_updated_at;

      return hasPositivePrice(prices)
        ? { source: "CoinGecko", timestamp: normalizeMarketTimestamp(updatedAt), prices }
        : null;
    },
  ];

  return tryMarketSources(sources);
}

// ACIKLAMA: tryMarketSources fonksiyonunun Turkce karsiligi "dene piyasa sources"; ilgili uygulama islemini calistirir.
async function tryMarketSources(sources) {
  for (const source of sources) {
    try {
      // ACIKLAMA: result degiskeninin Turkce karsiligi "result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: hasPositivePrice fonksiyonunun Turkce karsiligi "var mi positive fiyat"; ilgili uygulama islemini calistirir.
function hasPositivePrice(prices) {
  return Object.values(prices || {}).some((value) => readMarketNumber(value) > 0);
}

// ACIKLAMA: getDerivedAssetPrices fonksiyonunun Turkce karsiligi "al derived varlik fiyatlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getDerivedAssetPrices(sourcePrices = {}) {
  // ACIKLAMA: prices degiskeninin Turkce karsiligi "fiyatlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const prices = { ...sourcePrices };
  // ACIKLAMA: changed degiskeninin Turkce karsiligi "changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let changed = true;

  while (changed) {
    changed = false;
    Object.entries(assetDefinitions).forEach(([code, definition]) => {
      if (!definition.priceFrom || readMarketNumber(prices[code]) > 0) {
        return;
      }

      // ACIKLAMA: sourcePrice degiskeninin Turkce karsiligi "kaynak fiyat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: fetchJson fonksiyonunun Turkce karsiligi "getir JSON"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
async function fetchJson(url) {
  // ACIKLAMA: response degiskeninin Turkce karsiligi "yanit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ACIKLAMA: getFiatTryPrice fonksiyonunun Turkce karsiligi "al itibari para dene fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getFiatTryPrice(code, rates, usdToTry) {
  // ACIKLAMA: usdToTarget degiskeninin Turkce karsiligi "usd ile hedef"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usdToTarget = readMarketNumber(rates[code]);

  if (!usdToTarget) {
    return getAssetUnitPrice(code);
  }

  return usdToTry / usdToTarget;
}

// ACIKLAMA: getGenelParaPrice fonksiyonunun Turkce karsiligi "al genel para fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getGenelParaPrice(data, symbol) {
  // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const item = data?.data?.[symbol];

  if (!item) {
    return 0;
  }

  return readMarketNumber(item.satis ?? item.satış ?? item.alis ?? item.alış);
}

// ACIKLAMA: getMetalGramTryPrice fonksiyonunun Turkce karsiligi "al maden gram dene fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getMetalGramTryPrice(symbol, metalsData, usdToTry) {
  // ACIKLAMA: metal degiskeninin Turkce karsiligi "maden"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const metal = metalsData?.[symbol];
  // ACIKLAMA: usdPerTroyOunce degiskeninin Turkce karsiligi "usd per troy ons"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usdPerTroyOunce = readMarketNumber(metal?.price ?? metal);

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(`${symbol}_GRAM`);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

// ACIKLAMA: getGoldApiGramTryPrice fonksiyonunun Turkce karsiligi "al gold api gram dene fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getGoldApiGramTryPrice(data, usdToTry, fallbackType) {
  // ACIKLAMA: usdPerTroyOunce degiskeninin Turkce karsiligi "usd per troy ons"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usdPerTroyOunce = readMarketNumber(
    data?.price ?? data?.priceTroyOz ?? data?.price_troy_oz ?? data?.ask ?? data?.bid
  );

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(fallbackType);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

// ACIKLAMA: getCryptoTryPrice fonksiyonunun Turkce karsiligi "al kripto dene fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getCryptoTryPrice(id, cryptoData, usdToTry) {
  // ACIKLAMA: cryptoItem degiskeninin Turkce karsiligi "kripto oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cryptoItem = cryptoData?.[id];
  // ACIKLAMA: usdPrice degiskeninin Turkce karsiligi "usd fiyat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usdPrice = readMarketNumber(cryptoItem?.current_price ?? cryptoItem?.price ?? cryptoItem);

  if (!usdPrice) {
    return getAssetUnitPrice(id === "bitcoin" ? "BTC" : "ETH");
  }

  return usdPrice * usdToTry;
}

// ACIKLAMA: normalizeMarketTimestamp fonksiyonunun Turkce karsiligi "standartlastir piyasa zaman damgasi"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeMarketTimestamp(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "number") {
    // ACIKLAMA: milliseconds degiskeninin Turkce karsiligi "milliseconds"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const milliseconds = value > 1000000000000 ? value : value * 1000;
    return new Date(milliseconds).toISOString();
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

// ACIKLAMA: readMarketNumber fonksiyonunun Turkce karsiligi "oku piyasa sayi"; ilgili uygulama islemini calistirir.
function readMarketNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const normalized = value.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");
    // ACIKLAMA: numeric degiskeninin Turkce karsiligi "numeric"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  return 0;
}

// ACIKLAMA: getAssetDefinition fonksiyonunun Turkce karsiligi "al varlik definition"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getAssetDefinition(type) {
  return assetDefinitions[type] || { label: type, unit: "" };
}

// ACIKLAMA: getAssetUnitPrice fonksiyonunun Turkce karsiligi "al varlik unit fiyat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getAssetUnitPrice(type) {
  if (type === "TRY") {
    return 1;
  }

  // ACIKLAMA: directPrice degiskeninin Turkce karsiligi "direct fiyat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const directPrice = readMarketNumber(marketData.prices?.[type]);

  if (directPrice) {
    return directPrice;
  }

  // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const definition = assetDefinitions[type];

  if (definition?.priceFrom) {
    return getAssetUnitPrice(definition.priceFrom) * readMarketNumber(definition.multiplier || 1);
  }

  return 0;
}

// ACIKLAMA: getAssetValue fonksiyonunun Turkce karsiligi "al varlik deger"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getAssetValue(item) {
  return Number(item.amount || 0) * getAssetUnitPrice(item.type);
}

// ACIKLAMA: formatQuantity fonksiyonunun Turkce karsiligi "bicimlendir quantity"; degeri ekranda okunur bicime cevirir.
function formatQuantity(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 6,
  }).format(Number(value || 0));
}

// ACIKLAMA: formatMarketTime fonksiyonunun Turkce karsiligi "bicimlendir piyasa saat"; degeri ekranda okunur bicime cevirir.
function formatMarketTime(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

// ACIKLAMA: getSummaryCategoryTypeFilterValue fonksiyonunun Turkce karsiligi "al ozet kategori tur filtre deger"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
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
  meta.textContent = `${formatTransactionDateTime(item)} · ${item.category} · ${getTransactionPaymentInfo(item)}${item.note ? ` · ${item.note}` : ""}`;
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

// ACIKLAMA: closeTransactionEditModal fonksiyonunun Turkce karsiligi "kapat islem duzenle pencere"; ilgili pencereyi veya ekrani kapatir.
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
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = transactionTimeInput.value ? `${transactionTimeInput.value}:00` : "";
  // ACIKLAMA: transactionAt degiskeninin Turkce karsiligi "islem at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    transactionAt,
    updatedAt: getTurkeyNowDateTime(),
  };

  if (!validateTransactionPayment(nextTransaction, transactionEditStatus)) {
    return;
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

  transactionCategories[type] = [...(transactionCategories[type] || []), name];
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

  items.forEach((name) => {
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const row = document.createElement("div");
    row.className = "category-manage-row";

    // ACIKLAMA: input kullanicidan veri alan input elemaninin DOM referansidir.
    const input = document.createElement("input");
    input.type = "text";
    input.value = name;
    input.maxLength = 32;
    input.autocomplete = "off";

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

    row.append(input, saveButton, deleteButton);
    categoryManageList.append(row);
  });
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
  if (dateInput && !dateInput.value) {
    dateInput.value = getTurkeyTodayISO();
  }

  entryModal.hidden = false;
  setTimeout(() => form.querySelector("input, select, textarea")?.focus(), 0);
}

// ACIKLAMA: closeEntryModal fonksiyonunun Turkce karsiligi "kapat entry pencere"; ilgili pencereyi veya ekrani kapatir.
function closeEntryModal() {
  if (entryModal) {
    entryModal.hidden = true;
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

// ACIKLAMA: switchView fonksiyonunun Turkce karsiligi "ekran degistir ekran"; ilgili uygulama islemini calistirir.
function switchView(viewId) {
  // ACIKLAMA: previousView uygulamadaki ilgili ekran/gorunum alanini temsil eder.
  const previousView = activeView;
  activeView = viewMeta[viewId] ? viewId : "homeView";

  if (previousView === "historyView" && activeView !== "historyView") {
    clearHistorySearch();
    currentHistoryPage = 1;
  }

  renderView();

  if (activeView === "cardsView") {
    refreshAllPaymentAccountsFromRecords({ silent: false, syncCloud: true });
    renderPaymentAccounts();
  }

  if (activeView === "historyView") {
    renderTransactions();
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

// ACIKLAMA: updateStorageStatus fonksiyonunun Turkce karsiligi "guncelle depolama durum"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateStorageStatus() {
  if (!storageStatus) {
    return;
  }

  // ACIKLAMA: size degiskeninin Turkce karsiligi "boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const size = new Blob([JSON.stringify(transactions)]).size;
  // ACIKLAMA: savedAt degiskeninin Turkce karsiligi "saved at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const savedAt = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  // ACIKLAMA: storageMode degiskeninin Turkce karsiligi "depolama mode"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const storageMode = currentUser ? "bulut hesabın ve bu cihazda" : "bu cihazda";
  storageStatus.textContent = `${transactions.length} kayıt ${storageMode} saklanıyor · Son güncelleme ${savedAt} · ${size} bayt`;
}

// ACIKLAMA: getCloudBackupSummary fonksiyonunun Turkce karsiligi "al bulut yedekle ozet"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudBackupSummary() {
  return {
    transactions: getCloudReadyTransactions(transactions).length,
    assets: getCloudReadyAssets(assets).length,
    besAccounts: getCloudReadyBesAccounts(besAccounts).length,
    paymentAccounts: getCloudReadyPaymentAccounts(paymentAccounts).length,
    categories:
      (transactionCategories.income || []).length +
      (transactionCategories.expense || []).length +
      (transactionCategories.transfer || []).length,
  };
}

// ACIKLAMA: buildCloudBackupPayload fonksiyonunun Turkce karsiligi "olustur bulut yedekle veri paketi"; bulut ve yerel veri esitleme akisini yonetir.
function buildCloudBackupPayload(createdAt = getTurkeyNowDateTime()) {
  return {
    version: 4,
    createdAt,
    summary: getCloudBackupSummary(),
    transactions: getCloudReadyTransactions(transactions),
    assets: getCloudReadyAssets(assets),
    besAccounts: getCloudReadyBesAccounts(besAccounts),
    paymentAccounts: getCloudReadyPaymentAccounts(paymentAccounts),
    transactionCategories: normalizeCategoryState(transactionCategories),
    deletedTransactionState: getDeletedTransactionStateSnapshot(),
  };
}

// ACIKLAMA: formatBackupDateTime fonksiyonunun Turkce karsiligi "bicimlendir yedekle tarih saat"; degeri ekranda okunur bicime cevirir.
function formatBackupDateTime(value) {
  // ACIKLAMA: timestamp degiskeninin Turkce karsiligi "zaman damgasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const timestamp = getRecordTimestamp(value);

  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

// ACIKLAMA: updateCloudBackupStatus fonksiyonunun Turkce karsiligi "guncelle bulut yedekle durum"; bulut ve yerel veri esitleme akisini yonetir.
function updateCloudBackupStatus(profile = null) {
  if (!cloudBackupStatus) {
    return;
  }

  if (!currentUser) {
    cloudBackupStatus.textContent = "Bulut yedeği için giriş yap.";
    return;
  }

  // ACIKLAMA: lastBackupAt degiskeninin Turkce karsiligi "son yedekle at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastBackupAt = profile?.lastBackupAt || "";
  // ACIKLAMA: summary degiskeninin Turkce karsiligi "ozet"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summary = profile?.lastBackupSummary || null;
  // ACIKLAMA: dateText degiskeninin Turkce karsiligi "tarih metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dateText = formatBackupDateTime(lastBackupAt);

  if (!dateText) {
    cloudBackupStatus.textContent = "Son yedek: Henüz yok.";
    return;
  }

  // ACIKLAMA: countText degiskeninin Turkce karsiligi "sayi metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const countText = summary?.transactions ? ` · ${summary.transactions} kayıt` : "";
  cloudBackupStatus.textContent = `Son yedek: ${dateText}${countText}.`;
}

// ACIKLAMA: backupCurrentDataToCloud fonksiyonunun Turkce karsiligi "yedekle mevcut veri ile bulut"; bulut ve yerel veri esitleme akisini yonetir.
async function backupCurrentDataToCloud() {
  if (!ensureCloudReady(cloudBackupStatus)) {
    return;
  }

  if (!currentUser) {
    cloudBackupStatus.textContent = "Bulut yedeği almak için önce giriş yap.";
    return;
  }

  // ACIKLAMA: previousText degiskeninin Turkce karsiligi "previous metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousText = cloudBackupButton?.textContent || "Yedek Al";
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = getTurkeyNowDateTime();
  // ACIKLAMA: backupId degiskeninin Turkce karsiligi "yedekle kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const backupId = `manual-${new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)}`;
  // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const payload = buildCloudBackupPayload(createdAt);

  try {
    if (cloudBackupButton) {
      cloudBackupButton.disabled = true;
      cloudBackupButton.textContent = "Yedekleniyor...";
    }
    cloudBackupStatus.textContent = "Bulut yedeği hazırlanıyor...";

    await Promise.all([syncTransactionsToCloud({ replace: false }), syncUserProfileToCloud()]);

    // ACIKLAMA: userRef degiskeninin Turkce karsiligi "kullanici ref"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const userRef = firebaseDb.collection("users").doc(currentUser.uid);
    await userRef.collection("backups").doc(backupId).set(
      {
        id: backupId,
        ...payload,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: false }
    );
    await userRef.set(
      {
        lastBackupAt: createdAt,
        lastBackupId: backupId,
        lastBackupSummary: payload.summary,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    updateCloudBackupStatus({ lastBackupAt: createdAt, lastBackupSummary: payload.summary });
  } catch (error) {
    // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const message = error?.code === "permission-denied"
      ? "Bulut yedeği alınamadı: Firebase kurallarında backups izni yayınlanmalı."
      : `Bulut yedeği alınamadı: ${error.message}`;
    cloudBackupStatus.textContent = message;
  } finally {
    if (cloudBackupButton) {
      cloudBackupButton.disabled = false;
      cloudBackupButton.textContent = previousText;
    }
  }
}

// ACIKLAMA: buildLocalDataBackupPayload fonksiyonunun Turkce karsiligi "olustur yerel veri yedekle veri paketi"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildLocalDataBackupPayload(createdAt = getTurkeyNowDateTime()) {
  return {
    version: 5,
    backupType: "local-file",
    app: "Akış Bütçe",
    createdAt,
    exportedFrom: typeof location === "undefined" ? "" : location.href,
    user: currentUser
      ? {
          uid: currentUser.uid || "",
          email: currentUser.email || "",
          username: getUserDisplayName(currentUser),
        }
      : null,
    summary: getCloudBackupSummary(),
    transactions: getCloudReadyTransactions(transactions),
    assets: getCloudReadyAssets(assets),
    besAccounts: getCloudReadyBesAccounts(besAccounts),
    paymentAccounts: getCloudReadyPaymentAccounts(paymentAccounts),
    transactionCategories: normalizeCategoryState(transactionCategories),
    deletedTransactionState: getDeletedTransactionStateSnapshot(),
    uiSettings,
    cardReminderSettings,
    marketData,
    homeSummaryFilter,
  };
}

// ACIKLAMA: getLocalBackupFilename fonksiyonunun Turkce karsiligi "al yerel yedekle filename"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getLocalBackupFilename(createdAt = getTurkeyNowDateTime()) {
  // ACIKLAMA: stamp degiskeninin Turkce karsiligi "stamp"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stamp = String(createdAt || getTurkeyNowDateTime())
    .replace(/[:T]/g, "-")
    .replace(/\+.*/, "")
    .replace(/\D/g, "")
    .slice(0, 12);
  return `akis-butce-yerel-yedek-${stamp || getExportStamp()}.json`;
}

// ACIKLAMA: downloadLocalDataBackup fonksiyonunun Turkce karsiligi "indir yerel veri yedekle"; ilgili uygulama islemini calistirir.
function downloadLocalDataBackup() {
  // ACIKLAMA: previousText degiskeninin Turkce karsiligi "previous metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousText = localBackupDownloadButton?.textContent || "Dosya İndir";
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = getTurkeyNowDateTime();
  // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const payload = buildLocalDataBackupPayload(createdAt);
  // ACIKLAMA: json degiskeninin Turkce karsiligi "JSON"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const json = JSON.stringify(payload, null, 2);
  // ACIKLAMA: blob degiskeninin Turkce karsiligi "dosya parcasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });

  try {
    if (localBackupDownloadButton) {
      localBackupDownloadButton.disabled = true;
      localBackupDownloadButton.textContent = "İndiriliyor...";
    }

    downloadBlob(blob, getLocalBackupFilename(createdAt));
    if (cloudBackupStatus) {
      cloudBackupStatus.textContent =
        `Yerel yedek indirildi: ${payload.summary.transactions} kayıt · ${payload.summary.paymentAccounts} kart/hesap.`;
    }
  } catch (error) {
    if (cloudBackupStatus) {
      cloudBackupStatus.textContent = `Yerel yedek indirilemedi: ${error.message}`;
    }
  } finally {
    if (localBackupDownloadButton) {
      localBackupDownloadButton.disabled = false;
      localBackupDownloadButton.textContent = previousText;
    }
  }
}

// ACIKLAMA: getBackupArrayField fonksiyonunun Turkce karsiligi "al yedekle dizi alan"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBackupArrayField(parsed, key) {
  return Array.isArray(parsed?.[key]) ? parsed[key] : [];
}

// ACIKLAMA: applyLocalDataBackup fonksiyonunun Turkce karsiligi "uygula yerel veri yedekle"; ilgili uygulama islemini calistirir.
function applyLocalDataBackup(parsed) {
  // ACIKLAMA: sourceTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const sourceTransactions = Array.isArray(parsed)
    ? parsed
    : getBackupArrayField(parsed, "transactions");

  if (!Array.isArray(sourceTransactions)) {
    throw new Error("Yedek dosyasında kayıt listesi bulunamadı.");
  }

  // ACIKLAMA: validTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const validTransactions = sourceTransactions.filter(isValidTransaction);
  transactions = mergeTransactions(validTransactions, transactions);

  // ACIKLAMA: sourceAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const sourceAssets = getBackupArrayField(parsed, "assets");
  if (sourceAssets.length) {
    assets = mergeRecordsById(readCloudAssets(sourceAssets), assets);
  }

  // ACIKLAMA: sourceBesAccounts degiskeninin Turkce karsiligi "kaynak BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceBesAccounts = getBackupArrayField(parsed, "besAccounts");
  if (sourceBesAccounts.length) {
    besAccounts = mergeRecordsById(readCloudBesAccounts(sourceBesAccounts), besAccounts);
  }

  // ACIKLAMA: sourcePaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const sourcePaymentAccounts = getBackupArrayField(parsed, "paymentAccounts");
  if (sourcePaymentAccounts.length) {
    paymentAccounts = mergeRecordsById(readCloudPaymentAccounts(sourcePaymentAccounts), paymentAccounts);
  }

  // ACIKLAMA: categorySource degiskeninin Turkce karsiligi "kategori kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const categorySource = parsed?.transactionCategories || parsed?.categories;
  if (hasCategoryState(categorySource)) {
    transactionCategories = mergeCategoryStates(categorySource, transactionCategories);
  }
  transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));

  if (parsed?.deletedTransactionState) {
    applyDeletedTransactionState(parsed.deletedTransactionState);
  }

  if (parsed?.uiSettings && typeof parsed.uiSettings === "object") {
    uiSettings = normalizeUiSettings({ ...uiSettings, ...parsed.uiSettings });
    saveUiSettings();
    applyUiSettings();
  }

  if (parsed?.cardReminderSettings && typeof parsed.cardReminderSettings === "object") {
    cardReminderSettings = {
      ...cardReminderSettings,
      ...parsed.cardReminderSettings,
    };
    saveCardReminderSettings();
    updateCardReminderUi();
  }

  if (parsed?.homeSummaryFilter && typeof parsed.homeSummaryFilter === "object") {
    homeSummaryFilter = normalizeHomeSummaryFilter(parsed.homeSummaryFilter);
    saveHomeSummaryFilter();
    syncHomeSummaryFilterControls();
  }

  if (parsed?.marketData && typeof parsed.marketData === "object") {
    marketData = {
      ...marketData,
      ...parsed.marketData,
    };
    saveMarketData();
  }

  persistTransactions({ replaceCloud: false }).catch((error) => {
    if (cloudBackupStatus) {
      cloudBackupStatus.textContent = `Yedek yüklendi ama Firebase'e yazılamadı: ${error.message}`;
    }
  });
  persistAssets();
  persistBesAccounts();
  persistPaymentAccounts();
  persistTransactionCategories();
  syncCategorySelects();
  updatePaymentAccountFilterOptions();
  syncBankImportAccountSelects();
  render();
  updateStorageStatus();

  return {
    transactions: validTransactions.length,
    assets: sourceAssets.length,
    besAccounts: sourceBesAccounts.length,
    paymentAccounts: sourcePaymentAccounts.length,
  };
}

// ACIKLAMA: importLocalDataBackupFile fonksiyonunun Turkce karsiligi "ice aktar yerel veri yedekle dosya"; veriyi uygulamaya ice aktarir.
function importLocalDataBackupFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  // ACIKLAMA: previousText degiskeninin Turkce karsiligi "previous metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousText = localBackupImportButton?.textContent || "Yedek Yükle";
  // ACIKLAMA: reader degiskeninin Turkce karsiligi "reader"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const reader = new FileReader();

  reader.onload = () => {
    try {
      if (localBackupImportButton) {
        localBackupImportButton.disabled = true;
        localBackupImportButton.textContent = "Yükleniyor...";
      }

      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsed = JSON.parse(String(reader.result || ""));
      // ACIKLAMA: result degiskeninin Turkce karsiligi "result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const result = applyLocalDataBackup(parsed);

      if (cloudBackupStatus) {
        cloudBackupStatus.textContent =
          `Yerel yedek yüklendi: ${result.transactions} kayıt · ${result.paymentAccounts} kart/hesap · ${result.assets} varlık.`;
      }
    } catch (error) {
      if (cloudBackupStatus) {
        cloudBackupStatus.textContent = `Yerel yedek yüklenemedi: ${error.message}`;
      }
    } finally {
      if (localBackupImportButton) {
        localBackupImportButton.disabled = false;
        localBackupImportButton.textContent = previousText;
      }
      if (localBackupImportInput) {
        localBackupImportInput.value = "";
      }
    }
  };

  reader.onerror = () => {
    if (cloudBackupStatus) {
      cloudBackupStatus.textContent = "Yerel yedek dosyası okunamadı.";
    }
    if (localBackupImportInput) {
      localBackupImportInput.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
}


// ACIKLAMA: exportTransactions fonksiyonunun Turkce karsiligi "disa aktar islemler"; veriyi dosya veya rapor olarak disa aktarir.
function exportTransactions() {
  // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
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
  // ACIKLAMA: stamp degiskeninin Turkce karsiligi "stamp"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stamp = getExportStamp();
  downloadBlob(new Blob([payload], { type: "application/json;charset=utf-8" }), `akış-veri-yedeği-${stamp}.json`);
}

// ACIKLAMA: exportFilteredTransactionsPdf fonksiyonunun Turkce karsiligi "disa aktar filtrelenmis islemler PDF"; veriyi dosya veya rapor olarak disa aktarir.
function exportFilteredTransactionsPdf() {
  // ACIKLAMA: filtered degiskeninin Turkce karsiligi "filtrelenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    alert("PDF almak için filtreye uygun kayıt bulunamadı.");
    return;
  }

  openPdfPreviewReport(buildFilteredTransactionsReportHtml(filtered));
}

// ACIKLAMA: buildFilteredTransactionsReportHtml fonksiyonunun Turkce karsiligi "olustur filtrelenmis islemler report HTML"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildFilteredTransactionsReportHtml(filtered) {
  // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const income = filtered
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  // ACIKLAMA: expense degiskeninin Turkce karsiligi "gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const expense = filtered
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  // ACIKLAMA: balance degiskeninin Turkce karsiligi "bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balance = income - expense;
  // ACIKLAMA: rows degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isMobilePdfContext fonksiyonunun Turkce karsiligi "mi mobil PDF baglam"; ilgili uygulama islemini calistirir.
function isMobilePdfContext() {
  // ACIKLAMA: standalone degiskeninin Turkce karsiligi "standalone"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
  // ACIKLAMA: mobileWidth degiskeninin Turkce karsiligi "mobil width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mobileWidth = window.matchMedia?.("(max-width: 720px)")?.matches;
  // ACIKLAMA: mobileAgent degiskeninin Turkce karsiligi "mobil agent"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
  return Boolean(mobileWidth || mobileAgent || standalone);
}

// ACIKLAMA: openPdfPreviewReport fonksiyonunun Turkce karsiligi "ac PDF onizle report"; ilgili pencereyi veya ekrani acar.
function openPdfPreviewReport(reportHtml) {
  closePdfPreviewReport();
  document.getElementById("printReport")?.remove();

  // ACIKLAMA: mobilePdf degiskeninin Turkce karsiligi "mobil PDF"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mobilePdf = isMobilePdfContext();
  // ACIKLAMA: overlay degiskeninin Turkce karsiligi "overlay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: closePdfPreviewReport fonksiyonunun Turkce karsiligi "kapat PDF onizle report"; ilgili pencereyi veya ekrani kapatir.
function closePdfPreviewReport() {
  document.getElementById("pdfPreviewOverlay")?.remove();
  document.body.classList.remove("pdf-preview-open");
}

// ACIKLAMA: printPdfPreviewReport fonksiyonunun Turkce karsiligi "print PDF onizle report"; ilgili uygulama islemini calistirir.
function printPdfPreviewReport() {
  // ACIKLAMA: previewReport degiskeninin Turkce karsiligi "onizle report"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previewReport = document.querySelector("#pdfPreviewOverlay .pdf-preview-report");
  if (!previewReport) {
    return;
  }

  if (isMobilePdfContext()) {
    downloadPdfPreviewReport();
    return;
  }

  document.getElementById("printReport")?.remove();
  // ACIKLAMA: report degiskeninin Turkce karsiligi "report"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const report = document.createElement("section");
  report.id = "printReport";
  report.className = "print-report";
  report.innerHTML = previewReport.innerHTML;

  // ACIKLAMA: cleanup degiskeninin Turkce karsiligi "cleanup"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizePdfText fonksiyonunun Turkce karsiligi "standartlastir PDF metin"; veriyi uygulamanin bekledigi temiz formata cevirir.
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

// ACIKLAMA: escapePdfString fonksiyonunun Turkce karsiligi "kacisla PDF metin"; ilgili uygulama islemini calistirir.
function escapePdfString(text = "") {
  return normalizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

// ACIKLAMA: splitPdfLine fonksiyonunun Turkce karsiligi "bol PDF satir"; ilgili uygulama islemini calistirir.
function splitPdfLine(text, maxLength = 92) {
  // ACIKLAMA: words degiskeninin Turkce karsiligi "kelimeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const words = normalizePdfText(text).split(" ").filter(Boolean);
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = [];
  // ACIKLAMA: current degiskeninin Turkce karsiligi "mevcut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let current = "";

  words.forEach((word) => {
    // ACIKLAMA: next degiskeninin Turkce karsiligi "sonraki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: collectPdfPreviewLines fonksiyonunun Turkce karsiligi "topla PDF onizle satirlar"; ilgili uygulama islemini calistirir.
function collectPdfPreviewLines(report) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = [];
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = report.querySelector("h1")?.textContent || "Akis Butce Kayitlari";
  // ACIKLAMA: subtitle degiskeninin Turkce karsiligi "alt baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const subtitle = report.querySelector("p")?.textContent || "";
  lines.push({ text: title, size: 18, gap: 18 });
  if (subtitle) {
    lines.push({ text: subtitle, size: 10, gap: 18 });
  }

  report.querySelectorAll(".print-box").forEach((box) => {
    // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const label = box.querySelector("span")?.textContent || "";
    // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const value = box.querySelector("strong")?.textContent || "";
    lines.push({ text: `${label}: ${value}`, size: 11, gap: 14 });
  });

  lines.push({ text: " ", size: 8, gap: 10 });
  // ACIKLAMA: headers degiskeninin Turkce karsiligi "basliklar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const headers = Array.from(report.querySelectorAll("thead th")).map((cell) => cell.textContent.trim());
  if (headers.length) {
    lines.push({ text: headers.join(" | "), size: 10, gap: 14 });
    lines.push({ text: "-".repeat(96), size: 9, gap: 12 });
  }

  report.querySelectorAll("tbody tr").forEach((row) => {
    // ACIKLAMA: cells degiskeninin Turkce karsiligi "hucreler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim());
    splitPdfLine(cells.join(" | "), 96).forEach((line) => lines.push({ text: line, size: 9, gap: 12 }));
  });

  return lines;
}

// ACIKLAMA: createSimplePdfBlob fonksiyonunun Turkce karsiligi "olustur simple PDF dosya parcasi"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createSimplePdfBlob(lines) {
  // ACIKLAMA: pageWidth degiskeninin Turkce karsiligi "sayfa width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pageWidth = 595.28;
  // ACIKLAMA: pageHeight degiskeninin Turkce karsiligi "sayfa height"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pageHeight = 841.89;
  // ACIKLAMA: marginX degiskeninin Turkce karsiligi "margin x"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const marginX = 38;
  // ACIKLAMA: topY degiskeninin Turkce karsiligi "top y"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const topY = 800;
  // ACIKLAMA: bottomY degiskeninin Turkce karsiligi "bottom y"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const bottomY = 40;
  // ACIKLAMA: pages degiskeninin Turkce karsiligi "pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pages = [];
  // ACIKLAMA: current degiskeninin Turkce karsiligi "mevcut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let current = [];
  // ACIKLAMA: y degiskeninin Turkce karsiligi "y"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let y = topY;

  lines.forEach((line) => {
    // ACIKLAMA: gap degiskeninin Turkce karsiligi "gap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: objects degiskeninin Turkce karsiligi "objects"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const objects = [];
  // ACIKLAMA: addObject degiskeninin Turkce karsiligi "add nesne"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("PAGES_PLACEHOLDER");
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  // ACIKLAMA: pageObjectIds degiskeninin Turkce karsiligi "sayfa nesne kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pageObjectIds = [];
  pages.forEach((pageLines) => {
    // ACIKLAMA: stream degiskeninin Turkce karsiligi "stream"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const stream = pageLines
      .map((line) => `BT /F1 ${line.size || 10} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm (${escapePdfString(line.text)}) Tj ET`)
      .join("\n");
    // ACIKLAMA: contentId degiskeninin Turkce karsiligi "icerik kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    // ACIKLAMA: pageId degiskeninin Turkce karsiligi "sayfa kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pageId = addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageObjectIds.push(pageId);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  // ACIKLAMA: pdf degiskeninin Turkce karsiligi "PDF"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let pdf = "%PDF-1.4\n";
  // ACIKLAMA: offsets degiskeninin Turkce karsiligi "offsets"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const offsets = [0];
  objects.forEach((content, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });
  // ACIKLAMA: xrefOffset degiskeninin Turkce karsiligi "xref offset"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

// ACIKLAMA: downloadPdfPreviewReport fonksiyonunun Turkce karsiligi "indir PDF onizle report"; ilgili uygulama islemini calistirir.
function downloadPdfPreviewReport() {
  // ACIKLAMA: previewReport degiskeninin Turkce karsiligi "onizle report"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previewReport = document.querySelector("#pdfPreviewOverlay .pdf-preview-report");
  if (!previewReport) {
    return;
  }
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = collectPdfPreviewLines(previewReport);
  // ACIKLAMA: blob degiskeninin Turkce karsiligi "dosya parcasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const blob = createSimplePdfBlob(lines);
  downloadBlob(blob, `akis-butce-kayitlari-${getExportStamp()}.pdf`);
}

// ACIKLAMA: exportFilteredTransactionsExcel fonksiyonunun Turkce karsiligi "disa aktar filtrelenmis islemler Excel"; veriyi dosya veya rapor olarak disa aktarir.
function exportFilteredTransactionsExcel() {
  // ACIKLAMA: filtered degiskeninin Turkce karsiligi "filtrelenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const filtered = getVisibleFilteredTransactions();

  if (!filtered.length) {
    alert("Excel almak için filtreye uygun kayıt bulunamadı.");
    return;
  }

  // ACIKLAMA: rows degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: html degiskeninin Turkce karsiligi "HTML"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: downloadBlob fonksiyonunun Turkce karsiligi "indir dosya parcasi"; ilgili uygulama islemini calistirir.
function downloadBlob(blob, filename) {
  // ACIKLAMA: url degiskeninin Turkce karsiligi "adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const url = URL.createObjectURL(blob);
  // ACIKLAMA: link degiskeninin Turkce karsiligi "link"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ACIKLAMA: getExportStamp fonksiyonunun Turkce karsiligi "al disa aktar stamp"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getExportStamp() {
  return getTurkeyTodayISO();
}

// ACIKLAMA: escapeHtml fonksiyonunun Turkce karsiligi "kacisla HTML"; ilgili uygulama islemini calistirir.
function escapeHtml(value) {
  // ACIKLAMA: div degiskeninin Turkce karsiligi "div"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const div = document.createElement("div");
  div.textContent = String(value || "");
  return div.innerHTML;
}

// ACIKLAMA: formatTransactionAmountForExport fonksiyonunun Turkce karsiligi "disa aktarim icin islem tutarini bicimlendir"; degeri ekranda okunur bicime cevirir.
function formatTransactionAmountForExport(item) {
  if (item?.type === "transfer") {
    // ACIKLAMA: fee degiskeninin Turkce karsiligi "ucret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const fee = Math.max(0, Number(item.transferFee || 0));
    return `Transfer ${currency.format(Number(item.amount || 0))}${fee ? ` + ücret ${currency.format(fee)}` : ""}`;
  }

  return `${item?.type === "income" ? "+" : "-"} ${currency.format(Number(item?.amount || 0))}`;
}

// ACIKLAMA: getTransactionTypeLabel fonksiyonunun Turkce karsiligi "al islem tur etiket"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionTypeLabel(type) {
  if (type === "income") return "Gelir";
  if (type === "transfer") return "Transfer";
  return "Gider";
}

// ACIKLAMA: importTransactions fonksiyonunun Turkce karsiligi "ice aktar islemler"; veriyi uygulamaya ice aktarir.
function importTransactions(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  // ACIKLAMA: reader degiskeninin Turkce karsiligi "reader"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const reader = new FileReader();
  reader.onload = () => {
    try {
      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsed = JSON.parse(String(reader.result));
      // ACIKLAMA: sourceTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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

// ACIKLAMA: generateSyncCode fonksiyonunun Turkce karsiligi "generate esitle code"; bulut ve yerel veri esitleme akisini yonetir.
function generateSyncCode() {
  // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
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

// ACIKLAMA: copySyncCode fonksiyonunun Turkce karsiligi "kopyala esitle code"; bulut ve yerel veri esitleme akisini yonetir.
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

// ACIKLAMA: importSyncCode fonksiyonunun Turkce karsiligi "ice aktar esitle code"; bulut ve yerel veri esitleme akisini yonetir.
function importSyncCode() {
  // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const raw = syncPayload.value.trim();

  if (!raw) {
    syncStatus.textContent = "Önce bir paylaşım kodu yapıştır.";
    return;
  }

  try {
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = JSON.parse(raw);
    // ACIKLAMA: sourceTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const sourceTransactions = Array.isArray(parsed) ? parsed : parsed.transactions;

    if (!Array.isArray(sourceTransactions)) {
      throw new Error("Geçersiz paylaşım kodu");
    }

    // ACIKLAMA: validTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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

// ACIKLAMA: initCloud fonksiyonunun Turkce karsiligi "baslat bulut"; bulut ve yerel veri esitleme akisini yonetir.
function initCloud() {
  renderAuthState();

  if (!window.firebase) {
    cloudStatus.textContent = "Firebase dosyaları yüklenemedi. Bağlantıyı kontrol et veya uygulamayı yayınlı adresten aç.";
    return;
  }

  // ACIKLAMA: config degiskeninin Turkce karsiligi "config"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: enableFirestoreOfflineCache fonksiyonunun Turkce karsiligi "enable Firestore offline onbellek"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: ensureCloudReady fonksiyonunun Turkce karsiligi "garanti et bulut hazir"; bulut ve yerel veri esitleme akisini yonetir.
function ensureCloudReady(statusElement = cloudStatus) {
  if (firebaseAuth && firebaseDb) {
    return true;
  }

  initCloud();
  // ACIKLAMA: ready degiskeninin Turkce karsiligi "hazir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const ready = Boolean(firebaseAuth && firebaseDb);

  if (!ready && statusElement && statusElement !== cloudStatus) {
    statusElement.textContent = cloudStatus.textContent;
  }

  return ready;
}

// ACIKLAMA: hasUsableFirebaseConfig fonksiyonunun Turkce karsiligi "var mi kullanilabilir Firebase config"; Firebase veya kimlik dogrulama islemlerini yonetir.
function hasUsableFirebaseConfig(config) {
  // ACIKLAMA: requiredKeys degiskeninin Turkce karsiligi "gerekli anahtarlar"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  return (
    config &&
    requiredKeys.every((key) => {
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const value = String(config[key] || "");
      return value && !value.includes("BURAYA_") && !value.includes("PROJECT_ID");
    })
  );
}

// ACIKLAMA: showAuthPanel fonksiyonunun Turkce karsiligi "goster kimlik dogrulama panel"; Firebase veya kimlik dogrulama islemlerini yonetir.
function showAuthPanel(panelName) {
  // ACIKLAMA: panels degiskeninin Turkce karsiligi "panels"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openSignupPanel fonksiyonunun Turkce karsiligi "ac signup panel"; ilgili pencereyi veya ekrani acar.
function openSignupPanel() {
  // ACIKLAMA: loginValue degiskeninin Turkce karsiligi "login deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openResetPanel fonksiyonunun Turkce karsiligi "ac sifirla panel"; ilgili pencereyi veya ekrani acar.
function openResetPanel() {
  // ACIKLAMA: loginValue degiskeninin Turkce karsiligi "login deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const loginValue = authEmail.value.trim();

  resetEmail.value = loginValue.includes("@") ? loginValue.toLowerCase() : "";
  resetStatus.textContent = "";
  showAuthPanel("reset");
  setTimeout(() => resetEmail.focus(), 0);
}

// ACIKLAMA: signInWithEmail fonksiyonunun Turkce karsiligi "isaret in with e-posta"; AI destekli okuma veya API istegi akisini calistirir.
async function signInWithEmail() {
  // ACIKLAMA: credentials degiskeninin Turkce karsiligi "credentials"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: createAccountWithEmail fonksiyonunun Turkce karsiligi "olustur hesap with e-posta"; AI destekli okuma veya API istegi akisini calistirir.
async function createAccountWithEmail(event) {
  event.preventDefault();
  // ACIKLAMA: credentials degiskeninin Turkce karsiligi "credentials"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credentials = getSignupCredentials();

  if (!credentials) {
    return;
  }

  if (!ensureCloudReady(resetStatus)) {
    return;
  }

  try {
    signupStatus.textContent = "Hesap oluşturuluyor...";
    // ACIKLAMA: userCredential degiskeninin Turkce karsiligi "kullanici credential"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: sendPasswordReset fonksiyonunun Turkce karsiligi "send sifre sifirla"; ilgili uygulama islemini calistirir.
async function sendPasswordReset(event) {
  event.preventDefault();
  // ACIKLAMA: email degiskeninin Turkce karsiligi "e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: signOutUser fonksiyonunun Turkce karsiligi "isaret out kullanici"; ilgili uygulama islemini calistirir.
async function signOutUser() {
  if (!firebaseAuth) {
    return;
  }

  closeProfileModal();
  currentUser = null;
  renderAuthState();
  await firebaseAuth.signOut();
}

// ACIKLAMA: openProfileModal fonksiyonunun Turkce karsiligi "profil penceresini ac"; ilgili pencereyi veya ekrani acar.
function openProfileModal() {
  if (!currentUser) {
    return;
  }

  switchView("userView");
  fillProfileForm();
  setTimeout(() => profileUsername?.focus(), 0);
}

// ACIKLAMA: fillProfileForm fonksiyonunun Turkce karsiligi "fill profil form"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: closeProfileModal fonksiyonunun Turkce karsiligi "kapat profil pencere"; ilgili pencereyi veya ekrani kapatir.
function closeProfileModal() {
  if (!profileModal) {
    return;
  }

  profileModal.hidden = true;
}

// ACIKLAMA: updateProfile fonksiyonunun Turkce karsiligi "guncelle profil"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
async function updateProfile(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth) {
    profileStatus.textContent = "Profil güncellemek için giriş yapmalısın.";
    return;
  }

  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = profileUsername.value.trim();
  // ACIKLAMA: currentPassword degiskeninin Turkce karsiligi "mevcut sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentPassword = profileCurrentPassword.value;
  // ACIKLAMA: nextPassword degiskeninin Turkce karsiligi "sonraki sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextPassword = profilePassword.value;

  if (!username) {
    profileStatus.textContent = "Kullanıcı adı boş olamaz.";
    return;
  }

  if (nextPassword && nextPassword.length < 6) {
    profileStatus.textContent = "Yeni şifre en az 6 karakter olmalı.";
    return;
  }

  // ACIKLAMA: usernameChanged degiskeninin Turkce karsiligi "kullanici adi changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usernameChanged = username !== getUserDisplayName(currentUser);
  // ACIKLAMA: passwordChanged degiskeninin Turkce karsiligi "sifre changed"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: reauthenticateCurrentUser fonksiyonunun Turkce karsiligi "reauthenticate mevcut kullanici"; Firebase veya kimlik dogrulama islemlerini yonetir.
async function reauthenticateCurrentUser(password) {
  // ACIKLAMA: credential degiskeninin Turkce karsiligi "credential"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credential = window.firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
  await currentUser.reauthenticateWithCredential(credential);
}

// ACIKLAMA: openDeleteAccountModal fonksiyonunun Turkce karsiligi "ac sil hesap pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closeDeleteAccountModal fonksiyonunun Turkce karsiligi "kapat sil hesap pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: requestDeleteAccountConfirmation fonksiyonunun Turkce karsiligi "istek sil hesap confirmation"; secilen kaydi siler veya listeden kaldirir.
function requestDeleteAccountConfirmation(event) {
  event.preventDefault();

  if (!currentUser || !firebaseAuth || !firebaseDb) {
    deleteAccountStatus.textContent = "Kullanıcı silmek için giriş yapmalısın.";
    return;
  }

  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = deleteUserPassword.value;
  // ACIKLAMA: passwordConfirm degiskeninin Turkce karsiligi "sifre onay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: closeConfirmDeleteAccountModal fonksiyonunun Turkce karsiligi "kapat onay sil hesap pencere"; ilgili pencereyi veya ekrani kapatir.
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

// ACIKLAMA: deleteCurrentUserAccount fonksiyonunun Turkce karsiligi "sil mevcut kullanici hesap"; secilen kaydi siler veya listeden kaldirir.
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

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: deleteUserCloudData fonksiyonunun Turkce karsiligi "sil kullanici bulut veri"; secilen kaydi siler veya listeden kaldirir.
async function deleteUserCloudData(userId) {
  // ACIKLAMA: collection degiskeninin Turkce karsiligi "koleksiyon"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const collection = getUserTransactionsCollection(userId);
  // ACIKLAMA: snapshot degiskeninin Turkce karsiligi "snapshot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const snapshot = await collection.get();
  // ACIKLAMA: batch degiskeninin Turkce karsiligi "toplu islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let batch = firebaseDb.batch();
  // ACIKLAMA: operationCount degiskeninin Turkce karsiligi "operation sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: clearUserLocalData fonksiyonunun Turkce karsiligi "temizle kullanici yerel veri"; ilgili uygulama islemini calistirir.
function clearUserLocalData(userId) {
  [
    STORAGE_KEY,
    ASSETS_STORAGE_KEY,
    BES_STORAGE_KEY,
    PAYMENT_ACCOUNTS_STORAGE_KEY,
    DELETED_TRANSACTIONS_STORAGE_KEY,
    DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY,
    DELETED_TRANSFER_TOMBSTONES_STORAGE_KEY,
  ].forEach((baseKey) => {
    localStorage.removeItem(`${baseKey}-${userId}`);
  });
}

// ACIKLAMA: getAuthCredentials fonksiyonunun Turkce karsiligi "al kimlik dogrulama credentials"; Firebase veya kimlik dogrulama islemlerini yonetir.
function getAuthCredentials() {
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = authEmail.value.trim();
  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = authPassword.value;

  if (!username || password.length < 6) {
    cloudStatus.textContent = "Kullanıcı adı/e-posta ve en az 6 karakterli şifre gir.";
    return null;
  }

  return { email: usernameToEmail(username), password, username };
}

// ACIKLAMA: getSignupCredentials fonksiyonunun Turkce karsiligi "al signup credentials"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getSignupCredentials() {
  // ACIKLAMA: email degiskeninin Turkce karsiligi "e-posta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const email = signupEmail.value.trim().toLowerCase();
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const username = signupUsername.value.trim();
  // ACIKLAMA: password degiskeninin Turkce karsiligi "sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const password = signupPassword.value;
  // ACIKLAMA: confirmPassword degiskeninin Turkce karsiligi "onay sifre"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: loadLastUsername fonksiyonunun Turkce karsiligi "yukle son kullanici adi"; ilgili uygulama islemini calistirir.
function loadLastUsername() {
  try {
    return localStorage.getItem(LAST_USERNAME_KEY) || "";
  } catch {
    return "";
  }
}

// ACIKLAMA: saveLastUsername fonksiyonunun Turkce karsiligi "kaydet son kullanici adi"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function saveLastUsername(emailOrUsername) {
  // ACIKLAMA: username degiskeninin Turkce karsiligi "kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: usernameToEmail fonksiyonunun Turkce karsiligi "kullanici adi ile e-posta"; AI destekli okuma veya API istegi akisini calistirir.
function usernameToEmail(username) {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = String(username || "").trim();

  if (value.includes("@")) {
    return value.toLowerCase();
  }

  // ACIKLAMA: safeUsername degiskeninin Turkce karsiligi "guvenli kullanici adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeUsername = normalizeBankText(value).replace(/\s+/g, "");
  return `${safeUsername}@${USERNAME_EMAIL_DOMAIN}`;
}

// ACIKLAMA: emailToUsername fonksiyonunun Turkce karsiligi "e-posta ile kullanici adi"; AI destekli okuma veya API istegi akisini calistirir.
function emailToUsername(email) {
  // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const value = String(email || "");
  // ACIKLAMA: suffix degiskeninin Turkce karsiligi "suffix"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const suffix = `@${USERNAME_EMAIL_DOMAIN}`;

  return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

// ACIKLAMA: getUserDisplayName fonksiyonunun Turkce karsiligi "al kullanici display adi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getUserDisplayName(user = currentUser) {
  if (!user) {
    return "";
  }

  return (user.displayName || emailToUsername(user.email) || "").trim();
}

// ACIKLAMA: handleAuthStateChanged fonksiyonunun Turkce karsiligi "handle kimlik dogrulama durum changed"; Firebase veya kimlik dogrulama islemlerini yonetir.
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

  // ACIKLAMA: anonymousLocalTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousLocalTransactions = getCloudReadyTransactions(transactions);
  // ACIKLAMA: anonymousLocalAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const anonymousLocalAssets = getCloudReadyAssets(assets);
  // ACIKLAMA: anonymousLocalBesAccounts degiskeninin Turkce karsiligi "anonymous yerel BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const anonymousLocalBesAccounts = getCloudReadyBesAccounts(besAccounts);
  // ACIKLAMA: anonymousLocalPaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const anonymousLocalPaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  // ACIKLAMA: anonymousLocalCategories degiskeninin Turkce karsiligi "anonymous yerel kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const anonymousLocalCategories = normalizeCategoryState(transactionCategories);
  // ACIKLAMA: anonymousDeletedTransactionState gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousDeletedTransactionState = getDeletedTransactionStateSnapshot();
  // ACIKLAMA: anonymousLocalTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const anonymousLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();
  currentUser = user;
  deletedTransactionIds = loadDeletedTransactionIds();
  deletedTransactionSignatures = loadDeletedTransactionSignatures();
  deletedTransferTombstones = loadDeletedTransferTombstones();
  applyDeletedTransactionState(anonymousDeletedTransactionState, getDeletedTransactionStateSnapshot());
  refreshCardReminderSettingsForCurrentUser();
  // ACIKLAMA: userLocalTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const userLocalTransactions = getCloudReadyTransactions(loadTransactions());
  // ACIKLAMA: userLocalTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const userLocalTransactionsUpdatedAt = loadTransactionsStateUpdatedAt();
  // ACIKLAMA: userLocalAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const userLocalAssets = getCloudReadyAssets(loadAssets());
  // ACIKLAMA: userLocalBesAccounts degiskeninin Turkce karsiligi "kullanici yerel BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const userLocalBesAccounts = getCloudReadyBesAccounts(loadBesAccounts());
  // ACIKLAMA: userLocalPaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const userLocalPaymentAccounts = getCloudReadyPaymentAccounts(loadPaymentAccounts());
  // ACIKLAMA: userLocalCategories degiskeninin Turkce karsiligi "kullanici yerel kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: cloudProfile degiskeninin Turkce karsiligi "bulut profil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const cloudProfile = await fetchCloudProfile(user.uid);
    updateCloudBackupStatus(cloudProfile);
    applyDeletedTransactionState(readCloudDeletedTransactionState(cloudProfile), anonymousDeletedTransactionState);
    // ACIKLAMA: cloudProfileTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudProfileTransactions = readCloudTransactionBackupArray(cloudProfile.transactionsBackup);
    // ACIKLAMA: cloudCollectionTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    let cloudCollectionTransactions = [];

    try {
      cloudCollectionTransactions = await fetchCloudTransactions(user.uid, { source: "server" });
    } catch {
      cloudCollectionTransactions = await fetchCloudTransactions(user.uid).catch(() => []);
    }

    // ACIKLAMA: cloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudTransactions = mergeTransactions(cloudProfileTransactions, cloudCollectionTransactions);
    // ACIKLAMA: localTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const localTransactions = mergeTransactions(userLocalTransactions, anonymousLocalTransactions);
    // ACIKLAMA: localTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const localTransactionsUpdatedAt = Math.max(
      userLocalTransactionsUpdatedAt,
      anonymousLocalTransactionsUpdatedAt,
      getTransactionsNewestMutationTimestamp(localTransactions)
    );
    // ACIKLAMA: cloudTransactionsUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const cloudTransactionsUpdatedAt =
      getRecordTimestamp(cloudProfile?.transactionsStateUpdatedAt) ||
      getRecordTimestamp(cloudProfile?.transactionsBackupUpdatedAt) ||
      getTransactionsNewestMutationTimestamp(cloudTransactions);

    transactions = mergeTransactions(cloudTransactions, localTransactions);
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
    // ACIKLAMA: pendingLocalTransactionUpserts degiskeninin Turkce karsiligi "bekleyen yerel islem upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pendingLocalTransactionUpserts = getPendingLocalTransactionUpserts(localTransactions, cloudTransactions);
    // ACIKLAMA: pendingLocalTransactionDeletes degiskeninin Turkce karsiligi "bekleyen yerel islem deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pendingLocalTransactionDeletes = getPendingLocalTransactionDeletes(cloudTransactions);
    // ACIKLAMA: hasStaleLocalSyncFlag degiskeninin Turkce karsiligi "var mi stale yerel esitle flag"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const hasStaleLocalSyncFlag = loadTransactionsCloudDirtyAt() > 0 || isTransactionsCloudFullSyncRequired();
    // ACIKLAMA: hasPendingLocalTransactionSync gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const hasPendingLocalTransactionSync =
      pendingLocalTransactionUpserts.length > 0 ||
      pendingLocalTransactionDeletes.length > 0;

    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
    persistTransactions({ syncCloud: false });
    persistAssets({ syncCloud: false });
    persistBesAccounts({ syncCloud: false });
    persistPaymentAccounts({ syncCloud: false });
    persistTransactionCategories({ syncCloud: false });
    syncCategorySelects();
    render();
    // ACIKLAMA: syncTasks degiskeninin Turkce karsiligi "esitle tasks"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const syncTasks = [syncUserProfileToCloud()];
    if (hasPendingLocalTransactionSync) {
      syncTasks.unshift(syncTransactionsToCloud({
        replace: false,
        upserts: pendingLocalTransactionUpserts,
        deletes: pendingLocalTransactionDeletes,
      }));
    } else if (hasStaleLocalSyncFlag) {
      clearTransactionsCloudFullSyncRequired();
      clearTransactionsCloudDirty();
    }
    // ACIKLAMA: syncResults degiskeninin Turkce karsiligi "esitle results"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const syncResults = await Promise.allSettled(syncTasks);
    // ACIKLAMA: failedSync degiskeninin Turkce karsiligi "failed esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const failedSync = syncResults.find((result) => result.status === "rejected");
    subscribeCloudTransactions(user.uid);
    subscribeCloudProfile(user.uid);
    bindPendingCloudSyncEvents();
    retryPendingTransactionsCloudSync();
    if (failedSync) {
      cloudStatus.textContent = `Bulut eşitleme tamamlanamadı: ${failedSync.reason?.message || "Bilinmeyen hata"}`;
    } else if (hasPendingLocalTransactionSync) {
      cloudStatus.textContent = `${transactions.length} kayıt Firebase ile eşitlendi.`;
    } else {
      cloudStatus.textContent = `${transactions.length} kayıt Firebase'den yüklendi.`;
    }
    return;
    cloudStatus.textContent = `${transactions.length} kayıt Firebase profil yedeğiyle eşitlendi.`;
  } catch (error) {
    cloudStatus.textContent = `Bulut kayıtları yüklenemedi: ${error.message}`;
  }
}


// ACIKLAMA: setLoggedOutVisualState fonksiyonunun Turkce karsiligi "ayarla logged out visual durum"; ilgili uygulama islemini calistirir.
function setLoggedOutVisualState() {
  document.documentElement.classList.add("auth-logged-out");
  document.body.classList.add("auth-logged-out");

  if (appShell) {
    appShell.hidden = true;
    appShell.setAttribute("aria-hidden", "true");
    appShell.classList.remove("menu-open");
  }

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (loginScreen) {
    loginScreen.hidden = !startupSplashFinished;
    loginScreen.setAttribute("aria-hidden", loginScreen.hidden ? "true" : "false");
  }

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.hidden = true;
  });

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

// ACIKLAMA: setLoggedInVisualState fonksiyonunun Turkce karsiligi "ayarla logged in visual durum"; ilgili uygulama islemini calistirir.
function setLoggedInVisualState() {
  document.documentElement.classList.remove("auth-logged-out");
  document.body.classList.remove("auth-logged-out");

  if (loginScreen) {
    loginScreen.hidden = true;
    loginScreen.setAttribute("aria-hidden", "true");
  }

  if (appShell) {
    appShell.hidden = !startupSplashFinished;
    appShell.setAttribute("aria-hidden", appShell.hidden ? "true" : "false");
  }
}

// ACIKLAMA: renderAuthState fonksiyonunun Turkce karsiligi "ekrana bas kimlik dogrulama durum"; ilgili ekran, liste veya kartlari ekrana basar.
function renderAuthState() {
  // ACIKLAMA: signedIn degiskeninin Turkce karsiligi "isaretli in"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const signedIn = Boolean(currentUser);
  // ACIKLAMA: hasOpenAuthSubPanel degiskeninin Turkce karsiligi "var mi ac kimlik dogrulama sub panel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasOpenAuthSubPanel =
    !signedIn && ((signupForm && !signupForm.hidden) || (resetPasswordForm && !resetPasswordForm.hidden));

  if (signedIn) {
    setLoggedInVisualState();
  } else {
    setLoggedOutVisualState();
  }

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
    bindPendingCloudSyncEvents();
    window.setTimeout(() => retryPendingTransactionsCloudSync(), 1200);
  } else {
    authEmail.value = loadLastUsername();
    authPassword.value = "";
    activeView = "homeView";
    updateCloudBackupStatus();
  }
}

// ACIKLAMA: fetchCloudProfile fonksiyonunun Turkce karsiligi "getir bulut profil"; bulut ve yerel veri esitleme akisini yonetir.
function fetchCloudProfile(userId) {
  return firebaseDb
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => (doc.exists ? doc.data() || {} : {}));
}

// ACIKLAMA: subscribeCloudProfile fonksiyonunun Turkce karsiligi "abonelik baslat bulut profil"; bulut ve yerel veri esitleme akisini yonetir.
function subscribeCloudProfile(userId) {
  profileUnsubscribe = firebaseDb
    .collection("users")
    .doc(userId)
    .onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const data = doc.data() || {};
        updateCloudBackupStatus(data);

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

        if (applyDeletedTransactionState(readCloudDeletedTransactionState(data))) {
          transactions = mergeTransactions(transactions);
          persistTransactions({ syncCloud: false });
        }

        if (Array.isArray(data.transactionsBackup)) {
          // ACIKLAMA: profileTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
          const profileTransactions = readCloudTransactionBackupArray(data.transactionsBackup);
          if (profileTransactions.length) {
            transactions = mergeTransactions(transactions, profileTransactions);
            persistTransactions({ syncCloud: false });
            transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
            persistTransactionCategories({ syncCloud: false });
            syncCategorySelects();
          }
        }

        refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
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

// ACIKLAMA: fetchCloudTransactions fonksiyonunun Turkce karsiligi "getir bulut islemler"; bulut ve yerel veri esitleme akisini yonetir.
function fetchCloudTransactions(userId, options = {}) {
  // ACIKLAMA: getOptions degiskeninin Turkce karsiligi "al options"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const getOptions = options.source ? { source: options.source } : undefined;
  return getUserTransactionsCollection(userId)
    .get(getOptions)
    .then((snapshot) => snapshot.docs.map(readCloudTransaction).filter(Boolean).filter((item) => !isTransactionDeleted(item)));
}

// ACIKLAMA: subscribeCloudTransactions fonksiyonunun Turkce karsiligi "abonelik baslat bulut islemler"; bulut ve yerel veri esitleme akisini yonetir.
function subscribeCloudTransactions(userId) {
  cloudUnsubscribe = getUserTransactionsCollection(userId).onSnapshot(
    { includeMetadataChanges: true },
    (snapshot) => {
      // ACIKLAMA: cloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
      const cloudTransactions = snapshot.docs
        .map(readCloudTransaction)
        .filter(Boolean)
        .filter((item) => !isTransactionDeleted(item));

      if (snapshot.metadata?.hasPendingWrites || cloudTransactionsSyncInFlight) {
        cloudStatus.textContent = `${transactions.length} kayıt buluta yazılıyor...`;
        return;
      }

      // ACIKLAMA: localUpdatedAt degiskeninin Turkce karsiligi "yerel updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const localUpdatedAt = Math.max(
        loadTransactionsStateUpdatedAt(),
        getTransactionsNewestMutationTimestamp(transactions)
      );
      // ACIKLAMA: cloudProfileUpdatedAt degiskeninin Turkce karsiligi "bulut profil updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cloudProfileUpdatedAt = 0;
      // ACIKLAMA: cloudUpdatedAt degiskeninin Turkce karsiligi "bulut updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const cloudUpdatedAt = getTransactionsNewestMutationTimestamp(cloudTransactions);

      if (transactions.length && localUpdatedAt > cloudUpdatedAt && snapshot.metadata?.fromCache) {
        cloudStatus.textContent = `${transactions.length} kayıt yerelde daha güncel; Firebase yazımı bekleniyor.`;
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
        return;
      }

      transactions = mergeTransactions(transactions, cloudTransactions);
      transactionCategories = mergeCategoryStates(transactionCategories, getTransactionCategoriesFromRecords(transactions));
      persistTransactionCategories({ syncCloud: false });
      syncCategorySelects();
      persistTransactions({ syncCloud: false });
      refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
      render();
      // ACIKLAMA: sourceLabel degiskeninin Turkce karsiligi "kaynak etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const sourceLabel = snapshot.metadata?.fromCache ? "yerel önbellekten" : "buluttan";
      cloudStatus.textContent = `${transactions.length} kayıt ${sourceLabel} güncel.`;
    },
    (error) => {
      cloudStatus.textContent = `Bulut dinleme hatası: ${error.message}`;
    }
  );
}

// ACIKLAMA: getCloudWriteBatchLimit fonksiyonunun Turkce karsiligi "al bulut yaz toplu islem limit"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudWriteBatchLimit() {
  // Firestore batch limiti 500'dür. Profil güncellemesi ve güvenli pay için 450 kullanıyoruz.
  return 450;
}

// ACIKLAMA: commitCloudOperationsInChunks fonksiyonunun Turkce karsiligi "kaydet bulut operations in parcalar"; bulut ve yerel veri esitleme akisini yonetir.
async function commitCloudOperationsInChunks(operations = []) {
  // ACIKLAMA: limit degiskeninin Turkce karsiligi "limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limit = getCloudWriteBatchLimit();

  for (let index = 0; index < operations.length; index += limit) {
    // ACIKLAMA: batch degiskeninin Turkce karsiligi "toplu islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const batch = firebaseDb.batch();
    // ACIKLAMA: chunk degiskeninin Turkce karsiligi "parca"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const chunk = operations.slice(index, index + limit);

    chunk.forEach((operation) => {
      if (operation.type === "delete") {
        batch.delete(operation.ref);
        return;
      }

      batch.set(operation.ref, operation.data, operation.options || { merge: true });
    });

    await batch.commit();
  }
}

// ACIKLAMA: getJsonByteSize fonksiyonunun Turkce karsiligi "al JSON byte boyut"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getJsonByteSize(value) {
  try {
    return new Blob([JSON.stringify(value) || ""]).size;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

// ACIKLAMA: createProfileTransactionBackupFields fonksiyonunun Turkce karsiligi "olustur profil islem yedekle alanlar"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createProfileTransactionBackupFields(safeTransactions = [], transactionsStateUpdatedAt = Date.now()) {
  // ACIKLAMA: backup degiskeninin Turkce karsiligi "yedekle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const backup = safeTransactions.map(toCloudTransactionBackup);
  // ACIKLAMA: fullBackupFields degiskeninin Turkce karsiligi "tam yedekle alanlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const fullBackupFields = {
    transactionsBackup: backup,
    transactionsBackupUpdatedAt: transactionsStateUpdatedAt,
    transactionsBackupMode: "full",
    transactionsBackupCount: backup.length,
  };

  if (getJsonByteSize(fullBackupFields) <= MAX_PROFILE_TRANSACTIONS_BACKUP_BYTES) {
    return fullBackupFields;
  }

  return {
    transactionsBackup: window.firebase.firestore.FieldValue.delete(),
    transactionsBackupUpdatedAt: transactionsStateUpdatedAt,
    transactionsBackupMode: "collection_only",
    transactionsBackupCount: backup.length,
    transactionsBackupSkippedAt: transactionsStateUpdatedAt,
  };
}

// ACIKLAMA: syncTransactionsToCloud fonksiyonunun Turkce karsiligi "islemleri bulutla esitle"; bulut ve yerel veri esitleme akisini yonetir.
function syncTransactionsToCloud(options = {}) {
  const { replace = false, upserts = null, deletes = null } = options;

  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const user = currentUser;
  // ACIKLAMA: safeTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  let safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));
  // ACIKLAMA: deltaUpserts degiskeninin Turkce karsiligi "delta upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let deltaUpserts = Array.isArray(upserts)
    ? getCloudReadyTransactions(upserts).filter((item) => !isTransactionDeleted(item))
    : null;
  // ACIKLAMA: deltaDeletes degiskeninin Turkce karsiligi "delta deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let deltaDeletes = Array.isArray(deletes)
    ? deletes.map((id) => String(id || "")).filter(Boolean)
    : null;
  // ACIKLAMA: hasDeltaOperations degiskeninin Turkce karsiligi "var mi delta operations"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasDeltaOperations = !replace && (deltaUpserts !== null || deltaDeletes !== null);
  // ACIKLAMA: deletedPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const deletedPayload = getCloudDeletedTransactionPayload();
  // ACIKLAMA: transactionsStateUpdatedAt gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const transactionsStateUpdatedAt = saveTransactionsStateUpdatedAt();
  // ACIKLAMA: syncVersion degiskeninin Turkce karsiligi "esitle version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const syncVersion = ++cloudTransactionsSyncVersion;
  // ACIKLAMA: isLatestSync degiskeninin Turkce karsiligi "mi latest esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isLatestSync = () => syncVersion === cloudTransactionsSyncVersion;
  // ACIKLAMA: shouldAbortStaleFullSync degiskeninin Turkce karsiligi "mali mi abort stale tam esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const shouldAbortStaleFullSync = () => !hasDeltaOperations && !isLatestSync();
  cloudTransactionsSyncInFlight = true;

  // ACIKLAMA: writeTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
  const writeTransactions = async () => {
    try {
    if (shouldAbortStaleFullSync()) {
      return;
    }

    // ACIKLAMA: collection degiskeninin Turkce karsiligi "koleksiyon"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const collection = getUserTransactionsCollection(user.uid);

    if (!replace && !hasDeltaOperations) {
      // ACIKLAMA: latestCloudTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
      const latestCloudTransactions = await withTimeout(
        fetchCloudTransactions(user.uid).catch(() => []),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase kayıtları okunurken zaman aşımı oluştu."
      );

      if (shouldAbortStaleFullSync()) {
        return;
      }

      transactions = mergeTransactions(latestCloudTransactions, transactions);
      localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
      safeTransactions = getCloudReadyTransactions(transactions).filter((item) => !isTransactionDeleted(item));
    }

    if (hasDeltaOperations && deltaUpserts !== null) {
      deltaUpserts = getCloudReadyTransactions(deltaUpserts).filter((item) => !isTransactionDeleted(item));
    }

    // ACIKLAMA: profileBackupFields degiskeninin Turkce karsiligi "profil yedekle alanlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const profileBackupFields = createProfileTransactionBackupFields(safeTransactions, transactionsStateUpdatedAt);
    // ACIKLAMA: profileBackupPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
    const profileBackupPayload = {
      email: user.email || "",
      username: getUserDisplayName(user),
      ...profileBackupFields,
      ...deletedPayload,
      transactionsStateUpdatedAt,
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
    };

    // ACIKLAMA: operations degiskeninin Turkce karsiligi "operations"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const operations = [];

    // ACIKLAMA: deletedIds degiskeninin Turkce karsiligi "silinmis kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const deletedIds = new Set(
      hasDeltaOperations
        ? deltaDeletes || []
        : [
            ...Array.from(deletedTransactionIds || []),
            ...(deletedPayload.deletedTransactionIds || []),
          ]
    );

    deletedIds.forEach((id) => {
      if (id) {
        operations.push({ type: "delete", ref: collection.doc(String(id)) });
      }
    });

    if (replace) {
      // ACIKLAMA: snapshot degiskeninin Turkce karsiligi "snapshot"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const snapshot = await withTimeout(
        collection.get(),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase kayıt listesi alınırken zaman aşımı oluştu."
      );

      if (shouldAbortStaleFullSync()) {
        return;
      }

      // ACIKLAMA: currentIds degiskeninin Turkce karsiligi "mevcut kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const currentIds = new Set(safeTransactions.map((item) => item.id));
      snapshot.docs.forEach((doc) => {
        if (!currentIds.has(doc.id)) {
          operations.push({ type: "delete", ref: doc.ref });
        }
      });
    }

    // ACIKLAMA: transactionsToWrite gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
    const transactionsToWrite = hasDeltaOperations ? deltaUpserts || [] : safeTransactions;
    transactionsToWrite.forEach((transaction) => {
      operations.push({
        type: "set",
        ref: collection.doc(transaction.id),
        data: toCloudTransaction(transaction),
        // Düzenlenen kayıtta eski type/category/payment alanları kalmasın diye dokümanı birebir güncelliyoruz.
        options: { merge: false },
      });
    });

    cloudStatus.textContent = "Buluta kaydediliyor...";
    try {
      await withTimeout(
        commitCloudOperationsInChunks(operations),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase transactions yazımı zaman aşımına uğradı."
      );
    } catch (error) {
      if (isLatestSync() || hasDeltaOperations) {
        markTransactionsCloudFullSyncRequired();
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      }
      if (isLatestSync()) {
        // ACIKLAMA: rulesHint degiskeninin Turkce karsiligi "rules hint"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const rulesHint = error?.code === "permission-denied"
          ? " Firebase Console'da firestore.rules dosyasını yayınla."
          : "";
        cloudStatus.textContent =
          `${safeTransactions.length} kayıt Firebase transactions alt koleksiyonuna yazılamadı: ${error.message}.${rulesHint}`;
      }
      return;
    } finally {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
    }

    // ACIKLAMA: profileWarning degiskeninin Turkce karsiligi "profil warning"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    let profileWarning = "";
    try {
      await withTimeout(
        firebaseDb.collection("users").doc(user.uid).set(profileBackupPayload, { merge: true }),
        CLOUD_WRITE_TIMEOUT_MS,
        "Firebase profil yedeği güncellenirken zaman aşımı oluştu."
      );
    } catch (error) {
      profileWarning = ` Profil yedeği güncellenemedi: ${error.message}`;
    }

    if (isLatestSync()) {
      if (hasDeltaOperations && isTransactionsCloudFullSyncRequired()) {
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      } else {
        clearTransactionsCloudFullSyncRequired();
        clearTransactionsCloudDirty(transactionsStateUpdatedAt);
      }
      // ACIKLAMA: backupNote degiskeninin Turkce karsiligi "yedekle note"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const backupNote = profileBackupFields.transactionsBackupMode === "collection_only"
        ? " Profil yedeği büyüdüğü için kayıtların ana kaynağı transactions alt koleksiyonu."
        : "";
      // ACIKLAMA: savedCountText degiskeninin Turkce karsiligi "saved sayi metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const savedCountText = hasDeltaOperations
        ? `${transactionsToWrite.length + deletedIds.size} değişiklik`
        : `${safeTransactions.length} kayıt`;
      cloudStatus.textContent = `${savedCountText} Firebase transactions koleksiyonuna kaydedildi.${backupNote}${profileWarning}`;
    }
    } finally {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
    }
  };

  // ACIKLAMA: runSync degiskeninin Turkce karsiligi "calistir esitle"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const runSync = () =>
    writeTransactions().catch((error) => {
      if (isLatestSync()) {
        cloudTransactionsSyncInFlight = false;
      }
      if (isLatestSync() || hasDeltaOperations) {
        markTransactionsCloudFullSyncRequired();
        markTransactionsCloudDirty();
        schedulePendingTransactionsCloudSync();
      }
      if (isLatestSync()) {
        // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const message = error?.code === "permission-denied"
          ? "Firebase kuralları eski görünüyor. firestore.rules dosyasını Firebase Console'da yayınla."
          : `Firebase'e kaydedilemedi: ${error.message}`;
        cloudStatus.textContent = message;
      }
      throw error;
    });

  cloudWriteQueue = cloudWriteQueue.catch(() => {}).then(runSync);
  return cloudWriteQueue;
}


// ACIKLAMA: pendingTransactionsCloudSyncTimer gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
let pendingTransactionsCloudSyncTimer = null;

// ACIKLAMA: schedulePendingTransactionsCloudSync fonksiyonunun Turkce karsiligi "zamanla bekleyen islemler bulut esitle"; bulut ve yerel veri esitleme akisini yonetir.
function schedulePendingTransactionsCloudSync(delay = 3500) {
  if (pendingTransactionsCloudSyncTimer) {
    window.clearTimeout(pendingTransactionsCloudSyncTimer);
  }

  pendingTransactionsCloudSyncTimer = window.setTimeout(() => {
    pendingTransactionsCloudSyncTimer = null;
    retryPendingTransactionsCloudSync();
  }, delay);
}

// ACIKLAMA: retryPendingTransactionsCloudSync fonksiyonunun Turkce karsiligi "yeniden dene bekleyen islemler bulut esitle"; bulut ve yerel veri esitleme akisini yonetir.
function retryPendingTransactionsCloudSync() {
  if (!currentUser || !firebaseDb || cloudTransactionsSyncInFlight || !loadTransactionsCloudDirtyAt()) {
    return Promise.resolve(false);
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    cloudStatus.textContent = "İnternet bağlantısı bekleniyor; yerel kayıtlar Firebase'e gönderilecek.";
    schedulePendingTransactionsCloudSync(7000);
    return Promise.resolve(false);
  }

  cloudStatus.textContent = "Yerelde kalan kayıtlar Firebase'e gönderiliyor...";
  return fetchCloudTransactions(currentUser.uid, { source: "server" })
    .catch(() => fetchCloudTransactions(currentUser.uid).catch(() => []))
    .then((cloudTransactions) => {
      // ACIKLAMA: pendingUpserts degiskeninin Turkce karsiligi "bekleyen upserts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const pendingUpserts = getPendingLocalTransactionUpserts(transactions, cloudTransactions);
      // ACIKLAMA: pendingDeletes degiskeninin Turkce karsiligi "bekleyen deletes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const pendingDeletes = getPendingLocalTransactionDeletes(cloudTransactions);

      if (!pendingUpserts.length && !pendingDeletes.length) {
        clearTransactionsCloudFullSyncRequired();
        clearTransactionsCloudDirty();
        cloudStatus.textContent = `${transactions.length} kayıt Firebase ile güncel.`;
        return true;
      }

      return syncTransactionsToCloud({
        replace: false,
        upserts: pendingUpserts,
        deletes: pendingDeletes,
      }).then(() => true);
    })
    .catch(() => false);
}

// ACIKLAMA: bindPendingCloudSyncEvents fonksiyonunun Turkce karsiligi "bagla bekleyen bulut esitle events"; bulut ve yerel veri esitleme akisini yonetir.
function bindPendingCloudSyncEvents() {
  if (window.__akisBudgetPendingCloudSyncBound) {
    return;
  }

  window.__akisBudgetPendingCloudSyncBound = true;

  window.addEventListener("online", () => retryPendingTransactionsCloudSync());
  window.addEventListener("focus", () => retryPendingTransactionsCloudSync());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      retryPendingTransactionsCloudSync();
    }
  });
}

// ACIKLAMA: syncUserProfileToCloud fonksiyonunun Turkce karsiligi "esitle kullanici profil ile bulut"; bulut ve yerel veri esitleme akisini yonetir.
function syncUserProfileToCloud() {
  if (!currentUser || !firebaseDb) {
    return Promise.resolve();
  }

  // ACIKLAMA: user degiskeninin Turkce karsiligi "kullanici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const user = currentUser;
  // ACIKLAMA: syncVersion degiskeninin Turkce karsiligi "esitle version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const syncVersion = ++cloudProfileSyncVersion;
  // ACIKLAMA: safeAssets varlik/portfoy ekraniyla ilgili veriyi veya DOM elemanini tutar.
  const safeAssets = getCloudReadyAssets(assets);
  // ACIKLAMA: safeBesAccounts degiskeninin Turkce karsiligi "guvenli BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeBesAccounts = getCloudReadyBesAccounts(besAccounts);
  // ACIKLAMA: safePaymentAccounts kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const safePaymentAccounts = getCloudReadyPaymentAccounts(paymentAccounts);
  // ACIKLAMA: safeTransactionCategories degiskeninin Turkce karsiligi "guvenli islem kategoriler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const safeTransactionCategories = normalizeCategoryState(transactionCategories);
  // ACIKLAMA: deletedPayload aktarim veya API istegi icin hazirlanan veri paketini tutar.
  const deletedPayload = getCloudDeletedTransactionPayload();

  // ACIKLAMA: syncPromise degiskeninin Turkce karsiligi "esitle promise"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
        ...deletedPayload,
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


// ACIKLAMA: getUserTransactionsCollection fonksiyonunun Turkce karsiligi "al kullanici islemler koleksiyon"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getUserTransactionsCollection(userId) {
  return firebaseDb.collection("users").doc(userId).collection("transactions");
}

// ACIKLAMA: toCloudTransaction fonksiyonunun Turkce karsiligi "ile bulut islem"; bulut ve yerel veri esitleme akisini yonetir.
function toCloudTransaction(transaction) {
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = ensureTransactionCreatedAt(transaction);
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
    createdAt,
    updatedAt: transaction.updatedAt || window.firebase.firestore.FieldValue.serverTimestamp(),
  };
}

// ACIKLAMA: toCloudTransactionBackup fonksiyonunun Turkce karsiligi "ile bulut islem yedekle"; bulut ve yerel veri esitleme akisini yonetir.
function toCloudTransactionBackup(transaction) {
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = ensureTransactionCreatedAt(transaction);
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
    createdAt,
    updatedAt: normalizeCloudTimestamp(transaction.updatedAt) || String(transaction.updatedAt || createdAt || getTurkeyNowDateTime()),
  };
}

// ACIKLAMA: readCloudTransaction fonksiyonunun Turkce karsiligi "oku bulut islem"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudTransaction(doc) {
  // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const data = doc.data() || {};
  // ACIKLAMA: updatedAt degiskeninin Turkce karsiligi "updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const updatedAt = normalizeCloudTimestamp(data.updatedAt);
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt =
    normalizeCloudTimestamp(data.createdAt) ||
    normalizeCloudTimestamp(data.addedAt) ||
    updatedAt ||
    String(data.createdAt || data.addedAt || "");
  // ACIKLAMA: transaction degiskeninin Turkce karsiligi "islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    createdAt,
    updatedAt,
  };

  return isValidTransaction(transaction) ? transaction : null;
}

// ACIKLAMA: readCloudTransactionBackupArray fonksiyonunun Turkce karsiligi "oku bulut islem yedekle dizi"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudTransactionBackupArray(source) {
  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item) =>
      readCloudTransaction({
        id: String(item?.id || ""),
        data: () => item || {},
      })
    )
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item));
}

// ACIKLAMA: getCloudReadyTransactions fonksiyonunun Turkce karsiligi "al bulut hazir islemler"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyTransactions(source) {
  return source.filter((item) => isValidTransaction(item) && !isSampleTransaction(item) && !isTransactionDeleted(item));
}

// ACIKLAMA: getCloudReadyAssets fonksiyonunun Turkce karsiligi "al bulut hazir varliklar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyAssets(source) {
  return readCloudAssets(source);
}

// ACIKLAMA: getCloudReadyBesAccounts fonksiyonunun Turkce karsiligi "al bulut hazir BES hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyBesAccounts(source) {
  return readCloudBesAccounts(source);
}

// ACIKLAMA: getCloudReadyPaymentAccounts fonksiyonunun Turkce karsiligi "al bulut hazir odeme hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function getCloudReadyPaymentAccounts(source) {
  return readCloudPaymentAccounts(source);
}

// ACIKLAMA: readCloudAssets fonksiyonunun Turkce karsiligi "oku bulut varliklar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudAssets(source) {
  return Array.isArray(source) ? source.map(normalizeAsset).filter(Boolean) : [];
}

// ACIKLAMA: readCloudBesAccounts fonksiyonunun Turkce karsiligi "oku bulut BES hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudBesAccounts(source) {
  return Array.isArray(source) ? source.map(normalizeBesAccount).filter(Boolean) : [];
}

// ACIKLAMA: readCloudPaymentAccounts fonksiyonunun Turkce karsiligi "oku bulut odeme hesaplar"; bulut ve yerel veri esitleme akisini yonetir.
function readCloudPaymentAccounts(source) {
  return Array.isArray(source) ? source.map(normalizePaymentAccount).filter(Boolean) : [];
}

// ACIKLAMA: normalizeAsset fonksiyonunun Turkce karsiligi "standartlastir varlik"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeAsset(item) {
  if (!item || typeof item.id !== "string" || !assetDefinitions[item.type]) {
    return null;
  }

  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(item.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  // ACIKLAMA: definition degiskeninin Turkce karsiligi "definition"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizeBesAccount fonksiyonunun Turkce karsiligi "standartlastir BES hesap"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeBesAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  // ACIKLAMA: provider degiskeninin Turkce karsiligi "saglayici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const provider = String(item.provider || "").trim();
  // ACIKLAMA: contribution degiskeninin Turkce karsiligi "contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const contribution = Number(item.contribution || 0);
  // ACIKLAMA: stateContribution degiskeninin Turkce karsiligi "durum contribution"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateContribution = Number(item.stateContribution || 0);
  // ACIKLAMA: stateGain degiskeninin Turkce karsiligi "durum gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const stateGain = Number(item.stateGain || 0);
  // ACIKLAMA: gain degiskeninin Turkce karsiligi "gain"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizePaymentAccount fonksiyonunun Turkce karsiligi "standartlastir odeme hesap"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizePaymentAccount(item) {
  if (!item || typeof item.id !== "string") {
    return null;
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = normalizePaymentAccountType(item.type);
  // ACIKLAMA: name degiskeninin Turkce karsiligi "adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const name = String(item.name || "").trim();
  // ACIKLAMA: balance degiskeninin Turkce karsiligi "bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balance = Number(item.balance || 0);
  // ACIKLAMA: debt degiskeninin Turkce karsiligi "debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debt = Number(item.debt || 0);
  // ACIKLAMA: currentStatementDebt degiskeninin Turkce karsiligi "mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentStatementDebt = Number(item.currentStatementDebt ?? debt);
  // ACIKLAMA: creditPaidTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const creditPaidTotal = Number(item.creditPaidTotal || 0);
  // ACIKLAMA: currentStatementPaidTotal hesaplanan toplam degerin ekranda gosterilecegi alandir.
  const currentStatementPaidTotal = Number(item.currentStatementPaidTotal || 0);
  // ACIKLAMA: debtBaselineVersion degiskeninin Turkce karsiligi "debt baseline version"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debtBaselineVersion = Number(item.debtBaselineVersion || 0);
  // ACIKLAMA: limit degiskeninin Turkce karsiligi "limit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const limit = Number(item.limit || 0);
  // ACIKLAMA: openingBalance degiskeninin Turkce karsiligi "opening bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingBalance = hasStoredMoneyValue(item.openingBalance) ? Number(item.openingBalance) : null;
  // ACIKLAMA: openingDebt degiskeninin Turkce karsiligi "opening debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const openingDebt = hasStoredMoneyValue(item.openingDebt) ? Number(item.openingDebt) : null;
  // ACIKLAMA: openingCurrentStatementDebt degiskeninin Turkce karsiligi "opening mevcut statement debt"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    currentStatementDebt: type === "credit_card"
      ? clampCreditCardStatementDebt(debt, currentStatementDebt)
      : 0,
    openingDebt: type === "credit_card" && openingDebt !== null ? roundMoney(openingDebt) : null,
    openingCurrentStatementDebt: type === "credit_card" && openingCurrentStatementDebt !== null ? roundMoney(openingCurrentStatementDebt) : null,
    creditPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(creditPaidTotal)) : 0,
    currentStatementPaidTotal: type === "credit_card" ? Math.max(0, roundMoney(currentStatementPaidTotal)) : 0,
    debtBaselineVersion: type === "credit_card" && Number.isFinite(debtBaselineVersion)
      ? Math.max(0, Math.trunc(debtBaselineVersion))
      : 0,
    creditPaidPeriodKey: type === "credit_card" ? String(item.creditPaidPeriodKey || "") : "",
    balance: type !== "credit_card" ? roundMoney(balance) : 0,
    openingBalance: type !== "credit_card" && openingBalance !== null ? roundMoney(openingBalance) : null,
    note: String(item.note || ""),
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || ""),
  };
}

// ACIKLAMA: mergeRecordsById fonksiyonunun Turkce karsiligi "birlestir kayitlar tarafindan kimlik"; ilgili uygulama islemini calistirir.
function mergeRecordsById(...sources) {
  // ACIKLAMA: merged degiskeninin Turkce karsiligi "merged"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const merged = new Map();

  sources
    .flat()
    .filter((item) => item && typeof item.id === "string")
    .forEach((item) => {
      merged.set(item.id, item);
    });

  return Array.from(merged.values());
}

// ACIKLAMA: normalizeCloudTimestamp fonksiyonunun Turkce karsiligi "standartlastir bulut zaman damgasi"; bulut ve yerel veri esitleme akisini yonetir.
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

// ACIKLAMA: ensureTransactionCreatedAt fonksiyonunun Turkce karsiligi "garanti et islem created at"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function ensureTransactionCreatedAt(item) {
  if (!item) {
    return getTurkeyNowDateTime();
  }

  return (
    normalizeCloudTimestamp(item.createdAt) ||
    normalizeCloudTimestamp(item.addedAt) ||
    normalizeCloudTimestamp(item.updatedAt) ||
    String(item.createdAt || item.addedAt || item.updatedAt || item.transactionAt || "") ||
    getTurkeyNowDateTime()
  );
}

// ACIKLAMA: normalizeTransactionRecord fonksiyonunun Turkce karsiligi "standartlastir islem kayit"; veriyi uygulamanin bekledigi temiz formata cevirir.
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
    createdAt: ensureTransactionCreatedAt(item),
    updatedAt: normalizeCloudTimestamp(item.updatedAt) || String(item.updatedAt || ""),
  };
}

// ACIKLAMA: getTransactionMergeTimestamp fonksiyonunun Turkce karsiligi "al islem birlestir zaman damgasi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionMergeTimestamp(item) {
  return (
    getRecordTimestamp(item?.updatedAt) ||
    getRecordTimestamp(item?.createdAt) ||
    getTransactionSortTimestamp(item) ||
    0
  );
}

// ACIKLAMA: shouldReplaceMergedTransaction fonksiyonunun Turkce karsiligi "mali mi replace merged islem"; ilgili uygulama islemini calistirir.
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

  // ACIKLAMA: existingTime degiskeninin Turkce karsiligi "existing saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingTime = getTransactionMergeTimestamp(existing);
  // ACIKLAMA: nextTime degiskeninin Turkce karsiligi "sonraki saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextTime = getTransactionMergeTimestamp(next);

  if (nextTime !== existingTime) {
    return nextTime > existingTime;
  }

  return String(next.id || "") > String(existing.id || "");
}

// ACIKLAMA: mergeTransactions fonksiyonunun Turkce karsiligi "birlestir islemler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function mergeTransactions(...sources) {
  // ACIKLAMA: byId degiskeninin Turkce karsiligi "tarafindan kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const byId = new Map();

  sources
    .flat()
    .map(normalizeTransactionRecord)
    .filter(Boolean)
    .filter((item) => !isTransactionDeleted(item))
    .forEach((transaction) => {
      // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const existing = byId.get(transaction.id);
      if (shouldReplaceMergedTransaction(existing, transaction)) {
        byId.set(transaction.id, transaction);
      }
    });

  // ACIKLAMA: bySignature degiskeninin Turkce karsiligi "tarafindan imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const bySignature = new Map();
  Array.from(byId.values()).forEach((transaction) => {
    // ACIKLAMA: signature degiskeninin Turkce karsiligi "imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const signature = getTransactionSignature(transaction);
    // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const existing = bySignature.get(signature);

    if (shouldReplaceMergedTransaction(existing, transaction)) {
      bySignature.set(signature, transaction);
    }
  });

  // ACIKLAMA: records degiskeninin Turkce karsiligi "kayitlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const records = Array.from(bySignature.values());
  return coalesceLegacyTransferPairs(removeLegacyRowsCoveredByTransfers(records)).sort(compareTransactionsNewestFirst);
}

// ACIKLAMA: isTransferLikeRecord fonksiyonunun Turkce karsiligi "mi aktarim benzeri kayit"; ilgili uygulama islemini calistirir.
function isTransferLikeRecord(item) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: areSameTransactionAmount fonksiyonunun Turkce karsiligi "mi ayni islem tutar"; ilgili uygulama islemini calistirir.
function areSameTransactionAmount(first, second) {
  return Math.abs(Number(first?.amount || 0) - Number(second?.amount || 0)) < 0.01;
}

// ACIKLAMA: getComparableTransactionMinute fonksiyonunun Turkce karsiligi "al comparable islem minute"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getComparableTransactionMinute(item) {
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTransactionTime(item);
  return time ? time.slice(0, 5) : "";
}

// ACIKLAMA: haveCompatibleTransferTimes fonksiyonunun Turkce karsiligi "have compatible aktarim times"; ilgili uygulama islemini calistirir.
function haveCompatibleTransferTimes(first, second) {
  // ACIKLAMA: firstMinute degiskeninin Turkce karsiligi "ilk minute"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const firstMinute = getComparableTransactionMinute(first);
  // ACIKLAMA: secondMinute degiskeninin Turkce karsiligi "second minute"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const secondMinute = getComparableTransactionMinute(second);
  return !firstMinute || !secondMinute || firstMinute === secondMinute;
}

// ACIKLAMA: hasSameTransferDayAndAmount fonksiyonunun Turkce karsiligi "var mi ayni aktarim gun and tutar"; ilgili uygulama islemini calistirir.
function hasSameTransferDayAndAmount(first, second) {
  return (
    String(first?.date || "") === String(second?.date || "") &&
    areSameTransactionAmount(first, second) &&
    haveCompatibleTransferTimes(first, second)
  );
}

// ACIKLAMA: isLegacySplitRowForTransfer fonksiyonunun Turkce karsiligi "mi legacy bol satir icin aktarim"; ilgili uygulama islemini calistirir.
function isLegacySplitRowForTransfer(transfer, candidate) {
  if (!transfer || !candidate || transfer.type !== "transfer" || candidate.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(transfer, candidate)) {
    return false;
  }

  // ACIKLAMA: sourceId degiskeninin Turkce karsiligi "kaynak kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceId = String(transfer.paymentAccountId || "");
  // ACIKLAMA: targetId degiskeninin Turkce karsiligi "hedef kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const targetId = String(transfer.transferAccountId || "");
  // ACIKLAMA: candidateAccountId degiskeninin Turkce karsiligi "candidate hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidateAccountId = String(candidate.paymentAccountId || "");

  if (!sourceId || !targetId || !candidateAccountId) {
    return false;
  }

  // ACIKLAMA: isSourceExpense degiskeninin Turkce karsiligi "mi kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isSourceExpense = candidate.type === "expense" && candidateAccountId === sourceId;
  // ACIKLAMA: isTargetIncome degiskeninin Turkce karsiligi "mi hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isTargetIncome = candidate.type === "income" && candidateAccountId === targetId;

  return (isSourceExpense || isTargetIncome) && isTransferLikeRecord(candidate);
}

// ACIKLAMA: removeLegacyRowsCoveredByTransfers fonksiyonunun Turkce karsiligi "kaldir legacy satirlar kapsanmis tarafindan transfers"; secilen kaydi siler veya listeden kaldirir.
function removeLegacyRowsCoveredByTransfers(source = []) {
  // ACIKLAMA: transfers degiskeninin Turkce karsiligi "transfers"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isLikelySplitTransferPair fonksiyonunun Turkce karsiligi "mi olasi bol aktarim pair"; AI destekli okuma veya API istegi akisini calistirir.
function isLikelySplitTransferPair(first, second) {
  if (!first || !second || first.type === second.type || first.type === "transfer" || second.type === "transfer") {
    return false;
  }

  if (!hasSameTransferDayAndAmount(first, second)) {
    return false;
  }

  // ACIKLAMA: firstAccountId degiskeninin Turkce karsiligi "ilk hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const firstAccountId = String(first.paymentAccountId || "");
  // ACIKLAMA: secondAccountId degiskeninin Turkce karsiligi "second hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const secondAccountId = String(second.paymentAccountId || "");

  if (!firstAccountId || !secondAccountId || firstAccountId === secondAccountId) {
    return false;
  }

  return isTransferLikeRecord(first) || isTransferLikeRecord(second);
}

// ACIKLAMA: getTransactionPairScore fonksiyonunun Turkce karsiligi "al islem pair puan"; AI destekli okuma veya API istegi akisini calistirir.
function getTransactionPairScore(first, second) {
  // ACIKLAMA: score degiskeninin Turkce karsiligi "puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: buildTransferFromSplitPair fonksiyonunun Turkce karsiligi "olustur aktarim kaynakli bol pair"; AI destekli okuma veya API istegi akisini calistirir.
function buildTransferFromSplitPair(first, second) {
  // ACIKLAMA: expense degiskeninin Turkce karsiligi "gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const expense = first.type === "expense" ? first : second;
  // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const income = first.type === "income" ? first : second;
  // ACIKLAMA: updatedAt degiskeninin Turkce karsiligi "updated at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const updatedAt = [expense.updatedAt, income.updatedAt]
    .filter(Boolean)
    .sort((left, right) => getRecordTimestamp(right) - getRecordTimestamp(left))[0] || getTurkeyNowDateTime();
  // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const createdAt = [expense.createdAt, income.createdAt].filter(Boolean).sort()[0] || expense.createdAt || income.createdAt || updatedAt;
  // ACIKLAMA: notes degiskeninin Turkce karsiligi "notes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const notes = [expense.note, income.note].map((value) => String(value || "").trim()).filter(Boolean);
  // ACIKLAMA: uniqueNotes degiskeninin Turkce karsiligi "unique notes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: coalesceLegacyTransferPairs fonksiyonunun Turkce karsiligi "bir araya getir legacy aktarim pairs"; AI destekli okuma veya API istegi akisini calistirir.
function coalesceLegacyTransferPairs(source = []) {
  // ACIKLAMA: records degiskeninin Turkce karsiligi "kayitlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const records = [...source];
  // ACIKLAMA: usedIds degiskeninin Turkce karsiligi "used kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const usedIds = new Set();
  // ACIKLAMA: result degiskeninin Turkce karsiligi "result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const result = [];

  records.forEach((item) => {
    if (usedIds.has(item.id)) {
      return;
    }

    if (item.type !== "expense") {
      return;
    }

    // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const candidates = records
      .filter((candidate) => !usedIds.has(candidate.id) && candidate.id !== item.id && candidate.type === "income")
      .filter((candidate) => isLikelySplitTransferPair(item, candidate))
      .sort((first, second) => getTransactionPairScore(item, second) - getTransactionPairScore(item, first));

    if (!candidates.length) {
      return;
    }

    // ACIKLAMA: income degiskeninin Turkce karsiligi "gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getLegacyTransferCounterpartIds fonksiyonunun Turkce karsiligi "al legacy aktarim counterpart kimlikler"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getLegacyTransferCounterpartIds(transfer, previousTransaction = null) {
  // ACIKLAMA: ids degiskeninin Turkce karsiligi "kimlikler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: previousWasSourceExpense degiskeninin Turkce karsiligi "previous was kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const previousWasSourceExpense = previousTransaction.type === "expense";
      // ACIKLAMA: candidateIsTargetIncome degiskeninin Turkce karsiligi "candidate mi hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const candidateIsTargetIncome = candidate.type === "income" && String(candidate.paymentAccountId || "") === String(transfer.transferAccountId || "");
      // ACIKLAMA: previousWasTargetIncome degiskeninin Turkce karsiligi "previous was hedef gelir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const previousWasTargetIncome = previousTransaction.type === "income";
      // ACIKLAMA: candidateIsSourceExpense degiskeninin Turkce karsiligi "candidate mi kaynak gider"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const candidateIsSourceExpense = candidate.type === "expense" && String(candidate.paymentAccountId || "") === String(transfer.paymentAccountId || "");

      if ((previousWasSourceExpense && candidateIsTargetIncome) || (previousWasTargetIncome && candidateIsSourceExpense)) {
        ids.add(candidate.id);
      }
    }
  });

  return ids;
}

// ACIKLAMA: isSampleTransaction fonksiyonunun Turkce karsiligi "mi sample islem"; ilgili uygulama islemini calistirir.
function isSampleTransaction(item) {
  return ["Nisan Maaşı", "Haftalık Market", "Elektrik Faturası"].includes(item.title);
}

// ACIKLAMA: getFirebaseErrorMessage fonksiyonunun Turkce karsiligi "al Firebase hata mesaj"; Firebase veya kimlik dogrulama islemlerini yonetir.
function getFirebaseErrorMessage(error) {
  // ACIKLAMA: code degiskeninin Turkce karsiligi "code"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: setBankImportLoading fonksiyonunun Turkce karsiligi "ayarla banka ice aktar loading"; veriyi uygulamaya ice aktarir.
function setBankImportLoading(isLoading) {
  bankImportStatus?.classList.toggle("is-loading", Boolean(isLoading));
}

// ACIKLAMA: withTimeout fonksiyonunun Turkce karsiligi "with timeout"; ilgili uygulama islemini calistirir.
function withTimeout(promise, timeoutMs, message) {
  // ACIKLAMA: timeoutId degiskeninin Turkce karsiligi "timeout kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let timeoutId = null;
  // ACIKLAMA: timeoutPromise degiskeninin Turkce karsiligi "timeout promise"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  });
}

// ACIKLAMA: handleBankImportFile fonksiyonunun Turkce karsiligi "handle banka ice aktar dosya"; veriyi uygulamaya ice aktarir.
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

  // ACIKLAMA: names degiskeninin Turkce karsiligi "adlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const names = pendingBankFiles.map((file) => file.name).join(", ");
  bankImportStatus.textContent =
    `${pendingBankFiles.length} dosya seçildi: ${names}. Yapay zeka ile ya da normal önizleme ile kontrol edebilirsin.`;
}

// ACIKLAMA: isPdfFile fonksiyonunun Turkce karsiligi "mi PDF dosya"; ilgili uygulama islemini calistirir.
function isPdfFile(file) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

// ACIKLAMA: isImageFile fonksiyonunun Turkce karsiligi "mi gorsel dosya"; ilgili uygulama islemini calistirir.
function isImageFile(file) {
  return file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name);
}

// ACIKLAMA: getImportedMovementSortTime fonksiyonunun Turkce karsiligi "al imported movement sirala saat"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getImportedMovementSortTime(item) {
  if (!item) {
    return 0;
  }

  // ACIKLAMA: transactionAt degiskeninin Turkce karsiligi "islem at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transactionAt = item.transactionAt || "";
  if (transactionAt) {
    // ACIKLAMA: timestamp degiskeninin Turkce karsiligi "zaman damgasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const timestamp = Date.parse(transactionAt);
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = item.date || "";
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const time = getTimePart(item.raw || item.title || item.note || transactionAt || "") || getTimePart(transactionAt) || "00:00";
  // ACIKLAMA: timestamp degiskeninin Turkce karsiligi "zaman damgasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const timestamp = Date.parse(buildTransactionDateTime(date, time));

  return Number.isFinite(timestamp) ? timestamp : 0;
}

// ACIKLAMA: compareImportedMovementsNewestFirst fonksiyonunun Turkce karsiligi "karsilastir imported movements en yeni ilk"; veriyi uygulamaya ice aktarir.
function compareImportedMovementsNewestFirst(first, second) {
  return getImportedMovementSortTime(second) - getImportedMovementSortTime(first);
}

// ACIKLAMA: buildPendingBankImportItems fonksiyonunun Turkce karsiligi "olustur bekleyen banka ice aktar ogeler"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildPendingBankImportItems(parsedMovements, sourceName = "", existingSignatures = null, seenSignatures = null, options = {}) {
  // ACIKLAMA: existing degiskeninin Turkce karsiligi "existing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existing = existingSignatures || new Set(transactions.map(getTransactionSignature));
  // ACIKLAMA: seen degiskeninin Turkce karsiligi "seen"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const seen = seenSignatures || new Set();
  // ACIKLAMA: selectedAccount degiskeninin Turkce karsiligi "selected hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedAccount = options.paymentAccountId
    ? paymentAccounts.find((item) => item.id === options.paymentAccountId)
    : getBankImportSelectedAccount();
  // ACIKLAMA: selectedTransferAccount degiskeninin Turkce karsiligi "selected aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedTransferAccount = options.transferAccountId
    ? paymentAccounts.find((item) => item.id === options.transferAccountId)
    : getBankImportSelectedTransferAccount();
  // ACIKLAMA: paymentAccountId kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
  const paymentAccountId = selectedAccount ? selectedAccount.id : "";
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccountId =
    selectedTransferAccount && selectedTransferAccount.id !== paymentAccountId ? selectedTransferAccount.id : "";
  // ACIKLAMA: paymentMethod degiskeninin Turkce karsiligi "odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const paymentMethod = getPaymentMethodForImportAccount(selectedAccount);
  // ACIKLAMA: importLabel degiskeninin Turkce karsiligi "ice aktar etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const importLabel = String(options.importLabel || "Yapay zeka banka önizleme");

  return parsedMovements.map((movement) => {
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = cleanBankTitle(movement.title) || "Banka Hareketi";
    // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amount = Number(movement.amount);
    // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const date = movement.date;
    // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const type = movement.type || inferTransactionType(title, movement.sign, movement.hasExplicitSign);
    // ACIKLAMA: createdAt degiskeninin Turkce karsiligi "created at"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const createdAt = getTurkeyNowDateTime();
    // ACIKLAMA: movementTime degiskeninin Turkce karsiligi "movement saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: transaction degiskeninin Turkce karsiligi "islem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      updatedAt: createdAt,
    };
    // ACIKLAMA: signature degiskeninin Turkce karsiligi "imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const signature = getTransactionSignature(transaction);
    // ACIKLAMA: duplicate degiskeninin Turkce karsiligi "duplicate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: addSelectedBankFiles fonksiyonunun Turkce karsiligi "add selected banka dosyalar"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
async function addSelectedBankFiles() {
  if (pendingBankImports.length) {
    confirmBankImport();
    return;
  }

  if (!pendingBankFiles.length && !bankImportText.value.trim()) {
    bankImportStatus.textContent = "Önce PDF, CSV, TXT ya da ekran görüntüsü seç.";
    return;
  }

  // ACIKLAMA: allPendingImports degiskeninin Turkce karsiligi "tum bekleyen imports"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allPendingImports = [];
  // ACIKLAMA: failedFiles degiskeninin Turkce karsiligi "failed dosyalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const failedFiles = [];
  // ACIKLAMA: existingSignatures degiskeninin Turkce karsiligi "existing imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingSignatures = new Set(transactions.map(getTransactionSignature));
  // ACIKLAMA: seenSignatures degiskeninin Turkce karsiligi "seen imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: file degiskeninin Turkce karsiligi "dosya"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const file = pendingBankFiles[index];
      bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} okunuyor: ${file.name}`;

      try {
        // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const text = await readBankImportFile(file);
        // ACIKLAMA: parsedMovements degiskeninin Turkce karsiligi "parsed movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const parsedMovements = parseBankMovements(text);
        // ACIKLAMA: pendingItems degiskeninin Turkce karsiligi "bekleyen ogeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const pendingItems = buildPendingBankImportItems(parsedMovements, file.name, existingSignatures, seenSignatures, {
          importLabel: "Banka içe aktarımı",
        });
        allPendingImports.push(...pendingItems);
      } catch (error) {
        failedFiles.push(`${file.name}${error?.message ? ` (${error.message})` : ""}`);
      }
    }

    // ACIKLAMA: pastedText degiskeninin Turkce karsiligi "pasted metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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


// ACIKLAMA: previewBankImportLocally fonksiyonunun Turkce karsiligi "onizle banka ice aktar locally"; veriyi uygulamaya ice aktarir.
async function previewBankImportLocally(options = {}) {
  const { fallbackReason = "", updateStatus = true } = options;
  // ACIKLAMA: allPendingImports degiskeninin Turkce karsiligi "tum bekleyen imports"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allPendingImports = [];
  // ACIKLAMA: failedFiles degiskeninin Turkce karsiligi "failed dosyalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const failedFiles = [];
  // ACIKLAMA: existingSignatures degiskeninin Turkce karsiligi "existing imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const existingSignatures = new Set(transactions.map(getTransactionSignature));
  // ACIKLAMA: seenSignatures degiskeninin Turkce karsiligi "seen imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: file degiskeninin Turkce karsiligi "dosya"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const file = pendingBankFiles[index];
      bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} okunuyor: ${file.name}`;

      try {
        // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const text = await readBankImportFile(file);
        // ACIKLAMA: parsedMovements degiskeninin Turkce karsiligi "parsed movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: pastedText degiskeninin Turkce karsiligi "pasted metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: readBankImportFile fonksiyonunun Turkce karsiligi "oku banka ice aktar dosya"; veriyi uygulamaya ice aktarir.
async function readBankImportFile(file) {
  if (isPdfFile(file)) {
    // ACIKLAMA: buffer degiskeninin Turkce karsiligi "buffer"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const buffer = await readFileAsArrayBuffer(file);
    // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const text = await extractImageText(file);

    if (!text.trim()) {
      throw new Error("Görselde okunabilir metin bulunamadı.");
    }

    return text;
  }

  return readFileAsText(file);
}

// ACIKLAMA: previewBankImportWithAi fonksiyonunun Turkce karsiligi "onizle banka ice aktar with ai"; AI destekli okuma veya API istegi akisini calistirir.
async function previewBankImportWithAi() {
  if (!pendingBankFiles.length && !bankImportText.value.trim()) {
    bankImportStatus.textContent = "Yapay zeka ile önizleme için önce ekran görüntüsü, PDF, CSV/TXT seç veya metin yapıştır.";
    return;
  }

  // ACIKLAMA: previousAddText degiskeninin Turkce karsiligi "previous add metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const previousAddText = bankImportAddButton?.textContent || "Yapay Zeka ile Kayıtlara Ekle";

  bankImportAddButton.disabled = true;
  bankImportCancelButton.disabled = true;
  setBankImportLoading(true);
  if (bankImportAddButton) {
    bankImportAddButton.textContent = "Yapay Zeka Okuyor...";
  }
  bankImportStatus.textContent = "Yapay zeka banka ekranını ve sayfadaki gerçek hareket satırlarını algılıyor...";

  try {
    // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
    const payload = await buildBankAiImportPayload();
    // ACIKLAMA: response degiskeninin Turkce karsiligi "yanit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const response = await fetch("/.netlify/functions/bank-ai-import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "AI servisi yanıt vermedi.");
    }

    // ACIKLAMA: movements degiskeninin Turkce karsiligi "movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const movements = normalizeAiBankMovements(data.movements || data.transactions || []);

    if (!movements.length) {
      throw new Error("AI hareket bulamadı.");
    }

    // ACIKLAMA: existingSignatures degiskeninin Turkce karsiligi "existing imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const existingSignatures = new Set(transactions.map(getTransactionSignature));
    // ACIKLAMA: seenSignatures degiskeninin Turkce karsiligi "seen imzalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
    // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
    // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getBankAiImportErrorMessage fonksiyonunun Turkce karsiligi "al banka ai ice aktar hata mesaj"; AI destekli okuma veya API istegi akisini calistirir.
function getBankAiImportErrorMessage(error) {
  // ACIKLAMA: message degiskeninin Turkce karsiligi "mesaj"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const message = String(error?.message || "");

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return (
      "Yapay zeka fonksiyonuna ulaşılamadı. Site Netlify üzerinde deploy edilmiş olmalı, " +
      "netlify/functions/bank-ai-import.js pakette kalmalı ve Netlify ayarlarında AI anahtarı tanımlı olmalı."
    );
  }

  return message || "Yapay zeka okuma tamamlanamadı.";
}

// ACIKLAMA: buildBankAiImportPayload fonksiyonunun Turkce karsiligi "olustur banka ai ice aktar veri paketi"; AI destekli okuma veya API istegi akisini calistirir.
async function buildBankAiImportPayload() {
  // ACIKLAMA: files degiskeninin Turkce karsiligi "dosyalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const files = [];

  for (let index = 0; index < pendingBankFiles.length; index += 1) {
    // ACIKLAMA: file degiskeninin Turkce karsiligi "dosya"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const file = pendingBankFiles[index];
    bankImportStatus.textContent = `${index + 1}/${pendingBankFiles.length} yapay zeka için hazırlanıyor: ${file.name}`;
    files.push(await readBankAiFilePayload(file));
  }

  // ACIKLAMA: pastedText degiskeninin Turkce karsiligi "pasted metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: readBankAiFilePayload fonksiyonunun Turkce karsiligi "oku banka ai dosya veri paketi"; AI destekli okuma veya API istegi akisini calistirir.
async function readBankAiFilePayload(file) {
  // ACIKLAMA: mimeType degiskeninin Turkce karsiligi "dosya turu tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mimeType = file.type || guessBankAiMimeType(file.name);
  // ACIKLAMA: base degiskeninin Turkce karsiligi "base"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const base = {
    name: file.name,
    size: file.size,
    mimeType,
  };

  if (isImageFile(file)) {
    // ACIKLAMA: image degiskeninin Turkce karsiligi "gorsel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const image = await imageFileToBankAiData(file);
    return {
      ...base,
      kind: "image",
      mimeType: image.mimeType,
      data: image.data,
    };
  }

  if (isPdfFile(file) && file.size <= 4 * 1024 * 1024) {
    // ACIKLAMA: payload aktarim veya API istegi icin hazirlanan veri paketini tutar.
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

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = await readBankImportFile(file);
  return {
    ...base,
    kind: "text",
    text: text.slice(0, 70000),
  };
}

// ACIKLAMA: readFileAsDataUrl fonksiyonunun Turkce karsiligi "oku dosya olarak veri adres"; ilgili uygulama islemini calistirir.
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    // ACIKLAMA: reader degiskeninin Turkce karsiligi "reader"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya AI için okunamadı."));
    reader.readAsDataURL(file);
  });
}

// ACIKLAMA: imageFileToBankAiData fonksiyonunun Turkce karsiligi "gorsel dosya ile banka ai veri"; AI destekli okuma veya API istegi akisini calistirir.
async function imageFileToBankAiData(file) {
  // ACIKLAMA: url degiskeninin Turkce karsiligi "adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const url = URL.createObjectURL(file);

  try {
    // ACIKLAMA: image degiskeninin Turkce karsiligi "gorsel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const image = await loadImageFromUrl(url);
    // ACIKLAMA: maxSide degiskeninin Turkce karsiligi "max side"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const maxSide = 1600;
    // ACIKLAMA: scale degiskeninin Turkce karsiligi "scale"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
    // ACIKLAMA: width degiskeninin Turkce karsiligi "width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
    // ACIKLAMA: height degiskeninin Turkce karsiligi "height"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
    // ACIKLAMA: canvas degiskeninin Turkce karsiligi "tuval"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const canvas = document.createElement("canvas");
    // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: loadImageFromUrl fonksiyonunun Turkce karsiligi "yukle gorsel kaynakli adres"; ilgili uygulama islemini calistirir.
function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    // ACIKLAMA: image degiskeninin Turkce karsiligi "gorsel"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Görsel AI için hazırlanamadı."));
    image.src = url;
  });
}

// ACIKLAMA: splitDataUrl fonksiyonunun Turkce karsiligi "bol veri adres"; ilgili uygulama islemini calistirir.
function splitDataUrl(dataUrl, fallbackMimeType = "application/octet-stream") {
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: guessBankAiMimeType fonksiyonunun Turkce karsiligi "tahmin et banka ai dosya turu tur"; AI destekli okuma veya API istegi akisini calistirir.
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

// ACIKLAMA: normalizeAiBankMovements fonksiyonunun Turkce karsiligi "standartlastir ai banka movements"; AI destekli okuma veya API istegi akisini calistirir.
function normalizeAiBankMovements(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amountDetails = parseBankAmount(item.amountText ?? item.amount ?? item.tutar ?? item.value);

      if (!amountDetails) {
        return null;
      }

      // ACIKLAMA: rawType degiskeninin Turkce karsiligi "ham tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const rawType = normalizeBankText(item.type || item.kind || item.direction || "");
      // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const title = cleanBankTitle(item.title || item.description || item.aciklama || item.rawText || "") || "Banka Hareketi";
      // ACIKLAMA: explicitType degiskeninin Turkce karsiligi "acik tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const explicitType = rawType.includes("income") || rawType.includes("gelir") || rawType.includes("alacak")
        ? "income"
        : rawType.includes("expense") || rawType.includes("gider") || rawType.includes("borc")
          ? "expense"
          : "";
      // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const type = explicitType || inferTransactionType(title, amountDetails.sign, amountDetails.hasExplicitSign);
      // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const date = normalizeAiBankDate(item.date || item.tarih || item.transactionDate);
      // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizeAiBankDate fonksiyonunun Turkce karsiligi "standartlastir ai banka tarih"; AI destekli okuma veya API istegi akisini calistirir.
function normalizeAiBankDate(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(value || "").trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  return parseBankDate(text) || findDayMonthDateInText(text) || "";
}

// ACIKLAMA: normalizeAiBankTime fonksiyonunun Turkce karsiligi "standartlastir ai banka saat"; AI destekli okuma veya API istegi akisini calistirir.
function normalizeAiBankTime(value) {
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = String(value || "").match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)(?::[0-5]\d)?\b/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

// ACIKLAMA: importBankPdf fonksiyonunun Turkce karsiligi "ice aktar banka PDF"; veriyi uygulamaya ice aktarir.
async function importBankPdf(file) {
  bankImportStatus.textContent = `${file.name} okunuyor ve hareketlere ekleniyor...`;

  try {
    // ACIKLAMA: buffer degiskeninin Turkce karsiligi "buffer"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const buffer = await readFileAsArrayBuffer(file);
    // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: readFileAsArrayBuffer fonksiyonunun Turkce karsiligi "oku dosya olarak dizi buffer"; ilgili uygulama islemini calistirir.
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    // ACIKLAMA: reader degiskeninin Turkce karsiligi "reader"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsArrayBuffer(file);
  });
}

// ACIKLAMA: readFileAsText fonksiyonunun Turkce karsiligi "oku dosya olarak metin"; ilgili uygulama islemini calistirir.
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    // ACIKLAMA: reader degiskeninin Turkce karsiligi "reader"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsText(file, "UTF-8");
  });
}

// ACIKLAMA: loadPdfJs fonksiyonunun Turkce karsiligi "yukle PDF js"; ilgili uygulama islemini calistirir.
async function loadPdfJs() {
  if (pdfJsModule) {
    return pdfJsModule;
  }

  pdfJsModule = await import(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.mjs`);
  pdfJsModule.GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;
  return pdfJsModule;
}

// ACIKLAMA: extractPdfText fonksiyonunun Turkce karsiligi "ayikla PDF metin"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
async function extractPdfText(buffer) {
  // ACIKLAMA: pdfjsLib degiskeninin Turkce karsiligi "pdfjs lib"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pdfjsLib = await loadPdfJs();
  // ACIKLAMA: loadingTask degiskeninin Turkce karsiligi "loading task"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
  // ACIKLAMA: pdf degiskeninin Turkce karsiligi "PDF"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pdf = await loadingTask.promise;
  // ACIKLAMA: pages degiskeninin Turkce karsiligi "pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    // ACIKLAMA: page degiskeninin Turkce karsiligi "sayfa"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const page = await pdf.getPage(pageNumber);
    // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const content = await page.getTextContent();
    pages.push(textContentToLines(content.items).join("\n"));
  }

  return pages.join("\n");
}

// ACIKLAMA: extractPdfOcrText fonksiyonunun Turkce karsiligi "ayikla PDF OCR metin"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
async function extractPdfOcrText(buffer, sourceName = "PDF") {
  bankImportStatus.textContent = `${sourceName} metin içermiyor; sayfalar görsel olarak okunuyor...`;
  // ACIKLAMA: pdfjsLib degiskeninin Turkce karsiligi "pdfjs lib"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pdfjsLib = await loadPdfJs();
  // ACIKLAMA: loadingTask degiskeninin Turkce karsiligi "loading task"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
  // ACIKLAMA: pdf degiskeninin Turkce karsiligi "PDF"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pdf = await loadingTask.promise;
  // ACIKLAMA: pages degiskeninin Turkce karsiligi "pages"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    bankImportStatus.textContent = `${sourceName} ${pageNumber}/${pdf.numPages} sayfa OCR ile okunuyor...`;
    // ACIKLAMA: page degiskeninin Turkce karsiligi "sayfa"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const page = await pdf.getPage(pageNumber);
    // ACIKLAMA: viewport degiskeninin Turkce karsiligi "viewport"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const viewport = page.getViewport({ scale: 2.2 });
    // ACIKLAMA: canvas degiskeninin Turkce karsiligi "tuval"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const canvas = document.createElement("canvas");
    // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;

    // ACIKLAMA: blob degiskeninin Turkce karsiligi "dosya parcasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const blob = await canvasToPngBlob(canvas);
    // ACIKLAMA: pageUrl degiskeninin Turkce karsiligi "sayfa adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const pageUrl = URL.createObjectURL(blob);

    try {
      pages.push(await recognizeBankImageUrl(pageUrl, `${sourceName} sayfa ${pageNumber}`));
    } finally {
      URL.revokeObjectURL(pageUrl);
    }
  }

  return pages.join("\n");
}

// ACIKLAMA: loadTesseract fonksiyonunun Turkce karsiligi "yukle Tesseract"; ilgili uygulama islemini calistirir.
async function loadTesseract() {
  if (window.Tesseract) {
    return window.Tesseract;
  }

  if (!tesseractLoadPromise) {
    tesseractLoadPromise = new Promise((resolve, reject) => {
      // ACIKLAMA: script degiskeninin Turkce karsiligi "script"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: recognizeBankImageUrl fonksiyonunun Turkce karsiligi "tani banka gorsel adres"; ilgili uygulama islemini calistirir.
async function recognizeBankImageUrl(url, statusLabel = "Görsel") {
  if (statusLabel) {
    bankImportStatus.textContent = `${statusLabel} OCR ile okunuyor...`;
  }

  // ACIKLAMA: tesseract degiskeninin Turkce karsiligi "Tesseract"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const tesseract = await withTimeout(
    loadTesseract(),
    BANK_OCR_TIMEOUT_MS,
    "Görsel okuma motoru çok uzun sürede açıldı. Lütfen görseli tekrar seç."
  );
  // ACIKLAMA: result degiskeninin Turkce karsiligi "result"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractOcrTextFromResult fonksiyonunun Turkce karsiligi "ayikla OCR metin kaynakli result"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractOcrTextFromResult(result) {
  // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const data = result?.data || {};
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = [
    buildOcrTextFromLines(data.lines),
    data.text || "",
    buildOcrTextFromWords(data.words),
  ];
  // ACIKLAMA: seen degiskeninin Turkce karsiligi "seen"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const seen = new Set();
  // ACIKLAMA: uniqueParts degiskeninin Turkce karsiligi "unique parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const uniqueParts = [];

  parts.forEach((part) => {
    // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const text = String(part || "").trim();
    // ACIKLAMA: signature degiskeninin Turkce karsiligi "imza"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const signature = normalizeBankText(text);

    if (!text || !signature || seen.has(signature)) {
      return;
    }

    seen.add(signature);
    uniqueParts.push(text);
  });

  return chooseBestBankOcrText(uniqueParts);
}

// ACIKLAMA: chooseBestBankOcrText fonksiyonunun Turkce karsiligi "sec en iyi banka OCR metin"; ilgili uygulama islemini calistirir.
function chooseBestBankOcrText(candidates) {
  // ACIKLAMA: uniqueCandidates degiskeninin Turkce karsiligi "unique candidates"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const uniqueCandidates = (candidates || []).filter(Boolean);
  // ACIKLAMA: combinedCandidate degiskeninin Turkce karsiligi "combined candidate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const combinedCandidate = uniqueCandidates.length > 1 ? uniqueCandidates.join("\n") : "";
  // ACIKLAMA: scoreCandidate degiskeninin Turkce karsiligi "puan candidate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const scoreCandidate = (text, index) => {
    // ACIKLAMA: movements degiskeninin Turkce karsiligi "movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const movements = safeParseBankMovementsForOcrScore(text);
    // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const lines = getBankOcrLines(text);
    // ACIKLAMA: rowStartCount degiskeninin Turkce karsiligi "satir baslangic sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const rowStartCount = Math.max(countMobileBankOcrStarts(lines), countBankAppTemplateRowStarts(text));
    // ACIKLAMA: signedCount degiskeninin Turkce karsiligi "isaretli sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const signedCount = movements.filter((movement) => movement.hasExplicitSign).length;
    // ACIKLAMA: balanceTitleCount degiskeninin Turkce karsiligi "bakiye baslik sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const balanceTitleCount = movements.filter((movement) =>
      hasAnyBankKeyword(movement.title || movement.raw || "", BANK_OCR_BALANCE_KEYWORDS)
    ).length;
    // ACIKLAMA: suspiciousRateCount degiskeninin Turkce karsiligi "suspicious oran sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const suspiciousRateCount = movements.filter(isSuspiciousBankRateMovement).length;
    // ACIKLAMA: overRowPenaltyWeight degiskeninin Turkce karsiligi "over satir penalty kalinlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const overRowPenaltyWeight = isStrictBankCardScreen(text) ? 145 : 85;
    // ACIKLAMA: overRowPenalty degiskeninin Turkce karsiligi "over satir penalty"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const overRowPenalty = rowStartCount ? Math.max(0, movements.length - rowStartCount) * overRowPenaltyWeight : 0;
    // ACIKLAMA: score degiskeninin Turkce karsiligi "puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
  // ACIKLAMA: scored degiskeninin Turkce karsiligi "scored"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const scored = uniqueCandidates.map(scoreCandidate).filter((item) => item.text);

  if (
    combinedCandidate &&
    !isStrictBankCardScreen(combinedCandidate) &&
    !uniqueCandidates.some((text) => normalizeBankText(text) === normalizeBankText(combinedCandidate))
  ) {
    // ACIKLAMA: combinedScore degiskeninin Turkce karsiligi "combined puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const combinedScore = scoreCandidate(combinedCandidate, uniqueCandidates.length);
    // ACIKLAMA: bestSingleCount degiskeninin Turkce karsiligi "en iyi single sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const bestSingleCount = scored.reduce((best, item) => Math.max(best, item.movements.length), 0);

    if (combinedScore.movements.length > bestSingleCount) {
      scored.push(combinedScore);
    }
  }

  if (!scored.length) {
    return "";
  }

  // ACIKLAMA: withMovements degiskeninin Turkce karsiligi "with movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const withMovements = scored.filter((item) => item.movements.length);

  if (!withMovements.length) {
    return scored.sort((a, b) => b.text.length - a.text.length)[0].text;
  }

  return withMovements.sort((a, b) => b.score - a.score || a.index - b.index)[0].text;
}

// ACIKLAMA: safeParseBankMovementsForOcrScore fonksiyonunun Turkce karsiligi "OCR puani icin banka hareketlerini guvenli cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function safeParseBankMovementsForOcrScore(text) {
  try {
    return parseBankMovements(text);
  } catch {
    return [];
  }
}

// ACIKLAMA: isSuspiciousBankRateMovement fonksiyonunun Turkce karsiligi "mi suspicious banka oran movement"; ilgili uygulama islemini calistirir.
function isSuspiciousBankRateMovement(movement) {
  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number(movement?.amount || 0);
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(`${movement?.title || ""} ${movement?.raw || ""}`);

  return (
    amount > 0 &&
    amount < 100 &&
    !movement?.hasExplicitSign &&
    /\b(orani|oran|stopaj|faiz tutari|n faiz|f orani)\b/.test(text)
  );
}

// ACIKLAMA: buildOcrTextFromLines fonksiyonunun Turkce karsiligi "olustur OCR metin kaynakli satirlar"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildOcrTextFromLines(lines) {
  if (!Array.isArray(lines)) {
    return "";
  }

  return lines
    .map((line) => String(line?.text || "").trim())
    .filter(Boolean)
    .join("\n");
}

// ACIKLAMA: buildOcrTextFromWords fonksiyonunun Turkce karsiligi "olustur OCR metin kaynakli kelimeler"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildOcrTextFromWords(words) {
  if (!Array.isArray(words) || !words.length) {
    return "";
  }

  // ACIKLAMA: rows degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rows = [];

  words
    .map((word) => {
      // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const text = String(word?.text || "").trim();
      // ACIKLAMA: bbox degiskeninin Turkce karsiligi "bbox"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const bbox = word?.bbox || {};
      // ACIKLAMA: x0 degiskeninin Turkce karsiligi "x0"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const x0 = Number(bbox.x0 ?? word?.x0 ?? 0);
      // ACIKLAMA: y0 degiskeninin Turkce karsiligi "y0"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const y0 = Number(bbox.y0 ?? word?.y0 ?? 0);
      // ACIKLAMA: y1 degiskeninin Turkce karsiligi "y1"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const y1 = Number(bbox.y1 ?? word?.y1 ?? y0);

      return text ? { text, x0, y: (y0 + y1) / 2 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.y - b.y || a.x0 - b.x0)
    .forEach((word) => {
      // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractImageText fonksiyonunun Turkce karsiligi "ayikla gorsel metin"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
async function extractImageText(file) {
  bankImportStatus.textContent = `${file.name} ekran görüntüsü okunuyor...`;
  // ACIKLAMA: imageUrl degiskeninin Turkce karsiligi "gorsel adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let imageUrl = URL.createObjectURL(file);
  // ACIKLAMA: processedUrl degiskeninin Turkce karsiligi "processed adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let processedUrl = "";

  try {
    processedUrl = await preprocessImageForBankOcr(file);
    // ACIKLAMA: targetUrl degiskeninin Turkce karsiligi "hedef adres"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const targetUrl = processedUrl || imageUrl;
    // ACIKLAMA: processedText degiskeninin Turkce karsiligi "processed metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const processedText = await recognizeBankImageUrl(targetUrl, file.name);

    if (!processedUrl) {
      return processedText;
    }

    bankImportStatus.textContent = `${file.name} için orijinal görüntü de kontrol ediliyor...`;
    // ACIKLAMA: originalText degiskeninin Turkce karsiligi "orijinal metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const originalText = await recognizeBankImageUrl(imageUrl, file.name);
    // ACIKLAMA: combinedText degiskeninin Turkce karsiligi "combined metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const combinedText = [processedText, originalText].filter(Boolean).join("\n");
    return chooseBestBankOcrText([processedText, originalText, combinedText]);
  } finally {
    URL.revokeObjectURL(imageUrl);
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }
  }
}

// ACIKLAMA: preprocessImageForBankOcr fonksiyonunun Turkce karsiligi "on isleme al gorsel icin banka OCR"; ilgili uygulama islemini calistirir.
async function preprocessImageForBankOcr(file) {
  if (!window.createImageBitmap) {
    return "";
  }

  try {
    // ACIKLAMA: bitmap degiskeninin Turkce karsiligi "bitmap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const bitmap = await createImageBitmap(file);
    // ACIKLAMA: maxWidth degiskeninin Turkce karsiligi "max width"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const maxWidth = 2800;
    // ACIKLAMA: minScale degiskeninin Turkce karsiligi "min scale"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const minScale = bitmap.width < 1200 ? 2 : 1.25;
    // ACIKLAMA: scale degiskeninin Turkce karsiligi "scale"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const scale = Math.min(2.6, Math.max(minScale, maxWidth / Math.max(bitmap.width, 1)));
    // ACIKLAMA: canvas degiskeninin Turkce karsiligi "tuval"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // ACIKLAMA: imageData degiskeninin Turkce karsiligi "gorsel veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      // ACIKLAMA: gray degiskeninin Turkce karsiligi "gray"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const gray = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
      // ACIKLAMA: contrasted degiskeninin Turkce karsiligi "contrasted"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const contrasted = Math.max(0, Math.min(255, (gray - 126) * 1.72 + 126));
      // ACIKLAMA: sharpened degiskeninin Turkce karsiligi "sharpened"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const sharpened = contrasted > 238 ? 255 : contrasted < 44 ? 0 : contrasted;
      data[index] = sharpened;
      data[index + 1] = sharpened;
      data[index + 2] = sharpened;
      data[index + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
    bitmap.close?.();

    // ACIKLAMA: blob degiskeninin Turkce karsiligi "dosya parcasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const blob = await canvasToPngBlob(canvas);
    return URL.createObjectURL(blob);
  } catch {
    return "";
  }
}

// ACIKLAMA: canvasToPngBlob fonksiyonunun Turkce karsiligi "tuval ile PNG dosya parcasi"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: textContentToLines fonksiyonunun Turkce karsiligi "metin icerik ile satirlar"; ilgili uygulama islemini calistirir.
function textContentToLines(items) {
  // ACIKLAMA: rows degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rows = [];

  items.forEach((item) => {
    // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const text = String(item.str || "").trim();

    if (!text) {
      return;
    }

    // ACIKLAMA: x degiskeninin Turkce karsiligi "x"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const x = item.transform?.[4] || 0;
    // ACIKLAMA: y degiskeninin Turkce karsiligi "y"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const y = item.transform?.[5] || 0;
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: addBankImportText fonksiyonunun Turkce karsiligi "add banka ice aktar metin"; formdan gelen bilgiyi kaydeder veya yeni kayit ekler.
function addBankImportText(raw, sourceName = "Dosya", options = {}) {
  const { updateStatus = true } = options;
  bankImportText.value = String(raw || "");
  previewBankImport({ sourceName, updateStatus });

  // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;

  return { added: 0, ready: readyCount, duplicates: duplicateCount, invalid: invalidCount };
}

// ACIKLAMA: previewBankImport fonksiyonunun Turkce karsiligi "onizle banka ice aktar"; veriyi uygulamaya ice aktarir.
function previewBankImport(options = {}) {
  const { sourceName = "Metin", updateStatus = true } = options;
  // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const raw = bankImportText.value.trim();

  if (!raw) {
    pendingBankImports = [];
    renderBankImportPreview();
    if (updateStatus) {
      bankImportStatus.textContent = "Önce banka hareketlerini yapıştır veya dosya seç.";
    }
    return;
  }

  // ACIKLAMA: parsedMovements degiskeninin Turkce karsiligi "parsed movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parsedMovements = parseBankMovements(raw);
  pendingBankImports = buildPendingBankImportItems(parsedMovements, sourceName);
  renderBankImportPreview();

  // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: resetBankImportInputState fonksiyonunun Turkce karsiligi "banka ice aktar giris durumunu sifirla"; secili hesaplari, dosyalari, onizlemeyi ve buton durumlarini temizler.
function resetBankImportInputState(statusText = "Banka içe aktarma alanı temizlendi.") {
  pendingBankImports = [];
  pendingBankFiles = [];

  if (bankImportText) {
    bankImportText.value = "";
  }

  if (bankImportFile) {
    bankImportFile.value = "";
  }

  if (bankImportAccountSelect) {
    bankImportAccountSelect.value = "";
  }

  if (bankImportPreviewAccount) {
    bankImportPreviewAccount.value = "";
  }

  if (bankImportTransferAccountSelect) {
    bankImportTransferAccountSelect.value = "";
  }

  if (bankImportPreviewTransferAccount) {
    bankImportPreviewTransferAccount.value = "";
  }

  syncBankImportAccountSelects("");
  syncBankImportTransferAccountSelects("");
  renderBankImportPreview();
  closeBankImportPreviewModal();
  setBankImportLoading(false);

  if (bankImportAddButton) {
    bankImportAddButton.disabled = false;
    bankImportAddButton.textContent = "Yapay Zeka ile Kayıtlara Ekle";
  }

  if (bankImportLocalButton) {
    bankImportLocalButton.disabled = false;
    bankImportLocalButton.textContent = "Kayıtlara Ekle";
  }

  if (bankImportCancelButton) {
    bankImportCancelButton.disabled = false;
  }

  if (typeof statusText === "string" && bankImportStatus) {
    bankImportStatus.textContent = statusText;
  }
}


// ACIKLAMA: confirmBankImport fonksiyonunun Turkce karsiligi "onay banka ice aktar"; veriyi uygulamaya ice aktarir.
function confirmBankImport(options = {}) {
  const { updateStatus = true } = options;

  if (!pendingBankImports.length) {
    if (updateStatus) {
      bankImportStatus.textContent = "Önce banka hareketlerini önizle.";
    }
    return;
  }

  // ACIKLAMA: selectionRoot degiskeninin Turkce karsiligi "secim root"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectionRoot = bankImportPreviewList || bankImportPreview;
  // ACIKLAMA: selectedIndexes degiskeninin Turkce karsiligi "selected indexes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedIndexes = Array.from(selectionRoot.querySelectorAll(".bank-import-check:checked")).map(
    (input) => Number(input.value)
  );
  // ACIKLAMA: selectedTransactions gelir/gider kayitlariyla ilgili veriyi veya durumu tutar.
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

  // ACIKLAMA: invalidTransfer degiskeninin Turkce karsiligi "invalid aktarim"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: changedPaymentAccount kart, banka hesabi veya odeme hesabi bilgileri icin kullanilir.
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
  persistTransactions({ cloudUpserts: selectedTransactions });
  render();

  resetBankImportInputState(
    updateStatus
      ? `${selectedTransactions.length} banka hareketi kayıtlara eklendi. Seçilen hesap, karşı hesap, dosya/görsel ve önizleme alanı temizlendi.`
      : null
  );
}

// ACIKLAMA: clearBankImport fonksiyonunun Turkce karsiligi "temizle banka ice aktar"; veriyi uygulamaya ice aktarir.
function clearBankImport() {
  resetBankImportInputState("Banka içe aktarma alanı temizlendi.");
}

// ACIKLAMA: renderBankImportPreview fonksiyonunun Turkce karsiligi "ekrana bas banka ice aktar onizle"; ilgili ekran, liste veya kartlari ekrana basar.
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

  // ACIKLAMA: summary degiskeninin Turkce karsiligi "ozet"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summary = document.createElement("div");
  summary.className = "bank-import-preview-summary";
  // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;
  // ACIKLAMA: sourceCount degiskeninin Turkce karsiligi "kaynak sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceCount = new Set(pendingBankImports.map((item) => item.sourceName).filter(Boolean)).size;
  // ACIKLAMA: summaryText degiskeninin Turkce karsiligi "ozet metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryText = document.createElement("span");
  summaryText.textContent =
    `${readyCount} hareket eklenecek` +
    (duplicateCount ? ` · ${duplicateCount} tekrar` : "") +
    (invalidCount ? ` · ${invalidCount} okunamadı` : "") +
    (sourceCount ? ` · ${sourceCount} kaynak` : "") +
    ".";
  // ACIKLAMA: summaryActions degiskeninin Turkce karsiligi "ozet actions"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const summaryActions = document.createElement("div");
  summaryActions.className = "bank-import-preview-actions";
  // ACIKLAMA: selectAllButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
  const selectAllButton = document.createElement("button");
  selectAllButton.className = "ghost-btn bank-import-mini-btn";
  selectAllButton.type = "button";
  selectAllButton.textContent = "Tümünü Seç";
  selectAllButton.disabled = readyCount === 0;
  selectAllButton.addEventListener("click", () => setBankImportPreviewSelection(true));
  // ACIKLAMA: clearSelectionButton ilgili butonun DOM referansidir; tiklama olaylari bu elemanla baglanir.
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
    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: checkbox degiskeninin Turkce karsiligi "checkbox"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const content = document.createElement("div");
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = document.createElement("p");
    title.className = "transaction-title";
    // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const meta = document.createElement("p");
    meta.className = "transaction-meta";

    if (item.valid) {
      title.textContent = item.transaction.title;
      // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const time = getTimePart(item.raw || "") || getTimePart(item.transaction.transactionAt || "");
      meta.textContent = [
        formatDate(item.transaction.date),
        time,
        item.transaction.category,
        item.sourceName,
        item.duplicate ? "Tekrar" : "",
      ].filter(Boolean).join(" · ");

      if (item.raw && normalizeBankText(item.raw) !== normalizeBankText(item.transaction.title)) {
        // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

    // ACIKLAMA: side degiskeninin Turkce karsiligi "side"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const side = document.createElement("div");
    side.className = "transaction-side";

    if (item.valid) {
      // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amount = document.createElement("strong");
      amount.className = `transaction-amount ${item.transaction.type}`;
      amount.textContent = `${item.transaction.type === "income" ? "+" : "-"} ${currency.format(
        item.transaction.amount
      )}`;
      // ACIKLAMA: kind degiskeninin Turkce karsiligi "kind"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const kind = document.createElement("span");
      kind.className = `bank-import-kind ${item.transaction.type}`;
      kind.textContent = item.transaction.type === "income" ? "Gelir" : "Gider";
      side.append(amount, kind);
    }

    row.append(checkbox, content, side);
    bankImportPreview.append(row);
  });
}

// ACIKLAMA: setBankImportPreviewSelection fonksiyonunun Turkce karsiligi "ayarla banka ice aktar onizle secim"; veriyi uygulamaya ice aktarir.
function setBankImportPreviewSelection(checked) {
  // ACIKLAMA: root degiskeninin Turkce karsiligi "root"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const root = bankImportPreviewList || bankImportPreview;
  root.querySelectorAll(".bank-import-check:not(:disabled)").forEach((input) => {
    input.checked = checked;
    input.closest(".bank-import-item")?.classList.toggle("selected", checked);
  });
  updateBankImportPreviewSummary();
}

// ACIKLAMA: renderBankImportPreviewModal fonksiyonunun Turkce karsiligi "ekrana bas banka ice aktar onizle pencere"; ilgili ekran, liste veya kartlari ekrana basar.
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

// ACIKLAMA: createBankImportPreviewEditRow fonksiyonunun Turkce karsiligi "olustur banka ice aktar onizle duzenle satir"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportPreviewEditRow(item, index) {
  // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: checkbox degiskeninin Turkce karsiligi "checkbox"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: body degiskeninin Turkce karsiligi "govde"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const body = document.createElement("div");
  body.className = "bank-import-edit-body";

  if (!item.valid) {
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.raw || "Okunamadı";
    // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = `${item.reason}${item.sourceName ? ` · ${item.sourceName}` : ""}`;
    body.append(title, meta);
    row.append(checkbox, body);
    return row;
  }

  // ACIKLAMA: grid degiskeninin Turkce karsiligi "grid"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: meta degiskeninin Turkce karsiligi "meta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const meta = document.createElement("p");
  meta.className = "transaction-meta";
  // ACIKLAMA: rowAccount degiskeninin Turkce karsiligi "satir hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rowAccount = item.transaction.paymentAccountId
    ? paymentAccounts.find((account) => account.id === item.transaction.paymentAccountId)
    : null;
  // ACIKLAMA: rowTransferAccount degiskeninin Turkce karsiligi "satir aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: createBankImportEditField fonksiyonunun Turkce karsiligi "olustur banka ice aktar duzenle alan"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportEditField(labelText, control) {
  // ACIKLAMA: label degiskeninin Turkce karsiligi "etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const label = document.createElement("label");
  label.textContent = labelText;
  label.append(control);
  return label;
}

// ACIKLAMA: createBankImportEditInput fonksiyonunun Turkce karsiligi "olustur banka ice aktar duzenle giris alani"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportEditInput(index, field, value, type) {
  // ACIKLAMA: input kullanicidan veri alan input elemaninin DOM referansidir.
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

// ACIKLAMA: createBankImportTypeSelect fonksiyonunun Turkce karsiligi "olustur banka ice aktar tur secim alani"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportTypeSelect(index, value) {
  // ACIKLAMA: select secim kutusunun DOM referansidir; secilen deger buradan okunur.
  const select = document.createElement("select");
  [
    ["income", "Gelir"],
    ["expense", "Gider"],
    ["transfer", "Transfer"],
  ].forEach(([optionValue, label]) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = label;
    select.append(option);
  });
  select.value = ["income", "expense", "transfer"].includes(value) ? value : "expense";
  select.addEventListener("change", () => {
    updateBankImportTransactionField(index, "type", select.value);
    // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: createBankImportCategorySelect fonksiyonunun Turkce karsiligi "olustur banka ice aktar kategori secim alani"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportCategorySelect(index, type, value) {
  // ACIKLAMA: select secim kutusunun DOM referansidir; secilen deger buradan okunur.
  const select = document.createElement("select");
  (transactionCategories[type] || transactionCategories.expense).forEach((category) => {
    // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: createBankImportPaymentAccountSelect fonksiyonunun Turkce karsiligi "olustur banka ice aktar odeme hesap secim alani"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function createBankImportPaymentAccountSelect(index, field, value, excludeValue = "") {
  // ACIKLAMA: select secim kutusunun DOM referansidir; secilen deger buradan okunur.
  const select = document.createElement("select");
  // ACIKLAMA: currentValue degiskeninin Turkce karsiligi "mevcut deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentValue = String(value || "");
  // ACIKLAMA: excludedId degiskeninin Turkce karsiligi "excluded kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const excludedId = String(excludeValue || "");

  // ACIKLAMA: emptyOption degiskeninin Turkce karsiligi "empty option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = field === "paymentAccountId" ? "Kaynak seçilmedi" : "Karşı hesap yok";
  select.append(emptyOption);

  paymentAccounts
    .filter((account) => String(account.id || "") !== excludedId)
    .forEach((account) => {
      // ACIKLAMA: option degiskeninin Turkce karsiligi "option"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: updateBankImportTransactionField fonksiyonunun Turkce karsiligi "guncelle banka ice aktar islem alan"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateBankImportTransactionField(index, field, value) {
  // ACIKLAMA: item degiskeninin Turkce karsiligi "oge"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const item = pendingBankImports[index];

  if (!item?.valid || !item.transaction) {
    return;
  }

  if (field === "amount") {
    // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: applyBankImportAccountToPending fonksiyonunun Turkce karsiligi "uygula banka ice aktar hesap ile bekleyen"; ilgili pencereyi veya ekrani acar.
function applyBankImportAccountToPending(accountId = "") {
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = accountId ? paymentAccounts.find((item) => item.id === accountId) : null;
  // ACIKLAMA: paymentMethod degiskeninin Turkce karsiligi "odeme yontem"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const paymentMethod = getPaymentMethodForImportAccount(account);
  // ACIKLAMA: transferAccount degiskeninin Turkce karsiligi "aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccount = getBankImportSelectedTransferAccount();
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: applyBankImportTransferAccountToPending fonksiyonunun Turkce karsiligi "uygula banka ice aktar aktarim hesap ile bekleyen"; ilgili pencereyi veya ekrani acar.
function applyBankImportTransferAccountToPending(accountId = "") {
  // ACIKLAMA: sourceAccount degiskeninin Turkce karsiligi "kaynak hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceAccount = getBankImportSelectedAccount();
  // ACIKLAMA: transferAccount degiskeninin Turkce karsiligi "aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccount =
    accountId && accountId !== sourceAccount?.id
      ? paymentAccounts.find((item) => item.id === accountId)
      : null;
  // ACIKLAMA: transferAccountId degiskeninin Turkce karsiligi "aktarim hesap kimlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: updateBankImportPreviewSummary fonksiyonunun Turkce karsiligi "guncelle banka ice aktar onizle ozet"; mevcut ekran durumunu veya hesaplanan degerleri gunceller.
function updateBankImportPreviewSummary() {
  // ACIKLAMA: readyCount degiskeninin Turkce karsiligi "hazir sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const readyCount = pendingBankImports.filter((item) => item.valid && !item.duplicate).length;
  // ACIKLAMA: selectedCount degiskeninin Turkce karsiligi "selected sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selectedCount = bankImportPreviewList
    ? bankImportPreviewList.querySelectorAll(".bank-import-check:checked").length
    : readyCount;
  // ACIKLAMA: duplicateCount degiskeninin Turkce karsiligi "duplicate sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const duplicateCount = pendingBankImports.filter((item) => item.duplicate).length;
  // ACIKLAMA: invalidCount degiskeninin Turkce karsiligi "invalid sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const invalidCount = pendingBankImports.filter((item) => !item.valid).length;
  // ACIKLAMA: account degiskeninin Turkce karsiligi "hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const account = getBankImportSelectedAccount();
  // ACIKLAMA: transferAccount degiskeninin Turkce karsiligi "aktarim hesap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const transferAccount = getBankImportSelectedTransferAccount();
  // ACIKLAMA: accountText degiskeninin Turkce karsiligi "hesap metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const accountText = account ? formatPaymentAccountName(account) : "Kart / hesap seçilmedi";
  // ACIKLAMA: transferText degiskeninin Turkce karsiligi "aktarim metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: openBankImportPreviewModal fonksiyonunun Turkce karsiligi "ac banka ice aktar onizle pencere"; ilgili pencereyi veya ekrani acar.
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

// ACIKLAMA: closeBankImportPreviewModal fonksiyonunun Turkce karsiligi "kapat banka ice aktar onizle pencere"; ilgili pencereyi veya ekrani kapatir.
function closeBankImportPreviewModal() {
  if (bankImportPreviewModal) {
    bankImportPreviewModal.hidden = true;
  }
}

// ACIKLAMA: parseBankMovements fonksiyonunun Turkce karsiligi "banka hareketlerini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankMovements(raw) {
  // ACIKLAMA: normalizedRaw degiskeninin Turkce karsiligi "normalized ham"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedRaw = normalizeBankOcrRawText(raw);
  // ACIKLAMA: receiptMovements degiskeninin Turkce karsiligi "fis movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const receiptMovements = dedupeBankMovements(parseBankReceipts(normalizedRaw));

  if (receiptMovements.length) {
    return receiptMovements;
  }

  // ACIKLAMA: csvMovements degiskeninin Turkce karsiligi "CSV movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const csvMovements = dedupeBankMovements(parseBankCsv(raw));

  if (csvMovements.length) {
    return csvMovements;
  }

  // ACIKLAMA: templateMovements degiskeninin Turkce karsiligi "sablon movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const templateMovements = dedupeBankMovements(parseBankAppTemplateRows(normalizedRaw));
  // ACIKLAMA: templateRowStartCount degiskeninin Turkce karsiligi "sablon satir baslangic sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const templateRowStartCount = countBankAppTemplateRowStarts(normalizedRaw);

  if (shouldTrustBankAppTemplateRows(normalizedRaw, templateMovements) && templateMovements.length >= templateRowStartCount) {
    return templateMovements;
  }

  // ACIKLAMA: mobileMovements degiskeninin Turkce karsiligi "mobil movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mobileMovements = dedupeBankMovements(parseMobileBankOcrRows(normalizedRaw));
  // ACIKLAMA: screenshotMovements degiskeninin Turkce karsiligi "ekran goruntusu movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const screenshotMovements = dedupeBankMovements(parseBankScreenshotMovements(normalizedRaw));
  // ACIKLAMA: mobileRowStartCount degiskeninin Turkce karsiligi "mobil satir baslangic sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const mobileRowStartCount = countMobileBankOcrStarts(getBankOcrLines(normalizedRaw));

  if (isStrictBankCardScreen(normalizedRaw) && mobileMovements.length >= mobileRowStartCount) {
    return mobileMovements;
  }

  // ACIKLAMA: structuredMovements degiskeninin Turkce karsiligi "yapilandirilmis movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const structuredMovements = dedupeBankMovements([...mobileMovements, ...screenshotMovements]);
  // ACIKLAMA: structuredRowStartCount degiskeninin Turkce karsiligi "yapilandirilmis satir baslangic sayi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const structuredRowStartCount = Math.max(templateRowStartCount, mobileRowStartCount);

  if (shouldTrustStructuredBankRows(normalizedRaw, structuredMovements) && structuredMovements.length >= structuredRowStartCount) {
    return structuredMovements;
  }

  // ACIKLAMA: parsers degiskeninin Turkce karsiligi "parsers"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parsers = [
    () => templateMovements,
    () => structuredMovements,
    () => parseSignedBankOcrAmounts(normalizedRaw),
    () => parseBankText(normalizedRaw),
    () => parseLooseBankMovementRows(normalizedRaw),
  ];
  // ACIKLAMA: allMovements degiskeninin Turkce karsiligi "tum movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const allMovements = [];

  for (const parser of parsers) {
    // ACIKLAMA: movements degiskeninin Turkce karsiligi "movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const movements = parser();

    if (movements.length) {
      allMovements.push(...movements);
    }
  }

  return dedupeBankMovements(allMovements);
}

// ACIKLAMA: isStrictBankCardScreen fonksiyonunun Turkce karsiligi "mi kesin banka kart ekran"; ilgili uygulama islemini calistirir.
function isStrictBankCardScreen(raw) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(raw);
  return (
    text.includes("islem sonu bakiye") ||
    text.includes("lem sonu bakiye") ||
    text.includes("sonu bakiye") ||
    text.includes("tekrarla")
  );
}

// ACIKLAMA: shouldTrustStructuredBankRows fonksiyonunun Turkce karsiligi "mali mi guven yapilandirilmis banka satirlar"; ilgili uygulama islemini calistirir.
function shouldTrustStructuredBankRows(raw, movements) {
  if (!movements.length) {
    return false;
  }

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(raw);

  if (isStrictBankCardScreen(raw)) {
    return true;
  }

  if (!text.includes("kalan bakiye") && movements.length >= 2) {
    return true;
  }

  return false;
}

// ACIKLAMA: shouldTrustBankAppTemplateRows fonksiyonunun Turkce karsiligi "mali mi guven banka uygulama sablon satirlar"; ilgili uygulama islemini calistirir.
function shouldTrustBankAppTemplateRows(raw, movements) {
  if (!movements.length) {
    return false;
  }

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(raw);
  // ACIKLAMA: indicators degiskeninin Turkce karsiligi "indicators"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseBankAppTemplateRows fonksiyonunun Turkce karsiligi "cozumle banka uygulama sablon satirlar"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankAppTemplateRows(raw) {
  // ACIKLAMA: sourceLines degiskeninin Turkce karsiligi "kaynak satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceLines = getBankOcrLines(raw);
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = [];

  for (const line of sourceLines) {
    if (isBankTemplateHardStopLine(line)) {
      break;
    }

    lines.push(line);
  }

  // ACIKLAMA: starts degiskeninin Turkce karsiligi "baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const starts = [];

  lines.forEach((line, index) => {
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = parseBankTemplateRowStart(lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts
    .map((start, order) => {
      // ACIKLAMA: nextStart degiskeninin Turkce karsiligi "sonraki baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const nextStart = starts[order + 1]?.index ?? lines.length;
      // ACIKLAMA: block degiskeninin Turkce karsiligi "blok"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const block = lines.slice(start.index, nextStart).filter((line) => !isBankTemplateSoftNoiseLine(line));
      return parseBankTemplateBlock(block, start);
    })
    .filter(Boolean);
}

// ACIKLAMA: countBankAppTemplateRowStarts fonksiyonunun Turkce karsiligi "sayi banka uygulama sablon satir baslangiclar"; ilgili uygulama islemini calistirir.
function countBankAppTemplateRowStarts(raw) {
  // ACIKLAMA: sourceLines degiskeninin Turkce karsiligi "kaynak satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceLines = getBankOcrLines(raw);
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = [];
  // ACIKLAMA: starts degiskeninin Turkce karsiligi "baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const starts = [];

  for (const line of sourceLines) {
    if (isBankTemplateHardStopLine(line)) {
      break;
    }

    lines.push(line);
  }

  lines.forEach((line, index) => {
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = parseBankTemplateRowStart(lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts.length;
}

// ACIKLAMA: parseBankTemplateRowStart fonksiyonunun Turkce karsiligi "cozumle banka sablon satir baslangic"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankTemplateRowStart(lines, index) {
  // ACIKLAMA: line degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const line = String(lines[index] || "").trim();

  if (!line || isBankTemplateSoftNoiseLine(line)) {
    return null;
  }

  // ACIKLAMA: sameLineDate degiskeninin Turkce karsiligi "ayni satir tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sameLineDate = parseBankTemplateDateFromLine(line) || parseBankScreenshotDateFromLine(line);
  // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const context = lines.slice(index, Math.min(lines.length, index + 10));
  // ACIKLAMA: normalizedContext degiskeninin Turkce karsiligi "normalized baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: dayMatch degiskeninin Turkce karsiligi "gun eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dayMatch = line.match(/^(\d{1,2})(?:\s+|$)/);

  if (!dayMatch) {
    return null;
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(dayMatch[1]);

  if (day < 1 || day > 31) {
    return null;
  }

  // ACIKLAMA: monthLineIndex degiskeninin Turkce karsiligi "ay satir dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthLineIndex = context.findIndex((candidate) => getBankMonthNumber(candidate));
  // ACIKLAMA: hasMonthNearby degiskeninin Turkce karsiligi "var mi ay nearby"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasMonthNearby = monthLineIndex >= 0 && monthLineIndex <= 6;

  if (
    !hasMonthNearby ||
    (!hasBankTemplateRowEvidence(context, normalizedContext) && !hasBankTemplateLooseRowEvidence(context, normalizedContext))
  ) {
    return null;
  }

  // ACIKLAMA: monthLine degiskeninin Turkce karsiligi "ay satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthLine = context[monthLineIndex] || "";
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = getBankMonthNumber(monthLine);
  // ACIKLAMA: yearMatch degiskeninin Turkce karsiligi "yil eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const yearMatch = context.join(" ").match(/\b20\d{2}\b/);
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = yearMatch ? Number(yearMatch[0]) : Number(getTurkeyTodayISO().slice(0, 4));

  return {
    index,
    date: buildIsoDate(year, month, day),
    day,
    time: getTimePart(context.join(" ")),
  };
}

// ACIKLAMA: parseBankTemplateDateFromLine fonksiyonunun Turkce karsiligi "cozumle banka sablon tarih kaynakli satir"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankTemplateDateFromLine(line) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(line || "");
  // ACIKLAMA: monthRegex degiskeninin Turkce karsiligi "ay regex"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = text.match(new RegExp(String.raw`^\s*(\d{1,2})\s+${monthRegex}(?:\s+(20\d{2}))?(?:\s+([01]?\d|2[0-3])[:.]([0-5]\d))?`, "i"));

  if (!match) {
    return null;
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(match[1]);
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = getBankMonthNumber(match[2]);
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = Number(match[3] || getTurkeyTodayISO().slice(0, 4));
  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: hasBankTemplateRowEvidence fonksiyonunun Turkce karsiligi "var mi banka sablon satir kanit"; ilgili uygulama islemini calistirir.
function hasBankTemplateRowEvidence(contextLines, normalizedContext) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = contextLines || [];
  // ACIKLAMA: hasAmount degiskeninin Turkce karsiligi "var mi tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasAmount = lines.some((line) => findUsableMoneyMatchesInLine(line).length);
  // ACIKLAMA: hasTitle degiskeninin Turkce karsiligi "var mi baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasTitle = lines.some((line) => isBankTemplateTitleLine(line));
  // ACIKLAMA: rowKeywordCount degiskeninin Turkce karsiligi "satir keyword sayi"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const rowKeywordCount = BANK_OCR_ROW_KEYWORDS.filter((keyword) => normalizedContext.includes(keyword)).length;

  return hasAmount && (hasTitle || rowKeywordCount > 0);
}

// ACIKLAMA: hasBankTemplateLooseRowEvidence fonksiyonunun Turkce karsiligi "var mi banka sablon gevsek satir kanit"; ilgili uygulama islemini calistirir.
function hasBankTemplateLooseRowEvidence(contextLines, normalizedContext) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = contextLines || [];
  // ACIKLAMA: hasTitle degiskeninin Turkce karsiligi "var mi baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasTitle = lines.some((line) => isBankTemplateTitleLine(line));
  // ACIKLAMA: rowKeywordCount degiskeninin Turkce karsiligi "satir keyword sayi"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const rowKeywordCount = BANK_OCR_ROW_KEYWORDS.filter((keyword) => normalizedContext.includes(keyword)).length;

  return hasTitle || rowKeywordCount > 0;
}

// ACIKLAMA: parseBankTemplateBlock fonksiyonunun Turkce karsiligi "cozumle banka sablon blok"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankTemplateBlock(block, start) {
  if (!block.length || isBankTemplateNoiseBlock(block)) {
    return null;
  }

  // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = start.date || findDayMonthDateInText(block.join(" ")) || findDayAndMonthAnywhereInText(block.join(" "));
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = extractBankTemplateTitle(block, amountDetails, start) ||
    extractBankMovementTitle(block, amountDetails) ||
    "Banka Hareketi";

  if (!date || !title || hasAnyBankKeyword(title, BANK_OCR_BALANCE_KEYWORDS)) {
    return null;
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractBankTemplateTitle fonksiyonunun Turkce karsiligi "ayikla banka sablon baslik"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractBankTemplateTitle(block, amountDetails, start) {
  // ACIKLAMA: selected degiskeninin Turkce karsiligi "selected"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const selected = [];

  block.forEach((line) => {
    // ACIKLAMA: cleaned degiskeninin Turkce karsiligi "temizlenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: inferBankTemplateTransactionType fonksiyonunun Turkce karsiligi "tahmin et banka sablon islem tur"; ilgili uygulama islemini calistirir.
function inferBankTemplateTransactionType(title, amountDetails, block) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isBankTemplateTitleLine fonksiyonunun Turkce karsiligi "mi banka sablon baslik satir"; ilgili uygulama islemini calistirir.
function isBankTemplateTitleLine(value) {
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isBankTemplateNoiseBlock fonksiyonunun Turkce karsiligi "mi banka sablon gurultu blok"; ilgili uygulama islemini calistirir.
function isBankTemplateNoiseBlock(block) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText((block || []).join(" "));
  // ACIKLAMA: noiseOnlyKeywords degiskeninin Turkce karsiligi "gurultu only keywords"; ilgili veri veya servis icin anahtar bilgisini tutar.
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

// ACIKLAMA: isBankTemplateHardStopLine fonksiyonunun Turkce karsiligi "mi banka sablon sert dur satir"; ilgili uygulama islemini calistirir.
function isBankTemplateHardStopLine(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(value);
  // ACIKLAMA: hardStops degiskeninin Turkce karsiligi "sert stops"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isBankTemplateSoftNoiseLine fonksiyonunun Turkce karsiligi "mi banka sablon yumusak gurultu satir"; ilgili uygulama islemini calistirir.
function isBankTemplateSoftNoiseLine(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(value);
  // ACIKLAMA: softNoise degiskeninin Turkce karsiligi "yumusak gurultu"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: dedupeBankMovements fonksiyonunun Turkce karsiligi "tekrarlari temizle banka movements"; ilgili uygulama islemini calistirir.
function dedupeBankMovements(movements) {
  // ACIKLAMA: accepted degiskeninin Turkce karsiligi "accepted"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: areSameBankMovement fonksiyonunun Turkce karsiligi "mi ayni banka movement"; ilgili uygulama islemini calistirir.
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

  // ACIKLAMA: leftTime degiskeninin Turkce karsiligi "left saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const leftTime = getBankMovementTimeKey(left);
  // ACIKLAMA: rightTime degiskeninin Turkce karsiligi "right saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rightTime = getBankMovementTimeKey(right);

  if (leftTime && rightTime && leftTime === rightTime) {
    return true;
  }

  // ACIKLAMA: leftTitle degiskeninin Turkce karsiligi "left baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const leftTitle = getBankMovementDedupeTitle(left);
  // ACIKLAMA: rightTitle degiskeninin Turkce karsiligi "right baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rightTitle = getBankMovementDedupeTitle(right);

  if (!leftTitle || !rightTitle) {
    return false;
  }

  if (leftTitle === rightTitle || leftTitle.includes(rightTitle) || rightTitle.includes(leftTitle)) {
    return true;
  }

  // ACIKLAMA: leftTokens degiskeninin Turkce karsiligi "left parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const leftTokens = new Set(leftTitle.split(" ").filter((token) => token.length > 2));
  // ACIKLAMA: rightTokens degiskeninin Turkce karsiligi "right parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rightTokens = new Set(rightTitle.split(" ").filter((token) => token.length > 2));
  // ACIKLAMA: smallerSize degiskeninin Turkce karsiligi "smaller boyut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const smallerSize = Math.min(leftTokens.size, rightTokens.size);

  if (!smallerSize) {
    return false;
  }

  // ACIKLAMA: overlap degiskeninin Turkce karsiligi "overlap"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let overlap = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  });

  return overlap / smallerSize >= 0.55;
}

// ACIKLAMA: getBankMovementTimeKey fonksiyonunun Turkce karsiligi "al banka movement saat anahtar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankMovementTimeKey(movement) {
  // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const raw = `${movement?.raw || ""} ${movement?.transactionAt || ""}`;
  // ACIKLAMA: explicit degiskeninin Turkce karsiligi "acik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const explicit = getTimePart(raw);

  if (explicit) {
    return explicit.slice(0, 5);
  }

  // ACIKLAMA: compactMatch degiskeninin Turkce karsiligi "compact eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const compactMatch = normalizeBankText(raw).match(/\b([01]?\d|2[0-3])\s*([0-5]\d)\b/);
  return compactMatch ? `${compactMatch[1].padStart(2, "0")}:${compactMatch[2]}` : "";
}

// ACIKLAMA: getBankMovementDedupeTitle fonksiyonunun Turkce karsiligi "al banka movement tekrarlari temizle baslik"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankMovementDedupeTitle(movement) {
  // ACIKLAMA: rawTitle degiskeninin Turkce karsiligi "ham baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rawTitle = `${movement?.title || ""} ${movement?.raw || ""}`;
  // ACIKLAMA: withoutMoney degiskeninin Turkce karsiligi "olmadan para"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const withoutMoney = rawTitle
    .replace(/[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi, " ")
    .replace(/\b20\d{2}\b/g, " ");
  // ACIKLAMA: noise degiskeninin Turkce karsiligi "gurultu"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizeBankOcrRawText fonksiyonunun Turkce karsiligi "standartlastir banka OCR ham metin"; veriyi uygulamanin bekledigi temiz formata cevirir.
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

// ACIKLAMA: fixCommonBankOcrTokens fonksiyonunun Turkce karsiligi "duzelt common banka OCR parcalar"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: normalizeOcrMoneyCharacters fonksiyonunun Turkce karsiligi "standartlastir OCR para karakterler"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeOcrMoneyCharacters(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(value || "");
  return text.replace(/[oO]/g, (char, index, source) => {
    // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const before = source[index - 1] || "";
    // ACIKLAMA: after degiskeninin Turkce karsiligi "sonrasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const after = source[index + 1] || "";
    // ACIKLAMA: beforeLooksNumeric degiskeninin Turkce karsiligi "oncesi looks numeric"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const beforeLooksNumeric = !before || /[\d.,+\-₺]/.test(before) || (/\s/.test(before) && /[\d.,]/.test(after));
    // ACIKLAMA: afterLooksNumeric degiskeninin Turkce karsiligi "sonrasi looks numeric"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const afterLooksNumeric = !after || /[\d.,\s₺TLTRY+\-]/i.test(after);
    return beforeLooksNumeric && afterLooksNumeric ? "0" : char;
  });
}

// ACIKLAMA: getBankOcrLines fonksiyonunun Turkce karsiligi "al banka OCR satirlar"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankOcrLines(raw) {
  return String(raw || "")
    .split(/\r?\n/)
    .map((line) => normalizeOcrMoneyCharacters(line).replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}

// ACIKLAMA: hasAnyBankKeyword fonksiyonunun Turkce karsiligi "var mi herhangi banka keyword"; ilgili uygulama islemini calistirir.
function hasAnyBankKeyword(normalizedText, keywords) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(normalizedText);
  return keywords.some((keyword) => text.includes(keyword));
}

// ACIKLAMA: isIgnoredBankOcrLine fonksiyonunun Turkce karsiligi "mi yok sayilan banka OCR satir"; ilgili uygulama islemini calistirir.
function isIgnoredBankOcrLine(value) {
  return hasAnyBankKeyword(value, BANK_OCR_IGNORE_KEYWORDS);
}

// ACIKLAMA: hasBankRowContext fonksiyonunun Turkce karsiligi "var mi banka satir baglam"; ilgili uygulama islemini calistirir.
function hasBankRowContext(value) {
  return hasAnyBankKeyword(value, BANK_OCR_ROW_KEYWORDS) || hasAnyBankKeyword(value, BANK_OCR_AMOUNT_KEYWORDS);
}

// ACIKLAMA: parseMobileBankOcrRows fonksiyonunun Turkce karsiligi "cozumle mobil banka OCR satirlar"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseMobileBankOcrRows(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = getBankOcrLines(raw);
  // ACIKLAMA: starts degiskeninin Turkce karsiligi "baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const starts = [];

  lines.forEach((line, index) => {
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = getMobileBankRowStart(line, lines, index);

    if (start) {
      starts.push(start);
    }
  });

  // ACIKLAMA: uniqueStarts degiskeninin Turkce karsiligi "unique baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const uniqueStarts = starts.filter((item, index, all) => index === 0 || item.index !== all[index - 1].index);

  return uniqueStarts
    .map((start, order) => {
      // ACIKLAMA: nextStart degiskeninin Turkce karsiligi "sonraki baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const nextStart = uniqueStarts[order + 1]?.index ?? lines.length;
      // ACIKLAMA: block degiskeninin Turkce karsiligi "blok"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const block = lines.slice(start.index, nextStart);
      return parseMobileBankOcrBlock(block, start);
    })
    .filter(Boolean);
}

// ACIKLAMA: countMobileBankOcrStarts fonksiyonunun Turkce karsiligi "sayi mobil banka OCR baslangiclar"; ilgili uygulama islemini calistirir.
function countMobileBankOcrStarts(lines) {
  // ACIKLAMA: starts degiskeninin Turkce karsiligi "baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const starts = [];

  (lines || []).forEach((line, index) => {
    // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const start = getMobileBankRowStart(line, lines, index);

    if (start && !starts.some((item) => item.index === start.index)) {
      starts.push(start);
    }
  });

  return starts.length;
}

// ACIKLAMA: parseSignedBankOcrAmounts fonksiyonunun Turkce karsiligi "cozumle isaretli banka OCR amounts"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseSignedBankOcrAmounts(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = getBankOcrLines(raw);
  // ACIKLAMA: movements degiskeninin Turkce karsiligi "movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const movements = [];

  lines.forEach((line, index) => {
    // ACIKLAMA: matches degiskeninin Turkce karsiligi "eslesmeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matches = findMoneyMatchesInLine(line).filter((match) => /[+\-]/.test(match.text));

    matches.forEach((match) => {
      // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amountDetails = parseBankAmount(match.text);

      if (!amountDetails || isBankBalanceAmountMatch(line, match) || isLikelyBankNoiseAmount(line, match, amountDetails)) {
        return;
      }

      // ACIKLAMA: dateContextLines degiskeninin Turkce karsiligi "tarih baglam satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const dateContextLines = lines.slice(Math.max(0, index - 8), index + 1);
      // ACIKLAMA: titleContextLines degiskeninin Turkce karsiligi "baslik baglam satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const titleContextLines = lines.slice(Math.max(0, index - 4), Math.min(lines.length, index + 5));
      // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const date = findSignedBankAmountDate(line, dateContextLines);

      if (!date) {
        return;
      }

      // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const title =
        extractSignedBankAmountTitle(line, match) ||
        extractSignedBankAmountTitle(titleContextLines.join(" "), match) ||
        "Banka Hareketi";
      // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findSignedBankAmountDate fonksiyonunun Turkce karsiligi "bul isaretli banka tutar tarih"; ilgili uygulama islemini calistirir.
function findSignedBankAmountDate(line, contextLines) {
  // ACIKLAMA: lineDate degiskeninin Turkce karsiligi "satir tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lineDate = findDateMatch(line);

  if (lineDate) {
    return parseBankDate(lineDate.text);
  }

  // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const context = contextLines.join(" ");
  // ACIKLAMA: contextDate degiskeninin Turkce karsiligi "baglam tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const contextDate = findDateMatch(context);

  if (contextDate) {
    return parseBankDate(contextDate.text);
  }

  // ACIKLAMA: sameLineDate degiskeninin Turkce karsiligi "ayni satir tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sameLineDate = findDayMonthDateInText(line);

  if (sameLineDate) {
    return sameLineDate;
  }

  // ACIKLAMA: scatteredLineDate degiskeninin Turkce karsiligi "scattered satir tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const scatteredLineDate = findDayAndMonthAnywhereInText(line);

  if (scatteredLineDate) {
    return scatteredLineDate;
  }

  for (const candidate of contextLines) {
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = findDayMonthDateInText(candidate);

    if (parsed) {
      return parsed;
    }

    // ACIKLAMA: scattered degiskeninin Turkce karsiligi "scattered"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const scattered = findDayAndMonthAnywhereInText(candidate);

    if (scattered) {
      return scattered;
    }
  }

  return "";
}

// ACIKLAMA: findDayMonthDateInText fonksiyonunun Turkce karsiligi "bul gun ay tarih in metin"; ilgili uygulama islemini calistirir.
function findDayMonthDateInText(value) {
  // ACIKLAMA: currentYear degiskeninin Turkce karsiligi "mevcut yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentYear = Number(getTurkeyTodayISO().slice(0, 4));
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(value || "");
  // ACIKLAMA: monthRegex degiskeninin Turkce karsiligi "ay regex"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = text.match(new RegExp(String.raw`\b(\d{1,2})\s+${monthRegex}(?:\s+(20\d{2}))?`, "i"));

  if (!match) {
    return "";
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(match[1]);
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = getBankMonthNumber(match[2]);
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = Number(match[3] || currentYear);

  return buildIsoDate(year, month, day);
}

// ACIKLAMA: findDayAndMonthAnywhereInText fonksiyonunun Turkce karsiligi "bul gun and ay anywhere in metin"; ilgili uygulama islemini calistirir.
function findDayAndMonthAnywhereInText(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(value || "");
  // ACIKLAMA: dayMatch degiskeninin Turkce karsiligi "gun eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dayMatch = text.match(/^\s*(\d{1,2})\b/);

  if (!dayMatch) {
    return "";
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(dayMatch[1]);
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = getBankMonthNumber(text);

  if (!day || !month) {
    return "";
  }

  // ACIKLAMA: yearMatch degiskeninin Turkce karsiligi "yil eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const yearMatch = text.match(/\b20\d{2}\b/);
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = yearMatch ? Number(yearMatch[0]) : Number(getTurkeyTodayISO().slice(0, 4));
  return buildIsoDate(year, month, day);
}

// ACIKLAMA: extractSignedBankAmountTitle fonksiyonunun Turkce karsiligi "ayikla isaretli banka tutar baslik"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractSignedBankAmountTitle(line, match) {
  // ACIKLAMA: source degiskeninin Turkce karsiligi "kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const source = String(line || "");
  // ACIKLAMA: amountStart degiskeninin Turkce karsiligi "tutar baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountStart = Number(match?.index || source.indexOf(match?.text || ""));
  // ACIKLAMA: amountText degiskeninin Turkce karsiligi "tutar metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountText = String(match?.text || "");
  // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let before = amountStart >= 0 ? source.slice(0, amountStart) : source;
  // ACIKLAMA: after degiskeninin Turkce karsiligi "sonrasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const after = amountStart >= 0 ? source.slice(amountStart + amountText.length) : "";
  // ACIKLAMA: afterUntilNextAmount degiskeninin Turkce karsiligi "sonrasi until sonraki tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const afterUntilNextAmount = after.split(/[+\-]\s*(?:₺\s*)?\d/)[0] || "";
  // ACIKLAMA: balancePattern degiskeninin Turkce karsiligi "bakiye kalip"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balancePattern =
    /(?:kalan|islem\s+sonu|işlem\s+sonu|kullanilabilir|kullanılabilir)\s+bakiye\s*:?\s*[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi;

  before = before.replace(balancePattern, " ");
  before = before.split(balancePattern).pop() || before;
  // ACIKLAMA: balanceIndex degiskeninin Turkce karsiligi "bakiye dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const balanceIndex = Math.max(
    before.toLocaleLowerCase("tr-TR").lastIndexOf("kalan bakiye"),
    before.toLocaleLowerCase("tr-TR").lastIndexOf("islem sonu bakiye"),
    before.toLocaleLowerCase("tr-TR").lastIndexOf("işlem sonu bakiye")
  );

  if (balanceIndex >= 0) {
    before = before.slice(balanceIndex).replace(balancePattern, " ");
  }

  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getMobileBankRowStart fonksiyonunun Turkce karsiligi "al mobil banka satir baslangic"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getMobileBankRowStart(line, lines, index) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(line || "").trim();
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = text.match(/^(\d{1,2})(?:\s+|$)(.*)$/);

  if (!match) {
    return null;
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(match[1]);

  if (day < 1 || day > 31) {
    return null;
  }

  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(text);
  // ACIKLAMA: trailing degiskeninin Turkce karsiligi "trailing"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const trailing = normalizeBankText(match[2] || "");
  // ACIKLAMA: nextLines degiskeninin Turkce karsiligi "sonraki satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextLines = lines.slice(index + 1, index + 7);
  // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const context = normalizeBankText([text, ...nextLines].join(" "));

  if (
    isIgnoredBankOcrLine(normalized) ||
    /^\d{1,2}$/.test(text) && !nextLines.some((item) => getBankMonthNumber(item))
  ) {
    return null;
  }

  // ACIKLAMA: hasMonthNearby degiskeninin Turkce karsiligi "var mi ay nearby"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasMonthNearby = nextLines.some((item) => getBankMonthNumber(item));
  // ACIKLAMA: currentAmounts degiskeninin Turkce karsiligi "mevcut amounts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentAmounts = findUsableMoneyMatchesInLine(text);
  // ACIKLAMA: nearbyAmounts degiskeninin Turkce karsiligi "nearby amounts"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nearbyAmounts = nextLines.slice(0, 4).some((item) => findUsableMoneyMatchesInLine(item).length);
  // ACIKLAMA: hasSignedAmountNearby degiskeninin Turkce karsiligi "var mi isaretli tutar nearby"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasSignedAmountNearby = currentAmounts.some((item) => item.details.hasExplicitSign) ||
    nextLines.slice(0, 4).some((item) => findUsableMoneyMatchesInLine(item).some((money) => money.details.hasExplicitSign));
  // ACIKLAMA: hasAmountNearby degiskeninin Turkce karsiligi "var mi tutar nearby"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const hasAmountNearby = hasSignedAmountNearby || hasBankRowContext(context) && (currentAmounts.length > 0 || nearbyAmounts);
  // ACIKLAMA: hasTitle degiskeninin Turkce karsiligi "var mi baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseMobileBankOcrBlock fonksiyonunun Turkce karsiligi "cozumle mobil banka OCR blok"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseMobileBankOcrBlock(block, start) {
  // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = buildMobileBankOcrDate(block, start.day);
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = extractMobileBankOcrTitle(block, amountDetails, start.day) || extractBankMovementTitle(block, amountDetails) || "Banka Hareketi";
  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: buildMobileBankOcrDate fonksiyonunun Turkce karsiligi "olustur mobil banka OCR tarih"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildMobileBankOcrDate(block, day) {
  // ACIKLAMA: currentDate degiskeninin Turkce karsiligi "mevcut tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentDate = getTurkeyTodayISO();
  // ACIKLAMA: currentYear degiskeninin Turkce karsiligi "mevcut yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentYear = Number(currentDate.slice(0, 4));
  // ACIKLAMA: currentMonth degiskeninin Turkce karsiligi "mevcut ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const currentMonth = Number(currentDate.slice(5, 7));
  // ACIKLAMA: context degiskeninin Turkce karsiligi "baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const context = block.join(" ");

  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let month = 0;
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let year = 0;

  for (const line of block) {
    if (!month) {
      month = getBankMonthNumber(line);
    }

    if (!year) {
      // ACIKLAMA: yearMatch degiskeninin Turkce karsiligi "yil eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const yearMatch = String(line || "").match(/\b20\d{2}\b/);
      if (yearMatch) {
        year = Number(yearMatch[0]);
      }
    }
  }

  if (!month) {
    // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dateMatch = findDateMatch(context);
    if (dateMatch) {
      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractMobileBankOcrTitle fonksiyonunun Turkce karsiligi "ayikla mobil banka OCR baslik"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractMobileBankOcrTitle(block, amountDetails, day) {
  // ACIKLAMA: titleLines degiskeninin Turkce karsiligi "baslik satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const titleLines = [];

  block.forEach((line, index) => {
    // ACIKLAMA: cleaned degiskeninin Turkce karsiligi "temizlenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    let cleaned = String(line || "");
    cleaned = cleaned.replace(amountDetails.match || "", " ");
    cleaned = cleaned.replace(new RegExp(String.raw`^\s*${day}\b`), " ");
    cleaned = cleaned.replace(/\b([01]?\d|2[0-3])[:.][0-5]\d\b/g, " ");
    cleaned = cleaned.replace(/\b20\d{2}\b/g, " ");
    cleaned = cleaned.replace(/\b(?:TL|TRY|₺)\b/gi, " ");
    cleaned = cleanBankTitle(cleaned);

    // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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


// ACIKLAMA: parseBankScreenshotMovements fonksiyonunun Turkce karsiligi "cozumle banka ekran goruntusu movements"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankScreenshotMovements(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = getBankOcrLines(raw);
  // ACIKLAMA: rowStarts degiskeninin Turkce karsiligi "satir baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rowStarts = [];

  for (let index = 0; index < lines.length; index += 1) {
    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = parseBankScreenshotDateAt(lines, index);

    if (parsed) {
      rowStarts.push({ index, ...parsed });
    }
  }

  // ACIKLAMA: uniqueStarts degiskeninin Turkce karsiligi "unique baslangiclar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const uniqueStarts = rowStarts.filter((row, index, all) => index === 0 || row.index !== all[index - 1].index);

  return uniqueStarts
    .map((row, rowIndex) => {
      // ACIKLAMA: nextStart degiskeninin Turkce karsiligi "sonraki baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const nextStart = uniqueStarts[rowIndex + 1]?.index ?? lines.length;
      // ACIKLAMA: block degiskeninin Turkce karsiligi "blok"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const block = lines.slice(row.index, nextStart);
      return parseBankScreenshotBlock(block, row);
    })
    .filter(Boolean);
}

// ACIKLAMA: parseBankScreenshotDateAt fonksiyonunun Turkce karsiligi "cozumle banka ekran goruntusu tarih at"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankScreenshotDateAt(lines, index) {
  // ACIKLAMA: line degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const line = lines[index] || "";
  // ACIKLAMA: sameLine degiskeninin Turkce karsiligi "ayni satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sameLine = parseBankScreenshotDateFromLine(line);

  if (sameLine) {
    return sameLine;
  }

  if (!/^\d{1,2}$/.test(line.trim())) {
    return null;
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(line.trim());

  if (day < 1 || day > 31) {
    return null;
  }

  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let month = 0;
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let year = 0;
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let time = "";

  for (let offset = 1; offset <= 5 && index + offset < lines.length; offset += 1) {
    // ACIKLAMA: candidate degiskeninin Turkce karsiligi "candidate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const candidate = lines[index + offset];
    // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const normalized = normalizeBankText(candidate);
    // ACIKLAMA: monthValue degiskeninin Turkce karsiligi "ay deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const monthValue = getBankMonthNumber(normalized);

    if (!month && monthValue) {
      month = monthValue;
      continue;
    }

    if (!year) {
      // ACIKLAMA: yearMatch degiskeninin Turkce karsiligi "yil eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const yearMatch = candidate.match(/\b20\d{2}\b/);
      if (yearMatch) {
        year = Number(yearMatch[0]);
        continue;
      }
    }

    if (!time) {
      // ACIKLAMA: timeMatch degiskeninin Turkce karsiligi "saat eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseBankScreenshotDateFromLine fonksiyonunun Turkce karsiligi "cozumle banka ekran goruntusu tarih kaynakli satir"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankScreenshotDateFromLine(line) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(line || "");
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(text);
  // ACIKLAMA: monthRegex degiskeninin Turkce karsiligi "ay regex"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const monthRegex =
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|june|jun|temmuz|tem|july|jul|agustos|ağustos|agu|august|aug|eylul|eylül|eyl|september|sep|ekim|eki|october|oct|kasim|kasım|kas|november|nov|aralik|aralık|ara|december|dec)";
  // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const match = text.match(new RegExp(String.raw`\b(\d{1,2})\s+${monthRegex}\s+(20\d{2})(?:\s+([01]?\d|2[0-3])[:.]([0-5]\d))?`, "i"));

  if (!match) {
    return null;
  }

  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(match[1]);
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = getBankMonthNumber(normalizeBankText(match[2]));
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const year = Number(match[3]);
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getBankMonthNumber fonksiyonunun Turkce karsiligi "al banka ay sayi"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getBankMonthNumber(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(value);
  // ACIKLAMA: tokens degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const tokens = text.split(" ").filter(Boolean);
  // ACIKLAMA: months degiskeninin Turkce karsiligi "months"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: foundIndex degiskeninin Turkce karsiligi "found dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const foundIndex = months.findIndex((aliases) =>
    aliases.some((alias) => text === alias || tokens.includes(alias))
  );
  return foundIndex >= 0 ? foundIndex + 1 : 0;
}

// ACIKLAMA: parseBankScreenshotBlock fonksiyonunun Turkce karsiligi "cozumle banka ekran goruntusu blok"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankScreenshotBlock(block, dateInfo) {
  // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const title = extractBankMovementTitle(block, amountDetails) || "Banka Hareketi";
  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findBankMovementAmount fonksiyonunun Turkce karsiligi "bul banka movement tutar"; ilgili uygulama islemini calistirir.
function findBankMovementAmount(block) {
  // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidates = [];

  block.forEach((line, lineIndex) => {
    // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const normalized = normalizeBankText(line);
    // ACIKLAMA: moneyMatches degiskeninin Turkce karsiligi "para eslesmeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const moneyMatches = findMoneyMatchesInLine(line);

    moneyMatches.forEach((match) => {
      // ACIKLAMA: parsedDetails degiskeninin Turkce karsiligi "parsed ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsedDetails = parseBankAmount(match.text);
      // ACIKLAMA: details degiskeninin Turkce karsiligi "ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const details = adjustBankAmountDetailsForContext(parsedDetails, line, match);

      if (!details) {
        return;
      }

      // ACIKLAMA: explicit degiskeninin Turkce karsiligi "acik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const explicit = details.hasExplicitSign;
      // ACIKLAMA: hasMoneySignal degiskeninin Turkce karsiligi "var mi para signal"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const hasMoneySignal =
        explicit ||
        isMoneyLikeAmount(match.text) ||
        hasAnyBankKeyword(normalized, BANK_OCR_AMOUNT_KEYWORDS);

      if (!hasMoneySignal || isLikelyBankNoiseAmount(line, match, details)) {
        return;
      }

      // ACIKLAMA: looksBalance degiskeninin Turkce karsiligi "looks bakiye"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const looksBalance = isBankBalanceAmountMatch(line, match);

      // ACIKLAMA: score degiskeninin Turkce karsiligi "puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: explicitCandidates degiskeninin Turkce karsiligi "acik candidates"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const explicitCandidates = candidates.filter((item) => item.explicit && !item.looksBalance);

  if (explicitCandidates.length) {
    return explicitCandidates.sort((a, b) => b.score - a.score)[0];
  }

  // ACIKLAMA: nonBalanceCandidates degiskeninin Turkce karsiligi "non bakiye candidates"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nonBalanceCandidates = candidates.filter((item) => !item.looksBalance);

  if (nonBalanceCandidates.length) {
    return nonBalanceCandidates.sort((a, b) => b.score - a.score)[0];
  }

  return null;
}

// ACIKLAMA: findUsableMoneyMatchesInLine fonksiyonunun Turkce karsiligi "bul kullanilabilir para eslesmeler in satir"; ilgili uygulama islemini calistirir.
function findUsableMoneyMatchesInLine(line) {
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(line);

  return findMoneyMatchesInLine(line)
    .map((match) => {
      // ACIKLAMA: parsedDetails degiskeninin Turkce karsiligi "parsed ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsedDetails = parseBankAmount(match.text);
      // ACIKLAMA: details degiskeninin Turkce karsiligi "ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const details = adjustBankAmountDetailsForContext(parsedDetails, line, match);

      if (
        !details ||
        isBankBalanceAmountMatch(line, match) ||
        isLikelyBankNoiseAmount(line, match, details)
      ) {
        return null;
      }

      // ACIKLAMA: hasMoneySignal degiskeninin Turkce karsiligi "var mi para signal"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const hasMoneySignal =
        details.hasExplicitSign ||
        isMoneyLikeAmount(match.text) ||
        hasAnyBankKeyword(normalized, BANK_OCR_AMOUNT_KEYWORDS);

      return hasMoneySignal ? { match, details } : null;
    })
    .filter(Boolean);
}

// ACIKLAMA: adjustBankAmountDetailsForContext fonksiyonunun Turkce karsiligi "ayarla banka tutar ayrintilar icin baglam"; AI destekli okuma veya API istegi akisini calistirir.
function adjustBankAmountDetailsForContext(details, line, match) {
  if (!details) {
    return null;
  }

  // ACIKLAMA: amountText degiskeninin Turkce karsiligi "tutar metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountText = String(match?.text || "").trim();

  if (!/^-\s+/.test(amountText)) {
    return details;
  }

  // ACIKLAMA: amountIndex degiskeninin Turkce karsiligi "tutar dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountIndex = Number(match?.index || 0);
  // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: hasBankIncomeContext fonksiyonunun Turkce karsiligi "var mi banka gelir baglam"; ilgili uygulama islemini calistirir.
function hasBankIncomeContext(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(value);
  // ACIKLAMA: incomeKeywords degiskeninin Turkce karsiligi "gelir keywords"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const incomeKeywords = ["gelen", "alacak", "gelir", "maas", "iade", "refund", "faiz", "mevduat", "hesaptan gelen"];
  return incomeKeywords.some((keyword) => text.includes(keyword));
}

// ACIKLAMA: hasBankExpenseContext fonksiyonunun Turkce karsiligi "var mi banka gider baglam"; ilgili uygulama islemini calistirir.
function hasBankExpenseContext(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(value);
  // ACIKLAMA: expenseKeywords degiskeninin Turkce karsiligi "gider keywords"; ilgili veri veya servis icin anahtar bilgisini tutar.
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

// ACIKLAMA: isBankBalanceAmountMatch fonksiyonunun Turkce karsiligi "mi banka bakiye tutar eslesme"; ilgili uygulama islemini calistirir.
function isBankBalanceAmountMatch(line, match) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(line || "");
  // ACIKLAMA: amountIndex degiskeninin Turkce karsiligi "tutar dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountIndex = Number(match?.index || 0);
  // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const before = text.slice(Math.max(0, amountIndex - 34), amountIndex);
  // ACIKLAMA: localContext degiskeninin Turkce karsiligi "yerel baglam"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const localContext = normalizeBankText(before);

  if (hasAnyBankKeyword(localContext, BANK_OCR_BALANCE_KEYWORDS)) {
    return true;
  }

  return false;
}

// ACIKLAMA: isLikelyBankNoiseAmount fonksiyonunun Turkce karsiligi "mi olasi banka gurultu tutar"; ilgili uygulama islemini calistirir.
function isLikelyBankNoiseAmount(line, match, details) {
  // ACIKLAMA: amountText degiskeninin Turkce karsiligi "tutar metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountText = String(match?.text || "").trim();
  // ACIKLAMA: source degiskeninin Turkce karsiligi "kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const source = String(line || "");
  // ACIKLAMA: amountIndex degiskeninin Turkce karsiligi "tutar dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountIndex = Number(match?.index || 0);
  // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const before = source.slice(Math.max(0, amountIndex - 18), amountIndex);
  // ACIKLAMA: after degiskeninin Turkce karsiligi "sonrasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const after = source.slice(amountIndex + amountText.length, amountIndex + amountText.length + 6);
  // ACIKLAMA: normalizedLine degiskeninin Turkce karsiligi "normalized satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedLine = normalizeBankText(line);
  // ACIKLAMA: digitsOnly degiskeninin Turkce karsiligi "digits only"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findMoneyMatchesInLine fonksiyonunun Turkce karsiligi "bul para eslesmeler in satir"; ilgili uygulama islemini calistirir.
function findMoneyMatchesInLine(line) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeOcrMoneyCharacters(line);
  // ACIKLAMA: moneyPattern degiskeninin Turkce karsiligi "para kalip"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const moneyPattern = /[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})\s*(?:TL|TRY|₺)?/gi;
  // ACIKLAMA: matches degiskeninin Turkce karsiligi "eslesmeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const matches = [];
  let match;

  while ((match = moneyPattern.exec(text))) {
    // ACIKLAMA: candidate degiskeninin Turkce karsiligi "candidate"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const candidate = match[0].trim();

    if (!candidate || /^\d{1,2}[,.]\d{2}$/.test(candidate) && !/[+\-₺]|TL|TRY/i.test(candidate)) {
      matches.push({ text: candidate, index: match.index });
      continue;
    }

    matches.push({ text: candidate, index: match.index });
  }

  return matches;
}

// ACIKLAMA: extractBankMovementTitle fonksiyonunun Turkce karsiligi "ayikla banka movement baslik"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractBankMovementTitle(block, amountDetails) {
  // ACIKLAMA: ignoredWords degiskeninin Turkce karsiligi "yok sayilan kelimeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const ignoredWords = [...BANK_OCR_IGNORE_KEYWORDS, ...BANK_OCR_BALANCE_KEYWORDS, "tekrarla"];

  // ACIKLAMA: cleanedLines degiskeninin Turkce karsiligi "temizlenmis satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cleanedLines = block
    .map((line) => line.replace(amountDetails.match || "", " "))
    .map((line) => line.replace(/\b([01]?\d|2[0-3])[:.][0-5]\d\b/g, " "))
    .map((line) => line.replace(/\b20\d{2}\b/g, " "))
    .map((line) => line.replace(/^\s*\d{1,2}\s*$/g, " "))
    .map((line) => line.replace(/\b(?:TL|TRY|₺)\b/gi, " "))
    .map((line) => cleanBankTitle(line))
    .filter((line) => {
      // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseLooseBankMovementRows fonksiyonunun Turkce karsiligi "cozumle gevsek banka movement satirlar"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseLooseBankMovementRows(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = getBankOcrLines(raw);
  // ACIKLAMA: joinedRows degiskeninin Turkce karsiligi "joined satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const joinedRows = [];

  for (let index = 0; index < lines.length; index += 1) {
    // ACIKLAMA: line degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const line = lines[index];
    // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dateMatch = findDateMatch(line);

    if (!dateMatch) {
      continue;
    }

    // ACIKLAMA: row degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const dateMatch = findDateMatch(row);
    // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const amountDetails = findBankMovementAmount([row]);

    if (!dateMatch || !amountDetails) {
      return null;
    }

    // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const date = parseBankDate(dateMatch.text);
    // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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


// ACIKLAMA: parseBankReceipts fonksiyonunun Turkce karsiligi "cozumle banka fisler"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankReceipts(raw) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(raw || "");
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(text);
  // ACIKLAMA: receiptKeywords degiskeninin Turkce karsiligi "fis keywords"; ilgili veri veya servis icin anahtar bilgisini tutar.
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
  // ACIKLAMA: looksLikeReceipt degiskeninin Turkce karsiligi "looks benzeri fis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const looksLikeReceipt = receiptKeywords.filter((keyword) => normalized.includes(keyword)).length >= 2;

  if (!looksLikeReceipt) {
    return [];
  }

  // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountDetails = findReceiptAmountDetails(text);

  if (!amountDetails) {
    return [];
  }

  // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const type = inferReceiptType(text, amountDetails.line || "", amountDetails);
  // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const date = findReceiptDate(text);
  // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findReceiptAmountDetails fonksiyonunun Turkce karsiligi "bul fis tutar ayrintilar"; AI destekli okuma veya API istegi akisini calistirir.
function findReceiptAmountDetails(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // ACIKLAMA: descriptors degiskeninin Turkce karsiligi "descriptors"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: normalizedLine degiskeninin Turkce karsiligi "normalized satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const normalizedLine = normalizeBankText(line);
      // ACIKLAMA: matchesDescriptor degiskeninin Turkce karsiligi "eslesmeler descriptor"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const matchesDescriptor = descriptor.keywords.some((keyword) => normalizedLine.includes(keyword));

      if (!matchesDescriptor) {
        continue;
      }

      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsed = extractReceiptAmountFromLine(line);

      if (parsed) {
        return { ...parsed, line, typeHint: descriptor.type };
      }
    }
  }

  return extractLabeledAmountFromText(raw) || extractAmountFromText(raw);
}

// ACIKLAMA: extractReceiptAmountFromLine fonksiyonunun Turkce karsiligi "ayikla fis tutar kaynakli satir"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractReceiptAmountFromLine(line) {
  // ACIKLAMA: moneySource degiskeninin Turkce karsiligi "para kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const moneySource = String.raw`([+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?)`;
  // ACIKLAMA: patterns degiskeninin Turkce karsiligi "kaliplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const patterns = [
    new RegExp(String.raw`(?:Hesabınızdan|Hesabinizdan|Hesabınıza|Hesabiniza)\s+${moneySource}`, "i"),
    new RegExp(
      String.raw`(?:TOPLAM\s+TAHS[İI]LAT\s+TUTARI|G[İI]DEN\s+FAST\s+TUTARI|EFT\s+TUTARI|HAVALE\s+TUTARI|TUTAR(?:I)?)\s*:?\s*${moneySource}`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const match = String(line || "").match(pattern);

    if (match) {
      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsed = parseBankAmount(match[1]);
      if (parsed) {
        return { ...parsed, match: match[1], index: match.index || 0 };
      }
    }
  }

  return extractAmountFromText(line);
}

// ACIKLAMA: inferReceiptType fonksiyonunun Turkce karsiligi "tahmin et fis tur"; ilgili uygulama islemini calistirir.
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

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findReceiptDate fonksiyonunun Turkce karsiligi "bul fis tarih"; ilgili uygulama islemini calistirir.
function findReceiptDate(raw) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(raw || "");
  // ACIKLAMA: labeledDatePatterns degiskeninin Turkce karsiligi "etiketli tarih kaliplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
    // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const match = text.match(pattern);

    if (match) {
      return parseBankDate(match[1]);
    }
  }

  // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dateMatch = findDateMatch(text);
  return dateMatch ? parseBankDate(dateMatch.text) : "";
}

// ACIKLAMA: findReceiptTitle fonksiyonunun Turkce karsiligi "bul fis baslik"; ilgili uygulama islemini calistirir.
function findReceiptTitle(raw) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(raw || "");
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(text);

  if (normalized.includes("kredi karti borcu odeme") || normalized.includes("kredi karti odemesi")) {
    // ACIKLAMA: cardLine degiskeninin Turkce karsiligi "kart satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const cardLine = lines.find((line) => normalizeBankText(line).includes("kart numarasi"));
    // ACIKLAMA: last4 degiskeninin Turkce karsiligi "last4"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const last4 = cardLine ? (cardLine.match(/(\d{4})\s*$/) || [])[1] : "";
    return last4 ? `Kredi Kartı Borcu Ödeme **** ${last4}` : "Kredi Kartı Borcu Ödeme";
  }

  if (normalized.includes("hesaptan hesaba havale")) {
    // ACIKLAMA: receiver degiskeninin Turkce karsiligi "receiver"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const receiver = extractReceiptField(lines, ["Alacaklı Adı Soyadı", "Alicakli Adi Soyadi", "Alacaklı Adı", "Alicakli Adi"]);
    return cleanBankTitle(["Hesaptan Hesaba Havale", receiver].filter(Boolean).join(" - "));
  }

  if (normalized.includes("giden fast eft")) {
    // ACIKLAMA: receiver degiskeninin Turkce karsiligi "receiver"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const receiver = extractReceiptField(lines, ["ALICI ÜNVANI", "ALICI UNVANI", "Alıcı", "Alici"]);
    // ACIKLAMA: description degiskeninin Turkce karsiligi "description"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const description = extractReceiptField(lines, ["AÇIKLAMA", "ACIKLAMA"]);
    return cleanBankTitle(["Giden FAST/EFT", receiver, description].filter(Boolean).join(" - "));
  }

  if (normalized.includes("fast gonderimi") || normalized.includes("fast gönderimi")) {
    // ACIKLAMA: receiver degiskeninin Turkce karsiligi "receiver"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const receiver = extractReceiptField(lines, ["ALICI ADI", "ALICI UNVANI"]);
    // ACIKLAMA: description degiskeninin Turkce karsiligi "description"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const description = extractReceiptField(lines, ["AÇIKLAMA", "ACIKLAMA"]);
    return cleanBankTitle(["FAST Gönderimi", receiver, description].filter(Boolean).join(" - "));
  }

  // ACIKLAMA: labeledTitlePatterns degiskeninin Turkce karsiligi "etiketli baslik kaliplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const match = line.match(pattern);

      if (match && cleanBankTitle(match[1])) {
        return cleanBankTitle(match[1]);
      }
    }
  }

  // ACIKLAMA: merchantLine degiskeninin Turkce karsiligi "merchant satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const merchantLine = lines.find((line) => {
    // ACIKLAMA: normalizedLine degiskeninin Turkce karsiligi "normalized satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractReceiptField fonksiyonunun Turkce karsiligi "ayikla fis alan"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractReceiptField(lines, labels) {
  // ACIKLAMA: normalizedLabels degiskeninin Turkce karsiligi "normalized etiketler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalizedLabels = labels.map(normalizeBankText);

  for (let index = 0; index < lines.length; index += 1) {
    // ACIKLAMA: line degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const line = lines[index];
    for (const label of labels) {
      // ACIKLAMA: pattern degiskeninin Turkce karsiligi "kalip"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const pattern = new RegExp(
        `${escapeRegExp(label)}\\s*:\\s*([^:]+?)(?=\\s+[A-ZÇĞİÖŞÜ][A-ZÇĞİÖŞÜ\\s/.-]{1,40}\\s*:|$)`,
        "i"
      );
      // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const match = String(line || "").match(pattern);
      // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const value = match ? cleanBankTitle(match[1]) : "";

      if (value) {
        // ACIKLAMA: continuation degiskeninin Turkce karsiligi "devami"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
        const continuation = shouldReadReceiptFieldContinuation(label) ? getReceiptFieldContinuation(lines, index) : "";
        return cleanBankTitle([value, continuation].filter(Boolean).join(" "));
      }
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    // ACIKLAMA: line degiskeninin Turkce karsiligi "satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const line = lines[index];
    // ACIKLAMA: normalizedLine degiskeninin Turkce karsiligi "normalized satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const normalizedLine = normalizeBankText(line);
    // ACIKLAMA: matchedLabel degiskeninin Turkce karsiligi "eslesen etiket"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matchedLabel = normalizedLabels.find((label) => normalizedLine.startsWith(label));

    if (!matchedLabel || !line.includes(":")) {
      continue;
    }

    // ACIKLAMA: afterColon degiskeninin Turkce karsiligi "sonrasi colon"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const afterColon = line.split(":").slice(1).join(":").trim();
    // ACIKLAMA: value degiskeninin Turkce karsiligi "deger"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const value = cleanBankTitle(afterColon);

    if (value) {
      return value;
    }
  }

  return "";
}


// ACIKLAMA: shouldReadReceiptFieldContinuation fonksiyonunun Turkce karsiligi "fis alani devamini okumali mi"; ilgili uygulama islemini calistirir.
function shouldReadReceiptFieldContinuation(label) {
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const normalized = normalizeBankText(label);
  return normalized.includes("alacakli adi") || normalized.includes("alici adi") || normalized.includes("alici unvani");
}

// ACIKLAMA: getReceiptFieldContinuation fonksiyonunun Turkce karsiligi "fis alani devamini al"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getReceiptFieldContinuation(lines, index) {
  // ACIKLAMA: nextLine degiskeninin Turkce karsiligi "sonraki satir"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const nextLine = cleanBankTitle(lines[index + 1] || "");
  // ACIKLAMA: normalizedNext degiskeninin Turkce karsiligi "normalized sonraki"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: escapeRegExp fonksiyonunun Turkce karsiligi "duzenli ifade metnini kacisla"; ilgili uygulama islemini calistirir.
function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


// ACIKLAMA: parseBankCsv fonksiyonunun Turkce karsiligi "banka CSV metnini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankCsv(raw) {
  // ACIKLAMA: delimiter degiskeninin Turkce karsiligi "ayrac"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const delimiter = detectCsvDelimiter(raw);

  if (!delimiter) {
    return [];
  }

  // ACIKLAMA: rows degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const rows = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseDelimitedLine(line, delimiter))
    .filter((row) => row.some((cell) => cell.trim()));

  if (rows.length < 2) {
    return [];
  }

  // ACIKLAMA: headers degiskeninin Turkce karsiligi "basliklar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const headers = rows[0].map(normalizeBankText);
  // ACIKLAMA: hasHeader degiskeninin Turkce karsiligi "var mi baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: dateIndex degiskeninin Turkce karsiligi "tarih dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dateIndex = findHeaderIndex(headers, ["tarih", "date", "valor"]);
  // ACIKLAMA: descriptionIndex degiskeninin Turkce karsiligi "description dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let descriptionIndex = findHeaderIndex(headers, [
    "aciklama",
    "description",
    "detay",
    "merchant",
    "isyeri",
    "unvan",
    "firma",
  ]);
  // ACIKLAMA: debitIndex degiskeninin Turkce karsiligi "borc dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debitIndex = findHeaderIndex(headers, ["borc", "debit", "harcama", "cekilen", "odeme"], [
    "bakiye",
    "balance",
  ]);
  // ACIKLAMA: creditIndex degiskeninin Turkce karsiligi "alacak dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const creditIndex = findHeaderIndex(headers, ["alacak", "credit", "gelir", "gelen", "yatirilan", "iade"], [
    "bakiye",
    "balance",
  ]);
  // ACIKLAMA: amountIndex degiskeninin Turkce karsiligi "tutar dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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
      // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const date = parseBankDate(row[dateIndex]);
      // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amountDetails = getCsvAmountDetails(row, amountIndex, debitIndex, creditIndex);

      if (!date || !amountDetails) {
        return null;
      }

      // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseBankText fonksiyonunun Turkce karsiligi "banka metnini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankText(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  // ACIKLAMA: lineMovements degiskeninin Turkce karsiligi "satir movements"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lineMovements = parseBankTextChunks(lines);

  if (lineMovements.length) {
    return lineMovements;
  }

  // ACIKLAMA: blocks degiskeninin Turkce karsiligi "bloklar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const blocks = raw
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

  return parseBankTextChunks(blocks);
}

// ACIKLAMA: parseBankTextChunks fonksiyonunun Turkce karsiligi "banka metin parcalarini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankTextChunks(chunks) {
  return chunks
    .map((chunk) => {
      // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const normalized = normalizeBankText(chunk);

      if (normalized.includes("tarih") && normalized.includes("tutar")) {
        return null;
      }

      // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const dateMatch = findDateMatch(chunk);

      if (!dateMatch) {
        return null;
      }

      // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const date = parseBankDate(dateMatch.text);
      // ACIKLAMA: chunkWithoutDate degiskeninin Turkce karsiligi "parca olmadan tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const chunkWithoutDate = chunk.replace(dateMatch.text, " ");
      // ACIKLAMA: amountDetails degiskeninin Turkce karsiligi "tutar ayrintilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amountDetails = extractLabeledAmountFromText(chunkWithoutDate) || extractAmountFromText(chunkWithoutDate);

      if (!date || !amountDetails) {
        return null;
      }

      // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: detectCsvDelimiter fonksiyonunun Turkce karsiligi "CSV ayracini algila"; ilgili uygulama islemini calistirir.
function detectCsvDelimiter(raw) {
  // ACIKLAMA: lines degiskeninin Turkce karsiligi "satirlar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
  // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidates = [";", "\t", ","];
  // ACIKLAMA: bestDelimiter degiskeninin Turkce karsiligi "en iyi ayrac"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let bestDelimiter = "";
  // ACIKLAMA: bestScore degiskeninin Turkce karsiligi "en iyi puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let bestScore = 0;

  candidates.forEach((delimiter) => {
    // ACIKLAMA: counts degiskeninin Turkce karsiligi "sayilar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const counts = lines.map((line) => parseDelimitedLine(line, delimiter).length).filter((count) => count > 1);

    if (counts.length < 2) {
      return;
    }

    // ACIKLAMA: average degiskeninin Turkce karsiligi "ortalama"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const average = counts.reduce((sum, count) => sum + count, 0) / counts.length;
    // ACIKLAMA: score degiskeninin Turkce karsiligi "puan"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const score = counts.length * 100 + average * 10;

    if (average >= 3 && score > bestScore) {
      bestDelimiter = delimiter;
      bestScore = score;
    }
  });

  return bestDelimiter;
}

// ACIKLAMA: parseDelimitedLine fonksiyonunun Turkce karsiligi "ayracli satiri cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseDelimitedLine(line, delimiter) {
  // ACIKLAMA: cells degiskeninin Turkce karsiligi "hucreler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const cells = [];
  // ACIKLAMA: current degiskeninin Turkce karsiligi "mevcut"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let current = "";
  // ACIKLAMA: inQuotes degiskeninin Turkce karsiligi "in quotes"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    // ACIKLAMA: char degiskeninin Turkce karsiligi "karakter"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const char = line[index];
    // ACIKLAMA: nextChar degiskeninin Turkce karsiligi "sonraki char"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: findHeaderIndex fonksiyonunun Turkce karsiligi "baslik dizinini bul"; ilgili uygulama islemini calistirir.
function findHeaderIndex(headers, includes, excludes = []) {
  return headers.findIndex(
    (header) =>
      includes.some((keyword) => header.includes(keyword)) &&
      !excludes.some((keyword) => header.includes(keyword))
  );
}

// ACIKLAMA: getCsvAmountDetails fonksiyonunun Turkce karsiligi "CSV tutar ayrintilarini al"; AI destekli okuma veya API istegi akisini calistirir.
function getCsvAmountDetails(row, amountIndex, debitIndex, creditIndex) {
  // ACIKLAMA: credit degiskeninin Turkce karsiligi "alacak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const credit = creditIndex >= 0 ? parseBankAmount(row[creditIndex]) : null;
  // ACIKLAMA: debit degiskeninin Turkce karsiligi "borc"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const debit = debitIndex >= 0 ? parseBankAmount(row[debitIndex]) : null;

  if (credit && credit.amount > 0) {
    return { ...credit, type: "income" };
  }

  if (debit && debit.amount > 0) {
    return { ...debit, type: "expense" };
  }

  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: extractLabeledAmountFromText fonksiyonunun Turkce karsiligi "etiketli tutari metinden ayikla"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractLabeledAmountFromText(text) {
  // ACIKLAMA: amountSource degiskeninin Turkce karsiligi "tutar kaynak"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountSource = String.raw`([+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?)`;
  // ACIKLAMA: patterns degiskeninin Turkce karsiligi "kaliplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const patterns = [
    new RegExp(String.raw`(?:İŞLEM|ISLEM|ALIŞVERİŞ|ALISVERIS|ÖDEME|ODEME|ÇEKİLEN|CEKILEN|YATAN|GELEN)?\s*TUTAR(?:I)?\s*:?\s*${amountSource}`, "gi"),
    new RegExp(String.raw`(?:HESABINIZDAN|HESABINIZA|HESABINIZA|HESABINIZDAN)[^\d+-]{0,60}${amountSource}`, "gi"),
  ];

  for (const pattern of patterns) {
    // ACIKLAMA: matches degiskeninin Turkce karsiligi "eslesmeler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const matches = Array.from(String(text || "").matchAll(pattern));

    for (const match of matches) {
      // ACIKLAMA: amountText degiskeninin Turkce karsiligi "tutar metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amountText = match[1] || match[0];
      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const parsed = parseBankAmount(amountText);

      if (parsed && parsed.amount > 0 && isMoneyLikeAmount(amountText)) {
        return parsed;
      }
    }
  }

  return null;
}

// ACIKLAMA: extractAmountFromText fonksiyonunun Turkce karsiligi "tutari metinden ayikla"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function extractAmountFromText(text) {
  // ACIKLAMA: amountPattern degiskeninin Turkce karsiligi "tutar kalip"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amountPattern =
    /[+-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})?\s*(?:TL|TRY|₺)?/gi;
  // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidates = Array.from(text.matchAll(amountPattern))
    .map((match) => {
      // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

      // ACIKLAMA: hasMoneySignal degiskeninin Turkce karsiligi "var mi para signal"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const hasMoneySignal = isMoneyLikeAmount(candidate.match);
      return hasMoneySignal || candidate.amount >= 1000;
    });

  if (!candidates.length) {
    return null;
  }

  // ACIKLAMA: signed degiskeninin Turkce karsiligi "isaretli"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const signed = candidates.find((candidate) => candidate.hasExplicitSign);

  if (signed) {
    return signed;
  }

  if (normalizeBankText(text).includes("bakiye") && candidates.length > 1) {
    return candidates[0];
  }

  return candidates[candidates.length - 1];
}

// ACIKLAMA: isMoneyLikeAmount fonksiyonunun Turkce karsiligi "para benzeri tutar mi"; ilgili uygulama islemini calistirir.
function isMoneyLikeAmount(value) {
  return /[+-]|₺|TL|TRY|[.,]\d{1,2}\b|\d{1,3}(?:[.\s]\d{3})+/i.test(String(value || ""));
}

// ACIKLAMA: isLikelySequenceOrTimeAmount fonksiyonunun Turkce karsiligi "sira veya saat gibi gorunen tutar mi"; ilgili uygulama islemini calistirir.
function isLikelySequenceOrTimeAmount(source, candidate) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(source || "");
  // ACIKLAMA: index degiskeninin Turkce karsiligi "dizin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const index = candidate.index || 0;
  // ACIKLAMA: before degiskeninin Turkce karsiligi "oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const before = text.slice(Math.max(0, index - 28), index);
  // ACIKLAMA: after degiskeninin Turkce karsiligi "sonrasi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const after = text.slice(index + candidate.match.length, index + candidate.match.length + 8);
  // ACIKLAMA: normalizedBefore degiskeninin Turkce karsiligi "normalized oncesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: parseBankAmount fonksiyonunun Turkce karsiligi "banka tutarini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankAmount(input) {
  // ACIKLAMA: original degiskeninin Turkce karsiligi "orijinal"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const original = String(input || "").trim();

  if (!/\d/.test(original)) {
    return null;
  }

  // ACIKLAMA: sign degiskeninin Turkce karsiligi "isaret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let sign = 1;
  // ACIKLAMA: hasExplicitSign degiskeninin Turkce karsiligi "var mi acik isaret"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let hasExplicitSign = false;
  // ACIKLAMA: normalized degiskeninin Turkce karsiligi "normalized"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: cleaned degiskeninin Turkce karsiligi "temizlenmis"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let cleaned = original
    .replace(/TRY|TL|₺/gi, "")
    .replace(/\s/g, "")
    .replace(/[−]/g, "-")
    .replace(/[^0-9,.\-+]/g, "")
    .replace(/[+-]/g, "");

  if (!cleaned) {
    return null;
  }

  // ACIKLAMA: lastComma degiskeninin Turkce karsiligi "son virgul"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastComma = cleaned.lastIndexOf(",");
  // ACIKLAMA: lastDot degiskeninin Turkce karsiligi "son nokta"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    cleaned =
      lastComma > lastDot ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    cleaned = /,\d{1,2}$/.test(cleaned) ? cleaned.replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastDot > -1 && !/\.\d{1,2}$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, "");
  }

  // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const amount = Number.parseFloat(cleaned);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return { amount: Math.abs(amount), sign, hasExplicitSign };
}

// ACIKLAMA: findDateMatch fonksiyonunun Turkce karsiligi "tarih eslesmesini bul"; ilgili uygulama islemini calistirir.
function findDateMatch(input) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(input || "");
  // ACIKLAMA: patterns degiskeninin Turkce karsiligi "kaliplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const patterns = [
    /\b\d{4}[./-]\d{1,2}[./-]\d{1,2}\b/,
    /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/,
    /\b\d{1,2}\s+(?:ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)\s+\d{2,4}\b/i,
  ];

  for (const pattern of patterns) {
    // ACIKLAMA: match degiskeninin Turkce karsiligi "eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const match = text.match(pattern);

    if (match) {
      return { text: match[0], index: match.index };
    }
  }

  return null;
}

// ACIKLAMA: parseBankDate fonksiyonunun Turkce karsiligi "banka tarihini cozumle"; metin, dosya veya API cevabindan gerekli bilgileri ayiklar.
function parseBankDate(input) {
  // ACIKLAMA: dateMatch degiskeninin Turkce karsiligi "tarih eslesme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const dateMatch = findDateMatch(input);

  if (!dateMatch) {
    return "";
  }

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = dateMatch.text.trim();
  // ACIKLAMA: namedMonthParts degiskeninin Turkce karsiligi "adli ay parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const namedMonthParts = normalizeBankText(text).split(" ");
  // ACIKLAMA: months degiskeninin Turkce karsiligi "months"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = text.split(/[./-]/).map((part) => part.trim());

  if (parts[0].length === 4) {
    return buildIsoDate(parts[0], parts[1], parts[2]);
  }

  return buildIsoDate(parts[2], parts[1], parts[0]);
}

// ACIKLAMA: buildIsoDate fonksiyonunun Turkce karsiligi "ISO tarihi olustur"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildIsoDate(yearValue, monthValue, dayValue) {
  // ACIKLAMA: year degiskeninin Turkce karsiligi "yil"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let year = Number(yearValue);
  // ACIKLAMA: month degiskeninin Turkce karsiligi "ay"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const month = Number(monthValue);
  // ACIKLAMA: day degiskeninin Turkce karsiligi "gun"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const day = Number(dayValue);

  if (year < 100) {
    year += 2000;
  }

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ACIKLAMA: cleanBankTitle fonksiyonunun Turkce karsiligi "banka basligini temizle"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: buildBankTitleFromRow fonksiyonunun Turkce karsiligi "satirdan banka basligi olustur"; kullanilacak veri yapisini veya HTML elemanini olusturur.
function buildBankTitleFromRow(row, usedIndexes) {
  return row
    .filter((cell, index) => cell && !usedIndexes.includes(index))
    .join(" ")
    .trim();
}

// ACIKLAMA: inferTransactionType fonksiyonunun Turkce karsiligi "islem turunu tahmin et"; ilgili uygulama islemini calistirir.
function inferTransactionType(title, sign = 1, hasExplicitSign = false) {
  if (sign < 0) {
    return "expense";
  }

  if (hasExplicitSign && sign > 0) {
    return "income";
  }

  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = normalizeBankText(title);
  // ACIKLAMA: incomeKeywords degiskeninin Turkce karsiligi "gelir keywords"; ilgili veri veya servis icin anahtar bilgisini tutar.
  const incomeKeywords = ["maas", "ucret", "gelir", "alacak", "gelen", "iade", "refund", "iptal", "temettu", "faiz"];

  return incomeKeywords.some((keyword) => text.includes(keyword)) ? "income" : "expense";
}

// ACIKLAMA: categorizeBankTransaction fonksiyonunun Turkce karsiligi "banka islemini kategorilendir"; ilgili uygulama islemini calistirir.
function categorizeBankTransaction(title, type) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: getTransactionSignature fonksiyonunun Turkce karsiligi "islem imzasini al"; gerekli veriyi okur, hesaplar veya uzak kaynaktan getirir.
function getTransactionSignature(item) {
  // ACIKLAMA: time degiskeninin Turkce karsiligi "saat"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: normalizeBankText fonksiyonunun Turkce karsiligi "banka metnini standartlastir"; veriyi uygulamanin bekledigi temiz formata cevirir.
function normalizeBankText(value) {
  // ACIKLAMA: map degiskeninin Turkce karsiligi "esleme"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: isValidTransaction fonksiyonunun Turkce karsiligi "gecerli islem mi"; ilgili uygulama islemini calistirir.
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

// ACIKLAMA: hideStartupSplash fonksiyonunun Turkce karsiligi "acilis ekranini gizle"; ilgili uygulama islemini calistirir.
function hideStartupSplash() {
  // ACIKLAMA: finishStartup degiskeninin Turkce karsiligi "finish baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
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

// ACIKLAMA: registerServiceWorker fonksiyonunun Turkce karsiligi "service worker kaydet"; ilgili uygulama islemini calistirir.
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  // ACIKLAMA: isHttp degiskeninin Turkce karsiligi "mi http"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
  if (!isHttp) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
