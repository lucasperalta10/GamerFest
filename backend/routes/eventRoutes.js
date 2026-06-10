const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Rutas protegidas para administradores
router.post('/', authMiddleware, adminMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, adminMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, eventController.deleteEvent);

module.exports = router;
