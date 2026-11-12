const planillaRacion = require('../models/planillaRacion');
const Usuario = require('../models/usuario'); // <--- Corrección aquí

// Obtener todas las planillas de raciones
const obtenerPlanillasRaciones = async (req, res) => {
  try {
    const lista = await planillaRacion.findAll({
      include: {
        model: Usuario,
        attributes: ['name', 'surname', 'rol']
      }
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las planillas de raciones', error: error.message });
  }
};

// Crear una nueva planilla de raciones
const crearPlanillaRacion = async (req, res) => {
  try {
    const { id_usuario, fecha_creacion, tipo_comida } = req.body;

    const usuarioExiste = await Usuario.findByPk(id_usuario);
    if (!usuarioExiste) return res.status(404).json({ mensaje: 'El usuario no existe' });

    const nuevaPlanilla = await planillaRacion.create({
      id_usuario,
      fecha_creacion,
      tipo_comida
    });

    res.status(201).json(nuevaPlanilla);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la planilla de raciones', error: error.message });
  }
};

module.exports = {
  obtenerPlanillasRaciones,
  crearPlanillaRacion
};