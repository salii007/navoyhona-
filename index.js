require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const scheduledOrderRoutes = require('./routes/scheduledOrders');



const app = express();
app.use(bodyParser.json());

// 🔌 Middleware
const auth = require('./middleware/authMiddleware');
const role = require('./middleware/roleMiddleware');

// 📦 Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
const adminReportRoutes = require('./routes/adminReports');

// 🔗 Marshrutlarni ulash
app.use('/products', productRoutes);    // CRUD: /products
app.use('/orders', orderRoutes);        // CRUD: /orders
app.use('/scheduled-orders', scheduledOrderRoutes);
app.use('/auth', authRoutes); // /login, /register, /protected, /admin/orders
app.use('/admin', adminRoutes);
app.use('/', statsRoutes);
app.use('/admin/reports', adminReportRoutes);


// 🚀 Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
}); 
