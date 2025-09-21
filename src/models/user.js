const db = require('../config/database');

const User = {
  //Busca usuário pelo e-mail
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  //insere user no DB
  async create({ nome, email, senhaHash }) {
    const [result] = await db.execute(
      'INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );
    return { id: result.insertId, nome, email };
  }
};

module.exports = User;
