// API replies are text only. Approved knowledge never becomes executable code.
function createBudgetAssistantRemote({ getUser, onReply, onStatus, onError }) {
  let active = null;
  let history = [];
  function cancel() {
    active?.abort();
    active = null;
    onStatus("");
  }
  async function request(message) {
    cancel();
    const user = getUser();
    if (!user) return onError();
    const controller = new AbortController();
    active = controller;
    const timer = setTimeout(() => controller.abort(), 50000);
    onStatus("Yapay zekâ yanıtlıyor…");
    try {
      const token = await user.getIdToken();
      if (active !== controller || getUser()?.uid !== user.uid) return;
      const response = await fetch("/.netlify/functions/assistant-chat", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, history }), signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || typeof result.text !== "string" || !result.text.trim()) throw new Error("AI unavailable");
      if (active !== controller || getUser()?.uid !== user.uid) return;
      history = [...history, { role: "user", content: message }, { role: "assistant", content: result.text }].slice(-6);
      onReply(result.text, message);
    } catch {
      if (active === controller && getUser()?.uid === user.uid) onError();
    } finally {
      clearTimeout(timer);
      if (active === controller) { active = null; onStatus(""); }
    }
  }
  return { request, cancel, reset() { cancel(); history = []; } };
}

(() => {
  let owner = "", connection = null, unsubscribe = null, rows = [], panel = null;
  let state = "", revision = 0;
  const drafts = new Map();
  const normalize = text => String(text || "").toLocaleLowerCase("tr-TR").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const context = () => {
    try { return { uid: currentUser?.uid || "", db: firebaseDb }; }
    catch { return { uid: "", db: null }; }
  };
  function reusable(question, answer) {
    const text = normalize(`${question} ${answer}`);
    return question.trim().length >= 8 && answer.trim().length >= 15 && question.length <= 2000 && answer.length <= 4000 &&
      !/[\d₺$€%]|https?:|@/.test(`${question} ${answer}`) &&
      !/\b(bugun|dun|yarin|bu ay|gecen ay|gelecek ay|bakiyem\w*|borcum\w*|hesabim\w*|kartim\w*|gelirim\w*|giderim\w*|harcadim|kayitlarim\w*|sifrem\w*|parolam\w*)\b/.test(text);
  }
  const clean = items => (Array.isArray(items) ? items : []).filter(row => row && typeof row.id === "string" &&
    typeof row.question === "string" && typeof row.answer === "string" && ["pending", "approved", "rejected"].includes(row.status) &&
    row.question.length <= 2000 && row.answer.length <= 4000).slice(0, 100);
  function sync() {
    const { uid, db } = context();
    if (owner === uid && connection === db) return;
    unsubscribe?.(); unsubscribe = null; owner = uid; connection = db; rows = []; drafts.clear(); revision++;
    state = uid ? "Bağlanıyor…" : "Oturum açılmadı";
    if (uid && db) {
      const epoch = revision;
      unsubscribe = db.collection("users").doc(uid).onSnapshot(snapshot => {
        if (epoch !== revision) return;
        rows = clean(snapshot.data()?.assistantKnowledge);
        state = snapshot.metadata?.hasPendingWrites ? "Eşitleme bekliyor" : "Güncel";
        render();
      }, () => { if (epoch === revision) { state = "Bilgi havuzuna erişilemedi"; render(); } });
    }
    render();
  }
  async function change(transform) {
    sync();
    const uid = owner, db = connection, epoch = revision;
    if (!uid || !db) throw new Error("Oturum açılmadı");
    const ref = db.collection("users").doc(uid);
    await db.runTransaction(async tx => {
      const snapshot = await tx.get(ref);
      if (context().uid !== uid || epoch !== revision) throw new Error("Oturum değişti");
      const next = transform(clean(snapshot.data()?.assistantKnowledge));
      tx.set(ref, { assistantKnowledge: next }, { merge: true });
    });
  }
  async function propose(question, answer) {
    sync();
    if (!reusable(question, answer)) return;
    try {
      const row = { id: crypto.randomUUID(), question, answer, status: "pending", createdAt: Date.now() };
      await change(current => {
        if (current.some(item => normalize(item.question) === normalize(question) && item.status !== "rejected")) return current;
        const kept = current.filter(item => item.status !== "rejected");
        if (kept.length >= 100 || kept.filter(item => item.status === "pending").length >= 50) throw new Error("Öneri havuzu dolu");
        return [...kept, row];
      });
    } catch {
      state = "Yeni öneri kaydedilemedi; bağlantıyı ve izinleri kontrol edin"; render();
    }
  }
  function lookup(question) {
    sync();
    return rows.find(row => row.status === "approved" && reusable(row.question, row.answer) && normalize(row.question) === normalize(question))?.answer || "";
  }
  function iconButton(name, title, action) {
    const button = document.createElement("button"); button.type = "button";
    button.className = "icon-button"; button.title = title; button.setAttribute("aria-label", title);
    button.innerHTML = `<i data-lucide="${name}" aria-hidden="true"></i>`;
    button.addEventListener("click", action); return button;
  }
  function render() {
    if (!panel) return;
    panel.replaceChildren();
    const status = document.createElement("p"); status.setAttribute("role", "status"); status.textContent = state; panel.append(status);
    const visible = rows.filter(row => row.status !== "rejected");
    if (!visible.length) { const empty = document.createElement("p"); empty.textContent = "Henüz öğrenme önerisi yok."; panel.append(empty); }
    for (const row of visible) {
      const item = document.createElement("section"); item.className = "assistant-knowledge-row";
      const label = document.createElement("strong"); label.textContent = row.status === "approved" ? "Onaylı yanıt" : "Onay bekleyen öneri";
      const draft = drafts.get(row.id) || row;
      const question = document.createElement("textarea"); question.value = draft.question; question.rows = 2; question.maxLength = 2000; question.setAttribute("aria-label", "Soru");
      const answer = document.createElement("textarea"); answer.value = draft.answer; answer.rows = 5; answer.maxLength = 4000; answer.setAttribute("aria-label", "Yanıt");
      const remember = () => drafts.set(row.id, { question: question.value, answer: answer.value });
      question.addEventListener("input", remember); answer.addEventListener("input", remember);
      question.readOnly = answer.readOnly = row.status === "approved";
      const actions = document.createElement("div"); actions.className = "assistant-knowledge-actions";
      async function update(status) {
        const epoch = revision;
        if (status === "approved" && !reusable(question.value, answer.value)) {
          state = "Tarih, tutar veya kişisel hesap bilgisi içeren yanıtlar öğrenilemez."; statusText(); return;
        }
        actions.querySelectorAll("button").forEach(button => { button.disabled = true; });
        try {
          await change(current => {
            if (status === "approved" && current.filter(item => item.status === "approved" && item.id !== row.id).length >= 50) throw new Error("Onaylı yanıt sınırı");
            return current.map(item => item.id === row.id ? { ...item, question: question.value.trim(), answer: answer.value.trim(), status } : item);
          });
        } catch { if (epoch === revision) { state = "Değişiklik kaydedilemedi."; statusText(); } }
        finally { actions.querySelectorAll("button").forEach(button => { button.disabled = false; }); }
      }
      function statusText() { panel.querySelector('[role="status"]').textContent = state; }
      if (row.status === "pending") actions.append(iconButton("check", "Yanıtı onayla", () => void update("approved")));
      actions.append(iconButton("x", row.status === "approved" ? "Yanıtı devre dışı bırak" : "Öneriyi reddet", () => void update("rejected")));
      item.append(label, question, answer, actions); panel.append(item);
    }
    window.lucide?.createIcons();
  }
  window.AkisAssistantKnowledge = { sync, propose, lookup, createPanel() {
    panel = document.createElement("div"); panel.className = "assistant-knowledge-panel"; sync(); render(); return panel;
  } };
})();
