const carteiraDAO = require('../dao/CarteiraDAO');
const usuarioDAO = require('../dao/usuarioDao');

class CarteiraController {

  async getAll(req, res) {
    try {

      const carteiras =
        await carteiraDAO.getAll();

      res.status(200).json(carteiras);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async getById(req, res) {
    try {

      const { id } = req.params;

      const carteira =
        await carteiraDAO.getById(id);

      if (!carteira) {
        return res.status(404).json({
          erro: 'Carteira não encontrada'
        });
      }

      res.status(200).json(carteira);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async create(req, res) {
    try {

      const { id_usuario } = req.body;

      const usuario =
        await usuarioDAO.getById(id_usuario);

      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });
      }

      const carteiraExistente =
        await carteiraDAO.getByUsuario(
          id_usuario
        );

      if (carteiraExistente) {
        return res.status(400).json({
          erro: 'Usuário já possui carteira'
        });
      }

      const carteira =
        await carteiraDAO.create(
          id_usuario
        );

      res.status(201).json(carteira);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }

  async delete(req, res) {
    try {

      const { id } = req.params;

      const removido =
        await carteiraDAO.delete(id);

      res.status(200).json({
        sucesso: removido
      });

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }
  }
}

module.exports =
  new CarteiraController();