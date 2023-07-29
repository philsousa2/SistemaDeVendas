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
    
        // Verifica se o valor do produto é um número válido antes de formatá-lo
        if (typeof produto.valor === 'number' && !isNaN(produto.valor)) {
          listItem.textContent = `${produto.nome}: R$ ${produto.valor.toFixed(2)}`;
        } else {
          listItem.textContent = `${produto.nome}: R$ (valor inválido)`;
        }
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
      updateTotal(); // Atualiza o valor total após a edição do produto
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
      const valor = parseFloat(produtoOrcamento.valor);
  
      if (!isNaN(valor)) {
        total += valor * produtoOrcamento.quantidade;
      }
    });
  
    document.getElementById('total').value = `R$ ${total.toFixed(2)}`;
  }

// Função para adicionar um produto à lista de orçamento
function adicionarProdutoAoOrcamento() {
    const selectedProductId = document.getElementById('produtos').value;
    const selectedProduct = produtos.find(p => p.key === selectedProductId);
    const quantidade = parseInt(document.getElementById('quantidade').value, 10) || 1;
  
    if (!selectedProduct || quantidade <= 0) {
      alert("Selecione um produto válido e informe a quantidade correta.");
      return;
    }
  
    const produtoOrcamento = {
      key: selectedProduct.key,
      nome: selectedProduct.nome,
      valor: selectedProduct.valor,
      quantidade: quantidade
    };
  
    produtosOrcamento.push(produtoOrcamento);
    updateTable();
    updateTotal(); // Atualiza o valor total após adicionar o produto ao orçamento
  }

// Função para atualizar a tabela de produtos no orçamento
function updateTable() {
    const tableBody = document.querySelector('#listaProdutosOrcamento tbody');
    tableBody.innerHTML = '';
  
    produtosOrcamento.forEach(produtoOrcamento => {
      const row = document.createElement('tr');
  
      const nameCell = document.createElement('td');
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = produtoOrcamento.nome;
      nameInput.addEventListener('input', (event) => {
        produtoOrcamento.nome = event.target.value;
      });
      nameCell.appendChild(nameInput);
  
      const valueCell = document.createElement('td');
      const valorInput = document.createElement('input');
      valorInput.type = 'text';
      valorInput.value = typeof produtoOrcamento.valor === 'number' && !isNaN(produtoOrcamento.valor)
        ? produtoOrcamento.valor.toFixed(2)
        : '';
      valorInput.addEventListener('input', (event) => {
        const newValue = parseFloat(event.target.value.replace(/[^0-9.]/g, ''));
        if (!isNaN(newValue)) {
          produtoOrcamento.valor = newValue;
          updateTotal(); // Atualiza o valor total após editar manualmente o valor do produto
        }
      });
      valueCell.appendChild(valorInput);
  
      const quantityCell = document.createElement('td');
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.step = '1';
      quantityInput.value = produtoOrcamento.quantidade;
      quantityInput.addEventListener('input', (event) => {
        produtoOrcamento.quantidade = parseInt(event.target.value, 10);
        updateTotal();
      });
      quantityCell.appendChild(quantityInput);
  
      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = "Remover";
      deleteButton.onclick = () => {
        const index = produtosOrcamento.findIndex(p => p.key === produtoOrcamento.key);
        produtosOrcamento.splice(index, 1);
        updateTable();
        updateTotal();
      };
      deleteCell.appendChild(deleteButton);
  
      row.appendChild(nameCell);
      row.appendChild(valueCell);
      row.appendChild(quantityCell);
      row.appendChild(deleteCell);
  
      tableBody.appendChild(row);
    });
  }
  

  // Função para gerar um número de pedido aleatório
function generateOrderNumber() {
    return Math.floor(Math.random() * 100000);
  }

// Função para calcular o valor total do orçamento
function calcularTotal() {
    let total = 0;
  
    produtosOrcamento.forEach(produtoOrcamento => {
      const selectedProduct = produtos.find(p => p.key === produtoOrcamento.key);
      total += selectedProduct.valor * produtoOrcamento.quantidade;
    });
  
    return total;
  }
  
  /// Função para enviar o formulário de orçamento
  async function submitBudgetForm() {
    const pedido = generateOrderNumber().toString(); // Converter para string
    const cliente = document.getElementById('cliente').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
  
    // Verificar se os campos obrigatórios estão preenchidos
    if (!cliente || !telefone || !email) {
      alert("Por favor, preencha todos os campos obrigatórios (cliente, telefone e email).");
      return;
    }
  
    // Verificar se há produtos adicionados ao orçamento
    if (produtosOrcamento.length === 0) {
      alert("Por favor, adicione pelo menos um produto ao orçamento.");
      return;
    }
  
    // Salvar os produtos adicionados no orçamento no objeto de orçamento
    const itens = produtosOrcamento.map(produtoOrcamento => ({
      key: produtoOrcamento.key,
      nome: produtoOrcamento.nome,
      valor: produtoOrcamento.valor,
      quantidade: produtoOrcamento.quantidade,
    }));
  
    // Calcular o valor total do orçamento
    const total = itens.reduce((acc, produto) => acc + (produto.valor * produto.quantidade), 0);
  
    // Salvar o orçamento no Firebase, incluindo os produtos adicionados e o valor total
    await database.ref('orcamentos').push({
      pedido: pedido,
      cliente: cliente,
      telefone: telefone,
      email: email,
      itens: itens,
      total: total,
    });
  
    alert("Orçamento enviado com sucesso!");
    window.location.reload();
  
    // Atualizar a lista de orçamentos salvos após o envio de um novo orçamento
    listarOrcamentosSalvos();
  }
