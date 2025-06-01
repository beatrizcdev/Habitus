//import axios from "axios";
import { carregarMoedasUsuario } from "./moedas.js";

const API_URL = "http://localhost:5000";

// Carregar tarefas
export async function carregarTarefas() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) {
    console.error("ID do usuário não encontrado");
    return;
  }

  try {
    const resposta = await axios.get(`${API_URL}/tarefas/${idUsuario}`);
    const tarefas = resposta.data;
    const lista = document.getElementById("lista-tarefas");

    if (!lista) {
      console.error("Elemento lista-tarefas não encontrado");
      return;
    }

    lista.innerHTML = "";

    if (tarefas.length === 0) {
      lista.innerHTML =
        "<p class='nenhuma-tarefa'>Nenhuma tarefa cadastrada.</p>";
      return;
    }

    tarefas.forEach((tarefa) => {
      const li = document.createElement("li");
      li.classList.add("item-tarefa");
      li.id = `tarefa-${tarefa.idTarefa}`;

      // Checkbox como button
      const check = document.createElement("button");
      check.type = "button";
      check.classList.add("check-circle");
      check.setAttribute("aria-label", "Concluir tarefa");
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

      li.appendChild(check);
      li.appendChild(textoContainer);
      li.appendChild(prioridadeBox);

      // Lixeira como button
      const lixeira = document.createElement("button");
      lixeira.type = "button";
      lixeira.innerHTML = "🗑️";
      lixeira.classList.add("lixeira-exclusao");
      lixeira.title = "Excluir tarefa";
      lixeira.setAttribute("aria-label", "Excluir tarefa");
      textoContainer.appendChild(lixeira);

      // Evento de excluir (direto, sem modo de exclusão)
      lixeira.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const confirmar = confirm(`Excluir a tarefa "${tarefa.nome}"?`);
        if (!confirmar) return;
        try {
          await excluirTarefa(tarefa.idTarefa);
          await carregarTarefas();
        } catch (erro) {
          alert("Erro ao excluir tarefa.");
        }
      });

      // Evento de concluir
      check.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        check.classList.toggle("checked");
        texto.classList.toggle("checked");
        try {
          await concluirTarefa(tarefa.idTarefa);
          await carregarMoedasUsuario(); // Atualiza moedas ao concluir tarefa
        } catch (erro) {
          check.classList.toggle("checked");
          texto.classList.toggle("checked");
          alert("Erro ao atualizar tarefa.");
        }
      });

      // Evento de editar
      textoContainer.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("check-circle") &&
          !e.target.closest(".check-circle")
        ) {
          abrirModalEdicao(tarefa);
        }
      });

      lista.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao buscar tarefas:", erro);
    alert("Erro ao carregar tarefas.");
  }
}

// Adicionar tarefa
export async function adicionarTarefa(dadosTarefa) {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) throw new Error("ID do usuário não encontrado");
  await axios.post(`${API_URL}/tarefas/${idUsuario}/adicionar`, dadosTarefa);
}

// Editar tarefa
export async function editarTarefa(idTarefa, dadosAtualizados) {
  await axios.put(`${API_URL}/editarTarefa/${idTarefa}`, dadosAtualizados);
}

// Excluir tarefa
export async function excluirTarefa(idTarefa) {
  await axios.delete(`${API_URL}/tarefas/${idTarefa}`);
}

// Concluir tarefa
export async function concluirTarefa(idTarefa) {
  await axios.put(`${API_URL}/tarefa/${idTarefa}/concluir`);
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
  if (dataLimiteInput)
    dataLimiteInput.value = tarefa.dataLimite
      ? tarefa.dataLimite.split("T")[0]
      : "";
  if (categoriaInput) categoriaInput.value = tarefa.categoria || "";

  // Selecionar prioridade
  const prioridade = tarefa.prioridade || "media";
  const prioridadeInput = document.querySelector(
    `input[name="prioridade"][value="${prioridade}"]`
  );
  if (prioridadeInput) prioridadeInput.checked = true;

  // Configurar modal
  modal.dataset.editandoId = tarefa.idTarefa;
  const modalTitle = modal.querySelector("h2");
  if (modalTitle) modalTitle.textContent = "Editar Tarefa";
  modal.classList.remove("hidden");
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do modal
  const modal = document.getElementById("modal-tarefa");
  const btnAdd = document.querySelector(".btn-add");
  const btnSalvar = document.getElementById("btnSalvarTarefa");
  const btnCancelar = document.getElementById("btn-cancelar-tarefa");

  // Evento para abrir modal (nova tarefa)
  btnAdd?.addEventListener("click", (event) => {
    event.preventDefault();
    // Limpar campos
    const nomeInput = document.getElementById("nome");
    const descricaoInput = document.getElementById("descricao");
    const dataLimiteInput = document.getElementById("dataLimite");
    const categoriaInput = document.getElementById("categoria");
    const prioridadeMedia = document.querySelector(
      'input[name="prioridade"][value="media"]'
    );

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
  btnCancelar?.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.add("hidden");
    delete modal.dataset.editandoId;
    const modalTitle = modal.querySelector("h2");
    if (modalTitle) modalTitle.textContent = "Nova Tarefa";
  });

  // Evento para salvar tarefa
  btnSalvar?.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      // Obter valores dos campos
      const nomeInput = document.getElementById("nome");
      const descricaoInput = document.getElementById("descricao");
      const dataLimiteInput = document.getElementById("dataLimite");
      const categoriaInput = document.getElementById("categoria");
      const prioridadeInput = document.querySelector(
        'input[name="prioridade"]:checked'
      );

      if (
        !nomeInput ||
        !descricaoInput ||
        !dataLimiteInput ||
        !categoriaInput ||
        !prioridadeInput
      ) {
        throw new Error("Elementos do formulário não encontrados");
      }

      const dadosTarefa = {
        nome: nomeInput.value,
        descricao: descricaoInput.value,
        dataLimite: dataLimiteInput.value,
        prioridade: prioridadeInput.value,
        categoria: categoriaInput.value,
      };

      if (!dadosTarefa.nome) {
        throw new Error("O nome da tarefa é obrigatório");
      }

      const idEdicao = modal.dataset.editandoId;
      const idUsuario = localStorage.getItem("userId");

      if (!idUsuario) {
        throw new Error("ID do usuário não encontrado no localStorage");
      }

      if (idEdicao) {
        await editarTarefa(idEdicao, dadosTarefa);
      } else {
        await adicionarTarefa(dadosTarefa);
      }
      // Atualiza moedas após adicionar/editar tarefa
      await carregarMoedasUsuario();

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

btnExcluir?.addEventListener("click", (event) => {
  event.preventDefault();
  modoExclusaoAtivo = !modoExclusaoAtivo; // Alterna entre true/false

  document.querySelectorAll(".item-tarefa").forEach((item) => {
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
document
  .getElementById("lista-tarefas")
  ?.addEventListener("click", async (event) => {
    if (!modoExclusaoAtivo) return;

    const li = event.target.closest(".item-tarefa");
    if (!li) return;

    const idTarefa = li.id.replace("tarefa-", "");
    const nomeTarefa =
      li.querySelector(".texto-tarefa")?.textContent || "essa tarefa";

    const confirmar = confirm(
      `Tem certeza que deseja excluir a tarefa "${nomeTarefa}"?`
    );
    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `http://localhost:5000/tarefas/${idTarefa}`,
        {
          method: "DELETE",
        }
      );

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

      document.querySelectorAll(".item-tarefa").forEach((item) => {
        item.classList.remove("modo-exclusao");
      });
    }
  });
