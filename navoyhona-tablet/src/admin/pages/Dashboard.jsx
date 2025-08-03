import OrdersSection from '../components/OrdersSection';
import BreadStockSection from '../components/BreadStockSection';
import CallCenter from '../components/CallCenter';
import CourierMap from '../components/CourierMap';
import '../admin.scss';


export default function Dashboard() {
  return (
    
    <div className="admin-container">
      <div className="admin-grid">
        <div className="admin-card">
          <h2>📦 Barcha Zakazlar</h2>
          <OrdersSection />
        </div>

        <div className="admin-card">
          <h2>🥖 Non Zaxirasi</h2>
          <BreadStockSection />
        </div>

        <div className="admin-card h-[500px] overflow-hidden">
          <h2>📞 Aloqa Tizimi</h2>
          <CallCenter />
        </div>

        <div className="admin-card">
          <h2>🌍 Kuryer Lokatsiyasi</h2>
          <CourierMap />
        </div>
      </div>
    </div>
  );
}

