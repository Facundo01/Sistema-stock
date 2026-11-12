const express = require('express');
const router = express.Router();
const { obtenerPlanillasRaciones, crearPlanillaRacion } = require('../controllers/planillaRacionController');

router.get('/', obtenerPlanillasRaciones);
router.post('/', crearPlanillaRacion);

module.exports = router;