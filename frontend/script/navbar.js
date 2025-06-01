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