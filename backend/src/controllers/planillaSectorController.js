const planillaSector = require('../models/planillaSector');
const planillaRacion = require('../models/planillaRacion');
const sector = require('../models/sector');

// Obtener todas las solicitudes de sectores por planilla
const obtenerPlanillaSectores = async (req, res) => {
  try {
    const lista = await planillaSector.findAll({
      include: [
        { model: planillaRacion, attributes: ['fecha_creacion', 'tipo_comida'] },
        { model: sector, attributes: ['nombre_sector'] }
      ]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los sectores de la planilla', error: error.message });
  }
};

// Asignar raciones solicitadas a un sector en una planilla
const crearPlanillaSector = async (req, res) => {
  try {
    const { id_planilla, id_sector, raciones_solicitadas } = req.body;

    const planillaExiste = await planillaRacion.findByPk(id_planilla);
    if (!planillaExiste) return res.status(404).json({ mensaje: 'La planilla no existe' });

    const sectorExiste = await sector.findByPk(id_sector);
    if (!sectorExiste) return res.status(404).json({ mensaje: 'El sector no existe' });

    const nuevoDetalle = await planillaSector.create({
      id_planilla,
      id_sector,
      raciones_solicitadas
    });

    res.status(201).json(nuevoDetalle);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al asociar el sector a la planilla', error: error.message });
  }
};

module.exports = {
  obtenerPlanillaSectores,
  crearPlanillaSector
};