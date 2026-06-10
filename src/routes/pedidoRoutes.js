const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos os pedidos – apenas vendedores podem acessar
router.get('/', authenticate, authorize('Vendedor'), pedidoController.getAll.bind(pedidoController));

// GET pedido por ID – clientes podem ver seus próprios pedidos, vendedores todos
router.get('/:id', authenticate, authorize('Cliente', 'Vendedor'), pedidoController.getById.bind(pedidoController));

// POST criar pedido / receber pedido de compra – apenas clientes podem criar
router.post('/', authenticate, authorize('Cliente'), pedidoController.create.bind(pedidoController));

// PUT atualizar pedido – apenas vendedores podem atualizar
router.put('/:id', authenticate, authorize('Vendedor'), pedidoController.update.bind(pedidoController));

// PATCH cancelar pedido de compra – clientes podem cancelar os próprios pedidos
router.patch('/:id/cancelar', authenticate, authorize('Cliente'), pedidoController.cancelar.bind(pedidoController));

// DELETE remover pedido – apenas vendedores podem deletar
router.delete('/:id', authenticate, authorize('Vendedor'), pedidoController.delete.bind(pedidoController));

module.exports = router;