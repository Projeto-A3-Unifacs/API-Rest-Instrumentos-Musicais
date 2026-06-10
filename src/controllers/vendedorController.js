const vendedorDao = require('../dao/vendedorDao');

class VendedorController {
    async getAll(req, res) {
        try {
            res.json(await vendedorDao.getAll());
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getById(req, res) {
        try {
            const vendedor = await vendedorDao.getById(parseInt(req.params.id));
            vendedor ? res.json(vendedor) : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
            res.status(201).json(await vendedorDao.create(req.body));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await vendedorDao.update(parseInt(req.params.id), req.body);
            updated ? res.json(updated) : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await vendedorDao.delete(parseInt(req.params.id));
            success ? res.status(204).send() : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new VendedorController();