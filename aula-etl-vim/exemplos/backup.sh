#!/usr/bin/env bash
# [FLUXO] entrada: diretório de origem vindo do argumento
ORIGEM="${1:-/var/log}"

# [ERRO] validação: diretório precisa existir
[ -d "$ORIGEM" ] || { echo "[ERRO] diretório inválido: $ORIGEM"; exit 1; }

# [TRANSF] normalização do nome do arquivo de backup
NOME="backup_$(basename "$ORIGEM")_$(date +%Y%m%d).tar.gz"
tar -czf "/tmp/$NOME" "$ORIGEM" 2>/dev/null && echo "[FLUXO] gerado /tmp/$NOME"
