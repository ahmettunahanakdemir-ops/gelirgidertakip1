// Account-scoped durable outbox and read-only cross-device question viewer.
(() => {
  const STORE = "questions", PAGE_SIZE = 50;
  let database, owner = "", db = null, unsubscribe = null, cursor = null;
  let panel, rows = [], page = 0, status = "Hesap bekleniyor", loading = false;
  let epoch = 0, flushPromise = null, nextRetry = 0, failureCount = 0, exhausted = false;
  const sourceLabels = { typed: "Yazı", voice: "Mikrofon", prompt: "Öneri" };
  const context = () => {
    try { return { uid: currentUser?.uid || "", db: firebaseDb }; }
    catch { return { uid: "", db: null }; }
  };
  function openDatabase() {
    if (database) return database;
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open("akis-assistant-question-logs", 1);
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore(STORE, { keyPath: "key" });
        store.createIndex("owner", "owner");
        store.createIndex("outbox", ["owner", "pending"]);
      };
      request.onsuccess = () => { request.result.onversionchange = () => { request.result.close(); database = null; }; resolve(request.result); };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Kayıt deposu başka bir sekmede kilitli."));
    }).catch(error => { database = null; throw error; });
    return database;
  }
  async function store(record) {
    const database = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = database.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ ...record, pending: record.synced ? 0 : 1 });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("Yerel kayıt iptal edildi."));
    });
  }
  async function read(uid, pendingOnly = false) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE).objectStore(STORE).index(pendingOnly ? "outbox" : "owner").getAll(pendingOnly ? [uid, 1] : uid);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  function device() {
    const ua = navigator.userAgent;
    const os = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iPad" : /iPhone/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Macintosh/.test(ua) ? "Mac" : "Diğer";
    const browser = /Edg\//.test(ua) ? "Edge" : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Chrome|CriOS/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Tarayıcı";
    return `${os} / ${browser}`;
  }
  function id() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-")}`; }
  async function refreshLocal(uid = owner, token = epoch) {
    const loaded = uid ? await read(uid) : [];
    if (owner !== uid || epoch !== token) return;
    rows = loaded.sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id));
    render();
  }
  function report(error) {
    status = error?.code === "permission-denied" ? "Bulut erişim izni yok; kayıtlar cihazda bekliyor." : `Eşitleme bekliyor: ${error?.message || "Bağlantı yok"}`;
    render();
  }
  function collection(uid, connection = db) { return connection.collection("users").doc(uid).collection("assistantQuestions"); }
  async function record(text, source = "typed") {
    const uid = context().uid;
    if (!uid || !String(text).trim()) return;
    try {
      const question = String(text).trim();
      const eventId = id();
      const row = { key: `${uid}:${eventId}`, owner: uid, id: eventId, question, createdAt: Date.now(), device: device(), source: sourceLabels[source] ? source : "typed", synced: false };
      await store(row);
      await tick();
      await refreshLocal();
    } catch (error) { status = `Soru günlüğü kaydedilemedi: ${error.message}`; render(); }
  }
  async function flush() {
    if (flushPromise || !owner || !db || Date.now() < nextRetry || !navigator.onLine) return flushPromise;
    const uid = owner, connection = db, token = epoch;
    let task;
    task = (async () => {
      const pending = await read(uid, true);
      for (const row of pending) {
        if (epoch !== token || context().uid !== uid) return;
        const { key, owner: ignoredOwner, synced, pending: ignoredPending, ...payload } = row;
        await collection(uid, connection).doc(row.id).set({ ...payload, receivedAt: window.firebase.firestore.FieldValue.serverTimestamp() });
        await store({ ...row, synced: true });
      }
      if (epoch === token && pending.length) {
        status = "Bulut eşitlendi";
        failureCount = 0; nextRetry = 0;
        await refreshLocal(uid, token);
      }
    })().catch(error => {
      if (epoch !== token) return;
      nextRetry = Date.now() + Math.min(60000, 2000 * 2 ** Math.min(++failureCount, 5));
      report(error);
    }).finally(() => { if (flushPromise === task) flushPromise = null; });
    flushPromise = task;
    return task;
  }
  async function ingest(documents, uid, token) {
    const existing = new Map((await read(uid)).map(row => [row.id, row]));
    for (const document of documents) {
      if (epoch !== token) return;
      const data = document.data();
      if (typeof data.question !== "string" || !Number.isFinite(data.createdAt)) continue;
      await store({ key: `${uid}:${document.id}`, owner: uid, id: document.id, question: data.question,
        createdAt: data.createdAt, device: String(data.device || "Bilinmeyen cihaz"), source: sourceLabels[data.source] ? data.source : "typed",
        synced: !document.metadata?.hasPendingWrites || !!existing.get(document.id)?.synced });
    }
    await refreshLocal(uid, token);
  }
  const panelVisible = () => Boolean(panel?.isConnected && panel.getClientRects().length);
  async function tick() {
    const current = context();
    if (current.uid !== owner || current.db !== db) {
      ++epoch; unsubscribe?.(); unsubscribe = null; cursor = null; exhausted = false; flushPromise = null;
      owner = current.uid; db = current.db; rows = []; page = 0; nextRetry = 0; failureCount = 0;
      status = owner ? "Yerel günlük hazır" : "Hesap bekleniyor";
      await refreshLocal();
    }
    // Uploading does not depend on opening the viewer; downloads do.
    void flush();
    if (!panelVisible()) { unsubscribe?.(); unsubscribe = null; return; }
    if (owner && db && !unsubscribe && Date.now() >= nextRetry) {
      const uid = owner, token = epoch;
      unsubscribe = collection(uid).orderBy("createdAt", "desc").limit(100).onSnapshot(snapshot => {
        if (token !== epoch) return;
        if (!cursor && snapshot.docs.length) cursor = snapshot.docs[snapshot.docs.length - 1];
        exhausted = snapshot.docs.length < 100;
        status = snapshot.metadata?.fromCache ? "Cihaz önbelleği" : "Canlı bağlantı açık";
        void ingest(snapshot.docs, uid, token).catch(report);
      }, error => { if (token === epoch) { unsubscribe = null; nextRetry = Date.now() + 60000; report(error); } });
    }
    render();
  }
  async function older() {
    if (!owner || !db || loading || exhausted) return;
    loading = true; render();
    const uid = owner, token = epoch;
    try {
      let query = collection(uid).orderBy("createdAt", "desc").limit(100);
      if (cursor) query = query.startAfter(cursor);
      const snapshot = await query.get({ source: "server" });
      if (token !== epoch) return;
      if (snapshot.docs.length) cursor = snapshot.docs[snapshot.docs.length - 1];
      exhausted = snapshot.docs.length < 100;
      await ingest(snapshot.docs, uid, token);
    } catch (error) { if (token === epoch) report(error); }
    finally { loading = false; render(); }
  }
  function filtered() {
    if (context().uid !== owner) return [];
    if (!panel) return rows;
    const term = panel.querySelector("[data-log-search]").value.toLocaleLowerCase("tr");
    const source = panel.querySelector("[data-log-source]").value;
    const day = panel.querySelector("[data-log-date]").value;
    return rows.filter(row => (!term || `${row.question} ${row.device}`.toLocaleLowerCase("tr").includes(term)) && (!source || row.source === source) && (!day || localDate(row.createdAt) === day));
  }
  function localDate(timestamp) { const d = new Date(timestamp); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  function cell(row, value) { const td = document.createElement("td"); td.textContent = value; row.append(td); }
  function render() {
    if (!panel) return;
    if (context().uid !== owner) { rows = []; status = "Hesap değiştiriliyor"; }
    panel.querySelector("[data-log-status]").textContent = status;
    panel.querySelector("[data-log-count]").textContent = `${rows.length} yüklenen kayıt · ${rows.filter(row => !row.synced).length} bekleyen`;
    const found = filtered();
    page = Math.min(page, Math.max(0, Math.ceil(found.length / PAGE_SIZE) - 1));
    const body = panel.querySelector("tbody"); body.replaceChildren();
    for (const row of found.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)) {
      const tr = document.createElement("tr");
      cell(tr, new Date(row.createdAt).toLocaleString("tr-TR")); cell(tr, row.device); cell(tr, sourceLabels[row.source]); cell(tr, row.question); cell(tr, row.synced ? "Eşitlendi" : "Bekliyor"); body.append(tr);
    }
    panel.querySelector("[data-log-empty]").hidden = !!found.length;
    panel.querySelector("[data-log-page]").textContent = `${found.length} eşleşme · ${page + 1} / ${Math.max(1, Math.ceil(found.length / PAGE_SIZE))}`;
    panel.querySelector("[data-log-prev]").disabled = page === 0;
    panel.querySelector("[data-log-next]").disabled = (page + 1) * PAGE_SIZE >= found.length;
    panel.querySelector("[data-log-older]").disabled = !owner || !db || loading || exhausted;
    panel.querySelector("[data-log-export]").disabled = !found.length;
  }
  function download() {
    const data = filtered().map(({ question, createdAt, device, source, synced, id }) => ({ id, time: new Date(createdAt).toISOString(), device, source, question, synced }));
    if (!data.length) return;
    const csv = panel.querySelector("[data-log-format]").value === "csv";
    const quote = value => `"${String(value).replace(/^(?:\s*[=+@\-]|[\t\r\n])/, "'$&").replaceAll('"', '""')}"`;
    const content = csv ? "\uFEFF" + [Object.keys(data[0]).map(quote).join(";"), ...data.map(row => Object.values(row).map(quote).join(";"))].join("\r\n") : JSON.stringify(data, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: csv ? "text/csv;charset=utf-8" : "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `asistan-soru-loglari-${localDate(Date.now())}.${csv ? "csv" : "json"}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function createPanel() {
    panel = document.createElement("section"); panel.className = "assistant-log-panel";
    panel.innerHTML = `<div class="assistant-log-summary"><strong data-log-count></strong><span role="status" data-log-status></span></div>
      <div class="assistant-log-tools"><input type="search" data-log-search aria-label="Sorularda veya cihazlarda ara" placeholder="Sorularda veya cihazlarda ara"><input type="date" data-log-date aria-label="Soru tarihi"><select data-log-source aria-label="Giriş türü"><option value="">Tüm girişler</option><option value="typed">Yazı</option><option value="voice">Mikrofon</option><option value="prompt">Öneri</option></select><button type="button" class="ghost-btn" data-log-refresh aria-label="Kayıtları yenile" title="Kayıtları yenile"><i data-lucide="refresh-cw"></i></button><select data-log-format aria-label="Dışa aktarma biçimi"><option value="json">JSON</option><option value="csv">CSV</option></select><button type="button" class="ghost-btn" data-log-export aria-label="Filtrelenen kayıtları indir" title="Filtrelenen kayıtları indir"><i data-lucide="download"></i></button></div>
      <div class="assistant-log-table" role="region" aria-label="Asistan soru kayıtları" tabindex="0"><table><thead><tr><th>Tarih / saat</th><th>Cihaz</th><th>Giriş</th><th>Soru</th><th>Durum</th></tr></thead><tbody></tbody></table></div><p data-log-empty>Kayıt bulunamadı.</p>
      <div class="assistant-log-footer"><button type="button" class="ghost-btn" data-log-older>Eski kayıtları getir</button><span data-log-page></span><button type="button" class="ghost-btn" data-log-prev aria-label="Önceki sayfa" title="Önceki sayfa"><i data-lucide="chevron-left"></i></button><button type="button" class="ghost-btn" data-log-next aria-label="Sonraki sayfa" title="Sonraki sayfa"><i data-lucide="chevron-right"></i></button></div>`;
    panel.querySelectorAll("input, [data-log-source]").forEach(input => input.addEventListener("input", () => { page = 0; render(); }));
    panel.querySelector("[data-log-refresh]").addEventListener("click", () => { nextRetry = 0; unsubscribe?.(); unsubscribe = null; cursor = null; exhausted = false; void tick().catch(report); });
    panel.querySelector("[data-log-older]").addEventListener("click", older);
    panel.querySelector("[data-log-prev]").addEventListener("click", () => { page--; render(); });
    panel.querySelector("[data-log-next]").addEventListener("click", () => { page++; render(); });
    panel.querySelector("[data-log-export]").addEventListener("click", download);
    render(); return panel;
  }
  window.AkisAssistantLogs = { record, createPanel };
  const authObserver = new MutationObserver(() => { void tick().catch(report); });
  authObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const shell = document.getElementById("appShell");
  if (shell) authObserver.observe(shell, { attributes: true, attributeFilter: ["hidden"] });
  window.addEventListener("online", () => { nextRetry = 0; void tick().catch(report); });
  window.setInterval(() => { void tick().catch(report); }, 2000);
})();
