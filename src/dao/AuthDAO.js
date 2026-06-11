const pool = require('../config/Database');

class AuthDAO {
  async getUsuarioByEmail(email) {
    const res = await pool.query(`
      SELECT * FROM usuario 
      WHERE email = $1
    `, [email]);
    
    return res.rows[0];
  }




  async salvarTokenRecuperacao(idUsuario, token, expiracao) {
    await pool.query(`
      UPDATE usuario 
      SET reset_token = $1, reset_token_expires = $2
      WHERE id_usuario = $3
    `, [token, expiracao, idUsuario]);
  }

  async atualizarSenha(idUsuario, novaSenha) {
    await pool.query(`
      UPDATE usuario 
      SET senha = $1, reset_token = NULL, reset_token_expires = NULL
      WHERE id_usuario = $2
    `, [novaSenha, idUsuario]);
  }


}






module.exports = new AuthDAO();