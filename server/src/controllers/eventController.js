const prisma = require('../config/prismaClient');

exports.getAllEvents = async (req, res) => {
    try {
        const { search } = req.query;
        const events = await prisma.event.findMany({
            where: search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                ]
            } : {},
            include: { ticketTiers: true },
            orderBy: { date: 'asc' }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { ticketTiers: true }
        });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, price, imageUrl, ticketTiers } = req.body;

        const eventData = {
            title, description, date: new Date(date), location, price: parseFloat(price), imageUrl
        };

        if (ticketTiers && ticketTiers.length > 0) {
            eventData.ticketTiers = {
                create: ticketTiers.map(t => ({
                    name: t.name,
                    price: parseFloat(t.price),
                    quantity: parseInt(t.quantity)
                }))
            };
        }

        const event = await prisma.event.create({
            data: eventData
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const { title, description, date, location, price, imageUrl } = req.body;
        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                title, description, date: date ? new Date(date) : undefined, location, price: price ? parseFloat(price) : undefined, imageUrl
            }
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        await prisma.event.delete({ where: { id: eventId } });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
