// routes/adminReturns.js
import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🔄 Barcha qaytarilgan zakazlar (admin)
router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM scheduled_orders
      WHERE status = 'returned'
      ORDER BY delivered_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ GET /admin/returns error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});


export default router;
