// Função para carregar hábitos
export async function carregarHabitos() {
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get('userId');
  if (!idUsuario) {
    console.error('ID do usuário não encontrado');
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:5000/habitos/${idUsuario}`);
    if (!resposta.ok) throw new Error('Erro ao buscar hábitos');

    const habitos = await resposta.json();
    const lista = document.getElementById("lista-habitos");

    if (!lista) {
      console.error('Elemento lista-habitos não encontrado');
      return;
    }

    lista.innerHTML = "";

    if (habitos.length === 0) {
      lista.innerHTML = "<p class='nenhum-habito'>Nenhum hábito cadastrado.</p>";
      return;
    }

    habitos.forEach(habito => {
      const li = document.createElement("li");
      li.classList.add("item-habito");
      li.id = `habito-${habito.idHabito}`;

      // Checkbox
      const check = document.createElement("span");
      check.classList.add("check-circle");
      if (habito.concluidoHoje) {
        check.classList.add("checked");
      }

      // Texto do hábito
      const texto = document.createElement("span");
      texto.classList.add("texto-habito");
      texto.textContent = habito.nome;
      if (habito.concluidoHoje) {
        texto.classList.add("checked");
      }

      // Container do texto
      const textoContainer = document.createElement("div");
      textoContainer.classList.add("texto-container");
      textoContainer.appendChild(texto);

      // Lixeira para exclusão
      const lixeira = document.createElement("span");
      lixeira.innerHTML = "🗑️";
      lixeira.classList.add("lixeira-exclusao");
      lixeira.title = "Excluir hábito";

      // Montagem do elemento
      li.appendChild(check);
      li.appendChild(textoContainer);
      textoContainer.appendChild(lixeira);

      // Evento de clique na lixeira
      lixeira.addEventListener("click", async (event) => {
        event.stopPropagation();

        const confirmar = confirm(`Excluir o hábito "${habito.nome}"?`);
        if (!confirmar) return;

        try {
          const resposta = await fetch(`http://localhost:5000/habitos/${habito.idHabito}`, {
            method: "DELETE"
          });

          if (!resposta.ok) throw new Error("Erro ao excluir hábito");

          await carregarHabitos(); // Recarrega a lista
        } catch (erro) {
          console.error("Erro ao excluir hábito:", erro);
          alert("Erro ao excluir hábito.");
        }
      });

      // Evento para marcar/desmarcar hábito
      check.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Feedback visual imediato (otimista)
  const estavaConcluido = check.classList.contains("checked");
  check.classList.toggle("checked");
  texto.classList.toggle("checked");
  
  try {
    const resposta = await fetch(`http://localhost:5000/habitos/${habito.idHabito}/concluir`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!resposta.ok) {
      // Reverte se houve erro
      check.classList.toggle("checked");
      texto.classList.toggle("checked");
      throw new Error("Erro ao atualizar hábito");
    }
const resultado = await resposta.json();
    console.log('Resposta da API:', resultado);
    
    habito.concluidoHoje = resultado.concluidoHoje;
    
    if (habito.concluidoHoje) {
  check.classList.add("checked");
  texto.classList.add("checked");
} else {
      check.classList.remove("checked");
      texto.classList.remove("checked");
    }

  } catch (erro) {
    console.error("Erro ao atualizar hábito:", erro);
    alert("Erro ao atualizar hábito: " + erro.message);
  }
});

      // Evento para abrir modal de edição
      textoContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains('check-circle') && 
            !e.target.closest('.check-circle')) {
          abrirModalEdicaoHabito(habito);
        }
      });

      lista.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao buscar hábitos:", erro);
    alert("Erro ao carregar hábitos. Verifique o console para mais detalhes.");
  }
}

// Função para abrir modal de edição de hábito
function abrirModalEdicaoHabito(habito) {
  const modal = document.getElementById("modal-habitos");
  if (!modal) return;

  // Preencher campos
  const nomeInput = document.getElementById("nome-h");
  const descricaoInput = document.getElementById("descricao-h");

  if (nomeInput) nomeInput.value = habito.nome || "";
  if (descricaoInput) descricaoInput.value = habito.descricao || "";

  // Configurar modal
  modal.dataset.editandoId = habito.idHabito;
  const modalTitle = modal.querySelector("h2");
  if (modalTitle) modalTitle.textContent = "Editar Hábito";
  modal.classList.remove("hidden");
}

// Inicialização para hábitos quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
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
  btnAddHabitos?.addEventListener("click", () => {
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
  btnCancelarHabitos?.addEventListener("click", () => {
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
        descricao: descricaoInput.value
      };

      // Validação
      if (!dadosHabito.nome) {
        throw new Error("O nome do hábito é obrigatório");
      }

      const idEdicao = modalHabitos.dataset.editandoId;
      const params = new URLSearchParams(window.location.search);
      const idUsuario = params.get('userId');

      if (!idUsuario) {
        throw new Error("ID do usuário não encontrado");
      }

      // Configurar requisição
      const url = idEdicao 
        ? `http://localhost:5000/habitos/${idEdicao}`
        : `http://localhost:5000/habitos/${idUsuario}/adicionar`;
      
      const method = idEdicao ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosHabito)
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.erro || erro.message || "Erro ao salvar hábito");
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

  btnExcluirHabitos?.addEventListener("click", () => {
    modoExclusaoHabitosAtivo = !modoExclusaoHabitosAtivo;
    
    document.querySelectorAll(".item-habito").forEach(item => {
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
      const resposta = await fetch(`http://localhost:5000/habitos/${idHabito}`, {
          method: "DELETE"
      });

      if (!resposta.ok) {
          const erro = await resposta.json();
          throw new Error(erro.erro || "Erro ao excluir hábito");
      }

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

        document.querySelectorAll(".item-habito").forEach(item => {
          item.classList.remove("modo-exclusao");
        });
    }
  });

  // Carregar hábitos inicialmente
  carregarHabitos();
});