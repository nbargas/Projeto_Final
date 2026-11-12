#!/bin/bash
BASE_URL="http://localhost:1414"

echo "=== 1. Listando Categorias ==="
curl -s "$BASE_URL/categorias" | jq .

echo -e "\n=== 2. Listando Produtos ==="
curl -s "$BASE_URL/produtos" | jq .

echo -e "\n=== 3. Testando Integridade Referencial (Erro 400 esperado) ==="
curl -s -X DELETE "$BASE_URL/categorias/1" | jq .

echo -e "\n=== 4. Testando Rota Inexistente (Erro 404 esperado) ==="
curl -s "$BASE_URL/rota-invalida" | jq .
