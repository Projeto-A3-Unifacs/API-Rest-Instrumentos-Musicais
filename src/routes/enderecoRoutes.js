const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/EnderecoController');
const { authenticate, authorize } = require('../middleware/auth');
/**
 * @swagger
 * /endereco:
 *   get:
 *     summary: Lista todos os endereços
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get(
  '/',
  authenticate,
  authorize('Vendedor'),
  enderecoController.getAll.bind(enderecoController)
);

/**
 * @swagger
 * /endereco/usuario/{idUsuario}:
 *   get:
 *     summary: Lista os endereços de um usuário
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Endereços encontrados
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  '/usuario/:idUsuario',
  authenticate,
  authorize('Cliente', 'Vendedor'),
  enderecoController.getByUsuario.bind(enderecoController)
);

/**
 * @swagger
 * /endereco/{id}:
 *   get:
 *     summary: Busca um endereço pelo ID
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *       404:
 *         description: Endereço não encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize('Cliente', 'Vendedor'),
  enderecoController.getById.bind(enderecoController)
);

/**
 * @swagger
 * /endereco:
 *   post:
 *     summary: Cadastra um novo endereço para o usuário logado
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cep
 *               - rua
 *               - numero
 *               - bairro
 *               - cidade
 *               - estado
 *             properties:
 *               cep:
 *                 type: string
 *                 example: "41830-020"
 *               rua:
 *                 type: string
 *                 example: "Rua das Flores"
 *               numero:
 *                 type: string
 *                 example: "123"
 *               complemento:
 *                 type: string
 *                 example: "Apartamento 302"
 *               bairro:
 *                 type: string
 *                 example: "Pituba"
 *               cidade:
 *                 type: string
 *                 example: "Salvador"
 *               estado:
 *                 type: string
 *                 example: "BA"
 *     responses:
 *       201:
 *         description: Endereço cadastrado com sucesso
 */
router.post(
  '/',
  authenticate,
  authorize('Cliente'),
  enderecoController.create.bind(enderecoController)
);

/**
 * @swagger
 * /endereco/{id}:
 *   put:
 *     summary: Atualiza um endereço
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cep:
 *                 type: string
 *               rua:
 *                 type: string
 *               numero:
 *                 type: string
 *               complemento:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       404:
 *         description: Endereço não encontrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Cliente'),
  enderecoController.update.bind(enderecoController)
);

/**
 * @swagger
 * /endereco/{id}:
 *   delete:
 *     summary: Remove um endereço
 *     tags:
 *       - Endereços
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso
 *       404:
 *         description: Endereço não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('Vendedor'),
  enderecoController.delete.bind(enderecoController)
);

module.exports = router;