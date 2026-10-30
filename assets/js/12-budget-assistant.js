// Akis Butce Asistani: hareketleri cihazdaki uygulama verisinden yorumlar.
(() => {
  const recognitionType = window.SpeechRecognition || window.webkitSpeechRecognition;
  let pendingEntry = null;
  let pendingEntryStep = "";
  let pendingFinanceQuestion = null;
  let pendingTopicChange = null;
  let lastReportQuestion = "";
  let awaitingReportContinue = false;
  let awaitingNextEntry = false;
  let lastCategoryReport = null;
  let latestSpokenReply = "";
  let assistantSpeaking = false;
  let assistantScrollY = null;
  let assistantViewportHeight = 0;
  let assistantScrollFrame = null;
  let assistantCloseTimer = null;
  const mascotSource = "assets/images/budget-assistant-mascot.png";
  const assistantQuickPrompts = [
    "Bu ayın özeti", "En çok hangi kategoriye harcadım?", "Gider ekle", "Gelir ekle",
    "Transfer ekle", "Bu ay geçen ay giderlerini karşılaştır", "Ne sorabilirim?", "Yakın taksitlerim neler?",
  ];

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "budget-assistant-launcher";
  launcher.setAttribute("aria-label", "Akış Bütçe Asistanını aç");
  launcher.setAttribute("aria-expanded", "false");
  launcher.title = "Sürükleyerek taşı; açmak için dokun";
  launcher.innerHTML = `<img src="${mascotSource}" alt="" />`;

  const panel = document.createElement("section");
  panel.className = "budget-assistant-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "budgetAssistantTitle");
  panel.innerHTML = `
    <header class="budget-assistant-header">
      <span class="budget-assistant-avatar"><img src="${mascotSource}" alt="" /></span>
      <span class="budget-assistant-heading"><strong id="budgetAssistantTitle">Akış Bütçe Asistanı</strong><small>Hareketlerine göre yanıtlar</small></span>
      <button type="button" class="budget-assistant-icon-button" data-assistant-speak aria-label="Son yanıtı seslendir" title="Son yanıtı seslendir"><i data-lucide="volume-2" aria-hidden="true"></i></button>
      <button type="button" class="budget-assistant-icon-button" data-assistant-close aria-label="Asistanı kapat" title="Kapat"><i data-lucide="x" aria-hidden="true"></i></button>
    </header>
    <div class="budget-assistant-messages" data-assistant-messages aria-live="polite" aria-relevant="additions text"></div>
    <p class="budget-assistant-status" data-assistant-status role="status"></p>
    <div class="budget-assistant-voice-preview" data-assistant-voice-preview hidden><p data-assistant-transcript></p><button type="button" class="budget-assistant-icon-button" data-assistant-cancel-voice aria-label="Sesli mesajı iptal et" title="Sesli mesajı iptal et"><i data-lucide="x" aria-hidden="true"></i></button></div>
    <form class="budget-assistant-composer" data-assistant-form>
      <textarea data-assistant-input rows="1" maxlength="240" aria-label="Asistana mesaj yaz" placeholder="Mesajını yaz…"></textarea>
      <button type="button" class="budget-assistant-icon-button budget-assistant-mic" data-assistant-mic aria-label="Sesli mesaj: basılı tut veya dokunarak başlat" aria-pressed="false" title="Sesli mesaj: basılı tut veya dokunarak başlat"><i data-lucide="mic" aria-hidden="true"></i></button>
      <button type="submit" class="budget-assistant-send" aria-label="Mesajı gönder" title="Gönder"><i data-lucide="send" aria-hidden="true"></i></button>
    </form>
    <p class="budget-assistant-privacy">Sesli giriş tarayıcı desteği ve mikrofon iznine bağlıdır. Kayıtlar, onayınızla uygulamanın mevcut kayıt akışına eklenir.</p>`;

  document.body.append(launcher, panel);

  const messageList = panel.querySelector("[data-assistant-messages]");
  const input = panel.querySelector("[data-assistant-input]");
  const status = panel.querySelector("[data-assistant-status]");
  const micButton = panel.querySelector("[data-assistant-mic]");
  const speakButton = panel.querySelector("[data-assistant-speak]");
  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const insights = createBudgetAssistantInsights({
    normalize, money: formatMoney, formatDate, today: getTurkeyTodayISO,
    getState: () => ({ transactions, accounts: paymentAccounts, debts: borcAlacakKayitlari, bes: besAccounts }),
    getPeriod: getAssistantPeriod, hasPeriod: hasExplicitPeriod, inPeriod: isInAssistantPeriod,
    queryInfo: getAssistantRecordQueryInfo, accountScope: getAssistantAccountScope,
    accountName: formatPaymentAccountName, besTotal: getBesAccountTotal, assetsReport: getAssistantAssetReport,
  });

  function respondWithInsights(text) {
    const reply = insights.respond(text);
    if (!reply) return false;
    pendingFinanceQuestion = null;
    rememberReportQuestion(text);
    appendMessage(reply.text);
    if (reply.prompts.length) addPromptButtons(reply.prompts);
    return true;
  }

  function isAssistantReportIntent(text) {
    return /\b(ozet\w*|en cok|en az|en yuksek|en dusuk|en buyuk|en kucuk|ne kadar|ne|hangi|nerede|neyi|neye|neler|kategori\w*|analiz|karsilastir\w*|borc\w*|alacak\w*|taksit\w*|varlik\w*|portfoy|bes|emeklilik|kart\w*|hesap\w*|bakiye\w*|yatirim\w*)\b/.test(normalize(text));
  }

  function isIndependentReportQuestion(text) {
    const normalized = normalize(text);
    const asksQuestion = /[?？]/.test(String(text || "")) || /\b(ne|neler|hangi|ne kadar|en cok|en az|en yuksek|en dusuk|en buyuk|en kucuk|ozet|var mi|detay|goster|listele|kontrol et|incele|hesapla|toplam\w*)\b/.test(normalized);
    const namesFinancialArea = /\b(birikim\w*|kategori\w*|harcama\w*|gider\w*|gelir\w*|borc\w*|alacak\w*|taksit\w*|varlik\w*|portfoy|bes|emeklilik|kart\w*|hesap\w*|bakiye\w*|yatirim\w*|islem\w*|kayit\w*|mukerrer\w*|tasarruf\w*|ortalama\w*)\b/.test(normalized);
    return asksQuestion && namesFinancialArea;
  }

  function hasExplicitEntryAction(text) {
    return /\b(ekle|kaydet|olustur|islem gir|kayit gir)\b/.test(normalize(text));
  }

  function getAssistantAccountScope(text) {
    const normalized = normalize(text);
    const genericTokens = new Set(["kredi", "kart", "karti", "banka", "bankasi", "hesap", "hesabi"]);
    const accounts = Array.isArray(paymentAccounts) ? paymentAccounts : [];
    if (/\b(?:tum|butun)\s+(?:kredi\s+)?(?:kart\w*|hesap\w*)\b|\b(?:kartlarim\w*|hesaplarim\w*)\b/.test(normalized)) return null;
    const lastFour = normalized.match(/\b\d{4}\b/g) || [];
    const byDigits = accounts.filter(account => lastFour.includes(String(account.last4 || account.lastFour || "")));
    if (byDigits.length === 1) return { account: byDigits[0] };
    if (byDigits.length > 1) return { ambiguous: byDigits };
    const shortNames = new Set(accounts.flatMap((account) => normalize(account.name).split(" ")).filter((token) => token.length > 0 && token.length <= 2));
    const queryTokens = normalized.split(" ").filter((token) => (token.length >= 3 || shortNames.has(token)) && !genericTokens.has(token));
    const candidates = accounts.map((account) => {
      const shortAccountTokens = new Set(normalize(account.name).split(" ").filter((token) => token.length > 0 && token.length <= 2));
      const accountTokens = [account.name, account.bank]
        .flatMap((value) => normalize(value).split(" "))
        .filter((token) => (token.length >= 3 || shortAccountTokens.has(token)) && !genericTokens.has(token));
      const matched = new Set();
      accountTokens.forEach((accountToken) => {
        if (queryTokens.some((queryToken) => queryToken === accountToken || (queryToken.startsWith(accountToken) && queryToken.length - accountToken.length <= 3))) {
          matched.add(accountToken);
        }
      });
      return { account, score: matched.size };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);

    if (candidates.length) {
      const bestScore = candidates[0].score;
      const best = candidates.filter((item) => item.score === bestScore).map((item) => item.account);
      if (best.length === 1) return { account: best[0] };
      return { ambiguous: best };
    }

    const asksForCreditCard = /\bkredi karti\w*/.test(normalized);
    if (asksForCreditCard) {
      const cards = accounts.filter((account) => account.type === "credit_card");
      if (cards.length === 1) return { account: cards[0] };
      if (cards.length > 1) return { ambiguous: cards };
    }

    if (/\b(kart\w*|hesap\w*)\b/.test(normalized)) return { missing: true };
    return null;
  }

  function setStatus(message = "") {
    if (status.textContent !== message) status.textContent = message;
    status.hidden = !message;
  }

  function scrollMessagesToEnd() {
    if (assistantScrollFrame !== null) return;
    assistantScrollFrame = requestAnimationFrame(() => {
      assistantScrollFrame = null;
      messageList.scrollTop = messageList.scrollHeight;
    });
  }

  function resizeAssistantInput() {
    input.style.height = "44px";
    input.style.height = `${Math.min(112, Math.max(44, input.scrollHeight))}px`;
  }

  function appendMessage(text, role = "assistant") {
    if (role === "assistant" && assistantSpeaking) stopAssistantSpeech();
    const bubble = document.createElement("article");
    bubble.className = `budget-assistant-message is-${role}`;
    if (role === "assistant") {
      const avatar = document.createElement("span");
      avatar.className = "budget-assistant-message-avatar";
      avatar.innerHTML = `<img src="${mascotSource}" alt="" />`;
      bubble.append(avatar);
    }
    const copy = document.createElement("p");
    copy.textContent = text;
    bubble.append(copy);
    messageList.append(bubble);
    scrollMessagesToEnd();
    if (role === "assistant") latestSpokenReply = text;
    return bubble;
  }

  function addPromptButtons(prompts) {
    const group = document.createElement("div");
    group.className = "budget-assistant-prompts";
    prompts.forEach((prompt) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "budget-assistant-prompt";
      button.textContent = prompt;
      button.addEventListener("click", () => sendAssistantInput(prompt));
      group.append(button);
    });
    messageList.append(group);
    scrollMessagesToEnd();
  }

  function formatMoney(amount) {
    return currency.format(Number(amount || 0));
  }

  function numberToTurkishWords(value) {
    const ones = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
    const tens = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
    const scales = ["", "bin", "milyon", "milyar", "trilyon"];
    let number = Math.floor(Math.abs(Number(value) || 0));
    if (number === 0) return ones[0];
    if (number >= 1e15) return String(number);

    const groups = [];
    while (number > 0) {
      groups.push(number % 1000);
      number = Math.floor(number / 1000);
    }
    const words = [];
    for (let index = groups.length - 1; index >= 0; index -= 1) {
      const group = groups[index];
      if (!group) continue;
      const hundreds = Math.floor(group / 100);
      const remainder = group % 100;
      const parts = [];
      if (hundreds) parts.push(hundreds === 1 ? "yüz" : `${ones[hundreds]} yüz`);
      if (remainder >= 10) parts.push(tens[Math.floor(remainder / 10)]);
      if (remainder % 10) parts.push(ones[remainder % 10]);
      const groupWords = parts.join(" ");
      words.push(index === 1 && group === 1 ? "bin" : `${groupWords}${scales[index] ? ` ${scales[index]}` : ""}`);
    }
    return words.join(" ");
  }

  function parseLocalizedNumber(value) {
    const raw = String(value || "").replace(/\s/g, "");
    if (raw.includes(",")) {
      const [whole, fraction = ""] = raw.split(",", 2);
      return { whole: Number(whole.replace(/[.']/g, "")) || 0, fraction: fraction.replace(/\D/g, "") };
    }
    const pieces = raw.split(".");
    if (pieces.length > 1 && pieces[pieces.length - 1].length === 3) {
      return { whole: Number(pieces.join("")) || 0, fraction: "" };
    }
    if (pieces.length > 1) {
      return { whole: Number(pieces.slice(0, -1).join("")) || 0, fraction: pieces[pieces.length - 1].replace(/\D/g, "") };
    }
    return { whole: Number(raw) || 0, fraction: "" };
  }

  function moneyToTurkishWords(value) {
    const negative = /^\s*-/.test(value);
    const numeric = value.replace(/₺|\b(?:tl|try|lira(?:s[ıi])?)\b/gi, "").replace(/\s/g, "").replace(/^-/, "");
    const parsed = parseLocalizedNumber(numeric);
    const kuruş = Number((parsed.fraction || "").slice(0, 2).padEnd(2, "0"));
    const parts = [`${numberToTurkishWords(parsed.whole)} Türk lirası`];
    if (kuruş) parts.push(`${numberToTurkishWords(kuruş)} kuruş`);
    return `${negative ? "eksi " : ""}${parts.join(" " )}`;
  }

  function decimalToTurkishWords(value) {
    const normalized = String(value).replace(",", ".");
    const [whole, fraction = ""] = normalized.split(".");
    return fraction
      ? `${numberToTurkishWords(whole)} virgül ${[...fraction].map((digit) => numberToTurkishWords(digit)).join(" ")}`
      : numberToTurkishWords(whole);
  }

  function ordinalToTurkishWords(value) {
    const ordinals = ["", "birinci", "ikinci", "üçüncü", "dördüncü", "beşinci", "altıncı", "yedinci", "sekizinci", "dokuzuncu", "onuncu", "on birinci", "on ikinci", "on üçüncü", "on dördüncü", "on beşinci", "on altıncı", "on yedinci", "on sekizinci", "on dokuzuncu", "yirminci"];
    return ordinals[Number(value)] || `${numberToTurkishWords(value)} sıradaki`;
  }

  function prepareAssistantSpeech(text) {
    const years = [];
    const protectYear = (year) => {
      years.push(year);
      return `YILKORUMA${years.length - 1}SON`;
    };
    const months = ["", "ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"];
    let spoken = String(text || "").replace(/\b(\d{1,2})[./-](\d{1,2})[./-]((?:19|20)\d{2})\b/g, (_, day, month, year) =>
      `${numberToTurkishWords(day)} ${months[Number(month)] || numberToTurkishWords(month)} ${protectYear(year)}`
    );
    spoken = spoken.replace(/\b(?:19|20)\d{2}\b/g, protectYear);
    spoken = spoken.replace(/-?₺\s*\d[\d.,]*|-?\d[\d.,]*\s*(?:TL|TRY|lira(?:s[ıi])?)\b/giu, (amount) => moneyToTurkishWords(amount));
    spoken = spoken.replace(/%\s*(-?\d[\d.,]*)|(-?\d[\d.,]*)\s*%/g, (_, before, after) => `yüzde ${decimalToTurkishWords(before || after)}`);
    spoken = spoken.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, hour, minute) => `${numberToTurkishWords(hour)} ${numberToTurkishWords(minute)}`);
    spoken = spoken.replace(/(^|\n)(\s*)(\d{1,2})\.\s+(?=\S)/g, (_, line, spacing, number) => `${line}${spacing}${ordinalToTurkishWords(number)}. `);
    spoken = spoken.replace(/\b\d[\d.,]*\b/g, (number) => {
      const parsed = parseLocalizedNumber(number);
      return parsed.fraction
        ? `${numberToTurkishWords(parsed.whole)} virgül ${[...parsed.fraction].map((digit) => numberToTurkishWords(digit)).join(" ")}`
        : numberToTurkishWords(parsed.whole);
    });
    return spoken.replace(/YILKORUMA(\d+)SON/g, (_, index) => years[Number(index)] || "");
  }

  function updateSpeakButton() {
    speakButton.setAttribute("aria-label", assistantSpeaking ? "Sesli okumayı durdur" : "Son yanıtı seslendir");
    speakButton.title = assistantSpeaking ? "Okumayı durdur" : "Son yanıtı seslendir";
    speakButton.innerHTML = `<i data-lucide="${assistantSpeaking ? "square" : "volume-2"}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
  }

  function stopAssistantSpeech() {
    speaker.cancel();
    assistantSpeaking = false;
    updateSpeakButton();
  }

  function getAssistantExplicitDatePeriod(text, today = getTurkeyTodayISO()) {
    const [year, currentMonth] = today.split("-").map(Number);
    const months = ["ocak", "subat", "mart", "nisan", "mayis", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik"];
    const dates = [];
    let invalid = false;
    const addDate = (day, month, requestedYear) => {
      const dateYear = requestedYear ? Number(requestedYear) : month > currentMonth ? year - 1 : year;
      const date = new Date(dateYear, month - 1, day, 12);
      if (date.getFullYear() !== dateYear || date.getMonth() !== month - 1 || date.getDate() !== day) { invalid = true; return; }
      dates.push(`${dateYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    };
    for (const match of String(text).matchAll(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b|\b(\d{1,2})[./](\d{1,2})(?:[./](20\d{2}))?\b/g)) {
      if (match[1]) addDate(Number(match[3]), Number(match[2]), match[1]);
      else addDate(Number(match[4]), Number(match[5]), match[6]);
    }
    const normalized = normalize(text);
    const shortRange = new RegExp(`\\b(\\d{1,2})\\s+(\\d{1,2})\\s+(${months.join("|")})(?:\\s+(20\\d{2}))?\\b`).exec(normalized);
    if (!dates.length && shortRange && /\d\s*[-–—]\s*\d/.test(String(text))) {
      const month = months.indexOf(shortRange[3]) + 1;
      addDate(Number(shortRange[1]), month, shortRange[4]);
      addDate(Number(shortRange[2]), month, shortRange[4]);
    } else {
      const pattern = new RegExp(`\\b(\\d{1,2})\\s+(${months.join("|")})(?:da|de|ta|te|daki|deki)?(?:\\s+(20\\d{2}))?\\b`, "g");
      for (const match of normalized.matchAll(pattern)) addDate(Number(match[1]), months.indexOf(match[2]) + 1, match[3]);
    }
    if (invalid) return { invalid: true, allTime: false, label: "Geçersiz tarih", key: "" };
    if (!dates.length) return null;
    dates.sort();
    const startDate = dates[0], endDate = dates[dates.length - 1];
    const label = (value) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
    return { allTime: false, key: startDate.slice(0, 7), startDate, endDate, label: startDate === endDate ? label(startDate) : `${label(startDate)} – ${label(endDate)}` };
  }

  function getAssistantPeriod(text) {
    const today = getTurkeyTodayISO();
    const [year, month] = today.split("-").map(Number);
    const normalized = normalize(text);
    const extended = getBudgetAssistantPeriodOverride(text, today, normalize);
    if (extended) return extended;
    const explicitDates = getAssistantExplicitDatePeriod(text, today);
    if (explicitDates) return explicitDates;
    const allTime = /\b(genel|tum zaman|tum kayit|bugune kadar|simdiye kadar|hepsinde)\b/.test(normalized);
    if (allTime) return { allTime: true, key: "", label: "Tüm kayıtlar" };

    const todayDate = new Date(`${today}T12:00:00`);
    const dateString = (date) => getTurkeyTodayISO(date);
    if (/\bbugun\b/.test(normalized)) return { allTime: false, key: today.slice(0, 7), startDate: today, endDate: today, label: "Bugün" };
    if (/\bdun\b/.test(normalized)) {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const date = dateString(yesterday);
      return { allTime: false, key: date.slice(0, 7), startDate: date, endDate: date, label: "Dün" };
    }
    const countWords = { bir: 1, iki: 2, uc: 3, dort: 4, bes: 5, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, onbes: 15, otuz: 30, doksan: 90 };
    const recent = /\b(son|gecen)\s+(\d{1,3}|bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on|onbes|otuz|doksan)\s*(gun(?:deki|de|dur)?|hafta(?:daki|da|dir)?|ay(?:daki|da|dir)?)\b/.exec(normalized);
    if (recent) {
      const count = Math.max(1, Number(recent[2]) || countWords[recent[2]] || 1);
      const unit = recent[3];
      const start = new Date(todayDate);
      const unitLabel = unit.startsWith("ay") ? "ay" : unit.startsWith("hafta") ? "hafta" : "gün";
      if (unitLabel === "ay") {
        const day = start.getDate();
        start.setDate(1);
        start.setMonth(start.getMonth() - count);
        start.setDate(Math.min(day, new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()));
      } else start.setDate(start.getDate() - count * (unitLabel === "hafta" ? 7 : 1) + 1);
      const startDate = dateString(start);
      const label = `Son ${count} ${unitLabel}`;
      return { allTime: false, key: "", startDate, endDate: today, label };
    }
    if (/\b(bu hafta|bu haftaki)\b/.test(normalized)) {
      const start = new Date(todayDate);
      const weekday = start.getDay() || 7;
      start.setDate(start.getDate() - weekday + 1);
      return { allTime: false, key: "", startDate: dateString(start), endDate: today, label: "Bu hafta" };
    }
    if (/\b(gecen hafta|onceki hafta)\b/.test(normalized)) {
      const end = new Date(todayDate);
      const weekday = end.getDay() || 7;
      end.setDate(end.getDate() - weekday);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      return { allTime: false, key: "", startDate: dateString(start), endDate: dateString(end), label: "Geçen hafta" };
    }
    if (/\b(bu yil|bu seneki)\b/.test(normalized)) {
      return { allTime: false, key: "", startDate: `${year}-01-01`, endDate: today, label: `${year} yılı` };
    }

    const monthNames = ["ocak", "subat", "mart", "nisan", "mayis", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik"];
    const exactDay = new RegExp(`\\b(\\d{1,2})\\s+(${monthNames.join("|")})(?:da|de|ta|te)?(?:\\s+(20\\d{2}))?\\b`).exec(normalized);
    if (exactDay) {
      const day = Number(exactDay[1]);
      const periodMonth = monthNames.indexOf(exactDay[2]) + 1;
      const periodYear = exactDay[3] ? Number(exactDay[3]) : periodMonth > month ? year - 1 : year;
      const date = new Date(periodYear, periodMonth - 1, day, 12);
      if (date.getFullYear() === periodYear && date.getMonth() === periodMonth - 1 && date.getDate() === day) {
        const dateISO = `${periodYear}-${String(periodMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const label = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(date);
        return { allTime: false, key: dateISO.slice(0, 7), startDate: dateISO, endDate: dateISO, label };
      }
    }

    let periodYear = year;
    let periodMonth = month;
    if (/\b(gecen ay\w*|onceki ay\w*)\b/.test(normalized)) {
      const previous = new Date(Date.UTC(year, month - 2, 1));
      periodYear = previous.getUTCFullYear();
      periodMonth = previous.getUTCMonth() + 1;
    } else {
      const monthIndex = monthNames.findIndex((name) => new RegExp(`\\b${name}(?:da|de|ta|te|daki|deki|taki|teki)?\\b`).test(normalized));
      if (monthIndex >= 0) {
        periodMonth = monthIndex + 1;
        const requestedYear = normalized.match(/\b(20\d{2})\b/);
        periodYear = requestedYear ? Number(requestedYear[1]) : (periodMonth > month ? year - 1 : year);
      }
    }
    const key = `${periodYear}-${String(periodMonth).padStart(2, "0")}`;
    const endDay = new Date(periodYear, periodMonth, 0).getDate();
    return {
      allTime: false,
      key,
      startDate: `${key}-01`,
      endDate: `${key}-${String(endDay).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date(periodYear, periodMonth - 1, 1, 12)),
    };
  }

  function isInAssistantPeriod(dateValue, period) {
    if (period.invalid) return false;
    if (period.allTime) return true;
    const date = String(dateValue || "").slice(0, 10);
    if (!date) return false;
    if (period.startDate && period.endDate) return date >= period.startDate && date <= period.endDate;
    return date.slice(0, 7) === period.key;
  }

  function getAssistantCategoryLimit(text) {
    return getBudgetAssistantCount(text, normalize, 3);
  }

  function getAssistantReport(text) {
    const period = getAssistantPeriod(text);
    const accountScope = getAssistantAccountScope(text);
    if (accountScope?.ambiguous) {
      const labels = accountScope.ambiguous.map((account) => [account.bank, account.name].filter(Boolean).join(" "));
      return `Birden fazla hesap eşleşti: ${labels.join(", ")}. Hangi kartı veya hesabı kastettiğini yazar mısın?`;
    }
    if (accountScope?.missing) return "Bu kart veya hesap için kayıtlarında eşleşen bir hesap bulamadım. Hesap adını ayarlardaki gibi yazıp tekrar deneyebilirsin.";

    const account = accountScope?.account || null;
    const accountLabel = account ? [account.bank, account.name].filter(Boolean).join(" ") : "";
    const periodRecords = (Array.isArray(transactions) ? transactions : []).filter((item) => isInAssistantPeriod(item.date, period));
    const records = account
      ? periodRecords.filter((item) => String(item.paymentAccountId || "") === String(account.id || "") || String(item.transferAccountId || "") === String(account.id || ""))
      : periodRecords;
    const totals = getTransactionTotals(records);
    const expenses = records.filter((item) => item.type === "expense");
    const transfers = records.filter((item) => item.type === "transfer");
    const transferAmount = transfers.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const categories = new Map();
    expenses.forEach((item) => {
      const category = String(item.category || "Kategorisiz");
      const entry = categories.get(category) || { amount: 0, count: 0 };
      entry.amount += Number(item.amount || 0);
      entry.count += 1;
      categories.set(category, entry);
    });
    const topCategories = [...categories.entries()].sort((a, b) => b[1].amount - a[1].amount).slice(0, getAssistantCategoryLimit(text));
    const topics = new Map();
    expenses.forEach((item) => {
      const title = String(item.title || item.category || "Başlıksız harcama").trim();
      const entry = topics.get(title) || { amount: 0, count: 0 };
      entry.amount += Number(item.amount || 0);
      entry.count += 1;
      topics.set(title, entry);
    });
    const topTopics = [...topics.entries()].sort((a, b) => b[1].amount - a[1].amount).slice(0, 3);

    const scopeLabel = `${accountLabel ? `${accountLabel} · ` : ""}${period.label}`;
    if (!records.length) {
      return `${scopeLabel} için kayıt bulamadım. Başka bir ayı veya “tüm zamanlar”ı sorabilirsin.`;
    }

    const normalized = normalize(text);
    const asksCategory = /\b(kategori\w*|dagilim)\b/.test(normalized);
    const asksForTopItems = /\b(en cok|ne|neler|neyi|neye|nerede)\b/.test(normalized);
    const asksForSummary = /\b(ozet\w*|toplam|gelir|gider|net|bakiye)\b/.test(normalized);
    if (asksCategory && !asksForSummary) {
      if (!topCategories.length) return `${scopeLabel} için gider kaydı bulamadım.`;
      lastCategoryReport = { period, accountId: account?.id || "" };
      const lines = [`${scopeLabel} en çok gider yaptığın kategoriler:`];
      topCategories.forEach(([name, data], index) => {
        const share = totals.expense > 0 ? Math.round((data.amount / totals.expense) * 100) : 0;
        lines.push(`${index + 1}. ${name}: ${formatMoney(data.amount)} · %${share} · ${data.count} kayıt`);
      });
      return lines.join("\n");
    }
    if (asksForTopItems && !asksForSummary) {
      if (!topTopics.length) return `${scopeLabel} için gider kaydı bulamadım.`;
      const lines = [`${scopeLabel} en çok harcama yaptığın kalemler:`];
      topTopics.forEach(([title, data], index) => lines.push(`${index + 1}. ${title}: ${formatMoney(data.amount)} · ${data.count} kayıt`));
      return lines.join("\n");
    }

    const lines = [
      `${scopeLabel} özeti`,
      `Gelir: ${formatMoney(totals.income)}`,
      `Gider: ${formatMoney(totals.expense)}`,
      `Net: ${formatMoney(totals.balance)}`,
    ];
    if (transfers.length) lines.push(`Transfer: ${formatMoney(transferAmount)} (${transfers.length} kayıt; gelir/gider toplamlarına dahil değil)`);
    if (topCategories.length) {
      lines.push("En yüksek gider kategorileri:");
      topCategories.forEach(([name, data], index) => {
        const share = totals.expense > 0 ? Math.round((data.amount / totals.expense) * 100) : 0;
        lines.push(`${index + 1}. ${name}: ${formatMoney(data.amount)} · %${share} · ${data.count} kayıt`);
      });
    } else {
      lines.push("Bu dönemde gider kaydı yok.");
    }
    if (topTopics.length && /\b(konu\w*|ne\w*|harcama\w*|alan\w*|kategori\w*|en cok|nerede|ozet\w*)\b/.test(normalized)) {
      lines.push("Öne çıkan harcama başlıkları:");
      topTopics.forEach(([title, data], index) => lines.push(`${index + 1}. ${title}: ${formatMoney(data.amount)}`));
    }
    return lines.join("\n");
  }

  function assistantEditDistance(left, right) {
    const a = normalize(left);
    const b = normalize(right);
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[b.length];
  }

  function findAssistantCategory(text, categories = transactionCategories?.expense || []) {
    const normalized = normalize(text);
    const available = [...new Set(categories)].sort((a, b) => normalizeCategoryName(b).length - normalizeCategoryName(a).length);
    const exact = available.find((category) => (` ${normalizeCategoryName(text)} `).includes(` ${normalizeCategoryName(category)} `));
    if (exact) return exact;

    const aliases = {
      "Akaryakıt": ["benzin", "mazot", "yakıt", "petrol"],
      "Mutfak": ["yemek", "restoran", "lokanta", "kafe", "kahve", "sipariş"],
      "Fatura": ["elektrik", "doğalgaz", "internet faturası", "su faturası"],
      "Market": ["bakkal", "migros", "carrefour", "a101", "bim", "şok", "gross"],
      "Ev": ["kira", "ev eşyası", "tadilat"],
      "Sağlık": ["eczane", "doktor", "hastane"],
    };
    for (const [category, words] of Object.entries(aliases)) {
      const actual = available.find((item) => normalize(item) === normalize(category));
      if (actual && words.some((word) => normalized.includes(normalize(word)))) return actual;
    }

    const ignored = new Set(["kategori", "kategoride", "kategorisinde", "harcama", "harcamalar", "harcadim", "gider", "giderim", "yaptim", "yaptigim", "neler", "hangi", "ne", "var", "benim", "icin", "bu", "ay", "en", "cok", "tum", "genel", "listele", "goster", "detay"]);
    const tokens = normalized.split(" ").filter((word) => word.length >= 3 && !ignored.has(word));
    if (!tokens.length) return "";
    const ranked = available.map((category) => {
      const categoryWords = normalizeCategoryName(category).split(" ").filter(Boolean);
      const scores = categoryWords.map((word) => Math.max(...tokens.map((token) => {
        const distance = assistantEditDistance(word, token);
        return 1 - distance / Math.max(word.length, token.length);
      })));
      return { category, score: scores.reduce((sum, score) => sum + score, 0) / Math.max(1, scores.length) };
    }).sort((a, b) => b.score - a.score);
    return ranked[0]?.score >= 0.64 ? ranked[0].category : "";
  }

  function normalizeCategoryName(value) {
    return normalize(value).split(" ").filter((word) => word !== "ve" && word !== "ile").join(" ");
  }

  function hasExplicitPeriod(text) {
    const normalized = normalize(text);
    if (getBudgetAssistantPeriodOverride(text, getTurkeyTodayISO(), normalize)) return true;
    if (getAssistantExplicitDatePeriod(text)) return true;
    return /\b(bugun|dun|bu ay\w*|gecen ay\w*|onceki ay\w*|son \w+ (gun\w*|hafta\w*|ay\w*)|gecen \w+ (gun\w*|hafta\w*|ay\w*)|bu hafta\w*|gecen hafta|onceki hafta|bu yil|genel|tum zaman|bugune kadar|simdiye kadar|20\d{2})\b|\b(ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)(?:da|de|ta|te|daki|deki|taki|teki)?\b/.test(normalized);
  }

  function getAssistantCategoryDetail(text, categoryOverride = "") {
    const query = getAssistantRecordQueryInfo(text);
    const categories = query.categories;
    const category = categoryOverride || query.category;
    const type = query.type || (lastCategoryReport && !hasExplicitPeriod(text) ? lastCategoryReport.type || "expense" : "");
    if (!category) return "Hangi kategoriyi kastettiğini anlayamadım. Kategori adını biraz daha açık yazabilir misin?";

    const scope = getAssistantAccountScope(text);
    if (scope?.ambiguous) {
      const labels = scope.ambiguous.map((account) => formatPaymentAccountName(account));
      return `Bu kategori için birden fazla hesap eşleşti. Hangisini inceleyeyim?\n${labels.join(" · ")}`;
    }
    if (scope?.missing) return "Bu kart veya hesapla eşleşen hareket bulamadım. Hesap adını ayarlardaki gibi yazıp tekrar sorabilirsin.";

    const usePreviousPeriod = !hasExplicitPeriod(text) && lastCategoryReport?.period;
    const period = usePreviousPeriod ? lastCategoryReport.period : getAssistantPeriod(text);
    const selectedAccountId = scope?.account?.id || (!scope?.account && !hasExplicitPeriod(text) ? lastCategoryReport?.accountId : "") || "";
    const records = transactions.filter((item) => {
      if (type && item.type !== type) return false;
      if (!isInAssistantPeriod(item.date, period)) return false;
      if (selectedAccountId && String(item.paymentAccountId || "") !== String(selectedAccountId) && String(item.transferAccountId || "") !== String(selectedAccountId)) return false;
      return normalize(item.category) === normalize(category) || findAssistantCategory(item.category, categories) === category;
    }).sort(compareTransactionsNewestFirst);
    if (!records.length) return `${period.label} döneminde ${category} kategorisinde eşleşen ${type === "income" ? "gelir" : type === "transfer" ? "transfer" : type === "expense" ? "gider" : "hareket"} kaydı bulamadım.`;

    const total = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const lines = [`${period.label} · ${category} kategorisi: ${formatMoney(total)} toplam, ${records.length} kayıt.`];
    records.slice(0, 12).forEach((item) => {
      const account = paymentAccounts.find((candidate) => String(candidate.id) === String(item.paymentAccountId));
      const accountLabel = account ? ` · ${formatPaymentAccountName(account)}` : "";
      lines.push(`• ${formatDate(item.date)} · ${item.title || item.category} · ${formatMoney(item.amount)}${accountLabel}`);
    });
    if (records.length > 12) lines.push(`İlk 12 kayıt gösteriliyor; toplam ${records.length} kayıt var.`);
    lastCategoryReport = { period, accountId: selectedAccountId, type };
    return lines.join("\n");
  }

  function getAssistantRecordQueryInfo(text) {
    const categories = [...new Set([
      ...(transactionCategories?.expense || []),
      ...(transactionCategories?.income || []),
      ...(transactions || []).map((item) => item.category).filter(Boolean),
    ])];
    const normalized = normalize(text);
    let explicitCategory = categories.slice().sort((a, b) => normalizeCategoryName(b).length - normalizeCategoryName(a).length)
      .find((category) => (` ${normalizeCategoryName(text)} `).includes(` ${normalizeCategoryName(category)} `)) || "";
    if (["gelir", "gider", "transfer"].includes(normalize(explicitCategory))
      && !/\bkategori\w*\b/.test(normalized)) explicitCategory = "";
    const accountScope = getAssistantAccountScope(text);
    const ignored = new Set(("bu şu son gecen onceki genel tum zaman kayit bugune kadar simdiye kadar yil ay ayda hafta haftada gun gunde bugun dun yarin bir iki uc dort bes alti yedi sekiz dokuz on kategori kategoride kategorisinde kategorisindeki harcama harcamalar harcamalarim harcamalarimda harcadim harcadigim harcamisim gider giderler giderlerim gelir gelirler gelirlerim transfer transferler aktarim islem islemler kayitlar kayitlarim liste listele goster getir bul bak incele detay detaylari ne neler hangi cok en yaptim yaptigim yaptik yaptigimiz ettim ettigim ettigi aldim almisim satin odedim odenen var mi varmis misin misiniz icin ile ve de benim benimki benimle bu ayki haftaki aylik yillik donem ozet analiz toplam tutar tutari kadar hepsi hepsini ta te tan ten da de dan den kredi kart kartimla kartimdan kartim kartiyla hesabimla hesabimdan hesabim banka bankam kime maas maaşim gonderim gonderdim gondermisim aktarim aktardim tahsil tahsilat" ).split(" "));
    const monthWords = new Set("ocak subat mart nisan mayis haziran temmuz agustos eylul ekim kasim aralik".split(" ").flatMap((word) => [word, `${word}da`, `${word}de`, `${word}ta`, `${word}te`]));
    const accountWords = new Set((accountScope?.account ? [accountScope.account.name, accountScope.account.bank] : [])
      .flatMap((value) => normalize(value).split(" ")).filter(Boolean));
    const ignoredStems = ["kategori", "harcama", "gider", "gelir", "transfer", "aktar", "gonder", "tahsil", "maas", "islem", "kayit", "kayd", "listele", "goster", "getir", "yapt", "ett", "odeme", "alisveris"];
    ignoredStems.push("hesab", "kart", "bugun", "dun");
    "adet tane ilk peki olanlar daha detayli yirmi otuz kirk elli altmis yetmis seksen doksan yuz nakit havale eft birini ikisini ucunu dordunu besini altisini yedisini sekizini dokuzunu onunu yirmisini otuzunu".split(" ").forEach(word => ignored.add(word));
    ["nr", "nedir", "nelerdir", "yakin", "tarihli", "tarihte", "tarihteki", "tarihinde", "tarihindeki", "tarih", "guncel", "yeni", "en", "eklenme", "eklendigi", "zamanina", "tarihine", "tarihi", "kaydedilen", "secilen", "gore", "az", "dusuk", "yuksek", "buyuk", "kucuk", "tutarli", "tutarda", "azdan", "coga", "coktan", "aza", "buyukten", "kucuge", "kucukten", "buyuge", "arasinda", "arasi", "ila", "o", "ayin", "ayinda", "gunku", "gundeki", "gunu", "gununde", "gunundeki"].forEach((word) => ignored.add(word));
    const informativeTokens = normalized.split(" ").filter((token) => token.length >= 2
      && !/^\d+$/.test(token)
      && !ignored.has(token)
      && !ignoredStems.some((stem) => token.startsWith(stem))
      && !/^(gun|hafta|ay)(de|da|deki|daki|dur|dir|ki)?$/.test(token)
      && !monthWords.has(token)
      && !accountWords.has(token));
    const category = explicitCategory || findAssistantCategory(informativeTokens.join(" "), categories);
    const categoryWords = normalize(category).split(" ").filter(Boolean);
    let queryTokens = informativeTokens.filter((token) => !categoryWords.some((word) => token === word || token.startsWith(word) || 1 - assistantEditDistance(token, word) / Math.max(token.length, word.length) >= 0.64));

    const aliases = {
      Akaryakıt: ["benzin", "mazot", "yakit", "petrol"],
      Mutfak: ["yemek", "restoran", "lokanta", "kafe", "kahve", "siparis"],
      Fatura: ["elektrik", "dogalgaz", "internet", "fatura", "su"],
      Market: ["bakkal"],
      Ev: ["kira", "tadilat"],
      Sağlık: ["eczane", "doktor", "hastane"],
    };
    const categoryAliasWords = aliases[category] || [];
    if (!explicitCategory && categoryAliasWords.length && queryTokens.every((token) => categoryAliasWords.includes(token))) queryTokens = [];

    const intentText = normalized;
    const types = [
      [/\b(transfer\w*|aktarim\w*|aktard\w*|gonder\w*)\b/, "transfer"],
      [/\b(gelir\w*|maas\w*|kazanc\w*|tahsilat\w*)\b/, "income"],
      [/\b(gider\w*|harcama\w*|harcad\w*|harcamis\w*|masraf\w*|alisveris\w*|odeme\w*|satin al\w*)\b/, "expense"],
    ].filter(([pattern]) => pattern.test(intentText)).map(([, value]) => value);
    let type = /\b(transfer\w*|aktarim\w*|aktard\w*|gonder\w*)\b/.test(intentText) ? "transfer"
      : /\b(gelir\w*|maas\w*|kazanc\w*|tahsilat\w*)\b/.test(intentText) ? "income"
        : /\b(gider\w*|harcama\w*|harcad\w*|harcamis\w*|masraf\w*|alisveris\w*|odeme\w*|satin al\w*)\b/.test(intentText) ? "expense" : "";
    if (types.length > 1) type = "";
    if (!type && category && !types.length) {
      const isIncomeCategory = (transactionCategories?.income || []).some((item) => normalize(item) === normalize(category));
      const isExpenseCategory = (transactionCategories?.expense || []).some((item) => normalize(item) === normalize(category));
      if (isIncomeCategory !== isExpenseCategory) type = isIncomeCategory ? "income" : "expense";
    }
    return { categories, category, explicitCategory, accountScope, queryTokens, type, types, paymentMethod: inferPaymentMethod(text) };
  }

  function assistantTokenMatches(queryToken, recordText) {
    const words = normalize(recordText).split(" ").filter(Boolean);
    return words.some((word) => {
      if (word === queryToken || word.startsWith(queryToken) || queryToken.startsWith(word)) return true;
      const similarity = 1 - assistantEditDistance(queryToken, word) / Math.max(queryToken.length, word.length);
      return Math.min(queryToken.length, word.length) >= 4 && similarity >= 0.72;
    });
  }

  function getAssistantRecordsReport(text, { order = getAssistantRecordOrder(text) || "date" } = {}) {
    const query = getAssistantRecordQueryInfo(text);
    const { category, accountScope, queryTokens, type, types, categories } = query;
    const ranking = getAssistantRecordRanking(text);
    if (ranking) order = ranking.order;
    const recordLimit = getAssistantRecordLimit(text);
    const period = recordLimit && !ranking && !hasExplicitPeriod(text)
      ? { allTime: true, key: "", label: "Tüm kayıtlar" } : getAssistantPeriod(text);
    if (period.invalid) return "Tarihi anlayamadım. Geçerli bir gün veya tarih aralığı yazabilir misin? Örneğin: 01.10.2026–14.10.2026.";
    if (accountScope?.ambiguous) {
      return `Birden fazla hesap eşleşti. Hangisini kullanayım?\n${accountScope.ambiguous.map(formatPaymentAccountName).join(" · ")}`;
    }
    if (accountScope?.missing) return "Bu kart veya hesapla eşleşen hareket bulamadım. Hesap adını kayıtlı olduğu gibi yazıp tekrar sorabilirsin.";

    const accountId = accountScope?.account?.id ? String(accountScope.account.id) : "";
    let records = (Array.isArray(transactions) ? transactions : []).filter((item) => {
      const createdAt = getRecordTimestamp(item.createdAt);
      const scopeDate = order === "created" ? (createdAt ? getTurkeyTodayISO(new Date(createdAt)) : "") : item.date;
      if (!isInAssistantPeriod(scopeDate, period)) return false;
      if (type && item.type !== type) return false;
      if (query.paymentMethod) {
        const source = paymentAccounts.find(account => String(account.id) === String(item.paymentAccountId));
        const method = item.paymentMethod || (item.type === "transfer" ? "transfer" : source?.type);
        if (method !== query.paymentMethod) return false;
      }
      if (types.length > 1 && !types.includes(item.type)) return false;
      if (category && normalize(item.category) !== normalize(category) && findAssistantCategory(item.category, categories) !== category) return false;
      if (accountId && String(item.paymentAccountId || "") !== accountId && String(item.transferAccountId || "") !== accountId) return false;
      if (queryTokens.length) {
        const source = paymentAccounts.find((account) => String(account.id) === String(item.paymentAccountId));
        const destination = paymentAccounts.find((account) => String(account.id) === String(item.transferAccountId));
        const searchable = [item.title, item.category, item.note, item.description, source?.name, source?.bank, destination?.name, destination?.bank].filter(Boolean).join(" ");
        const matched = queryTokens.filter((token) => assistantTokenMatches(token, searchable)).length;
        if (matched < Math.max(1, Math.ceil(queryTokens.length * 0.65))) return false;
      }
      return true;
    }).sort((a, b) => order === "amountAsc" || order === "amountDesc"
      ? (Math.abs(Number(a.amount) || 0) - Math.abs(Number(b.amount) || 0)) * (order === "amountAsc" ? 1 : -1) || compareTransactionsNewestFirst(a, b)
      : order === "created"
      ? getRecordTimestamp(b.createdAt) - getRecordTimestamp(a.createdAt) || compareTransactionsNewestFirst(a, b)
      : String(b.date || "").localeCompare(String(a.date || "")) || compareTransactionsNewestFirst(a, b));

    if (!records.length) {
      if (queryTokens.length || category) return `${period.label} döneminde bu isteğe uyan kayıt bulamadım. Kategori, işyeri adı veya tarih aralığını değiştirerek tekrar deneyebilirsin.`;
      return `${period.label} döneminde kayıt bulunmuyor.`;
    }

    const matchingCount = records.length;
    if (recordLimit) records = records.slice(0, recordLimit);
    const total = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const typeLabel = type === "income" ? "gelir" : type === "transfer" ? "transfer" : type === "expense" ? "gider" : "hareket";
    const label = ranking ? `${period.label} · En ${order === "amountAsc" ? "düşük" : "yüksek"} tutarlı ${records.length} işlem`
      : recordLimit ? `${hasExplicitPeriod(text) ? `${period.label} · ` : ""}Son ${records.length} kayıt` : period.label;
    const displayLimit = recordLimit || 14;
    const lines = [`${label} · ${category ? `${category} kategorisi · ` : ""}${records.length} ${typeLabel} kaydı · toplam ${formatMoney(total)}.`];
    lines.push(ranking ? `Sıralama: işlem tutarına göre (${order === "amountAsc" ? "küçükten büyüğe" : "büyükten küçüğe"}); her satır tek bir işlem.`
      : order === "created" ? "Sıralama: eklenme zamanına göre (en yeni önce)." : "Sıralama: kayıtta seçilen işlem tarihine göre (en yeni önce).");
    if (!type) {
      ["income", "expense", "transfer"].forEach((kind) => {
        const matching = records.filter((record) => record.type === kind);
        if (matching.length) lines.push(`${entryTypeLabel(kind)}: ${formatMoney(matching.reduce((sum, record) => sum + Number(record.amount || 0), 0))} · ${matching.length} kayıt${kind === "transfer" ? " (gelir/gider toplamlarına dahil değil)" : ""}`);
      });
    }
    records.slice(0, displayLimit).forEach((item, index) => {
      const source = paymentAccounts.find((account) => String(account.id) === String(item.paymentAccountId));
      const destination = paymentAccounts.find((account) => String(account.id) === String(item.transferAccountId));
      const accounts = item.type === "transfer"
        ? ` · ${source ? formatPaymentAccountName(source) : "Kaynak hesap"} → ${destination ? formatPaymentAccountName(destination) : "Hedef hesap"}`
        : source ? ` · ${formatPaymentAccountName(source)}` : "";
      const createdAt = getRecordTimestamp(item.createdAt);
      const createdLabel = order === "created" ? ` · Eklenme: ${createdAt ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(createdAt)) : "bilinmiyor"}` : "";
      lines.push(`${ranking ? `${index + 1}.` : "•"} ${formatDate(item.date)} · ${item.title || item.category || "Başlıksız"} · ${item.category || entryTypeLabel(item.type)} · ${formatMoney(item.amount)}${accounts}${createdLabel}`);
    });
    if (records.length > displayLimit) lines.push(`İlk ${displayLimit} kayıt gösteriliyor; toplam ${records.length} kayıt var.`);
    if (recordLimit && matchingCount < recordLimit) lines.push(`İstediğin ${recordLimit} kayıt yerine eşleşen ${matchingCount} kayıt gösterildi.`);
    return lines.join("\n");
  }

  function getAssistantRecordRanking(text) {
    const normalized = normalize(text);
    const ascending = /\b(en az|en dusuk|en kucuk|azdan coga|kucukten buyuge)\b/.test(normalized);
    const descending = /\b(en cok|en yuksek|en buyuk|coktan aza|buyukten kucuge)\b/.test(normalized);
    if (!ascending && !descending) return null;
    const recordWords = /\b(islem\w*|kayit\w*|kayd\w*|hareket\w*|gider\w*|gelir\w*|transfer\w*|harcama\w*|harcad\w*)\b/;
    if (!recordWords.test(normalized)) return null;
    if (/\b(kategori\w*|kalem\w*|baslik\w*|konu\w*)\b/.test(normalized) && !/\b(islem\w*|kayit\w*|kayd\w*|hareket\w*)\b/.test(normalized)) return null;
    const limit = getBudgetAssistantCount(text, normalize, 10);
    return { order: ascending ? "amountAsc" : "amountDesc", limit };
  }

  function getAssistantRecordLimit(text) {
    const ranking = getAssistantRecordRanking(text);
    if (ranking) return ranking.limit;
    const normalized = normalize(text);
    if (/\bilk\s+(?:\d+|bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on|yirmi|otuz)/.test(normalized)) return getBudgetAssistantCount(text, normalize, 10);
    const requested = getBudgetAssistantCount(text, normalize, 0);
    if (requested && /\b(islem\w*|kayit\w*|kayd\w*|hareket\w*)\b/.test(normalized)) return requested;
    const match = /\bson\s+(?:\d{1,3}|bir|iki|uc|dort|bes|alti|yedi|sekiz|dokuz|on|yirmi|otuz)(?:\s+\w+)?\s+(?:kayit\w*|kayd\w*|islem\w*|hareket\w*)\b/.exec(normalized);
    if (match) return getBudgetAssistantCount(text, normalize, 10);
    return /\b(yakin(?: tarihli| tarihteki)?|en yeni|son|guncel) (kayit\w*|kayd\w*|islem\w*|hareket\w*)\b/.test(normalized) ? 10 : 0;
  }

  function getAssistantRecordOrder(text) {
    const normalized = normalize(text);
    if (/\b(eklenme|eklendigi) (zamani\w*|tarihi\w*)\b/.test(normalized)) return "created";
    if (/\b(kayitta secilen|kaydedilen|islem|kayit) tarih(?:i\w*|e)\b/.test(normalized)) return "date";
    return "";
  }

  function getAssistantDebtReport(kind) {
    const today = getTurkeyTodayISO();
    const records = borcAlacakKayitlari
      .filter((item) => item.kind === kind && Number(item.amount || 0) > 0)
      .sort((a, b) => String(a.dueDate || "9999-12-31").localeCompare(String(b.dueDate || "9999-12-31")));
    const label = kind === "receivable" ? "Alacakların" : "Açık borçların";
    if (!records.length) return `${label} bulunmuyor.`;
    const total = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const lines = [`${label}: ${formatMoney(total)} kalan tutar, ${records.length} kayıt.`];
    records.slice(0, 12).forEach((item) => {
      const due = item.dueDate ? ` · Vade ${formatDate(item.dueDate)}` : "";
      const status = item.dueDate && item.dueDate < today ? " · Vadesi geçmiş" : "";
      lines.push(`• ${item.person} · ${formatMoney(item.amount)}${due}${status}${item.listType === "installment" ? ` · ${item.installmentCount} taksit` : ""}`);
    });
    return lines.join("\n");
  }

  function getAssistantInstallmentReport({ upcomingOnly = false, period = null } = {}) {
    const today = getTurkeyTodayISO();
    const untilDate = new Date(`${today}T12:00:00`);
    untilDate.setDate(untilDate.getDate() + 30);
    const until = getTurkeyTodayISO(untilDate);
    const rows = [];
    borcAlacakKayitlari.filter((item) => item.listType === "installment" && item.amount > 0).forEach((item) => {
      (item.installments || []).forEach((installment) => {
        const remaining = borcAlacakTaksitKalanTutari(item, installment);
        if (remaining > 0) rows.push({ date: installment.dueDate, title: `${item.person} · ${installment.number}/${item.installmentCount}. taksit`, amount: remaining, overdue: installment.dueDate < today });
      });
    });
    transactions.filter((item) => item.type === "expense" && item.isInstallment && !item.installmentCompleted).forEach((item) => {
      rows.push({ date: item.date, title: `${item.title || item.category} · ${item.installmentNumber || 1}/${item.installmentCount || 1}. taksit`, amount: Number(item.amount || 0), overdue: String(item.date || "") < today });
    });
    const selected = period ? rows.filter((item) => isInAssistantPeriod(item.date, period))
      : upcomingOnly ? rows.filter((item) => item.date >= today && item.date <= until) : rows;
    selected.sort((a, b) => String(a.date || "9999-12-31").localeCompare(String(b.date || "9999-12-31")));
    if (period && !selected.length) return `${period.label} döneminde açık taksit kaydı görünmüyor.`;
    if (upcomingOnly && !period && !selected.length) {
      const later = rows.filter((item) => item.date > until).sort((a, b) => a.date.localeCompare(b.date))[0];
      return later
        ? `Önümüzdeki 30 gün içinde vadesi gelen taksit görünmüyor. En yakın taksit ${formatDate(later.date)} tarihinde (${later.title}, ${formatMoney(later.amount)}).`
        : "Önümüzdeki 30 gün içinde vadesi gelen açık taksit görünmüyor.";
    }
    if (!selected.length) return "Açık taksit kaydı bulunmuyor.";
    const lines = [period ? `${period.label} dönemindeki açık taksitlerin (${selected.length} kayıt):`
      : upcomingOnly ? "Önümüzdeki 30 gün içindeki taksitlerin:" : `Açık taksitlerin (${selected.length} kayıt):`];
    selected.slice(0, 14).forEach((item) => lines.push(`• ${formatDate(item.date)} · ${item.title} · ${formatMoney(item.amount)}${item.overdue ? " · Vadesi geçmiş" : ""}`));
    if (selected.length > 14) lines.push(`İlk 14 taksit gösteriliyor; toplam ${selected.length} kayıt var.`);
    return lines.join("\n");
  }

  function getAssistantAssetReport(text) {
    let list = assets;
    const normalized = normalize(text);
    const typeFilter = /\b(dolar\w*|usd)\b/.test(normalized) ? "USD"
      : /\b(euro\w*|eur)\b/.test(normalized) ? "EUR"
        : /\b(sterlin\w*|gbp)\b/.test(normalized) ? "GBP"
          : /\b(bitcoin\w*|btc)\b/.test(normalized) ? "BTC"
            : /\b(ethereum\w*|eth)\b/.test(normalized) ? "ETH"
              : /\b(platin\w*|xpt)\b/.test(normalized) ? "XPT_GRAM"
                : /\b(turk lirasi|tl birikim\w*)\b/.test(normalized) ? "TRY"
        : /\b(gumus|gumuslerim)\b/.test(normalized) ? "TR_GAG"
          : /\b(altin|altinlarim)\b/.test(normalized) ? "gold" : "";
    if (typeFilter === "gold") list = list.filter((item) => /altin/.test(normalize(getAssetDefinition(item.type).label)));
    else if (typeFilter) list = list.filter((item) => item.type === typeFilter);
    if (!list.length) return typeFilter ? "Bu türde kayıtlı varlık bulamadım." : "Kayıtlı varlığın bulunmuyor.";
    const total = list.reduce((sum, item) => sum + getAssetValue(item), 0);
    const lines = [`${typeFilter ? "Eşleşen varlıkların" : "Varlık portföyün"}: ${formatMoney(total)} güncel toplam değer.`];
    list.forEach((item) => {
      const definition = getAssetDefinition(item.type);
      lines.push(`• ${item.label || definition.label}: ${formatQuantity(item.amount)} ${definition.unit} · ${formatMoney(getAssetValue(item))}`);
    });
    return lines.join("\n");
  }

  function getAssistantBesReport() {
    if (!besAccounts.length) return "Kayıtlı BES hesabın bulunmuyor.";
    const total = besAccounts.reduce((sum, item) => sum + getBesAccountTotal(item), 0);
    const lines = [`BES birikimin: ${formatMoney(total)} toplam.`];
    besAccounts.forEach((item) => {
      lines.push(`• ${item.provider}${item.policyNo ? ` · ${item.policyNo}` : ""}: ${formatMoney(getBesAccountTotal(item))} (birikim ${formatMoney(item.contribution)}, devlet katkısı ${formatMoney(item.stateContribution)}, getiriler ${formatMoney(Number(item.stateGain || 0) + Number(item.gain || 0))})`);
    });
    return lines.join("\n");
  }

  function getAssistantWealthReport() {
    const totals = getTransactionTotals(getHomeSummaryTransactions());
    const segments = getHomeWealthSegments({ cashBalance: totals.balance, besTotalValue: getBesTotal() });
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const lines = [`Toplam birikimin: ${formatMoney(total)}.`, "Birikim dağılımı:"];
    segments.forEach((segment) => lines.push(`• ${segment.label}: ${formatMoney(segment.value)}`));
    if (!segments.length) lines.push("Pozitif bakiye, varlık veya BES birikimi bulunmuyor.");
    lines.push(isHomeSummaryFilterActive()
      ? `Grafikle aynı hesap: güncel bakiye ${getHomeSummaryFilterLabel()} filtresine göre; varlıklar ve BES güncel değerleriyle dahil.`
      : "Grafikle aynı hesap: tüm zamanların pozitif net bakiyesi, güncel varlık değerleri ve BES toplamı.");
    return lines.join("\n");
  }

  function getAssistantCardReport(account) {
    const isCredit = account.type === "credit_card";
    const lines = [`${formatPaymentAccountName(account)} · ${account.bank || getPaymentAccountTypeLabel(account.type)}`];
    if (isCredit) {
      lines.push(`Toplam kart borcu: ${formatMoney(account.debt)} · Dönem borcu: ${formatMoney(getActiveCreditCardStatementDebt(account))}`);
      if (account.limit) lines.push(`Limit: ${formatMoney(account.limit)} · Kullanılabilir yaklaşık limit: ${formatMoney(Math.max(0, account.limit - Number(account.debt || 0)))}`);
      if (account.dueDay) lines.push(`Son ödeme günü: her ayın ${account.dueDay}. günü`);
    } else {
      lines.push(`Güncel bakiye: ${formatMoney(account.balance)}`);
    }
    const records = transactions.filter((item) => String(item.paymentAccountId || "") === String(account.id) || String(item.transferAccountId || "") === String(account.id)).sort(compareTransactionsNewestFirst).slice(0, 6);
    if (records.length) {
      lines.push("Son hareketler:");
      records.forEach((item) => lines.push(`• ${formatDate(item.date)} · ${item.title || item.category} · ${formatMoney(item.amount)} · ${entryTypeLabel(item.type)}`));
    } else {
      lines.push("Bu hesapta kayıtlı hareket görünmüyor.");
    }
    return lines.join("\n");
  }

  function isCardQuestion(text) {
    return /\b(kart\w*|kredi karti\w*|banka karti\w*|hesap\w*|bakiye\w*)\b/.test(normalize(text))
      && /\b(detay\w*|borc\w*|limit\w*|bakiye\w*|harcama\w*|hareket\w*|ne|neler|hangi|bilgi\w*|durum\w*|ilgili)\b/.test(normalize(text));
  }

  function respondToCardQuestion(text, selectedAccount = null) {
    if (selectedAccount) {
      pendingFinanceQuestion = null;
      appendMessage(getAssistantCardReport(selectedAccount));
      return;
    }
    const direct = findEntryAccount(text, "") || findEntryAccount(text, "credit_card")
      || paymentAccounts.find((account) => normalize(account.name) === normalize(text) || normalize(formatPaymentAccountName(account)) === normalize(text));
    if (direct) {
      appendMessage(getAssistantCardReport(direct));
      return;
    }
    const scope = getAssistantAccountScope(text);
    if (scope?.account) {
      appendMessage(getAssistantCardReport(scope.account));
      return;
    }
    const options = paymentAccounts;
    if (!options.length) {
      appendMessage("Kart veya hesap kaydı bulamadım. Önce Kartlar / Hesaplar bölümünden ekleyebilirsin.");
      return;
    }
    pendingFinanceQuestion = { kind: "accountDetail" };
    appendMessage("Hangi kart veya hesabın ayrıntılarını inceleyeyim?");
    addPromptButtons(options.map(formatPaymentAccountName));
  }

  function getAssistantFinanceIntent(text) {
    const normalized = normalize(text);
    if (getAssistantRecordLimit(text)) return "records";
    const accountSpendingReport = /\b(en cok|en az|en yuksek|en dusuk|en buyuk|en kucuk)\b/.test(normalized)
      && /\b(harc\w*|alisveris\w*)\b/.test(normalized)
      && !/\b(borc\w*|limit\w*|bakiye\w*)\b/.test(normalized);
    const accountRecordQuestion = /\b(harc\w*|gider\w*|gelir\w*|transfer\w*|hareket\w*|islem\w*|kayit\w*|kart odeme\w*)\b/.test(normalized)
      && !/\b(borc\w*|limit\w*|bakiye\w*)\b/.test(normalized);
    if (isCardQuestion(text) && !accountSpendingReport && !accountRecordQuestion) return "card";
    if (/\b(bes|bireysel emeklilik|emeklilik birikim)\b/.test(normalized)) return "bes";
    if (/\b(birikim\w*|toplam servet\w*)\b/.test(normalized)) return "wealth";
    if (/\b(varlik\w*|portfoy|altinlarim|gumuslerim|dolarim|eurom)\b/.test(normalized)) return "assets";
    if (/\b(taksit\w*|taksid\w*|yaklasan odeme|vade\w*)\b/.test(normalized)) return "installments";
    if (/\b(alacak\w*|kimden alacagim|tahsil edecegim)\b/.test(normalized)) return "receivables";
    if (/\b(borc\w*|kime borcluyum|odeme yukumlulugu)\b/.test(normalized)) return "debts";
    const query = getAssistantRecordQueryInfo(text);
    const category = query.category;
    const categoryRequest = /\b(kategori\w*|harcama\w*|harcadim|gider\w*|liste\w*|detay\w*|ne|neler|hangi|goster|kayit\w*)\b/.test(normalized);
    const asksForRecords = /\b(hangileri|neler|listele|goster|getir|kayit\w*|islem\w*|hareket\w*|harcamalar\w*|giderler\w*|gelirler\w*|transferler\w*|harcadim|harcadig\w*|harcamisim|yaptim|odeme\w*|alisveris\w*|maas\w*|tahsil\w*|gonder\w*|aktard\w*)\b/.test(normalized);
    const aggregateQuestion = /\b(en cok|toplam|ozet\w*|dagilim|karsilastir\w*|ortalama)\b/.test(normalized)
      || (/\bne kadar\b/.test(normalized) && !query.queryTokens.length);
    const bareCategoryFollowup = Boolean(lastCategoryReport && category && normalized.split(" ").length <= 3 && !/[?؟]/.test(String(text || "")));
    if (bareCategoryFollowup) return "categoryDetail";
    if (category && (categoryRequest || asksForRecords || /\b(ne kadar|kac tl)\b/.test(normalized))) return query.queryTokens.length ? "records" : "categoryDetail";
    if (asksForRecords && !aggregateQuestion) return "records";
    if (category && /\b(kategori\w*|harcama\w*|gider\w*|ne|neler|liste\w*|detay\w*)\b/.test(normalized)) return "categoryDetail";
    if (isAssistantReportIntent(text)) return "summary";
    return "";
  }

  function respondToFinanceQuestion(text) {
    if (respondWithInsights(text)) return true;
    const intent = getAssistantFinanceIntent(text);
    if (intent === "card") {
      pendingFinanceQuestion = null;
      respondToCardQuestion(text);
    } else if (intent === "bes") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      appendMessage(getAssistantBesReport());
    } else if (intent === "wealth") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      appendMessage(getAssistantWealthReport());
    } else if (intent === "assets") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      appendMessage(getAssistantAssetReport(text));
    } else if (intent === "installments") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      const normalized = normalize(text);
      const upcoming = /\b(yakin|yaklasan|yakinda|var mi|vadesi gelen)\b/.test(normalized);
      const period = hasExplicitPeriod(text) ? getAssistantPeriod(text) : null;
      appendMessage(getAssistantInstallmentReport({ upcomingOnly: upcoming, period }));
    } else if (intent === "receivables") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      appendMessage(getAssistantDebtReport("receivable"));
    } else if (intent === "debts") {
      pendingFinanceQuestion = null;
      lastCategoryReport = null;
      appendMessage(getAssistantDebtReport("debt"));
    } else if (intent === "categoryDetail") {
      pendingFinanceQuestion = null;
      appendMessage(getAssistantCategoryDetail(text));
    } else if (intent === "records") {
      if (/\byakin(?: tarihli| tarihteki)? (kayit\w*|kayd\w*|islem\w*|hareket\w*)\b/.test(normalize(text)) && !getAssistantRecordOrder(text)) {
        pendingFinanceQuestion = { kind: "recordOrder", text };
        appendMessage("Yakın kayıtları hangi tarihe göre göstereyim? Eklenme zamanı ile kayıtta seçilen işlem tarihi farklı olabilir.");
        addPromptButtons(["Eklenme zamanına göre", "Kayıtta seçilen tarihe göre"]);
        return true;
      }
      pendingFinanceQuestion = null;
      appendMessage(getAssistantRecordsReport(text));
    } else if (intent === "summary") {
      pendingFinanceQuestion = null;
      appendMessage(getAssistantReport(text));
    } else {
      return false;
    }
    rememberReportQuestion(text);
    return true;
  }

  function rememberReportQuestion(text) {
    awaitingReportContinue = false;
    lastReportQuestion = /\b(ne sorabilirim|nasil|yardim|kullanim|soru ornekleri)\b/.test(normalize(text)) ? "" : String(text);
  }

  function resolveReportFollowup(text) {
    if (!lastReportQuestion || pendingEntry || pendingFinanceQuestion) return text;
    const normalized = normalize(text).replace(/^(peki|ya|bir de|ayrica)\s+/, "");
    if (!/^(?:(?:bu|gecen|onceki|gelecek) (?:ay|hafta|yil)|bugun|dun|yarin|ilk [\p{L}\d ]+|en az olanlar|en cok olanlar|hepsini|daha detayli|detaylari|gelir\w*|gider\w*|transfer\w*)(?: icin| da| de| goster)?$/u.test(normalized)) return text;
    let base = lastReportQuestion;
    if (/^(gelir|gider|transfer)/.test(normalized)) base = base.replace(/\b(?:gelir|gider|transfer|harcama|harcad|harcamis)\S*/giu, "");
    if (hasExplicitPeriod(text)) base = base
      .replace(/\b\d{4}-\d{1,2}-\d{1,2}\b|\b\d{1,2}[./]\d{1,2}(?:[./]\d{4})?\b/g, " ")
      .replace(/(?:bu|geçen|gecen|önceki|onceki|gelecek)\s+(?:ay\S*|hafta\S*|yıl\S*|yil\S*)|bugün|bugun|dün|dun|yarın|yarin|son\s+\S+\s+(?:gün\S*|gun\S*|hafta\S*|ay\S*)/giu, " ")
      .replace(/(?:\d{1,2}\s+)?(?:ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)(?:\s+20\d{2})?/giu, " ");
    if (/\ben az\b/.test(normalized)) base = base.replace(/en\s+(?:çok|cok|yüksek|yuksek|büyük|buyuk)/giu, "");
    if (/\ben cok\b/.test(normalized)) base = base.replace(/en\s+(?:az|düşük|dusuk|küçük|kucuk)/giu, "");
    if (/^ilk /.test(normalized)) base = base.replace(/(?:\d+|bir|iki|üç|uc|dört|dort|beş|bes|altı|alti|yedi|sekiz|dokuz|on|yirmi|otuz)(?:\s+(?:bir|iki|üç|uc|dört|dort|beş|bes))?\s+(?=(?:kategori|işlem|islem|kayıt|kayit|harcama))/giu, "");
    return `${base} ${text}`;
  }

  function parseAmount(raw) {
    let value = String(raw || "").replace(/\s/g, "").replace(/₺/g, "").replace(/(tl|lira)$/i, "");
    if (value.includes(",")) value = value.replace(/\./g, "").replace(",", ".");
    else if ((value.match(/\./g) || []).length > 0) {
      const pieces = value.split(".");
      value = pieces.length > 1 && pieces[pieces.length - 1].length === 3
        ? pieces.join("")
        : `${pieces.slice(0, -1).join("")}.${pieces[pieces.length - 1]}`;
    }
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  function extractEntryAmount(text, allowBare = false) {
    const raw = String(text || "");
    const amountMatch = findEntryAmountMatch(raw);
    if (amountMatch) {
      const lira = parseAmount(amountMatch[1] || amountMatch[2]) * (amountMatch[3] ? 1000 : 1);
      const remainder = raw.slice(amountMatch.index + amountMatch[0].length);
      const cents = remainder.match(/^\s*(?:ve\s+)?(\d{1,2})\s*kuru[şs](?:['’]?\s*(?:luk|lük|lik|lık))?(?![\p{L}])/iu);
      return Math.round((lira + (cents && Number.isInteger(lira) ? Number(cents[1]) / 100 : 0)) * 100) / 100;
    }
    const centsOnly = raw.match(/(?:^|\s)(\d{1,2})\s*kuru[şs](?:luk|lük|lik|lık)?(?![\p{L}])/iu);
    if (centsOnly) return Number(centsOnly[1]) / 100;
    if (allowBare) {
      const bareMatch = raw.trim().match(/^(\d[\d.,]*)$/);
      if (bareMatch) return parseAmount(bareMatch[1]);
    }
    return 0;
  }

  function findEntryAmountMatch(text) {
    return String(text || "").match(/(?:^|\s)(?:₺\s*(\d[\d.,]*)|(\d[\d.,]*)\s*(bin\s*)?(?:₺|tl|lira)(?:['’]?\s*(?:ya|ye|lik|lık|luk|lük|dir|dır))?)(?![\p{L}])/iu);
  }

  function extractPurchaseTitle(text) {
    if (/\b(para|borc|maas|ucret|gelir|tahsilat)\b/.test(normalize(text))) return "";
    const amountMatch = findEntryAmountMatch(text);
    if (!amountMatch) return "";
    const remainder = String(text).slice(amountMatch.index + amountMatch[0].length)
      .replace(/^\s*(?:ve\s+)?\d{1,2}\s*kuru[şs](?:['’]?\s*(?:luk|lük|lik|lık))?/iu, "").trim();
    const product = remainder.match(/^(.+?)\s+(?:sat[ıi]n\s+)?ald[ıi][mk](?:\s|[.!?]|$)/iu);
    if (!product) return "";
    const title = product[1].replace(/^(?:bir|ben)\s+/iu, "").trim();
    if (!title || /^(bugun|dun|simdi|nakit|bankadan)$/.test(normalize(title))) return "";
    return title.slice(0, 40);
  }

  function resolveEntryDate(text) {
    const today = getTurkeyTodayISO();
    const normalized = normalize(text);
    if (/\b(bugun|bugunun tarihi|simdi)\b/.test(normalized)) return today;
    if (/\bdun\b/.test(normalized)) {
      const yesterday = new Date(`${today}T12:00:00`);
      yesterday.setDate(yesterday.getDate() - 1);
      return getTurkeyTodayISO(yesterday);
    }
    const numericDate = String(text).match(/(?:^|\s)(\d{1,2})[./-](\d{1,2})(?:[./-](20\d{2}))?(?=\s|$)/);
    if (numericDate) {
      const [, day, month, givenYear] = numericDate;
      return makeValidEntryDate(day, month, givenYear || today.slice(0, 4));
    }
    const monthNames = ["ocak", "subat", "mart", "nisan", "mayis", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik"];
    const monthIndex = monthNames.findIndex((month) => new RegExp(`\\b${month}\\b`).test(normalized));
    if (monthIndex >= 0) {
      const dayMatch = normalized.match(/\b(\d{1,2})\b/);
      const yearMatch = normalized.match(/\b(20\d{2})\b/);
      if (dayMatch) return makeValidEntryDate(dayMatch[1], monthIndex + 1, yearMatch?.[1] || today.slice(0, 4));
    }
    return "";
  }

  function makeValidEntryDate(dayValue, monthValue, yearValue) {
    const day = Number(dayValue);
    const month = Number(monthValue);
    const year = Number(yearValue);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function inferEntryType(text) {
    const normalized = normalize(text);
    if (/\b(transfer|aktardim|aktardik|havale ettim|eft yaptim|para gonderdim)\b/.test(normalized)) return "transfer";
    if (/\b(gider|harcadim|harcadik|harcama|odedim|odeme yaptim|alisveris|satin aldim|fatura odedim)\b/.test(normalized)) return "expense";
    if (/\b(gelir|maas|ucret aldim|maas aldim|kazandim|tahsil ettim|tahsilat|yatti|para geldi)\b/.test(normalized)) return "income";
    if (extractPurchaseTitle(text) || extractServiceTitle(text)) return "expense";
    return "";
  }

  function extractServiceTitle(text) {
    const normalized = normalize(text);
    if (/\b(tiras|tras) oldum\b/.test(normalized)) return "Tıraş";
    if (/\b(sacimi kestirdim|sac kestirdim)\b/.test(normalized)) return "Saç kesimi";
    if (/\b(taksiye bindim|taksi kullandim)\b/.test(normalized)) return "Taksi";
    return "";
  }

  function inferPaymentMethod(text) {
    const normalized = normalize(text);
    if (/\b(kredi karti\w*|kredi kartlar\w*|credit card)\b/.test(normalized)) return "credit_card";
    if (/\b(banka hesabi\w*|banka karti\w*|banka|iban|hesabimdan|hesabimla)\b/.test(normalized)) return "bank_account";
    if (/\b(havale|eft)\b/.test(normalized)) return "transfer";
    if (/\b(nakit|nakit olarak|pesin)\b/.test(normalized)) return "cash";
    if (/\b(diger|baska)\b/.test(normalized)) return "other";
    return "";
  }

  function findEntryCategory(text, type) {
    const normalized = normalize(text);
    const list = transactionCategories?.[type] || [];
    const exact = list.find((category) => normalized.includes(normalize(category)));
    if (exact) return exact;
    const hints = type === "expense" ? [
      ["Market", ["market", "bakkal", "migros", "carrefour", "a101", "bim", "sok market"]],
      ["Mutfak", ["restoran", "lokanta", "kafe", "kahve", "yemek", "paket servis"]],
      ["Ev", ["kira", "ev esyasi", "tadilat"]],
      ["Kıyafet", ["kiyafet", "giyim", "ayakkabi"]],
      ["Online Alışveriş", ["online", "internet alisverisi"]],
      ["Akaryakıt", ["benzin", "mazot", "akaryakit"]],
      ["Ulaşım", ["ulasim", "taksi", "metro", "otobus"]],
      ["Fatura", ["fatura", "elektrik", "dogalgaz", "internet faturasi"]],
      ["Sağlık", ["saglik", "eczane", "doktor"]],
      ["Sosyal", ["sinema", "eglence", "tatil"]],
    ] : [
      ["Maaş", ["maas", "ucret"]],
      ["Serbest İş", ["serbest is", "freelance"]],
      ["Yatırım", ["yatirim getirisi"]],
      ["Hediye", ["hediye"]],
      ["Promosyon", ["promosyon", "bonus"]],
      ["Harçlık", ["harclik"]],
      ["Borç Ödeme", ["borc odemesi", "borc tahsilati"]],
    ];
    const hint = hints.find(([category, words]) => list.includes(category) && words.some((word) => normalized.includes(normalize(word))));
    return hint?.[0] || "";
  }

  function findEntryAccount(text, method = "") {
    const normalized = normalize(text);
    const accounts = Array.isArray(paymentAccounts) ? paymentAccounts : [];
    const allowedTypes = method === "credit_card" ? ["credit_card"]
      : method === "bank_account" || method === "transfer" ? ["bank_account"]
        : method === "cash" ? ["cash"] : ["cash", "bank_account", "credit_card"];
    const candidates = accounts.map((account) => {
      if (!allowedTypes.includes(account.type)) return null;
      const name = normalize(account.name);
      const bank = normalize(account.bank);
      let score = 0;
      if (name.length > 1 && normalized.includes(name)) score += name.length + 3;
      if (bank.length > 2 && normalized.includes(bank)) score += bank.length;
      if (name.length === 1 && new RegExp(`(?:^|\\s)${name}(?:\\s|$)`).test(normalized)
        && /\b(kredi karti|kart|banka|hesap)\b/.test(normalized)) score += 2;
      return score ? { account, score } : null;
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    if (!candidates.length) return null;
    const best = candidates.filter((item) => item.score === candidates[0].score);
    return best.length === 1 ? best[0].account : null;
  }

  function extractEntryTitle(text) {
    const raw = String(text || "").trim();
    if (/\b(?:baslik|başlık|adi|adı)\s*(?:ekleyeyim mi|olsun mu|ne olsun\??)$/i.test(raw)) return "";
    const explicit = raw.match(/(?:baslik|başlık|islem adi|işlem adı)\s*(?:olarak|:)?\s+(.+)/i);
    if (explicit) return explicit[1].replace(/[.!?]+$/, "").trim().slice(0, 40);

    const storeMatch = raw.match(/\b(?:market|magaza|mağaza|dukkan|dükkan|restoran|lokanta|kafe)(?:ten|tan|den|dan)\b/i);
    if (!storeMatch) return extractPurchaseTitle(raw) || extractServiceTitle(raw);
    let prefix = raw.slice(0, storeMatch.index).trim();
    const paymentCue = prefix.match(/.*\b(?:kartimla|kartımla|kartiyla|kartıyla|hesabimla|hesabımla|hesabimdan|hesabımdan|nakit olarak)\s+/i);
    if (paymentCue) prefix = prefix.slice(paymentCue.index + paymentCue[0].length);
    if (prefix.includes("isimli")) prefix = prefix.slice(prefix.lastIndexOf("isimli") + "isimli".length);
    const words = prefix.replace(/\b(ben|su|şu|isimli)\b/gi, " ").trim().split(/\s+/).filter(Boolean);
    const title = words.slice(-3).join(" ").replace(/^[\s,.-]+|[\s,.-]+$/g, "");
    return title && !/^(market|magaza|mağaza|dukkan|dükkan)$/i.test(title) ? title.slice(0, 40) : "";
  }

  function applyDetectedEntryDetails(draft, text, { allowBareAmount = false } = {}) {
    const inferredType = inferEntryType(text);
    if (!draft.type && inferredType) draft.type = inferredType;
    if (!draft.amount) draft.amount = extractEntryAmount(text, allowBareAmount);
    if (draft.type === "transfer") {
      draft.paymentMethod = "transfer";
      draft.category = draft.category || "Transfer";
    } else if (draft.type && !draft.category) {
      draft.category = findEntryCategory(text, draft.type);
    }
    const method = inferPaymentMethod(text);
    if (!draft.paymentMethod && method) draft.paymentMethod = method;
    const account = findEntryAccount(text, draft.paymentMethod || method);
    if (account) {
      draft.paymentAccountId = draft.paymentAccountId || account.id;
      if (!draft.paymentMethod) draft.paymentMethod = account.type === "credit_card" ? "credit_card" : account.type === "bank_account" ? "bank_account" : "cash";
    }
    draft.date = draft.date || resolveEntryDate(text);
    if (!draft.title) {
      draft.title = extractEntryTitle(text);
      if (draft.title) draft.titleWasProvided = true;
    }
    return draft;
  }

  function formatEntryAccount(accountId) {
    const account = paymentAccounts.find((item) => String(item.id) === String(accountId));
    if (!account) return "Hesap seçilmedi";
    const label = formatPaymentAccountName(account);
    const typeLabel = account.type === "credit_card" ? "kredi kartı" : account.type === "bank_account" ? "banka hesabı" : "nakit hesabı";
    return normalize(label).includes(normalize(typeLabel)) ? label : `${label} ${typeLabel}`;
  }

  function getAccountsForMethod(method) {
    const types = paymentMethodAccountTypes[method] || [];
    return paymentAccounts.filter((account) => types.includes(account.type));
  }

  function getAnyTransferAccounts(excludeId = "") {
    return paymentAccounts.filter((account) => String(account.id) !== String(excludeId));
  }

  function entryTypeLabel(type) {
    return type === "income" ? "Gelir" : type === "transfer" ? "Transfer" : "Gider";
  }

  function paymentMethodLabel(method) {
    return ({ cash: "Nakit", credit_card: "Kredi kartı", bank_account: "Banka kartı / hesabı", transfer: "Havale / EFT", other: "Diğer" })[method] || "Belirtilmedi";
  }

  function entrySummary(draft) {
    const title = draft.titleWasProvided === false ? `${draft.title || draft.category} (başlık eklenmedi)` : draft.title || draft.category;
    const category = draft.category || "Kategori yok";
    const dateLabel = formatDate(draft.date);
    if (draft.type === "transfer") {
      return `Transfer · ${category} · ${title} · ${formatMoney(draft.amount)}\nKaynak: ${formatEntryAccount(draft.paymentAccountId)} → Hedef: ${formatEntryAccount(draft.transferAccountId)}\nTarih: ${dateLabel}`;
    }
    const account = draft.paymentAccountId ? ` · ${formatEntryAccount(draft.paymentAccountId)}` : "";
    return `${entryTypeLabel(draft.type)} · ${category} · ${title} · ${formatMoney(draft.amount)}\nÖdeme: ${paymentMethodLabel(draft.paymentMethod)}${account}\nTarih: ${dateLabel}`;
  }

  function renderPendingEntry() {
    messageList.querySelector("[data-assistant-pending]")?.remove();
    const card = document.createElement("section");
    card.className = "budget-assistant-confirmation";
    card.dataset.assistantPending = "true";
    const heading = document.createElement("strong");
    heading.textContent = "Kayıt bilgilerini kontrol et";
    const details = document.createElement("p");
    details.textContent = entrySummary(pendingEntry);
    const actions = document.createElement("div");
    actions.className = "budget-assistant-confirmation-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "budget-assistant-secondary";
    edit.textContent = "Formda düzenle";
    edit.addEventListener("click", editPendingEntry);
    const save = document.createElement("button");
    save.type = "button";
    save.className = "budget-assistant-primary";
    save.textContent = "Kaydı ekle";
    save.addEventListener("click", savePendingEntry);
    actions.append(edit, save);
    card.append(heading, details, actions);
    messageList.append(card);
    scrollMessagesToEnd();
  }

  function editPendingEntry() {
    if (!pendingEntry) return;
    const draft = { ...pendingEntry };
    pendingEntry = null;
    pendingEntryStep = "";
    messageList.querySelector("[data-assistant-pending]")?.remove();
    closeAssistant();
    openEntryModal();
    typeInput.value = draft.type;
    updateCategoryOptions(draft.type);
    categoryInput.value = draft.category;
    paymentMethodInput.value = draft.paymentMethod;
    paymentMethodInput.disabled = false;
    syncEntryTransferVisibility();
    if (draft.type === "transfer") {
      updateAnyPaymentAccountSelect(paymentAccountSelect, draft.paymentAccountId, { excludeId: draft.transferAccountId, placeholder: "Kaynak kart / hesap seç" });
      updateEntryTransferAccountSelect(draft.transferAccountId);
    } else {
      updatePaymentAccountSelect(paymentAccountSelect, draft.paymentMethod, draft.paymentAccountId);
    }
    document.getElementById("title").value = draft.title || draft.category;
    document.getElementById("amount").value = String(draft.amount);
    dateInput.value = draft.date;
    setStatus("");
  }

  function savePendingEntry() {
    if (!pendingEntry) return;
    const draft = { ...pendingEntry };
    const priorIds = new Set(transactions.map((item) => item.id));
    openEntryModal();
    typeInput.value = draft.type;
    updateCategoryOptions(draft.type);
    categoryInput.value = draft.category;
    document.getElementById("title").value = draft.title;
    document.getElementById("amount").value = String(draft.amount);
    dateInput.value = draft.date;
    paymentMethodInput.value = draft.paymentMethod;
    paymentMethodInput.disabled = false;
    syncEntryTransferVisibility();
    if (draft.type === "transfer") {
      updateAnyPaymentAccountSelect(paymentAccountSelect, draft.paymentAccountId, { excludeId: draft.transferAccountId, placeholder: "Kaynak kart / hesap seç" });
      updateEntryTransferAccountSelect(draft.transferAccountId);
    } else {
      updatePaymentAccountSelect(paymentAccountSelect, draft.paymentMethod, draft.paymentAccountId);
    }
    form.requestSubmit();
    const added = transactions.some((item) => !priorIds.has(item.id));
    if (added) {
      pendingEntry = null;
      pendingEntryStep = "";
      pendingTopicChange = null; lastReportQuestion = ""; insights.reset(); awaitingNextEntry = true;
      messageList.querySelector("[data-assistant-pending]")?.remove();
      const description = draft.type === "transfer"
        ? `${formatEntryAccount(draft.paymentAccountId)} hesabından ${formatEntryAccount(draft.transferAccountId)} hesabına ${formatMoney(draft.amount)} transfer eklendi (${formatDate(draft.date)}).`
        : `${draft.category} kategorisinde ${draft.titleWasProvided !== false && draft.title ? `${draft.title} başlıklı ` : ""}${formatEntryAccount(draft.paymentAccountId) === "Hesap seçilmedi" ? paymentMethodLabel(draft.paymentMethod) : formatEntryAccount(draft.paymentAccountId)} ile yapılan ${formatMoney(draft.amount)} tutarındaki ${entryTypeLabel(draft.type).toLocaleLowerCase("tr-TR")} ${formatDate(draft.date)} tarihli olarak eklendi.`;
      appendMessage(`${description}\nBaşka bir işlem ekleyeyim mi?`);
      addPromptButtons(["Evet, yeni işlem", "Hayır, bitir", "Başka konu"]);
    } else {
      pendingEntry = draft;
      appendMessage(entryFormStatus?.textContent || "Kayıt formu doğrulamasından geçmedi. Bilgileri düzenleyip yeniden deneyebiliriz.");
    }
  }

  function askEntryStep(step, question, options = []) {
    pendingEntryStep = step;
    appendMessage(question);
    if (options.length) addPromptButtons(options);
  }

  function cancelEntryConversation() {
    const hadEntry = Boolean(pendingEntry);
    const hadPending = Boolean(pendingEntry || pendingTopicChange || pendingFinanceQuestion || awaitingNextEntry || awaitingReportContinue);
    pendingEntry = null;
    pendingEntryStep = "";
    pendingTopicChange = null;
    pendingFinanceQuestion = null;
    awaitingNextEntry = false;
    awaitingReportContinue = false;
    lastReportQuestion = "";
    lastCategoryReport = null;
    insights.reset();
    microphone.cancel();
    stopAssistantSpeech();
    messageList.querySelector("[data-assistant-pending]")?.remove();
    messageList.querySelectorAll(".budget-assistant-prompts").forEach(group => group.remove());
    appendMessage(hadEntry ? "Kayıt taslağını iptal ettim; hiçbir hareket eklenmedi."
      : hadPending ? "Bekleyen işlemi iptal ettim. Daha önce kaydedilmiş kayıtların değişmedi."
        : "İptal edilecek açık bir kayıt taslağı yok. Daha önce kaydedilmiş kayıtların değişmedi.");
    addPromptButtons(["Gider ekle", "Gelir ekle", "Bu ayın özeti"]);
  }

  function isAssistantCancelNegation(text) {
    return /\b(iptal\s*(?:etme|etmeyelim|etmeyin|etmeyiniz)|vaz\s*gecme|vaz\s*gecmeyelim|vaz\s*gecmiyorum|iptal (?:etmek )?istemiyorum)\b/.test(normalize(text));
  }

  function isAssistantCancelCommand(text) {
    const normalized = normalize(text);
    if (/\b(nasil|nereden|nedir|ne demek)\b/.test(normalized)) return false;
    if (isAssistantCancelNegation(text)) return false;
    return /\b(iptal\s*(?:et|edelim|edin|etsene|edip|eder misin|eder misiniz|edebilir misin|etmek istiyorum)|vaz\s*gec(?:tim|elim|in|iniz)?|bos\s*ver|kaydetme(?:yin|yelim)?|ekleme(?:yin|yelim)?|(?:kaydetmek|eklemek) istemiyorum)\b/.test(normalized)
      || /\biptal$/.test(normalized)
      || /\b(?:islemi|kaydi|taslagi) durdur\b/.test(normalized);
  }

  function isAssistantSaveConfirmation(text) {
    return /^(?:evet|tamam|onayliyorum|onayla|kaydet|ekle)(?: (?:bu|kaydi|islemi|kaydet|ekle|onayla|lutfen))*$/.test(normalize(text));
  }

  function advanceEntryConversation() {
    const draft = pendingEntry;
    if (!draft.type) {
      askEntryStep("type", "Bu hareket gelir, gider yoksa hesaplar arası transfer mi?", ["Gider", "Gelir", "Transfer"]);
      return;
    }
    if (!draft.amount) {
      askEntryStep("amount", "İşlem tutarı kaç TL? Örneğin 250 TL.");
      return;
    }
    if (draft.type === "transfer") {
      draft.paymentMethod = "transfer";
      draft.category = draft.category || "Transfer";
      const accounts = getAnyTransferAccounts();
      if (accounts.length < 2) {
        askEntryStep("transferUnavailable", "Transferi kaydetmek için en az iki kart veya hesap tanımlı olmalı. Ayarlar bölümünden hesap ekleyip yeniden deneyebilirsin.", ["Vazgeç"]);
        return;
      }
      if (!draft.paymentAccountId) {
        askEntryStep("transferSource", "Para hangi kart veya hesaptan çıkacak?", accounts.map(formatPaymentAccountName));
        return;
      }
      if (!draft.transferAccountId) {
        const targets = getAnyTransferAccounts(draft.paymentAccountId);
        askEntryStep("transferTarget", "Para hangi kart veya hesaba aktarılacak?", targets.map(formatPaymentAccountName));
        return;
      }
    } else {
      if (!draft.category) {
        const categories = transactionCategories?.[draft.type] || [];
        askEntryStep("category", "Hangi kategoriye ekleyeyim?", [...new Set(categories)].filter(Boolean));
        return;
      }
      if (!draft.paymentMethod) {
        askEntryStep("paymentMethod", "Ödeme şekli neydi?", ["Nakit", "Kredi kartı", "Banka kartı / hesap", "Havale / EFT"]);
        return;
      }
      const needsAccount = ["credit_card", "bank_account", "transfer"].includes(draft.paymentMethod);
      if (needsAccount && !draft.paymentAccountId) {
        const accounts = getAccountsForMethod(draft.paymentMethod);
        if (!accounts.length) {
          askEntryStep("accountUnavailable", `${paymentMethodLabel(draft.paymentMethod)} için tanımlı bir hesap bulamadım. Önce Kartlar / Hesaplar bölümünden hesap ekleyebilirsin.`, draft.type === "expense" ? ["Nakit", "Vazgeç"] : ["Vazgeç"]);
          return;
        }
        askEntryStep("paymentAccount", `Hangi ${draft.paymentMethod === "credit_card" ? "kredi kartını" : "banka kartını veya hesabı"} kullandın?`, accounts.map(formatPaymentAccountName));
        return;
      }
    }
    if (!draft.date) {
      askEntryStep("dateChoice", "Tarihi bugün olarak mı kaydedeyim?", ["Bugün", "Başka tarih"]);
      return;
    }
    if (!draft.title) {
      askEntryStep("title", "İşlem için hangi başlığı yazayım? Başlık istemiyorsan “Başlıksız” diyebilirsin.");
      return;
    }
    draft.title = draft.title.slice(0, 40);
    pendingEntryStep = "confirm";
    appendMessage("Bilgileri netleştirdim. Kaydetmeden önce son kez kontrol et:");
    renderPendingEntry();
  }

  function applyStepAnswer(text) {
    const draft = pendingEntry;
    const normalized = normalize(text);
    if (isAssistantCancelCommand(text)) {
      cancelEntryConversation();
      return;
    }
    if (pendingEntryStep === "type") {
      const type = inferEntryType(text);
      if (!type) {
        appendMessage("İşlem türünü netleştiremedim. Gelir, gider veya transfer olarak seçebilirsin.");
        addPromptButtons(["Gider", "Gelir", "Transfer"]);
        return;
      }
      draft.type = type;
      if (type === "transfer") {
        draft.paymentMethod = "transfer";
        draft.category = "Transfer";
      } else if (!draft.category) {
        draft.category = findEntryCategory(draft.context, type);
      }
    } else if (pendingEntryStep === "amount") {
      const amount = extractEntryAmount(text, true);
      if (!amount) {
        appendMessage("Tutarı anlayamadım. Örneğin “250 TL” yazabilir veya söyleyebilirsin.");
        return;
      }
      draft.amount = amount;
    } else if (pendingEntryStep === "category") {
      const category = findEntryCategory(text, draft.type);
      if (!category) {
        appendMessage("Bu kategori kayıtlı seçeneklerle eşleşmedi. Listeden seçebilir veya kategori adını tam yazabilirsin.");
        addPromptButtons([...new Set(transactionCategories?.[draft.type] || [])].filter(Boolean));
        return;
      }
      draft.category = category;
    } else if (pendingEntryStep === "paymentMethod") {
      const method = inferPaymentMethod(text);
      if (!method) {
        appendMessage("Ödeme şeklini netleştiremedim. Nakit, kredi kartı, banka kartı/hesabı veya havale/EFT diyebilirsin.");
        addPromptButtons(["Nakit", "Kredi kartı", "Banka kartı / hesap", "Havale / EFT"]);
        return;
      }
      draft.paymentMethod = method;
      const account = findEntryAccount(text, method);
      if (account) draft.paymentAccountId = account.id;
      const matching = getAccountsForMethod(method);
      if (!draft.paymentAccountId && matching.length === 1 && method !== "cash") draft.paymentAccountId = matching[0].id;
    } else if (pendingEntryStep === "paymentAccount") {
      const account = findEntryAccount(text, draft.paymentMethod)
        || getAccountsForMethod(draft.paymentMethod).find((item) => normalize(item.name) === normalized);
      if (!account || !getAccountsForMethod(draft.paymentMethod).some((item) => item.id === account.id)) {
        appendMessage("Bu ödeme şekliyle eşleşen hesabı bulamadım. Hesap adını ayarlardaki gibi yazabilir veya aşağıdan seçebilirsin.");
        addPromptButtons(getAccountsForMethod(draft.paymentMethod).map(formatPaymentAccountName));
        return;
      }
      draft.paymentAccountId = account.id;
    } else if (pendingEntryStep === "transferSource" || pendingEntryStep === "transferTarget") {
      const excluded = pendingEntryStep === "transferTarget" ? draft.paymentAccountId : draft.transferAccountId;
      const account = findEntryAccount(text, "") || paymentAccounts.find((item) => normalize(formatPaymentAccountName(item)) === normalized);
      if (!account || String(account.id) === String(excluded)) {
        appendMessage("Farklı bir kart veya hesap seçmelisin.");
        addPromptButtons(getAnyTransferAccounts(excluded).map(formatPaymentAccountName));
        return;
      }
      if (pendingEntryStep === "transferSource") draft.paymentAccountId = account.id;
      else draft.transferAccountId = account.id;
    } else if (pendingEntryStep === "dateChoice") {
      const date = resolveEntryDate(text);
      if (date) draft.date = date;
      else if (/\b(hayir|hayır|yok|baska tarih|başka tarih|daha sonra)\b/.test(normalized)) {
        askEntryStep("dateValue", "Hangi tarihte gerçekleşti? Örneğin “30 Eylül” veya “30.09.2026”.");
        return;
      } else {
        appendMessage("Bugün mü, başka bir tarih mi? Tarihi netleştirelim.");
        addPromptButtons(["Bugün", "Başka tarih"]);
        return;
      }
    } else if (pendingEntryStep === "dateValue") {
      const date = resolveEntryDate(text);
      if (!date) {
        appendMessage("Tarihi anlayamadım. Gün ve ayı “30 Eylül” ya da “30.09.2026” biçiminde yazabilir misin?");
        return;
      }
      draft.date = date;
    } else if (pendingEntryStep === "title") {
      if (/\b(basliksiz|başlıksız|hayir|hayır|gerek yok|istemiyorum|ekleme)\b/.test(normalized)) {
        draft.title = draft.category || "Transfer";
        draft.titleWasProvided = false;
      } else {
        const title = text.replace(/\b(yazabilirsin|yaz|olsun|ekle|ekleyebilirsin)\b/gi, " ").replace(/[.!?]+$/g, "").replace(/\s+/g, " ").trim().replace(/^["'“”]+|["'“”]+$/g, "");
        if (!title) {
          appendMessage("Başlığı yazabilir veya “Başlıksız” diyebilirsin.");
          return;
        }
        draft.title = title.slice(0, 40);
        draft.titleWasProvided = true;
      }
    } else if (pendingEntryStep === "accountUnavailable") {
      if (normalize(text) === "nakit" && draft.type === "expense") {
        draft.paymentMethod = "cash";
        draft.paymentAccountId = "";
      } else {
        appendMessage("Hesap olmadan bu ödeme türünde kayıt oluşturamam. Hesap ekledikten sonra yeniden deneyebilir veya taslağı iptal edebilirsin.");
        addPromptButtons(["Vazgeç"]);
        return;
      }
    } else if (pendingEntryStep === "transferUnavailable") {
      cancelEntryConversation();
      return;
    }

    draft.context = `${draft.context || ""} ${text}`.trim();
    applyDetectedEntryDetails(draft, text, { allowBareAmount: pendingEntryStep === "amount" });
    if (draft.type && draft.type !== "transfer" && !draft.category) draft.category = findEntryCategory(draft.context, draft.type);
    pendingEntryStep = "";
    advanceEntryConversation();
  }

  function beginEntryConversation(text) {
    const action = hasExplicitEntryAction(text);
    const cue = /\b(harcadim|harcadik|harcama yaptim|alisveris yaptim|alisveris yaptik|satin aldim|aldim|aldik|odedim|odeme yaptim|kazandim|maas aldim|tahsil ettim|para geldi|aktardim|para gonderdim)\b/.test(normalize(text)) || Boolean(extractPurchaseTitle(text));
    const amount = extractEntryAmount(text, action);
    const reportQuestion = /\b(ozet\w*|en cok|en az|en yuksek|en dusuk|en buyuk|en kucuk|ne kadar|hangi\w*|neler|goster|listele|detay\w*|toplam|karsilastir\w*|mi|mu)\b/.test(normalize(text)) || /[?？]/.test(String(text || ""));
    if (!action && reportQuestion) return false;
    if (!action && !cue && !amount) return false;
    const draft = { type: "", amount: 0, category: "", title: "", titleWasProvided: false, paymentMethod: "", paymentAccountId: "", transferAccountId: "", date: "", context: String(text || "") };
    applyDetectedEntryDetails(draft, text, { allowBareAmount: action });
    if (draft.type === "transfer") {
      draft.category = "Transfer";
      draft.paymentMethod = "transfer";
    }
    pendingEntry = draft;
    advanceEntryConversation();
    return true;
  }

  function respondToCommand(text) {
    const normalized = normalize(text);
    if (/\b(merhaba|selam|gunaydin|iyi aksamlar)\b/.test(normalized)) {
      appendMessage("Merhaba! Bu cihazdaki gelir ve gider kayıtlarını inceleyebilir, yeni kayıt için de sana yardımcı olabilirim.");
      addPromptButtons(assistantQuickPrompts);
      return;
    }
    if (respondWithInsights(text)) return;
    if (beginEntryConversation(text)) { lastReportQuestion = ""; insights.reset(); return; }
    if (respondToFinanceQuestion(text)) return;
    appendMessage("Bu isteği güvenilir bir raporla eşleştiremedim. Dönemle birlikte gelir/gider, kategori, işyeri veya hesap adını belirtebilirsin. Kayıtlarında olmayan bir tutarı tahmin etmem. “Ne sorabilirim?” ile tüm konuları görebilirsin.");
    lastReportQuestion = ""; awaitingReportContinue = false; insights.reset();
    addPromptButtons(["Ne sorabilirim?", "Bu ayın özeti", "Bugünkü giderlerim neler?", "Gider ekle"]);
  }

  function sendAssistantInput(value = input.value, { focus = true } = {}) {
    const message = String(value || "").trim();
    if (!message) return;
    if (assistantCloseTimer !== null) {
      window.clearTimeout(assistantCloseTimer);
      assistantCloseTimer = null;
      stopAssistantSpeech();
    }
    messageList.querySelectorAll(".budget-assistant-prompts").forEach((group) => group.remove());
    appendMessage(message, "user");
    input.value = "";
    resizeAssistantInput();
    setStatus("");
    if (isAssistantEndCommand(message)) {
      endAssistantConversation();
      return;
    }
    const normalized = normalize(message);
    if (isAssistantCancelCommand(message)) {
      cancelEntryConversation();
      return;
    }
    if (pendingEntry && isAssistantCancelNegation(message)) {
      appendMessage("İptal etmedim; taslak duruyor. Kaydetmeden önce işleme devam edelim.");
      advanceEntryConversation();
      return;
    }
    if (awaitingNextEntry) {
      awaitingNextEntry = false;
      if (/^(evet|tamam|devam|devam et|evet yeni islem|yeni islem)$/.test(normalized)) {
        beginEntryConversation("Yeni işlem ekle"); return;
      }
      if (/^(hayir|hayir bitir|istemiyorum|bitti)$/.test(normalized)) {
        appendMessage("Tamam, kayıt işlemini bitirdik. Başka bir konuda sorabilirsin."); addPromptButtons(assistantQuickPrompts); return;
      }
    }
    if (pendingTopicChange) {
      const nextQuestion = pendingTopicChange.message;
      if (/^(evet|tamam|devam|isleme devam et|bu isleme devam et|devam et)$/.test(normalized)) {
        pendingTopicChange = null;
        appendMessage("Tamam, yarım kalan işleme devam edelim. Henüz kaydetmedim.");
        advanceEntryConversation();
      } else if (/^(hayir|yeni soruya gec|yeni konuya gec|baska konu|yeni sorum|soruma gec)$/.test(normalized)) {
        pendingTopicChange = null; pendingEntry = null; pendingEntryStep = ""; pendingFinanceQuestion = null; lastReportQuestion = ""; insights.reset();
        messageList.querySelector("[data-assistant-pending]")?.remove();
        appendMessage("Önceki taslak kaydedilmedi. Yeni soruna geçiyorum.");
        respondToCommand(nextQuestion);
      } else if (/^(iptal|vazgec|hepsini iptal et)$/.test(normalized)) {
        pendingTopicChange = null; cancelEntryConversation(); lastReportQuestion = ""; insights.reset();
      } else {
        appendMessage("Yarım kalan işleme devam edeyim mi, yoksa yeni soruna mı geçeyim? “Evet” yalnızca işleme devam eder; kayıt onayı değildir.");
        addPromptButtons(["İşleme devam et", "Yeni soruya geç", "Hepsini iptal et"]);
      }
      return;
    }
    if (pendingEntry && ((isIndependentReportQuestion(message) || /\b(ne sorabilirim|nasil|yardim)\b/.test(normalize(message))) && !hasExplicitEntryAction(message) || /\b(gelir|gider|transfer) ekle\b/.test(normalized))) {
      pendingTopicChange = { message };
      appendMessage("Yarım kalan bir kayıt var. Bu işleme devam edeyim mi, yoksa yeni soruna mı geçeyim? Onaylamadığın kayıt kaydedilmedi.");
      addPromptButtons(["İşleme devam et", "Yeni soruya geç", "Hepsini iptal et"]);
    } else if (pendingFinanceQuestion?.kind === "recordOrder") {
      const order = getAssistantRecordOrder(message) || (/\b(secilen|kaydedilen) tarihe\b/.test(normalize(message)) ? "date" : "");
      if (order) {
        const question = pendingFinanceQuestion.text;
        pendingFinanceQuestion = null;
        appendMessage(getAssistantRecordsReport(question, { order }));
      } else if (!respondToFinanceQuestion(message)) {
        appendMessage("Eklenme zamanını mı, kayıtta seçilen işlem tarihini mi kullanayım?");
        addPromptButtons(["Eklenme zamanına göre", "Kayıtta seçilen tarihe göre"]);
      }
    } else if (pendingFinanceQuestion) {
      const account = findEntryAccount(message, "")
        || paymentAccounts.find((item) => normalize(item.name) === normalize(message) || normalize(formatPaymentAccountName(item)) === normalize(message));
      if (account) {
        pendingFinanceQuestion = null;
        appendMessage(getAssistantCardReport(account));
      } else if (!respondToFinanceQuestion(message)) {
        appendMessage("Bu adla eşleşen kartı veya hesabı bulamadım. Listeden seçebilir ya da kayıtlı tam adını yazabilirsin.");
        addPromptButtons(paymentAccounts.map(formatPaymentAccountName));
      }
    } else if (pendingEntry && pendingEntryStep === "confirm") {
      const normalized = normalize(message);
      if (/^hayir$/.test(normalized)) {
        cancelEntryConversation();
      } else if (/\b(duzenle|degistir|duzelt)\b/.test(normalized)) {
        editPendingEntry();
      } else if (isAssistantSaveConfirmation(message)) {
        savePendingEntry();
      } else {
        appendMessage("Bu bilgileri kaydedeyim mi? Kaydetmek için “Evet”, değiştirmek için “Düzenle” diyebilirsin.");
        addPromptButtons(["Evet, kaydet", "Düzenle", "Vazgeç"]);
      }
    } else if (pendingEntry) {
      applyStepAnswer(message);
    } else {
      if (/^(devam|devam et|evet|tamam)$/.test(normalized) && lastReportQuestion) {
        if (awaitingReportContinue) respondToCommand(resolveReportFollowup("Daha detaylı"));
        else {
          awaitingReportContinue = true;
          appendMessage("Son raporun ayrıntılarıyla devam edeyim mi? Tarihi veya istediğin adedi söyleyebilir, “başka konu” da diyebilirsin.");
          addPromptButtons(["Daha detaylı", "Peki geçen ay?", "Başka konu"]);
        }
      } else if (/^(yeni konu|baska konu|konuyu degistir)$/.test(normalized)) {
        lastReportQuestion = ""; awaitingReportContinue = false; pendingFinanceQuestion = null; insights.reset();
        appendMessage("Tamam, yeni konuya geçelim. Ne hakkında yardımcı olayım?"); addPromptButtons(assistantQuickPrompts);
      } else respondToCommand(resolveReportFollowup(message));
    }
    if (focus && window.innerWidth > 980) input.focus({ preventScroll: true });
  }

  function openAssistant() {
    if (assistantCloseTimer !== null) window.clearTimeout(assistantCloseTimer);
    assistantCloseTimer = null;
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    syncAssistantViewport();
    window.lucide?.createIcons();
    if (window.innerWidth > 980) input.focus({ preventScroll: true });
    scrollMessagesToEnd();
  }

  function closeAssistant({ restoreFocus = true } = {}) {
    if (assistantCloseTimer !== null) window.clearTimeout(assistantCloseTimer);
    assistantCloseTimer = null;
    microphone.cancel();
    stopAssistantSpeech();
    input.blur();
    panel.hidden = true;
    releaseAssistantMobileLayout();
    launcher.setAttribute("aria-expanded", "false");
    if (restoreFocus) launcher.focus({ preventScroll: true });
  }

  function syncAssistantViewport() {
    if (panel.hidden) return;
    if (window.innerWidth > 980) {
      releaseAssistantMobileLayout();
      return;
    }
    const root = document.documentElement;
    if (assistantScrollY === null) {
      assistantScrollY = window.scrollY;
      assistantViewportHeight = window.innerHeight;
      root.style.setProperty("--assistant-page-top", `${-assistantScrollY}px`);
      root.classList.add("assistant-mobile-open");
    }
    // The keyboard shrinks the visual viewport, not necessarily the layout viewport.
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight;
    panel.style.setProperty("--assistant-viewport-height", `${height}px`);
    panel.style.setProperty("--assistant-viewport-top", `${viewport?.offsetTop || 0}px`);
    panel.classList.toggle("is-keyboard-open", Math.max(assistantViewportHeight, window.innerHeight) - height > 120);
    panel.setAttribute("aria-modal", "true");
  }

  function releaseAssistantMobileLayout() {
    document.documentElement.classList.remove("assistant-mobile-open");
    document.documentElement.style.removeProperty("--assistant-page-top");
    panel.classList.remove("is-keyboard-open");
    panel.setAttribute("aria-modal", "false");
    if (assistantScrollY !== null) {
      const top = assistantScrollY;
      assistantScrollY = null;
      assistantViewportHeight = 0;
      window.scrollTo({ top, left: 0, behavior: "instant" });
    }
  }

  function isAssistantEndCommand(text) {
    return /^(?:(?:lutfen|artik) )?(?:(?:gorusmeyi|gorusme|sohbeti|sohbet|konusmayi|konusma) (?:sonlandir|bitir|kapat)|asistani kapat|bitir|kapat|konusmak istemiyorum)(?: lutfen)?$/.test(normalize(text));
  }

  function endAssistantConversation() {
    pendingEntry = null;
    pendingEntryStep = "";
    pendingFinanceQuestion = null;
    pendingTopicChange = null;
    lastReportQuestion = "";
    awaitingNextEntry = false;
    lastCategoryReport = null;
    insights.reset();
    messageList.querySelector("[data-assistant-pending]")?.remove();
    microphone.cancel();
    micButton.classList.remove("is-listening");
    stopAssistantSpeech();
    const farewell = "Görüşmek üzere. Onaylanmamış işlem kaydedilmedi.";
    appendMessage(farewell);
    latestSpokenReply = farewell;
    if (window.speechSynthesis) speakButton.click();
    assistantCloseTimer = window.setTimeout(() => {
      assistantCloseTimer = null;
      closeAssistant();
    }, 3000);
  }

  const launcherPositionKey = "akisButceAssistantLauncherPositionV1";
  let launcherDrag = null;
  let suppressLauncherClickUntil = 0;

  function clampLauncherPosition(left, top) {
    const size = launcher.getBoundingClientRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const safe = (name) => Number.parseFloat(rootStyle.getPropertyValue(name)) || 0;
    const safeLeft = document.documentElement.dataset.mobilePlatform === "ios" ? safe("--assistant-safe-left") : 0;
    const safeRight = document.documentElement.dataset.mobilePlatform === "ios" ? safe("--assistant-safe-right") : 0;
    const safeTop = document.documentElement.dataset.mobilePlatform === "ios" ? safe("--assistant-safe-top") : 0;
    const safeBottom = document.documentElement.dataset.mobilePlatform === "ios" ? safe("--assistant-safe-bottom") : 0;
    const dock = document.querySelector(".mobile-dock");
    const dockRect = dock?.getClientRects().length ? dock.getBoundingClientRect() : null;
    const bottom = Math.min(
      window.innerHeight - size.height - 8 - safeBottom,
      dockRect ? dockRect.top - size.height - 12 : Infinity,
    );
    return {
      left: Math.max(8 + safeLeft, Math.min(window.innerWidth - size.width - 8 - safeRight, left)),
      top: Math.max(8 + safeTop, Math.min(bottom, top)),
    };
  }

  function setLauncherPosition(left, top, persist = false) {
    const position = clampLauncherPosition(left, top);
    launcher.style.left = `${position.left}px`;
    launcher.style.top = `${position.top}px`;
    launcher.style.right = "auto";
    launcher.style.bottom = "auto";
    if (persist) {
      try {
        localStorage.setItem(launcherPositionKey, JSON.stringify(position));
      } catch { }
    }
  }

  try {
    const savedPosition = JSON.parse(localStorage.getItem(launcherPositionKey) || "null");
    if (Number.isFinite(savedPosition?.left) && Number.isFinite(savedPosition?.top)) {
      requestAnimationFrame(() => setLauncherPosition(savedPosition.left, savedPosition.top));
    }
  } catch { }

  launcher.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = launcher.getBoundingClientRect();
    launcherDrag = { pointerId: event.pointerId, pointerType: event.pointerType, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, moved: false };
    try { launcher.setPointerCapture(event.pointerId); } catch { }
  });
  launcher.addEventListener("pointermove", (event) => {
    if (!launcherDrag || event.pointerId !== launcherDrag.pointerId) return;
    const dx = event.clientX - launcherDrag.startX;
    const dy = event.clientY - launcherDrag.startY;
    const dragThreshold = launcherDrag.pointerType === "touch" ? 3 : 7;
    if (!launcherDrag.moved && Math.hypot(dx, dy) < dragThreshold) return;
    launcherDrag.moved = true;
    event.preventDefault();
    launcher.classList.add("is-dragging");
    setLauncherPosition(launcherDrag.left + dx, launcherDrag.top + dy);
  });
  const finishLauncherDrag = (event) => {
    if (!launcherDrag || event.pointerId !== launcherDrag.pointerId) return;
    const drag = launcherDrag;
    launcherDrag = null;
    launcher.classList.remove("is-dragging");
    if (drag.moved) {
      const rect = launcher.getBoundingClientRect();
      setLauncherPosition(rect.left, rect.top, true);
      suppressLauncherClickUntil = Date.now() + 500;
    }
  };
  launcher.addEventListener("pointerup", finishLauncherDrag);
  launcher.addEventListener("pointercancel", finishLauncherDrag);
  launcher.addEventListener("lostpointercapture", finishLauncherDrag);
  window.addEventListener("resize", () => {
    if (launcher.getClientRects().length && launcher.style.left && launcher.style.top) {
      const rect = launcher.getBoundingClientRect();
      setLauncherPosition(rect.left, rect.top, true);
    }
  });
  launcher.addEventListener("click", (event) => {
    if (event.detail !== 0 && Date.now() < suppressLauncherClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    panel.hidden ? openAssistant() : closeAssistant();
  });
  panel.querySelector("[data-assistant-close]").addEventListener("click", closeAssistant);
  panel.querySelector("[data-assistant-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    sendAssistantInput();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendAssistantInput();
    }
  });
  input.addEventListener("input", resizeAssistantInput);
  speakButton.addEventListener("click", () => {
    if (!latestSpokenReply || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    if (assistantSpeaking) {
      stopAssistantSpeech();
      return;
    }
    microphone.cancel();
    speaker.read(prepareAssistantSpeech(latestSpokenReply));
  });
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    speakButton.disabled = true;
    speakButton.title = "Bu tarayıcı sesli yanıtı desteklemiyor";
  }
  const microphone = createBudgetMicrophone({
    button: micButton,
    Recognition: recognitionType,
    onSend: (text) => sendAssistantInput(text, { focus: false }),
    onStatus: setStatus,
    stopPlayback: stopAssistantSpeech,
    onTranscript: (text, active) => {
      panel.querySelector("[data-assistant-voice-preview]").hidden = !active;
      panel.querySelector("[data-assistant-transcript]").textContent = text || "Dinliyorum…";
    },
  });
  const speaker = createBudgetAssistantSpeaker({
    onState: speaking => { assistantSpeaking = speaking; updateSpeakButton(); },
    onError: () => setStatus("Sesli yanıt okunamadı. Yanıtı yazılı olarak inceleyebilir veya tekrar deneyebilirsin."),
  });
  panel.querySelector("[data-assistant-cancel-voice]").addEventListener("click", () => { microphone.cancel(); setStatus("Sesli mesaj iptal edildi."); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { microphone.cancel(); stopAssistantSpeech(); } });

  let assistantOwner = currentUser?.uid || "";
  const updateVisibility = () => {
    const owner = currentUser?.uid || "";
    if (owner !== assistantOwner) {
      assistantOwner = owner;
      pendingEntry = null; pendingEntryStep = ""; pendingTopicChange = null; pendingFinanceQuestion = null;
      lastReportQuestion = ""; lastCategoryReport = null; awaitingReportContinue = false; awaitingNextEntry = false; insights.reset();
      microphone.cancel(); stopAssistantSpeech(); setStatus(""); input.value = "";
      messageList.replaceChildren();
      appendMessage("Merhaba! Bu oturumdaki kayıtların hakkında sorabilir veya yeni işlem ekleyebilirsin.");
      addPromptButtons(assistantQuickPrompts);
    }
    const modalOpen = [...document.querySelectorAll(".modal-backdrop")].some((modal) => !modal.hidden);
    const settingsOpen = document.documentElement.dataset.activeView === "settingsView";
    const visible = Boolean(appShell && !appShell.hidden && !document.documentElement.classList.contains("auth-logged-out") && !modalOpen && !settingsOpen);
    launcher.hidden = !visible;
    if (!visible && !panel.hidden) {
      closeAssistant({ restoreFocus: !settingsOpen });
    }
  };
  window.visualViewport?.addEventListener("resize", syncAssistantViewport);
  window.visualViewport?.addEventListener("scroll", syncAssistantViewport);
  window.addEventListener("resize", syncAssistantViewport);
  window.addEventListener("pagehide", () => { microphone.cancel(); stopAssistantSpeech(); });
  if (appShell && window.MutationObserver) {
    new MutationObserver(updateVisibility).observe(appShell, { attributes: true, attributeFilter: ["hidden"] });
    new MutationObserver(updateVisibility).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-active-view"] });
    document.querySelectorAll(".modal-backdrop").forEach((modal) => {
      new MutationObserver(updateVisibility).observe(modal, { attributes: true, attributeFilter: ["hidden"] });
    });
  }

  appendMessage("Merhaba, ben Akış Bütçe Asistanı. Kayıtlarını özetleyebilir veya gelir/gider eklemene yardımcı olabilirim.");
  addPromptButtons(assistantQuickPrompts);
  updateVisibility();
  window.lucide?.createIcons();
})();
