const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const express = require('express');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET

//register
app.post('/register', async (req, res) => {
    const { email, userName, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.users.create({
            data: {
                email,
                pass: hashedPassword,
                username: userName,
            },
        });

        res.status(201).json({ message: 'user registed succsess', user });
    } catch (error) {
        res.status(400).json({ error: 'reqistration failed', details: error });
    }
})

//login
app.post('/login', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'invalid email, username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.pass);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'invalid email, username or password' });
        }

        const token = jwt.sign({ userID: users.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'login success', token });
    } catch (error) {
        res.status(500).json({ error: 'login failed', details: error });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Acess denied, no token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'invalid token' });
        }

        req.user = decoded;
        next();
    });
};

//route yang dilindungi 
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', userID: req.user.userID });
});

//start server
app.listen(PORT, () => {
    console.log('server running on http://localhost:${PORT}');
});