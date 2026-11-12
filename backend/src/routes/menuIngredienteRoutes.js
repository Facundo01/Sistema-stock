const express = require('express');
const router = express.Router();
const { obtenerMenuIngredientes, crearMenuIngrediente } = require('../controllers/menuIngredienteController');

router.get('/', obtenerMenuIngredientes);
router.post('/', crearMenuIngrediente);

module.exports = router;