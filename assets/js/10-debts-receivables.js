// ACIKLAMA: Borc/alacak kayitlari, filtreler, ilgili gelir-gider hareketleri ve ekran islemleri.
// ACIKLAMA: Bu dosya state-startup dosyasindan once yuklenmelidir.

const borcEklemePenceresi = document.getElementById("debtModal");
const borcEklemeFormu = document.getElementById("debtForm");
const borcPencereBasligi = document.getElementById("debtModalTitle");
const borcTuruAlani = document.getElementById("debtKindInput");
const borcKisiAlani = document.getElementById("debtPersonInput");
const borcTutariAlani = document.getElementById("debtAmountInput");
const borcBaslangicTarihiAlani = document.getElementById("debtStartDateInput");
const borcVadeTarihiAlani = document.getElementById("debtDueDateInput");
const borcNotuAlani = document.getElementById("debtNoteInput");
const borcFormDurumu = document.getElementById("debtFormStatus");
const borcKaydetButtonu = document.getElementById("debtSubmitButton");
const borcPenceresiniAcButtonu = document.getElementById("openDebtModalButton");
const borcPenceresiniKapatButtonu = document.getElementById("closeDebtModalButton");
const borcTuruFiltresi = document.getElementById("debtTypeFilter");
const borcDurumuFiltresi = document.getElementById("debtStatusFilter");
const borcListeDurumu = document.getElementById("debtListStatus");
const borcKayitListesi = document.getElementById("debtRecordList");
const borclaIlgiliIslemListesi = document.getElementById("debtRelatedTransactionList");
const toplamBorcAlani = document.getElementById("debtOwedTotal");
const toplamAlacakAlani = document.getElementById("debtReceivableTotal");
const netBorcAlacakAlani = document.getElementById("debtNetTotal");
const acikBorcAlacakSayisiAlani = document.getElementById("debtOpenCount");

function borcAlacakKaydiniNormalizeEt(item) {
  if (!item || typeof item !== "object" || typeof item.id !== "string") {
    return null;
  }

  const tur = item.kind === "receivable" ? "receivable" : item.kind === "debt" ? "debt" : "";
  const kisi = String(item.person || "").trim();
  const tutar = Number(item.amount);
  const durum = item.status === "closed" ? "closed" : "open";
  const baslangicTarihi = /^\d{4}-\d{2}-\d{2}$/.test(String(item.startDate || ""))
    ? String(item.startDate)
    : "";
  const vadeTarihi = /^\d{4}-\d{2}-\d{2}$/.test(String(item.dueDate || ""))
    ? String(item.dueDate)
    : "";

  if (!tur || !kisi || !Number.isFinite(tutar) || tutar <= 0 || !baslangicTarihi) {
    return null;
  }

  return {
    id: item.id,
    kind: tur,
    person: kisi,
    amount: roundMoney(tutar),
    startDate: baslangicTarihi,
    dueDate: vadeTarihi,
    note: String(item.note || "").trim(),
    status: durum,
    closedAt: durum === "closed" ? String(item.closedAt || "") : "",
    createdAt: String(item.createdAt || ""),
    updatedAt: String(item.updatedAt || item.createdAt || ""),
  };
}

function buluttanBorcAlacakKayitlariniOku(source) {
  return Array.isArray(source) ? source.map(borcAlacakKaydiniNormalizeEt).filter(Boolean) : [];
}

function bulutaHazirBorcAlacakKayitlari(source = borcAlacakKayitlari) {
  return applyDeletedProfileTombstones(
    buluttanBorcAlacakKayitlariniOku(source),
    silinenBorcAlacakIzleri
  );
}

function silinenBorcAlacakIzleriniYukle() {
  return mergeDeletedProfileTombstones(loadJsonState(SILINEN_BORC_ALACAK_STORAGE_KEY, []));
}

