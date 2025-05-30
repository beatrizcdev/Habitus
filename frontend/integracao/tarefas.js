// Função para carregar tarefas
export async function carregarTarefas() {
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get('userId');
  if (!idUsuario) {
    console.error('ID do usuário não encontrado');
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:5000/tarefas/${idUsuario}`);
    if (!resposta.ok) throw new Error('Erro ao buscar tarefas');

    const tarefas = await resposta.json();
    const lista = document.getElementById("lista-tarefas");

    if (!lista) {
      console.error('Elemento lista-tarefas não encontrado');
      return;
    }

    lista.innerHTML = "";

    if (tarefas.length === 0) {
      lista.innerHTML = "<p class='nenhuma-tarefa'>Nenhuma tarefa cadastrada.</p>";
      return;
    }

    tarefas.forEach(tarefa => {
      const li = document.createElement("li");
      li.classList.add("item-tarefa");
      li.id = `tarefa-${tarefa.idTarefa}`;

      const check = document.createElement("span");
      check.classList.add("check-circle");
      if (tarefa.status === "concluída") {
        check.classList.add("checked");
      }

      const texto = document.createElement("span");
      texto.classList.add("texto-tarefa");
      texto.textContent = tarefa.nome;

      if (tarefa.status === "concluída") {
        texto.classList.add("checked");
      }

        check.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation(); // Adicione esta linha para parar a propagação do evento

        const idTarefa = tarefa.idTarefa;

        try {
            const resposta = await fetch(`http://localhost:5000/tarefa/${idTarefa}/concluir`, {
            method: 'PUT',
            });

            if (!resposta.ok) throw new Error("Erro ao atualizar tarefa");

            const resultado = await resposta.json();
            console.log(resultado.mensagem);

            check.classList.toggle("checked");
            texto.classList.toggle("checked");
            
            return false; // Adicione isso como precaução adicional
        } catch (erro) {
            console.error("Erro ao concluir tarefa:", erro);
            alert("Erro ao atualizar tarefa.");
            return false;
        }
        });

      li.appendChild(check);
      li.appendChild(texto);
      lista.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao buscar tarefas:", erro);
    alert("Erro ao carregar tarefas. Verifique o console para mais detalhes.");
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  // Elementos do modal
  const modal = document.getElementById("modal-tarefa");
  const btnAdd = document.querySelector(".btn-add");
  const btnSalvar = document.getElementById("btnSalvarTarefa");
  const btnCancelar = document.getElementById("btn-cancelar-tarefa");

  // Verificação dos elementos
  if (!modal) console.error("Modal não encontrado");
  if (!btnAdd) console.error("Botão add não encontrado");
  if (!btnSalvar) console.error("Botão salvar não encontrado");
  if (!btnCancelar) console.error("Botão cancelar não encontrado");

  // Evento para abrir modal
  btnAdd?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
  });

  // Evento para cancelar
  btnCancelar?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });

  // Evento para salvar tarefa
btnSalvar.addEventListener("click", async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const idUsuario = params.get('userId');
        
        // Validação robusta do ID
        if (!idUsuario || isNaN(Number(idUsuario))) {
            alert("ID de usuário inválido. Faça login novamente.");
            return;
        }

        const dadosTarefa = {
            nome: document.getElementById("titulo").value.trim(),
            descricao: document.getElementById("descricao").value.trim(),
            prioridade: document.querySelector('input[name="prioridade"]:checked')?.value,
            categoria: document.getElementById("categoria")?.value || null,
            dataLimite: document.getElementById("dataLimite").value
        };

        // Validação dos campos
        if (!dadosTarefa.nome || !dadosTarefa.descricao || !dadosTarefa.prioridade) {
            throw new Error("Preencha todos os campos obrigatórios");
        }

        const resposta = await fetch(`http://localhost:5000/tarefas/${idUsuario}/adicionar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosTarefa)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || "Erro ao criar tarefa");
        }

        // Sucesso
        alert("Tarefa criada com sucesso!");
        modal.classList.add("hidden");
        await carregarTarefas();
        
    } catch (error) {
        console.error("Erro:", error);
        alert(error.message || "Erro ao processar tarefa");
    }
});
  // Carrega as tarefas inicialmente
  carregarTarefas();
});