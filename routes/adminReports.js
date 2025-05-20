const express = require('express');
const router = express.Router();
const db = require('../db'); // sening db ulovchi fayling

// Middleware: faqat adminlar kira oladi
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/top-customers', auth, role('admin'), async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = date || new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const result = await db.query(`
      SELECT 
        name AS client_name,
        phone AS client_phone,
        SUM(quantity) AS total_quantity,
        SUM(quantity * unit_price) AS total_sum
      FROM scheduled_orders
      WHERE DATE(delivered_at) = $1
      GROUP BY name, phone
      ORDER BY total_quantity DESC
      LIMIT 10
    `, [selectedDate]);

    res.json(result.rows);
  } catch (err) {
    console.error('Top customers error:', err);  // 🔍 Log chiqaramiz
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 Mijoz bo‘yicha barcha zakazlar
router.get('/client', auth, role('admin'), async (req, res) => {
    try {
      const { phone } = req.query;
  
      if (!phone) {
        return res.status(400).json({ error: "Telefon raqam yuborilmagan" });
      }
  
      const result = await db.query(`
        SELECT 
          id,
          name AS client_name,
          phone AS client_phone,
          date,
          time,
          quantity,
          unit_price,
          (quantity * unit_price) AS total_sum,
          status,
          delivered_at
        FROM scheduled_orders
        WHERE phone = $1
        ORDER BY delivered_at DESC
      `, [phone]);
  
      res.json(result.rows);
    } catch (err) {
      console.error('Client zakazlari xatosi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // 📋 Nasiyachilar ro‘yxati
router.get('/credit-customers', auth, role('admin'), async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          name AS client_name,
          phone AS client_phone,
          COUNT(*) AS total_credit_orders,
          SUM(quantity) AS total_quantity,
          SUM(quantity * unit_price) AS total_sum
        FROM scheduled_orders
        WHERE status = 'delivered' AND payment_type = 'credit'
        GROUP BY name, phone
        ORDER BY total_sum DESC
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error('Nasiyachilar xatosi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // 📊 Mahsulotlar bo‘yicha umumiy hisobot
router.get('/products', auth, role('admin'), async (req, res) => {
    try {
      const { date } = req.query;
      const selectedDate = date || new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  
      const result = await db.query(`
        SELECT 
          product_name,
          SUM(quantity) AS total_quantity,
          SUM(quantity * unit_price) AS total_sum,
          ROUND(SUM(quantity * unit_price)::NUMERIC / NULLIF(SUM(quantity), 0), 2) AS avg_price
        FROM scheduled_orders
        WHERE DATE(delivered_at) = $1
        GROUP BY product_name
        ORDER BY total_quantity DESC
      `, [selectedDate]);
  
      res.json(result.rows);
    } catch (err) {
      console.error('Mahsulotlar statistikasi xatosi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // 📦 Dastavkachilar bo‘yicha statistikalar
router.get('/couriers', auth, role('admin'), async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          u.name AS courier_name,
          COUNT(s.id) AS total_orders,
          COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) AS delivered_orders,
          COUNT(CASE WHEN s.payment_type = 'cash' THEN 1 END) AS cash_orders,
          COUNT(CASE WHEN s.payment_type = 'credit' THEN 1 END) AS credit_orders
        FROM scheduled_orders s
        JOIN users u ON s.courier_id = u.id
        GROUP BY u.name
        ORDER BY total_orders DESC
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error('Dastavkachilar statistikasi xatosi:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  

module.exports = router;
