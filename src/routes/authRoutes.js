const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

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
router.post('/login', login);


module.exports = router;