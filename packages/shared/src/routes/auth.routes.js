const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const z = require('zod')


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

module.exports = router;