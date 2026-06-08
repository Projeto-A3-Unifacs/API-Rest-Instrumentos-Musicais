const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// GET todos os pedidos
router.get('/', pedidoController.getAll.bind(pedidoController));

// GET pedido por ID
router.get('/:id', pedidoController.getById.bind(pedidoController));

// POST criar pedido / receber pedido de compra
router.post('/', pedidoController.create.bind(pedidoController));

// PUT atualizar pedido
router.put('/:id', pedidoController.update.bind(pedidoController));

// PATCH cancelar pedido de compra
router.patch('/:id/cancelar', pedidoController.cancelar.bind(pedidoController));

// DELETE remover pedido
router.delete('/:id', pedidoController.delete.bind(pedidoController));

module.exports = router;
