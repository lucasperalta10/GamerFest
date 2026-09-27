const jwt = require('jsonwebtoken');
require('dotenv').config();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('ADVERTENCIA: JWT_SECRET no está configurado. Usando clave por defecto.');
    return 'gamerfest_jwt_secret_key_2026_default_fallback';
  }
  return secret;
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
};

module.exports = {
  getJwtSecret,
  generateToken,
};
