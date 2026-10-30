const express = require('express');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');

const app = express();
const PORT = 1414;

app.use(express.json());

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
  res.status(404).json({ status: 'erro', mensagem: 'Rota nao encontrada na API.' });
});

// Tratamento de Erro de Servidor (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'erro', mensagem: 'Ocorreu um erro interno no servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});
