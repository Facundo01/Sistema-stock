const menuIngrediente = require('../models/menuIngrediente');
const menu = require('../models/menu');
const producto = require('../models/producto');

// Obtener todos los ingredientes de los menús
const obtenerMenuIngredientes = async (req, res) => {
  try {
    const lista = await menuIngrediente.findAll({
      include: [
        { model: menu, attributes: ['nombre_menu'] },
        { model: producto, attributes: ['nombre_producto', 'unidad_base'] }
      ]
    });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los ingredientes del menú', error: error.message });
  }
};

// Agregar un ingrediente a un menú
const crearMenuIngrediente = async (req, res) => {
  try {
    const { id_menu, id_producto, cantidad_ingrediente, unidad_medida } = req.body;

    const menuExiste = await menu.findByPk(id_menu);
    if (!menuExiste) return res.status(404).json({ mensaje: 'El menú no existe' });

    const productoExiste = await producto.findByPk(id_producto);
    if (!productoExiste) return res.status(404).json({ mensaje: 'El producto no existe' });

    const nuevoDetalle = await menuIngrediente.create({
      id_menu,
      id_producto,
      cantidad_ingrediente,
      unidad_medida
    });

    res.status(201).json(nuevoDetalle);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al asociar el ingrediente al menú', error: error.message });
  }
};

module.exports = {
  obtenerMenuIngredientes,
  crearMenuIngrediente
};