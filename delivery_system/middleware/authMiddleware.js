// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'no_token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // { id, role, location_id } kelsin!
    req.user = {
      id: payload.id,
      role: payload.role,
      location_id: payload.location_id,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}
