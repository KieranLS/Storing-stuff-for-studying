const bcrypt = require('bcryptjs');

const { Usuario } = require('../models');

const { gerarToken } = require('../utils/jwt');

async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'nome, email e senha são obrigatórios.'
      });
    }

    const usuarioExistente = await Usuario.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({
        erro: 'Já existe um usuário com este email.'
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao registrar usuário.',
      detalhes: erro.message
    });
  }
}

async function login(req, res) {
  try {
    // 1. Pegar email e senha
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'email e senha são obrigatórios.'
      });
    }

    // 2. Buscar usuário pelo email
    const usuario = await Usuario.findOne({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos.'
      });
    }

    // 3. Conferir senha
    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos.'
      });
    }

    // 4. Gerar token
    const token = gerarToken(usuario.id);

    // 5. Responder sem enviar a senha
    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token
    });

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao realizar login.',
      detalhes: erro.message
    });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId, {
      attributes: ['id', 'nome', 'email'],
    });

    if (!usuario) {
      return res.status(404).json({
        erro: 'Usuário não encontrado.'
      });
    }

    return res.json(usuario);

  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao buscar perfil.',
      detalhes: erro.message
    });
  }
}

module.exports = { registrar, login, perfil };