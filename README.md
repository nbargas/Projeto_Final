# 📦 Sistema de Gestão de Estoque — API RESTful

API RESTful desenvolvida como **Projeto Final Integrador (PBE1)** no **SENAI "Jairo Cândido" (Mauá/SP)**. A aplicação realiza o gerenciamento completo de estoque (**Produtos** e **Categorias**), aplicando o padrão arquitetural **MVC (Model-View-Controller)**, validações rigorosas de entrada, integridade referencial de dados e middlewares globais de auditoria e tratamento de exceções.

---

## 📋 Índice

1. Autores e Contexto Acadêmico
2. Arquitetura e Tecnologias
3. Estrutura de Diretórios
4. Regras de Negócio e Segurança
5. Documentação dos Endpoints
6. Exemplos de Requisição e Resposta (JSON)
7. Instalação e Execução Local
8. Suíte de Testes e Validação
9. Contribuição e Padrão de Commits
10. Licença

---

## 👥 Autores e Contexto Acadêmico

* **Arthur Nunes** — [@nbargas](https://github.com/nbargas)  
  *Responsabilidades:* Arquitetura MVC, Endpoints de Categorias, Testes Automatizados e DevOps.
* **Lívia V. Santos** — [@liviavalentimS](https://github.com/liviavalentimS)  
  *Responsabilidades:* Endpoints de Produtos, Filtros via Query Params, Middlewares e Documentação.

* **Instituição:** Escola SENAI "Jairo Cândido" — Mauá / SP
* **Unidade Curricular:** Programação Back-End 1 (PBE1)

---

## 🛠️ Arquitetura e Tecnologias

* **Runtime:** Node.js (v18.x ou superior)
* **Framework Web:** Express.js (v4.x)
* **Padrão Arquitetural:** MVC (Separação clara entre Rotas, Controladores e Camada de Dados)
* **Versionamento:** Git e GitHub seguindo a especificação *Conventional Commits*
* **Ambiente de Desenvolvimento:** Google Cloud Shell (Debian Linux)
* **Ferramentas de Homologação HTTP:** Bash Script (`test-api.sh`), `curl`, `jq`, Postman e VS Code REST Client

---

## 📂 Estrutura de Diretórios


Projeto_Final/
├── .env.example              # Modelo de variáveis de ambiente (PORT)
├── .gitignore                # Arquivos e pastas ignorados pelo Git
├── CONTRIBUTING.md           # Guia de colaboração e padrão de commits
├── LICENSE                   # Licença MIT
├── README.md                 # Documentação técnica oficial do projeto
├── index.js                  # Entry point da aplicação e Middlewares Globais
├── package.json              # Dependências e scripts NPM (npm start)
├── postman_collection.json   # Coleção pronta para importação no Postman/Insomnia
├── requests.http             # Arquivo de requisições para extensão REST Client
├── test-api.sh               # Script Bash automatizado para validação de rotas
└── src/
    ├── controllers/          # Regras de negócio e tratamento das requisições HTTP
    │   ├── categoriaController.js
    │   └── produtoController.js
    ├── data/                 # Persistência de dados em memória (Mock Database)
    │   └── db.js
    └── routes/               # Definição e mapeamento dos endpoints REST
        ├── categoriaRoutes.js
        └── produtoRoutes.js
🛡️ Regras de Negócio e Segurança
Integridade Referencial: O sistema bloqueia a exclusão (DELETE /categorias/:id) de qualquer categoria que possua produtos ativos vinculados a ela, retornando o status HTTP 400 Bad Request e evitando registros órfãos.

Validação de Payload:

Categorias: Exige o preenchimento obrigatório do campo nome.

Produtos: Exige nome, preco e um categoriaId válido existente na base.

Middlewares Globais:

Logger de Auditoria: Registra no console o método HTTP, a URL acessada e o timestamp de cada requisição.

Tratamento de Rota Inexistente (404): Intercepta chamadas para endpoints não mapeados e devolve um JSON padronizado.

Tratamento Global de Erros (500): Captura exceções inesperadas no servidor sem expor stack traces sensíveis ao cliente.

🌐 Documentação dos Endpoints
📁 Gestão de Categorias (/categorias)
GET /categorias — Lista todas as categorias cadastradas. (Sucesso: 200 OK)

GET /categorias/:id — Busca uma categoria específica pelo ID. (Sucesso: 200 OK | Erro: 404 Not Found)

POST /categorias — Cadastra uma nova categoria. (Sucesso: 201 Created | Erro: 400 Bad Request)

PUT /categorias/:id — Atualiza os dados de uma categoria existente. (Sucesso: 200 OK | Erro: 400 ou 404)

DELETE /categorias/:id — Remove uma categoria, caso não haja produtos vinculados. (Sucesso: 200 OK | Erro: 400 ou 404)

📦 Gestão de Produtos (/produtos)
GET /produtos — Lista todos os produtos, aceitando filtros via Query Params. (Sucesso: 200 OK)

GET /produtos/:id — Busca um produto específico pelo ID. (Sucesso: 200 OK | Erro: 404 Not Found)

POST /produtos — Cadastra um novo produto vinculado a uma categoria válida. (Sucesso: 201 Created | Erro: 400 Bad Request)

PUT /produtos/:id — Atualiza os dados de um produto existente. (Sucesso: 200 OK | Erro: 400 ou 404)

DELETE /produtos/:id — Remove um produto do estoque. (Sucesso: 200 OK | Erro: 404 Not Found)

🔍 Parâmetros de Filtro Disponíveis (GET /produtos)
?busca=termo — Filtra produtos pelo nome (case-insensitive).

?minPreco=50 — Retorna produtos com preço maior ou igual ao valor informado.

?maxPreco=500 — Retorna produtos com preço menor ou igual ao valor informado.

?categoriaId=1 — Filtra produtos pertencentes a uma categoria específica.

📨 Exemplos de Requisição e Resposta (JSON)
1. Cadastrar Produto (POST /produtos)
Request Body:

JSON
{
  "nome": "Teclado Mecanico RGB",
  "preco": 249.90,
  "categoriaId": 1
}
Response (201 Created):

JSON
{
  "id": 4,
  "nome": "Teclado Mecanico RGB",
  "preco": 249.90,
  "categoriaId": 1
}
2. Bloqueio de Integridade Referencial (DELETE /categorias/1)
Response (400 Bad Request):

JSON
{
  "status": "erro",
  "mensagem": "Nao e possivel remover esta categoria pois existem produtos associados a ela."
}
🚀 Instalação e Execução Local
Pré-requisitos
Node.js (versão 18.x ou superior)

Git

Passo a Passo
Bash
# 1. Clone o repositório
git clone [https://github.com/nbargas/Projeto_Final.git](https://github.com/nbargas/Projeto_Final.git)

# 2. Acesse o diretório do projeto
cd Projeto_Final

# 3. Instale as dependências
npm install

# 4. Inicie o servidor
npm start
A API estará disponível em: http://localhost:1414

🧪 Suíte de Testes e Validação
O repositório disponibiliza três métodos integrados para homologação rápida dos endpoints:

Script Automatizado via Terminal (Bash + cURL + jq):

Bash
./test-api.sh
Postman / Insomnia:
Importe o arquivo postman_collection.json disponível na raiz do repositório para acessar todas as rotas pré-configuradas.

VS Code (Extensão REST Client):
Abra o arquivo requests.http e clique em Send Request acima de cada endpoint.

🤝 Contribuição e Padrão de Commits
Este projeto adota o padrão Conventional Commits (feat:, fix:, docs:, test:, chore:). Para instruções detalhadas sobre o fluxo de sincronização e boas práticas de desenvolvimento da equipe, consulte o arquivo CONTRIBUTING.md.

📄 Licença
Este projeto foi desenvolvido para fins acadêmicos no SENAI "Jairo Cândido" (Mauá/SP) e está licenciado sob a Licença MIT — veja o arquivo LICENSE para mais detalhes.
