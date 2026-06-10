const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const { authenticate, authorize } = require('../middleware/auth');
/**
 * @swagger
 * /clientes:
 * get:
 * summary: Lista todos os clientes cadastrados
 * tags: [Clientes]
 * responses:
 * 200:
 * description: Lista de clientes recuperada com sucesso
 * 401:
 * description: Token não fornecido ou inválido
 * 403:
 * description: Acesso negado para este perfil
 */
router.get('/', clienteController.getAll.bind(clienteController));
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
 * example: "joao@email.com"
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
 * 400:
 * description: Erro de validação dos campos
 * 409:
 * description: Email ou CPF já cadastrados
 */
router.post('/', clienteController.create.bind(clienteController));
router.post('/', clienteController.create.bind(clienteController));
router.put('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.update.bind(clienteController));
router.delete('/:id', authenticate, authorize('Cliente', 'Administrador'), clienteController.delete.bind(clienteController));

module.exports = router;