const express = require('express');
const router = express.Router();
const afiliacaoProdutoController = require('../controllers/AfiliacaoProdutoController');
const { authenticate, authorize } = require('../middleware/auth');


router.get('/', authenticate, authorize('Vendedor', 'Administrador'), afiliacaoProdutoController.getAll.bind(afiliacaoProdutoController));


router.get('/:id', authenticate, authorize('Cliente', 'Vendedor', 'Administrador'), afiliacaoProdutoController.getById.bind(afiliacaoProdutoController));


router.post('/', authenticate, authorize('Cliente', 'Administrador'), afiliacaoProdutoController.create.bind(afiliacaoProdutoController));

router.patch('/:id/status', authenticate, authorize('Vendedor', 'Administrador'), afiliacaoProdutoController.updateStatus.bind(afiliacaoProdutoController));


router.delete('/:id', authenticate, authorize('Vendedor', 'Administrador'), afiliacaoProdutoController.delete.bind(afiliacaoProdutoController));

module.exports = router;