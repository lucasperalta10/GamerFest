const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', gameController.getGames);
router.get('/platforms', gameController.getPlatforms); // Obtener todas las plataformas
router.get('/:id', gameController.getGameById);

// Rutas protegidas para administradores
router.post('/', authMiddleware, adminMiddleware, gameController.createGame);
router.put('/:id', authMiddleware, adminMiddleware, gameController.updateGame);
router.delete('/:id', authMiddleware, adminMiddleware, gameController.deleteGame);

module.exports = router;
