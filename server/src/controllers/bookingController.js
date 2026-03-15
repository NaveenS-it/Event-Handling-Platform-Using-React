const prisma = require('../config/prismaClient');

exports.createBooking = async (req, res) => {
    try {
        const { eventId, tickets, selectedTiers } = req.body;
        const userId = req.user.userId;

        // Check if event exists
        const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) } });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if user already has a booking for this event
        const existingBooking = await prisma.booking.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId: parseInt(eventId)
                }
            }
        });
        if (existingBooking) {
            return res.status(400).json({ message: 'You already have a booking for this event' });
        }

        // Ensure it's in the future (simple check)
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({ message: 'Cannot book past events' });
        }

        // Calculate total tickets
        let totalTickets = typeof tickets === 'number' ? tickets : 1;
        if (selectedTiers && Array.isArray(selectedTiers)) {
            totalTickets = selectedTiers.reduce((acc, t) => acc + (t.quantity || 1), 0);
        }

        const bookingReference = `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const booking = await prisma.booking.create({
            data: {
                userId,
                eventId: parseInt(eventId),
                tickets: totalTickets,
                bookingReference,
                status: 'CONFIRMED'
            }
        });

        const ticketsToCreate = [];
        if (selectedTiers && Array.isArray(selectedTiers) && selectedTiers.length > 0) {
            for (const tier of selectedTiers) {
                for (let i = 0; i < tier.quantity; i++) {
                    const ticketCode = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                    ticketsToCreate.push({
                        bookingId: booking.id,
                        tierId: parseInt(tier.tierId),
                        tierName: tier.tierName,
                        ticketCode,
                        qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`
                    });
                }
            }
        } else {
            // Generic tickets without tiers
            for (let i = 0; i < totalTickets; i++) {
                const ticketCode = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                ticketsToCreate.push({
                    bookingId: booking.id,
                    tierId: 1, // Fallback if no tier
                    tierName: 'General Admission',
                    ticketCode,
                    qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketCode}`
                });
            }
        }

        // We can ignore the relation error if tierId 1 doesn't exist by just creating without tierId if needed,
        // but prisma ticket table requires tierId. Let's make tierId optional in prisma or find a fallback.
        // Wait, I made tierId required in prisma. Let's fetch tier 1 or create a pseudo tier?
        // Let's create dummy tier if tierId doesn't exist. Actually, let's catch it manually:
        if (!selectedTiers || selectedTiers.length === 0) {
            let defaultTier = await prisma.ticketTier.findFirst({ where: { eventId: parseInt(eventId) } });
            if (!defaultTier) {
                defaultTier = await prisma.ticketTier.create({
                    data: { eventId: parseInt(eventId), name: 'General Admission', price: event.price, quantity: 100 }
                });
            }
            ticketsToCreate.forEach(t => t.tierId = defaultTier.id);
        }

        await prisma.ticket.createMany({ data: ticketsToCreate });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { event: true, ticketsList: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.id);
        const userId = req.user.userId;

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId !== userId) return res.status(403).json({ message: 'Not authorized' });

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' }
        });

        res.json({ message: 'Booking cancelled successfully', booking: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: { select: { name: true, email: true } }, event: { select: { title: true, date: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
