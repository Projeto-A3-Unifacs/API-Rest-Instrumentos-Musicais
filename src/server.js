const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { authenticate } = require('./middleware/auth'); // middleware de autenticação

// Rotas
const vendedorRoutes = require('./routes/vendedorRoutes'); 
const produtoRoutes = require('./routes/produtoRoutes');   
const pedidoRoutes = require('./routes/pedidoRoutes');    
const afiliadoRoutes = require('./routes/afiliadoRoutes');
const afiliacaoProdutoRoutes = require('./routes/afiliacaoProdutoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const authRoutes = require('./routes/authRoutes'); // rota de login

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes); // login não precisa de token

// Rotas protegidas – todas exigem autenticação
app.use('/vendedores', authenticate, vendedorRoutes);
app.use('/produtos', authenticate, produtoRoutes);
app.use('/pedidos', authenticate, pedidoRoutes);
app.use('/afiliados', authenticate, afiliadoRoutes);
app.use('/afiliacoes-produto', authenticate, afiliacaoProdutoRoutes);
app.use('/relatorios', authenticate, relatorioRoutes);

// Iniciar servidor
async function startServer() {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

startServer();