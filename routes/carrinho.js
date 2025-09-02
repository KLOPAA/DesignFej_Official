const express = require('express');
const router = express.Router();
const db = require('../db.js');
const path = require('path');

// Middleware para identificar a sessão/usuario
const getSessionId = (req) => {
    return req.user ? req.user.id : (req.sessionID || req.headers['session-id'] || 'guest');
};

// Rota para servir a página do carrinho
router.get('/carrinho', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/carrinho.html'));
});

// Adicionar item ao carrinho
router.post('/api/carrinho/adicionar', async (req, res) => {
    try {
        const { produto_id, quantidade = 1 } = req.body;
        const sessao_id = getSessionId(req);

        console.log(`Adicionando produto ${produto_id} ao carrinho da sessão ${sessao_id}`);

        // Verificar se produto existe
        db.execute('SELECT * FROM produtos WHERE id = ?', [produto_id], (err, produto) => {
            if (err) {
                console.error('Erro ao buscar produto:', err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (produto.length === 0) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }

            // Verificar se item já está no carrinho
            db.execute(
                'SELECT * FROM carrinho WHERE produto_id = ? AND sessao_id = ?',
                [produto_id, sessao_id],
                (err, itemExistente) => {
                    if (err) {
                        console.error('Erro ao verificar carrinho:', err);
                        return res.status(500).json({ error: 'Erro interno do servidor' });
                    }

                    if (itemExistente.length > 0) {
                        // Atualizar quantidade
                        db.execute(
                            'UPDATE carrinho SET quantidade = quantidade + ? WHERE id = ?',
                            [quantidade, itemExistente[0].id],
                            (err) => {
                                if (err) {
                                    console.error('Erro ao atualizar carrinho:', err);
                                    return res.status(500).json({ error: 'Erro interno do servidor' });
                                }

                                // Retornar sucesso
                                return res.json({
                                    success: true,
                                    message: 'Quantidade atualizada no carrinho'
                                });
                            }
                        );
                    } else {
                        // Inserir novo item
                        db.execute(
                            'INSERT INTO carrinho (produto_id, quantidade, sessao_id) VALUES (?, ?, ?)',
                            [produto_id, quantidade, sessao_id],
                            (err) => {
                                if (err) {
                                    console.error('Erro ao adicionar ao carrinho:', err);
                                    return res.status(500).json({ error: 'Erro interno do servidor' });
                                }

                                return res.json({
                                    success: true,
                                    message: 'Produto adicionado ao carrinho'
                                });
                            }
                        );
                    }
                }
            );
        });
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Remover item do carrinho
router.delete('/api/carrinho/remover/:id', (req, res) => {
    try {
        const { id } = req.params;
        const sessao_id = getSessionId(req);

        console.log(`Removendo item ${id} do carrinho da sessão ${sessao_id}`);

        db.execute(
            'DELETE FROM carrinho WHERE id = ? AND sessao_id = ?',
            [id, sessao_id],
            (err, result) => {
                if (err) {
                    console.error('Erro ao remover item:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Item não encontrado no carrinho' });
                }

                res.json({ success: true, message: 'Produto removido do carrinho' });
            }
        );
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter itens do carrinho
router.get('/api/carrinho', (req, res) => {
    try {
        const sessao_id = getSessionId(req);

        console.log(`Buscando carrinho para sessão ${sessao_id}`);

        db.execute(`
            SELECT c.*, p.nome, p.preco, p.descricao, p.imagem, p.categoria,
                   (c.quantidade * p.preco) as total_item
            FROM carrinho c 
            INNER JOIN produtos p ON c.produto_id = p.id 
            WHERE c.sessao_id = ?
        `, [sessao_id], (err, itens) => {
            if (err) {
                console.error('Erro ao buscar carrinho:', err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            // Calcular totais
            const total = itens.reduce((sum, item) => sum + parseFloat(item.total_item || 0), 0);
            const total_itens = itens.reduce((sum, item) => sum + (item.quantidade || 0), 0);

            res.json({
                itens,
                total: total.toFixed(2),
                total_itens
            });
        });
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar quantidade de um item
router.put('/api/carrinho/atualizar/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { quantidade } = req.body;
        const sessao_id = getSessionId(req);

        if (!quantidade || quantidade < 1) {
            return res.status(400).json({ error: 'Quantidade inválida' });
        }

        console.log(`Atualizando item ${id} para quantidade ${quantidade}`);

        db.execute(
            'UPDATE carrinho SET quantidade = ? WHERE id = ? AND sessao_id = ?',
            [quantidade, id, sessao_id],
            (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar quantidade:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Item não encontrado no carrinho' });
                }

                res.json({ success: true, message: 'Quantidade atualizada' });
            }
        );
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Limpar carrinho inteiro
router.delete('/api/carrinho/limpar', (req, res) => {
    try {
        const sessao_id = getSessionId(req);

        console.log(`Limpando carrinho da sessão ${sessao_id}`);

        db.execute(
            'DELETE FROM carrinho WHERE sessao_id = ?',
            [sessao_id],
            (err) => {
                if (err) {
                    console.error('Erro ao limpar carrinho:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }

                res.json({ success: true, message: 'Carrinho limpo com sucesso' });
            }
        );
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Obter resumo do carrinho (apenas totais)
router.get('/api/carrinho/resumo', (req, res) => {
    try {
        const sessao_id = getSessionId(req);

        db.execute(`
            SELECT c.quantidade, p.preco
            FROM carrinho c 
            INNER JOIN produtos p ON c.produto_id = p.id 
            WHERE c.sessao_id = ?
        `, [sessao_id], (err, itens) => {
            if (err) {
                console.error('Erro ao buscar resumo:', err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
            const total_itens = itens.reduce((sum, item) => sum + item.quantidade, 0);

            res.json({
                total: total.toFixed(2),
                total_itens
            });
        });
    } catch (error) {
        console.error('Erro ao carregar resumo do carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Finalizar compra (versão simplificada)
router.post('/api/carrinho/finalizar', (req, res) => {
    try {
        const sessao_id = getSessionId(req);
        const { forma_pagamento, endereco_entrega } = req.body;

        console.log(`Finalizando compra para sessão ${sessao_id}`);

        // 1. Obter itens do carrinho
        db.execute(`
            SELECT c.*, p.nome, p.preco, p.descricao 
            FROM carrinho c 
            INNER JOIN produtos p ON c.produto_id = p.id 
            WHERE c.sessao_id = ?
        `, [sessao_id], (err, itens) => {
            if (err) {
                console.error('Erro ao buscar itens:', err);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (itens.length === 0) {
                return res.status(400).json({ error: 'Carrinho vazio' });
            }

            // 2. Calcular total
            const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

            // 3. Criar pedido na tabela pedidos (se existir)
            const queryPedido = `
                INSERT INTO pedidos (sessao_id, total, forma_pagamento, endereco_entrega, status) 
                VALUES (?, ?, ?, ?, ?)
            `;

            db.execute(
                queryPedido,
                [sessao_id, total, forma_pagamento, JSON.stringify(endereco_entrega), 'pendente'],
                (err, result) => {
                    if (err) {
                        console.warn('Aviso: Tabela de pedidos não encontrada, apenas limpando carrinho');
                    }

                    // 4. Limpar carrinho (sempre executa)
                    db.execute(
                        'DELETE FROM carrinho WHERE sessao_id = ?',
                        [sessao_id],
                        (err) => {
                            if (err) {
                                console.error('Erro ao limpar carrinho:', err);
                                return res.status(500).json({ error: 'Erro ao finalizar compra' });
                            }

                            res.json({
                                success: true,
                                message: 'Compra finalizada com sucesso',
                                total: total.toFixed(2)
                            });
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;