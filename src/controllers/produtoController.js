const db = require('../data/db');
const REGEX_TEXTO = /^[a-zA-Z0-9\s\-_.]+$/;

function validarProduto(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Corpo JSON invalido.';
  const { nome, preco, quantidade, categoriaId } = body;
  if (nome === undefined || preco === undefined || quantidade === undefined || categoriaId === undefined) return 'Campos obrigatorios ausentes.';
  if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 80) return 'O campo "nome" deve ter entre 2 e 80 caracteres.';
  if (!REGEX_TEXTO.test(nome.trim())) return 'O campo "nome" nao aceita acentos ou caracteres especiais.';
  if (typeof preco !== 'number' || !Number.isFinite(preco) || preco <= 0) return 'O campo "preco" deve ser maior que zero.';
  if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) return 'O campo "quantidade" deve ser inteiro >= 0.';
  if (typeof categoriaId !== 'number' || !Number.isInteger(categoriaId) || categoriaId <= 0) return 'O campo "categoriaId" deve ser inteiro positivo.';
  if (!db.categorias.some(c => c.id === categoriaId)) return 'A categoria informada nao existe.';
  return null;
}

exports.listarTodos = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { categoriaId, minPreco, maxPreco, busca, estoqueCritico, sort, page, limit } = req.query;
  let resLista = [...db.produtos];
  if (categoriaId !== undefined) {
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
    const cat = Number(categoriaId);
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (!Number.isInteger(cat) || cat <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "categoriaId" invalido.' });
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    resLista = resLista.filter(p => p.categoriaId === cat);
  }
  if (minPreco !== undefined) {
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
    const min = Number(minPreco);
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (Number.isNaN(min) || min < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "minPreco" invalido.' });
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    resLista = resLista.filter(p => p.preco >= min);
  }
  if (maxPreco !== undefined) {
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
    const max = Number(maxPreco);
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (Number.isNaN(max) || max < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "maxPreco" invalido.' });
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    resLista = resLista.filter(p => p.preco <= max);
  }
  if (busca !== undefined) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (busca.trim() !== '' && !REGEX_TEXTO.test(busca.trim())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "busca" invalido.' });
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    resLista = resLista.filter(p => p.nome.toLowerCase().includes(busca.trim().toLowerCase()));
  }
  // [TRANSF] Processamento, filtragem ou serializacao de dados
  if (estoqueCritico === 'true') resLista = resLista.filter(p => p.quantidade <= 10);
  if (sort) {
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    if (sort === 'preco_asc') resLista.sort((a, b) => a.preco - b.preco);
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    else if (sort === 'preco_desc') resLista.sort((a, b) => b.preco - a.preco);
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    else if (sort === 'nome_asc') resLista.sort((a, b) => a.nome.localeCompare(b.nome));
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    else if (sort === 'qtd_asc') resLista.sort((a, b) => a.quantidade - b.quantidade);
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    else return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Parametro "sort" invalido.' });
  }
  if (page !== undefined || limit !== undefined) {
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
    const p = Number(page || 1), l = Number(limit || 5);
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (!Number.isInteger(p) || p <= 0 || !Number.isInteger(l) || l <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Paginacao invalida.' });
    const inicio = (p - 1) * l;
    return res.status(200).json({ paginaAtual: p, itensPorPagina: l, totalItens: resLista.length, totalPaginas: Math.ceil(resLista.length / l), dados: resLista.slice(inicio, inicio + l) });
  }
  res.status(200).json(resLista);
};

exports.obterPorId = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const id = Number(req.params.id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
  const prod = db.produtos.find(p => p.id === id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (!prod) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
  const cat = db.categorias.find(c => c.id === prod.categoriaId);
  res.status(200).json({ ...prod, categoriaNome: cat ? cat.nome : 'Desconhecida', valorTotalItem: Number((prod.preco * prod.quantidade).toFixed(2)) });
};

exports.criar = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const err = validarProduto(req.body);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (err) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: err });
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { nome, preco, quantidade, categoriaId } = req.body;
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (db.produtos.some(p => p.nome.toLowerCase() === nome.trim().toLowerCase())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Ja existe um produto com este nome.' });
  const novo = { id: db.proximoIdProduto++, nome: nome.trim(), preco, quantidade, categoriaId };
  db.produtos.push(novo);
  db.salvar();
  res.status(201).json(novo);
};

exports.atualizar = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const id = Number(req.params.id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const err = validarProduto(req.body);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (err) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: err });
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { nome, preco, quantidade, categoriaId } = req.body;
  db.produtos[idx] = { id, nome: nome.trim(), preco, quantidade, categoriaId };
  db.salvar();
  res.status(200).json(db.produtos[idx]);
};

