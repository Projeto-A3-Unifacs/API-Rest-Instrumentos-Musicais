const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

router.get('/', clienteController.getAll.bind(clienteController));
router.get('/:id', clienteController.getById.bind(clienteController));
router.post('/', clienteController.create.bind(clienteController));
router.put('/:id', clienteController.update.bind(clienteController));
router.delete('/:id', clienteController.delete.bind(clienteController));

module.exports = router;