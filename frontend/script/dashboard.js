import { carregarTarefas } from "../integracao/tarefas.js";

// Troca de abas (tarefas/hábitos)
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
}

// Adiciona event listeners para as abas
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const aba = tab.getAttribute("data-aba");
    mostrarAba(aba);
  });
});

// Inicia com a aba de tarefas aberta
document.addEventListener("DOMContentLoaded", () => {
  mostrarAba("tarefas");
});

// Ativa os eventos de clique nas bolinhas de check
export function ativarChecks() {
  document.querySelectorAll('.check-circle').forEach((circle) => {
    circle.addEventListener('click', () => {
      circle.classList.toggle('checked');
      const taskText = circle.nextElementSibling;
      if (taskText) {
        taskText.classList.toggle('checked');
      }
    });
  });
}

// Executa tudo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  mostrarAba("tarefas"); // Define a aba padrão
  ativarChecks();        // Ativa os eventos de clique nas bolinhas
});
