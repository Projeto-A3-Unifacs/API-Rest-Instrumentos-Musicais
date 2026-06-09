const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const { getUserByEmail } = require('../dao/usuarioDao');

async function login(req, res) {
  const { email, senha } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  const validPassword = await bcrypt.compare(senha, user.senha);
  if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

  const token = generateToken({ id: user.id, role: user.role });
  res.json({ token, role: user.role });
}

module.exports = { login };