const pool = require('../config/Database');

class SaqueDAO {

  async getAll() {
    const res = await pool.query(
      'SELECT * FROM saque ORDER BY id_saque'
    );

    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(
      'SELECT * FROM saque WHERE id_saque = $1',
      [id]
    );

    return res.rows[0];
  }

  async create(idCarteira, valor) {
    const res = await pool.query(
      `INSERT INTO saque
      (
        id_carteira,
        valor,
        status,
        data_solicitacao
      )
      VALUES
      (
        $1,
        $2,
        'PENDENTE',
        NOW()
      )
      RETURNING *`,
      [idCarteira, valor]
    );

    return res.rows[0];
  }

  async updateStatus(id, status) {
    const res = await pool.query(
      `UPDATE saque
       SET status = $1
       WHERE id_saque = $2
       RETURNING *`,
      [status, id]
    );

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(
      'DELETE FROM saque WHERE id_saque = $1 RETURNING *',
      [id]
    );

    return res.rowCount > 0;
  }
}

module.exports = new SaqueDAO();