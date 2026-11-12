const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { safeHandler } = require('../middlewares/errorHandler');

router.get('/', safeHandler(categoriaController.listarTodas));
router.get('/:id', safeHandler(categoriaController.obterPorId));
router.post('/', safeHandler(categoriaController.criar));
router.put('/:id', safeHandler(categoriaController.atualizar));
router.delete('/:id', safeHandler(categoriaController.remover));

module.exports = router;
