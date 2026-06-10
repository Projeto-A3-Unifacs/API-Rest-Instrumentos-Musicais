const express = require('express');
const router = express.Router();
const saqueController = require('../controllers/SaqueController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos os saques – apenas vendedores
router.get('/', authenticate, authorize('vendedor'), saqueController.getAll.bind(saqueController));

// GET saque por ID – clientes acessam apenas o próprio, vendedores qualquer
router.get('/:id', authenticate, authorize('cliente','vendedor'), saqueController.getById.bind(saqueController));

// POST criar saque – apenas clientes
router.post('/', authenticate, authorize('cliente'), saqueController.create.bind(saqueController));

// PATCH aprovar/reprovar saque – apenas vendedores
router.patch('/:id/status', authenticate, authorize('vendedor'), saqueController.updateStatus.bind(saqueController));

module.exports = router;