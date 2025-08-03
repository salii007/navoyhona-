// routes/auth.js

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  console.log('📲 Login so‘rovi keldi:', phone);

  try {
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          location_id: user.location_id
        },
        process.env.JWT_SECRET || 'secretkey'
      );

      console.log('✅ Token:', token);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Telefon yoki parol noto‘g‘ri' });
    }
  } catch (err) {
    console.error('💥 Xatolik:', err);
    res.status(500).json({ error: 'Serverda xatolik' });
  }
});

// ✅ RO‘YXATDAN O‘TISH
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

// 🔐 TEST — TOKENDAN KEYIN KIRISH
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'Xush kelibsiz, siz token orqali kirdingiz!' });
});

export default router;
