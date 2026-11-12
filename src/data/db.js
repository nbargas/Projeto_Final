let categorias = [
  { id: 1, nome: "Perifericos" },
  { id: 2, nome: "Moveis de Escritorio" },
  { id: 3, nome: "Monitores e Video" },
  { id: 4, nome: "Acessorios e Cabos" },
  { id: 5, nome: "Hardware e Componentes" }
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
  { id: 10, nome: "Cabo HDMI 2.1 Ultra High Speed", preco: 45.00, quantidade: 50, categoriaId: 4 },
  { id: 11, nome: "SSD NVMe 1TB PCIe 4.0", preco: 489.90, quantidade: 25, categoriaId: 5 },
  { id: 12, nome: "Memoria RAM 16GB DDR4 3200MHz", preco: 260.00, quantidade: 30, categoriaId: 5 },
  { id: 13, nome: "Placa de Video RTX 4060 8GB", preco: 2199.00, quantidade: 6, categoriaId: 5 },
  { id: 14, nome: "Fonte Modular 650W 80 Plus Bronze", preco: 379.00, quantidade: 11, categoriaId: 5 },
  { id: 15, nome: "Gabinete Mid Tower Vidro Temperado", preco: 320.00, quantidade: 9, categoriaId: 5 },
  { id: 16, nome: "Monitor Gamer 24 Polegadas 144Hz", preco: 949.00, quantidade: 10, categoriaId: 3 },
  { id: 17, nome: "Microfone Condensador USB", preco: 299.00, quantidade: 13, categoriaId: 1 },
  { id: 18, nome: "Hub USB-C 7 em 1", preco: 135.00, quantidade: 22, categoriaId: 4 },
  { id: 19, nome: "Apoio Ergonomico para Pes", preco: 89.90, quantidade: 17, categoriaId: 2 },
  { id: 20, nome: "Luminaria de Mesa LED Articulada", preco: 115.00, quantidade: 19, categoriaId: 2 }
];

module.exports = {
  categorias,
  produtos,
  proximoIdCategoria: 6,
  proximoIdProduto: 21
};
