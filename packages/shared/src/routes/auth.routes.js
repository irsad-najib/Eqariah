const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const z = require('zod');
const authenticateToken = require('../middleware/auth');
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

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,  // Karena menggunakan HTTPS (x-forwarded-proto: 'https')
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',

        });
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
        });
    }
});

router.get('/verify-session', authenticateToken, async (req, res) => {
    try {

        if (!req.user?.userId) {  // Ubah req.userId menjadi req.user.userId
            return res.status(401).json({
                authenticated: false,
                error: 'User ID is missing or invalid'
            });
        }

        const user = await prisma.users.findUnique({
            where: { id: req.user.userId },  // Ubah req.userId menjadi req.user.userId
            select: {
                username: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({
                authenticated: false,
                message: 'User not found'
            });
        }

        // Prevent caching of sensitive routes
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

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
    try {
        console.log("p");

        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        console.log("logout success")

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
});

router.get('/check-auth', authenticateToken, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                isAuthenticated: false,
                error: 'User ID is missing or invalid'
            });
        }

        const user = await prisma.users.findUnique({
            where: { id: req.userId },
            select: {
                username: true,
                email: true,
                role: true
            }
        });
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        return res.status(200).json({
            isAuthenticated: true,
            user
        });
    } catch (error) {
        console.error('Session verification error:', error);
        return res.status(500).json({
            isAuthenticated: false,
            message: 'Internal server error during verification'
        });
    }
});

router.post('/registerMosque', async (req, res) => {
    try {
        const data = await registerSchema.parseAsync(req.body);
        console.log("Received data:", data);

        // Buat masjid terlebih dahulu
        const mosque = await prisma.registermosque.create({
            data: {
                mosqueName: data.mosqueName,
                phoneNumber: data.phoneNumber,
                mosqueAdmin: data.mosqueAdmin,
                contactPerson: data.contactPerson,
            },
        });

        console.log("Mosque created:", mosque);

        // Buat alamat yang terhubung dengan masjid
        const address = await prisma.address.create({
            data: {
                street: data.street,
                rt: data.rt,
                rw: data.rw,
                village: data.village,
                district: data.district,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
                mosqueId: mosque.id, // Hubungkan ke masjid
            },
        });

        console.log("Address created:", address);

        // Sertakan data masjid dan alamat dalam respons
        return res.status(201).json({
            success: true,
            data: {
                ...mosque,
                address,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors,
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                error: "Mosque with this name already exists",
            });
        }

        return res.status(500).json({
            success: false,
            error: "Registration failed",
            message: "An error occurred while processing your request",
        });
    }
});
router.post('/announcement', authenticateToken, async function (req, res, next) {
    try {
        const { title, detail, category_id } = req.body;

        if (!title || !detail || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        let category = await prisma.category.findUnique({
            where: { id: category_id }
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    id: category_id,
                    name: category_id === 'announcement' ? 'Announcement' : 'Appeal'
                }
            });
        }

        const announcement = await prisma.inbox.create({
            data: {
                title: title,
                detail,
                category_id: category.id,
                create_at: new Date(),
                user_id: req.userId
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
                        users_id: req.userId
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

        // Validate user ID from token
        if (!req.user?.userId) {
            return res.status(401).json({
                authenticated: false,
                error: 'User ID is missing or invalid'
            });
        }

        const userId = req.user.userId;

        // Check if the inbox exists
        const inbox = await prisma.inbox.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!inbox) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        // Check if user exists
        const user = await prisma.users.findUnique({
            where: {
                id: userId // Gunakan userId dari req.user
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if already read
        const existingRead = await prisma.inbox_read.findFirst({
            where: {
                inbox_id: parseInt(id),
                users_id: userId
            }
        });

        if (existingRead) {
            return res.json({
                success: true,
                message: "Announcement already marked as read"
            });
        }

        // Create the inbox_read record
        await prisma.inbox_read.create({
            data: {
                is_read: true,
                inbox_id: parseInt(id),
                users_id: userId
            }
        });

        res.json({
            success: true,
            message: "Announcement marked as read"
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to mark announcement as read",
            error: err.message
        });
    }
});


router.get('/role', async (req, res) => {
    const { role } = req.query; // Ubah ke req.query
    try {
        const users = await prisma.users.findMany({
            where: { role: role } // Filter berdasarkan role
        });
        res.status(200).json(users); // Kirim data users yang ditemukan
    } catch (error) {
        res.status(500).json({ message: error.message }); // Perbaiki error handling
    }
});

module.exports = router;