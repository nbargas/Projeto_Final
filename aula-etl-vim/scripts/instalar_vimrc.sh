#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$HOME/.vimrc" ] && cp "$HOME/.vimrc" "$HOME/.vimrc.bak.$(date +%s)" && echo "Backup criado."
cp "$DIR/vim/.vimrc" "$HOME/.vimrc"
echo "OK: ~/.vimrc instalado. Teste: vim exemplos/api.js"
