// Sistema MVC simplificado para funcionar no navegador

// MODEL - User
class User {
    constructor(id, nome, email, senha, endereco, criadoEm = new Date()) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.endereco = endereco;
        this.criadoEm = criadoEm;
    }

    static validate(userData) {
        const errors = [];
        
        if (!userData.nome || userData.nome.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!userData.email || !userData.email.includes('@')) {
            errors.push('Email inválido');
        }
        
        if (!userData.senha || userData.senha.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }
        
        if (!userData.endereco || userData.endereco.trim().length < 5) {
            errors.push('Endereço deve ter pelo menos 5 caracteres');
        }
        
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            endereco: this.endereco,
            criadoEm: this.criadoEm
        };
    }
}

// REPOSITORY - UserRepository
class UserRepository {
    constructor() {
        this.storageKey = 'designfej_usuarios';
    }

    findAll() {
        const users = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        return users.map(userData => new User(
            userData.id,
            userData.nome,
            userData.email,
            userData.senha,
            userData.endereco,
            userData.criadoEm
        ));
    }

    findByEmail(email) {
        const users = this.findAll();
        return users.find(user => user.email === email) || null;
    }

    save(user) {
        const users = this.findAll();
        
        if (user.id) {
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index] = user;
            }
        } else {
            user.id = Date.now();
            users.push(user);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(users.map(u => u.toJSON())));
        return user;
    }

    emailExists(email) {
        return this.findByEmail(email) !== null;
    }
}

// REPOSITORY - CartRepository
class CartRepository {
    constructor() {
        this.storageKey = 'designfej_cart';
    }

    findAll() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

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

    removeItem(itemId) {
        const cartItems = this.findAll();
        const filteredItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
        return filteredItems;
    }

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

    clear() {
        localStorage.removeItem(this.storageKey);
        return [];
    }

    getTotal() {
        const items = this.findAll();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// CONTROLLER - AuthController
class AuthController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(email, senha) {
        try {
            if (!email || !senha) {
                return {
                    success: false,
                    message: 'Email e senha são obrigatórios'
                };
            }

            const user = this.userRepository.findByEmail(email);

            if (!user || user.senha !== senha) {
                return {
                    success: false,
                    message: 'Email ou senha incorretos'
                };
            }

            localStorage.setItem('designfej_usuario_logado', JSON.stringify(user.toJSON()));

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                user: user.toJSON()
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro interno do servidor'
            };
        }
    }

    async register(userData) {
        try {
            const validationErrors = User.validate(userData);
            if (validationErrors.length > 0) {
                return {
                    success: false,
                    message: validationErrors.join(', ')
                };
            }

            if (this.userRepository.emailExists(userData.email)) {
                return {
                    success: false,
                    message: 'Este email já está cadastrado'
                };
            }

            const newUser = new User(
                null,
                userData.nome,
                userData.email,
                userData.senha,
                userData.endereco
            );

            const savedUser = this.userRepository.save(newUser);

            return {
                success: true,
                message: 'Cadastro realizado com sucesso!',
                user: savedUser.toJSON()
            };

        } catch (error) {
            return {
                success: false,
                message: 'Erro interno do servidor'
            };
        }
    }
}

// CONTROLLER - CartController
class CartController {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    addItem(productData) {
        try {
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
}

// Inicialização global
window.authController = new AuthController();
window.cartController = new CartController();

// Funções globais para compatibilidade
window.addToCart = function(productId, productName, productPrice, productImage, productDetails) {
    const productData = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        details: productDetails
    };

    const result = window.cartController.addItem(productData);
    
    if (result.success) {
        updateCartCount();
        
        if (confirm(`${productName} adicionado ao carrinho! Deseja ir para o carrinho agora?`)) {
            window.location.href = './carrinho.html';
        }
    } else {
        alert(result.message);
    }
};

window.addToFavorites = function(productId, productName, productPrice, productImage, productDetails) {
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

window.toggleFavorites = function() {
    const panel = document.getElementById("favorites-panel");
    const overlay = document.querySelector('.overlay');

    if (!panel) return;

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        const menuLateral = document.querySelector('.menu-lateral');
        if (menuLateral) menuLateral.classList.remove('open');
        
        renderFavorites();
        panel.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.renderFavorites = function() {
    const list = document.getElementById("favorites-items");
    const favorites = JSON.parse(localStorage.getItem('designfej_favorites')) || [];

    if (!list) return;
    list.innerHTML = "";

    if (favorites.length === 0) {
        list.innerHTML = "<li class='empty-message'>Você não tem favoritos</li>";
        return;
    }

    favorites.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "favorite-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "item-checkbox";
        checkbox.dataset.index = index;

        const infoDiv = document.createElement("div");
        infoDiv.className = "item-info";
        infoDiv.innerHTML = `<strong>${item.name}</strong><br><small>${item.details}</small>`;

        const excluirBtn = document.createElement("button");
        excluirBtn.className = "excluir-btn";
        excluirBtn.innerHTML = 'Excluir';
        excluirBtn.onclick = () => {
            if (checkbox.checked) {
                favorites.splice(index, 1);
                localStorage.setItem('designfej_favorites', JSON.stringify(favorites));
                renderFavorites();
            } else {
                alert("Marque a caixinha para excluir este favorito.");
            }
        };

        li.appendChild(checkbox);
        li.appendChild(infoDiv);
        li.appendChild(excluirBtn);
        list.appendChild(li);
    });
};

window.removeFavoriteSelected = function() {
    const favorites = JSON.parse(localStorage.getItem('designfej_favorites')) || [];
    const checkboxes = document.querySelectorAll('#favorites-items input[type="checkbox"]');
    const indexesToRemove = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            indexesToRemove.push(parseInt(checkbox.dataset.index));
        }
    });

    if (indexesToRemove.length === 0) {
        alert("Selecione pelo menos um item para remover.");
        return;
    }

    indexesToRemove.sort((a, b) => b - a).forEach(i => favorites.splice(i, 1));
    localStorage.setItem('designfej_favorites', JSON.stringify(favorites));
    renderFavorites();
};

