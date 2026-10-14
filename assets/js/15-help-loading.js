const budgetLoadingValueSelector = "#shellNet,#shellIncome,#shellExpense,#shellSaving,#homeBalance,#homeAssetsTotal,#homeBesTotal,#homeSavingsTotal,#homeWealthTotal,#heroBalance,#incomeTotal,#expenseTotal,#assetsTotal,#cardDebtTotal,#activeStatementDebtTotal,#bankBalanceTotal,#besTotal,#besStateTotal,#besStateGainTotal,#besGainTotal,#debtOwedTotal,#debtInstallmentTotal,#debtReceivableTotal";

function setBudgetValuesStatus(status) {
  document.documentElement.dataset.valuesStatus = status;
  document.querySelectorAll(budgetLoadingValueSelector).forEach((node) => {
    node.classList.toggle("is-value-loading", status !== "ready");
    node.setAttribute("aria-busy", String(status === "loading"));
    if (status === "ready") node.removeAttribute("aria-label");
    else node.setAttribute("aria-label", status === "loading" ? "Veriler yükleniyor" : "Veriler yüklenemedi");
  });
}

function createBudgetHelpContent() {
  const content = document.createElement("div");
  content.className = "budget-help-content";
  const topics = [
    ["Ana sayfa", "Ay oklarıyla gelir, gider ve net sonucu seçilen ay için incele. Son işlemlerden kayıtları, artı menüsünden yeni işlemleri aç.", "Birikim dağılımı; pozitif bakiye, varlıklar ve BES toplamını içerir. Aylık net gelirle aynı şey değildir."],
    ["Gelir, gider ve transfer", "Artı menüsünden tür, tutar, kategori ve tarih seç. Gerektiğinde ödeme yöntemi ve hesap ekle. Transferde kaynak ve hedef farklı hesaplar olmalı.", "Kuruşlu tutar için 310,50 kullan. Aynı transferi ayrıca gider olarak girersen mükerrer hesaplama oluşabilir."],
    ["Kayıtlar", "Kartı açarak işlem bilgilerini ayrı alanlarda incele. Üç nokta menüsünden düzenle veya sil işlemini başlat.", "İşlem tarihi ile uygulamaya eklenme zamanı farklı olabilir. Son kayıtları incelerken hangi tarihin kullanıldığına dikkat et."],
    ["Kartlar ve hesaplar", "Hesabını ekle. Mobil kart menüsünden kayıtları, düzenlemeyi ve silme onayını aç. Kayıt penceresinin dönem seçimi ilgili hesap hareketlerini süzer.", "Kredi kartında dönem borcu ile toplam borç farklı olabilir."],
    ["Birikimler", "Tür, miktar ve ad gir. Kartta birim fiyat ve toplamı, detayında varlık bilgilerini incele. Menüden düzenle veya sil.", "Değer kayıtlı miktar ve uygulamadaki birim fiyata bağlıdır. Piyasa yenilemesi başarısızsa son fiyat güncel olmayabilir."],
    ["BES", "Sağlayıcı, sözleşme ve birikimleri gir. Kart detayında kendi birikimin, devlet katkısı ve getiriler ayrı görünür.", "Fon getirisi negatif olabilir; toplamı bileşenleriyle karşılaştır."],
    ["Borç, alacak ve taksitler", "İlgili sekmede kişi, tutar ve tarih ekle. Kart menüsünden düzenleme, silme ve mevcut özel işlemleri kullan.", "Ödeme/tahsilatı ilgili takip kaydından işle. Otomatik taksitlerde Tamamlandı ve Geri Aç seçenekleri menüdedir."],
    ["Özet ve tasarruf", "Tarih filtresiyle dönemi, işlem tipiyle kategori dağılımını seç. Kategorinin Detay butonuyla eşleşen hareketleri incele.", "Karşılaştırmada tarih aralığı ve işlem tipi aynı olsun; bir ay ile tüm zamanların toplamları farklıdır."],
    ["İçe aktarma", "Seçenek menüsünden görsel yükleme ve mevcut okuma seçeneklerini aç. Okunan satırları kontrol edip kaydet.", "Tutar, tarih, başlık ve hesabı doğrula. Aynı belgeyi tekrar eklemek mükerrer kayıt oluşturabilir."],
    ["Asistan", "Açınca klavye açılmaz; mesaj alanına dokun veya mikrofonu kullan. Eksik alanlar sorulur; kayıt yalnızca onayından sonra eklenir.", "Bu ay Market harcamalarım neler veya eklenme zamanına göre son 10 kayıt gibi sorular sor. Görüşmeyi bitir deyince veda eder ve 3 saniye sonra kapanır. Sesli özellikler tarayıcı ve izne bağlıdır."],
    ["Yedekleme ve görünüm", "Ayarlar'dan tema ve yazı boyutunu değiştir. Yedekleme bölümünde dışa aktarma, içe aktarma ve mevcut bulut işlemlerini kullan.", "Verileri temizlemeden veya cihaz değiştirmeden önce yedek al. Yükleme göstergesi sıfır bakiye anlamına gelmez."],
  ];
  const icons = ["house", "arrow-left-right", "history", "credit-card", "wallet", "chart-no-axes-combined", "users", "chart-pie", "file-input", "bot", "database"];
  topics.forEach(([title, description, tip], index) => {
    const item = document.createElement("details");
    const summary = document.createElement("summary");
    summary.innerHTML = shellIcon(icons[index]) + "<span></span>" + shellIcon("chevron-right");
    summary.querySelector("span").textContent = title;
    const text = document.createElement("p");
    text.textContent = description;
    const hint = document.createElement("p");
    hint.className = "budget-help-tip";
    hint.textContent = `İpucu: ${tip}`;
    item.append(summary, text, hint);
    content.append(item);
  });
  return content;
}
