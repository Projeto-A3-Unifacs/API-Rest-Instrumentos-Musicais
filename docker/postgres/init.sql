CREATE TABLE IF NOT EXISTS perfil (
  id_perfil INTEGER PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO perfil (id_perfil, nome) VALUES
  (1, 'Vendedor'),
  (2, 'Cliente'),
  (3, 'Administrador')
ON CONFLICT (id_perfil) DO NOTHING;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cpf VARCHAR(20) UNIQUE,
  telefone VARCHAR(30),
  data_nascimento DATE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_perfil INTEGER NOT NULL REFERENCES perfil(id_perfil),
  reset_token VARCHAR(20),
  reset_token_expires TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresa (
  id_empresa SERIAL PRIMARY KEY,
  razao_social VARCHAR(180),
  nome_fantasia VARCHAR(180),
  cnpj VARCHAR(25) UNIQUE,
  cep VARCHAR(15),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  id_usuario_responsavel INTEGER REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categoria (id_categoria, nome) VALUES
  (1, 'Instrumentos musicais')
ON CONFLICT (id_categoria) DO NOTHING;

CREATE TABLE IF NOT EXISTS produto (
  id_produto SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  estoque INTEGER NOT NULL DEFAULT 0,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  id_categoria INTEGER REFERENCES categoria(id_categoria),
  id_empresa INTEGER REFERENCES empresa(id_empresa) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pedido (
  id_pedido SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  valor_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'REALIZADO',
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_pedido (
  id_item_pedido SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS carrinho (
  id_carrinho SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS item_carrinho (
  id_item_carrinho SERIAL PRIMARY KEY,
  id_carrinho INTEGER NOT NULL REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
  id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
  UNIQUE (id_carrinho, id_produto)
);

CREATE TABLE IF NOT EXISTS afiliado (
  id_afiliado SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_aprovacao TIMESTAMP
);

CREATE TABLE IF NOT EXISTS afiliacao_produto (
  id_afiliacao SERIAL PRIMARY KEY,
  id_afiliado INTEGER NOT NULL REFERENCES afiliado(id_afiliado) ON DELETE CASCADE,
  id_produto INTEGER NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_aprovacao TIMESTAMP,
  percentual_comissao NUMERIC(5,2) DEFAULT 0,
  UNIQUE (id_afiliado, id_produto)
);

CREATE TABLE IF NOT EXISTS comissao (
  id_comissao SERIAL PRIMARY KEY,
  id_afiliacao INTEGER REFERENCES afiliacao_produto(id_afiliacao) ON DELETE SET NULL,
  id_pedido INTEGER REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  valor_venda NUMERIC(10,2) NOT NULL DEFAULT 0,
  percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  valor_comissao NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
  data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carteira (
  id_carteira SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  saldo NUMERIC(10,2) NOT NULL DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saque (
  id_saque SERIAL PRIMARY KEY,
  id_carteira INTEGER NOT NULL REFERENCES carteira(id_carteira) ON DELETE CASCADE,
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
  data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS endereco (
  id_endereco SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  cep VARCHAR(15),
  rua VARCHAR(180),
  numero VARCHAR(20),
  complemento VARCHAR(120),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2)
);

CREATE TABLE IF NOT EXISTS frete (
  id_frete SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  id_produto INTEGER REFERENCES produto(id_produto),
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  prazo_dias INTEGER,
  cidade_origem VARCHAR(100),
  estado_origem VARCHAR(2),
  cidade_destino VARCHAR(100),
  estado_destino VARCHAR(2),
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE'
);

CREATE TABLE IF NOT EXISTS pagamento (
  id_pagamento SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  metodo VARCHAR(50) NOT NULL,
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
  data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
