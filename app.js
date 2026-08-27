const express = require('express');

const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Tarefas — veja o enunciado.md para as instruções do exercício.'
  });
});

module.exports = app;