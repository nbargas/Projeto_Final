let db = require('../data/db');
const REGEX_TEXTO = /^[a-zA-Z0-9\s\-_.]+$/;

function validarProduto(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Corpo JSON invalido.';
  const { nome, preco, quantidade, categoriaId } = body;
  if (nome === undefined || preco === undefined || quantidade === undefined || categoriaId === undefined) {
    return 'Os campos "nome", "preco", "quantidade" e "categoriaId" sao obrigatorios.';
  }
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 80) {
    return 'O campo "nome" deve ser um texto entre 2 e 80 caracteres.';
  }
  if (!REGEX_TEXTO.test(nome.trim())) {
    return 'O campo "nome" nao aceita acentos ou caracteres especiais.';
  }
  if (typeof preco !== 'number' || !Number.isFinite(preco) || preco <= 0) {
    return 'O campo "preco" deve ser um numero maior que zero.';
  }
  if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) {
    return 'O campo "quantidade" deve ser um inteiro maior ou igual a zero.';
  }
  if (typeof categoriaId !== 'number' || !Number.isInteger(categoriaId) || categoriaId <= 0) {
    return 'O campo "categoriaId" deve ser um numero inteiro positivo.';
  }
  if (!db.categorias.some(c => c.id === categoriaId)) {
    return 'A categoria informada em "categoriaId" nao existe.';
  }
  return null;
}

exports.listarTodos = (req, res) => {
  const { categoriaId, minPreco, maxPreco, busca } = req.query;
  let resLista = [...db.produtos];
  if (categoriaId !== undefined) {
    const cat = Number(categoriaId);
    if (!Number.isInteger(cat) || cat <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "categoriaId" invalido.' });
    resLista = resLista.filter(p => p.categoriaId === cat);
  }
  if (minPreco !== undefined) {
    const min = Number(minPreco);
    if (Number.isNaN(min) || min < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "minPreco" invalido.' });
    resLista = resLista.filter(p => p.preco >= min);
  }
  if (maxPreco !== undefined) {
    const max = Number(maxPreco);
    if (Number.isNaN(max) || max < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "maxPreco" invalido.' });
    if (minPreco !== undefined && Number(minPreco) > max) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: '"minPreco" nao pode ser maior que "maxPreco".' });
    resLista = resLista.filter(p => p.preco <= max);
  }
  if (busca !== undefined) {
    if (busca.trim() !== '' && !REGEX_TEXTO.test(busca.trim())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "busca" nao aceita acentos ou simbolos.' });
    resLista = resLista.filter(p => p.nome.toLowerCase().includes(busca.trim().toLowerCase()));
  }
  res.status(200).json(resLista);
};

exports.obterPorId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const prod = db.produtos.find(p => p.id === id);
  if (!prod) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  res.status(200).json(prod);
};

exports.criar = (req, res) => {
  const err = validarProduto(req.body);
  if (err) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: err });
  const { nome, preco, quantidade, categoriaId } = req.body;
  if (db.produtos.some(p => p.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe um produto com este nome.' });
  }
  const novo = { id: db.proximoIdProduto++, nome: nome.trim(), preco, quantidade, categoriaId };
  db.produtos.push(novo);
  res.status(201).json(novo);
};

exports.atualizar = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  const err = validarProduto(req.body);
  if (err) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: err });
  const { nome, preco, quantidade, categoriaId } = req.body;
  if (db.produtos.some(p => p.id !== id && p.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe outro produto com este nome.' });
  }
  db.produtos[idx] = { id, nome: nome.trim(), preco, quantidade, categoriaId };
  res.status(200).json(db.produtos[idx]);
};

exports.remover = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  db.produtos.splice(idx, 1);
  res.status(200).json({ status: 'sucesso', mensagem: 'Produto removido com sucesso.' });
};

exports.atualizarParcial = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Envie ao menos um campo valido para atualizar.' });
  }

  const atual = { ...db.produtos[idx] };
  const { nome, preco, quantidade, categoriaId } = req.body;

  if (nome !== undefined) {
    if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 80) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" deve ser um texto entre 2 e 80 caracteres.' });
    if (!REGEX_TEXTO.test(nome.trim())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" nao aceita acentos ou caracteres especiais.' });
    if (db.produtos.some(p => p.id !== id && p.nome.toLowerCase() === nome.trim().toLowerCase())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe outro produto com este nome.' });
    atual.nome = nome.trim();
  }
  if (preco !== undefined) {
    if (typeof preco !== 'number' || !Number.isFinite(preco) || preco <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "preco" deve ser um numero maior que zero.' });
    atual.preco = preco;
  }
  if (quantidade !== undefined) {
    if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "quantidade" deve ser um inteiro maior ou igual a zero.' });
    atual.quantidade = quantidade;
  }
  if (categoriaId !== undefined) {
    if (typeof categoriaId !== 'number' || !Number.isInteger(categoriaId) || categoriaId <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "categoriaId" deve ser um numero inteiro positivo.' });
    if (!db.categorias.some(c => c.id === categoriaId)) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'A categoria informada em "categoriaId" nao existe.' });
    atual.categoriaId = categoriaId;
  }

  db.produtos[idx] = atual;
  res.status(200).json(db.produtos[idx]);
};
