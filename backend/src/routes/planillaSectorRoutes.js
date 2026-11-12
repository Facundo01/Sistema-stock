const express = require('express');
const router = express.Router();
const { obtenerPlanillaSectores, crearPlanillaSector } = require('../controllers/planillaSectorController');

router.get('/', obtenerPlanillaSectores);
router.post('/', crearPlanillaSector);

module.exports = router;