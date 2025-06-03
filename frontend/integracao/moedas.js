//import axios from "axios";
const API_URL = "http://localhost:5000";

export async function carregarMoedasUsuario() {
  try {
    const idUsuario = localStorage.getItem("userId");
    if (!idUsuario) return;

    const resposta = await axios.get(
      `${API_URL}/moedas/${idUsuario}`
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