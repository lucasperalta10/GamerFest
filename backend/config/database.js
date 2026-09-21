const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const enableSSL = process.env.DB_SSL === 'true' || (isProduction && Boolean(process.env.DATABASE_URL));

const commonOptions = {
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: enableSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'gamerfest',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      ...commonOptions,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
    }
  );
}

module.exports = sequelize;

