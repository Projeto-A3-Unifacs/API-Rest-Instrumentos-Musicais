const pool = require('./database.js');

async function createTables() {
  try {
    await pool.query(`

      CREATE TABLE IF NOT EXISTS perfil (
        id_perfil SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL UNIQUE,
        descricao TEXT
      );

      CREATE TABLE IF NOT EXISTS usuario (
        id_usuario SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) UNIQUE,
        telefone VARCHAR(20),
        data_nascimento DATE,
        ativo BOOLEAN DEFAULT TRUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        id_perfil INTEGER NOT NULL REFERENCES perfil(id_perfil)
      );

      CREATE TABLE IF NOT EXISTS empresa (
        id_empresa SERIAL PRIMARY KEY,
        razao_social VARCHAR(150) NOT NULL,
        nome_fantasia VARCHAR(150) NOT NULL,
        cnpj VARCHAR(18) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        telefone VARCHAR(20),
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categoria (
        id_categoria SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        descricao TEXT
      );

      CREATE TABLE IF NOT EXISTS produto (
        id_produto SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        descricao TEXT,
        preco NUMERIC(10,2) NOT NULL,
        estoque INTEGER DEFAULT 0,
        marca VARCHAR(100),
        modelo VARCHAR(100),
        imagem_url TEXT,
        ativo BOOLEAN DEFAULT TRUE,
        id_categoria INTEGER NOT NULL REFERENCES categoria(id_categoria),
        id_empresa INTEGER NOT NULL REFERENCES empresa(id_empresa)
      );

      CREATE TABLE IF NOT EXISTS endereco (
        id_endereco SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
        cep VARCHAR(10),
        rua VARCHAR(150),
        numero VARCHAR(20),
        complemento VARCHAR(100),
        bairro VARCHAR(100),
        cidade VARCHAR(100),
        estado VARCHAR(2)
      );

      CREATE TABLE IF NOT EXISTS carrinho (
        id_carrinho SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS item_carrinho (
        id_item_carrinho SERIAL PRIMARY KEY,
        id_carrinho INTEGER NOT NULL REFERENCES carrinho(id_carrinho),
        id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
        quantidade INTEGER NOT NULL,
        preco_unitario NUMERIC(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pedido (
        id_pedido SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
        data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valor_total NUMERIC(10,2),
        status VARCHAR(30)
      );

      CREATE TABLE IF NOT EXISTS item_pedido (
        id_item_pedido SERIAL PRIMARY KEY,
        id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido),
        id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
        quantidade INTEGER NOT NULL,
        preco_unitario NUMERIC(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pagamento (
        id_pagamento SERIAL PRIMARY KEY,
        id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido),
        metodo VARCHAR(30),
        valor NUMERIC(10,2),
        status VARCHAR(30),
        data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS avaliacao (
        id_avaliacao SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
        id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
        nota INTEGER CHECK (nota BETWEEN 1 AND 5),
        comentario TEXT,
        data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS afiliado (
        id_afiliado SERIAL PRIMARY KEY,
        id_usuario INTEGER UNIQUE NOT NULL REFERENCES usuario(id_usuario),
        status VARCHAR(30) DEFAULT 'PENDENTE',
        data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_aprovacao TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS afiliacao_produto (
        id_afiliacao SERIAL PRIMARY KEY,
        id_afiliado INTEGER NOT NULL REFERENCES afiliado(id_afiliado),
        id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
        percentual_comissao NUMERIC(5,2),
        status VARCHAR(30) DEFAULT 'PENDENTE',
        data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_aprovacao TIMESTAMP,
        UNIQUE(id_afiliado, id_produto)
      );

      CREATE TABLE IF NOT EXISTS comissao (
        id_comissao SERIAL PRIMARY KEY,
        id_afiliacao INTEGER NOT NULL REFERENCES afiliacao_produto(id_afiliacao),
        id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido),
        valor_venda NUMERIC(10,2),
        percentual NUMERIC(5,2),
        valor_comissao NUMERIC(10,2),
        status VARCHAR(30),
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    `);

    console.log('Tabelas criadas/verificadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

module.exports = createTables;