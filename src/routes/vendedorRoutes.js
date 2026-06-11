const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /vendedores:
 *   get:
 *     summary: Lista todos os vendedores
 *     tags:
 *       - Vendedores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vendedores retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/',
  authenticate,
  authorize('Administrador'),
  vendedorController.getAll.bind(vendedorController)
);

/**
 * @swagger
 * /vendedores/{id}:
 *   get:
 *     summary: Busca um vendedor pelo ID
 *     tags:
 *       - Vendedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vendedor
 *     responses:
 *       200:
 *         description: Vendedor encontrado
 *       404:
 *         description: Vendedor não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  vendedorController.getById.bind(vendedorController)
);

/**
 * @swagger
 * /vendedores:
 *   post:
 *     summary: Cadastra um novo vendedor
 *     tags:
 *       - Vendedores
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - cpf
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Oliveira
 *               email:
 *                 type: string
 *                 example: maria@email.com
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
 *                 example: 1990-05-15
 *     responses:
 *       201:
 *         description: Vendedor criado com sucesso
 *       409:
 *         description: Email ou CPF já cadastrado
 */
router.post(
  '/',
  vendedorController.create.bind(vendedorController)
);

/**
 * @swagger
 * /vendedores/{id}:
 *   put:
 *     summary: Atualiza um vendedor
 *     tags:
 *       - Vendedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vendedor
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
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Vendedor atualizado com sucesso
 *       404:
 *         description: Vendedor não encontrado
 *       409:
 *         description: Email ou CPF já cadastrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  vendedorController.update.bind(vendedorController)
);

/**
 * @swagger
 * /vendedores/{id}:
 *   delete:
 *     summary: Remove um vendedor
 *     tags:
 *       - Vendedores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vendedor
 *     responses:
 *       204:
 *         description: Vendedor removido com sucesso
 *       404:
 *         description: Vendedor não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  vendedorController.delete.bind(vendedorController)
);

module.exports = router;