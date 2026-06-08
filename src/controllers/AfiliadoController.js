const afiliadoDAO = require('../dao/AfiliadoDAO');

class AfiliadoController {

  async getAll(req, res) {
    try {

      const afiliados =
        await afiliadoDAO.findAll();

      res.status(200).json(afiliados);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async getById(req, res) {
    try {

      const { id } = req.params;

      const afiliado =
        await afiliadoDAO.findById(id);

      if (!afiliado) {
        return res.status(404).json({
          erro: 'Afiliado não encontrado'
        });
      }

      res.status(200).json(afiliado);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async create(req, res) {
    try {

      const { id_usuario } = req.body;

      const afiliado =
        await afiliadoDAO.create(id_usuario);

      res.status(201).json(afiliado);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        erro: error.message
      });

    }
  }

  async updateStatus(req, res) {
    try {

      const { id } = req.params;
      const { status } = req.body;

      const afiliado =
        await afiliadoDAO.updateStatus(
          id,
          status
        );

      res.status(200).json(afiliado);

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
        await afiliadoDAO.delete(id);

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

module.exports = new AfiliadoController();