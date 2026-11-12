const express = require('express');
const router = express.Router();
const { obtenerSectores, crearSector } = require('../controllers/sectorController');

router.get('/', obtenerSectores);
router.post('/', crearSector);

module.exports = router;