const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'unimq-jwt-secret-very-secure';

// Proteksi untuk Halaman Web (Session)
const checkWebAuth = (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/');
    }
};

// Proteksi untuk API (JWT)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

module.exports = { checkWebAuth, authenticateToken };