// Função para exibir a lista de orçamentos salvos
function listarOrcamentosSalvos() {
  const listaOrcamentosSalvos = document.getElementById('listaOrcamentosSalvos');
  listaOrcamentosSalvos.innerHTML = '';
  produtosOrcamento.length = 0; // Limpar a lista de produtos do orçamento antes de exibir os detalhes
  database.ref('orcamentos').once('value')
    .then(snapshot => {
      snapshot.forEach(orcamentoSnapshot => {
        const orcamento = orcamentoSnapshot.val();
        const listItem = document.createElement('li');

        // Exibir os detalhes do orçamento
        const details = document.createElement('div');
        details.textContent = `Número do Pedido: ${orcamento.pedido}, Cliente: ${orcamento.cliente},  Total: R$ ${orcamento.total.toFixed(2)}`;
        listItem.appendChild(details);

        // Adicionar os produtos do orçamento
        const produtosList = document.createElement('ul');
        orcamento.itens.forEach(produtoOrcamento => {
          const produtoItem = document.createElement('li');
          produtoItem.textContent = `${produtoOrcamento.nome}: R$ ${produtoOrcamento.valor.toFixed(2)}, Quantidade: ${produtoOrcamento.quantidade}`;
          produtosList.appendChild(produtoItem);
        });
        listItem.appendChild(produtosList);

        // Adicionar botão de edição
        const editButton = document.createElement('button');
        editButton.textContent = "Editar";
        editButton.onclick = () => editarOrcamento(orcamentoSnapshot.key, orcamento);
        listItem.appendChild(editButton);

        // Adicionar botão de exclusão
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = () => deletarOrcamento(orcamentoSnapshot.key);
        listItem.appendChild(deleteButton);

        listaOrcamentosSalvos.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

// ... (código anterior)

// Variável global para armazenar o ID do orçamento em edição
let orcamentoEmEdicaoId = null;

// Função para editar um orçamento
function editarOrcamento(key, orcamento) {
    // Preencher o formulário de orçamento com os detalhes do orçamento selecionado
    document.getElementById('pedido').value = orcamento.pedido;
    document.getElementById('cliente').value = orcamento.cliente;
    document.getElementById('telefone').value = orcamento.telefone;
    document.getElementById('email').value = orcamento.email;
  
    // Limpar a lista de produtos do orçamento
    produtosOrcamento.length = 0;
  
    // Adicionar os produtos do orçamento selecionado na lista de produtos do orçamento
    orcamento.itens.forEach(produtoOrcamento => {
      const produto = {
        key: produtoOrcamento.key,
        nome: produtoOrcamento.nome,
        valor: produtoOrcamento.valor,
        quantidade: produtoOrcamento.quantidade,
      };
      produtosOrcamento.push(produto);
    });
  
    // Atualizar a tabela de produtos no orçamento
    updateTable();
  
    // Atualizar o valor total
    updateTotal();
  
    // Armazenar o ID do orçamento em edição
    orcamentoEmEdicaoId = key;
  
   
  // Alterar o texto e o evento do botão "Enviar orçamento" para "Salvar alterações"
    const submitButton = document.getElementById('submitButton');
    const EditButton = document.getElementById('saveButton');
    submitButton.style.display = 'none';
    EditButton.style.display = 'block';
  
}

/// ... (código anterior)

// Função para salvar as alterações no orçamento
async function salvarAlteracoesOrcamento() {
    // Obter os valores dos campos do formulário
    const pedido = document.getElementById('pedido').value;
    const cliente = document.getElementById('cliente').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
  
    // Verificar se os campos obrigatórios estão preenchidos
    if (!cliente || !telefone || !email) {
      alert("Por favor, preencha todos os campos obrigatórios (cliente, telefone e email).");
      return;
    }
  
    // Verificar se há produtos adicionados ao orçamento
    if (produtosOrcamento.length === 0) {
      alert("Por favor, adicione pelo menos um produto ao orçamento.");
      return;
    }
  
    // Salvar os produtos adicionados no orçamento no objeto de orçamento
    const itens = produtosOrcamento.map(produtoOrcamento => ({
      key: produtoOrcamento.key,
      nome: produtoOrcamento.nome,
      valor: produtoOrcamento.valor,
      quantidade: produtoOrcamento.quantidade,
    }));
  
    // Calcular o valor total do orçamento
    const total = itens.reduce((acc, produto) => acc + produto.valor * produto.quantidade, 0);
  
    // Salvar as alterações no Firebase
    await database.ref('orcamentos').child(orcamentoEmEdicaoId).update({
      pedido: pedido,
      cliente: cliente,
      telefone: telefone,
      email: email,
      itens: itens,
      total: total, // Atualizar o valor total com o novo cálculo
    });
  
    alert("Alterações salvas com sucesso!");
    window.location.reload();
  }
  
  
// Função para deletar um orçamento
function deletarOrcamento(key) {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      database.ref('orcamentos').child(key).remove();
      listarOrcamentosSalvos();
    }
  }
  
// Carregar a lista de produtos e a lista de orçamentos quando a página for carregada
document.addEventListener("DOMContentLoaded", async () => {
    produtos = await populateProductsDropdown(); // Obter a lista de produtos e armazená-la na variável global
    listarOrcamentosSalvos(); // Carregar a lista de orçamentos salvos
  
    // Anexar ouvintes de eventos após obter a lista de produtos
    document.getElementById('produtos').addEventListener('change', updateTotal);
    document.getElementById('quantidade').addEventListener('input', updateTotal);
    document.getElementById('budgetForm').addEventListener('submit', (event) => {
      event.preventDefault();
      submitBudgetForm();
    });
  });