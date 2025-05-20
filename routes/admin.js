const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔍 Barcha zakazlar yoki status bo‘yicha
router.get('/scheduled-orders', auth, role('admin'), async (req, res) => {
  const status = req.query.status;

  try {
    const query = status
      ? 'SELECT * FROM scheduled_orders WHERE status = $1 ORDER BY date, time ASC'
      : 'SELECT * FROM scheduled_orders ORDER BY date, time ASC';

    const result = status
      ? await pool.query(query, [status])
      : await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Admin scheduled-orders error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ❌ Admin zakazni o‘chiradi
router.delete('/scheduled-orders/:id', auth, role('admin'), async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM scheduled_orders WHERE id = $1 RETURNING *',
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

module.exports = router;
