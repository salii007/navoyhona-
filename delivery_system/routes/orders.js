// routes/orders.js

import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// ✅ Faqat admin uchun: Barcha zakazlar (scheduled_orders jadvalidan)
router.get('/orders', auth, role('admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, u.name AS courier_name
      FROM scheduled_orders o
      LEFT JOIN users u ON o.courier_id = u.id
      ORDER BY o.date DESC, o.time DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Zakazlarni olishda xatolik:', err);
    res.status(500).json({ error: 'Zakazlarni olishda xatolik yuz berdi' });
  }
});

export default router;
