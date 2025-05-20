const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
  const { client_phone, product_name, quantity, reason } = req.body;

  if (!client_phone || !product_name || !quantity || !reason) {
    return res.status(400).json({ error: 'Barcha maydonlar to‘ldirilishi kerak' });
  }

  try {
    const result = await db.query(`
      INSERT INTO returns (client_phone, product_name, quantity, reason)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [client_phone, product_name, quantity, reason]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Vazvrat xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
}); 

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

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Vazvrat xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// 📍 QAYTARILGAN NONLARNI KO‘RISH (barcha planshetlar)
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM returns
      WHERE is_received = false
      ORDER BY returned_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Vazvratlar ro‘yxati xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ QAYTARILGAN NONNI QABUL QILISH
router.patch('/:id/accept', auth, async (req, res) => {
  const id = req.params.id;
  const location_id = req.user.location_id;

  try {
    const result = await db.query(`
      UPDATE returns
      SET is_received = true,
          received_by_location_id = $1
      WHERE id = $2 AND is_received = false
      RETURNING *;
    `, [location_id, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Bu vazvrat allaqachon qabul qilingan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Qabul qilish xatosi:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
