const { verifyToken } = require('../config/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  const userData = verifyToken(token);
  if (!userData) return res.status(403).json({ message: 'Token inválido ou expirado' });

  req.user = userData;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };