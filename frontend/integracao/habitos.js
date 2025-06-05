//import axios from "axios";

const API_URL = "http://localhost:5000";

// Carregar hábitos
export async function carregarHabitos() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) {
    console.error("ID do usuário não encontrado");
    return;
  }

  try {
    const resposta = await axios.get(`${API_URL}/habitos/${idUsuario}`);
    const habitos = resposta.data;
    console.log("Habitos carregados:", habitos);
    const lista = document.getElementById("lista-habitos");

    if (!lista) {
      console.error("Elemento lista-habitos não encontrado");
      return;
    }

    lista.innerHTML = "";

    if (habitos.length === 0) {
      lista.innerHTML = "<p class='nenhum-habito'>Nenhum hábito cadastrado.</p>";
      return;
    }

    habitos.forEach((habito) => {
      const li = document.createElement("li");
      li.classList.add("item-th");
      li.id = `habito-${habito.idHabito}`;

      // Checkbox como button
      const check = document.createElement("button");
      check.type = "button";
      check.classList.add("check-circle");
      check.setAttribute("aria-label", "Concluir hábito");

      // Texto do hábito
      const texto = document.createElement("span");
      texto.classList.add("texto-th");
      texto.textContent = habito.nome;

      // Agora sim, marque como concluído se necessário
      if (habito.status && habito.status.trim() === "concluido") {
        check.classList.add("checked");
        texto.classList.add("checked");
      }

      // Container do texto
      const textoContainer = document.createElement("div");
      textoContainer.classList.add("texto-container");
      textoContainer.appendChild(texto);

      // Lixeira para exclusão
      const lixeira = document.createElement("button");
      lixeira.type = "button";
      lixeira.innerHTML = "X";
      lixeira.classList.add("lixeira-exclusao");
      lixeira.title = "Excluir hábito";
      lixeira.setAttribute("aria-label", "Excluir hábito");
      textoContainer.appendChild(lixeira);

      li.appendChild(check);
      li.appendChild(textoContainer);

      // Evento de excluir
      lixeira.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const confirmar = confirm(`Excluir o hábito "${habito.nome}"?`);
        if (!confirmar) return;
        try {
          await excluirHabito(habito.idHabito);
          await carregarHabitos();
        } catch (erro) {
          alert(
            erro.message ||
            "Erro ao excluir hábito."
          );
        }
      });

      // Evento de concluir (igual tarefas.js)
      check.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        check.classList.toggle("checked");
        texto.classList.toggle("checked");
        try {
          await concluirHabito(habito.idHabito);
        } catch (erro) {
          // Reverte visual se falhar
          check.classList.toggle("checked");
          texto.classList.toggle("checked");
          alert(
            erro.message ||
            "Erro ao atualizar hábito."
          );
        }
      });

      // Evento de editar
      textoContainer.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("check-circle") &&
          !e.target.closest(".check-circle")
        ) {
          abrirModalEdicaoHabito(habito);
        }
      });

      lista.appendChild(li);
    });
  } catch (erro) {
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.erro ||
      erro.response?.data?.error ||
      erro.message ||
      "Erro ao carregar hábitos.";
    console.error("Erro ao buscar hábitos:", erro);
    alert(mensagem);
  }
}

// Adicionar hábito
export async function adicionarHabito(dadosHabito) {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) throw new Error("ID do usuário não encontrado");
  try {
    await axios.post(`${API_URL}/habitos/${idUsuario}/adicionar`, dadosHabito);
  } catch (erro) {
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.erro ||
      erro.response?.data?.error ||
      erro.message ||
      "Erro ao adicionar hábito.";
    throw new Error(mensagem);
  }
}

// Editar hábito
export async function editarHabito(idHabito, dadosAtualizados) {
  try {
    await axios.put(`${API_URL}/habitos/${idHabito}`, dadosAtualizados);
  } catch (erro) {
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.erro ||
      erro.response?.data?.error ||
      erro.message ||
      "Erro ao editar hábito.";
    throw new Error(mensagem);
  }
}

// Excluir hábito
export async function excluirHabito(idHabito) {
  try {
    await axios.delete(`${API_URL}/habitos/${idHabito}`);
  } catch (erro) {
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.erro ||
      erro.response?.data?.error ||
      erro.message ||
      "Erro ao excluir hábito.";
    throw new Error(mensagem);
  }
}

// Concluir hábito
export async function concluirHabito(idHabito) {
  try {
    await axios.put(`${API_URL}/habitos/${idHabito}/concluir`);
  } catch (erro) {
    const mensagem =
      erro.response?.data?.mensagem ||
      erro.response?.data?.erro ||
      erro.response?.data?.error ||
      erro.message ||
      "Erro ao concluir hábito.";
    throw new Error(mensagem);
  }
}

// Função para abrir modal de edição de hábito (mantém igual)
function abrirModalEdicaoHabito(habito) {
  const modal = document.getElementById("modal-habitos");
  if (!modal) return;

  const nomeInput = document.getElementById("nome-h");
  const descricaoInput = document.getElementById("descricao-h");

  if (nomeInput) nomeInput.value = habito.nome || "";
  if (descricaoInput) descricaoInput.value = habito.descricao || "";

  modal.dataset.editandoId = habito.idHabito;
  const modalTitle = modal.querySelector("h2");
  if (modalTitle) modalTitle.textContent = "Editar Hábito";
  modal.classList.remove("hidden");
}

