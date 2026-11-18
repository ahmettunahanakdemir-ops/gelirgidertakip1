const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, name), 'utf8');
let checks = 0;
function test(name, body) { body(); checks++; console.log('PASS', name); }

class Element {
  constructor(id='') { this.id=id;this.value='';this.hidden=false;this.type='text';this.maxLength=500;this.tagName='INPUT';this.options=[];this.children=[];this.events={};this.classList={add(){},remove(){}}; }
  before() {} append(...items) {this.children.push(...items);} prepend() {} replaceWith() {} querySelector(){return null;} setAttribute(){} remove(){}
  addEventListener(name,fn) {this.events[name]=fn;} removeEventListener(name) {delete this.events[name];}
  dispatchEvent() {} closest() {return null;} get dataset(){return {};}
}
const nodes=new Map();
const doc={getElementById(id){if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);},querySelector(){return panel;},createComment(){return new Element();},createElement(){return new Element();}};
const panel=new Element('panel');
const state={records:Array.from({length:85},(_,i)=>({id:'r'+i,title:'Market '+i,type:i%2?'income':'expense',amount:i+1,date:'2026-11-10',paymentAccountId:'bank1',privateSecret:'not exposed'})),accounts:[{id:'bank1',name:'Banka',type:'bank_account',balance:100}],debts:[{id:'d1',person:'Ali',kind:'receivable',amount:500,originalAmount:700,payments:[{amount:200}]}],assets:[{id:'a1',label:'Altin',type:'GOLD',amount:10,value:50000}],bes:[{id:'b1',provider:'Emeklilik',total:1000,contribution:800,gain:200}],categories:{expense:['Market'],income:['Maas']}};
let user={uid:'u1',getIdToken:async()=> 'test-token'}, writes=0, opened=[];
const ctx=vm.createContext({console,document:doc,getTurkeyTodayISO:()=> '2026-11-18',Event:class{},MutationObserver:class{observe(){}disconnect(){}},
  genericConfirmModal:doc.getElementById('genericConfirmModal'),genericConfirmButton:doc.getElementById('genericConfirmButton'),pendingGenericConfirmAction:null,
  confirmPaymentAccountDeleteModal:doc.getElementById('confirmPaymentAccountDeleteModal'),
  getTransactionDeletionCascadeIds:()=>new Set(['r0']),
});
function open(name,modal) {ctx[name]=()=>{opened.push(name);doc.getElementById(modal).hidden=false;};}
for(const [name,modal] of Object.entries({openEntryModal:'entryModal',editTransaction:'transactionEditModal',openPaymentAccountModal:'paymentAccountModal',openAssetAddModal:'assetEditModal',openAssetEditModal:'assetEditModal',openBesModal:'besModal',borcAlacakPenceresiniAc:'debtModal',borcAlacakOdemePenceresiniAc:'debtPaymentModal',openPaymentAccountDeleteModal:'confirmPaymentAccountDeleteModal'}))open(name,modal);
for(const name of ['requestTransactionDelete','requestAssetDelete','requestBesDelete','borcAlacakKaydiniSilmeOnayi'])ctx[name]=()=>{ctx.genericConfirmModal.hidden=false;ctx.pendingGenericConfirmAction=()=>{writes++;};};
vm.runInContext(source('assets/js/22-luna-tools.js'),ctx);
const tools=ctx.createLunaTools({getUser:()=>user,getState:()=>state,document:doc});
const query=(collection,extra={})=>({collection,filters:[],sortBy:'',descending:false,offset:0,sumFields:[],groupBy:'',...extra});
test('all five collections are discoverable',()=>{assert.equal(Object.keys(tools.catalog().collections).length,5);assert.equal(tools.catalog().collections.records.count,85);});
test('pagination does not hide older records',()=>{assert.equal(tools.read(query('records')).nextOffset,40);assert.equal(tools.read(query('records',{offset:80})).rows.length,5);});
test('totals use ALL matching rows, not only one page',()=>{assert.equal(tools.read(query('records',{sumFields:['amount']})).sums.amount,3655);});
test('structured filters and grouping preserve income/expense',()=>{const r=tools.read(query('records',{filters:[{field:'type',op:'eq',value:'expense'}],sumFields:['amount'],groupBy:'paymentAccountId'}));assert.equal(r.total,43);assert.equal(r.sums.amount,1849);assert.equal(r.groups[0].count,43);});
test('unknown/private fields and prototype names are rejected',()=>{assert.throws(()=>tools.read(query('__proto__')));assert.throws(()=>tools.read(query('records',{filters:[{field:'privateSecret',op:'eq',value:'x'}]})));assert.equal(tools.read(query('records')).rows[0].privateSecret,undefined);});
test('receivables are distinct from own debts',()=>{assert.equal(tools.read(query('debts',{filters:[{field:'kind',op:'eq',value:'receivable'}]})).total,1);assert.equal(tools.read(query('debts',{filters:[{field:'kind',op:'eq',value:'debt'}]})).total,0);});
test('wealth tools expose assets and BES separately from bank balances',()=>{assert.equal(tools.read(query('assets',{sumFields:['value']})).sums.value,50000);assert.equal(tools.read(query('bes',{sumFields:['total']})).sums.total,1000);});
test('create cannot smuggle an existing ID',()=>assert.throws(()=>tools.stage({collection:'debts',action:'create',id:'d1',fields:[]})));
test('unread update and guessed ID fail closed',()=>assert.throws(()=>tools.stage({collection:'accounts',action:'update',id:'other-account',fields:[]})));
test('unknown mutation fields never reach application forms',()=>assert.throws(()=>tools.stage({collection:'assets',action:'create',id:'',fields:[{key:'__proto__',value:'evil'}]})));
test('all module creates only open drafts, never save',()=>{for(const collection of ['records','accounts','assets','bes','debts']){tools.stage({collection,action:'create',id:'',fields:[]});assert.equal(writes,0);tools.reset();}assert.equal(opened.length,5);});
test('stale previously read record cannot be edited',()=>{tools.read(query('records'));state.records[0].amount++;assert.throws(()=>tools.stage({collection:'records',action:'update',id:'r0',fields:[]}));state.records[0].amount--;});
test('update prefills only approved fields and does not write',()=>{tools.read(query('assets'));tools.stage({collection:'assets',action:'update',id:'a1',fields:[{key:'amount',value:'12'}]});assert.equal(doc.getElementById('assetEditAmount').value,'12');assert.equal(state.assets[0].amount,10);tools.reset();});
test('stale form submit is blocked after another device changes data',()=>{tools.stage({collection:'bes',action:'create',id:'',fields:[]});state.bes[0].gain++;let blocked=false;doc.getElementById('besModal').events.submit({preventDefault(){blocked=true;},stopImmediatePropagation(){}});assert.ok(blocked);tools.reset();});
test('delete requires explicit confirmation and stale deletion is blocked',()=>{tools.read(query('assets'));tools.stage({collection:'assets',action:'delete',id:'a1',fields:[]});assert.equal(writes,0);state.assets[0].amount++;ctx.pendingGenericConfirmAction();assert.equal(writes,0);tools.reset();tools.read(query('assets'));tools.stage({collection:'assets',action:'delete',id:'a1',fields:[]});ctx.pendingGenericConfirmAction();assert.equal(writes,1);tools.reset();});
test('debt payment/tahsilat uses separate confirmation form',()=>{tools.read(query('debts'));tools.stage({collection:'debts',action:'pay',id:'d1',fields:[{key:'amount',value:'100'}]});assert.equal(doc.getElementById('debtPaymentAmountInput').value,'100');assert.equal(writes,1);tools.reset();});
test('switching user clears observed IDs',()=>{tools.read(query('assets'));user={uid:'u2'};assert.throws(()=>tools.stage({collection:'assets',action:'update',id:'a1',fields:[]}));});
test('logged out user cannot access catalog or data',()=>{user=null;assert.throws(()=>tools.catalog());assert.throws(()=>tools.read(query('records')));});

