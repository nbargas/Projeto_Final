# Sistema de Gestao de Estoque - API RESTful

---

## Apresentacao do Projeto

A presente API RESTful foi desenvolvida como Projeto Final Integrador da disciplina de Desenvolvimento / Programacao Web (PBE1) do **SENAI "Jairo Candido"**, localizado no municipio de Maua - SP.

O objetivo principal da aplicacao e fornecer uma solucao robusta, modular e escalavel para o gerenciamento de estoque de mercadorias, contemplando o cadastro, atualizacao, consulta e remocao de **Produtos** e **Categorias**. A arquitetura segue rigorosamente o padrao **MVC (Model-View-Controller)**, assegurando a separacao clara de responsabilidades, integridade referencial dos dados, tratamento centralizado de excecoes e middlewares de auditoria.

---

## Autores do Projeto

- **Arthur Nunes** | GitHub: [github.com/nbargas](https://github.com/nbargas)
- **Livia V. Santos** | GitHub: [github.com/liviavalentimS](https://github.com/liviavalentimS)

**Instituicao:** SENAI "Jairo Candido" — Maua / SP  
**Disciplina:** Projeto Bloco de Engenharia 1 (PBE1)  

---

## Tecnologias e Especificacoes Tecnicas

- **Ambiente de Execucao:** Node.js (Versao 18.x ou superior)
- **Framework Web:** Express.js (v4.x)
- **Padrao Arquitetural:** MVC (Model-View-Controller)
- **Controle de Versionamento:** Git e GitHub
- **Ambiente de Hospedagem / Testes:** Google Cloud Shell (Debian Linux)
- **Ferramentas de Teste HTTP:** Bash, `curl` e `jq`

---

## Arquitetura e Estrutura de Diretoriis

A estrutura de arquivos do projeto foi organizada para garantir alta coesao e baixo acoplamento entre os componentes da aplicacao:

Projeto_Final/
├── index.js                  # Arquivo principal da aplicacao e inicializacao do servidor Express
├── package.json              # Mapeamento de dependencias e scripts de execucao
├── README.md                 # Documentacao oficial do repositorio
└── src/
    ├── controllers/          # Camada de regras de negocio e controle de requisicoes
    │   ├── categoriaController.js
    │   └── produtoController.js
    ├── data/                 # Camada de persistencia (Banco de dados em memoria)
    │   └── db.js
    └── routes/               # Mapeamento dos endpoints e roteamento HTTP
        ├── categoriaRoutes.js
        └── produtoRoutes.js
Regras de Negocio e Integridade de Dados
Integridade Referencial de Categorias:

Nao e possivel excluir uma categoria que possua produtos ativos associados a ela. A tentativa de remocao retorna um status HTTP 400 Bad Request informando o impedimento.

Validacao de Payload de Entrada:

O cadastro de Categorias exige o envio obrigatorio do atributo nome.

O cadastro de Produtos exige obrigatoriamente os atributos nome, preco e categoriaId.

Requisicoes com campos ausentes ou tipos invalidos sao rejeitadas com erro HTTP 400 Bad Request.

Tratamento Global de Excecoes e Erros:

Middleware Log: Registra o timestamp, metodo HTTP e rota de cada requisicao no console.

Middleware 404: Captura tentativas de acesso a rotas nao mapeadas e retorna resposta padronizada em JSON.

Middleware 500: Captura falhas internas no servidor sem expor detalhes sensiveis da aplicacao ao cliente.

Mapeamento Completo de Endpoints
Gestao de Categorias (/categorias)
GET /categorias

Retorna a lista completa com todas as categorias registradas no sistema.

Resposta de Sucesso: 200 OK

GET /categorias/:id

Retorna os detalhes de uma categoria especifica com base no ID informado na URL.

Resposta de Sucesso: 200 OK | Erro: 404 Not Found

POST /categorias

Registra uma nova categoria no sistema.

Corpo da Requisicao (JSON): {"nome": "Eletronicos"}

Resposta de Sucesso: 201 Created | Erro: 400 Bad Request

PUT /categorias/:id

Atualiza o nome de uma categoria existente identificada pelo ID.

Corpo da Requisicao (JSON): {"nome": "Informatica"}

Resposta de Sucesso: 200 OK | Erro: 400 Bad Request / 404 Not Found

DELETE /categorias/:id

Remove uma categoria caso nao haja nenhum produto vinculado.

Resposta de Sucesso: 200 OK | Erro: 400 Bad Request / 404 Not Found

Gestao de Produtos (/produtos)
GET /produtos

Retorna a lista de produtos. Suporta filtros combinados via Query Parameters:

busca: Filtra por nome do produto (busca parcial insensivel a maiusculas/minusculas). Exemplo: /produtos?busca=teclado

minPreco / maxPreco: Filtra por faixa de preco. Exemplo: /produtos?minPreco=50&maxPreco=200

categoriaId: Filtra por id especifico de categoria. Exemplo: /produtos?categoriaId=1

Resposta de Sucesso: 200 OK

GET /produtos/:id

Retorna os detalhes de um produto especifico.

Resposta de Sucesso: 200 OK | Erro: 404 Not Found

POST /produtos

Cadastra um novo produto associado a uma categoria valida.

Corpo da Requisicao (JSON): {"nome": "Teclado Mecanico", "preco": 250.00, "categoriaId": 1}

Resposta de Sucesso: 201 Created | Erro: 400 Bad Request

PUT /produtos/:id

Atualiza as informacoes de um produto existente.

Corpo da Requisicao (JSON): {"nome": "Teclado RGB", "preco": 280.00, "categoriaId": 1}

Resposta de Sucesso: 200 OK | Erro: 400 Bad Request / 404 Not Found

DELETE /produtos/:id

Exclui um produto do sistema.

Resposta de Sucesso: 200 OK | Erro: 404 Not Found

Guia de Instalacao e Execucao
Pre-requisitos Necessarios
Node.js instalado na versao 18.0.0 ou superior.

Git instalado e configurado no ambiente.

Procedimento no Terminal
Clonar o Repositorio:

Bash
git clone [https://github.com/nbargas/Projeto_Final.git](https://github.com/nbargas/Projeto_Final.git)
cd Projeto_Final
Instalar as Dependencias do Projeto:

Bash
npm install
Iniciar a Aplicacao:

Bash
node index.js
O servidor passara a escutar na porta 1414 (URL: http://localhost:1414).

Validacao e Testes de Endpoints (Via Terminal Bash)
Para homologar a API diretamente pelo terminal utilizando curl e jq, utilize os comandos abaixo:

Bash
# 1. Listar todas as categorias cadastradas
curl -s http://localhost:1414/categorias | jq .

# 2. Cadastrar uma nova categoria
curl -s -X POST http://localhost:1414/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Perifericos"}' | jq .

# 3. Filtrar produtos por termo de busca
curl -s "http://localhost:1414/produtos?busca=teclado" | jq .

# 4. Validar o tratamento de rota inexistente (Middleware 404)
curl -s http://localhost:1414/rota-inexistente | jq .
Licenca e Consideracoes Academicas
Este projeto foi elaborado de forma exclusiva para fins didaticos e de avaliacao no curso de Desenvolvimento do SENAI "Jairo Candido" (Maua / SP).
