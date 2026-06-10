const vendedorDao = require('../dao/vendedorDao');

class VendedorController {
    async getAll(req, res) {
        try {
            res.status(200).json(await vendedorDao.getAll());
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

            const vendedor = await vendedorDao.getById(parseInt(id));
            if (!vendedor) {
                return res.status(404).json({ error: 'Vendedor não encontrado.' });
            }
            
            res.status(200).json(vendedor);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {
            
            const { nome, email, senha, cpf, telefone, data_nascimento, role } = req.body;

            if (!nome || !email || !senha || !cpf) {
                return res.status(400).json({ 
                    error: 'Campos obrigatórios ausentes. Certifique-se de enviar: nome, email, senha e cpf.' 
                });
            }

            if (!email.includes('@')) {
                return res.status(400).json({ error: 'O formato do email fornecido é inválido.' });
            }

            const novoVendedor = await vendedorDao.create({
                nome, email, senha, cpf, telefone, data_nascimento, role
            });

            res.status(201).json(novoVendedor);
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

            const { nome, email, cpf, telefone, data_nascimento, role } = req.body;

            if (!nome && !email && !cpf && !telefone && !data_nascimento && !role) {
                return res.status(400).json({ 
                    error: 'Nenhum dado válido foi fornecido para atualização.' 
                });
            }

            const updated = await vendedorDao.update(parseInt(id), {
                nome, email, cpf, telefone, data_nascimento, role
            });

            if (!updated) {
                return res.status(404).json({ error: 'Vendedor não encontrado para atualização.' });
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

            const success = await vendedorDao.delete(parseInt(id));
            if (!success) {
                return res.status(404).json({ error: 'Vendedor não encontrado.' });
            }
            
            res.status(204).send();
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = new VendedorController();