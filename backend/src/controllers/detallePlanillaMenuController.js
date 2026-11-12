const detallePlanillaMenu = require('../models/detallePlanillaMenu');
const planillaRacion = require('../models/planillaRacion');
const menu = require('../models/menu');

// Obtener todos los detalles de menús por planilla
const obtenerDetalles = async (req, res) => {
  try {
    const lista = await detallePlanillaMenu.findAll({
      include: [
        { model: planillaRacion, attributes: ['fecha_creacion', 'tipo_comida'] },
        { model: menu, attributes: ['nombre_menu', 'descripcion_dieta'] }
      ]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los detalles de menú de la planilla', error: error.message });
  }
};

// Agregar un menú y sus raciones a una planilla
const crearDetalle = async (req, res) => {
  try {
    const { id_planilla, id_menu, cantidad_raciones } = req.body;

    const planillaExiste = await planillaRacion.findByPk(id_planilla);
    if (!planillaExiste) return res.status(404).json({ mensaje: 'La planilla no existe' });

    const menuExiste = await menu.findByPk(id_menu);
    if (!menuExiste) return res.status(404).json({ mensaje: 'El menú no existe' });

    const nuevoDetalle = await detallePlanillaMenu.create({
      id_planilla,
      id_menu,
      cantidad_raciones
    });

    res.status(201).json(nuevoDetalle);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al asociar el menú a la planilla', error: error.message });
  }
};

module.exports = {
  obtenerDetalles,
  crearDetalle
};