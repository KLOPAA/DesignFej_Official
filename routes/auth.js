// routes/auth.js
const express = require('express');
const router = express.Router();

// Your authentication routes here
router.post('/cadastro', (req, res) => {
    // Handle registration logic
    console.log('Cadastro request received');
    res.json({ message: 'Cadastro realizado com sucesso' });
});

router.post('/login', (req, res) => {
    // Handle login logic
    res.json({ message: 'Login realizado com sucesso' });
});

module.exports = router;