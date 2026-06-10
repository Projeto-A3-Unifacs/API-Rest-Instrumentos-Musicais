const afiliacaoProdutoDAO = require('../dao/AfiliacaoProdutoDAO');
const afiliadoDAO = require('../dao/AfiliadoDAO'); // usado para validar se o usuário é afiliado

class AfiliacaoProdutoController {

  // GET todas as afiliações – apenas vendedores
  async getAll(req, res) {
    try {
      const afiliacoes = await afiliacaoProdutoDAO.getAll();
      res.status(200).json(afiliacoes);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET afiliação por ID – clientes só acessam suas próprias
  async getById(req, res) {
    try {
      const { id } = req.params;
      const afiliacao = await afiliacaoProdutoDAO.getById(id);

      if (!afiliacao) {
        return res.status(404).json({ erro: 'Afiliação não encontrada' });
      }

      // se cliente, só pode ver se for o próprio afiliado
      if (req.user.role === 'Cliente' && afiliacao.id_afiliado !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(afiliacao);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // POST solicitar afiliação – apenas clientes não afiliados
  async create(req, res) {
    try {
      if (req.user.role !== 'Cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem solicitar afiliação' });
      }

      // verifica se usuário já é afiliado
      const afiliado = await afiliadoDAO.getByUsuarioId(req.user.id);
      if (afiliado) {
        return res.status(400).json({ erro: 'Usuário já é afiliado' });
      }

      const { id_produto } = req.body;
      const afiliacao = await afiliacaoProdutoDAO.create(req.user.id, id_produto);

      res.status(201).json(afiliacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  // PATCH aprovar/reprovar – apenas vendedores
  async updateStatus(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Apenas vendedores podem aprovar/reprovar' });
      }

      const { id } = req.params;
      const { status, percentual_comissao } = req.body;

      const afiliacao = await afiliacaoProdutoDAO.updateStatus(id, status, percentual_comissao);
      res.status(200).json(afiliacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  // DELETE afiliação – apenas vendedores
  async delete(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Apenas vendedores podem remover afiliações' });
      }

      const { id } = req.params;
      const removido = await afiliacaoProdutoDAO.delete(id);

      res.status(200).json({ sucesso: removido });
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new AfiliacaoProdutoController();