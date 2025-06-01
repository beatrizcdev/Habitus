import { carregarTarefas } from "../integracao/tarefas.js";
import { carregarHabitos } from "../integracao/habitos.js";

// Função para trocar de aba
function mostrarAba(aba) {
  // Remove a classe 'active' de todas as abas
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  // Esconde todos os conteúdos de abas
  document.querySelectorAll(".conteudo-aba").forEach(div => {
    div.classList.add("hidden");
    div.classList.remove("ativo");
  });

  // Ativa a aba selecionada
  const abaSelecionada = document.querySelector(`.tab[data-aba="${aba}"]`);
  if (abaSelecionada) {
    abaSelecionada.classList.add("active");
  }

  // Mostra o conteúdo da aba selecionada
  const conteudoAba = document.getElementById(`conteudo-${aba}`);
  if (conteudoAba) {
    conteudoAba.classList.remove("hidden");
    conteudoAba.classList.add("ativo");
  }

  // Carrega os dados da aba selecionada
  if (aba === "tarefas") {
    carregarTarefas();
  } else if (aba === "habitos") {
    carregarHabitos();
  }
}

// Adiciona event listeners para as abas
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    const aba = tab.getAttribute("data-aba");
    mostrarAba(aba);
  });
});

// Inicia com a aba de tarefas aberta ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  mostrarAba("tarefas");
});
