const Paciente = require('../models/paciente');

// Registrar nuevo paciente
exports.registrarPaciente = async (req, res) => {
  try {
    const { nombre, apellido, dni, patologia, observaciones, habitacion, cama, acompanante } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ mensaje: 'El nombre y el apellido del paciente son obligatorios.' });
    }

    const nuevoPaciente = await Paciente.create({
      nombre,
      apellido,
      dni: dni || null,
      patologia: patologia || 'Ninguna / General',
      observaciones: observaciones || '',
      habitacion: habitacion || 'N/A',
      cama: cama || 'N/A',
      acompanante: acompanante || 'Ninguno',
      activo: true
    });

    return res.status(201).json({
      mensaje: '¡Paciente registrado con éxito!',
      paciente: nuevoPaciente
    });
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor al registrar el paciente.' });
  }
};

// Obtener todos los pacientes activos
exports.obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Dar de baja o eliminar un paciente
exports.eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);

    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado.' });
    }

    await paciente.destroy();
    return res.status(200).json({ mensaje: '¡Paciente dado de alta / eliminado con éxito!' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};