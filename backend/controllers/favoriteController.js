const { User, Game, Event, Platform } = require('../models');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Game,
          as: 'favoriteGames',
          through: { attributes: [] },
          include: [{ model: Platform, as: 'platforms', through: { attributes: [] } }]
        },
        {
          model: Event,
          as: 'favoriteEvents',
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      games: user.favoriteGames,
      events: user.favoriteEvents
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener favoritos.', error: error.message });
  }
};

exports.addGameFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(req.user.id);
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: 'Videojuego no encontrado.' });
    }

    await user.addFavoriteGame(game);
    return res.status(200).json({ message: 'Videojuego agregado a favoritos.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar a favoritos.', error: error.message });
  }
};

exports.removeGameFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(req.user.id);
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ message: 'Videojuego no encontrado.' });
    }

    await user.removeFavoriteGame(game);
    return res.status(200).json({ message: 'Videojuego removido de favoritos.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al remover de favoritos.', error: error.message });
  }
};

exports.addEventFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(req.user.id);
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    await user.addFavoriteEvent(event);
    return res.status(200).json({ message: 'Evento agregado a favoritos.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al agregar a favoritos.', error: error.message });
  }
};

exports.removeEventFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(req.user.id);
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    await user.removeFavoriteEvent(event);
    return res.status(200).json({ message: 'Evento removido de favoritos.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al remover de favoritos.', error: error.message });
  }
};
