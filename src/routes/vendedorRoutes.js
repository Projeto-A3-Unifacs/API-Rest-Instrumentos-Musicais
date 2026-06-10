const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos vendedores – só vendedores/admins podem listar
router.get('/', authenticate, authorize('vendedor'), vendedorController.getAll.bind(vendedorController));

// GET vendedor por ID
router.get('/:id', authenticate, authorize('vendedor'), vendedorController.getById.bind(vendedorController));

// POST criar vendedor – só vendedores/admin
router.post('/', authenticate, authorize('vendedor'), vendedorController.create.bind(vendedorController));

// PUT atualizar vendedor – só vendedores/admin
router.put('/:id', authenticate, authorize('vendedor'), vendedorController.update.bind(vendedorController));

// DELETE vendedor – só vendedores/admin
router.delete('/:id', authenticate, authorize('vendedor'), vendedorController.delete.bind(vendedorController));

module.exports = router;