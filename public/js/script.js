// Variáveis globais
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do menu/carrinho
    const menuIcon = document.querySelector('.menu-icon');
    const closeMenuIcon = document.querySelector('.close-menu-icon');
    const menuLateral = document.querySelector('.menu-lateral');
    const overlay = document.querySelector('.overlay');
    const cartIcon = document.getElementById('cart-icon');
    const favoritesIcon = document.getElementById('favorites-icon');

    // Elementos de login/cadastro
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const mensagem = document.getElementById('mensagem');

    // Configuração do menu lateral (apenas se os elementos existirem)
    if (menuIcon && menuLateral) {
        menuIcon.addEventListener('click', function () {
            menuLateral.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenuIcon && menuLateral) {
        closeMenuIcon.addEventListener('click', function () {
            menuLateral.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (overlay && menuLateral) {
        overlay.addEventListener('click', function () {
            menuLateral.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Configuração do carrinho (apenas se o elemento existir)
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            toggleCart();
        });
    }

    // Configuração de favoritos (apenas se o elemento existir)
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', function () {
            toggleFavorites();
        });
    }

    // Fechar menu ao clicar em links (apenas se os elementos existirem)
    const menuLinks = document.querySelectorAll('.menu-lateral a');
    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (menuLateral) menuLateral.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Configuração da busca (apenas se os elementos existirem)
    const searchInput = document.querySelector('.search-container input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchIcon && searchInput) {
        function performSearch() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                alert(`Buscando por: ${searchTerm}`);
                searchInput.value = '';
            }
        }

        searchIcon.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Configuração do login (apenas se o formulário existir)
    if (formLogin) {
        console.log('Formulário de login encontrado');
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login iniciado');

            const dados = Object.fromEntries(new FormData(formLogin));

            try {
                const resposta = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const json = await resposta.json();

                if (mensagem) {
                    if (resposta.ok) {
                        mensagem.textContent = 'Login realizado com sucesso, seja bem-vindo ao DesignFej';
                        mensagem.style.color = 'green';

                        // Redirecionar após login bem-sucedido
                        setTimeout(() => {
                            window.location.href = '/index.html';
                        }, 2000);
                    } else {
                        mensagem.textContent = json.erro || 'Erro ao realizar login';
                        mensagem.style.color = 'red';
                    }
                }
            } catch (error) {
                console.error('Erro no login:', error);
                if (mensagem) {
                    mensagem.textContent = 'Erro de conexão. Tente novamente.';
                    mensagem.style.color = 'red';
                }
            }
        });
    }

    // Configuração do cadastro (apenas se o formulário existir)
    if (formCadastro) {
        console.log('Formulário de cadastro encontrado');
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Cadastro iniciado');

            const dados = Object.fromEntries(new FormData(formCadastro));

           
            if (dados.senha && dados.senha.length < 6) {
                if (mensagem) {
                    mensagem.textContent = 'A senha deve ter pelo menos 6 caracteres';
                    mensagem.style.color = 'red';
                }
                return; 
            }

            if (!dados.nome || !dados.email || !dados.senha) {
                if (mensagem) {
                    mensagem.textContent = 'Por favor, preencha todos os campos';
                    mensagem.style.color = 'red';
                }
                return;
            }

            if (dados.email && !dados.email.includes('@')) {
                if (mensagem) {
                    mensagem.textContent = 'Por favor, insira um e-mail válido';
                    mensagem.style.color = 'red';
                }
                return;
            }

            try {
                const resposta = await fetch('/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const json = await resposta.json();

                if (mensagem) {
                    mensagem.textContent = json.mensagem || json.erro;
                    mensagem.style.color = resposta.ok ? 'green' : 'red';
                }

                if (resposta.ok) {
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 3000);
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                if (mensagem) {
                    mensagem.textContent = 'Erro de conexão. Tente novamente.';
                    mensagem.style.color = 'red';
                }
            }
        });
    }

    // Carregar itens ao iniciar (apenas se estiver nas páginas corretas)
    if (document.getElementById("cart-items")) {
        renderCart();
    }

    if (document.getElementById("favorites-items")) {
        renderFavorites();
    }

    // Atualizar contador do carrinho se o elemento existir
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        updateCartCount();
    }
});

