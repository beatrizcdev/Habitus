const API_URL = "http://localhost:5000";

async function carregarItensLoja() {
  try {
    // Busca os itens da loja 
    const resposta = await axios.get(`${API_URL}/loja/itens`);
    const itens = resposta.data;

    // Filtra apenas skins
    const skins = Array.isArray(itens) ? itens.filter(item => item.tipo === 'skin') : [];

    // Salva no localStorage
    localStorage.setItem('itensLoja', JSON.stringify(skins));

    // Seleciona o container
    const container = document.querySelector('.Container_produto');
    if (!container) {
      console.error('Container .Container_produto não encontrado no HTML!');
      return;
    }
    container.innerHTML = '';

    // Exibe apenas skins
    if (skins.length === 0) {
      container.innerHTML = '<p>Nenhuma skin disponível na loja.</p>';
      return;
    }

    skins.forEach((skin) => {
      // Cria a div do item (classe padronizada "item")
      const div = document.createElement('div');
      div.className = 'item';
      div.id = skin.idItem;

      div.innerHTML = `
        <img class="capibara" src="../pictures/capibbara/capibbara${skin.idItem}.svg" alt="Capibara">
        <div class="texto">
          <p class="nivel">level: 10</p>
          <div>
            <button class="botao" type="button">${skin.preco}</button>
            <img class="coinspig" src="../pictures/utilidades/coinspig.svg">
          </div>
        </div>
      `;

      // Adiciona event listener ao botão
      const botao = div.querySelector('.botao');
      botao.addEventListener('click', (event) => {
        event.preventDefault();
        comprarItem(Number(div.id));
      });

      container.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar itens da loja:', erro);
    alert('Erro ao carregar itens da loja');
  }
}

// Função para comprar item (sem equipar)
async function comprarItem(idItem) {
  criarPopup('Tem certeza que deseja comprar este item?', async () => {
    const idUsuario = Number(localStorage.getItem('userId'));
    try {
      const resposta = await axios.post(`${API_URL}/loja/comprar`, { idUsuario, idItem });
      alert('Item comprado com sucesso!');
    } catch (erro) {
      alert(erro.response?.data?.erro || 'Erro ao comprar item');
    }
  });
}

// Chama ao carregar a página
window.onload = carregarItensLoja;