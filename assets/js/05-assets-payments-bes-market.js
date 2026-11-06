function renderAssets() {
  if (!assetList) {
    return;
  }

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

    const definition = getAssetDefinition(item.type);

    const unitPrice = getAssetUnitPrice(item.type);

    const totalValue = getAssetValue(item);

    const row = document.createElement("article");
    row.className = "transaction-item";

    const content = document.createElement("div");

    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.label || definition.label;

    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = `${definition.label} · ${formatQuantity(item.amount)} ${definition.unit} · Birim ${currency.format(
      unitPrice
    )}`;

    content.append(title, meta);

    const side = document.createElement("div");
    side.className = "transaction-side";

    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(totalValue);

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openAssetEditModal(item.id));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => requestAssetDelete(item));

    side.append(amount, editButton, removeButton);
    row.append(content, side);
    standardizeDataCard(row, title.textContent, [
      ["Varlık türü", definition.label], ["Miktar", `${formatQuantity(item.amount)} ${definition.unit}`],
      ["Birim değer", currency.format(unitPrice)], ["Toplam değer", currency.format(totalValue)],
    ]);
    assetList.append(row);
  });
}

function renderPaymentAccounts() {
  closePaymentAccountOverflowMenu();
  if (!paymentAccountList) {
    return;
  }

  const creditDebt = paymentAccounts
    .filter((item) => item.type === "credit_card")
    .reduce((sum, item) => sum + Number(item.debt || 0), 0);

  const activeStatementDebt = paymentAccounts
    .filter((item) => item.type === "credit_card")
    .reduce((sum, item) => sum + getActiveCreditCardStatementDebt(item), 0);

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

  const selectedType = paymentAccountTypeFilter?.value || "all";

  if (!paymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Kredi kartı, banka hesabı veya nakit cüzdan eklediğinde burada gerçek kart görünümünde şablon olarak görünecek.</div>';
    return;
  }

  const filteredPaymentAccounts = selectedType === "all"
    ? paymentAccounts
    : paymentAccounts.filter((item) => item.type === selectedType);

  if (!filteredPaymentAccounts.length) {
    paymentAccountList.innerHTML =
      '<div class="empty-state">Bu filtreye uygun kart veya hesap bulunamadı.</div>';
    return;
  }

  filteredPaymentAccounts.forEach((item) => {

    const card = document.createElement("article");
    card.className = `payment-card real-payment-card ${item.type}`;
    card.style.setProperty("--card-color", normalizePaymentCardColor(item.color, item.type));

    const shine = document.createElement("span");
    shine.className = "payment-card-shine";

    const top = document.createElement("div");
    top.className = "payment-card-top";

    const brandBlock = document.createElement("div");

    const bank = document.createElement("span");
    bank.className = "payment-card-bank";
    bank.textContent = item.bank || getPaymentAccountTypeLabel(item.type);

    const title = document.createElement("h3");
    title.textContent = item.name || getPaymentAccountTypeLabel(item.type);
    brandBlock.append(bank, title);

    const logo = document.createElement("span");
    logo.className = "payment-card-logo";
    logo.setAttribute("aria-hidden", "true");

    top.append(brandBlock, logo, createPaymentAccountOverflowButton(item));
    brandBlock.setAttribute("role", "button");
    brandBlock.setAttribute("tabindex", "0");
    brandBlock.setAttribute("aria-label", `${item.name || "Kart / hesap"} kayıtlarını aç`);
    card.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;
      if (!event.target.closest("button")) openPaymentAccountRecordsModal(item);
    });
    brandBlock.addEventListener("keydown", (event) => {
      if (window.innerWidth > 980) return;
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        openPaymentAccountRecordsModal(item);
      }
    });

    const chipLine = document.createElement("div");
    chipLine.className = "payment-card-chip-line";

    const chip = document.createElement("span");
    chip.className = "payment-card-chip";
    chip.setAttribute("aria-hidden", "true");

    const contactless = document.createElement("span");
    contactless.className = "payment-card-contactless";
    contactless.setAttribute("aria-hidden", "true");
    contactless.innerHTML = "<i></i><i></i><i></i>";

    const badge = document.createElement("span");
    badge.className = "payment-card-badge";
    badge.textContent = getPaymentAccountTypeLabel(item.type);

    chipLine.append(chip, contactless, badge);

    const number = document.createElement("p");
    number.className = "payment-card-number";
    number.textContent = item.last4 ? `••••  ••••  ••••  ${item.last4}` : getPaymentAccountCardNumberPlaceholder(item.type);

    const details = document.createElement("div");
    details.className = "payment-card-details";

    if (item.type === "credit_card") {

      const cardTotals = getCreditCardRecordTotals(item);

      const activeStatementDebt = getActiveCreditCardStatementDebt(item);
      details.classList.add("credit-card-details");

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

    const bottom = document.createElement("div");
    bottom.className = "payment-card-bottom";

    const balanceBox = document.createElement("div");

    const amountLabel = document.createElement("span");
    amountLabel.className = "payment-card-small";
    amountLabel.textContent = item.type === "credit_card" ? "Toplam borç" : "Güncel bakiye";

    const amount = document.createElement("strong");
    amount.className = item.type === "credit_card" ? "payment-card-amount expense" : "payment-card-amount income";
    amount.textContent = item.type === "credit_card" ? currency.format(item.debt || 0) : currency.format(item.balance || 0);
    balanceBox.append(amountLabel, amount);

    const limitText = document.createElement("p");
    limitText.className = "payment-card-note";
    limitText.textContent = getPaymentAccountCardNote(item);
    limitText.hidden = !limitText.textContent;

    bottom.append(balanceBox, limitText);

    const actions = document.createElement("div");
    actions.className = "auth-actions payment-card-actions";

    if (item.type === "credit_card") {

      const payButton = document.createElement("button");
      payButton.className = "success-btn";
      payButton.type = "button";
      payButton.textContent = "Öde";
      payButton.disabled = Number(item.debt || 0) <= 0;
      payButton.addEventListener("click", () => openPaymentAccountPayModal(item));
      actions.append(payButton);
    }

    const recordsButton = document.createElement("button");
    recordsButton.className = "ghost-btn";
    recordsButton.type = "button";
    recordsButton.textContent = "Kayıtlar";
    recordsButton.addEventListener("click", () => openPaymentAccountRecordsModal(item));

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openPaymentAccountModal(item));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn danger-lite-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => openPaymentAccountDeleteModal(item));

    const refreshButton = document.createElement("button");
    refreshButton.className = "ghost-btn payment-card-refresh-btn desktop-card-action";
    refreshButton.type = "button";
    refreshButton.textContent = "Güncelle";
    refreshButton.addEventListener("click", () => refreshPaymentAccountFromRecords(item.id));
    syncLegacyCardAction(refreshButton);
    actions.append(recordsButton, refreshButton, editButton, removeButton);
    card.append(shine, top, chipLine, number, details, bottom, actions);
    paymentAccountList.append(card);
  });
}

let paymentAccountOverflowMenu = null;
let paymentAccountOverflowTrigger = null;

