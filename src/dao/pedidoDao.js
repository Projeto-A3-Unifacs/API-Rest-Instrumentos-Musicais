const pool = require('../config/Database');

class PedidoDao {
  async getAll() {
    const res = await pool.query('SELECT * FROM pedido');
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query('SELECT * FROM pedido WHERE id_pedido = $1', [id]);
    return res.rows[0];
  }

  async create(pedido) {
    const { id_usuario, total, status } = pedido;
    const res = await pool.query(`
      INSERT INTO pedido (id_usuario, total, status, data_pedido)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `, [id_usuario, total, status]);
    return res.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key in data) {
      fields.push(`${key} = $${i}`);
      values.push(data[key]);
      i++;
    }

    values.push(id);

    const res = await pool.query(`
      UPDATE pedido
      SET ${fields.join(', ')}
      WHERE id_pedido = $${i}
      RETURNING *
    `, values);

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(`
      DELETE FROM pedido
      WHERE id_pedido = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }
}

module.exports = new PedidoDao();