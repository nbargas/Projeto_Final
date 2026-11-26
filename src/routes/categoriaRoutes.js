const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { safeHandler } = require('../middlewares/errorHandler');

// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/', safeHandler(categoriaController.listarTodas));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.get('/:id', safeHandler(categoriaController.obterPorId));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.post('/', safeHandler(categoriaController.criar));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.put('/:id', safeHandler(categoriaController.atualizar));
// [FLUXO] Entrada de dados, roteamento HTTP ou leitura da base
router.delete('/:id', safeHandler(categoriaController.remover));

module.exports = router;