async function remoteTests() {
  const calls=[],replies=[],errors=[];let sequence=[],current={uid:'u1',getIdToken:async()=> 'token'};
  const remoteCtx=vm.createContext({AbortController,setTimeout,clearTimeout,console,
    fetch:async(url,options)=>{calls.push(JSON.parse(options.body));const turn=sequence.shift();return {ok:!!turn,json:async()=>({turn})};}});
  vm.runInContext(source('assets/js/19-assistant-ai.js').split('(() => {')[0],remoteCtx);
  const remote=remoteCtx.createBudgetAssistantRemote({getUser:()=>current,tools:{catalog:()=>({}),read:()=>({rows:[],total:0}),stage:()=> 'Taslak acildi; kaydedilmedi.',reset(){}},onReply:text=>replies.push(text),onStatus(){},onError:()=>errors.push(true)});
  sequence=[{kind:'read',text:'',reads:[query('debts')]},{kind:'reply',text:'Alacagin yok.'}];
  await remote.request('Bana borcu olanlar?');assert.equal(calls.length,2);assert.equal(calls[1].results.length,1);assert.equal(replies.at(-1),'Alacagin yok.');checks++;console.log('PASS AI chooses reads and writes final answer');
  sequence=[{kind:'reply',text:'4'}];await remote.request('2+2?');assert.equal(replies.at(-1),'4');checks++;console.log('PASS general questions also go to AI');
  sequence=[{kind:'stage',text:'Kaydettim!',operation:{}}];await remote.request('Ekle');assert.equal(replies.at(-1),'Taslak acildi; kaydedilmedi.');checks++;console.log('PASS model success claim cannot replace application confirmation');
  current={uid:'u2',getIdToken:async()=> 'token2'};sequence=[{kind:'reply',text:'Merhaba'}];await remote.request('Selam');assert.equal(calls.at(-1).history.length,0);checks++;console.log('PASS no conversation leakage between user sessions');
  sequence=[];await remote.request('Ozet');assert.equal(errors.length,1);checks++;console.log('PASS API failure has no local canned-answer fallback');
  sequence=[{kind:'reply',text:'Fotograf yorumu'}];await remote.request('Gorsele bak',{images:['data:image/jpeg;base64,AA==']});assert.equal(calls.at(-1).images.length,1);checks++;console.log('PASS images use the same AI and safe tool path');
  sequence=Array.from({length:9},()=>({kind:'read',text:'',reads:[query('records')]}));await remote.request('Tum ayrintilar');assert.equal(errors.length,2);checks++;console.log('PASS bounded read loop prevents runaway API usage');
  remote.reset();
}

