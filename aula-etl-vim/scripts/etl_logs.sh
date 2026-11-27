#!/usr/bin/env bash
# Uso: ./scripts/etl_logs.sh data/access.log [saida.csv]
set -euo pipefail
LOG="${1:?uso: $0 arquivo.log [saida.csv]}"
OUT="${2:-data/resumo.csv}"

# [FLUXO] EXTRACT: lê apenas linhas com tags semânticas
extrair() { grep -E '\[(FLUXO|TRANSF|ERRO)\]' "$LOG"; }

# [TRANSF] TRANSFORM: gera CSV (timestamp,tag,mensagem)
transformar() { sed -E 's/^([^ ]+) \[([A-Z]+)\] (.*)$/\1,\2,\3/'; }

# [FLUXO] LOAD: grava CSV + agregação por tag
{ echo "timestamp,tag,mensagem"; extrair | transformar; } > "$OUT"
echo "== Eventos por tag =="
tail -n +2 "$OUT" | cut -d, -f2 | sort | uniq -c | sort -rn
echo "== Códigos HTTP de erro =="
# [ERRO] extrai códigos 4xx/5xx
grep -oE '\[ERRO\] [45][0-9]{2}' "$LOG" | awk '{print $2}' | sort | uniq -c
echo "CSV gerado em: $OUT"
