// Images use the same Luna conversation and confirmation tools as text.
(() => {
  const panel=document.querySelector('.budget-assistant-panel');
  const form=panel?.querySelector('[data-assistant-form]'), input=panel?.querySelector('[data-assistant-input]');
  if (!form || !input) return;
  const status=panel.querySelector('[data-assistant-status]');
  let files=[], urls=[], owner=currentUser?.uid || '', busy=false, epoch=0;
  const tray=document.createElement('div'); tray.className='assistant-image-tray'; tray.hidden=true; form.before(tray);
  const picker=document.createElement('input'); picker.type='file'; picker.accept='image/*'; picker.multiple=true; picker.hidden=true;
  const attach=document.createElement('button'); attach.type='button'; attach.className='budget-assistant-icon-button';
  attach.title='Fotoğraf ekle'; attach.setAttribute('aria-label',attach.title);
  attach.innerHTML='<i data-lucide="image-plus" aria-hidden="true"></i>';
  attach.addEventListener('click',()=>picker.click());
  panel.addEventListener('assistant-request-image',()=>picker.click()); form.before(attach,picker);
  function say(text) {status.textContent=text;status.hidden=!text;}
  function clear() { epoch++; urls.forEach(url=>URL.revokeObjectURL(url)); urls=[];files=[];tray.replaceChildren();tray.hidden=true;picker.value=''; }
  function select(incoming) {
    const uid=currentUser?.uid || '';
    if (owner!==uid) {clear();owner=uid;}
    if (!uid) return say('Fotoğraf için oturum açmalısın.');
    const images=Array.from(incoming).filter(file=>file && file.type.startsWith('image/'));
    if (files.length+images.length>4 || images.some(file=>file.size>10*1024*1024)) return say('En fazla dört fotoğraf; her biri en fazla 10 MB olabilir.');
    if (!images.length) return;
    files.push(...images);tray.hidden=false;
    for (const file of images) {
      const image=document.createElement('img');image.alt=file.name || 'Fotoğraf';
      const url=URL.createObjectURL(file);urls.push(url);image.src=url;tray.append(image);
    }
    if (!tray.querySelector('button')) {
      const remove=document.createElement('button');remove.type='button';remove.className='budget-assistant-icon-button';
      remove.title='Fotoğrafları kaldır';remove.setAttribute('aria-label',remove.title);
      remove.innerHTML='<i data-lucide="x" aria-hidden="true"></i>';remove.addEventListener('click',clear);tray.append(remove);
    }
    say(`${files.length} fotoğraf seçildi.`);window.lucide?.createIcons();
  }
  async function encode(file) {
    const url=URL.createObjectURL(file);
    try {
      const image=new Image(); image.src=url; await image.decode();
      const ratio=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
      const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
      let data=canvas.toDataURL('image/jpeg',0.78);
      if (data.length>950000) data=canvas.toDataURL('image/jpeg',0.5);
      if (data.length>1000000) throw new Error('Image too large');
      return data;
    } finally {URL.revokeObjectURL(url);}
  }
  picker.addEventListener('change',()=>select(picker.files));
  input.addEventListener('paste',event=>{
    const images=Array.from(event.clipboardData?.items || []).filter(item=>item.kind==='file' && item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);
    if (!images.length) return;
    event.preventDefault();select(images);
    const text=event.clipboardData.getData('text/plain');if(text) {input.value+=text;input.dispatchEvent(new Event('input',{bubbles:true}));}
  });
  panel.addEventListener('dragover',event=>{if(Array.from(event.dataTransfer?.types || []).includes('Files')) event.preventDefault();});
  panel.addEventListener('drop',event=>{if(event.dataTransfer?.files.length){event.preventDefault();select(event.dataTransfer.files);}});
  async function handle(event) {
    if (!files.length) return;
    event.preventDefault();event.stopImmediatePropagation();
    if (busy) return;
    if (!currentUser?.uid || currentUser.uid!==owner) {clear();return say('Oturum değişti. Fotoğrafı yeniden seç.');}
    const message=input.value.trim() || 'Bu fotoğrafta ne görüyorsun?';
    const uid=owner, version=epoch;busy=true;say('Fotoğraflar hazırlanıyor…');
    try {
      const images=[];
      for (const file of files.slice()) images.push(await encode(file));
      if (currentUser?.uid!==uid || version!==epoch) return;
      panel.dispatchEvent(new CustomEvent('assistant-image-message',{detail:{message,images}}));
    } catch {say('Fotoğraf hazırlanamadı. Daha küçük veya daha net bir görsel deneyebilirsin.');}
    finally {busy=false;}
  }
  form.addEventListener('submit',handle,true);
  input.addEventListener('keydown',event=>{if(event.key==='Enter' && !event.shiftKey && !event.isComposing) void handle(event);},true);
  new MutationObserver(()=>{const uid=currentUser?.uid || '';if(owner!==uid){clear();owner=uid;}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.addEventListener('pagehide',clear);window.lucide?.createIcons();
})();
