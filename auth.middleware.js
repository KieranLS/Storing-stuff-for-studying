const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  // 1. Pegar Authorization
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      erro: 'Token não informado.'
    });
  }

  // 2. Separar Bearer do token
  const partes = authorization.split(' ');

  const token = partes[1];

  if (partes[0] !== 'Bearer' || !token) {
    return res.status(401).json({
      erro: 'Token inválido.'
    });
  }

  try {
    // 3. Validar token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Guardar ID do usuário
    req.usuarioId = payload.id;

    // 5. Continuar
    next();

  } catch (erro) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado.'
    });
  }
}

module.exports = autenticar;