const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro_hospital';

// Registrar nuevo personal (Admin)
exports.registrarUsuario = async (req, res) => {
  try {
    const { name, surname, dni, email, password, rol } = req.body;

    if (!name || !surname || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados.' });
    }

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      name,
      surname,
      dni: dni || null,
      email,
      password: passwordHash,
      rol
    });

    return res.status(201).json({
      mensaje: '¡Usuario registrado con éxito!',
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        name: nuevoUsuario.name,
        surname: nuevoUsuario.surname,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña requeridos.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { 
        id_usuario: usuario.id_usuario, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      mensaje: '¡Login exitoso!',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        name: usuario.name,
        surname: usuario.surname,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Obtener listado de usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    await usuario.destroy();
    return res.status(200).json({ mensaje: '¡Usuario eliminado con éxito!' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Restablecer contraseña de un usuario (Admin)
exports.resetearPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaPassword } = req.body;

    if (!nuevaPassword || nuevaPassword.length < 4) {
      return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 4 caracteres.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(nuevaPassword, salt);
    await usuario.save();

    return res.status(200).json({ 
      mensaje: `¡Contraseña restablecida con éxito para ${usuario.name} ${usuario.surname}!` 
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor al cambiar la contraseña.' });
  }
};