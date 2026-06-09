const pool = require('../config/Database');

class RelatorioDao {
  async produtosMaisVendidos() {
    const res = await pool.query(`
      SELECT 
        p.id_produto,
        p.nome AS produto,
        SUM(ip.quantidade) AS total_vendido,
        SUM(ip.quantidade * ip.preco_unitario) AS valor_total_vendido
      FROM item_pedido ip
      JOIN produto p ON p.id_produto = ip.id_produto
      JOIN pedido pe ON pe.id_pedido = ip.id_pedido
      WHERE pe.status <> 'CANCELADO'
      GROUP BY p.id_produto, p.nome
      ORDER BY total_vendido DESC;
    `);

    return res.rows;
  }

  async produtoPorCliente() {
    const res = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nome AS cliente,
        p.id_produto,
        p.nome AS produto,
        SUM(ip.quantidade) AS quantidade_comprada,
        SUM(ip.quantidade * ip.preco_unitario) AS valor_total
      FROM pedido pe
      JOIN usuario u ON u.id_usuario = pe.id_usuario
      JOIN item_pedido ip ON ip.id_pedido = pe.id_pedido
      JOIN produto p ON p.id_produto = ip.id_produto
      WHERE pe.status <> 'CANCELADO'
      GROUP BY u.id_usuario, u.nome, p.id_produto, p.nome
      ORDER BY u.nome, p.nome;
    `);

    return res.rows;
  }

  async consumoMedioCliente() {
    const res = await pool.query(`
      SELECT 
        u.id_usuario,
        u.nome AS cliente,
        COUNT(pe.id_pedido) AS total_pedidos,
        SUM(pe.valor_total) AS total_gasto,
        ROUND(AVG(pe.valor_total), 2) AS consumo_medio
      FROM usuario u
      JOIN pedido pe ON pe.id_usuario = u.id_usuario
      WHERE pe.status <> 'CANCELADO'
      GROUP BY u.id_usuario, u.nome
      ORDER BY consumo_medio DESC;
    `);

    return res.rows;
  }

  async produtosBaixoEstoque(limite = 5) {
    const res = await pool.query(`
      SELECT 
        id_produto,
        nome AS produto,
        preco,
        estoque,
        id_categoria,
        id_empresa
      FROM produto
      WHERE estoque <= $1
      ORDER BY estoque ASC;
    `, [limite]);

    return res.rows;
  }
}

module.exports = new RelatorioDao();
