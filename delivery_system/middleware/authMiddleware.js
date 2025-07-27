// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';



export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log('🔐 Kiruvchi header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token topilmadi' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT xatosi:', err);
    return res.status(403).json({ error: 'Token noto‘g‘ri' });
  }
}
