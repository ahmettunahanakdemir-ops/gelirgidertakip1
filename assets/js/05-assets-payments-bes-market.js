// ACIKLAMA: Varliklar, odeme hesaplari, kredi karti borclari, BES hesaplari ve piyasa fiyatlari.
// ACIKLAMA: Bu dosya ayrilan JS yapisinin bir parcasidir; index.html icindeki yukleme sirasi onemlidir.

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
    const existingValue = viewingPaymentAccountRecordsPeriod || paymentAccountRecordsPeriodFilter.value;
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

  if (paymentAccountRecordsPeriodFilter) {
    paymentAccountRecordsPeriodFilter.value = "";
    paymentAccountRecordsPeriodFilter.innerHTML = "";
  }

  if (paymentAccountRecordsList) {
    paymentAccountRecordsList.innerHTML = "";
  }

  if (paymentAccountRecordsSummary) {
    paymentAccountRecordsSummary.textContent = "";
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
