// Repository - Camada de persistência para carrinho
class CartRepository {
    constructor() {
        this.storageKey = 'designfej_cart';
    }

    // Buscar todos os itens do carrinho
    findAll() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    // Adicionar item ao carrinho
    addItem(item) {
        const cartItems = this.findAll();
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += item.quantity || 1;
        } else {
            cartItems.push({
                ...item,
                quantity: item.quantity || 1
            });
        }

        localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
        return cartItems;
    }

    // Remover item do carrinho
    removeItem(itemId) {
        const cartItems = this.findAll();
        const filteredItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
        return filteredItems;
    }

    // Atualizar quantidade de um item
    updateQuantity(itemId, quantity) {
        const cartItems = this.findAll();
        const itemIndex = cartItems.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            if (quantity <= 0) {
                cartItems.splice(itemIndex, 1);
            } else {
                cartItems[itemIndex].quantity = quantity;
            }
        }

        localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
        return cartItems;
    }

    // Limpar carrinho
    clear() {
        localStorage.removeItem(this.storageKey);
        return [];
    }

    // Contar itens no carrinho
    count() {
        return this.findAll().length;
    }

    // Calcular total do carrinho
    getTotal() {
        const items = this.findAll();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

export default CartRepository;