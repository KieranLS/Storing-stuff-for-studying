import { useEffect, useState } from "react";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState("");

  // Busca as tarefas na API assim que o componente é montado
  useEffect(() => {
    fetch("/api/tarefas")
      .then((res) => res.json())
      .then(setTarefas);
  }, []);

  async function adicionarTarefa(event) {
    event.preventDefault();
    if (!texto.trim()) return;

    const response = await fetch("/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    const novaTarefa = await response.json();

    setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
    setTexto("");
  }

  return (
    <main>
      <h1>Minhas tarefas</h1>

      <form onSubmit={adicionarTarefa}>
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="O que você precisa fazer?"
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>{tarefa.texto}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
