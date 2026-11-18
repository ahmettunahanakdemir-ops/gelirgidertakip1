// Visual viewport coordinates include the iOS keyboard and browser panning.
(() => {
  const root = document.documentElement;
  let frame = 0, baseline = window.innerHeight;
  const editable = el => el instanceof HTMLElement && el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, [contenteditable="true"]');
  function keepFocusVisible() {
    const field = document.activeElement;
    if (!editable(field) || !field.closest('.modal-backdrop, .budget-assistant-panel')) return;
    const viewport = window.visualViewport;
    const top = (viewport?.offsetTop || 0) + 12;
    const bottom = (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) - 20;
    const rect = field.getBoundingClientRect();
    const modal = field.closest('.modal-backdrop') || field.closest('.budget-assistant-panel');
    const header = modal.querySelector('.unified-modal-nav, .bank-import-preview-modal-nav, .entry-modal-nav, .asset-entry-modal-nav');
    const visibleTop = Math.max(top, header?.getBoundingClientRect().bottom || top) + 8;
    let delta = rect.bottom > bottom ? rect.bottom - bottom : rect.top < visibleTop ? rect.top - visibleTop : 0;
    // Scroll inner containers first, not the page behind a dialog.
    for (let parent = field.parentElement; parent && modal.contains(parent) && Math.abs(delta) > 1; parent = parent.parentElement) {
      if (!/(auto|scroll)/.test(getComputedStyle(parent).overflowY) || parent.scrollHeight <= parent.clientHeight) continue;
      const before = parent.scrollTop;
      parent.scrollTop += delta;
      delta -= parent.scrollTop - before;
    }
  }
  function update() {
    frame = 0;
    const viewport = window.visualViewport;
    const height = viewport?.height || innerHeight, top = viewport?.offsetTop || 0;
    if (!editable(document.activeElement)) baseline = Math.max(innerHeight, height);
    const keyboard = editable(document.activeElement) && Math.max(baseline, innerHeight) - height > 100;
    root.style.setProperty('--mobile-visual-height', `${height}px`);
    root.style.setProperty('--mobile-visual-top', `${top}px`);
    root.classList.toggle('mobile-keyboard-open', !!keyboard);
    document.querySelectorAll('#bankImportPreviewModal').forEach(modal => modal.classList.toggle('is-editing-bank-row', !!document.activeElement?.closest('#bankImportPreviewList')));
    positionMenus();
    requestAnimationFrame(keepFocusVisible);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function closeMenu(wrapper) {
    wrapper.classList.remove('is-open'); wrapper.querySelector('.custom-filter-trigger')?.setAttribute('aria-expanded','false');
  }
  function positionMenus() {
    document.querySelectorAll('.custom-filter-menu[popover]').forEach(menu=>{
      if (!menu.parentElement.classList.contains('is-open')) {
        menu.parentElement.querySelector('.custom-filter-trigger')?.setAttribute('aria-expanded','false');
        if (menu.matches(':popover-open')) menu.hidePopover();
      }
    });
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop || 0, left = viewport?.offsetLeft || 0;
    const height = viewport?.height || innerHeight, width = viewport?.width || innerWidth;
    document.querySelectorAll('.custom-filter-select.is-open').forEach(wrapper => {
      const trigger = wrapper.querySelector('.custom-filter-trigger'), menu = wrapper.querySelector('.custom-filter-menu');
      if (!trigger || !menu) return;
      if (typeof menu.showPopover === 'function') {
        menu.setAttribute('popover','manual');
        if (!menu.matches(':popover-open')) menu.showPopover();
      }
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < top || rect.top > top + height || !trigger.getClientRects().length) {closeMenu(wrapper);return;}
      const below = top + height - rect.bottom - 12, above = rect.top - top - 12;
      const upwards = below < 160 && above > below;
      const maxHeight = Math.max(40, Math.min(280, upwards ? above : below));
      const menuWidth = Math.min(Math.max(rect.width, wrapper.dataset.for === 'filterPaymentAccount' ? 320 : 180), width-16);
      const x = Math.max(left+8, Math.min(rect.left, left+width-menuWidth-8));
      for (const [key,value] of Object.entries({position:'fixed',left:`${x}px`,right:'auto',width:`${menuWidth}px`,'max-width':`${menuWidth}px`,'max-height':`${maxHeight}px`,top:upwards?'auto':`${rect.bottom+4}px`,bottom:upwards?`${innerHeight-rect.top+4}px`:'auto'})) menu.style.setProperty(key,value,'important');
    });
  }
  document.addEventListener('focusin',schedule);
  document.addEventListener('focusout',()=>setTimeout(schedule,60));
  document.addEventListener('click',event=>{
    if (event.target.closest('.custom-filter-trigger')) {
      schedule();
      requestAnimationFrame(()=>event.target.closest('.custom-filter-select')?.querySelector('.is-active')?.scrollIntoView({block:'nearest'}));
    }
  });
  document.addEventListener('keydown',event=>{
    const wrapper = event.target.closest('.custom-filter-select');
    if (!wrapper) return;
    if (event.key === 'Escape') {closeMenu(wrapper);wrapper.querySelector('.custom-filter-trigger')?.focus();}
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key) && wrapper.classList.contains('is-open')) {
      event.preventDefault();
      const items = [...wrapper.querySelectorAll('.custom-filter-option:not(:disabled)')];
      let index = items.indexOf(document.activeElement);
      index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length-1 : Math.max(0,Math.min(items.length-1,index+(event.key === 'ArrowDown'?1:-1)));
      items[index]?.focus({preventScroll:true});items[index]?.scrollIntoView({block:'nearest'});
    }
  });
  document.addEventListener('scroll',event=>{if (!event.target.closest?.('.custom-filter-menu')) schedule();},true);
  window.visualViewport?.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('scroll',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('orientationchange',()=>{baseline=innerHeight;setTimeout(schedule,120);});
  window.addEventListener('pageshow',()=>{window.syncBudgetStatusBarColor?.();schedule();});
  new MutationObserver(records=>{if(records.some(record=>record.attributeName==='hidden' || record.target.matches('.custom-filter-select')))schedule();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','class']});
  update();
})();