function borcAlacakKayitlariniYukle() {
  return applyDeletedProfileTombstones(
    buluttanBorcAlacakKayitlariniOku(loadJsonState(BORC_ALACAK_STORAGE_KEY, [])),
    silinenBorcAlacakIzleri
  );
}

function borcAlacakSilmeIziniKaydet(kayitId, silinmeTarihi = getTurkeyNowDateTime()) {
  silinenBorcAlacakIzleri = mergeDeletedProfileTombstones(
    silinenBorcAlacakIzleri,
    { id: String(kayitId || ""), deletedAt: silinmeTarihi }
  );
  localStorage.setItem(
    getStorageKey(SILINEN_BORC_ALACAK_STORAGE_KEY),
    JSON.stringify(silinenBorcAlacakIzleri)
  );
}

function borcAlacakKayitlariniKaliciKaydet(options = {}) {
  const { syncCloud = true } = options;
  borcAlacakKayitlari = applyDeletedProfileTombstones(
    buluttanBorcAlacakKayitlariniOku(borcAlacakKayitlari),
    silinenBorcAlacakIzleri
  );
  localStorage.setItem(
    getStorageKey(BORC_ALACAK_STORAGE_KEY),
    JSON.stringify(borcAlacakKayitlari)
  );
  localStorage.setItem(
    getStorageKey(SILINEN_BORC_ALACAK_STORAGE_KEY),
    JSON.stringify(mergeDeletedProfileTombstones(silinenBorcAlacakIzleri))
  );

  if (syncCloud) {
    syncUserProfileToCloud();
  }
}

function setupBorcAlacakTakibi() {
  if (!borcEklemeFormu || borcEklemeFormu.dataset.debtReady === "true") {
    return;
  }

  borcEklemeFormu.dataset.debtReady = "true";
  borcPenceresiniAcButtonu?.addEventListener("click", () => borcAlacakPenceresiniAc());
  borcPenceresiniKapatButtonu?.addEventListener("click", borcAlacakPenceresiniKapat);
  borcEklemePenceresi?.addEventListener("click", (event) => {
    if (event.target === borcEklemePenceresi) {
      borcAlacakPenceresiniKapat();
    }
  });
  borcEklemeFormu.addEventListener("submit", borcAlacakKaydiniKaydet);
  borcTuruFiltresi?.addEventListener("change", borcAlacaklariEkranaBas);
  borcDurumuFiltresi?.addEventListener("change", borcAlacaklariEkranaBas);
  borcKayitListesi?.addEventListener("click", borcAlacakListeIsleminiYonet);
}

function borcAlacakPenceresiniAc(kayitId = "") {
  duzenlenenBorcAlacakId = String(kayitId || "");
  const kayit = duzenlenenBorcAlacakId
    ? borcAlacakKayitlari.find((item) => item.id === duzenlenenBorcAlacakId)
    : null;

  borcEklemeFormu?.reset();
  if (borcTuruAlani) borcTuruAlani.value = kayit?.kind || "debt";
  if (borcKisiAlani) borcKisiAlani.value = kayit?.person || "";
  if (borcTutariAlani) borcTutariAlani.value = kayit?.amount || "";
  if (borcBaslangicTarihiAlani) borcBaslangicTarihiAlani.value = kayit?.startDate || getTurkeyTodayISO();
  if (borcVadeTarihiAlani) borcVadeTarihiAlani.value = kayit?.dueDate || "";
  if (borcNotuAlani) borcNotuAlani.value = kayit?.note || "";
  if (borcPencereBasligi) borcPencereBasligi.textContent = kayit ? "Borç / alacak kaydını düzenle" : "Yeni kayıt ekle";
  if (borcKaydetButtonu) borcKaydetButtonu.textContent = kayit ? "Güncelle" : "Kaydet";
  if (borcFormDurumu) borcFormDurumu.textContent = "";
  if (borcEklemePenceresi) borcEklemePenceresi.hidden = false;
  window.setTimeout(() => borcKisiAlani?.focus(), 0);
}

