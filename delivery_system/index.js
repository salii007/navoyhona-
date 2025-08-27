// delivery_system/index.js

import 'dotenv/config';               // dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// 📦 Routers
import suggestRouter from './routes/suggest.js';
import scheduledOrderRoutes from './routes/scheduledOrders.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import statsRoutes from './routes/stats.js';
import adminReportRoutes from './routes/adminReports.js';
import returnsRoutes from './routes/returns.js';
import adminReturnsRoutes from './routes/adminReturns.js';
import courierLocationRoutes from './routes/courierLocation.js';
import courierOrderRoutes from './routes/courierOrders.js';
import yandexSuggestRouter from './routes/yandexSuggest.js';




const app = express();

// 🔌 Global middleware
app.use(cors());
app.use(bodyParser.json());

// 🔗 Route’larni ulash
app.use('/api/proxy-suggest', suggestRouter);
app.use('/api/scheduled-orders', scheduledOrderRoutes);
app.use('/products', productRoutes);
app.use('/admin', orderRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', statsRoutes);
app.use('/admin/reports', adminReportRoutes);
app.use('/returns', returnsRoutes);
app.use('/admin/returns', adminReturnsRoutes);
app.use('/couriers', courierLocationRoutes);
app.use('/courier/orders', courierOrderRoutes);
app.use('/yandex-suggest', yandexSuggestRouter);



// 🚀 Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
