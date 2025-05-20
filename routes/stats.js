const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🛒 Har bir Navoyhona qancha non sotgan
router.get('/local-sales', auth, role('admin'), async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT l.name AS location, SUM(s.quantity) AS total_sold
        FROM scheduled_orders s
        JOIN locations l ON s.location_id = l.id
        WHERE s.status = 'delivered'
        GROUP BY l.name
        ORDER BY total_sold DESC
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error('❌ local-sales error:', err);
      res.status(500).json({ error: 'Server xatoligi' });
    }
  });
  

// 🧾 Kim qancha non olgan — haydovchi bo‘yicha
router.get('/delivery-logs', auth, role('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name AS driver, SUM(b.quantity) AS total_bread
      FROM baking_log b
      JOIN users u ON b.driver_id = u.id
      GROUP BY u.name
      ORDER BY total_bread DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ delivery-logs error:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

module.exports = router;
