const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { safeHandler } = require('../middlewares/errorHandler');

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/', safeHandler(produtoController.listarTodos));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/relatorio/geral', safeHandler(produtoController.relatorioGeral));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/estoque/movimentacoes', safeHandler(produtoController.listarMovimentacoes));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/:id', safeHandler(produtoController.obterPorId));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.post('/', safeHandler(produtoController.criar));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.post('/:id/movimentacao', safeHandler(produtoController.movimentarEstoque));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.post('/reajuste-precos', safeHandler(produtoController.reajustarPrecos));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.post('/sistema/reset', safeHandler(produtoController.resetarBanco));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.put('/:id', safeHandler(produtoController.atualizar));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.patch('/:id', safeHandler(produtoController.atualizarParcial));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.delete('/:id', safeHandler(produtoController.remover));

module.exports = router;
