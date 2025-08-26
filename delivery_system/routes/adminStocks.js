import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';
// import role from '../middleware/roleMiddleware.js'; // bo'lsa qo'llang

const router = express.Router();

/**
 * MUHIM: bu yerda faqat '/stocks' bo'lsin.
 * App darajasida '/api/admin' bilan ulanadi.
 * Yakuniy URL: /api/admin/stocks
 */
router.get('/stocks', auth, /*role('admin'),*/ async (req, res) => {
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
  } catch (e) {
    console.error('GET /api/admin/stocks error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;
