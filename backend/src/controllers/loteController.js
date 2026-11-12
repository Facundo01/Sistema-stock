const lote = require('../models/lote');
const producto = require('../models/producto');

// Obtener todos los lotes (incluyendo la información del producto asociado)
const obtenerLotes = async (req, res) => {
  try {
    const listaLotes = await lote.findAll({
      include: {
        model: producto,
        attributes: ['nombre_producto', 'unidad_base']
      }
    });
    res.json(listaLotes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los lotes de stock', error: error.message });
  }
};

// Crear un nuevo lote
const crearLote = async (req, res) => {
  try {
    const { id_producto, numero_lote, fecha_adquisicion, fecha_vencimiento, cantidad_inicial, cantidad_actual } = req.body;
    
    // Verificar si el producto existe
    const productoExiste = await producto.findByPk(id_producto);
    if (!productoExiste) {
      return res.status(404).json({ mensaje: 'El producto especificado no existe' });
    }

    const nuevoLote = await lote.create({
      id_producto,
      numero_lote,
      fecha_adquisicion,
      fecha_vencimiento,
      cantidad_inicial,
      cantidad_actual: cantidad_actual !== undefined ? cantidad_actual : cantidad_inicial
    });

    res.status(201).json(nuevoLote);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el lote de stock', error: error.message });
  }
};

module.exports = {
  obtenerLotes,
  crearLote
};