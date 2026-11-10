(() => {
  const panel = document.querySelector('.budget-assistant-panel');
  const form = panel?.querySelector('[data-assistant-form]');
  const input = panel?.querySelector('[data-assistant-input]');
  if (!form || !input) return;
  let files = [], urls = [], owner = currentUser?.uid || '';
  const tray = document.createElement('div');
  tray.className = 'assistant-image-tray'; tray.hidden = true;
  form.before(tray);
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = 'image/*'; picker.multiple = true; picker.hidden = true;
  const attach = document.createElement('button');
  attach.type = 'button'; attach.className = 'budget-assistant-icon-button';
  attach.title = 'Fotoğraf ekle'; attach.setAttribute('aria-label', attach.title);
  attach.innerHTML = '<i data-lucide="image-plus" aria-hidden="true"></i>';
  attach.addEventListener('click', () => picker.click());
  form.before(attach, picker);
  const status = panel.querySelector('[data-assistant-status]');
  function clear() {
    urls.forEach(url => URL.revokeObjectURL(url)); urls = []; files = [];
    tray.replaceChildren(); tray.hidden = true; picker.value = '';
  }
  function select(incoming) {
    const images = Array.from(incoming).filter(file => /^image\//.test(file.type));
    if (!images.length) return;
    if (files.length + images.length > 12 || images.some(file => file.size > 10 * 1024 * 1024)) {
      status.textContent = 'En fazla on iki fotoğraf; her fotoğraf en fazla on MB olabilir.'; return;
    }
    files.push(...images); tray.hidden = false;
    images.forEach(file => {
      const image = document.createElement('img'); image.alt = file.name || 'Yapıştırılan fotoğraf';
      const url = URL.createObjectURL(file); urls.push(url); image.src = url; tray.append(image);
    });
    let remove = tray.querySelector('button');
    if (!remove) {
      remove = document.createElement('button'); remove.type = 'button'; remove.className = 'budget-assistant-icon-button';
      remove.title = 'Fotoğrafları kaldır'; remove.setAttribute('aria-label', remove.title);
      remove.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>'; remove.addEventListener('click', clear); tray.append(remove);
    }
    status.textContent = `${files.length} fotoğraf seçildi.`;
    window.lucide?.createIcons();
  }
  picker.addEventListener('change', () => select(picker.files));
  input.addEventListener('paste', event => {
    const images = Array.from(event.clipboardData?.items || []).filter(item => item.kind === 'file' && item.type.startsWith('image/')).map(item => item.getAsFile()).filter(Boolean);
    if (!images.length) return;
    event.preventDefault(); select(images);
    const text = event.clipboardData.getData('text/plain');
    if (text) { input.value += text; input.dispatchEvent(new Event('input', { bubbles:true })); }
  });
  function handle(event) {
    if (!files.length) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const command = input.value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
    if (/iptal|vazgec/.test(command)) { clear(); input.value = ''; status.textContent = 'Fotoğraf işlemi iptal edildi.'; return; }
    if (!/ekle|aktar|oku/.test(command)) { status.textContent = 'Kayıtlara ekle veya yapay zekâ ile kayıtlara ekle.'; return; }
    if (pendingBankFiles.length || pendingBankImports.length) { status.textContent = 'Önce açık içe aktarma işlemini tamamla veya iptal et.'; return; }
    const selected = files.slice();
    const ai = /yapay|zeka|\bai\b/.test(command);
    panel.querySelector('[data-assistant-close]').click();
    openBankImportModal();
    handleBankImportFile({ target: { files:selected } });
    clear(); input.value = '';
    // Only preview readers are called; confirmBankImport is never invoked here.
    void (ai ? previewBankImportWithAi() : previewBankImportWithAccurateLocalOcr());
  }
  form.addEventListener('submit', handle, true);
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) handle(event); }, true);
  new MutationObserver(() => {
    const uid = currentUser?.uid || '';
    if (uid !== owner) { owner = uid; clear(); }
  }).observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
  window.addEventListener('pagehide', clear);
  window.lucide?.createIcons();
})();
