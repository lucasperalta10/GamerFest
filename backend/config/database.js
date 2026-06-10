const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gamerfest',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Desactivar logs de SQL en consola para mantenerla limpia
    define: {
      timestamps: true,
      underscored: true, // Usa snake_case para nombres de columnas
    }
  }
);

module.exports = sequelize;
