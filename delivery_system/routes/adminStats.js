import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

/* GET /api/admin/production/today?date=YYYY-MM-DD */
router.get('/production/today', auth, async (req, res) => {
  try {
    const dateParam = req.query.date || null;
    const { rows } = await pool.query(
      `
      WITH d AS (
        SELECT COALESCE($1::date, (now() AT TIME ZONE 'Asia/Tashkent')::date) AS day
      )
      SELECT
        l.id   AS location_id,
        l.name AS location_name,
        COALESCE(SUM(bl.delta), 0) AS produced_today
      FROM locations l
      LEFT JOIN baking_log bl
        ON bl.location_id = l.id
       AND (bl.created_at AT TIME ZONE 'Asia/Tashkent')::date = (SELECT day FROM d)
      GROUP BY l.id, l.name
      ORDER BY l.name;
      `,
      [dateParam]
    );

    const items = rows.map(r => ({
      location_id: r.location_id,
      name: r.location_name,
      produced_today: Number(r.produced_today || 0),
    }));
    const grand_total = items.reduce((a, b) => a + b.produced_today, 0);

    res.json({ date: dateParam, items, grand_total });
  } catch (e) {
    console.error('GET /api/admin/production/today error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;
