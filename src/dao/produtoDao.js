const pool = require('../config/Database');

class ProdutoDao {
  async getAll() {
    const res = await pool.query('SELECT * FROM produto ORDER BY id_produto');
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(
      'SELECT * FROM produto WHERE id_produto = $1',
      [id]
    );

    return res.rows[0];
  }

  async create(produto) {
    const { nome, preco, estoque, id_categoria, id_empresa } = produto;

    if (!nome || preco === undefined || estoque === undefined || !id_categoria || !id_empresa) {
      throw new Error('Campos obrigatórios: nome, preco, estoque, id_categoria e id_empresa');
    }

    const res = await pool.query(`
      INSERT INTO produto (nome, preco, estoque, id_categoria, id_empresa)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nome, preco, estoque, id_categoria, id_empresa]);

    return res.rows[0];
  }

  async update(id, data) {
    const camposPermitidos = ['nome', 'preco', 'estoque', 'id_categoria', 'id_empresa'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const key in data) {
      if (camposPermitidos.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualizar');
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
