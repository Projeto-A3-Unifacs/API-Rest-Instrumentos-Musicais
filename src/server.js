const express = require('express');
const cors = require('cors');



const vendedorRoutes = require('./routes/vendedorRoutes'); 
const produtoRoutes = require('./routes/produtoRoutes');   
const pedidoRoutes = require('./routes/pedidoRoutes');    
const afiliadoRoutes = require('./routes/afiliadoRoutes');
const afiliacaoProdutoRoutes = require('./routes/afiliacaoProdutoRoutes');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());


app.use('/vendedores', vendedorRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/afiliados', afiliadoRoutes);
app.use('/afiliacoes-produto', afiliacaoProdutoRoutes);
async function startServer() {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

startServer();