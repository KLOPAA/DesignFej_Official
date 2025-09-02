CREATE DATABASE bd_usuario;
USE bd_usuario;

CREATE TABLE IF NOT EXISTS cadastro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    token_redefinicao VARCHAR(255),
    expira_em DATETIME,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabela de produtos (se não existir)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    categoria VARCHAR(100),
    estoque INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de carrinho (se não existir)
CREATE TABLE IF NOT EXISTS carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    sessao_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de pedidos (opcional - se quiser salvar histórico)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessao_id VARCHAR(255) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    forma_pagamento VARCHAR(100),
    endereco_entrega TEXT,
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns produtos de exemplo (opcional)
INSERT INTO produtos (nome, descricao, preco, imagem, categoria, estoque) VALUES
('Brinco de Ouro 18k', 'Brinco delicado em ouro amarelo 18k com detalhe em zirconia', 289.90, '/img/brinco-ouro.jpg', 'Brincos', 10),
('Colar de Prata Sterling', 'Colar elegante em prata sterling com pingente de coração', 189.90, '/img/colar-prata.jpg', 'Colares', 15),
('Anel com Diamante', 'Anel solitário em ouro branco 18k com diamante central', 459.90, '/img/anel-diamante.jpg', 'Anéis', 5);

ALTER TABLE cadastro 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiracao DATETIME NULL;

DESCRIBE cadastro;