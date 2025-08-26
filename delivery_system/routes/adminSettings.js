import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

/* ========== PRODUCTS ========== */
router.get('/products', auth, role('admin'), async (_req, res) => {
  const { rows } = await pool.query(`SELECT id, name, unit_price FROM products ORDER BY id DESC`);
  res.json(rows);
});

router.post('/products', auth, role('admin'), async (req, res) => {
  const { name, unit_price } = req.body;
  if (!name || unit_price == null) return res.status(400).json({ error: 'name, unit_price kerak' });
  const q = `INSERT INTO products(name, unit_price) VALUES ($1,$2) RETURNING id, name, unit_price`;
  const { rows } = await pool.query(q, [name, Number(unit_price)]);
  res.status(201).json(rows[0]);
});

router.delete('/products/:id', auth, role('admin'), async (req, res) => {
  await pool.query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

/* ========== LOCATIONS ========== */
router.get('/locations', auth, role('admin'), async (_req, res) => {
  const { rows } = await pool.query(`SELECT id, name, address FROM locations ORDER BY id DESC`);
  res.json(rows);
});

router.post('/locations', auth, role('admin'), async (req, res) => {
  const { name, address } = req.body;
  if (!name) return res.status(400).json({ error: 'name kerak' });
  const q = `INSERT INTO locations(name, address) VALUES ($1,$2) RETURNING id, name, address`;
  const { rows } = await pool.query(q, [name, address || null]);
  res.status(201).json(rows[0]);
});

router.delete('/locations/:id', auth, role('admin'), async (req, res) => {
  await pool.query(`DELETE FROM locations WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

/* ========== USERS ========== */
router.get('/users', auth, role('admin'), async (req, res) => {
  const r = req.query.role;
  if (r) {
    const { rows } = await pool.query(
      `SELECT id, name, phone, role, location_id FROM users WHERE role = $1 ORDER BY id DESC`,
      [r]
    );
    return res.json(rows);
  }
  const { rows } = await pool.query(
    `SELECT id, name, phone, role, location_id FROM users ORDER BY id DESC`
  );
  res.json(rows);
});

router.post('/users', auth, role('admin'), async (req, res) => {
  const { name, phone, password, role: r, location_id } = req.body;
  if (!name || !phone || !password || !r) {
    return res.status(400).json({ error: 'name, phone, password, role kerak' });
  }
  const hash = await bcrypt.hash(password, 10);
  const q = `
    INSERT INTO users(name, phone, password, role, location_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id, name, phone, role, location_id
  `;
  const params = [name, phone, hash, r, location_id || null];
  const { rows } = await pool.query(q, params);
  res.status(201).json(rows[0]);
});

router.delete('/users/:id', auth, role('admin'), async (req, res) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

export default router;
