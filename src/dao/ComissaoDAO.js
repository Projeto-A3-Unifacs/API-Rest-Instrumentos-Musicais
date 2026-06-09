const pool = require('../config/Database');

class ComissaoDAO {

  async getAll() {
    const res = await pool.query(`
      SELECT *
      FROM comissao
      ORDER BY id_comissao
    `);

    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT *
      FROM comissao
      WHERE id_comissao = $1
    `, [id]);

    return res.rows[0];
  }

  async getByPedido(idPedido) {
    const res = await pool.query(`
      SELECT *
      FROM comissao
      WHERE id_pedido = $1
    `, [idPedido]);

    return res.rows;
  }

  async getByAfiliacao(idAfiliacao) {
    const res = await pool.query(`
      SELECT *
      FROM comissao
      WHERE id_afiliacao = $1
    `, [idAfiliacao]);

    return res.rows;
  }

  async create(
    idAfiliacao,
    idPedido,
    valorVenda,
    percentual,
    valorComissao
  ) {

    const res = await pool.query(`
      INSERT INTO comissao
      (
        id_afiliacao,
        id_pedido,
        valor_venda,
        percentual,
        valor_comissao,
        status,
        data_registro
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        'PENDENTE',
        NOW()
      )
      RETURNING *
    `,
    [
      idAfiliacao,
      idPedido,
      valorVenda,
      percentual,
      valorComissao
    ]);

    return res.rows[0];
  }

  async updateStatus(idComissao, status) {

    const res = await pool.query(`
      UPDATE comissao
      SET status = $1
      WHERE id_comissao = $2
      RETURNING *
    `,
    [
      status,
      idComissao
    ]);

    return res.rows[0];
  }

  async delete(id) {

    const res = await pool.query(`
      DELETE FROM comissao
      WHERE id_comissao = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }

}

module.exports = new ComissaoDAO();