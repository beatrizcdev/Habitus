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

      // Checkbox
      const check = document.createElement("span");
      check.classList.add("check-circle");
      if (tarefa.status === "concluída") {
        check.classList.add("checked");
      }

      // Texto da tarefa
      const texto = document.createElement("span");
      texto.classList.add("texto-tarefa");
      texto.textContent = tarefa.nome;
      if (tarefa.status === "concluída") {
        texto.classList.add("checked");
      }

      // Container do texto
      const textoContainer = document.createElement("div");
      textoContainer.classList.add("texto-container");
      textoContainer.appendChild(texto);

      // Prioridade
      const prioridadeBox = document.createElement("span");
      prioridadeBox.classList.add("prioridade-box");
      
      if (tarefa.prioridade === "alta") {
        prioridadeBox.classList.add("prioridade-alta");
      } else if (tarefa.prioridade === "media") {
        prioridadeBox.classList.add("prioridade-media");
      } else if (tarefa.prioridade === "baixa") {
        prioridadeBox.classList.add("prioridade-baixa");
      }

      // Montagem do elemento
      li.appendChild(check);
      li.appendChild(textoContainer);
      li.appendChild(prioridadeBox);

      const lixeira = document.createElement("span");
    lixeira.innerHTML = "🗑️"; // Ou use um ícone de sua preferência
    lixeira.classList.add("lixeira-exclusao");
    lixeira.title = "Excluir tarefa";

    // Adicione a lixeira ao item (coloque onde achar melhor)
    textoContainer.appendChild(lixeira);

    // Evento de clique na lixeira
    lixeira.addEventListener("click", async (event) => {
      event.stopPropagation(); // Impede que o modal de edição abra

      const confirmar = confirm(`Excluir a tarefa "${tarefa.nome}"?`);
      if (!confirmar) return;

      try {
        const resposta = await fetch(`http://localhost:5000/tarefas/${tarefa.idTarefa}`, {
          method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Erro ao excluir tarefa");

        await carregarTarefas(); // Recarrega a lista
      } catch (erro) {
        console.error("Erro ao excluir tarefa:", erro);
        alert("Erro ao excluir tarefa.");
      }
    });      

      // Evento para concluir tarefa
      check.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Feedback visual imediato
    check.classList.toggle("checked");
    texto.classList.toggle("checked");
    
    try {
        const resposta = await fetch(`http://localhost:5000/tarefa/${tarefa.idTarefa}/concluir`, {
            method: 'PUT',
        });

        if (!resposta.ok) {
            // Reverte a mudança visual se houve erro
            check.classList.toggle("checked");
            texto.classList.toggle("checked");
            
            const erro = await resposta.json();
            throw new Error(erro.erro || "Erro ao atualizar tarefa");
        }

        const resultado = await resposta.json();
        
        // Atualiza o status no objeto local
        tarefa.status = resultado.status;
        
        console.log(resultado.mensagem);
    } catch (erro) {
        console.error("Erro ao concluir tarefa:", erro);
        alert("Erro ao atualizar tarefa: " + erro.message);
    }
});

      // Evento para abrir modal de edição
      textoContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains('check-circle') && 
            !e.target.closest('.check-circle')) {
          abrirModalEdicao(tarefa);
        }
      });

      lista.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao buscar tarefas:", erro);
    alert("Erro ao carregar tarefas. Verifique o console para mais detalhes.");
  }
}

