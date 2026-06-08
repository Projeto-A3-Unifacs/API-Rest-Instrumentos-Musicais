const afiliacaoProdutoDAO =
  require('../dao/AfiliacaoProdutoDAO');

class AfiliacaoProdutoController {

  async getAll(req, res) {
    try {

      const afiliacoes =
        await afiliacaoProdutoDAO.getAll();

      res.status(200).json(afiliacoes);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async getById(req, res) {
    try {

      const { id } = req.params;

      const afiliacao =
        await afiliacaoProdutoDAO.getById(id);

      if (!afiliacao) {
        return res.status(404).json({
          erro: 'Afiliação não encontrada'
        });
      }

      res.status(200).json(afiliacao);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async create(req, res) {
    try {

      const {
        id_afiliado,
        id_produto
      } = req.body;

      const afiliacao =
        await afiliacaoProdutoDAO.create(
          id_afiliado,
          id_produto
        );

      res.status(201).json(afiliacao);

    } catch (error) {

      res.status(400).json({
        erro: error.message
      });

    }
  }

  async updateStatus(req, res) {
    try {

      const { id } = req.params;
      const {
        status,
        percentual_comissao
      } = req.body;

      const afiliacao =
        await afiliacaoProdutoDAO.updateStatus(
          id,
          status,
          percentual_comissao
        );

      res.status(200).json(afiliacao);

    } catch (error) {

      res.status(400).json({
        erro: error.message
      });

    }
  }

  async delete(req, res) {
    try {

      const { id } = req.params;

      const removido =
        await afiliacaoProdutoDAO.delete(id);

      res.status(200).json({
        sucesso: removido
      });

    } catch (error) {

      res.status(400).json({
        erro: error.message
      });

    }
  }
}

module.exports =
  new AfiliacaoProdutoController();
