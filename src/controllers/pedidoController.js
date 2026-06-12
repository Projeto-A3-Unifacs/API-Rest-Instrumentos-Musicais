const PedidoDao = require('../dao/pedidoDao');
const FreteDao = require('../dao/FreteDAO');
const EnderecoDAO = require('../dao/EnderecoDAO');
const CarrinhoDAO = require('../dao/CarrinhoDAO');
const PagamentoDAO = require('../dao/PagamentoDao');
const carteiraDAO = require('../dao/CarteiraDAO');
const comissaoDAO = require('../dao/ComissaoDAO');
const afiliacaoProdutoDAO = require('../dao/AfiliacaoProdutoDAO');
class PedidoController {

  async getAll(req, res) {
    try {
      const { id_usuario } = req.query;

      const pedidos = await PedidoDao.getAll(id_usuario);

      res.status(200).json(pedidos);

    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);

      res.status(500).json({
        error: 'Erro ao buscar pedidos'
      });
    }
  }


    async getByUsuario(req, res) {
      try {
        const { idUsuario } = req.params;
  
        if (req.user.role === 'Cliente' && Number(idUsuario) !== req.user.id) {
          return res.status(403).json({ erro: 'Acesso negado' });
        }
  
        const enderecos = await pedidoDao.getByUsuario(idUsuario);
        res.status(200).json(enderecos);
  
      } catch (error) {
        res.status(500).json({ erro: error.message });
      }
    }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const pedido = await PedidoDao.getById(id);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      if (req.user.role === 'Cliente' && pedido.id_usuario !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const pagamentos = await PagamentoDAO.getByPedido(id);
      
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
    const { id_endereco, id_produto, quantidade, id_afiliacao } = req.body;

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

    const novoPedido = await PedidoDao.create({
      id_usuario: id_usuario,
      id_endereco: id_endereco,
      itens: itensParaComprar, 
      valor_frete: valorFreteTotal,
      id_afiliacao: id_afiliacao
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
    const { status } = req.body;

    const pedidoAntigo = await PedidoDao.getById(id);

    if (!pedidoAntigo) {
      return res.status(404).json({ message: 'Pedido não encontrado para atualizar' });
    }

    const pedidoAtualizado = await PedidoDao.update(id, req.body);

    if (status === 'APROVADO' && pedidoAntigo.status !== 'APROVADO') {
      const valorTotal = Number(pedidoAtualizado.valor_total);
      let valorVendedor = valorTotal;

      const comissoes = await comissaoDAO.getByPedido(id);

      if (Array.isArray(comissoes) && comissoes.length > 0) {
        const comissao = comissoes[0];
        const valorAfiliado = Number(comissao.valor_comissao);
        
        if (valorAfiliado > 0) {
          valorVendedor -= valorAfiliado;

          const dadosAfiliado = await afiliacaoProdutoDAO.getUsuarioByAfiliacao(comissao.id_afiliacao);
          if (dadosAfiliado) {
            let carteiraAfiliado = await carteiraDAO.getByUsuario(dadosAfiliado.id_usuario);
            if (!carteiraAfiliado) {
              carteiraAfiliado = await carteiraDAO.create(dadosAfiliado.id_usuario);
            }
            await carteiraDAO.adicionarSaldo(carteiraAfiliado.id_carteira, valorAfiliado);
          }

          await comissaoDAO.updateStatus(comissao.id_comissao, 'PAGO');
        }
      }

      const dadosVendedor = await PedidoDao.getVendedorByPedido(id);
      if (dadosVendedor) {
        let carteiraVendedor = await carteiraDAO.getByUsuario(dadosVendedor.id_usuario_responsavel);
        if (!carteiraVendedor) {
          carteiraVendedor = await carteiraDAO.create(dadosVendedor.id_usuario_responsavel);
        }
        await carteiraDAO.adicionarSaldo(carteiraVendedor.id_carteira, valorVendedor);
      }
    }

    res.status(200).json(pedidoAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
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