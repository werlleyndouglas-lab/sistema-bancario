// js/ui.js

import { clientes, contas, transacoes } from "./api.js";

export function mostrarWelcome() {
  document.getElementById("welcomeScreen").classList.remove("hidden");
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("clienteDashboard").classList.add("hidden");
  document.getElementById("gerencialDashboard").classList.add("hidden");
}

export function mostrarLogin() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("clienteDashboard").classList.add("hidden");
  document.getElementById("gerencialDashboard").classList.add("hidden");
}

export function mostrarClienteDashboard() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("clienteDashboard").classList.remove("hidden");
  document.getElementById("gerencialDashboard").classList.add("hidden");
}

export function mostrarGerencialDashboard() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("clienteDashboard").classList.add("hidden");
  document.getElementById("gerencialDashboard").classList.remove("hidden");
}

export function carregarSelectClientes() {
  const select = document.getElementById("contaClienteSelect");
  select.innerHTML = "";
  const opcaoPadrao = document.createElement("option");
  opcaoPadrao.value = "";
  opcaoPadrao.textContent = "Selecione o cliente";
  select.appendChild(opcaoPadrao);

  clientes.forEach(cliente => {
    const opt = document.createElement("option");
    opt.value = cliente.id;
    opt.textContent = `${cliente.nome} (${cliente.cpf})`;
    select.appendChild(opt);
  });
}

export function carregarSelectContasTransacao() {
  const select = document.getElementById("transacaoContaSelect");
  select.innerHTML = "";
  const opcaoPadrao = document.createElement("option");
  opcaoPadrao.value = "";
  opcaoPadrao.textContent = "Selecione a conta";
  select.appendChild(opcaoPadrao);

  contas.forEach(conta => {
    const opt = document.createElement("option");
    opt.value = conta.id;
    opt.textContent = conta.numero;
    select.appendChild(opt);
  });
}

export function carregarClientes(filtroNome = "") {
  const tabelaClientes = document.getElementById("tabelaClientes");
  tabelaClientes.innerHTML = "";

  const listaFiltrada = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(filtroNome.toLowerCase())
  );

  listaFiltrada.forEach(cliente => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.cpf}</td>
      <td>${cliente.email}</td>
      <td>
        <button class="btn btn-secondary" data-editar-cliente="${cliente.id}">Editar</button>
        <button class="btn btn-danger" data-excluir-cliente="${cliente.id}">Excluir</button>
      </td>
    `;
    tabelaClientes.appendChild(tr);
  });
}

export function carregarContas() {
  const tabelaContas = document.getElementById("tabelaContas");
  tabelaContas.innerHTML = "";

  contas.forEach(conta => {
    const cliente = clientes.find(c => c.id === conta.clienteId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${conta.numero}</td>
      <td>${cliente ? cliente.nome : "Desconhecido"}</td>
      <td>${conta.tipo}</td>
      <td>R$ ${conta.saldo.toFixed(2)}</td>
      <td>${conta.status}</td>
      <td>
        <button class="btn btn-secondary" data-status-conta="${conta.id}">Status</button>
        <button class="btn btn-danger" data-excluir-conta="${conta.id}">Excluir</button>
      </td>
    `;
    tabelaContas.appendChild(tr);
  });
}

export function carregarTransacoesPaginadas(paginaAtual, itensPorPagina) {
  const tabelaTransacoes = document.getElementById("tabelaTransacoes");
  tabelaTransacoes.innerHTML = "";

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagina = transacoes.slice(inicio, fim);

  pagina.forEach(t => {
    const conta = contas.find(c => c.id === t.contaId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.data}</td>
      <td>${conta ? conta.numero : "Desconhecida"}</td>
      <td>${t.tipo}</td>
      <td>R$ ${t.valor.toFixed(2)}</td>
      <td>R$ ${t.novoSaldo.toFixed(2)}</td>
    `;
    tabelaTransacoes.appendChild(tr);
  });

  const infoPagina = document.getElementById("infoPagina");
  const totalPaginas = Math.max(1, Math.ceil(transacoes.length / itensPorPagina));
  infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

export function carregarDashboardCliente(clienteLogado) {
  if (!clienteLogado) return;

  const clienteIdentificacao = document.getElementById("clienteIdentificacao");
  clienteIdentificacao.textContent =
    `Cliente: ${clienteLogado.nome} (${clienteLogado.cpf})`;

  const tabelaResumoCliente = document.getElementById("tabelaResumoCliente");
  tabelaResumoCliente.innerHTML = `
    <tr><td>Nome</td><td>${clienteLogado.nome}</td></tr>
    <tr><td>CPF</td><td>${clienteLogado.cpf}</td></tr>
    <tr><td>Email</td><td>${clienteLogado.email}</td></tr>
  `;

  const tabelaContasCliente = document.getElementById("tabelaContasCliente");
  tabelaContasCliente.innerHTML = "";

  const contasCliente = contas.filter(conta => conta.clienteId === clienteLogado.id);
  contasCliente.forEach(conta => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${conta.numero}</td>
      <td>${conta.tipo}</td>
      <td>R$ ${conta.saldo.toFixed(2)}</td>
      <td>${conta.status}</td>
    `;
    tabelaContasCliente.appendChild(tr);
  });

  const tabelaTransacoesCliente = document.getElementById("tabelaTransacoesCliente");
  tabelaTransacoesCliente.innerHTML = "";

  const transacoesCliente = transacoes.filter(t => {
    const conta = contas.find(c => c.id === t.contaId);
    return conta && conta.clienteId === clienteLogado.id;
  });

  transacoesCliente.forEach(t => {
    const conta = contas.find(c => c.id === t.contaId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.data}</td>
      <td>${conta ? conta.numero : "Desconhecida"}</td>
      <td>${t.tipo}</td>
      <td>R$ ${t.valor.toFixed(2)}</td>
      <td>R$ ${t.novoSaldo.toFixed(2)}</td>
    `;
    tabelaTransacoesCliente.appendChild(tr);
  });
}

export function carregarDashboardGerencial(paginaAtual, itensPorPagina, filtroNome = "") {
  carregarClientes(filtroNome);
  carregarContas();
  carregarSelectClientes();
  carregarSelectContasTransacao();
  carregarTransacoesPaginadas(paginaAtual, itensPorPagina);
}
