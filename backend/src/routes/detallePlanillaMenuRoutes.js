const express = require('express');
const router = express.Router();
const { obtenerDetalles, crearDetalle } = require('../controllers/detallePlanillaMenuController');

router.get('/', obtenerDetalles);
router.post('/', crearDetalle);

module.exports = router;