const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('Cliente', 'Administrador'), clienteController.getAll.bind(clienteController));
router.get('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.getById.bind(clienteController));
/**
 * @swagger
 * /clientes:
 * post:
 * summary: Cadastra um novo cliente no sistema
 * tags: [Clientes]
 * security: [] 
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome:
 * type: string
 * example: "João Silva"
 * email:
 * type: string
 * example: "joao_teste@email.com"
 * senha:
 * type: string
 * example: "123456"
 * cpf:
 * type: string
 * example: "111.222.333-44"
 * telefone:
 * type: string
 * example: "71999999999"
 * data_nascimento:
 * type: string
 * format: date
 * example: "1995-05-20"
 * responses:
 * 201:
 * description: Cliente cadastrado com sucesso
 */
router.post('/', clienteController.create.bind(clienteController));
router.put('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.update.bind(clienteController));
router.delete('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.delete.bind(clienteController));

module.exports = router;