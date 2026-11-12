const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

// Rutas protegidas para la gestión de pacientes (Administrador y Nutricionista pueden verlos o gestionarlos)
router.post('/', verificarToken, permitirRoles('administrador'), pacienteController.registrarPaciente);
router.get('/', verificarToken, pacienteController.obtenerPacientes);
router.delete('/:id', verificarToken, permitirRoles('administrador'), pacienteController.eliminarPaciente);

module.exports = router;