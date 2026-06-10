const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { authenticate, authorize } = require('../middleware/auth');

// Relatórios de produtos – apenas vendedores
router.get('/produtos-mais-vendidos', authenticate, authorize('Vendedor'), relatorioController.produtosMaisVendidos.bind(relatorioController));

router.get('/produto-por-cliente', authenticate, authorize('Vendedor'), relatorioController.produtoPorCliente.bind(relatorioController));

router.get('/consumo-medio-cliente', authenticate, authorize('Vendedor'), relatorioController.consumoMedioCliente.bind(relatorioController));

router.get('/produtos-baixo-estoque', authenticate, authorize('Vendedor'), relatorioController.produtosBaixoEstoque.bind(relatorioController));

module.exports = router;