// Função para abrir modal de edição
function abrirModalEdicao(tarefa) {
  const modal = document.getElementById("modal-tarefa");
  if (!modal) return;

  // Preencher campos
  const nomeInput = document.getElementById("nome");
  const descricaoInput = document.getElementById("descricao");
  const dataLimiteInput = document.getElementById("dataLimite");
  const categoriaInput = document.getElementById("categoria");

  if (nomeInput) nomeInput.value = tarefa.nome || "";
  if (descricaoInput) descricaoInput.value = tarefa.descricao || "";
  if (dataLimiteInput) dataLimiteInput.value = tarefa.dataLimite ? tarefa.dataLimite.split('T')[0] : "";
  if (categoriaInput) categoriaInput.value = tarefa.categoria || "";

  // Selecionar prioridade
  const prioridade = tarefa.prioridade || "media";
  const prioridadeInput = document.querySelector(`input[name="prioridade"][value="${prioridade}"]`);
  if (prioridadeInput) prioridadeInput.checked = true;

  // Configurar modal
  modal.dataset.editandoId = tarefa.idTarefa;
  const modalTitle = modal.querySelector("h2");
  if (modalTitle) modalTitle.textContent = "Editar Tarefa";
  modal.classList.remove("hidden");
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

  // Evento para abrir modal (nova tarefa)
  btnAdd?.addEventListener("click", () => {
    // Limpar campos
    const nomeInput = document.getElementById("nome");
    const descricaoInput = document.getElementById("descricao");
    const dataLimiteInput = document.getElementById("dataLimite");
    const categoriaInput = document.getElementById("categoria");
    const prioridadeMedia = document.querySelector('input[name="prioridade"][value="media"]');

    if (nomeInput) nomeInput.value = "";
    if (descricaoInput) descricaoInput.value = "";
    if (dataLimiteInput) dataLimiteInput.value = "";
    if (categoriaInput) categoriaInput.value = "";
    if (prioridadeMedia) prioridadeMedia.checked = true;

    // Configurar modal
    const modalTitle = modal.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Nova Tarefa";
    delete modal.dataset.editandoId;
    modal.classList.remove("hidden");
  });

  // Evento para cancelar
  btnCancelar?.addEventListener("click", () => {
    modal.classList.add("hidden");
    delete modal.dataset.editandoId;
    const modalTitle = modal.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Nova Tarefa";
  });

  // Evento para salvar tarefa
  btnSalvar.addEventListener("click", async () => {
    try {
      // Obter valores dos campos
      const nomeInput = document.getElementById("nome");
      const descricaoInput = document.getElementById("descricao");
      const dataLimiteInput = document.getElementById("dataLimite");
      const categoriaInput = document.getElementById("categoria");
      const prioridadeInput = document.querySelector('input[name="prioridade"]:checked');

      if (!nomeInput || !descricaoInput || !dataLimiteInput || !categoriaInput || !prioridadeInput) {
        throw new Error("Elementos do formulário não encontrados");
      }

      const dadosTarefa = {
        nome: nomeInput.value,
        descricao: descricaoInput.value,
        dataLimite: dataLimiteInput.value,
        prioridade: prioridadeInput.value,
        categoria: categoriaInput.value,
        
        
      };

        console.log(dadosTarefa);

      // Validação
      if (!dadosTarefa.nome) {
        throw new Error("O nome da tarefa é obrigatório");
      }

      const idEdicao = modal.dataset.editandoId;
      const params = new URLSearchParams(window.location.search);
      const idUsuario = params.get('userId');

      if (!idUsuario) {
        throw new Error("ID do usuário não encontrado");
      }

      // Configurar requisição
      const url = idEdicao 
        ? `http://localhost:5000/editarTarefa/${idEdicao}`
        : `http://localhost:5000/tarefas/${idUsuario}/adicionar`;
      
      const method = idEdicao ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosTarefa)
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.erro || erro.message || "Erro ao salvar tarefa");
      }

      // Fechar modal e recarregar lista
      modal.classList.add("hidden");
      await carregarTarefas();

    } catch (error) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao processar tarefa");
    }
  });

  // Carregar tarefas inicialmente
  carregarTarefas();
});


const btnExcluir = document.getElementById("btn-excluir-tarefa-modal");
let modoExclusaoAtivo = false;

btnExcluir?.addEventListener("click", () => {
  modoExclusaoAtivo = !modoExclusaoAtivo; // Alterna entre true/false
  
  document.querySelectorAll(".item-tarefa").forEach(item => {
    if (modoExclusaoAtivo) {
      item.classList.add("modo-exclusao");
    } else {
      item.classList.remove("modo-exclusao");
    }
  });

  if (modoExclusaoAtivo) {
    btnExcluir.textContent = "Cancelar Exclusão";
    btnExcluir.style.backgroundColor = "#ff4444";
  } else {
    btnExcluir.textContent = "Excluir Tarefas";
    btnExcluir.style.backgroundColor = "";
  }
});

// Evento para excluir tarefa ao clicar em li no modo exclusão
document.getElementById("lista-tarefas")?.addEventListener("click", async (event) => {
  if (!modoExclusaoAtivo) return;

  const li = event.target.closest(".item-tarefa");
  if (!li) return;

  const idTarefa = li.id.replace("tarefa-", "");
  const nomeTarefa = li.querySelector(".texto-tarefa")?.textContent || "essa tarefa";

  const confirmar = confirm(`Tem certeza que deseja excluir a tarefa "${nomeTarefa}"?`);
  if (!confirmar) return;

  try {
    const resposta = await fetch(`http://localhost:5000/tarefas/${idTarefa}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.erro || "Erro ao excluir tarefa");
    }

    await carregarTarefas(); // Recarrega a lista
    alert("Tarefa excluída com sucesso!");
    } catch (erro) {
        console.error("Erro ao excluir tarefa:", erro);
        alert(erro.message || "Erro ao excluir tarefa.");
    } finally {
        // Desliga o modo exclusão
        modoExclusaoAtivo = false;
        btnExcluir.textContent = "Excluir Tarefas";
        btnExcluir.style.backgroundColor = "";

        document.querySelectorAll(".item-tarefa").forEach(item => {
        item.classList.remove("modo-exclusao");
        });
    }
});