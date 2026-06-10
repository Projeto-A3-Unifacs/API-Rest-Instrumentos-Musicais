const express = require('express');
const router = express.Router();
const carteiraController = require('../controllers/CarteiraController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todas as carteiras – apenas vendedores podem listar todas
router.get('/', authenticate, authorize('Vendedor'), carteiraController.getAll.bind(carteiraController));

// GET carteira por ID – clientes podem acessar apenas sua própria, vendedores qualquer
router.get('/:id', authenticate, authorize('Cliente', 'Vendedor'), carteiraController.getById.bind(carteiraController));

// POST criar carteira – apenas clientes podem criar a sua
router.post('/', authenticate, authorize('Cliente'), carteiraController.create.bind(carteiraController));

// DELETE carteira – apenas vendedores podem remover
router.delete('/:id', authenticate, authorize('Vendedor'), carteiraController.delete.bind(carteiraController));

module.exports = router;