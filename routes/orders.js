const express = require('express');
const router = express.Router();
const db = require('../db'); // bu sizning db ulanish faylingiz
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Faqat admin buyurtma qo‘sha oladi
router.post('/', auth, role('admin'), async (req, res) => {
  const { product_id, quantity, address } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, product_id, quantity, address]
    );

    res.status(201).json({ message: 'Buyurtma qabul qilindi', order: result.rows[0] });
  } catch (err) {
    console.error('Buyurtma qo‘shishda xatolik:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

module.exports = router;
