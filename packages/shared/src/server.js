require('dotenv').config;
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth.routes');
const errrHandler = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/healt', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken);

app.use(errrHandler);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

prisma.$on('query', (e) => {
    console.log('Query :' + e.query);
    console.log('Duration' + e.duration + 'ms');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

module.exports = app;