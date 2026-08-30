// js/api.js

export let clientes = [];
export let contas = [];
export let transacoes = [];
export const usuariosGerenciais = [
  { cpf: "00000000000", senha: "admin" }
];

// Carrega dados iniciais do db.json (opcional, simulação)
export async function carregarDadosIniciais() {
  try {
    const resposta = await fetch("./db.json");
    const dados = await resposta.json();
    clientes = dados.clientes || [];
    contas = dados.contas || [];
    transacoes = dados.transacoes || [];
  } catch (e) {
    console.warn("Não foi possível carregar db.json, usando arrays vazios.");
  }
}

export function adicionarCliente(nome, cpf, email) {
  const novoCliente = {
    id: Date.now(),
    nome,
    cpf,
    email
  };
  clientes.push(novoCliente);
  return novoCliente;
}

export function editarCliente(id, nome, cpf, email) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return null;
  cliente.nome = nome;
  cliente.cpf = cpf;
  cliente.email = email;
  return cliente;
}

export function excluirCliente(idCliente) {
  clientes = clientes.filter(c => c.id !== idCliente);
  contas = contas.filter(conta => conta.clienteId !== idCliente);
  transacoes = transacoes.filter(t => {
    const contaExiste = contas.find(c => c.id === t.contaId);
    return contaExiste !== undefined;
  });
}

export function adicionarConta(clienteId, tipo, numero) {
  const novaConta = {
    id: Date.now(),
    numero,
    clienteId: Number(clienteId),
    tipo,
    saldo: 0,
    status: "Ativa"
  };
  contas.push(novaConta);
  return novaConta;
}

export function editarStatusConta(idConta) {
  const conta = contas.find(c => c.id === idConta);
  if (!conta) return null;
  conta.status = conta.status === "Ativa" ? "Inativa" : "Ativa";
  return conta;
}

export function excluirConta(idConta) {
  contas = contas.filter(c => c.id !== idConta);
  transacoes = transacoes.filter(t => t.contaId !== idConta);
}

export function registrarTransacao(contaId, tipo, valor) {
  const conta = contas.find(c => c.id === Number(contaId));
  if (!conta) {
    return { erro: "Conta não encontrada." };
  }

  if (tipo === "Saque" && conta.saldo < valor) {
    return { erro: "Saldo insuficiente para saque." };
  }

  if (tipo === "Depósito") {
    conta.saldo += valor;
  } else {
    conta.saldo -= valor;
  }

  const novaTransacao = {
    id: Date.now(),
    contaId: conta.id,
    tipo,
    valor,
    novoSaldo: conta.saldo,
    data: new Date().toISOString().slice(0, 10)
  };

  transacoes.push(novaTransacao);
  return novaTransacao;
}
