const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// GET todos os produtos
router.get('/', produtoController.getAll.bind(produtoController));

// GET produto por ID
router.get('/:id', produtoController.getById.bind(produtoController));

// POST criar produto
router.post('/', produtoController.create.bind(produtoController));

// PUT atualizar produto
router.put('/:id', produtoController.update.bind(produtoController));

// DELETE remover produto
router.delete('/:id', produtoController.delete.bind(produtoController));

module.exports = router;