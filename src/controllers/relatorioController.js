const RelatorioDao = require('../dao/relatorioDao');

class RelatorioController {
  async produtosMaisVendidos(req, res) {
    try {
      const relatorio = await RelatorioDao.produtosMaisVendidos();
      res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório de produtos mais vendidos:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório de produtos mais vendidos'
      });
    }
  }

  async produtoPorCliente(req, res) {
    try {
      const relatorio = await RelatorioDao.produtoPorCliente();
      res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório de produto por cliente:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório de produto por cliente'
      });
    }
  }

  async consumoMedioCliente(req, res) {
    try {
      const relatorio = await RelatorioDao.consumoMedioCliente();
      res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório de consumo médio do cliente:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório de consumo médio do cliente'
      });
    }
  }

  async produtosBaixoEstoque(req, res) {
    try {
      const limite = req.query.limite ? Number(req.query.limite) : 5;
      const relatorio = await RelatorioDao.produtosBaixoEstoque(limite);

      res.status(200).json(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório de produtos com baixo estoque:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório de produtos com baixo estoque'
      });
    }
  }
}

module.exports = new RelatorioController();
