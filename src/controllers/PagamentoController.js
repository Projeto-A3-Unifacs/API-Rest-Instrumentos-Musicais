const pagamentoDAO = require('../dao/PagamentoDao');
const pedidoDAO = require('../dao/pedidoDao');

class PagamentoController {


async getAll(req, res) {
    try {
      let idUsuarioFiltro = null;

      
      if (req.user.role === 'Cliente') {
        idUsuarioFiltro = req.user.id;
      } 

      else if (req.query.id_usuario) {
        if (isNaN(req.query.id_usuario)) {
          return res.status(400).json({ error: 'Parâmetro id_usuario inválido.' });
        }
        idUsuarioFiltro = parseInt(req.query.id_usuario);
      }

      const pagamentos = await pagamentoDAO.getAll(idUsuarioFiltro);
      res.status(200).json(pagamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await pagamentoDAO.getById(id);
      
      if (!pagamento) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

  
      if (req.user.role === 'Cliente') {
        const pedido = await pedidoDAO.getById(pagamento.id_pedido);
        if (!pedido || pedido.id_usuario !== req.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }
      }

      res.status(200).json(pagamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
//Aqui losta os pagamentos atrelados ao pedido
  async getByPedido(req, res) {
    try {
      const { idPedido } = req.params;
      
      if (!idPedido || isNaN(idPedido)) {
        return res.status(400).json({ error: 'ID do pedido inválido' });
      }

      // Se for cliente, temos que garantir que ele é o dono do pedido
      if (req.user.role === 'Cliente') {
        const pedido = await pedidoDAO.getById(idPedido);
        if (!pedido || pedido.id_usuario !== req.user.id) {
          return res.status(403).json({ error: 'Acesso negado. Este pedido não é seu.' });
        }
      }

      const pagamentos = await pagamentoDAO.getByPedido(parseInt(idPedido));
      res.status(200).json(pagamentos);
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async processar(req, res) {
    try {
      const { id_pedido, metodo } = req.body;

      if (!['CARTAO', 'PIX', 'BOLETO'].includes(metodo)) {
        return res.status(400).json({ error: 'Método de pagamento inválido' });
      }

      const pedido = await pedidoDAO.getById(id_pedido);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if (pedido.status !== 'REALIZADO') {
        return res.status(400).json({ error: 'Este pedido já foi processado ou cancelado' });
      }

      let statusInicial = metodo === 'CARTAO' ? 'APROVADO' : 'PENDENTE';

      const novoPagamento = await pagamentoDAO.create(
        id_pedido, 
        metodo, 
        pedido.valor_total, 
        statusInicial
      );

      if (metodo === 'CARTAO') {
        await pagamentoDAO.aprovarPagamento(novoPagamento.id_pagamento);
        return res.status(201).json({
          message: 'Pagamento via Cartão aprovado com sucesso!',
          pagamento: novoPagamento
        });
      }

      const dadosSimulados = metodo === 'PIX' 
        ? { chave_copia_cola: `00020126580014br.gov.bcb.pix0136simulacao-pix-${novoPagamento.id_pagamento}` }
        : { codigo_barras: `34191.09008 63571.277308 71444.640008 1 ${novoPagamento.id_pagamento}00000000000` };

      res.status(201).json({
        message: `Aguardando pagamento via ${metodo}`,
        pagamento: novoPagamento,
        instrucoes: dadosSimulados
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async confirmarPixBoleto(req, res) {
    try {
      const { id } = req.params;

      const pagamentoAprovado = await pagamentoDAO.aprovarPagamento(id);

      res.status(200).json({
        message: 'Pagamento confirmado com sucesso!',
        pagamento: pagamentoAprovado
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PagamentoController();