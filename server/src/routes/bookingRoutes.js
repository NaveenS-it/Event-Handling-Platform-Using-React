const express = require('express');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.delete('/:id', cancelBooking);

module.exports = router;
