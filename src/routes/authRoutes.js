const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login e retorna o Token JWT
 *     tags:
 *       - Autenticação
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@email.com"
 *               senha:
 *                 type: string
 *                 example: "senha_segura_123"
 *     responses:
 *       200:
 *         description: Sucesso. Retorna o token.
 */
router.post('/login', authController.login.bind(authController));
/**
 * @swagger
 * /api/auth/esqueci-senha:
 *   post:
 *     summary: Solicita recuperação de senha
 *     description: Gera um código de recuperação e envia para o e-mail do usuário (simulado no console).
 *     tags:
 *       - Autenticação
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "cliente@email.com"
 *     responses:
 *       200:
 *         description: Solicitação processada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/esqueci-senha',
  authController.esqueciSenha.bind(authController)
);

/**
 * @swagger
 * /api/auth/resetar-senha:
 *   post:
 *     summary: Redefine a senha utilizando o código de recuperação
 *     tags:
 *       - Autenticação
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - novaSenha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "cliente@email.com"
 *               token:
 *                 type: string
 *                 example: "a1b2c3"
 *               novaSenha:
 *                 type: string
 *                 example: "NovaSenha@123"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Código inválido, expirado ou dados incorretos
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/resetar-senha',
  authController.resetarSenha.bind(authController)
);

module.exports = router;