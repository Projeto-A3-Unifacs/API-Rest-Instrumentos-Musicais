const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorioController');

router.get(
  '/produtos-mais-vendidos',
  relatorioController.produtosMaisVendidos.bind(relatorioController)
);

router.get(
  '/produto-por-cliente',
  relatorioController.produtoPorCliente.bind(relatorioController)
);

router.get(
  '/consumo-medio-cliente',
  relatorioController.consumoMedioCliente.bind(relatorioController)
);

router.get(
  '/produtos-baixo-estoque',
  relatorioController.produtosBaixoEstoque.bind(relatorioController)
);

module.exports = router;
