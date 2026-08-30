// js/validacao.js

export function validarCPF(cpf) {
  return cpf.length === 11 && !isNaN(cpf);
}

export function validarEmail(email) {
  return email.includes("@");
}

export function validarValor(valor) {
  return !isNaN(valor) && valor > 0;
}

export function validarCamposCliente(nome, cpf, email) {
  if (!nome || !cpf || !email) {
    return "Preencha todos os campos.";
  }
  if (!validarCPF(cpf)) {
    return "CPF deve ter 11 dígitos numéricos.";
  }
  if (!validarEmail(email)) {
    return "Email deve conter '@'.";
  }
  return null;
}

export function validarCamposConta(clienteId, tipo, numero) {
  if (!clienteId || !tipo || !numero) {
    return "Preencha todos os campos.";
  }
  return null;
}

export function validarCamposTransacao(contaId, tipo, valor) {
  if (!contaId || !tipo || !validarValor(valor)) {
    return "Preencha todos os campos corretamente.";
  }
  return null;
}
