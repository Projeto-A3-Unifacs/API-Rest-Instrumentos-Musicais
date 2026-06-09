const enderecoDAO = require('../dao/EnderecoDAO');
const usuarioDAO = require('../dao/UsuarioDAO');

class EnderecoController {

  async getAll(req, res) {

    try {

      const enderecos =
        await enderecoDAO.getAll();

      res.status(200).json(enderecos);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async getById(req, res) {

    try {

      const { id } = req.params;

      const endereco =
        await enderecoDAO.getById(id);

      if (!endereco) {
        return res.status(404).json({
          erro: 'Endereço não encontrado'
        });
      }

      res.status(200).json(endereco);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async getByUsuario(req, res) {

    try {

      const { idUsuario } = req.params;

      const enderecos =
        await enderecoDAO.getByUsuario(
          idUsuario
        );

      res.status(200).json(enderecos);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async create(req, res) {

    try {

      const {
        id_usuario,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      } = req.body;

      const usuario =
        await usuarioDAO.getById(
          id_usuario
        );

      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado'
        });
      }

      const endereco =
        await enderecoDAO.create(
          id_usuario,
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        );

      res.status(201).json(endereco);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async update(req, res) {

    try {

      const { id } = req.params;

      const endereco =
        await enderecoDAO.update(
          id,
          req.body
        );

      if (!endereco) {
        return res.status(404).json({
          erro: 'Endereço não encontrado'
        });
      }

      res.status(200).json(endereco);

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
        await enderecoDAO.delete(id);

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

module.exports = new EnderecoController();