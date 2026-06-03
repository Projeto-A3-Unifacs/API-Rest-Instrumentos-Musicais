const app = require('./app');
const createTables = require('./config/createTables');
const PORT = process.env.PORT || 3000;

async function startServer() {
  await createTables();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
}

startServer();