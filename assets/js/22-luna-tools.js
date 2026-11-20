// Data and validation tools only; natural-language decisions belong to Luna.
function createLunaTools({ getUser, getState, document: doc = document }) {
  const allowed = {
    records: ['id','title','type','amount','date','time','transactionAt','category','paymentMethod','paymentAccountId','transferAccountId','transferFee','note','createdAt','updatedAt','isInstallment','installmentCount','installmentNumber','installmentCompleted','installmentCompletedAt','installmentGroupId'],
    accounts: ['id','name','bank','type','last4','balance','debt','limit','currentStatementDebt','statementDay','dueDay','note','updatedAt'],
    debts: ['id','person','kind','listType','amount','originalAmount','startDate','dueDate','installmentCount','payments','installments','manualClosed','note','sourceTransactionId','updatedAt'],
    assets: ['id','label','type','amount','value','updatedAt'],
    bes: ['id','provider','policyNo','contribution','stateContribution','stateGain','gain','total','note','updatedAt'],
  };
  const forms = {
    records: { create: ['entryModal','entryForm', { type:'type', paymentMethod:'paymentMethod', paymentAccountId:'paymentAccount', transferAccountId:'transferAccount', category:'category', title:'title', amount:'amount', date:'date', note:'note', transferFee:'transferFee', isInstallment:'entryInstallmentCheckbox', installmentCount:'entryInstallmentCountInput' }],
      update: ['transactionEditModal','transactionEditForm', { type:'transactionTypeInput', paymentMethod:'transactionPaymentMethodInput', paymentAccountId:'transactionPaymentAccountInput', transferAccountId:'transactionTransferAccountInput', category:'transactionCategoryInput', title:'transactionTitleInput', amount:'transactionAmountInput', date:'transactionDateInput', note:'transactionNoteInput', transferFee:'transactionTransferFeeInput' }] },
    accounts: { create: ['paymentAccountModal','paymentAccountForm', { type:'paymentAccountType', name:'paymentAccountName', bank:'paymentAccountBank', last4:'paymentAccountLast4', balance:'paymentAccountBalance', currentStatementDebt:'paymentAccountCurrentStatementDebt', limit:'paymentAccountLimit', statementDay:'paymentAccountStatementDay', dueDay:'paymentAccountDueDay', note:'paymentAccountNote' }] },
    assets: { create: ['assetEditModal','assetEditForm', { type:'assetEditType', label:'assetEditLabel', amount:'assetEditAmount' }] },
    bes: { create: ['besModal','besForm', { provider:'besProvider', policyNo:'besPolicyNo', contribution:'besContribution', stateContribution:'besStateContribution', stateGain:'besStateGain', gain:'besGain', note:'besNote' }] },
    debts: { create: ['debtModal','debtForm', { listType:'debtListTypeInput', person:'debtPersonInput', amount:'debtAmountInput', startDate:'debtStartDateInput', dueDate:'debtDueDateInput', installmentCount:'debtInstallmentCountInput', note:'debtNoteInput' }],
      pay: ['debtPaymentModal','debtPaymentForm', { amount:'debtPaymentAmountInput', date:'debtPaymentDateInput', paymentAccountId:'debtPaymentAccountInput', note:'debtPaymentNoteInput' }] },
  };
  for (const name of ['accounts','assets','bes','debts']) forms[name].update = forms[name].create;
  const seen = new Map();
  let owner = '', release = null;
  function sync() {
    const uid = getUser()?.uid || '';
    if (uid !== owner) { seen.clear(); release?.(); owner = uid; }
    if (!uid) throw new Error('Yeniden oturum acmalisin.');
  }
  const snapshot = () => JSON.stringify(getState());
  const rows = name => {
    if (!Object.hasOwn(allowed, name)) throw new Error('Desteklenmeyen veri alani.');
    return (getState()[name] || []).map(item => Object.fromEntries(allowed[name].filter(key => item[key] !== undefined).map(key => [key, item[key]])));
  };
  function catalog() {
    sync();
    return { today: getTurkeyTodayISO(), currency:'TRY', collections: Object.fromEntries(Object.keys(allowed).map(name => [name, { count: rows(name).length, fields: allowed[name] }])),
      forms: Object.fromEntries(Object.entries(forms).map(([name, actions]) => [name, Object.fromEntries(Object.entries(actions).map(([action, [, , fields]]) => [action,
        Object.fromEntries(Object.entries(fields).map(([key, id]) => {
          const el = doc.getElementById(id);
          return [key, { type: el?.type || 'text', required: !!el?.required, maxLength: el?.maxLength > 0 ? el.maxLength : null,
            options: ['paymentAccountId','transferAccountId'].includes(key)
              ? [{value:'',label:'Hesap yok'},...getState().accounts.map(account=>({value:account.id,label:`${account.name} (${account.type})`}))]
              : key === 'category' ? [...new Set(Object.values(getState().categories || {}).flat())].map(value=>({value,label:value}))
              : el?.tagName === 'SELECT' ? Array.from(el.options).map(option => ({ value: option.value, label: option.textContent })) : null }];
        }))]))])), categories: getState().categories,
      rules: 'Yalniz oturum sahibinin verileri. assets.value ve bes.total TRY degeridir. Varlik toplami hesap bakiyesi HARIC assets.value + bes.total. debts.amount kalan, originalAmount ilk tutar; receivable bana olan borctur. Hesap silme bagli kayit baglantilarini temizler. Her degisiklik onayli formdur; model asla kaydetmez.' };
  }
  function read(query) {
    sync();
    const fields = allowed[query.collection];
    let result = rows(query.collection);
    if (!Array.isArray(query.filters) || query.filters.length > 12) throw new Error('Gecersiz filtre.');
    for (const filter of query.filters) {
      if (!fields.includes(filter.field) || !['eq','contains','gte','lte'].includes(filter.op)) throw new Error('Gecersiz filtre alani veya islecisi.');
      const expected = String(filter.value);
      const fold = value => String(value ?? '').toLocaleLowerCase('tr-TR');
      result = result.filter(item => {
        const value = item[filter.field];
        switch (filter.op) {
          case 'eq': return String(value ?? '') === expected;
          case 'contains': return fold(value).includes(fold(expected));
          case 'gte': return typeof value === 'number' ? value >= Number(expected) : String(value ?? '') >= expected;
          case 'lte': return typeof value === 'number' ? value <= Number(expected) : String(value ?? '') <= expected;
          default: throw new Error('Gecersiz filtre islecisi.');
        }
      });
    }
    if (query.sortBy && !fields.includes(query.sortBy)) throw new Error('Gecersiz siralama.');
    const total = result.length;
    if (query.sortBy) result.sort((a,b) => {
      const x=a[query.sortBy], y=b[query.sortBy];
      const order = typeof x === 'number' && typeof y === 'number' ? x-y : String(x ?? '').localeCompare(String(y ?? ''), 'tr');
      return query.descending ? -order : order;
    });
    if (query.groupBy && !fields.includes(query.groupBy)) throw new Error('Gecersiz gruplama.');
    if (!Array.isArray(query.sumFields) || query.sumFields.some(key => !fields.includes(key))) throw new Error('Gecersiz toplam alani.');
    const sums = items => Object.fromEntries(query.sumFields.map(key => [key, items.reduce((sum,item) => sum + (typeof item[key] === 'number' && Number.isFinite(item[key]) ? item[key] : 0), 0)]));
    const groups = new Map();
    if (query.groupBy) for (const item of result) {
      const key = String(item[query.groupBy] ?? '');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    const offset = Number.isInteger(query.offset) && query.offset >= 0 ? query.offset : 0;
    const page = result.slice(offset, offset + 40);
    for (const row of page) seen.set(`${query.collection}:${row.id}`, JSON.stringify(row));
    return { collection:query.collection, total, offset, nextOffset:offset+page.length < total ? offset+page.length : null,
      sums:sums(result), groups:[...groups].slice(0,100).map(([key,items]) => ({key,count:items.length,sums:sums(items)})), groupsTruncated:groups.size>100, rows:page };
  }
  function mount(modal, valid) {
    release?.();
    const panel = doc.querySelector('.budget-assistant-panel');
    if (!panel) {
      // Rapor AI (v495): the app's own form opens normally on top of the page; the
      // guard still refuses to save if data or the signed-in user changed meanwhile.
      const guard = event => {
        if (valid()) return;
        event.preventDefault(); event.stopImmediatePropagation();
        let notice = modal.querySelector('[data-luna-status]');
        if (!notice) { notice = doc.createElement('p'); notice.dataset.lunaStatus = ''; notice.setAttribute('role','alert'); (modal.querySelector('.modal-card') || modal).append(notice); }
        notice.textContent = 'Veriler veya oturum degisti. Kaydetmedim; taslagi yeniden iste.';
      };
      const guardClick = event => { if (event.target.closest('#genericConfirmButton, #confirmDeletePaymentAccountButton')) guard(event); };
      modal.addEventListener('submit', guard, true); modal.addEventListener('click', guardClick, true);
      const observer = new MutationObserver(() => { if (modal.hidden) release?.(); });
      observer.observe(modal,{attributes:true,attributeFilter:['hidden']});
      release = () => { observer.disconnect(); modal.removeEventListener('submit',guard,true); modal.removeEventListener('click',guardClick,true); modal.querySelector('[data-luna-status]')?.remove(); release = null; };
      return;
    }
    const marker = doc.createComment('luna form home'); modal.before(marker);
    const content = [...panel.children]; content.forEach(el => { el.inert = true; });
    modal.classList.add('assistant-inline-import'); panel.append(modal);
    const guard = event => {
      if (valid()) return;
      event.preventDefault(); event.stopImmediatePropagation();
      let notice = modal.querySelector('[data-luna-status]');
      if (!notice) {
        notice = doc.createElement('p'); notice.dataset.lunaStatus = ''; notice.setAttribute('role','alert');
        (modal.querySelector('.modal-card') || modal).append(notice);
      }
      notice.textContent = 'Veriler veya oturum degisti. Kaydetmedim; taslagi yeniden iste.';
    };
    modal.addEventListener('submit', guard, true);
    const guardClick = event => { if (event.target.closest('#genericConfirmButton, #confirmDeletePaymentAccountButton')) guard(event); };
    modal.addEventListener('click', guardClick, true);
    const observer = new MutationObserver(() => { if (modal.hidden || panel.hidden) release?.(); });
    observer.observe(modal,{attributes:true,attributeFilter:['hidden']}); observer.observe(panel,{attributes:true,attributeFilter:['hidden']});
    release = () => { observer.disconnect(); modal.removeEventListener('submit',guard,true); modal.removeEventListener('click',guardClick,true);
      modal.hidden = true; modal.querySelector('[data-luna-status]')?.remove(); marker.replaceWith(modal); modal.classList.remove('assistant-inline-import'); content.forEach(el => {el.inert=false;}); release=null; };
  }
  function stage(plan) {
    sync();
    if (release) throw new Error('Once acik taslagi kaydet veya kapat.');
    const {collection, action, id} = plan;
    if (typeof id !== 'string' || (action === 'create' && id !== '')) throw new Error('Gecersiz hedef kimligi.');
    if (!Object.hasOwn(allowed, collection) || !['create','update','delete','pay'].includes(action)) throw new Error('Desteklenmeyen islem.');
    const item = action === 'create' ? null : rows(collection).find(row => row.id === id);
    if (action !== 'create' && (!item || seen.get(`${collection}:${id}`) !== JSON.stringify(item))) throw new Error('Hedef once okunmali; kayit degismis veya bulunamadi.');
    const before = snapshot(), uid = owner;
    const valid = () => getUser()?.uid === uid && snapshot() === before;
    const original = item ? getState()[collection].find(row => row.id === id) : null;
    let modal;
    if (action === 'delete') {
      if (!genericConfirmModal || !genericConfirmButton) throw new Error('Onay penceresi bulunamadi.');
      if (collection === 'records') {
        if (getTransactionDeletionCascadeIds(original).size !== 1) throw new Error('Bagli hareketler var; bu kaydi Kayitlar ekranindan kontrol ederek sil.');
        requestTransactionDelete(original, valid); modal = genericConfirmModal;
      }
      else if (collection === 'assets') { requestAssetDelete(original); modal = genericConfirmModal; }
      else if (collection === 'bes') { requestBesDelete(original); modal = genericConfirmModal; }
      else if (collection === 'debts') { borcAlacakKaydiniSilmeOnayi(id); modal = genericConfirmModal; }
      else { openPaymentAccountDeleteModal(original); modal = confirmPaymentAccountDeleteModal; }
      if (modal === genericConfirmModal) { const confirm = pendingGenericConfirmAction; pendingGenericConfirmAction = () => { if (valid()) confirm?.(); }; }
    } else {
      const spec = forms[collection]?.[action];
      if (!spec) throw new Error('Bu islem bu bolumde desteklenmiyor.');
      if (!Array.isArray(plan.fields) || plan.fields.length > 20 || new Set(plan.fields.map(f=>f.key)).size !== plan.fields.length) throw new Error('Gecersiz alan listesi.');
      for (const field of plan.fields) if (!Object.hasOwn(spec[2],field.key) || typeof field.value !== 'string' || field.value.length > 500) throw new Error('Gecersiz form alani.');
      if (collection === 'records') action === 'create' ? openEntryModal() : editTransaction(original,valid);
      if (collection === 'accounts') openPaymentAccountModal(original);
      if (collection === 'assets') action === 'create' ? openAssetAddModal() : openAssetEditModal(id);
      if (collection === 'bes') openBesModal(original);
      if (collection === 'debts') action === 'pay' ? borcAlacakOdemePenceresiniAc(id) : borcAlacakPenceresiniAc(id || '', plan.fields.find(f=>f.key==='listType')?.value || original?.listType || 'debt');
      modal = doc.getElementById(spec[0]);
      try {
        // Stable field order preserves dependent category/account select updates.
        for (const [key, elementId] of Object.entries(spec[2])) {
          const field = plan.fields.find(f=>f.key===key); if (!field) continue;
          const el=doc.getElementById(elementId);
          if (!el) throw new Error('Form alani bulunamadi.');
          if (el.tagName === 'SELECT' && !Array.from(el.options).some(opt=>opt.value===field.value)) throw new Error('Gecersiz secenek; hesap veya kategori secimini netlestir.');
          if (el.maxLength>0 && field.value.length>el.maxLength) throw new Error('Metin alan sinirini asiyor.');
          if (el.type==='checkbox') { if (!['true','false'].includes(field.value)) throw new Error('Gecersiz secim.'); el.checked=field.value==='true'; }
          else { el.value=field.value; if (field.value && !el.value) throw new Error('Gecersiz tarih veya sayi.'); }
          el.dispatchEvent(new Event('change',{bubbles:true}));
        }
      } catch(error) { modal.hidden=true; throw error; }
    }
    if (!modal || modal.hidden) throw new Error('Taslak acilamadi.');
    mount(modal,valid);
    return 'Taslak panelde acildi. Henuz kaydedilmedi. Alanlari kontrol edip Kaydet/Sil ile onayla veya Kapat ile vazgec.';
  }
  return { catalog, read, stage, hasOpenDraft: () => !!release, reset() { seen.clear(); release?.(); } };
}

function createBudgetLunaTools() {
  return createLunaTools({ getUser:()=>currentUser, getState:()=>({
    records:transactions, accounts:paymentAccounts, debts:borcAlacakKayitlari,
    assets:assets.map(item=>({...item,value:getAssetValue(item)})), bes:besAccounts.map(item=>({...item,total:getBesAccountTotal(item)})), categories:transactionCategories,
  }) });
}
