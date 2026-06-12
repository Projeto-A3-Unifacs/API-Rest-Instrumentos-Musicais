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



INSERT INTO categoria (id_categoria, nome) VALUES 
  (2, 'Cordas'), 
  (3, 'Teclas'), 
  (4, 'Percussão'),
  (5, 'Áudio e Gravação')
ON CONFLICT (id_categoria) DO NOTHING;


INSERT INTO usuario (id_usuario, nome, email, senha, cpf, telefone, id_perfil) VALUES 
  (1, 'Carlos Vendedor', 'carlos@vendas.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '11111111111', '71999999991', 1),
  (2, 'Ana Vendedora', 'ana@vendas.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '22222222222', '71999999992', 1),
  (3, 'João Cliente', 'joao@cliente.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '33333333333', '71999999993', 2),
  (4, 'Maria Cliente', 'maria@cliente.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '44444444444', '71999999994', 2),
  (5, 'Pedro Cliente', 'pedro@cliente.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '55555555555', '71999999995', 2),
  (6, 'Lucas Cliente', 'lucas@cliente.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '66666666666', '71999999996', 2),
  (7, 'Julia Cliente', 'julia@cliente.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '77777777777', '71999999997', 2),
  (8, 'Administrador do Sistema', 'admin@sistema.com', '$2b$10$318M85uh8kVmvWvJ.rCV5.hK0CLyAFvIW2W2bG0ca.mDPtkBuhHRO', '88888888888', '71999999998', 3);

INSERT INTO empresa (id_empresa, razao_social, nome_fantasia, cnpj, cidade, estado, id_usuario_responsavel) VALUES 
  (1, 'Musical Store Comércio LTDA', 'Musical Store', '12345678000199', 'Salvador', 'BA', 1),
  (2, 'Acústica Instrumentos SA', 'Acústica e CIA', '98765432000188', 'São Paulo', 'SP', 2);


INSERT INTO produto (id_produto, nome, descricao, preco, estoque, marca, modelo, id_categoria, id_empresa) VALUES 
  (1, 'Violão Takamine GD30', 'Violão folk eletroacústico com timbre encorpado, perfeito para sertanejo.', 1200.00, 15, 'Takamine', 'GD30CE', 2, 1),
  (2, 'Teclado Yamaha PSR-E373', 'Teclado arranjador de 61 teclas sensitivas, ideal para iniciantes e intermediários.', 1850.00, 8, 'Yamaha', 'PSR-E373', 3, 2),
  (3, 'Bateria Pearl Export', 'Bateria acústica completa com pratos e ferragens, excelente ressonância.', 5200.00, 3, 'Pearl', 'EXX725S', 4, 1),
  (4, 'Guitarra Fender Stratocaster', 'Guitarra clássica com timbre limpo e versátil.', 4500.00, 4, 'Fender', 'Player Stratocaster', 2, 2),
  (5, 'Baixo Tagima TJB-4', 'Contrabaixo passivo de 4 cordas, excelente custo-benefício.', 1100.00, 10, 'Tagima', 'TJB-4 Woodstock', 2, 1),
  (6, 'Violão Giannini Start', 'Violão acústico de nylon para iniciantes.', 450.00, 30, 'Giannini', 'N-14', 2, 2),
  (7, 'Cajon FSA Standard', 'Cajon inclinado acústico, ótimo para shows intimistas.', 380.00, 12, 'FSA', 'Standard', 4, 1),
  (8, 'Piano Digital Casio CDP-S110', 'Piano digital compacto de 88 teclas com ação de martelo.', 2600.00, 5, 'Casio', 'CDP-S110', 3, 2),
  (9, 'Microfone Shure SM58', 'Microfone dinâmico vocal lendário, padrão da indústria.', 850.00, 20, 'Shure', 'SM58-LC', 5, 1),
  (10, 'Ukulele Kalani Soprano', 'Ukulele Soprano de madeira mahogany.', 250.00, 20, 'Kalani', 'Soprano', 2, 2);


SELECT setval('categoria_id_categoria_seq', (SELECT MAX(id_categoria) FROM categoria));
SELECT setval('usuario_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuario));
SELECT setval('empresa_id_empresa_seq', (SELECT MAX(id_empresa) FROM empresa));
SELECT setval('produto_id_produto_seq', (SELECT MAX(id_produto) FROM produto));