const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { authenticate, authorize } = require('../middleware/auth');

// Relatórios de produtos – apenas vendedores
router.get('/produtos-mais-vendidos', authenticate, authorize('vendedor'), relatorioController.produtosMaisVendidos.bind(relatorioController));

router.get('/produto-por-cliente', authenticate, authorize('vendedor'), relatorioController.produtoPorCliente.bind(relatorioController));

router.get('/consumo-medio-cliente', authenticate, authorize('vendedor'), relatorioController.consumoMedioCliente.bind(relatorioController));

router.get('/produtos-baixo-estoque', authenticate, authorize('vendedor'), relatorioController.produtosBaixoEstoque.bind(relatorioController));

module.exports = router;