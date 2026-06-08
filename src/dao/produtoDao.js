const pool = require('../config/database');

class ProdutoDao {
  async getAll() {
    const res = await pool.query('SELECT * FROM produto');
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query('SELECT * FROM produto WHERE id_produto = $1', [id]);
    return res.rows[0];
  }

  async create(produto) {
    const { nome, preco, estoque, id_empresa } = produto;
    const res = await pool.query(`
      INSERT INTO produto (nome, preco, estoque, id_empresa)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nome, preco, estoque, id_empresa]);
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
      UPDATE produto
      SET ${fields.join(', ')}
      WHERE id_produto = $${i}
      RETURNING *
    `, values);

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(`
      DELETE FROM produto
      WHERE id_produto = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }
}

module.exports = new ProdutoDao();