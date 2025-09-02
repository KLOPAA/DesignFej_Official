document.addEventListener('DOMContentLoaded', function () {
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    const mensagem = document.getElementById('mensagem');

    // Login
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = formLogin.email.value;
            const senha = formLogin.senha.value;
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    mensagem.textContent = data.mensagem;
                    mensagem.style.color = 'green';
                    
                    localStorage.setItem('designfej_usuario_logado', JSON.stringify(data.usuario));
                    
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1500);
                } else {
                    mensagem.textContent = data.erro;
                    mensagem.style.color = 'red';
                }
            } catch (error) {
                mensagem.textContent = 'Erro de conexão';
                mensagem.style.color = 'red';
            }
        });
    }

    // Cadastro
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = formCadastro.nome.value;
            const email = formCadastro.email.value;
            const senha = formCadastro.senha.value;
            const endereco = formCadastro.endereco.value;
            
            if (senha.length < 6) {
                mensagem.textContent = 'A senha deve ter pelo menos 6 caracteres';
                mensagem.style.color = 'red';
                return;
            }
            
            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, senha, endereco })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    mensagem.textContent = data.mensagem;
                    mensagem.style.color = 'green';
                    
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                } else {
                    mensagem.textContent = data.erro;
                    mensagem.style.color = 'red';
                }
            } catch (error) {
                mensagem.textContent = 'Erro de conexão';
                mensagem.style.color = 'red';
            }
        });
    }
});