const Menu = require('../models/menu');
const Paciente = require('../models/paciente');

// Registrar o prescribir un menú clínico para un paciente
exports.registrarMenu = async (req, res) => {
  try {
    const { id_paciente, nombre_menu, descripcion_dieta } = req.body;

    if (!nombre_menu || !descripcion_dieta) {
      return res.status(400).json({ mensaje: 'El nombre del menú y la descripción de la dieta son obligatorios.' });
    }

    const nuevoMenu = await Menu.create({
      id_paciente: id_paciente || null,
      nombre_menu,
      descripcion_dieta
    });

    return res.status(201).json({
      mensaje: '¡Menú clínico asignado con éxito!',
      menu: nuevoMenu
    });
  } catch (error) {
    console.error('Error al registrar menú:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor al registrar el menú.' });
  }
};

// Obtener todos los menús con información del paciente asociado
exports.obtenerMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [
        { 
          model: Paciente, 
          attributes: ['nombre', 'apellido', 'habitacion', 'cama', 'patologia'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(menus);
  } catch (error) {
    console.error('Error al obtener menús:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Eliminar un menú
exports.eliminarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).json({ mensaje: 'Menú no encontrado.' });
    }

    await menu.destroy();
    return res.status(200).json({ mensaje: '¡Menú eliminado con éxito!' });
  } catch (error) {
    console.error('Error al eliminar menú:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};