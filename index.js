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

// 🔗 Marshrutlarni ulash
app.use('/products', productRoutes);    // CRUD: /products
app.use('/orders', orderRoutes);        // CRUD: /orders
app.use('/scheduled-orders', scheduledOrderRoutes);
app.use('/auth', authRoutes); // /login, /register, /protected, /admin/orders
app.get('/test', (req, res) => {
  console.log('✅ /test ishladi!');
  res.send('OK!');
});


// 🚀 Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
}); 