function closePaymentAccountOverflowMenu({ restoreFocus = false } = {}) {
  paymentAccountOverflowMenu?.remove();
  paymentAccountOverflowMenu = null;
  paymentAccountOverflowTrigger?.setAttribute("aria-expanded", "false");
  if (restoreFocus) paymentAccountOverflowTrigger?.focus({ preventScroll: true });
  paymentAccountOverflowTrigger = null;
}

function createPaymentAccountOverflowButton(account) {
  return createActionOverflowButton(`${account.name || "Kart / hesap"} seçenekleri`, [
    ["Kayıtlar", "List", () => openPaymentAccountRecordsModal(account)],
    ["Düzenle", "SquarePen", () => openPaymentAccountModal(account)],
    ["Sil", "Trash2", () => openPaymentAccountDeleteModal(account)],
  ], "payment-card-overflow-button");
}

function createActionOverflowButton(label, commands, className) {
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = className;
  trigger.setAttribute("aria-label", label);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.title = "Seçenekler";
  if (window.lucide?.Ellipsis) trigger.append(window.lucide.createElement(window.lucide.Ellipsis));
  else trigger.textContent = "...";
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    if (paymentAccountOverflowTrigger === trigger) {
      closePaymentAccountOverflowMenu();
      return;
    }
    closePaymentAccountOverflowMenu();
    const menu = document.createElement("div");
    menu.className = "payment-card-overflow-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", trigger.getAttribute("aria-label"));
    commands.forEach(([label, icon, action, disabled = false]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = Boolean(disabled);
      button.setAttribute("role", "menuitem");
      if (label === "Sil") button.className = "is-danger";
      if (window.lucide?.[icon]) button.append(window.lucide.createElement(window.lucide[icon]));
      const text = document.createElement("span");
      text.textContent = label;
      button.append(text);
      button.addEventListener("click", () => {
        closePaymentAccountOverflowMenu();
        action();
      });
      menu.append(button);
    });
    const menuHost = trigger.closest(".modal-backdrop") || document.body;
    menuHost.append(menu);
    paymentAccountOverflowMenu = menu;
    paymentAccountOverflowTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    const rect = trigger.getBoundingClientRect();
    const size = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(rect.right - size.width, window.innerWidth - size.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - size.height - 8))}px`;
    menu.querySelector("button")?.focus({ preventScroll: true });
  });
  return trigger;
}

document.addEventListener("click", (event) => {
  if (paymentAccountOverflowMenu && !paymentAccountOverflowMenu.contains(event.target)) closePaymentAccountOverflowMenu();
});
document.addEventListener("keydown", (event) => {
  if (!paymentAccountOverflowMenu) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closePaymentAccountOverflowMenu({ restoreFocus: true });
  } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const items = [...paymentAccountOverflowMenu.querySelectorAll("button")];
    const index = items.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
      : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  }
});
window.addEventListener("resize", () => closePaymentAccountOverflowMenu());
document.addEventListener("scroll", (event) => {
  if (!paymentAccountOverflowMenu?.contains(event.target)) closePaymentAccountOverflowMenu();
}, { passive: true, capture: true });

function createPaymentCardDetail(label, value) {

  const wrapper = document.createElement("div");

  const strong = document.createElement("strong");

  const labelLines = String(label ?? "").split(/\n+/).map((line) => line.trim()).filter(Boolean);

  if (labelLines.length > 1) {
    wrapper.classList.add("stacked-label");
    labelLines.forEach((line) => {

      const small = document.createElement("span");
      small.textContent = line;
      wrapper.append(small);
    });
  } else {

    const small = document.createElement("span");
    small.textContent = labelLines[0] || String(label ?? "");
    wrapper.append(small);
  }

  strong.textContent = value;
  wrapper.append(strong);
  return wrapper;
}

function getPaymentAccountCardNumberPlaceholder(type) {
  if (type === "cash") {
    return "NAKİT  CÜZDAN";
  }

  if (type === "bank_account") {
    return "BANKA  HESABI";
  }

  return "••••  ••••  ••••  ----";
}

function getPaymentAccountCardNote(item) {
  if (item.type === "credit_card") {

    const available = Math.max(0, Number(item.limit || 0) - Number(item.debt || 0));

    const activeStatementDebt = getActiveCreditCardStatementDebt(item);

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

function updateAnyPaymentAccountSelect(selectElement, selectedValue = "", options = {}) {
  if (!selectElement) {
    return;
  }

  const { excludeId = "", placeholder = "Kart / hesap seç" } = options;

  const currentValue = String(selectedValue || selectElement.value || "");

  const normalizedExcludeId = String(excludeId || "");

  const availableAccounts = paymentAccounts.filter((item) => String(item.id || "") !== normalizedExcludeId);
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = availableAccounts.length ? placeholder : "Kart / hesap ekle";
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = availableAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function updateTransactionTransferAccountSelect(selectedValue = "") {
  if (!transactionTransferAccountInput) {
    return;
  }

  updateAnyPaymentAccountSelect(transactionTransferAccountInput, selectedValue || transactionTransferAccountInput.value, {
    excludeId: transactionPaymentAccountInput?.value || "",
    placeholder: "Karşı kart / hesap seç",
  });
}

function updateEntryTransferAccountSelect(selectedValue = "") {
  if (!transferAccountSelect) {
    return;
  }

  updateAnyPaymentAccountSelect(transferAccountSelect, selectedValue || transferAccountSelect.value, {
    excludeId: paymentAccountSelect?.value || "",
    placeholder: "Alıcı kart / hesap seç",
  });
}

function syncEntryTransferVisibility() {

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

function syncTransactionTransferVisibility() {

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

function updatePaymentAccountSelect(selectElement, method = "cash", selectedValue = "") {
  if (!selectElement) {
    return;
  }

  const normalizedMethod = normalizePaymentMethod(method);

  const allowedTypes = paymentMethodAccountTypes[normalizedMethod] || [];

  const availableAccounts = paymentAccounts.filter((item) => allowedTypes.includes(item.type));

  const currentValue = String(selectedValue || selectElement.value || "");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = getPaymentSelectPlaceholder(normalizedMethod, availableAccounts.length);
  selectElement.append(emptyOption);

  availableAccounts.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  if (currentValue && !availableAccounts.some((item) => item.id === currentValue)) {

    const existing = paymentAccounts.find((item) => item.id === currentValue);
    if (existing) {

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

function syncBankImportAccountSelects(selectedValue) {

  const hasExplicitValue = arguments.length > 0;

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

function updateBankImportAccountSelect(selectElement, selectedValue) {
  if (!selectElement) {
    return;
  }

  const hasExplicitValue = arguments.length > 1;

  const currentValue = String(hasExplicitValue ? selectedValue || "" : selectElement.value || "");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Kart / hesap seçilmedi";
  selectElement.append(emptyOption);

  paymentAccounts.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = paymentAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function syncBankImportTransferAccountSelects(selectedValue) {

  const hasExplicitValue = arguments.length > 0;

  const currentValue = String(
    hasExplicitValue
      ? selectedValue || ""
      : bankImportPreviewTransferAccount?.value || bankImportTransferAccountSelect?.value || ""
  );

  const sourceAccountId = String(bankImportPreviewAccount?.value || bankImportAccountSelect?.value || "");

  updateBankImportTransferAccountSelect(bankImportTransferAccountSelect, currentValue, sourceAccountId);
  updateBankImportTransferAccountSelect(bankImportPreviewTransferAccount, currentValue, sourceAccountId);
}

function updateBankImportTransferAccountSelect(selectElement, selectedValue, sourceAccountId = "") {
  if (!selectElement) {
    return;
  }

  const sourceId = String(sourceAccountId || "");

  const hasExplicitValue = arguments.length > 1;

  const currentValue = String(hasExplicitValue ? selectedValue || "" : selectElement.value || "");

  const eligibleAccounts = paymentAccounts.filter((item) => item.id !== sourceId);
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Aktarım yok / karşı hesap seçilmedi";
  selectElement.append(emptyOption);

  eligibleAccounts.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = formatPaymentAccountName(item);
    selectElement.append(option);
  });

  selectElement.value = eligibleAccounts.some((item) => item.id === currentValue) ? currentValue : "";
}

function getBankImportSelectedAccount() {

  const accountId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  return accountId ? paymentAccounts.find((item) => item.id === accountId) || null : null;
}

function getBankImportSelectedTransferAccount() {

  const accountId = String(bankImportTransferAccountSelect?.value || bankImportPreviewTransferAccount?.value || "");

  const sourceId = String(bankImportAccountSelect?.value || bankImportPreviewAccount?.value || "");
  if (!accountId || accountId === sourceId) {
    return null;
  }
  return paymentAccounts.find((item) => item.id === accountId) || null;
}

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

function shiftIsoDate(dateValue, dayOffset) {

  const date = parseIsoDate(dateValue);
  if (!date) {
    return getTurkeyTodayISO();
  }

  date.setDate(date.getDate() + Number(dayOffset || 0));
  return toDateInputValue(date);
}

function createCreditCardDebtAdjustment(account, signedDebtAmount, date, label, now) {

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

function buildCreditCardDebtAdjustments(account, requestedTotalDebt, requestedStatementDebt, totals, now) {

  const targetTotalDebt = Math.max(0, roundMoney(Number(requestedTotalDebt || 0)));

  const targetStatementDebt = clampCreditCardStatementDebt(targetTotalDebt, requestedStatementDebt);

  const existingTotalEffect = roundMoney(Number(totals?.totalDebtEffect || 0));

  const existingStatementEffect = roundMoney(Number(totals?.statementDebtEffect || 0));

  const statementAdjustment = roundMoney(targetStatementDebt - existingStatementEffect);

  const previousAdjustment = roundMoney(
    targetTotalDebt - (existingTotalEffect + statementAdjustment)
  );

  const period = getCreditCardStatementPeriod(account);

  const currentDate = getTurkeyTodayISO();

  const previousDate = period.start ? shiftIsoDate(period.start, -1) : currentDate;

  return [
    createCreditCardDebtAdjustment(account, previousAdjustment, previousDate, "önceki dönem borç düzeltmesi", now),
    createCreditCardDebtAdjustment(account, statementAdjustment, currentDate, "aktif dönem borç düzeltmesi", now),
  ].filter(Boolean);
}

function addPaymentAccount(event) {
  event.preventDefault();

  const formData = new FormData(paymentAccountForm);

  const type = normalizePaymentAccountType(formData.get("paymentAccountType"));

  const name = String(formData.get("paymentAccountName") || "").trim();

  const bank = String(formData.get("paymentAccountBank") || "").trim();

  const color = normalizePaymentCardColor(formData.get("paymentAccountColor"), type);

  const last4 = String(formData.get("paymentAccountLast4") || "").replace(/\D/g, "").slice(-4);

  const balanceOrDebt = readSignedNumber(formData.get("paymentAccountBalance"), 0);

  const statementDebtRaw = String(formData.get("paymentAccountCurrentStatementDebt") || "").trim();

  const limit = readSignedNumber(formData.get("paymentAccountLimit"), 0);

  const statementDay = clampDay(formData.get("paymentAccountStatementDay"));

  const dueDay = clampDay(formData.get("paymentAccountDueDay"));

  const wasEditing = Boolean(editingPaymentAccountId);

  const existing = editingPaymentAccountId
    ? paymentAccounts.find((item) => item.id === editingPaymentAccountId)
    : null;

  if (!name) {

    const statusTarget = paymentAccountModalStatus || paymentAccountStatus;
    if (statusTarget) {
      statusTarget.textContent = "Kart veya hesap adı boş olamaz.";
    }
    paymentAccountName.focus();
    return;
  }

  const now = getTurkeyNowDateTime();

  const nextAccountId = editingPaymentAccountId || crypto.randomUUID();

  const draftCreditAccount = {
    ...(existing || {}),
    id: nextAccountId,
    type: "credit_card",
    statementDay: type === "credit_card" ? statementDay : existing?.statementDay,
  };

  const accountRecordTotals = wasEditing ? getPaymentAccountRecordTotals(nextAccountId) : { net: 0 };

  const cardRecordTotals = wasEditing
    ? getCreditCardRecordTotals(draftCreditAccount)
    : { totalDebt: 0, currentStatementDebt: 0, totalDebtEffect: 0, statementDebtEffect: 0 };

  const requestedBalanceOrDebt = Number.isFinite(balanceOrDebt) ? roundMoney(balanceOrDebt) : 0;

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

  const openingBalance = type !== "credit_card" ? roundMoney(requestedBalanceOrDebt - Number(accountRecordTotals.net || 0)) : 0;

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
    paymentAccountSubmitButton.textContent = "Kaydet";
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

function resetPaymentAccountForm() {
  editingPaymentAccountId = "";
  paymentAccountForm?.reset();

  if (paymentAccountType) {
    paymentAccountType.value = "cash";
  }

  if (paymentAccountSubmitButton) {
    paymentAccountSubmitButton.textContent = "Kaydet";
  }

  if (paymentAccountModalTitle) {
    paymentAccountModalTitle.textContent = "Kart / hesap ekle";
  }

  if (paymentAccountModalSubtitle) {
    paymentAccountModalSubtitle.textContent = "";
    paymentAccountModalSubtitle.hidden = true;
  }

  updatePaymentAccountFormVisibility();
}

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

function closePaymentAccountDeleteModal() {
  deletingPaymentAccountId = "";

  if (confirmPaymentAccountDeleteStatus) {
    confirmPaymentAccountDeleteStatus.textContent = "";
  }

  if (confirmPaymentAccountDeleteModal) {
    confirmPaymentAccountDeleteModal.hidden = true;
  }
}

function deletePaymentAccountAfterConfirmation() {

  const item = paymentAccounts.find((account) => account.id === deletingPaymentAccountId);

  if (!item) {
    if (confirmPaymentAccountDeleteStatus) {
      confirmPaymentAccountDeleteStatus.textContent = "Silinecek kart / hesap bulunamadı.";
    }
    return;
  }

  paymentAccounts = paymentAccounts.filter((account) => account.id !== item.id);

  const updatedTransactions = [];
  transactions = transactions.map((transaction) =>
    transaction.paymentAccountId === item.id || transaction.transferAccountId === item.id
      ? (() => {

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

function updatePaymentAccountFormVisibility() {
  if (!paymentAccountForm || !paymentAccountType) {
    return;
  }

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

function getPaymentAccountRelatedTransactions(accountId, sourceTransactions = transactions) {

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

function renderPaymentAccountRecordsModalContent(account, options = {}) {
  if (!account) {
    return;
  }

  const { rebuildFilter = true } = options;

  const accountId = String(account.id || "");

  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId);

  const periodOptions = buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions);

  const defaultPeriod = periodOptions[0]?.value || "all";
  viewingPaymentAccountRecordsPeriod = periodOptions.some((item) => item.value === viewingPaymentAccountRecordsPeriod)
    ? viewingPaymentAccountRecordsPeriod
    : defaultPeriod;

  const visibleTransactions = filterPaymentAccountRecordsByPeriod(account, relatedTransactions, viewingPaymentAccountRecordsPeriod);

  const visibleTotals = getPaymentAccountRecordTotals(account.id, visibleTransactions);

  if (paymentAccountRecordsTitle) {
    paymentAccountRecordsTitle.textContent = `${formatPaymentAccountName(account)} kayıtları`;
  }

  if (paymentAccountRecordsPeriodFilter && rebuildFilter) {

    const existingValue = viewingPaymentAccountRecordsPeriod || paymentAccountRecordsPeriodFilter.value;
    paymentAccountRecordsPeriodFilter.innerHTML = "";
    periodOptions.forEach((item) => {

      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      paymentAccountRecordsPeriodFilter.append(option);
    });

    const nextValue = periodOptions.some((item) => item.value === existingValue) ? existingValue : viewingPaymentAccountRecordsPeriod;
    paymentAccountRecordsPeriodFilter.value = nextValue;
    viewingPaymentAccountRecordsPeriod = paymentAccountRecordsPeriodFilter.value || defaultPeriod;
  }

  if (paymentAccountRecordsSummary) {
    if (account.type === "credit_card") {

      const cardTotals = getCreditCardRecordTotals(account);

      const periodLabel = periodOptions.find((item) => item.value === viewingPaymentAccountRecordsPeriod)?.label || "Seçili dönem";

      const activePeriodValue = `statement:${cardTotals.period.key}`;

      const selectedPeriodDebtEffect = visibleTransactions.reduce(
        (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
        0
      );

      const selectedPeriodPaid = visibleTransactions.reduce(
        (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
        0
      );

      const displayedTotalDebt = Number.isFinite(Number(account.debt))
        ? Math.max(0, roundMoney(Number(account.debt)))
        : Math.max(0, roundMoney(cardTotals.totalDebt));

      const showingActiveDebt =
        viewingPaymentAccountRecordsPeriod === "all" ||
        viewingPaymentAccountRecordsPeriod === activePeriodValue;

      const activeStatementDebt = getActiveCreditCardStatementDebt(account);

      const selectedPeriodDebt = showingActiveDebt
        ? clampCreditCardStatementDebt(displayedTotalDebt, activeStatementDebt)
        : Math.max(0, roundMoney(selectedPeriodDebtEffect - selectedPeriodPaid));

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

        const row = document.createElement("article");
        row.className = "transaction-item account-record-item";

        const info = document.createElement("div");

        const title = document.createElement("p");
        title.className = "transaction-title";
        title.textContent = transaction.title;

        const meta = document.createElement("p");
        meta.className = "transaction-meta";
        meta.textContent = `${formatTransactionDateTime(transaction)} · ${transaction.category} · ${getTransactionPaymentInfo(transaction)}${transaction.note ? ` · ${transaction.note}` : ""}`;
        info.append(title, meta);

        const side = document.createElement("div");
        side.className = "transaction-side";

        const amount = document.createElement("strong");

        const effect = getTransactionPaymentAccountEffect(transaction, accountId);

        const displayType = effect >= 0 ? "income" : "expense";
        amount.className = `transaction-amount ${displayType}`;
        amount.textContent = formatPaymentAccountRecordEffectText(transaction, accountId, effect);
        side.append(amount);

        row.append(info, side);
        paymentAccountRecordsList.append(row);
      });
    }
  }

}

function openPaymentAccountRecordsModal(account, options = {}) {
  if (!paymentAccountRecordsModal || !account) {
    return;
  }

  const accountId = String(account.id || "");

  const accountChanged = viewingPaymentAccountRecordsId !== accountId;
  viewingPaymentAccountRecordsId = accountId;

  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId);

  const periodOptions = buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions);

  const defaultPeriod = periodOptions[0]?.value || "all";

  const currentPeriod = !options.preservePeriod || accountChanged
    ? defaultPeriod
    : viewingPaymentAccountRecordsPeriod || defaultPeriod;
  viewingPaymentAccountRecordsPeriod = periodOptions.some((item) => item.value === currentPeriod)
    ? currentPeriod
    : defaultPeriod;

  renderPaymentAccountRecordsModalContent(account, { rebuildFilter: true });
  paymentAccountRecordsModal.hidden = false;
}

function buildPaymentAccountRecordsPeriodOptions(account, relatedTransactions = []) {
  if (account.type === "credit_card") {

    const activePeriod = getCreditCardStatementPeriod(account);

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

      const period = getCreditCardStatementPeriod(account, transaction.date);

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

    const options = Array.from(periodMap.values()).sort((first, second) => second.time - first.time);
    return [{ value: "all", label: "Tüm dönemler" }, ...options];
  }

  const currentMonth = getTurkeyTodayISO().slice(0, 7);

  const months = new Set([currentMonth]);
  relatedTransactions.forEach((transaction) => {

    const month = String(transaction.date || "").slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(month)) {
      months.add(month);
    }
  });

  const monthOptions = Array.from(months)
    .sort((first, second) => second.localeCompare(first))
    .map((month) => ({
      value: `month:${month}`,
      label: formatMonthLabel(month),
      month,
    }));

  return [{ value: "all", label: "Tüm zamanlar" }, ...monthOptions];
}

function filterPaymentAccountRecordsByPeriod(account, relatedTransactions = [], periodValue = "all") {
  if (periodValue === "all") {
    return relatedTransactions;
  }

  if (account.type === "credit_card" && periodValue.startsWith("statement:")) {
    const [, key] = periodValue.split(":");
    const [start, end] = String(key || "").split("_");
    return relatedTransactions.filter((transaction) => {

      const transactionDate = String(transaction.date || "");
      return transactionDate && (!start || transactionDate >= start) && (!end || transactionDate <= end);
    });
  }

  if (periodValue.startsWith("month:")) {

    const month = periodValue.slice("month:".length);
    return relatedTransactions.filter((transaction) => String(transaction.date || "").startsWith(month));
  }

  return relatedTransactions;
}

function formatMonthLabel(monthKey = "") {

  const date = new Date(`${monthKey}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "Seçili ay";
  }

  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(date);
}

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

