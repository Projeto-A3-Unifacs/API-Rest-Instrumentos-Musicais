const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { authenticate } = require('./middleware/auth');

// Rotas
const authRoutes = require('./routes/authRoutes'); // login público
const vendedorRoutes = require('./routes/vendedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const afiliadoRoutes = require('./routes/afiliadoRoutes');
const afiliacaoProdutoRoutes = require('./routes/afiliacaoProdutoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const carteiraRoutes = require('./routes/carteiraRoutes');
const comissaoRoutes = require('./routes/comissaoRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const saqueRoutes = require('./routes/saqueRoutes');
const freteRoutes = require('./routes/freteRoutes');
const clienteRoutes= require('./routes/clienteRoutes');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes); 

// Rotas protegidas – todas exigem autenticação JWT
app.use('/vendedores', authenticate, vendedorRoutes);
app.use('/clientes', clienteRoutes)
app.use('/produtos', authenticate, produtoRoutes);
app.use('/pedidos', authenticate, pedidoRoutes);
app.use('/afiliados', authenticate, afiliadoRoutes);
app.use('/afiliacoes-produto', authenticate, afiliacaoProdutoRoutes);
app.use('/relatorios', authenticate, relatorioRoutes);
app.use('/carteira', authenticate, carteiraRoutes);
app.use('/comissao', authenticate, comissaoRoutes);
app.use('/endereco', authenticate, enderecoRoutes);
app.use('/saque', authenticate, saqueRoutes);
app.use('/fretes', freteRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));