const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const z = require('zod');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
require('dotenv').config();


const router = express.Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
    mosqueName: z.string().min(1, "Mosque name is required"),
    street: z.string().min(1, "Street is required"),
    rt: z.string().min(1, "RT is required"),
    rw: z.string().min(1, "RW is required"),
    village: z.string().min(1, "Village is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    mosqueAdmin: z.string().min(1, "Mosque administrator name is required"),
    contactPerson: z.string().min(1, "Contact person is required")
});

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

        // Validasi input
        if (!identifier || !password) {
            return res.status(400).json({
                error: 'Username/Email and Password are required'
            });
        }

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

        // Validasi password
        const validPassword = await bcrypt.compare(password, user.pass);
        if (!validPassword) {
            return res.status(400).json({
                error: 'Invalid password'
            });
        }
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role // Tambahkan role ke token
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('authenticatedToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        })


        // Logging untuk debugging
        console.log('Login Success:', {
            userId: user.id,
            username: user.username,
            role: user.role
        });

        // Kirim response dengan informasi user lengkap
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role, // Pastikan role dikirim
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        res.status(500).json({
            error: 'Internal server error during login',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

router.get('/verify-session', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                // Tidak memilih password untuk keamanan
            }
        });

        if (!user) {
            return res.status(401).json({
                authenticated: false,
                message: 'User not found'
            });
        }

        // Set header cache control untuk mencegah caching
        res.setHeader('Cache-Control', 'no-store');

        return res.status(200).json({
            authenticated: true,
            user
        });
    } catch (error) {
        console.error('Session verification error:', error);
        return res.status(500).json({
            authenticated: false,
            message: 'Internal server error during verification'
        });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('authenticateToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/'
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

router.post('/registerMosque', async (req, res) => {
    try {
        const data = await registerSchema.parseAsync(req.body);
        const mosque = await prisma.registerMosque.create({
            data: {
                mosqueName: data.mosqueName,
                address: {
                    create: {
                        street: data.street,
                        rt: data.rt,
                        rw: data.rw,
                        village: data.village,
                        district: data.district,
                        city: data.city,
                        province: data.province,
                        postalCode: data.postalCode
                    }
                },
                phoneNumber: data.phoneNumber,
                mosqueAdmin: data.mosqueAdmin,
                contactPerson: data.contactPerson
            },
            include: {
                address: true
            }
        });

        return res.status(201).json({
            success: true,
            data: mosque
        });

    } catch (error) {
        console.error('Register error:', error);

        // Handle different types of errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: error.errors
            });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Mosque with this name already exists'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Registration failed',
            message: 'An error occurred while processing your request'
        });
    }
});

router.post('/announcement', authenticateToken, isAdmin, async function (req, res, next) {
    try {
        const { title, detail, category_id } = req.body;

        // Validasi input
        if (!title || !detail || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validasi category_id (contoh: harus 'announcement' atau 'appeal')
        if (!['announcement', 'appeal'].includes(category_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        const announcement = await prisma.inbox.create({
            data: {
                title,
                detail,
                category_id,
                created_at: new Date(), // perbaiki typo dari create_at
                user_id: req.user.id
            }
        });

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        next(error);
    }
});

router.get('/announcements', authenticateToken, async (req, res) => {
    try {
        const announcements = await prisma.inbox.findMany({
            include: {
                category: true,
                inbox_read: {
                    where: {
                        users_id: req.user.id
                    }
                }
            }
        });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/announcement/read/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.inbox_read.create({
            data: {
                inbox_id: parseInt(id),
                users_id: req.user.id,
                is_read: true
            }
        });

        res.json({ message: "Announcement is marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;