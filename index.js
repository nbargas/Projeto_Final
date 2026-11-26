const path = require('path');
const express = require('express');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const { globalErrorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = 1414;

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use(express.json({ limit: '100kb' }));

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    return res.status(415).json({ status: 'erro', codigo: 415, mensagem: 'Cabecalho Content-Type invalido. Envie application/json.' });
  }
  next();
});

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.url}`);
  next();
});

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', servico: 'API Controle de Estoque - SENAI', uptimeSegundos: Math.floor(process.uptime()) });
});

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
// [FLUXO] Entrega a View HTML com graficos interativos de controle de estoque
app.get('/grafico', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'grafico.html'));
});

app.use('/categorias', categoriaRoutes);
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use('/produtos', produtoRoutes);

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use((req, res) => {
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  res.status(404).json({ status: 'erro', codigo: 404, mensagem: `A rota '${req.method} ${req.originalUrl}' nao existe na API.` });
});

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
app.use(globalErrorHandler);

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
const server = app.listen(PORT, () => {
  console.log(`Servidor blindado rodando na porta ${PORT} com persistencia em JSON`);
});
server.setTimeout(10000);
