const saqueDAO = require('../dao/SaqueDAO');
const carteiraDAO = require('../dao/CarteiraDAO');

class SaqueController {

  async getAll(req, res) {

    try {

      const saques =
        await saqueDAO.getAll();

      res.status(200).json(saques);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async getById(req, res) {

    try {

      const { id } = req.params;

      const saque =
        await saqueDAO.getById(id);

      if (!saque) {
        return res.status(404).json({
          erro: 'Saque não encontrado'
        });
      }

      res.status(200).json(saque);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async create(req, res) {

    try {

      const {
        id_carteira,
        valor
      } = req.body;

      const carteira =
        await carteiraDAO.getById(
          id_carteira
        );

      if (!carteira) {
        return res.status(404).json({
          erro: 'Carteira não encontrada'
        });
      }

      if (valor <= 0) {
        return res.status(400).json({
          erro: 'Valor inválido'
        });
      }

      if (
        Number(carteira.saldo)
        < Number(valor)
      ) {
        return res.status(400).json({
          erro: 'Saldo insuficiente'
        });
      }

      const saque =
        await saqueDAO.create(
          id_carteira,
          valor
        );

      res.status(201).json(saque);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

  async updateStatus(req, res) {

    try {

      const { id } = req.params;
      const { status } = req.body;

      const saque =
        await saqueDAO.getById(id);

      if (!saque) {
        return res.status(404).json({
          erro: 'Saque não encontrado'
        });
      }

      const atualizado =
        await saqueDAO.updateStatus(
          id,
          status
        );

      if (status === 'APROVADO') {

        await carteiraDAO.removerSaldo(
          saque.id_carteira,
          saque.valor
        );

      }

      res.status(200).json(atualizado);

    } catch (error) {

      res.status(500).json({
        erro: error.message
      });

    }

  }

}

module.exports =
  new SaqueController();