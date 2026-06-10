const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos os produtos – clientes e vendedores podem acessar
router.get('/', authenticate, authorize('Cliente', 'Vendedor'), produtoController.getAll.bind(produtoController));

// GET produto por ID – clientes e vendedores podem acessar
router.get('/:id', authenticate, authorize('Cliente', 'Vendedor'), produtoController.getById.bind(produtoController));

// POST criar produto – apenas vendedores podem criar
router.post('/', authenticate, authorize('Vendedor'), produtoController.create.bind(produtoController));

// PUT atualizar produto – apenas vendedores podem atualizar
router.put('/:id', authenticate, authorize('Vendedor'), produtoController.update.bind(produtoController));

// DELETE remover produto – apenas vendedores podem deletar
router.delete('/:id', authenticate, authorize('Vendedor'), produtoController.delete.bind(produtoController));

module.exports = router;