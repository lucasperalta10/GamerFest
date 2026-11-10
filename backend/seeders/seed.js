const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize, User, Game, Platform, Event } = require('../models');
const seedData = require('./seedData.json');

async function seed() {
  const dbName = process.env.DB_NAME || 'gamerfest';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;

  console.log('--- Iniciando Semillado de Base de Datos ---');

  try {
    // 1. Crear base de datos si no existe
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`Base de datos "${dbName}" creada o ya existente.`);

    // 2. Sincronizar modelos
    await sequelize.sync({ force: true });
    console.log('Tablas sincronizadas con éxito (force: true).');

    // 3. Crear Plataformas
    const platformsData = [
      { name: 'PC' },
      { name: 'PlayStation 5' },
      { name: 'Xbox Series X/S' },
      { name: 'Nintendo Switch' },
      { name: 'PlayStation 4' },
      { name: 'Xbox One' },
      { name: 'Nintendo Switch 2' },
      { name: 'Android' },
      { name: 'iOS' },
      { name: 'VR/Meta Quest' }
    ];
    const platforms = await Platform.bulkCreate(platformsData);
    console.log('Plataformas creadas.');

    // Mapear plataformas para acceso rápido
    const platformMap = {};
    platforms.forEach(p => {
      platformMap[p.name] = p.id;
    });

    // 4. Crear Administrador y Usuario Inicial
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: 'admin',
      email: 'admin@gamerfest.com',
      password_hash: adminPasswordHash,
      role: 'ROL_ADMIN'
    });

    const userPassword = process.env.SEED_USER_PASSWORD || 'user123';
    const userPasswordHash = await bcrypt.hash(userPassword, 10);
    await User.create({
      username: 'gamer',
      email: 'gamer@gmail.com',
      password_hash: userPasswordHash,
      role: 'ROL_USUARIO'
    });
    console.log(` - Admin: admin / ${adminPassword}`);
    console.log(` - Usuario: gamer / ${userPassword}`);

    // 5. Crear Videojuegos (42 juegos desde datos_cargados.md)
    const gamesData = seedData.games;
    const games = await Game.bulkCreate(gamesData);
    console.log(`${games.length} videojuegos creados.`);

    // Relacionar Videojuegos con Plataformas de forma dinámica
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const pNames = gamesData[i].platforms;
      if (pNames && pNames.length > 0) {
        const pIds = pNames.map(name => platformMap[name]).filter(id => id !== undefined);
        await game.setPlatforms(pIds);
      }
    }
    console.log('Relaciones de plataformas establecidas.');

    // 6. Crear Eventos y Conferencias (11 eventos desde datos_cargados.md)
    const eventsData = seedData.events;
    await Event.bulkCreate(eventsData);
    console.log(`${eventsData.length} eventos creados.`);

    console.log('--- Semillado completado con éxito ---');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el semillado:', error);
    process.exit(1);
  }
}

seed();
