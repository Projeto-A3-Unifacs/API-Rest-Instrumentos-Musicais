const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/EnderecoController');
const { authenticate, authorize } = require('../middleware/auth');


router.get('/', authenticate, authorize('Vendedor'), enderecoController.getAll.bind(enderecoController));


router.get('/usuario/:idUsuario', authenticate, authorize('Cliente','Vendedor'), enderecoController.getByUsuario.bind(enderecoController));


router.get('/:id', authenticate, authorize('Cliente','Vendedor'), enderecoController.getById.bind(enderecoController));

router.post('/', authenticate, authorize('Cliente'), enderecoController.create.bind(enderecoController));

router.put('/:id', authenticate, authorize('Cliente'), enderecoController.update.bind(enderecoController));

router.delete('/:id', authenticate, authorize('Vendedor'), enderecoController.delete.bind(enderecoController));

module.exports = router;