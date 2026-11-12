# Guia de Contribuicao

Este projeto segue boas praticas de versionamento e arquitetura MVC.

## Padrao de Commits (Conventional Commits)

- `feat:` Nova funcionalidade implementada
- `fix:` Correcao de bug ou falha
- `docs:` Alteracoes em documentacao (`README.md`, `requests.http`, etc.)
- `test:` Adicao ou ajuste de scripts de teste
- `chore:` Tarefas de configuracao e manutencao

## Fluxo de Trabalho

1. Sincronize o repositorio antes de iniciar: `git pull origin main`
2. Realize as alteracoes respeitando a separacao entre `routes/`, `controllers/` e `data/`
3. Teste os endpoints localmente antes de realizar o `git push`
