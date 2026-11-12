const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { safeHandler } = require('../middlewares/errorHandler');

router.get('/', safeHandler(produtoController.listarTodos));
router.get('/:id', safeHandler(produtoController.obterPorId));
router.post('/', safeHandler(produtoController.criar));
router.put('/:id', safeHandler(produtoController.atualizar));
router.delete('/:id', safeHandler(produtoController.remover));

module.exports = router;
