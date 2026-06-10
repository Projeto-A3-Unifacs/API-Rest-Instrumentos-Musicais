const RelatorioDao = require('../dao/relatorioDao');

class RelatorioController {
  // GET produtos mais vendidos – apenas vendedores
  async produtosMaisVendidos(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const relatorio = await RelatorioDao.produtosMaisVendidos();
      res.status(200).json(relatorio);

    } catch (error) {
      console.error('Erro ao gerar relatório de produtos mais vendidos:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de produtos mais vendidos' });
    }
  }

  // GET produto por cliente – apenas vendedores
  async produtoPorCliente(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const relatorio = await RelatorioDao.produtoPorCliente();
      res.status(200).json(relatorio);

    } catch (error) {
      console.error('Erro ao gerar relatório de produto por cliente:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de produto por cliente' });
    }
  }

  // GET consumo médio do cliente – apenas vendedores
  async consumoMedioCliente(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const relatorio = await RelatorioDao.consumoMedioCliente();
      res.status(200).json(relatorio);

    } catch (error) {
      console.error('Erro ao gerar relatório de consumo médio do cliente:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de consumo médio do cliente' });
    }
  }

  // GET produtos com baixo estoque – apenas vendedores
  async produtosBaixoEstoque(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const limite = req.query.limite ? Number(req.query.limite) : 5;
      const relatorio = await RelatorioDao.produtosBaixoEstoque(limite);

      res.status(200).json(relatorio);

    } catch (error) {
      console.error('Erro ao gerar relatório de produtos com baixo estoque:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de produtos com baixo estoque' });
    }
  }
}

module.exports = new RelatorioController();