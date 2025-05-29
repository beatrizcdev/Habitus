document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = document.getElementById('login').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const erroContainer = document.getElementById('erroContainer');
  const erroTexto = document.getElementById('erroTexto');

  if (!login || !senha) {
    erroTexto.textContent = 'Preencha todos os campos.';
    erroContainer.style.display = 'flex';
    return;
  }

  try {
    const resposta = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOuCpf: login,
        senha: senha
      })
    });

    const resultado = await resposta.json();

   if (resposta.ok) {
    console.log('Login ok, redirecionando...'); 
    setTimeout(() => {
        window.location.href = './dashboard.html'; 
    }, 100);
    } else {
      erroTexto.textContent = resultado.error || 'Erro ao fazer login.';
      erroContainer.style.display = 'flex';
    }
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    erroTexto.textContent = 'Erro ao conectar com o servidor.';
    erroContainer.style.display = 'flex';
  }
});
