//import axios from "axios";

export async function carregarMoedasUsuario() {
  try {
    const idUsuario = localStorage.getItem("userId");
    if (!idUsuario) return;

    const resposta = await axios.get(
      `http://localhost:5000/moedas/${idUsuario}`
    );
    const dados = resposta.data;
    const moedasSpan = document.getElementById("quantidade-moedas");

    if (moedasSpan) {
      moedasSpan.textContent = dados.moedas;
    }
  } catch (erro) {
    console.error("Erro ao carregar moedas:", erro);
  }
}

// carregarMoedasUsuario();