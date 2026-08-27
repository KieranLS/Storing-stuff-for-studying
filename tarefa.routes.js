const { Router } = require('express');

const tarefaController = require('../controllers/tarefa.controller');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

router.use(autenticar);

router.get('/', tarefaController.listar);

router.post('/', tarefaController.criar);

router.get('/:id', tarefaController.buscarPorId);

router.put('/:id', tarefaController.atualizar);

router.delete('/:id', tarefaController.remover);

module.exports = router;