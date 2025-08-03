import styles from '../styles/ZakazModal.module.css'

export default function ZakazModal({ order, onClose }) {
    const formattedDate = new Date(order.date).toISOString().split('T')[0];
    const formattedTime = order.time?.slice(0, 5) || '--:--';
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button onClick={onClose} className={styles.closeButton}>❌</button>
  
          <h2 className="text-lg font-bold mb-2">
            {order.name} ({order.phone})
          </h2>
  
          <div className={styles.detailList}>
            <p>📍 Navoyhona: {order.location_name}</p>
            <p>📦 Mahsulot: {order.product_name} × {order.quantity}</p>
            <p>📅 Sana: {formattedDate} ⏰ {formattedTime}</p>
            <p>🏠 Manzil: {order.address || '—'}</p>
            <p>💰 Narx: {order.price} so‘m</p>
            <p>💵 Zalog: {order.zalog_amount > 0 ? `${order.zalog_amount} so‘m` : 'Yo‘q'}</p>
            <p>📦 Holat: <strong>{order.status}</strong></p>
            <p>🚚 Kuryer: {order.courier_id || '❌ biriktirilmagan'}</p>
          </div>
        </div>
      </div>
    );
  }