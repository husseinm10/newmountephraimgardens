const PREVIEW_CATALOG = {
  "afternoon-tea-voucher": {
    "id": "afternoon-tea-voucher",
    "name": "Afternoon Tea Gift Voucher",
    "price": null,
    "url": "/newmountephraimgardens/shop-items/afternoon-tea-voucher/",
    "image": "/newmountephraimgardens/assets/170485a7d2a7.webp"
  },
  "adult-season-ticket-2026": {
    "id": "adult-season-ticket-2026",
    "name": "Adult Season Ticket 2027",
    "price": 30,
    "url": "/newmountephraimgardens/shop-items/adult-season-ticket-2026/",
    "image": "/newmountephraimgardens/assets/5d4cedb209fd.webp"
  },
  "child-season-ticket-2026": {
    "id": "child-season-ticket-2026",
    "name": "Child Season Ticket 2027",
    "price": 10,
    "url": "/newmountephraimgardens/shop-items/child-season-ticket-2026/",
    "image": "/newmountephraimgardens/assets/1390147e410f.webp"
  },
  "family-season-ticket-2026": {
    "id": "family-season-ticket-2026",
    "name": "Family Season Ticket 2027",
    "price": 65,
    "url": "/newmountephraimgardens/shop-items/family-season-ticket-2026/",
    "image": "/newmountephraimgardens/assets/a529148a9189.webp"
  },
  "the-guidebook": {
    "id": "the-guidebook",
    "name": "The History of Mount Ephraim",
    "price": null,
    "url": "/newmountephraimgardens/shop-items/the-guidebook/",
    "image": "/newmountephraimgardens/assets/39c50b782e63.webp"
  }
};
/* Presentation-only interactions. Never sends email, bookings or payment data. */
(() => {
  const base = '/newmountephraimgardens';
  const key = 'mount-ephraim-design-preview-v1';
  const dialog = document.querySelector('#preview-dialog');
  const toast = document.querySelector('.preview-toast');
  let timer;
  const money = value => new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP'}).format(value);
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
      return Object.fromEntries(Object.entries(value).filter(([id,n]) => PREVIEW_CATALOG[id] && Number.isInteger(n) && n > 0 && n <= 20));
    } catch { return {}; }
  }
  function notify(message) {
    toast.textContent = message; toast.classList.add('visible');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('visible'), 4500);
  }
  function save(cart) {
    try { localStorage.setItem(key, JSON.stringify(cart)); }
    catch { notify('Your browser could not save the preview basket. Please allow local storage to try it.'); return false; }
    render(); return true;
  }
  function message(title, text) {
    document.querySelector('#preview-title').textContent = title;
    document.querySelector('#preview-message').textContent = text;
    if (!dialog.open) dialog.showModal();
  }
  dialog.querySelectorAll('.preview-close,.preview-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close(); } });
  function element(tag, text, className) {
    const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;
  }
  function link(text, href, className) { const node=element('a',text,className);node.href=href;return node; }
  function button(text, label, onClick, className='quantity-button') {
    const node=element('button',text,className);node.type='button';node.setAttribute('aria-label',label);node.addEventListener('click',onClick);return node;
  }
  function render() {
    const cart=read(),entries=Object.entries(cart),count=entries.reduce((n,[,q])=>n+q,0);
    document.querySelectorAll(`a[href="${base}/basket/"]`).forEach(a=>{a.textContent=count?`Basket (${count})`:'Basket';});
    const host=document.querySelector('#preview-cart');if(!host)return;host.replaceChildren();
    if(!entries.length){const empty=element('div',undefined,'preview-empty');empty.append(element('h2','Your basket is currently empty.'),element('p','Explore gifts from Mount Ephraim.'),link('Explore gifts',base+'/gifts/','button'));host.append(empty);return;}
    const layout=element('div',undefined,'basket-layout'),items=element('div',undefined,'basket-items');let subtotal=0,unpriced=false;
    for(const[id,quantity]of entries){const product=PREVIEW_CATALOG[id];if(product.price===null)unpriced=true;else subtotal+=product.price*quantity;
      const row=element('article',undefined,'basket-item');
      const photo=element('img');photo.src=product.image;photo.alt='';photo.width=120;photo.height=144;row.append(photo);
      const info=element('div',undefined,'basket-item-info');const heading=element('h2');heading.append(link(product.name,product.url));info.append(heading,element('p',product.price===null?'Price not shown in this preview':money(product.price)+' per item','basket-price'));
      const controls=element('div',undefined,'quantity-controls');
      function change(delta){const next=read();next[id]=Math.min(20,Math.max(1,(next[id]||1)+delta));if(save(next)){const focus=document.querySelector(`[data-item="${id}"]`);focus?.focus();notify('Preview basket updated.');}}
      const minus=button('−','Decrease quantity of '+product.name,()=>change(-1));minus.disabled=quantity===1;
      const amount=element('span',String(quantity));amount.setAttribute('aria-label','Quantity '+quantity);
      const plus=button('+','Increase quantity of '+product.name,()=>change(1));plus.disabled=quantity===20;plus.dataset.item=id;
      controls.append(minus,amount,plus,button('Remove','Remove '+product.name,()=>{const next=read();delete next[id];if(save(next)){document.querySelector('.preview-basket h1')?.focus();notify(product.name+' removed.');}},'remove-item'));info.append(controls);row.append(info);
      row.append(element('span',product.price===null?'—':money(product.price*quantity),'basket-item-total'));items.append(row);
    }
    const summary=element('aside',undefined,'basket-summary');summary.append(element('span','Design preview','eyebrow'),element('h2','Your selection'));
    const total=element('div',undefined,'basket-total');total.append(element('span',unpriced?'Subtotal for priced items':'Item subtotal'),element('strong',money(subtotal)));summary.append(total);
    summary.append(element('p','Postage and packaging are not calculated in this preview.','preview-form-note'));if(unpriced)summary.append(element('p','Some selected items have no displayed price and are excluded from this subtotal.','preview-form-note'));
    summary.append(button('Preview checkout','Preview checkout',()=>message('Checkout preview','Your selection is ready to review. This is a design demonstration: no payment has been taken and no order has been created.'),'button'),link('Continue exploring gifts',base+'/gifts/','continue-shopping'));layout.append(items,summary);host.append(layout);
  }
  document.querySelector('.preview-basket h1')?.setAttribute('tabindex','-1');
  document.addEventListener('click',event=>{
    const add=event.target.closest('[data-preview-add]');if(add){const id=add.dataset.previewAdd;if(!PREVIEW_CATALOG[id])return;const cart=read();cart[id]=Math.min(20,(cart[id]||0)+1);if(save(cart))location.assign(base+'/basket/');return;}
    const action=event.target.closest('[data-preview-action]');if(action){event.preventDefault();message(action.dataset.previewAction==='booking'?'Booking preview':'Contact preview','This is a design preview. No enquiry or booking has been sent. The existing service can be connected when the design is approved.');}
  });
  document.querySelectorAll('[data-preview-newsletter]').forEach(form=>{
    function submit(event){event.preventDefault();if(!form.reportValidity())return;form.reset();message('Thank you for exploring','This is a preview of the newsletter confirmation. Your email has not been sent or saved, and no subscription has been created.');}
    form.addEventListener('submit',submit);form.querySelector('[data-preview-subscribe]').addEventListener('click',submit);
  });
  addEventListener('storage',event=>{if(event.key===key)render();});render();
})();

