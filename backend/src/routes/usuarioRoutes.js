const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

router.post('/registro', verificarToken, usuarioController.registrarusuario);
router.post('/login', usuarioController.loginusuario);
router.get('/', verificarToken, usuarioController.obtenerusuarios);
router.delete('/:id', verificarToken, usuarioController.eliminarusuario);

// Ruta para restablecer contraseña (Solo Administrador)
router.put('/:id/reset-password', verificarToken, permitirRoles('administrador'), usuarioController.resetearPassword);

module.exports = router;