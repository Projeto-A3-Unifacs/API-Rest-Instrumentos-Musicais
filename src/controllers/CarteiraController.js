const carteiraDAO = require('../dao/CarteiraDAO');
const clienteDao = require('../dao/clienteDao');
const afiliadoDAO = require('../dao/AfiliadoDAO')

class CarteiraController {

 
  async getAll(req, res) {
    try {
      if (req.user.role !== 'Administrador') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const carteiras = await carteiraDAO.getAll();
      res.status(200).json(carteiras);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

 
  async getById(req, res) {
    try {
      const { id } = req.params;
      const carteira = await carteiraDAO.getById(id);

      if (!carteira) {
        return res.status(404).json({ erro: 'Carteira não encontrada' });
      }

      if (req.user.role === 'Cliente' && carteira.id_usuario !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      res.status(200).json(carteira);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
  async create(req, res) {
    try {
      const { id_usuario } = req.body;

      const usuario = await clienteDao.getByUsuario(id_usuario);

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      
      if (usuario.id_perfil === 2) {
        const afiliado = await afiliadoDAO.findByUsuario(id_usuario);

        if (!afiliado) {
          return res.status(403).json({ erro: 'Acesso negado: Clientes comuns não podem ter carteira. Torne-se um afiliado primeiro.' });
        }

        if (afiliado.status !== 'APROVADO') {
          return res.status(403).json({ erro: 'Acesso negado: Sua solicitação de afiliado ainda está pendente ou foi rejeitada.' });
        }
      }
      const carteiraExistente = await carteiraDAO.getByUsuario(id_usuario);

      if (carteiraExistente) {
        return res.status(400).json({ erro: 'Este usuário já possui uma carteira ativa.' });
      }
      const carteira = await carteiraDAO.create(id_usuario);

      res.status(201).json(carteira);

    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  async delete(req, res) {
    try {
      if (req.user.role !== 'Administrador') {
        return res.status(403).json({ erro: 'Apenas Administradores podem remover carteiras' });
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