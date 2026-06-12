const afiliacaoProdutoDAO = require('../dao/AfiliacaoProdutoDAO');
const afiliadoDAO = require('../dao/AfiliadoDAO'); 

class AfiliacaoProdutoController {

  async findAll(req, res) {
    try {
      const afiliacoes = await afiliacaoProdutoDAO.findAll();
      res.status(200).json(afiliacoes);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

 
  async getById(req, res) {
    try {
      const { id } = req.params;
      const afiliacao = await afiliacaoProdutoDAO.findById(id);

      if (!afiliacao) {
        return res.status(404).json({ erro: 'Afiliação não encontrada' });
      }

      if (req.user.role === 'Cliente' && afiliacao.id_afiliado !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(afiliacao);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

 
 async create(req, res) {
  try {
    if (req.user.role !== 'Cliente') {
      return res.status(403).json({ erro: 'Apenas clientes podem solicitar afiliação' });
    }

    const afiliado = await afiliadoDAO.findByUsuario(req.user.id);
    
    if (!afiliado) {
      return res.status(400).json({ erro: 'O usuário precisa se tornar um afiliado antes de se afiliar a produtos.' });
    }

    const { id_produto } = req.body;
    
    const afiliacao = await afiliacaoProdutoDAO.create(afiliado.id_afiliado, id_produto);

    res.status(201).json(afiliacao);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}
  
  async updateStatus(req, res) {
    try {
      if (req.user.role !== 'Administrador') {
        return res.status(403).json({ erro: 'Apenas Administradores podem aprovar/reprovar' });
      }

      const { id } = req.params;
      const { status, percentual_comissao } = req.body;

      const afiliacao = await afiliacaoProdutoDAO.updateStatus(id, status, percentual_comissao);
      res.status(200).json(afiliacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      if (req.user.role !== 'Administrador') {
        return res.status(403).json({ erro: 'Apenas Administradores podem remover afiliações' });
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