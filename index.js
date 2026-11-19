const express = require('express');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const { globalErrorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = 1414;

process.on('uncaughtException', (err) => {
  console.error(`[PROTECAO UNCAUGHT ${new Date().toISOString()}]:`, err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error(`[PROTECAO REJECTION ${new Date().toISOString()}]:`, reason);
});

app.use(express.json({ limit: '100kb' }));

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(415).json({
      status: 'erro',
      codigo: 415,
      mensagem: 'Cabecalho Content-Type invalido. Envie os dados no formato application/json.'
    });
  }
  next();
});

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} -> ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    servico: 'API Controle de Estoque - Projeto Final SENAI',
    uptimeSegundos: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'erro',
    codigo: 404,
    mensagem: `A rota '${req.method} ${req.originalUrl}' nao existe na API.`
  });
});

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor blindado rodando na porta ${PORT} com persistencia em JSON`);
});

server.setTimeout(10000);
