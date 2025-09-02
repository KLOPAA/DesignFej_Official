// View - Interface do carrinho
import CartController from '../controllers/CartController.js';

class CartView {
    constructor() {
        this.cartController = new CartController();
        this.initializeEventListeners();
        this.updateCartDisplay();
    }

    initializeEventListeners() {
        // Atualizar contador do carrinho ao carregar página
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartCount();
        });
    }

    // Adicionar item ao carrinho (chamado pelos botões dos produtos)
    addToCart(productId, productName, productPrice, productImage, productDetails) {
        const productData = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            details: productDetails
        };

        const result = this.cartController.addItem(productData);
        
        if (result.success) {
            this.updateCartCount();
            
            if (confirm(`${productName} adicionado ao carrinho! Deseja ir para o carrinho agora?`)) {
                window.location.href = './carrinho.html';
            }
        } else {
            alert(result.message);
        }
    }

    // Remover item do carrinho
    removeItem(itemId) {
        const result = this.cartController.removeItem(itemId);
        
        if (result.success) {
            this.updateCartDisplay();
            this.updateCartCount();
        } else {
            alert(result.message);
        }
    }

    // Atualizar quantidade
    updateQuantity(itemId, change) {
        const cartData = this.cartController.getItems();
        const item = cartData.items.find(item => item.id === itemId);
        
        if (item) {
            const newQuantity = item.quantity + change;
            const result = this.cartController.updateQuantity(itemId, newQuantity);
            
            if (result.success) {
                this.updateCartDisplay();
                this.updateCartCount();
            } else {
                alert(result.message);
            }
        }
    }

    // Finalizar compra
    checkout() {
        const result = this.cartController.checkout();
        
        if (result.success) {
            alert(`${result.message}\nTotal: R$ ${result.total.toFixed(2)}`);
            window.location.href = './index.html';
        } else {
            alert(result.message);
        }
    }

    // Atualizar contador do carrinho
    updateCartCount() {
        const cartData = this.cartController.getItems();
        const cartCountElement = document.querySelector('.cart-count');
        
        if (cartCountElement) {
            cartCountElement.textContent = cartData.count;
        }
    }

    // Atualizar display do carrinho (página carrinho.html)
    updateCartDisplay() {
        const carrinhoVazio = document.getElementById('carrinho-vazio');
        const carrinhoItensContainer = document.getElementById('carrinho-itens');
        
        if (!carrinhoItensContainer) return;

        const cartData = this.cartController.getItems();
        
        if (cartData.count === 0) {
            if (carrinhoVazio) carrinhoVazio.style.display = 'block';
            carrinhoItensContainer.innerHTML = '';
            return;
        }
        
        if (carrinhoVazio) carrinhoVazio.style.display = 'none';
        
        let html = '';
        
        cartData.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            
            html += `
                <div class="carrinho-item">
                    <div class="item-imagem">${item.name}</div>
                    <div class="item-info">
                        <div class="item-nome">${item.name}</div>
                        <div class="item-detalhes">${item.details}</div>
                        <div class="item-preco">R$ ${item.price.toFixed(2)}</div>
                        <div class="item-quantidade">
                            <button class="quantidade-btn" onclick="cartView.updateQuantity('${item.id}', -1)">-</button>
                            <input type="text" class="quantidade-input" value="${item.quantity}" readonly>
                            <button class="quantidade-btn" onclick="cartView.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remover-item" onclick="cartView.removeItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        html += `
            <div class="carrinho-resumo">
                <div class="resumo-titulo">Resumo do Pedido</div>
                ${cartData.items.map(item => `
                    <div class="resumo-linha">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="resumo-total">
                    <span>Total:</span>
                    <span>R$ ${cartData.total.toFixed(2)}</span>
                </div>
                <button class="btn-finalizar" onclick="cartView.checkout()">Finalizar Compra</button>
            </div>
        `;
        
        carrinhoItensContainer.innerHTML = html;
    }
}

export default CartView;