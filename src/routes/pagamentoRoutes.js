const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('Cliente', 'Administrador'), pagamentoController.processar.bind(pagamentoController));
router.post('/:id/confirmar', authenticate, authorize('Vendedor', 'Administrador'), pagamentoController.confirmarPixBoleto.bind(pagamentoController));
router.get('/', authenticate, pagamentoController.getAll.bind(pagamentoController));
router.get('/:id', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), pagamentoController.getById.bind(pagamentoController));
router.get('/pedido/:idPedido', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), pagamentoController.getByPedido.bind(pagamentoController));
module.exports = router;