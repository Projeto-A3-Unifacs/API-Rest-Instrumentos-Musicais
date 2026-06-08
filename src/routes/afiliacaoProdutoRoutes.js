const express = require('express');
const router = express.Router();
const afiliacaoProdutoController = require('../controllers/AfiliacaoProdutoController');

// GET todas as afiliações
router.get('/', afiliacaoProdutoController.getAll.bind(afiliacaoProdutoController));

// GET afiliação por ID
router.get('/:id', afiliacaoProdutoController.getById.bind(afiliacaoProdutoController));

// POST solicitar afiliação a produto
router.post('/', afiliacaoProdutoController.create.bind(afiliacaoProdutoController));

// PATCH aprovar/reprovar afiliação
router.patch('/:id/status', afiliacaoProdutoController.updateStatus.bind(afiliacaoProdutoController));

// DELETE remover afiliação
router.delete('/:id', afiliacaoProdutoController.delete.bind(afiliacaoProdutoController));

module.exports = router;