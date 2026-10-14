function createBudgetMicrophone({ button, Recognition, onSend, onStatus, stopPlayback }) {
  let session = null;
  let press = null;
  let ignoreClickUntil = 0;
  const join = (...parts) => parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const clearTimer = (state, key) => {
    if (state[key] !== null) window.clearTimeout(state[key]);
    state[key] = null;
  };

  function reset(state) {
    ["silenceTimer", "restartTimer", "finalTimer"].forEach((key) => clearTimer(state, key));
    state.done = true;
    if (session === state) session = null;
    button.classList.remove("is-listening");
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Sesli mesaj: basılı tut veya dokunarak başlat");
  }

  function cancel() {
    press = null;
    if (!session) return;
    const state = session;
    reset(state);
    try { state.engine?.abort(); } catch { }
  }

  function commit(state) {
    if (session !== state || state.done) return;
    const transcript = join(state.before, state.current);
    reset(state);
    try { state.engine?.abort(); } catch { }
    onStatus(transcript ? "" : "Ses algılanamadı. Tekrar deneyebilir veya yazabilirsin.");
    if (transcript) onSend(transcript);
  }

  function finish() {
    const state = session;
    if (!state || state.stopping) return;
    state.stopping = true;
    clearTimer(state, "silenceTimer");
    clearTimer(state, "restartTimer");
    onStatus("Metne çevriliyor…");
    if (!state.engine) { commit(state); return; }
    try { state.engine.stop(); } catch { commit(state); return; }
    // Some engines delay or omit end; late results cannot send a second message.
    if (session === state) state.finalTimer = window.setTimeout(() => commit(state), 1500);
  }

  function armSilence(state, delay = 5000) {
    clearTimer(state, "silenceTimer");
    state.silenceTimer = window.setTimeout(() => {
      state.silenceTimer = null;
      if (press && Date.now() - press.start >= 350) { armSilence(state, delay); return; }
      if (session === state) finish();
    }, delay);
  }

  function startEngine(state) {
    if (session !== state || state.done || state.stopping) return;
    let engine;
    try {
      engine = new Recognition();
      state.engine = engine;
      engine.lang = "tr-TR";
      engine.continuous = true;
      engine.interimResults = true;
      engine.maxAlternatives = 1;
      engine.onstart = () => {
        if (session !== state || state.done) return;
        onStatus("Dinliyorum…");
        if (state.silenceTimer === null) armSilence(state, state.before || state.current ? 5000 : 10000);
      };
      engine.onspeechstart = () => {
        if (session === state && !state.stopping) clearTimer(state, "silenceTimer");
      };
      engine.onspeechend = () => {
        if (session === state && !state.stopping) armSilence(state);
      };
      engine.onresult = (event) => {
        if (session !== state || state.done) return;
        const text = join(...Array.from(event.results || []).map((result) => result[0]?.transcript || ""));
        if (text !== state.current) {
          state.current = text;
          if (!state.stopping) armSilence(state);
        }
      };
      engine.onerror = (event) => {
        if (session !== state || state.done || event.error === "no-speech") return;
        reset(state);
        try { engine.abort(); } catch { }
        onStatus(event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Mikrofon izni verilmedi. Mesajını yazarak devam edebilirsin."
          : "Ses tanıma tamamlanamadı. Bağlantıyı kontrol edip tekrar deneyebilirsin.");
      };
      engine.onend = () => {
        if (session !== state || state.done || state.engine !== engine) return;
        state.before = join(state.before, state.current);
        state.current = "";
        state.engine = null;
        if (state.stopping) { commit(state); return; }
        // Mobile engines may end a segment even with continuous recognition enabled.
        state.restartTimer = window.setTimeout(() => {
          state.restartTimer = null;
          startEngine(state);
        }, 250);
      };
      engine.start();
    } catch {
      reset(state);
      onStatus("Mikrofon açılamadı. Mesajını yazarak devam edebilirsin.");
    }
  }

  function start() {
    if (session) return;
    if (!Recognition) { onStatus("Bu tarayıcıda ses tanıma kullanılamıyor. Mesajını yazabilirsin."); return; }
    stopPlayback();
    session = { engine: null, before: "", current: "", done: false, stopping: false, silenceTimer: null, restartTimer: null, finalTimer: null };
    button.classList.add("is-listening");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Dinlemeyi bitir ve mesajı gönder");
    onStatus("Mikrofon açılıyor…");
    startEngine(session);
  }

  button.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    press = { id: event.pointerId, start: Date.now(), alreadyListening: Boolean(session) };
    try { button.setPointerCapture(event.pointerId); } catch { }
    if (!session) start();
  });
  button.addEventListener("pointerup", (event) => {
    if (!press || press.id !== event.pointerId) return;
    const shouldFinish = press.alreadyListening || Date.now() - press.start >= 350;
    press = null;
    ignoreClickUntil = Date.now() + 700;
    if (shouldFinish) finish();
  });
  button.addEventListener("pointercancel", cancel);
  button.addEventListener("click", (event) => {
    if (event.detail !== 0 && Date.now() < ignoreClickUntil) return;
    session ? finish() : start();
  });
  return { start, finish, cancel, isListening: () => Boolean(session) };
}
