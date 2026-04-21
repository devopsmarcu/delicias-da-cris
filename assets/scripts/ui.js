import { menuData } from './menu.js';
import { generateWhatsAppLink } from './whatsapp.js';

export class UI {
  constructor(cart) {
    this.cart = cart;
    this.menuContainer = document.getElementById('menu-container');
    this.categoryNav = document.getElementById('category-nav');
    this.cartFab = document.getElementById('cart-fab');
    this.cartModal = document.getElementById('cart-modal');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.cartTotalEl = document.getElementById('cart-total');
    this.cartBadge = document.getElementById('cart-badge');
    this.closeCartBtn = document.getElementById('close-cart-btn');
    this.clearCartBtn = document.getElementById('clear-cart-btn');
    this.checkoutBtn = document.getElementById('checkout-btn');

    this.cart.onUpdate((updatedCart) => this.updateCartUI(updatedCart));
    this.init();
  }

  init() {
    this.renderCategoryNav();
    this.renderMenu();
    this.setupEventListeners();
    this.updateCartUI(this.cart);
  }

  renderCategoryNav() {
    if (!this.categoryNav) return;
    this.categoryNav.innerHTML = '';
    menuData.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'nav-pill';
      btn.textContent = category.title;
      btn.onclick = () => {
        document.getElementById(`cat-${category.id}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      this.categoryNav.appendChild(btn);
    });
  }

  renderMenu() {
    if (!this.menuContainer) return;
    this.menuContainer.innerHTML = '';
    
    menuData.forEach(category => {
      const section = document.createElement('section');
      section.id = `cat-${category.id}`;
      section.setAttribute('aria-labelledby', `heading-${category.id}`);
      
      let html = `
        <h2 id="heading-${category.id}"><span class="h2-icon" aria-hidden="true"></span> ${category.title}</h2>
        <div class="h2-rule"></div>
        <ul>
      `;

      category.items.forEach(item => {
        const qty = this.cart.getQuantity(item.id);
        const badgeHtml = item.badge ? `<span class="badge ${item.badge.toLowerCase() === 'especial' ? 'special' : ''}">${item.badge}</span>` : '';
        
        html += `
          <li class="menu-item" data-id="${item.id}">
            <div class="item-info">
              <span class="item-name">${item.name} ${badgeHtml}</span>
              <span class="price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="item-controls">
              <button class="ctrl-btn minus" data-id="${item.id}" ${qty === 0 ? 'disabled' : ''}>-</button>
              <span class="qty-display" id="qty-${item.id}">${qty}</span>
              <button class="ctrl-btn plus" data-id="${item.id}">+</button>
            </div>
          </li>
        `;
      });

      html += `</ul>`;
      section.innerHTML = html;
      this.menuContainer.appendChild(section);
    });

    this.attachMenuControls();
  }

  attachMenuControls() {
    const plusBtns = this.menuContainer.querySelectorAll('.plus');
    const minusBtns = this.menuContainer.querySelectorAll('.minus');

    plusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const itemData = this.findItemData(id);
        if (itemData) this.cart.addItem(itemData);
      });
    });

    minusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.cart.removeItem(id);
      });
    });
  }

  findItemData(id) {
    for (const category of menuData) {
      const item = category.items.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }

  setupEventListeners() {
    if (this.cartFab) {
      this.cartFab.addEventListener('click', () => {
        this.cartModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    }

    if (this.closeCartBtn) {
      this.closeCartBtn.addEventListener('click', () => {
        this.cartModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (this.clearCartBtn) {
      this.clearCartBtn.addEventListener('click', () => {
        if(confirm('Tem certeza que deseja limpar o carrinho?')) {
          this.cart.clear();
        }
      });
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        const link = generateWhatsAppLink(this.cart);
        window.open(link, '_blank');
      });
    }
    
    // Close modal when clicking outside content
    if(this.cartModal) {
      this.cartModal.addEventListener('click', (e) => {
        if (e.target === this.cartModal) {
          this.cartModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  updateCartUI(updatedCart) {
    const totalItems = updatedCart.getTotalItems();
    
    // Update badge and fab visibility
    if (this.cartBadge) {
      this.cartBadge.textContent = totalItems;
      if (totalItems > 0) {
        this.cartFab.classList.add('visible');
      } else {
        this.cartFab.classList.remove('visible');
      }
    }

    // Update quantities in the menu
    updatedCart.getItems().forEach(item => {
      const qtyEl = document.getElementById(`qty-${item.id}`);
      if (qtyEl) {
        qtyEl.textContent = item.quantity;
      }
      const minusBtn = document.querySelector(`.minus[data-id="${item.id}"]`);
      if (minusBtn) {
        minusBtn.disabled = item.quantity === 0;
      }
    });

    // Reset quantities in the menu for items not in cart anymore
    menuData.forEach(cat => cat.items.forEach(item => {
      if(updatedCart.getQuantity(item.id) === 0) {
        const qtyEl = document.getElementById(`qty-${item.id}`);
        if(qtyEl) qtyEl.textContent = '0';
        const minusBtn = document.querySelector(`.minus[data-id="${item.id}"]`);
        if(minusBtn) minusBtn.disabled = true;
      }
    }));

    // Render cart items in modal
    if (this.cartItemsList) {
      this.cartItemsList.innerHTML = '';
      const items = updatedCart.getItems();
      
      if (items.length === 0) {
        this.cartItemsList.innerHTML = '<p class="empty-cart-msg">Seu carrinho está vazio.</p>';
        this.checkoutBtn.disabled = true;
      } else {
        this.checkoutBtn.disabled = false;
        items.forEach(item => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <div class="cart-item-info">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="item-controls cart-controls">
              <button class="ctrl-btn minus" data-id="${item.id}">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="ctrl-btn plus" data-id="${item.id}">+</button>
            </div>
          `;
          this.cartItemsList.appendChild(li);
        });

        // Attach events inside cart
        this.cartItemsList.querySelectorAll('.plus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const itemData = this.findItemData(id);
            if(itemData) this.cart.addItem(itemData);
          });
        });
        this.cartItemsList.querySelectorAll('.minus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            this.cart.removeItem(id);
          });
        });
      }
    }

    if (this.cartTotalEl) {
      this.cartTotalEl.textContent = `R$ ${updatedCart.getTotalPrice().toFixed(2).replace('.', ',')}`;
    }
  }
}
