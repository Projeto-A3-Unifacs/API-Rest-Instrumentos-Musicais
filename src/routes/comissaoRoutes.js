const express = require('express');
const router = express.Router();
const comissaoController = require('../controllers/ComissaoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todas as comissões – apenas vendedores
router.get('/', authenticate, authorize('vendedor'), comissaoController.getAll.bind(comissaoController));

// GET comissão por ID – apenas vendedores
router.get('/:id', authenticate, authorize('vendedor'), comissaoController.getById.bind(comissaoController));

// POST criar comissão – apenas vendedores
router.post('/', authenticate, authorize('vendedor'), comissaoController.create.bind(comissaoController));

// PATCH aprovar/reprovar comissão – apenas vendedores
router.patch('/:id/status', authenticate, authorize('vendedor'), comissaoController.updateStatus.bind(comissaoController));

module.exports = router;