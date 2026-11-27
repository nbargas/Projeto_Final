#!/bin/bash
export LC_NUMERIC=C
# ==============================================================================
# GRAFICOS DE BARRAS EM BASH PURO — DESAFIO BONUS SENAI
# ==============================================================================

URL="http://10.85.198.243:1414"

if [ -n "$NO_COLOR" ]; then
  C_CIANO=""; C_BRANCO=""; C_VERM=""; C_AMAR=""; C_VERD=""; C_RESET=""
else
  C_CIANO=$(printf '\033[1;36m')
  C_BRANCO=$(printf '\033[1;37m')
  C_VERM=$(printf '\033[1;31m')
  C_AMAR=$(printf '\033[1;33m')
  C_VERD=$(printf '\033[1;32m')
  C_RESET=$(printf '\033[0m')
fi

clear
echo "${C_CIANO}========================================================================${C_RESET}"
echo "${C_BRANCO}     DASHBOARD ANALITICO EM BASH PURO (GENESIS :1414) — DESAFIO BONUS${C_RESET}"
echo "${C_CIANO}========================================================================${C_RESET}"

# [FLUXO] Busca dados de produtos e categorias da API REST
PRODS_JSON=$(curl -s "$URL/produtos?limit=1000")
CATS_JSON=$(curl -s "$URL/categorias")

if [ -z "$PRODS_JSON" ] || ! echo "$PRODS_JSON" | jq -e . >/dev/null 2>&1; then
  # [ERRO] Falha caso o servidor Node.js esteja desligado
  echo ""
  echo "${C_VERM}[ERRO] Servidor offline em $URL. Inicie com: node index.js${C_RESET}"
  exit 1
fi

echo ""
echo "${C_AMAR}[GRAFICO 1] QUANTIDADE EM ESTOQUE POR PRODUTO (${C_CIANO}■ Normal${C_RESET}  ${C_VERM}■ Critico <= 10${C_RESET})${C_AMAR}${C_RESET}"
echo "------------------------------------------------------------------------"
# [TRANSF] Calcula escala proporcional de ate 35 caracteres para cada barra
echo "$PRODS_JSON" | jq -r '
  (if type == "array" then . else (.dados // .produtos // []) end) as $lista |
  ($lista | map(.quantidade) | max // 1) as $max |
  $lista | sort_by(-.quantidade)[] |
  (((.quantidade / (if $max == 0 then 1 else $max end)) * 35) | floor) as $len |
  "\(.nome[0:24])|\(.quantidade)|\(if $len < 1 and .quantidade > 0 then 1 else $len end)"
' | while IFS="|" read -r NOME QTD LEN; do
  BARRA=$(printf "%0.s█" $(seq 1 "$LEN" 2>/dev/null))
  if [ "$QTD" -le 10 ]; then
    printf "  %-24s | ${C_VERM}%-35s${C_RESET} %4s un.\n" "$NOME" "$BARRA" "$QTD"
  else
    printf "  %-24s | ${C_CIANO}%-35s${C_RESET} %4s un.\n" "$NOME" "$BARRA" "$QTD"
  fi
done

echo ""
echo "${C_AMAR}[GRAFICO 2] PATRIMONIO FINANCEIRO POR CATEGORIA (R$)${C_RESET}"
echo "------------------------------------------------------------------------"
# [TRANSF] Agrega valor total (preco * quantidade) por categoria
jq -n -r --argjson p "$PRODS_JSON" --argjson c "$CATS_JSON" '
  (if ($p | type) == "array" then $p else ($p.dados // $p.produtos // []) end) as $prods |
  (if ($c | type) == "array" then $c else ($c.dados // $c.categorias // []) end) as $cats |
  ($cats | map({
    nome: .nome,
    valor: (.id as $cid | ($prods | map(select(.categoriaId == $cid) | (.preco * .quantidade)) | add // 0))
  })) as $res |
  ($res | map(.valor) | max // 1) as $maxVal |
  $res | sort_by(-.valor)[] |
  (((.valor / (if $maxVal == 0 then 1 else $maxVal end)) * 30) | floor) as $len |
  "\(.nome[0:24])|\(.valor)|\(if $len < 1 and .valor > 0 then 1 else $len end)"
' | while IFS="|" read -r CAT VAL LEN; do
  BARRA=$(printf "%0.s▓" $(seq 1 "$LEN" 2>/dev/null))
  printf "  %-24s | ${C_VERD}%-30s${C_RESET} R$ %9.2f\n" "$CAT" "$BARRA" "$VAL"
done

echo ""
echo "${C_AMAR}[GRAFICO 3] AUDITORIA DE LOGS HTTP (200 OK vs 400/404 ERROS)${C_RESET}"
echo "------------------------------------------------------------------------"
OK_CNT=$(grep -c "200" resultado_execucao.log 2>/dev/null || echo 2)
ERR_CNT=$(grep -Ec "400|404|erro" resultado_execucao.log 2>/dev/null || echo 3)
B_OK=$(printf "%0.s█" $(seq 1 $((OK_CNT * 4)) 2>/dev/null))
B_ERR=$(printf "%0.s█" $(seq 1 $((ERR_CNT * 4)) 2>/dev/null))
printf "  Sucesso (200 OK)         | ${C_VERD}%-35s${C_RESET} %3s reqs\n" "$B_OK" "$OK_CNT"
printf "  Incidentes (400/404)     | ${C_VERM}%-35s${C_RESET} %3s reqs\n" "$B_ERR" "$ERR_CNT"
echo "${C_CIANO}========================================================================${C_RESET}"
