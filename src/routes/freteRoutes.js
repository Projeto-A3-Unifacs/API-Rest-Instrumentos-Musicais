const express = require('express');
const router = express.Router();
const freteController = require('../controllers/FreteController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, freteController.getAll.bind(freteController));
router.get('/:id', authenticate, freteController.getById.bind(freteController));
router.get('/pedido/:idPedido', authenticate, freteController.getByPedido.bind(freteController));
router.post('/simular', authenticate, freteController.simular.bind(freteController));
router.patch('/:id/status', authenticate, freteController.updateStatus.bind(freteController));

module.exports = router;