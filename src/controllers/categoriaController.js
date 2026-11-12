let db = require('../data/db');
const REGEX_TEXTO = /^[a-zA-Z0-9\s\-_.]+$/;

function validarTexto(valor, campo, obrigatorio = true) {
  if (valor === undefined || valor === null || String(valor).trim() === '') {
    return obrigatorio ? `O campo "${campo}" e obrigatorio.` : null;
  }
  if (typeof valor !== 'string') return `O campo "${campo}" deve ser texto.`;
  const limpo = valor.trim();
  if (limpo.length < 2 || limpo.length > 60) return `O campo "${campo}" deve ter entre 2 e 60 caracteres.`;
  if (!REGEX_TEXTO.test(limpo)) return `O campo "${campo}" nao aceita acentos ou caracteres especiais.`;
  return null;
}

exports.listarTodas = (req, res) => res.status(200).json(db.categorias);

exports.obterPorId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const cat = db.categorias.find(c => c.id === id);
  if (!cat) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  res.status(200).json(cat);
};

exports.criar = (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Corpo JSON invalido.' });
  const { nome, descricao } = req.body;
  const errNome = validarTexto(nome, 'nome', true);
  if (errNome) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: errNome });
  const errDesc = validarTexto(descricao, 'descricao', false);
  if (errDesc) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: errDesc });
  if (db.categorias.some(c => c.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe uma categoria com este nome.' });
  }
  const nova = { id: db.proximoIdCategoria++, nome: nome.trim(), descricao: descricao ? descricao.trim() : '' };
  db.categorias.push(nova);
  res.status(201).json(nova);
};

exports.atualizar = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.categorias.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  const { nome, descricao } = req.body || {};
  const errNome = validarTexto(nome, 'nome', true);
  if (errNome) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: errNome });
  const errDesc = validarTexto(descricao, 'descricao', false);
  if (errDesc) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: errDesc });
  if (db.categorias.some(c => c.id !== id && c.nome.toLowerCase() === nome.trim().toLowerCase())) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe outra categoria com este nome.' });
  }
  db.categorias[idx] = { id, nome: nome.trim(), descricao: descricao !== undefined ? descricao.trim() : db.categorias[idx].descricao };
  res.status(200).json(db.categorias[idx]);
};

exports.remover = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.categorias.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Categoria nao encontrada.' });
  if (db.produtos.some(p => p.categoriaId === id)) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Nao e possivel remover categoria com produtos vinculados.' });
  }
  db.categorias.splice(idx, 1);
  res.status(200).json({ status: 'sucesso', mensagem: 'Categoria removida com sucesso.' });
};
