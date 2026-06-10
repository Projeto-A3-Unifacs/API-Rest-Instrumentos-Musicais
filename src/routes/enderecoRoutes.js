const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/EnderecoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET todos os endereços – apenas vendedores
router.get('/', authenticate, authorize('vendedor'), enderecoController.getAll.bind(enderecoController));

// GET endereços de um usuário específico – cliente vê só o próprio, vendedor qualquer
router.get('/usuario/:idUsuario', authenticate, authorize('cliente','vendedor'), enderecoController.getByUsuario.bind(enderecoController));

// GET endereço por ID – cliente só acessa o próprio, vendedor qualquer
router.get('/:id', authenticate, authorize('cliente','vendedor'), enderecoController.getById.bind(enderecoController));

// POST criar endereço – apenas clientes podem criar para si
router.post('/', authenticate, authorize('cliente'), enderecoController.create.bind(enderecoController));

// PUT atualizar endereço – apenas clientes podem atualizar seus próprios endereços
router.put('/:id', authenticate, authorize('cliente'), enderecoController.update.bind(enderecoController));

// DELETE endereço – apenas vendedores podem deletar qualquer endereço
router.delete('/:id', authenticate, authorize('vendedor'), enderecoController.delete.bind(enderecoController));

module.exports = router;