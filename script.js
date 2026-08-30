// ========================================
// BANCO DE DADOS EM MEMÓRIA
// ========================================
let clientes = [];
let contas = [];
let transacoes = [];

let usuariosGerenciais = [
  { cpf: "00000000000", senha: "admin" }
];

let clienteLogado = null;
let modoLogin = null;

// ========================================
// ELEMENTOS DO DOM
// ========================================
const welcomeScreen = document.getElementById("welcomeScreen");
const loginScreen = document.getElementById("loginScreen");
const clienteDashboard = document.getElementById("clienteDashboard");
const gerencialDashboard = document.getElementById("gerencialDashboard");

// Botões iniciais
const btnSouCliente = document.getElementById("btnSouCliente");
const btnSouGerencial = document.getElementById("btnSouGerencial");

// Login
const loginTitulo = document.getElementById("loginTitulo");
const loginForm = document.getElementById("loginForm");
const loginCPF = document.getElementById("loginCPF");
const loginSenha = document.getElementById("loginSenha");
const loginErro = document.getElementById("loginErro");

// Cliente dashboard
const clienteIdentificacao = document.getElementById("clienteIdentificacao");
const tabelaResumoCliente = document.getElementById("tabelaResumoCliente");
const tabelaContasCliente = document.getElementById("tabelaContasCliente");
const tabelaTransacoesCliente = document.getElementById("tabelaTransacoesCliente");
const btnClienteLogoff = document.getElementById("btnClienteLogoff");

// Gerencial dashboard
const btnGerencialLogoff = document.getElementById("btnGerencialLogoff");

// Cadastro de clientes
const formCliente = document.getElementById("formCliente");
const clienteNome = document.getElementById("clienteNome");
const clienteCPF = document.getElementById("clienteCPF");
const clienteEmail = document.getElementById("clienteEmail");
const erroCliente = document.getElementById("erroCliente");
const tabelaClientes = document.getElementById("tabelaClientes");

// Cadastro de contas
const formConta = document.getElementById("formConta");
const contaClienteSelect = document.getElementById("contaClienteSelect");
const contaTipo = document.getElementById("contaTipo");
const contaNumero = document.getElementById("contaNumero");
const erroConta = document.getElementById("erroConta");
const tabelaContas = document.getElementById("tabelaContas");

// Transações
const formTransacao = document.getElementById("formTransacao");
const transacaoContaSelect = document.getElementById("transacaoContaSelect");
const transacaoTipo = document.getElementById("transacaoTipo");
const transacaoValor = document.getElementById("transacaoValor");
const erroTransacao = document.getElementById("erroTransacao");
const tabelaTransacoes = document.getElementById("tabelaTransacoes");

// Tema
const themeToggle = document.getElementById("themeToggle");

// ========================================
// FUNÇÕES DE NAVEGAÇÃO
// ========================================
function mostrarWelcome() {
  welcomeScreen.classList.remove("hidden");
  loginScreen.classList.add("hidden");
  clienteDashboard.classList.add("hidden");
  gerencialDashboard.classList.add("hidden");
}

function mostrarLogin() {
  welcomeScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  clienteDashboard.classList.add("hidden");
  gerencialDashboard.classList.add("hidden");
}

function mostrarClienteDashboard() {
  welcomeScreen.classList.add("hidden");
  loginScreen.classList.add("hidden");
  clienteDashboard.classList.remove("hidden");
  gerencialDashboard.classList.add("hidden");
}

function mostrarGerencialDashboard() {
  welcomeScreen.classList.add("hidden");
  loginScreen.classList.add("hidden");
  clienteDashboard.classList.add("hidden");
  gerencialDashboard.classList.remove("hidden");
}

// ========================================
// BOTÕES DE ENTRADA
// ========================================
btnSouCliente.addEventListener("click", function () {
  modoLogin = "cliente";
  loginTitulo.textContent = "Login do Cliente";
  loginCPF.value = "";
  loginSenha.value = "";
  loginErro.textContent = "";
  mostrarLogin();
});

