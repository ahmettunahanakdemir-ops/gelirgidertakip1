// ACIKLAMA: Yerel depolama, silinmis kayit izleri, kategori listeleri ve ana sayfa render islemleri.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

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
