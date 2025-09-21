const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Formato de token inválido' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
    req.user = payload;
    next();
  });
}

module.exports = autenticarJWT;
