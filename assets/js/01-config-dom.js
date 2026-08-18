// ACIKLAMA: Sabitler, varsayilan veriler ve HTML elemanlarinin DOM referanslari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

// ACIKLAMA NOTU: Bu dosyada kod bloklarinin yaninda ne ise yaradiklarini anlatan yorumlar vardir.
// ACIKLAMA: STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const STORAGE_KEY = "akis-budget-tracker";
// ACIKLAMA: ASSETS_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const ASSETS_STORAGE_KEY = "akis-budget-assets";
// ACIKLAMA: BES_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const BES_STORAGE_KEY = "akis-budget-bes";
// ACIKLAMA: Borc ve alacak kayitlarinin kullaniciya ozel yerel depolama anahtari.
const BORC_ALACAK_STORAGE_KEY = "akis-budget-debt-receivables";
// ACIKLAMA: Silinen varliklarin baska cihazlarda yeniden gorunmesini engelleyen izleri saklar.
const DELETED_ASSET_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-asset-tombstones";
// ACIKLAMA: Silinen BES kayitlarinin baska cihazlarda yeniden gorunmesini engelleyen izleri saklar.
const DELETED_BES_TOMBSTONES_STORAGE_KEY = "akis-budget-deleted-bes-tombstones";
// ACIKLAMA: Silinen borc/alacak kayitlarinin baska cihazlarda geri gelmesini engelleyen izlerin anahtari.
const SILINEN_BORC_ALACAK_STORAGE_KEY = "akis-budget-deleted-debt-receivable-tombstones";
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
// ACIKLAMA: Cevrimdisi profil degisikliklerinin baglanti gelince buluta yeniden gonderilmesini saglar.
const PROFILE_CLOUD_DIRTY_STORAGE_KEY = "akis-budget-profile-cloud-dirty";
// ACIKLAMA: TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY localStorage icinde ilgili verinin saklanacagi anahtardir.
const TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY = "akis-budget-transactions-cloud-full-sync";
// ACIKLAMA: RECENT_ADDED_TRANSACTION_DAYS degiskeninin Turkce karsiligi "son eklenen islem days"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const RECENT_ADDED_TRANSACTION_DAYS = 3;
// ACIKLAMA: MAX_DELETED_TRANSACTION_MARKERS degiskeninin Turkce karsiligi "max silinmis islem isaretler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const MAX_DELETED_TRANSACTION_MARKERS = 5000;
// ACIKLAMA: MAX_DELETED_TRANSFER_TOMBSTONES degiskeninin Turkce karsiligi "max silinmis aktarim silme izleri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
const MAX_DELETED_TRANSFER_TOMBSTONES = 2000;
// ACIKLAMA: Varlik ve BES silme izlerinin yerel depolamada sinirsiz buyumesini onler.
const MAX_DELETED_PROFILE_TOMBSTONES = 2000;
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
  debtsView: {
    kicker: "Borçlarım",
    title: "Borç ve alacak takibi",
    subtitle: "Başkalarına olan borçlarını ve tahsil edeceğin alacaklarını tek ekranda izle.",
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
// ACIKLAMA: Tekli gelir/gider kaydinin aylik taksit serisi olarak olusturulup olusturulmayacagini belirler.
const entryInstallmentCheckbox = document.getElementById("entryInstallmentCheckbox");
// ACIKLAMA: Taksit secildiginde toplam kac aylik kayit olusturulacagini alan etiketiyle birlikte tutar.
const entryInstallmentCountField = document.getElementById("entryInstallmentCountField");
// ACIKLAMA: Tekli kayitta olusturulacak toplam taksit sayisini alir.
const entryInstallmentCountInput = document.getElementById("entryInstallmentCountInput");
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
const transactionInstallmentCheckbox = document.getElementById("transactionInstallmentCheckbox");
// ACIKLAMA: Gelir/gider duzenleme penceresindeki manuel borc, taksit veya alacak takibi alanlari.
const transactionTrackCheckbox = document.getElementById("transactionTrackCheckbox");
const transactionTrackOptions = document.getElementById("transactionTrackOptions");
const transactionTrackTypeInput = document.getElementById("transactionTrackTypeInput");
const transactionTrackDueDateLabel = document.getElementById("transactionTrackDueDateLabel");
const transactionTrackDueDateInput = document.getElementById("transactionTrackDueDateInput");
const transactionTrackInstallmentCountLabel = document.getElementById("transactionTrackInstallmentCountLabel");
const transactionTrackInstallmentCountInput = document.getElementById("transactionTrackInstallmentCountInput");
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
