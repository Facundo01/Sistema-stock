const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

// Consultar productos (Todos los roles autenticados)
router.get('/', verificarToken, permitirRoles('administrador', 'nutricionista', 'cocinero'), productoController.obtenerProductos);

// Crear productos (Solo Administrador)
router.post('/', verificarToken, permitirRoles('administrador'), productoController.crearProducto);

module.exports = router;