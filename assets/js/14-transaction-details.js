// Shared read-only detail surface for transaction, savings, BES and debt cards.
const dataCardDetailModal = document.createElement("div");
dataCardDetailModal.id = "dataCardDetailModal";
dataCardDetailModal.className = "modal-backdrop";
dataCardDetailModal.hidden = true;
dataCardDetailModal.innerHTML = `<section class="modal-card data-card-detail-modal" role="dialog" aria-modal="true" aria-labelledby="dataCardDetailTitle">
  <header class="data-card-detail-nav"><button type="button" class="ghost-btn">Kapat</button><h2 id="dataCardDetailTitle">İşlem detayı</h2></header>
  <div class="modal-body-scroll"><dl class="data-card-detail-fields"></dl></div></section>`;
document.body.append(dataCardDetailModal);
let dataCardDetailPreviousFocus = null;

function openDataCardDetail(title, fields) {
  closePaymentAccountOverflowMenu();
  dataCardDetailPreviousFocus = document.activeElement;
  dataCardDetailModal.querySelector("h2").textContent = title;
  const list = dataCardDetailModal.querySelector("dl");
  list.replaceChildren();
  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = String(value ?? "Belirtilmedi");
    row.append(term, detail);
    list.append(row);
  });
  dataCardDetailModal.hidden = false;
  dataCardDetailModal.querySelector("button").focus({ preventScroll: true });
}

function closeDataCardDetail() {
  dataCardDetailModal.hidden = true;
  if (dataCardDetailPreviousFocus?.isConnected) dataCardDetailPreviousFocus.focus({ preventScroll: true });
  dataCardDetailPreviousFocus = null;
}

dataCardDetailModal.querySelector("button").addEventListener("click", closeDataCardDetail);
dataCardDetailModal.addEventListener("click", (event) => {
  if (event.target === dataCardDetailModal) closeDataCardDetail();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !dataCardDetailModal.hidden) closeDataCardDetail();
});

function getTransactionDetailFields(item) {
  const fields = [
    ["İşlem türü", item.type === "income" ? "Gelir" : item.type === "transfer" ? "Transfer" : "Gider"],
    ["Tutar", currency.format(item.amount)],
    ["İşlem tarihi", formatTransactionDateTime(item)],
    ["Kategori", item.category || "Belirtilmedi"],
    ["Ödeme / hesap", getTransactionPaymentInfo(item)],
  ];
  if (item.type === "transfer") fields.push(["Transfer ücreti", currency.format(Number(item.transferFee || 0))]);
  if (item.isInstallment) {
    fields.push(["Taksit", item.installmentCount ? `${item.installmentNumber || 1} / ${item.installmentCount}` : "Taksitli işlem"],
      ["Taksit durumu", item.installmentCompleted ? "Tamamlandı" : "Bekliyor"]);
  }
  const created = getRecordTimestamp(item.createdAt);
  const updated = getRecordTimestamp(item.updatedAt);
  fields.push(["Eklenme zamanı", created ? formatAddedDateTime(created) : "Bilinmiyor"]);
  if (updated && updated !== created) fields.push(["Son düzenleme", formatAddedDateTime(updated)]);
  fields.push(["Not", item.note || "Not eklenmemiş"]);
  return fields;
}

function openTransactionDetailModal(item) {
  openDataCardDetail(item.title || "İşlem detayı", getTransactionDetailFields(item));
}

function standardizeDataCard(row, title, fields, selector = "button") {
  const oldMenu = row.querySelector(":scope > .transaction-overflow-button");
  const actions = row._cardActions || [];
  [...row.querySelectorAll(selector)].filter((button) => button !== oldMenu && !button.classList.contains("data-card-legacy-action") && !button.classList.contains("desktop-card-action")).forEach((button) => {
    const label = button.textContent.trim();
    const icon = /sil/i.test(label) ? "Trash2" : /düzenle/i.test(label) ? "SquarePen" : "Check";
    actions.push([label, icon, () => button.click(), button.disabled]);
    button.classList.add("data-card-legacy-action");
    syncLegacyCardAction(button);
  });
  row._cardActions = actions;
  oldMenu?.remove();
  row.append(createActionOverflowButton(`${title} seçenekleri`, actions, "transaction-overflow-button"));
  row.classList.add("standard-data-card");
  if (row.dataset.dataCardDetails === "true") return;
  row.dataset.dataCardDetails = "true";
  const content = row.querySelector(".transaction-title, h3, .debt-installment-number")?.parentElement || row;
  content.setAttribute("role", "button");
  content.setAttribute("tabindex", "0");
  content.setAttribute("aria-label", `${title} detayını aç`);
  row.addEventListener("click", (event) => {
    if (window.innerWidth > 980) return;
    if (event.target.closest("button, summary, a")) return;
    event.stopPropagation();
    openDataCardDetail(title, fields);
  });
  content.addEventListener("keydown", (event) => {
    if (window.innerWidth > 980) return;
    if (event.target !== content || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    openDataCardDetail(title, fields);
  });
}

function syncLegacyCardAction(button) {
  button.hidden = false;
  if (window.innerWidth <= 980) button.style.setProperty("display", "none", "important");
  else button.style.removeProperty("display");
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".data-card-legacy-action, .desktop-card-action").forEach(syncLegacyCardAction);
});
