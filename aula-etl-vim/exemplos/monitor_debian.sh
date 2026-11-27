#!/usr/bin/env bash
# Monitor simples de disco e serviço no Debian
# Uso: ./exemplos/monitor_debian.sh [servico] [limite_disco_%]

# [FLUXO] entrada de dados: argumentos do usuário
SERVICO="${1:-ssh}"
LIMITE="${2:-80}"

# [FLUXO] leitura do sistema: uso da partição raiz
USO_BRUTO=$(df / | tail -n 1 | awk '{print $5}')

# [TRANSF] parsing: remove o símbolo % para comparar como número
USO="${USO_BRUTO%\%}"

# [ERRO] validação crítica: limite precisa ser um número
if ! [[ "$LIMITE" =~ ^[0-9]+$ ]]; then
  echo "limite inválido: $LIMITE" >&2
  exit 1
fi

# [ERRO] ponto de falha: disco acima do limite
if [ "$USO" -ge "$LIMITE" ]; then
  echo "ALERTA: disco em ${USO}% (limite ${LIMITE}%)"
else
  echo "Disco OK: ${USO}%"
fi

# [FLUXO] leitura do estado do serviço
STATUS=$(systemctl is-active "$SERVICO" 2>/dev/null || true)

# [TRANSF] normalização: texto em maiúsculas para o relatório
STATUS_UP=$(echo "${STATUS:-desconhecido}" | tr '[:lower:]' '[:upper:]')

# [ERRO] serviço fora do ar
if [ "$STATUS" != "active" ]; then
  echo "Serviço $SERVICO: $STATUS_UP (verifique com: systemctl status $SERVICO)"
else
  echo "Serviço $SERVICO: $STATUS_UP"
fi
