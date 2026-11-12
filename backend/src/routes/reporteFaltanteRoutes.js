const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteFaltanteController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

router.post('/', verificarToken, permitirRoles('cocinero', 'administrador'), reporteController.crearReporte);
router.get('/', verificarToken, reporteController.obtenerReportes);
router.put('/:id/resolver', verificarToken, permitirRoles('administrador'), reporteController.resolverReporte);

module.exports = router;