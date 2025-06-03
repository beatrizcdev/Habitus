// Defina a URL base da sua API
const API_URL = "http://localhost:5000";

// Função para carregar os dados do perfil do usuário
async function carregarPerfil() {
  try {
    // Suponha que o id do usuário esteja salvo no localStorage
    const idUsuario = Number(localStorage.getItem("userId"));
    if (!idUsuario) {
      alert("Usuário não autenticado.");
      return;
    }

    // A rota para buscar o perfil é /perfil/:idUsuario
    const resposta = await axios.get(`${API_URL}/perfil/${idUsuario}`);
    const usuario = resposta.data;

    // Atualiza a área de exibição do perfil
    // document.querySelector(".avatar").src = usuario.avatar || "../pictures/capibbara/capibbara1.svg";
    document.getElementById("perfil-nome").textContent = usuario.nome;
    document.getElementById("perfil-nivel").textContent = `Nível atual: ${usuario.nivel || "--"}`;

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

document.addEventListener("DOMContentLoaded", function () {
  carregarPerfil();

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
