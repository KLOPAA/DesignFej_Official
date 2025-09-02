const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'bd_usuario' 
});

db.connect((err) => {
  if (err) {
    console.error('[ERRO] Conexão com o banco falhou:', err.message);
    console.error('[ERRO] Detalhes:', err);
  } else {
    console.log('✅ Conectado ao MySQL - Database: bd_usuario');
  }
});

module.exports = db;