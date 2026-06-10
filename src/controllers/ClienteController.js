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
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'O ID fornecido é inválido.' });
            }

            const cliente = await clienteDao.getById(parseInt(id));
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            res.status(200).json(cliente);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
          
            const { nome, email, senha, cpf, telefone, data_nascimento } = req.body;

            
            if (!nome || !email || !senha || !cpf) {
                return res.status(400).json({ 
                    error: 'Campos obrigatórios ausentes. Certifique-se de enviar: nome, email, senha e cpf.' 
                });
            }

            
            const novoCliente = await clienteDao.create({
                nome, email, senha, cpf, telefone, data_nascimento
            });

            res.status(201).json(novoCliente);
        } catch (e) {
            
            if (e.code === '23505') {
                return res.status(409).json({ error: 'O email ou CPF informado já está em uso no sistema.' });
            }
            res.status(500).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'O ID fornecido é inválido.' });
            }

            const { nome, email, cpf, telefone, data_nascimento } = req.body;

            if (!nome && !email && !cpf && !telefone && !data_nascimento) {
                return res.status(400).json({ 
                    error: 'Nenhum dado válido foi fornecido para atualização.' 
                });
            }

            const updated = await clienteDao.update(parseInt(id), {
                nome, email, cpf, telefone, data_nascimento
            });

            if (!updated) {
                return res.status(404).json({ error: 'Cliente não encontrado para atualização.' });
            }

            res.status(200).json(updated);
        } catch (e) {
            if (e.code === '23505') {
                return res.status(409).json({ error: 'O email ou CPF informado já está em uso no sistema.' });
            }
            res.status(500).json({ error: e.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'O ID fornecido é inválido.' });
            }

            const success = await clienteDao.delete(parseInt(id));
            if (!success) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            res.status(204).send();
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new ClienteController();