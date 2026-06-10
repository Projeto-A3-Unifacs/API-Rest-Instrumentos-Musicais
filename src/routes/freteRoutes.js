const express = require('express');
const router = express.Router();
const freteController = require('../controllers/FreteController');

router.get('/', freteController.getAll.bind(freteController));
router.get('/:id', freteController.getById.bind(freteController));
router.get('/pedido/:idPedido', freteController.getByPedido.bind(freteController));
router.post('/simular', freteController.simular.bind(freteController));
router.patch('/:id/status', freteController.updateStatus.bind(freteController));

module.exports = router;