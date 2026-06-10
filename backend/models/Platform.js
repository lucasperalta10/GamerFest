const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Platform = sequelize.define('Platform', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'platforms',
  timestamps: false, // No necesitamos timestamps para plataformas
});

module.exports = Platform;
