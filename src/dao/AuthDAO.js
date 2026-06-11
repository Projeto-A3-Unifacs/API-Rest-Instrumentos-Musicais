const pool = require('../config/Database');

class AuthDAO {
  async getUsuarioByEmail(email) {
    const res = await pool.query(`
      SELECT * FROM usuario 
      WHERE email = $1
    `, [email]);
    
    return res.rows[0];
  }
}

module.exports = new AuthDAO();