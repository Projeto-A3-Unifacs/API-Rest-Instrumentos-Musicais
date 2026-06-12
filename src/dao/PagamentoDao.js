const pool = require('../config/Database');

class PagamentoDAO {

async getAll(idUsuario = null) {
    if (idUsuario) {
  
      const res = await pool.query(`
        SELECT p.* FROM pagamento p
        JOIN pedido ped ON p.id_pedido = ped.id_pedido
        WHERE ped.id_usuario = $1
        ORDER BY p.data_pagamento DESC
      `, [idUsuario]);
      return res.rows;
    }

    
    const res = await pool.query(`SELECT * FROM pagamento ORDER BY data_pagamento DESC`);
    return res.rows;
  }
  async getById(idPagamento) {
    const res = await pool.query(`SELECT * FROM pagamento WHERE id_pagamento = $1`, [idPagamento]);
    return res.rows[0];
  }
    

  async getByPedido(idPedido) {
    const res = await pool.query(`
      SELECT * FROM pagamento
      WHERE id_pedido = $1
    `, [idPedido]);
    return res.rows;
  }

  async create(idPedido, metodo, valor, status) {
    const res = await pool.query(`
      INSERT INTO pagamento (id_pedido, metodo, valor, status, data_pagamento)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING *
    `, [idPedido, metodo, valor, status]);
    return res.rows[0];
  }

  async aprovarPagamento(idPagamento) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const pagamentoRes = await client.query(`
        UPDATE pagamento
        SET status = 'APROVADO', data_pagamento = CURRENT_TIMESTAMP
        WHERE id_pagamento = $1
        RETURNING *
      `, [idPagamento]);

      const pagamento = pagamentoRes.rows[0];

      if (!pagamento) {
        throw new Error('Pagamento não encontrado');
      }

      await client.query(`
        UPDATE pedido
        SET status = 'PREPARANDO_ENVIO'
        WHERE id_pedido = $1
      `, [pagamento.id_pedido]);

      await client.query('COMMIT');
      return pagamento;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new PagamentoDAO();