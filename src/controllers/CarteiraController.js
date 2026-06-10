const carteiraDAO = require('../dao/CarteiraDAO');
const vendedorDao = require('../dao/vendedorDao');

class CarteiraController {

  // GET todas as carteiras – apenas vendedores
  async getAll(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const carteiras = await carteiraDAO.getAll();
      res.status(200).json(carteiras);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // GET carteira por ID – clientes só podem ver a própria
  async getById(req, res) {
    try {
      const { id } = req.params;
      const carteira = await carteiraDAO.getById(id);

      if (!carteira) {
        return res.status(404).json({ erro: 'Carteira não encontrada' });
      }

      // Clientes só podem acessar sua própria carteira
      if (req.user.role === 'Cliente' && carteira.id_usuario !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(carteira);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // POST criar carteira – apenas clientes podem criar a própria
  async create(req, res) {
    try {
      if (req.user.role !== 'Cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem criar carteira' });
      }

      // Sempre criar carteira para o usuário logado, ignorando id_usuario do body
      const id_usuario = req.user.id;

      const usuario = await vendedorDao.getById(id_usuario);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const carteiraExistente = await carteiraDAO.getByUsuario(id_usuario);
      if (carteiraExistente) {
        return res.status(400).json({ erro: 'Usuário já possui carteira' });
      }

      const carteira = await carteiraDAO.create(id_usuario);
      res.status(201).json(carteira);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  // DELETE carteira – apenas vendedores podem remover
  async delete(req, res) {
    try {
      if (req.user.role !== Vendedor) {
        return res.status(403).json({ erro: 'Apenas vendedores podem remover carteiras' });
      }

      const { id } = req.params;
      const removido = await carteiraDAO.delete(id);

      res.status(200).json({ sucesso: removido });

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = new CarteiraController();