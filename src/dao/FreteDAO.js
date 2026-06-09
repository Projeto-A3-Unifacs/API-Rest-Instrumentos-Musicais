const pool = require('../config/Database');

class FreteDAO {

  async getAll() {
    const res = await pool.query(`
      SELECT *
      FROM frete
      ORDER BY id_frete
    `);

    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT *
      FROM frete
      WHERE id_frete = $1
    `, [id]);

    return res.rows[0];
  }

  async getByPedido(idPedido) {
    const res = await pool.query(`
      SELECT *
      FROM frete
      WHERE id_pedido = $1
    `, [idPedido]);

    return res.rows[0];
  }

  async create(
    idPedido,
    valor,
    prazoDias,
    cidadeOrigem,
    estadoOrigem,
    cidadeDestino,
    estadoDestino
  ) {

    const res = await pool.query(`
      INSERT INTO frete (
        id_pedido,
        valor,
        prazo_dias,
        cidade_origem,
        estado_origem,
        cidade_destino,
        estado_destino,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        'PENDENTE'
      )
      RETURNING *
    `,
    [
      idPedido,
      valor,
      prazoDias,
      cidadeOrigem,
      estadoOrigem,
      cidadeDestino,
      estadoDestino
    ]);

    return res.rows[0];
  }

  async updateStatus(idFrete, status) {

    const res = await pool.query(`
      UPDATE frete
      SET status = $1
      WHERE id_frete = $2
      RETURNING *
    `,
    [
      status,
      idFrete
    ]);

    return res.rows[0];
  }

  async delete(id) {

    const res = await pool.query(`
      DELETE FROM frete
      WHERE id_frete = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }

  async getDadosFrete(idProduto, idEndereco) {

    const res = await pool.query(`
      SELECT
        e.cidade AS cidade_empresa,
        e.estado AS estado_empresa,
        en.cidade AS cidade_cliente,
        en.estado AS estado_cliente
      FROM produto p
      JOIN empresa e
        ON p.id_empresa = e.id_empresa
      JOIN endereco en
        ON en.id_endereco = $2
      WHERE p.id_produto = $1
    `,
    [idProduto, idEndereco]);

    return res.rows[0];
  }

}

module.exports = new FreteDAO();