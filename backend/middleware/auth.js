const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getJwtSecret } = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no provisto.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token no válido. Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ROL_ADMIN') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de Administrador.' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
