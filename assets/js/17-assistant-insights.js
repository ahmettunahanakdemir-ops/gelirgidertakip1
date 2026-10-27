function getBudgetAssistantCount(text, normalize, fallback = 3) {
  const words = { bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, yirmi: 20, otuz: 30, kirk: 40, elli: 50, altmis: 60, yetmis: 70, seksen: 80, doksan: 90, yuz: 100 };
  const number = `(?:\\d{1,3}|(?:${Object.keys(words).join("|")})(?:\\s+(?:bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz))?)`;
  const normalized = normalize(text).replace(new RegExp(`\\b(?:son|gecen|onumuzdeki|gelecek)\\s+${number}\\s+(?:gun|hafta|ay)\\w*\\b`, "g"), " ");
  if (/\b(hepsi|hepsini|tumunu|tamami)\b/.test(normalized)) return 100;
  const match = new RegExp(`\\b(${number})\\s+(?:(?:adet|tane)\\s+)?(?:kategori|islem|kayit|kayd|hareket|harcama|gider|gelir|transfer|kalem|baslik|hesap|kart|borc|alacak|gun)\\w*\\b`).exec(normalized)
    || new RegExp(`\\b(?:ilk|son|top)\\s+(${number})(?:ini|unu|sini|sunu|si|i|u)?\\b`).exec(normalized);
  if (!match) return /\b(hepsi|hepsini|tumunu|tamami)\b/.test(normalized) ? 100 : fallback;
  const value = /^\d+$/.test(match[1]) ? Number(match[1]) : match[1].split(" ").reduce((sum, word) => sum + words[word], 0);
  return Math.min(100, Math.max(1, value));
}

function getBudgetAssistantPeriodOverride(text, today, normalize) {
  const n = normalize(text);
  const [year, month] = today.split("-").map(Number);
  if (/\b(tum zaman\w*|tum kayit\w*|butun kayit\w*|bugune kadar|simdiye kadar)\b/.test(n)) return { allTime: true, key: "", label: "Tüm kayıtlar" };
  const iso = date => date.toISOString().slice(0, 10);
  const date = new Date(`${today}T12:00:00Z`);
  const period = (startDate, endDate, label) => ({ allTime: false, key: "", startDate, endDate, label });
  const recent = /\b(?:son|gecen)\s+(\d{1,3}|(?:bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on|yirmi|otuz|kirk|elli|altmis|yetmis|seksen|doksan)(?:\s+(?:bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz))?)\s+(gun|hafta|ay)\w*\b/.exec(n);
  if (recent) {
    const count = Number(recent[1]) || getBudgetAssistantCount(`${recent[1]} kayıt`, normalize, 1);
    if (recent[2] === "ay") {
      const day = date.getUTCDate(); date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() - count);
      date.setUTCDate(Math.min(day, new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()));
    } else date.setUTCDate(date.getUTCDate() - count * (recent[2] === "hafta" ? 7 : 1) + 1);
    return period(iso(date), today, `Son ${count} ${recent[2] === "gun" ? "gün" : recent[2]}`);
  }
  if (/\bbugun(?:ku|ki)?\b/.test(n)) return period(today, today, "Bugün");
  if (/\bdun(?:ku|ki)?\b/.test(n)) { date.setUTCDate(date.getUTCDate() - 1); return period(iso(date), iso(date), "Dün"); }
  if (/\b(evvelsi gun|onceki gun|iki gun once)\b/.test(n)) { date.setUTCDate(date.getUTCDate() - 2); return period(iso(date), iso(date), "Evvelsi gün"); }
  if (/\byarin\b/.test(n)) { date.setUTCDate(date.getUTCDate() + 1); return period(iso(date), iso(date), "Yarın"); }
  if (/\b(bu yil|bu sene|bu seneki)\b/.test(n)) return period(`${year}-01-01`, today, `${year} yılı, bugüne kadar`);
  if (/\b(gecen yil|gecen sene|onceki yil)\b/.test(n)) return period(`${year - 1}-01-01`, `${year - 1}-12-31`, `${year - 1} yılı`);
  const namedMonth = /\b(ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)\w*\b/.test(n);
  const explicitDay = /\b\d{1,2}[./-]\d{1,2}|\b20\d{2}-\d{1,2}-\d{1,2}/.test(String(text));
  const fullYear = /\b(20\d{2})(?:\s+(?:yili|yilinda|senesi|senesinde))?\b/.exec(n);
  if (fullYear && !namedMonth && !explicitDay) return period(`${fullYear[1]}-01-01`, `${fullYear[1]}-12-31`, `${fullYear[1]} yılı`);
  if (/\b(gelecek ay|onumuzdeki ay)\b/.test(n)) {
    return period(iso(new Date(Date.UTC(year, month, 1))), iso(new Date(Date.UTC(year, month + 1, 0))), "Gelecek ay");
  }
  if (/\b(gelecek hafta|onumuzdeki hafta)\b/.test(n)) {
    date.setUTCDate(date.getUTCDate() + 8 - (date.getUTCDay() || 7));
    const start = iso(date); date.setUTCDate(date.getUTCDate() + 6); return period(start, iso(date), "Gelecek hafta");
  }
  const future = /\b(?:gelecek|onumuzdeki)\s+(\d{1,3}|bir|iki|uc|yedi|on|otuz)\s+(gun|hafta)\w*\b/.exec(n);
  if (future) {
    const count = Number(future[1]) || ({ bir: 1, iki: 2, uc: 3, yedi: 7, on: 10, otuz: 30 })[future[1]];
    date.setUTCDate(date.getUTCDate() + count * (future[2] === "hafta" ? 7 : 1) - 1);
    return period(today, iso(date), `Önümüzdeki ${count} ${future[2] === "hafta" ? "hafta" : "gün"}`);
  }
  return null;
}

