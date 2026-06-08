const pool = require('../config/Database');

class AfiliacaoProdutoDAO {

  async findAll() {
    const res = await pool.query(`
      SELECT
        ap.*,
        p.nome AS produto,
        p.preco,
        u.nome AS afiliado
      FROM afiliacao_produto ap
      INNER JOIN produto p
        ON ap.id_produto = p.id_produto
      INNER JOIN afiliado a
        ON ap.id_afiliado = a.id_afiliado
      INNER JOIN usuario u
        ON a.id_usuario = u.id_usuario
    `);

    return res.rows;
  }

  async findById(id) {
    const res = await pool.query(`
      SELECT
        ap.*,
        p.nome AS produto,
        p.preco,
        u.nome AS afiliado
      FROM afiliacao_produto ap
      INNER JOIN produto p
        ON ap.id_produto = p.id_produto
      INNER JOIN afiliado a
        ON ap.id_afiliado = a.id_afiliado
      INNER JOIN usuario u
        ON a.id_usuario = u.id_usuario
      WHERE ap.id_afiliacao = $1
    `, [id]);

    return res.rows[0];
  }

  async create(idAfiliado, idProduto) {
    const res = await pool.query(`
      INSERT INTO afiliacao_produto (
        id_afiliado,
        id_produto,
        status,
        data_solicitacao
      )
      VALUES (
        $1,
        $2,
        'PENDENTE',
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `, [idAfiliado, idProduto]);

    return res.rows[0];
  }

  async updateStatus(id, status, percentual_comissao) {
    const res = await pool.query(`
      UPDATE afiliacao_produto
      SET status = $1,
      data_aprovacao = CURRENT_TIMESTAMP,
      percentual_comissao=$2
      WHERE id_afiliacao = $3
      RETURNING *
    `, [status, id , percentual_comissao]);

    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(`
      DELETE FROM afiliacao_produto
      WHERE id_afiliacao = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }

  async exists(idAfiliado, idProduto) {
    const res = await pool.query(`
      SELECT *
      FROM afiliacao_produto
      WHERE id_afiliado = $1
        AND id_produto = $2
    `, [idAfiliado, idProduto]);

    return res.rows.length > 0;
  }
}

module.exports = new AfiliacaoProdutoDAO();