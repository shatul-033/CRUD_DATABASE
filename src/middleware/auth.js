const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });

    
    const [rows] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.status(401).json({ message: 'User not found' });
    req.user = { id: rows[0].id, username: rows[0].username, email: rows[0].email, role: rows[0].role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });
    next(err);
  }
};

module.exports = { protect };
