const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'umSecretforte';

const UserService = {
  async register({ nome, email, senha }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    return await User.create({ nome, email, senhaHash });
  },

  async login({ email, senha }) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, nome: user.nome },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token };
  }
};

module.exports = UserService;
