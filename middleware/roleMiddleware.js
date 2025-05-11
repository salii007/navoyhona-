function roleMiddleware(requiredRole) {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Ruxsat berilmagan' });
      }
      next();
    };
  }
  
  module.exports = roleMiddleware;
  