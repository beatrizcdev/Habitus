document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resp = await fetch(`http://localhost:5000/usuario/primeiro-acesso/${idUsuario}`);
    const data = await resp.json();

    if (data.primeiroAcesso) {
      iniciarTourOnboarding();
    }
  } catch (e) {
    console.error("Erro ao verificar primeiro acesso:", e);
  }
});

function iniciarTourOnboarding() {
  const passos = [
    {
      seletor: ".tabs-container",
      titulo: "Abas",
      texto: "Aqui você alterna entre tarefas e hábitos."
    },
    {
      seletor: ".tab.active",
      titulo: "Aba de Tarefas",
      texto: "Veja e gerencie suas tarefas diárias aqui."
    },
    {
      seletor: ".btn-add",
      titulo: "Adicionar",
      texto: "Clique aqui para adicionar uma nova tarefa ou hábito."
    },
    {
      seletor: ".capivara",
      titulo: "Personalize sua Capivara!",
      texto: "Clicando na capivara, você pode escolher a skin que quer equipar."
    }
    // Adicione mais passos conforme necessário
  ];

  let passoAtual = 0;

  function mostrarPopup(passo) {
    // Remove popup e destaque anteriores
    document.querySelectorAll(".onboarding-popup, .onboarding-highlight").forEach(e => e.remove());

    const alvo = document.querySelector(passo.seletor);
    if (!alvo) return;

    // Destaca o elemento
    const rect = alvo.getBoundingClientRect();
    const highlight = document.createElement("div");
    highlight.className = "onboarding-highlight";
    highlight.style.position = "fixed";
    highlight.style.top = `${rect.top - 6}px`;
    highlight.style.left = `${rect.left - 6}px`;
    highlight.style.width = `${rect.width + 12}px`;
    highlight.style.height = `${rect.height + 12}px`;
    highlight.style.border = "2.5px solid #4caf50";
    highlight.style.borderRadius = "12px";
    highlight.style.zIndex = 10000000000000;
    highlight.style.pointerEvents = "none";
    document.body.appendChild(highlight);

    // Cria o popup
    const popup = document.createElement("div");
    popup.className = "onboarding-popup";
    popup.innerHTML = `
      <h3>${passo.titulo}</h3>
      <p>${passo.texto}</p>
      <button id="onboarding-proximo">${passoAtual < passos.length - 1 ? "Próximo" : "Finalizar"}</button>
    `;
    document.body.appendChild(popup);

    // Posiciona o popup próximo ao elemento
    popup.style.position = "fixed";
    popup.style.top = `${rect.bottom + 14}px`;
    popup.style.left = `${rect.left}px`;
    popup.style.zIndex = 2002;
    popup.style.background = "#fff";
    popup.style.border = "2px solid #4caf50";
    popup.style.borderRadius = "10px";
    popup.style.padding = "18px 24px";
    popup.style.boxShadow = "0 2px 16px rgba(0,0,0,0.18)";
    popup.style.maxWidth = "320px";
    popup.style.animation = "fadeIn 0.3s";

    // Se não couber embaixo, mostra acima
    if (rect.bottom + 180 > window.innerHeight) {
      popup.style.top = `${rect.top - popup.offsetHeight - 14}px`;
    }

    document.getElementById("onboarding-proximo").onclick = () => {
      passoAtual++;
      if (passoAtual < passos.length) {
        mostrarPopup(passos[passoAtual]);
      } else {
        document.querySelectorAll(".onboarding-popup, .onboarding-highlight").forEach(e => e.remove());
      }
    };
  }

  mostrarPopup(passos[passoAtual]);
}