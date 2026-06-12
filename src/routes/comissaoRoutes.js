const express = require('express');
const router = express.Router();
const comissaoController = require('../controllers/ComissaoController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Vendedor', 'Administrador'), comissaoController.getAll.bind(comissaoController));

router.get('/:id', authenticate, authorize('Cliente','Vendedor', 'Administrador'), comissaoController.getById.bind(comissaoController));

router.post('/', authenticate, authorize('Vendedor', 'Administrador'), comissaoController.create.bind(comissaoController));

router.patch('/:id/status', authenticate, authorize('Vendedor', 'Administrador'), comissaoController.updateStatus.bind(comissaoController));

module.exports = router;