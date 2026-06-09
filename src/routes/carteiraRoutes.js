const express = require('express');
const router = express.Router();

const carteiraController =
  require('../controllers/CarteiraController');

router.get(
  '/',
  carteiraController.getAll.bind(carteiraController)
);

router.get(
  '/:id',
  carteiraController.getById.bind(carteiraController)
);

router.post(
  '/',
  carteiraController.create.bind(carteiraController)
);

router.delete(
  '/:id',
  carteiraController.delete.bind(carteiraController)
);

module.exports = router;