function borcAlacakPenceresiniKapat() {
  duzenlenenBorcAlacakId = "";
  borcEklemeFormu?.reset();
  if (borcBaslangicTarihiAlani) borcBaslangicTarihiAlani.value = getTurkeyTodayISO();
  if (borcFormDurumu) borcFormDurumu.textContent = "";
  if (borcKaydetButtonu) borcKaydetButtonu.textContent = "Kaydet";
  if (borcPencereBasligi) borcPencereBasligi.textContent = "Yeni kayıt ekle";
  if (borcEklemePenceresi) borcEklemePenceresi.hidden = true;
}

function borcAlacakGeciciDurumunuSifirla() {
  if (borcTuruFiltresi) borcTuruFiltresi.value = "all";
  if (borcDurumuFiltresi) borcDurumuFiltresi.value = "open";
  if (borcListeDurumu) borcListeDurumu.textContent = "";
  borcAlacakPenceresiniKapat();
  borcAlacaklariEkranaBas();
}

function borcAlacakKaydiniKaydet(event) {
  event.preventDefault();
  const tutar = Math.abs(roundMoney(readSignedNumber(borcTutariAlani?.value, 0)));
  const kisi = String(borcKisiAlani?.value || "").trim();
  const baslangicTarihi = String(borcBaslangicTarihiAlani?.value || "");
  const vadeTarihi = String(borcVadeTarihiAlani?.value || "");

  if (!kisi || !tutar || !/^\d{4}-\d{2}-\d{2}$/.test(baslangicTarihi)) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Kişi / kurum, tutar ve başlangıç tarihi zorunlu.";
    return;
  }

  if (vadeTarihi && vadeTarihi < baslangicTarihi) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Vade tarihi başlangıç tarihinden önce olamaz.";
    return;
  }

  const oncekiKayit = duzenlenenBorcAlacakId
    ? borcAlacakKayitlari.find((item) => item.id === duzenlenenBorcAlacakId)
    : null;
  const simdi = getTurkeyNowDateTime();
  const sonrakiKayit = borcAlacakKaydiniNormalizeEt({
    id: oncekiKayit?.id || crypto.randomUUID(),
    kind: borcTuruAlani?.value,
    person: kisi,
    amount: tutar,
    startDate: baslangicTarihi,
    dueDate: vadeTarihi,
    note: borcNotuAlani?.value || "",
    status: oncekiKayit?.status || "open",
    closedAt: oncekiKayit?.closedAt || "",
    createdAt: oncekiKayit?.createdAt || simdi,
    updatedAt: simdi,
  });

  if (!sonrakiKayit) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Kayıt bilgileri geçerli değil.";
    return;
  }

  borcAlacakKayitlari = oncekiKayit
    ? borcAlacakKayitlari.map((item) => item.id === oncekiKayit.id ? sonrakiKayit : item)
    : [sonrakiKayit, ...borcAlacakKayitlari];
  borcAlacakKayitlariniKaliciKaydet();
  borcAlacaklariEkranaBas();
  borcAlacakPenceresiniKapat();
}

function borcAlacakListeIsleminiYonet(event) {
  const button = event.target.closest("button[data-debt-action]");
  if (!button) {
    return;
  }

  const kayitId = String(button.dataset.debtId || "");
  const islem = String(button.dataset.debtAction || "");
  if (islem === "edit") {
    borcAlacakPenceresiniAc(kayitId);
  } else if (islem === "toggle") {
    borcAlacakKaydininDurumunuDegistir(kayitId);
  } else if (islem === "delete") {
    borcAlacakKaydiniSilmeOnayi(kayitId);
  }
}

function borcAlacakKaydininDurumunuDegistir(kayitId) {
  const simdi = getTurkeyNowDateTime();
  borcAlacakKayitlari = borcAlacakKayitlari.map((item) => {
    if (item.id !== kayitId) {
      return item;
    }
    const kapanacak = item.status !== "closed";
    return {
      ...item,
      status: kapanacak ? "closed" : "open",
      closedAt: kapanacak ? simdi : "",
      updatedAt: simdi,
    };
  });
  borcAlacakKayitlariniKaliciKaydet();
  borcAlacaklariEkranaBas();
}

