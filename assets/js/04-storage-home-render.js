function loadTransactions() {
  return mergeTransactions(loadJsonState(STORAGE_KEY, []));
}

function loadDeletedTransactionIds() {

  const values = loadJsonState(DELETED_TRANSACTIONS_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map(normalizeDeletedMarkerValue).filter(Boolean));
}

function loadDeletedTransactionSignatures() {

  const values = loadJsonState(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY, []);
  return new Set((Array.isArray(values) ? values : []).map(normalizeDeletedMarkerValue).filter(Boolean));
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

function normalizeDeletedProfileTombstone(item) {
  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    return item ? { id: item, deletedAt: "" } : null;
  }

  if (typeof item !== "object") {
    return null;
  }

  const id = String(item.id || "");
  if (!id) {
    return null;
  }

  return {
    id,
    deletedAt: String(item.deletedAt || ""),
  };
}

function mergeDeletedProfileTombstones(...sources) {
  const byId = new Map();

  sources
    .flat()
    .map(normalizeDeletedProfileTombstone)
    .filter(Boolean)
    .forEach((item) => {
      const existing = byId.get(item.id);
      if (!existing || getRecordTimestamp(item.deletedAt) > getRecordTimestamp(existing.deletedAt)) {
        byId.set(item.id, item);
      }
    });

  return Array.from(byId.values())
    .sort((left, right) => getRecordTimestamp(left.deletedAt) - getRecordTimestamp(right.deletedAt))
    .slice(-MAX_DELETED_PROFILE_TOMBSTONES);
}

function loadDeletedAssetTombstones() {
  return mergeDeletedProfileTombstones(loadJsonState(DELETED_ASSET_TOMBSTONES_STORAGE_KEY, []));
}

function loadDeletedBesTombstones() {
  return mergeDeletedProfileTombstones(loadJsonState(DELETED_BES_TOMBSTONES_STORAGE_KEY, []));
}

function applyDeletedProfileTombstones(records, tombstones) {
  const deletedById = new Map(
    mergeDeletedProfileTombstones(tombstones).map((item) => [item.id, item])
  );

  return (Array.isArray(records) ? records : []).filter((item) => {
    const tombstone = deletedById.get(String(item?.id || ""));
    if (!tombstone) {
      return true;
    }

    const deletedAt = getRecordTimestamp(tombstone.deletedAt);
    const recordUpdatedAt = getRecordTimestamp(item?.updatedAt) || getRecordTimestamp(item?.createdAt);
    return deletedAt > 0 && recordUpdatedAt > deletedAt;
  });
}

function getDeletedProfileRecordStateSnapshot() {
  return {
    assetTombstones: mergeDeletedProfileTombstones(deletedAssetTombstones),
    besTombstones: mergeDeletedProfileTombstones(deletedBesTombstones),
    debtTombstones: mergeDeletedProfileTombstones(silinenBorcAlacakIzleri),
  };
}

function readCloudDeletedProfileRecordState(data = {}) {
  return {
    assetTombstones: Array.isArray(data.deletedAssetTombstones) ? data.deletedAssetTombstones : [],
    besTombstones: Array.isArray(data.deletedBesTombstones) ? data.deletedBesTombstones : [],
    debtTombstones: Array.isArray(data.deletedDebtReceivableTombstones) ? data.deletedDebtReceivableTombstones : [],
  };
}

function mergeDeletedProfileRecordStates(...states) {
  return {
    assetTombstones: mergeDeletedProfileTombstones(
      ...states.map((state) => state?.assetTombstones || state?.deletedAssetTombstones || [])
    ),
    besTombstones: mergeDeletedProfileTombstones(
      ...states.map((state) => state?.besTombstones || state?.deletedBesTombstones || [])
    ),
    debtTombstones: mergeDeletedProfileTombstones(
      ...states.map((state) => state?.debtTombstones || state?.deletedDebtReceivableTombstones || [])
    ),
  };
}

function persistDeletedProfileTombstones() {
  deletedAssetTombstones = mergeDeletedProfileTombstones(deletedAssetTombstones);
  deletedBesTombstones = mergeDeletedProfileTombstones(deletedBesTombstones);
  silinenBorcAlacakIzleri = mergeDeletedProfileTombstones(silinenBorcAlacakIzleri);
  localStorage.setItem(
    getStorageKey(DELETED_ASSET_TOMBSTONES_STORAGE_KEY),
    JSON.stringify(deletedAssetTombstones)
  );
  localStorage.setItem(
    getStorageKey(DELETED_BES_TOMBSTONES_STORAGE_KEY),
    JSON.stringify(deletedBesTombstones)
  );
  localStorage.setItem(
    getStorageKey(SILINEN_BORC_ALACAK_STORAGE_KEY),
    JSON.stringify(silinenBorcAlacakIzleri)
  );
}

