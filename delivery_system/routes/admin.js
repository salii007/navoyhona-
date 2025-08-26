// routes/admin.js
import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

/** ---- Yordamchi funksiyalar: ustunlarni avtomatik aniqlash ---- */
async function pickColumn(table, candidates) {
  const { rows } = await pool.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_name = $1
        AND column_name = ANY($2::text[])`,
    [table, candidates]
  );
  const have = rows.map(r => r.column_name);
  return candidates.find(c => have.includes(c)) || null;
}

async function buildRevenueAndQtyExpr() {
  // order_items jadvalidan narx va miqdor ustunini topamiz
  const qtyCol = await pickColumn('order_items', ['qty', 'quantity', 'count']);
  const priceCol = await pickColumn('order_items', ['total', 'price', 'unit_price', 'selling_price']);

  // revenue va items_count ifodalarini tuzamiz
  let revenueExpr = '0::numeric';
  let itemsExpr = '0::int';

  if (priceCol === 'total') {
    revenueExpr = 'COALESCE(SUM(oi.total),0)::numeric';
  } else if (priceCol && qtyCol) {
    revenueExpr = `COALESCE(SUM(oi.${qtyCol} * oi.${priceCol}),0)::numeric`;
  }

  if (qtyCol) {
    itemsExpr = `COALESCE(SUM(oi.${qtyCol}),0)::int`;
  }

  return { revenueExpr, itemsExpr, qtyCol, priceCol };
}

async function getOrdersLocationColumn() {
  // orders jadvalidan lokatsiya ustunini topamiz
  return await pickColumn('orders', ['location_id', 'store_id']);
}

async function hasStatusColumn() {
  return Boolean(await pickColumn('orders', ['status']));
}

/* -------------------------
   📊 Statistika (overview)
   GET /api/admin/stats/overview?period=today|week|month&location_id=...
------------------------- */
router.get('/stats/overview', auth, role('admin'), async (req, res) => {
  try {
    const { period = 'today', location_id } = req.query;

    let dateCond = "(o.created_at AT TIME ZONE 'Asia/Tashkent')::date = (now() AT TIME ZONE 'Asia/Tashkent')::date";
    if (period === 'week') {
      dateCond = "(o.created_at AT TIME ZONE 'Asia/Tashkent')::date >= ((now() AT TIME ZONE 'Asia/Tashkent')::date - INTERVAL '7 days')";
    } else if (period === 'month') {
      dateCond = "(o.created_at AT TIME ZONE 'Asia/Tashkent')::date >= ((now() AT TIME ZONE 'Asia/Tashkent')::date - INTERVAL '1 month')";
    }

    const locCol = await getOrdersLocationColumn();     // location_id yoki store_id
    const hasStatus = await hasStatusColumn();          // status ustuni bormi
    const { revenueExpr, itemsExpr } = await buildRevenueAndQtyExpr();

    const filterLoc = locCol ? `AND ($1::int IS NULL OR o.${locCol} = $1)` : '';

    const deliveredExpr = hasStatus ? `COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'completed') AS delivered,` : '';
    const pendingExpr   = hasStatus ? `COUNT(DISTINCT o.id) FILTER (WHERE o.status <> 'completed') AS pending,` : '';

    const sql = `
      SELECT
        COUNT(DISTINCT o.id) AS total_orders,
        ${deliveredExpr}
        ${pendingExpr}
        ${itemsExpr} AS items_count,
        ${revenueExpr} AS revenue
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE ${dateCond}
      ${filterLoc}
    `;

    const params = [location_id === 'all' || location_id == null ? null : Number(location_id)];
    const { rows } = await pool.query(sql, params);
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Stats fetch error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* -----------------------------------------
   📦 Non zaxirasi (Navoyhona/filiallar bo‘yicha)
   GET /api/admin/stocks
----------------------------------------- */
router.get('/stocks', auth, role('admin'), async (req, res) => {
  try {
    const sql = `
      SELECT
        l.id AS location_id,
        l.name AS location_name,
        json_agg(
          CASE
            WHEN p.id IS NULL THEN NULL
            ELSE json_build_object('product_name', p.name, 'quantity', COALESCE(bs.quantity, 0))
          END
          ORDER BY p.name
        ) AS products
      FROM locations l
      LEFT JOIN bread_stock bs ON bs.location_id = l.id
      LEFT JOIN products p ON p.id = bs.product_id
      GROUP BY l.id, l.name
      ORDER BY l.name;
    `;
    const { rows } = await pool.query(sql);
    const out = rows.map(r => ({
      location_id: r.location_id,
      name: r.location_name,
      products: (r.products || []).filter(Boolean),
    }));
    res.json(out);
  } catch (err) {
    console.error('❌ /admin/stocks error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* -----------------------------------------
   🍞 Bugungi ishlab chiqarish (joylar bo‘yicha)
   GET /api/admin/production/today?date=YYYY-MM-DD
----------------------------------------- */
router.get('/production/today', auth, role('admin'), async (req, res) => {
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
    console.error('❌ GET /api/admin/production/today error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

/* -----------------------------------------
   📅 Rejalangan zakazlar (ixtiyoriy filter: status)
   GET /api/admin/scheduled-orders?status=pending|completed|...
----------------------------------------- */
router.get('/scheduled-orders', auth, role('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const sql = status
      ? `SELECT * FROM scheduled_orders WHERE status = $1 ORDER BY date, time ASC`
      : `SELECT * FROM scheduled_orders ORDER BY date, time ASC`;
    const { rows } = await pool.query(sql, status ? [status] : []);
    res.json(rows);
  } catch (err) {
    console.error('❌ Admin scheduled-orders error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

/* -----------------------------------------
   ❌ Rejalangan zakazni o‘chirish
----------------------------------------- */
router.delete('/scheduled-orders/:id', auth, role('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM scheduled_orders WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    res.json({ message: 'deleted', order: rows[0] });
  } catch (err) {
    console.error('❌ Admin delete error:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;
