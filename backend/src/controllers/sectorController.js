const sector = require('../models/sector');

// Obtener todos los sectores
const obtenerSectores = async (req, res) => {
  try {
    const listaSectores = await sector.findAll();
    res.json(listaSectores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los sectores', error: error.message });
  }
};

// Crear un nuevo sector
const crearSector = async (req, res) => {
  try {
    const { nombre_sector } = req.body;
    const nuevoSector = await sector.create({ nombre_sector });
    res.status(201).json(nuevoSector);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el sector', error: error.message });
  }
};

module.exports = {
  obtenerSectores,
  crearSector
};