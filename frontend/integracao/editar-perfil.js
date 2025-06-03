const API_URL = "http://localhost:5000";

// Função para carregar os dados do perfil do usuário
async function carregarPerfil() {
  try {
    const idUsuario = Number(localStorage.getItem("userId"));
    if (!idUsuario) {
      alert("Usuário não autenticado.");
      return;
    }
    const resposta = await axios.get(`${API_URL}/perfil/${idUsuario}`);
    const usuario = resposta.data;

    document.getElementById("perfil-nome").textContent = usuario.nome;
    const concluidas = usuario.progresso?.concluidas || 0;
    const nivel = 1 + Math.floor(concluidas / 10);
    document.getElementById("perfil-nivel").textContent = `Nível atual: ${nivel}`;

    // Barra de progresso igual à de missões
    exibirBarraProgressoMissoes(concluidas);

    // Atualiza os campos de edição
    document.getElementById("texto-nome").textContent = usuario.nome;
    document.getElementById("input-nome").value = usuario.nome;

    document.getElementById("texto-email").textContent = usuario.email;
    document.getElementById("input-email").value = usuario.email;

    // A senha permanece mascarada na visualização
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
    alert("Erro ao carregar perfil. Por favor, tente novamente mais tarde.");
  }
}

// Função para atualizar os dados do usuário no back-end
async function atualizarPerfil(campo, novoValor, senhaConfirmada) {
  const payload = {};
  if (campo === "nome") {
    payload.nome = novoValor;
  } else if (campo === "email") {
    payload.email = novoValor;
    payload.senhaAtual = senhaConfirmada;
  } else if (campo === "senha") {
    payload.novaSenha = novoValor;
    payload.senhaAtual = senhaConfirmada;
  }

  try {
    const idUsuario = Number(localStorage.getItem("userId"));
    const resposta = await axios.put(`${API_URL}/${idUsuario}`, payload);

    alert(resposta.data.mensagem);
    return true;
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    // Agora o erro de senha incorreta do servidor será tratado
    if (erro.response?.data?.erro === "Senha atual incorreta.") {
      alert("Senha incorreta! Verifique e tente novamente.");
      return false;
    }
    alert(erro.response?.data?.erro || "Erro ao atualizar perfil.");
    return false;
  }
}

function exibirBarraProgressoMissoes(missoesFeitas) {
  // Cria o container se não existir
  let container = document.getElementById("progresso-missoes-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "progresso-missoes-container";
    document.querySelector(".boxperfil").appendChild(container);
  }
  container.innerHTML = `
    <div id="progresso-missoes-bar">
      <div id="progresso-missoes-fill"></div>
    </div>
  `;

  const progressoAtual = missoesFeitas % 10;
  const progressoPercent = (progressoAtual / 10) * 100;
  document.getElementById(
    "progresso-missoes-fill"
  ).style.width = `${progressoPercent}%`;
}

async function carregarBadgesUsuario() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resposta = await axios.get(`http://localhost:5000/inventario/${idUsuario}`);
    const itens = resposta.data;
    const badges = itens.filter(item => item.tipo === "badge");

    const container = document.querySelector(".conquistas");
    container.innerHTML = "";

    if (badges.length === 0) {
      container.innerHTML = "<p>Nenhum badge conquistado ainda.</p>";
      return;
    }

    badges.forEach(badge => {
      const img = document.createElement("img");
      // Ajuste o caminho conforme o nome/id do badge
      img.src = `../pictures/badges/badge${badge.idItem - 10}.svg`;
      img.alt = badge.nome;
      img.width = 119;
      img.height = 119;
      container.appendChild(img);
    });
  } catch (erro) {
    console.error("Erro ao carregar badges:", erro);
  }
}

async function carregarSkinEquipada() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resposta = await axios.get(`http://localhost:5000/inventario/${idUsuario}`);
    const itens = resposta.data;
    // Procura a skin equipada
    const skinEquipada = itens.find(item => item.tipo === "skin" && item.equipado === "SIM");
    if (skinEquipada) {
      const avatarImg = document.querySelector(".avatar");
      if (avatarImg) {
        avatarImg.src = `../pictures/capibbara/capibbara${skinEquipada.idItem}.svg`;
        avatarImg.alt = skinEquipada.nome;
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar skin equipada:", erro);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  carregarPerfil();
  carregarBadgesUsuario();
  carregarSkinEquipada();

  const campos = ["nome", "email", "senha"];

  campos.forEach((campo) => {
    const btnEditar = document.getElementById(`editar-${campo}`);
    const span = document.getElementById(`texto-${campo}`);
    const input = document.getElementById(`input-${campo}`);
    const salvarBtn = document.getElementById(`salvar-${campo}`);

    let senhaConfirmada = null;

    // Ao clicar para editar, pede a senha do usuário
    btnEditar?.addEventListener("click", () => {
      senhaConfirmada = prompt("Digite sua senha para confirmar:");
      if (senhaConfirmada) {
        input.style.display = "inline-block";
        span.style.display = "none";
        salvarBtn.style.display = "inline-block";
      }
    });

    // Ao salvar, envia os dados atualizados ao back-end
    salvarBtn?.addEventListener("click", async () => {
      const novoValor = input.value.trim();
      if (!novoValor) return;

      if ((campo === "email" || campo === "senha") && !senhaConfirmada) {
        alert("Digite sua senha para confirmar a alteração.");
        return;
      }

      const sucesso = await atualizarPerfil(campo, novoValor, senhaConfirmada);
      if (sucesso) {
        span.textContent = novoValor;
        span.style.display = "inline";
        input.style.display = "none";
        salvarBtn.style.display = "none";

        if (campo === "nome") {
          document.getElementById("perfil-nome").textContent = novoValor;
        }
      }
    });
  });
});
