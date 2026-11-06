# Sistema de Gestao de Estoque - API RESTful

API RESTful desenvolvida como Projeto Final Integrador (PBE1) no SENAI "Jairo Candido" (Maua). A aplicacao realiza o gerenciamento completo de estoque (Produtos e Categorias), aplicando o padrao arquitetural MVC (Model-View-Controller), validacoes de entrada, integridade referencial de dados e middlewares globais de auditoria e tratamento de excecoes.

---

## Autores do Projeto

- **Arthur Nunes** (https://github.com/nbargas)
- **Livia V. Santos** (https://github.com/liviavalentimS)

**Instituicao:** SENAI "Jairo Candido" - Maua / SP  
**Disciplina:** Projeto Bloco de Engenharia 1 (PBE1)  

---

## Tecnologias e Ferramentas

- **Runtime:** Node.js (v18.x ou superior)
- **Framework Web:** Express.js (v4.x)
- **Padrao Arquitetural:** MVC (Model-View-Controller)
- **Versionamento:** Git e GitHub
- **Ambiente de Hospedagem / Testes:** Google Cloud Shell (Debian Linux)
- **Ferramentas de Teste HTTP:** Bash, curl e jq

---

## Estrutura do Projeto (MVC)

Projeto_Final/
├── .env.example              # Exemplo de variaveis de ambiente
├── .gitignore                # Regras de ignoranciamento do Git
├── LICENSE                   # Licenca MIT
├── index.js                  # Ponto de entrada da aplicacao
├── package.json              # Dependencias e scripts de execucao (npm start)
├── README.md                 # Documentacao oficial
└── src/
    ├── controllers/          # Logica de negocio e tratamento das requisicoes
    │   ├── categoriaController.js
    │   └── produtoController.js
    ├── data/                 # Camada de persistencia (Banco em memoria)
    │   └── db.js
    └── routes/               # Mapeamento dos endpoints HTTP
        ├── categoriaRoutes.js
        └── produtoRoutes.js
Regras de Negocio e Integridade de Dados
Integridade Referencial de Categorias: Nao e possivel excluir uma categoria que possua produtos ativos associados a ela. A tentativa de remocao retorna um status HTTP 400 Bad Request.

Validacao de Payload de Entrada: O cadastro de Categorias exige o envio obrigatorio do atributo nome. O cadastro de Produtos exige nome, preco e categoriaId.

Tratamento Global de Erros: Middlewares dedicados para logging de requisicoes, captura de rotas inexistentes (404) e tratamento de falhas internas do servidor (500).

Endpoints da API
Gestao de Categorias (/categorias)
GET /categorias - Lista todas as categorias cadastradas.

GET /categorias/:id - Busca uma categoria especificamente pelo ID.

POST /categorias - Cadastra uma nova categoria no sistema.

PUT /categorias/:id - Atualiza os dados de uma categoria existente.

DELETE /categorias/:id - Remove uma categoria (bloqueado se houver produtos vinculados).

Gestao de Produtos (/produtos)
GET /produtos - Lista produtos com suporte a query params (busca, minPreco, maxPreco, categoriaId).

GET /produtos/:id - Busca um produto especificamente pelo ID.

POST /produtos - Cadastra um novo produto associado a uma categoria valida.

PUT /produtos/:id - Atualiza as informacoes de um produto existente.

DELETE /produtos/:id - Exclui um produto do sistema.

Guia de Instalacao e Execucao
Pre-requisitos
Node.js (v18.x ou superior)

Git

Passo a Passo
Clonar o repositorio:

Bash
git clone [https://github.com/nbargas/Projeto_Final.git](https://github.com/nbargas/Projeto_Final.git)
cd Projeto_Final
Instalar as dependencias:

Bash
npm install
Iniciar o servidor:

Bash
npm start
O servidor sera executado na porta 1414 (http://localhost:1414).

Validacao via Terminal (Bash / curl / jq)
Bash
# 1. Listar todas as categorias
curl -s http://localhost:1414/categorias | jq .

# 2. Filtrar produtos por termo de busca
curl -s "http://localhost:1414/produtos?busca=teclado" | jq .

# 3. Teste de rota inexistente (Middleware 404)
curl -s http://localhost:1414/rota-inexistente | jq .
Licenca e Consideracoes Academicas
Este projeto foi elaborado de forma exclusiva para fins didaticos e de avaliacao no curso do SENAI "Jairo Candido" (Maua / SP) sob Licenca MIT.
