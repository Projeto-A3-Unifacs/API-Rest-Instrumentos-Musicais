const comissaoDAO = require('../dao/ComissaoDAO');

class ComissaoController {

  // GET todas as comissões – apenas vendedores
  async getAll(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const comissoes = await comissaoDAO.getAll();
      res.status(200).json(comissoes);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET comissão por ID – apenas vendedores
  async getById(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { id } = req.params;
      const comissao = await comissaoDAO.getById(id);

      if (!comissao) {
        return res.status(404).json({ erro: 'Comissão não encontrada' });
      }

      res.status(200).json(comissao);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // POST criar comissão – apenas vendedores
  async create(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { id_afiliacao, id_pedido, valor_venda, percentual } = req.body;
      const valorComissao = Number(valor_venda) * (Number(percentual) / 100);

      const comissao = await comissaoDAO.create(
        id_afiliacao,
        id_pedido,
        valor_venda,
        percentual,
        valorComissao
      );

      res.status(201).json(comissao);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // PATCH aprovar/reprovar comissão – apenas vendedores
  async updateStatus(req, res) {
    try {
      if (req.user.role !== 'vendedor') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { id } = req.params;
      const { status } = req.body;

      const comissao = await comissaoDAO.updateStatus(id, status);
      res.status(200).json(comissao);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new ComissaoController();