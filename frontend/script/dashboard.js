// Troca de abas (tarefas/hábitos)
export function mostrarAba(aba) {
  // Remove classes de todas as abas e conteúdos
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".conteudo-aba").forEach(div => div.classList.remove("ativo"));

  // Ativa a aba clicada e o conteúdo correspondente
  if (aba === "tarefas") {
    document.querySelector(".tab:nth-child(1)").classList.add("active");
    document.getElementById("conteudo-tarefas").classList.add("ativo");
  } else {
    document.querySelector(".tab:nth-child(2)").classList.add("active");
    document.getElementById("conteudo-habitos").classList.add("ativo");
  }
}

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
