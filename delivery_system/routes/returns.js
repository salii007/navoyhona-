import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();
router.patch('/:id/accept', auth, async (req, res) => {
  const id = req.params.id;
  const location_id = req.user.location_id;

  try {
    console.log('🔧 Qabul qilish: ID =', id, 'Location =', location_id); // <= bu yerga
    const result = await db.query(`
      UPDATE returns
      SET is_received = true,
          received_by_location_id = $1,
          received_at = now()
      WHERE id = $2 AND is_received = false
      RETURNING *;
    `, [location_id, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Bu vazvrat allaqachon qabul qilingan' });
    }

    res.json({ message: 'Qabul qilindi', return: result.rows[0] });
  } catch (err) {
    console.error('❌ Qabul qilish xatosi (backend):', err); // <= aynan bu kerak
    res.status(500).json({ error: 'Server error' });
  }
});



// 🔁 1. QAYTARILGAN NONNI YARATISH
router.post('/', auth, async (req, res) => {
  const { client_phone, product_name, quantity, reason } = req.body;
  const courier_name = req.user.name;
  const location_id = req.user.location_id;

  if (!client_phone || !product_name || !quantity || !reason) {
    return res.status(400).json({ error: 'Barcha maydonlar to‘ldirilishi kerak' });
  }

  try {
    const result = await db.query(`
      INSERT INTO returns (client_phone, product_name, quantity, reason, courier_name, location_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [client_phone, product_name, quantity, reason, courier_name, location_id]);

    res.json({ message: 'Qaytarilgan non yozildi', return: result.rows[0] });
  } catch (err) {
    console.error('Vazvrat xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📋 2. RO‘YXATINI KO‘RISH
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM returns
      WHERE is_received = false
      ORDER BY returned_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Vazvratlar ro‘yxati xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. QABUL QILISH
router.patch('/:id/accept', auth, async (req, res) => {
  const id = req.params.id;
  const location_id = req.user.location_id;

  try {
    const result = await db.query(`
      UPDATE returns
      SET is_received = true,
          received_by_location_id = $1,
          received_at = now()
      WHERE id = $2 AND is_received = false
      RETURNING *;
    `, [location_id, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Bu vazvrat allaqachon qabul qilingan' });
    }

    res.json({ message: 'Qabul qilindi', return: result.rows[0] });
  } catch (err) {
    console.error('Qabul qilish xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
