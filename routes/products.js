import express from 'express';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

/* =================== PRODUCTS =================== */

// Qo‘shish (faqat admin)
router.post('/', auth, role('admin'), async (req, res) => {
  const { name, unit_price, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO products (name, unit_price, description) 
       VALUES ($1, $2, $3) RETURNING id, name, unit_price, description`,
      [name, unit_price, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Product insert error:", err);
    res.status(500).json({ error: 'Mahsulotni qo‘shishda xatolik' });
  }
});

// Ro‘yxat 
router.get('/', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, unit_price, description 
       FROM products ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Product list error:", err);
    res.status(500).json({ error: 'Mahsulotlarni olishda xatolik' });
  }
});

// Yangilash
router.put('/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, unit_price, description } = req.body;

  try {
    const result = await db.query(
      `UPDATE products 
       SET name = $1, unit_price = $2, description = $3 
       WHERE id = $4 
       RETURNING id, name, unit_price, description`,
      [name, unit_price, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Product update error:", err);
    res.status(500).json({ error: "Serverda xatolik" });
  }
});

// O‘chirish
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json({ message: "Mahsulot o‘chirildi" });
  } catch (err) {
    console.error("❌ Product delete error:", err);
    res.status(500).json({ error: "Serverda xatolik" });
  }
});

export default router;
