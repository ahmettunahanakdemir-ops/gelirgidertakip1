// Assistant UI, speech and accessibility. Luna owns all conversational decisions.
(() => {
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
      <textarea data-assistant-input rows="1" maxlength="2000" aria-label="Asistana mesaj yaz" placeholder="Mesajını yaz…"></textarea>
      <button type="button" class="budget-assistant-icon-button budget-assistant-mic" data-assistant-mic aria-label="Mikrofonu aç" aria-pressed="false" title="Mikrofonu aç"><i data-lucide="mic" aria-hidden="true"></i></button>
      <button type="submit" class="budget-assistant-send" aria-label="Mesajı gönder" title="Gönder"><i data-lucide="send" aria-hidden="true"></i></button>
    </form>
    <p class="budget-assistant-privacy">Ses kayıtları ve yapay zekâ soruları çözümleme için OpenAI’a iletilir. Ekleme, düzenleme ve silme yalnızca açık onayınızla yapılır.</p>`;

  document.body.append(launcher, panel);

  const messageList = panel.querySelector("[data-assistant-messages]");
  const input = panel.querySelector("[data-assistant-input]");
  const status = panel.querySelector("[data-assistant-status]");
  const micButton = panel.querySelector("[data-assistant-mic]");
  const speakButton = panel.querySelector("[data-assistant-speak]");
  const tools = createBudgetLunaTools();
  const remote = createBudgetAssistantRemote({
    getUser: () => currentUser, tools, onStatus: setStatus,
    onReply: answer => appendMessage(answer),
    onError: () => appendMessage("Luna şu anda yanıt veremedi. Model erişimini ve bağlantını kontrol edip yeniden dene. Hiçbir kayıt değiştirilmedi."),
    onImage: () => panel.dispatchEvent(new Event("assistant-request-image")),
  });

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
      button.addEventListener("click", () => sendAssistantInput(prompt, { source: "prompt" }));
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

  function sendAssistantInput(value = input.value, { focus = true, source = "typed", images = [] } = {}) {
    const message = String(value || "").trim();
    if (!message || message.length > 2000) return;
    if (assistantCloseTimer !== null) { clearTimeout(assistantCloseTimer); assistantCloseTimer = null; }
    stopAssistantSpeech();
    messageList.querySelectorAll(".budget-assistant-prompts").forEach(group => group.remove());
    appendMessage(message, "user");
    void window.AkisAssistantLogs?.record(message, source);
    input.value = ""; resizeAssistantInput();
    void remote.request(message, { images });
    if (focus && window.innerWidth > 980) input.focus({ preventScroll: true });
  }
  panel.addEventListener("assistant-image-message", event => {
    sendAssistantInput(event.detail.message, { source: "image", images: event.detail.images });
  });

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
    remote.cancel();
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
    input,
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
    window.AkisAssistantKnowledge?.sync();
    const owner = currentUser?.uid || "";
    if (owner !== assistantOwner) {
      remote.reset();
      assistantOwner = owner;
      microphone.cancel(); stopAssistantSpeech(); setStatus(""); input.value = "";
      messageList.replaceChildren();
      appendMessage("Merhaba! Bu oturumdaki kayıtların hakkında sorabilir veya yeni işlem ekleyebilirsin.");
      addPromptButtons(assistantQuickPrompts);
    }
    const modalOpen = [...document.querySelectorAll(".modal-backdrop")].some((modal) => !modal.hidden && !panel.contains(modal));
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

  appendMessage("Merhaba, ben Akış Bütçe Asistanı. Kayıtlarını, hesaplarını, borç ve alacaklarını, varlıklarını ve BES’ini birlikte inceleyebilirim. Değişiklikleri onayına sunarım.");
  addPromptButtons(assistantQuickPrompts);
  updateVisibility();
  window.lucide?.createIcons();
})();
