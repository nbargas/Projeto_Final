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

// [FLUXO] Endpoint oficial do Desafio Bonus: Dashboard visual HTML e JSON
app.get('/api/v1/dashboard', (req, res) => {
  const { lerBanco } = require('./src/data/db');
  const db = lerBanco();
  const produtos = db.produtos || [];
  const categorias = db.categorias || [];

  // [TRANSF] Calcula metricas, patrimonio por categoria e itens criticos
  const porCategoria = categorias.map(c => {
    const itens = produtos.filter(p => p.categoriaId === c.id);
    return {
      categoria: c.nome,
      qtdProdutos: itens.length,
      totalUnidades: itens.reduce((s, p) => s + p.quantidade, 0),
      valorPatrimonio: Number(itens.reduce((s, p) => s + (p.preco * p.quantidade), 0).toFixed(2))
    };
  });

  const payload = {
    projeto: "API Controle de Estoque — SENAI",
    servidor: "Genesis (10.85.198.243:1414)",
    kpis: {
      totalProdutos: produtos.length,
      unidadesEmEstoque: produtos.reduce((s, p) => s + p.quantidade, 0),
      patrimonioTotal: Number(produtos.reduce((s, p) => s + (p.preco * p.quantidade), 0).toFixed(2)),
      alertasCriticos: produtos.filter(p => p.quantidade <= 10).length
    },
    porCategoria,
    produtos
  };

  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(200).json(payload);
  }

  const maxQtd = Math.max(...produtos.map(p => p.quantidade), 1);
  const barrasProdutos = produtos.map(p => {
    const pct = Math.round((p.quantidade / maxQtd) * 100);
    const cor = p.quantidade <= 10 ? "#ef4444" : "#38bdf8";
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px">
        <span>${p.nome}</span><strong>${p.quantidade} un.</strong>
      </div>
      <div style="background:#1e293b;border-radius:6px;height:18px;overflow:hidden">
        <div style="width:${pct}%;background:${cor};height:100%"></div>
      </div>
    </div>`;
  }).join("");

  res.status(200).send(`<!DOCTYPE html>
  <html lang="pt-BR"><head><meta charset="UTF-8"><title>Dashboard API — SENAI</title></head>
  <body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;padding:30px;max-width:900px;margin:auto">
    <h1 style="color:#38bdf8">Dashboard Analitico — /api/v1/dashboard</h1>
    <p style="color:#94a3b8">Servidor Genesis (10.85.198.243:1414) | Desafio Bonus SENAI</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:25px 0">
      <div style="background:#1e293b;padding:15px;border-radius:10px"><small>Produtos</small><h2>${payload.kpis.totalProdutos}</h2></div>
      <div style="background:#1e293b;padding:15px;border-radius:10px"><small>Unidades</small><h2>${payload.kpis.unidadesEmEstoque}</h2></div>
      <div style="background:#1e293b;padding:15px;border-radius:10px"><small>Patrimonio</small><h2 style="color:#4ade80">R$ ${payload.kpis.patrimonioTotal.toFixed(2)}</h2></div>
      <div style="background:#1e293b;padding:15px;border-radius:10px"><small>Criticos (&le;10)</small><h2 style="color:#f87171">${payload.kpis.alertasCriticos}</h2></div>
    </div>
    <div style="background:#1e293b;padding:20px;border-radius:12px">
      <h3 style="margin-top:0">Nivel de Estoque por Produto</h3>
      ${barrasProdutos}
    </div>
  </body></html>`);
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