function applyDeletedProfileRecordState(...states) {
  const merged = mergeDeletedProfileRecordStates(getDeletedProfileRecordStateSnapshot(), ...states);
  deletedAssetTombstones = merged.assetTombstones;
  deletedBesTombstones = merged.besTombstones;
  silinenBorcAlacakIzleri = merged.debtTombstones;
  persistDeletedProfileTombstones();
  return merged;
}

function getCloudDeletedProfileRecordPayload(state = getDeletedProfileRecordStateSnapshot()) {
  const normalized = mergeDeletedProfileRecordStates(state);
  return {
    deletedAssetTombstones: normalized.assetTombstones,
    deletedBesTombstones: normalized.besTombstones,
    deletedDebtReceivableTombstones: normalized.debtTombstones,
  };
}

function markAssetDeleted(assetId, deletedAt = getTurkeyNowDateTime()) {
  deletedAssetTombstones = mergeDeletedProfileTombstones(
    deletedAssetTombstones,
    { id: String(assetId || ""), deletedAt }
  );
  persistDeletedProfileTombstones();
}

function markBesAccountDeleted(accountId, deletedAt = getTurkeyNowDateTime()) {
  deletedBesTombstones = mergeDeletedProfileTombstones(
    deletedBesTombstones,
    { id: String(accountId || ""), deletedAt }
  );
  persistDeletedProfileTombstones();
}

function limitMarkerArray(values, max = MAX_DELETED_TRANSACTION_MARKERS) {
  return Array.from(values || [])
    .map(normalizeDeletedMarkerValue)
    .filter(Boolean)
    .slice(-max);
}

function normalizeDeletedMarkerValue(item) {
  if (!item) {
    return "";
  }

  if (typeof item === "object") {
    return String(item.id || item.transactionId || item.transaction?.id || "");
  }

  return String(item || "");
}

function mergeMarkerSet(...sources) {

  const markers = [];
  sources.forEach((source) => {
    if (!source) {
      return;
    }

    const values =
      source instanceof Set || Array.isArray(source)
        ? Array.from(source)
        : [source];

    values.forEach((item) => {

      const value = normalizeDeletedMarkerValue(item);
      if (value) {
        markers.push(value);
      }
    });
  });

  return new Set(limitMarkerArray(new Set(markers)));
}

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

function mergeDeletedTransferTombstones(...sources) {

  const byKey = new Map();

  sources
    .flat()
    .map(normalizeDeletedTransferTombstone)
    .filter(Boolean)
    .forEach((item) => {

      const key = JSON.stringify(item);
      byKey.set(key, item);
    });

  return Array.from(byKey.values()).slice(-MAX_DELETED_TRANSFER_TOMBSTONES);
}

function applyDeletedTransactionState(...states) {

  const beforeIds = deletedTransactionIds.size;

  const beforeSignatures = deletedTransactionSignatures.size;

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

function getCloudDeletedTransactionPayload() {

  const snapshot = getDeletedTransactionStateSnapshot();
  return {
    deletedTransactionIds: snapshot.ids,
    deletedTransactionSignatures: snapshot.signatures,
    deletedTransferTombstones: snapshot.transferTombstones,
  };
}

function persistDeletedTransactionIds() {
  deletedTransactionIds = new Set(limitMarkerArray(deletedTransactionIds));
  localStorage.setItem(getStorageKey(DELETED_TRANSACTIONS_STORAGE_KEY), JSON.stringify([...deletedTransactionIds]));
}

function persistDeletedTransactionSignatures() {
  deletedTransactionSignatures = new Set(limitMarkerArray(deletedTransactionSignatures));
  localStorage.setItem(getStorageKey(DELETED_TRANSACTION_SIGNATURES_STORAGE_KEY), JSON.stringify([...deletedTransactionSignatures]));
}

function persistDeletedTransferTombstones() {

  const limited = deletedTransferTombstones.slice(-MAX_DELETED_TRANSFER_TOMBSTONES);
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

  // Benzer başlık/tutar/tarih yüzünden yeni kayıtların kaybolmasını engeller.
  if (id) {
    return deletedTransactionIds.has(id);
  }

  if (isValidTransaction(transaction) && deletedTransactionSignatures.has(getTransactionSignature(transaction))) {
    return true;
  }

  return isTransactionCoveredByDeletedTransferTombstone(transaction);
}

function loadAssets() {
  return applyDeletedProfileTombstones(loadJsonState(ASSETS_STORAGE_KEY, []), deletedAssetTombstones);
}

function loadBesAccounts() {
  return applyDeletedProfileTombstones(loadJsonState(BES_STORAGE_KEY, []), deletedBesTombstones);
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
    scheduleUserProfileCloudSync();
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

function loadTransactionsStateUpdatedAt() {

  const value = Number(localStorage.getItem(getStorageKey(TRANSACTIONS_STATE_UPDATED_STORAGE_KEY)));
  return Number.isFinite(value) ? value : 0;
}

function saveTransactionsStateUpdatedAt(timestamp = Date.now()) {
  localStorage.setItem(getStorageKey(TRANSACTIONS_STATE_UPDATED_STORAGE_KEY), String(timestamp));
  return timestamp;
}

function markTransactionsCloudDirty(timestamp = Date.now()) {
  localStorage.setItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY), String(timestamp));
  return timestamp;
}

