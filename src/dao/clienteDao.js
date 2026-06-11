const pool = require('../config/Database');
const bcrypt = require('bcryptjs');

class ClienteDao {
  async getAll() {
    const res = await pool.query(`
      SELECT * FROM usuario 
      WHERE id_perfil = 2
      ORDER BY id_usuario
    `);
    return res.rows;
  }


 
  async getByUsuario(id) {
    const res = await pool.query(`
      SELECT * FROM usuario 
      WHERE id_usuario = $1
    `, [id]);
    return res.rows[0];
  }

  async getById(id) {
    const res = await pool.query(`
      SELECT * FROM usuario 
      WHERE id_usuario = $1 AND id_perfil = 2
    `, [id]);
    return res.rows[0];
  }


 async create(cliente) {
    const { nome, email, senha, cpf, telefone, data_nascimento } = cliente;
    
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const res = await pool.query(`
      INSERT INTO usuario (nome, email, senha, cpf, telefone, data_nascimento, data_cadastro, id_perfil)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, 2)
      RETURNING *
    `, [nome, email, senhaCriptografada, cpf, telefone, data_nascimento]);
    
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

    if (!fields.length) throw new Error('Nenhum campo informado para atualização');
    
    values.push(id);

    cliente
    const res = await pool.query(`
      UPDATE usuario
      SET ${fields.join(', ')}
      WHERE id_usuario = $${i} AND id_perfil = 2
      RETURNING *
    `, values);
    
    return res.rows[0];
  }

  async delete(id) {
   
    const res = await pool.query(`
      DELETE FROM usuario 
      WHERE id_usuario = $1 AND id_perfil = 2 
      RETURNING *
    `, [id]);
    
    return res.rowCount > 0;
  }
}

module.exports = new ClienteDao();