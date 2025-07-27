function ZakazCard({ order, onAction }) {
  const {
    id,
    name,
    phone,
    address,
    date,
    time,
    quantity,
    status,
    product_name,
    unit_price,
    payment_type,
    lat,
    lng
  } = order;

  const totalSum = unit_price && quantity ? unit_price * quantity : null;

  // 🧭 Yandex Navigatorga ochish
  const openInNavigator = () => {
    if (lat && lng) {
      const url = `https://yandex.uz/maps/?rtext=~${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      alert("Geolokatsiya mavjud emas!");
    }
  };

  const renderButton = () => {
    if (status === 'pending') {
      return (
        <button
          onClick={() => onAction(id, 'accept')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Zakazni oldim
        </button>
      );
    }
    if (status === 'accepted') {
      return (
        <button
          onClick={() => onAction(id, 'pickup')}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Nonni oldim
        </button>
      );
    }
    if (status === 'picked_up') {
      return (
        <button
          onClick={() => onAction(id, 'deliver')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Yetkazdim
        </button>
      );
    }
    if (status === 'delivered' && !payment_type) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(id, 'payment', 'cash')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Naqd
          </button>
          <button
            onClick={() => onAction(id, 'payment', 'credit')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Nasiya
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2 border border-gray-200">
      <div className="font-semibold text-lg">{name} 📞 {phone}</div>
      <div className="text-sm text-gray-600">📍 {address}</div>
      <div className="text-sm text-gray-500">📅 {date} ⏰ {time}</div>
      <div>🍞 {product_name || 'non'} — {quantity} ta</div>

      {unit_price && (
        <div>
          💸 Narxi: {unit_price.toLocaleString()} × {quantity} = <strong>{totalSum.toLocaleString()} so‘m</strong>
        </div>
      )}

      <div className="text-blue-600 font-medium">Holat: {status}</div>

      {/* 🧭 Navigator tugmasi */}
      {lat && lng && (
        <button
          onClick={openInNavigator}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          🧭 Navigator orqali borish
        </button>
      )}

      <div className="mt-3">
        {renderButton()}
      </div>
    </div>
  );
}

export default ZakazCard;
