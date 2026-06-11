const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_empresa
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtra os produtos de uma empresa específica
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.get(
  '/',
  authenticate,
  authorize('Cliente', 'Vendedor', 'Administrador'),
  produtoController.getAll.bind(produtoController)
);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Cliente', 'Vendedor', 'Administrador'),
  produtoController.getById.bind(produtoController)
);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - estoque
 *               - id_categoria
 *               - id_empresa
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Guitarra Fender Stratocaster
 *               descricao:
 *                 type: string
 *                 example: Guitarra elétrica clássica da Fender
 *               preco:
 *                 type: number
 *                 example: 4500.00
 *               estoque:
 *                 type: integer
 *                 example: 10
 *               marca:
 *                 type: string
 *                 example: Fender
 *               modelo:
 *                 type: string
 *                 example: Stratocaster
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               id_empresa:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post(
  '/',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  produtoController.create.bind(produtoController)
);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               estoque:
 *                 type: integer
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *               id_empresa:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  produtoController.update.bind(produtoController)
);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 *       409:
 *         description: Produto vinculado a pedidos ou carrinhos
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  produtoController.delete.bind(produtoController)
);

module.exports = router;