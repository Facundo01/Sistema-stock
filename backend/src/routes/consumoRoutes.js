const express = require('express');
const router = express.Router();
const consumoController = require('../controllers/consumoController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

// Registrar consumo/merma (Accesible por cocinero y administrador)
router.post('/', verificarToken, permitirRoles('cocinero', 'administrador'), consumoController.registrarConsumo);

// Obtener listados de consumos
router.get('/', verificarToken, consumoController.obtenerConsumos);

module.exports = router;