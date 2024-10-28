const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const hashPassword = async (password) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10)

                return hashedPassword
            } catch (error) {
                console.error('Error hash password', error)
            }
        }
        const userExist = await prisma.users.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (userExist) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.users.create({
            data: {
                email,
                username,
                pass: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true,
            }
        });
        res.status(200).json(user)
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ error: 'Regitration Failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Cari user berdasarkan email atau username
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        const validPassword = await bcrypt.compare(password, user.pass);
        if (!validPassword) {
            return res.status(400).json({
                error: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Kirim response tanpa password
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            error: 'Internal server error during login'
        });
    }
});

module.exports = router;