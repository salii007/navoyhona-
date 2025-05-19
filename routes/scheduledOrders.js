const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');


// GET /scheduled-orders — location_id bo‘yicha zakazlar
router.get('/', authMiddleware, async (req, res) => {
  const locationId = req.user.location_id;

  try {
    const result = await pool.query(
      'SELECT * FROM scheduled_orders WHERE location_id = $1 ORDER BY delivery_date ASC',
      [locationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Scheduled orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🟢 1. Muddatli zakaz qo‘shish (planshetdan)
router.post('/', auth, async (req, res) => {
  const { name, phone, address, date, time, quantity, location_id } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO scheduled_orders 
      (name, phone, address, date, time, quantity, location_id, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
      RETURNING *`,
      [name, phone, address, date, time, quantity, location_id]
    );
    res.status(201).json({ message: 'Zakaz qabul qilindi', zakaz: result.rows[0] });
  } catch (err) {
    console.error('Zakaz qo‘shishda xatolik:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 🔍 2. Zakazlar ro‘yxati (Navoyhona planshetida ko‘rish uchun)
router.get('/location/:location_id', auth, async (req, res) => {
  const { location_id } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM scheduled_orders WHERE location_id = $1 ORDER BY date, time`,
      [location_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Zakazlarni olishda xatolik' });
  }
});

// ✅ 3. Zakazni “yetkazildi” deb belgilash (planshetdan)
router.patch('/:id/delivered', auth, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`UPDATE scheduled_orders SET status = 'delivered' WHERE id = $1`, [id]);
    res.json({ message: 'Zakaz delivered deb belgilandi. Admin tasdig‘i kutilmoqda.' });
  } catch (err) {
    res.status(500).json({ error: 'Statusni yangilashda xatolik' });
  }
});

// 🛑 4. Admin tomonidan tasdiqlash va o‘chirish
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const zakaz = await db.query('SELECT * FROM scheduled_orders WHERE id = $1', [id]);
    if (zakaz.rows.length === 0) {
      return res.status(404).json({ error: 'Zakaz topilmadi' });
    }

    if (zakaz.rows[0].status !== 'delivered') {
      return res.status(400).json({ error: 'Zakaz hali yetkazilmagan' });
    }

    await db.query('DELETE FROM scheduled_orders WHERE id = $1', [id]);
    res.json({ message: 'Zakaz admin tomonidan tasdiqlandi va o‘chirildi' });
  } catch (err) {
    res.status(500).json({ error: 'Admin o‘chirishda xatolik' });
  }
});

module.exports = router;
