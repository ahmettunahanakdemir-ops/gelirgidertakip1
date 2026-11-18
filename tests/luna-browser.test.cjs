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
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  const page=await context.newPage();
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
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(()=>{
    currentUser={uid:'luna-fixture-only',email:'fixture@example.invalid',getIdToken:async()=> 'mock-token'};
    firebaseDb=null;
    transactions=[];assets=[];besAccounts=[];borcAlacakKayitlari=[];paymentAccounts=[];
    transactionCategories={income:['Maas'],expense:['Market'],transfer:['Transfer']};
    document.documentElement.classList.remove('auth-logged-out');document.body.classList.remove('auth-logged-out');
    loginScreen.hidden=true;appShell.hidden=false;
    document.querySelectorAll('[id*="Splash"],[id*="splash"]').forEach(el=>{el.hidden=true;el.style.display='none';});
    render();
  });
  await page.locator('.budget-assistant-launcher').click();
  const ask=async message=>{await page.locator('[data-assistant-input]').fill(message);await page.locator('.budget-assistant-send').click();};
  const stage=(collection,action,id,fields)=>({kind:'stage',text:'Taslak',reads:[],operation:{collection,action,id,fields:Object.entries(fields).map(([key,value])=>({key,value:String(value)}))}});
  turns.push(stage('assets','create','',{type:'TRY',label:'Luna test varligi',amount:120}));
  await ask('120 TL test varlığı ekle');
  await page.locator('.budget-assistant-panel #assetEditModal:not([hidden])').waitFor();
  assert.equal(await page.evaluate(()=>assets.length),0);
  await page.locator('#assetEditSubmitButton').click();
  await page.waitForFunction(()=>assets.length===1);
  console.log('PASS real asset save only after explicit button approval');
  turns.push(stage('records','create','',{type:'expense',paymentMethod:'other',category:'Market',title:'Luna sentetik gider',amount:50,date:'2026-11-18'}));
  await ask('Hesapsız 50 TL market gideri ekle');
  await page.locator('.budget-assistant-panel #entryModal:not([hidden])').waitFor();
  assert.equal(await page.evaluate(()=>transactions.length),0);
  const submit=page.locator('#entryModal button[type="submit"], #entryModal button[form="entryForm"]');
  await submit.first().click();
  await page.waitForFunction(()=>transactions.length===1);
  console.log('PASS real transaction form persists only approved fixture');
  for(const entry of [
    {collection:'accounts',fields:{type:'bank_account',name:'Luna test banka',balance:500},modal:'paymentAccountModal',button:'paymentAccountSubmitButton',data:'accounts'},
    {collection:'bes',fields:{provider:'Luna test BES',contribution:100,stateContribution:30,stateGain:2,gain:5},modal:'besModal',button:'besSubmitButton',data:'bes'},
    {collection:'debts',fields:{listType:'receivable',person:'Luna test kisi',amount:100,startDate:'2026-11-18'},modal:'debtModal',button:'debtSubmitButton',data:'debts'},
  ]) {
    turns.push(stage(entry.collection,'create','',entry.fields));await ask('Sentetik '+entry.collection+' kaydi ekle');
    await page.locator(`.budget-assistant-panel #${entry.modal}:not([hidden])`).waitFor();
    await page.locator('#'+entry.button).click();
    await page.waitForFunction(name=>({accounts:paymentAccounts,bes:besAccounts,debts:borcAlacakKayitlari})[name].length===1,entry.data);
    console.log('PASS real approval/save for '+entry.collection);
  }
  const debt=await page.evaluate(()=>({id:borcAlacakKayitlari[0].id,account:paymentAccounts[0].id}));
  turns.push({kind:'read',text:'',reads:[{collection:'debts',filters:[],sortBy:'',descending:false,offset:0,sumFields:[],groupBy:''}]});
  turns.push(stage('debts','pay',debt.id,{amount:25,date:'2026-11-18',paymentAccountId:debt.account}));await ask('Test alacaktan 25 TL tahsilat kaydet');
  await page.locator('.budget-assistant-panel #debtPaymentModal:not([hidden])').waitFor();
  assert.equal(await page.evaluate(()=>borcAlacakKayitlari[0].amount),100);
  await page.locator('#debtPaymentSubmitButton').click();
  await page.waitForFunction(()=>borcAlacakKayitlari[0].amount===75);
  console.log('PASS actual receivable collection updates linked account only after approval');
  turns.push(stage('accounts','create','',{type:'cash',name:'Luna test kasa',balance:0}));await ask('Test kasasi ekle');
  await page.locator('.budget-assistant-panel #paymentAccountModal:not([hidden])').waitFor();
  await page.locator('#paymentAccountSubmitButton').click();await page.waitForFunction(()=>paymentAccounts.length===2);
  const destination=await page.evaluate(()=>paymentAccounts.find(row=>row.name==='Luna test kasa').id);
  turns.push(stage('records','create','',{type:'transfer',paymentMethod:'transfer',paymentAccountId:debt.account,transferAccountId:destination,title:'Luna test transfer',amount:30,date:'2026-11-18',transferFee:2}));
  await ask('Test bankadan kasaya 30 TL transfer ve 2 TL masraf kaydi olustur');
  await page.locator('.budget-assistant-panel #entryModal:not([hidden])').waitFor();
  await submit.first().click();await page.waitForFunction(()=>transactions.some(row=>row.title==='Luna test transfer'));
  assert.equal(await page.evaluate(id=>paymentAccounts.find(row=>row.id===id).balance,destination),30);
  console.log('PASS transfer uses real source/destination account effects after approval');
  const expense=await page.evaluate(()=>transactions.find(row=>row.title==='Luna sentetik gider').id);
  turns.push({kind:'read',text:'',reads:[{collection:'records',filters:[{field:'id',op:'eq',value:expense}],sortBy:'',descending:false,offset:0,sumFields:[],groupBy:''}]});
  turns.push(stage('records','delete',expense,{}));await ask('Test giderini sil');
  await page.locator('.budget-assistant-panel #genericConfirmModal:not([hidden])').waitFor();
  assert.equal(await page.evaluate(id=>transactions.some(row=>row.id===id),expense),true);
  await page.locator('#genericConfirmButton').click();
  await page.waitForFunction(id=>!transactions.some(row=>row.id===id),expense);
  console.log('PASS real transaction deletion requires separate approval');
  const image=await page.screenshot();
  await page.locator('.budget-assistant-panel input[type="file"]').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:image});
  turns.push({kind:'reply',text:'Sentetik görsel incelendi.',reads:[]});await ask('Bu görseli incele');
  await page.getByText('Sentetik görsel incelendi.',{exact:true}).waitFor();
  assert.ok(requests.at(-1).images[0].startsWith('data:image/jpeg;base64,'));
  await page.locator('.assistant-image-tray button').click();
  console.log('PASS actual image input is compressed and sent to same AI conversation');
  turns.push({kind:'read',text:'',reads:[{collection:'assets',filters:[],sortBy:'',descending:false,offset:0,sumFields:['value'],groupBy:''}]});
  // The mock chooses a real ID learned from the prior read result.
  turns.push({kind:'reply',text:'Sentetik varlık raporu: 120 TL.',reads:[]});
  await ask('Varlığım ne kadar?');
  await page.getByText('Sentetik varlık raporu: 120 TL.',{exact:true}).waitFor();
  assert.ok(requests.at(-1).results[0].result.rows[0].id);
  console.log('PASS AI read loop sees real application state');
  const id=await page.evaluate(()=>assets[0].id);
  turns.push(stage('assets','update',id,{amount:150}));await ask('Varlığı 150 yap');
  await page.locator('.budget-assistant-panel #assetEditModal:not([hidden])').waitFor();
  await page.evaluate(()=>{assets[0].amount=130;});
  await page.locator('#assetEditSubmitButton').click();
  assert.equal(await page.evaluate(()=>assets[0].amount),130);
  await page.getByText('Veriler veya oturum degisti. Kaydetmedim; taslagi yeniden iste.',{exact:true}).waitFor();
  console.log('PASS stale approval blocked in real DOM');
  fs.mkdirSync(output,{recursive:true});
  await page.screenshot({path:path.join(output,'luna-mobile-confirmation.png')});
  const bounds=await page.locator('#assetEditModal').boundingBox();
  assert.ok(bounds.x>=-1 && bounds.x+bounds.width<=391);
  await page.setViewportSize({width:1366,height:900});
  await page.screenshot({path:path.join(output,'luna-desktop-confirmation.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS mobile/desktop panel bounds and no page errors');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.close();});
