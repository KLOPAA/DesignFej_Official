# DesignFej - Loja de Joias

## Arquitetura do Projeto

Este projeto segue o padrão **MVC (Model-View-Controller)** com implementação do padrão **Repository** para a camada de persistência.

### Estrutura de Pastas

```
projeto-loja/
├── src/
│   ├── models/           # Modelos de dados
│   │   ├── User.js       # Modelo de usuário
│   │   └── Product.js    # Modelo de produto
│   ├── views/            # Camada de apresentação
│   │   ├── AuthView.js   # Interface de autenticação
│   │   └── CartView.js   # Interface do carrinho
│   ├── controllers/      # Lógica de negócio
│   │   ├── AuthController.js  # Controle de autenticação
│   │   └── CartController.js  # Controle do carrinho
│   ├── repositories/     # Camada de persistência
│   │   ├── UserRepository.js  # Repositório de usuários
│   │   └── CartRepository.js  # Repositório do carrinho
│   └── app.js           # Aplicação principal
├── public/              # Arquivos públicos (HTML, CSS, imagens)
└── README.md
```

## Padrões Implementados

### 1. **Model (Modelo)**
- **User.js**: Define a estrutura e validações dos dados do usuário
- **Product.js**: Define a estrutura dos produtos

### 2. **View (Visão)**
- **AuthView.js**: Gerencia a interface de login e cadastro
- **CartView.js**: Gerencia a interface do carrinho de compras

### 3. **Controller (Controlador)**
- **AuthController.js**: Processa a lógica de autenticação
- **CartController.js**: Processa a lógica do carrinho

### 4. **Repository (Repositório)**
- **UserRepository.js**: Abstrai o acesso aos dados de usuários
- **CartRepository.js**: Abstrai o acesso aos dados do carrinho

## Funcionalidades

### Autenticação
- ✅ Cadastro de usuários com validação
- ✅ Login com verificação de credenciais
- ✅ Redefinição de senha
- ✅ Sessão de usuário

### E-commerce
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Sistema de favoritos
- ✅ Finalização de compra

### Persistência
- ✅ Dados salvos no localStorage
- ✅ Padrão Repository para abstração de dados
- ✅ Operações CRUD completas

## Como Executar

1. Execute o Live Server na pasta `public`
2. Acesse `index.html` no navegador
3. Todas as funcionalidades funcionam offline

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Arquitetura**: MVC + Repository Pattern
- **Persistência**: localStorage (simulando banco de dados)
- **Módulos**: ES6 Modules

## Benefícios da Arquitetura

1. **Separação de Responsabilidades**: Cada camada tem uma função específica
2. **Manutenibilidade**: Código organizado e fácil de manter
3. **Testabilidade**: Componentes isolados facilitam testes
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Reutilização**: Componentes podem ser reutilizados