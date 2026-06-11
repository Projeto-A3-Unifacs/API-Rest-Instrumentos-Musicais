const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /relatorios/produtos-mais-vendidos:
 *   get:
 *     summary: Relatório de produtos mais vendidos
 *     description: Retorna os produtos ordenados pela quantidade vendida.
 *     tags:
 *       - Relatórios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/produtos-mais-vendidos',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  relatorioController.produtosMaisVendidos.bind(relatorioController)
);

/**
 * @swagger
 * /relatorios/produto-por-cliente:
 *   get:
 *     summary: Relatório de produtos comprados por cliente
 *     description: Exibe quais produtos foram adquiridos por cada cliente.
 *     tags:
 *       - Relatórios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/produto-por-cliente',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  relatorioController.produtoPorCliente.bind(relatorioController)
);

/**
 * @swagger
 * /relatorios/consumo-medio-cliente:
 *   get:
 *     summary: Relatório de consumo médio por cliente
 *     description: Calcula o valor médio gasto por cada cliente nos pedidos realizados.
 *     tags:
 *       - Relatórios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/consumo-medio-cliente',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  relatorioController.consumoMedioCliente.bind(relatorioController)
);

/**
 * @swagger
 * /relatorios/produtos-baixo-estoque:
 *   get:
 *     summary: Relatório de produtos com baixo estoque
 *     description: Lista os produtos cujo estoque está abaixo do limite informado.
 *     tags:
 *       - Relatórios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Quantidade mínima de estoque para o alerta
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/produtos-baixo-estoque',
  authenticate,
  authorize('Vendedor', 'Administrador'),
  relatorioController.produtosBaixoEstoque.bind(relatorioController)
);

module.exports = router;