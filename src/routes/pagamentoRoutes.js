const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('Cliente', 'Administrador'), pagamentoController.processar.bind(pagamentoController));
router.post('/:id/confirmar', authenticate, authorize('Vendedor', 'Administrador'), pagamentoController.confirmarPixBoleto.bind(pagamentoController));

module.exports = router;