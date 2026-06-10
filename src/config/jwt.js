const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '24h';

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

module.exports = { generateToken, verifyToken };