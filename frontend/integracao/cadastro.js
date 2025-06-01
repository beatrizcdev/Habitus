document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Formulário submetido"); // Debug

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
      console.log("Enviando dados:", dados); // Debug
      const resposta = await fetch("http://localhost:5000/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();
      console.log("Resposta do servidor:", resultado); // Debug

      if (resposta.ok) {
        console.log("Cadastro OK, redirecionando...");
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 100);
      } else {
        console.error("Erro no cadastro:", resultado.mensagem); // Debug
        document.getElementById("erroTexto").innerText = resultado.mensagem;
        document.getElementById("erroContainer").style.display = "flex";
      }
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      document.getElementById("erroTexto").innerText =
        "Erro ao conectar com o servidor: " + erro.message;
      document.getElementById("erroContainer").style.display = "flex";
    }
  });
