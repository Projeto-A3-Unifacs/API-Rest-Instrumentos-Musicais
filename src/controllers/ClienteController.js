const clienteDao = require('../dao/clienteDao');

class ClienteController {
    async getAll(req, res) {
        try {
            res.status(200).json(await clienteDao.getAll());
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getById(req, res) {
        try {
            const cliente = await clienteDao.getById(parseInt(req.params.id));
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }
            res.status(200).json(cliente);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
            const novoCliente = await clienteDao.create(req.body);
            res.status(201).json(novoCliente);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await clienteDao.update(parseInt(req.params.id), req.body);
            if (!updated) {
                return res.status(404).json({ error: 'Cliente não encontrado para atualização' });
            }
            res.status(200).json(updated);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await clienteDao.delete(parseInt(req.params.id));
            if (!success) {
                return res.status(404).json({ error: 'Cliente não encontrado para deleção' });
            }
            res.status(204).send();
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new ClienteController();