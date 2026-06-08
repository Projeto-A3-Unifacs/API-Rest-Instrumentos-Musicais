const express = require('express');
const cors = require('cors');

const createTables = require('./config/createTables');

// Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes'); // usa UsuarioDao
const produtoRoutes = require('./routes/produtoRoutes');   // usa ProdutoDao
const pedidoRoutes = require('./routes/pedidoRoutes');     // usa PedidoDao

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Montando as rotas
app.use('/clientes', clienteRoutes);
app.use('/vendedores', vendedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

async function startServer() {
  await createTables(); // garante que tabelas existem
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

startServer();