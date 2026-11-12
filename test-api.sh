#!/bin/bash
URL="http://localhost:1414"

while true; do
  echo ""
  echo "=========================================="
  echo "   CENTRAL DE TESTES DA API (ESTOQUE)     "
  echo "=========================================="
  echo "  [1] Ver todas as Categorias (GET)"
  echo "  [2] Ver todos os Produtos (GET)"
  echo "  [3] Filtrar Produtos por faixa de preco (GET)"
  echo "  [4] Cadastrar nova Categoria (POST)"
  echo "  [5] Cadastrar novo Produto (POST)"
  echo "  [6] Atualizar Produto existente (PUT)"
  echo "  [7] Deletar Produto (DELETE)"
  echo "  [8] Testar Erro 400 (Bloquear exclusao de categoria em uso)"
  echo "  [9] Testar Erro 404 (Rota inexistente)"
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
      read -p "ID do Produto que deseja atualizar: " upd_id
      read -p "Novo Nome do Produto: " upd_nome
      read -p "Novo Preco (ex: 199.90): " upd_preco
      read -p "Nova Quantidade: " upd_qtd
      read -p "ID da Categoria: " upd_cat
      echo ">>> Atualizando Produto ID $upd_id:"
      curl -s -X PUT "$URL/produtos/$upd_id" \
        -H "Content-Type: application/json" \
        -d "{\"nome\": \"$upd_nome\", \"preco\": ${upd_preco//,/.}, \"quantidade\": $upd_qtd, \"categoriaId\": $upd_cat}" | jq .
      ;;
    7)
      read -p "ID do Produto que deseja deletar: " del_id
      echo ">>> Deletando Produto ID $del_id:"
      curl -s -X DELETE "$URL/produtos/$del_id" | jq .
      ;;
    8)
      echo ">>> Tentando excluir Categoria 1 (Integridade Referencial):"
      curl -s -X DELETE "$URL/categorias/1" | jq .
      ;;
    9)
      echo ">>> Acessando rota inexistente:"
      curl -s "$URL/rota-inexistente" | jq .
      ;;
    0)
      echo "Encerrando central de testes..."
      break
      ;;
    *)
      echo "Opcao invalida! Digite um numero de 0 a 9."
      ;;
  esac
done
