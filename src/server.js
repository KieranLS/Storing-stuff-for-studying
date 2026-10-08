import express from "express";
import path from "path";
import {fileURLToPath} from "url";


const app = express();
app.use(express.json());

const _dirname = path.dirname(fileURLToPath(import.meta.url))


let tarefas = [{ id: 1, texto: "Testar a API pelo celular" }];

app.get("/api/tarefas", (_req, res) => {
  res.json(tarefas);
});

app.post("/api/tarefas", (req, res) => {
  const { texto } = req.body;

  if (!texto || !texto.trim()) {
    return res.status(400).json({ message: "O campo texto é obrigatório" });
  }

  const tarefa = { id: Date.now(), texto: texto.trim() };
  tarefas.push(tarefa);
  res.status(201).json(tarefa);
});

app.use(express.static(path.join(_dirname, "../frontend/dist")))

const PORT = process.env.PORT || 4567;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
