const pool = require('../config/Database');

class EmpresaDAO {
  async getAll() {
    const res = await pool.query(`SELECT * FROM empresa ORDER BY id_empresa`);
    return res.rows;
  }

  async getById(id) {
    const res = await pool.query(`SELECT * FROM empresa WHERE id_empresa = $1`, [id]);
    return res.rows[0];
  }

  async create(empresa) {
    const { razao_social, nome_fantasia, cnpj, cep, cidade, estado, id_usuario_responsavel } = empresa;
    
    const res = await pool.query(`
      INSERT INTO empresa (razao_social, nome_fantasia, cnpj, cep, cidade, estado, id_usuario_responsavel, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *
    `, [razao_social, nome_fantasia, cnpj, cep, cidade, estado, id_usuario_responsavel]);
    
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

    if (!fields.length) throw new Error('Nenhum campo fornecido para atualização');
    values.push(id);

    const res = await pool.query(`
      UPDATE empresa
      SET ${fields.join(', ')}
      WHERE id_empresa = $${i}
      RETURNING *
    `, values);
    
    return res.rows[0];
  }

  async delete(id) {
    const res = await pool.query(`DELETE FROM empresa WHERE id_empresa = $1 RETURNING *`, [id]);
    return res.rowCount > 0;
  }
}

module.exports = new EmpresaDAO();