const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/auth');

// Todas estas rutas requieren estar autenticado
router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);

router.post('/games/:id', favoriteController.addGameFavorite);
router.delete('/games/:id', favoriteController.removeGameFavorite);

router.post('/events/:id', favoriteController.addEventFavorite);
router.delete('/events/:id', favoriteController.removeEventFavorite);

module.exports = router;