window.updateCartCount = function() {
    const cartData = window.cartController.getItems();
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartData.count;
    }
};

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    // Login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const senha = formData.get('senha');

            const result = await window.authController.login(email, senha);
            
            const mensagem = document.getElementById('mensagem');
            if (mensagem) {
                mensagem.textContent = result.message;
                mensagem.style.color = result.success ? 'green' : 'red';
            }

            if (result.success) {
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);
            }
        });
    }

    // Cadastro
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const userData = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                senha: formData.get('senha'),
                endereco: formData.get('endereco')
            };

            const result = await window.authController.register(userData);
            
            const mensagem = document.getElementById('mensagem');
            if (mensagem) {
                mensagem.textContent = result.message;
                mensagem.style.color = result.success ? 'green' : 'red';
            }

            if (result.success) {
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
            }
        });
    }

    // Atualizar contador do carrinho
    updateCartCount();

    // Carrinho - renderizar itens
    if (document.getElementById('carrinho-itens')) {
        renderCarrinho();
    }

    // Inicializar sistema de favoritos
    const favoritesIcon = document.getElementById('favorites-icon');
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', toggleFavorites);
    }

    // Inicializar menu lateral
    const menuIcon = document.querySelector('.menu-icon');
    const closeMenuIcon = document.querySelector('.close-menu-icon');
    const menuLateral = document.querySelector('.menu-lateral');
    const overlay = document.querySelector('.overlay');

    if (menuIcon && menuLateral) {
        menuIcon.addEventListener('click', function () {
            menuLateral.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMenu() {
        if (menuLateral) menuLateral.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeMenuIcon) closeMenuIcon.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    const menuLinks = document.querySelectorAll('.menu-lateral a');
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
});

function renderCarrinho() {
    const cartData = window.cartController.getItems();
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoItensContainer = document.getElementById('carrinho-itens');
    
    if (!carrinhoItensContainer) return;

    if (cartData.count === 0) {
        if (carrinhoVazio) carrinhoVazio.style.display = 'block';
        carrinhoItensContainer.innerHTML = '';
        return;
    }
    
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    
    let html = '';
    
    cartData.items.forEach((item) => {
        html += `
            <div class="carrinho-item">
                <div class="item-imagem">${item.name}</div>
                <div class="item-info">
                    <div class="item-nome">${item.name}</div>
                    <div class="item-detalhes">${item.details}</div>
                    <div class="item-preco">R$ ${item.price.toFixed(2)}</div>
                    <div class="item-quantidade">
                        <button class="quantidade-btn" onclick="alterarQuantidade('${item.id}', -1)">-</button>
                        <input type="text" class="quantidade-input" value="${item.quantity}" readonly>
                        <button class="quantidade-btn" onclick="alterarQuantidade('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remover-item" onclick="removerItem('${item.id}')">
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
            <button class="btn-finalizar" onclick="finalizarCompra()">Finalizar Compra</button>
        </div>
    `;
    
    carrinhoItensContainer.innerHTML = html;
}

window.alterarQuantidade = function(itemId, change) {
    const cartData = window.cartController.getItems();
    const item = cartData.items.find(item => item.id === itemId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        window.cartController.updateQuantity(itemId, newQuantity);
        renderCarrinho();
        updateCartCount();
    }
};

window.removerItem = function(itemId) {
    window.cartController.removeItem(itemId);
    renderCarrinho();
    updateCartCount();
};

window.finalizarCompra = function() {
    const result = window.cartController.checkout();
    
    if (result.success) {
        alert(`${result.message}\nTotal: R$ ${result.total.toFixed(2)}`);
        window.location.href = './index.html';
    } else {
        alert(result.message);
    }
};