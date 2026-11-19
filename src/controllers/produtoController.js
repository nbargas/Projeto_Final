const db = require('../data/db');
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
  const { categoriaId, minPreco, maxPreco, busca, estoqueCritico, sort, page, limit } = req.query;
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
  if (estoqueCritico === 'true') {
    resLista = resLista.filter(p => p.quantidade <= 10);
  }
  if (sort) {
    if (sort === 'preco_asc') resLista.sort((a, b) => a.preco - b.preco);
    else if (sort === 'preco_desc') resLista.sort((a, b) => b.preco - a.preco);
    else if (sort === 'nome_asc') resLista.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (sort === 'qtd_asc') resLista.sort((a, b) => a.quantidade - b.quantidade);
    else return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "sort" invalido. Use: preco_asc, preco_desc, nome_asc ou qtd_asc.' });
  }
  if (page !== undefined || limit !== undefined) {
    const p = Number(page || 1);
    const l = Number(limit || 5);
    if (!Number.isInteger(p) || p <= 0 || !Number.isInteger(l) || l <= 0) {
      return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametros "page" e "limit" devem ser inteiros positivos.' });
    }
    const inicio = (p - 1) * l;
    return res.status(200).json({
      paginaAtual: p,
      itensPorPagina: l,
      totalItens: resLista.length,
      totalPaginas: Math.ceil(resLista.length / l),
      dados: resLista.slice(inicio, inicio + l)
    });
  }
  res.status(200).json(resLista);
};

exports.obterPorId = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const prod = db.produtos.find(p => p.id === id);
  if (!prod) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  const categoria = db.categorias.find(c => c.id === prod.categoriaId);
  res.status(200).json({
    ...prod,
    categoriaNome: categoria ? categoria.nome : 'Desconhecida',
    valorTotalItem: Number((prod.preco * prod.quantidade).toFixed(2))
  });
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
  db.salvar();
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
  db.salvar();
  res.status(200).json(db.produtos[idx]);
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
  db.salvar();
  res.status(200).json(db.produtos[idx]);
};

exports.remover = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  db.produtos.splice(idx, 1);
  db.salvar();
  res.status(200).json({ status: 'sucesso', mensagem: 'Produto removido com sucesso.' });
};

exports.movimentarEstoque = (req, res) => {
  const id = Number(req.params.id);
  const { tipo, quantidade, observacao } = req.body || {};
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'O campo "tipo" deve ser ENTRADA ou SAIDA.' });
  if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'A quantidade movimentada deve ser um inteiro maior que zero.' });
  }

  const prod = db.produtos[idx];
  if (tipo === 'SAIDA' && prod.quantidade < quantidade) {
    return res.status(400).json({
      status: 'erro',
      codigo: 400,
      mensagem: `Estoque insuficiente. Disponivel: ${prod.quantidade}, solicitado: ${quantidade}.`
    });
  }

  const saldoAnterior = prod.quantidade;
  prod.quantidade = tipo === 'ENTRADA' ? prod.quantidade + quantidade : prod.quantidade - quantidade;

  const registro = {
    id: db.proximoIdMovimentacao++,
    produtoId: prod.id,
    produtoNome: prod.nome,
    tipo,
    quantidade,
    saldoAnterior,
    saldoAtual: prod.quantidade,
    observacao: typeof observacao === 'string' && observacao.trim() ? observacao.trim() : 'Movimentacao padrao',
    data: new Date().toISOString()
  };

  db.movimentacoes.unshift(registro);
  db.salvar();
  res.status(200).json({ status: 'sucesso', produto: prod, movimentacao: registro });
};

exports.listarMovimentacoes = (req, res) => {
  const { tipo, produtoId } = req.query;
  let lista = [...db.movimentacoes];
  if (tipo) lista = lista.filter(m => m.tipo === tipo.toUpperCase());
  if (produtoId) lista = lista.filter(m => m.produtoId === Number(produtoId));
  res.status(200).json(lista);
};

exports.relatorioGeral = (req, res) => {
  const totalProdutos = db.produtos.length;
  const totalCategorias = db.categorias.length;
  const totalUnidades = db.produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const valorPatrimonio = Number(db.produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0).toFixed(2));
  const ordenadosPreco = [...db.produtos].sort((a, b) => b.preco - a.preco);
  const estoqueCritico = db.produtos.filter(p => p.quantidade <= 10);

  const resumoPorCategoria = db.categorias.map(cat => {
    const itens = db.produtos.filter(p => p.categoriaId === cat.id);
    return {
      categoriaId: cat.id,
      categoria: cat.nome,
      modelos: itens.length,
      unidades: itens.reduce((acc, p) => acc + p.quantidade, 0),
      valorTotal: Number(itens.reduce((acc, p) => acc + (p.preco * p.quantidade), 0).toFixed(2))
    };
  });

  res.status(200).json({
    indicadores: {
      totalCategorias,
      totalProdutosCadastrados: totalProdutos,
      totalUnidadesEmEstoque: totalUnidades,
      valorTotalEstoque: valorPatrimonio,
      itensEmAlertaCritico: estoqueCritico.length,
      totalMovimentacoesRegistradas: db.movimentacoes.length
    },
    produtoMaisCaro: ordenadosPreco[0] || null,
    produtoMaisBarato: ordenadosPreco[ordenadosPreco.length - 1] || null,
    estoqueCritico,
    resumoPorCategoria
  });
};

exports.reajustarPrecos = (req, res) => {
  const { categoriaId, percentual } = req.body || {};
  if (typeof percentual !== 'number' || !Number.isFinite(percentual) || percentual === 0 || percentual < -90 || percentual > 500) {
    return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Informe um "percentual" valido entre -90 e 500 (diferente de zero).' });
  }
  let afetados = 0;
  db.produtos.forEach(p => {
    if (categoriaId === undefined || p.categoriaId === Number(categoriaId)) {
      p.preco = Number((p.preco * (1 + percentual / 100)).toFixed(2));
      afetados++;
    }
  });
  db.salvar();
  res.status(200).json({ status: 'sucesso', percentualAplicado: `${percentual}%`, produtosAtualizados: afetados });
};

exports.resetarBanco = (req, res) => {
  db.resetar();
  res.status(200).json({ status: 'sucesso', mensagem: 'Banco de dados restaurado para os 20 produtos e 5 categorias originais.' });
};
