const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const prisma = new PrismaClient();

router.get('./users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                create_at: true
            }
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: "invalid Role" })
        };

        if (parseInt(id) === req.user.id && role !== 'admin') {
            return res.status(400).json({ message: "cannot change role" })
        };

        const updatedUser = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { role },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
