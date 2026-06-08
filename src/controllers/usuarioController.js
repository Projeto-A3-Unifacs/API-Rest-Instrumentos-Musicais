const usuarioDao = require('../dao/usuarioDao');

class UsuarioController {
    async getAll(req, res) {
        try {
            res.json(await usuarioDao.getAll());
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getById(req, res) {
        try {
            const vendedor = await usuarioDao.getById(parseInt(req.params.id));
            vendedor ? res.json(vendedor) : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
            res.status(201).json(await usuarioDao.create(req.body));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await usuarioDao.update(parseInt(req.params.id), req.body);
            updated ? res.json(updated) : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await usuarioDao.delete(parseInt(req.params.id));
            success ? res.status(204).send() : res.status(404).json({ error: 'Vendedor não encontrado' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new UsuarioController();