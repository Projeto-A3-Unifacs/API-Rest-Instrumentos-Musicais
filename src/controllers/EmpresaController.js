const empresaDAO = require('../dao/EmpresaDAO');

class EmpresaController {
  async getAll(req, res) {
    try {
      res.status(200).json(await empresaDAO.getAll());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }




async getByUsuario(req, res) {
      try {
        const { idUsuario } = req.params;
  
  
        const enderecos = await EmpresaDAO.getByUsuario(idUsuario);
        res.status(200).json(enderecos);
  
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    }


  async getById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const empresa = await empresaDAO.getById(parseInt(id));
      if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada.' });

      res.status(200).json(empresa);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async create(req, res) {
    try {
      const { razao_social, nome_fantasia, cnpj, cep, cidade, estado } = req.body;
      
      if (!razao_social || !nome_fantasia || !cnpj) {
        return res.status(400).json({ error: 'Campos obrigatórios: razao_social, nome_fantasia, cnpj' });
      }

      const id_usuario_responsavel = req.user.role === 'Vendedor' && req.body.id_usuario_responsavel 
        ? req.body.id_usuario_responsavel 
        : req.user.id;

      const novaEmpresa = await empresaDAO.create({
        razao_social, nome_fantasia, cnpj, cep, cidade, estado, id_usuario_responsavel
      });

      res.status(201).json(novaEmpresa);
    } catch (e) {
      if (e.code === '23505') {
        return res.status(409).json({ error: 'O CNPJ informado já está cadastrado.' });
      }
      res.status(500).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const empresaExistente = await empresaDAO.getById(parseInt(id));
      if (!empresaExistente) return res.status(404).json({ error: 'Empresa não encontrada.' });

      if (req.user.role === 'Vendedor' && empresaExistente.id_usuario_responsavel !== req.user.id) {
        return res.status(403).json({ error: 'Você só pode editar a sua própria empresa.' });
      }

      const { razao_social, nome_fantasia, cnpj, cep, cidade, estado } = req.body;

      const updated = await empresaDAO.update(parseInt(id), {
        razao_social, nome_fantasia, cnpj, cep, cidade, estado
      });

      res.status(200).json(updated);
    } catch (e) {
      if (e.code === '23505') return res.status(409).json({ error: 'O CNPJ informado já está em uso.' });
      res.status(500).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const empresaExistente = await empresaDAO.getById(parseInt(id));
      if (!empresaExistente) return res.status(404).json({ error: 'Empresa não encontrada.' });

      if (req.user.role === 'Vendedor' && empresaExistente.id_usuario_responsavel !== req.user.id) {
        return res.status(403).json({ error: 'Você só pode excluir a sua própria empresa.' });
      }

      const success = await empresaDAO.delete(parseInt(id));
      if (success) {
        res.status(204).send();
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new EmpresaController();