const express = require('express');
const prisma = require('../config/prismaClient');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAllBookingsAdmin } = require('../controllers/bookingController');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/bookings', getAllBookingsAdmin);

module.exports = router;
