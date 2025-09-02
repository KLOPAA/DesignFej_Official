// Model - User
class User {
    constructor(id, nome, email, senha, endereco, criadoEm = new Date()) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.endereco = endereco;
        this.criadoEm = criadoEm;
    }

    // Validações do modelo
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

    // Converter para objeto simples
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

export default User;