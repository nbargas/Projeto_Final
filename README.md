# 📦 API RESTful de Controle de Estoque — Projeto Final SENAI

API RESTful desenvolvida em **Node.js** e **Express** seguindo o padrão arquitetural **MVC (Model-View-Controller)**, com persistência automática em arquivo JSON (`database.json`), regras de integridade referencial, blindagem contra entradas inválidas e suíte interativa de testes via terminal (`Bash` + `curl` + `jq`).

___

## 📋 Índice

- [Visão Geral e Funcionalidades](#-visão-geral-e-funcionalidades)

- [Arquitetura do Projeto](#-arquitetura-do-projeto)

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)

- [Instalação e Execução](#-instalação-e-execução)

- [Documentação dos Endpoints](#-documentação-dos-endpoints)

- [Regras de Negócio e Blindagem](#-regras-de-negócio-e-blindagem)

- [Códigos de Status HTTP](#-códigos-de-status-http)

- [Central Interativa de Testes (35 Operações)](#-central-interativa-de-testes-35-operações)

- [Equipe](#-equipe)

___

## 🚀 Visão Geral e Funcionalidades

- **CRUD Completo de Categorias e Produtos:** Suporte integral aos métodos `GET`, `POST`, `PUT`, `PATCH` e `DELETE`.

- **Persistência Automática em Disco:** Todas as alterações são gravadas em `src/data/database.json`, mantendo os dados salvos mesmo após reiniciar o servidor, com endpoint dedicado para restaurar a base inicial.

- **Filtros, Ordenação e Paginação:** Busca textual por nome, filtro por categoria, faixa de preço (`minPreco` e `maxPreco`), filtro de estoque crítico, ordenação dinâmica (`sort`) e paginação (`page` e `limit`).

- **Controle de Movimentação de Estoque:** Registro auditável de entradas (`ENTRADA`) e saídas (`SAIDA`) com bloqueio automático para evitar saldo negativo.

- **Dashboard Gerencial:** Cálculo automático de patrimônio total em estoque, resumo financeiro por categoria, produto mais caro/barato e alerta de itens em nível crítico.

- **Blindagem e Tratamento Global de Erros:** Validação de cabeçalho `Content-Type`, limite de payload (`100kb`), regex contra caracteres especiais/injeção e tratamento centralizado de exceções.

___

## 🗂️ Arquitetura do Projeto

Projeto_Final/
├── index.js                              # Ponto de entrada, middlewares globais e inicialização na porta 1414
├── package.json                          # Dependências e metadados do projeto
├── test-api.sh                           # Central de Testes interativa em Bash (6 módulos / 35 operações)
├── requests.http                         # Coleção de requisições HTTP para testes manuais
├── postman_collection.json               # Coleção exportada para Postman
├── README.md                             # Documentação técnica do projeto
└── src/
    ├── controllers/
    │   ├── categoriaController.js        # Regras de negócio e CRUD de categorias
    │   └── produtoController.js          # Regras de negócio, CRUD, estoque e relatórios de produtos
    ├── data/
    │   ├── db.js                         # Camada de persistência (leitura, gravação e reset do JSON)
    │   └── database.json                 # Base de dados persistida automaticamente
    ├── middlewares/
    │   └── errorHandler.js               # Wrapper seguro (safeHandler) e tratamento global de erros
    └── routes/
        ├── categoriaRoutes.js            # Definição das rotas de /categorias
        └── produtoRoutes.js              # Definição das rotas de /produtos
🛠️ Tecnologias Utilizadas
Runtime: Node.js

Framework Web: Express.js

Persistência: File System nativo (fs / JSON)

Automação e Testes CLI: Bash Script, curl e jq

Ambiente: Linux (Debian / Google Cloud Shell)

⚙️ Instalação e Execução
Clonar o repositório e instalar dependências:

Bash
git clone <URL_DO_REPOSITORIO>
cd Projeto_Final
npm install
Iniciar o servidor na porta 1414:

Bash
node index.js
Verificar se a API está online:

Bash
curl -s http://localhost:1414/health | jq .
📡 Documentação dos Endpoints
1. Sistema / Saúde
GET /health — Verifica o status online e o tempo de atividade (uptime) da API (200 OK).

2. Categorias (/categorias)
GET /categorias — Lista todas as categorias com contagem de produtos vinculados. Aceita filtro ?busca=termo (200 OK / 400 Bad Request).

GET /categorias/:id — Retorna os detalhes da categoria e a lista de produtos pertencentes a ela (200 OK / 400 Bad Request / 404 Not Found).

POST /categorias — Cadastra uma nova categoria (201 Created / 400 Bad Request / 415 Unsupported Media Type).

PUT /categorias/:id — Atualiza o nome de uma categoria existente (200 OK / 400 Bad Request / 404 Not Found).

DELETE /categorias/:id — Remove uma categoria; bloqueado caso existam produtos vinculados (200 OK / 400 Bad Request / 404 Not Found).

Exemplo de payload (POST /categorias):

JSON
{
  "nome": "Armazenamento e Redes"
}
3. Produtos (/produtos)
GET /produtos — Lista produtos com suporte a filtros, ordenação e paginação (200 OK / 400 Bad Request).

GET /produtos/:id — Retorna um produto específico com o nome da categoria e o valor total em estoque (200 OK / 400 Bad Request / 404 Not Found).

POST /produtos — Cadastra um novo produto vinculado a uma categoria válida (201 Created / 400 Bad Request / 415 Unsupported Media Type).

PUT /produtos/:id — Atualiza todos os campos de um produto existente (200 OK / 400 Bad Request / 404 Not Found).

PATCH /produtos/:id — Atualiza parcialmente um ou mais campos (nome, preco, quantidade, categoriaId) (200 OK / 400 Bad Request / 404 Not Found).

DELETE /produtos/:id — Remove definitivamente um produto do estoque (200 OK / 400 Bad Request / 404 Not Found).

Parâmetros de consulta (Query Params) disponíveis em GET /produtos:

categoriaId — Filtra pelo ID da categoria (ex: ?categoriaId=1)

minPreco e maxPreco — Filtra por faixa de preço (ex: ?minPreco=100&maxPreco=500)

busca — Busca parcial pelo nome do produto (ex: ?busca=Monitor)

estoqueCritico=true — Retorna apenas itens com 10 ou menos unidades

sort — Ordenação dinâmica: preco_asc, preco_desc, nome_asc ou qtd_asc

page e limit — Paginação dos resultados (ex: ?page=1&limit=5)

Exemplo de payload (POST /produtos):

JSON
{
  "nome": "Monitor Gamer 27 Polegadas",
  "preco": 1499.90,
  "quantidade": 12,
  "categoriaId": 3
}
4. Estoque, Relatórios e Operações em Lote
POST /produtos/:id/movimentacao — Registra ENTRADA ou SAIDA de estoque e grava no histórico (200 OK / 400 Bad Request / 404 Not Found).

GET /produtos/estoque/movimentacoes — Lista o histórico completo de movimentações; aceita ?produtoId=1 (200 OK).

GET /produtos/relatorio/geral — Retorna o Dashboard Executivo com patrimônio total, alertas de estoque crítico e resumo por categoria (200 OK).

POST /produtos/reajuste-precos — Aplica reajuste percentual (%) em todos os produtos ou em uma categoria específica (200 OK / 400 Bad Request).

POST /produtos/sistema/reset — Restaura o banco de dados para os 20 produtos e 5 categorias originais (200 OK).

Exemplo de payload (POST /produtos/1/movimentacao):

JSON
{
  "tipo": "SAIDA",
  "quantidade": 3,
  "observacao": "Venda realizada no balcao"
}
🛡️ Regras de Negócio e Blindagem
Integridade Referencial: Não é permitido cadastrar ou editar um produto apontando para um categoriaId inexistente, nem excluir uma categoria que ainda possua produtos associados.

Prevenção de Estoque Negativo: Operações de SAIDA são bloqueadas (400 Bad Request) caso a quantidade solicitada seja maior que o saldo disponível.

Sanitização de Entrada: Campos de texto passam por expressão regular (^[a-zA-Z0-9\s\-_.]+$), bloqueando tags HTML/scripts e caracteres especiais maliciosos.

Unicidade de Nomes: Não são permitidas duas categorias ou dois produtos com o mesmo nome (comparação case-insensitive).

Validação de Protocolo: Requisições POST, PUT e PATCH exigem Content-Type: application/json (retornando 415 caso contrário) e possuem limite máximo de 100kb por requisição.

📊 Códigos de Status HTTP
200 OK — Consultas, atualizações (PUT/PATCH), movimentações, relatórios e exclusões executadas com sucesso.

201 Created — Cadastro bem-sucedido de nova categoria ou novo produto.

400 Bad Request — Dados ausentes/inválidos, estoque insuficiente, exclusão de categoria em uso ou JSON malformado.

404 Not Found — ID de produto/categoria inexistente ou rota não mapeada na API.

415 Unsupported Media Type — Envio de POST, PUT ou PATCH sem cabeçalho application/json.

500 Internal Server Error — Falha inesperada capturada pelo middleware global de segurança.

🖥️ Central Interativa de Testes (35 Operações)
O projeto inclui o script test-api.sh, organizado em 6 módulos hierárquicos que cobrem todas as 35 operações da API diretamente pelo terminal:

Bash
chmod +x test-api.sh
./test-api.sh
Módulo 1 — Gestão de Categorias (6 opções): Listagem com contagem, busca por nome, detalhamento com produtos, cadastro (POST), edição (PUT) e exclusão (DELETE).

Módulo 2 — Consultas e Filtros de Produtos (8 opções): Listagem geral, busca por ID, busca por nome, filtro por categoria, faixa de preço, ordenação crescente/decrescente e paginação.

Módulo 3 — Cadastro e Edição de Produtos (6 opções): Cadastro (POST), atualização completa (PUT), atualização parcial (PATCH de preço, nome ou categoria) e exclusão (DELETE).

Módulo 4 — Movimentação de Estoque e Preços (5 opções): Entrada de mercadoria, saída/venda, histórico geral, histórico por produto e reajuste percentual em lote.

Módulo 5 — Relatórios Gerenciais e Auditoria (4 opções): Dashboard executivo patrimonial, alerta de estoque crítico, ranking de menor estoque e health check.

Módulo 6 — Testes de Blindagem e Sistema (6 opções): Simulação automatizada dos erros 400, 404, 415, bloqueio de XSS/caracteres especiais e reset do banco de dados.

👥 Equipe
Arthur Nunes

Lívia

Projeto desenvolvido para o curso técnico no SENAI.
