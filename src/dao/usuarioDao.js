const pool = require('../config/Database');

class UsuarioDao {
  async getAll() {
    const res = await pool.query(`
      SELECT u.*, e.id_empresa, e.nome_fantasia, e.cnpj
      FROM usuario u
      INNER JOIN empresa e
        ON u.id_usuario = e.id_usuario_responsavel
      WHERE u.id_perfil = 1
    `);
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT u.*, e.id_empresa, e.nome_fantasia, e.cnpj
      FROM usuario u
      INNER JOIN empresa e
        ON u.id_usuario = e.id_usuario_responsavel
      WHERE u.id_usuario = $1 AND u.id_perfil = 1
    `, [id]);
    return res.rows[0];
  }

  async create(usuario) {
    const { nome, email, senha, cpf, telefone, data_nascimento } = usuario;
    const res = await pool.query(`
      INSERT INTO usuario (nome, email, senha, cpf, telefone, data_nascimento, data_cadastro, id_perfil)
      VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,1)
      RETURNING *
    `, [nome, email, senha, cpf, telefone, data_nascimento]);
    return res.rows[0];
  }

  async update(id, data) {
    delete data.id_usuario;
    delete data.id_perfil;

    const fields = [];
    const values = [];
    let i = 1;
    for (const key in data) {
      fields.push(`${key} = $${i}`);
      values.push(data[key]);
      i++;
    }
    if (!fields.length) throw new Error('Nenhum campo informado');
    values.push(id);

    const res = await pool.query(`
      UPDATE usuario
      SET ${fields.join(', ')}
      WHERE id_usuario = $${i} AND id_perfil = 1
      RETURNING *
    `, values);
    return res.rows[0];
  }

  async delete(id) {
    await pool.query(`UPDATE empresa SET id_usuario_responsavel = NULL WHERE id_usuario_responsavel = $1`, [id]);
    const res = await pool.query(`DELETE FROM usuario WHERE id_usuario = $1 AND id_perfil = 1 RETURNING *`, [id]);
    return res.rowCount > 0;
  }
}

module.exports = new UsuarioDao();