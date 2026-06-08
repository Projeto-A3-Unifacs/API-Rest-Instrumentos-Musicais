const produtoDao = require('../dao/produtoDao');

class ProdutoController {
    async getAll(req, res) {
        try {
            res.json(await produtoDao.getAll());
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getById(req, res) {
        try {
            const produto = await produtoDao.getById(parseInt(req.params.id));
            produto ? res.json(produto) : res.status(404).json({ error: 'Produto não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
            res.status(201).json(await produtoDao.create(req.body));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await produtoDao.update(parseInt(req.params.id), req.body);
            updated ? res.json(updated) : res.status(404).json({ error: 'Produto não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await produtoDao.delete(parseInt(req.params.id));
            success ? res.status(204).send() : res.status(404).json({ error: 'Produto não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new ProdutoController();