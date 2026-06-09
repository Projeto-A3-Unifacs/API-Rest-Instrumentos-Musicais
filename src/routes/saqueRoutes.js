const express = require('express');
const router = express.Router();

const saqueController =
  require('../controllers/SaqueController');

router.get(
  '/',
  saqueController.getAll.bind(saqueController)
);

router.get(
  '/:id',
  saqueController.getById.bind(saqueController)
);

router.post(
  '/',
  saqueController.create.bind(saqueController)
);

router.patch(
  '/:id/status',
  saqueController.updateStatus.bind(saqueController)
);

module.exports = router;