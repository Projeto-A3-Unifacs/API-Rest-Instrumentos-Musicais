const express = require('express');
const router = express.Router();
const afiliacaoProdutoController = require('../controllers/AfiliacaoProdutoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todas as afiliações – apenas vendedores podem listar
router.get('/', authenticate, authorize('Vendedor'), afiliacaoProdutoController.getAll.bind(afiliacaoProdutoController));

// GET afiliação por ID – clientes só podem acessar suas próprias afiliações se forem afiliados
router.get('/:id', authenticate, authorize('Cliente', 'Vendedor'), afiliacaoProdutoController.getById.bind(afiliacaoProdutoController));

// POST solicitar afiliação a produto – apenas clientes não afiliados podem solicitar
router.post('/', authenticate, authorize('Cliente'), afiliacaoProdutoController.create.bind(afiliacaoProdutoController));

// PATCH aprovar/reprovar afiliação – apenas vendedores podem aprovar/reprovar
router.patch('/:id/status', authenticate, authorize('Vendedor'), afiliacaoProdutoController.updateStatus.bind(afiliacaoProdutoController));

// DELETE remover afiliação – apenas vendedores podem remover
router.delete('/:id', authenticate, authorize('Vendedor'), afiliacaoProdutoController.delete.bind(afiliacaoProdutoController));

module.exports = router;