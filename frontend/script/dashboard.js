import { carregarTarefas } from "../integracao/tarefas.js";

// Troca de abas (tarefas/hábitos)
export async function mostrarAba(aba) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".conteudo-aba").forEach(div => div.classList.remove("ativo"));

  if (aba === "tarefas") {
    document.querySelector(".tab:nth-child(1)").classList.add("active");
    document.getElementById("conteudo-tarefas").classList.add("ativo");

    await carregarTarefas(); // 🆕 chama a função de buscar e renderizar tarefas

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

document.addEventListener('DOMContentLoaded', () => {
  carregarHabitos();
  resetarHabitosSeNovoDia();
});

export function abrirModalHabito() {
  document.getElementById('modal-habito').style.display = 'flex';
}

export function fecharModalHabito() {
  document.getElementById('modal-habito').style.display = 'none';
  document.getElementById('input-novo-habito').value = '';
}

export function confirmarAdicionarHabito() {
  const input = document.getElementById('input-novo-habito');
  const nome = input.value.trim();
  if (nome) {
    const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
    habitos.push({ nome, feito: false });
    localStorage.setItem('habitos', JSON.stringify(habitos));
    renderizarHabitos();
    fecharModalHabito();
  }
}

// FUNÇÕES DE REMOVER HÁBITO - ADICIONADAS E INTEGRADAS

export function abrirModalRemoverHabito() {
  const select = document.getElementById('habitosParaRemover');
  select.innerHTML = ''; // limpa opções antigas

  const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
  habitos.forEach((habito, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = habito.nome;
    select.appendChild(option);
  });

  document.getElementById('modal-remover-habito').style.display = 'flex';
}

export function fecharModalRemoverHabito() {
  document.getElementById('modal-remover-habito').style.display = 'none';
}

export function removerHabitoSelecionado() {
  const select = document.getElementById('habitosParaRemover');
  const indice = select.value;

  if (indice !== null && indice !== '') {
    const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
    habitos.splice(indice, 1); // remove o hábito do array
    localStorage.setItem('habitos', JSON.stringify(habitos));
    renderizarHabitos();
    fecharModalRemoverHabito();
  }
}

export function alternarHabito(index) {
  const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
  habitos[index].feito = !habitos[index].feito;
  localStorage.setItem('habitos', JSON.stringify(habitos));
  renderizarHabitos();
}

export function renderizarHabitos() {
  const lista = document.getElementById('lista-habitos');
  lista.innerHTML = '';
  const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
  habitos.forEach((habito, index) => {
    const li = document.createElement('li');
    li.className = 'habito-item' + (habito.feito ? ' feito' : '');

    const texto = document.createElement('span');
    texto.textContent = habito.nome;
    texto.style.flexGrow = '1';

    const botaoCheck = document.createElement('button');
    botaoCheck.textContent = habito.feito ? '●' : '○';
    botaoCheck.onclick = () => alternarHabito(index);
    botaoCheck.className = habito.feito ? 'botao-check feito' : 'botao-check';

    li.appendChild(texto);
    li.appendChild(botaoCheck);
    lista.appendChild(li);
  });
}

export function carregarHabitos() {
  renderizarHabitos();
}

export function resetarHabitosSeNovoDia() {
  const hoje = new Date().toLocaleDateString();
  const ultimoDia = localStorage.getItem('ultimoReset');
  if (hoje !== ultimoDia) {
    const habitos = JSON.parse(localStorage.getItem('habitos') || '[]');
    habitos.forEach(h => h.feito = false);
    localStorage.setItem('habitos', JSON.stringify(habitos));
    localStorage.setItem('ultimoReset', hoje);
    renderizarHabitos();
  }
}
