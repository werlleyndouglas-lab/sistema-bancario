// js/main.js

import {
  adicionarCliente,
  editarCliente,
  excluirCliente,
  adicionarConta,
  editarStatusConta,
  excluirConta,
  registrarTransacao,
  usuariosGerenciais,
  clientes,
  carregarDadosIniciais
} from "./api.js";

import {
  validarCamposCliente,
  validarCamposConta,
  validarCamposTransacao
} from "./validacao.js";

import {
  mostrarWelcome,
  mostrarLogin,
  mostrarClienteDashboard,
  mostrarGerencialDashboard,
  carregarDashboardCliente,
  carregarDashboardGerencial
} from "./ui.js";

let clienteLogado = null;
let modoLogin = null;
let paginaAtual = 1;
const itensPorPagina = 5;

// Tema automático com localStorage
function aplicarTemaInicial() {
  const temaSalvo = localStorage.getItem("tema");
  const body = document.body;
  if (temaSalvo === "dark") {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  }
}

function alternarTema() {
  const body = document.body;
  const usandoDark = body.classList.contains("dark-theme");
  if (usandoDark) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    localStorage.setItem("tema", "light");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    localStorage.setItem("tema", "dark");
  }
}

// Inicialização
(async function init() {
  aplicarTemaInicial();
  await carregarDadosIniciais();
  mostrarWelcome();
})();

// Botões iniciais
document.getElementById("btnSouCliente").onclick = () => {
  modoLogin = "cliente";
  document.getElementById("loginTitulo").textContent = "Login do Cliente";
  document.getElementById("loginCPF").value = "";
  document.getElementById("loginSenha").value = "";
  document.getElementById("loginErro").textContent = "";
  mostrarLogin();
};

document.getElementById("btnSouGerencial").onclick = () => {
  modoLogin = "gerencial";
  document.getElementById("loginTitulo").textContent = "Login Funcionário";
  document.getElementById("loginCPF").value = "";
  document.getElementById("loginSenha").value = "";
  document.getElementById("loginErro").textContent = "";
  mostrarLogin();
};

// Login
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const cpf = loginCPF.value.trim();
  const senha = loginSenha.value.trim();

  if (cpf === "" || senha === "") {
    loginErro.textContent = "Informe CPF e senha.";
    return;
  }

  if (modoLogin === "cliente") {
    const clienteEncontrado = clientes.find(c => c.cpf === cpf);
    if (!clienteEncontrado || senha !== "123") {
      loginErro.textContent = "Login inválido para cliente.";
      return;
    }
    clienteLogado = clienteEncontrado;
    carregarDashboardCliente(clienteLogado);
    mostrarClienteDashboard();
    return;
  }

  if (modoLogin === "gerencial") {
    const usuario = usuariosGerenciais.find(u => u.cpf === cpf && u.senha === senha);
    if (!usuario) {
      loginErro.textContent = "Login inválido para funcionário.";
      return;
    }
    paginaAtual = 1;
    carregarDashboardGerencial(paginaAtual, itensPorPagina);
    mostrarGerencialDashboard();
    return;
  }
});

// Logoff
document.getElementById("btnClienteLogoff").onclick = () => {
  clienteLogado = null;
  mostrarWelcome();
};

document.getElementById("btnGerencialLogoff").onclick = () => {
  mostrarWelcome();
};

// Cadastro de clientes
document.getElementById("formCliente").addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = clienteNome.value.trim();
  const cpf = clienteCPF.value.trim();
  const email = clienteEmail.value.trim();

  const erro = validarCamposCliente(nome, cpf, email);
  if (erro) {
    erroCliente.textContent = erro;
    return;
  }

  adicionarCliente(nome, cpf, email);

  clienteNome.value = "";
  clienteCPF.value = "";
  clienteEmail.value = "";
  erroCliente.textContent = "";

  paginaAtual = 1;
  carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
});

// Cadastro de contas
document.getElementById("formConta").addEventListener("submit", (event) => {
  event.preventDefault();

  const clienteId = contaClienteSelect.value;
  const tipo = contaTipo.value;
  const numero = contaNumero.value.trim();

  const erro = validarCamposConta(clienteId, tipo, numero);
  if (erro) {
    erroConta.textContent = erro;
    return;
  }

  adicionarConta(clienteId, tipo, numero);

  contaClienteSelect.value = "";
  contaTipo.value = "";
  contaNumero.value = "";
  erroConta.textContent = "";

  paginaAtual = 1;
  carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
});

// Registrar transação
document.getElementById("formTransacao").addEventListener("submit", (event) => {
  event.preventDefault();

  const contaId = transacaoContaSelect.value;
  const tipo = transacaoTipo.value;
  const valor = Number(transacaoValor.value);

  const erro = validarCamposTransacao(contaId, tipo, valor);
  if (erro) {
    erroTransacao.textContent = erro;
    return;
  }

  const resultado = registrarTransacao(contaId, tipo, valor);

  if (resultado.erro) {
    erroTransacao.textContent = resultado.erro;
    return;
  }

  transacaoContaSelect.value = "";
  transacaoTipo.value = "";
  transacaoValor.value = "";
  erroTransacao.textContent = "";

  carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());

  if (clienteLogado) {
    carregarDashboardCliente(clienteLogado);
  }
});

// Delegação de eventos (editar/excluir/status)
document.addEventListener("click", (event) => {
  const idExcluirCliente = event.target.dataset.excluirCliente;
  const idEditarCliente = event.target.dataset.editarCliente;
  const idStatusConta = event.target.dataset.statusConta;
  const idExcluirConta = event.target.dataset.excluirConta;

  if (idExcluirCliente) {
    excluirCliente(Number(idExcluirCliente));
    paginaAtual = 1;
    carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
    if (clienteLogado) carregarDashboardCliente(clienteLogado);
  }

  if (idEditarCliente) {
    const cliente = clientes.find(c => c.id === Number(idEditarCliente));
    if (!cliente) return;
    clienteNome.value = cliente.nome;
    clienteCPF.value = cliente.cpf;
    clienteEmail.value = cliente.email;

    document.getElementById("formCliente").onsubmit = (e) => {
      e.preventDefault();
      const nome = clienteNome.value.trim();
      const cpf = clienteCPF.value.trim();
      const email = clienteEmail.value.trim();
      const erro = validarCamposCliente(nome, cpf, email);
      if (erro) {
        erroCliente.textContent = erro;
        return;
      }
      editarCliente(cliente.id, nome, cpf, email);
      clienteNome.value = "";
      clienteCPF.value = "";
      clienteEmail.value = "";
      erroCliente.textContent = "";
      document.getElementById("formCliente").onsubmit = null;
      paginaAtual = 1;
      carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
    };
  }

  if (idStatusConta) {
    editarStatusConta(Number(idStatusConta));
    carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
    if (clienteLogado) carregarDashboardCliente(clienteLogado);
  }

  if (idExcluirConta) {
    excluirConta(Number(idExcluirConta));
    carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
    if (clienteLogado) carregarDashboardCliente(clienteLogado);
  }
});

// Filtro de clientes
const filtroClientes = document.getElementById("filtroClientes");
filtroClientes.addEventListener("input", () => {
  paginaAtual = 1;
  carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
});

// Paginação
document.getElementById("btnPaginaAnterior").onclick = () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
  }
};

document.getElementById("btnPaginaProxima").onclick = () => {
  const totalPaginas = Math.max(1, Math.ceil(transacoes.length / itensPorPagina));
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroClientes.value.trim());
  }
};

// Tema
document.getElementById("themeToggle").onclick = () => {
  alternarTema();
};
