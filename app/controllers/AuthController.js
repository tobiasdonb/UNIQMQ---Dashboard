const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/db');
const JWT_SECRET = process.env.JWT_SECRET || 'unimq-jwt-secret-very-secure';

class AuthController {
    // WEB: Halaman Login
    async renderLogin(req, res) {
        if (req.session.username) return res.redirect('/dashboard');
        res.render('login', { 
            page_title: 'Login - Unimon', 
            body_class: 'font-sans min-h-screen flex items-center justify-center p-6',
            error: req.query.pesan || null
        });
    }

    // WEB: Proses Login
    async handleLogin(req, res) {
        const { username, password } = req.body;
        try {
            const [rows] = await pool.query('SELECT user_id, user_name, password FROM user WHERE user_name = ? LIMIT 1', [username]);
            if (rows.length === 1) {
                const user = rows[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    req.session.user_id = user.user_id;
                    req.session.username = user.user_name;
                    return res.redirect('/dashboard');
                }
            }
            res.render('login', { 
                page_title: 'Login - Unimon', 
                body_class: 'font-sans min-h-screen flex items-center justify-center p-6',
                error: 'Username and password do not match' 
            });
        } catch (e) {
            console.error(e);
            res.render('login', { error: 'System error' });
        }
    }

    // API: Login JWT
    async apiLogin(req, res) {
        const { username, password } = req.body;
        try {
            const [rows] = await pool.query('SELECT user_id, user_name, password FROM user WHERE user_name = ? LIMIT 1', [username]);
            if (rows.length === 1) {
                const user = rows[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign(
                        { user_id: user.user_id, username: user.user_name },
                        JWT_SECRET,
                        { expiresIn: '30d' }
                    );
                    return res.json({ token, user: { id: user.user_id, username: user.user_name } });
                }
            }
            res.status(401).json({ error: 'Invalid credentials' });
        } catch (e) {
            res.status(500).json({ error: 'System error' });
        }
    }

    // Common: Logout
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}

module.exports = new AuthController();
