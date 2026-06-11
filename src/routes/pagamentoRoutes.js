const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/PagamentoController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Processa um pagamento
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pedido
 *               - metodo
 *             properties:
 *               id_pedido:
 *                 type: integer
 *                 example: 1
 *               metodo:
 *                 type: string
 *                 enum:
 *                   - CARTAO
 *                   - PIX
 *                   - BOLETO
 *                 example: PIX
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Método inválido ou pedido já processado
 *       404:
 *         description: Pedido não encontrado
 */
router.post(
  '/',
  authenticate,
  authorize('Cliente', 'Administrador'),
  pagamentoController.processar.bind(pagamentoController)
);

/**
 * @swagger
 * /pagamentos/{id}/confirmar:
 *   post:
 *     summary: Confirma um pagamento PIX ou BOLETO
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento confirmado com sucesso
 *       400:
 *         description: Erro ao confirmar pagamento
 */
router.post(
  '/:id/confirmar',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  pagamentoController.confirmarPixBoleto.bind(pagamentoController)
);

/**
 * @swagger
 * /pagamentos:
 *   get:
 *     summary: Lista pagamentos
 *     description: Clientes visualizam apenas seus pagamentos. Vendedores e administradores podem filtrar por usuário.
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtra pagamentos por usuário
 *     responses:
 *       200:
 *         description: Lista de pagamentos retornada com sucesso
 */
router.get(
  '/',
  authenticate,
  pagamentoController.getAll.bind(pagamentoController)
);

/**
 * @swagger
 * /pagamentos/{id}:
 *   get:
 *     summary: Busca um pagamento pelo ID
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *       404:
 *         description: Pagamento não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Cliente', 'Vendedor', 'Administrador'),
  pagamentoController.getById.bind(pagamentoController)
);

/**
 * @swagger
 * /pagamentos/pedido/{idPedido}:
 *   get:
 *     summary: Lista os pagamentos de um pedido
 *     tags:
 *       - Pagamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Histórico de pagamentos retornado com sucesso
 *       400:
 *         description: ID do pedido inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.get(
  '/pedido/:idPedido',
  authenticate,
  authorize('Cliente', 'Vendedor', 'Administrador'),
  pagamentoController.getByPedido.bind(pagamentoController)
);
module.exports = router;