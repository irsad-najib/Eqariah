require('dotenv').config();
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
    origin: ['https://eqariah.vercel.app', process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Access-Control-Allow-Headers'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    optionsSuccessStatus: 200
}
console.log(process.env.FRONTEND_URL)

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;