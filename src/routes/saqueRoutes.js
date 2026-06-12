const express = require('express');
const router = express.Router();
const saqueController = require('../controllers/SaqueController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Vendedor', 'Administrador'), saqueController.getAll.bind(saqueController));


router.get('/:id', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), saqueController.getById.bind(saqueController));

router.post('/', authenticate, authorize('Cliente', 'Administrador', 'Vendedor'), saqueController.create.bind(saqueController));


router.patch('/:id/status', authenticate, authorize('Vendedor', 'Administrador'), saqueController.updateStatus.bind(saqueController));

module.exports = router;