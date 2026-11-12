const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro_hospital';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado: No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = {
      ...decoded,
      id_usuario: decoded.id_usuario || decoded.id,
      id: decoded.id_usuario || decoded.id
    };
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};

const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `Acceso restringido. Requiere rol: ${rolesPermitidos.join(' o ')}`
      });
    }
    next();
  };
};

module.exports = { verificarToken, permitirRoles };