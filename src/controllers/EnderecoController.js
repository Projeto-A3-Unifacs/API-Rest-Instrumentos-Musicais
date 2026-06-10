const enderecoDAO = require('../dao/EnderecoDAO');
const vendedorDao = require('../dao/vendedorDao');

class EnderecoController {

  // GET todos os endereços – apenas vendedores
  async getAll(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const enderecos = await enderecoDAO.getAll();
      res.status(200).json(enderecos);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET endereço por ID – cliente só acessa se for o próprio, vendedor qualquer
  async getById(req, res) {
    try {
      const { id } = req.params;
      const endereco = await enderecoDAO.getById(id);

      if (!endereco) return res.status(404).json({ erro: 'Endereço não encontrado' });

      if (req.user.role === 'Cliente' && endereco.id_usuario !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(endereco);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET endereços de um usuário específico – cliente só vê o próprio
  async getByUsuario(req, res) {
    try {
      const { idUsuario } = req.params;

      if (req.user.role === 'Cliente' && Number(idUsuario) !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const enderecos = await enderecoDAO.getByUsuario(idUsuario);
      res.status(200).json(enderecos);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // POST criar endereço – apenas clientes podem criar para si
  async create(req, res) {
    try {
      if (req.user.role !== 'Cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem criar endereço' });
      }

      const id_usuario = req.user.id; // força criar para o usuário logado

      const usuario = await vendedorDao.getById(id_usuario);
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

      const endereco = await enderecoDAO.create(
        id_usuario,
        req.body.cep,
        req.body.rua,
        req.body.numero,
        req.body.complemento,
        req.body.bairro,
        req.body.cidade,
        req.body.estado
      );

      res.status(201).json(endereco);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // PUT atualizar endereço – apenas clientes podem atualizar seus próprios
  async update(req, res) {
    try {
      const { id } = req.params;
      const enderecoExistente = await enderecoDAO.getById(id);

      if (!enderecoExistente) return res.status(404).json({ erro: 'Endereço não encontrado' });

      if (req.user.role === 'Cliente' && enderecoExistente.id_usuario !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const endereco = await enderecoDAO.update(id, req.body);
      res.status(200).json(endereco);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // DELETE endereço – apenas vendedores podem deletar qualquer endereço
  async delete(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Apenas vendedores podem remover endereços' });
      }

      const { id } = req.params;
      const removido = await enderecoDAO.delete(id);
      res.status(200).json({ sucesso: removido });

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new EnderecoController();