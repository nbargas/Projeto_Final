const express = require('express');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const { globalErrorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = 1414;

// Protecao contra encerramento abrupto do processo Node.js
process.on('uncaughtException', (err) => {
  console.error(`[PROTECAO UNCAUGHT ${new Date().toISOString()}]:`, err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error(`[PROTECAO REJECTION ${new Date().toISOString()}]:`, reason);
});

// Limite de payload para evitar travamento por excesso de dados
app.use(express.json({ limit: '100kb' }));

// Valida Content-Type em requisicoes POST e PUT
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && !req.is('application/json')) {
    return res.status(415).json({
      status: 'erro',
      codigo: 415,
      mensagem: 'Cabecalho Content-Type invalido. Envie os dados no formato application/json.'
    });
  }
  next();
});

// Middleware de Logs de requisicao
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} -> ${req.url}`);
  next();
});

// Rotas
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);

// Tratamento de Rota Inexistente (404)
app.use((req, res) => {
  res.status(404).json({
    status: 'erro',
    codigo: 404,
    mensagem: `A rota '${req.method} ${req.originalUrl}' nao existe na API.`
  });
});

// Tratamento Centralizado de Erros (400 / 413 / 500)
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor blindado rodando na porta ${PORT}`);
});

// Timeout de seguranca para evitar conexoes travadas
server.setTimeout(10000);
