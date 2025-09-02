// Controller - Carrinho
import CartRepository from '../repositories/CartRepository.js';

class CartController {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    // Adicionar item ao carrinho
    addItem(productData) {
        try {
            // Validações básicas
            if (!productData.id || !productData.name || !productData.price) {
                return {
                    success: false,
                    message: 'Dados do produto inválidos'
                };
            }

            const cartItems = this.cartRepository.addItem(productData);

            return {
                success: true,
                message: `${productData.name} adicionado ao carrinho!`,
                items: cartItems,
                count: cartItems.length
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao adicionar item ao carrinho'
            };
        }
    }

    // Remover item do carrinho
    removeItem(itemId) {
        try {
            const cartItems = this.cartRepository.removeItem(itemId);

            return {
                success: true,
                message: 'Item removido do carrinho',
                items: cartItems,
                count: cartItems.length
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao remover item do carrinho'
            };
        }
    }

    // Atualizar quantidade
    updateQuantity(itemId, quantity) {
        try {
            if (quantity < 0) {
                return {
                    success: false,
                    message: 'Quantidade deve ser maior ou igual a zero'
                };
            }

            const cartItems = this.cartRepository.updateQuantity(itemId, quantity);

            return {
                success: true,
                message: 'Quantidade atualizada',
                items: cartItems,
                count: cartItems.length
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao atualizar quantidade'
            };
        }
    }

    // Obter todos os itens do carrinho
    getItems() {
        try {
            const items = this.cartRepository.findAll();
            const total = this.cartRepository.getTotal();

            return {
                success: true,
                items: items,
                count: items.length,
                total: total
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar itens do carrinho'
            };
        }
    }

    // Finalizar compra
    checkout() {
        try {
            const items = this.cartRepository.findAll();

            if (items.length === 0) {
                return {
                    success: false,
                    message: 'Carrinho está vazio'
                };
            }

            const total = this.cartRepository.getTotal();
            
            // Limpar carrinho após finalizar
            this.cartRepository.clear();

            return {
                success: true,
                message: 'Compra finalizada com sucesso!',
                total: total,
                items: items
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao finalizar compra'
            };
        }
    }

    // Limpar carrinho
    clear() {
        try {
            this.cartRepository.clear();

            return {
                success: true,
                message: 'Carrinho limpo com sucesso'
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao limpar carrinho'
            };
        }
    }
}

export default CartController;