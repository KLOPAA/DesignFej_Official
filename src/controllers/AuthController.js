// Controller - Autenticação
import User from '../models/User.js';
import UserRepository from '../repositories/UserRepository.js';

class AuthController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    // Login do usuário
    async login(email, senha) {
        try {
            // Validações básicas
            if (!email || !senha) {
                return {
                    success: false,
                    message: 'Email e senha são obrigatórios'
                };
            }

            // Buscar usuário no repositório
            const user = this.userRepository.findByEmail(email);

            if (!user || user.senha !== senha) {
                return {
                    success: false,
                    message: 'Email ou senha incorretos'
                };
            }

            // Salvar sessão
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

    // Cadastro do usuário
    async register(userData) {
        try {
            // Validar dados do modelo
            const validationErrors = User.validate(userData);
            if (validationErrors.length > 0) {
                return {
                    success: false,
                    message: validationErrors.join(', ')
                };
            }

            // Verificar se email já existe
            if (this.userRepository.emailExists(userData.email)) {
                return {
                    success: false,
                    message: 'Este email já está cadastrado'
                };
            }

            // Criar novo usuário
            const newUser = new User(
                null,
                userData.nome,
                userData.email,
                userData.senha,
                userData.endereco
            );

            // Salvar no repositório
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

    // Logout
    logout() {
        localStorage.removeItem('designfej_usuario_logado');
        return {
            success: true,
            message: 'Logout realizado com sucesso'
        };
    }

    // Verificar se usuário está logado
    isAuthenticated() {
        const user = localStorage.getItem('designfej_usuario_logado');
        return user !== null;
    }

    // Obter usuário logado
    getCurrentUser() {
        const userData = localStorage.getItem('designfej_usuario_logado');
        return userData ? JSON.parse(userData) : null;
    }
}

export default AuthController;