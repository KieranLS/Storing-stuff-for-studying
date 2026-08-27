const sequelize = require('../config/database');

const Usuario = require('./usuario.model');
const Tarefa = require('./tarefa.model');

Usuario.hasMany(Tarefa, {
  foreignKey: 'usuarioId',
  as: 'tarefas',
});

Tarefa.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

module.exports = { sequelize, Usuario, Tarefa };