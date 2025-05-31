export async function carregarMoedasUsuario(idUsuario) {
  try {
    const resposta = await fetch(`http://localhost:5000/moedas/${idUsuario}`);
    if (!resposta.ok) throw new Error('Erro ao buscar moedas');

    const dados = await resposta.json();
    const moedasSpan = document.getElementById('quantidade-moedas');

    if (moedasSpan) {
      moedasSpan.textContent = dados.moedas;
    }
  } catch (erro) {
    console.error('Erro ao carregar moedas:', erro);
  }
}

const params = new URLSearchParams(window.location.search);
const idUsuario = params.get('userId');
if (idUsuario) {
  carregarMoedasUsuario(idUsuario);
}
