const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        // Menggunakan nama cookie yang konsisten: 'authenticateToken'
        const token = req.cookies.authenticateToken;

        if (!token) {
            return res.status(401).json({
                authenticated: false,
                error: 'No authentication token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Simpan userId di req untuk digunakan di route

        const user = await prisma.users.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({
                authenticated: false,
                error: 'User not found'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('authenticateToken'); // Clear expired cookie
            return res.status(401).json({
                authenticated: false,
                error: 'Token has expired'
            });
        }

        return res.status(401).json({
            authenticated: false,
            error: 'Invalid token'
        });
    }
};

module.exports = authenticateToken;
