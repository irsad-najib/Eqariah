require('dotenv').config;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth.routes');
const errrHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user.routes');
const adminRouter = require('./routes/admin');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get('/healt', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRouter);

app.use(errrHandler);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

prisma.$on('query', (e) => {
    console.log(`Query : ${e.query}`);
    console.log(`Duration ${e.duration}ms`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;