function clearTransactionsCloudDirty(syncedThrough = Number.POSITIVE_INFINITY) {

  const dirtyAt = loadTransactionsCloudDirtyAt();
  if (dirtyAt && Number.isFinite(syncedThrough) && dirtyAt > syncedThrough) {
    return false;
  }

  localStorage.removeItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY));
  return true;
}

function loadTransactionsCloudDirtyAt() {

  const value = Number(localStorage.getItem(getStorageKey(TRANSACTIONS_CLOUD_DIRTY_STORAGE_KEY)));
  return Number.isFinite(value) ? value : 0;
}

function markTransactionsCloudFullSyncRequired() {
  localStorage.setItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY), "1");
}

function clearTransactionsCloudFullSyncRequired() {
  localStorage.removeItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY));
}

function isTransactionsCloudFullSyncRequired() {
  return localStorage.getItem(getStorageKey(TRANSACTIONS_CLOUD_FULL_SYNC_STORAGE_KEY)) === "1";
}

function getTransactionsNewestMutationTimestamp(records = []) {
  return records.reduce((latest, item) => {

    const timestamp =
      getRecordTimestamp(item?.updatedAt) ||
      getRecordTimestamp(item?.createdAt) ||
      getRecordTimestamp(item?.transactionAt) ||
      getTransactionSortTimestamp(item) ||
      0;
    return Math.max(latest, timestamp);
  }, 0);
}

function getPendingLocalTransactionUpserts(localRecords = [], cloudRecords = []) {

  const cloudById = new Map(
    getCloudReadyTransactions(cloudRecords)
      .filter((item) => !isTransactionDeleted(item))
      .map((item) => [String(item.id || ""), item])
      .filter(([id]) => id)
  );

  return getCloudReadyTransactions(localRecords)
    .filter((item) => !isTransactionDeleted(item))
    .filter((item) => {

      const id = String(item.id || "");
      if (!id) {
        return false;
      }

      const cloudItem = cloudById.get(id);
      if (!cloudItem) {
        return true;
      }

      const localTime = getTransactionMergeTimestamp(item);

      const cloudTime = getTransactionMergeTimestamp(cloudItem);
      if (localTime && cloudTime && localTime !== cloudTime) {
        return localTime > cloudTime;
      }

      return JSON.stringify(toCloudTransactionBackup(item)) !== JSON.stringify(toCloudTransactionBackup(cloudItem));
    });
}

function getPendingLocalTransactionDeletes(cloudRecords = []) {

  const deletedIds = new Set(Array.from(deletedTransactionIds || []).map((id) => String(id || "")).filter(Boolean));
  if (!deletedIds.size) {
    return [];
  }

  return getCloudReadyTransactions(cloudRecords)
    .map((item) => String(item.id || ""))
    .filter((id) => id && deletedIds.has(id));
}

function persistTransactions(options = {}) {
  const { syncCloud = true, replaceCloud = false, cloudUpserts = null, cloudDeletes = null } = options;

  transactions = mergeTransactions(transactions);
  localStorage.setItem(getStorageKey(), JSON.stringify(transactions));
  if (syncCloud) {

    const mutationTime = saveTransactionsStateUpdatedAt();
    markTransactionsCloudDirty(mutationTime);
  }
  updateStorageStatus();

  if (syncCloud) {
    return syncTransactionsToCloud({ replace: replaceCloud, upserts: cloudUpserts, deletes: cloudDeletes });
  }

  return Promise.resolve();
}

function persistAssets(options = {}) {
  const { syncCloud = true } = options;

  assets = applyDeletedProfileTombstones(assets, deletedAssetTombstones);
  persistDeletedProfileTombstones();
  localStorage.setItem(getStorageKey(ASSETS_STORAGE_KEY), JSON.stringify(assets));

  if (syncCloud) {
    scheduleUserProfileCloudSync(0);
  }
}

