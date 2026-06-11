const express = require('express');
const cors = require('cors');
require('dotenv').config();

const relatorioRoutes = require('./routes/relatorioRoutes');

const PORT = process.env.REPORTS_PORT || process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    service: 'instrumentos-reports',
    status: 'online',
    description: 'Serviço responsável pela geração dos relatórios.'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'instrumentos-reports' });
});

app.use('/relatorios', relatorioRoutes);

app.listen(PORT, () => {
  console.log(`Serviço de relatórios rodando na porta ${PORT}`);
});
