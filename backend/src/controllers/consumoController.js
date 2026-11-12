const Consumo = require('../models/consumo');
const Producto = require('../models/producto');

// Registrar consumo o merma (descuento de stock)
exports.registrarConsumo = async (req, res) => {
  try {
    // Extraer de forma segura el ID del usuario del token
    const idUsuario = req.usuario?.id_usuario || req.usuario?.id;

    if (!idUsuario) {
      return res.status(401).json({ mensaje: 'Acceso denegado: Token inválido o sin ID de usuario.' });
    }

    const { id_producto, cantidad_consumida, unidad_consumo, motivo } = req.body;

    if (!id_producto || !cantidad_consumida || !unidad_consumo || !motivo) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios para registrar la operación.' });
    }

    // Buscar el producto en la base de datos
    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el inventario.' });
    }

    const cantidadARestar = parseFloat(cantidad_consumida);
    const stockActual = parseFloat(producto.stock_actual);

    if (stockActual < cantidadARestar) {
      return res.status(400).json({ mensaje: `Stock insuficiente. Stock actual disponible: ${stockActual} ${producto.unidad_base}` });
    }

    // Descontar el stock
    const nuevoStock = stockActual - cantidadARestar;
    producto.stock_actual = nuevoStock;
    await producto.save();

    // Registrar el movimiento en la tabla de consumos/mermas
    const nuevoConsumo = await Consumo.create({
      id_producto,
      id_usuario: idUsuario,
      cantidad_consumida: cantidadARestar,
      unidad_consumo,
      motivo
    });

    return res.status(201).json({
      mensaje: `¡Operación registrada con éxito! Nuevo stock de ${producto.nombre_producto}: ${nuevoStock} ${producto.unidad_base}`,
      consumo: nuevoConsumo
    });

  } catch (error) {
    console.error('Error al registrar consumo o merma:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor al procesar la operación.' });
  }
};

// Obtener listado de consumos
exports.obtenerConsumos = async (req, res) => {
  try {
    const consumos = await Consumo.findAll({
      include: [
        { model: Producto, attributes: ['nombre_producto', 'unidad_base'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(consumos);
  } catch (error) {
    console.error('Error al obtener consumos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};