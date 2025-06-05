async function atualizarArvorePorNivel() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resposta = await axios.get(`http://localhost:5000/perfil/${idUsuario}`);
    const usuario = resposta.data;
    const concluidas = usuario.progresso?.concluidas || 0;
    const nivel = 1 + Math.floor(concluidas / 10);

    const imgArvore = document.getElementById("arvore-nivel");
    if (imgArvore) {
      imgArvore.style.opacity = 0;
      setTimeout(() => {
        imgArvore.src = `../pictures/arvore/arvore-niveis/arvore-fase-${nivel}.svg`;
        imgArvore.alt = `Árvore nível ${nivel}`;
        imgArvore.onload = () => {
          imgArvore.style.opacity = 1;
        };
        carregarSkinEquipada();
      }, 400);
    }
  } catch (erro) {
    console.error("Erro ao buscar nível do usuário para árvore:", erro);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarArvorePorNivel();
  if (typeof mostrarAba === "function") {
    mostrarAba("tarefas");
  }
});

async function carregarSkinEquipada() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resposta = await axios.get(`http://localhost:5000/inventario/${idUsuario}`);
    const itens = resposta.data;
    // Procura a skin equipada
    const skinEquipada = itens.find((item) => item.tipo === "skin" && item.equipado === "SIM");
    if (skinEquipada) {
      const avatarImg = document.querySelector(".capivara");
      if (avatarImg) {
        avatarImg.src = `../pictures/capibbara/capibbara${skinEquipada.idItem}.svg`;
        avatarImg.alt = skinEquipada.nome;
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar skin equipada:", erro);
  }
}