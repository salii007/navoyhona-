import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🛰️ Dastavkachi joylashuvini yuboradi
// PATCH /couriers/position
router.patch('/position', auth, role('courier'), async (req, res) => {
  const userId = req.user.id;
  const { latitude, longitude } = req.body;

  try {
    await pool.query(
      `UPDATE users
       SET latitude = $1,
           longitude = $2,
           last_seen = NOW()
       WHERE id = $3`,
      [latitude, longitude, userId]
    );

    res.json({ message: 'Joylashuv yangilandi' });
  } catch (err) {
    console.error('🛰️ Lokatsiya xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🌍 Admin barcha dastavkachilarni joylashuvini ko‘radi
// GET /couriers/locations
router.get('/locations', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, latitude, longitude, last_seen
       FROM users
       WHERE role = 'courier'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('🌍 Joylashuvlar xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
