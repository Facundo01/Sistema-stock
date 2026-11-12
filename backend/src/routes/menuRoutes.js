const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verificarToken, permitirRoles } = require('../middlewares/auth');

router.post('/', verificarToken, permitirRoles('nutricionista', 'administrador'), menuController.registrarMenu);
router.get('/', verificarToken, menuController.obtenerMenus);
router.delete('/:id', verificarToken, permitirRoles('nutricionista', 'administrador'), menuController.eliminarMenu);

module.exports = router;