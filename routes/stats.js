import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🛒 Har bir Navoyhona qancha non sotgan
router.get('/local-sales', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.name AS location, SUM(s.quantity) AS total_sold
       FROM scheduled_orders s
       JOIN locations l ON s.location_id = l.id
       WHERE s.status = 'delivered'
       GROUP BY l.name
       ORDER BY total_sold DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ GET /local-sales error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 🧾 Kim qancha non olgan — haydovchi bo‘yicha
router.get('/delivery-logs', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.name AS driver, SUM(b.quantity) AS total_bread
       FROM baking_log b
       JOIN users u ON b.driver_id = u.id
       GROUP BY u.name
       ORDER BY total_bread DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ GET /delivery-logs error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

export default router;