btnSouGerencial.addEventListener("click", function () {
  modoLogin = "gerencial";
  loginTitulo.textContent = "Login Funcionário";
  loginCPF.value = "";
  loginSenha.value = "";
  loginErro.textContent = "";
  mostrarLogin();
});

// ========================================
// LOGIN
// ========================================
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cpf = loginCPF.value.trim();
  const senha = loginSenha.value.trim();

  if (cpf === "" || senha === "") {
    loginErro.textContent = "Informe CPF e senha.";
    return;
  }

  if (modoLogin === "cliente") {
    const clienteEncontrado = clientes.find(function (c) {
      return c.cpf === cpf;
    });

    if (!clienteEncontrado || senha !== "123") {
      loginErro.textContent = "Login inválido para cliente.";
      return;
    }

    clienteLogado = clienteEncontrado;
    carregarDashboardCliente();
    mostrarClienteDashboard();
  }

  if (modoLogin === "gerencial") {
    const usuario = usuariosGerenciais.find(function (u) {
      return u.cpf === cpf && u.senha === senha;
    });

    if (!usuario) {
      loginErro.textContent = "Login inválido para funcionário.";
      return;
    }

    carregarDashboardGerencial();
    mostrarGerencialDashboard();
  }
});

// ========================================
// LOGOFF
// ========================================
btnClienteLogoff.addEventListener("click", function () {
  clienteLogado = null;
  mostrarWelcome();
});

btnGerencialLogoff.addEventListener("click", function () {
  mostrarWelcome();
});

// ========================================
// CADASTRO DE CLIENTES
// ========================================
formCliente.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = clienteNome.value.trim();
  const cpf = clienteCPF.value.trim();
  const email = clienteEmail.value.trim();

  if (nome === "" || cpf === "" || email === "") {
    erroCliente.textContent = "Preencha todos os campos.";
    return;
  }

  if (cpf.length !== 11 || isNaN(cpf)) {
    erroCliente.textContent = "CPF deve ter 11 dígitos numéricos.";
    return;
  }

  if (!email.includes("@")) {
    erroCliente.textContent = "Email deve conter '@'.";
    return;
  }

  const novoCliente = {
    id: Date.now(),
    nome: nome,
    cpf: cpf,
    email: email
  };

  clientes.push(novoCliente);

  clienteNome.value = "";
  clienteCPF.value = "";
  clienteEmail.value = "";
  erroCliente.textContent = "";

  carregarClientes();
  carregarSelectClientes();
});

