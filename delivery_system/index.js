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
import adminStats from './routes/adminStats.js';
import adminSettings from './routes/adminSettings.js';
import productionRouter from './routes/production.js';
import adminStocksRouter from './routes/adminStocks.js';


const app = express();

// 🔌 Global middleware
app.use(cors());
app.use(bodyParser.json());

// 🔗 Route’larni ulash
app.use('/api/proxy-suggest', suggestRouter);
app.use('/api/scheduled-orders', scheduledOrderRoutes);
app.use('/products', productRoutes);
app.use('/api/admin', orderRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', statsRoutes);
app.use('/admin/reports', adminReportRoutes);
app.use('/returns', returnsRoutes);
app.use('/admin/returns', adminReturnsRoutes);
app.use('/couriers', courierLocationRoutes);
app.use('/courier/orders', courierOrderRoutes);
app.use('/yandex-suggest', yandexSuggestRouter);
app.use('/api/admin/stats', adminStats);
app.use('/api/admin', adminSettings);
app.use('/production', productionRouter); 
app.use('/api/admin', adminStocksRouter);

app.get('/api/health', (req,res)=>res.json({ok:true}));

// 🚀 Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
