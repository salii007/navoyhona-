 import express from 'express';
 import bcrypt from 'bcrypt';
 import jwt from 'jsonwebtoken';
 import db from '../db.js';
 import auth from '../middleware/authMiddleware.js';
 import role from '../middleware/roleMiddleware.js';
 const router = express.Router();

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  console.log('📲 Login so‘rovi keldi:', phone); // ✅ 1

  try {
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    console.log('📦 User bazadan topildi:', result.rows); // ✅ 2

    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      console.log('🔑 Parol to‘g‘ri, token yaratilmoqda...'); // ✅ 3

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          location_id: user.location_id // 👈 mavjudligiga ishonch hosil qilamiz
        },
        process.env.JWT_SECRET || 'secretkey'
      );

      console.log('✅ Token:', token); // ✅ 4
      res.json({ token });
    } else {
      console.log('❌ Login muvaffaqiyatsiz'); // ✅ 5
      res.status(401).json({ error: 'Login muvaffaqiyatsiz' });
    }
  } catch (err) {
    console.error('💥 Xatolik:', err); // ✅ 6
    res.status(500).json({ error: 'Serverda xatolik' });
  }
});


// ✅ 1. Ro‘yxatdan o‘tish
router.post('/register', async (req, res) => {
  const { name, phone, password, role } = req.body;

  try {
    const exists = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Bu telefon raqam ro‘yxatda bor' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, phone, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, hashedPassword, role]
    );

    res.status(201).json({ message: 'Ro‘yxatdan o‘tildi', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// ✅ 2. Login qilish va token berish — 🔧 location_id qo‘shildi
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      // 🔥 Endi token location_id ni ham o‘z ichiga oladi
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          location_id: user.location_id  // 👈 MUHIM QATOR
        },
        process.env.JWT_SECRET || 'secretkey'
      );

      res.json({ token, role: user.role });
    } else {
      res.status(401).json({ error: 'Login muvaffaqiyatsiz' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Serverda xatolik' });
  }
});

// 🔐 3. Token orqali himoyalangan route (test uchun)
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'Xush kelibsiz, siz token orqali kirdingiz!' });
});

// 👑 4. Faqat adminlar uchun buyurtmalar
router.get('/admin/orders', auth, role('admin'), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Buyurtmalarni olishda xatolik' });
  }
});



export default router;
