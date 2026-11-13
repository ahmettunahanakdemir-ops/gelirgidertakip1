const BANK_IMPORT_MENU_LABELS = {
  upload: "Görsel Yükle",
  local: "Kayıtlara Ekle",
  ai: "Yapay Zeka ile Ekle",
};

function getBankImportActionIcon(type = "local") {
  switch (type) {
    case "upload":
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 16V7m0 0-3.5 3.5M12 7l3.5 3.5M5 17.5v1A2.5 2.5 0 0 0 7.5 21h9A2.5 2.5 0 0 0 19 18.5v-1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </svg>`;
    case "ai":
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 3l1.1 3.1L16 7.2l-2.9 1.1L12 11.4l-1.1-3.1L8 7.2l2.9-1.1L12 3Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/>
          <path d="M18 12l.8 2.2L21 15l-2.2.8L18 18l-.8-2.2L15 15l2.2-.8L18 12ZM7 13l1.2 3.3L11.5 17l-3.3 1.2L7 21.5l-1.2-3.3L2.5 17l3.3-1.2L7 13Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/>
        </svg>`;
    case "local":
    default:
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <ellipse cx="12" cy="5" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3 1.4 0 2.7-.2 3.8-.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
          <path d="M18 15v6m-3-3h6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
        </svg>`;
  }
}

function setBankImportActionButton(button, type, label = "") {
  if (!button) return;
  const resolvedLabel = String(label || BANK_IMPORT_MENU_LABELS[type] || "").trim();
  button.innerHTML = `${getBankImportActionIcon(type)}<span>${resolvedLabel}</span>`;
  button.setAttribute("aria-label", resolvedLabel);
  button.setAttribute("title", resolvedLabel);
}

function getBankImportActionButtonLabel(button, fallback = "") {
  return button?.querySelector("span")?.textContent?.trim() || button?.textContent?.trim() || fallback;
}

function setBankImportLoading(isLoading) {
  bankImportStatus?.classList.toggle("is-loading", Boolean(isLoading));
  if (closeBankImportModalButton) closeBankImportModalButton.disabled = Boolean(isLoading);
}

function openBankImportModal() {
  if (!bankImportModal) return;
  resetBankImportInputState("Henüz banka hareketi okunmadı.");
  bankImportModal.hidden = false;
  bankImportAccountSelect?.focus();
}

function closeBankImportModal() {
  if (!bankImportModal || closeBankImportModalButton?.disabled) return;
  resetBankImportInputState("Henüz banka hareketi okunmadı.");
  bankImportModal.hidden = true;
  if (activeView === "entryView") openBankImportModalButton?.focus();
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
    setBankImportActionButton(bankImportAddButton, "ai");
  }
  if (bankImportLocalButton) {
    setBankImportActionButton(bankImportLocalButton, "local");
  }

  if (!pendingBankFiles.length) {
    bankImportStatus.textContent = "Henüz banka hareketi okunmadı.";
    return;
  }

  const names = pendingBankFiles.map((file) => file.name).join(", ");
  bankImportStatus.textContent =
    `${pendingBankFiles.length} dosya seçildi: ${names}. Yapay zeka ile ya da gelişmiş yerel okuma ile kontrol edebilirsin.`;
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
      updatedAt: createdAt,
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
      extraOptions: {
        noteEnabled: false,
        note: "",
        isInstallment: false,
        installmentCount: 2,
        isDebtPayment: false,
        debtReceivableId: "",
      },
      followOptions: {
        selected: false,
        listType: "debt",
        dueDate: "",
      },
    };
  });
}

async function previewBankImportWithAccurateLocalOcr() {
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
    setBankImportActionButton(bankImportLocalButton, "local", "Okunuyor...");
  }
  if (bankImportCancelButton) bankImportCancelButton.disabled = true;
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
            importLabel: "Gelişmiş yerel banka okuma",
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
          importLabel: "Gelişmiş yerel banka okuma",
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
        setBankImportActionButton(bankImportLocalButton, "local");
      }
      return;
    }

    bankImportStatus.textContent =
      `${readyCount} hareket onay bekliyor. Eklemek istediklerinin kutusu işaretli kalsın, sonra "Kayıtlara Ekle" seçeneğine tekrar bas.` +
      (duplicateCount ? ` ${duplicateCount} tekrar işaretlenmedi.` : "") +
      (invalidCount ? ` ${invalidCount} satır okunamadı.` : "") +
      (failedFiles.length ? ` Okunamayan dosya: ${failedFiles.join(", ")}.` : "");
    if (bankImportLocalButton) {
      setBankImportActionButton(bankImportLocalButton, "local", "Seçilenleri Onayla ve Ekle");
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
      setBankImportActionButton(bankImportLocalButton, "local");
    }
  } finally {
    setBankImportLoading(false);
    if (bankImportAddButton) {
      bankImportAddButton.disabled = false;
    }
    if (bankImportLocalButton) {
      bankImportLocalButton.disabled = false;
      if (!pendingBankImports.length) {
        setBankImportActionButton(bankImportLocalButton, "local");
      }
    }
    if (bankImportCancelButton) bankImportCancelButton.disabled = false;
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

  const previousAddText = getBankImportActionButtonLabel(bankImportAddButton, BANK_IMPORT_MENU_LABELS.ai);

  bankImportAddButton.disabled = true;
  if (bankImportCancelButton) bankImportCancelButton.disabled = true;
  setBankImportLoading(true);
  if (bankImportAddButton) {
    setBankImportActionButton(bankImportAddButton, "ai", "Yapay Zeka Okuyor...");
  }
  bankImportStatus.textContent = "Yapay zeka banka ekranını ve sayfadaki gerçek hareket satırlarını algılıyor...";

  try {

    const payload = await buildBankAiImportPayload();

    const response = await fetch("/.netlify/functions/bank-ai-import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + await currentUser.getIdToken(),
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
      setBankImportActionButton(bankImportAddButton, "ai", pendingBankImports.length ? "Önizlemeyi Aç" : previousAddText);
    }

    bankImportStatus.textContent =
      `Yapay zeka ${movements.length} hareket algıladı; ${readyCount} hareket onay bekliyor.` +
      (duplicateCount ? ` ${duplicateCount} tekrar işaretlenmedi.` : "") +
      (invalidCount ? ` ${invalidCount} satır kontrol istiyor.` : "") +
      " Düzenlemek ve eklemek için önizleme penceresini kontrol et.";
    openBankImportPreviewModal();
  } catch (error) {

    const message = getBankAiImportErrorMessage(error);

    bankImportStatus.textContent = `${message} Gelişmiş yerel okuma için "Kayıtlara Ekle" butonunu kullanabilirsin.`;
  } finally {
    setBankImportLoading(false);
    bankImportAddButton.disabled = false;
    if (bankImportLocalButton) {
      bankImportLocalButton.disabled = false;
    }
    if (bankImportCancelButton) bankImportCancelButton.disabled = false;
    setBankImportActionButton(bankImportAddButton, "ai", pendingBankImports.length ? "Önizlemeyi Aç" : previousAddText);
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

async function recognizeBankImageUrl(url, statusLabel = "Görsel", pageSegmentationMode = "6") {
  if (statusLabel) {
    bankImportStatus.textContent = `${statusLabel} OCR ile okunuyor...`;
  }

  const worker = await createBankOcrWorker();
  try {
    return extractOcrTextFromResult(await recognizeBankImageData(worker, url, pageSegmentationMode));
  } finally {
    await worker.terminate();
  }
}

async function createBankOcrWorker() {
  const tesseract = await withTimeout(
    loadTesseract(),
    BANK_OCR_TIMEOUT_MS,
    "Görsel okuma motoru çok uzun sürede açıldı. Lütfen görseli tekrar seç."
  );
  let expired = false;
  const pending = tesseract.createWorker("tur+eng").then(async (worker) => {
    if (expired) await worker.terminate();
    return worker;
  });
  try {
    return await withTimeout(pending, BANK_OCR_TIMEOUT_MS, "Görsel okuma motoru başlatılamadı.");
  } catch (error) {
    expired = true;
    throw error;
  }
}

async function recognizeBankImageData(worker, image, mode = "6", whitelist = "") {
  // Okuma parametreleri createWorker secenekleri degil, motor parametreleridir.
  await worker.setParameters({
    tessedit_pageseg_mode: mode,
    preserve_interword_spaces: "1",
    tessedit_char_whitelist: whitelist,
  });
  return withTimeout(
    worker.recognize(image),
    BANK_OCR_TIMEOUT_MS,
    "OCR okuma çok uzun sürdü. Görseli kırpmadan, daha net ya da daha küçük boyutta tekrar yükle."
  );
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
  let worker = null;

  try {
    processedUrl = await preprocessImageForBankOcr(file);
    worker = await createBankOcrWorker();
    const candidates = [];
    const originalResults = [];
    const attempts = [
      { url: processedUrl || imageUrl, mode: "6", label: `${file.name} işlenmiş görüntü` },
    ];

    if (processedUrl) {
      attempts.push(
        { url: imageUrl, mode: "6", label: `${file.name} orijinal görüntü` },
        { url: imageUrl, mode: "11", label: `${file.name} dağınık satırlar` }
      );
    }

    for (const attempt of attempts) {
      try {
        bankImportStatus.textContent = `${attempt.label} OCR ile okunuyor...`;
        const result = await recognizeBankImageData(worker, attempt.url, attempt.mode);
        const text = extractOcrTextFromResult(result);
        // Daginik metin modu yalnizca konum tabanli cozumleme icindir; duz metindeki satir sirasini degistirebilir.
        if (attempt.mode !== "11") candidates.push(text);
        if (attempt.url === imageUrl) originalResults.push(result.data);
      } catch (error) {
        console.warn(`OCR denemesi tamamlanamadı (${attempt.label}).`, error);
      }
    }

    let cardRows = [];
    try {
      cardRows = await extractPositionedBankCardRows(file, originalResults, worker);
    } catch (error) {
      console.warn("Kart alanları ayrı okunamadı; tam görüntü sonucu kullanılacak.", error);
    }
    if (cardRows.length) {
      const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;
      return ["Tarih;Açıklama;Tutar", ...cardRows.map((row) =>
        [row.date, row.title, `${row.type === "income" ? "+" : "-"}${row.amount.toFixed(2).replace(".", ",")}`].map(cell).join(";")
      )].join("\n");
    }
    const bestText = chooseBestBankOcrText(candidates);

    if (!bestText) {
      throw new Error("Görselde okunabilir banka hareketi bulunamadı.");
    }

    return bestText;
  } finally {
    if (worker) await worker.terminate();
    URL.revokeObjectURL(imageUrl);
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }
  }
}

// Kart ekraninda sutunlari ayri okumak, magaza kodlarinin tutara ve komsu islemlerin birbirine eklenmesini onler.
async function extractPositionedBankCardRows(file, results, worker) {
  const screens = results.filter((data) =>
    normalizeBankText(data.text).includes("kart hareketleri") &&
    !hasAnyBankKeyword(data.text, BANK_OCR_BALANCE_KEYWORDS)
  );
  if (!screens.length || !window.createImageBitmap) return [];

  const bitmap = await createImageBitmap(file);
  try {
    const { width, height } = bitmap;
    const layouts = screens.map((data) => ({
      data,
      months: findPositionedBankDateAnchors(data.words || [], width, height),
    })).sort((a, b) => b.months.length - a.months.length ||
      b.months.reduce((sum, word) => sum + word.confidence, 0) - a.months.reduce((sum, word) => sum + word.confidence, 0));
    const layout = layouts[0];
    if (layout.months.length < 2) return [];

    const crop = (left, top, right, bottom) => {
      left = Math.max(0, Math.floor(left));
      top = Math.max(0, Math.floor(top));
      right = Math.min(width, Math.ceil(right));
      bottom = Math.min(height, Math.ceil(bottom));
      const canvas = document.createElement("canvas");
      const scale = Math.min(3, 2200 / width);
      canvas.width = Math.round((right - left) * scale) + 32;
      canvas.height = Math.round((bottom - top) * scale) + 32;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, left, top, right - left, bottom - top, 16, 16, canvas.width - 32, canvas.height - 32);
      return canvas;
    };
    const rows = [];
    const globalYear = String(layout.data.text).match(/\b20\d{2}\b/)?.[0] || getTurkeyTodayISO().slice(0, 4);
    for (let index = 0; index < layout.months.length; index++) {
      bankImportStatus.textContent = `${file.name}: ${index + 1}/${layout.months.length} hareketin alanları okunuyor...`;
      const month = layout.months[index];
      const top = month.bbox.y0 - width * 0.10;
      const bottom = layout.months[index + 1]
        ? layout.months[index + 1].bbox.y0 - width * 0.10
        : Math.min(height, month.bbox.y1 + width * 0.13);
      const dayResult = await recognizeBankImageData(worker,
        crop(width * 0.045, top, width * 0.155, month.bbox.y0 - width * 0.008), "7", "0123456789");
      const dateWords = screens.flatMap((data) => data.words || []).filter((word) =>
        word.bbox.x1 < width * 0.19 && word.bbox.y0 >= top && word.bbox.y0 < bottom);
      const dayVotes = new Map();
      const voteDay = (text, confidence) => {
        const digits = String(text).trim().replace(/[zZ]/g, "2").replace(/[oO]/g, "0").replace(/[Il|]/g, "1");
        const day = /^\d{1,2}$/.test(digits) ? Number(digits) : 0;
        if (day < 1 || day > 31) return;
        const vote = dayVotes.get(day) || {day, count: 0, confidence: 0};
        vote.count++;
        vote.confidence += Number(confidence) || 0;
        dayVotes.set(day, vote);
      };
      dateWords.filter((word) => word.bbox.y1 < month.bbox.y0).forEach((word) => voteDay(word.text, word.confidence));
      voteDay(dayResult.data.text, dayResult.data.confidence);
      const day = [...dayVotes.values()].sort((a, b) => b.count - a.count || b.confidence - a.confidence)[0]?.day || 0;
      const yearWord = dateWords.filter((word) => word.bbox.y0 > month.bbox.y1 && /^20\d{2}$/.test(word.text))
        .sort((a, b) => b.confidence - a.confidence)[0];
      let monthNumber = getPositionedBankMonth(month.text);
      if (!monthNumber) {
        const monthResult = await recognizeBankImageData(worker,
          crop(width * 0.045, month.bbox.y0 - 4, width * 0.155, month.bbox.y1 + 4), "7");
        monthNumber = getPositionedBankMonth(monthResult.data.text.trim());
      }
      const date = day >= 1 && day <= 31 ? buildIsoDate(yearWord?.text || globalYear, monthNumber, day) : "";
      const amountResult = await recognizeBankImageData(worker,
        crop(width * 0.69, top, width * 0.945, Math.min(bottom, month.bbox.y1)), "6");
      const amountLine = amountResult.data.text.split(/\r?\n/).find((line) => /\d[,.]\d{2}\b/.test(line));
      const amount = amountLine ? parseBankAmount(amountLine) : null;
      const titleResult = await recognizeBankImageData(worker,
        crop(width * 0.18, top, width * 0.69, bottom), "6");
      const title = cleanBankTitle(titleResult.data.text.split(/\r?\n/)
        .map((line) => line.replace(/\b(?:TRTR|TR|CH)\s*$/i, "").trim()).filter(Boolean).join(" "));
      if (!date || !amount || !title) return [];
      const type = inferBankTemplateTransactionType(title, amount, [title]);
      rows.push({date, title, amount: amount.amount, type});
    }
    return rows;
  } finally {
    bitmap.close();
  }
}

function getPositionedBankMonth(text) {
  return getBankMonthNumber(normalizeBankText(text).replace(/^adu$/, "agu"));
}

function findPositionedBankDateAnchors(words, width, height) {
  const dateColumn = words.filter((word) => word.bbox && word.bbox.x1 < width * 0.19 && word.bbox.y0 > height * 0.12);
  const months = dateColumn.filter((word) => getPositionedBankMonth(word.text) && normalizeBankText(word.text) !== "ara");
  // Ay adi yanlis okunsa bile altindaki yil, yeni bir hareketin baslangicini korur.
  dateColumn.filter((word) => /^20\d{2}$/.test(word.text)).forEach((year) => {
    if (months.some((month) => year.bbox.y0 - month.bbox.y1 > 0 && year.bbox.y0 - month.bbox.y1 < width * 0.045)) return;
    const preceding = dateColumn.filter((word) => word.bbox.y1 < year.bbox.y0 &&
      year.bbox.y0 - word.bbox.y1 < width * 0.045 && /[a-zA-ZğĞıİşŞüÜöÖçÇ]/.test(word.text))
      .sort((a, b) => b.bbox.y1 - a.bbox.y1)[0];
    if (preceding) months.push(preceding);
  });
  return months.sort((a, b) => a.bbox.y0 - b.bbox.y0);
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
    setBankImportActionButton(bankImportAddButton, "ai", pendingBankImports.length ? "Seçilenleri Onayla ve Ekle" : BANK_IMPORT_MENU_LABELS.ai);
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
    ". Eklemek istediklerini kontrol edip menüden ilgili ekleme seçeneğine tekrar bas.";
}

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
    setBankImportActionButton(bankImportAddButton, "ai");
  }

  if (bankImportLocalButton) {
    bankImportLocalButton.disabled = false;
    setBankImportActionButton(bankImportLocalButton, "local");
  }

  if (bankImportCancelButton) {
    if (bankImportCancelButton) bankImportCancelButton.disabled = false;
  }

  if (typeof statusText === "string" && bankImportStatus) {
    bankImportStatus.textContent = statusText;
  }
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
  const selectedItems = pendingBankImports.filter(
    (item, index) =>
      selectedIndexes.includes(index) &&
      item.valid &&
      !item.duplicate &&
      item.transaction?.title &&
      item.transaction?.date &&
      Number(item.transaction?.amount || 0) > 0
  );

  if (!selectedItems.length) {
    if (updateStatus) {
      bankImportStatus.textContent = "Eklenecek yeni hareket seçilmedi.";
    }
    return;
  }

  const selectedTransactions = [];
  const followSelections = new Map();

  for (const item of selectedItems) {
    const extraOptions = getBankImportExtraOptions(item);
    const followOptions = getBankImportFollowOptions(item);
    const now = getTurkeyNowDateTime();
    const time = getTimePart(item.transaction?.transactionAt || item.raw || "") || getTurkeyNowTime();
    const baseValues = {
      type: item.transaction.type,
      title: item.transaction.title,
      amount: item.transaction.amount,
      category: item.transaction.category,
      paymentMethod: item.transaction.paymentMethod,
      paymentAccountId: item.transaction.paymentAccountId,
      transferAccountId: item.transaction.transferAccountId,
      transferFee: item.transaction.transferFee || 0,
      date: item.transaction.date,
      note: extraOptions.noteEnabled ? String(extraOptions.note || "").trim() : "",
      isInstallment: extraOptions.isInstallment,
      installmentCount: extraOptions.installmentCount,
    };

    let entries = extraOptions.isInstallment
      ? gelirGiderTaksitSerisiniOlustur(baseValues, now, time)
      : [createEntryTransaction(baseValues, now, time)];

    if (extraOptions.isDebtPayment && typeof borcAlacakGelirGiderOdemesiniDogrula === "function") {
      const baglantiHatasi = borcAlacakGelirGiderOdemesiniDogrula(entries[0], extraOptions.debtReceivableId);
      if (baglantiHatasi) {
        bankImportStatus.textContent = baglantiHatasi;
        bankImportPreviewStatus.textContent = baglantiHatasi;
        openBankImportPreviewModal();
        return;
      }
      entries[0] = borcAlacakGelirGiderOdemesiniHazirla(entries[0], extraOptions.debtReceivableId);
    }

    const followError = entries
      .map((entry) => validateNewTransactionFollow(entry, followOptions, extraOptions.isDebtPayment))
      .find(Boolean);
    if (followError) {
      bankImportStatus.textContent = followError;
      bankImportPreviewStatus.textContent = followError;
      openBankImportPreviewModal();
      return;
    }

    selectedTransactions.push(...entries);
    entries.forEach((entry) => followSelections.set(entry.id, followOptions));
  }

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

  if (!selectedTransactions.every((transaction) => validateTransactionPayment(transaction, bankImportPreviewStatus || bankImportStatus))) {
    if (updateStatus && bankImportStatus && bankImportPreviewStatus?.textContent) {
      bankImportStatus.textContent = bankImportPreviewStatus.textContent;
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
  selectedTransactions.forEach((item) => applyNewTransactionFollow(item, followSelections.get(item.id)));
  selectedTransactions.forEach((entry) => {
    if (entry.debtPaymentId && typeof borcAlacakGelirGiderOdemesiniUygula === "function") {
      borcAlacakGelirGiderOdemesiniUygula(entry);
    }
  });
  persistTransactions({ cloudUpserts: selectedTransactions });
  render();

  resetBankImportInputState(
    updateStatus
      ? `${selectedTransactions.length} banka hareketi kayıtlara eklendi. Seçilen hesap, karşı hesap, dosya/görsel ve önizleme alanı temizlendi.`
      : null
  );
  bankImportModal?.dispatchEvent(new CustomEvent("bank-import-completed", { detail: selectedTransactions.length }));
}

function clearBankImport() {
  resetBankImportInputState("Banka içe aktarma alanı temizlendi.");
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

  const titleField = createBankImportEditField("Başlık", createBankImportEditInput(index, "title", item.transaction.title, "text"));
  const amountField = createBankImportEditField("Tutar", createBankImportEditInput(index, "amount", item.transaction.amount, "number"));
  const typeField = createBankImportEditField("Tip", createBankImportTypeSelect(index, item.transaction.type));
  const categoryField = createBankImportEditField("Kategori", createBankImportCategorySelect(index, item.transaction.type, item.transaction.category));
  const accountField = createBankImportEditField("Kart / hesap", createBankImportPaymentAccountSelect(index, "paymentAccountId", item.transaction.paymentAccountId, item.transaction.transferAccountId));
  const transferField = createBankImportEditField("Karşı hesap", createBankImportPaymentAccountSelect(index, "transferAccountId", item.transaction.transferAccountId, item.transaction.paymentAccountId));
  const dateField = createBankImportEditField("Tarih", createBankImportEditInput(index, "date", item.transaction.date, "date"));

  const mainRow = document.createElement("div");
  mainRow.className = "bank-import-entry-row bank-import-entry-main-row";
  mainRow.append(titleField, amountField);

  const categoryRow = document.createElement("div");
  categoryRow.className = "bank-import-entry-row bank-import-entry-category-row";
  categoryRow.append(typeField, categoryField);

  const paymentRow = document.createElement("div");
  paymentRow.className = "bank-import-entry-row bank-import-entry-payment-row";
  paymentRow.append(accountField, transferField, dateField);

  const choiceRow = document.createElement("div");
  choiceRow.className = "bank-import-entry-row bank-import-entry-choice-row";
  choiceRow.append(createBankImportOptionalDeck(index, item));

  body.append(mainRow, categoryRow, paymentRow, choiceRow);

  row.append(checkbox, body);
  return row;
}

function createBankImportEditField(labelText, control) {

  const label = document.createElement("label");
  label.textContent = labelText;
  label.append(control);
  return label;
}

function getBankImportExtraOptions(item) {
  if (!item.extraOptions) {
    item.extraOptions = {
      noteEnabled: false,
      note: "",
      isInstallment: false,
      installmentCount: 2,
      isDebtPayment: false,
      debtReceivableId: "",
    };
  }
  if (!Number.isInteger(Number(item.extraOptions.installmentCount)) || Number(item.extraOptions.installmentCount) < 2) {
    item.extraOptions.installmentCount = 2;
  }
  return item.extraOptions;
}

function getBankImportFollowOptions(item) {
  if (!item.followOptions) {
    item.followOptions = { selected: false, listType: "debt", dueDate: "" };
  }
  item.followOptions.selected = Boolean(item.followOptions.selected);
  item.followOptions.listType = item.followOptions.listType === "receivable" ? "receivable" : "debt";
  item.followOptions.dueDate = String(item.followOptions.dueDate || "");
  return item.followOptions;
}

function createBankImportOptionalDeck(index, item) {
  const extraOptions = getBankImportExtraOptions(item);
  const followOptions = getBankImportFollowOptions(item);
  const transferMi = item.transaction.type === "transfer";

  if (transferMi) {
    extraOptions.isInstallment = false;
    extraOptions.isDebtPayment = false;
    extraOptions.debtReceivableId = "";
  }
  if (extraOptions.isDebtPayment) {
    extraOptions.isInstallment = false;
  }

  const deck = document.createElement("div");
  deck.className = "entry-option-deck bank-import-option-deck";
  const toggles = document.createElement("div");
  toggles.className = "entry-option-toggles bank-import-option-toggles";
  const details = document.createElement("div");
  details.className = "entry-option-details bank-import-option-details";

  const noteField = document.createElement("label");
  noteField.className = "entry-note-field bank-import-note-field";
  noteField.hidden = !extraOptions.noteEnabled;
  noteField.innerHTML = 'Not<input data-bank-note-input type="text" maxlength="100" placeholder="Kısa not" />';
  const noteInput = noteField.querySelector("input");
  noteInput.value = String(extraOptions.note || "");
  noteInput.disabled = !extraOptions.noteEnabled;
  noteInput.addEventListener("input", () => {
    getBankImportExtraOptions(item).note = noteInput.value;
  });

  const noteToggle = document.createElement("label");
  noteToggle.className = "bank-import-toggle-card";
  noteToggle.innerHTML = '<input data-bank-note-toggle type="checkbox" /><span>Not ekle</span>';
  const noteCheckbox = noteToggle.querySelector('input');
  noteCheckbox.checked = Boolean(extraOptions.noteEnabled);
  noteCheckbox.disabled = Boolean(item.duplicate);
  noteToggle.addEventListener("change", () => {
    const options = getBankImportExtraOptions(item);
    options.noteEnabled = Boolean(noteCheckbox.checked);
    noteField.hidden = !options.noteEnabled;
    noteInput.disabled = !options.noteEnabled;
  });

  const installmentGroup = document.createElement("div");
  installmentGroup.className = "entry-choice-group bank-import-installment-group";
  installmentGroup.innerHTML = `
    <label class="bank-import-toggle-card">
      <input data-bank-installment-toggle type="checkbox" />
      <span>Bu işlem taksit mi?</span>
    </label>
    <label data-bank-installment-count-field hidden>
      Toplam taksit sayısı
      <input data-bank-installment-count type="number" min="2" max="60" step="1" inputmode="numeric" value="2" />
    </label>`;
  const installmentCheckbox = installmentGroup.querySelector('[data-bank-installment-toggle]');
  const installmentCountField = installmentGroup.querySelector('[data-bank-installment-count-field]');
  const installmentCountInput = installmentGroup.querySelector('[data-bank-installment-count]');
  installmentCheckbox.checked = Boolean(extraOptions.isInstallment);
  installmentCheckbox.disabled = Boolean(item.duplicate || transferMi || extraOptions.isDebtPayment);
  installmentCountInput.value = String(extraOptions.installmentCount || 2);
  installmentCountField.hidden = !extraOptions.isInstallment;
  installmentCountInput.disabled = !extraOptions.isInstallment;
  installmentCheckbox.addEventListener("change", () => {
    const options = getBankImportExtraOptions(item);
    options.isInstallment = Boolean(installmentCheckbox.checked) && !options.isDebtPayment && item.transaction.type !== "transfer";
    installmentCountField.hidden = !options.isInstallment;
    installmentCountInput.disabled = !options.isInstallment;
    if (options.isInstallment && Number(installmentCountInput.value || 0) < 2) {
      installmentCountInput.value = "2";
    }
  });
  installmentCountInput.addEventListener("input", () => {
    const count = Math.max(2, Math.min(60, Math.trunc(Number(installmentCountInput.value || 2))));
    getBankImportExtraOptions(item).installmentCount = count;
  });
  installmentCountInput.addEventListener("change", () => {
    const count = Math.max(2, Math.min(60, Math.trunc(Number(installmentCountInput.value || 2))));
    installmentCountInput.value = String(count);
    getBankImportExtraOptions(item).installmentCount = count;
  });

  const debtPaymentGroup = document.createElement("div");
  debtPaymentGroup.className = "entry-choice-group bank-import-debt-payment-group";
  debtPaymentGroup.innerHTML = `
    <label class="bank-import-toggle-card">
      <input data-bank-debt-payment-toggle type="checkbox" />
      <span>Bu işlem borç ödemesi / alacak tahsilatı mı?</span>
    </label>
    <div class="entry-debt-payment-options bank-import-debt-payment-options" data-bank-debt-payment-options hidden>
      <label>
        <span data-bank-debt-payment-label>Bağlı kayıt</span>
        <select data-bank-debt-payment-target></select>
      </label>
      <p data-bank-debt-payment-hint></p>
    </div>`;
  const debtPaymentCheckbox = debtPaymentGroup.querySelector('[data-bank-debt-payment-toggle]');
  const debtPaymentOptions = debtPaymentGroup.querySelector('[data-bank-debt-payment-options]');
  const debtPaymentTarget = debtPaymentGroup.querySelector('[data-bank-debt-payment-target]');
  const debtPaymentLabel = debtPaymentGroup.querySelector('[data-bank-debt-payment-label]');
  const debtPaymentHint = debtPaymentGroup.querySelector('[data-bank-debt-payment-hint]');
  debtPaymentCheckbox.checked = Boolean(extraOptions.isDebtPayment);
  debtPaymentCheckbox.disabled = Boolean(item.duplicate || transferMi);
  debtPaymentOptions.hidden = !extraOptions.isDebtPayment;
  debtPaymentTarget.disabled = !extraOptions.isDebtPayment;
  debtPaymentCheckbox.addEventListener("change", () => {
    const options = getBankImportExtraOptions(item);
    options.isDebtPayment = Boolean(debtPaymentCheckbox.checked) && item.transaction.type !== "transfer";
    if (options.isDebtPayment) {
      options.isInstallment = false;
      installmentCheckbox.checked = false;
      installmentCheckbox.disabled = true;
      installmentCountField.hidden = true;
      installmentCountInput.disabled = true;
    } else {
      installmentCheckbox.disabled = Boolean(item.duplicate || item.transaction.type === "transfer");
    }
    debtPaymentOptions.hidden = !options.isDebtPayment;
    debtPaymentTarget.disabled = !options.isDebtPayment;
  });
  fillBankImportDebtPaymentOptions(item, debtPaymentTarget, debtPaymentLabel, debtPaymentHint);
  debtPaymentTarget.value = String(extraOptions.debtReceivableId || "");
  debtPaymentTarget.addEventListener("change", () => {
    getBankImportExtraOptions(item).debtReceivableId = String(debtPaymentTarget.value || "");
    fillBankImportDebtPaymentOptions(item, debtPaymentTarget, debtPaymentLabel, debtPaymentHint);
  });

  const followControl = createNewTransactionFollowControl(followOptions);
  const followToggleLabel = followControl.querySelector(".transaction-follow-toggle");
  const followCheckbox = followToggleLabel?.querySelector('input[type="checkbox"]');
  if (followCheckbox) {
    followCheckbox.disabled = Boolean(item.duplicate);
  }

  toggles.append(noteToggle, installmentGroup.querySelector("label"), debtPaymentGroup.querySelector("label"), followToggleLabel);
  details.append(noteField, installmentGroup, debtPaymentGroup, followControl);
  deck.append(toggles, details);

  const syncFollowOptions = () => {
    item.followOptions = readNewTransactionFollowControl(deck);
  };
  followCheckbox?.addEventListener("change", syncFollowOptions);
  followControl.addEventListener("change", syncFollowOptions);
  syncFollowOptions();

  return deck;
}

function fillBankImportDebtPaymentOptions(item, select, label, hint) {
  const extraOptions = getBankImportExtraOptions(item);
  const alacakMi = item.transaction?.type === "income";
  const uygunKayitlar = (typeof borcAlacakKayitlari !== "undefined" ? borcAlacakKayitlari : [])
    .filter((entry) => entry.status === "open" && Number(entry.amount || 0) > 0)
    .filter((entry) => alacakMi ? entry.kind === "receivable" : entry.kind === "debt")
    .sort((left, right) => {
      const leftDate = left.dueDate || left.startDate || "9999-12-31";
      const rightDate = right.dueDate || right.startDate || "9999-12-31";
      return leftDate.localeCompare(rightDate) || String(left.person || "").localeCompare(String(right.person || ""), "tr");
    });

  if (label) {
    label.textContent = alacakMi ? "Tahsil edilecek alacak" : "Ödenecek borç / taksit";
  }
  if (select) {
    const seciliKayitId = String(extraOptions.debtReceivableId || select.value || "");
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = uygunKayitlar.length
      ? (alacakMi ? "Tahsil edilecek alacağı seç" : "Ödenecek borç veya taksiti seç")
      : (alacakMi ? "Kalan alacak kaydı bulunmuyor" : "Kalan borç veya taksit kaydı bulunmuyor");
    select.append(placeholder);
    uygunKayitlar.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = `${entry.person} · ${borcAlacakListeTuruEtiketi(entry.listType)} · Kalan ${currency.format(entry.amount)}`;
      select.append(option);
    });
    select.value = uygunKayitlar.some((entry) => entry.id === seciliKayitId) ? seciliKayitId : "";
    extraOptions.debtReceivableId = select.value;
  }
  if (hint) {
    const kayit = typeof borcAlacakKayitlari !== "undefined"
      ? borcAlacakKayitlari.find((entry) => entry.id === String(extraOptions.debtReceivableId || ""))
      : null;
    hint.textContent = kayit
      ? `${kayit.person} kaydında kalan ${currency.format(kayit.amount)} tutardan düşülecek.`
      : (alacakMi
        ? "Yalnızca kalan alacak kayıtları gösterilir."
        : "Yalnızca kalan borç ve taksit kayıtları gösterilir.");
  }
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

  if (bankImportSelectAllButton) {
    bankImportSelectAllButton.disabled = readyCount === 0;
  }
}

function openBankImportPreviewModal() {
  renderBankImportPreview();

  if (!pendingBankImports.length) {
    bankImportStatus.textContent = "Önce yapay zeka ile ya da gelişmiş yerel okuma ile hareketleri hazırla.";
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

  const mobileMovements = dedupeBankMovements(parseMobileBankOcrRows(normalizedRaw));

  const screenshotMovements = dedupeBankMovements(parseBankScreenshotMovements(normalizedRaw));

  const mobileRowStartCount = countMobileBankOcrStarts(getBankOcrLines(normalizedRaw));

  const bestScreenMovements = selectBestBankScreenMovements(
    normalizedRaw,
    [templateMovements, mobileMovements, screenshotMovements],
    Math.max(templateRowStartCount, mobileRowStartCount)
  );

  if (shouldTrustBankAppTemplateRows(normalizedRaw, bestScreenMovements)) {
    return bestScreenMovements;
  }

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

function selectBestBankScreenMovements(raw, movementGroups, rowStartCount = 0) {
  const groups = (movementGroups || [])
    .map((items, index) => ({ items: dedupeBankMovements(items || []), index }))
    .filter((group) => group.items.length);

  if (!groups.length) {
    return [];
  }

  const strictCardScreen = isStrictBankCardScreen(raw) || normalizeBankText(raw).includes("kart hareketleri");

  return groups
    .map((group) => {
      const signedCount = group.items.filter((item) => item.hasExplicitSign).length;
      const suspiciousCount = group.items.filter((item) =>
        !Number.isFinite(Number(item.amount)) || Number(item.amount) <= 0 || Number(item.amount) > 10000000
      ).length;
      const overCount = rowStartCount ? Math.max(0, group.items.length - rowStartCount) : 0;
      const missingCount = rowStartCount ? Math.max(0, rowStartCount - group.items.length) : 0;
      const score =
        Math.min(group.items.length, rowStartCount || group.items.length) * 100 +
        signedCount * (strictCardScreen ? 2 : 12) -
        overCount * 160 -
        missingCount * 45 -
        suspiciousCount * 200 -
        group.index * 3;

      return { ...group, score };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)[0].items;
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
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|eyi|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";

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

  if (/\bodeme\b.{0,24}\btesekkur\b/.test(text)) {
    return "income";
  }

  if (text.includes("nakit avans") && !amountDetails.hasExplicitSign) {
    return "income";
  }

  if (amountDetails.sign < 0) {
    return "expense";
  }

  if (amountDetails.hasExplicitSign && amountDetails.sign > 0) {
    return "income";
  }

  if (/faiz tahakkuku|kay\s*kul\s*dest|bank\s*sig\s*mua\s*verg/.test(text)) {
    return "expense";
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
  const lines = String(raw || "")
    .replace(/[−–—]/g, "-")
    .replace(/[|¦]/g, " ")
    .replace(/[₺]/g, " ₺ ")
    .replace(/\bT\s*[LIİ1]\b/gi, "TL")
    .replace(/\bT\s*R\s*Y\b/gi, "TRY")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => fixCommonBankOcrTokens(normalizeOcrMoneyCharacters(line)).replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);

  const hasPerMovementBalance = lines.some((line) => normalizeBankText(line).includes("kalan bakiye"));

  if (hasPerMovementBalance) {
    for (let index = 1; index < lines.length; index += 1) {
      const dateWithDetail = lines[index].match(/^(\d{1,2})\s+(.+)$/);
      const previousAmounts = findUsableMoneyMatchesInLine(lines[index - 1] || "");
      const currentAmounts = findUsableMoneyMatchesInLine(lines[index]);

      if (
        dateWithDetail &&
        Number(dateWithDetail[1]) >= 1 &&
        Number(dateWithDetail[1]) <= 31 &&
        !currentAmounts.length &&
        previousAmounts.some((item) => item.details.hasExplicitSign)
      ) {
        lines[index - 1] = `${String(Number(dateWithDetail[1])).padStart(2, "0")} ${lines[index - 1]}`;
        lines[index] = dateWithDetail[2].trim();
      }
    }
  }

  for (let index = 1; index < lines.length; index += 1) {
    const dayMatch = lines[index].match(/^(\d{1,2})$/);
    const previousLine = lines[index - 1] || "";

    if (
      dayMatch &&
      Number(dayMatch[1]) >= 1 &&
      Number(dayMatch[1]) <= 31 &&
      /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(previousLine) &&
      findMoneyMatchesInLine(previousLine).length
    ) {
      lines[index - 1] = `${String(Number(dayMatch[1])).padStart(2, "0")} ${previousLine}`;
      lines.splice(index, 1);
      index -= 1;
    }
  }

  return lines.join("\n");
}

function fixCommonBankOcrTokens(value) {
  return String(value || "")
    .replace(/^\s*0\s*(?:=|g|D)\s+(?=[A-Za-zÇĞİÖŞÜçğıöşü])/i, "05 ")
    .replace(/^\s*[O0Ö]Z(?=\s|$)/i, "07")
    .replace(/^\s*([1-3])\s+(\d)(?=\s|$)/, (_, tens, ones) => {
      const day = Number(`${tens}${ones}`);
      return day <= 31 ? String(day).padStart(2, "0") : `${tens} ${ones}`;
    })
    .replace(/^\s*0\s+(\d)(?=\s|$)/, "0$1")
    .replace(/^\s*00(\d)(?=\s|$)/, "0$1")
    .replace(/^\s*[([]?[OQ]\s*0?(\d{1,2})(?=\s|$)/i, (_, day) => String(Number(day)).padStart(2, "0"))
    .replace(/^(\d{1,2})\s+-\s+(?=\d)/, "$1 ")
    .replace(/\bEY[Iİ1]\b/gi, "EYL")
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
      const previousLines = lines.slice(Math.max(0, start.index - 16), start.index);
      return parseMobileBankOcrBlock(block, start, previousLines);
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
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|temmuz|tem|agustos|ağustos|agu|eylul|eylül|eyl|eyi|ekim|eki|kasim|kasım|kas|aralik|aralık|ara)";

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

function parseMobileBankOcrBlock(block, start, previousLines = []) {

  const amountDetails = findBankMovementAmount(block);

  if (!amountDetails) {
    return null;
  }

  const date = buildMobileBankOcrDate(block, start.day, previousLines);

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

function buildMobileBankOcrDate(block, day, previousLines = []) {

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

  if (!month && previousLines.length) {
    for (let index = previousLines.length - 1; index >= 0; index -= 1) {
      const line = previousLines[index];

      if (!month) {
        month = getBankMonthNumber(line);
      }

      if (!year) {
        const yearMatch = String(line || "").match(/\b20\d{2}\b/);
        if (yearMatch) {
          year = Number(yearMatch[0]);
        }
      }

      if (month && year) {
        break;
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
    "(ocak|subat|şubat|mart|nisan|mayis|mayıs|may|way|mav|haziran|haz|june|jun|temmuz|tem|july|jul|agustos|ağustos|agu|august|aug|eylul|eylül|eyl|eyi|september|sep|ekim|eki|october|oct|kasim|kasım|kas|november|nov|aralik|aralık|ara|december|dec)";

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
    ["eylul", "eyl", "eyi", "sep", "september"],
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

    // The purchase principal in an installment note is not this month's charge.
    const nearby = normalizeBankText(block.slice(lineIndex, lineIndex + 3).join(" "));
    if (/\bislemin\b/.test(normalized) && /\btaksi[td]/.test(nearby)) return;

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
  const unsignedCandidates = candidates.filter((item) => !item.explicit && !item.looksBalance);
  const positiveExplicitCandidates = explicitCandidates.filter((item) => item.sign > 0);
  const blockText = (block || []).join(" ");

  if (
    positiveExplicitCandidates.length &&
    unsignedCandidates.length &&
    !hasBankIncomeContext(blockText)
  ) {
    const bestUnsigned = unsignedCandidates.sort((a, b) => b.score - a.score)[0];
    const bestPositive = positiveExplicitCandidates.sort((a, b) => b.score - a.score)[0];

    if (bestUnsigned.amount > bestPositive.amount) {
      return bestUnsigned;
    }
  }

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

  const moneyPattern = /(?<![\d.,])[+\-]?\s*(?:₺\s*)?(?:\d{1,3}(?:[.\s]\d{3})+|\d+)(?:[,.]\d{1,2})\s*(?:TL|TRY|₺)?/gi;

  const matches = [];
  let match;

  while ((match = moneyPattern.exec(text))) {

    let candidate = match[0].trim();
    let candidateIndex = match.index + match[0].indexOf(candidate);
    const datePrefixedAmount = candidate.match(
      /^(\d{1,2})\s+((?:\d{1,3}(?:[.\s]\d{3})+|\d+)[,.]\d{1,2}\s*(?:TL|TRY|₺)?)$/i
    );

    if (datePrefixedAmount && Number(datePrefixedAmount[1]) >= 1 && Number(datePrefixedAmount[1]) <= 31) {
      candidate = datePrefixedAmount[2].trim();
      candidateIndex += match[0].lastIndexOf(datePrefixedAmount[2]);
    }

    if (!candidate || /^\d{1,2}[,.]\d{2}$/.test(candidate) && !/[+\-₺]|TL|TRY/i.test(candidate)) {
      matches.push({ text: candidate, index: candidateIndex });
      continue;
    }

    matches.push({ text: candidate, index: candidateIndex });
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

  cleaned = cleaned.replace(/^(\d{1,3}(?:\.\d{3})+)\.(\d{1,2})$/, "$1,$2");

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
  if (/\bodeme\b.{0,24}\btesekkur\b/.test(text)) {
    return "income";
  }

  if (text.includes("nakit avans")) {
    return "income";
  }

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
