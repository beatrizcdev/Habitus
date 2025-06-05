import { carregarMoedasUsuario } from "../integracao/moedas.js";
import { 
  verificarNotificacoesNaoLidas, 
  carregarNotificacoesNoModal, 
  marcarNotificacoesComoLidas 
} from "../integracao/notificacoes.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("navbar-container");
  try {
    const resposta = await fetch("./utilitarios/navbar.html");
    const html = await resposta.text();
    container.innerHTML = html;

    carregarMoedasUsuario();

    setTimeout(async () => {
      const idUsuario = localStorage.getItem("userId");
      if (!idUsuario) return;

      await verificarNotificacoesNaoLidas(idUsuario);

      const iconeNotificacao = document.querySelector('.iconsborda[alt="Notificações"]');
      if (iconeNotificacao) {
        iconeNotificacao.addEventListener("click", async () => {
          document.getElementById('modal-notificacoes').style.display = 'flex';
          await carregarNotificacoesNoModal(idUsuario);
          await marcarNotificacoesComoLidas(idUsuario);
          await verificarNotificacoesNaoLidas(idUsuario);
        });
      }

      const fechar = document.querySelector("#modal-notificacoes .fechar");
      if (fechar) {
        fechar.addEventListener("click", () => {
          document.getElementById('modal-notificacoes').style.display = 'none';
        });
      }
    }, 300);
  } catch (erro) {
    console.error("Erro ao carregar a navbar:", erro);
    container.innerHTML = "<p>Erro ao carregar a barra de navegação.</p>";
  }
});

setTimeout(async () => {
  // ... seu código de notificações

  const hamburguer = document.querySelector(".hamburguer");
  const lista = document.querySelector(".lista");

  if (hamburguer && lista) {
    hamburguer.addEventListener("click", () => {
      lista.classList.toggle("active");
    });
  }
}, 300);
