const PedidoDao = require('../dao/pedidoDao');
const FreteDao = require('../dao/FreteDAO');
const EnderecoDAO = require('../dao/EnderecoDAO');

class PedidoController {

  async getAll(req, res) {
    try {

      const pedidos = await PedidoDao.getAll();

      res.status(200).json(pedidos);

    } catch (error) {

      console.error('Erro ao buscar pedidos:', error);

      res.status(500).json({
        error: 'Erro ao buscar pedidos'
      });

    }
  }

  async getById(req, res) {

    try {

      const { id } = req.params;

      const pedido = await PedidoDao.getById(id);

      if (!pedido) {
        return res.status(404).json({
          message: 'Pedido não encontrado'
        });
      }

      res.status(200).json(pedido);

    } catch (error) {

      console.error('Erro ao buscar pedido:', error);

      res.status(500).json({
        error: 'Erro ao buscar pedido'
      });

    }
  }

  async create(req, res) {
    try {
      const { id_endereco, itens } = req.body;

      if (!id_endereco) {
        return res.status(400).json({ error: 'id_endereco é obrigatório' });
      }

      const endereco = await EnderecoDAO.getById(id_endereco);
      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      if (!itens || itens.length === 0) {
        return res.status(400).json({ error: 'Pedido precisa possuir itens' });
      }

      let valorFreteTotal = 0;
      const fretesCalculados = [];

      for (const item of itens) {
        const dadosFrete = await FreteDao.getDadosFrete(item.id_produto, id_endereco);

        if (!dadosFrete) {
          return res.status(400).json({ 
            error: `Não foi possível calcular o frete para o produto ID ${item.id_produto}` 
          });
        }

        let valorFreteItem = 0;
        let prazoDiasItem = 0;

        if (
          dadosFrete.cidade_empresa === dadosFrete.cidade_cliente &&
          dadosFrete.estado_empresa === dadosFrete.estado_cliente
        ) {
          valorFreteItem = 15;
          prazoDiasItem = 2;
        } else if (dadosFrete.estado_empresa === dadosFrete.estado_cliente) {
          valorFreteItem = 25;
          prazoDiasItem = 5;
        } else {
          valorFreteItem = 40;
          prazoDiasItem = 10;
        }

        const custoFreteDesteItem = valorFreteItem * item.quantidade;
        
        valorFreteTotal += custoFreteDesteItem;

        fretesCalculados.push({
          valor: custoFreteDesteItem,
          prazo_dias: prazoDiasItem,
          cidade_empresa: dadosFrete.cidade_empresa,
          estado_empresa: dadosFrete.estado_empresa,
          cidade_cliente: dadosFrete.cidade_cliente,
          estado_cliente: dadosFrete.estado_cliente
        });
      }

      const novoPedido = await PedidoDao.create({
        ...req.body,
        valor_frete: valorFreteTotal
      });

      for (const frete of fretesCalculados) {
        await FreteDao.create(
          novoPedido.id_pedido,
          frete.valor,
          frete.prazo_dias,
          frete.cidade_empresa,
          frete.estado_empresa,
          frete.cidade_cliente,
          frete.estado_cliente
        );
      }

      res.status(201).json({
        pedido: novoPedido,
        resumo_frete: {
          total_frete: valorFreteTotal,
          pacotes: fretesCalculados.length
        }
      });

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {

    try {

      const { id } = req.params;

      const pedidoAtualizado =
        await PedidoDao.update(
          id,
          req.body
        );

      if (!pedidoAtualizado) {
        return res.status(404).json({
          message:
            'Pedido não encontrado para atualizar'
        });
      }

      res.status(200).json(
        pedidoAtualizado
      );

    } catch (error) {

      console.error(
        'Erro ao atualizar pedido:',
        error
      );

      res.status(400).json({
        error: error.message
      });

    }
  }

  async cancelar(req, res) {

    try {

      const { id } = req.params;

      const pedidoCancelado =
        await PedidoDao.cancelar(id);

      if (!pedidoCancelado) {
        return res.status(404).json({
          message:
            'Pedido não encontrado para cancelar'
        });
      }

      res.status(200).json({
        message:
          'Pedido cancelado com sucesso',
        pedido:
          pedidoCancelado
      });

    } catch (error) {

      console.error(
        'Erro ao cancelar pedido:',
        error
      );

      res.status(400).json({
        error: error.message
      });

    }
  }

  async delete(req, res) {

    try {

      const { id } = req.params;

      const deletado =
        await PedidoDao.delete(id);

      if (!deletado) {
        return res.status(404).json({
          message:
            'Pedido não encontrado para deletar'
        });
      }

      res.status(200).json({
        message:
          'Pedido deletado com sucesso'
      });

    } catch (error) {

      console.error(
        'Erro ao deletar pedido:',
        error
      );

      res.status(500).json({
        error:
          'Erro ao deletar pedido'
      });

    }
  }
}

module.exports =
  new PedidoController();