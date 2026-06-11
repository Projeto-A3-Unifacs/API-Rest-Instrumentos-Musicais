const pool = require('../config/database');

class EnderecoDAO {

  async getAll() {
    const res = await pool.query(`
      SELECT *
      FROM endereco
      ORDER BY id_endereco
    `);

    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT *
      FROM endereco
      WHERE id_endereco = $1
    `, [id]);

    return res.rows[0];
  }

  async getByUsuario(idUsuario) {
    const res = await pool.query(`
      SELECT *
      FROM endereco
      WHERE id_usuario = $1
      ORDER BY id_endereco
    `, [idUsuario]);

    return res.rows;
  }

  async create(
    idUsuario,
    cep,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado
  ) {

    const res = await pool.query(`
      INSERT INTO endereco
      (
        id_usuario,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      RETURNING *
    `,
    [
      idUsuario,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    ]);
    console.log(idUsuario)
    return res.rows[0];
  }

  async update(id, dados) {

    const fields = [];
    const values = [];

    let i = 1;

    for (const key in dados) {
      fields.push(`${key} = $${i}`);
      values.push(dados[key]);
      i++;
    }

    values.push(id);

    const res = await pool.query(`
      UPDATE endereco
      SET ${fields.join(', ')}
      WHERE id_endereco = $${i}
      RETURNING *
    `,
    values);

    return res.rows[0];
  }

  async delete(id) {

    const res = await pool.query(`
      DELETE FROM endereco
      WHERE id_endereco = $1
      RETURNING *
    `, [id]);

    return res.rowCount > 0;
  }

}

module.exports = new EnderecoDAO();