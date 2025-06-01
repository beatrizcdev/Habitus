document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (e) {

    const API_URL = "http://localhost:5000";
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

    const dados = {
      nome,
      email,
      cpf,
      senha,
      avatar: "capibbara",
      corAvatar: "padrao",
      missoesFeitas: 0,
    };

    try {
      const resposta = await axios.post(`${API_URL}/cadastrar`, dados);

      if (resposta.status === 201) {
        window.location.href = "./login.html";
        return;
      } else {
        document.getElementById("erroTexto").innerText = resposta.data.mensagem;
        document.getElementById("erroContainer").style.display = "flex";
      }
    } catch (erro) {
      const mensagem =
        erro.response?.data?.mensagem ||
        "Erro ao conectar com o servidor: " + erro.message;
      document.getElementById("erroTexto").innerText = mensagem;
      document.getElementById("erroContainer").style.display = "flex";
    }
  });