function borcAlacakKaydiniSilmeOnayi(kayitId) {
  const kayit = borcAlacakKayitlari.find((item) => item.id === kayitId);
  if (!kayit) {
    return;
  }

  openGenericConfirmModal(
    "Kaydı silmek istediğine emin misin?",
    `${kayit.person} için ${currency.format(kayit.amount)} tutarındaki kayıt kalıcı olarak silinecek.`,
    () => {
      const silinmeTarihi = getTurkeyNowDateTime();
      borcAlacakSilmeIziniKaydet(kayit.id, silinmeTarihi);
      borcAlacakKayitlari = borcAlacakKayitlari.filter((item) => item.id !== kayit.id);
      borcAlacakKayitlariniKaliciKaydet();
      borcAlacaklariEkranaBas();
    }
  );
}

function borcAlacakTuruEtiketi(tur) {
  return tur === "receivable" ? "Alacağım" : "Borcum";
}

function borcAlacakTarihiniYaz(value) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))
    ? new Date(`${value}T12:00:00+03:00`)
    : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "Belirtilmedi";
}

function borcAlacakDurumBilgisi(kayit) {
  if (kayit.status === "closed") {
    return { text: kayit.kind === "receivable" ? "Tahsil edildi" : "Ödendi", overdue: false };
  }
  const overdue = Boolean(kayit.dueDate && kayit.dueDate < getTurkeyTodayISO());
  return { text: overdue ? "Vadesi geçti" : "Açık", overdue };
}

function borcAlacakKayitlariniSirala(left, right) {
  if (left.status !== right.status) {
    return left.status === "open" ? -1 : 1;
  }
  const leftDue = left.dueDate || "9999-12-31";
  const rightDue = right.dueDate || "9999-12-31";
  if (leftDue !== rightDue) {
    return leftDue.localeCompare(rightDue);
  }
  return getRecordTimestamp(right.updatedAt || right.createdAt) - getRecordTimestamp(left.updatedAt || left.createdAt);
}

