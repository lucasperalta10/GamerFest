const jwt = require('jsonwebtoken');
require('dotenv').config();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET no está configurado en las variables de entorno.');
    }
    return 'gamerfest_jwt_secret_dev_key_change_in_production';
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
