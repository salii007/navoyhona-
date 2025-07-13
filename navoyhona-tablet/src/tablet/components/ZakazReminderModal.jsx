import React from 'react';

export default function ZakazReminderModal({ zakazlar, onClose }) {
  // Agar hech nima bo‘lmasa, umuman chiqarmaymiz
  if (!zakazlar || zakazlar.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-80">
        <h2 className="text-lg font-bold mb-2">⏰ 40 daqiqadan kam qolgan zakazlar</h2>
        <ul className="max-h-64 overflow-auto mb-4">
          {zakazlar.map(order => (
            <li key={order.id} className="border-b py-1">
              <strong>{order.name || order.client_name}</strong> — {order.time}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Yopish
        </button>
      </div>
    </div>
  );
}
