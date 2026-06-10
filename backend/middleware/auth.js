const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no provisto.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gamerfest_jwt_secret_key_2026_super_secret');

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token no válido. Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.', error: error.message });
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