// Inicialização para hábitos quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do modal de hábitos
  const modalHabitos = document.getElementById("modal-habitos");
  const btnAddHabitos = document.querySelector(".botoes-habitos .btn-add");
  const btnSalvarHabitos = document.getElementById("btnSalvarHabitos");
  const btnCancelarHabitos = document.getElementById("btn-cancelar-habitos");

  // Verificação dos elementos
  if (!modalHabitos) console.error("Modal de hábitos não encontrado");
  if (!btnAddHabitos) console.error("Botão add hábitos não encontrado");
  if (!btnSalvarHabitos) console.error("Botão salvar hábitos não encontrado");
  if (!btnCancelarHabitos) console.error("Botão cancelar hábitos não encontrado");

  // Evento para abrir modal (novo hábito)
  btnAddHabitos?.addEventListener("click", (event) => {
    event.preventDefault();
    // Limpar campos
    const nomeInput = document.getElementById("nome-h");
    const descricaoInput = document.getElementById("descricao-h");

    if (nomeInput) nomeInput.value = "";
    if (descricaoInput) descricaoInput.value = "";

    // Configurar modal
    const modalTitle = modalHabitos.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Novo Hábito";
    delete modalHabitos.dataset.editandoId;
    modalHabitos.classList.remove("hidden");
  });

  // Evento para cancelar
  btnCancelarHabitos?.addEventListener("click", (event) => {
    event.preventDefault();
    modalHabitos.classList.add("hidden");
    delete modalHabitos.dataset.editandoId;
    const modalTitle = modalHabitos.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Novo Hábito";
  });

  // Evento para salvar hábito
  btnSalvarHabitos?.addEventListener("click", async () => {
    try {
      // Obter valores dos campos
      const nomeInput = document.getElementById("nome-h");
      const descricaoInput = document.getElementById("descricao-h");

      if (!nomeInput || !descricaoInput) {
        throw new Error("Elementos do formulário não encontrados");
      }

      const dadosHabito = {
        nome: nomeInput.value,
        descricao: descricaoInput.value,
      };

      // Validação
      if (!dadosHabito.nome) {
        throw new Error("O nome do hábito é obrigatório");
      }

      const idEdicao = modalHabitos.dataset.editandoId;
      const idUsuario = localStorage.getItem("userId");

      if (idEdicao) {
        await editarHabito(idEdicao, dadosHabito);
      } else {
        if (!idUsuario) {
          throw new Error("ID do usuário não encontrado");
        }
        await adicionarHabito(dadosHabito);
      }

      // Fechar modal e recarregar lista
      modalHabitos.classList.add("hidden");
      await carregarHabitos();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao processar hábito");
    }
  });

  // Modo de exclusão para hábitos
  const btnExcluirHabitos = document.getElementById("btn-excluir-habit-modal");
  let modoExclusaoHabitosAtivo = false;

  btnExcluirHabitos?.addEventListener("click", (event) => {
    event.preventDefault();
    modoExclusaoHabitosAtivo = !modoExclusaoHabitosAtivo;

    document.querySelectorAll(".item-th").forEach((item) => {
      if (modoExclusaoHabitosAtivo) {
        item.classList.add("modo-exclusao");
      } else {
        item.classList.remove("modo-exclusao");
      }
    });

    if (modoExclusaoHabitosAtivo) {
      btnExcluirHabitos.textContent = "Cancelar Exclusão";
      btnExcluirHabitos.style.backgroundColor = "#ff4444";
    } else {
      btnExcluirHabitos.textContent = "Excluir Hábitos";
      btnExcluirHabitos.style.backgroundColor = "";
    }
  });

  // Evento para excluir hábito ao clicar em li no modo exclusão
  document.getElementById("lista-habitos")?.addEventListener("click", async (event) => {
    if (!modoExclusaoHabitosAtivo) return;

    const li = event.target.closest(".item-habito");
    if (!li) return;

    const idHabito = li.id.replace("habito-", "");
    const nomeHabito = li.querySelector(".texto-habito")?.textContent || "esse hábito";

    const confirmar = confirm(`Tem certeza que deseja excluir o hábito "${nomeHabito}"?`);
    if (!confirmar) return;

    try {
      await excluirHabito(idHabito);
      await carregarHabitos();
      alert("Hábito excluído com sucesso!");
    } catch (erro) {
      console.error("Erro ao excluir hábito:", erro);
      alert(erro.message || "Erro ao excluir hábito.");
    } finally {
      // Desliga o modo exclusão
      modoExclusaoHabitosAtivo = false;
      btnExcluirHabitos.textContent = "Excluir Hábitos";
      btnExcluirHabitos.style.backgroundColor = "";

      document.querySelectorAll(".item-habito").forEach((item) => {
        item.classList.remove("modo-exclusao");
      });
    }
  });

  // Carregar hábitos inicialmente
  carregarHabitos();
});