function borcAlacaklariEkranaBas() {
  if (!borcKayitListesi) {
    return;
  }

  const acikKayitlar = borcAlacakKayitlari.filter((item) => item.status === "open");
  const toplamBorc = acikKayitlar
    .filter((item) => item.kind === "debt")
    .reduce((sum, item) => sum + item.amount, 0);
  const toplamAlacak = acikKayitlar
    .filter((item) => item.kind === "receivable")
    .reduce((sum, item) => sum + item.amount, 0);

  if (toplamBorcAlani) toplamBorcAlani.textContent = currency.format(toplamBorc);
  if (toplamAlacakAlani) toplamAlacakAlani.textContent = currency.format(toplamAlacak);
  if (netBorcAlacakAlani) netBorcAlacakAlani.textContent = currency.format(toplamAlacak - toplamBorc);
  if (acikBorcAlacakSayisiAlani) acikBorcAlacakSayisiAlani.textContent = String(acikKayitlar.length);

  const turFiltresi = borcTuruFiltresi?.value || "all";
  const durumFiltresi = borcDurumuFiltresi?.value || "open";
  const gorunenKayitlar = borcAlacakKayitlari
    .filter((item) => turFiltresi === "all" || item.kind === turFiltresi)
    .filter((item) => durumFiltresi === "all" || item.status === durumFiltresi)
    .sort(borcAlacakKayitlariniSirala);

  borcKayitListesi.innerHTML = "";
  if (!gorunenKayitlar.length) {
    borcKayitListesi.innerHTML = '<div class="empty-state">Seçili filtreye uygun borç veya alacak kaydı bulunamadı.</div>';
  } else {
    gorunenKayitlar.forEach((kayit) => {
      const durum = borcAlacakDurumBilgisi(kayit);
      const satir = document.createElement("article");
      satir.className = `debt-record-item debt-kind-${kayit.kind}${kayit.status === "closed" ? " is-closed" : ""}`;
      satir.innerHTML = `
        <div class="debt-record-main">
          <div class="debt-record-topline">
            <h3>${escapeHtml(kayit.person)}</h3>
            <span>${escapeHtml(borcAlacakTuruEtiketi(kayit.kind))}</span>
            <strong class="debt-record-amount">${escapeHtml(currency.format(kayit.amount))}</strong>
          </div>
          <p class="debt-record-meta">
            Başlangıç: ${escapeHtml(borcAlacakTarihiniYaz(kayit.startDate))} ·
            Vade: ${escapeHtml(borcAlacakTarihiniYaz(kayit.dueDate))} ·
            <span class="debt-status-text${durum.overdue ? " debt-status-overdue" : ""}">${escapeHtml(durum.text)}</span>
          </p>
          ${kayit.note ? `<p class="debt-record-note">${escapeHtml(kayit.note)}</p>` : ""}
        </div>
        <div class="debt-record-actions">
          <button class="ghost-btn" type="button" data-debt-action="toggle" data-debt-id="${escapeHtml(kayit.id)}">
            ${kayit.status === "closed" ? "Yeniden Aç" : kayit.kind === "receivable" ? "Tahsil Edildi" : "Ödendi"}
          </button>
          <button class="ghost-btn" type="button" data-debt-action="edit" data-debt-id="${escapeHtml(kayit.id)}">Düzenle</button>
          <button class="danger-btn" type="button" data-debt-action="delete" data-debt-id="${escapeHtml(kayit.id)}">Sil</button>
        </div>
      `;
      borcKayitListesi.append(satir);
    });
  }

  if (borcListeDurumu) {
    borcListeDurumu.textContent = `${gorunenKayitlar.length} kayıt gösteriliyor.`;
  }
  borclaIlgiliIslemleriEkranaBas();
}

function borclaIlgiliIslemMi(item) {
  const metin = `${item?.title || ""} ${item?.category || ""} ${item?.note || ""}`.toLocaleLowerCase("tr-TR");
  return metin.includes("borç") || metin.includes("borc") || metin.includes("alacak");
}

function borclaIlgiliIslemTutariniYaz(item) {
  const isaret = item.type === "income" ? "+" : item.type === "expense" ? "-" : "";
  return `${isaret}${isaret ? " " : ""}${currency.format(Number(item.amount || 0))}`;
}

function borclaIlgiliIslemleriEkranaBas() {
  if (!borclaIlgiliIslemListesi) {
    return;
  }

  const ilgiliIslemler = transactions
    .filter(borclaIlgiliIslemMi)
    .sort(compareTransactionsNewestFirst)
    .slice(0, 50);
  borclaIlgiliIslemListesi.innerHTML = "";

  if (!ilgiliIslemler.length) {
    borclaIlgiliIslemListesi.innerHTML = '<div class="empty-state">Kayıtlarda borç veya alacakla ilgili hareket bulunamadı.</div>';
    return;
  }

  ilgiliIslemler.forEach((item) => {
    const satir = document.createElement("article");
    satir.className = "transaction-item";
    satir.innerHTML = `
      <div>
        <p class="transaction-title">${escapeHtml(item.title)}</p>
        <p class="transaction-meta">${escapeHtml(formatTransactionDateTime(item))} · ${escapeHtml(item.category)}${item.note ? ` · ${escapeHtml(item.note)}` : ""}</p>
      </div>
      <div class="transaction-side">
        <strong class="transaction-amount ${escapeHtml(item.type)}">${escapeHtml(borclaIlgiliIslemTutariniYaz(item))}</strong>
      </div>
    `;
    borclaIlgiliIslemListesi.append(satir);
  });
}
