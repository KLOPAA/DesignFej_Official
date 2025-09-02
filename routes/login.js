const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db.js');

router.post('/', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const sql = 'SELECT * FROM cadastro WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('[ERRO] Erro no banco de dados:', err.message);
            return res.status(500).json({ erro: 'Erro no servidor.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        console.log('[LOGIN] Login realizado com sucesso:', usuario.email);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Login realizado com sucesso, seja bem-vindo ao DesignFej',
            usuario: { nome: usuario.nome, email: usuario.email }
        });
    });
});

module.exports = router;