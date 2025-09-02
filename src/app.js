// Aplicação principal - Inicialização do sistema MVC
import AuthView from './views/AuthView.js';
import CartView from './views/CartView.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar views baseado na página atual
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeViews();
        });
    }

    initializeViews() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Inicializar AuthView para páginas de autenticação
        if (currentPage === 'login.html' || currentPage === 'cadastro.html') {
            window.authView = new AuthView();
        }
        
        // Inicializar CartView para todas as páginas (para contador do carrinho)
        window.cartView = new CartView();
        
        // Funções globais para compatibilidade com HTML existente
        this.setupGlobalFunctions();
    }

    setupGlobalFunctions() {
        // Função global para adicionar ao carrinho (compatibilidade com HTML)
        window.addToCart = (productId, productName, productPrice, productImage, productDetails) => {
            if (window.cartView) {
                window.cartView.addToCart(productId, productName, productPrice, productImage, productDetails);
            }
        };

        // Função global para adicionar aos favoritos (mantém funcionalidade existente)
        window.addToFavorites = (productId, productName, productPrice, productImage, productDetails) => {
            const favorites = JSON.parse(localStorage.getItem('designfej_favorites')) || [];
            const existingItemIndex = favorites.findIndex(item => item.id === productId);

            if (existingItemIndex === -1) {
                favorites.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    details: productDetails
                });

                localStorage.setItem('designfej_favorites', JSON.stringify(favorites));
                alert(`${productName} adicionado aos favoritos!`);
            } else {
                alert(`${productName} já está nos favoritos!`);
            }
        };

        // Outras funções globais necessárias
        window.updateCartCount = () => {
            if (window.cartView) {
                window.cartView.updateCartCount();
            }
        };

        window.finalizarCompra = () => {
            if (window.cartView) {
                window.cartView.checkout();
            }
        };
    }
}

// Inicializar aplicação
new App();