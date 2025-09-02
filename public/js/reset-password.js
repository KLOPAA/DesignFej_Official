// Sistema de redefinição de senha usando localStorage
document.addEventListener('DOMContentLoaded', function() {
    const formRedefinir = document.getElementById('formRedefinir');
    const formNovaSenha = document.getElementById('formNovaSenha');

    // Redefinir senha - verificar email
    if (formRedefinir) {
        formRedefinir.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const errorMessage = document.getElementById('errorMessage');
            
            if (!email) {
                errorMessage.innerText = 'Por favor, insira seu e-mail';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Verificar se email existe no localStorage
            const usuarios = JSON.parse(localStorage.getItem('designfej_usuarios')) || [];
            const usuario = usuarios.find(u => u.email === email);
            
            if (usuario) {
                // Gerar token simples
                const token = Date.now().toString();
                localStorage.setItem('resetToken', token);
                localStorage.setItem('resetEmail', email);
                
                alert('Email encontrado! Redirecionando para definir nova senha...');
                window.location.href = './definirNovaSenha.html';
            } else {
                errorMessage.innerText = 'E-mail não encontrado. Tente novamente.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Definir nova senha
    if (formNovaSenha) {
        formNovaSenha.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            const message = document.getElementById('message');
            
            const token = localStorage.getItem('resetToken');
            const email = localStorage.getItem('resetEmail');
            
            if (!token || !email) {
                message.innerText = 'Sessão expirada. Por favor, solicite a redefinição novamente.';
                message.style.color = 'red';
                return;
            }
            
            if (novaSenha !== confirmarSenha) {
                message.innerText = 'As senhas não coincidem!';
                message.style.color = 'red';
                return;
            }
            
            if (novaSenha.length < 6) {
                message.innerText = 'A senha deve ter pelo menos 6 caracteres!';
                message.style.color = 'red';
                return;
            }
            
            // Atualizar senha no localStorage
            const usuarios = JSON.parse(localStorage.getItem('designfej_usuarios')) || [];
            const usuarioIndex = usuarios.findIndex(u => u.email === email);
            
            if (usuarioIndex !== -1) {
                usuarios[usuarioIndex].senha = novaSenha;
                localStorage.setItem('designfej_usuarios', JSON.stringify(usuarios));
                
                message.innerText = '✅ Senha redefinida com sucesso!';
                message.style.color = 'green';
                
                // Limpar tokens e redirecionar
                setTimeout(() => {
                    localStorage.removeItem('resetToken');
                    localStorage.removeItem('resetEmail');
                    window.location.href = './login.html';
                }, 2000);
            } else {
                message.innerText = '❌ Erro ao redefinir senha';
                message.style.color = 'red';
            }
        });
        
        // Verificar token ao carregar página
        const token = localStorage.getItem('resetToken');
        if (!token) {
            const message = document.getElementById('message');
            message.innerText = 'Sessão inválida. Solicite a redefinição novamente.';
            message.style.color = 'red';
            
            setTimeout(() => {
                window.location.href = './login.html';
            }, 3000);
        }
    }
});