let categorias = [
  { id: 1, nome: 'Eletronicos', descricao: 'Dispositivos e acessorios' },
  { id: 2, nome: 'Escritorio', descricao: 'Materiais de escritorio' }
];

let produtos = [
  { id: 1, nome: 'Teclado Mecanico', preco: 150.00, quantidade: 20, categoriaId: 1 },
  { id: 2, nome: 'Cadeira Ergonomica', preco: 850.00, quantidade: 5, categoriaId: 2 }
];

module.exports = {
  categorias,
  produtos,
  proximoIdCategoria: 3,
  proximoIdProduto: 3
};
