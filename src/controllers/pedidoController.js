const PedidoDao = require('../dao/pedidoDao');
const FreteDao = require('../dao/FreteDAO');
const EnderecoDAO = require('../dao/EnderecoDAO');
const CarrinhoDAO = require('../dao/CarrinhoDAO');
const PagamentoDAO = require('../dao/PagamentoDAO');

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
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      // Trava de segurança para o cliente só ver o próprio pedido
      if (req.user.role === 'Cliente' && pedido.id_usuario !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      // AQUI NÓS USAMOS O MÉTODO ÓRFÃO!
      // Buscamos os pagamentos atrelados a este pedido
      const pagamentos = await PagamentoDAO.getByPedido(id);
      
      // Injetamos a lista de pagamentos no objeto do pedido antes de devolver pro usuário
      pedido.historico_pagamentos = pagamentos;

      res.status(200).json(pedido);

    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  async create(req, res) {
    try {
      const id_usuario = req.user.id; 
      const { id_endereco, id_produto, quantidade } = req.body;

      if (!id_endereco) {
        return res.status(400).json({ error: 'id_endereco é obrigatório' });
      }

      const endereco = await EnderecoDAO.getById(id_endereco);
      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      let itensParaComprar = [];
      let usarCarrinho = false;
      let carrinhoUsuario = null;

      // LÓGICA HÍBRIDA: Compra Direta vs Carrinho
      if (id_produto && quantidade) {
        itensParaComprar = [{ id_produto, quantidade }];
      } else {
        usarCarrinho = true;
        carrinhoUsuario = await CarrinhoDAO.getOrCreateCart(id_usuario);
        const itensCarrinho = await CarrinhoDAO.getCartDetails(carrinhoUsuario.id_carrinho);

        if (!itensCarrinho || itensCarrinho.length === 0) {
          return res.status(400).json({ error: 'O carrinho está vazio e nenhum produto de compra direta foi informado.' });
        }

        itensParaComprar = itensCarrinho.map(item => ({
          id_produto: item.id_produto,
          quantidade: item.quantidade
        }));
      }

      let valorFreteTotal = 0;
      const fretesCalculados = [];

      for (const item of itensParaComprar) {
        const dadosFrete = await FreteDao.getDadosFrete(item.id_produto, id_endereco);

        if (!dadosFrete) {
          return res.status(400).json({ 
            error: `Não foi possível calcular o frete para o produto ID ${item.id_produto}` 
          });
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

        const custoFreteDesteItem = valorFreteItem * item.quantidade;
        valorFreteTotal += custoFreteDesteItem;

        fretesCalculados.push({
          id_produto: item.id_produto, 
          valor: custoFreteDesteItem,
          prazo_dias: prazoDiasItem,
          cidade_empresa: dadosFrete.cidade_empresa,
          estado_empresa: dadosFrete.estado_empresa,
          cidade_cliente: dadosFrete.cidade_cliente,
          estado_cliente: dadosFrete.estado_cliente
        });
      }

      // Repassamos a nova array itensParaComprar em vez de req.body.itens
      const novoPedido = await PedidoDao.create({
        id_usuario: id_usuario,
        id_endereco: id_endereco,
        itens: itensParaComprar, 
        valor_frete: valorFreteTotal
      });

     for (const frete of fretesCalculados) {
        await FreteDao.create(
          novoPedido.id_pedido,
          frete.id_produto, 
          frete.valor,
          frete.prazo_dias,
          frete.cidade_empresa,
          frete.estado_empresa,
          frete.cidade_cliente,
          frete.estado_cliente
        );
      }

      // Limpa o carrinho caso a compra tenha vindo dele
      if (usarCarrinho && carrinhoUsuario) {
        await CarrinhoDAO.clearCart(carrinhoUsuario.id_carrinho);
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