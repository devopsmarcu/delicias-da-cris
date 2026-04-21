export class Cart {
  constructor() {
    this.items = new Map();
    this.loadFromStorage();
  }

  loadFromStorage() {
    const savedCart = localStorage.getItem('delicias_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        parsed.forEach(item => {
          this.items.set(item.id, item);
        });
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
      }
    }
  }

  saveToStorage() {
    const cartArray = Array.from(this.items.values());
    localStorage.setItem('delicias_cart', JSON.stringify(cartArray));
  }

  addItem(itemData, quantity = 1) {
    if (this.items.has(itemData.id)) {
      const item = this.items.get(itemData.id);
      item.quantity += quantity;
    } else {
      this.items.set(itemData.id, { ...itemData, quantity: quantity });
    }
    this.saveToStorage();
    this.triggerUpdate();
  }

  removeItem(itemId, quantity = 1) {
    if (this.items.has(itemId)) {
      const item = this.items.get(itemId);
      if (item.quantity > quantity) {
        item.quantity -= quantity;
      } else {
        this.items.delete(itemId);
      }
      this.saveToStorage();
      this.triggerUpdate();
    }
  }

  /**
   * Define a quantidade diretamente (usado no input manual).
   * Se newQty <= 0, o item é removido do carrinho.
   */
  setQuantity(itemId, newQty, itemData) {
    const qty = Math.max(0, Math.floor(newQty));
    if (qty === 0) {
      this.items.delete(itemId);
    } else if (this.items.has(itemId)) {
      this.items.get(itemId).quantity = qty;
    } else if (itemData) {
      this.items.set(itemId, { ...itemData, quantity: qty });
    }
    this.saveToStorage();
    this.triggerUpdate();
  }

  clear() {
    this.items.clear();
    this.saveToStorage();
    this.triggerUpdate();
  }

  getQuantity(itemId) {
    return this.items.has(itemId) ? this.items.get(itemId).quantity : 0;
  }

  getTotalItems() {
    let total = 0;
    this.items.forEach(item => total += item.quantity);
    return total;
  }

  getTotalPrice() {
    let total = 0;
    this.items.forEach(item => total += (item.price * item.quantity));
    return total;
  }

  getItems() {
    return Array.from(this.items.values());
  }

  onUpdate(callback) {
    this.updateCallback = callback;
  }

  triggerUpdate() {
    if (this.updateCallback) {
      this.updateCallback(this);
    }
  }
}
