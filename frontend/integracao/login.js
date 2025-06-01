document.getElementById("loginForm").addEventListener("submit", async (e) => {
  const API_URL = "http://localhost:5000";
  e.preventDefault();

  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroContainer = document.getElementById("erroContainer");
  const erroTexto = document.getElementById("erroTexto");

  if (!login || !senha) {
    erroTexto.textContent = "Preencha todos os campos.";
    erroContainer.style.display = "flex";
    return;
  }

  try {
    const resposta = await axios.post(`${API_URL}/login`, {
      emailOuCpf: login,
      senha: senha,
    });

    if (resposta.status === 200) {
      localStorage.setItem("userId", resposta.data.userId);
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 100);
    } else {
      erroTexto.textContent = resposta.data.mensagem || "Erro ao fazer login.";
      erroContainer.style.display = "flex";
    }
  } catch (erro) {
    erroTexto.textContent =
      erro.response?.data?.mensagem || "Erro ao conectar com o servidor.";
    erroContainer.style.display = "flex";
  }
});