// ========================================
// LISTAR CLIENTES
// ========================================
function carregarClientes() {
  tabelaClientes.innerHTML = "";

  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.email}</td>
      <td>
        <button class="btn btn-danger" onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    `;

    tabelaClientes.appendChild(tr);
  }
}

// ========================================
// EXCLUIR CLIENTE
// ========================================
function excluirCliente(idCliente) {
  clientes = clientes.filter(function (c) {
    return c.id !== idCliente;
  });

  contas = contas.filter(function (conta) {
    return conta.clienteId !== idCliente;
  });

  transacoes = transacoes.filter(function (t) {
    const contaExiste = contas.find(function (conta) {
      return conta.id === t.contaId;
    });
    return contaExiste !== undefined;
  });

  carregarClientes();
  carregarContas();
  carregarSelectClientes();
  carregarSelectContasTransacao();
}

// ========================================
// SELECT DE CLIENTES
// ========================================
function carregarSelectClientes() {
  contaClienteSelect.innerHTML = "";

  const opcaoPadrao = document.createElement("option");
  opcaoPadrao.value = "";
  opcaoPadrao.textContent = "Selecione o cliente";
  contaClienteSelect.appendChild(opcaoPadrao);

  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const opt = document.createElement("option");
    opt.value = cliente.id;
    opt.textContent = cliente.nome + " (" + cliente.cpf + ")";
    contaClienteSelect.appendChild(opt);
  }
}

// ========================================
// CADASTRO DE CONTAS
// ========================================
formConta.addEventListener("submit", function (event) {
  event.preventDefault();

  const clienteId = contaClienteSelect.value;
  const tipo = contaTipo.value;
  const numero = contaNumero.value.trim();

  if (clienteId === "" || tipo === "" || numero === "") {
    erroConta.textContent = "Preencha todos os campos.";
    return;
  }

  const novaConta = {
    id: Date.now(),
    numero: numero,
    clienteId: Number(clienteId),
    tipo: tipo,
    saldo: 0,
    status: "Ativa"
  };

  contas.push(novaConta);

  contaClienteSelect.value = "";
  contaTipo.value = "";
  contaNumero.value = "";
  erroConta.textContent = "";

  carregarContas();
  carregarSelectContasTransacao();
});

// ========================================
// LISTAR CONTAS
// ========================================
function carregarContas() {
  tabelaContas.innerHTML = "";

  for (let i = 0; i < contas.length; i++) {
    const conta = contas[i];
    const cliente = clientes.find(function (c) {
      return c.id === conta.clienteId;
    });

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${conta.numero}</td>
      <td>${cliente ? cliente.nome : "Desconhecido"}</td>
      <td>${conta.tipo}</td>
      <td>R$ ${conta.saldo.toFixed(2)}</td>
      <td>${conta.status}</td>
      <td>
        <button class="btn btn-secondary" onclick="alternarStatusConta(${conta.id})">Status</button>
        <button class="btn btn-danger" onclick="excluirConta(${conta.id})">Excluir</button>
      </td>
    `;

    tabelaContas.appendChild(tr);
  }
}

// ========================================
// ALTERAR STATUS DA CONTA
// ========================================
function alternarStatusConta(idConta) {
  const conta = contas.find(function (c) {
    return c.id === idConta;
  });

  if (conta.status === "Ativa") {
    conta.status = "Inativa";
  } else {
    conta.status = "Ativa";
  }

  carregarContas();
  carregarDashboardCliente();
}

// ========================================
// EXCLUIR CONTA
// ========================================
function excluirConta(idConta) {
  contas = contas.filter(function (c) {
    return c.id !== idConta;
  });

  transacoes = transacoes.filter(function (t) {
    return t.contaId !== idConta;
  });

  carregarContas();
  carregarSelectContasTransacao();
  carregarDashboardCliente();
}

// ========================================
// SELECT DE CONTAS PARA TRANSACAO
// ========================================
function carregarSelectContasTransacao() {
  transacaoContaSelect.innerHTML = "";

  const opcaoPadrao = document.createElement("option");
  opcaoPadrao.value = "";
  opcaoPadrao.textContent = "Selecione a conta";
  transacaoContaSelect.appendChild(opcaoPadrao);

  for (let i = 0; i < contas.length; i++) {
    const conta = contas[i];
    const opt = document.createElement("option");
    opt.value = conta.id;
    opt.textContent = conta.numero;
    transacaoContaSelect.appendChild(opt);
  }
}

// ========================================
// REGISTRAR TRANSACAO
// ========================================
formTransacao.addEventListener("submit", function (event) {
  event.preventDefault();

  const contaId = transacaoContaSelect.value;
  const tipo = transacaoTipo.value;
  const valor = Number(transacaoValor.value);

  if (contaId === "" || tipo === "" || isNaN(valor) || valor <= 0) {
    erroTransacao.textContent = "Preencha todos os campos corretamente.";
    return;
  }

  const conta = contas.find(function (c) {
    return c.id === Number(contaId);
  });

  if (!conta) {
    erroTransacao.textContent = "Conta não encontrada.";
    return;
  }

  if (tipo === "Saque" && conta.saldo < valor) {
    erroTransacao.textContent = "Saldo insuficiente para saque.";
    return;
  }

  if (tipo === "Depósito") {
    conta.saldo = conta.saldo + valor;
  } else {
    conta.saldo = conta.saldo - valor;
  }

  const novaTransacao = {
    id: Date.now(),
    contaId: conta.id,
    tipo: tipo,
    valor: valor,
    novoSaldo: conta.saldo,
    data: new Date().toISOString().slice(0, 10)
  };

  transacoes.push(novaTransacao);

  transacaoContaSelect.value = "";
  transacaoTipo.value = "";
  transacaoValor.value = "";
  erroTransacao.textContent = "";

  carregarTransacoes();
  carregarDashboardCliente();
});

