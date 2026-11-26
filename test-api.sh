#!/bin/bash
URL="http://localhost:1414"

# [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
pausar() { echo ""; read -p "Pressione [ENTER] para voltar..." _; }

submenu_categorias() {
  while true; do
    clear
    echo "===================================================="
    echo "   [1] GESTAO DE CATEGORIAS (6 OPERACOES)           "
    echo "===================================================="
    echo "  [1] Listar todas as Categorias (com contagem)"
    echo "  [2] Buscar Categoria por Nome"
    echo "  [3] Detalhar Categoria por ID (com seus produtos)"
    echo "  [4] Cadastrar nova Categoria (POST)"
    echo "  [5] Renomear Categoria existente (PUT)"
    echo "  [6] Excluir Categoria vazia (DELETE)"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) curl -s "$URL/categorias" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) read -p "Termo de busca: " b; curl -s "$URL/categorias?busca=$b" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) read -p "ID da Categoria: " id; curl -s "$URL/categorias/$id" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) read -p "Nome da nova Categoria: " n; curl -s -X POST "$URL/categorias" -H "Content-Type: application/json" -d "{\"nome\":\"$n\"}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      5) read -p "ID da Categoria: " id; read -p "Novo nome: " n; curl -s -X PUT "$URL/categorias/$id" -H "Content-Type: application/json" -d "{\"nome\":\"$n\"}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      6) read -p "ID da Categoria para excluir: " id; curl -s -X DELETE "$URL/categorias/$id" | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

submenu_consultas_produtos() {
  while true; do
    clear
    echo "===================================================="
    echo "   [2] CONSULTAS E FILTROS DE PRODUTOS (8 OPCOES)   "
    echo "===================================================="
    echo "  [1] Listar todos os Produtos (GET)"
    echo "  [2] Buscar Produto especifico por ID (GET /:id)"
    echo "  [3] Buscar Produto por Nome (ex: Monitor, Teclado)"
    echo "  [4] Filtrar Produtos por Categoria"
    echo "  [5] Filtrar Produtos por Faixa de Preco (Min/Max)"
    echo "  [6] Ordenar Produtos por Preco (Menor -> Maior)"
    echo "  [7] Ordenar Produtos por Preco (Maior -> Menor)"
    echo "  [8] Listar Produtos Paginados (Pagina e Limite)"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) curl -s "$URL/produtos" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) read -p "ID do Produto: " id; curl -s "$URL/produtos/$id" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) read -p "Nome ou parte do nome: " b; curl -s "$URL/produtos?busca=$b" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) read -p "ID da Categoria (1 a 5): " c; curl -s "$URL/produtos?categoriaId=$c" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      5) read -p "Preco minimo: " min; read -p "Preco maximo: " max; curl -s "$URL/produtos?minPreco=$min&maxPreco=$max" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      6) curl -s "$URL/produtos?sort=preco_asc" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      7) curl -s "$URL/produtos?sort=preco_desc" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      8) read -p "Numero da Pagina (ex: 1): " p; read -p "Itens por pagina (ex: 5): " l; curl -s "$URL/produtos?page=$p&limit=$l" | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

