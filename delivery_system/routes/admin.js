// routes/admin.js

import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🔍 Barcha zakazlar yoki status bo‘yicha filtrlangan zakazlar
// GET /admin/scheduled-orders?status=pending|delivered
router.get('/scheduled-orders', auth, role('admin'), async (req, res) => {
  const { status } = req.query;

  try {
    let result;
    if (status) {
      result = await pool.query(
        `SELECT * 
         FROM scheduled_orders 
         WHERE status = $1 
         ORDER BY date, time ASC`,
        [status]
      );
    } else {
      result = await pool.query(
        `SELECT * 
         FROM scheduled_orders 
         ORDER BY date, time ASC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Admin scheduled-orders error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 📦 Non zaxirasi ro'yxati (har bir Navoyhona bo‘yicha)
router.get('/stocks', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.id AS location_id, l.name, json_agg(
        json_build_object('product_name', p.name, 'quantity', s.quantity)
      ) AS products
      FROM bread_stock s
      JOIN locations l ON s.location_id = l.id
      JOIN products p ON s.product_id = p.id
      GROUP BY l.id, l.name
      ORDER BY l.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ /admin/stocks error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ❌ Admin delivered bo‘lgan zakazni o‘chiradi
// DELETE /admin/scheduled-orders/:id
router.delete('/scheduled-orders/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM scheduled_orders 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Zakaz topilmadi' });
    }

    res.json({ message: 'Zakaz o‘chirildi', order: result.rows[0] });
  } catch (err) {
    console.error('❌ Admin delete error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

export default router;
