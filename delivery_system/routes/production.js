import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

/** GET /api/production/today?location_id=1 */
router.get('/today', auth, async (req, res) => {
  try {
    const qLoc = Number(req.query.location_id);
    const loc = Number.isFinite(qLoc) && qLoc > 0 ? qLoc : req.user?.location_id;
    if (!Number.isFinite(loc) || loc <= 0) {
      return res.status(400).json({ error: 'location_id talab qilinadi' });
    }

    const sumSql = `
      SELECT COALESCE(SUM(delta), 0) AS produced_today
      FROM baking_log
      WHERE location_id = $1
        AND (created_at AT TIME ZONE 'Asia/Tashkent')::date =
            (now() AT TIME ZONE 'Asia/Tashkent')::date
    `;
    const { rows } = await pool.query(sumSql, [loc]);
    return res.json({ produced_today: Number(rows[0]?.produced_today || 0) });
  } catch (e) {
    console.error('GET /production/today error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

/** POST /api/production/adjust  { location_id, delta, reason? } */
router.post('/adjust', auth, async (req, res) => {
  try {
    const bodyLoc = Number(req.body?.location_id);
    const loc = Number.isFinite(bodyLoc) && bodyLoc > 0 ? bodyLoc : req.user?.location_id;
    const d = Number(req.body?.delta);
    const reason = req.body?.reason || null;

    if (!Number.isFinite(loc) || loc <= 0) {
      return res.status(400).json({ error: 'location_id noto‘g‘ri' });
    }
    if (!Number.isFinite(d) || d === 0) {
      return res.status(400).json({ error: 'delta 0 bo‘lishi mumkin emas' });
    }
    const role = req.user?.role;
    if (role !== 'tablet' && role !== 'admin') {
      return res.status(403).json({ error: 'forbidden' });
    }

    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO baking_log (location_id, user_id, delta, reason, created_at)
       VALUES ($1, $2, $3, $4, now())`,
      [loc, req.user?.id ?? null, d, reason]
    );

    const sumSql = `
      SELECT COALESCE(SUM(delta), 0) AS produced_today
      FROM baking_log
      WHERE location_id = $1
        AND (created_at AT TIME ZONE 'Asia/Tashkent')::date =
            (now() AT TIME ZONE 'Asia/Tashkent')::date
    `;
    const { rows } = await pool.query(sumSql, [loc]);

    await pool.query('COMMIT');

    return res.json({ ok: true, new_total_today: Number(rows[0]?.produced_today || 0) });
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error('POST /production/adjust error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

export default router;
