  # Exercício — API REST com autenticação JWT 

  ## Contexto

  Você vai completar uma API de **gerenciamento de tarefas**. O projeto tem
  dois modelos que precisam ser relacionados:

  - **Usuário** (`Usuario`) — quem usa o sistema.
  - **Tarefa** (`Tarefa`) — pertence a um usuário (relacionamento `1:N`: um
    usuário tem várias tarefas, cada tarefa pertence a um único usuário).


  ## O que já está pronto

  - Configuração do Sequelize com SQLite.
  - Os modelos `Usuario` e `Tarefa` (`src/models/`), mas **ainda sem o
    relacionamento entre eles** — isso é parte do exercício.
  - `POST /api/auth/registrar` — cria um usuário e já criptografa a senha
    com `bcrypt.hash()`. Use este método como referência: ele mostra como a
    senha é transformada em hash antes de ir para o banco, o que você vai
    precisar entender para implementar o login.
  - `GET /api/tarefas` (`listar`) — já implementado, serve de modelo para
    você completar os demais métodos do controller de tarefas.

  ## O que você precisa fazer

  ### 1. Variáveis de ambiente com dotenv — `src/server.js`

  O projeto já tem um arquivo `.env.example` com três variáveis
  (`PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`) e a biblioteca `dotenv` já está
  no `package.json`, mas ninguém está carregando o arquivo `.env` ainda.

  - Copie `.env.example` para `.env` (isso já está no passo "Como rodar o
    projeto" abaixo) e, se quiser, troque o valor de `JWT_SECRET` por outro
    texto qualquer.
  - Em `src/server.js`, importe o `dotenv` e chame `dotenv.config()` — isso
    lê o arquivo `.env` e coloca cada variável dentro de `process.env`.
  - Essa chamada precisa ser a **primeira coisa** do arquivo, antes de
    qualquer outro `require`. O motivo: logo abaixo, `const PORT =
    process.env.PORT` já tenta ler a variável de ambiente — se o `.env`
    ainda não tiver sido carregado nesse momento, `process.env.PORT` estará
    `undefined`. O mesmo vale para outros arquivos do projeto que leem
    `process.env` (como `src/utils/jwt.js` e o middleware de autenticação):
    eles só funcionam corretamente se o `.env` já tiver sido carregado antes
    de o servidor começar a atender requisições.

  ### 2. Gerar o token JWT — `src/utils/jwt.js`

  A função `gerarToken(usuarioId)` está vazia. Ela é usada pelo `login`
  (próxima tarefa) para criar o token que o usuário vai enviar nas
  requisições privadas. Implemente-a usando `jwt.sign`:

  - O primeiro argumento é o **payload** — os dados que você quer guardar
    dentro do token. Use `{ id: usuarioId }`.
  - O segundo argumento é o **segredo** usado para assinar o token, que
    deve vir de `process.env.JWT_SECRET` (por isso a tarefa 1 precisa vir
    antes desta: sem o `dotenv.config()`, essa variável estaria
    `undefined`).
  - O terceiro argumento é um objeto de opções — use `{ expiresIn: '1h' }`
    para o token expirar em 1 hora (você também pode ler esse valor de
    `process.env.JWT_EXPIRES_IN`, que já existe no `.env.example`).
  - A função deve **retornar** a string do token gerado por `jwt.sign`.

  ### 3. Relacionamento entre os modelos — `src/models/index.js`

  Os modelos `Usuario` e `Tarefa` existem, mas ainda não estão relacionados.
  Complete o arquivo com as duas chamadas do Sequelize que criam o
  relacionamento `1:N` (um usuário tem várias tarefas / uma tarefa pertence
  a um usuário), usando `usuarioId` como chave estrangeira. O arquivo tem um
  comentário `TODO` explicando os detalhes.

  Sem esse passo, o Sequelize não cria a coluna `usuarioId` na tabela de
  tarefas, e as tarefas de login e do controller de tarefas não vão
  funcionar — faça este passo antes delas.

  Coloque as configuração do Sequelize também no .env

  ### 4. Login — `src/controllers/auth.controller.js`

  O método `login` está vazio, com os passos comentados (`TODO 1` a
  `TODO 5`). Antes de implementar, leia o comentário logo acima da função:
  ele explica **como o `bcrypt.compare` funciona** e por que o login não
  "descriptografa" a senha salva — ele re-hasheia a senha digitada e compara
  os hashes. Resumo:

  - No cadastro, a senha passa por `bcrypt.hash(senha, 10)`, que gera um
    hash de mão única — não existe uma função para reverter um hash de
    volta à senha original.
  - Todo hash do bcrypt já leva embutido nele mesmo um "salt" (valor
    aleatório que garante que a mesma senha nunca gere o mesmo hash duas
    vezes), então não é preciso guardar o salt em outro lugar.
  - No login, `bcrypt.compare(senhaDigitada, hashSalvo)` lê esse salt de
    dentro do hash salvo, aplica o mesmo algoritmo na senha digitada e
    compara os dois hashes — devolvendo `true` ou `false` (via Promise).

  Depois de entender isso, implemente o método buscando o usuário pelo
  email, validando a senha com `bcrypt.compare`, implemente a geração do token
  com `gerarToken()` e respondendo com os dados do usuário (sem a senha) e o
  token.

  ### 5. Middleware de autenticação — `src/middlewares/auth.middleware.js`

  Este é o principal exercício do projeto. O arquivo tem 5 passos comentados
  (`TODO 1` a `TODO 5`) explicando o que fazer:

  1. Ler o cabeçalho `Authorization` da requisição; se não existir, responder
    `401`.
  2. Separar a palavra `Bearer` do token (formato: `Bearer <token>`).
  3. Validar o token com `jwt.verify(token, process.env.JWT_SECRET)`,
    tratando erro (token inválido/expirado) com `401`.
  4. Guardar o id do usuário decodificado do token em `req.usuarioId`.
  5. Chamar `next()` para a requisição continuar até o controller.

  ### 6. Proteger a rota de perfil — `src/routes/auth.routes.js`

  A rota `GET /api/auth/perfil` (que já tem o controller pronto) ainda está
  pública. Adicione o middleware `autenticar` a ela. Use essa rota para
  testar se o seu middleware está funcionando antes de seguir para as rotas
  de tarefas.

  ### 7. Proteger as rotas de tarefas — `src/routes/tarefa.routes.js`

  Todas as rotas de `/api/tarefas` devem exigir token válido. Aplique o
  middleware `autenticar` a elas (individualmente ou de uma vez com
  `router.use(autenticar)`).

  ### 8. Completar o controller de tarefas — `src/controllers/tarefa.controller.js`

  O método `listar` já está implementado e mostra o padrão a seguir: use
  `req.usuarioId` (definido pelo middleware) para saber qual usuário está
  fazendo a requisição. Complete os métodos que faltam:

  - **`criar`** — cria uma tarefa vinculada ao usuário logado
    (`usuarioId: req.usuarioId`).
  - **`buscarPorId`** — busca uma tarefa pelo `id` da rota. Se não existir,
    `404`. Se existir mas pertencer a **outro** usuário, `403` (o usuário
    logado não pode ver tarefas de outra pessoa).
  - **`atualizar`** — mesmas checagens de `buscarPorId`, depois atualiza os
    campos enviados.
  - **`remover`** — mesmas checagens, depois remove a tarefa e responde
    `204`.

  ## Como rodar o projeto

  O servidor sobe em `http://localhost:4567`. Use o arquivo `requests.http`
  (extensão "REST Client" do VS Code) ou o ThunderClient para testar os
  endpoints.

  ## Comportamento esperado ao final

  | Requisição | Sem token | Com token válido | Com token de outro dono (quando aplicável) |
  |---|---|---|---|
  | `GET /api/auth/perfil` | `401` | `200` | — |
  | `GET /api/tarefas` | `401` | `200` (só as tarefas do usuário logado) | — |
  | `POST /api/tarefas` | `401` | `201` | — |
  | `GET /api/tarefas/:id` | `401` | `200` (se for dono) | `403` |
  | `PUT /api/tarefas/:id` | `401` | `200` (se for dono) | `403` |
  | `DELETE /api/tarefas/:id` | `401` | `204` (se for dono) | `403` |

