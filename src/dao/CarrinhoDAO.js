const pool = require('../config/Database');

class CarrinhoDAO {
  async getOrCreateCart(idUsuario) {
    let res = await pool.query(`SELECT * FROM carrinho WHERE id_usuario = $1`, [idUsuario]);
    
    if (res.rows.length === 0) {
      res = await pool.query(`
        INSERT INTO carrinho (id_usuario, data_criacao)
        VALUES ($1, CURRENT_TIMESTAMP)
        RETURNING *
      `, [idUsuario]);
    }
    return res.rows[0];
  }

  async getCartDetails(idCarrinho) {
    const res = await pool.query(`
      SELECT 
        ic.id_item_carrinho,
        ic.id_produto,
        p.nome AS produto_nome,
        ic.quantidade,
        ic.preco_unitario,
        (ic.quantidade * ic.preco_unitario) AS subtotal
      FROM item_carrinho ic
      JOIN produto p ON p.id_produto = ic.id_produto
      WHERE ic.id_carrinho = $1
    `, [idCarrinho]);

    return res.rows;
  }

  async addItem(idCarrinho, idProduto, quantidade) {
    const produtoRes = await pool.query(`SELECT preco FROM produto WHERE id_produto = $1`, [idProduto]);
    if (produtoRes.rows.length === 0) throw new Error('Produto não encontrado');
    
    const precoUnitario = produtoRes.rows[0].preco;

    const itemExistente = await pool.query(`
      SELECT id_item_carrinho, quantidade 
      FROM item_carrinho 
      WHERE id_carrinho = $1 AND id_produto = $2
    `, [idCarrinho, idProduto]);

    if (itemExistente.rows.length > 0) {
      const novaQuantidade = itemExistente.rows[0].quantidade + quantidade;
      const res = await pool.query(`
        UPDATE item_carrinho 
        SET quantidade = $1 
        WHERE id_item_carrinho = $2 
        RETURNING *
      `, [novaQuantidade, itemExistente.rows[0].id_item_carrinho]);
      return res.rows[0];
    } else {
      const res = await pool.query(`
        INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade, preco_unitario)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [idCarrinho, idProduto, quantidade, precoUnitario]);
      return res.rows[0];
    }
  }

  async removeItem(idItemCarrinho) {
    const res = await pool.query(`
      DELETE FROM item_carrinho WHERE id_item_carrinho = $1 RETURNING *
    `, [idItemCarrinho]);
    return res.rowCount > 0;
  }

  async clearCart(idCarrinho) {
    await pool.query(`DELETE FROM item_carrinho WHERE id_carrinho = $1`, [idCarrinho]);
    return true;
  }
}

module.exports = new CarrinhoDAO();