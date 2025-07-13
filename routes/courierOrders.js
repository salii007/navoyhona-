import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
const router = express.Router();

// 🟢 Zakazni qabul qilish
router.patch('/:id/accept', auth, role('courier'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      UPDATE scheduled_orders
      SET status = 'accepted'
      WHERE id = $1 AND status = 'pending'
      RETURNING *;
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Zakaz topilmadi yoki allaqachon qabul qilingan' });
    }

    res.json({ message: 'Zakaz qabul qilindi', order: result.rows[0] });
  } catch (err) {
    console.error('Zakazni qabul qilish xatosi:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 🟢 Nonni olish
router.patch('/:id/pickup', auth, role('courier'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      UPDATE scheduled_orders
      SET status = 'picked_up'
      WHERE id = $1 AND status = 'accepted'
      RETURNING *;
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Zakaz topilmadi yoki hali qabul qilinmagan' });
    }

    res.json({ message: 'Non olindi', order: result.rows[0] });
  } catch (err) {
    console.error('Non olish xatosi:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 🟢 Yetkazdim
router.patch('/:id/deliver', auth, role('courier'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      UPDATE scheduled_orders
      SET status = 'delivered', delivered_at = NOW()
      WHERE id = $1 AND status = 'picked_up'
      RETURNING *;
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Zakaz topilmadi yoki hali non olinmagan' });
    }

    res.json({ message: 'Zakaz yetkazildi', order: result.rows[0] });
  } catch (err) {
    console.error('Yetkazish xatosi:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 🟢 Naqd / Nasiya belgilash
router.patch('/:id/payment', auth, role('courier'), async (req, res) => {
  const { id } = req.params;
  const { payment_type } = req.body;

  if (!['cash', 'credit'].includes(payment_type)) {
    return res.status(400).json({ error: 'To‘lov turi noto‘g‘ri' });
  }

  try {
    const result = await db.query(`
      UPDATE scheduled_orders
      SET payment_type = $1, status = 'completed'
      WHERE id = $2 AND status = 'delivered'
      RETURNING *;
    `, [payment_type, id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Zakaz topilmadi yoki hali yetkazilmagan' });
    }

    res.json({ message: 'To‘lov turi belgilandi', order: result.rows[0] });
  } catch (err) {
    console.error('To‘lov xatosi:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

export default router;
