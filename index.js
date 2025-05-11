require('dotenv').config();   
const express = require('express');    
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const orderRoutes = require('./routes/orders');
const auth = require('./middleware/authMiddleware');       
const role = require('./middleware/roleMiddleware');       

const app = express();
app.use(bodyParser.json());

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'delivery',
  password: 'mnbvcxz123',
  port: 5432,
});

// PUT /products/:id - mahsulotni yangilash
app.put('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, price, descriptionew Pooln, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverda xatolik" });
  }
});

// Faqat admin buyurtma qo‘sha oladi
app.use('/orders', orderRoutes);


app.delete('/products/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }

    res.json({ message: "Mahsulot o‘chirildi" });
  } catch (err) {
    console.error("DELETE xatolik:", err);
    res.status(500).json({ error: "Serverda xatolik" });
  }
});



app.post('/products', auth, role('admin'), async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mahsulotni qo‘shishda xatolik' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mahsulotlarni olishda xatolik' });
  }
});


// ✅ Register (yangi foydalanuvchi)
app.post('/register', async (req, res) => {
  const { name, phone, password, role } = req.body;

  try {
    const exists = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Bu telefon raqam ro‘yxatda bor' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Parolni yashirish
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

// ✅ Login (token olish)
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
  const user = result.rows[0];

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Login muvaffaqiyatsiz' });
  }
});

// 🔐 Token bilan tekshiradigan route
app.get('/protected', auth, (req, res) => {
  res.json({ message: 'Token to‘g‘ri, xush kelibsiz!' });
});

// 🔐 Faqat adminlar uchun
app.get('/admin/orders', auth, role('admin'), async (req, res) => {
  const result = await db.query('SELECT * FROM orders');
  res.json(result.rows);
});

// 🟢 Barcha buyurtmalar
app.get('/orders', async (req, res) => {
  const result = await db.query('SELECT * FROM orders');
  res.json(result.rows);
});

app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Mahsulotlarni olishda xatolik' });
  }
});


// 🚀 Serverni ishga tushirish
app.listen(3000, () => console.log('Server running on port 3000'));
