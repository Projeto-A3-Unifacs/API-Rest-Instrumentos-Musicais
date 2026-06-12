# 🎸 API REST - E-commerce de Instrumentos Musicais

## 📋 Sobre o Projeto
Uma API RESTful robusta e completa para um sistema de e-commerce focado na venda de instrumentos musicais. O sistema possui arquitetura distribuída, contando com uma API principal e um microsserviço dedicado à geração de relatórios. O ecossistema abrange desde o catálogo de produtos e jornada de compra do cliente até um sistema avançado de afiliação, split de pagamentos, carteiras virtuais e gestão de perfis (Administrador, Vendedor e Cliente).

## 🚀 Tecnologias Utilizadas
- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL (com pacote `pg`)
- **Autenticação e Segurança:** JWT (JSON Web Tokens) e bcryptjs
- **Documentação da API:** Swagger (swagger-ui-express, swagger-jsdoc)
- **Infraestrutura e Orquestração:** Docker, Docker Compose

---

## 📁 Estrutura do Projeto
A estrutura de arquivos e pastas foi organizada seguindo boas práticas de separação de responsabilidades (Camadas):

```text
API-REST-INSTRUMENTOS-MUSICAIS/
├── docker/
│   └── postgres/
│       └── init.sql         # Script de inicialização (tabelas e seeds do banco de dados)
├── relatório/
│   └── Relatório Grupo.pdf  # Documentação do projeto acadêmico
├── src/
│   ├── config/              # Configurações centrais (Banco de dados, JWT, Swagger)
│   ├── controllers/         # Regras de negócios, validação e orquestração de requisições
│   ├── dao/                 # Data Access Objects (Queries SQL e comunicação com PostgreSQL)
│   ├── middleware/          # Interceptadores (Autenticação e Autorização por perfis)
│   ├── routes/              # Definição dos endpoints da API
│   ├── reports-server.js    # Ponto de entrada do Microsserviço de Relatórios
│   └── server.js            # Ponto de entrada da API principal
├── .dockerignore            # Regras de exclusão para o build da imagem Docker
├── .env                     # Variáveis de ambiente (credenciais, portas, secrets)
├── .env.example             # Template de variáveis de ambiente
├── .gitignore               # Regras de exclusão de versionamento Git
├── docker-compose.dev.yml   # Orquestração de containers para ambiente de desenvolvimento (Watch mode)
├── docker-compose.yml       # Orquestração de containers para ambiente de produção
├── Dockerfile               # Definição da imagem da aplicação Node.js
├── package-lock.json        # Árvore exata de dependências do NPM
├── package.json             # Dependências, metadados e scripts de execução
└── README.md                # Documentação principal

1. Autenticação e Perfis (/api/auth)
   - Login via JWT: Autenticação segura retornando o token de acesso e a função do usuário.
   - Recuperação de Senha: Fluxo simulado de "esqueci minha senha" com geração de código temporário e rotas para redefinição segura.
   - RBAC (Role-Based Access Control): Controle rigoroso de rotas baseado em três perfis: Administrador, Vendedor e Cliente.

2. Catálogo e Lojas
   - Produtos (/produtos): CRUD completo para gerenciar instrumentos musicais. Inclui controle de estoque em tempo real (evitando vendas sem estoque), preços, marcas e modelos. Impede a exclusão de produtos atrelados a históricos de pedidos.
   - Empresas (/empresas): Gestão de lojas/fornecedores parceiros. Cada vendedor gerencia sua própria empresa atrelada aos seus produtos.
   - Categorias: Estrutura gerida pelo banco de dados (Cordas, Teclas, Percussão, etc.).

3. Jornada de Compra
   - Carrinho de Compras (/carrinhos): Clientes podem adicionar itens, alterar quantidades, remover e limpar o carrinho antes de fechar o pedido.
   - Endereços (/endereco): Cadastro e gestão de múltiplos endereços de entrega dos usuários.
   - Cálculo de Frete (/fretes): Simulação e cálculo de frete dinâmico com base na localidade (mesma cidade, mesmo estado ou nacional) e geração de prazos estimados de entrega para cada item.
   - Pedidos (/pedidos): Fluxo híbrido que permite compra direta de um produto ou fechamento via carrinho. Atualiza automaticamente o estoque, vincula o endereço, frete e gera o registro oficial da transação. Possui sistema de cancelamento que estorna o estoque automaticamente.

4. Pagamentos (/pagamentos)
   - Processamento Diversificado: Suporte para pagamentos via Cartão de Crédito (aprovado instantaneamente), PIX e Boleto (com geração de linha digitável/chave copia e cola simulada).
   - Webhooks Simulados: Rota de confirmação de pagamento que transita o pedido para "PREPARANDO_ENVIO" após confirmação financeira.

5. Programa de Afiliados (Marketing)
   - Afiliados (/afiliados): Clientes da plataforma podem submeter uma solicitação para se tornarem parceiros divulgadores.
   - Afiliação de Produtos (/afiliacoes-produto): Afiliados solicitam vínculo para vender produtos específicos. Vendedores/Admins aprovam estipulando um percentual de comissão.
   - Comissões Automatizadas (/comissao): Quando um pedido é realizado utilizando o identificador de um afiliado aprovado, a API processa o "Split de Pagamento", depositando a comissão devida diretamente na carteira do afiliado e o restante na carteira do vendedor.

6. Financeiro (Carteiras e Saques)
   - Carteira Virtual (/carteira): Contas digitais exclusivas para Vendedores e Afiliados armazenarem os saldos gerados pelas suas vendas ou comissões.
   - Saques (/saque): Solicitação de retirada financeira. A API desconta o saldo provisoriamente da carteira e aguarda a aprovação administrativa para efetivar a transação.

7. Microsserviço de Relatórios (/relatorios - Porta 3001)
   - Produtos Mais Vendidos: Ranking por quantidade e faturamento.
   - Produto por Cliente: Histórico detalhado de quais clientes compraram quais itens.
   - Consumo Médio: Ticket médio e volume total de compras de cada cliente.
   - Alerta de Estoque: Monitoramento inteligente de inventário alertando itens que caíram abaixo do volume crítico de segurança.
