const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Cliente', 'Administrador'), clienteController.getAll.bind(clienteController));
router.get('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.getById.bind(clienteController));
router.post('/', clienteController.create.bind(clienteController));
router.put('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.update.bind(clienteController));
router.delete('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.delete.bind(clienteController));

module.exports = router;