const Producto = require('../models/producto');

exports.crearProducto = async (req, res) => {
  try {
    const { nombre_producto, descripcion, stock_minimo, stock_actual, unidad_base } = req.body;

    if (!nombre_producto || stock_minimo === undefined || stock_actual === undefined || !unidad_base) {
      return res.status(400).json({ mensaje: 'Todos los campos de stock y unidad son obligatorios.' });
    }

    // Busca si ya existe un producto con el mismo nombre y unidad para sumar stock en lugar de duplicar
    let productoExistente = await Producto.findOne({ 
      where: { nombre_producto: nombre_producto.trim(), unidad_base } 
    });

    if (productoExistente) {
      productoExistente.stock_actual = parseFloat(productoExistente.stock_actual) + parseFloat(stock_actual);
      productoExistente.stock_minimo = parseFloat(stock_minimo);
      if (descripcion) productoExistente.descripcion = descripcion;
      
      await productoExistente.save();

      return res.status(200).json({ 
        mensaje: `¡El producto ya existía! Se sumaron ${stock_actual} ${unidad_base} al inventario actual.`, 
        producto: productoExistente 
      });
    }

    const nuevoProducto = await Producto.create({
      nombre_producto: nombre_producto.trim(),
      descripcion,
      stock_minimo: parseFloat(stock_minimo),
      stock_actual: parseFloat(stock_actual),
      unidad_base
    });

    return res.status(201).json({ mensaje: '¡Producto registrado con éxito!', producto: nuevoProducto });
  } catch (error) {
    console.error('Error al crear/actualizar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor al gestionar el producto.' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};