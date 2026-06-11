const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticate, authorize } = require('../middleware/auth');
/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get(
  '/',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  pedidoController.getAll.bind(pedidoController)
);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Cliente', 'Vendedor', 'Administrador'),
  pedidoController.getById.bind(pedidoController)
);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     description: Pode ser uma compra direta (id_produto + quantidade) ou uma compra usando os itens do carrinho.
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_endereco
 *             properties:
 *               id_endereco:
 *                 type: integer
 *                 example: 1
 *               id_produto:
 *                 type: integer
 *                 example: 5
 *               quantidade:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  authenticate,
  authorize('Cliente', 'Administrador'),
  pedidoController.create.bind(pedidoController)
);

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: EM_PROCESSAMENTO
 *               valor_total:
 *                 type: number
 *                 example: 250.00
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  pedidoController.update.bind(pedidoController)
);

/**
 * @swagger
 * /pedidos/{id}/cancelar:
 *   patch:
 *     summary: Cancela um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.patch(
  '/:id/cancelar',
  authenticate,
  authorize('Cliente', 'Administrador'),
  pedidoController.cancelar.bind(pedidoController)
);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  pedidoController.delete.bind(pedidoController)
);

module.exports = router;