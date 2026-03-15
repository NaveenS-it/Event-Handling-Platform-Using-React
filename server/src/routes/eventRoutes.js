const express = require('express');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createEvent);
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
