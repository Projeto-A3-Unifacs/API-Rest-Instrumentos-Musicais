const express = require('express');
const router = express.Router();

const comissaoController =
  require('../controllers/ComissaoController');

router.get(
  '/',
  comissaoController.getAll.bind(comissaoController)
);

router.get(
  '/:id',
  comissaoController.getById.bind(comissaoController)
);

router.post(
  '/',
  comissaoController.create.bind(comissaoController)
);

router.patch(
  '/:id/status',
  comissaoController.updateStatus.bind(comissaoController)
);

module.exports = router;