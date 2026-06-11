const produtoDao = require('../dao/produtoDao');

class ProdutoController {
async getAll(req, res) {
    try {
  
      const { id_empresa } = req.query;

      
      const produtos = await produtoDao.getAll(id_empresa ? parseInt(id_empresa) : null);
      
      res.status(200).json(produtos);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID fornecido é inválido.' });
      }

      const produto = await produtoDao.getById(parseInt(id));

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      res.status(200).json(produto);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async create(req, res) {
    try {
     
      const { nome, descricao, preco, estoque, marca, modelo, id_categoria, id_empresa } = req.body;

      if (!nome || preco === undefined || estoque === undefined || !id_categoria || !id_empresa) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes. Certifique-se de enviar: nome, preco, estoque, id_categoria e id_empresa.' 
        });
      }

      if (preco < 0 || estoque < 0) {
        return res.status(400).json({ error: 'O preço e o estoque não podem ter valores negativos.' });
      }

      const novoProduto = await produtoDao.create({
        nome, descricao, preco, estoque, marca, modelo, id_categoria, id_empresa
      });

      res.status(201).json(novoProduto);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID fornecido é inválido.' });
      }

     
      const { nome, descricao, preco, estoque, marca, modelo, id_categoria, id_empresa } = req.body;

      if (nome === undefined && descricao === undefined && preco === undefined && 
          estoque === undefined && marca === undefined && modelo === undefined && 
          id_categoria === undefined && id_empresa === undefined) {
        return res.status(400).json({ error: 'Nenhum dado válido fornecido para atualização.' });
      }

      if (preco !== undefined && preco < 0) {
        return res.status(400).json({ error: 'O preço não pode ser negativo.' });
      }
      if (estoque !== undefined && estoque < 0) {
        return res.status(400).json({ error: 'O estoque não pode ser negativo.' });
      }

      
      const dadosAtualizacao = {};
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (preco !== undefined) dadosAtualizacao.preco = preco;
      if (estoque !== undefined) dadosAtualizacao.estoque = estoque;
      if (marca !== undefined) dadosAtualizacao.marca = marca;
      if (modelo !== undefined) dadosAtualizacao.modelo = modelo;
      if (id_categoria !== undefined) dadosAtualizacao.id_categoria = id_categoria;
      if (id_empresa !== undefined) dadosAtualizacao.id_empresa = id_empresa;

      const updated = await produtoDao.update(parseInt(id), dadosAtualizacao);

      if (!updated) {
        return res.status(404).json({ error: 'Produto não encontrado para atualização.' });
      }

      res.status(200).json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID fornecido é inválido.' });
      }

      const success = await produtoDao.delete(parseInt(id));

      if (!success) {
        return res.status(404).json({ error: 'Produto não encontrado para remoção.' });
      }

      res.status(204).send();
    } catch (e) {
      if (e.code === '23503') {
        return res.status(409).json({ 
          error: 'Não é possível excluir este produto pois ele já está vinculado a um pedido ou carrinho.' 
        });
      }
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new ProdutoController();