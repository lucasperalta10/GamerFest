const { Game, Platform } = require('../models');
const { Op } = require('sequelize');

exports.getGames = async (req, res) => {
  try {
    const { search, platform } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const includeOptions = [
      {
        model: Platform,
        as: 'platforms',
        through: { attributes: [] },
      }
    ];

    // Si hay un filtro por plataforma (nombre o ID)
    if (platform) {
      includeOptions[0].where = {
        [Op.or]: [
          { name: platform },
          { id: isNaN(Number(platform)) ? -1 : Number(platform) }
        ]
      };
    }

    const games = await Game.findAll({
      where: whereClause,
      include: includeOptions,
      order: [['release_date', 'ASC']]
    });

    return res.status(200).json(games);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener videojuegos.', error: error.message });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id, {
      include: [
        {
          model: Platform,
          as: 'platforms',
          through: { attributes: [] }
        }
      ]
    });

    if (!game) {
      return res.status(404).json({ message: 'Videojuego no encontrado.' });
    }

    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener detalle de videojuego.', error: error.message });
  }
};

exports.createGame = async (req, res) => {
  try {
    const { title, description, release_date, image_url, platforms } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título del videojuego es obligatorio.' });
    }

    const game = await Game.create({
      title,
      description,
      release_date,
      image_url
    });

    // Asociar plataformas si se enviaron (array de IDs)
    if (platforms && Array.isArray(platforms) && platforms.length > 0) {
      await game.setPlatforms(platforms);
    }

    const createdGame = await Game.findByPk(game.id, {
      include: [{ model: Platform, as: 'platforms', through: { attributes: [] } }]
    });

    return res.status(201).json({ message: 'Videojuego creado con éxito.', game: createdGame });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear videojuego.', error: error.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, release_date, image_url, platforms } = req.body;

    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ message: 'Videojuego no encontrado.' });
    }

    await game.update({
      title: title || game.title,
      description: description !== undefined ? description : game.description,
      release_date: release_date !== undefined ? release_date : game.release_date,
      image_url: image_url !== undefined ? image_url : game.image_url
    });

    // Actualizar asociaciones de plataformas si se enviaron
    if (platforms && Array.isArray(platforms)) {
      await game.setPlatforms(platforms);
    }

    const updatedGame = await Game.findByPk(id, {
      include: [{ model: Platform, as: 'platforms', through: { attributes: [] } }]
    });

    return res.status(200).json({ message: 'Videojuego actualizado con éxito.', game: updatedGame });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar videojuego.', error: error.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: 'Videojuego no encontrado.' });
    }

    await game.destroy();
    return res.status(200).json({ message: 'Videojuego eliminado con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar videojuego.', error: error.message });
  }
};

// Obtener todas las plataformas disponibles (útil para el frontend)
exports.getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json(platforms);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener plataformas.', error: error.message });
  }
};
