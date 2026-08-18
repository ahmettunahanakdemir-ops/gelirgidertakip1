// ACIKLAMA: Manuel borc, taksit ve alacak listeleri ile kismi/tam odeme akislari.
// ACIKLAMA: Bu dosya state-startup dosyasindan once yuklenmelidir.

const borcEklemePenceresi = document.getElementById("debtModal");
const borcEklemeFormu = document.getElementById("debtForm");
const borcPencereBasligi = document.getElementById("debtModalTitle");
const borcPencereKickerAlani = document.getElementById("debtModalKicker");
const borcPencereNotuAlani = document.getElementById("debtModalNote");
const borcTuruAlani = document.getElementById("debtKindInput");
const borcListeTuruAlani = document.getElementById("debtListTypeInput");
const borcKisiAlani = document.getElementById("debtPersonInput");
const borcTutariAlani = document.getElementById("debtAmountInput");
const borcBaslangicTarihiAlani = document.getElementById("debtStartDateInput");
const borcVadeTarihiAlani = document.getElementById("debtDueDateInput");
const borcTaksitSayisiEtiketi = document.getElementById("debtInstallmentCountField");
const borcTaksitSayisiAlani = document.getElementById("debtInstallmentCountInput");
const borcNotuAlani = document.getElementById("debtNoteInput");
const borcFormDurumu = document.getElementById("debtFormStatus");
const borcKaydetButtonu = document.getElementById("debtSubmitButton");
const borcPenceresiniAcButtonu = document.getElementById("openDebtModalButton");
const taksitPenceresiniAcButtonu = document.getElementById("openInstallmentModalButton");
const alacakPenceresiniAcButtonu = document.getElementById("openReceivableModalButton");
const borcPenceresiniKapatButtonu = document.getElementById("closeDebtModalButton");

const borcDurumuFiltresi = document.getElementById("debtStatusFilter");
const borcListeDurumu = document.getElementById("debtListStatus");
const borcKayitListesi = document.getElementById("debtRecordList");
const alacakDurumuFiltresi = document.getElementById("receivableStatusFilter");
const alacakListeDurumu = document.getElementById("receivableListStatus");
const alacakKayitListesi = document.getElementById("receivableRecordList");
const toplamBorcAlani = document.getElementById("debtOwedTotal");
const toplamTaksitAlani = document.getElementById("debtInstallmentTotal");
const toplamAlacakAlani = document.getElementById("debtReceivableTotal");
const acikBorcAlacakSayisiAlani = document.getElementById("debtOpenCount");

const borcSekmeButtonlari = Array.from(document.querySelectorAll("[data-debt-tab]"));
const borcSekmePanelleri = Array.from(document.querySelectorAll("[data-debt-tab-panel]"));
const borcTaksitDurumuFiltresi = document.getElementById("debtInstallmentStatusFilter");
const borcTaksitListeDurumu = document.getElementById("debtInstallmentListStatus");
const borcTaksitListesi = document.getElementById("debtInstallmentList");
const isaretliTaksitBolumu = document.getElementById("scheduledInstallmentSection");
const isaretliTaksitBasligi = document.getElementById("scheduledInstallmentTitle");
const isaretliTaksitDurumuAlani = document.getElementById("scheduledInstallmentStatus");
const isaretliTaksitListesi = document.getElementById("scheduledInstallmentList");
const isaretliTaksitSayfalamaAlani = document.getElementById("scheduledInstallmentPagination");
const isaretliTaksitOncekiSayfaButtonu = document.getElementById("scheduledInstallmentPreviousPage");
const isaretliTaksitSonrakiSayfaButtonu = document.getElementById("scheduledInstallmentNextPage");
const isaretliTaksitSayfaEtiketi = document.getElementById("scheduledInstallmentPageLabel");
const OTOMATIK_TAKSIT_SAYFA_BOYUTU = 20;
let isaretliTaksitSayfasi = 1;

const borcOdemePenceresi = document.getElementById("debtPaymentModal");
const borcOdemeFormu = document.getElementById("debtPaymentForm");
const borcOdemePencereBasligi = document.getElementById("debtPaymentModalTitle");
const borcOdemeOzeti = document.getElementById("debtPaymentSummary");
const borcOdemeTutariAlani = document.getElementById("debtPaymentAmountInput");
const borcOdemeTamamiButtonu = document.getElementById("debtPaymentFullAmountButton");
const borcOdemeTarihiAlani = document.getElementById("debtPaymentDateInput");
const borcOdemeHesabiEtiketi = document.getElementById("debtPaymentAccountLabel");
const borcOdemeHesabiEtiketMetni = document.getElementById("debtPaymentAccountLabelText");
const borcOdemeHesabiAlani = document.getElementById("debtPaymentAccountInput");
const borcOdemeTaksitAlani = document.getElementById("debtPaymentInstallmentField");
const borcOdemeTaksitSecimi = document.getElementById("debtPaymentInstallmentInput");
const borcOdemeNotuAlani = document.getElementById("debtPaymentNoteInput");
const borcOdemeFormDurumu = document.getElementById("debtPaymentFormStatus");
const borcOdemeKaydetButtonu = document.getElementById("debtPaymentSubmitButton");
const borcOdemePenceresiniKapatButtonu = document.getElementById("closeDebtPaymentModalButton");