async function serverTests() {
  let authorized=true, apiRequest, responseStatus=200;
  const sandbox=vm.createContext({exports:{},process:{env:{OPENAI_API_KEY:'mock-only',OPENAI_ASSISTANT_MODEL:'test-model'}},Buffer,AbortSignal,Intl,Date,
    require:()=>({authenticate:async()=>authorized,reply:(statusCode,body)=>({statusCode,body})}),
    fetch:async(url,options)=>{apiRequest=JSON.parse(options.body);return {ok:responseStatus===200,status:responseStatus,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({kind:'reply',text:'Merhaba',reads:[],operation:{collection:'records',action:'create',id:'',fields:[]}})}]}]})};}});
  vm.runInContext(source('netlify/functions/assistant-chat.js'),sandbox);
  const event={httpMethod:'POST',body:JSON.stringify({mode:'agent',message:'Selam',catalog:{},results:[],images:[]})};
  assert.equal((await sandbox.exports.handler(event)).statusCode,200);assert.equal(apiRequest.store,false);assert.equal(apiRequest.model,'test-model');assert.equal(apiRequest.text.format.strict,true);checks++;console.log('PASS server uses configured model, strict schema, no storage');
  authorized=false;assert.equal((await sandbox.exports.handler(event)).statusCode,401);authorized=true;checks++;console.log('PASS API requires authenticated session');
  event.body=JSON.stringify({mode:'agent',message:'x',images:['https://arbitrary-server/image']});assert.equal((await sandbox.exports.handler(event)).statusCode,400);checks++;console.log('PASS only bounded embedded images accepted');
  responseStatus=429;event.body=JSON.stringify({mode:'agent',message:'x'});assert.equal((await sandbox.exports.handler(event)).statusCode,429);checks++;console.log('PASS quota/rate errors preserved without secret exposure');
}
(async()=>{await remoteTests();await serverTests();console.log(`${checks} checks passed; synthetic fixtures only, no live financial writes.`);})().catch(error=>{console.error(error);process.exitCode=1;});
