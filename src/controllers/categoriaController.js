let db = require('../data/db');

exports.listarTodas = (req, res) => {
  res.status(200).json(db.categorias);
};

exports.obterPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const categoria = db.categorias.find(c => c.id === id);

  if (!categoria) {
    return res.status(404).json({ status: 'erro', mensagem: 'Categoria nao encontrada.' });
  }

  res.status(200).json(categoria);
};

exports.criar = (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ status: 'erro', mensagem: 'O campo "nome" e obrigatorio e deve ser um texto valido.' });
  }

  const novaCategoria = {
    id: db.proximoIdCategoria++,
    nome: nome.trim(),
    descricao: descricao ? descricao.trim() : ''
  };

  db.categorias.push(novaCategoria);
  res.status(201).json(novaCategoria);
};

exports.atualizar = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, descricao } = req.body;

  const index = db.categorias.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'erro', mensagem: 'Categoria nao encontrada.' });
  }

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ status: 'erro', mensagem: 'O campo "nome" e obrigatorio.' });
  }

  db.categorias[index] = {
    id,
    nome: nome.trim(),
    descricao: descricao ? descricao.trim() : db.categorias[index].descricao
  };

  res.status(200).json(db.categorias[index]);
};

exports.remover = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.categorias.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'erro', mensagem: 'Categoria nao encontrada.' });
  }

  const produtosVinculados = db.produtos.some(p => p.categoriaId === id);
  if (produtosVinculados) {
    return res.status(400).json({ 
      status: 'erro', 
      mensagem: 'Nao e possivel remover esta categoria pois existem produtos associados a ela.' 
    });
  }

  db.categorias.splice(index, 1);
  res.status(200).json({ status: 'sucesso', mensagem: 'Categoria removida com sucesso.' });
};
