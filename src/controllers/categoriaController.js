const db = require('../data/db');
const REGEX_TEXTO = /^[a-zA-Z0-9\s\-_.]+$/;

exports.listarTodas = (req, res) => {
  const { busca } = req.query;
  let lista = [...db.categorias];
  if (busca !== undefined) {
    if (busca.trim() !== '' && !REGEX_TEXTO.test(busca.trim())) {
      return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "busca" invalido.' });
    }
    lista = lista.filter(c => c.nome.toLowerCase().includes(busca.trim().toLowerCase()));
  }
  const resultado = lista.map(cat => ({
    ...cat,
    totalProdutos: db.produtos.filter(p => p.categoriaId === cat.id).length
  }));
  res.status(200).json(resultado);
};

exports.obterPorId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const cat = db.categorias.find(c => c.id === id);
  if (!cat) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  const produtos = db.produtos.filter(p => p.categoriaId === id);
  res.status(200).json({ ...cat, totalProdutos: produtos.length, produtos });
};

exports.criar = (req, res) => {
  const { nome } = req.body || {};
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 60) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" deve ter entre 2 e 60 caracteres.' });
  }
  if (!REGEX_TEXTO.test(nome.trim())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" nao aceita acentos ou simbolos.' });
  }
  if (db.categorias.some(c => c.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe uma categoria com este nome.' });
  }
  const nova = { id: db.proximoIdCategoria++, nome: nome.trim() };
  db.categorias.push(nova);
  db.salvar();
  res.status(201).json(nova);
};

exports.atualizar = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.categorias.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  const { nome } = req.body || {};
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 60) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" deve ter entre 2 e 60 caracteres.' });
  }
  if (!REGEX_TEXTO.test(nome.trim())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "nome" nao aceita acentos ou simbolos.' });
  }
  if (db.categorias.some(c => c.id !== id && c.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe outra categoria com este nome.' });
  }
  db.categorias[idx] = { id, nome: nome.trim() };
  db.salvar();
  res.status(200).json(db.categorias[idx]);
};

exports.remover = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.categorias.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  if (db.produtos.some(p => p.categoriaId === id)) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Nao e possivel excluir categoria que possui produtos vinculados.' });
  }
  db.categorias.splice(idx, 1);
  db.salvar();
  res.status(200).json({ status: 'sucesso', mensagem: 'Categoria removida com sucesso.' });
};
