// ACIKLAMA: Yedekleme, PDF/Excel disari aktarma, dosyadan ice aktarma ve paylasim kodu islemleri.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

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
    debtReceivables: bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari).length,
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
    version: 7,
    createdAt,
    summary: getCloudBackupSummary(),
    transactions: getCloudReadyTransactions(transactions),
    assets: getCloudReadyAssets(assets),
    besAccounts: getCloudReadyBesAccounts(besAccounts),
    debtReceivables: bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari),
    paymentAccounts: getCloudReadyPaymentAccounts(paymentAccounts),
    transactionCategories: normalizeCategoryState(transactionCategories),
    deletedTransactionState: getDeletedTransactionStateSnapshot(),
    deletedProfileRecordState: getDeletedProfileRecordStateSnapshot(),
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
    version: 8,
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
    debtReceivables: bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari),
    paymentAccounts: getCloudReadyPaymentAccounts(paymentAccounts),
    transactionCategories: normalizeCategoryState(transactionCategories),
    deletedTransactionState: getDeletedTransactionStateSnapshot(),
    deletedProfileRecordState: getDeletedProfileRecordStateSnapshot(),
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
    assets = mergeVersionedRecordsById(readCloudAssets(sourceAssets), assets);
  }

  // ACIKLAMA: sourceBesAccounts degiskeninin Turkce karsiligi "kaynak BES hesaplar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const sourceBesAccounts = getBackupArrayField(parsed, "besAccounts");
  if (sourceBesAccounts.length) {
    besAccounts = mergeVersionedRecordsById(readCloudBesAccounts(sourceBesAccounts), besAccounts);
  }

  const sourceDebtRecords = getBackupArrayField(parsed, "debtReceivables");
  if (sourceDebtRecords.length) {
    borcAlacakKayitlari = mergeVersionedRecordsById(
      buluttanBorcAlacakKayitlariniOku(sourceDebtRecords),
      borcAlacakKayitlari
    );
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

  if (parsed?.deletedProfileRecordState) {
    applyDeletedProfileRecordState(parsed.deletedProfileRecordState);
    assets = applyDeletedProfileTombstones(assets, deletedAssetTombstones);
    besAccounts = applyDeletedProfileTombstones(besAccounts, deletedBesTombstones);
    borcAlacakKayitlari = applyDeletedProfileTombstones(
      borcAlacakKayitlari,
      silinenBorcAlacakIzleri
    );
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
  borcAlacakKayitlariniKaliciKaydet();
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
    debtReceivables: sourceDebtRecords.length,
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
      version: 5,
      createdAt: getTurkeyNowDateTime(),
      transactions,
      assets,
      besAccounts,
      debtReceivables: borcAlacakKayitlari,
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

      if (parsed?.deletedProfileRecordState) {
        applyDeletedProfileRecordState(parsed.deletedProfileRecordState);
      }

      if (Array.isArray(parsed.assets)) {
        assets = mergeVersionedRecordsById(readCloudAssets(parsed.assets), assets);
        persistAssets();
      }

      if (Array.isArray(parsed.besAccounts)) {
        besAccounts = mergeVersionedRecordsById(readCloudBesAccounts(parsed.besAccounts), besAccounts);
        persistBesAccounts();
      }

      if (Array.isArray(parsed.debtReceivables)) {
        borcAlacakKayitlari = mergeVersionedRecordsById(
          buluttanBorcAlacakKayitlariniOku(parsed.debtReceivables),
          borcAlacakKayitlari
        );
        borcAlacakKayitlariniKaliciKaydet();
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
    version: 6,
    createdAt: getTurkeyNowDateTime(),
    transactions,
    assets: getCloudReadyAssets(assets),
    besAccounts: getCloudReadyBesAccounts(besAccounts),
    debtReceivables: bulutaHazirBorcAlacakKayitlari(borcAlacakKayitlari),
    paymentAccounts,
    transactionCategories,
    deletedProfileRecordState: getDeletedProfileRecordStateSnapshot(),
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

    if (parsed?.deletedProfileRecordState) {
      applyDeletedProfileRecordState(parsed.deletedProfileRecordState);
    }

    if (Array.isArray(parsed.assets)) {
      assets = mergeVersionedRecordsById(readCloudAssets(parsed.assets), assets);
      persistAssets();
    }

    if (Array.isArray(parsed.besAccounts)) {
      besAccounts = mergeVersionedRecordsById(readCloudBesAccounts(parsed.besAccounts), besAccounts);
      persistBesAccounts();
    }

    if (Array.isArray(parsed.debtReceivables)) {
      borcAlacakKayitlari = mergeVersionedRecordsById(
        buluttanBorcAlacakKayitlariniOku(parsed.debtReceivables),
        borcAlacakKayitlari
      );
      borcAlacakKayitlariniKaliciKaydet();
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