function getPaymentAccountRecordTotals(accountId, sourceTransactions = transactions) {

  const relatedEffects = sourceTransactions
    .map((transaction) => ({
      transaction,
      effect: getTransactionPaymentAccountEffect(transaction, accountId),
    }))
    .filter((item) => item.effect !== 0);

  const income = relatedEffects
    .filter((item) => item.effect > 0)
    .reduce((sum, item) => sum + item.effect, 0);

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

function formatPaymentAccountRecordEffectText(transaction, accountId, effect) {

  const signedEffect = Number(effect || 0);

  const sign = signedEffect >= 0 ? "+" : "-";

  const amountText = currency.format(Math.abs(signedEffect || Number(transaction?.amount || 0)));

  if (transaction?.type !== "transfer") {
    return `${sign} ${amountText}`;
  }

  const targetId = String(accountId || "");

  const sourceId = String(transaction.paymentAccountId || "");

  const receiverId = String(transaction.transferAccountId || "");

  const isSender = sourceId && sourceId === targetId;

  const isReceiver = receiverId && receiverId === targetId && receiverId !== sourceId;

  const directionText = isSender ? "Transfer çıkışı" : isReceiver ? "Transfer girişi" : "Transfer";

  return `${sign} ${amountText} · ${directionText}`;
}

function getPaymentAccountOpeningBalanceForRefresh(account) {
  return hasStoredMoneyValue(account?.openingBalance) ? Number(account.openingBalance) : 0;
}

function getTransactionPaymentAccountEffect(transaction, accountId) {

  const targetId = String(accountId || "");

  const primaryId = String(transaction?.paymentAccountId || "");

  const transferId = String(transaction?.transferAccountId || "");

  const amount = Number(transaction?.amount || 0);

  const transferFee = Math.max(0, Number(transaction?.transferFee || 0));

  if (!targetId || !Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

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

function getCreditCardStatementPeriod(account, referenceDate = getTurkeyTodayISO()) {

  const statementDay = Number(account?.statementDay || 0);

  const ref = new Date(`${referenceDate || getTurkeyTodayISO()}T00:00:00`);

  if (!statementDay || Number.isNaN(ref.getTime())) {
    return { start: "", end: "", key: "all" };
  }

  const year = ref.getFullYear();

  const month = ref.getMonth();

  const day = ref.getDate();

  const startMonth = day > statementDay ? month : month - 1;

  const endMonth = day > statementDay ? month + 1 : month;

  const start = new Date(year, startMonth, clampMonthDay(year, startMonth, statementDay) + 1);

  const end = new Date(year, endMonth, clampMonthDay(year, endMonth, statementDay));

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
    key: `${toDateInputValue(start)}_${toDateInputValue(end)}`,
  };
}

function clampMonthDay(year, monthIndex, day) {
  return Math.min(Math.max(1, Number(day || 1)), new Date(year, monthIndex + 1, 0).getDate());
}

function toDateInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getActiveCreditCardStatementDebt(account, sourceTransactions = transactions) {
  if (!account || account.type !== "credit_card") {
    return 0;
  }

  const totals = getCreditCardRecordTotals(account, sourceTransactions);
  return clampCreditCardStatementDebt(totals.totalDebt, totals.currentStatementDebt);
}

function getCreditCardRecordTotals(account, sourceTransactions = transactions) {

  const period = getCreditCardStatementPeriod(account);

  const accountId = String(account.id || "");

  const relatedTransactions = getPaymentAccountRelatedTransactions(accountId, sourceTransactions);

  const all = getPaymentAccountRecordTotals(account.id, relatedTransactions);

  const periodTransactions = relatedTransactions.filter((transaction) => isTransactionInStatementPeriod(transaction, period));

  const previousPeriodTransactions = relatedTransactions.filter((transaction) => {

    const transactionDate = String(transaction?.date || "");
    return Boolean(transactionDate && period?.start && transactionDate < period.start);
  });

  const allDebtEffect = relatedTransactions.reduce(
    (sum, transaction) => sum + getCreditCardTransactionDebtEffect(transaction, accountId),
    0
  );

  const periodDebtEffect = periodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
    0
  );

  const previousPeriodDebtEffect = previousPeriodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId),
    0
  );

  const periodIncome = periodTransactions
    .filter((transaction) => getCreditCardStatementDebtEffect(transaction, accountId) < 0)
    .reduce((sum, transaction) => sum + Math.abs(getCreditCardStatementDebtEffect(transaction, accountId)), 0);

  const periodExpense = periodTransactions
    .filter((transaction) => getCreditCardStatementDebtEffect(transaction, accountId) > 0)
    .reduce((sum, transaction) => sum + getCreditCardStatementDebtEffect(transaction, accountId), 0);

  const recordedTotalPaid = relatedTransactions.reduce(
    (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
    0
  );

  const recordedPeriodPaid = periodTransactions.reduce(
    (sum, transaction) => sum + getCreditCardPaymentRecordAmount(transaction, accountId),
    0
  );

  const totalDebtEffect = roundMoney(allDebtEffect);

  const statementDebtEffect = roundMoney(periodDebtEffect);

  const previousStatementDebtEffect = Math.max(0, roundMoney(previousPeriodDebtEffect));

  const totalPaid = roundMoney(recordedTotalPaid);

  const periodPaid = roundMoney(recordedPeriodPaid);

  // Toplam ödeme önceki dönem borcunu aşarsa aşan kısım aktif dönem borcundan düşer.
  // Gelecek dönem kayıtları toplam borçta kalır ama aktif dönem borcuna girmez.

  const excessPaymentForActivePeriod = Math.max(0, roundMoney(totalPaid - previousStatementDebtEffect));

  const statementDebtAfterPayments = Math.max(0, roundMoney(statementDebtEffect - excessPaymentForActivePeriod));

  const totalDebt = Math.max(0, totalDebtEffect);

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

function getCreditCardPaymentRecordAmount(transaction, accountId) {

  const targetId = String(accountId || "");

  const sourceId = String(transaction?.paymentAccountId || "");

  const transferId = String(transaction?.transferAccountId || "");

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

function getCreditCardStatementDebtEffect(transaction, accountId) {
  if (getCreditCardPaymentRecordAmount(transaction, accountId) > 0) {
    return 0;
  }

  return getCreditCardTransactionDebtEffect(transaction, accountId);
}

function clampCreditCardStatementDebt(totalDebt, currentStatementDebt) {

  const normalizedTotalDebt = Math.max(0, roundMoney(Number(totalDebt || 0)));

  const normalizedStatementDebt = Math.max(0, roundMoney(Number(currentStatementDebt || 0)));
  return Math.min(normalizedStatementDebt, normalizedTotalDebt);
}

function getCreditCardTransactionDebtEffect(transaction, accountId) {

  const targetId = String(accountId || "");

  const primaryId = String(transaction?.paymentAccountId || "");

  const transferId = String(transaction?.transferAccountId || "");

  const amount = Number(transaction?.amount || 0);

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

function isTransactionInStatementPeriod(transaction, period) {

  const transactionDate = String(transaction?.date || "");
  return Boolean(
    transactionDate &&
    (!period?.start || transactionDate >= period.start) &&
    (!period?.end || transactionDate <= period.end)
  );
}

function hasStoredMoneyValue(value) {
  return value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value));
}

function refreshPaymentAccountFromRecords(accountId) {

  const account = paymentAccounts.find((item) => String(item.id || "") === String(accountId || ""));

  if (!account) {
    paymentAccountStatus.textContent = "Güncellenecek kart veya hesap bulunamadı.";
    return;
  }

  const allRelatedTransactions = getPaymentAccountRelatedTransactions(account.id, transactions);

  const totals = account.type === "credit_card"
    ? getCreditCardRecordTotals(account, allRelatedTransactions)
    : getPaymentAccountRecordTotals(account.id, allRelatedTransactions);

  const now = getTurkeyNowDateTime();

  paymentAccounts = paymentAccounts.map((item) => {
    if (item.id !== account.id) {
      return item;
    }

    if (item.type === "credit_card") {

      const nextDebt = Math.max(0, roundMoney(Number(totals.totalDebt || 0)));

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

  const refreshedAccount = paymentAccounts.find((item) => item.id === account.id);

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

function buildRefreshedPaymentAccountFromRecords(item, now = getTurkeyNowDateTime()) {
  if (!item?.id) {
    return item;
  }

  const allRelatedTransactions = getPaymentAccountRelatedTransactions(item.id, transactions);

  const totals = item.type === "credit_card"
    ? getCreditCardRecordTotals(item, allRelatedTransactions)
    : getPaymentAccountRecordTotals(item.id, allRelatedTransactions);

  if (item.type === "credit_card") {

    const openingDebt = 0;

    const openingCurrentStatementDebt = 0;

    const nextDebt = Math.max(0, roundMoney(Number(totals.totalDebt || 0)));

    const nextCurrentStatementDebt = clampCreditCardStatementDebt(
      nextDebt,
      Number(totals.currentStatementDebt || 0)
    );

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

  const openingBalance = roundMoney(getPaymentAccountOpeningBalanceForRefresh(item));

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

function refreshAllPaymentAccountsFromRecords(options = {}) {
  const { silent = true, syncCloud = true } = options;

  if (!Array.isArray(paymentAccounts) || !paymentAccounts.length) {
    return false;
  }

  const now = getTurkeyNowDateTime();

  let changed = false;
  paymentAccounts = paymentAccounts.map((item) => {

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

    const account = paymentAccounts.find((item) => item.id === viewingPaymentAccountRecordsId);
    if (account) {
      renderPaymentAccountRecordsModalContent(account, { rebuildFilter: true });
    }
  }

  return changed;
}

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

function closePaymentAccountPayModal() {
  payingPaymentAccountId = "";
  paymentAccountPayForm?.reset();
  paymentAccountPayStatus.textContent = "";

  if (paymentAccountPayModal) {
    paymentAccountPayModal.hidden = true;
  }
}

function fillPaymentSourceSelect(selectElement) {
  if (!selectElement) {
    return;
  }

  const previousValue = selectElement.value;

  const sources = paymentAccounts.filter((item) => item.type !== "credit_card");
  selectElement.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = sources.length ? "Ödeme kaynağı seç" : "Ödeme için nakit/banka hesabı ekle";
  selectElement.append(emptyOption);

  sources.forEach((item) => {

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${formatPaymentAccountName(item)} · ${currency.format(item.balance || 0)}`;
    selectElement.append(option);
  });

  selectElement.value = sources.some((item) => item.id === previousValue) ? previousValue : "";
}

function payCreditCardDebt(event) {
  event.preventDefault();

  const creditAccount = paymentAccounts.find((item) => item.id === payingPaymentAccountId && item.type === "credit_card");

  const sourceAccount = paymentAccounts.find((item) => item.id === paymentAccountPaySource.value && item.type !== "credit_card");

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

  const availableDebt = Math.max(
    roundMoney(Number(creditAccount.debt || 0)),
    roundMoney(Number(creditAccount.currentStatementDebt || 0))
  );

  const amount = Math.min(roundMoney(requestedAmount), availableDebt);

  const now = getTurkeyNowDateTime();

  if (!amount) {
    paymentAccountPayStatus.textContent = "Bu kredi kartı için ödenecek borç bulunamadı.";
    return;
  }

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

function validateTransactionPayment(transaction, statusElement = null) {

  const method = normalizePaymentMethod(transaction.paymentMethod);

  const accountId = String(transaction.paymentAccountId || "");

  const transferAccountId = String(transaction.transferAccountId || "");

  const account = accountId ? paymentAccounts.find((item) => item.id === accountId) : null;

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

function applyTransactionPaymentEffect(transaction, direction = 1) {

  const accountId = String(transaction.paymentAccountId || "");

  const transferAccountId = String(transaction.transferAccountId || "");

  const amount = Number(transaction.amount || 0);

  if (!accountId || !Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  const account = paymentAccounts.find((item) => item.id === accountId);

  if (!account) {
    return false;
  }

  const factor = direction < 0 ? -1 : 1;

  const now = getTurkeyNowDateTime();

  if (transaction.type === "transfer") {

    const targetAccount = transferAccountId
      ? paymentAccounts.find((item) => item.id === transferAccountId && item.id !== account.id)
      : null;

    if (!targetAccount) {
      return false;
    }

    const transferFee = Math.max(0, Number(transaction.transferFee || 0));

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

      const period = getCreditCardStatementPeriod(item);

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

      const period = getCreditCardStatementPeriod(item);

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

    const transferAccount = paymentAccounts.find((item) => item.id === transferAccountId && item.type !== "credit_card");
    if (transferAccount) {
      paymentAccounts = paymentAccounts.map((item) => {
        if (item.id !== transferAccount.id) {
          return item;
        }

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

function applyTransferEffectToAccount(account, transaction, signedAmount, now = getTurkeyNowDateTime()) {

  const amount = Number(signedAmount || 0);

  if (account.type === "credit_card") {

    const period = getCreditCardStatementPeriod(account, transaction.date || getTurkeyTodayISO());

    const inPeriod = isTransactionInStatementPeriod(transaction, period);

    const debtDelta = -amount;

    const isCardPayment =
      transaction.type === "transfer" &&
      String(transaction.transferAccountId || "") === String(account.id || "") &&
      String(transaction.paymentAccountId || "") !== String(account.id || "");

    const nextDebt = Math.max(0, roundMoney(Number(account.debt || 0) + debtDelta));

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

function getTransactionPaymentInfo(item) {
  if (item?.type === "transfer") {

    const sourceAccount = item.paymentAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId)
      : null;

    const targetAccount = item.transferAccountId
      ? paymentAccounts.find((candidate) => candidate.id === item.transferAccountId)
      : null;

    const sourceText = sourceAccount ? formatPaymentAccountName(sourceAccount) : "Kaynak seçilmedi";

    const targetText = targetAccount ? formatPaymentAccountName(targetAccount) : "Karşı hesap seçilmedi";

    const fee = Math.max(0, Number(item.transferFee || 0));
    return `Hesaplar arası transfer · ${sourceText} -> ${targetText}${fee ? ` · Ücret ${currency.format(fee)}` : ""}`;
  }

  const method = normalizePaymentMethod(item.paymentMethod || "cash");

  const account = item.paymentAccountId ? paymentAccounts.find((candidate) => candidate.id === item.paymentAccountId) : null;

  return account
    ? `${getPaymentMethodLabel(method)} · ${formatPaymentAccountName(account)}`
    : getPaymentMethodLabel(method);
}

function getPaymentMethodLabel(method) {
  return paymentMethodLabels[normalizePaymentMethod(method)] || paymentMethodLabels.cash;
}

function getPaymentAccountTypeLabel(type) {
  return paymentAccountTypeLabels[normalizePaymentAccountType(type)] || paymentAccountTypeLabels.cash;
}

function formatPaymentAccountName(item) {

  const base = item.name || getPaymentAccountTypeLabel(item.type);
  return item.last4 ? `${base} **** ${item.last4}` : base;
}

function formatExpiry(value) {
  const [year, month] = String(value || "").split("-");
  return year && month ? `${month}/${year}` : "";
}

function normalizePaymentMethod(value) {

  const method = String(value || "cash");
  return paymentMethodLabels[method] ? method : "cash";
}

function normalizePaymentAccountType(value) {

  const type = String(value || "cash");
  return paymentAccountTypeLabels[type] ? type : "cash";
}

function normalizePaymentCardColor(value, type = "cash") {

  const color = String(value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }

  return defaultPaymentCardColors[normalizePaymentAccountType(type)] || defaultPaymentCardColors.cash;
}

function isPaymentAccountAllowedForMethod(account, method) {

  const allowedTypes = paymentMethodAccountTypes[normalizePaymentMethod(method)] || [];
  return allowedTypes.includes(account.type);
}

function clampDay(value) {

  const day = Number(value);
  return Number.isFinite(day) && day >= 1 && day <= 31 ? Math.round(day) : 0;
}

function roundMoney(value) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function renderBesAccounts() {
  if (!besList) {
    return;
  }

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

    const total = getBesAccountTotal(item);

    const row = document.createElement("article");
    row.className = "transaction-item";

    const content = document.createElement("div");

    const title = document.createElement("p");
    title.className = "transaction-title";
    title.textContent = item.provider;

    const details = [
      item.policyNo ? `Sözleşme: ${item.policyNo}` : "",
      `Kendi birikimin ${currency.format(item.contribution || 0)}`,
      `Devlet katkısı ${currency.format(item.stateContribution || 0)}`,
      `Devlet katkısı getirisi ${currency.format(item.stateGain || 0)}`,
      `Fon getirisi ${currency.format(item.gain || 0)}`,
      item.note || "",
    ].filter(Boolean);

    const meta = document.createElement("p");
    meta.className = "transaction-meta";
    meta.textContent = details.join(" · ");

    content.append(title, meta);

    const side = document.createElement("div");
    side.className = "transaction-side";

    const amount = document.createElement("strong");
    amount.className = "transaction-amount income";
    amount.textContent = currency.format(total);

    const editButton = document.createElement("button");
    editButton.className = "ghost-btn";
    editButton.type = "button";
    editButton.textContent = "Düzenle";
    editButton.addEventListener("click", () => openBesModal(item));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-btn";
    removeButton.type = "button";
    removeButton.textContent = "Sil";
    removeButton.addEventListener("click", () => requestBesDelete(item));

    side.append(amount, editButton, removeButton);
    row.append(content, side);
    standardizeDataCard(row, item.provider, [
      ["Sözleşme", item.policyNo || "Belirtilmedi"], ["Kendi birikimin", currency.format(item.contribution || 0)],
      ["Devlet katkısı", currency.format(item.stateContribution || 0)], ["Devlet katkısı getirisi", currency.format(item.stateGain || 0)],
      ["Fon getirisi", currency.format(item.gain || 0)], ["Toplam", currency.format(total)], ["Not", item.note || "Not eklenmemiş"],
    ]);
    besList.append(row);
  });
}

function getBesAccountTotal(item) {
  return (
    Number(item.contribution || 0) +
    Number(item.stateContribution || 0) +
    Number(item.stateGain || 0) +
    Number(item.gain || 0)
  );
}

function getBesTotal() {
  return besAccounts.reduce((sum, item) => sum + getBesAccountTotal(item), 0);
}

function readSignedNumber(value, fallback = Number.NaN) {

  const raw = String(value ?? "").trim();

  if (!raw) {
    return fallback;
  }

  const negative = raw.includes("-") || raw.includes("−");

  let cleaned = raw
    .replace(/\s/g, "")
    .replace(/[−]/g, "-")
    .replace(/[^0-9,.\-+]/g, "")
    .replace(/[+-]/g, "");

  if (!/\d/.test(cleaned)) {
    return fallback;
  }

  const lastComma = cleaned.lastIndexOf(",");

  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma > -1 && lastDot > -1) {
    cleaned =
      lastComma > lastDot ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    cleaned = cleaned.replace(",", ".");
  } else if ((cleaned.match(/\./g) || []).length > 1) {
    cleaned = cleaned.replace(/\./g, "");
  }

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? (negative ? -Math.abs(parsed) : parsed) : fallback;
}

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

function openAssetAddModal() {
  editingAssetId = null;
  resetAssetForm();
  if (assetEditModalTitle) {
    assetEditModalTitle.textContent = "Birikim ekle";
  }
  if (assetEditModalNote) {
    assetEditModalNote.textContent = "Birikim bilgilerini bu pencereden girebilirsin.";
  }
  if (assetEditSubmitButton) {
    assetEditSubmitButton.textContent = "Kaydet";
  }
  if (assetEditStatus) {
    assetEditStatus.textContent = "";
  }
  if (assetEditModal) {
    assetEditModal.hidden = false;
  }
  setTimeout(() => assetEditLabel?.focus(), 0);
}

function openAssetEditModal(assetId) {

  const item = assets.find((asset) => asset.id === assetId);
  if (!item || !assetEditModal) {
    return;
  }

  editingAssetId = item.id;
  assetEditType.value = item.type;
  assetEditLabel.value = item.label || "";
  assetEditAmount.value = String(item.amount ?? "");
  if (assetEditModalTitle) {
    assetEditModalTitle.textContent = "Birikim düzenle";
  }
  if (assetEditModalNote) {
    assetEditModalNote.textContent = "Birikim bilgilerini bu pencereden güncelleyebilirsin.";
  }
  if (assetEditSubmitButton) {
    assetEditSubmitButton.textContent = "Kaydet";
  }
  assetEditStatus.textContent = "";
  assetEditModal.hidden = false;
  setTimeout(() => assetEditLabel?.focus(), 0);
}

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

function saveAssetModal(event) {
  event.preventDefault();

  const type = String(assetEditType?.value || "TRY");

  const definition = getAssetDefinition(type);

  const amount = Number(assetEditAmount?.value);

  const label = String(assetEditLabel?.value || definition.label).trim();

  if (!assetDefinitions[type] || !Number.isFinite(amount) || amount <= 0) {
    assetEditStatus.textContent = "Varlık tipi ve miktarı kontrol et.";
    return;
  }

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

function addBesAccount(event) {
  event.preventDefault();

  const formData = new FormData(besForm);

  const provider = String(formData.get("besProvider") || "").trim();

  const contribution = readSignedNumber(formData.get("besContribution"));

  const stateContribution = readSignedNumber(formData.get("besStateContribution"), 0);

  const stateGain = readSignedNumber(formData.get("besStateGain"), 0);

  const gain = readSignedNumber(formData.get("besGain"), 0);

  if (!provider || !Number.isFinite(contribution) || contribution < 0) {
    return;
  }

  const now = getTurkeyNowDateTime();

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

async function refreshMarketPrices(options = {}) {
  const { silent = false } = options;

  if (!silent) {
    marketStatus.textContent = "Canlı fiyatlar yükleniyor...";
  }

  const currentPrices = { TRY: 1, ...(marketData.prices || {}) };

  const nextPrices = { ...currentPrices, TRY: 1 };

  const status = {
    updated: [],
    failed: [],
    timestamp: "",
  };

  const currencyResult = await getCurrencyPrices();
  if (currencyResult) {
    Object.assign(nextPrices, currencyResult.prices);
    status.updated.push(currencyResult.source);
    status.timestamp = currencyResult.timestamp || status.timestamp;
  } else {
    status.failed.push("döviz");
  }

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
    marketStatus.textContent = "Canlı fiyatlar alınamadı. İnternet bağlantısını kontrol edip yukarıdaki yenile simgesine bas.";
  }
}

async function getCurrencyPrices() {

  const sources = [
    async () => {

      const data = await fetchJson("https://api.genelpara.com/json/?list=doviz&sembol=USD,EUR,GBP");

      const usdToTry = getGenelParaPrice(data, "USD");

      const eurToTry = getGenelParaPrice(data, "EUR");

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

function buildCurrencyPrices(data, source) {

  const rates = data?.rates || {};

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

async function getMetalPrices(usdToTry) {

  const sources = [
    async () => {

      const data = await fetchJson(
        "https://api.genelpara.com/json/?list=altin&sembol=GA,GAG,XHGLD,C,Y,T,CMR,ATA,IKB,BSL,GR,RA,HA,22,18,14"
      );

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

      const data = await fetchJson("https://convertz.app/api/metals");

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

async function getCryptoPrices(usdToTry) {

  const sources = [
    async () => {

      const data = await fetchJson("https://api.genelpara.com/json/?list=kripto&sembol=BTC,ETH");

      const prices = {
        BTC: getGenelParaPrice(data, "BTC"),
        ETH: getGenelParaPrice(data, "ETH"),
      };

      return hasPositivePrice(prices) ? { source: "GenelPara kripto", timestamp: new Date().toISOString(), prices } : null;
    },
    async () => {

      const data = await fetchJson("https://convertz.app/api/crypto");

      const prices = {
        BTC: getCryptoTryPrice("bitcoin", data, usdToTry),
        ETH: getCryptoTryPrice("ethereum", data, usdToTry),
      };

      return hasPositivePrice(prices) ? { source: "Convertz kripto", timestamp: data?.timestamp, prices } : null;
    },
    async () => {

      const data = await fetchJson(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_last_updated_at=true"
      );

      const prices = {
        BTC: readMarketNumber(data?.bitcoin?.usd) * usdToTry,
        ETH: readMarketNumber(data?.ethereum?.usd) * usdToTry,
      };

      const updatedAt = data?.bitcoin?.last_updated_at || data?.ethereum?.last_updated_at;

      return hasPositivePrice(prices)
        ? { source: "CoinGecko", timestamp: normalizeMarketTimestamp(updatedAt), prices }
        : null;
    },
  ];

  return tryMarketSources(sources);
}

async function tryMarketSources(sources) {
  for (const source of sources) {
    try {

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

function hasPositivePrice(prices) {
  return Object.values(prices || {}).some((value) => readMarketNumber(value) > 0);
}

function getDerivedAssetPrices(sourcePrices = {}) {

  const prices = { ...sourcePrices };

  let changed = true;

  while (changed) {
    changed = false;
    Object.entries(assetDefinitions).forEach(([code, definition]) => {
      if (!definition.priceFrom || readMarketNumber(prices[code]) > 0) {
        return;
      }

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

async function fetchJson(url) {

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

function getFiatTryPrice(code, rates, usdToTry) {

  const usdToTarget = readMarketNumber(rates[code]);

  if (!usdToTarget) {
    return getAssetUnitPrice(code);
  }

  return usdToTry / usdToTarget;
}

function getGenelParaPrice(data, symbol) {

  const item = data?.data?.[symbol];

  if (!item) {
    return 0;
  }

  return readMarketNumber(item.satis ?? item.satış ?? item.alis ?? item.alış);
}

function getMetalGramTryPrice(symbol, metalsData, usdToTry) {

  const metal = metalsData?.[symbol];

  const usdPerTroyOunce = readMarketNumber(metal?.price ?? metal);

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(`${symbol}_GRAM`);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

function getGoldApiGramTryPrice(data, usdToTry, fallbackType) {

  const usdPerTroyOunce = readMarketNumber(
    data?.price ?? data?.priceTroyOz ?? data?.price_troy_oz ?? data?.ask ?? data?.bid
  );

  if (!usdPerTroyOunce) {
    return getAssetUnitPrice(fallbackType);
  }

  return (usdPerTroyOunce * usdToTry) / TROY_OUNCE_GRAMS;
}

function getCryptoTryPrice(id, cryptoData, usdToTry) {

  const cryptoItem = cryptoData?.[id];

  const usdPrice = readMarketNumber(cryptoItem?.current_price ?? cryptoItem?.price ?? cryptoItem);

  if (!usdPrice) {
    return getAssetUnitPrice(id === "bitcoin" ? "BTC" : "ETH");
  }

  return usdPrice * usdToTry;
}

function normalizeMarketTimestamp(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "number") {

    const milliseconds = value > 1000000000000 ? value : value * 1000;
    return new Date(milliseconds).toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function readMarketNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {

    const normalized = value.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");

    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  return 0;
}

function getAssetDefinition(type) {
  return assetDefinitions[type] || { label: type, unit: "" };
}

function getAssetUnitPrice(type) {
  if (type === "TRY") {
    return 1;
  }

  const directPrice = readMarketNumber(marketData.prices?.[type]);

  if (directPrice) {
    return directPrice;
  }

  const definition = assetDefinitions[type];

  if (definition?.priceFrom) {
    return getAssetUnitPrice(definition.priceFrom) * readMarketNumber(definition.multiplier || 1);
  }

  return 0;
}

function getAssetValue(item) {
  return Number(item.amount || 0) * getAssetUnitPrice(item.type);
}

function formatQuantity(value) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 6,
  }).format(Number(value || 0));
}

function formatMarketTime(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