function persistBesAccounts(options = {}) {
  const { syncCloud = true } = options;

  besAccounts = applyDeletedProfileTombstones(besAccounts, deletedBesTombstones);
  persistDeletedProfileTombstones();
  localStorage.setItem(getStorageKey(BES_STORAGE_KEY), JSON.stringify(besAccounts));

  if (syncCloud) {
    scheduleUserProfileCloudSync(0);
  }
}

function persistPaymentAccounts(options = {}) {
  const { syncCloud = true } = options;

  localStorage.setItem(getStorageKey(PAYMENT_ACCOUNTS_STORAGE_KEY), JSON.stringify(paymentAccounts));
  window.setTimeout(() => checkCardPaymentReminders(), 0);

  if (syncCloud) {
    scheduleUserProfileCloudSync();
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
  if (activeView === "cardsView") {
    refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: true });
  }
  renderPaymentAccounts();
  renderBesAccounts();
  borcAlacaklariEkranaBas();
  renderHome();
  renderModernDashboard();
  renderCategoryBreakdown();
  if (activeView === "historyView") {
    renderTransactions();
  }
  if (recentTransactionsModal && !recentTransactionsModal.hidden) {
    renderRecentTransactionsModal();
  }
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
  return getHomeSummaryTransactions();
}

function getSummaryScopeLabel() {
  return isHomeSummaryFilterActive() ? getHomeSummaryFilterLabel() : "Tüm zamanlar";
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
      node.textContent = "Şu anda tüm zamanların gelir gider hesabı gösterilmektedir.";
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
  if (typeof renderModernShell === "function") renderModernShell();
  if (typeof closeSummaryDateFilterModal === "function") {
    const modal = document.getElementById("summaryDateFilterModal");
    if (modal && !modal.hidden) closeSummaryDateFilterModal();
  }
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

  const homeTransactions = getHomeSummaryTransactions();

  const totals = getTransactionTotals(homeTransactions);

  const assetTotal = assets.reduce((sum, item) => sum + getAssetValue(item), 0);

  const besTotalValue = getBesTotal();

  if (homeBalance) homeBalance.textContent = currency.format(totals.balance);
  if (homeInsight) {
    homeInsight.textContent = isHomeSummaryFilterActive()
      ? `Şu anda ${getHomeSummaryFilterLabel()} arası gelir gider hesabınız gösterilmektedir. ${
          totals.balance >= 0 ? "Gelirlerin giderlerinin üzerinde." : "Giderlerin gelirlerini aşıyor."
        }`
      : `Şu anda tüm zamanların gelir gider hesabı gösterilmektedir. ${
          totals.balance >= 0 ? "Gelirlerin giderlerinin üzerinde." : "Giderlerin gelirlerini aşıyor."
        }`;
  }
  if (homeAssetsTotal) homeAssetsTotal.textContent = currency.format(assetTotal);
  if (homeBesTotal) homeBesTotal.textContent = currency.format(besTotalValue);
  if (homeSavingsTotal) homeSavingsTotal.textContent = currency.format(totals.balance);

  updateHomeSummaryFilterStatus(totals, homeTransactions.length);
  renderHomeWealthChart({
    besTotalValue,
  });
}

function fitHomeWealthTotalText() {
  if (!homeWealthTotal || !homeWealthChart) {
    return;
  }

  const innerCircle = homeWealthTotal.closest("div");
  if (!innerCircle) {
    return;
  }

  const maxSize = window.innerWidth <= 720 ? 16 : 28;

  const minSize = window.innerWidth <= 720 ? 10 : 12;
  homeWealthTotal.style.fontSize = `${maxSize}px`;
  homeWealthTotal.style.whiteSpace = "nowrap";

  const availableWidth = Math.max(92, innerCircle.clientWidth - 10);

  let current = maxSize;

  while (homeWealthTotal.scrollWidth > availableWidth && current > minSize) {
    current -= 1;
    homeWealthTotal.style.fontSize = `${current}px`;
  }
}

function getHomeWealthSegments({ besTotalValue }) {

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
    ...groupedAssetSegments,
    { label: "BES", value: Math.max(besTotalValue, 0), color: "#173f5f" },
  ].filter((segment) => segment.value > 0);
  return segments;
}

function renderHomeWealthChart(totals) {
  if (!homeWealthChart || !homeWealthTotal || !homeWealthLegend) return;
  const segments = getHomeWealthSegments(totals);

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const wealthAmountsHidden =
    typeof shellAmountsHidden !== "undefined" && Boolean(shellAmountsHidden);
  homeWealthTotal.textContent = wealthAmountsHidden ? "••••" : currency.format(total);
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
      <strong>${
        wealthAmountsHidden
          ? "•••• · ••"
          : `${escapeHtml(currency.format(segment.value))} · %${ratio.toFixed(0)}`
      }</strong>
    `;
    homeWealthLegend.append(row);
  });
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
