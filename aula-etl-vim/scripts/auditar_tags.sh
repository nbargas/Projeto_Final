#!/usr/bin/env bash
# Uso: ./scripts/auditar_tags.sh [diretório]
DIR="${1:-.}"
for t in FLUXO TRANSF ERRO; do
  case $t in FLUXO) c=34;; TRANSF) c=32;; ERRO) c=31;; esac
  printf "\n\033[1;%sm== [%s] ==\033[0m\n" "$c" "$t"
  grep -rn --include='*.js' --include='*.sh' "\[$t\]" "$DIR" || echo "(nenhuma)"
done
