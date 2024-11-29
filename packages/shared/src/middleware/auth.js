const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    if (!req.cookies.authToken) {
        return res.status(401).json({
            error: 'No Authorization'
        });
    }

    const token = req.cookies.authToken;

    if (token === 'null') {
        return res.status(401).json({
            authenticated: false,
            error: 'No token found in Authorization header'
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({
            error: 'no decoded'
        });
    }
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
};

module.exports = authenticateToken;