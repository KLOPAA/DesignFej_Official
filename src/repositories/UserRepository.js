// Repository - Camada de persistência para usuários
import User from '../models/User.js';

class UserRepository {
    constructor() {
        this.storageKey = 'designfej_usuarios';
    }

    // Buscar todos os usuários
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

    // Buscar usuário por ID
    findById(id) {
        const users = this.findAll();
        return users.find(user => user.id === id) || null;
    }

    // Buscar usuário por email
    findByEmail(email) {
        const users = this.findAll();
        return users.find(user => user.email === email) || null;
    }

    // Salvar usuário
    save(user) {
        const users = this.findAll();
        
        if (user.id) {
            // Atualizar usuário existente
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index] = user;
            }
        } else {
            // Criar novo usuário
            user.id = Date.now();
            users.push(user);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(users.map(u => u.toJSON())));
        return user;
    }

    // Deletar usuário
    delete(id) {
        const users = this.findAll();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers.map(u => u.toJSON())));
        return true;
    }

    // Verificar se email já existe
    emailExists(email) {
        return this.findByEmail(email) !== null;
    }
}

export default UserRepository;