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

function formatBackupDateTime(value) {

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

function updateCloudBackupStatus(profile = null) {
  if (!cloudBackupStatus) {
    return;
  }

  if (!currentUser) {
    cloudBackupStatus.textContent = "Bulut yedeği için giriş yap.";
    return;
  }

  const lastBackupAt = profile?.lastBackupAt || "";

  const summary = profile?.lastBackupSummary || null;

  const dateText = formatBackupDateTime(lastBackupAt);

  if (!dateText) {
    cloudBackupStatus.textContent = "Son yedek: Henüz yok.";
    return;
  }

  const countText = summary?.transactions ? ` · ${summary.transactions} kayıt` : "";
  cloudBackupStatus.textContent = `Son yedek: ${dateText}${countText}.`;
}

async function backupCurrentDataToCloud() {
  if (!ensureCloudReady(cloudBackupStatus)) {
    return;
  }

  if (!currentUser) {
    cloudBackupStatus.textContent = "Bulut yedeği almak için önce giriş yap.";
    return;
  }

  const previousText = cloudBackupButton?.textContent || "Yedek Al";

  const createdAt = getTurkeyNowDateTime();

  const backupId = `manual-${new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)}`;

  const payload = buildCloudBackupPayload(createdAt);

  try {
    if (cloudBackupButton) {
      cloudBackupButton.disabled = true;
      cloudBackupButton.textContent = "Yedekleniyor...";
    }
    cloudBackupStatus.textContent = "Bulut yedeği hazırlanıyor...";

    await Promise.all([syncTransactionsToCloud({ replace: false }), syncUserProfileToCloud()]);

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

function getLocalBackupFilename(createdAt = getTurkeyNowDateTime()) {

  const stamp = String(createdAt || getTurkeyNowDateTime())
    .replace(/[:T]/g, "-")
    .replace(/\+.*/, "")
    .replace(/\D/g, "")
    .slice(0, 12);
  return `akis-butce-yerel-yedek-${stamp || getExportStamp()}.json`;
}

function downloadLocalDataBackup() {

  const previousText = localBackupDownloadButton?.textContent || "Dosya İndir";

  const createdAt = getTurkeyNowDateTime();

  const payload = buildLocalDataBackupPayload(createdAt);

  const json = JSON.stringify(payload, null, 2);

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

function getBackupArrayField(parsed, key) {
  return Array.isArray(parsed?.[key]) ? parsed[key] : [];
}

function applyLocalDataBackup(parsed) {

  const sourceTransactions = Array.isArray(parsed)
    ? parsed
    : getBackupArrayField(parsed, "transactions");

  if (!Array.isArray(sourceTransactions)) {
    throw new Error("Yedek dosyasında kayıt listesi bulunamadı.");
  }

  const validTransactions = sourceTransactions.filter(isValidTransaction);
  transactions = mergeTransactions(validTransactions, transactions);

  const sourceAssets = getBackupArrayField(parsed, "assets");
  if (sourceAssets.length) {
    assets = mergeVersionedRecordsById(readCloudAssets(sourceAssets), assets);
  }

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

  const sourcePaymentAccounts = getBackupArrayField(parsed, "paymentAccounts");
  if (sourcePaymentAccounts.length) {
    paymentAccounts = mergeRecordsById(readCloudPaymentAccounts(sourcePaymentAccounts), paymentAccounts);
  }

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

function importLocalDataBackupFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const previousText = localBackupImportButton?.textContent || "Yedek Yükle";

  const reader = new FileReader();

  reader.onload = () => {
    try {
      if (localBackupImportButton) {
        localBackupImportButton.disabled = true;
        localBackupImportButton.textContent = "Yükleniyor...";
      }

      const parsed = JSON.parse(String(reader.result || ""));

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

function exportTransactions() {

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

function generateSyncCode() {

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
