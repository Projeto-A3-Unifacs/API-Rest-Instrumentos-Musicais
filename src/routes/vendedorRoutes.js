const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// GET todos os vendedores
router.get('/', usuarioController.getAll.bind(usuarioController));

// GET vendedor por ID
router.get('/:id', usuarioController.getById.bind(usuarioController));

// POST criar vendedor
router.post('/', usuarioController.create.bind(usuarioController));

// PUT atualizar vendedor
router.put('/:id', usuarioController.update.bind(usuarioController));

// DELETE remover vendedor
router.delete('/:id', usuarioController.delete.bind(usuarioController));

module.exports = router;