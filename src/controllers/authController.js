const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const authDAO = require('../dao/AuthDAO'); // Agora faz sentido!

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    
    // Busca o usuário de forma genérica (pode ser Cliente, Vendedor ou Admin)
    const user = await authDAO.getUsuarioByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Valida a senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

    // Define a Role com base no id_perfil do banco
    let userRole = '';
    if (user.id_perfil === 1) {
      userRole = 'Vendedor';
    } else if (user.id_perfil === 2) {
      userRole = 'Cliente';
    } else if (user.id_perfil === 3) {
      userRole = 'Administrador';
    }

    // Injeta os dados no Token JWT
    const token = generateToken({ 
      id: user.id_usuario, 
      role: userRole 
    });

    res.json({ 
      message: 'Login realizado com sucesso',
      token, 
      role: userRole 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { login };