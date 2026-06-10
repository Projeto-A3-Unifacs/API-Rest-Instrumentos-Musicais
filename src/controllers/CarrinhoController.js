const carrinhoDAO = require('../dao/CarrinhoDAO');

class CarrinhoController {
  async obterMeuCarrinho(req, res) {
    try {
      const id_usuario = req.user.id;
      const carrinho = await carrinhoDAO.getOrCreateCart(id_usuario);
      const itens = await carrinhoDAO.getCartDetails(carrinho.id_carrinho);
      
      const valor_total = itens.reduce((acc, item) => acc + Number(item.subtotal), 0);

      res.status(200).json({
        id_carrinho: carrinho.id_carrinho,
        id_usuario: carrinho.id_usuario,
        data_criacao: carrinho.data_criacao,
        valor_total_carrinho: valor_total,
        itens: itens
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async adicionarItem(req, res) {
    try {
      const id_usuario = req.user.id;
      const { id_produto, quantidade } = req.body;

      if (!id_produto || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Informe um id_produto válido e uma quantidade maior que zero.' });
      }

      const carrinho = await carrinhoDAO.getOrCreateCart(id_usuario);
      const itemAdicionado = await carrinhoDAO.addItem(carrinho.id_carrinho, id_produto, quantidade);
      
      res.status(201).json(itemAdicionado);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async removerItem(req, res) {
    try {
      const { id_item } = req.params;
      
      if (!id_item || isNaN(id_item)) {
        return res.status(400).json({ error: 'ID do item inválido.' });
      }

      const removido = await carrinhoDAO.removeItem(parseInt(id_item));
      if (!removido) {
        return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
      }

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async limparCarrinho(req, res) {
    try {
      const id_usuario = req.user.id;
      const carrinho = await carrinhoDAO.getOrCreateCart(id_usuario);
      
      await carrinhoDAO.clearCart(carrinho.id_carrinho);
      res.status(200).json({ message: 'Carrinho esvaziado com sucesso.' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new CarrinhoController();