const express = require('express');
const router = express.Router();

const enderecoController =
  require('../controllers/EnderecoController');

router.get(
  '/',
  enderecoController.getAll.bind(enderecoController)
);

router.get(
  '/usuario/:idUsuario',
  enderecoController.getByUsuario.bind(enderecoController)
);

router.get(
  '/:id',
  enderecoController.getById.bind(enderecoController)
);

router.post(
  '/',
  enderecoController.create.bind(enderecoController)
);

router.put(
  '/:id',
  enderecoController.update.bind(enderecoController)
);

router.delete(
  '/:id',
  enderecoController.delete.bind(enderecoController)
);

module.exports = router;