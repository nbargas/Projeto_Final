let categorias = [
  { id: 1, nome: "Perifericos" },
  { id: 2, nome: "Moveis de Escritorio" },
  { id: 3, nome: "Monitores e Video" },
  { id: 4, nome: "Acessorios e Cabos" }
];

let produtos = [
  { id: 1, nome: "Teclado Mecanico", preco: 150.00, quantidade: 20, categoriaId: 1 },
  { id: 2, nome: "Cadeira Ergonomica", preco: 850.00, quantidade: 5, categoriaId: 2 },
  { id: 3, nome: "Mouse Gamer Sem Fio", preco: 189.90, quantidade: 15, categoriaId: 1 },
  { id: 4, nome: "Monitor UltraWide 29 Polegadas", preco: 1299.00, quantidade: 8, categoriaId: 3 },
  { id: 5, nome: "Headset Surround 7.1", preco: 279.50, quantidade: 12, categoriaId: 1 },
  { id: 6, nome: "Mesa Escritorio em L", preco: 640.00, quantidade: 4, categoriaId: 2 },
  { id: 7, nome: "Webcam Full HD 1080p", preco: 210.00, quantidade: 18, categoriaId: 3 },
  { id: 8, nome: "Mousepad Extra Grande", preco: 59.90, quantidade: 40, categoriaId: 4 },
  { id: 9, nome: "Suporte Articulado para Monitor", preco: 165.00, quantidade: 14, categoriaId: 4 },
  { id: 10, nome: "Cabo HDMI 2.1 Ultra High Speed", preco: 45.00, quantidade: 50, categoriaId: 4 }
];

module.exports = { categorias, produtos };
