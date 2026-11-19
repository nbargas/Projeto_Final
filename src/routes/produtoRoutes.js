const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { safeHandler } = require('../middlewares/errorHandler');

router.get('/', safeHandler(produtoController.listarTodos));
router.get('/relatorio/geral', safeHandler(produtoController.relatorioGeral));
router.get('/estoque/movimentacoes', safeHandler(produtoController.listarMovimentacoes));
router.get('/:id', safeHandler(produtoController.obterPorId));

router.post('/', safeHandler(produtoController.criar));
router.post('/:id/movimentacao', safeHandler(produtoController.movimentarEstoque));
router.post('/reajuste-precos', safeHandler(produtoController.reajustarPrecos));
router.post('/sistema/reset', safeHandler(produtoController.resetarBanco));

router.put('/:id', safeHandler(produtoController.atualizar));
router.patch('/:id', safeHandler(produtoController.atualizarParcial));
router.delete('/:id', safeHandler(produtoController.remover));

module.exports = router;
