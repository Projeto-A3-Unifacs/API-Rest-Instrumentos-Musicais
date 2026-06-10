const pagamentoDAO = require('../dao/PagamentoDAO');
const pedidoDAO = require('../dao/pedidoDao');

class PagamentoController {
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