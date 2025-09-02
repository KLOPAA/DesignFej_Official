// View - Interface de autenticação
import AuthController from '../controllers/AuthController.js';

class AuthView {
    constructor() {
        this.authController = new AuthController();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form
        const formLogin = document.getElementById('formLogin');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Cadastro form
        const formCadastro = document.getElementById('formCadastro');
        if (formCadastro) {
            formCadastro.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const senha = formData.get('senha');

        const result = await this.authController.login(email, senha);
        this.displayMessage(result.message, result.success ? 'green' : 'red');

        if (result.success) {
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1500);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            endereco: formData.get('endereco')
        };

        const result = await this.authController.register(userData);
        this.displayMessage(result.message, result.success ? 'green' : 'red');

        if (result.success) {
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        }
    }

    displayMessage(message, color) {
        const messageElement = document.getElementById('mensagem');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.color = color;
        }
    }
}

export default AuthView;