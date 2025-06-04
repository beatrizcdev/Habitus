const API_URL = "http://localhost:5000";

async function carregarSkinsDesbloqueadas() {
  const idUsuario = localStorage.getItem("userId");
  if (!idUsuario) return;

  try {
    const resposta = await axios.get(`${API_URL}/inventario/${idUsuario}`);
    const itens = resposta.data;
    const skins = itens.filter((item) => item.tipo === "skin");

    const container = document.querySelector(".outras-skins");
    container.innerHTML = "";

    if (skins.length === 0) {
      container.innerHTML = "<p>Nenhuma skin desbloqueada ainda.</p>";
      return;
    }

    skins.forEach((skin) => {
      const img = document.createElement("img");
      img.className = "skin-escolha";
      img.src = `../pictures/capibbara/capibbara${skin.idItem}.svg`;
      img.alt = skin.nome;
      img.width = 130;
      if (skin.equipado === "SIM") {
        img.classList.add("selected");
        // Atualiza o avatar principal para a skin equipada
        const mainAvatar = document.getElementById("mainAvatar");
        if (mainAvatar) mainAvatar.src = img.src;
      }
      img.addEventListener("click", async () => {
        try {
          await axios.patch(
            `${API_URL}/inventario/${skin.idItem}/equipar`,
            { idUsuario } // envia o idUsuario no corpo
          );
          carregarSkinsDesbloqueadas();
        } catch (erro) {
          alert("Erro ao equipar skin!");
          console.error(erro);
        }
      });
      container.appendChild(img);
    });
  } catch (erro) {
    console.error("Erro ao carregar skins desbloqueadas:", erro);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarSkinsDesbloqueadas();
});
