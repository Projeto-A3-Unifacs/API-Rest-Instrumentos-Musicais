const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const { generateToken } = require('../config/jwt');
const authDAO = require('../dao/AuthDAO');

class AuthController {
  
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      
      const user = await authDAO.getUsuarioByEmail(email);
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

      const validPassword = await bcrypt.compare(senha, user.senha);
      if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' });

      let userRole = '';
      if (user.id_perfil === 1) {
        userRole = 'Vendedor';
      } else if (user.id_perfil === 2) {
        userRole = 'Cliente';
      } else if (user.id_perfil === 3) {
        userRole = 'Administrador';
      }

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


  async esqueciSenha(req, res) {
    try {
      const { email } = req.body;
      const user = await authDAO.getUsuarioByEmail(email);

      if (!user) {
        return res.status(200).json({ message: 'Se o e-mail existir, um código será enviado.' });
      }

      const token = crypto.randomBytes(3).toString('hex');
      
      
      const expiracao = new Date();
      expiracao.setHours(expiracao.getHours() + 1);

      await authDAO.salvarTokenRecuperacao(user.id_usuario, token, expiracao);

    
      console.log(`[EMAIL SIMULADO] Para: ${email} | Seu código de recuperação é: ${token}`);

      res.status(200).json({ message: 'Se o e-mail existir, um código será enviado.' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async resetarSenha(req, res) {
    try {
      const { email, token, novaSenha } = req.body;

      const user = await authDAO.getUsuarioByEmail(email);

      if (!user) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      if (user.reset_token !== token) {
        return res.status(400).json({ error: 'Código inválido.' });
      }

      if (new Date() > new Date(user.reset_token_expires)) {
        return res.status(400).json({ error: 'O código expirou. Solicite um novo.' });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

      await authDAO.atualizarSenha(user.id_usuario, senhaCriptografada);

      res.status(200).json({ message: 'Senha atualizada com sucesso!' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}


module.exports = new AuthController();