const express = require('express');
const router = express.Router();
const afiliadoController = require('../controllers/AfiliadoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos os afiliados – apenas vendedores podem listar
router.get('/', authenticate, authorize('Vendedor'), afiliadoController.getAll.bind(afiliadoController));

// GET afiliado por ID – clientes só podem acessar se for o próprio, vendedores todos
router.get('/:id', authenticate, authorize('Cliente','Vendedor'), afiliadoController.getById.bind(afiliadoController));

// POST criar afiliado – apenas clientes podem se tornar afiliados
router.post('/', authenticate, authorize('Cliente'), afiliadoController.create.bind(afiliadoController));

// PATCH aprovar/reprovar afiliado – apenas vendedores podem aprovar/reprovar
router.patch('/:id/status', authenticate, authorize('Vendedor'), afiliadoController.updateStatus.bind(afiliadoController));

// DELETE remover afiliado – apenas vendedores podem remover
router.delete('/:id', authenticate, authorize('Vendedor'), afiliadoController.delete.bind(afiliadoController));

module.exports = router;