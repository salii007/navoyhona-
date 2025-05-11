const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token yo‘q' });
  }

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token noto‘g‘ri' });
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
