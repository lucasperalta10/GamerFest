const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize, User, Game, Platform, Event } = require('../models');

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
      { name: 'Xbox One' }
    ];
    const platforms = await Platform.bulkCreate(platformsData);
    console.log('Plataformas creadas.');

    // Mapear plataformas para acceso rápido
    const platformMap = {};
    platforms.forEach(p => {
      platformMap[p.name] = p.id;
    });

    // 4. Crear Administrador Inicial
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@gamerfest.com',
      password_hash: adminPasswordHash,
      role: 'ROL_ADMIN'
    });

    const userPasswordHash = await bcrypt.hash('user123', 10);
    await User.create({
      username: 'gamer',
      email: 'gamer@gmail.com',
      password_hash: userPasswordHash,
      role: 'ROL_USUARIO'
    });
    console.log('Usuarios de prueba creados:');
    console.log(' - Admin: admin / admin123');
    console.log(' - Usuario: gamer / user123');

    // 5. Crear Videojuegos
    const gamesData = [
      {
        title: 'Grand Theft Auto VI',
        description: 'La próxima entrega de la legendaria serie Grand Theft Auto de Rockstar Games, ambientada en Vice City.',
        release_date: '2025-10-31',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      },
      {
        title: 'Metroid Prime 4: Beyond',
        description: 'Samus Aran regresa en una nueva aventura intergaláctica de la saga Metroid Prime desarrollada por Retro Studios.',
        release_date: '2025-06-30',
        image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
      },
      {
        title: 'Elden Ring: Shadow of the Erdtree',
        description: 'Expansión masiva del aclamado juego de rol y acción en mundo abierto de FromSoftware.',
        release_date: '2024-06-21',
        image_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop',
      },
      {
        title: 'Hollow Knight: Silksong',
        description: 'Juego de acción y aventura al estilo metroidvania desarrollado por Team Cherry. Encarna a Hornet en un vasto y misterioso reino.',
        release_date: '2026-11-20',
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
      }
    ];

    const games = await Game.bulkCreate(gamesData);
    console.log('Videojuegos creados.');

    // Relacionar Videojuegos con Plataformas
    // GTA VI en PS5 y Xbox Series
    await games[0].setPlatforms([platformMap['PlayStation 5'], platformMap['Xbox Series X/S']]);
    // Metroid Prime 4 en Switch
    await games[1].setPlatforms([platformMap['Nintendo Switch']]);
    // Elden Ring en PC, PS5, Xbox Series, PS4, Xbox One
    await games[2].setPlatforms([
      platformMap['PC'],
      platformMap['PlayStation 5'],
      platformMap['Xbox Series X/S'],
      platformMap['PlayStation 4'],
      platformMap['Xbox One']
    ]);
    // Silksong en PC, Switch, PS5, Xbox Series
    await games[3].setPlatforms([
      platformMap['PC'],
      platformMap['Nintendo Switch'],
      platformMap['PlayStation 5'],
      platformMap['Xbox Series X/S']
    ]);
    console.log('Relaciones de plataformas establecidas.');

    // 6. Crear Eventos
    const currentYear = 2026;
    const eventsData = [
      {
        title: 'Summer Game Fest 2026',
        description: 'La gran celebración anual de la industria de los videojuegos con novedades, primicias y avances exclusivos organizada por Geoff Keighley.',
        event_date: `${currentYear}-06-08T18:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/@TheGameAwards',
        image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Xbox Games Showcase 2026',
        description: 'Presentación de los próximos juegos de Xbox Game Studios y sus socios internacionales.',
        event_date: `${currentYear}-06-09T17:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.twitch.tv/xbox',
        image_url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Ubisoft Forward 2026',
        description: 'Presentación en vivo de los títulos en desarrollo y futuras actualizaciones del catálogo de Ubisoft.',
        event_date: `${currentYear}-06-10T19:00:00.000Z`,
        type: 'conferencia',
        location_link: 'https://www.ubisoft.com/forward',
        image_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Nintendo Direct Junio 2026',
        description: 'Direct enfocado en los juegos que llegarán en la segunda mitad de 2026.',
        event_date: `${currentYear}-06-17T14:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/user/nintendo',
        image_url: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Gamescom Opening Night Live 2026',
        description: 'La gran inauguración en directo de Gamescom 2026 en Colonia, Alemania.',
        event_date: `${currentYear}-08-25T18:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.gamescom.global',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'The Game Awards 2026',
        description: 'La ceremonia de premiación de videojuegos más importante del año, celebrando la excelencia e introduciendo primicias exclusivas.',
        event_date: `${currentYear}-12-10T19:30:00.000Z`,
        type: 'premiacion',
        location_link: 'https://thegameawards.com',
        image_url: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=600&auto=format&fit=crop'
      }
    ];

    await Event.bulkCreate(eventsData);
    console.log('Eventos creados.');

    console.log('--- Semillado completado con éxito ---');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el semillado:', error);
    process.exit(1);
  }
}

seed();
