const express = require('express');
const app = express();
const PORT = 1414;

app.use(express.json());

// Base de dados em memória
let categorias = [
  { id: 1, nome: 'Eletrónicos', descricao: 'Dispositivos e acessórios' },
  { id: 2, nome: 'Escritório', descricao: 'Materiais de escritório' }
];

let produtos = [
  { id: 1, nome: 'Teclado Mecânico', preco: 150.00, quantidade: 20, categoriaId: 1 },
  { id: 2, nome: 'Cadeira Ergonómica', preco: 850.00, quantidade: 5, categoriaId: 2 }
];

let proximoIdCategoria = 3;
let proximoIdProduto = 3;

// ==========================================
// ROTAS - CATEGORIAS
// ==========================================

// GET /categorias - Listar todas
app.get('/categorias', (req, res) => {
  res.status(200).json(categorias);
});

// GET /categorias/:id - Obter por ID
app.get('/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const categoria = categorias.find(c => c.id === id);
  
  if (!categoria) {
    return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
  }
  
  res.status(200).json(categoria);
});

// POST /categorias - Criar
app.post('/categorias', (req, res) => {
  const { nome, descricao } = req.body;
  
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ mensagem: 'O campo "nome" é obrigatório e deve ser texto.' });
  }

  const novaCategoria = {
    id: proximoIdCategoria++,
    nome,
    descricao: descricao || ''
  };

  categorias.push(novaCategoria);
  res.status(201).json(novaCategoria);
});

// PUT /categorias/:id - Atualizar
app.put('/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, descricao } = req.body;
  
  const index = categorias.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
  }

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ mensagem: 'O campo "nome" é obrigatório.' });
  }

  categorias[index] = { id, nome, descricao: descricao || categorias[index].descricao };
  res.status(200).json(categorias[index]);
});

// DELETE /categorias/:id - Remover
app.delete('/categorias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categorias.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
  }

  categorias.splice(index, 1);
  res.status(200).json({ mensagem: 'Categoria removida com sucesso.' });
});

// ==========================================
// ROTAS - PRODUTOS
// ==========================================

// GET /produtos - Listar com suporte a Query Params (?categoriaId=1)
app.get('/produtos', (req, res) => {
  const { categoriaId } = req.query;

  if (categoriaId) {
    const idCat = parseInt(categoriaId);
    const filtrados = produtos.filter(p => p.categoriaId === idCat);
    return res.status(200).json(filtrados);
  }

  res.status(200).json(produtos);
});

// GET /produtos/:id - Obter por ID
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  res.status(200).json(produto);
});

// POST /produtos - Criar
app.post('/produtos', (req, res) => {
  const { nome, preco, quantidade, categoriaId } = req.body;

  if (!nome || preco === undefined || quantidade === undefined || !categoriaId) {
    return res.status(400).json({ mensagem: 'Os campos nome, preco, quantidade e categoriaId são obrigatórios.' });
  }

  if (typeof preco !== 'number' || preco < 0 || typeof quantidade !== 'number' || quantidade < 0) {
    return res.status(400).json({ mensagem: 'Preço e quantidade devem ser números não negativos.' });
  }

  const categoriaExiste = categorias.some(c => c.id === parseInt(categoriaId));
  if (!categoriaExiste) {
    return res.status(400).json({ mensagem: 'A categoria informada não existe.' });
  }

  const novoProduto = {
    id: proximoIdProduto++,
    nome,
    preco,
    quantidade,
    categoriaId: parseInt(categoriaId)
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// PUT /produtos/:id - Atualizar
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, quantidade, categoriaId } = req.body;

  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  if (!nome || preco === undefined || quantidade === undefined || !categoriaId) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios para atualização.' });
  }

  produtos[index] = {
    id,
    nome,
    preco,
    quantidade,
    categoriaId: parseInt(categoriaId)
  };

  res.status(200).json(produtos[index]);
});

// DELETE /produtos/:id - Remover
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  produtos.splice(index, 1);
  res.status(200).json({ mensagem: 'Produto removido com sucesso.' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}`);
});
