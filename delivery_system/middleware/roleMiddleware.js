// middleware/roleMiddleware.js

export default function role(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Ruxsat yo‘q' });
    }
    next();
  };
}
