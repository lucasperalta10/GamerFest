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

    // 4. Crear Administrador Inicial
    // Contraseñas configurables por variables de entorno (solo para desarrollo;
    // en producción definir SEED_ADMIN_PASSWORD y SEED_USER_PASSWORD y NO usar los defaults)
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
    // 5. Crear Videojuego
    const gamesData = [
      {
        title: 'Animal Crossing: New Horizons – Switch 2 Edition',
        description: 'Una versión mejorada del aclamado simulador de vida de Nintendo, optimizada para la nueva generación con mejores gráficos y nuevas opciones de personalización.',
        release_date: '2026-01-15',
        image_url: '/images/games/animalcrossing.jpg',
        platforms: ['Nintendo Switch 2']
      },
      {
        title: '2XKO',
        description: 'El esperado juego de lucha por parejas de Riot Games ambientado en el universo de League of Legends.',
        release_date: '2026-01-20',
        image_url: '/images/games/2XKO.webp',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Dragon Quest VII Reimagined',
        description: 'Un remake completo de la séptima entrega de la legendaria saga Dragon Quest con gráficos modernos y mejoras de calidad de vida.',
        release_date: '2026-02-05',
        image_url: '/images/games/dragonquestviireimagened.avif',
        platforms: ['PC', 'Nintendo Switch', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Yakuza Kiwami 3 & Dark Ties',
        description: 'La esperada reedición de la tercera entrega de la saga Yakuza en el motor Dragon Engine, junto con contenido de historia inédito.',
        release_date: '2026-02-12',
        image_url: '/images/games/yakuza3ydarkties.avif',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'PlayStation 4']
      },
      {
        title: 'Avowed',
        description: 'El juego de rol en primera persona de Obsidian Entertainment ambientado en el universo de Pillars of Eternity.',
        release_date: '2026-02-17',
        image_url: '/images/games/avowed.jpeg',
        platforms: ['PC', 'Xbox Series X/S']
      },
      {
        title: 'Resident Evil Requiem',
        description: 'La nueva entrega principal de la saga de terror de Capcom, prometiendo regresar a las raíces de la supervivencia y el pánico psicológico.',
        release_date: '2026-02-27',
        image_url: '/images/games/residentevilrequiem.jpg',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Marathon',
        description: 'El shooter de extracción de ciencia ficción multijugador en primera persona desarrollado por Bungie.',
        release_date: '2026-03-05',
        image_url: '/images/games/marathon.png',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Crimson Desert',
        description: 'Un juego de acción y aventura en un mundo abierto medieval desarrollado por Pearl Abyss que narra la lucha por la supervivencia en Pywel.',
        release_date: '2026-03-19',
        image_url: '/images/games/crimsondesert.jpg',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Starfield (PS5 Edition)',
        description: 'La llegada del épico juego de rol espacial de Bethesda Game Studios a la consola PlayStation 5 con todas las actualizaciones y DLC incluidos.',
        release_date: '2026-04-07',
        image_url: '/images/games/starfield.avif',
        platforms: ['PlayStation 5']
      },
      {
        title: 'Forza Horizon 6',
        description: 'La franquicia de velocidad y mundo abierto de Xbox regresa con un nuevo mapa exótico y físicas de conducción de vanguardia.',
        release_date: '2026-05-19',
        image_url: '/images/games/forzahorizon6.avif',
        platforms: ['PC', 'Xbox Series X/S']
      },
      {
        title: 'Mina the Hollower',
        description: 'Una aventura de acción con estética retro desarrollada por Yacht Club Games, creadores de Shovel Knight.',
        release_date: '2026-05-29',
        image_url: '/images/games/minathehollower.png',
        platforms: ['PC', 'Nintendo Switch', 'PlayStation 5', 'Xbox Series X/S', 'PlayStation 4', 'Xbox One']
      },
      {
        title: 'Gothic Remake',
        description: 'El regreso triunfal del icónico RPG de Alkimia Interactive en un mundo vivo y peligroso recreado desde cero.',
        release_date: '2026-06-05',
        image_url: '/images/games/gothicremake.avif',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Metroid Prime 4: Beyond',
        description: 'Samus Aran regresa en una nueva aventura intergaláctica de la saga Metroid Prime desarrollada por Retro Studios.',
        release_date: '2026-06-30',
        image_url: '/images/games/metroidprime4beyond.jpeg',
        platforms: ['Nintendo Switch']
      },
      {
        title: 'DOOM: The Dark Ages – Revelations DLC',
        description: 'La primera gran expansión de la precuela del Doom Slayer, expandiendo su arsenal medieval y los escenarios de asedio del infierno.',
        release_date: '2026-07-07',
        image_url: '/images/games/doomdarkagesdlc.jpeg',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Palworld (1.0 Launch)',
        description: 'El lanzamiento de la versión 1.0 oficial de Palworld tras su exitoso paso por el Acceso Anticipado, con nuevos continentes y Pals.',
        release_date: '2026-07-10',
        image_url: '/images/games/palworld.jpg',
        platforms: ['PC', 'Xbox Series X/S', 'Xbox One']
      },
      {
        title: 'Elden Ring: Tarnished Edition',
        description: 'Una versión definitiva que recopila el aclamado Elden Ring junto con la expansión Shadow of the Erdtree en un solo disco.',
        release_date: '2026-08-28',
        image_url: '/images/games/eldenringtarnishededition.jpg',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Grand Theft Auto VI',
        description: 'La próxima entrega de la legendaria serie Grand Theft Auto de Rockstar Games, ambientada en Vice City.',
        release_date: '2026-11-20',
        image_url: '/images/games/gtavi.png',
        platforms: ['PlayStation 5', 'Xbox Series X/S']
      },
      {
        title: 'Hollow Knight: Silksong',
        description: 'Juego de acción y aventura al estilo metroidvania desarrollado por Team Cherry. Encarna a Hornet en un vasto y misterioso reino.',
        release_date: '2025-05-21',
        image_url: '/images/games/hollowknightsilksong.jpg',
        platforms: ['PC', 'Nintendo Switch', 'PlayStation 5', 'Xbox Series X/S']
      }
    ];

    const games = await Game.bulkCreate(gamesData);
    console.log('Videojuegos creados.');

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

    // 6. Crear Eventos
    const currentYear = 2026;
    const eventsData = [
      {
        title: 'Xbox Developer_Direct 2026',
        description: 'Vistazo en profundidad a varios títulos previstos para Xbox y PC con entrevistas y secuencias de juego extendidas.',
        event_date: `${currentYear}-01-18T18:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/@xbox',
        image_url: '/images/events/xboxdeveloperdirect.jpeg'
      },
      {
        title: 'State of Play Enero 2026',
        description: 'Presentación de novedades y actualizaciones sobre próximos juegos que llegarán a PlayStation 5 y PS VR2.',
        event_date: `${currentYear}-01-28T22:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/@playstation',
        image_url: '/images/events/stateofplay.jpeg'
      },
      {
        title: 'Nintendo Direct Febrero 2026',
        description: 'Presentación general de los juegos que llegarán a Nintendo Switch durante la primera mitad de 2026.',
        event_date: `${currentYear}-02-18T14:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/user/nintendo',
        image_url: '/images/events/nintendodirect.webp'
      },
      {
        title: 'Pokémon Presents 2026',
        description: 'Transmisión especial para celebrar el Día de Pokémon con anuncios de juegos y eventos de la franquicia.',
        event_date: `${currentYear}-02-27T15:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/user/pokemon',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Summer Game Fest 2026',
        description: 'La gran celebración anual de la industria de los videojuegos con novedades, primicias y avances exclusivos organizada por Geoff Keighley.',
        event_date: `${currentYear}-06-08T18:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.youtube.com/@TheGameAwards',
        image_url: '/images/events/summergamefest.webp'
      },
      {
        title: 'Xbox Games Showcase 2026',
        description: 'Presentación de los próximos juegos de Xbox Game Studios y sus socios internacionales.',
        event_date: `${currentYear}-06-09T17:00:00.000Z`,
        type: 'showcase',
        location_link: 'https://www.twitch.tv/xbox',
        image_url: '/images/events/xboxgamesshowcase.webp'
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
        image_url: '/images/events/nintendodirect.webp'
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
        title: 'Tokyo Game Show 2026',
        description: 'Uno de los eventos de videojuegos más grandes de Asia, celebrado en el Makuhari Messe de Chiba, Japón.',
        event_date: `${currentYear}-09-24T10:00:00.000Z`,
        type: 'otro',
        location_link: 'https://tgs.nikkeibp.co.jp/tgs/en/',
        image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'
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
