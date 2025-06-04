//import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

const API_URL = "http://localhost:5000";

// Obtém o id do usuário do localStorage
const idUsuario = localStorage.getItem("userId");

// Se não houver id, redireciona para login
if (!idUsuario) {
  window.location.href = "../pages/login.html";
}

async function carregarMissoes() {
  try {
    const resposta = await axios.get(`${API_URL}/missoes/${idUsuario}`);
    const missoes = resposta.data;

    const lista = document.getElementById("lista-missoes");
    lista.innerHTML = "";

    if (missoes.length === 0) {
      lista.innerHTML = "<li>Nenhuma missão encontrada.</li>";
      await carregarProgressoMissoes();
      return;
    }

    missoes.forEach((missao) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${missao.nome}</strong><br>
        ${missao.descricao}<br>
        <span>Status: <b>${missao.statusMissao}</b></span>
      `;
      lista.appendChild(li);
    });

    await carregarProgressoMissoes(missoes);
  } catch (erro) {
    console.error("Erro ao carregar missões:", erro);
    document.getElementById("lista-missoes").innerHTML = "<li>Erro ao carregar missões.</li>";
    await carregarProgressoMissoes(missoes);
  }
}

async function carregarProgressoMissoes(missoes) {
  try {
    const resposta = await axios.get(`${API_URL}/usuario/${idUsuario}`);
    const usuario = resposta.data;
    const missoesFeitas = usuario.missoesFeitas || 0;
    const progress = (missoesFeitas / missoes.length) * 100;

    document.getElementById("progresso-missoes-fill").style.width = `${progress}%`;

    const span = document.createElement("span");
    span.innerHTML = `
        ${missoesFeitas}/${missoes.length} Missões concluídas 
      `;
    document.getElementById("progresso-missoes-container").appendChild(span);
  } catch (erro) {}
}

document.addEventListener("DOMContentLoaded", carregarMissoes);