// ========================================
// LISTAR TRANSACOES
// ========================================
function carregarTransacoes() {
  tabelaTransacoes.innerHTML = "";

  for (let i = 0; i < transacoes.length; i++) {
    const t = transacoes[i];
    const conta = contas.find(function (c) {
      return c.id === t.contaId;
    });

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.data}</td>
      <td>${conta ? conta.numero : "Desconhecida"}</td>
      <td>${t.tipo}</td>
      <td>R$ ${t.valor.toFixed(2)}</td>
      <td>R$ ${t.novoSaldo.toFixed(2)}</td>
    `;

    tabelaTransacoes.appendChild(tr);
  }
}

// ========================================
// DASHBOARD CLIENTE
// ========================================
function carregarDashboardCliente() {
  if (!clienteLogado) {
    return;
  }

  clienteIdentificacao.textContent =
    "Cliente: " + clienteLogado.nome + " (" + clienteLogado.cpf + ")";

  tabelaResumoCliente.innerHTML = "";

  const trNome = document.createElement("tr");
  trNome.innerHTML = "<td>Nome</td><td>" + clienteLogado.nome + "</td>";

  const trCPF = document.createElement("tr");
  trCPF.innerHTML = "<td>CPF</td><td>" + clienteLogado.cpf + "</td>";

  const trEmail = document.createElement("tr");
  trEmail.innerHTML = "<td>Email</td><td>" + clienteLogado.email + "</td>";

  tabelaResumoCliente.appendChild(trNome);
  tabelaResumoCliente.appendChild(trCPF);
  tabelaResumoCliente.appendChild(trEmail);

  tabelaContasCliente.innerHTML = "";

  const contasCliente = contas.filter(function (conta) {
    return conta.clienteId === clienteLogado.id;
  });

  for (let i = 0; i < contasCliente.length; i++) {
    const conta = contasCliente[i];
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${conta.numero}</td>
      <td>${conta.tipo}</td>
      <td>R$ ${conta.saldo.toFixed(2)}</td>
      <td>${conta.status}</td>
    `;

    tabelaContasCliente.appendChild(tr);
  }

  tabelaTransacoesCliente.innerHTML = "";

  const transacoesCliente = transacoes.filter(function (t) {
    const conta = contas.find(function (c) {
      return c.id === t.contaId;
    });
    return conta && conta.clienteId === clienteLogado.id;
  });

  for (let i = 0; i < transacoesCliente.length; i++) {
    const t = transacoesCliente[i];
    const conta = contas.find(function (c) {
      return c.id === t.contaId;
    });

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.data}</td>
      <td>${conta ? conta.numero : "Desconhecida"}</td>
      <td>${t.tipo}</td>
      <td>R$ ${t.valor.toFixed(2)}</td>
      <td>R$ ${t.novoSaldo.toFixed(2)}</td>
    `;

    tabelaTransacoesCliente.appendChild(tr);
  }
}

// ========================================
// DASHBOARD GERENCIAL
// ========================================
function carregarDashboardGerencial() {
  carregarClientes();
  carregarContas();
  carregarTransacoes();
  carregarSelectClientes();
  carregarSelectContasTransacao();
}

// ========================================
// TEMA
// ========================================
themeToggle.addEventListener("click", function () {
  const body = document.body;

  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  }
});

// ========================================
// INICIAL
// ========================================
mostrarWelcome();
