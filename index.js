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

// [FLUXO] Endpoint analitico ETL: extrai produtos, agrega metricas e retorna dataset estruturado
app.get('/api/v1/analytics', (req, res) => {
  const { lerBanco } = require('./src/data/db');
  const db = lerBanco();
  const produtos = db.produtos || [];
  const categorias = db.categorias || [];

  // [TRANSF] Cruzamento relacional, calculo de patrimonio e classificacao de risco
  const dataset = produtos.map(p => {
    const cat = categorias.find(c => c.id === p.categoriaId);
    return {
      id: p.id,
      produto: p.nome.toUpperCase(),
      categoria: cat ? cat.nome.toUpperCase() : "SEM CATEGORIA",
      precoUnitario: p.preco,
      quantidade: p.quantidade,
      valorTotalEstoque: Number((p.preco * p.quantidade).toFixed(2)),
      statusEstoque: p.quantidade <= 10 ? "CRITICO" : "NORMAL"
    };
  });

  const patrimonioTotal = dataset.reduce((acc, item) => acc + item.valorTotalEstoque, 0);
  const totalCriticos = dataset.filter(item => item.statusEstoque === "CRITICO").length;

  res.status(200).json({
    geradoEm: new Date().toISOString(),
    resumoAnalitico: {
      totalProdutos: dataset.length,
      patrimonioTotal: Number(patrimonioTotal.toFixed(2)),
      itensCriticos: totalCriticos,
      itensSaudaveis: dataset.length - totalCriticos
    },
    dataset
  });
});

// [FLUXO] Endpoint oficial do Desafio Bonus: Dashboard consolidado de estoque
app.get('/api/v1/dashboard', (req, res) => {
  const { lerBanco } = require('./src/data/db');
  const db = lerBanco();
  const produtos = db.produtos || [];
  const categorias = db.categorias || [];

  // [TRANSF] Agregacao de metricas por categoria e ranking de estoque
  const porCategoria = categorias.map(c => {
    const itens = produtos.filter(p => p.categoriaId === c.id);
    const totalUnidades = itens.reduce((s, p) => s + p.quantidade, 0);
    const valorPatrimonio = itens.reduce((s, p) => s + (p.preco * p.quantidade), 0);
    return {
      categoria: c.nome,
      qtdProdutos: itens.length,
      totalUnidades,
      valorPatrimonio: Number(valorPatrimonio.toFixed(2))
    };
  });

  const criticos = produtos.filter(p => p.quantidade <= 10).map(p => ({
    id: p.id,
    nome: p.nome,
    quantidade: p.quantidade
  }));

  res.status(200).json({
    projeto: "API Controle de Estoque — SENAI",
    servidor: "Genesis (10.85.198.243:1414)",
    timestamp: new Date().toISOString(),
    kpis: {
      totalProdutos: produtos.length,
      totalCategorias: categorias.length,
      unidadesEmEstoque: produtos.reduce((s, p) => s + p.quantidade, 0),
      patrimonioTotal: Number(produtos.reduce((s, p) => s + (p.preco * p.quantidade), 0).toFixed(2)),
      alertasCriticos: criticos.length
    },
    porCategoria,
    alertasEstoqueCritico: criticos
  });
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