submenu_crud_produtos() {
  while true; do
    clear
    echo "===================================================="
    echo "   [3] CADASTRO E EDICAO DE PRODUTOS (6 OPCOES)     "
    echo "===================================================="
    echo "  [1] Cadastrar novo Produto (POST)"
    echo "  [2] Atualizar Produto completo (PUT)"
    echo "  [3] Atualizar apenas Preco do Produto (PATCH)"
    echo "  [4] Atualizar apenas Nome do Produto (PATCH)"
    echo "  [5] Atualizar apenas Categoria do Produto (PATCH)"
    echo "  [6] Excluir Produto definitivamente (DELETE)"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) read -p "Nome: " nome; read -p "Preco: " preco; read -p "Quantidade: " qtd; read -p "ID Categoria: " cat; curl -s -X POST "$URL/produtos" -H "Content-Type: application/json" -d "{\"nome\":\"$nome\",\"preco\":${preco//,/.},\"quantidade\":$qtd,\"categoriaId\":$cat}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) read -p "ID: " id; read -p "Novo Nome: " nome; read -p "Novo Preco: " preco; read -p "Nova Qtd: " qtd; read -p "Novo ID Cat: " cat; curl -s -X PUT "$URL/produtos/$id" -H "Content-Type: application/json" -d "{\"nome\":\"$nome\",\"preco\":${preco//,/.},\"quantidade\":$qtd,\"categoriaId\":$cat}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) read -p "ID: " id; read -p "Novo Preco: " preco; curl -s -X PATCH "$URL/produtos/$id" -H "Content-Type: application/json" -d "{\"preco\":${preco//,/.}}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) read -p "ID: " id; read -p "Novo Nome: " nome; curl -s -X PATCH "$URL/produtos/$id" -H "Content-Type: application/json" -d "{\"nome\":\"$nome\"}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      5) read -p "ID: " id; read -p "Novo ID Categoria: " cat; curl -s -X PATCH "$URL/produtos/$id" -H "Content-Type: application/json" -d "{\"categoriaId\":$cat}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      6) read -p "ID para deletar: " id; curl -s -X DELETE "$URL/produtos/$id" | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

submenu_estoque() {
  while true; do
    clear
    echo "===================================================="
    echo "   [4] MOVIMENTACAO DE ESTOQUE E PRECOS (5 OPCOES)  "
    echo "===================================================="
    echo "  [1] Registrar ENTRADA de mercadoria (+ Estoque)"
    echo "  [2] Registrar SAIDA / Venda (- Estoque)"
    echo "  [3] Ver Historico completo de Movimentacoes"
    echo "  [4] Filtrar Historico por Produto especifico"
    echo "  [5] Aplicar Reajuste Percentual de Precos em Lote"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) read -p "ID do Produto: " id; read -p "Qtd entrada: " qtd; read -p "Observacao: " obs; curl -s -X POST "$URL/produtos/$id/movimentacao" -H "Content-Type: application/json" -d "{\"tipo\":\"ENTRADA\",\"quantidade\":$qtd,\"observacao\":\"$obs\"}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) read -p "ID do Produto: " id; read -p "Qtd saida: " qtd; read -p "Observacao: " obs; curl -s -X POST "$URL/produtos/$id/movimentacao" -H "Content-Type: application/json" -d "{\"tipo\":\"SAIDA\",\"quantidade\":$qtd,\"observacao\":\"$obs\"}" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) curl -s "$URL/produtos/estoque/movimentacoes" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) read -p "ID do Produto: " id; curl -s "$URL/produtos/estoque/movimentacoes?produtoId=$id" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      5) read -p "ID Categoria (Enter para TODAS): " cat; read -p "Percentual (ex: 10 ou -15): " perc; [ -z "$cat" ] && BODY="{\"percentual\":${perc//,/.}}" || BODY="{\"categoriaId\":$cat,\"percentual\":${perc//,/.}}"; curl -s -X POST "$URL/produtos/reajuste-precos" -H "Content-Type: application/json" -d "$BODY" | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

submenu_relatorios() {
  while true; do
    clear
    echo "===================================================="
    echo "   [5] RELATORIOS GERENCIAIS E AUDITORIA (4 OPCOES) "
    echo "===================================================="
    echo "  [1] Dashboard Executivo (Patrimonio, Totais e Resumo)"
    echo "  [2] Alerta de Estoque Critico (<= 10 unidades)"
    echo "  [3] Ranking de Produtos com Menor Estoque"
    echo "  [4] Health Check da API (Status e Uptime)"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) curl -s "$URL/produtos/relatorio/geral" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) curl -s "$URL/produtos?estoqueCritico=true" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) curl -s "$URL/produtos?sort=qtd_asc" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) curl -s "$URL/health" | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

