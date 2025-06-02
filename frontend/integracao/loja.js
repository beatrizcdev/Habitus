const API_URL = "http://localhost:5000";

async function carregarItensLoja() {
  try {
    // Busca os itens da loja 
    const resposta = await axios.get(`${API_URL}/loja/itens`);
    const itens = resposta.data;

    // Salva no localStorage
    localStorage.setItem('itensLoja', JSON.stringify(itens));

    // Seleciona o container
    const container = document.querySelector('.Container_produto');
    container.innerHTML = '';

    itens.forEach((item) => {
      // Cria a div do item (classe padronizada "item")
      const div = document.createElement('div');
      div.className = 'item';
      div.id = item.idItem;

      div.innerHTML = `
        <img class="capibara" src="../pictures/capibbara/capibbara${item.idItem}.svg" alt="Capibara">
        <div class="texto">
          <p class="nivel">level: 10</p>
          <div>
            <button class="botao" type="button">${item.preco}</button>
            <img class="coinspig" src="../pictures/utilidades/coinspig.svg">
          </div>
        </div>
      `;

      // Adiciona event listener ao botão
      const botao = div.querySelector('.botao');
      botao.addEventListener('click', (event) => {
        event.preventDefault();
        comprarItem(Number(div.id)); // Garante que o id será número
      });

      container.appendChild(div);
    });
  } catch (erro) {
    alert('Erro ao carregar itens da loja');
  }
}

// Função para comprar item (sem equipar)
async function comprarItem(idItem) {
  criarPopup('Tem certeza que deseja comprar este item?', async () => {
    const idUsuario = Number(localStorage.getItem('userId')); // Garante que o id será número
    console.log("Tentando comprar item:", { idUsuario, idItem, tipoIdItem: typeof idItem });
    try {
      const resposta = await axios.post(`${API_URL}/loja/comprar`, { idUsuario, idItem });
      console.log("Resposta da compra:", resposta.data);
      alert('Item comprado com sucesso!');
    } catch (erro) {
      console.error("Erro ao comprar item:", erro);
      alert(erro.response?.data?.erro || 'Erro ao comprar item');
    }
  });
}

// Chama ao carregar a página
window.onload = carregarItensLoja;