const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');

const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d',
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role === 'ADMIN' ? 'ADMIN' : 'USER',
            },
            select: { id: true, name: true, email: true, role: true }
        });

        const token = generateToken(user.id, user.role);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user.id, user.role);
        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
