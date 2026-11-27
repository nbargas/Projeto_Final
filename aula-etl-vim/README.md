# Do Back-End ao Big Data: Pipelines ETL e Observabilidade no Vim

Entrega dos scripts: **04/12**.

## Bloco 1 - Vim "Pro"
    ./scripts/instalar_vimrc.sh && vim exemplos/api.js

| Tag | Cor | Uso |
|---|---|---|
| [FLUXO] | Azul | Entradas: req.body, req.query, leitura de arquivos/APIs |
| [TRANSF] | Verde | Regras de negócio, filter/map, toUpperCase, parsing |
| [ERRO] | Vermelho | Validações, 400/404/500, try/catch |

## Bloco 2 - ETL de logs
    ./scripts/etl_logs.sh data/access.log data/resumo.csv
    ./scripts/auditar_tags.sh exemplos
