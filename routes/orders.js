import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
const router = express.Router();

// ✅ 1. Buyurtma qo‘shish — faqat admin ruxsatiga ega foydalanuvchi qo‘sha oladi
router.post('/', auth, role('admin'), async (req, res) => {
  const { product_id, quantity, address } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, product_id, quantity, address]
    );
    res.status(201).json({ message: '📦 Buyurtma qabul qilindi', order: result.rows[0] });
  } catch (err) {
    console.error('❌ Buyurtma qo‘shishda xatolik:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ✅ 2. Barcha buyurtmalarni olish — faqat admin ko‘rishi mumkin
router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Buyurtmalarni olishda xatolik' });
  }
});

// ✅ 3. Foydalanuvchi o‘zining buyurtmalarini ko‘rishi
router.get('/mine', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Buyurtmalarni olishda xatolik' });
  }
});

// ✅ 4. Buyurtmani o‘chirish — faqat adminlar o‘chira oladi
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM orders WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Buyurtma topilmadi" });
    }

    res.json({ message: "🗑️ Buyurtma o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: "Server xatoligi" });
  }
});


export default router;
