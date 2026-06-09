const pool = require('../config/Database');

class CarteiraDAO {

  async getAll() {
    const res = await pool.query(`
      SELECT *
      FROM carteira
      ORDER BY id_carteira
    `);

    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT *
      FROM carteira
      WHERE id_carteira = $1
    `, [id]);

    return res.rows[0];
  }

  async getByUsuario(idUsuario) {
    const res = await pool.query(`
      SELECT *
      FROM carteira
      WHERE id_usuario = $1
    `, [idUsuario]);

    return res.rows[0];
  }

  async create(idUsuario) {
    const res = await pool.query(`
      INSERT INTO carteira
      (
        id_usuario,
        saldo,
        data_criacao
      )
      VALUES
      (
        $1,
        0,
        NOW()
      )
      RETURNING *
    `, [idUsuario]);

    return res.rows[0];
  }

  async adicionarSaldo(idCarteira, valor) {
    const res = await pool.query(`
      UPDATE carteira
      SET saldo = saldo + $1
      WHERE id_carteira = $2
      RETURNING *
    `, [valor, idCarteira]);

    return res.rows[0];
  }

  async removerSaldo(idCarteira, valor) {
    const res = await pool.query(`
      UPDATE carteira
      SET saldo = saldo - $1
      WHERE id_carteira = $2
      RETURNING *
    `, [valor, idCarteira]);

    return res.rows[0];
  }

  async update(idCarteira, saldo) {
    const res = await pool.query(`
      UPDATE carteira
      SET saldo = $1
      WHERE id_carteira = $2
      RETURNING *
    `, [saldo, idCarteira]);

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(`
      DELETE FROM carteira
      WHERE id_carteira = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }
}

module.exports = new CarteiraDAO();