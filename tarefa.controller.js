const { Tarefa } = require('../models');

async function listar(req, res) {
  try {
    const tarefas = await Tarefa.findAll({
      where: { usuarioId: req.usuarioId },
      order: [['createdAt', 'DESC']],
    });

    return res.json(tarefas);

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao listar tarefas.',
      detalhes: erro.message
    });
  }
}

async function criar(req, res) {
  try {
    const { titulo, descricao } = req.body;

    if (!titulo) {
      return res.status(400).json({
        erro: 'titulo é obrigatório.'
      });
    }

    const tarefa = await Tarefa.create({
      titulo,
      descricao,
      usuarioId: req.usuarioId,
    });

    return res.status(201).json(tarefa);

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao criar tarefa.',
      detalhes: erro.message
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({
        erro: 'Tarefa não encontrada.'
      });
    }

    if (tarefa.usuarioId !== req.usuarioId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para acessar esta tarefa.'
      });
    }

    return res.json(tarefa);

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao buscar tarefa.',
      detalhes: erro.message
    });
  }
}

async function atualizar(req, res) {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({
        erro: 'Tarefa não encontrada.'
      });
    }

    if (tarefa.usuarioId !== req.usuarioId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para alterar esta tarefa.'
      });
    }

    const { titulo, descricao, concluida } = req.body;

    await tarefa.update({
      titulo,
      descricao,
      concluida,
    });

    return res.json(tarefa);

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao atualizar tarefa.',
      detalhes: erro.message
    });
  }
}

async function remover(req, res) {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({
        erro: 'Tarefa não encontrada.'
      });
    }

    if (tarefa.usuarioId !== req.usuarioId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para remover esta tarefa.'
      });
    }

    await tarefa.destroy();

    return res.status(204).send();

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao remover tarefa.',
      detalhes: erro.message
    });
  }
}

module.exports = {
  listar,
  criar,
  buscarPorId,
  atualizar,
  remover
};