function createBudgetAssistantInsights(api) {
  const { normalize: n, money, formatDate, getState, getPeriod, inPeriod, queryInfo, accountScope } = api;
  let context = null;
  let pendingScope = null;
  const value = number => Number.isFinite(Number(number)) ? Number(number) : 0;
  const sum = rows => rows.reduce((total, row) => total + value(row.amount), 0);
  const typeName = type => ({ expense: "gider", income: "gelir", transfer: "transfer" })[type] || "hareket";
  const helpTopics = [
    { title: "Özet ve tasarruf", pattern: /ozet|tasarruf|karsilastir|analiz/, answer: "Ana sayfada ay oklarıyla dönemi seç; Özet bölümünde tarih ve işlem türünü süz. Net gelir eksi giderdir. Transferler bu iki toplama dahil değildir.", examples: ["Bu ayın özeti", "Bu ay geçen aya göre giderim nasıl değişti?", "Bu ay tasarruf oranım ne?", "Bu ay günlük ortalama giderim ne?"] },
    { title: "Kayıt arama", pattern: /kayit|arama|islem|filtre/, answer: "Kayıtlar bölümünde tarih, tür, kategori ve hesap filtrelerini kullan. İşlemi açarak ayrıntılarını, üç noktadan düzenleme ve silme seçeneklerini görebilirsin. İşlem tarihi ve eklenme zamanı aynı şey değildir.", examples: ["Bugünkü gelir gider ve transferleri göster", "Bu ay en yüksek 10 gider", "Eklenme zamanına göre son 5 kayıt", "Dün Market harcamalarım neler?"] },
    { title: "Kayıt kontrolü", pattern: /mukerrer|eksik|gelecek tarih|harcamasiz/, answer: "Kayıtları olası mükerrerler, eksik alanlar veya geleceğe girilmiş işlemler açısından listeleyebilirim. Kontrol raporu kayıtları kendiliğinden silmez veya değiştirmez. Aynı tarih ve tutar tek başına kesin mükerrerlik kanıtı değildir.", examples: ["Bu ay mükerrer kayıt var mı?", "Eksik bilgili kayıtlarım neler?", "Gelecek tarihli kayıtlarımı göster", "Bu ay harcama yapmadığım günler"] },
    { title: "Gelir, gider ve transfer ekleme", pattern: /ekle|gelir|gider|transfer/, answer: "Artı menüsünden işlem türünü seç veya bana kaydı anlat. Eksik tutar, kategori, hesap ve tarihi sorarım; ancak son onayından sonra kaydederim. Transferde kaynak ve hedef farklı olmalıdır.", examples: ["Gider ekle", "Bugün nakit 250 TL market harcaması ekle", "Gelir ekle", "Transfer ekle"] },
    { title: "Kartlar ve hesaplar", pattern: /kart|hesap|bakiye|limit/, answer: "Kartlar ve Hesaplar bölümündeki artı düğmesinden hesap ekle. Kartın üç nokta menüsü kayıtları, düzenlemeyi ve silme onayını açar. Kredi kartının dönem borcu, toplam borcu ve limiti ayrıdır.", examples: ["Hesaplarım neler?", "Toplam kredi kartı borcum ne?", "Banka bakiyelerim ne kadar?", "Ziraat hesabımın bu ayki giderleri"] },
    { title: "Birikimler ve piyasa", pattern: /birikim|varlik|altin|dolar|portfoy|piyasa/, answer: "Birikimler bölümünde tür, miktar ve ad gir. Görünen değer, miktar ve uygulamadaki son fiyatın çarpımıdır. Fiyat yenilenemediyse eski olabilir. Kayıtlı maliyet geçmişi olmadan yatırım kârını kesin hesaplayamam.", examples: ["Birikimlerim ne kadar?", "Kaç gram altınım var?", "Dolar varlıklarım neler?", "Yatırım kârımı hesaplayabilir misin?"] },
    { title: "BES", pattern: /bes|emeklilik|fon|devlet katkisi/, answer: "BES bölümündeki artıyla sözleşme ekle. Şirket, birikim, devlet katkısı ve iki getiri alanı ayrı tutulur. Negatif getiri toplamı azaltır; değerler kendi girdiğin sözleşme verileridir.", examples: ["BES toplamım ne?", "BES devlet katkım ne kadar?", "BES fon getirilerim ne?", "BES kendi birikimim ne kadar?"] },
    { title: "Borç, alacak ve taksit", pattern: /borc|alacak|taksit|vade|tahsil/, answer: "Borç/Alacak bölümünde kişi, tutar ve vade ekle. Ödeme ya da tahsilatı ilgili kayıttan işle; kalan tutar buna göre azalır. Taksit planındaki ödeme dağılımlarını ayrıntıdan takip edebilirsin.", examples: ["Açık borçlarım neler?", "Vadesi geçen alacaklarım var mı?", "Ahmet'e kalan borcum ne?", "Gelecek ay taksitlerim neler?"] },
    { title: "İçe aktarma", pattern: /aktar|gorsel|belge|banka dokum|ocr/, answer: "Artı menüsündeki Görsel Yükle / Yapay Zeka ile Ekle seçeneklerinden belgeyi aç. Okunan başlık, tarih, tutar ve hesabı kaydetmeden kontrol et. Aynı belgeyi tekrar eklemek mükerrer kayıt oluşturabilir.", examples: ["Banka dökümünü nasıl içe aktarırım?", "Görselden kayıt nasıl eklenir?"] },
    { title: "Yedek ve bulut", pattern: /yedek|bulut|esitle|senkron|veri|disari|pdf|excel/, answer: "Ayarlar > Yedekleme işlemleri bölümünde mevcut dışa/içe aktarma ve bulut seçeneklerini kullan. Cihaz değiştirmeden veya veriyi temizlemeden önce JSON yedeği al. Aynı hesaba giriş yap; bulut durumu hata gösteriyorsa yalnızca yerel verin bulunabilir.", examples: ["Nasıl yedek alırım?", "Verilerim neden diğer cihazda görünmüyor?", "PDF veya Excel nasıl alırım?"] },
    { title: "Ayarlar ve profil", pattern: /ayar|tema|yazi|boyut|sifre|parola|profil|kategori/, answer: "Ayarlar'da Görünüm altında tema ve yazıyı; Hesap bilgileri altında profil/şifreyi; Kategoriler altında işlem kategorilerini düzenle. Giriş ekranındaki Parolamı unuttum bağlantısı şifre sıfırlama akışını açar. Ben bu ayarları konuşma içinde kendiliğimden değiştirmem.", examples: ["Yazı boyutunu nasıl değiştiririm?", "Şifremi nasıl sıfırlarım?", "Kategori nasıl eklerim?"] },
    { title: "Ses ve asistan", pattern: /ses|mikrofon|asistan|konus/, answer: "Mikrofona bir kez dokununca dinleme başlar, tekrar dokununca metin gönderilir. Basılı tutup bırakmak da mümkündür. Algılanan metni görebilir, çarpıdan iptal edebilirsin. Hoparlör son yanıtı okur; yeniden basınca durur. Mikrofon izni ve tarayıcı/cihaz desteği gerekir.", examples: ["Ne sorabilirim?", "Mikrofon neden açılmıyor?", "Görüşmeyi bitir"] },
  ];
  const result = (text, prompts = []) => ({ text, prompts });
  function help(text) {
    const normalized = n(text);
    if (/\b(ne sorabilirim|neler sorabilirim|neler yapabilirsin|ne yapabilirsin|soru ornekleri|ornek sorular|yardim|kullanim rehberi|yeteneklerin)\b/.test(normalized)) {
      return result("Kayıtlarından hesaplayabildiğim konular:\n" + helpTopics.map(topic => `• ${topic.title}: ${topic.examples[0]}`).join("\n") + "\n\nTarih, kategori veya hesap belirtebilirsin. Kayıtlı olmayan bilgiyi uydurmam; yeni işlem için önce eksik alanları sorar, son onayını beklerim.", helpTopics.slice(0, 8).map(topic => topic.examples[1] || topic.examples[0]));
    }
    if (!/\b(nasil|nereden|nerede|neden|niye|calismiyor|acilmiyor|gorunmuyor|destek)\b/.test(normalized)) return null;
    const topic = helpTopics.find(item => new RegExp(`\\b(?:${item.pattern.source})\\w*\\b`).test(normalized));
    if (!topic) return null;
    return result(`${topic.title}\n${topic.answer}`, topic.examples.slice(0, 4));
  }
  function scope(text, forced) {
    const found = forced ? { account: forced } : accountScope(text);
    if (found?.ambiguous) {
      pendingScope = text;
      return { reply: result("Birden fazla hesap eşleşti. Hangi hesapla devam edeyim?", found.ambiguous.map(api.accountName)) };
    }
    if (found?.missing) return { reply: result("Eşleşen hesabı bulamadım. Kayıtlı adını veya kartın son dört hanesini yazabilirsin.") };
    return { account: found?.account || null };
  }
  function records(text, period, account, type, category) {
    const method = queryInfo(text).paymentMethod;
    const accounts = getState().accounts;
    return getState().transactions.filter(row => inPeriod(row.date, period)
      && (!type || row.type === type)
      && (!account || [row.paymentAccountId, row.transferAccountId].some(id => String(id || "") === String(account.id)))
      && (!category || n(row.category) === n(category))
      && (!method || (row.paymentMethod || (row.type === "transfer" ? "transfer" : accounts.find(item => String(item.id) === String(row.paymentAccountId))?.type)) === method));
  }
  function periodError(period) { return period.invalid ? result("Bu tarih geçerli değil. Örneğin 01.10.2026–26.10.2026 gibi geçerli bir aralık yazar mısın?") : null; }
  function categories(text, forced, followup) {
    const normalized = n(text);
    const info = queryInfo(text);
    const selectedScope = followup ? { account: followup.account } : scope(text, forced);
    if (selectedScope.reply) return selectedScope.reply;
    const period = followup && !api.hasPeriod(text) ? followup.period : getPeriod(text);
    if (periodError(period)) return periodError(period);
    const type = followup?.type || (/\b(gelir\w*|kazanc\w*)\b/.test(normalized) && !/\bgider\w*\b/.test(normalized) ? "income" : /\btransfer\w*\b/.test(normalized) ? "transfer" : "expense");
    const asc = /\b(en az|en dusuk|en kucuk|azdan coga)\b/.test(normalized) ? true : /\b(en cok|en yuksek|en buyuk)\b/.test(normalized) ? false : followup?.asc || false;
    const count = getBudgetAssistantCount(text, n, followup?.count || 3);
    const rows = records(text, period, selectedScope.account, type, info.explicitCategory);
    const groups = new Map();
    const byTitle = /\b(kalem\w*|baslik\w*|isyeri\w*)\b/.test(normalized) && !/\bkategori\w*\b/.test(normalized);
    rows.forEach(row => {
      const label = (byTitle ? row.title : row.category) || "Belirtilmemiş";
      const data = groups.get(label) || { amount: 0, count: 0 };
      data.amount += value(row.amount); data.count++; groups.set(label, data);
    });
    const frequency = /\b(en sik|siklik)\b/.test(normalized);
    const ranked = [...groups].sort((a, b) => (a[1][frequency ? "count" : "amount"] - b[1][frequency ? "count" : "amount"]) * (asc ? 1 : -1) || a[0].localeCompare(b[0], "tr"));
    context = { kind: "categories", period, type, count, asc, account: selectedScope.account };
    const label = `${period.label}${selectedScope.account ? ` · ${api.accountName(selectedScope.account)}` : ""}`;
    if (!ranked.length) return result(`${label}: ${typeName(type)} kaydı bulunmuyor.`, ["Geçen ayın özeti", "Tüm zamanlarda en çok harcadığım 3 kategori"]);
    const total = sum(rows);
    const lines = [`${label} · ${frequency ? "En sık" : asc ? "En az" : "En çok"} ${typeName(type)} olan ${byTitle ? "başlıklar" : "kategoriler"}:`];
    ranked.slice(0, count).forEach(([name, data], index) => lines.push(`${index + 1}. ${name}: ${money(data.amount)} · %${total ? Math.round(data.amount / total * 100) : 0} · ${data.count} kayıt`));
    if (count > ranked.length) lines.push(`${count} yerine eşleşen ${ranked.length} ${byTitle ? "başlık" : "kategori"} gösterildi.`);
    if (asc) lines.push("Yalnızca bu dönemde kaydı olan kategoriler karşılaştırıldı; kaydı olmayanlar sıfır sayılmadı.");
    if (type === "transfer") lines.push("Transferler gelir/gider toplamına dahil değildir.");
    if (/\b(detay\w*|ayrinti\w*)\b/.test(normalized)) {
      const names = new Set(ranked.slice(0, count).map(([name]) => name));
      const detail = rows.filter(row => names.has((byTitle ? row.title : row.category) || "Belirtilmemiş")).sort((a, b) => String(b.date).localeCompare(String(a.date)));
      lines.push(`Seçilen ${byTitle ? "başlıklardaki" : "kategorilerdeki"} işlemler (${detail.length} kayıt):`);
      detail.slice(0, 14).forEach(row => lines.push(`• ${formatDate(row.date)} · ${row.title || row.category} · ${money(row.amount)}`));
      if (detail.length > 14) lines.push("İlk 14 işlem gösterildi; daha dar bir tarih veya kategori seçebilirsin.");
    }
    return result(lines.join("\n"));
  }
  function analytics(text, forced) {
    const normalized = n(text);
    const selectedScope = scope(text, forced); if (selectedScope.reply) return selectedScope.reply;
    const period = getPeriod(text); if (periodError(period)) return periodError(period);
    const info = queryInfo(text);
    const type = /\bgelir\w*\b/.test(normalized) && !/\bgider\w*\b/.test(normalized) ? "income" : /\btransfer\w*\b/.test(normalized) ? "transfer" : "expense";
    const rows = records(text, period, selectedScope.account, "", info.explicitCategory);
    const typed = rows.filter(row => row.type === type);
    const label = `${period.label}${info.explicitCategory ? ` · ${info.explicitCategory}` : ""}${selectedScope.account ? ` · ${api.accountName(selectedScope.account)}` : ""}`;
    if (/\b(karsilastir\w*|kiyas\w*|gore|artti|azaldi|degisim\w*|fark\w*)\b/.test(normalized)) {
      // Compare complete calendar months unless the user explicitly asks for equal elapsed days.
      const months = ["ocak", "subat", "mart", "nisan", "mayis", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik"];
      const named = [...normalized.matchAll(new RegExp(`\\b(${months.join("|")})(?:\\s+(20\\d{2}))?\\b`, "g"))];
      let first, second;
      if (named.length === 2) { first = getPeriod(`${named[1][1]} ${named[1][2] || api.today().slice(0, 4)}`); second = getPeriod(`${named[0][1]} ${named[0][2] || api.today().slice(0, 4)}`); }
      else if (named.length > 2 || /\b(hafta|yil|sene|gun|son \d+)\b/.test(normalized)) return result("Karşılaştırmada hangi iki dönemi kullanayım? Örneğin: “Eylül 2026 ile Ekim 2026 giderlerini karşılaştır”.", ["Bu ay geçen ay giderlerini karşılaştır", "Bu ay geçen ay gelirlerini karşılaştır"]);
      else { first = getPeriod("Bu ay"); second = getPeriod("Geçen ay"); }
      if (/\b(ayni gun|bugune kadar|esit gun)\w*\b/.test(normalized)) {
        const day = Number(api.today().slice(8)); first.endDate = api.today();
        second.endDate = `${second.startDate.slice(0, 8)}${String(Math.min(day, Number(second.endDate.slice(8)))).padStart(2, "0")}`;
      }
      const a = records(text, first, selectedScope.account, type, info.explicitCategory), b = records(text, second, selectedScope.account, type, info.explicitCategory);
      const now = sum(a), before = sum(b), delta = now - before;
      if (!a.length && !b.length) return result("İki dönemde de bu isteğe uyan kayıt yok; değişim hesaplayamıyorum.");
      const change = before ? `%${Math.abs(delta / before * 100).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} ${delta >= 0 ? "artış" : "azalış"}` : "önceki dönem sıfır olduğundan yüzde değişim hesaplanamaz";
      return result([`${info.explicitCategory || typeName(type)} karşılaştırması${selectedScope.account ? ` · ${api.accountName(selectedScope.account)}` : ""}`, `${second.label}: ${money(before)} · ${b.length} kayıt`, `${first.label}: ${money(now)} · ${a.length} kayıt`, `Fark: ${delta >= 0 ? "+" : "−"}${money(Math.abs(delta))} · ${change}.`, `Aralıklar: ${formatDate(second.startDate)}–${formatDate(second.endDate)} / ${formatDate(first.startDate)}–${formatDate(first.endDate)}.`, "Kayıtlı tutarlar karşılaştırılır; eksik kayıtlar ve geleceğe girilmiş işlemler sonucu etkileyebilir."].join("\n"));
    }
    if (/\b(tasarruf\w*|biriktir\w*|elde kalan|cebe kalan)\b/.test(normalized)) {
      const income = sum(rows.filter(row => row.type === "income")), expense = sum(rows.filter(row => row.type === "expense")), net = income - expense;
      return result(`${label}\nGelir: ${money(income)} · Gider: ${money(expense)}\nNet: ${money(net)}\n${income > 0 ? `Tasarruf oranı: %${(net / income * 100).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}.` : "Pozitif gelir olmadığı için tasarruf oranı hesaplanamaz."}\nTransferler dahil değil. Bu dönem neti, toplam birikim/varlık bakiyesiyle aynı şey değildir.`);
    }
    if (!typed.length) return result(`${label}: ${typeName(type)} kaydı bulunmuyor; ortalama veya sıralama hesaplayamıyorum.`);
    const amount = sum(typed);
    if (/\b(ortalama|gunluk|islem basi)\w*\b/.test(normalized)) {
      if (!/\b(gunluk|gun basi|gun basina|gun ortalama)\b/.test(normalized)) return result(`${label}: ${typed.length} ${typeName(type)} kaydı, toplam ${money(amount)}.\nİşlem başına ortalama: ${money(amount / typed.length)}.`);
      const dates = typed.map(row => row.date).sort();
      const start = period.allTime ? dates[0] : period.startDate;
      const end = period.allTime ? dates.at(-1) : period.endDate > api.today() && period.startDate <= api.today() ? api.today() : period.endDate;
      const days = Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1);
      const included = typed.filter(row => row.date >= start && row.date <= end);
      return result(`${label} · ${formatDate(start)}–${formatDate(end)}\n${days} takvim gününde ${included.length} kayıt, toplam ${money(sum(included))}.\nGünlük ortalama ${typeName(type)}: ${money(sum(included) / days)}.\nKayıtsız günler de bölenin içindedir; devam eden dönemde yalnızca bugüne kadar hesaplandı.`);
    }
    const byDay = new Map(); typed.forEach(row => byDay.set(row.date, (byDay.get(row.date) || 0) + value(row.amount)));
    const asc = /\b(en az|en dusuk)\b/.test(normalized);
    const ranked = [...byDay].sort((a, b) => (a[1] - b[1]) * (asc ? 1 : -1) || a[0].localeCompare(b[0]));
    return result([`${label} · ${asc ? "En az" : "En çok"} ${typeName(type)} olan günler:`, ...ranked.slice(0, getBudgetAssistantCount(text, n, 3)).map(([day, total], index) => `${index + 1}. ${formatDate(day)}: ${money(total)}`), "Yalnızca bu türde kaydı olan günler sıralandı."].join("\n"));
  }
  function debtReport(text) {
    const normalized = n(text), kind = /\balacak\w*\b/.test(normalized) ? "receivable" : "debt";
    const paidQuestion = /\b(odenen|odedim|tahsil ettim|tahsil edilen|kapanan|kapali|tamamlanan)\b/.test(normalized);
    let rows = getState().debts.filter(row => row.kind === kind);
    const named = rows.filter(row => n(row.person).length > 1 && new RegExp(`\\b${n(row.person)}(?:a|e|ya|ye|dan|den|nin|in|un)?\\b`).test(normalized));
    const generic = new Set("ben benim ne kadar kac var mi kime kimden kimlere kimlerin icin ve ile e a ya ye kalan kalanlar toplam tum butun genel acik kapali kapanan tamamlanan henuz mevcut daha en cok az yuksek buyuk dusuk kucuk vadesi gecen gecmis gelen dolan yakin gelecek onumuzdeki onceki bu ay ayki ayin gun bugun dun yil seneki yilinda neler nelerdir hangi hangileri listele goster getir kontrol et takibi takip ozet borcluyum odenen odedigim odedim odeme yaptim yaptigim ettim edilen tahsil ettigim alacaklarim borclarim ocak subat mart nisan mayis haziran temmuz agustos eylul ekim kasim aralik".split(" "));
    const personTokens = normalized.split(" ").filter(token => token.length > 2 && !/^\d+$/.test(token) && !generic.has(token) && !/^(borc|alacak|odeme|tahsil|kapat|gecik|tutar|vade|islem|kayit|kalan|kac|ode)/.test(token));
    if (!named.length && personTokens.length) return result("Bu kişi veya kurum adıyla eşleşen takip kaydı bulamadım. Kayıtlı adını tam yazar mısın? Toplam borcunu bu kişiye aitmiş gibi göstermeyeceğim.");
    if (named.length) rows = named;
    rows = rows.filter(row => paidQuestion ? true : value(row.amount) > 0);
    if (/\b(kapanan|kapali|tamamlanan)\b/.test(normalized)) rows = rows.filter(row => value(row.amount) <= 0);
    if (/\b(gecik\w*|vadesi gec\w*|vadesi dol\w*)\b/.test(normalized)) rows = rows.filter(row => row.dueDate && row.dueDate < api.today() && value(row.amount) > 0);
    else if (api.hasPeriod(text)) { const period = getPeriod(text); if (periodError(period)) return periodError(period); rows = rows.filter(row => inPeriod(row.dueDate, period)); }
    rows.sort((a, b) => /\b(en cok|en yuksek|en buyuk)\b/.test(normalized) ? value(b.amount) - value(a.amount) : String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")));
    if (!rows.length) return result(`İsteğine uyan ${kind === "debt" ? "borç" : "alacak"} takip kaydı yok. Vade belirtilen sorular işlem tarihine değil, takip kaydının vadesine göre süzülür.`);
    const paid = rows.reduce((total, row) => total + sum(row.payments || []), 0);
    const lines = [`${kind === "debt" ? "Borç" : "Alacak"} takibi: ${rows.length} kayıt · kalan ${money(sum(rows))}.`, `Bu takip kayıtlarında ${kind === "debt" ? "ödenen" : "tahsil edilen"}: ${money(paid)}.`];
    rows.slice(0, getBudgetAssistantCount(text, n, 12)).forEach(row => lines.push(`• ${row.person}: ${money(row.amount)} kalan${row.dueDate ? ` · Vade ${formatDate(row.dueDate)}${row.dueDate < api.today() && value(row.amount) > 0 ? " · Vadesi geçmiş" : ""}` : " · Vade girilmemiş"}${row.manualClosed ? " · Elle kapatılmış" : ""}`));
    if (rows.length > 12) lines.push("Daha çok satır için istediğin adedi belirtebilirsin.");
    lines.push("Kredi kartı borcu bu takip toplamından ayrıdır; taksit listesiyle toplayarak mükerrer sayma.");
    return result(lines.join("\n"));
  }
  function accounts(text) {
    const normalized = n(text);
    let rows = getState().accounts;
    const credit = /\b(kredi kart\w*|kart borc\w*|kartlar\w*|limit\w*)\b/.test(normalized);
    const bank = /\b(banka\w*)\b/.test(normalized), cash = /\b(nakit|cuzdan\w*)\b/.test(normalized);
    if (credit) rows = rows.filter(row => row.type === "credit_card");
    else if (bank) rows = rows.filter(row => row.type === "bank_account");
    else if (cash) rows = rows.filter(row => row.type === "cash");
    if (!rows.length) return result("Bu türde kayıtlı kart/hesap bulunmuyor.");
    const banks = rows.filter(row => row.type !== "credit_card"), cards = rows.filter(row => row.type === "credit_card");
    const lines = [`${rows.length} kayıtlı kart/hesap:`];
    if (api.hasPeriod(text)) lines.push("Bakiye ve kart borçları güncel kayıtlı değerlerdir; geçmiş tarihli bakiye anlık görüntüsü bulunmuyor. Dönem hareketlerini ayrıca sorabilirsin.");
    rows.slice(0, getBudgetAssistantCount(text, n, 20)).forEach(row => lines.push(`• ${api.accountName(row)}: ${row.type === "credit_card" ? `${money(row.debt)} toplam borç${value(row.limit) > 0 ? ` · ${money(Math.max(0, value(row.limit) - value(row.debt)))} kullanılabilir limit` : ""}` : `${money(row.balance)} bakiye`}`));
    if (banks.length) lines.push(`Nakit/banka bakiye toplamı: ${money(banks.reduce((total, row) => total + value(row.balance), 0))}.`);
    if (cards.length) lines.push(`Toplam kredi kartı borcu: ${money(cards.reduce((total, row) => total + value(row.debt), 0))}. Dönem borcu ile aynı şey olmayabilir.`);
    return result(lines.join("\n"));
  }
  function bes(text) {
    const normalized = n(text), all = getState().bes;
    if (api.hasPeriod(text)) return result("Geçmiş tarihli BES anlık görüntüsü yok; sözleşmedeki güncel değerlerden geçmiş ayın bakiyesini çıkaramam. “BES toplamım ne?” diye güncel kayıtlı değerini sorabilirsin.");
    const named = all.filter(row => n(row.provider).length > 2 && normalized.includes(n(row.provider)));
    const generic = new Set("bes bireysel emeklilik benim ne kadar kac toplam toplamim toplami birikim birikimim kendi katki katkim katkisi devlet fon getirisi getirilerim getirileri getiriler getirimi getiri getirisim gain ana para anapara neydi var mi sozlesmelerim sozlesme hesaplarim hesaplar tutar tutari".split(" "));
    const providerTokens = normalized.split(" ").filter(token => token.length > 2 && !generic.has(token) && !/^\d+$/.test(token));
    if (!named.length && providerTokens.length) return result("Bu şirket adıyla eşleşen BES sözleşmesi bulamadım. Şirket adını kayıtlı olduğu gibi yazabilir veya “BES toplamım ne?” diye tüm sözleşmeleri sorabilirsin.");
    const rows = named.length ? named : all;
    if (!rows.length) return result("Kayıtlı BES sözleşmen bulunmuyor.");
    let field = "total", label = "BES toplamı";
    if (/devlet katkisi getir|devlet getir/.test(normalized)) { field = "stateGain"; label = "Devlet katkısı getirisi"; }
    else if (/devlet katk/.test(normalized)) { field = "stateContribution"; label = "Devlet katkısı"; }
    else if (/fon getir/.test(normalized)) { field = "gain"; label = "Fon getirisi"; }
    else if (/kendi birik|kendi katk|ana para|anapara/.test(normalized)) { field = "contribution"; label = "Kendi birikimin"; }
    else if (/getiri|kazanc|kar/.test(normalized)) { field = "gains"; label = "BES getirileri"; }
    const amount = row => field === "total" ? api.besTotal(row) : field === "gains" ? value(row.gain) + value(row.stateGain) : value(row[field]);
    return result([`${label}: ${money(rows.reduce((total, row) => total + amount(row), 0))} · ${rows.length} sözleşme.`, ...rows.map(row => `• ${row.provider}: ${money(amount(row))}${field === "total" ? ` (kendi birikimin ${money(row.contribution)}, devlet katkısı ${money(row.stateContribution)}, devlet getirisi ${money(row.stateGain)}, fon getirisi ${money(row.gain)})` : ""}`), "Sözleşmelere girdiğin değerler kullanıldı; negatif getiriler korunur."].join("\n"));
  }
  function recordChecks(text, forced) {
    const normalized = n(text), info = queryInfo(text);
    const selected = scope(text, forced); if (selected.reply) return selected.reply;
    const future = /\b(gelecek tarihli|ileri tarihli|gelecege)\b/.test(normalized);
    const period = future && !api.hasPeriod(text) ? { allTime: true, label: "Tüm kayıtlar" } : getPeriod(text);
    if (periodError(period)) return periodError(period);
    let rows = records(text, period, selected.account, info.type, info.explicitCategory);
    if (future) {
      rows = rows.filter(row => row.date > api.today()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
      return result([`${period.label}: geleceğe girilmiş ${rows.length} işlem var. Bunlar gerçekleştiği doğrulanmış işlem anlamına gelmez.`, ...rows.slice(0, getBudgetAssistantCount(text, n, 10)).map(row => `• ${formatDate(row.date)} · ${row.title || row.category} · ${money(row.amount)}`)].join("\n"));
    }
    if (/\b(mukerrer\w*|cift kayit|ayni kayit|tekrar ekle\w*)\b/.test(normalized)) {
      const groups = new Map();
      rows.forEach(row => {
        const key = JSON.stringify([row.date, row.type, Math.round(value(row.amount) * 100), n(row.title), n(row.category), row.paymentMethod || "", row.paymentAccountId || "", row.transferAccountId || ""]);
        if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row);
      });
      const duplicates = [...groups.values()].filter(group => group.length > 1);
      return result([`${period.label}: ${duplicates.length} olası mükerrer grup.`, ...duplicates.slice(0, 20).map(group => `• ${formatDate(group[0].date)} · ${group[0].title || group[0].category || "Başlıksız"} · ${money(group[0].amount)} · ${group.length} eşleşen kayıt`), "Tarih, tür, tutar, başlık, kategori ve hesapları aynı olan kayıtlar adaydır. Aynı gün aynı tutarda gerçek iki alışveriş olabilir. Hiçbir kayıt silinmedi."].join("\n"));
    }
    if (/\b(eksik bilgi\w*|eksik alan\w*|kategorisiz|basliksiz)\b/.test(normalized)) {
      const incomplete = rows.filter(row => !row.title || !row.category || !row.date || !value(row.amount));
      return result([`${period.label}: başlık/kategori/tarih/tutar alanlarında eksik görünen ${incomplete.length} kayıt.`, ...incomplete.slice(0, 14).map(row => `• ${row.date ? formatDate(row.date) : "Tarih yok"} · ${row.title || "Başlık yok"} · ${row.category || "Kategori yok"} · ${money(row.amount)}`), "Sadece kontrol ettim; alanları tahmin ederek doldurmadım. Hesap gerektirmeyen ödeme türlerinde hesap boşluğu tek başına hata sayılmadı."].join("\n"));
    }
    if (/\b(harcamasiz|harcama yapmad\w*|gider yapmad\w*|hic harcama)\b/.test(normalized)) {
      const dates = rows.map(row => row.date).filter(Boolean).sort();
      const start = period.allTime ? dates[0] : period.startDate;
      const end = period.allTime ? dates.at(-1) : period.endDate < api.today() ? period.endDate : api.today();
      if (!start || !end || start > end) return result("Geçmiş veya bugüne kadar olan bir tarih aralığı belirtmelisin; gelecekteki günleri harcamasız sayamam.");
      const days = Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1;
      if (days > 366) return result("Harcamasız günler için en fazla bir yıllık aralık seçebilir misin? Örneğin “Bu ay harcama yapmadığım günler”.");
      const spent = new Set(rows.filter(row => row.type === "expense").map(row => row.date));
      const empty = [];
      for (let day = Date.parse(start); day <= Date.parse(end); day += 86400000) { const date = new Date(day).toISOString().slice(0, 10); if (!spent.has(date)) empty.push(date); }
      return result([`${formatDate(start)}–${formatDate(end)}: gider kaydı olmayan ${empty.length} gün.`, ...empty.slice(0, getBudgetAssistantCount(text, n, 14)).map(date => `• ${formatDate(date)}`), "Kaydın olmaması gerçekten hiç harcama yapılmadığını kanıtlamaz. Gelecek günler dahil edilmedi."].join("\n"));
    }
    if (/\b(odeme yontem\w*|odeme sekl\w*|nasil odemis\w*)\b/.test(normalized)) {
      const groups = new Map(), labels = { cash: "Nakit", credit_card: "Kredi kartı", bank_account: "Banka hesabı / kartı", transfer: "Havale / EFT", other: "Diğer" };
      rows.filter(row => row.type === "expense").forEach(row => { const method = row.paymentMethod || getState().accounts.find(item => item.id === row.paymentAccountId)?.type || "other"; groups.set(method, (groups.get(method) || 0) + value(row.amount)); });
      return result([`${period.label} · Giderlerin ödeme yöntemlerine göre:`, ...[...groups].sort((a, b) => b[1] - a[1]).map(([method, amount]) => `• ${labels[method] || method}: ${money(amount)}`), groups.size ? "Gelir ve transferler bu dağılıma dahil değil." : "Gider kaydı bulunmuyor."].join("\n"));
    }
    const income = rows.filter(row => row.type === "income"), expense = rows.filter(row => row.type === "expense"), transfers = rows.filter(row => row.type === "transfer");
    return result(`${period.label}: ${rows.length} ${typeName(info.type)} kaydı.\nGelir: ${money(sum(income))} · ${income.length} kayıt\nGider: ${money(sum(expense))} · ${expense.length} kayıt\nTransfer: ${money(sum(transfers))} · ${transfers.length} kayıt (nete dahil değil)\nNet: ${money(sum(income) - sum(expense))}.`);
  }
  function respond(text, forced = null) {
    const normalized = n(text);
    if (/\b(ekle|kaydet|olustur|kayit gir|islem gir)\b/.test(normalized) && !/\b(nasil|nereden)\b/.test(normalized)) return null;
    const guide = help(text); if (guide) { context = null; pendingScope = null; return guide; }
    if (pendingScope && !/\b(harcama|kategori|gelir|gider|karsilastir)\w*\b/.test(normalized)) {
      const selected = accountScope(text)?.account;
      if (selected) { const original = pendingScope; pendingScope = null; return respond(original, selected); }
    } else pendingScope = null;
    if (/\b(mukerrer\w*|cift kayit|ayni kayit|tekrar ekle\w*|eksik bilgi\w*|eksik alan\w*|kategorisiz|basliksiz|harcamasiz|harcama yapmad\w*|gider yapmad\w*|hic harcama|odeme yontem\w*|odeme sekl\w*|nasil odemis\w*|gelecek tarihli|ileri tarihli|gelecege)\b/.test(normalized)
      || /\bkac\s+(?:adet |tane )?(?:kayit\w*|islem\w*|hareket\w*|gider\w*|gelir\w*|transfer\w*)\b/.test(normalized)) { context = null; return recordChecks(text, forced); }
    if (/\b(yatirim\w*|altin\w*|dolar\w*|portfoy)\b/.test(normalized) && /\b(kar\w*|zarar\w*|kazanc\w*|getiri\w*)\b/.test(normalized) && !/\bbes\b/.test(normalized)) return result("Varlıkların güncel değerini hesaplayabilirim; alış maliyeti ve işlem bazlı maliyet geçmişi olmadan yatırım kârını/zararını kesin hesaplayamam. Tahmini kârı gerçek veri gibi sunmayacağım.", ["Varlık portföyüm ne kadar?"]);
    if (/\b(bes|bireysel emeklilik|fon getir\w*|devlet katki\w*)\b/.test(normalized)
      && !/\bbes\s+(?:adet |tane )?(?:kategori|islem|kayit|kayd|hareket|harcama|gider|gelir|transfer|gun)\w*\b/.test(normalized)) { context = null; return bes(text); }
    const comparison = /\b(karsilastir\w*|kiyas\w*|artti|azaldi|degisim\w*|fark\w*)\b/.test(normalized) || /\bgore\b/.test(normalized) && /\b(gecen|onceki|ay)\b/.test(normalized);
    if (comparison || /\b(tasarruf\w*|biriktir\w*|ortalama\w*|gunluk|islem basi|elde kalan|cebe kalan)\b/.test(normalized)
      || /\b(en cok|en az|en yuksek|en dusuk)\b/.test(normalized) && /\b(gun|gunde|gunler|gunleri)\b/.test(normalized) && !/\bson \d+ gun\b/.test(normalized)) { context = null; return analytics(text, forced); }
    const categoryRanking = /\b(kategori\w*|dagilim\w*|kalem\w*|baslik\w*)\b/.test(normalized)
      && (!queryInfo(text).explicitCategory || ["transfer", "gelir", "gider"].includes(n(queryInfo(text).explicitCategory))) && !/\b(nasil|ekle|duzenle|sil)\b/.test(normalized);
    if (categoryRanking) return categories(text, forced);
    if (context?.kind === "categories" && /^(?:peki |ya |bir de )?(?:gecen ay|bu ay|bugun|dun|ilk \w+(?: \w+)?|en az olanlar|en cok olanlar|hepsini)(?: icin| da| de| goster)?$/.test(normalized)) return categories(text, forced, context);
    if (/\b(borc\w*|alacak\w*|kime borcluyum|kimden alacagim)\b/.test(normalized) && !/\b(kart\w*|kredi|taksit\w*)\b/.test(normalized)) { context = null; return debtReport(text); }
    const asksAccounts = /\b(hesaplar\w*|kartlar\w*|bakiyeler\w*|banka bakiy\w*|nakit bakiye\w*|toplam kredi kart\w*|toplam kart borc\w*)\b/.test(normalized)
      || /\b(hangi hesap|hangi banka|nerede param|nerede para|ne kadar nakit)\b/.test(normalized);
    if (asksAccounts && !/\b(harc\w*|islem\w*|kayit\w*|hareket\w*|transfer\w*|ekle)\b/.test(normalized)) { context = null; return accounts(text); }
    if (/\b(varlik\w*|portfoy|altin\w*|gumus\w*|dolar\w*|euro\w*|sterlin\w*|bitcoin\w*|ethereum\w*|platin\w*)\b/.test(normalized)) { context = null; return result(`${api.assetsReport(text)}\nUygulamadaki son kayıtlı fiyatlar kullanıldı; fiyat yenilemesi başarısızsa güncel piyasa değeri olmayabilir.`); }
    return null;
  }
  return { respond, reset() { context = null; pendingScope = null; } };
}
