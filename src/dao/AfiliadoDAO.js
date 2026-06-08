const pool = require('../config/Database');

class AfiliadoDAO {

  async findAll() {
    const res = await pool.query(`
      SELECT
        a.*,
        u.nome,
        u.email,
          u.telefone
      FROM afiliado a
      INNER JOIN usuario u
        ON a.id_usuario = u.id_usuario
    `);

    return res.rows;
  }

  async findById(id) {
    const res = await pool.query(`
      SELECT
        a.*,
        u.nome,
        u.email,
        u.telefone
      FROM afiliado a
      INNER JOIN usuario u
        ON a.id_usuario = u.id_usuario
      WHERE a.id_afiliado = $1
    `, [id]);

    return res.rows[0];
  }

async create(idUsuario) {
  const res = await pool.query(`
    INSERT INTO afiliado (
      id_usuario,
      status,
      data_solicitacao
    )
    VALUES (
      $1,
      'PENDENTE',
      CURRENT_TIMESTAMP
    )
    RETURNING *
  `, [idUsuario]);

  return res.rows[0];
}

  async updateStatus(id, status) {

  let res;

  if (status === 'APROVADO') {

    res = await pool.query(`
      UPDATE afiliado
      SET
        status = $1,
        data_aprovacao = CURRENT_TIMESTAMP
      WHERE id_afiliado = $2
      RETURNING *
    `, [status, id]);

  } else {

    res = await pool.query(`
      UPDATE afiliado
      SET status = $1
      WHERE id_afiliado = $2
      RETURNING *
    `, [status, id]);

  }

  return res.rows[0];
}
  async delete(id) {
    const res = await pool.query(`
      DELETE FROM afiliado
      WHERE id_afiliado = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }
}

module.exports = new AfiliadoDAO();