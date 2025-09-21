const UserService = require('../services/userService');

const UserController = {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const user = await UserService.register({ nome, email, senha });
      return res.status(201).json({ mensagem: 'Usuário registrado com sucesso', user });
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const { token } = await UserService.login({ email, senha });
      return res.json({ token });
    } catch (err) {
      return res.status(401).json({ erro: err.message });
    }
  }
};

module.exports = UserController;
