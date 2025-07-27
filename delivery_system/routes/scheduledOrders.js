// routes/scheduledOrders.js

import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 1️⃣ Bugungi zakazlar (Toshkent vaqti bo‘yicha)
router.get('/today', auth, async (req, res) => {
  const locationId = req.user.location_id;
  const query = `
    SELECT *
    FROM scheduled_orders
    WHERE location_id = $1
      AND date = (now() AT TIME ZONE 'Asia/Tashkent')::date
    ORDER BY time ASC
  `;
  try {
    const { rows } = await pool.query(query, [locationId]);
    res.json(rows);
  } catch (err) {
    console.error('❌ GET /scheduled-orders/today error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 2️⃣ Kelajak zakazlar (Toshkent vaqti bo‘yicha)
router.get('/future', auth, async (req, res) => {
  const locationId = req.user.location_id;
  const query = `
    SELECT *
    FROM scheduled_orders
    WHERE location_id = $1
      AND date > (now() AT TIME ZONE 'Asia/Tashkent')::date
    ORDER BY date ASC, time ASC
  `;
  try {
    const { rows } = await pool.query(query, [locationId]);
    res.json(rows);
  } catch (err) {
    console.error('❌ GET /scheduled-orders/future error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 3️⃣ Yangi zakaz qo‘shish
router.post('/', auth, async (req, res) => {
  const locationId = req.user.location_id;
  const {
    name,
    phone,
    address,
    date,
    time,
    quantity,
    product_name,
    unit_price,  
    zalog_amount,
    zalog_type
  } = req.body;

  const price = unit_price;

  const query = `
    INSERT INTO scheduled_orders
      (name, phone, address, date, time,
       quantity, location_id, status,
       product_name, price,
       zalog_amount, zalog_type)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10,$11)
    RETURNING *
  `;
  const params = [
    name,
    phone,
    address,
    date,
    time,
    quantity,
    locationId,
    product_name,
    price,
    zalog_amount,
    zalog_type
  ];

  try {
    const { rows } = await pool.query(query, params);
    res.status(201).json({ message: 'Zakaz qo‘shildi', order: rows[0] });
  } catch (err) {
    console.error('❌ POST /scheduled-orders error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});


// 4️⃣ Yetkazilgan deb belgilash
router.patch('/:id/delivered', auth, async (req, res) => {
  const { id } = req.params;
  const locationId = req.user.location_id;

  const query = `
    UPDATE scheduled_orders
    SET status = 'delivered', delivered_at = NOW()
    WHERE id = $1 AND location_id = $2
    RETURNING *
  `;
  try {
    const { rows } = await pool.query(query, [id, locationId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Zakaz topilmadi yoki sizga tegishli emas' });
    }
    res.json({ message: 'Zakaz delivered deb belgilandi', order: rows[0] });
  } catch (err) {
    console.error('❌ PATCH /scheduled-orders/:id/delivered error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// 5️⃣ Zakazni o‘chirish (faqat admin uchun, delivered bo‘lganlarini)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT status FROM scheduled_orders WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Zakaz topilmadi' });
    }
    if (rows[0].status !== 'delivered') {
      return res
        .status(400)
        .json({ error: 'Zakaz hali yetkazilmagan, o‘chirib bo‘lmaydi' });
    }
    await pool.query(`DELETE FROM scheduled_orders WHERE id = $1`, [id]);
    res.json({ message: 'Zakaz admin tomonidan o‘chirildi' });
  } catch (err) {
    console.error('❌ DELETE /scheduled-orders/:id error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

export default router;
