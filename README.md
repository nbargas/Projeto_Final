# 📦 API RESTful de Controle de Estoque — Projeto Final SENAI

> **Sistema de Gestão de Inventário, Movimentações e Relatórios Gerenciais**  
> Desenvolvido em **Node.js + Express** sob a arquitetura **MVC**, com persistência automática em arquivo JSON (`database.json`), blindagem de segurança e suíte interativa de testes via CLI.

___

## 🌐 Ambiente & Acesso

- **Servidor:** `genesis` (`10.85.198.243`)
- **Porta:** `1414`
- **URL Base (Rede / Genesis):** `http://10.85.198.243:1414`
- **URL Base (Localhost):** `http://localhost:1414`
- **Formato:** JSON (`application/json`)

___

## ✨ Principais Recursos

- **CRUD Completo:** Operações `GET`, `POST`, `PUT`, `PATCH` e `DELETE` para categorias e produtos.
- **Persistência em Disco:** Gravação automática em `src/data/database.json` com opção de restauração (`reset`).
- **Buscas Avançadas:** Filtros por nome, categoria, faixa de preço, estoque crítico, ordenação (`sort`) e paginação (`page`/`limit`).
- **Controle de Estoque:** Registro de `ENTRADA` e `SAIDA` com histórico auditável e bloqueio de saldo negativo.
- **Dashboard Gerencial:** Patrimônio total, resumo financeiro por categoria e alertas de reposição.
- **Blindagem HTTP:** Validação de `Content-Type`, limite de payload (`100kb`) e sanitização contra XSS/injeção.

___

## 🚀 Como Subir no Servidor Genesis

