const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

router.post('/registro', verificarToken, usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/', verificarToken, usuarioController.obtenerUsuarios);
router.delete('/:id', verificarToken, usuarioController.eliminarUsuario);

// Ruta para restablecer contraseña (Solo Administrador)
router.put('/:id/reset-password', verificarToken, permitirRoles('administrador'), usuarioController.resetearPassword);

module.exports = router;