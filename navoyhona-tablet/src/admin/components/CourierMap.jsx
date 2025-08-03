// src/admin/components/CourierMap.jsx
import { useEffect, useRef, useState } from 'react';
import axios from '../../axiosConfig';

export default function CourierMap() {
  const mapRef = useRef(null);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    const loadYandexScript = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById('yandex-maps-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://api-maps.yandex.ru/2.1/?apikey=3e3fee6b-a084-436a-8381-a752454ebace&lang=ru_RU';
          script.id = 'yandex-maps-script';
          script.type = 'text/javascript';
          script.onload = resolve;
          document.body.appendChild(script);
        } else {
          resolve();
        }
      });
    };

    const initMap = () => {
      if (window.ymaps && mapRef.current) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [39.6542, 66.9597], // Samarqand
            zoom: 12,
            controls: ['zoomControl'],
          });

          // 🔁 Markerlar qo‘yish
          couriers.forEach((courier, index) => {
            if (!courier.latitude || !courier.longitude) return;

            const placemark = new window.ymaps.Placemark(
              [courier.latitude, courier.longitude],
              {
                balloonContent: `<strong>${index + 1}. ${courier.name}</strong>`
              },
              {
                preset: 'islands#blueIcon'
              }
            );
            map.geoObjects.add(placemark);
          });
        });
      }
    };

    // 📦 Kuryer joylashuvlarini yuklash
    const fetchCouriers = async () => {
      try {
        const res = await axios.get('/couriers/locations');
        setCouriers(res.data);
      } catch (err) {
        console.error('❌ Kuryer joylashuvini olishda xatolik:', err);
      }
    };

    fetchCouriers();
    loadYandexScript().then(initMap);
  }, [couriers]);

  return (
    <div className="border rounded bg-gray-100">
      <div ref={mapRef} style={{ width: '100%', height: '350px' }} />
    </div>
  );
}
