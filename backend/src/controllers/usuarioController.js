const usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro_hospital';

// Registrar nuevo personal (Admin)
exports.registrarusuario = async (req, res) => {
  try {
    const { name, surname, dni, email, password, rol } = req.body;

    if (!name || !surname || !email || !password || !rol) {
      return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados.' });
    }

    const existeusuario = await usuario.findOne({ where: { email } });
    if (existeusuario) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevousuario = await usuario.create({
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
        id_usuario: nuevousuario.id_usuario,
        name: nuevousuario.name,
        surname: nuevousuario.surname,
        email: nuevousuario.email,
        rol: nuevousuario.rol
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Login de usuario
exports.loginusuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña requeridos.' });
    }

    const usuario = await usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'usuario no encontrado.' });
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
exports.obtenerusuarios = async (req, res) => {
  try {
    const usuarios = await usuario.findAll({
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
exports.eliminarusuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'usuario no encontrado.' });
    }

    await usuario.destroy();
    return res.status(200).json({ mensaje: '¡usuario eliminado con éxito!' });
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

    const usuario = await usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'usuario no encontrado.' });
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