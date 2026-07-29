// ACIKLAMA: Banka hareketi ice aktarma, AI/OCR dosya okuma ve metinden hareket ayrisitirma fonksiyonlari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

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
