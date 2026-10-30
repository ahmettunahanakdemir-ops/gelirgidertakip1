function createBudgetMicrophone({ button, Recognition, onSend, onStatus, stopPlayback, onTranscript = () => {} }) {
  const singlePassDevice = typeof navigator !== "undefined" && (
    /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
  let session = null;
  let press = null;
  let ignoreClickUntil = 0;
  const join = (...parts) => parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const clearTimer = (state, key) => {
    if (state[key] !== null) window.clearTimeout(state[key]);
    state[key] = null;
  };
  const visual = (mode) => {
    button.dataset.voiceState = mode;
    button.classList.toggle("is-listening", mode !== "idle");
    button.classList.toggle("is-speaking", mode === "speaking");
    button.classList.toggle("is-processing", mode === "processing");
    button.setAttribute("aria-pressed", String(mode !== "idle"));
    const label = mode === "idle" ? "Sesli mesaj: basılı tut veya dokunarak başlat" : mode === "processing" ? "Sesli mesaj metne çevriliyor" : "Dinlemeyi bitir ve mesajı gönder";
    button.setAttribute("aria-label", label); button.title = label;
  };
  function detected(state) {
    if (session !== state || state.done || state.stopping) return;
    visual("speaking"); onStatus("Sesin algılanıyor…");
    clearTimer(state, "speechTimer");
    state.speechTimer = window.setTimeout(() => {
      if (session === state && !state.stopping) { visual("listening"); onStatus("Dinliyorum…"); }
    }, 1100);
  }

  function reset(state) {
    ["silenceTimer", "restartTimer", "finalTimer", "speechTimer", "startTimer", "hardTimer"].forEach((key) => clearTimer(state, key));
    state.done = true;
    if (session === state) session = null;
    press = null;
    visual("idle"); onTranscript("", false);
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
    clearTimer(state, "speechTimer");
    clearTimer(state, "startTimer");
    visual("processing");
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
      engine.continuous = !state.singlePass;
      engine.interimResults = true;
      engine.maxAlternatives = 1;
      engine.onstart = () => {
        if (session !== state || state.done) { try { engine.abort(); } catch { } return; }
        if (state.engine !== engine || state.stopping) return;
        clearTimer(state, "startTimer");
        visual("listening");
        onStatus("Dinliyorum…");
        if (state.silenceTimer === null) armSilence(state, state.before || state.current ? 5000 : 10000);
      };
      engine.onspeechstart = () => {
        if (session === state && state.engine === engine && !state.stopping) { detected(state); clearTimer(state, "silenceTimer"); }
      };
      engine.onspeechend = () => {
        if (session === state && state.engine === engine && !state.stopping) { visual("listening"); onStatus("Dinliyorum…"); armSilence(state); }
      };
      engine.onsoundstart = engine.onspeechstart;
      engine.onsoundend = engine.onspeechend;
      engine.onresult = (event) => {
        if (session !== state || state.done || state.engine !== engine) return;
        const text = join(...Array.from(event.results || []).map((result) => result[0]?.transcript || ""));
        if (text !== state.current) {
          state.current = text;
          state.retries = 0;
          onTranscript(join(state.before, state.current), true);
          if (!state.stopping) { detected(state); armSilence(state); }
        }
      };
      engine.onerror = (event) => {
        if (session !== state || state.done || state.engine !== engine || event.error === "no-speech") return;
        if (state.stopping && event.error === "aborted") return;
        reset(state);
        try { engine.abort(); } catch { }
        const messages = {
          "not-allowed": "Mikrofon izni verilmedi. Site/uygulama izinlerini kontrol et; mesajını yazarak devam edebilirsin.",
          "service-not-allowed": "Ses tanıma servisine izin verilmedi veya cihazda kullanılamıyor. Mesajını yazarak devam edebilirsin.",
          "audio-capture": "Mikrofona erişilemedi. Başka uygulamaların mikrofon kullanımını ve cihaz ayarlarını kontrol et.",
          network: "Ses tanıma bağlantısı kesildi. İnterneti kontrol edip tekrar dene; mesaj gönderilmedi.",
          "language-not-supported": "Cihazın ses tanıma servisi Türkçeyi desteklemiyor. Mesajını yazarak devam edebilirsin.",
        };
        onStatus(messages[event.error] || "Ses tanıma tamamlanamadı. Mesaj gönderilmedi; tekrar deneyebilirsin.");
      };
      engine.onend = () => {
        if (session !== state || state.done || state.engine !== engine) return;
        clearTimer(state, "startTimer");
        if (state.stopping) { commit(state); return; }
        if (state.singlePass) {
          clearTimer(state, "silenceTimer");
          clearTimer(state, "speechTimer");
          state.stopping = true;
          visual("processing");
          onStatus("Metne çevriliyor…");
          state.finalTimer = window.setTimeout(() => commit(state), 180);
          return;
        }
        state.before = join(state.before, state.current);
        state.current = "";
        state.engine = null;
        if (++state.retries > 3) { cancel(); onStatus("Ses tanıma sürekli kesiliyor. İzinleri ve bağlantıyı kontrol edip tekrar dene."); return; }
        visual("starting");
        // Mobile engines may end a segment even with continuous recognition enabled.
        state.restartTimer = window.setTimeout(() => {
          state.restartTimer = null;
          startEngine(state);
        }, 250);
      };
      state.startTimer = window.setTimeout(() => {
        if (session !== state || state.engine !== engine) return;
        cancel(); onStatus("Mikrofon başlatılamadı. İzin isteğini ve cihazın ses tanıma desteğini kontrol et.");
      }, 12000);
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
    session = { engine: null, before: "", current: "", done: false, stopping: false, singlePass: singlePassDevice, retries: 0, silenceTimer: null, restartTimer: null, finalTimer: null, speechTimer: null, startTimer: null, hardTimer: null };
    visual("starting"); onTranscript("", true);
    session.hardTimer = window.setTimeout(finish, 90000);
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

function createBudgetAssistantSpeaker({ onState, onError, synthesis = window.speechSynthesis, Utterance = window.SpeechSynthesisUtterance }) {
  let token = 0, activeUtterance = null, queue = [];
  const cancel = () => { token++; queue = []; activeUtterance = null; synthesis?.cancel(); onState(false); };
  function read(text) {
    cancel();
    if (!synthesis || !Utterance || !String(text).trim()) return;
    const session = token;
    // Short chunks avoid long-response truncation on mobile speech engines.
    for (const segment of String(text).match(/[^.!?\n]+[.!?]?/g) || []) {
      let chunk = "";
      for (const word of segment.trim().split(/\s+/)) {
        if (chunk && chunk.length + word.length > 220) { queue.push(chunk); chunk = ""; }
        chunk = chunk ? `${chunk} ${word}` : word;
      }
      if (chunk) queue.push(chunk);
    }
    const next = () => {
      if (session !== token) return;
      if (!queue.length) { activeUtterance = null; onState(false); return; }
      const utterance = new Utterance(queue.shift()); activeUtterance = utterance;
      utterance.lang = "tr-TR"; utterance.rate = 1;
      const voices = synthesis.getVoices?.() || [];
      const turkish = voices.find(voice => /^tr(?:-|_)/i.test(voice.lang) && voice.localService) || voices.find(voice => /^tr(?:-|_|$)/i.test(voice.lang));
      if (turkish) utterance.voice = turkish;
      utterance.onend = next;
      utterance.onerror = event => { if (session !== token) return; cancel(); if (!/^(canceled|interrupted)$/.test(event.error || "")) onError(); };
      onState(true);
      try { synthesis.speak(utterance); } catch { cancel(); onError(); }
    };
    next();
  }
  return { cancel, read };
}
