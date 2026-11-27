#!/bin/bash

# [FLUXO] Definindo endpoint de origem e arquivo CSV de destino
API_URL="http://10.85.198.243:1414/produtos?limit=1000"
CSV_OUT="dataset_analitico.csv"

echo -e "\033[1;34m[FLUXO] Extraindo dados brutos da API...\033[0m"
DADOS_JSON=$(curl -s "$API_URL")

# [ERRO] Verificando se a API respondeu com conteúdo válido
if [ -z "$DADOS_JSON" ] || [ "$DADOS_JSON" == "[]" ] || ! echo "$DADOS_JSON" | jq -e . >/dev/null 2>&1; then
  echo -e "\033[1;31m[ERRO] Falha na extração: API offline ou sem registros.\033[0m"
  exit 1
fi

# [TRANSF] Convertendo JSON para formato tabular CSV usando jq
echo -e "\033[1;32m[TRANSF] Transformando JSON em CSV...\033[0m"
echo "$DADOS_JSON" | jq -r '
  (if type == "array" then . else (.dados // .produtos // []) end) as $lista |
  (["ID","NOME","PRECO","QUANTIDADE","VALOR_TOTAL","STATUS_ESTOQUE"] | @csv),
  ($lista[] | [
    .id,
    (.nome | ascii_upcase),
    .preco,
    .quantidade,
    (((.preco * .quantidade) * 100 | round) / 100),
    (if .quantidade <= 10 then "CRITICO" else "NORMAL" end)
  ] | @csv)
' > "$CSV_OUT"

echo -e "\033[1;32m[SUCESSO] Dataset gerado em $CSV_OUT:\033[0m"
cat "$CSV_OUT"
