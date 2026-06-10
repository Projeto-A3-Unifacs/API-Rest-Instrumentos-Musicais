const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize( 'Administrador'), vendedorController.getAll.bind(vendedorController));


router.get('/:id', authenticate, authorize('Vendedor', 'Administrador'), vendedorController.getById.bind(vendedorController));

router.post('/', authenticate, authorize( 'Administrador'), vendedorController.create.bind(vendedorController));

router.put('/:id', authenticate, authorize('Vendedor', 'Administrador'), vendedorController.update.bind(vendedorController));

router.delete('/:id', authenticate, authorize('Vendedor', 'Administrador'), vendedorController.delete.bind(vendedorController));

module.exports = router;