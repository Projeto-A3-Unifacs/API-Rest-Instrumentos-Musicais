const PedidoDao = require('../dao/pedidoDao');

class PedidoController {
  async getAll(req, res) {
    try {
      const pedidos = await PedidoDao.getAll();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoDao.getById(id);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.status(200).json(pedido);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  async create(req, res) {
    try {
      const novoPedido = await PedidoDao.create(req.body);
      res.status(201).json(novoPedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const pedidoAtualizado = await PedidoDao.update(id, req.body);

      if (!pedidoAtualizado) {
        return res.status(404).json({ message: 'Pedido não encontrado para atualizar' });
      }

      res.status(200).json(pedidoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const pedidoCancelado = await PedidoDao.cancelar(id);

      if (!pedidoCancelado) {
        return res.status(404).json({ message: 'Pedido não encontrado para cancelar' });
      }

      res.status(200).json({
        message: 'Pedido cancelado com sucesso',
        pedido: pedidoCancelado
      });
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletado = await PedidoDao.delete(id);

      if (!deletado) {
        return res.status(404).json({ message: 'Pedido não encontrado para deletar' });
      }

      res.status(200).json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
  }
}

module.exports = new PedidoController();
