# Sistema Bancário (Frontend)

Projeto de painel bancário para gestão de clientes, contas e transações.

## Funcionalidades

- CRUD de clientes (listar, criar, editar, deletar)
- CRUD de contas (listar, criar, alterar status, deletar)
- Transações de depósito e saque com validação de saldo
- Histórico de transações com paginação
- Filtro de clientes por nome
- Tema claro/escuro com preferência salva em `localStorage`
- Layout responsivo para mobile

## Estrutura

```text
banco-frontend/
├── index.html
├── styles/
│   └── style.css
├── js/
│   ├── api.js
│   ├── ui.js
│   ├── validacao.js
│   └── main.js
├── db.json
└── README.md
