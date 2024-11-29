// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            }
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hanya admin atau user sendiri yang bisa lihat detail
        if (req.user.id !== user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Update user
router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const userId = parseInt(req.params.id);

        // Cek authorization
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username,
                email,
                updated_at: new Date()
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Get user profile (current logged in user)
router.get('/profile/me', authenticateToken, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true
            }
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Update password
router.put('/password/change', authenticateToken, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: hashedPassword,
                updated_at: new Date()
            }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;