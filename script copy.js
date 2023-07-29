// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnJdx0dsjKMLGtLMpb3NSHurD_Q2BZwC8",
    authDomain: "sistema-de-vendas-aeeea.firebaseapp.com",
    databaseURL: "https://sistema-de-vendas-aeeea-default-rtdb.firebaseio.com",
    projectId: "sistema-de-vendas-aeeea",
    storageBucket: "sistema-de-vendas-aeeea.appspot.com",
    messagingSenderId: "907285790361",
    appId: "1:907285790361:web:da7e5484a1aff0d2488208",
    measurementId: "G-XFBZRQJQ2N" // Opcional, remova se não estiver usando o Google Analytics
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Função para adicionar produto ao banco de dados
  function adicionarProduto() {
    const produto = document.getElementById('produto').value;
    const valor = parseFloat(document.getElementById('valor').value);
  
    if (!produto || isNaN(valor)) {
      alert("Preencha corretamente os campos!");
      return;
    }
  
    const produtoRef = database.ref('produtos').push();
    produtoRef.set({
      nome: produto,
      valor: valor
    });
  
    document.getElementById('produto').value = '';
    document.getElementById('valor').value = '';
  
    // Atualizar a lista com todos os produtos, incluindo o novo produto adicionado
    listarProdutos();
  }
  
  // Função para exibir os produtos na página
  function exibirProdutos(produtos) {
    const listaProdutosElement = document.getElementById('listaProdutos');
    if (!listaProdutosElement) return; // Verifica se o elemento existe antes de continuar
  
    listaProdutosElement.innerHTML = '';
  
    produtos.forEach(produto => {
      const listItem = document.createElement('li');
      listItem.textContent = `${produto.nome}: R$ ${produto.valor.toFixed(2)}`;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Deletar";
      deleteButton.onclick = () => deletarProduto(produto.key);
  
      const editButton = document.createElement('button');
      editButton.textContent = "Editar";
      editButton.onclick = () => editarProduto(produto.key, produto.nome, produto.valor);
  
      listItem.appendChild(deleteButton);
      listItem.appendChild(editButton);
  
      listaProdutosElement.appendChild(listItem);
    });
  }
  
  // Função para obter e exibir a lista de produtos
  function listarProdutos() {
    database.ref('produtos').once('value')
      .then(snapshot => {
        const produtos = [];
        snapshot.forEach(produtoSnapshot => {
          const produto = produtoSnapshot.val();
          produto.key = produtoSnapshot.key;
          produtos.push(produto);
        });
        exibirProdutos(produtos);
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  // Função para deletar um produto
  function deletarProduto(key) {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      database.ref('produtos').child(key).remove();
      listarProdutos();
    }
  }
  
  // Função para editar um produto
  function editarProduto(key, nome, valor) {
    const novoNome = prompt("Digite o novo nome do produto:", nome);
    const novoValor = parseFloat(prompt("Digite o novo valor do produto:", valor));
  
    if (novoNome && !isNaN(novoValor)) {
      database.ref('produtos').child(key).update({
        nome: novoNome,
        valor: novoValor
      });
      listarProdutos();
    }
  }
  
  // Carregar a lista de produtos quando a página for carregada
  document.addEventListener("DOMContentLoaded", listarProdutos);
  
  // Função para abrir a página com a lista de produtos
  function verListaProdutos() {
    window.open("lista_produtos.html", "_blank");
  }
  
  // Função para obter a lista de produtos do Firebase
  function getProducts() {
    return database.ref('produtos').once('value').then(snapshot => {
      const produtos = [];
      snapshot.forEach(produtoSnapshot => {
        const produto = produtoSnapshot.val();
        produto.key = produtoSnapshot.key;
        produtos.push(produto);
      });
      return produtos;
    });
  }
  
  // Função para preencher o dropdown de produtos
  async function populateProductsDropdown() {
    const produtos = await getProducts();
    const dropdown = document.getElementById('produtos');
    dropdown.innerHTML = '<option value="" disabled selected>Selecione um produto</option>';
    produtos.forEach(produto => {
      const option = document.createElement('option');
      option.value = produto.key;
      option.textContent = `${produto.nome}: R$ ${produto.valor.toFixed(2)}`;
      dropdown.appendChild(option);
    });
  
    return produtos; // Retornar a lista de produtos
  }
  
  // Variável global para armazenar a lista de produtos
  let produtos;
  
  // Variável global para armazenar a lista de produtos adicionados ao orçamento
const produtosOrcamento = [];

// Função para calcular e atualizar o valor total
function updateTotal() {
  let total = 0;

  produtosOrcamento.forEach(produtoOrcamento => {
    const selectedProduct = produtos.find(p => p.key === produtoOrcamento.key);
    total += selectedProduct.valor * produtoOrcamento.quantidade;
  });

  document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
}

// Função para adicionar um produto à lista de orçamento
function adicionarProduto() {
  const selectedProductId = document.getElementById('produtos').value;
  const selectedProduct = produtos.find(p => p.key === selectedProductId);
  const quantidade = parseInt(document.getElementById('quantidade').value, 10) || 1;

  if (!selectedProduct || quantidade <= 0) {
    alert("Selecione um produto válido e informe a quantidade correta.");
    return;
  }

  const produtoOrcamento = {
    key: selectedProduct.key,
    quantidade: quantidade
  };

  produtosOrcamento.push(produtoOrcamento);

  const listItem = document.createElement('li');
  listItem.textContent = `${selectedProduct.nome}: R$ ${selectedProduct.valor.toFixed(2)} x ${quantidade}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Deletar";
  deleteButton.onclick = () => {
    const index = produtosOrcamento.findIndex(p => p.key === produtoOrcamento.key);
    produtosOrcamento.splice(index, 1);
    listItem.remove();
    updateTotal();
  };

  listItem.appendChild(deleteButton);
  document.getElementById('listaProdutosOrcamento').appendChild(listItem);

  updateTotal();
}

  
  // Função para gerar um número de pedido aleatório
  function generateOrderNumber() {
    return Math.floor(Math.random() * 100000);
  }
  
  // Função para enviar o formulário de orçamento
  function submitBudgetForm() {
    const pedido = generateOrderNumber();
    const cliente = document.getElementById('cliente').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
  
    // Processamento adicional ou envio dos dados para o backend ou Firebase, se necessário
  
    alert("Orçamento enviado com sucesso!");
    window.location.reload();
  }
  
  // Preencher o dropdown de produtos quando a página for carregada
  document.addEventListener("DOMContentLoaded", async () => {
    produtos = await populateProductsDropdown(); // Obter a lista de produtos e armazená-la na variável global
  
    // Anexar ouvintes de eventos após obter a lista de produtos
    document.getElementById('produtos').addEventListener('change', updateTotal);
    document.getElementById('quantidade').addEventListener('input', updateTotal);
    document.getElementById('budgetForm').addEventListener('submit', (event) => {
      event.preventDefault();
      submitBudgetForm();
    });
  });

  