const API_URL = "http://localhost:5000/notificacoes";

// Buscar notificações do usuário
export async function listarNotificacoesUsuario(idUsuario) {
  try {
    const resposta = await axios.get(`${API_URL}/${idUsuario}`);
    return resposta.data;
  } catch (erro) {
    console.error("Erro ao listar notificações:", erro);
    return [];
  }
}

// Marcar todas notificações como lidas
export async function marcarNotificacoesComoLidas(idUsuario) {
  try {
    await axios.put(`${API_URL}/${idUsuario}/ler`);
  } catch (erro) {
    console.error("Erro ao marcar notificações como lidas:", erro);
  }
}

// Verificar se há notificações não lidas e mostrar a bolinha
export async function verificarNotificacoesNaoLidas(idUsuario) {
  const notificacoes = await listarNotificacoesUsuario(idUsuario);
  const existeNaoLida = notificacoes.some(n => n.lida === 0);

  let bolinha = document.getElementById("bolinha-notificacao");
  const icone = document.querySelector('.iconsborda[alt="Notificações"]');
  if (!icone) return;

  if (!bolinha) {
    bolinha = document.createElement("span");
    bolinha.id = "bolinha-notificacao";
    bolinha.className = "bolinha-notificacao";
    icone.parentElement.style.position = "relative";
    icone.parentElement.appendChild(bolinha);
  }
  bolinha.style.display = existeNaoLida ? "block" : "none";
}

// Carregar notificações no modal
export async function carregarNotificacoesNoModal(idUsuario) {
  const notificacoes = await listarNotificacoesUsuario(idUsuario);
  const modal = document.querySelector("#modal-notificacoes .modalContent");
  if (!modal) return;

  // Remove notificações antigas
  const antigas = modal.querySelectorAll(".notificacao-item");
  antigas.forEach(el => el.remove());

  if (notificacoes.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "notificacao-item";
    vazio.textContent = "Nenhuma notificação.";
    modal.appendChild(vazio);
    return;
  }

  notificacoes.forEach(n => {
  const div = document.createElement("div");
  
  const tiposComAcento = {
  missao: "Missão",
  sistema: "Sistema",
  alerta: "Alerta",
  aviso: "Aviso"
  };

  const tipoKey = (n.tipo || "sistema").toLowerCase();
  const tipoFormatado = tiposComAcento[tipoKey] || (tipoKey.charAt(0).toUpperCase() + tipoKey.slice(1));
  const dataFormatada = new Date(n.dataEnvio).toLocaleDateString("pt-BR");

  div.className = "notificacao-item";
  div.innerHTML = `<strong>${tipoFormatado}:</strong> ${n.mensagem} <br><small>${dataFormatada}</small>`;

  if (n.lida) div.classList.add("notificacao-lida");
  
  modal.appendChild(div);
  });
}