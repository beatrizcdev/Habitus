window.criarPopup = function(mensagem, onConfirmar, onCancelar) {
  const popup = document.createElement('div');
  popup.id = 'popup-confirmacao';
  popup.innerHTML = `
    <div class="popup-fundo"></div>
    <div class="popup-box">
      <p>${mensagem}</p>
      <div class="popup-botoes">
        <button id="popup-confirmar">Sim</button>
        <button id="popup-cancelar">Não</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('popup-confirmar').onclick = () => {
    popup.remove();
    onConfirmar();
  };
  document.getElementById('popup-cancelar').onclick = () => {
    popup.remove();
    if (onCancelar) onCancelar();
  };
}