function borcAlacakGecerliTarihMi(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function borcAlacakAyaEkle(value, monthOffset) {
  if (!borcAlacakGecerliTarihMi(value)) {
    return "";
  }

  const [year, month, day] = value.split("-").map(Number);
  const monthStart = new Date(Date.UTC(year, month - 1 + monthOffset, 1));
  const targetYear = monthStart.getUTCFullYear();
  const targetMonth = monthStart.getUTCMonth();
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

function borcAlacakOdemeKaydiniNormalizeEt(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const tutar = Math.abs(roundMoney(Number(item.amount || 0)));
  const tarih = borcAlacakGecerliTarihMi(item.date) ? String(item.date) : "";
  if (!tutar || !tarih) {
    return null;
  }

  const dagitimlar = Array.isArray(item.allocations)
    ? item.allocations
      .map((allocation) => ({
        installmentId: String(allocation?.installmentId || ""),
        amount: Math.abs(roundMoney(Number(allocation?.amount || 0))),
      }))
      .filter((allocation) => allocation.installmentId && allocation.amount > 0)
    : [];

  return {
    id: String(item.id || crypto.randomUUID()),
    amount: tutar,
    date: tarih,
    note: String(item.note || "").trim(),
    transactionId: String(item.transactionId || ""),
    allocations: dagitimlar,
    createdAt: String(item.createdAt || ""),
  };
}

function borcAlacakTaksitleriniOlustur(kayitId, toplamTutar, taksitSayisi, ilkVadeTarihi) {
  const sayi = Math.max(1, Math.min(60, Math.trunc(Number(taksitSayisi || 1))));
  if (sayi <= 1 || !borcAlacakGecerliTarihMi(ilkVadeTarihi)) {
    return [];
  }

  const toplamKurus = Math.round(Math.abs(Number(toplamTutar || 0)) * 100);
  const tabanKurus = Math.floor(toplamKurus / sayi);
  let kalanKurus = toplamKurus - tabanKurus * sayi;

  return Array.from({ length: sayi }, (_, index) => {
    const taksitKurusu = tabanKurus + (kalanKurus > 0 ? 1 : 0);
    kalanKurus = Math.max(0, kalanKurus - 1);
    return {
      id: `${kayitId}-installment-${index + 1}`,
      number: index + 1,
      dueDate: borcAlacakAyaEkle(ilkVadeTarihi, index),
      amount: roundMoney(taksitKurusu / 100),
    };
  });
}

function borcAlacakTaksitleriniNormalizeEt(source, kayitId, toplamTutar, taksitSayisi, ilkVadeTarihi) {
  const beklenen = borcAlacakTaksitleriniOlustur(kayitId, toplamTutar, taksitSayisi, ilkVadeTarihi);
  if (!beklenen.length) {
    return [];
  }

  const mevcutlar = new Map(
    (Array.isArray(source) ? source : [])
      .filter((item) => item && typeof item === "object")
      .map((item) => [String(item.id || ""), item])
      .filter(([id]) => id)
  );

  return beklenen.map((item) => {
    const mevcut = mevcutlar.get(item.id);
    return {
      ...item,
      dueDate: borcAlacakGecerliTarihMi(mevcut?.dueDate) ? String(mevcut.dueDate) : item.dueDate,
    };
  });
}

function borcAlacakOdemeleriniTaksitlereDagit(odemeler, taksitler, options = {}) {
  if (!taksitler.length) {
    return odemeler.map((item) => ({ ...item, allocations: [] }));
  }

  const { eskiDagitimlariKoru = true } = options;
  const taksitSirasi = [...taksitler].sort((left, right) => {
    if (left.dueDate !== right.dueDate) return left.dueDate.localeCompare(right.dueDate);
    return left.number - right.number;
  });
  const kalanlar = new Map(taksitSirasi.map((item) => [item.id, Number(item.amount || 0)]));
  const siraliOdemeler = [...odemeler].sort((left, right) => {
    if (left.date !== right.date) return left.date.localeCompare(right.date);
    return getRecordTimestamp(left.createdAt) - getRecordTimestamp(right.createdAt);
  });

  const dagitilanlar = siraliOdemeler.map((odeme) => {
    let kalanOdeme = Number(odeme.amount || 0);
    const dagitimlar = [];

    if (eskiDagitimlariKoru) {
      odeme.allocations.forEach((allocation) => {
        const taksitKalani = Number(kalanlar.get(allocation.installmentId) || 0);
        const ayrilan = roundMoney(Math.min(kalanOdeme, taksitKalani, Number(allocation.amount || 0)));
        if (ayrilan <= 0) return;
        dagitimlar.push({ installmentId: allocation.installmentId, amount: ayrilan });
        kalanlar.set(allocation.installmentId, roundMoney(taksitKalani - ayrilan));
        kalanOdeme = roundMoney(kalanOdeme - ayrilan);
      });
    }

    for (const taksit of taksitSirasi) {
      if (kalanOdeme <= 0) break;
      const taksitKalani = Number(kalanlar.get(taksit.id) || 0);
      if (taksitKalani <= 0) continue;
      const ayrilan = roundMoney(Math.min(kalanOdeme, taksitKalani));
      dagitimlar.push({ installmentId: taksit.id, amount: ayrilan });
      kalanlar.set(taksit.id, roundMoney(taksitKalani - ayrilan));
      kalanOdeme = roundMoney(kalanOdeme - ayrilan);
    }

    return { ...odeme, allocations: dagitimlar };
  });

  const dagitimHaritasi = new Map(dagitilanlar.map((item) => [item.id, item]));
  return odemeler.map((item) => dagitimHaritasi.get(item.id) || item);
}

function borcAlacakKaydiniNormalizeEt(item) {
  if (!item || typeof item !== "object" || typeof item.id !== "string") {
    return null;
  }

  const tur = item.kind === "receivable" ? "receivable" : item.kind === "debt" ? "debt" : "";
  const kisi = String(item.person || "").trim();
  const eskiTutar = Number(item.amount);
  const odemeler = (Array.isArray(item.payments) ? item.payments : [])
    .map(borcAlacakOdemeKaydiniNormalizeEt)
    .filter(Boolean);
  const odemeToplami = roundMoney(odemeler.reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
  const hamAnaTutar = Number(item.originalAmount);
  const anaTutar = Number.isFinite(hamAnaTutar) && hamAnaTutar > 0
    ? Math.abs(roundMoney(hamAnaTutar))
    : Number.isFinite(eskiTutar) && eskiTutar > 0
      ? roundMoney(eskiTutar + odemeToplami)
      : 0;
  const baslangicTarihi = borcAlacakGecerliTarihMi(item.startDate) ? String(item.startDate) : "";
  const vadeTarihi = borcAlacakGecerliTarihMi(item.dueDate) ? String(item.dueDate) : "";
  const hamTaksitSayisi = Math.max(1, Math.min(60, Math.trunc(Number(item.installmentCount || 1))));
  const listeTuru = tur === "receivable"
    ? "receivable"
    : item.listType === "installment" || item.planType === "installment" || hamTaksitSayisi > 1
      ? "installment"
      : "debt";
  const taksitSayisi = listeTuru === "installment" ? Math.max(2, hamTaksitSayisi) : 1;

  if (!tur || !kisi || !anaTutar || !baslangicTarihi) {
    return null;
  }

  const taksitler = borcAlacakTaksitleriniNormalizeEt(
    item.installments,
    item.id,
    anaTutar,
    taksitSayisi,
    vadeTarihi
  );
  const dagitilmisOdemeler = borcAlacakOdemeleriniTaksitlereDagit(odemeler, taksitler);
  const elleKapatildi = Boolean(
    item.manualClosed ||
    (item.status === "closed" && !Number.isFinite(hamAnaTutar) && odemeToplami === 0)
  );
  const kalanTutar = elleKapatildi ? 0 : Math.max(0, roundMoney(anaTutar - odemeToplami));
  const durum = kalanTutar <= 0 ? "closed" : "open";

  return {
    id: item.id,
    kind: tur,
    listType: listeTuru,
    person: kisi,
    originalAmount: anaTutar,
    amount: kalanTutar,
    startDate: baslangicTarihi,
    dueDate: vadeTarihi,
    installmentCount: taksitSayisi,
    installments: taksitler,
    payments: dagitilmisOdemeler,
    sourceTransactionId: String(item.sourceTransactionId || ""),
    openingTransactionId: String(item.openingTransactionId || ""),
    note: String(item.note || "").trim(),
    status: durum,
    manualClosed: elleKapatildi,
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
  borcPenceresiniAcButtonu?.addEventListener("click", () => borcAlacakPenceresiniAc("", "debt"));
  taksitPenceresiniAcButtonu?.addEventListener("click", () => borcAlacakPenceresiniAc("", "installment"));
  alacakPenceresiniAcButtonu?.addEventListener("click", () => borcAlacakPenceresiniAc("", "receivable"));
  borcPenceresiniKapatButtonu?.addEventListener("click", borcAlacakPenceresiniKapat);
  borcEklemePenceresi?.addEventListener("click", (event) => {
    if (event.target === borcEklemePenceresi) borcAlacakPenceresiniKapat();
  });
  borcEklemeFormu.addEventListener("submit", borcAlacakKaydiniKaydet);
  borcListeTuruAlani?.addEventListener("change", borcAlacakTakipTuruAlanlariniGuncelle);
  borcTaksitSayisiAlani?.addEventListener("input", borcTaksitZorunlulugunuGuncelle);
  borcDurumuFiltresi?.addEventListener("change", borcAlacaklariEkranaBas);
  alacakDurumuFiltresi?.addEventListener("change", borcAlacaklariEkranaBas);
  borcKayitListesi?.addEventListener("click", borcAlacakListeIsleminiYonet);
  alacakKayitListesi?.addEventListener("click", borcAlacakListeIsleminiYonet);

  borcSekmeButtonlari.forEach((button) => {
    button.addEventListener("click", () => borcAlacakSekmesiniAc(button.dataset.debtTab));
  });
  borcTaksitDurumuFiltresi?.addEventListener("change", () => {
    isaretliTaksitSayfasi = 1;
    borcAlacakTaksitleriniEkranaBas();
  });
  borcTaksitListesi?.addEventListener("click", borcAlacakTaksitIsleminiYonet);
  isaretliTaksitListesi?.addEventListener("click", borcAlacakOtomatikTaksitIsleminiYonet);
  isaretliTaksitOncekiSayfaButtonu?.addEventListener("click", () => borcAlacakOtomatikTaksitSayfasiniDegistir(-1));
  isaretliTaksitSonrakiSayfaButtonu?.addEventListener("click", () => borcAlacakOtomatikTaksitSayfasiniDegistir(1));

  borcOdemePenceresiniKapatButtonu?.addEventListener("click", borcAlacakOdemePenceresiniKapat);
  borcOdemePenceresi?.addEventListener("click", (event) => {
    if (event.target === borcOdemePenceresi) borcAlacakOdemePenceresiniKapat();
  });
  borcOdemeFormu?.addEventListener("submit", borcAlacakOdemesiniKaydet);
  borcOdemeTamamiButtonu?.addEventListener("click", borcAlacakOdemeTutarininTamaginiYaz);
  borcOdemeTaksitSecimi?.addEventListener("change", borcAlacakOdemeTutarSiniriniGuncelle);
  window.setInterval(() => {
    if (typeof activeView !== "undefined" && activeView === "debtsView") {
      borcAlacaklariEkranaBas();
    }
  }, 60 * 60 * 1000);

}

function borcAlacakSekmesiniAc(sekme = "debts") {
  aktifBorcAlacakSekmesi = ["debts", "installments", "receivables"].includes(sekme) ? sekme : "debts";
  if (aktifBorcAlacakSekmesi === "debts" && borcDurumuFiltresi) borcDurumuFiltresi.value = "open";
  if (aktifBorcAlacakSekmesi === "receivables" && alacakDurumuFiltresi) alacakDurumuFiltresi.value = "open";
  if (aktifBorcAlacakSekmesi === "installments") {
    if (borcTaksitDurumuFiltresi) borcTaksitDurumuFiltresi.value = "open";
    isaretliTaksitSayfasi = 1;
  }
  borcSekmeButtonlari.forEach((button) => {
    const aktif = button.dataset.debtTab === aktifBorcAlacakSekmesi;
    button.classList.toggle("is-active", aktif);
    button.setAttribute("aria-selected", aktif ? "true" : "false");
  });
  borcSekmePanelleri.forEach((panel) => {
    panel.hidden = panel.dataset.debtTabPanel !== aktifBorcAlacakSekmesi;
  });
  borcAlacaklariEkranaBas();
}

function borcTaksitZorunlulugunuGuncelle() {
  if (!borcVadeTarihiAlani) return;
  borcVadeTarihiAlani.required = borcEklemeFormu?.dataset.listType === "installment";
}

function borcAlacakIslemTakipKaydiniBul(islemId) {
  const kimlik = String(islemId || "");
  return kimlik
    ? borcAlacakKayitlari.find((item) => item.sourceTransactionId === kimlik) || null
    : null;
}

// ACIKLAMA: Gelir/gider duzenleme formundaki takip secimini, mevcut odeme gecmisini bozmadan dogrular.
function borcAlacakIslemDuzenlemeTakibiniDogrula(islem, options = {}) {
  const mevcutKayit = borcAlacakIslemTakipKaydiniBul(islem?.id);
  if (!options.selected) {
    return mevcutKayit?.payments?.length
      ? "Ödeme veya tahsilat geçmişi olan takip kaydı buradan kaldırılamaz. Borçlarım bölümündeki Sil düğmesini kullan."
      : "";
  }

  const listeTuru = String(options.listType || "");
  if (!["debt", "installment", "receivable"].includes(listeTuru)) {
    return "Geçerli bir takip türü seçmelisin.";
  }
  const vadeTarihi = String(options.dueDate || "");
  if (vadeTarihi && vadeTarihi < String(islem?.date || "")) {
    return "Takip vadesi işlem tarihinden önce olamaz.";
  }
  if (listeTuru === "installment" && !borcAlacakGecerliTarihMi(vadeTarihi)) {
    return "Taksit takibi için ilk taksit tarihini seçmelisin.";
  }
  const odemeToplami = roundMoney((mevcutKayit?.payments || []).reduce((sum, item) => sum + item.amount, 0));
  if (Number(islem?.amount || 0) < odemeToplami) {
    return `İşlem tutarı, takip kaydına işlenmiş ${currency.format(odemeToplami)} tutarından düşük olamaz.`;
  }
  return "";
}

// ACIKLAMA: Islem duzenlenirken isaretlenen takip secimini ekler, gunceller veya odemesiz kaydi kaldirir.
function borcAlacakIslemDuzenlemesiniTakibeUygula(islem, options = {}) {
  const mevcutKayit = borcAlacakIslemTakipKaydiniBul(islem?.id);
  if (!options.selected) {
    if (!mevcutKayit) return;
    borcAlacakSilmeIziniKaydet(mevcutKayit.id, getTurkeyNowDateTime());
    borcAlacakKayitlari = borcAlacakKayitlari.filter((item) => item.id !== mevcutKayit.id);
    borcAlacakKayitlariniKaliciKaydet();
    borcAlacaklariEkranaBas();
    return;
  }

  const listeTuru = ["debt", "installment", "receivable"].includes(options.listType)
    ? options.listType
    : "debt";
  const simdi = getTurkeyNowDateTime();
  const kayitId = mevcutKayit?.id || crypto.randomUUID();
  const anaTutar = Math.abs(roundMoney(Number(islem.amount || 0)));
  const vadeTarihi = borcAlacakGecerliTarihMi(options.dueDate) ? String(options.dueDate) : "";
  const taksitSayisi = listeTuru === "installment"
    ? Math.max(2, Math.min(60, Math.trunc(Number(options.installmentCount || 2))))
    : 1;
  const taksitPlaniDegisti = Boolean(
    mevcutKayit &&
    (mevcutKayit.originalAmount !== anaTutar ||
      mevcutKayit.installmentCount !== taksitSayisi ||
      mevcutKayit.dueDate !== vadeTarihi ||
      mevcutKayit.listType !== listeTuru)
  );
  const taksitler = borcAlacakTaksitleriniOlustur(kayitId, anaTutar, taksitSayisi, vadeTarihi);
  const odemeler = taksitPlaniDegisti
    ? borcAlacakOdemeleriniTaksitlereDagit(mevcutKayit?.payments || [], taksitler, { eskiDagitimlariKoru: false })
    : mevcutKayit?.payments || [];
  const sonrakiKayit = borcAlacakKaydiniNormalizeEt({
    id: kayitId,
    kind: listeTuru === "receivable" ? "receivable" : "debt",
    listType: listeTuru,
    person: islem.title,
    originalAmount: anaTutar,
    amount: anaTutar,
    startDate: islem.date,
    dueDate: vadeTarihi,
    installmentCount: taksitSayisi,
    installments: taksitler,
    payments: odemeler,
    sourceTransactionId: islem.id,
    openingTransactionId: mevcutKayit?.openingTransactionId || "",
    note: [islem.category, islem.note].filter(Boolean).join(" · ").slice(0, 180),
    status: mevcutKayit?.status || "open",
    manualClosed: mevcutKayit?.manualClosed || false,
    closedAt: mevcutKayit?.closedAt || "",
    createdAt: mevcutKayit?.createdAt || simdi,
    updatedAt: simdi,
  });
  if (!sonrakiKayit) return;

  borcAlacakKayitlari = mevcutKayit
    ? borcAlacakKayitlari.map((item) => item.id === mevcutKayit.id ? sonrakiKayit : item)
    : [sonrakiKayit, ...borcAlacakKayitlari];
  borcAlacakKayitlariniKaliciKaydet();
  borcAlacaklariEkranaBas();
}

function borcAlacakPencereMetinleriniGuncelle() {
  const listeTuru = ["debt", "installment", "receivable"].includes(borcEklemeFormu?.dataset.listType)
    ? borcEklemeFormu.dataset.listType
    : "debt";
  const kayitDuzenleniyor = Boolean(duzenlenenBorcAlacakId);
  const metinler = {
    debt: ["Manuel Borç Takibi", kayitDuzenleniyor ? "Borç kaydını düzenle" : "Yeni borç ekle", "Kalan borcunu gelir/gider hareketlerinden bağımsız takip et."],
    installment: ["Manuel Taksit Takibi", kayitDuzenleniyor ? "Taksit planını düzenle" : "Yeni taksit planı ekle", "Toplam tutarı ve taksit sayısını gir; kalan taksitler aylık olarak oluşturulsun."],
    receivable: ["Manuel Alacak Takibi", kayitDuzenleniyor ? "Alacak kaydını düzenle" : "Yeni alacak ekle", "Kalan alacağını gelir/gider hareketlerinden bağımsız takip et."],
  };
  if (borcPencereKickerAlani) borcPencereKickerAlani.textContent = metinler[listeTuru][0];
  if (borcPencereBasligi) borcPencereBasligi.textContent = metinler[listeTuru][1];
  if (borcPencereNotuAlani) borcPencereNotuAlani.textContent = metinler[listeTuru][2];
}

function borcAlacakTakipTuruAlanlariniGuncelle() {
  const listeTuru = ["debt", "installment", "receivable"].includes(borcListeTuruAlani?.value)
    ? borcListeTuruAlani.value
    : "debt";
  if (borcEklemeFormu) borcEklemeFormu.dataset.listType = listeTuru;
  if (borcTuruAlani) borcTuruAlani.value = listeTuru === "receivable" ? "receivable" : "debt";
  if (borcTaksitSayisiEtiketi) borcTaksitSayisiEtiketi.hidden = listeTuru !== "installment";
  if (borcTaksitSayisiAlani) {
    borcTaksitSayisiAlani.required = listeTuru === "installment";
    borcTaksitSayisiAlani.min = listeTuru === "installment" ? "2" : "1";
    if (listeTuru === "installment" && Number(borcTaksitSayisiAlani.value || 0) < 2) {
      borcTaksitSayisiAlani.value = "2";
    }
  }
  borcTaksitZorunlulugunuGuncelle();
  borcAlacakPencereMetinleriniGuncelle();
}

function borcAlacakTurunuDegistir(kayitId) {
  borcAlacakPenceresiniAc(kayitId);
  window.setTimeout(() => borcListeTuruAlani?.focus(), 0);
}

function borcAlacakPenceresiniAc(kayitId = "", istenenListeTuru = aktifBorcAlacakSekmesi, kaynakIslemId = "") {
  duzenlenenBorcAlacakId = String(kayitId || "");
  const kayit = duzenlenenBorcAlacakId
    ? borcAlacakKayitlari.find((item) => item.id === duzenlenenBorcAlacakId)
    : null;
  const kaynakIslem = !kayit && kaynakIslemId
    ? transactions.find((item) => item.id === String(kaynakIslemId))
    : null;
  const listeTuru = kayit?.listType || (["debt", "installment", "receivable"].includes(istenenListeTuru)
    ? istenenListeTuru
    : "debt");

  borcEklemeFormu?.reset();
  if (borcEklemeFormu) {
    borcEklemeFormu.dataset.listType = listeTuru;
    borcEklemeFormu.dataset.sourceTransactionId = kayit?.sourceTransactionId || kaynakIslem?.id || "";
  }
  if (borcListeTuruAlani) borcListeTuruAlani.value = listeTuru;
  if (borcTuruAlani) borcTuruAlani.value = listeTuru === "receivable" ? "receivable" : "debt";
  if (borcKisiAlani) borcKisiAlani.value = kayit?.person || kaynakIslem?.title || "";
  if (borcTutariAlani) borcTutariAlani.value = kayit?.originalAmount || kaynakIslem?.amount || "";
  if (borcBaslangicTarihiAlani) {
    borcBaslangicTarihiAlani.value = kayit?.startDate || (borcAlacakGecerliTarihMi(kaynakIslem?.date) ? kaynakIslem.date : getTurkeyTodayISO());
  }
  if (borcVadeTarihiAlani) borcVadeTarihiAlani.value = kayit?.dueDate || "";
  if (borcTaksitSayisiEtiketi) borcTaksitSayisiEtiketi.hidden = listeTuru !== "installment";
  if (borcTaksitSayisiAlani) {
    borcTaksitSayisiAlani.required = listeTuru === "installment";
    borcTaksitSayisiAlani.min = listeTuru === "installment" ? "2" : "1";
    borcTaksitSayisiAlani.value = String(kayit?.installmentCount || (listeTuru === "installment" ? 2 : 1));
  }
  if (borcNotuAlani) {
    borcNotuAlani.value = kayit?.note || [kaynakIslem?.category, kaynakIslem?.note]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 180);
  }
  if (borcKaydetButtonu) borcKaydetButtonu.textContent = kayit ? "Güncelle" : "Kaydet";
  if (borcFormDurumu) borcFormDurumu.textContent = "";
  borcAlacakTakipTuruAlanlariniGuncelle();
  if (borcEklemePenceresi) borcEklemePenceresi.hidden = false;
  window.setTimeout(() => borcKisiAlani?.focus(), 0);
}

function borcAlacakPenceresiniKapat() {
  duzenlenenBorcAlacakId = "";
  borcEklemeFormu?.reset();
  if (borcEklemeFormu) {
    borcEklemeFormu.dataset.listType = "debt";
    borcEklemeFormu.dataset.sourceTransactionId = "";
  }
  if (borcListeTuruAlani) borcListeTuruAlani.value = "debt";
  if (borcBaslangicTarihiAlani) borcBaslangicTarihiAlani.value = getTurkeyTodayISO();
  if (borcTaksitSayisiAlani) {
    borcTaksitSayisiAlani.min = "2";
    borcTaksitSayisiAlani.value = "2";
  }
  if (borcTaksitSayisiEtiketi) borcTaksitSayisiEtiketi.hidden = true;
  if (borcFormDurumu) borcFormDurumu.textContent = "";
  if (borcKaydetButtonu) borcKaydetButtonu.textContent = "Kaydet";
  if (borcPencereBasligi) borcPencereBasligi.textContent = "Yeni borç ekle";
  borcAlacakPencereMetinleriniGuncelle();
  if (borcEklemePenceresi) borcEklemePenceresi.hidden = true;
}

function borcAlacakGeciciDurumunuSifirla() {
  if (borcDurumuFiltresi) borcDurumuFiltresi.value = "open";
  if (alacakDurumuFiltresi) alacakDurumuFiltresi.value = "open";
  if (borcTaksitDurumuFiltresi) borcTaksitDurumuFiltresi.value = "open";
  isaretliTaksitSayfasi = 1;
  if (borcListeDurumu) borcListeDurumu.textContent = "";
  if (alacakListeDurumu) alacakListeDurumu.textContent = "";
  borcAlacakPenceresiniKapat();
  borcAlacakOdemePenceresiniKapat();
  borcAlacakSekmesiniAc("debts");
}

function borcAlacakKaydiniKaydet(event) {
  event.preventDefault();
  const anaTutar = Math.abs(roundMoney(readSignedNumber(borcTutariAlani?.value, 0)));
  const kisi = String(borcKisiAlani?.value || "").trim();
  const baslangicTarihi = String(borcBaslangicTarihiAlani?.value || "");
  const vadeTarihi = String(borcVadeTarihiAlani?.value || "");
  const listeTuru = ["debt", "installment", "receivable"].includes(borcListeTuruAlani?.value)
    ? borcListeTuruAlani.value
    : borcEklemeFormu?.dataset.listType || "debt";
  const kaynakIslemId = String(borcEklemeFormu?.dataset.sourceTransactionId || "");
  const taksitSayisi = listeTuru === "installment"
    ? Math.max(2, Math.min(60, Math.trunc(Number(borcTaksitSayisiAlani?.value || 2))))
    : 1;

  if (!kisi || !anaTutar || !borcAlacakGecerliTarihMi(baslangicTarihi)) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Kişi / kurum, tutar ve başlangıç tarihi zorunlu.";
    return;
  }
  if (vadeTarihi && vadeTarihi < baslangicTarihi) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Vade tarihi başlangıç tarihinden önce olamaz.";
    return;
  }
  if (listeTuru === "installment" && !borcAlacakGecerliTarihMi(vadeTarihi)) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Taksitli kayıt için ilk taksit tarihini seçmelisin.";
    return;
  }

  const oncekiKayit = duzenlenenBorcAlacakId
    ? borcAlacakKayitlari.find((item) => item.id === duzenlenenBorcAlacakId)
    : null;
  const ayniKaynaktanKayit = kaynakIslemId
    ? borcAlacakKayitlari.find((item) => item.sourceTransactionId === kaynakIslemId && item.id !== oncekiKayit?.id)
    : null;
  if (ayniKaynaktanKayit) {
    if (borcFormDurumu) borcFormDurumu.textContent = "Bu gelir/gider hareketi zaten bir takip listesine eklenmiş.";
    return;
  }
  const odemeToplami = roundMoney((oncekiKayit?.payments || []).reduce((sum, item) => sum + item.amount, 0));
  if (anaTutar < odemeToplami) {
    if (borcFormDurumu) borcFormDurumu.textContent = `Toplam tutar, işlenmiş ${currency.format(odemeToplami)} ödemeden düşük olamaz.`;
    return;
  }

  const simdi = getTurkeyNowDateTime();
  const kayitId = oncekiKayit?.id || crypto.randomUUID();
  const taksitPlaniDegisti = Boolean(
    oncekiKayit &&
    (oncekiKayit.originalAmount !== anaTutar ||
      oncekiKayit.installmentCount !== taksitSayisi ||
      oncekiKayit.dueDate !== vadeTarihi ||
      oncekiKayit.listType !== listeTuru)
  );
  const taksitler = borcAlacakTaksitleriniOlustur(kayitId, anaTutar, taksitSayisi, vadeTarihi);
  const odemeler = taksitPlaniDegisti
    ? borcAlacakOdemeleriniTaksitlereDagit(oncekiKayit?.payments || [], taksitler, { eskiDagitimlariKoru: false })
    : oncekiKayit?.payments || [];
  const sonrakiKayit = borcAlacakKaydiniNormalizeEt({
    id: kayitId,
    kind: listeTuru === "receivable" ? "receivable" : "debt",
    listType: listeTuru,
    person: kisi,
    originalAmount: anaTutar,
    amount: anaTutar,
    startDate: baslangicTarihi,
    dueDate: vadeTarihi,
    installmentCount: taksitSayisi,
    installments: taksitler,
    payments: odemeler,
    sourceTransactionId: kaynakIslemId || oncekiKayit?.sourceTransactionId || "",
    openingTransactionId: oncekiKayit?.openingTransactionId || "",
    note: borcNotuAlani?.value || "",
    status: oncekiKayit?.status || "open",
    manualClosed: oncekiKayit?.manualClosed || false,
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
  borcAlacakSekmesiniAc(listeTuru === "receivable" ? "receivables" : listeTuru === "installment" ? "installments" : "debts");
  borcAlacakPenceresiniKapat();
}

function borcAlacakListeIsleminiYonet(event) {
  const button = event.target.closest("button[data-debt-action]");
  if (!button) return;
  const kayitId = String(button.dataset.debtId || "");
  const islem = String(button.dataset.debtAction || "");
  if (islem === "change-type") borcAlacakTurunuDegistir(kayitId);
  if (islem === "edit") borcAlacakPenceresiniAc(kayitId);
  if (islem === "pay") borcAlacakOdemePenceresiniAc(kayitId);
  if (islem === "reopen") borcAlacakKaydiniYenidenAc(kayitId);
  if (islem === "delete") borcAlacakKaydiniSilmeOnayi(kayitId);
}

function borcAlacakTaksitIsleminiYonet(event) {
  const button = event.target.closest("button[data-debt-action]");
  if (!button) return;
  const islem = String(button.dataset.debtAction || "");
  if (islem === "pay-installment") {
    borcAlacakOdemePenceresiniAc(button.dataset.debtId, button.dataset.installmentId);
    return;
  }
  if (islem === "change-type") borcAlacakTurunuDegistir(button.dataset.debtId);
  if (islem === "edit") borcAlacakPenceresiniAc(button.dataset.debtId);
  if (islem === "delete") borcAlacakKaydiniSilmeOnayi(button.dataset.debtId);
}

function borcAlacakKaydiniYenidenAc(kayitId) {
  const simdi = getTurkeyNowDateTime();
  borcAlacakKayitlari = borcAlacakKayitlari.map((item) => item.id === kayitId
    ? borcAlacakKaydiniNormalizeEt({
      ...item,
      amount: item.originalAmount,
      status: "open",
      manualClosed: false,
      closedAt: "",
      updatedAt: simdi,
    })
    : item);
  borcAlacakKayitlariniKaliciKaydet();
  borcAlacaklariEkranaBas();
}

function borcAlacakKaydiniSilmeOnayi(kayitId) {
  const kayit = borcAlacakKayitlari.find((item) => item.id === kayitId);
  if (!kayit) return;
  openGenericConfirmModal(
    "Kaydı silmek istediğine emin misin?",
    `${kayit.person} için ${currency.format(kayit.originalAmount)} tutarındaki manuel kayıt ve ödeme geçmişi silinecek.`,
    () => {
      const silinmeTarihi = getTurkeyNowDateTime();
      borcAlacakSilmeIziniKaydet(kayit.id, silinmeTarihi);
      borcAlacakKayitlari = borcAlacakKayitlari.filter((item) => item.id !== kayit.id);
      borcAlacakKayitlariniKaliciKaydet();
      borcAlacaklariEkranaBas();
    }
  );
}

function borcAlacakOdemeHesaplariniDoldur(kayit) {
  if (!borcOdemeHesabiAlani) return;
  const oncekiDeger = borcOdemeHesabiAlani.value;
  const hesaplar = paymentAccounts.filter((item) => kayit?.kind !== "receivable" || item.type !== "credit_card");
  borcOdemeHesabiAlani.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = hesaplar.length
    ? (kayit?.kind === "receivable" ? "Tahsilatın yatırılacağı hesabı seç" : "Ödemenin çıkacağı hesabı seç")
    : "Önce Kartlar / Hesaplar bölümünden hesap ekle";
  borcOdemeHesabiAlani.append(placeholder);
  hesaplar.forEach((hesap) => {
    const option = document.createElement("option");
    option.value = hesap.id;
    option.textContent = `${formatPaymentAccountName(hesap)} · ${currency.format(Number(hesap.balance || 0))}`;
    borcOdemeHesabiAlani.append(option);
  });
  borcOdemeHesabiAlani.value = hesaplar.some((item) => item.id === oncekiDeger) ? oncekiDeger : "";
  if (borcOdemeHesabiEtiketi) borcOdemeHesabiEtiketi.hidden = false;
  if (borcOdemeHesabiEtiketMetni) {
    borcOdemeHesabiEtiketMetni.textContent = kayit?.kind === "receivable"
      ? "Tahsilatın yatırılacağı hesap"
      : "Borç ödemesinin çıkacağı hesap";
  }
}

function borcAlacakOdemeYonteminiHesaptanBul(hesap) {
  if (hesap?.type === "credit_card") return "credit_card";
  if (hesap?.type === "cash") return "cash";
  return "bank_account";
}

function borcAlacakOdemePenceresiniAc(kayitId, taksitId = "") {
  aktifBorcAlacakOdemeKayitId = String(kayitId || "");
  aktifBorcAlacakOdemeTaksitId = String(taksitId || "");
  const kayit = borcAlacakKayitlari.find((item) => item.id === aktifBorcAlacakOdemeKayitId);
  if (!kayit || kayit.amount <= 0) return;

  borcOdemeFormu?.reset();
  if (borcOdemeTarihiAlani) borcOdemeTarihiAlani.value = getTurkeyTodayISO();
  borcAlacakOdemeHesaplariniDoldur(kayit);
  if (borcOdemePencereBasligi) {
    borcOdemePencereBasligi.textContent = kayit.listType === "installment"
      ? "Taksit ödemesi ekle"
      : kayit.kind === "receivable" ? "Tahsilat ekle" : "Borç ödemesi ekle";
  }
  if (borcOdemeKaydetButtonu) {
    borcOdemeKaydetButtonu.textContent = kayit.kind === "receivable" ? "Tahsilatı Kaydet" : "Ödemeyi Kaydet";
  }
  if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = "";
  borcAlacakOdemeKaydiSeciminiGuncelle();
  if (borcOdemePenceresi) borcOdemePenceresi.hidden = false;
  window.setTimeout(() => borcOdemeTutariAlani?.focus(), 0);
}

function borcAlacakOdemePenceresiniKapat() {
  aktifBorcAlacakOdemeKayitId = "";
  aktifBorcAlacakOdemeTaksitId = "";
  borcOdemeFormu?.reset();
  if (borcOdemeHesabiAlani) borcOdemeHesabiAlani.innerHTML = "";
  if (borcOdemeTaksitAlani) borcOdemeTaksitAlani.hidden = true;
  if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = "";
  if (borcOdemePenceresi) borcOdemePenceresi.hidden = true;
}

function borcAlacakTaksitOdenenTutari(kayit, taksitId) {
  return roundMoney((kayit.payments || []).reduce((sum, payment) => {
    const dagitim = payment.allocations.find((item) => item.installmentId === taksitId);
    return sum + Number(dagitim?.amount || 0);
  }, 0));
}

function borcAlacakTaksitKalanTutari(kayit, taksit) {
  return Math.max(0, roundMoney(Number(taksit.amount || 0) - borcAlacakTaksitOdenenTutari(kayit, taksit.id)));
}

function borcAlacakOdemeKaydiSeciminiGuncelle() {
  const kayit = borcAlacakKayitlari.find((item) => item.id === aktifBorcAlacakOdemeKayitId);
  if (!kayit) return;

  if (borcOdemeOzeti) {
    borcOdemeOzeti.textContent = `${kayit.person} · ${borcAlacakListeTuruEtiketi(kayit.listType)} · Kalan ${currency.format(kayit.amount)}`;
  }
  if (borcOdemeTaksitSecimi) {
    borcOdemeTaksitSecimi.innerHTML = '<option value="">En eski bekleyen taksitten otomatik düş</option>';
    kayit.installments.forEach((taksit) => {
      const kalan = borcAlacakTaksitKalanTutari(kayit, taksit);
      if (kalan <= 0) return;
      const option = document.createElement("option");
      option.value = taksit.id;
      option.textContent = `${taksit.number}. taksit · ${borcAlacakTarihiniYaz(taksit.dueDate)} · Kalan ${currency.format(kalan)}`;
      borcOdemeTaksitSecimi.append(option);
    });
    borcOdemeTaksitSecimi.value = kayit.installments.some((item) => item.id === aktifBorcAlacakOdemeTaksitId)
      ? aktifBorcAlacakOdemeTaksitId
      : "";
  }
  if (borcOdemeTaksitAlani) borcOdemeTaksitAlani.hidden = kayit.installments.length === 0;
  borcAlacakOdemeTutarSiniriniGuncelle();
}

function borcAlacakOdemeIcinAzamiTutar() {
  const kayit = borcAlacakKayitlari.find((item) => item.id === aktifBorcAlacakOdemeKayitId);
  if (!kayit) return 0;
  const taksit = kayit.installments.find((item) => item.id === String(borcOdemeTaksitSecimi?.value || ""));
  const azami = taksit ? borcAlacakTaksitKalanTutari(kayit, taksit) : Number(kayit.amount || 0);
  return Math.max(0, roundMoney(azami));
}

function borcAlacakOdemeTutarSiniriniGuncelle() {
  if (!borcOdemeTutariAlani) return;
  const azami = borcAlacakOdemeIcinAzamiTutar();
  borcOdemeTutariAlani.max = String(azami || "");
  if (Number(borcOdemeTutariAlani.value || 0) > azami) borcOdemeTutariAlani.value = String(azami || "");
  if (aktifBorcAlacakOdemeTaksitId) {
    borcOdemeTutariAlani.value = String(azami || "");
  }
}

function borcAlacakOdemeTutarininTamaginiYaz() {
  if (borcOdemeTutariAlani) borcOdemeTutariAlani.value = String(borcAlacakOdemeIcinAzamiTutar() || "");
}

function borcAlacakOdemesiniKaydet(event) {
  event.preventDefault();
  const kayit = borcAlacakKayitlari.find((item) => item.id === aktifBorcAlacakOdemeKayitId);
  const hesap = paymentAccounts.find((item) => item.id === String(borcOdemeHesabiAlani?.value || ""));
  const tutar = Math.abs(roundMoney(readSignedNumber(borcOdemeTutariAlani?.value, 0)));
  const tarih = String(borcOdemeTarihiAlani?.value || "");
  const azamiTutar = borcAlacakOdemeIcinAzamiTutar();
  if (!kayit || !tutar || !borcAlacakGecerliTarihMi(tarih) || !hesap) {
    if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = "Kayıt, tutar, tarih ve hesap seçimi zorunlu.";
    if (!hesap) borcOdemeHesabiAlani?.focus();
    return;
  }
  if (kayit.kind === "receivable" && hesap.type === "credit_card") {
    if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = "Alacak tahsilatı için nakit veya banka hesabı seçmelisin.";
    borcOdemeHesabiAlani?.focus();
    return;
  }
  if (tutar > azamiTutar) {
    if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = `En fazla ${currency.format(azamiTutar)} düşebilirsin.`;
    return;
  }

  const simdi = getTurkeyNowDateTime();
  const odemeId = crypto.randomUUID();
  const taksitId = String(borcOdemeTaksitSecimi?.value || "");
  const hesapHareketi = {
    id: crypto.randomUUID(),
    type: kayit.kind === "receivable" ? "income" : "expense",
    title: `${kayit.person} ${kayit.kind === "receivable" ? "Tahsilatı" : "Borç Ödemesi"}`.slice(0, 40),
    amount: tutar,
    category: kayit.kind === "receivable"
      ? "Alacak Tahsilatı"
      : kayit.listType === "installment" ? "Taksit Ödemesi" : "Borç Ödemesi",
    paymentMethod: borcAlacakOdemeYonteminiHesaptanBul(hesap),
    paymentAccountId: hesap.id,
    transferAccountId: "",
    transferFee: 0,
    date: tarih,
    note: String(borcOdemeNotuAlani?.value || "").trim().slice(0, 100),
    isInstallment: false,
    transactionAt: buildTransactionDateTime(tarih, getTurkeyNowTime()),
    debtReceivableId: kayit.id,
    debtPaymentId: odemeId,
    debtInstallmentId: taksitId,
    debtAction: kayit.kind === "receivable" ? "collection" : "payment",
    debtAppliedAmount: tutar,
    createdAt: simdi,
    updatedAt: simdi,
  };
  if (!validateTransactionPayment(hesapHareketi, borcOdemeFormDurumu)) return;
  if (!applyTransactionPaymentEffect(hesapHareketi, 1)) {
    if (borcOdemeFormDurumu) borcOdemeFormDurumu.textContent = "Seçilen hesaba hareket işlenemedi.";
    return;
  }
  const odeme = borcAlacakOdemeKaydiniNormalizeEt({
    id: odemeId,
    amount: tutar,
    date: tarih,
    note: borcOdemeNotuAlani?.value || "",
    transactionId: hesapHareketi.id,
    allocations: taksitId ? [{ installmentId: taksitId, amount: tutar }] : [],
    createdAt: simdi,
  });
  transactions = [hesapHareketi, ...transactions].sort(compareTransactionsNewestFirst);
  const guncellenenKayit = borcAlacakKaydiniNormalizeEt({
    ...kayit,
    payments: [...kayit.payments, odeme],
    manualClosed: false,
    closedAt: tutar >= kayit.amount ? simdi : "",
    updatedAt: simdi,
  });
  borcAlacakKayitlari = borcAlacakKayitlari.map((item) => item.id === kayit.id ? guncellenenKayit : item);
  refreshAllPaymentAccountsFromRecords({ silent: true, syncCloud: false });
  persistPaymentAccounts();
  persistTransactions({ cloudUpserts: [hesapHareketi] }).catch((error) => {
    if (typeof cloudStatus !== "undefined" && cloudStatus) {
      cloudStatus.textContent = `Ödeme hareketi buluta kaydedilemedi: ${error.message}`;
    }
  });
  borcAlacakKayitlariniKaliciKaydet();
  borcAlacakOdemePenceresiniKapat();
  render();
}

function borcAlacakTuruEtiketi(tur) {
  return tur === "receivable" ? "Alacağım" : "Borcum";
}

function borcAlacakListeTuruEtiketi(listeTuru) {
  if (listeTuru === "installment") return "Taksit planım";
  return listeTuru === "receivable" ? "Alacağım" : "Borcum";
}

function borcAlacakTarihiniYaz(value) {
  const date = borcAlacakGecerliTarihMi(value) ? new Date(`${value}T12:00:00+03:00`) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "Belirtilmedi";
}

function borcAlacakTaksitAyiBilgisi(anahtar) {
  if (!/^\d{4}-\d{2}$/.test(String(anahtar || ""))) return null;
  const [yil, ay] = String(anahtar).split("-").map(Number);
  const tarih = new Date(Date.UTC(yil, ay - 1, 1));
  if (Number.isNaN(tarih.getTime())) return null;
  const etiket = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" }).format(tarih);
  return { key: anahtar, label: etiket.charAt(0).toLocaleUpperCase("tr-TR") + etiket.slice(1) };
}

function borcAlacakGorunenTaksitAylari(durumFiltresi = "open", islemler = []) {
  const buAy = getTurkeyTodayISO().slice(0, 7);
  if (durumFiltresi === "current") {
    return [borcAlacakTaksitAyiBilgisi(buAy)].filter(Boolean);
  }

  const ayAnahtarlari = [...new Set(
    islemler
      .map((item) => String(item.date || "").slice(0, 7))
      .filter((anahtar) => /^\d{4}-\d{2}$/.test(anahtar))
  )];
  ayAnahtarlari.sort(durumFiltresi === "open"
    ? (left, right) => left.localeCompare(right)
    : (left, right) => right.localeCompare(left));
  return ayAnahtarlari.map(borcAlacakTaksitAyiBilgisi).filter(Boolean);
}

function borcAlacakIsaretliTaksitIslemleri(durumFiltresi = "open") {
  const buAy = getTurkeyTodayISO().slice(0, 7);
  return transactions
    .filter((item) => {
      if (!item.isInstallment) return false;
      if (durumFiltresi === "current") return String(item.date || "").slice(0, 7) === buAy;
      if (durumFiltresi === "paid") return Boolean(item.installmentCompleted);
      return !item.installmentCompleted;
    })
    .sort(compareTransactionsNewestFirst);
}

function borcAlacakIsaretliTaksitleriniEkranaBas(durumFiltresi = "open") {
  if (!isaretliTaksitListesi) return 0;
  if (isaretliTaksitBolumu) isaretliTaksitBolumu.hidden = false;
  const filtrelenmisIslemler = borcAlacakIsaretliTaksitIslemleri(durumFiltresi);
  const islemler = durumFiltresi === "open"
    ? [...filtrelenmisIslemler].sort((left, right) => {
      const tarihFarki = String(left.date || "").localeCompare(String(right.date || ""));
      return tarihFarki || compareTransactionsNewestFirst(left, right);
    })
    : filtrelenmisIslemler;
  const toplamSayfa = Math.max(1, Math.ceil(islemler.length / OTOMATIK_TAKSIT_SAYFA_BOYUTU));
  isaretliTaksitSayfasi = Math.min(toplamSayfa, Math.max(1, isaretliTaksitSayfasi));
  const ilkKayitIndeksi = (isaretliTaksitSayfasi - 1) * OTOMATIK_TAKSIT_SAYFA_BOYUTU;
  const sayfadakiIslemler = islemler.slice(ilkKayitIndeksi, ilkKayitIndeksi + OTOMATIK_TAKSIT_SAYFA_BOYUTU);
  const sonKayitIndeksi = Math.min(islemler.length, ilkKayitIndeksi + sayfadakiIslemler.length);
  const aylar = borcAlacakGorunenTaksitAylari(durumFiltresi, sayfadakiIslemler);
  isaretliTaksitListesi.innerHTML = "";
  if (isaretliTaksitBasligi) {
    isaretliTaksitBasligi.textContent = durumFiltresi === "paid"
      ? "Ödenen taksitler"
      : durumFiltresi === "current"
        ? "Bu ayki taksitler"
        : "Kalan taksitler";
  }

  aylar.forEach((ay) => {
    const ayIslemleri = sayfadakiIslemler.filter((item) => String(item.date || "").slice(0, 7) === ay.key);
    const ayBolumu = document.createElement("section");
    ayBolumu.className = "scheduled-installment-month";
    const baslik = document.createElement("h4");
    baslik.textContent = ay.label;
    const liste = document.createElement("div");
    liste.className = "scheduled-installment-transactions";
    if (ayIslemleri.length) {
      ayIslemleri.forEach((item) => {
        const kart = createTransactionListItem(item);
        const satir = kart.querySelector(".transaction-item");
        const yanAlan = kart.querySelector(".transaction-side");
        const duzenleButtonu = kart.querySelector(".edit-transaction-btn");
        const durumButtonu = document.createElement("button");
        satir?.classList.toggle("is-installment-completed", Boolean(item.installmentCompleted));
        durumButtonu.type = "button";
        durumButtonu.className = "ghost-btn scheduled-installment-status-button";
        durumButtonu.dataset.installmentStatusId = item.id;
        durumButtonu.textContent = item.installmentCompleted ? "Geri Aç" : "Tamamlandı";
        durumButtonu.setAttribute(
          "aria-label",
          `${item.title} taksitini ${item.installmentCompleted ? "yeniden aç" : "tamamlandı olarak işaretle"}`
        );
        yanAlan?.insertBefore(durumButtonu, duzenleButtonu || null);
        liste.append(kart);
      });
    } else {
      liste.innerHTML = '<div class="empty-state">Bu ay için taksit bulunmuyor.</div>';
    }
    ayBolumu.append(baslik, liste);
    isaretliTaksitListesi.append(ayBolumu);
  });

  if (!aylar.length) {
    const bosMetin = durumFiltresi === "paid"
      ? "Ödenen gelir / gider taksiti bulunmuyor."
      : "Kalan gelir / gider taksiti bulunmuyor.";
    isaretliTaksitListesi.innerHTML = `<div class="empty-state">${bosMetin}</div>`;
  }

  if (isaretliTaksitDurumuAlani) {
    const sayfaBilgisi = toplamSayfa > 1 ? ` Sayfa ${isaretliTaksitSayfasi}/${toplamSayfa}.` : "";
    isaretliTaksitDurumuAlani.textContent = durumFiltresi === "paid"
      ? `${islemler.length} ödenen otomatik taksit bulundu.${sayfaBilgisi}`
      : durumFiltresi === "current"
        ? `${islemler.length} bu aya ait otomatik taksit bulundu.${sayfaBilgisi}`
        : `${islemler.length} kalan otomatik taksit bulundu.${sayfaBilgisi}`;
  }
  if (isaretliTaksitSayfalamaAlani) isaretliTaksitSayfalamaAlani.hidden = toplamSayfa <= 1;
  if (isaretliTaksitOncekiSayfaButtonu) isaretliTaksitOncekiSayfaButtonu.disabled = isaretliTaksitSayfasi <= 1;
  if (isaretliTaksitSonrakiSayfaButtonu) isaretliTaksitSonrakiSayfaButtonu.disabled = isaretliTaksitSayfasi >= toplamSayfa;
  if (isaretliTaksitSayfaEtiketi) {
    isaretliTaksitSayfaEtiketi.textContent = islemler.length
      ? `${ilkKayitIndeksi + 1}-${sonKayitIndeksi} / ${islemler.length} · Sayfa ${isaretliTaksitSayfasi}/${toplamSayfa}`
      : "";
  }
  return islemler.length;
}

function borcAlacakOtomatikTaksitSayfasiniDegistir(fark) {
  const durumFiltresi = borcTaksitDurumuFiltresi?.value || "open";
  const toplamKayit = borcAlacakIsaretliTaksitIslemleri(durumFiltresi).length;
  const toplamSayfa = Math.max(1, Math.ceil(toplamKayit / OTOMATIK_TAKSIT_SAYFA_BOYUTU));
  const sonrakiSayfa = Math.min(toplamSayfa, Math.max(1, isaretliTaksitSayfasi + Number(fark || 0)));
  if (sonrakiSayfa === isaretliTaksitSayfasi) return;
  isaretliTaksitSayfasi = sonrakiSayfa;
  borcAlacakTaksitleriniEkranaBas();
}

function borcAlacakOtomatikTaksitIsleminiYonet(event) {
  const button = event.target.closest("button[data-installment-status-id]");
  if (!button) return;

  const kayitId = String(button.dataset.installmentStatusId || "");
  const mevcutKayit = transactions.find((item) => item.id === kayitId && item.isInstallment);
  if (!mevcutKayit) return;

  const tamamlandi = !Boolean(mevcutKayit.installmentCompleted);
  const simdi = getTurkeyNowDateTime();
  const guncellenenKayit = {
    ...mevcutKayit,
    installmentCompleted: tamamlandi,
    installmentCompletedAt: tamamlandi ? simdi : "",
    updatedAt: simdi,
  };
  transactions = transactions
    .map((item) => item.id === kayitId ? guncellenenKayit : item)
    .sort(compareTransactionsNewestFirst);
  persistTransactions({ cloudUpserts: [guncellenenKayit] }).catch((error) => {
    if (isaretliTaksitDurumuAlani) {
      isaretliTaksitDurumuAlani.textContent = `Taksit durumu buluta kaydedilemedi: ${error.message}`;
    }
  });
  render();
}

function borcAlacakDurumBilgisi(kayit) {
  if (kayit.status === "closed") {
    return { text: kayit.kind === "receivable" ? "Tahsil edildi" : "Ödendi", overdue: false };
  }
  const sonrakiTaksit = kayit.installments.find((item) => borcAlacakTaksitKalanTutari(kayit, item) > 0);
  const kontrolTarihi = sonrakiTaksit?.dueDate || kayit.dueDate;
  const overdue = Boolean(kontrolTarihi && kontrolTarihi < getTurkeyTodayISO());
  return { text: overdue ? "Vadesi geçti" : "Açık", overdue };
}

function borcAlacakKayitlariniSirala(left, right) {
  if (left.status !== right.status) return left.status === "open" ? -1 : 1;
  const leftDue = left.dueDate || "9999-12-31";
  const rightDue = right.dueDate || "9999-12-31";
  if (leftDue !== rightDue) return leftDue.localeCompare(rightDue);
  return getRecordTimestamp(right.updatedAt || right.createdAt) - getRecordTimestamp(left.updatedAt || left.createdAt);
}

function borcAlacakOdemeGecmisiHtml(kayit) {
  if (!kayit.payments.length) return "";
  const satirlar = [...kayit.payments]
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((item) => {
      const hesapHareketi = item.transactionId
        ? transactions.find((transaction) => transaction.id === item.transactionId)
        : null;
      const hesap = hesapHareketi?.paymentAccountId
        ? paymentAccounts.find((account) => account.id === hesapHareketi.paymentAccountId)
        : null;
      const hesapMetni = hesap ? ` · ${escapeHtml(formatPaymentAccountName(hesap))}` : "";
      return `
        <li>
          <span>${escapeHtml(borcAlacakTarihiniYaz(item.date))}${hesapMetni}${item.note ? ` · ${escapeHtml(item.note)}` : ""}</span>
          <strong>${escapeHtml(currency.format(item.amount))}</strong>
        </li>
      `;
    }).join("");
  return `
    <details class="debt-payment-history">
      <summary>${kayit.payments.length} ödeme / tahsilat kaydı</summary>
      <ul class="debt-payment-history-list">${satirlar}</ul>
    </details>
  `;
}

function borcAlacaklariEkranaBas() {
  if (!borcKayitListesi) return;
  const acikKayitlar = borcAlacakKayitlari.filter((item) => item.amount > 0);
  const isaretliTaksitler = borcAlacakIsaretliTaksitIslemleri();
  const toplamBorc = acikKayitlar.filter((item) => item.listType === "debt").reduce((sum, item) => sum + item.amount, 0);
  const toplamTaksit = roundMoney(
    acikKayitlar.filter((item) => item.listType === "installment").reduce((sum, item) => sum + item.amount, 0) +
    isaretliTaksitler.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  );
  const toplamAlacak = acikKayitlar.filter((item) => item.listType === "receivable").reduce((sum, item) => sum + item.amount, 0);
  if (toplamBorcAlani) toplamBorcAlani.textContent = currency.format(toplamBorc);
  if (toplamTaksitAlani) toplamTaksitAlani.textContent = currency.format(toplamTaksit);
  if (toplamAlacakAlani) toplamAlacakAlani.textContent = currency.format(toplamAlacak);
  if (acikBorcAlacakSayisiAlani) acikBorcAlacakSayisiAlani.textContent = String(acikKayitlar.length);

  if (aktifBorcAlacakSekmesi === "installments") {
    borcAlacakTaksitleriniEkranaBas();
    return;
  }

  const listeTuru = aktifBorcAlacakSekmesi === "receivables" ? "receivable" : "debt";
  const hedefListe = listeTuru === "receivable" ? alacakKayitListesi : borcKayitListesi;
  const hedefDurumAlani = listeTuru === "receivable" ? alacakListeDurumu : borcListeDurumu;
  const durumFiltresi = listeTuru === "receivable"
    ? alacakDurumuFiltresi?.value || "open"
    : borcDurumuFiltresi?.value || "open";
  const turKayitlari = borcAlacakKayitlari.filter((item) => item.listType === listeTuru);
  const gorunenKayitlar = borcAlacakKayitlari
    .filter((item) => item.listType === listeTuru)
    .filter((item) => durumFiltresi === "closed" ? item.amount <= 0 : item.amount > 0)
    .sort(borcAlacakKayitlariniSirala);

  if (!hedefListe) return;
  hedefListe.innerHTML = "";
  if (!gorunenKayitlar.length) {
    const turEtiketi = listeTuru === "receivable" ? "alacak" : "borç";
    const bosMesaj = !turKayitlari.length
      ? `Henüz ${turEtiketi} kaydı bulunmuyor. Bu listeye yalnızca kendin eklediğin kayıtlar alınır.`
      : durumFiltresi === "closed"
        ? listeTuru === "receivable"
          ? "Tahsil edilen alacak kaydı bulunmuyor."
          : "Ödenen borç kaydı bulunmuyor."
        : `Kalan ${turEtiketi} kaydı bulunmuyor.`;
    hedefListe.innerHTML = `<div class="empty-state">${bosMesaj}</div>`;
  } else {
    gorunenKayitlar.forEach((kayit) => {
      const durum = borcAlacakDurumBilgisi(kayit);
      const odenen = Math.min(kayit.originalAmount, roundMoney(kayit.originalAmount - kayit.amount));
      const ilerleme = kayit.originalAmount > 0 ? Math.min(100, Math.max(0, (odenen / kayit.originalAmount) * 100)) : 0;
      const satir = document.createElement("article");
      satir.className = `debt-record-item debt-kind-${kayit.kind}${kayit.status === "closed" ? " is-closed" : ""}`;
      const anaAksiyon = kayit.amount > 0
        ? `<button class="ghost-btn debt-payment-action" type="button" data-debt-action="pay" data-debt-id="${escapeHtml(kayit.id)}">${kayit.kind === "debt" ? "Ödeme Yap" : "Tahsilat Gir"}</button>`
        : kayit.manualClosed && !kayit.payments.length
          ? `<button class="ghost-btn" type="button" data-debt-action="reopen" data-debt-id="${escapeHtml(kayit.id)}">Yeniden Aç</button>`
          : '<span class="debt-linked-badge">Tamamlandı</span>';
      satir.innerHTML = `
        <div class="debt-record-main">
          <div class="debt-record-topline">
            <h3>${escapeHtml(kayit.person)}</h3>
            <span>${escapeHtml(borcAlacakListeTuruEtiketi(kayit.listType))}</span>
            <strong class="debt-record-amount">Kalan ${escapeHtml(currency.format(kayit.amount))}</strong>
          </div>
          <p class="debt-record-meta">
            Başlangıç: ${escapeHtml(borcAlacakTarihiniYaz(kayit.startDate))} ·
            Vade: ${escapeHtml(borcAlacakTarihiniYaz(kayit.dueDate))} ·
            <span class="debt-status-text${durum.overdue ? " debt-status-overdue" : ""}">${escapeHtml(durum.text)}</span>
          </p>
          <div class="debt-record-finance">
            <span>Toplam <strong>${escapeHtml(currency.format(kayit.originalAmount))}</strong></span>
            <span>Ödenen / tahsil edilen <strong>${escapeHtml(currency.format(odenen))}</strong></span>
            <span>Kalan <strong>${escapeHtml(currency.format(kayit.amount))}</strong></span>
          </div>
          <div class="debt-progress-track" aria-label="Tamamlanma oranı yüzde ${Math.round(ilerleme)}">
            <div class="debt-progress-value" style="width:${ilerleme.toFixed(2)}%"></div>
          </div>
          ${kayit.note ? `<p class="debt-record-note">${escapeHtml(kayit.note)}</p>` : ""}
          ${borcAlacakOdemeGecmisiHtml(kayit)}
        </div>
        <div class="debt-record-actions">
          ${anaAksiyon}
          <button class="ghost-btn" type="button" data-debt-action="change-type" data-debt-id="${escapeHtml(kayit.id)}">Türünü Değiştir</button>
          <button class="ghost-btn" type="button" data-debt-action="edit" data-debt-id="${escapeHtml(kayit.id)}">Düzenle</button>
          <button class="danger-btn" type="button" data-debt-action="delete" data-debt-id="${escapeHtml(kayit.id)}">Sil</button>
        </div>
      `;
      hedefListe.append(satir);
    });
  }
  if (hedefDurumAlani) hedefDurumAlani.textContent = `${gorunenKayitlar.length} kayıt gösteriliyor.`;
}

function borcAlacakTaksitleriniEkranaBas() {
  if (!borcTaksitListesi) return;
  const durumFiltresi = borcTaksitDurumuFiltresi?.value || "open";
  const otomatikTaksitSayisi = borcAlacakIsaretliTaksitleriniEkranaBas(durumFiltresi);
  let gorunenTaksitSayisi = 0;
  borcTaksitListesi.innerHTML = "";
  const taksitliKayitlar = borcAlacakKayitlari
    .filter((item) => item.listType === "installment" && item.installments.length > 1)
    .sort(borcAlacakKayitlariniSirala);

  taksitliKayitlar.forEach((kayit) => {
    const taksitler = kayit.installments.filter((taksit) => {
      const odendi = borcAlacakTaksitKalanTutari(kayit, taksit) <= 0;
      if (durumFiltresi === "current") return String(taksit.dueDate || "").slice(0, 7) === getTurkeyTodayISO().slice(0, 7);
      if (durumFiltresi === "paid") return odendi;
      return !odendi;
    });
    if (!taksitler.length) return;
    gorunenTaksitSayisi += taksitler.length;
    const grup = document.createElement("article");
    grup.className = "debt-installment-group";
    const satirlar = taksitler.map((taksit) => {
      const odenen = borcAlacakTaksitOdenenTutari(kayit, taksit.id);
      const kalan = borcAlacakTaksitKalanTutari(kayit, taksit);
      const odendi = kalan <= 0;
      const gecikti = !odendi && taksit.dueDate < getTurkeyTodayISO();
      return `
        <div class="debt-installment-row${odendi ? " is-paid" : ""}${gecikti ? " is-overdue" : ""}">
          <span class="debt-installment-number">${taksit.number}/${kayit.installmentCount}</span>
          <span>
            <strong>${escapeHtml(borcAlacakTarihiniYaz(taksit.dueDate))}</strong><br />
            <span class="debt-installment-state">${odendi ? "Tamamlandı" : gecikti ? "Vadesi geçti" : "Bekliyor"}</span>
          </span>
          <span class="debt-installment-money">
            <span>Taksit <strong>${escapeHtml(currency.format(taksit.amount))}</strong></span>
            <span>Ödenen ${escapeHtml(currency.format(odenen))} · Kalan ${escapeHtml(currency.format(kalan))}</span>
          </span>
          ${odendi ? '<span class="debt-linked-badge">Tamamlandı</span>' : `<button class="ghost-btn debt-payment-action" type="button" data-debt-action="pay-installment" data-debt-id="${escapeHtml(kayit.id)}" data-installment-id="${escapeHtml(taksit.id)}">${kayit.kind === "debt" ? "Taksiti Öde" : "Taksiti Tahsil Et"}</button>`}
        </div>
      `;
    }).join("");
    grup.innerHTML = `
      <div class="debt-installment-group-header">
        <div>
          <h3>${escapeHtml(kayit.person)} · ${escapeHtml(borcAlacakListeTuruEtiketi(kayit.listType))}</h3>
          <p>Toplam ${escapeHtml(currency.format(kayit.originalAmount))} · Kalan ${escapeHtml(currency.format(kayit.amount))}</p>
        </div>
        <div class="debt-installment-group-actions">
          <strong>${kayit.installmentCount} aylık taksit</strong>
          <button class="ghost-btn" type="button" data-debt-action="change-type" data-debt-id="${escapeHtml(kayit.id)}">Türünü Değiştir</button>
          <button class="ghost-btn" type="button" data-debt-action="edit" data-debt-id="${escapeHtml(kayit.id)}">Düzenle</button>
          <button class="danger-btn" type="button" data-debt-action="delete" data-debt-id="${escapeHtml(kayit.id)}">Sil</button>
        </div>
      </div>
      ${satirlar}
    `;
    borcTaksitListesi.append(grup);
  });

  if (!gorunenTaksitSayisi && !otomatikTaksitSayisi) {
    const bosMesaj = durumFiltresi === "paid"
      ? "Ödenen taksit bulunamadı."
      : durumFiltresi === "current"
        ? "Bu aya ait taksit bulunamadı."
        : "Kalan taksit bulunamadı.";
    borcTaksitListesi.innerHTML = `<div class="empty-state">${bosMesaj}</div>`;
  }
  if (borcTaksitListeDurumu) {
    borcTaksitListeDurumu.textContent = `${gorunenTaksitSayisi} manuel taksit · ${otomatikTaksitSayisi} otomatik taksit gösteriliyor.`;
  }
}
