// // src/courier/pages/CourierDelivery.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function CourierDelivery() {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('courierToken');

//     if (!token) {
//       setError('Token yo‘q. Iltimos, qaytadan kiring.');
//       return;
//     }

//     axios
//       .get('http://localhost:3000/api/scheduled-orders/today', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setOrders(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError('Zakazlarni olishda xatolik.');
//       });
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">📦 Bugungi zakazlar</h1>

//       {error && <p className="text-red-500">{error}</p>}

//       {orders.length === 0 ? (
//         <p>Bugun zakazlar yo‘q</p>
//       ) : (
//         <ul className="space-y-4">
//           {orders.map((o) => (
//             <li key={o.id} className="border p-4 rounded shadow">
//               <p><b>Ism:</b> {o.name}</p>
//               <p><b>Manzil:</b> {o.address}</p>
//               <p><b>Soni:</b> {o.quantity}</p>
//               <p><b>Vaqti:</b> {o.time}</p>
//               <p><b>Status:</b> {o.status}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default CourierDelivery;
