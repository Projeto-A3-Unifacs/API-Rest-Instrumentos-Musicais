const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/EmpresaController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Administrador', 'Vendedor'), empresaController.getAll.bind(empresaController));
router.get('/:id', authenticate, authorize('Administrador', 'Vendedor'), empresaController.getById.bind(empresaController));
router.post('/', authenticate, authorize('Administrador', 'Vendedor'), empresaController.create.bind(empresaController));
router.put('/:id', authenticate, authorize('Administrador', 'Vendedor'), empresaController.update.bind(empresaController));
router.delete('/:id', authenticate, authorize('Administrador', 'Vendedor'), empresaController.delete.bind(empresaController));

module.exports = router;