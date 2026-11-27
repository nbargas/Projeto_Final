#!/bin/bash
# ==============================================================================
# MINI-PIPELINE ANALITICO ETL — PROJETO FINAL SENAI
# Extract ([FLUXO]) -> Transform ([TRANSF]) -> Load (dataset_analitico.csv)
# ==============================================================================

URL="http://10.85.198.243:1414"
ARQUIVO_CSV="dataset_analitico.csv"

echo -e "\033[1;34m[FLUXO] 1. EXTRACT — Extraindo dados brutos da API ($URL)...\033[0m"
# [FLUXO] Consome endpoints /produtos e /categorias via curl
PRODUTOS=$(curl -s "$URL/produtos?limit=1000")
CATEGORIAS=$(curl -s "$URL/categorias")

if [ -z "$PRODUTOS" ] || ! echo "$PRODUTOS" | jq -e . >/dev/null 2>&1; then
  # [ERRO] Interrompe pipeline caso a API esteja offline ou retorne JSON invalido
  echo -e "\033[1;31m[ERRO] Falha na extracao: verifique se o servidor esta rodando (node index.js).\033[0m"
  exit 1
fi

echo -e "\033[1;32m[TRANSF] 2. TRANSFORM — Limpando strings, cruzando categorias e calculando metricas...\033[0m"
# [TRANSF] Normaliza nomes em MAIUSCULO, calcula valor total em estoque e classifica status
jq -n -r --argjson p "$PRODUTOS" --argjson c "$CATEGORIAS" '
  ($p.dados // $p.produtos // $p) as $prods |
  ($c.dados // $c.categorias // $c) as $cats |
  (["ID", "PRODUTO", "CATEGORIA", "PRECO_UNITARIO", "QUANTIDADE", "VALOR_TOTAL_ESTOQUE", "STATUS_ESTOQUE"] | @csv),
  (
    $prods[] |
    . as $item |
    (($cats[] | select(.id == $item.categoriaId) | .nome) // "SEM CATEGORIA") as $catNome |
    [
      $item.id,
      ($item.nome | ascii_upcase),
      ($catNome | ascii_upcase),
      $item.preco,
      $item.quantidade,
      ((($item.preco * $item.quantidade) * 100 | round) / 100),
      (if $item.quantidade <= 10 then "CRITICO" else "NORMAL" end)
    ] | @csv
  )
' > "$ARQUIVO_CSV"

echo -e "\033[1;34m[FLUXO] 3. LOAD — Dataset exportado com sucesso para '$ARQUIVO_CSV'!\033[0m"
echo ""
echo "=== PREVIEW DO DATASET GERADO (PRIMEIRAS 10 LINHAS) ==="
head -n 10 "$ARQUIVO_CSV"
echo "====================================================="
