// BLOCO 1: Controle dos botões de quantidade
document.addEventListener("DOMContentLoaded", () => {
  const pratos = document.querySelectorAll(".prato-item");

  // cria dinamicamente o total geral se não existir
  let totalGeralEl = document.querySelector("#total-geral h3");
  if (!totalGeralEl) {
    const divTotal = document.createElement("div");
    divTotal.id = "total-geral";
    divTotal.innerHTML = "<h3>Total do Pedido: R$ 0,00</h3>";
    document.querySelector("#cardapio").appendChild(divTotal);
    totalGeralEl = divTotal.querySelector("h3");
  }

  function calcularTotalGeral() {
    let totalGeral = 0;
    pratos.forEach(p => {
      const precoP = parseFloat(p.querySelector(".preco").textContent.replace("R$", "").replace(",", "."));
      const qtdP = parseInt(p.querySelector(".contador").textContent);
      totalGeral += precoP * qtdP;
    });
    totalGeralEl.textContent = `Total do Pedido: R$ ${totalGeral.toFixed(2)}`;
  }

  pratos.forEach(prato => {
    const maisBtn = prato.querySelector(".mais");
    const menosBtn = prato.querySelector(".menos");
    const contador = prato.querySelector(".contador");
    const precoEl = prato.querySelector(".preco");

    // cria dinamicamente o total individual se não existir
    let totalItemEl = prato.querySelector(".total-item");
    if (!totalItemEl) {
      totalItemEl = document.createElement("span");
      totalItemEl.className = "total-item";
      totalItemEl.textContent = "Total: R$ 0,00";
      prato.appendChild(totalItemEl);
    }

    const preco = parseFloat(precoEl.textContent.replace("R$", "").replace(",", "."));
    let quantidade = 0;

    function atualizarTotais() {
      contador.textContent = quantidade;
      const totalItem = quantidade * preco;
      totalItemEl.textContent = `Total: R$ ${totalItem.toFixed(2)}`;
      calcularTotalGeral();
    }

    maisBtn.addEventListener("click", () => {
      if (quantidade < 10) {
        quantidade++;
        atualizarTotais();
      } else {
        alert("Para pedidos acima de 10 unidades, entre em contato pelo WhatsApp!");
      }
    });

    menosBtn.addEventListener("click", () => {
      if (quantidade > 0) {
        quantidade--;
        atualizarTotais();
      }
    });
  });
});

// BLOCO 2: Envio do formulário para WhatsApp
document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Captura os valores do formulário
  const nomeCliente = document.getElementById("nome").value;
  const telefoneCliente = document.getElementById("telefone").value;
  const enderecoCliente = document.getElementById("endereco").value; // corrigido sem acento

  // Número do WhatsApp que vai receber o pedido (substitua pelo seu número com DDI e DDD)
  const numeroWhatsApp = "5531975582321"; // Exemplo: 55 (Brasil) + 31 (DDD) + número

  // Captura os itens do pedido
  let itensPedido = "";
  const pratos = document.querySelectorAll(".prato-item");
  pratos.forEach(prato => {
    const nomePrato = prato.querySelector("h3").textContent;
    const qtd = parseInt(prato.querySelector(".contador").textContent);
    const preco = parseFloat(prato.querySelector(".preco").textContent.replace("R$", "").replace(",", "."));
    if (qtd > 0) {
      const totalItem = (qtd * preco).toFixed(2);
      itensPedido += `🍴 ${nomePrato} - ${qtd} unidade(s) - Total R$ ${totalItem}\n`;
    }
  });

  // Monta a mensagem
  const textoMensagem = `*Novo Pedido*%0A
Nome: ${nomeCliente}%0A
Telefone: ${telefoneCliente}%0A
Endereço: ${enderecoCliente}%0A
Itens:%0A${encodeURIComponent(itensPedido)}`;

  // Monta a URL da API do WhatsApp
  const url = `https://wa.me/${numeroWhatsApp}?text=${textoMensagem}`;

  // Abre o WhatsApp com a mensagem pronta
  window.open(url, "_blank");
});
