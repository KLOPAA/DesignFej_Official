const express = require('express');
const path = require('path'); 

// rotas
const cadastroRouter = require('./routes/cadastro');
const loginRouter = require('./routes/login');
const inicioRouter = require('./routes/inicio');
const redefinirSenhaRouter = require('./routes/redefinirSenha'); 
const carrinhoRouter = require('./routes/carrinho'); 

const app = express();
const PORT = 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rota inicial -> index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// uso das rotas
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/inicio', inicioRouter);
app.use('/redefinir', redefinirSenhaRouter); 
app.use('/carrinho', carrinhoRouter);


app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
