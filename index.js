const express = require('express');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const { globalErrorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = 1414;

app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(415).json({ status: 'erro', codigo: 415, mensagem: 'Cabecalho Content-Type invalido. Envie application/json.' });
  }
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', servico: 'API Controle de Estoque - SENAI', uptimeSegundos: Math.floor(process.uptime()) });
});

app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'erro', codigo: 404, mensagem: `A rota '${req.method} ${req.originalUrl}' nao existe na API.` });
});

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor blindado rodando na porta ${PORT} com persistencia em JSON`);
});
server.setTimeout(10000);
