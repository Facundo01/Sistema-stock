const express = require('express');
const router = express.Router();
const { obtenerLotes, crearLote } = require('../controllers/loteController');

router.get('/', obtenerLotes);
router.post('/', crearLote);

module.exports = router;