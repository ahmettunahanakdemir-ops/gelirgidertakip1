// Synthetic local-only browser test. No Firebase/OpenAI requests are allowed.
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const bundle='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/';
const {chromium}=createRequire(bundle)('playwright');
const root=path.resolve(__dirname,'..');
const output=process.env.LUNA_QA_OUTPUT || path.resolve(__dirname,'screenshots');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer((req,res)=>{
  const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try {let data=fs.readFileSync(file);if(file.endsWith('index.html'))data=Buffer.from(data.toString().replace(/<script src="https:[^"]+"><\/script>/g,''));res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}).end(data);}
  catch{res.writeHead(404).end();}
});
let browser;
let checks=0;
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  const page=await context.newPage();
  page.setDefaultTimeout(5000);
  const errors=[],requests=[],turns=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',async route=>{
    if(!route.request().url().startsWith('http://127.0.0.1:'))return route.abort();
    if(route.request().url().includes('/.netlify/functions/assistant-chat')){
      requests.push(route.request().postDataJSON());
      return route.fulfill({json:{turn:turns.shift() || {kind:'reply',text:'Sentetik yanıt',reads:[]}}});
    }
    return route.continue();
  });

  await page.addInitScript(()=>{
    localStorage.setItem('akis-budget-palette','ocean');
    localStorage.setItem('akis-budget-ui-settings',JSON.stringify({theme:'light'}));
    Object.defineProperty(navigator,'standalone',{get:()=>true});
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(()=>{
    currentUser={uid:'mobile-fixture',getIdToken:async()=> 'mock-token'};firebaseDb=null;
    assets=[];besAccounts=[];transactions=[];borcAlacakKayitlari=[];paymentAccounts=[];
    document.documentElement.classList.remove('auth-logged-out','startup-splash-active');document.body.classList.remove('auth-logged-out');
    loginScreen.hidden=true;appShell.hidden=false;
    document.querySelectorAll('[id*="Splash"],[id*="splash"]').forEach(el=>{el.hidden=true;el.style.display='none';});
    render();
  });
  const colors=await page.evaluate(()=>{
    const read=()=>[document.querySelector('meta[name="theme-color"]').content,getComputedStyle(document.documentElement).backgroundColor,getComputedStyle(document.body).backgroundColor];
    const first=read();switchView('settingsView');switchView('homeView');return {first,after:read()};
  });
  assert.deepEqual(colors.first,colors.after);assert.equal(colors.first[0],'#e6f1fa');checks++;
  console.log('PASS initial colors match after settings navigation');
  const views=await page.locator('.view-section[id]').evaluateAll(els=>els.map(el=>el.id));
  for(const view of views){
    await page.evaluate(id=>switchView(id),view);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'View overflow '+view);
    checks++;
  }
  console.log('PASS view geometry: '+views.join(', '));
  await page.evaluate(()=>{transactionCategories.expense=Array.from({length:50},(_,i)=>'Kategori '+i);renderHistoryCategoryFilterOptions();switchView('historyView');openHistorySearchModal();});
  const trigger=page.locator('.custom-filter-select[data-for="filterCategory"] .custom-filter-trigger');
  await trigger.click();
  const menu=page.locator('.custom-filter-select[data-for="filterCategory"] .custom-filter-menu');
  await page.waitForTimeout(80);
  let bounds=await menu.boundingBox();assert.ok(bounds.x>=0 && bounds.x+bounds.width<=391 && bounds.y>=0 && bounds.y+bounds.height<=845,JSON.stringify(bounds));
  await menu.hover();await page.mouse.wheel(0,800);await page.waitForTimeout(100);
  assert.ok(await menu.evaluate(el=>el.scrollTop)>0);checks++;
  const expected=await menu.locator('.custom-filter-option').last().getAttribute('data-value');
  await menu.locator('.custom-filter-option').last().scrollIntoViewIfNeeded();await menu.locator('.custom-filter-option').last().click();
  assert.equal(await page.locator('#filterCategory').inputValue(),expected);checks++;
  console.log('PASS dropdown viewport bounds, scrolling, last-option selection');
  await page.evaluate(()=>{closeHistorySearchModal();document.querySelectorAll('.custom-filter-select.is-open').forEach(el=>el.classList.remove('is-open'));switchView('homeView');});
  // Synthetic keyboard: layout viewport remains 844px while the visual area shrinks.
  await page.evaluate(()=>{
    window.__testViewport=new EventTarget();
    Object.assign(window.__testViewport,{height:844,width:390,offsetTop:0,offsetLeft:0});
    Object.defineProperty(window,'visualViewport',{configurable:true,get:()=>window.__testViewport});
  });
  const forms=[
    ['entryModal','openEntryModal'],
    ['paymentAccountModal','openPaymentAccountModal'],
    ['assetEditModal','openAssetAddModal'],
    ['besModal','openBesModal'],
    ['debtModal','borcAlacakPenceresiniAc'],
    ['categoryManageModal','openCategoryManageModal'],
  ];
  for(const [id,fn] of forms) {
    await page.evaluate(([id,fn])=>{
      document.querySelectorAll('.modal-backdrop').forEach(el=>{el.hidden=true;});
      window.__testViewport.height=844;window.__testViewport.dispatchEvent(new Event('resize'));
      window[fn]();
    },[id,fn]);
    await page.waitForTimeout(80);
    const field=page.locator('#'+id+' input:visible:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), #'+id+' textarea:visible').last();
    if(!await field.count())continue;
    await field.focus();
    await page.evaluate(()=>{window.__testViewport.height=360;window.__testViewport.dispatchEvent(new Event('resize'));});
    await page.waitForTimeout(120);
    const r=await field.boundingBox();
    assert.ok(r && r.y>=0 && r.y+r.height<=361,id+' hidden input '+JSON.stringify(r));
    checks++;
  }
  console.log('PASS keyboard-visible fields in entry/account/asset/BES/debt/category dialogs');
  await page.evaluate(()=>{
    document.querySelectorAll('.modal-backdrop').forEach(el=>{el.hidden=true;});
    window.__testViewport.height=844;window.__testViewport.dispatchEvent(new Event('resize'));
    pendingBankImports=Array.from({length:6},(_,i)=>({valid:true,duplicate:false,transaction:{id:'p'+i,type:'expense',title:'Fotograf satiri '+i,amount:50,category:'Market',date:'2026-11-18',paymentMethod:'other',paymentAccountId:'',transferAccountId:''}}));
    openBankImportPreviewModal();
  });
  const bankField=page.locator('#bankImportPreviewList input[type="text"]:visible').last();
  await bankField.focus();
  await page.evaluate(()=>{window.__testViewport.height=360;window.__testViewport.offsetTop=24;window.__testViewport.dispatchEvent(new Event('resize'));});
  await page.waitForTimeout(150);
  const r=await bankField.boundingBox();assert.ok(r.y>=24 && r.y+r.height<=384,JSON.stringify(r));checks++;
  assert.equal(await page.locator('#bankImportPreviewModal .bank-import-modal-tools').isVisible(),false);checks++;
  fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,'mobile-bank-keyboard.png')});
  console.log('PASS bank preview fullscreen, hidden tools while editing, focused input visible');
  await page.evaluate(()=>{document.activeElement.blur();window.__testViewport.height=844;window.__testViewport.offsetTop=0;window.__testViewport.dispatchEvent(new Event('resize'));});
  await page.waitForTimeout(120);assert.equal(await page.locator('#bankImportPreviewModal .bank-import-modal-tools').isVisible(),true);checks++;
  await page.evaluate(()=>document.querySelectorAll('.modal-backdrop').forEach(el=>{el.hidden=true;}));
  // Inspect every dialog shell, including ones without a financial form.
  const modalIds=await page.locator('.modal-backdrop').evaluateAll(els=>els.filter(el=>el.querySelector('.modal-card')).map(el=>el.id));
  for(const id of modalIds){
    await page.evaluate(id=>{document.querySelectorAll('.modal-backdrop').forEach(el=>{el.hidden=true;});document.getElementById(id).hidden=false;},id);
    const card=page.locator('#'+id+' > .modal-card');const r=await card.boundingBox();
    assert.ok(r && r.x>=-1 && r.x+r.width<=391 && r.y>=-1 && r.y+r.height<=845,'Dialog overflow '+id+' '+JSON.stringify(r));checks++;
  }
  console.log('PASS all '+modalIds.length+' dialog shells within mobile viewport');
  await page.evaluate(()=>{document.querySelectorAll('.modal-backdrop').forEach(el=>{el.hidden=true;});document.activeElement.blur();switchView('homeView');});
  await page.locator('.budget-assistant-launcher').click();
  await page.evaluate(()=>{window.__inlineTools=createBudgetLunaTools();window.__inlineTools.stage({collection:'records',action:'create',id:'',fields:[{key:'title',value:'Luna klavye testi'},{key:'amount',value:'20'}]});});
  const inlineField=page.locator('.budget-assistant-panel #entryModal #amount');await inlineField.focus();
  await page.evaluate(()=>{window.__testViewport.height=360;window.__testViewport.dispatchEvent(new Event('resize'));});await page.waitForTimeout(150);
  const inlineBounds=await inlineField.boundingBox();assert.ok(inlineBounds.y>=0 && inlineBounds.y+inlineBounds.height<=361,JSON.stringify(inlineBounds));checks++;
  await page.evaluate(()=>{window.__inlineTools.reset();document.activeElement.blur();window.__testViewport.height=844;window.__testViewport.dispatchEvent(new Event('resize'));});
  console.log('PASS Luna inline approval field remains visible with synthetic keyboard');
  for(const palette of ['mint','ocean','lavender','sunset'])for(const mode of ['light','dark']){
    const first=await context.newPage();
    await first.addInitScript(({palette,mode})=>{
      localStorage.setItem('akis-budget-palette',palette);localStorage.setItem('akis-budget-ui-settings',JSON.stringify({theme:mode}));
      localStorage.setItem('akis-budget-theme',mode==='dark'?'light':'dark');
    },{palette,mode});
    await first.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
    await first.goto(`http://127.0.0.1:${server.address().port}/`);
    const result=await first.evaluate(()=>({theme:document.documentElement.dataset.theme,palette:document.documentElement.dataset.palette,count:document.querySelectorAll('meta[name="theme-color"]').length,meta:document.querySelector('meta[name="theme-color"]').content,expected:budgetPageColors[document.documentElement.dataset.palette][document.documentElement.dataset.theme]}));
    assert.equal(result.theme,mode);assert.equal(result.palette,palette);assert.equal(result.count,1);assert.equal(result.meta,result.expected);checks++;await first.close();
  }
  console.log('PASS all four palettes, light/dark, saved-settings priority at first load');
  assert.deepEqual(errors,[]);
  console.log(checks+' mobile geometry/interaction checks passed; synthetic viewport, not physical iPhone.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
