// Each click creates a fresh in-memory recording. No automatic message submission.
function createBudgetMicrophone({button, input, onStatus, stopPlayback}) {
const status = {set textContent(value) {onStatus(value);}};
let active = null;
function paint(mode) {
  button.dataset.voiceState = mode;
  button.classList.toggle("is-listening", mode === "listening");
  button.classList.toggle("is-processing", mode === "processing");
  button.classList.remove("is-speaking");
  button.setAttribute("aria-pressed", String(mode === "listening"));
  button.setAttribute(
    "aria-busy",
    String(mode === "processing" || mode === "starting"),
  );
  button.setAttribute(
    "aria-label",
    mode === "listening" ? "Kaydı bitir ve yazıya çevir" : "Ses kaydı başlat",
  );
}
function release(s) {
  clearInterval(s.timer);
  clearTimeout(s.limit);
  s.stream?.getTracks().forEach((t) => t.stop());
  s.stream = null;
  s.source?.disconnect();
  s.source = null;
  if (s.context) {
    void s.context.close().catch(() => {});
    s.context = null;
  }
  s.analyser = null;
}
function cancel() {
  const s = active;
  if (!s) return;
  active = null;
  s.cancelled = true;
  s.controller.abort();
  if (s.recorder?.state === "recording") s.recorder.stop();
  release(s);
  s.parts = [];
  s.recorder = null;
  paint("idle");
}
async function convert(s) {
  release(s);
  if (s.cancelled || active !== s) {
    s.parts = [];
    return;
  }
  paint("processing");
  status.textContent = "Ses kaydınız yazıya çevriliyor…";
  let blob = new Blob(s.parts, { type: s.mime });
  s.parts = [];
  s.recorder = null;
  const timeout = setTimeout(() => s.controller.abort(), 125000);
  try {
    if (!blob.size)
      throw new Error("Ses alınamadı. Yeniden kayıt yapabilirsiniz.");
    const response = await fetch("/.netlify/functions/transcribe", {
      method: "POST",
      headers: { "Content-Type": s.mime, Authorization: "Bearer " + await currentUser.getIdToken() },
      body: blob,
      signal: s.controller.signal,
    });
    blob = null;
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Ses metne çevrilemedi.");
    if (active !== s || s.cancelled) return;
    const text = String(result.text || "").trim();
    if (!text)
      throw new Error("Konuşma anlaşılamadı. Yeniden deneyebilirsiniz.");
    input.value = [input.value.trim(), text].filter(Boolean).join(" ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    status.textContent = "";
  } catch (error) {
    if (active === s && !s.cancelled)
      status.textContent =
        error.name === "AbortError"
          ? "Ses çözümleme tamamlanamadı. Yeniden kayıt yapabilirsiniz."
          : error.message;
  } finally {
    clearTimeout(timeout);
    blob = null;
    s.parts = [];
    if (active === s) {
      active = null;
      paint("idle");
    }
  }
}
function stop(s) {
  if (active !== s || s.stopping) return;
  s.stopping = true;
  if (s.recorder?.state === "recording") s.recorder.stop();
  else cancel();
}
async function start() {
  if (active) return;
  stopPlayback?.();
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    status.textContent =
      "Ses kaydı için güvenilir HTTPS bağlantısı ve mikrofon izni gerekir.";
    return;
  }
  if (!window.MediaRecorder) {
    status.textContent =
      "Tarayıcı ses kaydını desteklemiyor. Sorunuzu yazabilirsiniz.";
    return;
  }
  const s = {
    parts: [],
    controller: new AbortController(),
    cancelled: false,
    stopping: false,
  };
  active = s;
  paint("starting");
  status.textContent = "";
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      s.context = new AC();
      await s.context.resume();
    }
    if (active !== s) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });
    if (active !== s || s.cancelled) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    s.stream = stream;
    const mime = [
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ].find((t) => MediaRecorder.isTypeSupported(t));
    s.recorder = new MediaRecorder(
      stream,
      mime ? { mimeType: mime } : undefined,
    );
    s.mime = s.recorder.mimeType || mime || "audio/webm";
    s.recorder.ondataavailable = (e) => {
      if (!s.cancelled && e.data.size) s.parts.push(e.data);
    };
    s.recorder.onstop = () => void convert(s);
    s.recorder.onerror = () => {
      if (active === s) {
        cancel();
        status.textContent = "Ses kaydı kesildi. Yeniden deneyebilirsiniz.";
      }
    };
    s.recorder.start(250);
    paint("listening");
    status.textContent = "";
    s.lastSound = Date.now();
    if (s.context) {
      s.source = s.context.createMediaStreamSource(stream);
      s.analyser = s.context.createAnalyser();
      s.analyser.fftSize = 2048;
      s.source.connect(s.analyser);
      const samples = new Float32Array(2048);
      s.timer = setInterval(() => {
        if (active !== s || s.stopping) return;
        s.analyser.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(
          samples.reduce((sum, v) => sum + v * v, 0) / samples.length,
        );
        if (rms > 0.015) s.lastSound = Date.now();
        if (Date.now() - s.lastSound >= 5000) stop(s);
      }, 100);
    } else
      status.textContent =
        "Kayıt açık. Bitirmek için mikrofon düğmesine tekrar dokunun.";
    s.limit = setTimeout(() => stop(s), 90000);
  } catch (error) {
    if (active === s) {
      cancel();
      status.textContent =
        error.name === "NotAllowedError"
          ? "Mikrofon izni verilmedi. Site mikrofon iznini kontrol ediniz."
          : "Mikrofon açılamadı. Cihazın mikrofonunu kontrol ediniz.";
    }
  }
}
button.addEventListener("click", () => {
  if (active) {
    if (active.stopping) {
      status.textContent = "Önceki kayıt yazıya çevriliyor…";
      return;
    }
    stop(active);
  } else void start();
});



document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancel();
});
window.addEventListener("pagehide", cancel);
input.closest("form")?.addEventListener("submit", cancel);
paint("idle");

return {cancel};
}
