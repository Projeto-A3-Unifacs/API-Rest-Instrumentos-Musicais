const express = require('express');
const router = express.Router();
const carteiraController = require('../controllers/CarteiraController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Vendedor', 'Administrador'), carteiraController.getAll.bind(carteiraController));

router.get('/:id', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), carteiraController.getById.bind(carteiraController));

router.post('/', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), carteiraController.create.bind(carteiraController));


router.delete('/:id', authenticate, authorize('Vendedor', 'Administrador'), carteiraController.delete.bind(carteiraController));

module.exports = router;