let db = require('../data/db');

exports.listarTodos = (req, res) => {
  const { categoriaId, minPreco, maxPreco, busca } = req.query;
  let resultado = [...db.produtos];

  if (categoriaId) {
    resultado = resultado.filter(p => p.categoriaId === parseInt(categoriaId));
  }

  if (minPreco) {
    resultado = resultado.filter(p => p.preco >= parseFloat(minPreco));
  }

  if (maxPreco) {
    resultado = resultado.filter(p => p.preco <= parseFloat(maxPreco));
  }

  if (busca) {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
  }

  res.status(200).json(resultado);
};

exports.obterPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const produto = db.produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ status: 'erro', mensagem: 'Produto nao encontrado.' });
  }

  res.status(200).json(produto);
};

exports.criar = (req, res) => {
  const { nome, preco, quantidade, categoriaId } = req.body;

  if (!nome || preco === undefined || quantidade === undefined || !categoriaId) {
    return res.status(400).json({ status: 'erro', mensagem: 'Os campos nome, preco, quantidade e categoriaId sao obrigatorios.' });
  }

  if (typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ status: 'erro', mensagem: 'O preco deve ser um numero maior que zero.' });
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    return res.status(400).json({ status: 'erro', mensagem: 'A quantidade deve ser um numero inteiro nao negativo.' });
  }

  const categoriaExiste = db.categorias.some(c => c.id === parseInt(categoriaId));
  if (!categoriaExiste) {
    return res.status(400).json({ status: 'erro', mensagem: 'A categoria informada nao existe.' });
  }

  const novoProduto = {
    id: db.proximoIdProduto++,
    nome: nome.trim(),
    preco,
    quantidade,
    categoriaId: parseInt(categoriaId)
  };

  db.produtos.push(novoProduto);
  res.status(201).json(novoProduto);
};

exports.atualizar = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, quantidade, categoriaId } = req.body;

  const index = db.produtos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ status: 'erro', mensagem: 'Produto nao encontrado.' });
  }

  if (!nome || preco === undefined || quantidade === undefined || !categoriaId) {
    return res.status(400).json({ status: 'erro', mensagem: 'Todos os campos sao obrigatorios para a atualizacao.' });
  }

  if (typeof preco !== 'number' || preco <= 0 || !Number.isInteger(quantidade) || quantidade < 0) {
    return res.status(400).json({ status: 'erro', mensagem: 'Preco deve ser > 0 e quantidade deve ser um inteiro >= 0.' });
  }

  db.produtos[index] = {
    id,
    nome: nome.trim(),
    preco,
    quantidade,
    categoriaId: parseInt(categoriaId)
  };

  res.status(200).json(db.produtos[index]);
};

exports.remover = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'erro', mensagem: 'Produto nao encontrado.' });
  }

  db.produtos.splice(index, 1);
  res.status(200).json({ status: 'sucesso', mensagem: 'Produto removido com sucesso.' });
};
