const express = require('express');
const router = express.Router();

const clienteController =
  require('../controllers/ClienteController');

const {
  authenticate,
  authorize
} = require('../middleware/auth');

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 */
router.get(
  '/',
  authenticate,
  authorize('Cliente', 'Administrador'),
  clienteController.getAll.bind(clienteController)
);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Cliente', 'Administrador'),
  clienteController.getById.bind(clienteController)
);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cadastra um novo cliente
 *     tags:
 *       - Clientes
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               cpf:
 *                 type: string
 *                 example: 12345678900
 *               telefone:
 *                 type: string
 *                 example: 71999999999
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 */
router.post(
  '/',
  clienteController.create.bind(clienteController)
);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Cliente', 'Administrador'),
  clienteController.update.bind(clienteController)
);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Cliente', 'Administrador'),
  clienteController.delete.bind(clienteController)
);

module.exports = router;