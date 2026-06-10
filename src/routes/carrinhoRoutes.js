const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/CarrinhoController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Cliente'), carrinhoController.obterMeuCarrinho.bind(carrinhoController));
router.post('/itens', authenticate, authorize('Cliente'), carrinhoController.adicionarItem.bind(carrinhoController));
router.delete('/itens/:id_item', authenticate, authorize('Cliente'), carrinhoController.removerItem.bind(carrinhoController));
router.delete('/', authenticate, authorize('Cliente'), carrinhoController.limparCarrinho.bind(carrinhoController));

module.exports = router;