// função para adicionar item ao carrinho
function addToCart(nome, descricao) {
    cartItems.push({ nome, descricao });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    alert(`${nome} adicionado ao carrinho!`);
}

// função para renderizar os itens do carrinho
function renderCart() {
    const list = document.getElementById("cart-items");
    if (!list) return;

    list.innerHTML = "";

    if (cartItems.length === 0) {
        list.innerHTML = "<li class='empty-message'>Seu carrinho está vazio</li>";
        return;
    }

    cartItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "cart-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "item-checkbox";
        checkbox.dataset.index = index;

        const infoDiv = document.createElement("div");
        infoDiv.className = "item-info";
        infoDiv.innerHTML = `<strong>${item.nome}</strong><br><small>${item.descricao}</small>`;

        const excluirBtn = document.createElement("button");
        excluirBtn.className = "excluir-btn";
        excluirBtn.innerHTML = 'Excluir';
        excluirBtn.onclick = () => {
            if (checkbox.checked) {
                cartItems.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCart();
            } else {
                alert("Marque a caixinha para excluir este item.");
            }
        };

        li.appendChild(checkbox);
        li.appendChild(infoDiv);
        li.appendChild(excluirBtn);

        list.appendChild(li);
    });
}

// função para finalizar a compra
function finalizarCompra() {
    if (cartItems.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let resumo = "Resumo da Compra:\n\n";
    cartItems.forEach((item, index) => {
        resumo += `${index + 1}. ${item.nome}\n   ${item.descricao}\n\n`;
    });

    alert(resumo + "Obrigado por comprar na DesignFej!");

    cartItems.length = 0;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    toggleCart();
}

// função para adicionar aos favoritos
function addToFavorites(nome, descricao) {
    favorites.push({ nome, descricao });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
    alert(`${nome} adicionado aos favoritos!`);
}

// função para renderizar os itens favoritos
function renderFavorites() {
    const list = document.getElementById("favorites-items");
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
        infoDiv.innerHTML = `<strong>${item.nome}</strong><br><small>${item.descricao}</small>`;

        const excluirBtn = document.createElement("button");
        excluirBtn.className = "excluir-btn";
        excluirBtn.innerHTML = 'Excluir';
        excluirBtn.onclick = () => {
            if (checkbox.checked) {
                favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(favorites));
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
}

// função para mostrar ou esconder o carrinho
function toggleCart() {
    const panel = document.getElementById("cart-panel");
    const overlay = document.querySelector('.overlay');

    if (!panel || !overlay) return;

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Fechar outros painéis abertos
        const favoritesPanel = document.getElementById('favorites-panel');
        const menuLateral = document.querySelector('.menu-lateral');

        if (favoritesPanel) favoritesPanel.classList.remove('open');
        if (menuLateral) menuLateral.classList.remove('open');

        panel.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// função para mostrar ou esconder os favoritos
function toggleFavorites() {
    const panel = document.getElementById("favorites-panel");
    const overlay = document.querySelector('.overlay');

    if (!panel || !overlay) return;

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Fechar outros painéis abertos
        const cartPanel = document.getElementById('cart-panel');
        const menuLateral = document.querySelector('.menu-lateral');

        if (cartPanel) cartPanel.classList.remove('open');
        if (menuLateral) menuLateral.classList.remove('open');

        panel.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// função para remover itens selecionados do carrinho
function removeSelected() {
    const checkboxes = document.querySelectorAll('#cart-items input[type="checkbox"]');
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

    indexesToRemove.sort((a, b) => b - a).forEach(i => cartItems.splice(i, 1));

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// função para remover itens selecionados dos favoritos
function removeFavoriteSelected() {
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

    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

// Atualizar contador de itens no carrinho
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
    }
}