const afiliadoDAO = require('../dao/AfiliadoDAO');

class AfiliadoController {

  // GET todos afiliados – apenas vendedores
  async getAll(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const afiliados = await afiliadoDAO.findAll();
      res.status(200).json(afiliados);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET afiliado por ID – clientes só podem ver o próprio, vendedores todos
  async getById(req, res) {
    try {
      const { id } = req.params;
      const afiliado = await afiliadoDAO.findById(id);

      if (!afiliado) return res.status(404).json({ erro: 'Afiliado não encontrado' });

      if (req.user.role === 'cliente' && afiliado.id_usuario !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(afiliado);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // POST criar afiliado – apenas clientes podem criar sua afiliação
  async create(req, res) {
    try {
      if (req.user.role !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem se tornar afiliados' });
      }

      // verifica se já é afiliado
      const existeAfiliado = await afiliadoDAO.getByUsuarioId(req.user.id);
      if (existeAfiliado) {
        return res.status(400).json({ erro: 'Usuário já é afiliado' });
      }

      const afiliado = await afiliadoDAO.create(req.user.id);
      res.status(201).json(afiliado);

    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  // PATCH aprovar/reprovar – apenas vendedores
  async updateStatus(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Apenas vendedores podem aprovar/reprovar' });
      }

      const { id } = req.params;
      const { status } = req.body;
      const afiliado = await afiliadoDAO.updateStatus(id, status);

      res.status(200).json(afiliado);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  // DELETE afiliado – apenas vendedores
  async delete(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Apenas vendedores podem remover afiliados' });
      }

      const { id } = req.params;
      const removido = await afiliadoDAO.delete(id);
      res.status(200).json({ sucesso: removido });

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new AfiliadoController();