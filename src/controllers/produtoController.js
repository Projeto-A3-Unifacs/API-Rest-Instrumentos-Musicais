const produtoDao = require('../dao/produtoDao');

class ProdutoController {
  async getAll(req, res) {
    try {
      res.status(200).json(await produtoDao.getAll());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getById(req, res) {
    try {
      const produto = await produtoDao.getById(parseInt(req.params.id));

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(200).json(produto);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async create(req, res) {
    try {
      const novoProduto = await produtoDao.create(req.body);
      res.status(201).json(novoProduto);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await produtoDao.update(parseInt(req.params.id), req.body);

      if (!updated) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(200).json(updated);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await produtoDao.delete(parseInt(req.params.id));

      if (!success) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(204).send();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = new ProdutoController();
