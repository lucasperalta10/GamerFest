const sequelize = require('../config/database');
const User = require('./User');
const Game = require('./Game');
const Platform = require('./Platform');
const Event = require('./Event');

// 1. Relación N:M entre Videojuegos y Plataformas
Game.belongsToMany(Platform, {
  through: 'game_platforms',
  as: 'platforms',
  foreignKey: 'game_id',
  otherKey: 'platform_id',
  timestamps: false,
});
Platform.belongsToMany(Game, {
  through: 'game_platforms',
  as: 'games',
  foreignKey: 'platform_id',
  otherKey: 'game_id',
  timestamps: false,
});

// 2. Relación N:M para Favoritos de Videojuegos
User.belongsToMany(Game, {
  through: 'user_favorite_games',
  as: 'favoriteGames',
  foreignKey: 'user_id',
  otherKey: 'game_id',
  timestamps: true, // Registra cuándo se marcó como favorito
});
Game.belongsToMany(User, {
  through: 'user_favorite_games',
  as: 'favoritedByUsers',
  foreignKey: 'game_id',
  otherKey: 'user_id',
  timestamps: true,
});

// 3. Relación N:M para Favoritos de Eventos
User.belongsToMany(Event, {
  through: 'user_favorite_events',
  as: 'favoriteEvents',
  foreignKey: 'user_id',
  otherKey: 'event_id',
  timestamps: true, // Registra cuándo se marcó como favorito
});
Event.belongsToMany(User, {
  through: 'user_favorite_events',
  as: 'favoritedByUsers',
  foreignKey: 'event_id',
  otherKey: 'user_id',
  timestamps: true,
});

module.exports = {
  sequelize,
  User,
  Game,
  Platform,
  Event,
};