1. **Conectar via SSH ao servidor Genesis:**
   ```bash
   ssh arthur.nunes@10.85.198.243
Entrar na pasta e iniciar a API na porta 1414:

Bash
cd ~/Projeto_Final && git pull && node index.js
Abrir a Central Interativa (35 operações) em uma segunda aba:

Bash
cd ~/Projeto_Final && ./test-api.sh
🧪 Roteiro Passo a Passo de Testes


1️⃣ Verificar Saúde da API (Health Check)
Bash
curl -s [http://10.85.198.243:1414/health](http://10.85.198.243:1414/health) | jq .


2️⃣ Consultar Categorias e Produtos Iniciais
Bash
curl -s [http://10.85.198.243:1414/categorias](http://10.85.198.243:1414/categorias) | jq .
curl -s [http://10.85.198.243:1414/produtos](http://10.85.198.243:1414/produtos) | jq .


3️⃣ Testar Filtros, Ordenação e Paginação
Bash
# Busca por nome
curl -s "[http://10.85.198.243:1414/produtos?busca=Monitor](http://10.85.198.243:1414/produtos?busca=Monitor)" | jq .

# Faixa de preço
curl -s "[http://10.85.198.243:1414/produtos?minPreco=100&maxPreco=300](http://10.85.198.243:1414/produtos?minPreco=100&maxPreco=300)" | jq .

# Ordenação crescente e paginação
curl -s "[http://10.85.198.243:1414/produtos?sort=preco_asc&page=1&limit=5](http://10.85.198.243:1414/produtos?sort=preco_asc&page=1&limit=5)" | jq .


4️⃣ Cadastrar Categoria e Produto (POST)
Bash
curl -s -X POST [http://10.85.198.243:1414/categorias](http://10.85.198.243:1414/categorias) \
  -H "Content-Type: application/json" \
  -d '{"nome": "Redes e Conectividade"}' | jq .

curl -s -X POST [http://10.85.198.243:1414/produtos](http://10.85.198.243:1414/produtos) \
  -H "Content-Type: application/json" \
  -d '{"nome": "Roteador Wi-Fi 6 Dual Band", "preco": 349.90, "quantidade": 15, "categoriaId": 6}' | jq .

  
5️⃣ Atualizar Produto Parcial (PATCH) e Completo (PUT)
Bash
curl -s -X PATCH [http://10.85.198.243:1414/produtos/21](http://10.85.198.243:1414/produtos/21) \
  -H "Content-Type: application/json" \
  -d '{"preco": 299.90}' | jq .

curl -s -X PUT [http://10.85.198.243:1414/produtos/21](http://10.85.198.243:1414/produtos/21) \
  -H "Content-Type: application/json" \
  -d '{"nome": "Roteador Wi-Fi 6 Mesh", "preco": 329.90, "quantidade": 20, "categoriaId": 6}' | jq .

  
6️⃣ Movimentar Estoque (ENTRADA / SAIDA) e Ver Histórico
Bash
curl -s -X POST [http://10.85.198.243:1414/produtos/1/movimentacao](http://10.85.198.243:1414/produtos/1/movimentacao) \
  -H "Content-Type: application/json" \
  -d '{"tipo": "ENTRADA", "quantidade": 10, "observacao": "Reposicao"}' | jq .

curl -s -X POST [http://10.85.198.243:1414/produtos/1/movimentacao](http://10.85.198.243:1414/produtos/1/movimentacao) \
  -H "Content-Type: application/json" \
  -d '{"tipo": "SAIDA", "quantidade": 4, "observacao": "Venda"}' | jq .

curl -s [http://10.85.198.243:1414/produtos/estoque/movimentacoes](http://10.85.198.243:1414/produtos/estoque/movimentacoes) | jq .


7️⃣ Gerar Dashboard Executivo e Reajustar Preços em Lote
Bash
curl -s [http://10.85.198.243:1414/produtos/relatorio/geral](http://10.85.198.243:1414/produtos/relatorio/geral) | jq .

curl -s -X POST [http://10.85.198.243:1414/produtos/reajuste-precos](http://10.85.198.243:1414/produtos/reajuste-precos) \
  -H "Content-Type: application/json" \
  -d '{"categoriaId": 1, "percentual": 10}' | jq .

  
8️⃣ Testar Blindagem e Erros HTTP (400, 404, 415)
Bash
# 400 - Categoria em uso
curl -s -X DELETE [http://10.85.198.243:1414/categorias/1](http://10.85.198.243:1414/categorias/1) | jq .

# 400 - Estoque insuficiente
curl -s -X POST [http://10.85.198.243:1414/produtos/1/movimentacao](http://10.85.198.243:1414/produtos/1/movimentacao) \
  -H "Content-Type: application/json" \
  -d '{"tipo": "SAIDA", "quantidade": 9999}' | jq .

# 415 - Sem Content-Type JSON
curl -s -X POST [http://10.85.198.243:1414/categorias](http://10.85.198.243:1414/categorias) -d "nome=Teste" | jq .

# 404 - Rota inexistente
curl -s [http://10.85.198.243:1414/rota-inexistente](http://10.85.198.243:1414/rota-inexistente) | jq .


9️⃣ Limpar Testes (DELETE) e Restaurar Banco Original (Reset)
Bash
curl -s -X DELETE [http://10.85.198.243:1414/produtos/21](http://10.85.198.243:1414/produtos/21) | jq .
curl -s -X DELETE [http://10.85.198.243:1414/categorias/6](http://10.85.198.243:1414/categorias/6) | jq .

curl -s -X POST [http://10.85.198.243:1414/produtos/sistema/reset](http://10.85.198.243:1414/produtos/sistema/reset) \
  -H "Content-Type: application/json" -d '{}' | jq .
  
📡 Mapa Rápido de Endpoints & Arquitetura
Arquitetura MVC:

Plaintext
Projeto_Final/
├── index.js                         # Servidor Express (porta 1414) e middlewares
├── test-api.sh                      # Menu CLI interativo (6 módulos / 35 opções)
└── src/
    ├── controllers/                 # categoriaController.js & produtoController.js
    ├── data/                        # db.js & database.json (persistência)
    ├── middlewares/                 # errorHandler.js (tratamento global de erros)
    └── routes/                      # categoriaRoutes.js & produtoRoutes.js
Endpoints Disponíveis:

GET /health — Status online e uptime

GET / POST /categorias — Listar e criar categorias

GET / PUT / DELETE /categorias/:id — Detalhar, renomear e excluir categoria

GET / POST /produtos — Listar (com filtros/paginação) e criar produto

GET / PUT / PATCH / DELETE /produtos/:id — Detalhar, editar e remover produto

POST /produtos/:id/movimentacao — Registrar entrada ou saída de estoque

GET /produtos/estoque/movimentacoes — Histórico de movimentações

GET /produtos/relatorio/geral — Dashboard executivo patrimonial

POST /produtos/reajuste-precos — Reajuste percentual em lote

POST /produtos/sistema/reset — Restaurar dados originais

📄 Licença
Este projeto está licenciado sob a Licença MIT (Copyright (c) 2026 Arthur Nunes & Lívia).

É livre para uso, cópia, modificação e distribuição para fins educacionais e comerciais, desde que mantidos os créditos originais.

👥 Equipe do Projeto
💻 Arthur Nunes — Desenvolvimento Back-end (Node.js/Express), Arquitetura MVC, Persistência JSON e Automação CLI

📄 Lívia — Documentação Técnica, Estruturação e Padronização nas Normas ABNT

Projeto Final desenvolvido para o Curso Técnico em Desenvolvimento de Sistemas — SENAI.
