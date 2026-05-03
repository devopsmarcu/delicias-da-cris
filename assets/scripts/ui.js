import { menuData } from './menu.js';
import { generateWhatsAppLink } from './whatsapp.js';

const CATEGORY_ICONS = {
  'simples': '🥟',
  'especiais': '⭐',
  'tortas-salgadas': '🥧',
  'bolos-simples': '🍰',
  'bolos-cobertura': '🎂',
  'paes-forno': '🍞',
};

export class UI {
  constructor(cart) {
    this.cart = cart;
    this.menuContainer = document.getElementById('menu-container');
    this.cartModal = document.getElementById('cart-modal');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.cartTotalEl = document.getElementById('cart-total');
    this.cartBadge = document.getElementById('cart-badge');
    this.cartFab = document.getElementById('cart-fab');
    this.closeCartBtn = document.getElementById('close-cart-btn');
    this.clearCartBtn = document.getElementById('clear-cart-btn');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.headerCategory = document.getElementById('header-category');

    this.cart.onUpdate((updatedCart) => this.onCartUpdate(updatedCart));
    this.setupGlobalListeners();
    this.render();
    this.updateCartUI(this.cart);
  }

  // ─── Routing ───────────────────────────────────────────────
  getRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'home';
  }

  render() {
    const route = this.getRoute();
    this.updateActiveNav(route);

    if (route === 'home') {
      this.renderHome();
      if (this.headerCategory) this.headerCategory.textContent = 'Cardápio';
    } else {
      const category = menuData.find(c => c.id === route);
      if (category) {
        this.renderCategory(category);
        if (this.headerCategory) this.headerCategory.textContent = category.title;
      } else {
        this.renderHome();
        if (this.headerCategory) this.headerCategory.textContent = 'Cardápio';
      }
    }
  }

  updateActiveNav(route) {
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === route);
    });
  }

  // ─── Home Screen ───────────────────────────────────────────
  renderHome() {
    if (!this.menuContainer) return;

    const categoryCards = menuData.map(cat => `
      <a href="#${cat.id}" class="category-card" data-route="${cat.id}" aria-label="${cat.title}">
        <span class="cat-icon">${CATEGORY_ICONS[cat.id] || '🍽️'}</span>
        <span class="cat-title">${cat.title}</span>
      </a>
    `).join('');

    this.menuContainer.innerHTML = `
      <div class="home-hero">
        <img class="home-logo" src="assets/images/logo.png" alt="Logo da Delícias da Cris" decoding="async" />
        <h1 class="home-title">Delícias da Cris</h1>
        <p class="home-subtitle">CARDÁPIO DIGITAL</p>
      </div>

      <div class="home-info">
        <div class="info-item">
          <span class="info-dot"></span>
          Aceitamos encomendas
        </div>
        <div class="info-item">
          <span class="info-dot"></span>
          Entregas ou retirada na loja (taxa a combinar)
        </div>
      </div>

      <div class="category-grid">
        ${categoryCards}
      </div>

      <footer class="home-footer">
        <div class="brand">Delícias da Cris</div>
        <div class="meta">
          <a href="https://instagram.com/Delicias_da_CrisXx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">@Delicias_da_CrisXx</a>
          <a href="tel:+5571988080613" aria-label="Ligar">(71) 98808-0613</a>
          <address style="all:unset;">Rua José Cardoso dos Santos, 39</address>
        </div>
        <a class="cta" href="https://wa.me/5571988080613" target="_blank" rel="noopener noreferrer" aria-label="Pedir pelo WhatsApp">
          Peça pelo WhatsApp 💬
        </a>
      </footer>
    `;
  }

  // ─── Category Screen ───────────────────────────────────────
  renderCategory(category) {
    if (!this.menuContainer) return;

    const icon = CATEGORY_ICONS[category.id] || '🍽️';
    const itemsHTML = category.items.map(item => this.renderItem(item)).join('');

    this.menuContainer.innerHTML = `
      <div class="category-page-header">
        <span class="category-page-icon" aria-hidden="true">${icon}</span>
        <div>
          <h1 class="category-page-title">${category.title}</h1>
          <p class="category-page-count">${category.items.length} itens disponíveis</p>
        </div>
      </div>
      <div class="menu-section">
        <ul id="menu-list">
          ${itemsHTML}
        </ul>
      </div>
    `;

    this.attachItemControls();
  }

  renderItem(item) {
    const hasFlavors = item.flavors && item.flavors.length > 0;
    let flavorHtml = '';
    let currentCartId = item.id;

    if (hasFlavors) {
      currentCartId = `${item.id}|${item.flavors[0]}`;
      const options = item.flavors.map(f => `<option value="${f}">${f}</option>`).join('');
      flavorHtml = `<select class="flavor-select" data-id="${item.id}" aria-label="Sabor de ${item.name}">${options}</select>`;
    }

    const qty = this.cart.getQuantity(currentCartId);
    const subtotal = qty > 0 ? `R$ ${(item.price * qty).toFixed(2).replace('.', ',')} (${qty} un.)` : '';
    const badgeHtml = item.badge
      ? `<span class="badge ${item.badge.toLowerCase() === 'especial' ? 'special' : ''}">${item.badge}</span>`
      : '';

    return `
      <li class="menu-item" data-id="${item.id}">
        <div class="item-top">
          <div class="item-title-wrapper">
            <span class="item-name">${item.name}${badgeHtml}</span>
            ${flavorHtml}
          </div>
          <div style="text-align:right;">
            <span class="item-unit-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            <div class="item-subtotal ${qty > 0 ? 'has-items' : ''}" id="subtotal-${item.id}">
              ${subtotal}
            </div>
          </div>
        </div>
        <div class="controls-wrapper">
          <div class="main-controls">
            <button class="ctrl-btn minus" data-id="${item.id}" aria-label="Remover 1" ${qty === 0 ? 'disabled' : ''}>−</button>
            <input
              type="number"
              class="qty-input"
              id="qty-${item.id}"
              data-id="${item.id}"
              value="${qty}"
              min="0"
              inputmode="numeric"
              aria-label="Quantidade de ${item.name}"
            />
            <button class="ctrl-btn plus" data-id="${item.id}" aria-label="Adicionar 1">+</button>
          </div>
          <div class="quick-controls">
            <div class="quick-group">
              <button class="quick-btn quick-plus" data-id="${item.id}" data-qty="10" aria-label="Adicionar 10">+10</button>
              <button class="quick-btn quick-plus" data-id="${item.id}" data-qty="25" aria-label="Adicionar 25">+25</button>
              <button class="quick-btn quick-plus" data-id="${item.id}" data-qty="50" aria-label="Adicionar 50">+50</button>
              <button class="quick-btn quick-plus" data-id="${item.id}" data-qty="100" aria-label="Adicionar 100">+100</button>
            </div>
            <div class="quick-group">
              <button class="quick-btn quick-minus" data-id="${item.id}" data-qty="10" aria-label="Remover 10" ${qty === 0 ? 'disabled' : ''}>-10</button>
              <button class="quick-btn quick-minus" data-id="${item.id}" data-qty="25" aria-label="Remover 25" ${qty === 0 ? 'disabled' : ''}>-25</button>
              <button class="quick-btn quick-minus" data-id="${item.id}" data-qty="50" aria-label="Remover 50" ${qty === 0 ? 'disabled' : ''}>-50</button>
              <button class="quick-btn quick-minus" data-id="${item.id}" data-qty="100" aria-label="Remover 100" ${qty === 0 ? 'disabled' : ''}>-100</button>
            </div>
          </div>
        </div>
      </li>
    `;
  }

  attachItemControls() {
    if (!this.menuContainer) return;

    // Abort previous listeners to avoid stacking on re-renders
    if (this._menuAbortCtrl) this._menuAbortCtrl.abort();
    this._menuAbortCtrl = new AbortController();
    const signal = this._menuAbortCtrl.signal;

    // Button clicks (+ / - / quick buttons)
    this.menuContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;

      const baseId = btn.dataset.id;
      const baseItemData = this.findItemData(baseId);
      if (!baseItemData) return;

      let cartId = baseId;
      let itemDataToCart = baseItemData;

      if (baseItemData.flavors && baseItemData.flavors.length > 0) {
        const selectEl = this.menuContainer.querySelector(`select.flavor-select[data-id="${baseId}"]`);
        if (selectEl) {
          const flavor = selectEl.value;
          cartId = `${baseId}|${flavor}`;
          itemDataToCart = {
            ...baseItemData,
            id: cartId,
            name: `${baseItemData.name} - ${flavor}`
          };
        }
      }

      if (btn.classList.contains('plus')) {
        this.cart.addItem(itemDataToCart, 1);
      } else if (btn.classList.contains('minus')) {
        this.cart.removeItem(cartId, 1);
      } else if (btn.classList.contains('quick-plus')) {
        const qty = parseInt(btn.dataset.qty, 10);
        this.cart.addItem(itemDataToCart, qty);
      } else if (btn.classList.contains('quick-minus')) {
        const qty = parseInt(btn.dataset.qty, 10);
        this.cart.removeItem(cartId, qty);
      }
    }, { signal });

    // Manual input: 'change' fires on blur or Enter
    this.menuContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('flavor-select')) {
        // Flavor changed, refresh the controls for this item
        this.refreshItemQuantities(this.cart);
        return;
      }

      const input = e.target.closest('input.qty-input[data-id]');
      if (!input) return;

      const baseId = input.dataset.id;
      const baseItemData = this.findItemData(baseId);
      if (!baseItemData) return;

      let cartId = baseId;
      let itemDataToCart = baseItemData;

      if (baseItemData.flavors && baseItemData.flavors.length > 0) {
        const selectEl = this.menuContainer.querySelector(`select.flavor-select[data-id="${baseId}"]`);
        if (selectEl) {
          const flavor = selectEl.value;
          cartId = `${baseId}|${flavor}`;
          itemDataToCart = {
            ...baseItemData,
            id: cartId,
            name: `${baseItemData.name} - ${flavor}`
          };
        }
      }

      const newQty = parseInt(input.value, 10);

      if (isNaN(newQty) || newQty < 0) {
        // Reset to current cart value if invalid
        input.value = this.cart.getQuantity(cartId);
        return;
      }

      this.cart.setQuantity(cartId, newQty, itemDataToCart);
    }, { signal });
  }

  findItemData(id) {
    for (const category of menuData) {
      const item = category.items.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }

  // ─── Cart UI ───────────────────────────────────────────────
  onCartUpdate(updatedCart) {
    this.updateCartUI(updatedCart);
    this.refreshItemQuantities(updatedCart);
  }

  refreshItemQuantities(updatedCart) {
    // Update only visible elements — no full re-render
    menuData.forEach(cat => {
      cat.items.forEach(item => {
        const qtyInput = document.getElementById(`qty-${item.id}`);
        const subtotalEl = document.getElementById(`subtotal-${item.id}`);
        const minusBtn = this.menuContainer?.querySelector(`.minus[data-id="${item.id}"]`);
        const quickMinusBtns = this.menuContainer?.querySelectorAll(`.quick-minus[data-id="${item.id}"]`);

        if (!qtyInput) return; // Se o input não existe, pula este item

        let currentCartId = item.id;
        if (item.flavors && item.flavors.length > 0) {
          const selectEl = this.menuContainer?.querySelector(`select.flavor-select[data-id="${item.id}"]`);
          if (selectEl) {
            currentCartId = `${item.id}|${selectEl.value}`;
          }
        }

        const qty = updatedCart.getQuantity(currentCartId);

        // Only update the input if the user isn't actively typing in it
        if (document.activeElement !== qtyInput) {
          qtyInput.value = qty;
        }

        if (subtotalEl) {
          if (qty > 0) {
            subtotalEl.textContent = `R$ ${(item.price * qty).toFixed(2).replace('.', ',')} (${qty} un.)`;
            subtotalEl.className = 'item-subtotal has-items';
          } else {
            subtotalEl.textContent = '';
            subtotalEl.className = 'item-subtotal';
          }
        }

        if (minusBtn) minusBtn.disabled = qty === 0;
        quickMinusBtns?.forEach(btn => btn.disabled = qty === 0);
      });
    });
  }

  updateCartUI(updatedCart) {
    const totalItems = updatedCart.getTotalItems();

    // Badge
    if (this.cartBadge) this.cartBadge.textContent = totalItems;

    // Cart items list
    if (this.cartItemsList) {
      this.cartItemsList.innerHTML = '';
      const items = updatedCart.getItems();

      if (items.length === 0) {
        this.cartItemsList.innerHTML = `
          <li class="empty-cart-msg">
            <span class="empty-icon">🛒</span>
            Seu carrinho está vazio.<br>Selecione itens do cardápio!
          </li>`;
        if (this.checkoutBtn) this.checkoutBtn.disabled = true;
      } else {
        if (this.checkoutBtn) this.checkoutBtn.disabled = false;

        items.forEach(item => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-detail">R$ ${item.price.toFixed(2).replace('.', ',')} × ${item.quantity}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div class="cart-item-controls">
                <button class="cart-ctrl-btn cart-minus" data-id="${item.id}" aria-label="Remover 1">−</button>
                <span class="cart-qty">${item.quantity}</span>
                <button class="cart-ctrl-btn cart-plus" data-id="${item.id}" aria-label="Adicionar 1">+</button>
              </div>
              <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          `;
          this.cartItemsList.appendChild(li);
        });
      }
    }

    // Total
    if (this.cartTotalEl) {
      this.cartTotalEl.textContent = `R$ ${updatedCart.getTotalPrice().toFixed(2).replace('.', ',')}`;
    }
  }

  // ─── Global Event Listeners ────────────────────────────────
  setupGlobalListeners() {
    // Hash-based routing
    window.addEventListener('hashchange', () => this.render());

    // Cart fab
    this.cartFab?.addEventListener('click', () => this.openCart());

    // Close cart
    this.closeCartBtn?.addEventListener('click', () => this.closeCart());

    // Close on backdrop click
    this.cartModal?.addEventListener('click', (e) => {
      if (e.target === this.cartModal) this.closeCart();
    });

    // Clear cart
    this.clearCartBtn?.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        this.cart.clear();
      }
    });

    // Checkout
    this.checkoutBtn?.addEventListener('click', () => {
      const link = generateWhatsAppLink(this.cart);
      window.open(link, '_blank');
    });

    // Cart item controls (delegated on modal)
    this.cartItemsList?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.classList.contains('cart-plus')) {
        const itemData = this.findItemData(id);
        if (itemData) this.cart.addItem(itemData, 1);
      } else if (btn.classList.contains('cart-minus')) {
        this.cart.removeItem(id, 1);
      }
    });

    // ESC to close cart
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeCart();
    });
  }

  openCart() {
    this.cartModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    this.cartModal?.classList.remove('active');
    document.body.style.overflow = '';
  }
}