exports.atualizarParcial = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const id = Number(req.params.id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || Object.keys(req.body).length === 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Envie ao menos um campo valido.' });
  const atual = { ...db.produtos[idx] };
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { nome, preco, quantidade, categoriaId } = req.body;
  if (nome !== undefined) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (typeof nome !== 'string' || nome.trim().length < 2 || !REGEX_TEXTO.test(nome.trim())) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Nome invalido.' });
    atual.nome = nome.trim();
  }
  if (preco !== undefined) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (typeof preco !== 'number' || !Number.isFinite(preco) || preco <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Preco invalido.' });
    atual.preco = preco;
  }
  if (quantidade !== undefined) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade < 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Quantidade invalida.' });
    atual.quantidade = quantidade;
  }
  if (categoriaId !== undefined) {
    // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
    if (!db.categorias.some(c => c.id === categoriaId)) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Categoria inexistente.' });
    atual.categoriaId = categoriaId;
  }
  db.produtos[idx] = atual;
  db.salvar();
  res.status(200).json(db.produtos[idx]);
};

exports.remover = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const id = Number(req.params.id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'ID invalido na URL.' });
  const idx = db.produtos.findIndex(p => p.id === id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  db.produtos.splice(idx, 1);
  db.salvar();
  res.status(200).json({ status: 'sucesso', mensagem: 'Produto removido com sucesso.' });
};

exports.movimentarEstoque = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const id = Number(req.params.id);
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { tipo, quantidade, observacao } = req.body || {};
  const idx = db.produtos.findIndex(p => p.id === id);
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (idx === -1) return res.status(404).json({ status: 'erro', codigo: 404, mensagem: 'Produto nao encontrado.' });
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Tipo deve ser ENTRADA ou SAIDA.' });
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (typeof quantidade !== 'number' || !Number.isInteger(quantidade) || quantidade <= 0) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Quantidade invalida.' });
  const prod = db.produtos[idx];
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (tipo === 'SAIDA' && prod.quantidade < quantidade) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: `Estoque insuficiente. Disponivel: ${prod.quantidade}.` });
  const saldoAnterior = prod.quantidade;
  prod.quantidade = tipo === 'ENTRADA' ? prod.quantidade + quantidade : prod.quantidade - quantidade;
  const registro = { id: db.proximoIdMovimentacao++, produtoId: prod.id, produtoNome: prod.nome, tipo, quantidade, saldoAnterior, saldoAtual: prod.quantidade, observacao: observacao || 'Movimentacao padrao', data: new Date().toISOString() };
  db.movimentacoes.unshift(registro);
  db.salvar();
  res.status(200).json({ status: 'sucesso', produto: prod, movimentacao: registro });
};

exports.listarMovimentacoes = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { produtoId } = req.query;
  let lista = [...db.movimentacoes];
  // [TRANSF] Processamento, filtragem ou serializacao de dados
  if (produtoId) lista = lista.filter(m => m.produtoId === Number(produtoId));
  res.status(200).json(lista);
};

exports.relatorioGeral = (req, res) => {
  const totalUnidades = db.produtos.reduce((acc, p) => acc + p.quantidade, 0);
  // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
  const valorPatrimonio = Number(db.produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0).toFixed(2));
  // [TRANSF] Processamento, filtragem ou serializacao de dados
  const ordenados = [...db.produtos].sort((a, b) => b.preco - a.preco);
  // [TRANSF] Processamento, filtragem ou serializacao de dados
  const critico = db.produtos.filter(p => p.quantidade <= 10);
  // [TRANSF] Processamento, filtragem ou serializacao de dados
  const resumoPorCategoria = db.categorias.map(cat => {
    // [TRANSF] Processamento, filtragem ou serializacao de dados
    const itens = db.produtos.filter(p => p.categoriaId === cat.id);
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
    return { categoriaId: cat.id, categoria: cat.nome, modelos: itens.length, unidades: itens.reduce((a, p) => a + p.quantidade, 0), valorTotal: Number(itens.reduce((a, p) => a + (p.preco * p.quantidade), 0).toFixed(2)) };
  });
  res.status(200).json({ indicadores: { totalCategorias: db.categorias.length, totalProdutosCadastrados: db.produtos.length, totalUnidadesEmEstoque: totalUnidades, valorTotalEstoque: valorPatrimonio, itensEmAlertaCritico: critico.length, totalMovimentacoesRegistradas: db.movimentacoes.length }, produtoMaisCaro: ordenados[0] || null, produtoMaisBarato: ordenados[ordenados.length - 1] || null, estoqueCritico: critico, resumoPorCategoria });
};

exports.reajustarPrecos = (req, res) => {
  // [FLUXO] Leitura de entrada da requisicao ou persistencia
  const { categoriaId, percentual } = req.body || {};
  // [ERRO] Tratamento de excecao ou bloqueio de validacao HTTP
  if (typeof percentual !== 'number' || !Number.isFinite(percentual) || percentual === 0 || percentual < -90 || percentual > 500) return res.status(400).json({ status: 'erro', codigo: 400, mensagem: 'Percentual invalido.' });
  let afetados = 0;
  db.produtos.forEach(p => {
    // [TRANSF] Regra de negocio, normalizacao, calculo ou persistencia
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
  res.status(200).json({ status: 'sucesso', mensagem: 'Banco de dados restaurado.' });
};
