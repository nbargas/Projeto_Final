#!/bin/bash
URL="http://localhost:1414"

while true; do
  echo ""
  echo "=========================================="
  echo "   CENTRAL DE TESTES DA API (ESTOQUE)     "
  echo "=========================================="
  echo "  [1] Ver todas as Categorias"
  echo "  [2] Ver todos os Produtos"
  echo "  [3] Filtrar Produtos por faixa de preco"
  echo "  [4] Cadastrar nova Categoria (digitar)"
  echo "  [5] Cadastrar novo Produto (digitar)"
  echo "  [6] Testar Erro 400 (Bloquear exclusao de categoria em uso)"
  echo "  [7] Testar Erro 404 (Rota inexistente)"
  echo "  [0] Sair"
  echo "=========================================="
  read -p "Digite o numero da opcao desejada: " opcao
  echo ""

  case "$opcao" in
    1)
      echo ">>> Listando Categorias:"
      curl -s "$URL/categorias" | jq .
      ;;
    2)
      echo ">>> Listando Produtos:"
      curl -s "$URL/produtos" | jq .
      ;;
    3)
      read -p "Preco minimo (Enter para 100): " min
      read -p "Preco maximo (Enter para 300): " max
      min=${min:-100}
      max=${max:-300}
      echo ">>> Filtrando Produtos (R\$ $min ate R\$ $max):"
      curl -s "$URL/produtos?minPreco=$min&maxPreco=$max" | jq .
      ;;
    4)
      read -p "Nome da nova Categoria: " cat_nome
      echo ">>> Cadastrando Categoria '$cat_nome':"
      curl -s -X POST "$URL/categorias" \
        -H "Content-Type: application/json" \
        -d "{\"nome\": \"$cat_nome\"}" | jq .
      ;;
    5)
      read -p "Nome do Produto: " prod_nome
      read -p "Preco (ex: 150.50): " prod_preco
      read -p "Quantidade em estoque (ex: 10): " prod_qtd
      read -p "ID da Categoria (ex: 1): " prod_cat
      echo ">>> Cadastrando Produto '$prod_nome':"
      curl -s -X POST "$URL/produtos" \
        -H "Content-Type: application/json" \
        -d "{\"nome\": \"$prod_nome\", \"preco\": ${prod_preco//,/.}, \"quantidade\": $prod_qtd, \"categoriaId\": $prod_cat}" | jq .
      ;;
    6)
      echo ">>> Tentando excluir Categoria 1 (Integridade Referencial):"
      curl -s -X DELETE "$URL/categorias/1" | jq .
      ;;
    7)
      echo ">>> Acessando rota inexistente:"
      curl -s "$URL/rota-inexistente" | jq .
      ;;
    0)
      echo "Encerrando central de testes..."
      break
      ;;
    *)
      echo "Opcao invalida! Digite um numero de 0 a 7."
      ;;
  esac
done
