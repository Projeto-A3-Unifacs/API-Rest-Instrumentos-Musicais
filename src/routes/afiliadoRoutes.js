const express = require('express');
const router = express.Router();
const afiliadoController = require('../controllers/AfiliadoController');

// GET todos os afiliados
router.get('/', afiliadoController.getAll.bind(afiliadoController));

// GET afiliado por ID
router.get('/:id', afiliadoController.getById.bind(afiliadoController));

// POST criar afiliado
router.post('/', afiliadoController.create.bind(afiliadoController));

// PATCH aprovar/reprovar afiliado
router.patch('/:id/status', afiliadoController.updateStatus.bind(afiliadoController));

// DELETE remover afiliado
router.delete('/:id', afiliadoController.delete.bind(afiliadoController));

module.exports = router;