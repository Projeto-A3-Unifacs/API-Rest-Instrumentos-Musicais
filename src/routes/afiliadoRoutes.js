const express = require('express');
const router = express.Router();
const afiliadoController = require('../controllers/AfiliadoController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Administrador'), afiliadoController.getAll.bind(afiliadoController));


router.get('/:id', authenticate, authorize('Cliente', 'Administrador'), afiliadoController.getById.bind(afiliadoController));


router.post('/', authenticate, authorize('Cliente', 'Administrador'), afiliadoController.create.bind(afiliadoController));


router.patch('/:id/status', authenticate, afiliadoController.updateStatus.bind(afiliadoController));

router.delete('/:id', authenticate, authorize('Administrador'), afiliadoController.delete.bind(afiliadoController));

module.exports = router;  