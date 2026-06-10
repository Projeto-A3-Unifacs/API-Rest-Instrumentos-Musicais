const FreteDAO = require('../dao/FreteDAO');

class FreteController {
  async getAll(req, res) {
    try {
      const fretes = await FreteDAO.getAll();
      res.status(200).json(fretes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const frete = await FreteDAO.getById(id);
      
      if (!frete) {
        return res.status(404).json({ error: 'Frete não encontrado' });
      }
      
      res.status(200).json(frete);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByPedido(req, res) {
    try {
      const { idPedido } = req.params;
      const fretes = await FreteDAO.getByPedido(idPedido);
      res.status(200).json(fretes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async simular(req, res) {
    try {
      const { id_produto, id_endereco, quantidade = 1 } = req.body;

      if (!id_produto || !id_endereco) {
        return res.status(400).json({ error: 'id_produto e id_endereco são obrigatórios' });
      }

      const dadosFrete = await FreteDAO.getDadosFrete(id_produto, id_endereco);

      if (!dadosFrete) {
        return res.status(400).json({ error: 'Não foi possível calcular o frete para estes dados' });
      }

      let valorFreteItem = 0;
      let prazoDiasItem = 0;

      if (dadosFrete.cidade_empresa === dadosFrete.cidade_cliente && dadosFrete.estado_empresa === dadosFrete.estado_cliente) {
        valorFreteItem = 15;
        prazoDiasItem = 2;
      } else if (dadosFrete.estado_empresa === dadosFrete.estado_cliente) {
        valorFreteItem = 25;
        prazoDiasItem = 5;
      } else {
        valorFreteItem = 40;
        prazoDiasItem = 10;
      }

      const valorTotalFrete = valorFreteItem * quantidade;

      res.status(200).json({
        valor_unitario: valorFreteItem,
        valor_total: valorTotalFrete,
        prazo_dias: prazoDiasItem,
        origem: `${dadosFrete.cidade_empresa} - ${dadosFrete.estado_empresa}`,
        destino: `${dadosFrete.cidade_cliente} - ${dadosFrete.estado_cliente}`
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }

      const freteAtualizado = await FreteDAO.updateStatus(id, status);

      if (!freteAtualizado) {
        return res.status(404).json({ error: 'Frete não encontrado' });
      }

      res.status(200).json(freteAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FreteController();