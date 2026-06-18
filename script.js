// script.js
// Генератор описаний и простая корзина, сохраняем в localStorage

function generateDescription(attrs) {
  const join = (arr) => arr.filter(Boolean).join(', ');
  function listFlowers(flowers) {
    if (!flowers || !flowers.length) return '';
    const parts = flowers.map(f => {
      const count = f.count ? `${f.count} ` : '';
      const type = f.type || 'цветок';
      const color = f.color ? ` ${f.color}` : '';
      return `${count}${type}${color}`.trim();
    });
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(' и ');
    return parts.slice(0, -1).join(', ') + ' и ' + parts.slice(-1);
  }

  const opening = [
    'Нежный, как утреннее прикосновение',
    'Яркий и выразительный',
    'Элегантный и утончённый',
    'Тёплый, как солнечный вечер',
    'Романтичный и мягкий'
  ];
  const materialPhrases = {
    kraft: 'обёрнут в натуральную крафт-бумагу и перевязан льняной лентой',
    paper: 'аккуратно завернут в дизайнерскую бумагу',
    fabric: 'оформлен в текстильную подложку для мягкости и презентабельности',
    vase: 'поставлен в стильную стеклянную вазу, готов к вручению',
    none: 'без упаковки — идеально для вставки в вазу'
  };
  const stylePhrases = {
    "романтический": 'подчёркива��т романтичность и нежность чувств',
    "рустик": 'создаёт ощущение домашнего уюта и натуральности',
    "минималистичный": 'лаконичный и современный, для поклонников чистых форм',
    "праздничный": 'поднимает настроение и создаёт атмосферу праздника',
    "элегантный": 'подходит для торжественных случаев и деловых поздравлений',
    "боho": 'стильно и необычно для интерьера'
  };

  const open = opening[Math.floor(Math.random() * opening.length)];
  const flowersList = listFlowers(attrs.flowers || []);
  const sizeText = attrs.size === 'малый' ? 'компактный букет' : attrs.size === 'большой' ? 'впечатляющий букет' : 'сбалансированный букет';
  const wrapKey = (attrs.wrap === 'крафт' && 'kraft') || (attrs.wrap === 'бумага' && 'paper') || (attrs.wrap === 'ткань' && 'fabric') || (attrs.wrap === 'ваза' && 'vase') || 'none';
  const wrapText = materialPhrases[wrapKey] || materialPhrases.none;
  const styleText = stylePhrases[attrs.style] || (attrs.style ? attrs.style : '');
  const extrasText = attrs.extras && attrs.extras.length ? `В комплекте: ${attrs.extras.join(', ')}.` : '';
  const scentText = attrs.scent === 'сильный' ? 'Аромат раскрывается богато и насыщенно.' : attrs.scent === 'легкий' ? 'Лёгкий, ненавязчивый аромат.' : attrs.scent === 'нет запаха' ? 'Практически не имеет выраженного аромата.' : '';

  const sentences = [];
  sentences.push(`${open}. ${sizeText} из ${flowersList}.`);
  if (styleText) sentences.push(`${styleText}.`);
  sentences.push(`${wrapText}.`);
  if (scentText) sentences.push(scentText);
  if (extrasText) sentences.push(extrasText);
  const occasionPool = [
    'Дарите близким, чтобы выразить благодарность и тепло.',
    'Отличный выбор для дня рождения, годовщины или как знак внимания просто так.',
    'Прекрасный подарок для романтического свидания и важных событий.',
    'Подойдёт как корпоративный подарок и для домашней композиц��и.'
  ];
  sentences.push(occasionPool[Math.floor(Math.random() * occasionPool.length)]);
  return sentences.map(s => s.replace(/\s+/g,' ').trim()).join(' ');
}

function updateCartCount() {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  const gift = document.getElementById('giftWrap')?.checked ? 50 : 0;
  const card = document.getElementById('includeCard')?.checked ? 30 : 0;
  const count = items.reduce((s, it) => s + (it.quantity || 1), 0);
  const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
  const total = subtotal + gift + card;
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total.toFixed(0);
  const cartItemsEl = document.getElementById('cartItems');
  if (cartItemsEl) {
    cartItemsEl.innerHTML = items.length ? items.map(it =>
      `<div class="cart-row"><strong>${it.name}</strong> × ${it.quantity} — ${(it.price*it.quantity).toFixed(0)} ₽</div>`
    ).join('') + `<div class="cart-row"><strong>Доп. опции</strong> — ${gift + card} ₽</div>` : '<div class="empty">Корзина пуста</div>';
  }
}

function addToCart(product) {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  const found = items.find(i => i.id === product.id);
  if (found) found.quantity += 1; else items.push(Object.assign({quantity:1}, product));
  localStorage.setItem('cart', JSON.stringify(items));
  updateCartCount();
}

function attachUI() {
  const optionsBtn = document.getElementById('optionsBtn');
  const optionsMenu = document.getElementById('optionsMenu');
  optionsBtn?.addEventListener('click', (e) => {
    optionsMenu.classList.toggle('show');
    const shown = optionsMenu.classList.contains('show');
    optionsMenu.setAttribute('aria-hidden', (!shown).toString());
  });
  document.addEventListener('click', (e) => {
    if (!optionsBtn) return;
    if (!optionsBtn.contains(e.target) && !optionsMenu.contains(e.target)) {
      optionsMenu.classList.remove('show');
      optionsMenu.setAttribute('aria-hidden', 'true');
    }
  });

  const cartToggle = document.getElementById('cartToggle');
  const cartPanel = document.getElementById('cartPanel');
  cartToggle?.addEventListener('click', () => {
    const open = cartPanel.classList.toggle('open');
    cartPanel.setAttribute('aria-hidden', (!open).toString());
    cartToggle.setAttribute('aria-expanded', open.toString());
  });

  document.getElementById('giftWrap')?.addEventListener('change', updateCartCount);
  document.getElementById('includeCard')?.addEventListener('change', updateCartCount);

  // Attach add-to-cart handlers
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-to-cart');
    const jsonEl = card.querySelector('[data-product-json]');
    let product = null;
    if (jsonEl) {
      try { product = JSON.parse(jsonEl.textContent); } catch(e){ product=null; }
    }
    if (!product) return;
    btn?.addEventListener('click', () => {
      addToCart({id:product.id,name:product.name,price:product.price});
    });
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    alert('Спасибо! Оформление в демо-версии не настроено.');
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'cart') updateCartCount();
  });
}

function fillDescriptions() {
  document.querySelectorAll('.product-card').forEach(card => {
    const descEl = card.querySelector('[data-description]');
    if (!descEl) return;
    let attrs = null;
    const jsonEl = card.querySelector('[data-product-json]');
    if (jsonEl) {
      try { attrs = JSON.parse(jsonEl.textContent); } catch(e){ attrs=null; }
    }
    if (!attrs) {
      const title = card.querySelector('.product-title')?.textContent || '';
      attrs = { name: title, flowers:[{type:title.replace(/.*\s/,'')}], style:'', size:'', wrap:'', extras:[] };
    }
    descEl.textContent = generateDescription(attrs);
  });
}

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
  attachUI();
  fillDescriptions();
  // Инициализируем корзину если нет
  if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
  updateCartCount();
});
