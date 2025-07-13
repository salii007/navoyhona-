import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
const router = express.Router();
// Qo‘shish (faqat admin)
router.post('/', auth, role('admin'), async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Mahsulotni qo‘shishda xatolik' });
  }
});

// Ro‘yxat
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Mahsulotlarni olishda xatolik' });
  }
});

// Yangilash
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const result = await db.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, price, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Serverda xatolik" });
  }
});

// O‘chirish
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json({ message: "Mahsulot o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: "Serverda xatolik" });
  }
});

export default router;