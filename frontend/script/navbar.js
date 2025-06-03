import { carregarMoedasUsuario } from "../integracao/moedas.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("navbar-container");
  try {
    const resposta = await fetch("./utilitarios/navbar.html");
    const html = await resposta.text();
    container.innerHTML = html;

    // Agora que a navbar está no DOM, carregue as moedas
    carregarMoedasUsuario();
  } catch (erro) {
    console.error("Erro ao carregar a navbar:", erro);
    container.innerHTML = "<p>Erro ao carregar a barra de navegação.</p>";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  async function carregarNotificacoes() {
    const idUsuario = localStorage.getItem("userId");
    if (!idUsuario) return;
    try {
      const resposta = await axios.get(`http://localhost:5000/notificacoes/${idUsuario}`);
      const notificacoes = resposta.data;
      console.log("Notificações recebidas do backend:", notificacoes);

      const modalContent = document.querySelector("#modal-notificacoes .modalContent");
      // Limpa notificações antigas do modal
      modalContent.querySelectorAll(".notificacao-dinamica").forEach(e => e.remove());

      if (notificacoes.length === 0) {
        const p = document.createElement("p");
        p.className = "notificacao-dinamica";
        p.textContent = "Nenhuma notificação.";
        modalContent.appendChild(p);
      } else {
        notificacoes.forEach(n => {
          const p = document.createElement("p");
          p.className = "notificacao-dinamica";
          p.textContent = `${n.mensagem} (${new Date(n.dataEnvio).toLocaleString("pt-BR")})`;
          modalContent.appendChild(p);
        });
      }
    } catch (erro) {
      let mensagem = "Erro desconhecido";
      if (erro.response && erro.response.data) {
        mensagem = erro.response.data.erro || erro.response.data.message || mensagem;
      } else if (erro.message) {
        mensagem = erro.message;
      }
      alert(mensagem);
      console.error("Erro ao carregar notificações:", erro);
    }
  }

  // Exibe o modal e carrega as notificações ao clicar no ícone
  const iconeNotificacao = document.querySelector('.iconsborda[alt="Notificações"]');
  if (iconeNotificacao) {
    iconeNotificacao.addEventListener("click", () => {
      document.getElementById('modal-notificacoes').style.display = 'flex';
      carregarNotificacoes();
    });
  }
});