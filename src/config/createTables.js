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

async function seedInitialData() {
  try {
    // ---------- Perfis ----------
    const perfis = [
      { id_perfil: 1, nome: Vendedor }, // Empresas
      { id_perfil: 2, nome: 'Cliente' }   // Usuários
    ];

    for (const p of perfis) {
      await pool.query(
        'INSERT INTO perfil (id_perfil, nome) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [p.id_perfil, p.nome]
      );
    }

    // ---------- Empresas (com endereço fictício) ----------
    const empresas = [
      {
        razao_social: 'Musical Store Ltda',
        nome_fantasia: 'Musical Store',
        cnpj: '12.345.678/0001-90',
        email: 'contato@musicalstore.com',
        telefone: '(71) 1234-5678',
        cep: '40000-000',
        cidade: 'Salvador',
        estado: 'BA'
      },
      {
        razao_social: 'Rock & Roll Comércio Ltda',
        nome_fantasia: 'Rock & Roll',
        cnpj: '98.765.432/0001-21',
        email: 'vendas@rocknroll.com',
        telefone: '(71) 9876-5432',
        cep: '41000-000',
        cidade: 'Salvador',
        estado: 'BA'
      }
    ];

    for (const e of empresas) {
      await pool.query(
        `INSERT INTO empresa (razao_social, nome_fantasia, cnpj, email, telefone, cep, cidade, estado)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
        [e.razao_social, e.nome_fantasia, e.cnpj, e.email, e.telefone, e.cep, e.cidade, e.estado]
      );
    }

    // ---------- Categorias ----------
    const categorias = ['Cordas', 'Teclados', 'Percussão', 'Microfones', 'Amplificadores', 'Acessórios'];

    for (let i = 0; i < categorias.length; i++) {
      await pool.query(
        'INSERT INTO categoria (id_categoria, nome) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [i + 1, categorias[i]]
      );
    }

    // ---------- Produtos ----------
    const produtos = [
      { nome: 'Guitarra Fender Stratocaster', descricao: 'Guitarra elétrica clássica da Fender.', preco: 4500.00, estoque: 5, marca: 'Fender', modelo: 'Stratocaster', id_categoria: 1, id_empresa: 1 },
      { nome: 'Baixo Yamaha RBX', descricao: 'Baixo elétrico de 4 cordas.', preco: 1800.00, estoque: 10, marca: 'Yamaha', modelo: 'RBX', id_categoria: 1, id_empresa: 1 },
      { nome: 'Teclado Roland FP-30', descricao: 'Teclado digital profissional.', preco: 3000.00, estoque: 7, marca: 'Roland', modelo: 'FP-30', id_categoria: 2, id_empresa: 2 },
      { nome: 'Bateria Pearl Export', descricao: 'Bateria completa para iniciantes e profissionais.', preco: 5200.00, estoque: 3, marca: 'Pearl', modelo: 'Export', id_categoria: 3, id_empresa: 2 },
      { nome: 'Violão Takamine GD30', descricao: 'Violão acústico de cordas de aço.', preco: 1200.00, estoque: 8, marca: 'Takamine', modelo: 'GD30', id_categoria: 1, id_empresa: 1 },
      { nome: 'Microfone Shure SM58', descricao: 'Microfone profissional para voz.', preco: 950.00, estoque: 12, marca: 'Shure', modelo: 'SM58', id_categoria: 4, id_empresa: 2 },
      { nome: 'Amplificador Marshall MG15', descricao: 'Amplificador de guitarra 15W.', preco: 750.00, estoque: 6, marca: 'Marshall', modelo: 'MG15', id_categoria: 5, id_empresa: 1 },
      { nome: 'Pedal Boss DS-1', descricao: 'Pedal de distorção para guitarra.', preco: 400.00, estoque: 15, marca: 'Boss', modelo: 'DS-1', id_categoria: 6, id_empresa: 2 },
      { nome: 'Cajón Schlagwerk', descricao: 'Instrumento de percussão compacto.', preco: 600.00, estoque: 5, marca: 'Schlagwerk', modelo: 'Cajón', id_categoria: 3, id_empresa: 2 },
      { nome: 'Saxofone Yamaha YAS-280', descricao: 'Saxofone alto para iniciantes e intermediários.', preco: 2800.00, estoque: 4, marca: 'Yamaha', modelo: 'YAS-280', id_categoria: 2, id_empresa: 1 }
    ];

    for (const p of produtos) {
      await pool.query(
        `INSERT INTO produto (nome, descricao, preco, estoque, marca, modelo, id_categoria, id_empresa)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
        [p.nome, p.descricao, p.preco, p.estoque, p.marca, p.modelo, p.id_categoria, p.id_empresa]
      );
    }

    // ---------- Clientes ----------
    const clientes = [
      { nome: 'Alice Souza', email: 'alice@email.com', senha: '123456', cpf: '123.456.789-01', telefone: '(71) 99999-0001', data_nascimento: '1990-05-15', id_perfil: 2 },
      { nome: 'Bruno Lima', email: 'bruno@email.com', senha: '123456', cpf: '123.456.789-02', telefone: '(71) 99999-0002', data_nascimento: '1988-09-22', id_perfil: 2 },
      { nome: 'Carla Mendes', email: 'carla@email.com', senha: '123456', cpf: '123.456.789-03', telefone: '(71) 99999-0003', data_nascimento: '1995-01-10', id_perfil: 2 },
      { nome: 'Diego Oliveira', email: 'diego@email.com', senha: '123456', cpf: '123.456.789-04', telefone: '(71) 99999-0004', data_nascimento: '1992-07-30', id_perfil: 2 },
      { nome: 'Elisa Ferreira', email: 'elisa@email.com', senha: '123456', cpf: '123.456.789-05', telefone: '(71) 99999-0005', data_nascimento: '1994-12-05', id_perfil: 2 }
    ];

    for (const c of clientes) {
      await pool.query(
        'INSERT INTO usuario (nome, email, senha, cpf, telefone, data_nascimento, id_perfil) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING',
        [c.nome, c.email, c.senha, c.cpf, c.telefone, c.data_nascimento, c.id_perfil]
      );
    }

    console.log('Seed completo inserido com sucesso! (Clientes + 2 Empresas/Vendedores + 10 Produtos)');
  } catch (err) {
    console.error('Erro ao inserir dados iniciais:', err);
  }
}

// ---------------- Executar ----------------
async function init() {
  await createTables();
  await seedInitialData();
}

init();

module.exports = createTables;
