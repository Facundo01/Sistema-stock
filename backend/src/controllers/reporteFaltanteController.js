const ReporteFaltante = require('../models/reporteFaltante');
const usuario = require('../models/usuario');

// Crear reporte de faltante (Cocinero)
exports.crearReporte = async (req, res) => {
  try {
    const idusuario = req.usuario?.id_usuario || req.usuario?.id;
    const { producto_solicitado, cantidad_necesaria, urgencia, observacion } = req.body;

    if (!producto_solicitado) {
      return res.status(400).json({ mensaje: 'Debes indicar qué producto falta o necesitas.' });
    }

    const nuevoReporte = await ReporteFaltante.create({
      id_usuario: idusuario,
      producto_solicitado,
      cantidad_necesaria: cantidad_necesaria || 'A criterio',
      urgencia: urgencia || 'Normal',
      observacion: observacion || ''
    });

    return res.status(201).json({
      mensaje: '¡Reporte de faltante enviado al Administrador!',
      reporte: nuevoReporte
    });
  } catch (error) {
    console.error('Error al crear reporte de faltante:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Obtener reportes pendientes (Administrador y Cocinero)
exports.obtenerReportes = async (req, res) => {
  try {
    const reportes = await ReporteFaltante.findAll({
      where: { resuelto: false },
      include: [
        {
          model: usuario,
          attributes: ['name', 'surname', 'rol']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(reportes);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Marcar reporte como resuelto / eliminar alerta (Administrador)
exports.resolverReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await ReporteFaltante.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado.' });
    }

    reporte.resuelto = true;
    await reporte.save();

    return res.status(200).json({ mensaje: '¡Reporte marcado como resuelto!' });
  } catch (error) {
    console.error('Error al resolver reporte:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};