const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos vendedores – só vendedores/admins podem listar
router.get('/', authenticate, authorize('Vendedor'), vendedorController.getAll.bind(vendedorController));

// GET vendedor por ID
router.get('/:id', authenticate, authorize('Vendedor'), vendedorController.getById.bind(vendedorController));

router.post('/', authenticate, authorize('Vendedor'), vendedorController.create.bind(vendedorController));

// PUT atualizar vendedor – só vendedores/admin
router.put('/:id', authenticate, authorize('Vendedor'), vendedorController.update.bind(vendedorController));

// DELETE vendedor – só vendedores/admin
router.delete('/:id', authenticate, authorize('Vendedor'), vendedorController.delete.bind(vendedorController));

module.exports = router;