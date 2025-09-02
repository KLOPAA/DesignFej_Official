const express = require('express');
const router = express.Router();
const db = require('../db.js'); // ajuste o caminho do seu banco
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Rota para verificar se o email existe
router.post('/verificar-email', (req, res) => {
    const { email } = req.body;

    console.log('Recebido email para verificação:', email);

    if (!email) {
        return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    const sql = 'SELECT id FROM cadastro WHERE email = ?';
    
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('[ERRO] Erro ao verificar email:', err);
            return res.status(500).json({ erro: 'Erro interno do servidor ao acessar banco de dados' });
        }

        console.log('Resultados da consulta:', results);

        if (results.length > 0) {
            // Gerar token de redefinição
            const token = crypto.randomBytes(32).toString('hex');
            const expiracao = new Date(Date.now() + 3600000); // 1 hora
            
            // Salvar token no banco
            const updateSql = 'UPDATE cadastro SET reset_token = ?, reset_token_expiracao = ? WHERE email = ?';
            
            db.query(updateSql, [token, expiracao, email], (updateErr) => {
                if (updateErr) {
                    console.error('[ERRO] Erro ao salvar token:', updateErr);
                    return res.status(500).json({ erro: 'Erro ao gerar token de redefinição' });
                }
                
                console.log('Token gerado para email:', email);
                res.json({ 
                    existe: true, 
                    message: 'Email encontrado. Redirecionando...',
                    token: token
                });
            });
        } else {
            console.log('Email não encontrado:', email);
            res.json({ existe: false, message: 'Email não encontrado' });
        }
    });
});

// Rota para definir nova senha
router.post('/definirNovaSenha', async (req, res) => {
    const { token, novaSenha } = req.body;

    console.log('Recebida solicitação para definir nova senha');

    try {
        // Verificar token válido e não expirado
        const sql = 'SELECT id, reset_token_expiracao FROM cadastro WHERE reset_token = ?';
        
        db.query(sql, [token], async (err, results) => {
            if (err) {
                console.error('[ERRO] Erro ao verificar token:', err);
                return res.status(500).json({ erro: 'Erro interno do servidor' });
            }

            if (results.length === 0) {
                console.log('Token inválido:', token);
                return res.status(400).json({ erro: 'Token inválido ou expirado' });
            }

            const usuario = results[0];
            const agora = new Date();

            if (agora > new Date(usuario.reset_token_expiracao)) {
                console.log('Token expirado para usuário:', usuario.id);
                return res.status(400).json({ erro: 'Token expirado' });
            }

            // Hash da nova senha
            const saltRounds = 12;
            const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

            // Atualizar senha e limpar token
            const updateSql = 'UPDATE cadastro SET senha_hash = ?, reset_token = NULL, reset_token_expiracao = NULL WHERE id = ?';
            
            db.query(updateSql, [senhaHash, usuario.id], (updateErr) => {
                if (updateErr) {
                    console.error('[ERRO] Erro ao atualizar senha:', updateErr);
                    return res.status(500).json({ erro: 'Erro ao atualizar senha' });
                }

                console.log('Senha atualizada para usuário:', usuario.id);
                res.json({ success: true, message: 'Senha redefinida com sucesso!' });
            });
        });
    } catch (error) {
        console.error('[ERRO] Erro no processo de redefinição:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

module.exports = router;