submenu_seguranca() {
  while true; do
    clear
    echo "===================================================="
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "   [6] TESTES DE BLINDAGEM E ERROS HTTP (6 OPCOES)  "
    echo "===================================================="
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "  [1] Erro 400 - Bloquear exclusao de categoria em uso"
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "  [2] Erro 400 - Bloquear saida maior que estoque atual"
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "  [3] Erro 400 - Bloquear caracteres especiais / SQLi"
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "  [4] Erro 415 - Enviar requisicao sem Content-Type JSON"
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    echo "  [5] Erro 404 - Acessar rota inexistente na API"
    echo "  [6] SISTEMA  - Restaurar banco de dados original"
    echo "  [0] Voltar ao Menu Principal"
    echo "===================================================="
    # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
    read -p "Escolha uma opcao: " op; echo ""
    case "$op" in
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      1) curl -s -X DELETE "$URL/categorias/1" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      2) curl -s -X POST "$URL/produtos/6/movimentacao" -H "Content-Type: application/json" -d '{"tipo":"SAIDA","quantidade":9999}' | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      3) curl -s -X POST "$URL/produtos" -H "Content-Type: application/json" -d '{"nome":"<script>alert(1)</script>","preco":10,"quantidade":1,"categoriaId":1}' | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      4) curl -s -X POST "$URL/categorias" -d "nome=TesteSemJson" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      5) curl -s "$URL/rota-fantasma-teste" | jq .; pausar ;;
      # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
      6) curl -s -X POST "$URL/produtos/sistema/reset" -H "Content-Type: application/json" -d '{}' | jq .; pausar ;;
      0) break ;;
      *) echo "Opcao invalida!"; sleep 1 ;;
    esac
  done
}

while true; do
  clear
  echo "===================================================="
  echo "   CENTRAL DE CONTROLE DA API - PROJETO FINAL       "
  echo "   (35 Operacoes Integradas em 6 Modulos)           "
  echo "===================================================="
  echo "  [1] Gestao de Categorias           (6 opcoes)"
  echo "  [2] Consultas e Filtros de Produtos (8 opcoes)"
  echo "  [3] Cadastro e Edicao de Produtos   (6 opcoes)"
  echo "  [4] Movimentacao de Estoque e Preco (5 opcoes)"
  echo "  [5] Relatorios e Dashboard          (4 opcoes)"
  echo "  [6] Testes de Seguranca e Sistema   (6 opcoes)"
  echo "  [7] Grafico                         (Dashboard Web)"
  echo "  [0] Sair"
  echo "===================================================="
  # [FLUXO] Envio de requisicao HTTP ou leitura de entrada do usuario
  read -p "Selecione o modulo desejado: " modulo
  case "$modulo" in
    1) submenu_categorias ;;
    2) submenu_consultas_produtos ;;
    3) submenu_crud_produtos ;;
    4) submenu_estoque ;;
    5) submenu_relatorios ;;
    6) submenu_seguranca ;;
    7)
      clear
      echo "=========================================================="
      echo "      DASHBOARD EXECUTIVO & GRAFICOS DE ESTOQUE"
      echo "=========================================================="
      echo ""
      # [FLUXO] Verifica se o servidor Genesis esta online e exibe a URL da View
      if curl -s "$URL/health" >/dev/null 2>&1; then
        echo -e "Status do Servidor : \033[1;32mONLINE (Genesis :1414)\033[0m"
      else
        echo -e "Status do Servidor : \033[1;33mOFFLINE (Inicie com: node index.js)\033[0m"
      fi
      echo ""
      echo -e "Acesse no navegador: \033[1;36mhttp://10.85.198.243:1414/grafico\033[0m"
      echo ""
      echo "Dica: Segure CTRL e clique no link acima para abrir direto!"
      echo "=========================================================="
      pausar
      ;;
    0) echo "Encerrando central de testes..."; break ;;
    # [ERRO] Simulacao ou verificacao de falha HTTP e blindagem
    *) echo "Modulo invalido!"; sleep 1 ;;
  esac
done
